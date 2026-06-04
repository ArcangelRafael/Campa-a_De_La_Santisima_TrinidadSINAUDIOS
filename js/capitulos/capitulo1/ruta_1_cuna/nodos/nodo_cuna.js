/* === NODO_CUNA.JS - LÓGICA EXCLUSIVA DE CABALLERÍA PESADA === */

function iniciarCombateCuna(formacion) {
    return new Promise(resolve => {
        EstadoBatalla.limpiar(); 
        EstadoBatalla.tipoCombate = "cuna";
        window.marcadoresBatalla = []; 

        EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
        EstadoBatalla.maxTurnos = CONSTANTES_TACTICAS.CUNA_MAX_TURNOS;
        
        EstadoBatalla.callback = (victoria, bajas) => {
            if (victoria) {
                document.getElementById("formacion-overlay").style.display = "flex"; 
                document.getElementById("formacion-tablero").style.display = "flex"; 
                
                let divDialogo = document.createElement("div");
                storyArea.appendChild(divDialogo);
                MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
                    personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", 
                    nombrePersonaje: "Sir Alexandro", alineacion: "izq", 
                    bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                    texto: `"¡LA LÍNEA HA CAÍDO! ¡CABALGUEN HACIA LA GLORIA! ¡DEUS LO VULT!"`, 
                    claseTexto: "txt-lugarteniente"
                });

                storyArea.scrollTop = storyArea.scrollHeight;
                animarAvanceCuna(true); 
                
                setTimeout(() => resolve({victoria, bajas}), 5000); 
            } else {
                resolve({victoria, bajas});
            }
        };
        
        EstadoBatalla.tropasVivas = [
            { row: 0, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, posNombre: "el ala izquierda", slotPos: "trasera-arriba", idUnico: formacion.slots["trasera-arriba"] },
            { row: 1, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, posNombre: "el flanco izquierdo", slotPos: "media-arriba", idUnico: formacion.slots["media-arriba"] },
            { row: 2, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_PUNTA, posNombre: "la vanguardia", slotPos: "punta", idUnico: formacion.slots["punta"] },
            { row: 3, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, posNombre: "el flanco derecho", slotPos: "media-abajo", idUnico: formacion.slots["media-abajo"] },
            { row: 4, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, posNombre: "el ala derecha", slotPos: "trasera-abajo", idUnico: formacion.slots["trasera-abajo"] }
        ];

        EstadoBatalla.enemigos = GeneradorHordas.generarMatrizCuna();

        storyArea.innerHTML = "";

        let styleId = "cuna-compact-style";
        if (!document.getElementById(styleId)) {
            let style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = `
                .modo-combate #formacion-tablero { justify-content: center !important; gap: 0px !important; }
                .modo-combate #zona-aliada { margin-right: 0 !important; z-index: 2; }
                .modo-combate #zona-enemiga { margin-left: -10px !important; z-index: 3; }

                .modo-combate #zona-reservas {
                    display: grid !important;
                    grid-template-rows: repeat(5, 75px) !important;
                    grid-auto-columns: 75px !important; 
                    grid-auto-flow: column !important;
                    column-gap: -20px !important; 
                    direction: rtl !important; 
                    margin-right: -5px !important; 
                    padding-right: 0 !important;
                    transform: translateX(75px); 
                    border-right: none !important;
                    z-index: 1;
                    transition: transform 0.8s ease-in-out !important; 
                }
                
                .modo-combate #zona-reservas > div:nth-child(5n + 1) { grid-row: 3 !important; transform: translateX(0px); z-index: 15; } 
                .modo-combate #zona-reservas > div:nth-child(5n + 2) { grid-row: 2 !important; transform: translateX(-20px); z-index: 14; } 
                .modo-combate #zona-reservas > div:nth-child(5n + 3) { grid-row: 4 !important; transform: translateX(-20px); z-index: 14; } 
                .modo-combate #zona-reservas > div:nth-child(5n + 4) { grid-row: 1 !important; transform: translateX(-40px); z-index: 13; } 
                .modo-combate #zona-reservas > div:nth-child(5n + 0) { grid-row: 5 !important; transform: translateX(-40px); z-index: 13; } 

                .modo-combate .caballero-reserva {
                    direction: ltr !important; opacity: 1 !important; filter: none !important; 
                }
                .modo-combate .caballero-reserva.tropa-noble { border-color: #ffaa00 !important; box-shadow: 0 0 10px rgba(255, 170, 0, 0.4) !important; }
                .modo-combate .caballero-reserva.tropa-mercenaria { border-color: #888 !important; }

                .skull-icon, .marcador-batalla.skull-icon {
                    color: #ffffff !important;
                    text-shadow: 0 0 15px #ff0000, 0 0 30px #ff0000 !important;
                    opacity: 0.85 !important;
                }
                .cross-icon, .marcador-batalla.cross-icon {
                    color: #ffd700 !important;
                    text-shadow: 0 0 15px #ffaa00, 0 0 30px #ffaa00 !important;
                    opacity: 0.9 !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        prepararBotonTurno(); 
        animarDialogoAvanceCuna();
    });
}

window.reordenarReservasCuna = function() {
    let resZona = document.getElementById("zona-reservas");
    if (resZona) {
        let rowMap = [3, 2, 4, 1, 5]; 
        Array.from(resZona.children).forEach((c, i) => {
            c.style.setProperty("grid-row", String(rowMap[i % 5]), "important");
        });
        if (typeof actualizarAvanceReservas === "function") {
            actualizarAvanceReservas();
        }
    }
};

window.actualizarAvanceReservas = function() {
    let resZona = document.getElementById("zona-reservas");
    if (!resZona || resZona.classList.contains("ruptura-masiva")) return; 
    
    let colIniciales = { 
        0: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, 
        1: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, 
        2: CONSTANTES_TACTICAS.COLUMNA_INICIO_PUNTA, 
        3: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, 
        4: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS 
    };

    let avances = EstadoBatalla.tropasVivas.map(pos => {
        if(pos.idUnico) {
            let tropaReal = jugador.tropas.find(t => t.idUnico === pos.idUnico);
            // FIX TÁCTICO: ignorarMuerto también excluye a los muertos momentáneos del cálculo
            if (tropaReal && tropaReal.hp > 0 && !pos.ignorarMuerto) {
                return pos.col - colIniciales[pos.row];
            }
        }
        return -1;
    }).filter(v => v >= 0);
    
    // =====================================================================
    // EL FRENO DE LA RESERVA (Lógica del Último Hombre)
    // Cambiamos Math.max por Math.min para que la reserva nunca rebase
    // al soldado más lento (atorado) de la formación de vanguardia.
    // =====================================================================
    let avanceBloque = avances.length > 0 ? Math.min(...avances) : 0;
    
    let offsetBaseReservas = 75; 
    let nuevoTranslateX = offsetBaseReservas + (avanceBloque * 85); 
    
    resZona.style.setProperty("transform", `translateX(${nuevoTranslateX}px)`, "important");
};

async function animarDialogoAvanceCuna() {
    let divSeparador = document.createElement("div");
    divSeparador.innerHTML = "<br><br>";
    storyArea.appendChild(divSeparador);

    let divDialogo = document.createElement("div");
    divDialogo.id = `ancla-turno-${EstadoBatalla.turnoActual}`; 
    storyArea.appendChild(divDialogo);

    setTimeout(() => {
        divDialogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", 
        nombrePersonaje: "Sir Alexandro", alineacion: "izq", 
        bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡El clamor de las trompetas nos llama a la gloria! ¡Turno ${EstadoBatalla.turnoActual}! ¡A LA CARGA!"`, 
        claseTexto: "txt-lugarteniente"
    });

    animarAvanceCuna();
}

function animarAvanceCuna(esVictoriaFinal = false) {
    document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
    
    requestAnimationFrame(() => {
        document.getElementById("formacion-overlay").style.display = "flex"; 
        
        let tablero = document.getElementById("formacion-tablero");
        tablero.style.display = "flex"; 
        tablero.classList.add("modo-combate");

        if (typeof gestionarEfectosVisuales === "function") {
            gestionarEfectosVisuales(tablero, "cuna");
        }

        document.getElementById("btn-iniciar-formacion").style.display = "none";
        document.getElementById("btn-ver-reporte").style.display = "none";
        
        if (esVictoriaFinal) {
            document.getElementById("titulo-formacion").innerText = `⚔️ VICTORIA: LA LÍNEA HA CAÍDO ⚔️`;
            
            let divDialogo = document.createElement("div");
            storyArea.appendChild(divDialogo);
            MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
                personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", 
                nombrePersonaje: "Sir Alexandro", alineacion: "izq", 
                bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡ESTÁN ROTOS! ¡PASEN POR ENCIMA DE ELLOS! ¡HACIA EL HORIZONTE!"`, 
                claseTexto: "txt-lugarteniente"
            });
            storyArea.scrollTop = storyArea.scrollHeight;
        } else {
            document.getElementById("titulo-formacion").innerText = `⚔️ COMBATE: TURNO ${EstadoBatalla.turnoActual} ⚔️`;
        }

        restaurarVisualesCombate();

        if (typeof reordenarReservasCuna === "function") {
            reordenarReservasCuna();
        }

        if (!esVictoriaFinal) {
            EstadoBatalla.logTurnoGlobal = [];
            EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual));
            EstadoBatalla.accionesPendientes = [];
        }
        
        let domUpdates = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
                    if (pos.col >= 3) return;
                    
                    let nextCol = pos.col + 1;
                    let accion = { tropa, pos, nextCol, tipo: "avance", enemigo: null };

                    if (nextCol >= 0 && nextCol <= 2) {
                        let enemigo = EstadoBatalla.enemigos[pos.row][nextCol];
                        if (enemigo && !enemigo.muerto) {
                            accion.tipo = "choque";
                            accion.enemigo = enemigo;
                        }
                    } else if (nextCol === 3) { accion.tipo = "ruptura"; } 
                    else if (nextCol > 3) { accion.tipo = "avance_libre"; }
                    
                    if (!esVictoriaFinal) EstadoBatalla.accionesPendientes.push(accion);
                    
                    if (esVictoriaFinal) accion.tipo = "avance_libre";
                    
                    domUpdates.push({ accion, idUnico: tropa.idUnico, row: pos.row, nextCol });
                }
            }
        });

        domUpdates.forEach(update => {
            let knightEl = document.getElementById("drag-" + update.idUnico);
            if (knightEl) {
                knightEl.classList.remove("caballero-ocupando");
                let visualCol = update.nextCol > 3 ? 3 : update.nextCol;
                let targetId = (visualCol < 0) ? `aliado-${update.row}-${visualCol}` : `enemigo-${update.row}-${visualCol}`;
                let targetSlot = document.getElementById(targetId);
                
                if(targetSlot) {
                    targetSlot.appendChild(knightEl);
                    knightEl.style.display = "block";
                    if (update.accion.tipo === "choque") {
                        knightEl.classList.add("caballero-atacando"); 
                        targetSlot.classList.add("en-combate"); 
                    } else if (update.accion.tipo === "ruptura" || update.accion.tipo === "avance_libre") {
                        let arrastrarReservas = false;
                        
                        if (esVictoriaFinal && (update.row === 0 || update.row === 4)) {
                            arrastrarReservas = true;
                        } else if (update.row === 0 || update.row === 4) {
                            let retaguardiasVivas = EstadoBatalla.tropasVivas.filter(p => (p.row === 0 || p.row === 4) && p.idUnico && !p.ignorarMuerto);
                            let todasRotas = retaguardiasVivas.every(p => {
                                let actualUpdate = domUpdates.find(d => d.idUnico === p.idUnico);
                                let colFutura = actualUpdate ? actualUpdate.nextCol : p.col;
                                return colFutura >= 3 || esVictoriaFinal; 
                            });
                            arrastrarReservas = todasRotas;
                        }

                        setTimeout(() => {
                            if (typeof animarRupturaLinea === "function") {
                                animarRupturaLinea(update.idUnico, arrastrarReservas);
                            }
                        }, 50);
                    } else {
                        knightEl.classList.add("caballero-ocupando");
                    }
                }
            }
        });
        
        if (!esVictoriaFinal) {
            document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesCuna;
            document.getElementById("btn-tirar-dados").style.display = "inline-block";
        } else {
            setTimeout(() => {
                document.getElementById("formacion-overlay").style.display = "none";
                if (typeof evaluarContinuacionBatalla === "function") evaluarContinuacionBatalla();
            }, 4500);
        }
    });
}

function resolverDadosVisualesCuna() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe();
    let huboCombates = false;
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    let wantsToAdvance = { 0: false, 1: false, 2: false, 3: false, 4: false };

    EstadoBatalla.accionesPendientes.forEach(acc => {
        let { tropa, pos, nextCol, tipo, enemigo } = acc;
        let knightEl = document.getElementById("drag-" + tropa.idUnico);
        let visualCol = nextCol > 3 ? 3 : nextCol;
        let targetSlotId = `enemigo-${pos.row}-${visualCol}`;
        let targetSlot = document.getElementById(targetSlotId);

        if (tipo === "choque") {
            huboCombates = true;
            let combatSlot = document.getElementById(`aliado-${pos.row}-${pos.col}`);
            if(combatSlot) combatSlot.classList.remove("en-combate"); 
            
            let poderAtk = GestorEstado.evaluarPoderTropa(tropa, 'atk');
            let dadoGracia = (jugador.liderazgo <= -50) ? 0 : tirarDado();
            let dadoFuria = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            
            let pAtk = poderAtk.neto + dadoGracia + infoFe.mod;
            let pDef = enemigo.def + dadoFuria;

            let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
            let classMod = (infoFe.mod >= 0) ? "mensaje-sistema" : "txt-hereje";
            if (infoFe.mod === 0) classMod = "txt-sagrado";

            let idBc = 'bc_' + Math.random().toString(36).substr(2,9);
            let idBcMelee = idBc + '_melee';
            let phase1Cons = "";
            let hasMelee = false;

            if (pAtk > pDef) {
                enemigo.muerto = true;
                EstadoBatalla.bajasEnemigas++;
                phase1Cons = `<span class="mensaje-sistema">¡IMPACTO LETAL! La carga abate al infiel.</span>`;
                wantsToAdvance[pos.row] = true;
                window.marcadoresBatalla.push({tipo: 'skull', row: pos.row, col: nextCol});
            } else {
                hasMelee = true;
                phase1Cons = `<span class="txt-hereje">¡Resistencia enemiga! Duelo cuerpo a cuerpo inminente.</span>`;
            }

            let dataRender = {
                posNombre: pos.posNombre, tropaNombre: tropa.nombre, enemigoNombre: enemigo.nombre,
                atkBase: poderAtk.base, stringHerido: poderAtk.stringEfectos, dadoGracia, classMod, signoMod, infoFeNombre: infoFe.nombre, pAtk,
                defBase: enemigo.def, dadoFuria, pDef, phase1Cons, idBc, hasMelee, idBcMelee, autoCombat
            };

            let logStr = RenderCombate.htmlChoqueCuna(dataRender);

            if (hasMelee) {
                let dadoGracia2 = (jugador.liderazgo <= -50) ? 0 : tirarDado();
                let dadoFuria2 = (jugador.liderazgo >= 126) ? 0 : tirarDado();
                let pAtk2 = poderAtk.neto + dadoGracia2 + infoFe.mod;
                let pAtkEnemigo = enemigo.atk + dadoFuria2;
                let phase2Cons = "";

                if (pAtk2 > pAtkEnemigo) {
                    enemigo.muerto = true;
                    EstadoBatalla.bajasEnemigas++;
                    phase2Cons = `<span class="mensaje-sistema">¡${tropa.nombre} se impone en la refriega!</span>`;
                    wantsToAdvance[pos.row] = true;
                    window.marcadoresBatalla.push({tipo: 'skull', row: pos.row, col: nextCol});
                } else {
                    tropa.hp--;
                    phase2Cons = `<span class="txt-hereje">¡RECHAZADO! ${tropa.nombre} es herido.</span>`;
                    if(tropa.hp <= 0) {
                        phase2Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL CAMPO! ${tropa.nombre} ha muerto.</div>`;
                        window.marcadoresBatalla.push({tipo: 'cross', row: pos.row, col: pos.col});
                    }
                }

                let dataMelee = {
                    tropaNombre: tropa.nombre, atkBase: poderAtk.base, stringHerido: poderAtk.stringEfectos, dadoGracia2, classMod, signoMod, 
                    infoFeNombre: infoFe.nombre, pAtk2, enemigoNombre: enemigo.nombre, atkEnemigoBase: enemigo.atk, 
                    dadoFuria2, pAtkEnemigo, phase2Cons, idBcMelee, autoCombat
                };

                logStr += RenderCombate.htmlMeleeCuna(dataMelee);
            }
            EstadoBatalla.logTurnoGlobal.push(logStr);

        } else if (tipo === "avance" || tipo === "ruptura" || tipo === "avance_libre") {
            wantsToAdvance[pos.row] = true;
            if (tipo === "avance") EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlAvanceLibre(tropa.nombre));
        }
    });

    if (huboCombates || Object.values(wantsToAdvance).some(v => v)) {
        document.querySelectorAll('#zona-reservas .tropa-draggable').forEach(r => {
            r.classList.add('caballero-atacando');
            setTimeout(() => r.classList.remove('caballero-atacando'), 400); 
        });
    }

    let isAlive = (r) => {
        let p = EstadoBatalla.tropasVivas.find(x => x.row === r);
        return p && p.idUnico && jugador.tropas.find(t => t.idUnico === p.idUnico)?.hp > 0;
    };

    [0, 1, 2, 3, 4].forEach(r => {
        let p = EstadoBatalla.tropasVivas.find(x => x.row === r);
        if (isAlive(r) && wantsToAdvance[r]) {
            p.col++;
        }
    });

    if (typeof actualizarAvanceReservas === "function") {
        actualizarAvanceReservas();
    }

    if(!huboCombates) EstadoBatalla.logTurnoGlobal.push("<p class='txt-multitud'>No hubo choques de acero. Las tropas se reposicionan.</p>");
    
    document.querySelectorAll(".en-combate").forEach(el => el.classList.remove("en-combate"));
    generarResumenFinTurnoLog(EstadoBatalla.turnoActual, EstadoBatalla.logTurnoGlobal);
    EstadoBatalla.turnoActual++;
    
    if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
}

async function resolverFormacionCuna(resultado) {
    limpiarBotones(); storyArea.innerHTML = ""; agregarTexto("<div class='separador'>***</div>");

    if (resultado.total === 0) {
        agregarTexto(`[HEREJÍA TÁCTICA]`, "txt-hereje");
        agregarTexto(`¡Insensatez, Comendador ${jugador.nombre}! Habéis hecho sonar los cuernos llamando a una gloriosa carga, pero no habéis ordenado a un solo jinete tomar el puente. El campo ha quedado vacío y el silencio es sepulcral.`);
        crearBoton("Soportar el Juicio Divino...", capitulo1_DerrotaFinal);
        return; 
    }

    let slots = resultado.slots;
    let faltaPunta = (slots["punta"] === null);
    let faltaMedia = (slots["media-arriba"] === null || slots["media-abajo"] === null);
    let tieneTrasera = (slots["trasera-arriba"] !== null || slots["trasera-abajo"] !== null);
    let multiplicadorPenalizacion = 5; let tipoError = "huecos";

    if (faltaPunta) { multiplicadorPenalizacion = 10; tipoError = "sin_punta"; } 
    else if (faltaMedia && tieneTrasera) { multiplicadorPenalizacion = 7; tipoError = "mala_distribucion"; }

    if (resultado.total === 5) {
        let lider = resultado.nombreLider || "Un valiente soldado";
        
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡A LA CARGA hijos del cielo! ¡Romped sus líneas!"`, claseTexto: "txt-comandante"
        });

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: lider, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
            texto: `"¡Que la sangre de mártires pinte nuestro camino y la ira del Altísimo guíe mi lanza! ¡Por la Cruz Bicolor, no dejaremos uno vivo! ¡DEUS LO VULT!"`, claseTexto: "txt-lugarteniente"
        });
        
        if (resultado.puntaEsNoble) {
            agregarTexto("¡Una formación táctica perfecta! La cuña está completamente cerrada con escudos al frente liderada por sangre noble. El impacto inicial contra los paganos es demoledor.");
            GestorEstado.modificarFe(30, "una formación perfecta e inspiradora");
        } else {
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/multicab.webp", nombrePersonaje: "Hueste de Caballeros", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"Una carga digna, pero la presencia de un veterano noble al frente habría quebrado sus espíritus antes del choque..."`, claseTexto: "txt-multitud"
            });
            GestorEstado.modificarFe(25, "una formación completa sin noble al frente");
        }
        GestorEstado.modificarAtaque(2, "una clara ventaja táctica");
    } else {
        let penalizacionFe = -(resultado.vacios * multiplicadorPenalizacion);
        
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡A LA CARGAAAAAAAA!"`, claseTexto: "txt-comandante"
        });
        
        if (tipoError === "sin_punta") { 
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/multicab.webp", nombrePersonaje: "Hueste de Caballeros", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"¡Dime que compraste tu título noble sin decirme que compraste tu título noble! ¡Vamos a morir por esta mala formación sin líder al frente!"`, claseTexto: "txt-multitud"
            });
        } else if (tipoError === "mala_distribucion") {
            if (resultado.nombreLider) { 
                await MotorDialogos.mostrarDialogo({
                    personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: resultado.nombreLider, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                    texto: `"No logramos completar la formación pero ${jugador.nombre} ha demostrado saber liderar... Mi Señor, si esta aquí morimos, recíbenos en tu reino con los brazos abiertos y perdona nuestros pecados."`, claseTexto: "txt-lugarteniente"
                });
            }
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/multicab.webp", nombrePersonaje: "Hueste de Caballeros", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"¡Si sobrevivo a esta formación tan horrible, desertaré de esta cruzada que fracasará!"`, claseTexto: "txt-multitud"
            });
        } else {
            if (resultado.total > 0 && resultado.nombreLider) { 
                await MotorDialogos.mostrarDialogo({
                    personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: resultado.nombreLider, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                    texto: `"No logramos completar la formación pero ${jugador.nombre} ha demostrado saber liderar... Mi Señor, si esta aquí morimos, recíbenos en tu reino con los brazos abiertos y perdona nuestros pecados."`, claseTexto: "txt-lugarteniente"
                });
            }
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/multicab.webp", nombrePersonaje: "Hueste de Caballeros", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"¡Esta cruzada será un fracaso! ¡No es posible que ante el primer choque ni siquiera se haya completado una maldita formación en CUÑA!"`, claseTexto: "txt-multitud"
            });
        }
        
        agregarTexto(`Has lanzado una Cuña Incompleta. Dejaste ${resultado.vacios} espacios vulnerables en tu formación.`);
        GestorEstado.modificarFe(penalizacionFe, "los severos huecos en la táctica ofensiva");
        GestorEstado.modificarAtaque(-1, "un despliegue incompleto");
    }

    if (resultado.todaNobleza && resultado.total > 0) {
        agregarTexto("<div class='separador'>***</div>");
        agregarTexto(`Al ver que solo sangre noble conforma la vanguardia, la hueste entera ruge con un orgullo ensordecedor. "¡Pura sangre de reyes y mártires! ¡Nada puede quebrar esta carga!"`, "txt-sagrado");
        GestorEstado.modificarFe(5, "un despliegue puro de nobleza");
    }

    agregarTexto("<div class='separador'>***</div>");
    crearBoton("⚔️ ¡QUE DIOS RECONOZCA A LOS SUYOS! (Iniciar Choque)", async () => {
        let overlay = document.getElementById("formacion-overlay");
        if(overlay) overlay.style.display = "flex";
        let roster = document.getElementById("formacion-roster");
        if(roster) roster.style.display = "none";
        document.getElementById("formacion-tablero").style.display = "none";
        document.getElementById("btn-iniciar-formacion").style.display = "none";
        
        let skipCine = document.getElementById("ht-skip-cine")?.checked;
        if(!skipCine && typeof playCinematicaCargaCuna === 'function') {
            await new Promise(res => playCinematicaCargaCuna(resultado, res));
        }
        if(overlay) overlay.style.display = "none";
        
        let {victoria, bajas} = await iniciarCombateCuna(resultado);
        
        if(typeof evaluarFinCombateCuna === 'function') {
            await evaluarFinCombateCuna(victoria, bajas);
        }
    });
}