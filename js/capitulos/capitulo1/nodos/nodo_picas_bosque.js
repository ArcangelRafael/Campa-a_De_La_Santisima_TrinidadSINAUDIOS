/* === NODO_PICAS_BOSQUE.JS - LÓGICA EXCLUSIVA DEL MURO DE PICAS (BOSQUE) === */

async function iniciarCombatePicasBosque(formacion, callbackFinalizar, metaPP, turnosFase) {
    EstadoBatalla.limpiar(); 
    EstadoBatalla.tipoCombate = "picas_bosque";
    
    EstadoBatalla.metaProgresoMuro = metaPP;
    EstadoBatalla.turnosFaseBosque = turnosFase;
    if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = turnosFase; 

    EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
    EstadoBatalla.maxTurnos = turnosFase;
    EstadoBatalla.callback = callbackFinalizar;
    
    // FIX TÁCTICO: Se extirpó el EstadoBatalla.eventoEspecialVictoria. 
    // El bosque ya no llamará a la cinemática del puente.

    EstadoBatalla.tropasVivas = [
        { idUnico: formacion.slots["pica-1"], posNombre: "el flanco izquierdo de picas", slotPos: "pica-1" },
        { idUnico: formacion.slots["pica-2"], posNombre: "el centro izquierdo de picas", slotPos: "pica-2" },
        { idUnico: formacion.slots["pica-3"], posNombre: "el centro derecho de picas", slotPos: "pica-3" },
        { idUnico: formacion.slots["pica-4"], posNombre: "el flanco derecho de picas", slotPos: "pica-4" }
    ];

    storyArea.innerHTML = "";
    
    prepararBotonTurno();
    animarDialogoAvancePicasBosque();

    setTimeout(() => { 
        if(typeof storyArea !== 'undefined') storyArea.scrollTop = 0; 
        window.scrollTo(0, 0); 
    }, 50);
}

async function animarDialogoAvancePicasBosque() {
    let divDialogo = document.createElement("div");
    storyArea.appendChild(divDialogo);

    await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", 
        nombrePersonaje: "Conde JuanA", alineacion: "izq", 
        bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡CUBRID A LOS TIRADORES! Turno ${EstadoBatalla.turnoActual}... La horda acecha. ¡Firmeza ante todo!"`, 
        claseTexto: "txt-lugarteniente"
    });

    animarAvancePicasBosque();
}

function animarAvancePicasBosque() {
    document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');

    requestAnimationFrame(() => {
        document.getElementById("formacion-overlay").style.display = "flex"; 
        
        let tablero = document.getElementById("formacion-picas-tablero");
        tablero.style.display = "flex"; 
        tablero.classList.add("modo-combate");
        
        tablero.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('assets/img/fondos/puentepiso.webp')";
        tablero.style.backgroundSize = "160%";
        tablero.style.backgroundPosition = "left center";

        if (!document.getElementById("niebla-combate-picas")) {
            let nieblaCombat = document.createElement("div");
            nieblaCombat.id = "niebla-combate-picas";
            nieblaCombat.className = "efecto-neblina";
            tablero.appendChild(nieblaCombat);
        }

        let labelTurnos = document.getElementById("label-turnos-picas");
        if(labelTurnos) labelTurnos.style.display = "none";

        document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
        document.getElementById("btn-iniciar-formacion").style.display = "none"; 
        document.getElementById("btn-ver-reporte").style.display = "none";
        
        document.getElementById("titulo-formacion").innerText = `🛡️ PROTEGIENDO RETAGUARDIA: TURNO ${EstadoBatalla.turnoActual} 🛡️`;

        restaurarVisualesCombate();

        if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(true);

        EstadoBatalla.logTurnoGlobal = [];
        EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual));
        
        EstadoBatalla.accionesPendientes = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
                    let enemigo = GeneradorHordas.obtenerEnemigoPicas(); 
                    EstadoBatalla.accionesPendientes.push({ tropa, pos, enemigo });
                    
                    let slotPica = document.getElementById(`pica-slot-${pos.slotPos.split("-")[1]}`);
                    if(slotPica) {
                        let divEnemigo = document.createElement("div");
                        divEnemigo.className = "enemigo-atacando-pica";
                        divEnemigo.style.cssText = "position:absolute; top:5px; right:-65px; width:70px; height:90px; border:2px solid #ff4c4c; background:#1a1a1a; z-index:150; transform:translateX(60px); transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius:4px; box-shadow: -5px 0 15px rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center;";
                        divEnemigo.innerHTML = `<img src="assets/img/personajes/enemigos/enemigo.webp" style="width:100%;height:100%;object-fit:cover; transform:scaleX(-1); border-radius:2px;">`;
                        slotPica.appendChild(divEnemigo);
                        setTimeout(() => divEnemigo.style.transform = "translateX(0)", 100);
                    }
                }
            }
        });
        
        document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesPicasBosque;
        document.getElementById("btn-tirar-dados").style.display = "inline-block";
    });
}

function resolverDadosVisualesPicasBosque() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe();

    let picasParticipantes = EstadoBatalla.accionesPendientes.length;
    let puntosGanados = {1:3, 2:6, 3:8, 4:12}[picasParticipantes] || 0;
    EstadoBatalla.progresoMuro += puntosGanados;

    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.accionesPendientes.forEach(acc => {
        let { tropa, pos, enemigo } = acc;
        let slotPicaId = `pica-slot-${pos.slotPos.split("-")[1]}`;
        let slotPica = document.getElementById(slotPicaId);
        
        let penalidad = (tropa.hp < 2) ? 1 : 0;
        let stringHerido = penalidad > 0 ? ` <span class="txt-hereje">-1 (Herido)</span>` : "";
        let dadoGracia = (jugador.liderazgo <= -50) ? 0 : tirarDado();
        let dadoFuria = (jugador.liderazgo >= 126) ? 0 : tirarDado();
        
        let pDefAliado = (tropa.defMax - penalidad) + dadoGracia + infoFe.mod;
        let pAtkEnemigo = enemigo.atk + dadoFuria;

        let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
        let classMod = (infoFe.mod >= 0) ? "mensaje-sistema" : "txt-hereje";
        if (infoFe.mod === 0) classMod = "txt-sagrado";

        let idBc = 'bc_' + Math.random().toString(36).substr(2,9);
        let idBcCounter = idBc + '_counter';
        let phase1Cons = "";
        let hasCounter = false;

        if (pDefAliado >= pAtkEnemigo) {
            hasCounter = true;
            phase1Cons = `<span class="mensaje-sistema">¡Muro Impenetrable! ${tropa.nombre} resiste y prepara contraataque.</span>`;
        } else {
            tropa.hp--;
            phase1Cons = `<span class="txt-hereje">¡Brecha en la guardia! El enemigo perfora y hiere a ${tropa.nombre}.</span>`;
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
            }
        }

        let dataRender = {
            posNombre: pos.posNombre, enemigoNombre: enemigo.nombre, tropaNombre: tropa.nombre,
            defBase: tropa.defMax, stringHerido, dadoGracia, classMod, signoMod, infoFeNombre: infoFe.nombre, pDefAliado,
            atkEnemigoBase: enemigo.atk, dadoFuria, pAtkEnemigo, phase1Cons, idBc, hasCounter, idBcCounter, autoCombat
        };

        let logStr = RenderCombate.htmlAsaltoPicas(dataRender);

        if (hasCounter) {
            let dadoGracia2 = (jugador.liderazgo <= -50) ? 0 : tirarDado();
            let dadoFuria2 = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            let pAtkAliado = (tropa.atkMax - penalidad) + dadoGracia2 + infoFe.mod;
            let pAtkEnemigo2 = enemigo.atk + dadoFuria2;
            let phase2Cons = "";

            if (pAtkAliado > pAtkEnemigo2) {
                EstadoBatalla.bajasEnemigas++;
                EstadoBatalla.hordaMuertosActuales++;
                phase2Cons = `<span class="mensaje-sistema">¡Infiel Ensartado! El asaltante muere en las lanzas.</span>`;
                window.marcadoresBatalla.push({tipo: 'skull', slotPos: pos.slotPos}); 
            } else {
                tropa.hp--;
                phase2Cons = `<span class="txt-hereje">¡Duelo sangriento! ${tropa.nombre} sufre una herida en la refriega.</span>`;
                if(tropa.hp <= 0) {
                    phase2Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                    window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
                }
            }

            let dataCounter = {
                tropaNombre: tropa.nombre, atkBase: tropa.atkMax, stringHerido, dadoGracia2, classMod, signoMod, infoFeNombre: infoFe.nombre, pAtkAliado,
                enemigoNombre: enemigo.nombre, atkEnemigoBase: enemigo.atk, dadoFuria2, pAtkEnemigo2, phase2Cons, idBcCounter, autoCombat
            };

            logStr += RenderCombate.htmlContraataquePicas(dataCounter);
        }
        
        EstadoBatalla.logTurnoGlobal.push(logStr);

        if(slotPica) {
            let enemyVis = slotPica.querySelector(".enemigo-atacando-pica");
            if(enemyVis) enemyVis.remove();
            slotPica.classList.remove("en-combate");
        }
    });

    let vivosHorda = 9 - EstadoBatalla.hordaMuertosActuales;
    if (vivosHorda <= 3) {
        EstadoBatalla.hordaMuertosActuales = Math.max(0, EstadoBatalla.hordaMuertosActuales - 2);
        EstadoBatalla.logTurnoGlobal.push(`<p class="txt-sagrado separador">¡La horda pagana se reagrupa! Nuevos herejes emergen de las sombras.</p>`);
    }

    if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(false);

    let metaDin = EstadoBatalla.metaProgresoMuro || 12;
    let avancePorc = Math.min(100, Math.round((EstadoBatalla.progresoMuro / metaDin) * 100));
    
    let displayStyle = autoCombat ? "block" : "none";
    EstadoBatalla.logTurnoGlobal.push(`<div class="resumen-turno-box resumen-oculto" style="display:${displayStyle};"><b>Progreso de Cobertura: ${avancePorc}%</b><br>Bajas enemigas trituradas: ${EstadoBatalla.bajasEnemigas}</div>`);
    
    EstadoBatalla.turnoActual++;
    
    if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
}