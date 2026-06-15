/* === CINE_SACRIFICIO.JS - CINEMÁTICA EXCLUSIVA DE LA ÚLTIMA LÍNEA (WAYPOINTS AI V4 - FINAL REPARADO) === */

const CineSacrificioHelpers = {
    // ----------------------------------------------------------------------
    // 1. FÁBRICAS DE COMPONENTES Y HELPER DE ANIMACIONES (NIVEL 1 DRY)
    // ----------------------------------------------------------------------
    crearFichaVisual: function(ballestero, esEspadachin, top, left) {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde} sac-z-150`;
        card.innerHTML = typeof RenderCombate !== 'undefined' ? RenderCombate.htmlFichaCinematica(ballestero) : '';

        let imgEl = card.querySelector("img");
        if (imgEl) {
            if (esEspadachin) {
                imgEl.src = ballestero.clase === 'noble' ? "assets/img/personajes/aliados/ballestero_noblesp.webp" : "assets/img/personajes/aliados/ballestero_mercenarioesp.webp";
            } else {
                imgEl.src = ballestero.clase === 'noble' ? "assets/img/personajes/aliados/ballestero_noble.webp" : "assets/img/personajes/aliados/ballestero_mercenario.webp";
            }
            imgEl.className = ballestero.clase === 'noble' ? "sac-img-normal" : "sac-img-espejo";
        }

        if (top !== undefined && left !== undefined) {
            card.style.top = `${top}%`;
            card.style.left = `${left}%`;
        }
        return { card, imgEl };
    },

    actualizarFichaEspadachin: function(imgEl, clase) {
        if (!imgEl) return;
        if (clase === 'noble') {
            imgEl.src = "assets/img/personajes/aliados/ballestero_noblesp.webp";
            imgEl.className = "sac-img-normal";
        } else {
            imgEl.src = "assets/img/personajes/aliados/ballestero_mercenarioesp.webp";
            imgEl.className = "sac-img-espejo";
        }
    },

    animarPaso: function(elemento, delayMs, transicionClass, estilosCss) {
        setTimeout(() => {
            if (elemento && elemento.parentNode) {
                if (transicionClass) DirectorCinematico.setTransition(elemento, transicionClass);
                for (let prop in estilosCss) {
                    elemento.style[prop] = estilosCss[prop];
                }
            }
        }, delayMs);
    },

    animarDesenvaine: function(imgEl, delayMs) {
        setTimeout(() => {
            if (imgEl) {
                imgEl.classList.add("sac-fx-desenvaine");
                setTimeout(() => {
                    imgEl.classList.remove("sac-fx-desenvaine");
                    imgEl.classList.add("sac-fx-desenvaine-reset");
                }, 300);
            }
        }, delayMs);
    },

    // ----------------------------------------------------------------------
    // 2. HERRAMIENTAS DEL ESCENARIO
    // ----------------------------------------------------------------------
    prepararEscenarioSacrificio: function(tituloTxt, callbackFinal) {
        const animCaja = document.getElementById("animacion-escena1");
        if (!animCaja) { if(callbackFinal) callbackFinal(); return null; }

        animCaja.classList.remove("sac-escenario-reset");
        animCaja.classList.add("sac-escenario-activo");
        animCaja.innerHTML = "";

        // FIX TÁCTICO: Inyectamos CSS dinámico para forzar el botón hacia la franja gris inferior
        let styleId = "fix-btn-sacrificio";
        if (!document.getElementById(styleId)) {
            let style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = ".impacto-divino-btn.btn-continuar-bosque { bottom: -75px !important; }";
            document.head.appendChild(style);
        }

        if (tituloTxt) {
            let titulo = document.createElement("h3");
            titulo.className = "txt-hereje titulo-cinematica-bosque"; 
            titulo.innerText = tituloTxt;
            animCaja.appendChild(titulo);
        }

        let zonaBatalla = document.createElement("div");
        zonaBatalla.id = "zona-batalla-anim";
        zonaBatalla.className = "zona-batalla-cinematica-bosque";
        animCaja.appendChild(zonaBatalla);

        if (typeof window.forzarHalosCinematicas === 'function') window.forzarHalosCinematicas(zonaBatalla);

        let niebla = document.createElement("div");
        niebla.className = "efecto-neblina niebla-cinematica-bosque";
        zonaBatalla.appendChild(niebla);

        return { animCaja, zonaBatalla };
    },

    dibujarMarcadores: function(zonaBatalla, ignorarNuevos = false) {
        if (!window.marcadoresBosquePersistentes) return;
        
        window.marcadoresBosquePersistentes.forEach(m => {
            if(!m.slotPos) return;

            if (ignorarNuevos && typeof EstadoBatalla !== 'undefined') {
                let esNuevoCruz = m.tipo === 'cross' && EstadoBatalla.caidosEnMuro && EstadoBatalla.caidosEnMuro.find(c => c.slotPos === m.slotPos);
                let esNuevoSkull = m.tipo === 'skull' && EstadoBatalla.enemigosCaidosEnMuro && EstadoBatalla.enemigosCaidosEnMuro.includes(m.slotPos);
                if (esNuevoCruz || esNuevoSkull) return; 
            }

            let numSlot = parseInt(m.slotPos.split("-")[1]) - 1; 
            let startLeft = m.tipo === 'cross' ? 40 : 46;
            let startTop = 27 + (numSlot * 19);

            let mark = document.createElement("div");
            mark.innerHTML = m.tipo === 'cross' ? "✝" : "💀";
            mark.className = `marcador-batalla ${m.tipo}-icon persistent-death-mark marcador-cinematica-bosque`;
            
            if (m.tipo === 'cross') mark.classList.add("cross-glow-bosque", "sac-cross-size");
            else mark.classList.add("skull-glow-bosque", "sac-skull-size");

            mark.style.top = `${startTop + 10}%`;
            mark.style.left = `${startLeft}%`;

            zonaBatalla.appendChild(mark);
        });
    },

    desplegarHordaCarga: function(zonaBatalla, bajasVisuales) {
        let rowsTopEnemigos = ["27%", "46%", "65%"]; 
        let enemyCardsMap = {}; 
        const ordenAsaltoFormar = [
            {r: 1, c: 0}, {r: 0, c: 0}, {r: 2, c: 0}, 
            {r: 1, c: 1}, {r: 0, c: 1}, {r: 2, c: 1}, 
            {r: 1, c: 2}, {r: 0, c: 2}, {r: 2, c: 2}  
        ];

        let muertosTotal = (typeof EstadoBatalla !== 'undefined') ? EstadoBatalla.hordaMuertosActuales : 0;
        let vivosHorda = Math.max(0, 9 - muertosTotal);
        let countVivos = 0;

        let colShift = Math.floor(bajasVisuales / 3);
        if (colShift > 2) colShift = 2; 

        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                if(countVivos < vivosHorda) {
                    let cardE = document.createElement("div");
                    let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                    cardE.className = "tropa-cinematica cinematica-enemigo-relevo sac-z-100"; 
                    cardE.style.top = rowsTopEnemigos[r];
                    
                    let startLeft = 75 + (c * 10);
                    let endLeft = 48 + ((c - colShift) * 10); 
                    
                    cardE.style.left = `${startLeft}%`;
                    cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" class="sac-img-espejo">`;
                    zonaBatalla.appendChild(cardE);

                    let posIndex = ordenAsaltoFormar.findIndex(pos => pos && pos.r === r && pos.c === c);
                    enemyCardsMap[posIndex] = { card: cardE, startLeft: startLeft, finalLeft: endLeft, row: r };

                    CineSacrificioHelpers.animarPaso(cardE, 50, "sac-trans-carga", { left: `${endLeft}%` });
                    countVivos++;
                }
            }
        }
        return { enemyCardsMap, ordenAsaltoFormar, rowsTopEnemigos, colShift };
    },

    ejecutarLluviaDeSaetas: function(zonaBatalla, ballesterosData, enemyCardsMap, ordenAsaltoFormar, bajasVisuales) {
        let duracionVuelo = 800; 
        let intervaloMaximo = 1500; 
        let pasoEscalonado = ballesterosData.length > 1 ? (intervaloMaximo / (ballesterosData.length - 1)) : 0;
        let bajasRestantes = bajasVisuales;

        ballesterosData.forEach((bData, i) => {
            let delayDisparo = (i * pasoEscalonado) + (Math.random() * 200); 
            let esTiroMortalVisual = (bajasRestantes > 0);
            if (esTiroMortalVisual) bajasRestantes--;

            let targetLeft, victimIdx;

            if (esTiroMortalVisual) {
                victimIdx = i; 
                let targetGridPos = ordenAsaltoFormar[victimIdx] || {r: 1, c: 0};
                targetLeft = 55 + (targetGridPos.c * 5); 
            } else {
                targetLeft = 60 + (Math.random() * 15);
            }

            setTimeout(() => {
                if (!zonaBatalla.parentNode) return;

                if (typeof window.AudioManager !== 'undefined') window.AudioManager.playSFX('assets/audio/ballesta_disparo.mp3');
                
                let saeta = document.createElement("img");
                saeta.src = "assets/img/ui/saeta.webp";
                saeta.className = "saeta-proyectil-css"; 
                saeta.style.setProperty('--sx', `${bData.baseLeft}%`);
                saeta.style.setProperty('--ex', `${targetLeft}%`);
                saeta.style.top = `${bData.baseTop + 5}%`; 
                zonaBatalla.appendChild(saeta);

                setTimeout(() => {
                    if (esTiroMortalVisual && enemyCardsMap[victimIdx]) {
                        let victima = enemyCardsMap[victimIdx];
                        
                        if (typeof window.AudioManager !== 'undefined' && typeof window.AudioManager.playLamento === 'function') window.AudioManager.playLamento();

                        let skull = document.createElement("div");
                        skull.innerHTML = "💀";
                        skull.className = "marcador-batalla skull-icon persistent-death-mark skull-saeta-bosque";
                        
                        let targetGridPosSafe = ordenAsaltoFormar[victimIdx] || {r: 1, c: 0};
                        skull.style.top = `${27 + (targetGridPosSafe.r * 19)}%`;
                        skull.style.left = `${targetLeft}%`;
                        zonaBatalla.appendChild(skull);
                        
                        if (typeof window.registrarMarcadorPersistente === 'function') {
                            window.registrarMarcadorPersistente(`sacrificio-${targetGridPosSafe.r + 1}`, 'skull');
                        }

                        if (victima.card && victima.card.parentNode) {
                            victima.card.classList.add("sac-fx-muerte-saeta");
                            setTimeout(() => { if (victima.card.parentNode) victima.card.remove(); }, 400);
                        }
                    }
                    if(saeta.parentNode) saeta.parentNode.removeChild(saeta);
                }, duracionVuelo);

            }, delayDisparo);
        });
    },

    animarEnemigosRepliegue: function(zonaBatalla) {
        let bajasBallestas = window.bajasBallesterosEsteTurno || 0;
        let enemigosCaidos = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.enemigosCaidosEnMuro) ? EstadoBatalla.enemigosCaidosEnMuro : [];
        let bajasPicas = enemigosCaidos.length; 
        let muertosTurno = Math.min(9, bajasBallestas + bajasPicas);

        const ordenEliminacion = [ {r: 1, c: 0}, {r: 0, c: 0}, {r: 2, c: 0}, {r: 1, c: 1}, {r: 0, c: 1}, {r: 2, c: 1}, {r: 1, c: 2}, {r: 0, c: 2}, {r: 2, c: 2} ];

        let grillaInicial = [ [{vivo:true}, {vivo:true}, {vivo:true}], [{vivo:true}, {vivo:true}, {vivo:true}], [{vivo:true}, {vivo:true}, {vivo:true}] ];
        for (let i = 0; i < muertosTurno; i++) { let pos = ordenEliminacion[i]; if(pos) grillaInicial[pos.r][pos.c].vivo = false; }

        let grillaFinal = [ [null, null, null], [null, null, null], [null, null, null] ];
        for (let r = 0; r < 3; r++) {
            let colDest = 0;
            for (let c = 0; c < 3; c++) { if (grillaInicial[r][c].vivo) { grillaFinal[r][colDest] = { origC: c }; colDest++; } }
        }

        let rowsTopEnemigos = ["27%", "46%", "65%"]; 

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (grillaInicial[r][c].vivo) {
                    let destC = c;
                    for (let tc = 0; tc < 3; tc++) { if (grillaFinal[r][tc] && grillaFinal[r][tc].origC === c) { destC = tc; break; } }

                    let cardE = document.createElement("div");
                    let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                    cardE.className = "tropa-cinematica cinematica-enemigo-relevo sac-z-100";
                    cardE.style.top = rowsTopEnemigos[r];
                    cardE.style.left = `${48 + (c * 10)}%`; 
                    cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" class="sac-img-espejo">`;
                    zonaBatalla.appendChild(cardE);

                    CineSacrificioHelpers.animarPaso(cardE, 500, "sac-trans-repliegue-enemigo-1", { left: `${68 + (destC * 10)}%` });
                }
            }
        }

        let vaciosFinales = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) { if (grillaFinal[r][c] === null) vaciosFinales.push({ r, c }); }
        }

        vaciosFinales.forEach((posVacios) => {
            let cardE = document.createElement("div");
            let imgE = (posVacios.r + posVacios.c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
            cardE.className = "tropa-cinematica cinematica-enemigo-relevo sac-z-100"; 
            cardE.style.top = rowsTopEnemigos[posVacios.r];
            cardE.style.left = `110%`; 
            cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" class="sac-img-espejo">`;
            zonaBatalla.appendChild(cardE);

            CineSacrificioHelpers.animarPaso(cardE, 2600, "sac-trans-repliegue-enemigo-2", { left: `${68 + (posVacios.c * 10)}%` });
        });

        if (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.enemigosCaidosEnMuro) {
            EstadoBatalla.enemigosCaidosEnMuro.forEach(slotPos => {
                let numSlot = parseInt(slotPos.split("-")[1]) - 1;
                let skull = document.createElement("div");
                skull.innerHTML = "💀";
                skull.className = "marcador-batalla skull-icon persistent-death-mark skull-caidos-bosque";
                skull.style.left = `46%`; skull.style.top = `${27 + (numSlot * 19) + 10}%`;
                zonaBatalla.appendChild(skull);
                setTimeout(() => { if (skull.parentNode) skull.style.opacity = "1"; }, 500);
            });
        }
    }
};

// =========================================================================
// COREOGRAFÍA 1: AVANCE MILITAR INTELIGENTE (ESTRICTO LÍNEAS RECTAS)
// =========================================================================
window.playCinematicaSacrificioBosque = function(resultadoFormacion, callbackFinal) {
    console.group("🎬 DEBUG CINE: ANIMANDO DESPLIEGUE MILITAR (LÍNEAS RECTAS)");

    let esPrimerTurno = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.turnoActual === 1);
    if (esPrimerTurno || !window.sacrificioCurrentLayout) {
        window.sacrificioCurrentLayout = {};
        let todosBallesterosVivosInit = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
        todosBallesterosVivosInit.forEach((b, index) => {
            let row = index % 3; let col = Math.floor(index / 3);
            window.sacrificioCurrentLayout[b.idUnico] = { row, col, baseTop: 27 + (row * 19), baseLeft: 34 - (col * 8.5) };
        });
    }

    let escenario = CineSacrificioHelpers.prepararEscenarioSacrificio("", callbackFinal);
    if (!escenario) return;
    let { animCaja, zonaBatalla } = escenario;

    CineSacrificioHelpers.dibujarMarcadores(zonaBatalla);

    let bajasVisuales = window.bajasBallesterosEsteTurno || 0;
    let { enemyCardsMap, ordenAsaltoFormar, rowsTopEnemigos, colShift } = CineSacrificioHelpers.desplegarHordaCarga(zonaBatalla, bajasVisuales);

    let todosBallesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    let ballesterosData = [];

    todosBallesterosVivos.forEach((ballestero, index) => {
        let layout = window.sacrificioCurrentLayout[ballestero.idUnico];
        if (!layout) {
            let row = index % 3; let col = Math.floor(index / 3);
            layout = { row, col, baseTop: 27 + (row * 19), baseLeft: 34 - (col * 8.5) };
            window.sacrificioCurrentLayout[ballestero.idUnico] = layout;
        }

        let { card, imgEl } = CineSacrificioHelpers.crearFichaVisual(ballestero, false, layout.baseTop, layout.baseLeft);
        zonaBatalla.appendChild(card);
        ballesterosData.push({ idUnico: ballestero.idUnico, nombre: ballestero.nombre, clase: ballestero.clase, card, baseTop: layout.baseTop, baseLeft: layout.baseLeft, row: layout.row, col: layout.col, imgEl });
    });

    window.sacrificioOriginalLayout = ballesterosData.map(b => ({
        idUnico: b.idUnico, baseTop: b.baseTop, baseLeft: b.baseLeft, row: b.row, col: b.col
    }));

    CineSacrificioHelpers.ejecutarLluviaDeSaetas(zonaBatalla, ballesterosData, enemyCardsMap, ordenAsaltoFormar, bajasVisuales);

    if (bajasVisuales >= 7) {
        setTimeout(() => {
            if (!zonaBatalla.parentNode) return;
            for (let i = 6; i < bajasVisuales; i++) {
                let targetGridPos = ordenAsaltoFormar[i] || {r: 1, c: 2};
                let cardE = document.createElement("div");
                let imgE = (targetGridPos.r + targetGridPos.c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo sac-z-100"; 
                cardE.style.top = rowsTopEnemigos[targetGridPos.r];
                cardE.style.left = `110%`; 
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" class="sac-img-espejo">`;
                zonaBatalla.appendChild(cardE);

                let endLeft = 48 + ((targetGridPos.c - colShift) * 10);
                CineSacrificioHelpers.animarPaso(cardE, 50, "sac-trans-refuerzo", { left: `${endLeft}%` });
            }
            window.bajasBallesterosEsteTurno = 6;
        }, 1800); 
    }

    let picasEnMuro = [];
    if(resultadoFormacion && resultadoFormacion.slots) picasEnMuro = Object.values(resultadoFormacion.slots).filter(id => id !== null);
    
    let martiresData = ballesterosData.filter(d => picasEnMuro.includes(d.idUnico));
    let nonMartiresData = ballesterosData.filter(d => !picasEnMuro.includes(d.idUnico));

    let nombresArr = martiresData.map(m => m.nombre);
    let nombresStr = nombresArr.length > 2 ? nombresArr.slice(0, -1).join(", ") + " y " + nombresArr[nombresArr.length - 1] : nombresArr.join(" y ");

    setTimeout(() => {
        if (!zonaBatalla.parentNode || martiresData.length === 0) return;
        let textoGrito = `💬 <b style="color: #ffaa00;">Barón Andrew:</b><br>"¡${nombresStr} al frente! ¡Que la espada del Arcángel corte la maleza! ¡GUERRA, GUERRA CONTRA LUCIFER!"`;
        DirectorCinematico.lanzarGlobo(zonaBatalla, textoGrito, "2%", "20%", "sac-globo-lider");
        
        martiresData.forEach(martir => {
            setTimeout(() => { CineSacrificioHelpers.actualizarFichaEspadachin(martir.imgEl, martir.clase); }, 1000);
            CineSacrificioHelpers.animarDesenvaine(martir.imgEl, 1000);
        });
    }, 500); 

    let grid = [[], [], []];
    ballesterosData.forEach(b => { 
        grid[b.row][b.col] = picasEnMuro.includes(b.idUnico) ? 'martir' : 'reserve'; 
    });

    let isHole = (r, c) => {
        if (c < 0 || c > 4 || r < 0 || r > 2) return false;
        let occupant = grid[r][c];
        return occupant === undefined || occupant === 'martir'; 
    };

    let colsNeedingCompression = [];

    let tieneRequiemsReales = martiresData.some(martir => {
        let slotNameVirtual = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === martir.idUnico);
        let cruzVirtual = (window.marcadoresBosquePersistentes || []).find(m => m.slotPos === slotNameVirtual && m.tipo === 'cross');
        return (cruzVirtual && cruzVirtual.nombre);
    });

    // =========================================================
    // CREACIÓN DE WAYPOINTS (SIN BÚSQUEDA DIAGONAL)
    // =========================================================
    martiresData.sort((a, b) => { 
        return a.col !== b.col ? a.col - b.col : (a.row === 1 ? 2 : 1) - (b.row === 1 ? 2 : 1); 
    });

    martiresData.forEach((martir, i) => {
        martir.slotName = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === martir.idUnico);
        martir.numSlot = parseInt(martir.slotName.split("-")[1]);
        martir.centerTop = 27 + ((martir.numSlot - 1) * 19);
        martir.centerLeft = 40; 
        
        martir.delayPhase = martir.col; // Sincronizado por columna
        let steps = [];
        let currLeft = martir.baseLeft;
        let currTop = martir.baseTop;

        if (martir.row === 0) {
            steps.push({ top: 10, dur: '08' }); currTop = 10;
            steps.push({ left: 38, dur: '15' }); currLeft = 38;
        } else if (martir.row === 2) {
            steps.push({ top: 84, dur: '08' }); currTop = 84;
            steps.push({ left: 38, dur: '15' }); currLeft = 38;
        } else if (martir.row === 1) {
            let straightClear = true;
            for (let c = 0; c < martir.col; c++) { 
                if (grid[1][c] === 'reserve') { straightClear = false; break; } 
            }

            if (straightClear) {
                steps.push({ left: 38, dur: '15' }); currLeft = 38;
            } else {
                // TÁCTICA ESTRICTA: Solo mira en su PROPIA columna hacia arriba o hacia abajo.
                if (isHole(0, martir.col)) {
                    steps.push({ top: 10, dur: '08' }); currTop = 10;
                    steps.push({ left: 38, dur: '15' }); currLeft = 38;
                } else if (isHole(2, martir.col)) {
                    steps.push({ top: 84, dur: '08' }); currTop = 84;
                    steps.push({ left: 38, dur: '15' }); currLeft = 38;
                } else {
                    // Ambos ocupados: Fuerza compresión (Pide permiso al de arriba de su misma columna)
                    steps.push({ top: 10, dur: '08' }); currTop = 10;
                    steps.push({ left: 38, dur: '15' }); currLeft = 38;
                    colsNeedingCompression.push({ col: martir.col, row: 0 }); 
                    martir.delayPhase = martir.col + 1; // Sincroniza con el que se quita del camino
                }
            }
        }

        if (currTop !== martir.centerTop) steps.push({ top: martir.centerTop, dur: '10' });
        if (currLeft !== martir.centerLeft) steps.push({ left: martir.centerLeft, dur: '08' });

        martir.steps = steps;
    });

    let startTime = 2500; 

    colsNeedingCompression.forEach(comp => {
        nonMartiresData.forEach(nm => {
            if (nm.col === comp.col && nm.row === comp.row) {
                CineSacrificioHelpers.animarPaso(nm.card, startTime, "sac-trans-left-08-inout", { left: `${nm.baseLeft - 4.5}%` });
            }
        });
    });

    // EJECUTOR DE WAYPOINTS DINÁMICO
    let maxAnimTime = startTime;
    martiresData.forEach((martir) => {
        let t = startTime + (martir.delayPhase * 700); 
        
        martir.steps.forEach(step => {
            let cssProps = { zIndex: 250 + martir.numSlot };
            let transClass = "sac-trans-left-08-inout"; 

            if (step.left !== undefined) { 
                cssProps.left = `${step.left}%`; 
                transClass = `sac-trans-left-${step.dur}-inout`; 
            }
            if (step.top !== undefined) { 
                cssProps.top = `${step.top}%`; 
                transClass = `sac-trans-top-${step.dur}-inout`; 
            }

            CineSacrificioHelpers.animarPaso(martir.card, t, transClass, cssProps);
            
            let durMs = parseInt(step.dur) * 100;
            t += durMs + 50; 
        });

        if (window.marcadoresBosquePersistentes) {
            let cruz = window.marcadoresBosquePersistentes.find(m => m.slotPos === martir.slotName && m.tipo === 'cross');
            if (cruz && cruz.nombre) {
                setTimeout(() => {
                    if (!zonaBatalla.parentNode) return;
                    let requiemText = window.RequiemsPool ? window.RequiemsPool.obtenerRequiem(cruz.nombre) : `¡Padre Santo, recibe a ${cruz.nombre}!`;
                    let textoGlobo = `💬 <b style="color: #ffaa00;">${martir.nombre}:</b><br>"${requiemText}"`;
                    DirectorCinematico.lanzarGlobo(zonaBatalla, textoGlobo, `${martir.centerLeft}%`, `${martir.centerTop - 6}%`, "sac-globo-requiem");
                }, t + 200 + (Math.random() * 500)); 
            }
        }
        if (t > maxAnimTime) maxAnimTime = t;
    });

    colsNeedingCompression.forEach(comp => {
        nonMartiresData.forEach(nm => {
            if (nm.col === comp.col && nm.row === comp.row) {
                CineSacrificioHelpers.animarPaso(nm.card, maxAnimTime + 200, "sac-trans-left-10-inout", { left: `${nm.baseLeft}%` });
            }
        });
    });

    let tiempoBotonAtaque = maxAnimTime + (tieneRequiemsReales ? 4000 : 1500);
    DirectorCinematico.crearBotonContinuar(animCaja, "QUE DIOS LOS RECIBA", tiempoBotonAtaque, callbackFinal, {}, "btn-continuar-bosque sac-btn-estilo");
    console.groupEnd();
};

// =========================================================================
// COREOGRAFÍA 2: REPLIEGUE INTELIGENTE Y BALANCE DE ESCUADRA (LÍNEAS RECTAS)
// =========================================================================
window.playCinematicaRepliegueSacrificio = function(callbackFinal) {
    console.group("🎬 DEBUG CINE: ANIMANDO REPLIEGUE (WAYPOINTS AI V4 - FINAL)");

    let escenario = CineSacrificioHelpers.prepararEscenarioSacrificio("", callbackFinal);
    if (!escenario) return;
    let { animCaja, zonaBatalla } = escenario;

    CineSacrificioHelpers.dibujarMarcadores(zonaBatalla, true); 
    
    // RESTAURADO: Enemigos que sobrevivieron / refuerzos
    CineSacrificioHelpers.animarEnemigosRepliegue(zonaBatalla);

    let vanguardiaIds = [];
    if (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.tropasVivas) vanguardiaIds = EstadoBatalla.tropasVivas.map(p => p.idUnico).filter(id => id != null);

    let todosBallesteros = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);

    let rowCounts = {0:0, 1:0, 2:0};
    let livingSortedByRow = [...todosBallesteros].sort((a, b) => {
        let lA = window.sacrificioCurrentLayout ? window.sacrificioCurrentLayout[a.idUnico] : null;
        let lB = window.sacrificioCurrentLayout ? window.sacrificioCurrentLayout[b.idUnico] : null;
        return (lA ? lA.col : 0) - (lB ? lB.col : 0); 
    });

    let horizontalTargets = {};
    livingSortedByRow.forEach(b => {
        let r = window.sacrificioCurrentLayout && window.sacrificioCurrentLayout[b.idUnico] ? window.sacrificioCurrentLayout[b.idUnico].row : 0;
        let c = rowCounts[r]++;
        horizontalTargets[b.idUnico] = { targetCol: c, targetLeft: 34 - (c * 8.5), targetRow: r, targetTop: 27 + (r * 19) };
    });

    let finalTargets = JSON.parse(JSON.stringify(horizontalTargets));
    let rowArrays = [[], [], []];
    todosBallesteros.forEach(b => {
        let t = horizontalTargets[b.idUnico];
        rowArrays[t.targetRow].push({ id: b.idUnico, col: t.targetCol, row: t.targetRow });
    });
    rowArrays.forEach(r => r.sort((a,b) => a.col - b.col));

    let balancingMoves = [];
    while (true) {
        let lengths = rowArrays.map(r => r.length);
        let maxLen = Math.max(...lengths); let minLen = Math.min(...lengths);
        if (maxLen - minLen <= 1) break; 

        let lIdx = lengths.lastIndexOf(maxLen); let sIdx = lengths.indexOf(minLen); 
        let soldierToMove = rowArrays[lIdx].pop();
        let nRow = sIdx; let nCol = minLen; 

        balancingMoves.push({ id: soldierToMove.id, toRow: nRow, toCol: nCol, targetTop: 27 + (nRow * 19), targetLeft: 34 - (nCol * 8.5) });
        soldierToMove.col = nCol; soldierToMove.row = nRow;
        rowArrays[sIdx].push(soldierToMove);
    }

    rowArrays.forEach((rArray, rIdx) => {
        rArray.forEach(item => {
            finalTargets[item.id] = { finalRow: rIdx, finalCol: item.col, finalTop: 27 + (rIdx * 19), finalLeft: 34 - (item.col * 8.5) };
        });
    });

    let ballesterosData = [];

    todosBallesteros.forEach((ballestero, index) => {
        let isMartir = vanguardiaIds.includes(ballestero.idUnico);
        let layout = window.sacrificioCurrentLayout ? window.sacrificioCurrentLayout[ballestero.idUnico] : null;
        let origCol = layout ? layout.col : Math.floor(index / 3);
        let origRow = layout ? layout.row : index % 3;
        let origTop = layout ? layout.baseTop : 27 + (origRow * 19);
        let origLeft = layout ? layout.baseLeft : 34 - (origCol * 8.5);

        let { card } = CineSacrificioHelpers.crearFichaVisual(ballestero, isMartir, origTop, origLeft);
        ballesterosData.push({ 
            idUnico: ballestero.idUnico, nombre: ballestero.nombre, card, 
            origTop, origLeft, origRow, origCol,
            targetLeft: horizontalTargets[ballestero.idUnico].targetLeft, targetCol: horizontalTargets[ballestero.idUnico].targetCol, 
            isMartir 
        });
    });

    let martiresData = ballesterosData.filter(d => d.isMartir);
    let nonMartiresData = ballesterosData.filter(d => !d.isMartir);

    if (martiresData.length > 0) {
        setTimeout(() => {
            if (!zonaBatalla.parentNode) return;
            let textoRepliegue = `💬 <b style="color: #ffaa00;">Barón Andrew:</b><br>"¡Las saetas han sido bendecidas y están prestas! ¡Retroceded a la formación, que el Juicio Divino caerá sobre ellos!"`;
            DirectorCinematico.lanzarGlobo(zonaBatalla, textoRepliegue, "2%", "20%", "sac-globo-lider");
        }, 200); 
    }

    nonMartiresData.forEach(nm => {
        nm.card.style.zIndex = "150";
        zonaBatalla.appendChild(nm.card);
    });

    let grid = [[], [], []];
    ballesterosData.forEach(b => { 
        grid[b.origRow][b.origCol] = b.isMartir ? 'martir' : 'reserve'; 
    });

    let isHole = (r, c) => {
        if (c < 0 || c > 4 || r < 0 || r > 2) return false;
        let occupant = grid[r][c];
        return occupant === undefined || occupant === 'martir'; 
    };

    let colsNeedingCompression = [];

    // TÁCTICA MEJORADA: Los de más a la derecha entran primero. 
    // SI coinciden en columna, EL CENTRAL (Fila 1) TIENE PRIORIDAD para entrar al túnel primero.
    martiresData.sort((a, b) => {
        if (a.origCol !== b.origCol) return b.origCol - a.origCol;
        let priorityA = (a.origRow === 1) ? 0 : 1;
        let priorityB = (b.origRow === 1) ? 0 : 1;
        return priorityA - priorityB;
    });

    // =========================================================
    // CREACIÓN DE WAYPOINTS (SIN BÚSQUEDA DIAGONAL)
    // =========================================================
    martiresData.forEach((martir, i) => {
        let posObj = EstadoBatalla.tropasVivas.find(tv => tv.idUnico === martir.idUnico);
        let numSlot = posObj && posObj.slotPos ? parseInt(posObj.slotPos.split("-")[1]) : 1;
        martir.frontLeft = 40; martir.frontTop = 27 + ((numSlot - 1) * 19);
        martir.numSlot = numSlot;
        martir.delayPhase = i;

        let steps = [];
        let currLeft = martir.frontLeft;
        let currTop = martir.frontTop;

        steps.push({ left: 38, dur: '06' }); currLeft = 38;

        if (martir.origRow === 0) {
            steps.push({ top: 10, dur: '08' }); currTop = 10;
            steps.push({ left: martir.origLeft, dur: '12' }); currLeft = martir.origLeft;
            steps.push({ top: martir.origTop, dur: '08' }); currTop = martir.origTop;
        } else if (martir.origRow === 2) {
            steps.push({ top: 84, dur: '08' }); currTop = 84;
            steps.push({ left: martir.origLeft, dur: '12' }); currLeft = martir.origLeft;
            steps.push({ top: martir.origTop, dur: '08' }); currTop = martir.origTop;
        } else if (martir.origRow === 1) {
            let straightClear = true;
            for (let c = 0; c < martir.origCol; c++) { 
                if (grid[1][c] === 'reserve') { straightClear = false; break; } 
            }

            if (straightClear) {
                steps.push({ top: 46, dur: '08' }); currTop = 46;
                steps.push({ left: martir.origLeft, dur: '12' }); currLeft = martir.origLeft;
            } else {
                // TÁCTICA ESTRICTA: Solo mira en su PROPIA columna hacia arriba o hacia abajo.
                if (isHole(0, martir.origCol)) {
                    steps.push({ top: 10, dur: '08' }); currTop = 10;
                    steps.push({ left: martir.origLeft, dur: '12' }); currLeft = martir.origLeft;
                    steps.push({ top: martir.origTop, dur: '08' }); currTop = martir.origTop;
                } else if (isHole(2, martir.origCol)) {
                    steps.push({ top: 84, dur: '08' }); currTop = 84;
                    steps.push({ left: martir.origLeft, dur: '12' }); currLeft = martir.origLeft;
                    steps.push({ top: martir.origTop, dur: '08' }); currTop = martir.origTop;
                } else {
                    // Empuje de la fila 0 para hacer espacio
                    steps.push({ top: 10, dur: '08' }); currTop = 10;
                    steps.push({ left: martir.origLeft, dur: '12' }); currLeft = martir.origLeft;
                    steps.push({ top: martir.origTop, dur: '08' }); currTop = martir.origTop;
                    colsNeedingCompression.push({ col: martir.origCol, row: 0 });
                }
            }
        }
        martir.steps = steps;
    });

    let startTimeSurvivors = 1500; 
    let maxAnimTime = startTimeSurvivors;

    // EJECUTOR DE WAYPOINTS DINÁMICO (Retorno)
    martiresData.forEach((martir) => {
        martir.card.style.left = `${martir.frontLeft}%`;
        martir.card.style.top = `${martir.frontTop}%`;
        martir.card.style.zIndex = 250 + martir.numSlot;
        zonaBatalla.appendChild(martir.card);

        let t = startTimeSurvivors + (martir.delayPhase * 700); 
        let execLeft = martir.frontLeft; 

        if (colsNeedingCompression.find(c => c.col === martir.origCol)) {
            let comp = colsNeedingCompression.find(c => c.col === martir.origCol);
            let staticUnit = nonMartiresData.find(nm => nm.origCol === comp.col && nm.origRow === comp.row);
            if (staticUnit) {
                CineSacrificioHelpers.animarPaso(staticUnit.card, t, "sac-trans-left-08-inout", { left: `${staticUnit.origLeft - 4.5}%` });
            }
        }

        martir.steps.forEach(step => {
            if (step.left !== undefined) execLeft = step.left; 

            let cssProps = { zIndex: 250 + martir.numSlot };
            
            if (step.left !== undefined && step.left !== 38 && step.left !== 40) {
                cssProps.zIndex = 150 - martir.origCol;
            }
            if (step.top !== undefined && step.left === undefined && execLeft !== 38 && execLeft !== 40) {
                cssProps.zIndex = 150 - martir.origCol;
            }

            let transClass = "sac-trans-left-08-inout"; 
            if (step.left !== undefined) { 
                cssProps.left = `${step.left}%`; 
                transClass = `sac-trans-left-${step.dur}-inout`; 
            }
            if (step.top !== undefined) { 
                cssProps.top = `${step.top}%`; 
                transClass = `sac-trans-top-${step.dur}-inout`; 
            }

            CineSacrificioHelpers.animarPaso(martir.card, t, transClass, cssProps);
            
            let durMs = parseInt(step.dur) * 100;
            t += durMs + 50; 
        });

        if (colsNeedingCompression.find(c => c.col === martir.origCol)) {
            let comp = colsNeedingCompression.find(c => c.col === martir.origCol);
            let staticUnit = nonMartiresData.find(nm => nm.origCol === comp.col && nm.origRow === comp.row);
            if (staticUnit) {
                CineSacrificioHelpers.animarPaso(staticUnit.card, t + 200, "sac-trans-left-08-inout", { left: `${staticUnit.origLeft}%` });
            }
        }

        if (t > maxAnimTime) maxAnimTime = t;
    });

    // FASE 3: CIERRE DE FILAS HORIZONTAL
    let rankCloseTime = maxAnimTime + 500;
    let someoneMovedHorizontal = false;
    ballesterosData.forEach((b) => {
        if (b.origLeft !== b.targetLeft) {
            CineSacrificioHelpers.animarPaso(b.card, rankCloseTime, "sac-trans-left-08-inout", { left: `${b.targetLeft}%`, zIndex: 150 - b.targetCol });
            someoneMovedHorizontal = true;
        }
    });

    // FASE 4: BALANCEO VERTICAL
    let verticalBalancingStartTime = rankCloseTime + (someoneMovedHorizontal ? 1000 : 200);

    balancingMoves.forEach((move, i) => {
        let bData = ballesterosData.find(b => b.idUnico === move.id);
        if (!bData) return;
        let mStart = verticalBalancingStartTime + (i * 1500); 
        
        CineSacrificioHelpers.animarPaso(bData.card, mStart, "sac-trans-left-06-inout", { left: "-5%", zIndex: 100 });
        CineSacrificioHelpers.animarPaso(bData.card, mStart + 700, "sac-trans-top-06-inout", { top: `${move.targetTop}%` });
        CineSacrificioHelpers.animarPaso(bData.card, mStart + 1400, "sac-trans-left-06-inout", { left: `${move.targetLeft}%`, zIndex: 150 - move.toCol });
    });

    // CREACIÓN MANUAL DE CAÍDOS
    let muertosVanguardia = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.caidosEnMuro) ? EstadoBatalla.caidosEnMuro : [];
    muertosVanguardia.forEach(muerto => {
        let numSlot = muerto.slotPos ? parseInt(muerto.slotPos.split("-")[1]) : 1; 
        let startLeft = 40; let startTop = 27 + ((numSlot - 1) * 19);

        let card = document.createElement("div");
        let claseBorde = muerto.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde} sac-z-100`; 
        card.innerHTML = `<img src="${muerto.img}"><div class="unidad-hp-combate">🖤🖤</div><div class="unidad-nombre-aleatorio">${muerto.nombre}</div>`;
        card.style.left = `${startLeft}%`; 
        card.style.top = `${startTop}%`;
        zonaBatalla.appendChild(card);

        let cross = document.createElement("div");
        cross.innerHTML = "✝";
        cross.className = "marcador-batalla cross-icon cross-muertos-bosque";
        cross.style.left = `${startLeft + 4}%`; cross.style.top = `${startTop + 10}%`;
        zonaBatalla.appendChild(cross);

        setTimeout(() => {
            if (card.parentNode) {
                card.classList.add("sac-fx-muerte-desvanecer");
                if (cross.parentNode) cross.style.opacity = "1"; 
            }
        }, 500);
    });

    let tiempoBotonRetirada = balancingMoves.length > 0 
        ? verticalBalancingStartTime + (balancingMoves.length * 1500) + 500 
        : verticalBalancingStartTime + 500;

    DirectorCinematico.crearBotonContinuar(animCaja, "PREPARAR BALLESTAS", tiempoBotonRetirada, () => {
        todosBallesteros.forEach(b => {
            let layout = window.sacrificioCurrentLayout[b.idUnico];
            let finalPos = finalTargets[b.idUnico];
            if (layout && finalPos) {
                layout.col = finalPos.finalCol; layout.row = finalPos.finalRow;
                layout.baseLeft = finalPos.finalLeft; layout.baseTop = finalPos.finalTop;
            }
        });
        console.log("🛡️ Memoria Táctica actualizada con el Cierre de Filas y Reacomodo Vertical.");

        if (typeof EstadoBatalla !== 'undefined') {
            EstadoBatalla.caidosEnMuro = []; EstadoBatalla.enemigosCaidosEnMuro = [];
            EstadoBatalla.hordaMuertosActuales = 0; window.bajasBallesterosEsteTurno = 0; 
        }
        console.groupEnd();
        if (callbackFinal) callbackFinal();
    }, {}, "btn-continuar-bosque sac-btn-estilo");
};