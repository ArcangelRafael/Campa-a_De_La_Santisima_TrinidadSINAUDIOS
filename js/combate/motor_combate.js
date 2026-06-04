/* === MOTOR_COMBATE.JS - CUARTEL GENERAL Y RENDERIZADO VISUAL === */

window.marcadoresBatalla = window.marcadoresBatalla || [];

const CONSTANTES_TACTICAS = {
    CUNA_MAX_TURNOS: 7, CUNA_BAJAS_VICTORIA: 15, PICAS_MAX_TURNOS: 5, 
    COLUMNA_INICIO_PUNTA: -1, COLUMNA_INICIO_MEDIAS: -2, COLUMNA_INICIO_TRASERAS: -3
};

const EstadoBatalla = {
    tipoCombate: "cuna", maxTurnos: 0, turnoActual: 1, bajasEnemigas: 0, accionesPendientes: [],
    reservas: [], tropasVivas: [], enemigos: [], logTurnoGlobal: [], callback: null,
    progresoMuro: 0, hordaMuertosActuales: 0, metaProgresoMuro: 60, turnosFaseBosque: 1,
    eventoEspecialVictoria: null, caidosUltimaBatalla: [], cargandoVictoria: false,

    limpiar: function() {
        this.maxTurnos = 0; this.turnoActual = 1; this.bajasEnemigas = 0;
        this.accionesPendientes = []; this.reservas = []; this.tropasVivas = []; this.enemigos = [];
        this.logTurnoGlobal = []; this.callback = null; this.progresoMuro = 0; this.hordaMuertosActuales = 0;
        this.metaProgresoMuro = 60; this.turnosFaseBosque = 1;
        this.eventoEspecialVictoria = null; this.caidosUltimaBatalla = []; this.cargandoVictoria = false;
    }
};

function prepararBotonTurno() {
    limpiarBotones();
    let btnReporte = document.getElementById("btn-ver-reporte"); if(btnReporte) btnReporte.style.display = "none";
    let btnDados = document.getElementById("btn-tirar-dados"); if(btnDados) btnDados.style.display = "none";
    
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;
    let pending = document.querySelectorAll('.pendiente-dados').length > 0;
    if (!autoCombat && pending) {
        setTimeout(() => {
            let actionArea = document.getElementById("action-area");
            if(actionArea) actionArea.style.display = "none";
        }, 10);
    }
}

window.actualizarGrillaEnemigosPicas = function(atacando = false) {
    let gridIds = ["en-pica-0-0", "en-pica-0-1", "en-pica-0-2", "en-pica-1-0", "en-pica-1-1", "en-pica-1-2", "en-pica-2-0", "en-pica-2-1", "en-pica-2-2"];
    let bajasVisuales = EstadoBatalla.hordaMuertosActuales || 0; 
    let vivosActivos = 0;
    if (atacando) vivosActivos = EstadoBatalla.tropasVivas.filter(p => p.idUnico && !p.ignorarMuerto && jugador.tropas.find(t=>t.idUnico===p.idUnico)?.hp > 0).length;

    gridIds.forEach((id, index) => {
        let slot = document.getElementById(id);
        if (slot) {
            if (index < bajasVisuales) {
                slot.innerHTML = RenderCombate.htmlEnemigoPica("muerto");
                slot.style.border = "none"; slot.style.background = "transparent";
            } else if (atacando && index < bajasVisuales + vivosActivos) {
                slot.innerHTML = RenderCombate.htmlEnemigoPica("vacio");
                slot.style.border = "2px dashed rgba(255, 76, 76, 0.3)"; slot.style.background = "transparent";
            } else {
                slot.innerHTML = RenderCombate.htmlEnemigoPica("vivo");
                slot.style.border = "2px solid #ff4c4c"; slot.style.background = "transparent";
            }
        }
    });
}

function restaurarVisualesCombate() {
    let idTablero = EstadoBatalla.tipoCombate === "cuna" ? "formacion-tablero" : "formacion-picas-tablero";
    let idReservas = EstadoBatalla.tipoCombate === "cuna" ? "zona-reservas" : "zona-reservas-picas";
    let tablero = document.getElementById(idTablero); if(tablero) tablero.classList.add("modo-combate");

    document.querySelectorAll(".en-combate").forEach(el => el.classList.remove("en-combate"));
    document.querySelectorAll(".enemigo-atacando-pica").forEach(el => el.remove());

    document.querySelectorAll(".slot-formacion").forEach(s => { s.style.opacity = "1"; });
    document.querySelectorAll(`#${idTablero} .tropa-draggable`).forEach(el => el.remove());
    document.querySelectorAll(`#${idTablero} .skull-icon, #${idTablero} .cross-icon`).forEach(el => el.remove());

    if (window.marcadoresBatalla) {
        window.marcadoresBatalla.forEach(m => {
            if (EstadoBatalla.tipoCombate === "cuna") {
                let visualCol = m.col > 3 ? 3 : m.col;
                let slotId = (visualCol < 0) ? `aliado-${m.row}-${visualCol}` : `enemigo-${m.row}-${visualCol}`;
                let slot = document.getElementById(slotId);
                if(slot) {
                    let eImg = slot.querySelector('.enemigo-img'); if(eImg) eImg.remove();
                    let eHp = slot.querySelector('.enemigo-hp-combate'); if(eHp) eHp.remove();
                    let icon = document.createElement('div'); icon.className = m.tipo === 'skull' ? 'skull-icon' : 'cross-icon';
                    icon.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
                    icon.style.cssText = `position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; font-size:${m.tipo==='skull'?'35px':'40px'}; z-index:2; opacity:0.7; color:${m.tipo==='cross'?'#c0c0c0':'#fff'}; text-shadow:${m.tipo==='cross'?'0 0 10px #fff':'none'};`;
                    slot.appendChild(icon);
                }
            } else if (EstadoBatalla.tipoCombate === "picas" || EstadoBatalla.tipoCombate === "picas_bosque" || EstadoBatalla.tipoCombate === "sacrificio") {
                if (m.slotPos) {
                    let slotId = `pica-slot-${m.slotPos.split("-")[1]}`; let slot = document.getElementById(slotId);
                    if(slot) {
                        let icon = document.createElement('div'); icon.className = m.tipo === 'skull' ? 'skull-icon' : 'cross-icon';
                        icon.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
                        icon.style.cssText = `position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; font-size:${m.tipo==='skull'?'35px':'40px'}; z-index:2; opacity:0.7; color:${m.tipo==='cross'?'#c0c0c0':'#fff'}; text-shadow:${m.tipo==='cross'?'0 0 10px #fff':'none'};`;
                        slot.appendChild(icon);
                    }
                } else if (m.row !== undefined && m.col !== undefined) {
                    let tableroPicas = document.getElementById("formacion-picas-tablero");
                    if (tableroPicas) {
                        let icon = document.createElement('div'); icon.className = m.tipo === 'skull' ? 'skull-icon' : 'cross-icon';
                        icon.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
                        let tops = [15, 32, 50, 68, 85]; let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84, "3": 95 };
                        let leftPos = cols[m.col] || 50; let topPos = tops[m.row] || 50;
                        icon.style.cssText = `position:absolute; top:${topPos}%; left:${leftPos}%; transform:translate(-50%,-50%); font-size:${m.tipo==='skull'?'35px':'40px'}; z-index:1; opacity:0.35; color:${m.tipo==='cross'?'#c0c0c0':'#fff'}; text-shadow:${m.tipo==='cross'?'0 0 10px #fff':'none'}; pointer-events:none;`;
                        tableroPicas.appendChild(icon);
                    }
                }
            }
        });
    }

    EstadoBatalla.tropasVivas.forEach(pos => {
        if (pos.idUnico) {
            let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
            if (tr && tr.hp > 0 && !pos.ignorarMuerto) {
                let targetId = "";
                if (EstadoBatalla.tipoCombate === "cuna") {
                    if (pos.col >= 3) return;
                    let visualCol = pos.col; 
                    targetId = (visualCol < 0) ? `aliado-${pos.row}-${visualCol}` : `enemigo-${pos.row}-${visualCol}`;
                } else { 
                    targetId = `pica-slot-${pos.slotPos.split("-")[1]}`; 
                }

                let targetSlot = document.getElementById(targetId);
                if (targetSlot) {
                    let claseBorde = tr.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                    let card = document.createElement("div"); 
                    card.className = `soldier-frame tropa-draggable ${claseBorde} caballero-ocupando`; 
                    card.id = "drag-" + tr.idUnico;
                    card.innerHTML = RenderCombate.htmlFichaTropaInner(tr);
                    targetSlot.appendChild(card);
                }
            }
        }
    });

    let zonaReservas = document.getElementById(idReservas);
    if (zonaReservas) {
        zonaReservas.innerHTML = ""; zonaReservas.style.display = "grid"; zonaReservas.style.gridTemplateColumns = "repeat(2, 75px)"; zonaReservas.style.gap = "10px"; zonaReservas.style.alignContent = "start"; zonaReservas.style.justifyContent = "center";
        let reservasVisibles = EstadoBatalla.reservas.slice(0, 8);
        reservasVisibles.forEach((reserva, idx) => {
            // FIX TÁCTICO BLINDAJE: Si la reserva es "null" (hueco vacío), dibujamos un elemento invisible pero que ocupa espacio geométrico
            if (!reserva) {
                let dummy = document.createElement("div");
                dummy.className = "invisible-slot";
                dummy.id = "dummy-res-" + idx;
                dummy.style.width = "75px"; dummy.style.height = "75px";
                zonaReservas.appendChild(dummy);
            } else {
                let tr = jugador.tropas.find(t => t.idUnico === reserva.idUnico);
                if(tr) {
                    let card = document.createElement("div"); 
                    let claseBorde = tr.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria'; 
                    card.className = `soldier-frame tropa-draggable ${claseBorde} caballero-reserva`; 
                    card.id = "drag-" + tr.idUnico;
                    card.innerHTML = RenderCombate.htmlFichaTropaInner(tr);
                    zonaReservas.appendChild(card);
                }
            }
        });
    }

    if (EstadoBatalla.tipoCombate === "picas" || EstadoBatalla.tipoCombate === "picas_bosque" || EstadoBatalla.tipoCombate === "sacrificio") { 
        if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(false); 
    }
}

function generarResumenFinTurnoLog(numTurno, logArray) {
    let perforadores = [];
    EstadoBatalla.tropasVivas.forEach(pos => {
        if(pos.idUnico) {
            let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
            if(tropa && tropa.hp > 0 && pos.col >= 0 && pos.col <= 2) perforadores.push(tropa.nombre);
        }
    });
    
    let isCuna = EstadoBatalla.tipoCombate === "cuna" ? perforadores : null;
    logArray.push(RenderCombate.htmlResumenTurno(numTurno, isCuna, EstadoBatalla.bajasEnemigas));
}

function tirarGritoGuerraLog(nombre, logArray) {
    if (Math.random() < 0.3) {
        let grito = gritosGuerraAliados[Math.floor(Math.random() * gritosGuerraAliados.length)];
        logArray.push(`<p class="txt-multitud" style="text-align:center; margin:10px 0;"><b>${nombre}:</b> "${grito}"</p>`);
    }
}

function finalizarCombateGlobal() {
    limpiarBotones();
    if (typeof jugador.cementerio === 'undefined') jugador.cementerio = [];
    if (typeof jugador.caidosBatallaActual === 'undefined') jugador.caidosBatallaActual = [];
    
    let soldadosCaidos = 0;
    let lugarMuerteDesc = "en el fragor de la batalla";
    if (EstadoBatalla.tipoCombate === "cuna") lugarMuerteDesc = "en la heroica Carga de Cuña";
    else if (EstadoBatalla.tipoCombate === "picas") lugarMuerteDesc = "sosteniendo el Muro en el Puente";
    else if (EstadoBatalla.tipoCombate === "picas_bosque") lugarMuerteDesc = "en el Muro de Picas del Bosque Negro";
    else if (EstadoBatalla.tipoCombate === "sacrificio") lugarMuerteDesc = "en el Sacrificio Supremo de la Última Línea";

    for (let i = jugador.tropas.length - 1; i >= 0; i--) {
        if (jugador.tropas[i].hp <= 0) {
            let tropaMuerta = jugador.tropas.splice(i, 1)[0]; 
            tropaMuerta.lugarMuerte = lugarMuerteDesc;
            jugador.cementerio.push(tropaMuerta);             
            soldadosCaidos++;
            let prefijo = "Hno.";
            if (tropaMuerta.tipoGeneral === "caballeros") prefijo = "Caballero";
            else if (tropaMuerta.tipoGeneral === "ballesteros") prefijo = "Ballestero";
            else if (tropaMuerta.tipoGeneral === "piqueros") prefijo = "Piquero";
            
            jugador.caidosBatallaActual.push({ nombreCompleto: `${prefijo} ${tropaMuerta.nombre}`, lugar: lugarMuerteDesc });
        }
    }
    
    let victoria = false;
    if (EstadoBatalla.tipoCombate === "cuna") { victoria = (EstadoBatalla.bajasEnemigas >= CONSTANTES_TACTICAS.CUNA_BAJAS_VICTORIA); }
    else if (EstadoBatalla.tipoCombate === "picas" || EstadoBatalla.tipoCombate === "picas_bosque" || EstadoBatalla.tipoCombate === "sacrificio") {
        victoria = (EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro); EstadoBatalla.hordaMuertosActuales = 0; 
        if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(false);
    }

    if (victoria && typeof EstadoBatalla.eventoEspecialVictoria === 'function') {
        EstadoBatalla.eventoEspecialVictoria().then(() => { imprimirPolvoSeAsienta(victoria, soldadosCaidos); });
    } else {
        imprimirPolvoSeAsienta(victoria, soldadosCaidos);
    }
}

function imprimirPolvoSeAsienta(victoria, soldadosCaidos) {
    let feGanada = 0; 
    if (victoria) { feGanada = soldadosCaidos === 0 ? 20 : 12; }
    
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;
    let pending = document.querySelectorAll('.pendiente-dados').length > 0;
    let displayStyle = (!autoCombat && pending) ? "none" : "block";

    let htmlPolvo = RenderCombate.htmlPolvoSeAsienta(victoria, soldadosCaidos, EstadoBatalla.bajasEnemigas, feGanada, displayStyle);
    agregarTexto(htmlPolvo, "", true);
    
    crearBoton("EVALUAR RESULTADOS", () => { 
        if(window.verificarCombatesPendientes() && EstadoBatalla.callback) {
            if (victoria) { jugador.liderazgo += feGanada; if(typeof actualizarHUD === 'function') actualizarHUD(); }
            document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
            EstadoBatalla.callback(victoria, EstadoBatalla.bajasEnemigas); 
        }
    });

    if (!autoCombat && pending) {
        setTimeout(() => {
            let actionArea = document.getElementById("action-area");
            if(actionArea) actionArea.style.display = "none";
        }, 10);
    }
}

function evaluarContinuacionBatalla() {
    document.querySelectorAll("button").forEach(b => {
        if (b.innerText.includes("REEMPLAZO")) b.style.display = "none";
    });

    let actionArea = document.getElementById("action-area");
    if(actionArea) actionArea.style.display = "flex"; 

    if (EstadoBatalla.tipoCombate === "cuna") {
        let maxT = EstadoBatalla.maxTurnos || 7;
        let combatesPosibles = false;
        
        EstadoBatalla.tropasVivas.forEach(pos => {
            let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
            if (tr && tr.hp > 0 && !pos.ignorarMuerto && pos.col <= 2) {
                combatesPosibles = true;
            }
        });

        if(EstadoBatalla.bajasEnemigas >= CONSTANTES_TACTICAS.CUNA_BAJAS_VICTORIA) {
            if (!EstadoBatalla.cargandoVictoria) {
                EstadoBatalla.cargandoVictoria = true;
                restaurarVisualesCombate(); 
                if (typeof animarAvanceCuna === "function") {
                    animarAvanceCuna(true); 
                }
                return;
            } else {
                restaurarVisualesCombate(); 
                finalizarCombateGlobal();
                return;
            }
        }

        if(EstadoBatalla.turnoActual > maxT || !combatesPosibles) {
            restaurarVisualesCombate(); 
            finalizarCombateGlobal();
            return;
        }
    } else if (EstadoBatalla.tipoCombate === "picas" || EstadoBatalla.tipoCombate === "picas_bosque" || EstadoBatalla.tipoCombate === "sacrificio") {
        if(EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) {
            restaurarVisualesCombate(); 
            finalizarCombateGlobal();
            return;
        }
    }

    let alguienPeleando = EstadoBatalla.tropasVivas.some(pos => {
        if (!pos.idUnico) return false;
        let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
        return tr && tr.hp > 0 && (EstadoBatalla.tipoCombate === "cuna" ? pos.col <= 2 : true); 
    });
    
    if (!alguienPeleando) {
        restaurarVisualesCombate(); 
        finalizarCombateGlobal(); 
        return;
    }
    
    restaurarVisualesCombate(); 
    
    if(EstadoBatalla.tipoCombate === "cuna") {
        animarDialogoAvanceCuna();
    } else if(EstadoBatalla.tipoCombate === "picas") {
        animarDialogoAvancePicas();
    } else if(EstadoBatalla.tipoCombate === "picas_bosque") {
        animarDialogoAvancePicasBosque();
    } else if(EstadoBatalla.tipoCombate === "sacrificio") {
        if (typeof animarDialogoAvanceSacrificio === 'function') animarDialogoAvanceSacrificio();
    }
}