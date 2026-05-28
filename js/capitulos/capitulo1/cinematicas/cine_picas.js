/* === CINE_PICAS.JS - CINEMÁTICA DEL RELEVO DE PICAS === */

const GEOMETRIA_ANIM = {
    BRIDGE_TOP_LIMIT: 15, 
    BRIDGE_BOTTOM_LIMIT: 85, 
    BRIDGE_CENTER: 50, 
    LEFT_EXIT_LINE: -20, 
    RIGHT_ENTRY_LINE: 110, 
    LEFT_ENTRY_LINE: -10, 
    RIGHT_EXIT_LINE: 115, 
    DURACION_MARCHA_PASO: 9000, 
    CSS_MARCHA_PASO: '9s linear' 
};

function playCinematicaRelevoPicas(callbackFinal) {
    const animCaja = document.getElementById("animacion-escena1");
    animCaja.style.display = "block";
    
    animCaja.innerHTML = `<h3 style="color:#ffaa00; text-shadow:0 0 10px #000; margin-top:30px; text-align:center; letter-spacing:3px; position:relative; z-index:300;">EL RELEVO TÁCTICO</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    if (window.marcadoresBatalla) {
        window.marcadoresBatalla.forEach(m => {
            let mk = document.createElement("div");
            mk.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
            mk.style.position = "absolute";
            mk.style.fontSize = "35px";
            mk.style.color = m.tipo === 'cross' ? "#c0c0c0" : "#fff";
            mk.style.textShadow = m.tipo === 'cross' ? "0 0 10px #fff" : "none";
            mk.style.opacity = "0.6"; 
            mk.style.zIndex = "5"; 
            
            let tops = [15, 32, 50, 68, 85];
            mk.style.top = `${tops[m.row]}%`;
            
            let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84 };
            mk.style.left = `${cols[m.col]}%`;
            
            animCaja.appendChild(mk);
        });
    }

    let caballerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0).slice(0, 5);
    
    let c_arriba = 0; 
    let c_abajo = 0;  
    let delayBaseCaballero = 100; 

    caballerosVivos.forEach((cab, index) => {
        let card = document.createElement("div");
        let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(cab);

        let isTop = index < 2; 
        let topPos = isTop ? 10 : 75; 
        
        let offsetX = isTop ? (c_arriba * 16) : (c_abajo * 16);
        if (isTop) c_arriba++; else c_abajo++;

        let startLeft = 110 + offsetX; 
        let endLeft = -60 + offsetX;   

        card.style.top = `${topPos}%`;
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1";
        card.style.filter = "grayscale(80%) sepia(20%)"; 
        
        card.style.transition = `left 8.5s linear, filter 8.5s linear`;
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${endLeft}%`;
            card.style.filter = "grayscale(100%) brightness(0.7)";
        }, delayBaseCaballero);
    });

    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let picasActivas = piquerosVivos.filter(p => Object.values(slotsFormacionPicas).includes(p.idUnico));
    let picasReserva = piquerosVivos.filter(p => !Object.values(slotsFormacionPicas).includes(p.idUnico));

    let posicionesFinalesPicas = {
        "pica-1": { top: "25%", left: "45%" }, 
        "pica-2": { top: "35%", left: "53%" }, 
        "pica-3": { top: "50%", left: "45%" }, 
        "pica-4": { top: "60%", left: "53%" }  
    };

    let elementosPicas = [];

    picasActivas.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "250"; 
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(pica);

        let startLeft = -10 - (index * 14); 
        card.style.top = "42%"; 
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.filter = "sepia(80%)";
        card.style.transition = `left 4s linear, top 4s linear`; 
        
        animCaja.appendChild(card);
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

    let numMostrados = 0;
    picasReserva.forEach((pica, index) => {
        if (numMostrados >= 8) return; 

        let col = Math.floor(numMostrados / 4);
        let row = numMostrados % 4;

        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "200"; 
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(pica);

        let startLeft = -40 - (col * 12); 
        let endLeft = 5 + (col * 12);
        let finalTop = 20 + (row * 18);

        card.style.top = `${finalTop}%`; 
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.filter = "sepia(80%)";
        card.style.transition = `left 5s ease-out`; 
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${endLeft}%`; 
            card.style.filter = "sepia(0%)";
        }, 50);

        numMostrados++;
    });

    setTimeout(() => {
        elementosPicas.forEach(anim => {
            anim.el.style.left = anim.phase1Left;
            anim.el.style.top = anim.phase1Top;
        });
    }, 50);

    setTimeout(() => {
        elementosPicas.forEach(anim => {
            anim.el.style.transition = `left 5s ease-out, top 5s ease-out, filter 5s linear`; 
            anim.el.style.left = anim.phase2Left;
            anim.el.style.top = anim.phase2Top;
            anim.el.style.filter = "sepia(0%)";
        });
    }, 4050); 

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
                animCaja.appendChild(cardE);
                cardE.getBoundingClientRect(); 

                setTimeout(() => {
                    cardE.style.left = `${endLeftE}%`;
                    cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                }, 50);
                c_cine_enemigo++;
            }
        }
    }, 600); 

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            if(callbackFinal) callbackFinal(); 
        };
        
        animCaja.appendChild(impactBtn);
    }, 9000); 
}

function playCinematicaCargaCuna(formacionInfo, callbackFinal) {
    const animCaja = document.getElementById("animacion-escena1");
    animCaja.style.display = "block";
    
    animCaja.innerHTML = `<h3 id='titulo-cinematica-carga' style="color:#ffaa00; text-shadow:0 0 10px #000; margin-top:30px; text-align:center; letter-spacing:3px; position:relative; z-index:300;">LA CARGA DIVINA</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    let elementosAnimar = [];
    let slots = formacionInfo.slots;
    let duracionCarga = 7000; 
    let cssTransition = `top ${duracionCarga}ms linear, left ${duracionCarga}ms linear, opacity 1s ease`;

    let hordaCompletaArr = [];
    let finalLeftColsEnemigos = ["70%", "80%", "90%"];
    let finalTopRowsEnemigos = ["10%", "28%", "46%", "64%", "82%"];

    for(let r=0; r < finalTopRowsEnemigos.length; r++) {
        for(let c=0; c < finalLeftColsEnemigos.length; c++) {
            let esPiqueroEnemigo = (r + c) % 2 === 0;
            hordaCompletaArr.push({
                top: finalTopRowsEnemigos[r],
                left: finalLeftColsEnemigos[c],
                img: esPiqueroEnemigo ? "enemigo_piquero.webp" : "enemigo.webp",
                id: `enemigo-cine-${r}-${c}`
            });
        }
    }
    
    hordaCompletaArr.forEach(e => {
        let card = document.createElement("div");
        card.className = "tropa-cinematica cinematica-enemigo"; 
        card.id = e.id;
        card.style.top = e.top;
        card.style.left = "88%"; 
        card.style.filter = "sepia(50%) brightness(0.5)"; 
        card.style.zIndex = "100";
        card.style.opacity = "0"; 

        card.innerHTML = `<img src="assets/img/personajes/enemigos/${e.img}">`;
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 
        elementosAnimar.push({ el: card, top: e.top, left: e.left, opacity: "1" });
    });

    let startPos = {
        "punta": { top: "80%", left: "-30%" },
        "media-arriba": { top: "10%", left: "-40%" },
        "media-abajo": { top: "60%", left: "-25%" },
        "trasera-arriba": { top: "30%", left: "-45%" },
        "trasera-abajo": { top: "90%", left: "-35%" }
    };

    let destPos = {
        "punta": { top: "43%", left: "55%" }, 
        "media-arriba": { top: "25%", left: "40%" },
        "media-abajo": { top: "61%", left: "40%" },
        "trasera-arriba": { top: "12%", left: "25%" }, 
        "trasera-abajo": { top: "74%", left: "25%" }  
    };

    for(let pos in slots) {
        let idTropa = slots[pos];
        if(idTropa) {
            let cab = jugador.tropas.find(t => t.idUnico === idTropa);
            if(cab) {
                let card = document.createElement("div");
                let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                card.className = `tropa-cinematica ${claseBorde}`;
                card.style.zIndex = "250";
                
                // Llamada DRY: Limpieza absoluta
                card.innerHTML = RenderCombate.htmlFichaCinematica(cab);

                let inicial = startPos[pos] || { top: "50%", left: "-20%" };
                card.style.top = inicial.top; 
                card.style.left = inicial.left;
                card.style.opacity = "1"; 
                animCaja.appendChild(card);
                card.getBoundingClientRect(); 

                let destino = destPos[pos] || { top: "50%", left: "50%" };
                elementosAnimar.push({ el: card, top: destino.top, left: destino.left });
            }
        }
    }

    let reservas = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0 && !Object.values(slots).includes(t.idUnico));
    reservas.forEach((cab, index) => {
        let card = document.createElement("div");
        let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150";
        
        // Llamada DRY: Limpieza absoluta
        card.innerHTML = RenderCombate.htmlFichaCinematica(cab);

        let verticalPos = 30 + (index * 15);
        card.style.top = `${verticalPos}%`; 
        card.style.left = "-25%"; 
        card.style.opacity = "1"; 
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 
        elementosAnimar.push({ el: card, top: `${verticalPos}%`, left: "5%" });
    });

    setTimeout(() => {
        elementosAnimar.forEach(anim => {
            anim.el.style.transition = cssTransition; 
            anim.el.style.top = anim.top;
            anim.el.style.left = anim.left;
            if(anim.opacity) anim.el.style.opacity = anim.opacity;
        });
    }, 50);

    setTimeout(() => {
        document.querySelectorAll('.cinematica-enemigo').forEach(e => {
            e.style.animation = "clashFlash 0.3s infinite alternate";
            e.style.filter = "sepia(0%) brightness(1)";
        });
    }, duracionCarga - 400);

    setTimeout(() => {
        document.getElementById('titulo-cinematica-carga').style.display = "none";
        
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn";
        impactBtn.innerText = "DEUS LO VULT !";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            
            document.getElementById("formacion-overlay").style.display = "none"; 
            
            if(callbackFinal) callbackFinal(); 
        };
        
        animCaja.appendChild(impactBtn);

    }, duracionCarga);
}