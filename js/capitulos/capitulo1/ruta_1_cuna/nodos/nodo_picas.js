/* === NODO_PICAS.JS - LÓGICA EXCLUSIVA DEL MURO DE PICAS (PUENTE) === */

async function iniciarCombatePicas(formacion, callbackFinalizar) {
    EstadoBatalla.limpiar(); 
    EstadoBatalla.tipoCombate = "picas";

    let styleId = "picas-reserva-style";
    if (!document.getElementById(styleId)) {
        let style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            /* EL TABLERO CONTENEDOR TIPO CINE */
            #formacion-picas-tablero {
                position: relative; /* Para que la zona de batalla se ancle a él */
                overflow: hidden; /* Corta todo lo que se salga */
            }

            /* LA ZONA DE BATALLA (CONTENCIÓN) */
            .zona-batalla-anim {
                position: absolute; 
                top: 50%; 
                left: 0; 
                width: 100%; 
                height: 400px; 
                transform: translateY(-50%); 
                z-index: 150;
                display: flex; /* Para alinear zonas aliadas y enemigas */
                align-items: center; /* Centrado vertical */
            }

            /* LA CUADRÍCULA ALIADA (COMPACTADA) */
            .modo-combate #zona-aliada-picas > div { 
                display: grid !important; 
                grid-template-columns: 75px !important; 
                grid-template-rows: repeat(4, 75px) !important; 
                gap: 5px !important; /* <--- FIX TÁCTICO: Reducido de 10px a 5px para compactar */
                margin-bottom: 0 !important; 
            }
            .modo-combate #zona-aliada-picas .slot-formacion { transform: none !important; }
            .modo-combate #zona-aliada-picas { 
                margin-left: 80px !important; 
                margin-right: 0 !important; 
                z-index: 2; 
                transform: scale(0.95); /* Escala general para asegurar que encaje en los 400px */
            }

            /* LA CUADRÍCULA DE RESERVAS */
            .modo-combate #zona-reservas-picas { 
                display: grid !important; 
                grid-template-rows: repeat(4, 75px) !important; 
                grid-auto-columns: 75px !important; 
                grid-auto-flow: column !important; 
                direction: rtl !important; 
                gap: 5px !important; /* <--- COMPACTADO TAMBIÉN */
                border-right: none !important; 
                padding-right: 0 !important; 
                margin-right: 15px !important; 
                align-content: center !important; 
                transform: scale(0.95); /* Escala para igualar vanguardia */
            }
            .modo-combate #zona-reservas-picas > div { direction: ltr !important; transform: scale(0.95) !important; }
            .modo-combate #zona-reservas-picas > div:nth-child(8n+5), 
            .modo-combate #zona-reservas-picas > div:nth-child(8n+6), 
            .modo-combate #zona-reservas-picas > div:nth-child(8n+7), 
            .modo-combate #zona-reservas-picas > div:nth-child(8n+8) { 
                /* Se ajustó el salto de 42px a 40px por la compactación del grid */
                transform: translateY(40px) scale(0.95) !important; 
            }
            .modo-combate #zona-reservas-picas .caballero-reserva { opacity: 0.9 !important; filter: brightness(0.8) !important; }

            /* LA CUADRÍCULA ENEMIGA */
            .modo-combate #zona-enemiga-picas { 
                margin-left: 10px !important; 
                margin-right: 20px !important; 
                z-index: 3; 
                transform: scale(0.95); /* Escala general */
            }
            
            .modo-combate #zona-enemiga-picas > div {
                gap: 5px !important; /* <--- COMPACTADO TAMBIÉN */
            }

            /* FIX TÁCTICO: TARJETAS ENEMIGAS EXACTAMENTE IGUALES A LAS ALIADAS */
            .modo-combate #zona-enemiga-picas .enemigo-atacando-pica,
            .modo-combate #zona-enemiga-picas > div > div {
                width: 75px !important; /* <--- TAMAÑO FIJO ANCHO */
                height: 75px !important; /* <--- TAMAÑO FIJO ALTO (Antes era 90px) */
                box-sizing: border-box !important; /* Evita que los bordes lo hagan crecer */
            }
        `;
        document.head.appendChild(style);
    }

    let totalPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;
    let ppTurno = (totalPiq >= 4) ? 12 : (totalPiq === 3 ? 8 : (totalPiq === 2 ? 6 : (totalPiq === 1 ? 3 : 12)));
    
    EstadoBatalla.metaProgresoMuro = ppTurno * 4; 
    if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = 4; 

    EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
    EstadoBatalla.maxTurnos = 4;
    EstadoBatalla.callback = callbackFinalizar;
    EstadoBatalla.eventoEspecialVictoria = playModalAlivioPicas;
    
    EstadoBatalla.tropasVivas = [
        { idUnico: formacion.slots["pica-1"], posNombre: "el flanco izquierdo de picas", slotPos: "pica-1" },
        { idUnico: formacion.slots["pica-2"], posNombre: "el centro izquierdo de picas", slotPos: "pica-2" },
        { idUnico: formacion.slots["pica-3"], posNombre: "el centro derecho de picas", slotPos: "pica-3" },
        { idUnico: formacion.slots["pica-4"], posNombre: "el flanco derecho de picas", slotPos: "pica-4" }
    ];

    storyArea.innerHTML = "";
    prepararBotonTurno();
    animarDialogoAvancePicas();
    setTimeout(() => { if(typeof storyArea !== 'undefined') storyArea.scrollTop = 0; window.scrollTo(0, 0); }, 50);
}

async function animarDialogoAvancePicas() {
    let divDialogo = document.createElement("div"); storyArea.appendChild(divDialogo);
    await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, { personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align", texto: `"¡PREPARAD LAS ARMAS! Turno ${EstadoBatalla.turnoActual}... El enemigo se acerca. ¡Ni un paso atrás!"`, claseTexto: "txt-lugarteniente" });
    animarAvancePicas();
}

function animarAvancePicas() {
    document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
    
    requestAnimationFrame(() => {
        document.getElementById("formacion-overlay").style.display = "flex"; 
        let tablero = document.getElementById("formacion-picas-tablero");
        tablero.style.display = "flex"; tablero.classList.add("modo-combate");
        tablero.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('assets/img/fondos/puente_fondo.webp')";
        tablero.style.backgroundSize = "cover"; tablero.style.backgroundPosition = "center bottom";
        
        let zonaBatalla = document.getElementById("zona-batalla-picas-anim");
        if (!zonaBatalla) {
            zonaBatalla = document.createElement("div");
            zonaBatalla.id = "zona-batalla-picas-anim";
            zonaBatalla.className = "zona-batalla-anim";
            
            let zonaRes = document.getElementById("zona-reservas-picas");
            let zonaAli = document.getElementById("zona-aliada-picas");
            let zonaEne = document.getElementById("zona-enemiga-picas");
            
            if (zonaRes) zonaBatalla.appendChild(zonaRes);
            if (zonaAli) zonaBatalla.appendChild(zonaAli);
            if (zonaEne) zonaBatalla.appendChild(zonaEne);

            tablero.appendChild(zonaBatalla);
        }

        if (!document.getElementById("niebla-combate-picas")) {
            let nieblaCombat = document.createElement("div"); nieblaCombat.id = "niebla-combate-picas"; nieblaCombat.className = "efecto-neblina"; tablero.appendChild(nieblaCombat);
        }

        let labelTurnos = document.getElementById("label-turnos-picas"); if(labelTurnos) labelTurnos.style.display = "none";
        document.getElementById("btn-iniciar-formacion-picas").style.display = "none"; document.getElementById("btn-iniciar-formacion").style.display = "none"; document.getElementById("btn-ver-reporte").style.display = "none";
        document.getElementById("titulo-formacion").innerText = `🛡️ DEFENSA DEL MURO: TURNO ${EstadoBatalla.turnoActual} 🛡️`;

        restaurarVisualesCombate();
        if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(true);

        EstadoBatalla.logTurnoGlobal = []; EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual)); EstadoBatalla.accionesPendientes = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
                    let enemigo = GeneradorHordas.obtenerEnemigoPicas(); 
                    EstadoBatalla.accionesPendientes.push({ tropa, pos, enemigo });
                    
                    let slotPica = document.getElementById(`pica-slot-${pos.slotPos.split("-")[1]}`);
                    if(slotPica) {
                        let divEnemigo = document.createElement("div"); divEnemigo.className = "enemigo-atacando-pica";
                        divEnemigo.style.cssText = "position:absolute; top:0px; right:-70px; width:75px; height:75px; border:2px solid #ff4c4c; background:#1a1a1a; z-index:150; transform:translateX(60px); transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius:4px; box-shadow: -5px 0 15px rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center;";
                        divEnemigo.innerHTML = `<img src="assets/img/personajes/enemigos/enemigo.webp" style="width:100%;height:100%;object-fit:cover; transform:scaleX(-1); border-radius:2px;">`;
                        slotPica.appendChild(divEnemigo); setTimeout(() => divEnemigo.style.transform = "translateX(0)", 100);
                    }
                }
            }
        });
        
        document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesPicas;
        document.getElementById("btn-tirar-dados").style.display = "inline-block";
    });
}

function resolverDadosVisualesPicas() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe(); let picasParticipantes = EstadoBatalla.accionesPendientes.length;
    let puntosGanados = {1:3, 2:6, 3:8, 4:12}[picasParticipantes] || 0; EstadoBatalla.progresoMuro += puntosGanados;
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.accionesPendientes.forEach(acc => {
        let { tropa, pos, enemigo } = acc;
        let slotPicaId = `pica-slot-${pos.slotPos.split("-")[1]}`; let slotPica = document.getElementById(slotPicaId);
        
        // FIX DOD: El combate ya calcula Atk/Def y Mochila gracias a GestorEstado.evaluarPoderTropa
        let poderDef = GestorEstado.evaluarPoderTropa(tropa, 'def');
        let dadoGracia = (jugador.liderazgo <= -50) ? 0 : tirarDado(); let dadoFuria = (jugador.liderazgo >= 126) ? 0 : tirarDado();
        let pDefAliado = poderDef.neto + dadoGracia + infoFe.mod; let pAtkEnemigo = enemigo.atk + dadoFuria;

        let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`; let classMod = (infoFe.mod >= 0) ? "mensaje-sistema" : "txt-hereje";
        if (infoFe.mod === 0) classMod = "txt-sagrado";

        let idBc = 'bc_' + Math.random().toString(36).substr(2,9); let idBcCounter = idBc + '_counter';
        let phase1Cons = ""; let hasCounter = false;

        if (pDefAliado >= pAtkEnemigo) {
            hasCounter = true; phase1Cons = `<span class="mensaje-sistema">¡Muro Impenetrable! ${tropa.nombre} resiste y prepara contraataque.</span>`;
        } else {
            GestorEstado.recibirDano(tropa.idUnico, 1);
            phase1Cons = `<span class="txt-hereje">¡Brecha en la guardia! El enemigo perfora y hiere a ${tropa.nombre}.</span>`;
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
                if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'cross'); 
            }
        }

        // FIX TÁCTICO DOD: Inyectar tropaId
        let dataRender = {
            tropaId: tropa.idUnico,
            posNombre: pos.posNombre, enemigoNombre: enemigo.nombre, tropaNombre: tropa.nombre,
            defBase: poderDef.base, stringHerido: poderDef.stringEfectos, dadoGracia, classMod, signoMod, infoFeNombre: infoFe.nombre, pDefAliado,
            atkEnemigoBase: enemigo.atk, dadoFuria, pAtkEnemigo, phase1Cons, idBc, hasCounter, idBcCounter, autoCombat
        };
        let logStr = RenderCombate.htmlAsaltoPicas(dataRender);

        if (hasCounter) {
            let poderAtk = GestorEstado.evaluarPoderTropa(tropa, 'atk');
            let dadoGracia2 = (jugador.liderazgo <= -50) ? 0 : tirarDado(); let dadoFuria2 = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            let pAtkAliado = poderAtk.neto + dadoGracia2 + infoFe.mod; let pAtkEnemigo2 = enemigo.atk + dadoFuria2;
            let phase2Cons = "";

            if (pAtkAliado > pAtkEnemigo2) {
                EstadoBatalla.bajasEnemigas++; EstadoBatalla.hordaMuertosActuales++;
                phase2Cons = `<span class="mensaje-sistema">¡Infiel Ensartado! El asaltante muere en las lanzas.</span>`;
                window.marcadoresBatalla.push({tipo: 'skull', slotPos: pos.slotPos}); 
                if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'skull'); 
            } else {
                GestorEstado.recibirDano(tropa.idUnico, 1);
                phase2Cons = `<span class="txt-hereje">¡Duelo sangriento! ${tropa.nombre} sufre una herida en la refriega.</span>`;
                if(tropa.hp <= 0) {
                    phase2Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                    window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
                    if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'cross'); 
                }
            }

            // FIX TÁCTICO DOD: Inyectar tropaId
            let dataCounter = { 
                tropaId: tropa.idUnico,
                tropaNombre: tropa.nombre, atkBase: poderAtk.base, stringHerido: poderAtk.stringEfectos, dadoGracia2, classMod, signoMod, infoFeNombre: infoFe.nombre, pAtkAliado, 
                enemigoNombre: enemigo.nombre, atkEnemigoBase: enemigo.atk, dadoFuria2, pAtkEnemigo2, phase2Cons, idBcCounter, autoCombat 
            };
            logStr += RenderCombate.htmlContraataquePicas(dataCounter);
        }
        
        EstadoBatalla.logTurnoGlobal.push(logStr);

        if(slotPica) { let enemyVis = slotPica.querySelector(".enemigo-atacando-pica"); if(enemyVis) enemyVis.remove(); slotPica.classList.remove("en-combate"); }
    });

    let vivosHorda = 9 - EstadoBatalla.hordaMuertosActuales;
    if (vivosHorda <= 3) {
        EstadoBatalla.hordaMuertosActuales = Math.max(0, EstadoBatalla.hordaMuertosActuales - 2);
        EstadoBatalla.logTurnoGlobal.push(`<p class="txt-sagrado separador">¡La horda pagana se reagrupa! Nuevos herejes emergen de las sombras.</p>`);
    }

    if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(false);

    let metaDin = EstadoBatalla.metaProgresoMuro || 48;
    let avancePorc = Math.min(100, Math.round((EstadoBatalla.progresoMuro / metaDin) * 100));
    
    let displayStyle = autoCombat ? "block" : "none";
    EstadoBatalla.logTurnoGlobal.push(`<div class="resumen-turno-box resumen-oculto" style="display:${displayStyle};"><b>Progreso de la Defensa: ${avancePorc}%</b><br>Bajas enemigas trituradas: ${EstadoBatalla.bajasEnemigas}</div>`);
    
    EstadoBatalla.turnoActual++;
    if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
}