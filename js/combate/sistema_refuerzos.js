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

window.ejecutarReordenFormacion = function() {
    if (EstadoBatalla.tipoCombate === "cuna" && typeof reordenarReservasCuna === "function") {
        reordenarReservasCuna();
    }
};

window.restaurarSinFlicker = async function(tab) {
    if (!tab || !tab.parentNode) {
        restaurarVisualesCombate();
        window.ejecutarReordenFormacion();
        return;
    }
    let rect = tab.getBoundingClientRect(); let escudo = tab.cloneNode(true); escudo.id = "escudo-antiflicker";
    escudo.querySelectorAll("[id]").forEach(el => el.id = ""); 
    escudo.style.position = "absolute"; escudo.style.top = (rect.top + window.scrollY) + "px"; escudo.style.left = (rect.left + window.scrollX) + "px";
    escudo.style.width = rect.width + "px"; escudo.style.height = rect.height + "px"; escudo.style.zIndex = "9000"; escudo.style.pointerEvents = "none";
    escudo.style.margin = "0"; escudo.style.transition = "none"; document.body.appendChild(escudo);

    restaurarVisualesCombate(); window.ejecutarReordenFormacion(); tab.classList.add("modo-combate");
    await new Promise(r => { requestAnimationFrame(() => { requestAnimationFrame(r); }); });
    if (escudo.parentNode) escudo.parentNode.removeChild(escudo);
};

let asignarSlotsGlobales = () => {
    EstadoBatalla.tropasVivas.forEach(pos => {
        if (pos.slotPos) {
            if (typeof slotsFormacion !== 'undefined' && slotsFormacion[pos.slotPos]) pos.idUnico = slotsFormacion[pos.slotPos];
            if (typeof slotsFormacionPicas !== 'undefined' && slotsFormacionPicas[pos.slotPos]) pos.idUnico = slotsFormacionPicas[pos.slotPos];
            if (typeof slotsFormacionSacrificio !== 'undefined' && slotsFormacionSacrificio[pos.slotPos]) pos.idUnico = slotsFormacionSacrificio[pos.slotPos];
        }
    });
};

function cerrarMesaDeGuerra() {
    let btnReporte = document.getElementById("btn-ver-reporte");
    if(btnReporte) btnReporte.style.display = "none";
    document.getElementById("formacion-overlay").style.display = "none";
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.logTurnoGlobal.forEach(html => {
        const parrafo = document.createElement("div"); parrafo.innerHTML = html;
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
        if (EstadoBatalla.tipoCombate === "cuna") { crearBoton("⚔️ CABALGAR AL SIGUIENTE ENFRENTAMIENTO ⚔️", () => { limpiarBotones(); evaluarContinuacionBatalla(); }); } 
        else { evaluarContinuacionBatalla(); }
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
        let alertHtml = RenderCombate.htmlAlertaBajas(nombresBajas, 'block'); agregarTexto(alertHtml, "", true); limpiarBotones();
        
        let imgLugarteniente = EstadoBatalla.tipoCombate === "cuna" ? "assets/img/personajes/aliados/lider_caballeromontado.webp" : "assets/img/personajes/aliados/lider_piqueros.webp";
        let nomLugarteniente = EstadoBatalla.tipoCombate === "cuna" ? "Sir Alexandro" : "Conde JuanA";
        if (EstadoBatalla.tipoCombate === "sacrificio") { imgLugarteniente = "assets/img/personajes/aliados/lider_ballesteros.webp"; nomLugarteniente = "Barón Andrew"; }

        let divRefuerzo = document.createElement("div"); storyArea.appendChild(divRefuerzo);
        MotorDialogos.mostrarDialogoEnContenedor(divRefuerzo, {
            personajeImg: imgLugarteniente, nombrePersonaje: nomLugarteniente, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Mi señor! ¡Las bestias han masacrado a <span class='txt-hereje'>${nombresBajas}</span>! Hay fisuras en nuestra formación. ¿Llamamos a las reservas para tapar la sangre?"`, claseTexto: "txt-lugarteniente"
        }).then(() => {
            crearBoton(`Sí, ¡adelante por el Señor!`, async () => {
                limpiarBotones(); document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
                let divRespuesta = document.createElement("div"); storyArea.appendChild(divRespuesta);
                await MotorDialogos.mostrarDialogoEnContenedor(divRespuesta, {
                    personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                    texto: `"¡Sí, adelante por el Señor! ¡Que las reservas ocupen la brecha de inmediato y no cedan un palmo!"`, claseTexto: "txt-comandante"
                });
                
                let todasLasBajas = EstadoBatalla.tropasVivas.filter(pos => { let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico); return tr && tr.hp <= 0 && !pos.ignorarMuerto; });
                let datosMuertosFase0 = todasLasBajas.map(pos => {
                    let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
                    let elCard = document.getElementById("drag-" + pos.idUnico);
                    let idSlotExacto = null;
                    if (elCard && elCard.parentNode) { idSlotExacto = elCard.parentNode.id; } 
                    else { idSlotExacto = pos.slotPos ? `pica-slot-${pos.slotPos.split("-")[1]}` : `aliado-${pos.row}-${pos.col}`; }
                    return { idUnico: pos.idUnico, row: pos.row, col: pos.col, slotPos: pos.slotPos, img: tr ? tr.img : '', nombre: tr ? tr.nombre : "un valiente hermano", slotIdExacto: idSlotExacto };
                });

                abrirFormacionReposicion(todasLasBajas, async (reforzados) => {
                    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("REEMPLAZO")) b.style.display = "none"; });
                    let tabId = "formacion-tablero"; if (EstadoBatalla.tipoCombate && EstadoBatalla.tipoCombate.includes("picas")) { tabId = "formacion-picas-tablero"; }
                    let tab = document.getElementById(tabId) || document.getElementById("formacion-tablero"); if (!tab) tab = document.querySelector(".modo-combate");

                    let ejecutarLlegadaDialogo = () => {
                        document.getElementById("formacion-overlay").style.display = "none"; 
                        let antiFlash = document.getElementById("anti-flash-style"); if (antiFlash) antiFlash.remove(); 
                        restaurarVisualesCombate(); window.ejecutarReordenFormacion();
                        
                        reforzados.forEach(tropaObj => {
                            let el = document.getElementById("drag-" + tropaObj.idUnico);
                            if (el) { el.style.setProperty("transition", "none", "important"); el.style.setProperty("opacity", "1", "important"); el.style.setProperty("display", "flex", "important"); }
                        });
                        
                        if (EstadoBatalla && EstadoBatalla.reservas) {
                            EstadoBatalla.reservas.forEach(res => {
                                if (res) { let el = document.getElementById("drag-" + res.idUnico); if (el) { el.style.removeProperty("opacity"); el.style.opacity = "1"; } }
                            });
                        }

                        if (reforzados.length > 0) {
                            let nombresNuevos = reforzados.map(r => r.nombre).join(" y ");
                            let divLlegada = document.createElement("div"); storyArea.appendChild(divLlegada);
                            MotorDialogos.mostrarDialogoEnContenedor(divLlegada, {
                                personajeImg: imgLugarteniente, nombrePersonaje: nomLugarteniente, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                                texto: `"¡Firmes! ¡${nombresNuevos} han ocupado la brecha! ¡Sangre fresca para la cruzada!"`, claseTexto: "txt-lugarteniente"
                            }).then(() => { procederSiguienteTurno(); }); setTimeout(() => storyArea.scrollTop = storyArea.scrollHeight, 100);
                        } else { procederSiguienteTurno(); }
                    };

                    if (reforzados.length > 0) {
                        let listaRoster = document.getElementById("formacion-lista-tropas"); if (listaRoster) listaRoster.innerHTML = ""; 
                        document.getElementById("formacion-overlay").style.display = "flex";
                        if (tab) { tab.style.display = "flex"; tab.classList.add("modo-combate"); }
                        let roster = document.getElementById("formacion-roster"); if (roster) roster.style.display = "none";
                        let btnIniciar = document.getElementById("btn-iniciar-formacion"); if (btnIniciar) btnIniciar.style.display = "none";
                        let titulo = document.getElementById("titulo-formacion"); if (titulo) titulo.innerText = "☠️ EL ÚLTIMO ALIENTO ☠️";
                        
                        let crucesOcultas = [];
                        if (window.marcadoresBatalla) {
                            window.marcadoresBatalla = window.marcadoresBatalla.filter(m => {
                                let matchMuerto = datosMuertosFase0.find(b => {
                                    if (m.slotPos && b.slotPos) return b.slotPos === m.slotPos;
                                    return b.row === m.row && (b.col === m.col || (b.col > 3 && m.col === 3));
                                });
                                if (m.tipo === 'cross' && matchMuerto) { m.slotIdDestino = matchMuerto.slotIdExacto; crucesOcultas.push(m); return false; }
                                return true;
                            });
                        }

                        let falsosPos = [];
                        reforzados.forEach(nuevo => {
                            let posMatch = EstadoBatalla.tropasVivas.find(p => p.idUnico === nuevo.idUnico);
                            if (posMatch) { falsosPos.push({ obj: posMatch, originalId: posMatch.idUnico }); posMatch.idUnico = null; }
                        });

                        await window.restaurarSinFlicker(tab);

                        datosMuertosFase0.forEach(baja => {
                            let elCaido = document.getElementById("drag-" + baja.idUnico);
                            if (elCaido) elCaido.style.setProperty("display", "none", "important");
                        });

                        let ghostContainer = document.createElement("div"); ghostContainer.id = "ghost-luto-unodostres"; ghostContainer.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;"; document.body.appendChild(ghostContainer);

                        let fantasmas = []; let fadeDur = 3500; 
                        
                        datosMuertosFase0.forEach(muerto => {
                            if (!muerto.img) return;
                            let slotDOM = document.getElementById(muerto.slotIdExacto);
                            if (slotDOM) {
                                let rect = slotDOM.getBoundingClientRect();
                                let divFantasma = document.createElement("div"); divFantasma.className = "tropa-draggable";
                                divFantasma.style.cssText = `position:absolute !important; top:${rect.top + window.scrollY}px !important; left:${rect.left + window.scrollX}px !important; width:${rect.width}px !important; height:${rect.height}px !important; z-index:45 !important; background-color:#1a1a1a !important; border:2px solid #8b0000 !important; box-sizing:border-box !important; filter: grayscale(0%) !important; transform: scale(1) !important; opacity: 1 !important; transition: all ${fadeDur/1000}s ease-in-out !important; margin:0 !important;`;
                                let imgFantasma = document.createElement("img"); imgFantasma.src = muerto.img; imgFantasma.style.cssText = "width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;";
                                divFantasma.appendChild(imgFantasma); ghostContainer.appendChild(divFantasma);
                                fantasmas.push({ ghost: divFantasma, id: muerto.idUnico, slotId: muerto.slotIdExacto, rect: rect });
                            }
                        });

                        if (fantasmas.length > 0) {
                            fantasmas.forEach(f => void f.ghost.offsetWidth);
                            await new Promise(r => { requestAnimationFrame(() => { requestAnimationFrame(r); }); });
                            fantasmas.forEach(f => { f.ghost.style.setProperty("filter", "grayscale(100%) sepia(30%) brightness(0.2)", "important"); f.ghost.style.setProperty("transform", "scale(0.85)", "important"); f.ghost.style.setProperty("opacity", "0", "important"); });

                            setTimeout(() => {
                                crucesOcultas.forEach(m => {
                                    if (window.marcadoresBatalla) window.marcadoresBatalla.push(m);
                                    let fMatch = fantasmas.find(fa => fa.slotId === m.slotIdDestino) || fantasmas[0];
                                    let cross = window.crearMarcadorMuerteDOM(m.tipo);
                                    
                                    // REGLAS ABSOLUTAS DEL HALO (SOBREESCRITURA TOTAL EN CINEMÁTICA)
                                    if (m.tipo === 'skull') {
                                        cross.style.cssText = `position:absolute; top:${fMatch.rect.top + window.scrollY + fMatch.rect.height/2}px; left:${fMatch.rect.left + window.scrollX + fMatch.rect.width/2}px; transform:translate(-50%, -50%); font-size:45px; z-index:9999; opacity:0; transition: opacity 1.0s ease-in; pointer-events:none; color: #ffffff !important; text-shadow: 0 0 15px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000 !important;`;
                                    } else {
                                        // La cruz mantiene el desplazamiento a la izquierda también en cinemática
                                        cross.style.cssText = `position:absolute; top:${fMatch.rect.top + window.scrollY + fMatch.rect.height/2}px; left:${fMatch.rect.left + window.scrollX + fMatch.rect.width/2}px; transform:translate(-150%, -50%); font-size:45px; z-index:9999; opacity:0; transition: opacity 1.0s ease-in; pointer-events:none; color: #ffd700 !important; text-shadow: 0 0 15px #ffaa00, 0 0 40px #ffaa00, 0 0 60px #ffaa00 !important;`;
                                    }
                                    
                                    ghostContainer.appendChild(cross); void cross.offsetWidth; cross.style.opacity = "1";
                                });
                            }, 1500);

                            await new Promise(r => setTimeout(r, 1600)); 
                            setTimeout(() => { if (ghostContainer.parentNode) ghostContainer.parentNode.removeChild(ghostContainer); }, 2200); 
                        }
                        
                        let antiFlashStyle = document.getElementById("anti-flash-style");
                        if (!antiFlashStyle) { antiFlashStyle = document.createElement("style"); antiFlashStyle.id = "anti-flash-style"; document.head.appendChild(antiFlashStyle); }
                        let cssRules = "";
                        reforzados.forEach(nuevo => { cssRules += `#drag-${nuevo.idUnico} { opacity: 0 !important; transition: none !important; }\n`; });
                        EstadoBatalla.reservas.forEach(res => { if (res) cssRules += `#drag-${res.idUnico} { opacity: 0 !important; transition: none !important; }\n`; });
                        antiFlashStyle.innerHTML = cssRules;

                        if (titulo) titulo.innerText = "⚔️ CABALGANDO A LA VANGUARDIA ⚔️";
                        falsosPos.forEach(fake => { fake.obj.idUnico = fake.originalId; });
                        asignarSlotsGlobales(); EstadoBatalla.tropasVivas.forEach(pos => { if (pos.idUnico) pos.ignorarMuerto = false; });
                        await window.restaurarSinFlicker(tab);

                        reforzados.forEach(tropaObj => { let el = document.getElementById("drag-" + tropaObj.idUnico); if (el) el.style.setProperty("opacity", "0", "important"); });
                        EstadoBatalla.reservas.forEach(res => { if (res) { let el = document.getElementById("drag-" + res.idUnico); if (el) el.style.setProperty("opacity", "0", "important"); } });

                        await window.esperarFrame();
                        let oldBoxes = {}; let oldIndices = {};
                        EstadoBatalla.reservas.forEach((res, index) => {
                            if (res) { let el = document.getElementById("drag-" + res.idUnico); if (el) { let rect = el.getBoundingClientRect(); oldBoxes[res.idUnico] = { top: rect.top, left: rect.left }; oldIndices[res.idUnico] = index; } }
                        });

                        let dataLeaving = [];
                        reforzados.forEach(nuevo => { EstadoBatalla.reservas = EstadoBatalla.reservas.filter(r => r && r.idUnico !== nuevo.idUnico); });

                        let newReservas = new Array(5).fill(null);
                        let remaining = [...EstadoBatalla.reservas];
                        let availableOlds = remaining.map(r => ({ obj: r, oldIdx: oldIndices[r.idUnico] % 5 }));
                        let prefs = { 0: [0, 1, 2, 3, 4], 1: [1, 3, 0, 2, 4], 2: [2, 4, 0, 1, 3], 3: [3, 1, 0, 4, 2], 4: [4, 2, 0, 3, 1] };

                        for (let i = 0; i < 5; i++) {
                            if (availableOlds.length === 0) break;
                            let prefList = prefs[i]; let chosenIdx = -1;
                            for (let p of prefList) { chosenIdx = availableOlds.findIndex(a => a.oldIdx === p); if (chosenIdx !== -1) break; }
                            if (chosenIdx !== -1) { newReservas[i] = availableOlds.splice(chosenIdx, 1)[0].obj; } else { newReservas[i] = availableOlds.shift().obj; }
                        }
                        availableOlds.forEach(extra => newReservas.push(extra.obj));
                        EstadoBatalla.reservas = newReservas;

                        asignarSlotsGlobales(); EstadoBatalla.tropasVivas.forEach(pos => { if (pos.idUnico) pos.ignorarMuerto = false; });
                        await window.restaurarSinFlicker(tab);

                        reforzados.forEach(tropaObj => { let el = document.getElementById("drag-" + tropaObj.idUnico); if (el) el.style.setProperty("opacity", "0", "important"); });
                        EstadoBatalla.reservas.forEach(res => { if (res) { let el = document.getElementById("drag-" + res.idUnico); if (el) el.style.setProperty("opacity", "0", "important"); } });
                        await window.esperarFrame();

                        reforzados.forEach(tropaObj => {
                            let elTarget = document.getElementById("drag-" + tropaObj.idUnico);
                            let fakeObj = falsosPos.find(f => f.originalId === tropaObj.idUnico);
                            let nombreMuerto = null;
                            if (fakeObj) { let muertoMatch = datosMuertosFase0.find(m => m.row === fakeObj.obj.row && m.col === fakeObj.obj.col); if (muertoMatch) nombreMuerto = muertoMatch.nombre; }
                            if (elTarget && oldBoxes[tropaObj.idUnico]) {
                                let tBox = elTarget.getBoundingClientRect();
                                if (tBox.top > 0 || tBox.left > 0) {
                                    dataLeaving.push({ tropa: tropaObj, startBox: oldBoxes[tropaObj.idUnico], targetBox: {top: tBox.top, left: tBox.left, width: tBox.width}, targetId: "drag-" + tropaObj.idUnico, nombreDifunto: nombreMuerto });
                                }
                            }
                        });

                        let dataStaying = [];
                        EstadoBatalla.reservas.forEach(res => {
                            if (res && oldBoxes[res.idUnico]) {
                                let elTarget = document.getElementById("drag-" + res.idUnico);
                                if (elTarget) { let tBox = elTarget.getBoundingClientRect(); if (tBox.top > 0 || tBox.left > 0) { dataStaying.push({ tropa: res, startBox: oldBoxes[res.idUnico], targetBox: {top: tBox.top, left: tBox.left, width: tBox.width}, targetId: "drag-" + res.idUnico }); } }
                            }
                        });
                        
                        if (typeof DirectorCinematico !== "undefined" && typeof DirectorCinematico.animarTrasladoFase1 === "function") {
                            setTimeout(() => {
                                dataLeaving.forEach(d => {
                                    if (d.nombreDifunto && typeof window.mostrarRequiemEnTablero === "function") {
                                        let requiem = window.RequiemsPool.obtenerRequiem(d.nombreDifunto);
                                        let centerX = d.targetBox.left + window.scrollX + (d.targetBox.width / 2); let topY = d.targetBox.top + window.scrollY - 20; 
                                        window.mostrarRequiemEnTablero(`💬 <b style="color: #ffaa00;">${d.tropa.nombre}:</b><br>"${requiem}"`, centerX, topY);
                                    }
                                });
                            }, 750); 

                            DirectorCinematico.animarTrasladoFase1(dataLeaving, dataStaying, 1500, "#ffaa00", (clonesStaying) => {
                                let overlay = document.getElementById("formacion-overlay"); if (!overlay) return ejecutarLlegadaDialogo();

                                reforzados.forEach(tropaObj => {
                                    let el = document.getElementById("drag-" + tropaObj.idUnico);
                                    if (el) { el.style.setProperty("transition", "none", "important"); el.style.setProperty("opacity", "1", "important"); el.style.setProperty("display", "flex", "important"); }
                                });
                                if (titulo) titulo.innerText = "⚔️ REAGRUPANDO LA RESERVA ⚔️";
                                DirectorCinematico.animarTrasladoFase2(clonesStaying, 1000, "#ffffff", ejecutarLlegadaDialogo);
                            });
                        } else { ejecutarLlegadaDialogo(); }

                    } else {
                        reforzados.forEach(nuevo => { EstadoBatalla.reservas = EstadoBatalla.reservas.filter(r => r && r.idUnico !== nuevo.idUnico); });
                        asignarSlotsGlobales(); EstadoBatalla.tropasVivas.forEach(pos => { let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico); if (tr) pos.ignorarMuerto = (tr.hp <= 0); });
                        restaurarVisualesCombate(); if (tab) tab.classList.add("modo-combate"); ejecutarLlegadaDialogo();
                    }
                });
            });
            
            crearBoton(`No, mantened la disciplina`, async () => { 
                limpiarBotones(); document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = ''); bajasNuevas.forEach(b => b.ignorarMuerto = true);
                let divRespuesta = document.createElement("div"); storyArea.appendChild(divRespuesta);
                await MotorDialogos.mostrarDialogoEnContenedor(divRespuesta, { personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡No, mantened la disciplina! ¡La línea debe resistir con los valientes que están! ¡Confiad en la Providencia Divina!"`, claseTexto: "txt-comandante" });
                
                let htmlCierre = RenderCombate.htmlCierreSinRefuerzos(jugador.nombre); agregarTexto(htmlCierre); restaurarVisualesCombate(); 
                let tabId = "formacion-tablero"; if (EstadoBatalla.tipoCombate && EstadoBatalla.tipoCombate.includes("picas")) tabId = "formacion-picas-tablero";
                let tab = document.getElementById(tabId) || document.getElementById("formacion-tablero"); if (tab) tab.classList.add("modo-combate");
                window.ejecutarReordenFormacion(); procederSiguienteTurno(); 
            });
        });
    } else { 
        procederSiguienteTurno();
    }
}