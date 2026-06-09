/* === CINE_PICAS.JS - CINEMÁTICA DEL RELEVO DE PICAS === */

function playCinematicaRelevoPicas(callbackFinal) {
    const animCaja = DirectorCinematico.prepararEscenario("EL RELEVO TÁCTICO", "assets/img/fondos/puente_fondo.webp");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.backgroundSize = "cover";
    animCaja.style.backgroundPosition = "center bottom";

    // INYECCIÓN DE CONTENCIÓN (ZONA BATALLA)
    let zonaBatalla = document.createElement("div");
    zonaBatalla.id = "zona-batalla-anim";
    zonaBatalla.style.cssText = "position:absolute; top:50%; left:0; width:100%; height:400px; transform:translateY(-50%); z-index:150; overflow:hidden;";
    animCaja.appendChild(zonaBatalla);

    DirectorCinematico.renderizarMarcadores(zonaBatalla);

    // =========================================================================
    // 1. CABALLEROS (Salida General en Carrusel Perfecto)
    // =========================================================================
    let caballerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0); 
    let c_arriba = 0; let c_abajo = 0;  
    let delayBaseCaballero = 100; 

    caballerosVivos.forEach((cab, index) => {
        let card = DirectorCinematico.crearTarjetaTropa(cab);
        card.style.zIndex = "150"; 
        
        let isTop = index % 2 === 0; 
        let topPos = isTop ? 10 : 75; 
        
        let posicionTurno = isTop ? c_arriba++ : c_abajo++;
        let delayAnimacion = posicionTurno * 700; 

        card.style.top = `${topPos}%`;
        card.style.left = `120%`; 
        card.style.opacity = "1";
        card.style.transition = `left 7.5s linear`; 
        
        zonaBatalla.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `-40%`; 
        }, delayBaseCaballero + delayAnimacion);
    });

    let maxCaballerosEnFila = Math.max(c_arriba, c_abajo);
    if (maxCaballerosEnFila === 0) maxCaballerosEnFila = 1;

    // =========================================================================
    // 2. PICAS ACTIVAS (El Muro Frontal Alineado)
    // =========================================================================
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let picasActivas = piquerosVivos.filter(p => Object.values(slotsFormacionPicas).includes(p.idUnico));
    let picasReserva = piquerosVivos.filter(p => !Object.values(slotsFormacionPicas).includes(p.idUnico));

    // Formación en columna recta idéntica a la 2da columna de reserva (13%, 35%, 57%, 79%)
    let posicionesFinalesPicas = {
        "pica-1": { top: "13%", left: "46%" }, 
        "pica-2": { top: "35%", left: "46%" }, 
        "pica-3": { top: "57%", left: "46%" }, 
        "pica-4": { top: "79%", left: "46%" }  
    };

    let elementosPicas = [];

    picasActivas.forEach((pica, index) => {
        let card = DirectorCinematico.crearTarjetaTropa(pica);
        card.style.zIndex = "250"; 
        
        let startLeft = -10 - (index * 14); 
        card.style.top = "42%"; 
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.transition = `left 4.5s linear, top 4.5s linear`; 
        
        zonaBatalla.appendChild(card);
        card.getBoundingClientRect(); 

        let finalPos = { top: "42%", left: `${5 - (index * 10)}%` }; 
        let slotName = Object.keys(slotsFormacionPicas).find(key => slotsFormacionPicas[key] === pica.idUnico);
        if (slotName && posicionesFinalesPicas[slotName]) {
            finalPos = posicionesFinalesPicas[slotName]; 
        }
        
        elementosPicas.push({ 
            el: card, 
            phase1Left: `${25 - (index * 14)}%`, 
            phase1Top: "42%", 
            phase2Left: finalPos.left,
            phase2Top: finalPos.top
        });
    });

    // =========================================================================
    // 3. PICAS DE RESERVA (Espera Central)
    // =========================================================================
    let elementosReserva = [];
    let numMostrados = 0;

    picasReserva.forEach((pica, index) => {
        let col = Math.floor(numMostrados / 4);
        let row = numMostrados % 4;

        let card = DirectorCinematico.crearTarjetaTropa(pica);
        card.style.zIndex = "200"; 
        
        let startLeft = -30 - (index * 12); 
        let startTop = 45; 

        card.style.top = `${startTop}%`; 
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.transition = `left 6.5s ease-out, top 6.5s ease-out`; 
        
        zonaBatalla.appendChild(card);
        card.getBoundingClientRect(); 

        let phase1Left = 18 - (col * 6);
        let phase1Top = 38 + (row * 4);

        elementosReserva.push({
            el: card,
            phase1Left: `${phase1Left}%`,
            phase1Top: `${phase1Top}%`,
            index: numMostrados
        });

        numMostrados++;
    });

    // FASE 1: Avance inicial de todos los piqueros
    setTimeout(() => {
        elementosPicas.forEach(anim => {
            anim.el.style.left = anim.phase1Left;
            anim.el.style.top = anim.phase1Top;
        });

        elementosReserva.forEach(anim => {
            anim.el.style.left = anim.phase1Left;
            anim.el.style.top = anim.phase1Top;
        });
    }, 50);

    // FASE 2 ACTIVA: El Muro se forma
    setTimeout(() => {
        elementosPicas.forEach(anim => {
            anim.el.style.transition = `left 4.5s ease-out, top 4.5s ease-out`; 
            anim.el.style.left = anim.phase2Left;
            anim.el.style.top = anim.phase2Top;
        });
    }, 4500); 

    // =========================================================================
    // FASE 2 RESERVA: EL ERIZO ESCALONADO PERFECTO Y COMPACTO
    // =========================================================================
    let tiempoFanOut = delayBaseCaballero + ((maxCaballerosEnFila - 1) * 700) + 4000;
    tiempoFanOut = Math.max(tiempoFanOut, 6600); 

    setTimeout(() => {
        elementosReserva.forEach(anim => {
            anim.el.style.transition = `left 3.5s ease-in-out, top 3.5s ease-in-out`;

            let col = Math.floor(anim.index / 4);
            let row = anim.index % 4;

            let escalonLeft = 32 - (col * 9); 
            let escalonTop;

            if (col % 2 === 0) {
                // Columnas pares
                escalonTop = 2 + (row * 22); 
            } else {
                // Columnas impares
                escalonTop = 13 + (row * 22); 
            }

            anim.el.style.left = `${escalonLeft}%`;
            anim.el.style.top = `${escalonTop}%`;
        });
    }, tiempoFanOut);

    // 4. ENEMIGOS (Horda Pagana)
    setTimeout(() => {
        let rowsTopEnemigos = ["28%", "46%", "64%"]; 
        let c_cine_enemigo = 0;

        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = "enemigo.webp";
                
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                
                let startLeftE = 110 + (c * 14); 
                let endLeftE = 65 + (c * 14);   

                cardE.style.top = rowsTopEnemigos[r];
                cardE.style.left = `${startLeftE}%`;
                cardE.style.filter = "sepia(50%) brightness(0.6)"; 
                cardE.style.transition = `left 8s linear, filter 8s linear`; 
                
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}">`;
                zonaBatalla.appendChild(cardE);
                cardE.getBoundingClientRect(); 

                setTimeout(() => {
                    cardE.style.left = `${endLeftE}%`;
                    cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                }, 50);
                c_cine_enemigo++;
            }
        }
    }, 600); 

    // =========================================================================
    // INYECCIÓN DE NIEBLA FANTASMAL (Z-INDEX SUPERIOR Y ANCLADA A ZONA BATALLA)
    // =========================================================================
    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    niebla.style.cssText = "z-index: 9999; pointer-events: none; opacity: 0.85; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover;";
    zonaBatalla.appendChild(niebla);

    // CÁLCULO DEL BOTÓN FINAL
    let tiempoMaximoCaballeros = delayBaseCaballero + ((maxCaballerosEnFila - 1) * 700) + 7500;
    let tiempoAparicionBoton = Math.max(9000, Math.max(tiempoMaximoCaballeros, tiempoFanOut + 3500));

    DirectorCinematico.crearBotonContinuar(animCaja, "DEUS LO VULT !", tiempoAparicionBoton, callbackFinal);
}