/* === CINE_BOSQUE.JS - CINEMÁTICAS EXCLUSIVAS DEL BUCLE EN EL BOSQUE === */

// =========================================================================
// EL ESCUDERO (HELPERS) - Funciones Privadas para no repetir código (DRY)
// =========================================================================
const CineBosqueHelpers = {
    prepararEscenario: function(tituloTxt, callbackFinal) {
        const animCaja = document.getElementById("animacion-escena1");
        if (!animCaja) { if(callbackFinal) callbackFinal(); return null; }

        animCaja.style.display = "block";
        animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
        animCaja.style.backgroundSize = "160%"; 
        animCaja.style.backgroundPosition = "left center";
        animCaja.style.overflow = "visible"; 
        animCaja.innerHTML = "";

        if (tituloTxt) {
            let titulo = document.createElement("h3");
            titulo.className = "txt-sagrado titulo-cinematica-bosque";
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
            if (ignorarNuevos && typeof EstadoBatalla !== 'undefined') {
                let esNuevoCruz = m.tipo === 'cross' && EstadoBatalla.caidosEnMuro && EstadoBatalla.caidosEnMuro.find(c => c.slotPos === m.slotPos);
                let esNuevoSkull = m.tipo === 'skull' && EstadoBatalla.enemigosCaidosEnMuro && EstadoBatalla.enemigosCaidosEnMuro.includes(m.slotPos);
                if (esNuevoCruz || esNuevoSkull) return;
            }

            let numSlot = parseInt(m.slotPos.split("-")[1]);
            let startLeft = m.tipo === 'cross' ? 52 : 57;
            let startTop = 6 + (numSlot * 16);
            
            let mark = document.createElement("div");
            mark.innerHTML = m.tipo === 'cross' ? "✝" : "💀";
            mark.className = `marcador-batalla ${m.tipo}-icon persistent-death-mark marcador-cinematica-bosque`;
            mark.style.top = `${startTop + 10}%`;
            mark.style.left = `${startLeft}%`;
            mark.style.fontSize = m.tipo === 'cross' ? '65px' : '20px';
            
            if (m.tipo === 'cross') mark.classList.add("cross-glow-bosque");
            else mark.classList.add("skull-glow-bosque");
            
            zonaBatalla.appendChild(mark);
        });
    },

    desplegarHordaCarga: function(zonaBatalla) {
        let rowsTopEnemigos = ["27%", "46%", "65%"]; 
        let enemyCardsMap = {}; 
        const ordenAsaltoFormar = [
            {r: 1, c: 0}, {r: 0, c: 0}, {r: 2, c: 0}, 
            {r: 1, c: 1}, {r: 0, c: 1}, {r: 2, c: 1}, 
            {r: 1, c: 2}, {r: 0, c: 2}, {r: 2, c: 2}  
        ];

        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                cardE.style.top = rowsTopEnemigos[r];
                
                let startLeft = 68 + (c * 10);
                let endLeft = 62 + (c * 10); 
                
                cardE.style.left = `${startLeft}%`;
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                zonaBatalla.appendChild(cardE);

                let posIndex = ordenAsaltoFormar.findIndex(pos => pos && pos.r === r && pos.c === c);
                enemyCardsMap[posIndex] = { card: cardE, startLeft: startLeft, finalLeft: endLeft, row: r };

                setTimeout(() => {
                    if (cardE.parentNode) {
                        cardE.style.transition = "left 1.5s linear, opacity 0.4s ease-out, filter 0.4s ease-out";
                        cardE.style.left = `${endLeft}%`;
                    }
                }, 50);
            }
        }
        return { enemyCardsMap, ordenAsaltoFormar, rowsTopEnemigos };
    },

    dibujarBallesterosEstocasticos: function(zonaBatalla) {
        let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
        ballesterosVivos.forEach((ballestero, index) => {
            let card = document.createElement("div");
            let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
            card.className = `tropa-cinematica ${claseBorde}`;
            card.style.zIndex = "150"; 
            card.innerHTML = typeof RenderCombate !== 'undefined' ? RenderCombate.htmlFichaCinematica(ballestero) : '';
            
            let row = index % 3; let col = Math.floor(index / 3); 
            card.style.top = `${27 + (row * 19)}%`; 
            card.style.left = `${34 - (col * 8.5)}%`;
            zonaBatalla.appendChild(card);
        });
        return ballesterosVivos;
    },

    ejecutarLluviaDeSaetas: function(zonaBatalla, ballesterosVivos, enemyCardsMap, ordenAsaltoFormar, bajasVisuales) {
        let duracionVuelo = 800; 
        let intervaloMaximo = 3200; 
        let pasoEscalonado = ballesterosVivos.length > 1 ? (intervaloMaximo / (ballesterosVivos.length - 1)) : 0;

        ballesterosVivos.forEach((ballestero, index) => {
            let card = document.createElement("div");
            let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
            card.className = `tropa-cinematica ${claseBorde}`;
            card.style.zIndex = "150"; 
            card.innerHTML = typeof RenderCombate !== 'undefined' ? RenderCombate.htmlFichaCinematica(ballestero) : '';

            let row = index % 3; let col = Math.floor(index / 3); 
            let baseTop = 27 + (row * 19);
            let baseLeft = 34 - (col * 8.5);

            card.style.top = `${baseTop}%`; 
            card.style.left = `${baseLeft}%`;
            zonaBatalla.appendChild(card);

            let delayDisparo = (index * pasoEscalonado) + (Math.random() * 200); 
            let esTiroMortalVisual = (index < bajasVisuales);
            let targetLeft, victimIdx;

            if (esTiroMortalVisual) {
                victimIdx = index; 
                let targetGridPos = ordenAsaltoFormar[victimIdx] || {r: 1, c: 0};
                targetLeft = 64 + (targetGridPos.c * 10);
            } else {
                targetLeft = 60 + (Math.random() * 15);
            }

            setTimeout(() => {
                if (!zonaBatalla.parentNode) return;

                if (typeof window.AudioManager !== 'undefined') window.AudioManager.playSFX('assets/audio/ballesta_disparo.mp3');
                else { let a = new Audio('assets/audio/ballesta_disparo.mp3'); a.volume = 0.7; a.play().catch(e=>e); }

                let saeta = document.createElement("img");
                saeta.src = "assets/img/ui/saeta.webp";
                saeta.className = "saeta-proyectil-css"; 
                saeta.style.setProperty('--sx', `${baseLeft}%`);
                saeta.style.setProperty('--ex', `${targetLeft}%`);
                saeta.style.top = `${baseTop + 5}%`; 
                zonaBatalla.appendChild(saeta);

                setTimeout(() => {
                    if (esTiroMortalVisual && enemyCardsMap[victimIdx]) {
                        let victima = enemyCardsMap[victimIdx];
                        
                        if (typeof window.AudioManager !== 'undefined') window.AudioManager.playLamento();

                        let skull = document.createElement("div");
                        skull.innerHTML = "💀";
                        skull.className = "marcador-batalla skull-icon persistent-death-mark skull-saeta-bosque";
                        
                        let targetGridPosSafe = ordenAsaltoFormar[victimIdx] || {r: 1, c: 0};
                        skull.style.top = `${27 + (targetGridPosSafe.r * 19)}%`;
                        skull.style.left = `${targetLeft}%`;
                        zonaBatalla.appendChild(skull);
                        
                        if (typeof window.registrarMarcadorPersistente === 'function') {
                            window.registrarMarcadorPersistente(`pica-slot-${targetGridPosSafe.r + 1}`, 'skull');
                        }

                        if (victima.card && victima.card.parentNode) {
                            victima.card.style.opacity = "0";
                            victima.card.style.filter = "brightness(0.1) grayscale(100%)";
                            setTimeout(() => { if (victima.card.parentNode) victima.card.remove(); }, 400);
                        }
                    }
                    if(saeta.parentNode) saeta.parentNode.removeChild(saeta);
                }, duracionVuelo);

            }, delayDisparo);
        });

        setTimeout(() => {
            if (!zonaBatalla.parentNode) return;
            Object.keys(enemyCardsMap).forEach(idx => {
                let numIdx = parseInt(idx);
                if (numIdx >= bajasVisuales && enemyCardsMap[numIdx].card && enemyCardsMap[numIdx].card.parentNode) {
                    let srv = enemyCardsMap[numIdx];
                    srv.card.style.transition = "none";
                    srv.card.style.left = `${srv.finalLeft}%`; 
                }
            });
        }, 1550);
    },

    programarBotonContinuar: function(animCaja, textoBtn, tiempoMs, callbackFinal) {
        setTimeout(() => {
            if (!animCaja.parentNode) return;
            let impactBtn = document.createElement('button');
            impactBtn.className = "impacto-divino-btn btn-continuar-bosque"; 
            impactBtn.innerText = textoBtn;
            
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
        }, tiempoMs); 
    }
};

// =========================================================================
// 1. CINEMÁTICA: FORMAR EL MURO 
// =========================================================================
window.playCinematicaFormarMuroBosque = function(resultadoFormacion, callbackFinal) {
    console.log("🎬 ANIMANDO: AVANCE DE HORDA Y RELEVO DE PICAS (BOSQUE)...");

    let escenario = CineBosqueHelpers.prepararEscenario("¡A LA LÍNEA!", callbackFinal);
    if (!escenario) return;
    let { animCaja, zonaBatalla } = escenario;

    CineBosqueHelpers.dibujarMarcadores(zonaBatalla);

    let { enemyCardsMap, ordenAsaltoFormar, rowsTopEnemigos } = CineBosqueHelpers.desplegarHordaCarga(zonaBatalla);

    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    let bajasVisuales = window.bajasBallesterosEsteTurno || 0;

    CineBosqueHelpers.ejecutarLluviaDeSaetas(zonaBatalla, ballesterosVivos, enemyCardsMap, ordenAsaltoFormar, bajasVisuales);

    // REFUERZOS DE EMERGENCIA (Específico de FormarMuro: Llenar vacío dejando mínimo 4)
    if (bajasVisuales >= 6) {
        let indicesRefuerzos = [];
        for (let i = 5; i < bajasVisuales; i++) {
            indicesRefuerzos.push(i);
        }
        setTimeout(() => {
            if (!zonaBatalla.parentNode) return;
            indicesRefuerzos.forEach(idx => {
                let targetGridPos = ordenAsaltoFormar[idx] || {r: 1, c: 2};
                let cardE = document.createElement("div");
                let imgE = (targetGridPos.r + targetGridPos.c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                cardE.style.top = rowsTopEnemigos[targetGridPos.r];
                cardE.style.left = `110%`; 
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                zonaBatalla.appendChild(cardE);

                let endLeft = 62 + (targetGridPos.c * 10);
                setTimeout(() => {
                    if (cardE.parentNode) {
                        cardE.style.transition = "left 1.2s ease-out";
                        cardE.style.left = `${endLeft}%`;
                    }
                }, 50);
            });
            window.bajasBallesterosEsteTurno = 5;
        }, 4500); 
    }

    // PIQUEROS ALIADOS (Usando resultadoFormacion)
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;
    
    let picasEnMuro = [];
    if(resultadoFormacion && resultadoFormacion.slots) {
        picasEnMuro = Object.values(resultadoFormacion.slots).filter(id => id !== null);
    }

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.innerHTML = typeof RenderCombate !== 'undefined' ? RenderCombate.htmlFichaCinematica(pica) : '';

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        let sideLeft = 48 - (col * 8) - (depth * 3); 
        let sideTop = isTop ? 2 - (depth * 3) : 92 + (depth * 3); 

        card.style.left = `${sideLeft}%`;
        card.style.top = `${sideTop}%`;
        card.style.zIndex = 200 - depth;
        zonaBatalla.appendChild(card);

        if (picasEnMuro.includes(pica.idUnico)) {
            let slotName = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === pica.idUnico);
            let numSlot = parseInt(slotName.split("-")[1]); 
            let centerLeft = 52; 
            let centerTop = 6 + (numSlot * 16); 

            setTimeout(() => {
                if (card.parentNode) {
                    card.style.transition = `left 1.2s ease-in-out`;
                    card.style.left = `${centerLeft}%`;

                    setTimeout(() => {
                        if (card.parentNode) {
                            card.style.transition = `left 1.2s ease-in-out, top 1.2s ease-out`;
                            card.style.top = `${centerTop}%`;
                            card.style.zIndex = 250 + numSlot; 
                        }
                    }, 1200);
                }
            }, 4500);

            if (window.marcadoresBosquePersistentes) {
                let cruz = window.marcadoresBosquePersistentes.find(m => m.slotPos === slotName && m.tipo === 'cross');
                if (cruz && cruz.nombre) {
                    let tiempoLlegada = 7200 + (Math.random() * 500); 

                    setTimeout(() => {
                        if (!zonaBatalla.parentNode) return;
                        let requiemText = window.RequiemsPool ? window.RequiemsPool.obtenerRequiem(cruz.nombre) : `¡Padre Santo, recibe a ${cruz.nombre}!`;
                        let globo = document.createElement("div");
                        
                        globo.className = "globo-requiem-cinematica";
                        globo.innerHTML = `💬 <b>${pica.nombre}:</b><br>"${requiemText}"`;
                        globo.style.left = "52%";
                        globo.style.top = `${centerTop - 6}%`;
                        
                        zonaBatalla.appendChild(globo);
                        setTimeout(() => globo.style.opacity = "1", 20);

                        setTimeout(() => {
                            if (globo.parentNode) {
                                globo.style.transition = "top 3.5s ease-out, opacity 3s ease-in 0.5s";
                                globo.style.top = `${centerTop - 25}%`; 
                                globo.style.opacity = "0"; 
                                setTimeout(() => { if(globo.parentNode) globo.parentNode.removeChild(globo); }, 4000);
                            }
                        }, 250); 
                    }, tiempoLlegada); 
                }
            }
        }
    });

    CineBosqueHelpers.programarBotonContinuar(animCaja, "DEUS LO VULT !", 7500, callbackFinal);
};

// =========================================================================
// 2. CINEMÁTICA: REPLIEGUE A LOS FLANCOS
// =========================================================================
window.playCinematicaRepliegueBosque = function(callbackFinal) {
    console.log("🎬 ANIMANDO: REPLIEGUE A LOS FLANCOS EN L (BOSQUE)...");
    
    let escenario = CineBosqueHelpers.prepararEscenario("", callbackFinal);
    if (!escenario) return;
    let { animCaja, zonaBatalla } = escenario;

    CineBosqueHelpers.dibujarMarcadores(zonaBatalla, true); 
    CineBosqueHelpers.dibujarBallesterosEstocasticos(zonaBatalla);

    // LÓGICA DE REPLIEGUE (Piqueros)
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
        card.innerHTML = typeof RenderCombate !== 'undefined' ? RenderCombate.htmlFichaCinematica(pica) : '';

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        let finalLeft = 48 - (col * 8) - (depth * 3); 
        let finalTop = isTop ? 2 - (depth * 3) : 92 + (depth * 3); 
        
        let isVanguardia = picaVanguardiaIds.includes(pica.idUnico);

        if (isVanguardia) {
            let posObj = EstadoBatalla.tropasVivas.find(tv => tv.idUnico === pica.idUnico);
            let numSlot = 1;
            if (posObj && posObj.slotPos) numSlot = parseInt(posObj.slotPos.split("-")[1]);
            
            card.style.left = `52%`;
            card.style.top = `${6 + (numSlot * 16)}%`;
            card.style.zIndex = 250 + numSlot;

            setTimeout(() => {
                if (card.parentNode) {
                    card.style.transition = `top 2s ease-in-out`;
                    card.style.top = `${finalTop}%`;

                    setTimeout(() => {
                        if (card.parentNode) {
                            card.style.transition = `top 2s ease-in-out, left 2.5s ease-out`;
                            card.style.left = `${finalLeft}%`;
                            card.style.zIndex = 200 - depth;
                        }
                    }, 2000);
                }
            }, 500);

        } else {
            card.style.left = `${finalLeft}%`;
            card.style.top = `${finalTop}%`;
            card.style.zIndex = 200 - depth;
        }
        zonaBatalla.appendChild(card);
    });

    // MARCADORES FRESCOS DEL TURNO (Cruces y Calaveras desvaneciéndose)
    let muertosVanguardia = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.caidosEnMuro) ? EstadoBatalla.caidosEnMuro : [];
    muertosVanguardia.forEach(muerto => {
        let card = document.createElement("div");
        let claseBorde = muerto.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "100"; 
        card.innerHTML = `<img src="${muerto.img}"><div class="unidad-hp-combate">🖤🖤</div><div class="unidad-nombre-aleatorio">${muerto.nombre}</div>`;
        
        let numSlot = 1;
        if (muerto.slotPos) numSlot = parseInt(muerto.slotPos.split("-")[1]); 
        let startLeft = 52; let startTop = 6 + (numSlot * 16);

        card.style.left = `${startLeft}%`; card.style.top = `${startTop}%`;
        card.style.opacity = "1"; card.style.filter = "none"; 
        zonaBatalla.appendChild(card);

        let cross = document.createElement("div");
        cross.innerHTML = "✝";
        cross.className = "marcador-batalla cross-icon cross-muertos-bosque";
        cross.style.left = `${startLeft + 4}%`; cross.style.top = `${startTop + 10}%`;
        zonaBatalla.appendChild(cross);

        setTimeout(() => {
            if (card.parentNode) {
                card.style.transition = "opacity 2.5s ease-out, filter 2.5s ease-out";
                card.style.filter = "grayscale(100%) sepia(30%) brightness(0.4)";
                card.style.opacity = "0"; 
                if (cross.parentNode) cross.style.opacity = "1"; 
            }
        }, 500);
    });

    let enemigosCaidos = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.enemigosCaidosEnMuro) ? EstadoBatalla.enemigosCaidosEnMuro : [];
    enemigosCaidos.forEach(slotPos => {
        let numSlot = 1;
        if (slotPos) numSlot = parseInt(slotPos.split("-")[1]); 
        let startLeft = 57; let startTop = 6 + (numSlot * 16);

        let skull = document.createElement("div");
        skull.innerHTML = "💀";
        skull.className = "marcador-batalla skull-icon persistent-death-mark skull-caidos-bosque";
        skull.style.left = `${startLeft}%`; skull.style.top = `${startTop + 10}%`;
        zonaBatalla.appendChild(skull);

        setTimeout(() => { if (skull.parentNode) skull.style.opacity = "1"; }, 500);
    });

    // LÓGICA DE ENEMIGOS RETROCEDIENDO
    let bajasBallestas = window.bajasBallesterosEsteTurno || 0;
    let bajasPicas = enemigosCaidos.length; 
    let muertosEnemigosRepliegue = Math.min(9, bajasBallestas + bajasPicas);
    
    const ordenEliminacionRepliegue = [
        {r: 1, c: 0}, {r: 0, c: 0}, {r: 2, c: 0}, 
        {r: 1, c: 1}, {r: 0, c: 1}, {r: 2, c: 1}, 
        {r: 1, c: 2}, {r: 0, c: 2}, {r: 2, c: 2}  
    ];
    let rowsTopEnemigos = ["27%", "46%", "65%"]; 

    let grillaInicial = [
        [ {vivo: true}, {vivo: true}, {vivo: true} ],
        [ {vivo: true}, {vivo: true}, {vivo: true} ],
        [ {vivo: true}, {vivo: true}, {vivo: true} ]
    ];
    for (let i = 0; i < muertosEnemigosRepliegue; i++) {
        let pos = ordenEliminacionRepliegue[i];
        if(pos) grillaInicial[pos.r][pos.c].vivo = false;
    }

    let grillaFinal = [ [null, null, null], [null, null, null], [null, null, null] ];
    for (let r = 0; r < 3; r++) {
        let colDest = 0;
        for (let c = 0; c < 3; c++) {
            if (grillaInicial[r][c].vivo) {
                grillaFinal[r][colDest] = { origR: r, origC: c };
                colDest++;
            }
        }
    }

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (grillaInicial[r][c].vivo) {
                let destC = c;
                for (let tc = 0; tc < 3; tc++) {
                    if (grillaFinal[r][tc] && grillaFinal[r][tc].origC === c) { destC = tc; break; }
                }

                let cardE = document.createElement("div");
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                
                let startTop = rowsTopEnemigos[r];
                let startLeft = `${62 + (c * 10)}%`;
                let endLeft = `${68 + (destC * 10)}%`; 

                cardE.style.top = startTop;
                cardE.style.left = startLeft;
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                zonaBatalla.appendChild(cardE);

                if (c !== destC || startLeft !== endLeft) {
                    setTimeout(() => {
                        if (cardE.parentNode) {
                            cardE.style.transition = "left 2s ease-in-out";
                            cardE.style.left = endLeft;
                        }
                    }, 500); 
                }
            }
        }
    }

    let vaciosFinales = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (grillaFinal[r][c] === null) vaciosFinales.push({ r, c });
        }
    }

    vaciosFinales.forEach((posVacios) => {
        let cardE = document.createElement("div");
        let imgE = (posVacios.r + posVacios.c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
        cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
        cardE.style.zIndex = "100"; 
        
        let endTop = rowsTopEnemigos[posVacios.r];
        let endLeft = `${68 + (posVacios.c * 10)}%`; 

        cardE.style.top = endTop;
        cardE.style.left = `110%`; 
        cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
        zonaBatalla.appendChild(cardE);

        setTimeout(() => {
            if (cardE.parentNode) {
                cardE.style.transition = "left 3.5s ease-out"; 
                cardE.style.left = endLeft;
            }
        }, 2600);
    });

    CineBosqueHelpers.programarBotonContinuar(animCaja, "DEUS LO VULT !", 5000, callbackFinal);

    if (typeof EstadoBatalla !== 'undefined') {
        EstadoBatalla.caidosEnMuro = [];
        EstadoBatalla.enemigosCaidosEnMuro = [];
        EstadoBatalla.hordaMuertosActuales = 0; 
        window.bajasBallesterosEsteTurno = 0; 
    }
};

// =========================================================================
// 3. CINEMÁTICA: VICTORIA POR SOBRECARGA DE SAETAS (OVERKILL FINAL)
// =========================================================================
window.playCinematicaVictoriaPorSaetasBosque = function(callbackFinal) {
    console.log("🎬 ANIMANDO: OVERKILL DE SAETAS Y RELLENO INFINITO (BOSQUE)...");

    let escenario = CineBosqueHelpers.prepararEscenario("¡LA HORDA NO TIENE FIN!", callbackFinal);
    if (!escenario) return;
    let { animCaja, zonaBatalla } = escenario;

    CineBosqueHelpers.dibujarMarcadores(zonaBatalla);

    let { enemyCardsMap, ordenAsaltoFormar, rowsTopEnemigos } = CineBosqueHelpers.desplegarHordaCarga(zonaBatalla);

    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    let bajasVisuales = window.bajasBallesterosEsteTurno || 0;

    CineBosqueHelpers.ejecutarLluviaDeSaetas(zonaBatalla, ballesterosVivos, enemyCardsMap, ordenAsaltoFormar, bajasVisuales);

    // PIQUEROS ALIADOS (Específico de Victoria: Vain Vanguardia Automática)
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let vanguardiaAuto = piquerosVivos.slice(0, 4); 
    let picasEnMuro = vanguardiaAuto.map(p => p.idUnico);
    
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.innerHTML = typeof RenderCombate !== 'undefined' ? RenderCombate.htmlFichaCinematica(pica) : '';

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        let sideLeft = 48 - (col * 8) - (depth * 3); 
        let sideTop = isTop ? 2 - (depth * 3) : 92 + (depth * 3); 

        card.style.left = `${sideLeft}%`;
        card.style.top = `${sideTop}%`;
        card.style.zIndex = 200 - depth;
        zonaBatalla.appendChild(card);

        if (picasEnMuro.includes(pica.idUnico)) {
            let numSlot = picasEnMuro.indexOf(pica.idUnico) + 1;
            let centerLeft = 52; 
            let centerTop = 6 + (numSlot * 16); 

            setTimeout(() => {
                if (card.parentNode) {
                    card.style.transition = `left 1.2s ease-in-out`;
                    card.style.left = `${centerLeft}%`;

                    setTimeout(() => {
                        if (card.parentNode) {
                            card.style.transition = `left 1.2s ease-in-out, top 1.2s ease-out`;
                            card.style.top = `${centerTop}%`;
                            card.style.zIndex = 250 + numSlot; 
                        }
                    }, 1200);
                }
            }, 4500);
        }
    });

    // LLENADO MASIVO DE EMERGENCIA INFINITO (Específico de Victoria)
    let vaciosInmediatos = Math.min(9, bajasVisuales);
    if (vaciosInmediatos > 0) {
        setTimeout(() => {
            if (!zonaBatalla.parentNode) return;
            console.log(`⚠️ LLENADO MASIVO: La horda repone a los ${vaciosInmediatos} caídos...`);
            
            for (let i = 0; i < vaciosInmediatos; i++) {
                let targetGridPos = ordenAsaltoFormar[i] || {r: 1, c: 2};
                let cardE = document.createElement("div");
                let imgE = (targetGridPos.r + targetGridPos.c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                cardE.style.top = rowsTopEnemigos[targetGridPos.r];
                cardE.style.left = `110%`; 
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                zonaBatalla.appendChild(cardE);

                let endLeft = 62 + (targetGridPos.c * 10);
                setTimeout(() => {
                    if (cardE.parentNode) {
                        cardE.style.transition = "left 2.5s ease-out";
                        cardE.style.left = `${endLeft}%`;
                    }
                }, 50);
            }
        }, 6000); 
    }

    CineBosqueHelpers.programarBotonContinuar(animCaja, "SOBREVIVIMOS (Continuar)", 9500, callbackFinal);
};