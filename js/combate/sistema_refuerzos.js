/* === SISTEMA_REFUERZOS.JS - GESTIÓN DE BAJAS Y REPOSICIONES === */

window.logTraza = function(msg) {
    let tiempo = (performance.now() / 1000).toFixed(3);
    console.log(`[TRAZA ${tiempo}s] ${msg}`);
};

window.esperarFrame = function() {
    return new Promise(resolve => {
        requestAnimationFrame(() => setTimeout(resolve, 80)); 
    });
};

function cerrarMesaDeGuerra() {
    let btnReporte = document.getElementById("btn-ver-reporte");
    if(btnReporte) btnReporte.style.display = "none";
    document.getElementById("formacion-overlay").style.display = "none";
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.logTurnoGlobal.forEach(html => {
        const parrafo = document.createElement("div"); 
        parrafo.innerHTML = html;
        let ocultos = parrafo.querySelectorAll('.resumen-oculto');
        if (!autoCombat && ocultos.length > 0) ocultos.forEach(el => el.style.display = 'none');
        storyArea.appendChild(parrafo); 
    });
    
    let pending = document.querySelectorAll('.pendiente-dados').length > 0;
    if (!pending) evaluarBajasYContinuar();
}

function evaluarBajasYContinuar() {
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    function procederSiguienteTurno() {
        if (EstadoBatalla.tipoCombate === "cuna") {
            crearBoton("⚔️ CABALGAR AL SIGUIENTE ENFRENTAMIENTO ⚔️", () => {
                limpiarBotones(); evaluarContinuacionBatalla();
            });
        } else {
            evaluarContinuacionBatalla();
        }
    }

    if (EstadoBatalla.tipoCombate === "picas" && EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) { evaluarContinuacionBatalla(); return; }
    if (EstadoBatalla.tipoCombate === "picas_bosque" && EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) { evaluarContinuacionBatalla(); return; }
    if (EstadoBatalla.tipoCombate === "sacrificio" && EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) { evaluarContinuacionBatalla(); return; }
    
    if (EstadoBatalla.reservas.length === 0) { procederSiguienteTurno(); return; }

    let bajasNuevas = EstadoBatalla.tropasVivas.filter(pos => {
        if (!pos.idUnico) return false;
        let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
        return tr && tr.hp <= 0 && !pos.ignorarMuerto; 
    });

    if (bajasNuevas.length > 0) {
        let nombresBajas = bajasNuevas.map(b => `<b class='txt-hereje'>${jugador.tropas.find(t=>t.idUnico===b.idUnico).nombre}</b> (${b.posNombre})`).join(", ");
        let alertHtml = RenderCombate.htmlAlertaBajas(nombresBajas, 'block');
        agregarTexto(alertHtml, "", true);
        limpiarBotones();
        
        let imgLugarteniente = EstadoBatalla.tipoCombate === "cuna" ? "assets/img/personajes/aliados/lider_caballeromontado.webp" : "assets/img/personajes/aliados/lider_piqueros.webp";
        let nomLugarteniente = EstadoBatalla.tipoCombate === "cuna" ? "Sir Alexandro" : "Conde JuanA";
        
        if (EstadoBatalla.tipoCombate === "sacrificio") { imgLugarteniente = "assets/img/personajes/aliados/lider_ballesteros.webp"; nomLugarteniente = "Barón Andrew"; }

        let divRefuerzo = document.createElement("div");
        storyArea.appendChild(divRefuerzo);

        MotorDialogos.mostrarDialogoEnContenedor(divRefuerzo, {
            personajeImg: imgLugarteniente, nombrePersonaje: nomLugarteniente, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Mi señor! ¡Las bestias han masacrado a <span class='txt-hereje'>${nombresBajas}</span>! Hay fisuras en nuestra formación. ¿Llamamos a las reservas para tapar la sangre?"`, 
            claseTexto: "txt-lugarteniente"
        }).then(() => {
            crearBoton(`Sí, ¡adelante por el Señor!`, async () => {
                limpiarBotones();
                document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
                let divRespuesta = document.createElement("div");
                storyArea.appendChild(divRespuesta);
                await MotorDialogos.mostrarDialogoEnContenedor(divRespuesta, {
                    personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                    texto: `"¡Sí, adelante por el Señor! ¡Que las reservas ocupen la brecha de inmediato y no cedan un palmo!"`, claseTexto: "txt-comandante"
                });
                
                let todasLasBajas = EstadoBatalla.tropasVivas.filter(pos => {
                    let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
                    return tr && tr.hp <= 0;
                });

                abrirFormacionReposicion(todasLasBajas, async (reforzados) => {
                    document.querySelectorAll("button").forEach(b => {
                        if (b.innerText.includes("REEMPLAZO")) b.style.display = "none";
                    });

                    let tab = document.getElementById(EstadoBatalla.tipoCombate === "cuna" ? "formacion-tablero" : "formacion-picas-tablero");
                    let ejecutarLlegadaDialogo = () => {
                        document.getElementById("formacion-overlay").style.display = "none"; 
                        if (reforzados.length > 0) {
                            let nombresNuevos = reforzados.map(r => r.nombre).join(" y ");
                            let divLlegada = document.createElement("div");
                            storyArea.appendChild(divLlegada);
                            MotorDialogos.mostrarDialogoEnContenedor(divLlegada, {
                                personajeImg: imgLugarteniente, nombrePersonaje: nomLugarteniente, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                                texto: `"¡Firmes! ¡${nombresNuevos} han ocupado la brecha! ¡Sangre fresca para la cruzada!"`, claseTexto: "txt-lugarteniente"
                            }).then(() => { procederSiguienteTurno(); });
                            setTimeout(() => storyArea.scrollTop = storyArea.scrollHeight, 100);
                        } else { procederSiguienteTurno(); }
                    };

                    // =========================================================================
                    // ORQUESTADOR MATEMÁTICO DE LA CUÑA (El Cerebro)
                    // =========================================================================
                    if (EstadoBatalla.tipoCombate === "cuna" && reforzados.length > 0) {
                        logTraza("=== INICIANDO PROTOCOLO DE CINEMÁTICA EN CUÑA (DRY) ===");
                        
                        let listaRoster = document.getElementById("formacion-lista-tropas");
                        if (listaRoster) listaRoster.innerHTML = ""; 
                        
                        document.getElementById("formacion-overlay").style.display = "flex";
                        if (tab) { tab.style.display = "flex"; tab.classList.add("modo-combate"); }
                        
                        EstadoBatalla.tropasVivas.forEach(pos => {
                            if (reforzados.some(r => r.idUnico === pos.idUnico)) pos.ignorarMuerto = true;
                        });

                        restaurarVisualesCombate();
                        if (typeof reordenarReservasCuna === "function") reordenarReservasCuna();

                        await window.esperarFrame();
                        logTraza("--> Frame de Origen renderizado. Capturando coordenadas...");

                        let oldBoxes = {};
                        let oldIndices = {};
                        EstadoBatalla.reservas.forEach((res, index) => {
                            if (res) {
                                let el = document.querySelector("#formacion-tablero #drag-" + res.idUnico);
                                if (el) {
                                    let rect = el.getBoundingClientRect();
                                    oldBoxes[res.idUnico] = { top: rect.top, left: rect.left };
                                    oldIndices[res.idUnico] = index;
                                }
                            }
                        });

                        let dataStaying = [];
                        EstadoBatalla.reservas.forEach(res => {
                            if (res && oldBoxes[res.idUnico] && !reforzados.some(r => r.idUnico === res.idUnico)) {
                                dataStaying.push({ tropa: res, startBox: oldBoxes[res.idUnico], oldIdx: oldIndices[res.idUnico] });
                            }
                        });

                        let dataLeaving = [];
                        reforzados.forEach(nuevo => { 
                            EstadoBatalla.reservas = EstadoBatalla.reservas.filter(r => r && r.idUnico !== nuevo.idUnico); 
                        });

                        // Reacomodo Inteligente de Carriles
                        let newReservas = new Array(5).fill(null);
                        let remaining = [...EstadoBatalla.reservas];
                        let availableOlds = remaining.map(r => ({ obj: r, oldIdx: oldIndices[r.idUnico] % 5 }));
                        let prefs = { 0: [0, 1, 2, 3, 4], 1: [1, 3, 0, 2, 4], 2: [2, 4, 0, 1, 3], 3: [3, 1, 0, 4, 2], 4: [4, 2, 0, 3, 1] };

                        for (let i = 0; i < 5; i++) {
                            if (availableOlds.length === 0) break;
                            let prefList = prefs[i];
                            let chosenIdx = -1;
                            for (let p of prefList) {
                                chosenIdx = availableOlds.findIndex(a => a.oldIdx === p);
                                if (chosenIdx !== -1) break;
                            }
                            if (chosenIdx !== -1) {
                                newReservas[i] = availableOlds.splice(chosenIdx, 1)[0].obj;
                            } else {
                                newReservas[i] = availableOlds.shift().obj;
                            }
                        }
                        availableOlds.forEach(extra => newReservas.push(extra.obj));
                        EstadoBatalla.reservas = newReservas;

                        if (typeof slotsFormacion !== 'undefined') {
                            EstadoBatalla.tropasVivas.forEach(pos => {
                                if (pos.slotPos && slotsFormacion[pos.slotPos]) pos.idUnico = slotsFormacion[pos.slotPos];
                            });
                        }
                        EstadoBatalla.tropasVivas.forEach(pos => { if (pos.idUnico) pos.ignorarMuerto = false; });

                        restaurarVisualesCombate(); 
                        if (tab) tab.classList.add("modo-combate");
                        if (typeof reordenarReservasCuna === "function") reordenarReservasCuna();

                        // Ocultamos a los reales para evitar fantasmas
                        reforzados.forEach(tropaObj => {
                            let el = document.querySelector("#formacion-tablero #drag-" + tropaObj.idUnico);
                            if (el) el.style.setProperty("opacity", "0", "important");
                        });
                        EstadoBatalla.reservas.forEach(res => {
                            if (res) {
                                let el = document.querySelector("#formacion-tablero #drag-" + res.idUnico);
                                if (el) el.style.setProperty("opacity", "0", "important");
                            }
                        });

                        await window.esperarFrame();
                        logTraza("--> Frame de Destino renderizado. Capturando coordenadas...");

                        reforzados.forEach(tropaObj => {
                            let elTarget = document.querySelector("#formacion-tablero #drag-" + tropaObj.idUnico);
                            if (elTarget && oldBoxes[tropaObj.idUnico]) {
                                let tBox = elTarget.getBoundingClientRect();
                                if (tBox.top > 0 || tBox.left > 0) {
                                    dataLeaving.push({
                                        tropa: tropaObj, startBox: oldBoxes[tropaObj.idUnico],
                                        targetBox: {top: tBox.top, left: tBox.left}, targetId: "drag-" + tropaObj.idUnico
                                    });
                                }
                            }
                        });

                        EstadoBatalla.reservas.forEach(res => {
                            if (res && oldBoxes[res.idUnico]) {
                                let elTarget = document.querySelector("#formacion-tablero #drag-" + res.idUnico);
                                if (elTarget) {
                                    let tBox = elTarget.getBoundingClientRect();
                                    if (tBox.top > 0 || tBox.left > 0) {
                                        dataStaying.push({
                                            tropa: res, startBox: oldBoxes[res.idUnico],
                                            targetBox: {top: tBox.top, left: tBox.left}, targetId: "drag-" + res.idUnico
                                        });
                                    }
                                }
                            }
                        });

                        let roster = document.getElementById("formacion-roster"); if (roster) roster.style.display = "none";
                        let btnIniciar = document.getElementById("btn-iniciar-formacion"); if (btnIniciar) btnIniciar.style.display = "none";
                        let titulo = document.getElementById("titulo-formacion"); 
                        if (titulo) titulo.innerText = "⚔️ CABALGANDO A LA VANGUARDIA ⚔️";
                        
                        logTraza("--> Matemáticas completas. Invocando al Director Cinemático...");

                        // INVOCACIÓN AL DIRECTOR CINEMÁTICO (Unificado)
                        if (typeof DirectorCinematico !== "undefined" && typeof DirectorCinematico.animarTrasladoFase1 === "function") {
                            // Fase 1: Vuelo de 2.5s (Sombra dorada #ffaa00)
                            DirectorCinematico.animarTrasladoFase1(dataLeaving, dataStaying, 2500, "#ffaa00", (clonesStaying) => {
                                let overlay = document.getElementById("formacion-overlay");
                                if (!overlay) return ejecutarLlegadaDialogo();

                                logTraza("--> Vanguardia llegó. Pasando automáticamente a Fase 2 (Reagrupamiento).");
                                if (titulo) titulo.innerText = "⚔️ REAGRUPANDO LA RESERVA ⚔️";
                                
                                // Fase 2: Vuelo de Reagrupamiento de 1.5s (Sombra blanca #ffffff) y botón final automático
                                DirectorCinematico.animarTrasladoFase2(clonesStaying, 1500, "#ffffff", ejecutarLlegadaDialogo);
                            });
                        } else {
                            ejecutarLlegadaDialogo();
                        }

                    } else {
                        // Flujo normal infantería
                        reforzados.forEach(nuevo => { EstadoBatalla.reservas = EstadoBatalla.reservas.filter(r => r && r.idUnico !== nuevo.idUnico); });
                        if (typeof slotsFormacion !== 'undefined') {
                            EstadoBatalla.tropasVivas.forEach(pos => {
                                if (pos.slotPos && slotsFormacion[pos.slotPos]) { pos.idUnico = slotsFormacion[pos.slotPos]; }
                            });
                        }
                        EstadoBatalla.tropasVivas.forEach(pos => {
                            let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
                            if (tr) pos.ignorarMuerto = (tr.hp <= 0);
                        });
                        restaurarVisualesCombate(); 
                        if (tab) tab.classList.add("modo-combate");
                        ejecutarLlegadaDialogo();
                    }
                });
            });
            
            crearBoton(`No, mantened la disciplina`, async () => { 
                limpiarBotones();
                document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
                bajasNuevas.forEach(b => b.ignorarMuerto = true);

                let divRespuesta = document.createElement("div");
                storyArea.appendChild(divRespuesta);
                await MotorDialogos.mostrarDialogoEnContenedor(divRespuesta, {
                    personajeImg: "assets/img/personajes/aliados/jugador.webp", 
                    nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", 
                    bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                    texto: `"¡No, mantened la disciplina! ¡La línea debe resistir con los valientes que están! ¡Confiad en la Providencia Divina!"`, 
                    claseTexto: "txt-comandante"
                });
                
                let htmlCierre = RenderCombate.htmlCierreSinRefuerzos(jugador.nombre);
                agregarTexto(htmlCierre);
                
                restaurarVisualesCombate(); 
                let tab = document.getElementById(EstadoBatalla.tipoCombate === "cuna" ? "formacion-tablero" : "formacion-picas-tablero");
                if (tab) tab.classList.add("modo-combate");
                if (EstadoBatalla.tipoCombate === "cuna" && typeof reordenarReservasCuna === "function") {
                    reordenarReservasCuna();
                }

                procederSiguienteTurno(); 
            });
        });

    } else { 
        procederSiguienteTurno();
    }
}