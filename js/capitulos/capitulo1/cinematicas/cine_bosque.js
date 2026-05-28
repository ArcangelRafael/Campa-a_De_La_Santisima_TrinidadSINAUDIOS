/* === CINE_BOSQUE.JS - CINEMÁTICAS EXCLUSIVAS DEL BUCLE EN EL BOSQUE === */

function renderizarMarcadoresBosque(animCaja) {
    if (window.marcadoresBatalla) {
        window.marcadoresBatalla.forEach(m => {
            let mk = document.createElement("div");
            mk.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
            mk.style.position = "absolute";
            mk.style.fontSize = "35px";
            mk.style.color = m.tipo === 'cross' ? "#c0c0c0" : "#fff";
            mk.style.textShadow = m.tipo === 'cross' ? "0 0 10px #fff" : "none";
            mk.style.opacity = "0.5"; 
            mk.style.zIndex = "5"; 
            mk.style.pointerEvents = "none";
            
            if (m.slotPos && m.slotPos.startsWith('sacrificio-')) {
                let numSlot = parseInt(m.slotPos.split('-')[1]);
                let tops = { 1: 28, 2: 46, 3: 64 };
                mk.style.top = `${tops[numSlot] || 46}%`;
                mk.style.left = `53%`; 
                animCaja.appendChild(mk);
            } else if (m.slotPos && m.slotPos.startsWith('pica-')) {
                let numSlot = parseInt(m.slotPos.split('-')[1]);
                let posicionesEscalonadas = { 1: { left: 45, top: 25 }, 2: { left: 53, top: 35 }, 3: { left: 45, top: 50 }, 4: { left: 53, top: 60 } };
                let pos = posicionesEscalonadas[numSlot] || {left: 50, top: 50};
                mk.style.top = `${pos.top}%`;
                mk.style.left = `${pos.left}%`;
                animCaja.appendChild(mk);
            }
        });
    }
}

function playCinematicaFormarMuroBosque(resultadoFormacion, callbackFinal) {
    console.log("ANIMANDO: PICAS AL FRENTE (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.innerHTML = `<h3 class="txt-sagrado" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">¡A LA LÍNEA!</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    renderizarMarcadoresBosque(animCaja);

    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !t.espadachin);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(ballestero);

        let row = index % 3; let col = Math.floor(index / 3); 
        card.style.top = `${23 + (row * 16)}%`;
        card.style.left = `${34 - (col * 8.5)}%`;
        animCaja.appendChild(card);
    });

    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;
    
    let picasEnMuro = [];
    if(resultadoFormacion && resultadoFormacion.slots) {
        picasEnMuro = Object.values(resultadoFormacion.slots).filter(id => id !== null);
    }

    let posicionesEscalonadas = {
        1: { left: 45, top: 25 },
        2: { left: 53, top: 35 },
        3: { left: 45, top: 50 },
        4: { left: 53, top: 60 }
    };

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(pica);

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        let sideLeft = 48 - (col * 8) - (depth * 3); 
        let sideTop = isTop ? 8 - (depth * 3) : 74 + (depth * 3); 

        card.style.left = `${sideLeft}%`;
        card.style.top = `${sideTop}%`;
        card.style.zIndex = 200 - depth;
        animCaja.appendChild(card);

        if (picasEnMuro.includes(pica.idUnico)) {
            let slotName = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === pica.idUnico);
            let numSlot = parseInt(slotName.split("-")[1]); 
            
            let posFinal = posicionesEscalonadas[numSlot] || { left: 52, top: 30 };

            setTimeout(() => {
                card.style.transition = `left 3s cubic-bezier(0.25, 1, 0.5, 1), top 3s cubic-bezier(0.25, 1, 0.5, 1)`;
                card.style.left = `${posFinal.left}%`;
                card.style.top = `${posFinal.top}%`;
                card.style.zIndex = 250 + numSlot; 
            }, 500);
        }
    });

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
            animCaja.appendChild(cardE);
        }
    }

    let timeoutEspera = (picasEnMuro.length === 0) ? 1500 : 4000;

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        impactBtn.style.bottom = "5px";
        
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
    }, timeoutEspera); 
}

function playCinematicaRepliegueBosque(callbackFinal) {
    console.log("ANIMANDO: REPLIEGUE A LOS FLANCOS (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.innerHTML = `<h3 class="txt-sagrado" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">ABRIR CAMPO DE TIRO</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    renderizarMarcadoresBosque(animCaja);

    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let espadachinesVivos = jugador.tropas.filter(t => t.espadachin && t.hp > 0);
    
    let timeTransition = (piquerosVivos.length === 0 && espadachinesVivos.length === 0) ? 1.5 : 5;
    let timeoutEspera = (piquerosVivos.length === 0 && espadachinesVivos.length === 0) ? 2000 : 6000;

    let todosBallesteros = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    
    todosBallesteros.forEach((ballestero, index) => {
        let row = index % 3; let col = Math.floor(index / 3); 
        let finalTop = 23 + (row * 16);
        let finalLeft = 34 - (col * 8.5);

        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(ballestero);
        
        if (ballestero.espadachin) {
            card.style.zIndex = "200";
            let startLeft = 52 + (Math.random()*4);
            let startTop = 25 + (Math.random()*40);
            card.style.left = `${startLeft}%`;
            card.style.top = `${startTop}%`;
            animCaja.appendChild(card);
            
            setTimeout(() => {
                card.style.transition = `left ${timeTransition}s ease-out, top ${timeTransition}s ease-out`;
                card.style.left = `${finalLeft}%`;
                card.style.top = `${finalTop}%`;
            }, 100);
        } else {
            card.style.zIndex = "150"; 
            card.style.top = `${finalTop}%`;
            card.style.left = `${finalLeft}%`;
            animCaja.appendChild(card);
        }
    });

    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(pica);

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        let finalLeft = 48 - (col * 8) - (depth * 3); 
        let finalTop = isTop ? 8 - (depth * 3) : 74 + (depth * 3); 
        
        let startLeft = 52 + (Math.random()*4);
        let startTop = 25 + (Math.random()*40);

        card.style.zIndex = 200 - depth;
        card.style.left = `${startLeft}%`;
        card.style.top = `${startTop}%`;
        animCaja.appendChild(card);

        setTimeout(() => {
            card.style.transition = `left ${timeTransition}s ease-out, top ${timeTransition}s ease-out`;
            card.style.left = `${finalLeft}%`;
            card.style.top = `${finalTop}%`;
        }, 100);
    });

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
            animCaja.appendChild(cardE);
        }
    }

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        impactBtn.style.bottom = "5px";
        
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
    }, timeoutEspera); 
}

function playCinematicaSacrificioBosque(resultadoFormacion, callbackFinal) {
    console.log("ANIMANDO: SACRIFICIO AL FRENTE (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.innerHTML = `<h3 class="txt-hereje" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">DESENVAINAR ESPADAS</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    renderizarMarcadoresBosque(animCaja);

    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !Object.values(resultadoFormacion.slots).includes(t.idUnico) && !t.espadachin);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "100"; 
        
        card.style.filter = "brightness(0.5) sepia(20%)"; 
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(ballestero);

        let row = index % 3; let col = Math.floor(index / 3); 
        card.style.top = `${23 + (row * 16)}%`;
        card.style.left = `${34 - (col * 8.5)}%`;
        
        animCaja.appendChild(card);
    });

    let posicionesSacrificio = {
        1: { left: 53, top: 28 },
        2: { left: 53, top: 46 },
        3: { left: 53, top: 64 }
    };

    let martirCards = []; 

    let sacrificiosIDs = Object.values(resultadoFormacion.slots).filter(id => id !== null);
    sacrificiosIDs.forEach((id, index) => {
        let martir = jugador.tropas.find(t => t.idUnico === id);
        if(martir) {
            let card = document.createElement("div");
            let claseBorde = martir.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
            card.className = `tropa-cinematica ${claseBorde}`;
            
            // Llamada DRY: Limpieza absoluta
            card.innerHTML = RenderCombate.htmlFichaCinematica(martir);

            let slotName = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === martir.idUnico);
            let numSlot = parseInt(slotName.split("-")[1]); 
            
            card.style.left = `15%`;
            card.style.top = `${30 + (Math.random()*25)}%`;
            card.style.zIndex = 250 + numSlot; 
            animCaja.appendChild(card);

            let posFinal = posicionesSacrificio[numSlot] || { left: 53, top: 46 };

            setTimeout(() => {
                card.style.transition = `left 2.5s cubic-bezier(0.25, 1, 0.5, 1), top 2.5s cubic-bezier(0.25, 1, 0.5, 1)`;
                card.style.left = `${posFinal.left}%`;
                card.style.top = `${posFinal.top}%`;
            }, 300);

            martirCards.push({ el: card, numSlot: numSlot });
        }
    });

    let enemyCardsFront = [];
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
            animCaja.appendChild(cardE);

            if (c === 0) {
                enemyCardsFront.push({ el: cardE, numSlot: r + 1 });
            }
        }
    }

    setTimeout(() => {
        let isRed = false;
        let blinkInterval = setInterval(() => {
            isRed = !isRed;
            let shadow = isRed ? "0 0 20px #ff0000, inset 0 0 20px #ff0000" : "none";
            let border = isRed ? "2px solid #ff0000" : "";
            
            martirCards.forEach(mc => {
                mc.el.style.boxShadow = shadow;
                if(isRed) mc.el.style.border = border;
            });
            enemyCardsFront.forEach(ec => {
                if (martirCards.some(mc => mc.numSlot === ec.numSlot)) {
                    ec.el.style.boxShadow = shadow;
                    if(isRed) ec.el.style.border = border;
                }
            });
        }, 150);

        animCaja.dataset.blinkInterval = blinkInterval;
    }, 2800); 

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "A LA MUERTE !";
        impactBtn.style.bottom = "5px";
        impactBtn.style.background = "linear-gradient(to bottom, #b30000 0%, #660000 100%)";
        impactBtn.style.borderColor = "#ff4c4c";
        
        impactBtn.onclick = function() {
            if(animCaja.dataset.blinkInterval) {
                clearInterval(animCaja.dataset.blinkInterval);
                delete animCaja.dataset.blinkInterval;
            }
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, 3200); 
}