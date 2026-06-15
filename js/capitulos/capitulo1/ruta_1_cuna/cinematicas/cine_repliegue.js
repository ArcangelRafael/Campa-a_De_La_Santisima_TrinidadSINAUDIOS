/* === CINE_REPLIEGUE.JS - CINEMÁTICA DE LA RETIRADA DE PICAS === */

// SISTEMA GLOBAL DE CLIMA Y AUDIO AMBIENTAL
window.Clima = {
    audioViento: null,
    audioVientoRayo: null,
    audioLluvia: null,
    
    iniciarViento: function() {
        this.detenerTodo(); 
        if (!this.audioViento) { this.audioViento = new Audio("assets/audio/amb_wind.mp3"); this.audioViento.loop = true; this.audioViento.volume = 0.5; }
        this.audioViento.play().catch(e => console.log("Audio bloqueado."));
    },
    iniciarVientoRayo: function() {
        this.detenerTodo();
        if (!this.audioVientoRayo) { this.audioVientoRayo = new Audio("assets/audio/amb_windlightning.mp3"); this.audioVientoRayo.loop = true; this.audioVientoRayo.volume = 0.6; }
        this.audioVientoRayo.play().catch(e => console.log("Audio bloqueado."));
    },
    iniciarLluvia: function() {
        this.detenerTodo();
        let capa = document.getElementById("capa-clima");
        if (!capa) { capa = document.createElement("div"); capa.id = "capa-clima"; capa.className = "rain"; document.body.appendChild(capa); }
        capa.style.display = "block"; 
        if (!this.audioLluvia) { this.audioLluvia = new Audio("assets/audio/amb_rain.mp3"); this.audioLluvia.loop = true; this.audioLluvia.volume = 0.6; }
        this.audioLluvia.play().catch(e => console.log("Audio bloqueado."));
    },
    detenerTodo: function() {
        let capa = document.getElementById("capa-clima"); if (capa) capa.style.display = "none";
        if (this.audioViento) { this.audioViento.pause(); this.audioViento.currentTime = 0; }
        if (this.audioVientoRayo) { this.audioVientoRayo.pause(); this.audioVientoRayo.currentTime = 0; }
        if (this.audioLluvia) { this.audioLluvia.pause(); this.audioLluvia.currentTime = 0; }
    }
};

function playModalAlivioPicas() {
    return new Promise((resolve) => {
        let huidos = Math.floor(Math.random() * 3) + 2; 
        jugador.enemigosAsesinados = (jugador.enemigosAsesinados || 0) + huidos;

        let overlayAlivio = document.createElement("div"); 
        overlayAlivio.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:2000; display:flex; justify-content:center; align-items:center;";
        
        let autoCombat = document.getElementById("ht-auto-combat")?.checked;
        let pending = document.querySelectorAll('.pendiente-dados').length > 0;
        if (!autoCombat && pending) {
            overlayAlivio.style.display = "none";
            overlayAlivio.classList.add("victoria-oculta");
        }
        
        let modal = document.createElement("div"); 
        modal.style.cssText = "background:#111; border:2px solid #ffaa00; padding:30px; width:600px; max-height:80vh; overflow-y:auto; overflow-x:hidden; text-align:center; box-shadow: 0 0 30px rgba(255,170,0,0.3); border-radius:8px;";
        
        modal.innerHTML = `
            <div style="padding: 10px; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
                <h2 class="txt-sagrado" style='font-family:"Cinzel", serif; margin-top:0; margin-bottom:20px; position:relative; z-index:5000; text-shadow: 2px 2px 8px #000, 0 0 15px #000;'>¡ALABADO SEA EL SEÑOR!</h2>
                <div id="alivio-dialogs" style="width: 100%; transform: scale(0.85); transform-origin: top center; display: flex; flex-direction: column; align-items: center; margin-bottom: -50px;"></div>
                <hr class="separador" style='border-color:#444; margin:30px 0 20px 0; width: 80%;'>
                <p id="alivio-text-final" class="txt-accion" style='font-size: 0.9em; display:none; max-width: 90%;'>[Se escucha el bramido de un cuerno de guerra que resuena en todo el desfiladero, marcando el fin de la masacre. Ante el ensordecedor sonido y la inminente lluvia de saetas, <b>${huidos} paganos</b> rompen filas y huyen despavoridos hacia la niebla].</p>
                <button id="btn-cerrar-alivio" style="display:none; margin-top:20px; padding:10px 30px; font-size:16px; font-weight:bold; background:#222; color:#ffaa00; border:2px solid #ffaa00; border-radius:5px; cursor:pointer; font-family:'Cinzel', serif;">AVANZAR LA CRUZADA</button>
            </div>
        `;
        
        overlayAlivio.appendChild(modal); 
        document.body.appendChild(overlayAlivio);

        setTimeout(async () => {
            let container = document.getElementById("alivio-dialogs");
            let btn = document.getElementById("btn-cerrar-alivio");
            let textFinal = document.getElementById("alivio-text-final");
            if(!container) return;

            if (typeof window.Clima !== "undefined") window.Clima.iniciarLluvia();
            
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡Comendador! ¡Los birotes han llegado y el hierro está sediento! ¡Mis hombres tienen el puente bajo la mira!"`, claseTexto: "txt-lugarteniente"
            });
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡CONDE JUAN-A! ¡Retire a sus perros de esa carnicería de inmediato si no quiere que mis saetas los confundan con herejes! ¡EL PUENTE ES NUESTRO!"`, claseTexto: "txt-lugarteniente"
            });
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡MISERICORDIA DIVINA...! ¡ESCUCHAD EL CUERNO, HERMANOS! ¡REPLIEGUE! ¡REPLIEGUE POR LA TRINIDAD!"`, claseTexto: "txt-lugarteniente"
            });

            if(textFinal) textFinal.style.display = "block";
            if(btn) btn.style.display = "inline-block";
            btn.onclick = () => { document.body.removeChild(overlayAlivio); resolve(); };
        }, 50);
    });
}

function playCinematicaRepliegue(callbackFinal) {
    console.log("INICIANDO OPERACIÓN DE REPLIEGUE TÁCTICO...");
    
    if (typeof DirectorCinematico !== 'undefined') DirectorCinematico.limpiarHigieneVisual();
    
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.style.overflow = "visible"; 
    animCaja.innerHTML = ""; 

    // =========================================================================
    // TEXTO SUPERIOR (EN LA ZONA GRIS EXTERIOR)
    // =========================================================================
    let titulo = document.createElement("h3");
    titulo.className = "txt-sagrado";
    titulo.innerText = "EL RELEVO TÁCTICO";
    titulo.style.cssText = "position:absolute; top:-40px; width:100%; text-align:center; margin:0; letter-spacing:3px; z-index:300; text-shadow:0 0 10px #000;";
    animCaja.appendChild(titulo);

    // =========================================================================
    // ZONA DE BATALLA
    // =========================================================================
    let zonaBatalla = document.createElement("div");
    zonaBatalla.id = "zona-batalla-anim";
    zonaBatalla.style.cssText = "position:absolute; top:50%; left:0; width:100%; height:400px; transform:translateY(-50%); z-index:150; overflow:visible; clip-path: inset(-150px 0 -150px 0);";
    animCaja.appendChild(zonaBatalla);

    if (typeof window.forzarHalosCinematicas === 'function') window.forzarHalosCinematicas(zonaBatalla);

    // NIEBLA DE GUERRA
    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    niebla.style.cssText = "z-index: 999; pointer-events: none; position: absolute; top: -10%; left: 0%; width: 100%; height: 120%; opacity: 0.85;";
    zonaBatalla.appendChild(niebla);

    // 1. BALLESTEROS
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        let hpStars = "❤️".repeat(Math.max(0, ballestero.hp)) + "🖤".repeat(2 - Math.max(0, ballestero.hp));
        let etiqueta = ballestero.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${ballestero.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${ballestero.nombre} <br>${etiqueta}</div>`;

        let row = index % 3; let col = Math.floor(index / 3); 
        
        card.style.top = `${28 + (row * 18)}%`; 
        card.style.left = `${-20 - (col * 12)}%`;
        card.style.opacity = "1"; 
        card.style.transition = "left 5.5s ease-out";
        zonaBatalla.appendChild(card); 
        
        setTimeout(() => { card.style.left = `${34 - (col * 8.5)}%`; }, 100);
    });

    // =========================================================================
    // 2. PIQUEROS (Estrategia Compactada, Aparecen de la derecha y marchan en L)
    // =========================================================================
    let picaVanguardiaIds = [];
    if (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.tropasVivas) {
        picaVanguardiaIds = EstadoBatalla.tropasVivas.map(p => p.idUnico).filter(id => id != null);
    }

    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let vanguardia = piquerosVivos.filter(t => picaVanguardiaIds.includes(t.idUnico));
    let reservas = piquerosVivos.filter(t => !picaVanguardiaIds.includes(t.idUnico));
    
    let piquerosGrid = [];
    
    vanguardia.forEach(p => {
        let posObj = EstadoBatalla.tropasVivas.find(tv => tv.idUnico === p.idUnico);
        let slotIndex = posObj && posObj.slotPos ? parseInt(posObj.slotPos.split("-")[1]) - 1 : 0;
        if(isNaN(slotIndex)) slotIndex = 0;
        piquerosGrid.push({ tropa: p, row: slotIndex, col: 0, isTop: slotIndex < 2 });
    });
    
    reservas.forEach((p, i) => {
        let row = i % 4;
        piquerosGrid.push({ tropa: p, row: row, col: Math.floor(i / 4) + 1, isTop: (i % 4) < 2 });
    });

    let countTop = 0; let countBot = 0;

    piquerosGrid.forEach((gridItem) => {
        let card = document.createElement("div");
        let claseBorde = gridItem.tropa.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        let hpStars = "❤️".repeat(Math.max(0, gridItem.tropa.hp)) + "🖤".repeat(2 - Math.max(0, gridItem.tropa.hp));
        let etiqueta = gridItem.tropa.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${gridItem.tropa.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${gridItem.tropa.nombre} <br>${etiqueta}</div>`;

        let posIndex = gridItem.isTop ? countTop++ : countBot++;
        
        let initialLeft = 105 + (gridItem.col * 8); 
        let initialTop = 22 + (gridItem.row * 15); 

        card.style.zIndex = 200 - gridItem.col;
        card.style.top = `${initialTop}%`;
        card.style.left = `${initialLeft}%`;
        card.style.opacity = "1";
        zonaBatalla.appendChild(card);
        card.getBoundingClientRect(); 

        // Fase 0: Llegan al centro marchando hacia atrás desde el frente
        setTimeout(() => {
            card.style.transition = `left 3.9s linear`;
            card.style.left = `${initialLeft - 55}%`; 
        }, 100);

        // =====================================================================
        // ANIMACIÓN DE DIVISIÓN EN "L"
        // =====================================================================
        setTimeout(() => {
            let colDescanso = posIndex % 5;
            let depthDescanso = Math.floor(posIndex / 5);
            
            let finalLeft = 48 - (colDescanso * 8) - (depthDescanso * 3);
            let finalTop = gridItem.isTop ? 2 - (depthDescanso * 3) : 92 + (depthDescanso * 3); 

            // FASE 1: Se desplazan verticalmente hacia el nivel del flanco (suben o bajan)
            card.style.transition = `top 1.5s ease-in-out`;
            card.style.top = `${finalTop}%`;

            // FASE 2: Se mueven horizontalmente hacia atrás para guardarse en el bosque
            setTimeout(() => {
                card.style.transition = `top 1.5s ease-in-out, left 1.5s ease-out`;
                card.style.left = `${finalLeft}%`;
            }, 1500);

        }, 4000); 
    });

    // =========================================================================
    // 3. ENEMIGOS (Aparecen con retraso de 3.5 segundos para no empalmarse)
    // =========================================================================
    setTimeout(() => {
        let rowsTopEnemigos = ["28%", "46%", "64%"]; 
        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                
                let startLeftE = 95 + (c * 10); 
                let endLeftE = 68 + (c * 10);   

                cardE.style.top = rowsTopEnemigos[r];
                cardE.style.left = `${startLeftE}%`;
                cardE.style.filter = "sepia(50%) brightness(0.6)"; 
                cardE.style.opacity = "0"; 
                cardE.style.transition = `left 4.5s ease-out, opacity 0.8s ease-in, filter 4.5s linear`; 
                
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                zonaBatalla.appendChild(cardE);
                cardE.getBoundingClientRect(); 

                setTimeout(() => {
                    cardE.style.opacity = "1";
                    cardE.style.left = `${endLeftE}%`;
                    cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                }, 50);
            }
        }
    }, 3500); 

    // =========================================================================
    // BOTÓN DE CONTINUAR (Aparece 1 segundo antes de que los enemigos terminen)
    // =========================================================================
    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        impactBtn.style.cssText = "position:absolute; bottom:-60px; left:50%; transform:translateX(-50%); z-index:9999;";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, 7000); 
}