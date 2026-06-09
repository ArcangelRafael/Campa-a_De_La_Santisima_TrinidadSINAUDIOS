/* === NODO_PICAS_BOSQUE.JS - LÓGICA EXCLUSIVA DEL MURO DE PICAS (BOSQUE) === */

// =========================================================================
// FUNCIÓN GLOBAL DE ANIMACIÓN DE CAÍDOS Y CRUCES PERSISTENTES
// =========================================================================
window.animarMuertePiquero = function(slot, tipo) {
    if(!slot) return;
    
    // 1. Efecto de desvanecimiento en la tarjeta de la tropa
    let card = slot.querySelector('.tropa-draggable') || slot.firstElementChild;
    if(card && !card.classList.contains('marcador-batalla')) {
        card.style.transition = "opacity 2.5s ease-out, filter 2.5s ease-out";
        card.style.filter = "grayscale(100%) sepia(30%) brightness(0.4)";
        card.style.opacity = "0";
    }
    
    // 2. Aparición de la Cruz Dorada (o Calavera)
    let cross = document.createElement("div");
    cross.innerHTML = tipo === 'cross' ? "✝" : "💀";
    cross.className = `marcador-batalla ${tipo}-icon persistent-death-mark`; 
    cross.style.cssText = `position:absolute; font-size:45px; z-index:90; pointer-events:none; opacity: 0; transition: opacity 2.5s ease-in; top: 50%; left: 50%; transform: translate(-50%, -50%);`;
    
    if (tipo === 'cross') {
        cross.style.color = "#ffd700";
        cross.style.textShadow = "0 0 15px #ffaa00, 0 0 40px #ffaa00, 0 0 60px #ffaa00";
    } else {
        cross.style.color = "#ffffff";
        cross.style.textShadow = "0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 45px #ff0000";
    }
    slot.appendChild(cross);

    setTimeout(() => { cross.style.opacity = "0.95"; }, 100);
};

async function iniciarCombatePicasBosque(formacion, callbackFinalizar, metaPP, turnosFase) {
    EstadoBatalla.limpiar(); 
    EstadoBatalla.tipoCombate = "picas_bosque";
    if (!window.marcadoresBatalla) window.marcadoresBatalla = []; // Inicializamos registro de cruces

    // =========================================================================
    // INYECCIÓN DE CSS PARA LA ZONA DE CONTENCIÓN Y ENEMIGOS
    // =========================================================================
    let styleId = "picas-bosque-style";
    if (!document.getElementById(styleId)) {
        let style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            /* EL TABLERO CONTENEDOR TIPO CINE */
            #formacion-picas-tablero {
                position: relative; 
                overflow: hidden; 
            }

            /* LA ZONA DE BATALLA (CONTENCIÓN) */
            .zona-batalla-picas-bosque-anim {
                position: absolute; 
                top: 50%; 
                left: 0; 
                width: 100%; 
                height: 400px; 
                transform: translateY(-50%); 
                z-index: 150;
                display: flex; 
                align-items: center; 
            }

            /* LA CUADRÍCULA ALIADA (COMPACTADA) */
            .modo-combate #zona-aliada-picas > div { 
                display: grid !important; 
                grid-template-columns: 75px !important; 
                grid-template-rows: repeat(4, 75px) !important; 
                gap: 5px !important; 
                margin-bottom: 0 !important; 
            }
            .modo-combate #zona-aliada-picas .slot-formacion { transform: none !important; }
            .modo-combate #zona-aliada-picas { 
                margin-left: 80px !important; 
                margin-right: 0 !important; 
                z-index: 2; 
                transform: scale(0.95); 
            }

            /* LA CUADRÍCULA DE RESERVAS (OCULTAS DURANTE COMBATE) */
            .modo-combate #zona-reservas-picas { 
                display: none !important; /* <--- FIX TÁCTICO: RESERVAS INVISIBLES */
            }

            /* LA CUADRÍCULA ENEMIGA (SEPARADA Y RETROCEDIDA) */
            .modo-combate #zona-enemiga-picas { 
                margin-left: 45px !important; /* <--- EMPUJE HACIA ATRÁS */
                margin-right: 20px !important; 
                z-index: 3; 
                transform: scale(0.95); 
            }
            
            .modo-combate #zona-enemiga-picas > div {
                display: grid !important;
                grid-template-columns: repeat(3, 75px) !important; /* <--- FUERZA COLUMNAS EXACTAS */
                gap: 5px 20px !important; /* <--- SEPARACIÓN HORIZONTAL PARA NO ENCIMARSE */
            }

            /* TARJETAS ENEMIGAS EXACTAMENTE IGUALES A LAS ALIADAS */
            .modo-combate #zona-enemiga-picas .enemigo-atacando-pica,
            .modo-combate #zona-enemiga-picas > div > div {
                width: 75px !important; 
                height: 75px !important; 
                box-sizing: border-box !important; 
            }

            /* PURGA DE LAS LÍNEAS ROJAS PUNTEADAS EN ENEMIGOS MUERTOS/VACÍOS */
            .modo-combate #zona-enemiga-picas > div > div[style*="dashed"],
            .modo-combate #zona-enemiga-picas > div > div:empty {
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    // =========================================================================
    
    EstadoBatalla.metaProgresoMuro = metaPP;
    EstadoBatalla.turnosFaseBosque = turnosFase;
    if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = turnosFase; 

    EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
    EstadoBatalla.maxTurnos = turnosFase;
    EstadoBatalla.callback = callbackFinalizar;

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

        let zonaBatalla = document.getElementById("zona-batalla-picas-bosque-anim");
        if (!zonaBatalla) {
            zonaBatalla = document.createElement("div");
            zonaBatalla.id = "zona-batalla-picas-bosque-anim";
            zonaBatalla.className = "zona-batalla-picas-bosque-anim";
            
            let zonaRes = document.getElementById("zona-reservas-picas");
            let zonaAli = document.getElementById("zona-aliada-picas");
            let zonaEne = document.getElementById("zona-enemiga-picas");
            
            if (zonaRes) zonaBatalla.appendChild(zonaRes);
            if (zonaAli) zonaBatalla.appendChild(zonaAli);
            if (zonaEne) zonaBatalla.appendChild(zonaEne);

            tablero.appendChild(zonaBatalla);
        }

        if (!document.getElementById("niebla-combate-picas")) {
            let nieblaCombat = document.createElement("div");
            nieblaCombat.id = "niebla-combate-picas";
            nieblaCombat.className = "efecto-neblina";
            nieblaCombat.style.cssText = "z-index: 800 !important; pointer-events: none; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; opacity: 0.85;";
            zonaBatalla.appendChild(nieblaCombat);
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
                        divEnemigo.style.cssText = "position:absolute; top:0px; right:-70px; width:75px; height:75px; border:2px solid #ff4c4c; background:#1a1a1a; z-index:150; transform:translateX(60px); transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius:4px; box-shadow: -5px 0 15px rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center;";
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
            GestorEstado.recibirDano(tropa.idUnico, 1);
            
            phase1Cons = `<span class="txt-hereje">¡Brecha en la guardia! El enemigo perfora y hiere a ${tropa.nombre}.</span>`;
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                
                // FIX TÁCTICO: Registro persistente y Animación de Desvanecimiento + Cruz
                window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
                window.animarMuertePiquero(slotPica, 'cross');
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
                
                // Animación de cráneo para el enemigo
                window.marcadoresBatalla.push({tipo: 'skull', slotPos: pos.slotPos}); 
                window.animarMuertePiquero(slotPica, 'skull');
            } else {
                GestorEstado.recibirDano(tropa.idUnico, 1);
                
                phase2Cons = `<span class="txt-hereje">¡Duelo sangriento! ${tropa.nombre} sufre una herida en la refriega.</span>`;
                if(tropa.hp <= 0) {
                    phase2Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                    
                    // FIX TÁCTICO: Registro persistente y Animación de Desvanecimiento + Cruz
                    window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
                    window.animarMuertePiquero(slotPica, 'cross');
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