/* === CINE_BOSQUE.JS - CINEMÁTICAS EXCLUSIVAS DEL BUCLE EN EL BOSQUE === */

window.playCinematicaFormarMuroBosque = function(resultadoFormacion, callbackFinal) {
    console.log("🎬 ANIMANDO: PICAS AL FRENTE (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.style.overflow = "visible"; // Permite que título y botón salgan a la zona gris
    animCaja.innerHTML = "";

    // =========================================================================
    // TEXTO SUPERIOR (ZONA GRIS EXTERIOR)
    // =========================================================================
    let titulo = document.createElement("h3");
    titulo.className = "txt-sagrado";
    titulo.innerText = "¡A LA LÍNEA!";
    titulo.style.cssText = "position:absolute; top:-40px; width:100%; text-align:center; margin:0; letter-spacing:3px; z-index:300; text-shadow:0 0 10px #000;";
    animCaja.appendChild(titulo);

    // =========================================================================
    // ZONA DE BATALLA (CON TIJERAS LATERALES MAGNÉTICAS | | )
    // =========================================================================
    let zonaBatalla = document.createElement("div");
    zonaBatalla.id = "zona-batalla-anim";
    zonaBatalla.style.cssText = "position:absolute; top:50%; left:0; width:100%; height:400px; transform:translateY(-50%); z-index:150; overflow:visible; clip-path: inset(-150px 0 -150px 0);";
    animCaja.appendChild(zonaBatalla);

    if (typeof window.forzarHalosCinematicas === 'function') window.forzarHalosCinematicas(zonaBatalla);

    // =========================================================================
    // NIEBLA DE GUERRA (SOBRE LAS UNIDADES Y FLUIDA)
    // =========================================================================
    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    niebla.style.cssText = "z-index: 999; pointer-events: none; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; opacity: 0.85;";
    zonaBatalla.appendChild(niebla);

    // 1. BALLESTEROS ESTÁTICOS EN RETAGUARDIA
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
        card.style.top = `${28 + (row * 18)}%`; // <--- BAJADOS PARA ALINEAR CON ENEMIGOS
        card.style.left = `${34 - (col * 8.5)}%`;
        zonaBatalla.appendChild(card);
    });

    // 2. PIQUEROS (Desde los costados hacia el frente)
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;
    
    // Extraemos los IDs de los piqueros seleccionados para el muro
    let picasEnMuro = [];
    if(resultadoFormacion && resultadoFormacion.slots) {
        picasEnMuro = Object.values(resultadoFormacion.slots).filter(id => id !== null);
    }

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        let hpStars = "❤️".repeat(Math.max(0, pica.hp)) + "🖤".repeat(2 - Math.max(0, pica.hp));
        let etiqueta = pica.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${pica.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${pica.nombre} <br>${etiqueta}</div>`;

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        // POSICIÓN INICIAL: Escondidos en los flancos laterales (MÁS SEPARADOS)
        let sideLeft = 48 - (col * 8) - (depth * 3); 
        let sideTop = isTop ? 2 - (depth * 3) : 92 + (depth * 3); // <--- AJUSTADO PARA NO TOCAR BALLESTEROS

        card.style.left = `${sideLeft}%`;
        card.style.top = `${sideTop}%`;
        card.style.zIndex = 200 - depth;
        zonaBatalla.appendChild(card);

        // MOVIMIENTO AL CENTRO: Si el jugador los eligió para la formación
        if (picasEnMuro.includes(pica.idUnico)) {
            let slotName = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === pica.idUnico);
            let numSlot = parseInt(slotName.split("-")[1]); 
            
            let centerLeft = 52; // Al frente de los ballesteros
            let centerTop = 15 + (numSlot * 14); // Apilados verticalmente

            setTimeout(() => {
                card.style.transition = `left 3s cubic-bezier(0.25, 1, 0.5, 1), top 3s cubic-bezier(0.25, 1, 0.5, 1)`;
                card.style.left = `${centerLeft}%`;
                card.style.top = `${centerTop}%`;
                card.style.zIndex = 250 + numSlot; 
            }, 500);
        }
    });

    // 3. ENEMIGOS ESTÁTICOS A LA DERECHA
    let rowsTopEnemigos = ["28%", "46%", "64%"]; 
    for(let r=0; r < 3; r++) {
        for(let c=0; c < 3; c++) {
            let cardE = document.createElement("div");
            let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
            cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
            cardE.style.zIndex = "100"; 
            cardE.style.top = rowsTopEnemigos[r];
            cardE.style.left = `${62 + (c * 10)}%`;
            cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
            zonaBatalla.appendChild(cardE);
        }
    }

    // =========================================================================
    // BOTÓN DE CONTINUAR (ZONA GRIS INFERIOR)
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
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, 4000); 
};


window.playCinematicaRepliegueBosque = function(callbackFinal) {
    console.log("🎬 ANIMANDO: REPLIEGUE A LOS FLANCOS (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.style.overflow = "visible"; // Permite que botón salga a la zona gris
    animCaja.innerHTML = "";

    // =========================================================================
    // ZONA DE BATALLA (CON TIJERAS LATERALES MAGNÉTICAS | | )
    // =========================================================================
    let zonaBatalla = document.createElement("div");
    zonaBatalla.id = "zona-batalla-anim";
    zonaBatalla.style.cssText = "position:absolute; top:50%; left:0; width:100%; height:400px; transform:translateY(-50%); z-index:150; overflow:visible; clip-path: inset(-150px 0 -150px 0);";
    animCaja.appendChild(zonaBatalla);

    if (typeof window.forzarHalosCinematicas === 'function') window.forzarHalosCinematicas(zonaBatalla);

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    niebla.style.cssText = "z-index: 999; pointer-events: none; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; opacity: 0.85;";
    zonaBatalla.appendChild(niebla);

    // 1. BALLESTEROS ESTÁTICOS
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
        card.style.top = `${28 + (row * 18)}%`; // <--- BAJADOS PARA ALINEAR CON ENEMIGOS
        card.style.left = `${34 - (col * 8.5)}%`;
        zonaBatalla.appendChild(card);
    });

    // 2. PIQUEROS VIVOS (Reservas en flancos, Vanguardia retrocede)
    let picaVanguardiaIds = [];
    if (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.tropasVivas) {
        picaVanguardiaIds = EstadoBatalla.tropasVivas.map(p => p.idUnico).filter(id => id != null);
    }

    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        let hpStars = "❤️".repeat(Math.max(0, pica.hp)) + "🖤".repeat(2 - Math.max(0, pica.hp));
        let etiqueta = pica.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${pica.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${pica.nombre} <br>${etiqueta}</div>`;

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        // Destino Final: Laterales Seguros EXTREMOS (no tocan ballesteros)
        let finalLeft = 48 - (col * 8) - (depth * 3); 
        let finalTop = isTop ? 2 - (depth * 3) : 92 + (depth * 3); 
        
        let isVanguardia = picaVanguardiaIds.includes(pica.idUnico);

        if (isVanguardia) {
            // VANGUARDIA: Inicia al frente en formación y se repliega
            let posObj = EstadoBatalla.tropasVivas.find(tv => tv.idUnico === pica.idUnico);
            let numSlot = 1;
            if (posObj && posObj.slotPos) {
                numSlot = parseInt(posObj.slotPos.split("-")[1]);
            }
            
            card.style.left = `52%`;
            card.style.top = `${15 + (numSlot * 14)}%`;
            card.style.zIndex = 250 + numSlot;

            setTimeout(() => {
                card.style.transition = `left 5s ease-out, top 5s ease-out`;
                card.style.left = `${finalLeft}%`;
                card.style.top = `${finalTop}%`;
            }, 500);
        } else {
            // RESERVA: Ya están a salvo en los flancos desde el inicio
            card.style.left = `${finalLeft}%`;
            card.style.top = `${finalTop}%`;
            card.style.zIndex = 200 - depth;
        }

        zonaBatalla.appendChild(card);
    });

    // =========================================================================
    // 2.5 PIQUEROS MUERTOS (Desvanecimiento y Aparición de Cruz Dorada)
    // =========================================================================
    let muertosVanguardia = [];
    if (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.tropasVivas) {
        muertosVanguardia = EstadoBatalla.tropasVivas.filter(pos => {
            let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
            return tr && tr.hp <= 0 && !pos.ignorarMuerto;
        });
    }

    muertosVanguardia.forEach(muertoPos => {
        let tr = jugador.tropas.find(t => t.idUnico === muertoPos.idUnico);
        if(!tr) return;

        let card = document.createElement("div");
        let claseBorde = tr.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "100"; // Detrás de los vivos
        
        card.innerHTML = `<img src="${tr.img}"><div class="unidad-hp-combate">🖤🖤</div><div class="unidad-nombre-aleatorio">${tr.nombre}</div>`;
        
        let numSlot = 1;
        if (muertoPos.slotPos) numSlot = parseInt(muertoPos.slotPos.split("-")[1]); 
        
        let startLeft = 52;
        let startTop = 15 + (numSlot * 14);

        card.style.left = `${startLeft}%`;
        card.style.top = `${startTop}%`;
        card.style.filter = "grayscale(100%) sepia(30%) brightness(0.4)";
        zonaBatalla.appendChild(card);

        // Cruz Inmortal
        let cross = document.createElement("div");
        cross.innerHTML = "✝";
        cross.className = "marcador-batalla cross-icon";
        cross.style.cssText = "position:absolute; font-size:45px; z-index:90; pointer-events:none; color: #ffd700 !important; text-shadow: 0 0 15px #ffaa00, 0 0 40px #ffaa00, 0 0 60px #ffaa00 !important;";
        cross.style.left = `${startLeft + 4}%`;
        cross.style.top = `${startTop + 10}%`;
        cross.style.transform = "translate(-50%, -50%)";
        cross.style.opacity = "0";
        cross.style.transition = "opacity 2.5s ease-in";
        zonaBatalla.appendChild(cross);

        // Animar Desvanecimiento
        setTimeout(() => {
            card.style.transition = `opacity 2.5s ease-out`;
            card.style.opacity = "0";
            cross.style.opacity = "0.95";
        }, 500);
    });

    // 3. ENEMIGOS ESTÁTICOS
    let rowsTopEnemigos = ["28%", "46%", "64%"]; 
    for(let r=0; r < 3; r++) {
        for(let c=0; c < 3; c++) {
            let cardE = document.createElement("div");
            let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
            cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
            cardE.style.zIndex = "100"; 
            cardE.style.top = rowsTopEnemigos[r];
            cardE.style.left = `${62 + (c * 10)}%`;
            cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
            zonaBatalla.appendChild(cardE);
        }
    }

    // =========================================================================
    // BOTÓN DE CONTINUAR (ZONA GRIS INFERIOR)
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
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, 6000); 
};