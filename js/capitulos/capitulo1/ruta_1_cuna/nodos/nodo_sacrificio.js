/* === NODO_SACRIFICIO.JS - LA ÚLTIMA LÍNEA DE LOS BALLESTEROS === */

async function iniciarNarrativaSacrificio() {
    storyArea.innerHTML = ""; limpiarBotones();
    
    if (jugador.narrativaSacrificioVista) {
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Repitan la formación mis ballesteros! ¡Preparad las espadas, por la sangre de Cristo!"`, claseTexto: "txt-lugarteniente"
        });

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray",
            texto: `«Nadie tiene amor más grande que el que da la vida por sus hermanos.» - Juan 15:13`, claseTexto: "txt-sagrado"
        });

        let noblesListos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && (t.clase === "noble" || t.idUnico === jugador.mercenarioRedimidoId) && t.hp > 0 && !t.espadachin);
        if (noblesListos.length > 0) {
            crearBoton("DESPLEGAR LA ÚLTIMA LÍNEA", async () => {
                let formacionInfo = await abrirFormacionSacrificio();
                
                if (formacionInfo.total === 0) {
                    agregarTexto("<h3 class='txt-hereje'>LA COBARDÍA REINA</h3>");
                    agregarTexto("Nadie dio un paso al frente. La horda masacró el campamento.");
                    crearBoton("CONTINUAR", async () => await evaluarVictoriaDerrotaBosque());
                } else {
                    for(let pos in formacionInfo.slots) {
                        if(formacionInfo.slots[pos]) {
                            let tr = jugador.tropas.find(t => t.idUnico === formacionInfo.slots[pos]);
                            if(tr) tr.espadachin = true;
                        }
                    }
                    
                    let metaRequerida = Math.min(3, noblesListos.length);
                    let cantTurnos = Math.max(1, Math.ceil(metaRequerida / formacionInfo.total)); 
                    let metaPP = cantTurnos * formacionInfo.total * 10;
                    
                    let overlay = document.getElementById("formacion-overlay");
                    if(overlay) overlay.style.display = "flex";
                    document.getElementById("formacion-roster").style.display = "none";
                    document.getElementById("formacion-tablero").style.display = "none";
                    document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
                    
                    let skipCine = document.getElementById("ht-skip-cine")?.checked;
                    if(!skipCine && typeof playCinematicaSacrificioBosque === "function") {
                        await new Promise(res => playCinematicaSacrificioBosque(formacionInfo, res));
                    }
                    if(overlay) overlay.style.display = "none";
                    
                    let {victoria, bajas} = await iniciarCombateSacrificio(formacionInfo, metaPP, cantTurnos);
                    await finalizarCombateSacrificio(victoria, bajas);
                }
            });
        } else {
            agregarTexto("<h3 class='txt-hereje'>LA LÍNEA HA CEDIDO</h3>");
            agregarTexto("No quedan ballesteros nobles ni voluntarios para sacrificarse. Los mercenarios huyen y la horda avanza...");
            crearBoton("CONTINUAR", async () => await evaluarVictoriaDerrotaBosque());
        }
        return;
    }
    
    jugador.narrativaSacrificioVista = true;

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"Mis hombres cayeron defendiendo a los suyos, Barón Andrew. Ya no quedan lanzas para frenar a las bestias."`, claseTexto: "txt-lugarteniente"
    });
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡Aún quedan enemigos en la espesura! ¡Van a masacrarnos si no ganamos tiempo para recargar!"`, claseTexto: "txt-lugarteniente"
    });
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Defiendan la posición a como dé lugar! ¡Con sus hombres!"`, claseTexto: "txt-comandante"
    });
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡Mis caballeros aún no están listos, ocupan más tiempo!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"Esta campaña no puede fracasar... PER DOMINUM NOSTRUM IESU CHRISTUM..."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"AMÉN..."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Adelante, Barón... ¡Tiene mi orden!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡Ballesteros, desenvainar sus espadas! ¡Ocupo 3 ballesteros de inmediato que quieran dar sus vidas por esta noble compañía!"`, claseTexto: "txt-lugarteniente"
    });

    let nobles = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.clase === "noble" && t.hp > 0 && !t.espadachin);
    let mercs = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.clase !== "noble" && t.hp > 0 && !t.espadachin);

    if (mercs.length > 0) {
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/ballestero_mercenario.webp", nombrePersonaje: "Ballesteros Mercenarios", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der-align",
            texto: `"¡No daremos la vida por esta masacre! ¡Que la sangre noble ponga pecho si es que tienen el valor!"`, claseTexto: "txt-hereje"
        });
    }

    if (nobles.length > 0) {
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/ballestero_noble.webp", nombrePersonaje: "Ballesteros Nobles", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Señor, escoja a la nobleza de ballesteros para ir a dar más tiempo!"`, claseTexto: "txt-sagrado"
        });
        
        crearBoton("DESPLEGAR LA ÚLTIMA LÍNEA", async () => {
            let formacionInfo = await abrirFormacionSacrificio();
            
            if (formacionInfo.total === 0) {
                agregarTexto("<h3 class='txt-hereje'>COBARDÍA EN LAS FILAS</h3>");
                agregarTexto("Nadie dio un paso al frente. La horda masacró el campamento.");
                crearBoton("CONTINUAR", async () => await evaluarVictoriaDerrotaBosque());
            } else {
                await continuarNarrativaSacrificio(formacionInfo, mercs);
            }
        });
    } else {
        agregarTexto("<h3 class='txt-hereje'>LA LÍNEA HA CEDIDO</h3>");
        agregarTexto("No quedan ballesteros nobles para sacrificarse. Los mercenarios huyen y la horda avanza...");
        crearBoton("CONTINUAR", async () => await evaluarVictoriaDerrotaBosque());
    }
}

async function continuarNarrativaSacrificio(formacionInfo, mercs) {
    storyArea.innerHTML = ""; limpiarBotones();
    let tropasDesplegadas = [];
    for(let pos in formacionInfo.slots) {
        if(formacionInfo.slots[pos]) {
            let tr = jugador.tropas.find(t => t.idUnico === formacionInfo.slots[pos]);
            if(tr) tropasDesplegadas.push(tr);
        }
    }
    
    let nombres = tropasDesplegadas.map(t => t.nombre).join(", ");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡Entonces que así sea! ¡${nombres}! Que San Miguel Arcángel guíe vuestras espadas. Benditos seáis, pues no hay mayor amor que dar la vida por los hermanos."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/ballestero_noble.webp", nombrePersonaje: "Ballesteros Nobles", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡DEUS VULT!"`, claseTexto: "txt-sagrado"
    });

    let infoFe = obtenerEstadoFe();
    let esFeAptaParaMilagro = ["BENDICIÓN DIVINA", "FERVOR CELESTIAL", "ESTADO DE GRACIA"].includes(infoFe.nombre);
    
    if (!jugador.mercenarioRedimidoId && esFeAptaParaMilagro && mercs.length > 0 && formacionInfo.total > 0) {
        let mercVoluntario = mercs[Math.floor(Math.random() * mercs.length)];
        
        await MotorDialogos.mostrarDialogo({
            personajeImg: mercVoluntario.img, nombrePersonaje: mercVoluntario.nombre, alineacion: "der", bordeClase: "borde-neutral", nombreClase: "nombre-der-align",
            texto: `"¡Aguardad! Yo estoy dispuesto a luchar por mi Señor Jesucristo y dejar de lado mi ambición por el oro. ¡Creo en la causa de esta compañía, le imploro Barón que me mande a mí a pelear con esta sangre noble!"`, claseTexto: "mensaje-sistema"
        });

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"Sin duda una lección para todos nosotros... Comendador ${jugador.nombre}, ¿Me permite lanzar a la redención a este hombre?"`, claseTexto: "txt-lugarteniente"
        });

        crearBoton("Sí, concédele la gracia", async () => {
            limpiarBotones();
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                texto: `"Me aseguraré de que tu nombre, vivas o mueras, resonará en los ecos. ¡Ve, ${mercVoluntario.nombre}, y bríndanos valioso tiempo!"`, claseTexto: "txt-comandante"
            });
            
            jugador.mercenarioRedimidoId = mercVoluntario.idUnico;
            
            let possibleSlots = Object.keys(formacionInfo.slots).filter(k => formacionInfo.slots[k] !== null);
            let slotReplace = possibleSlots[Math.floor(Math.random() * possibleSlots.length)];
            formacionInfo.slots[slotReplace] = mercVoluntario.idUnico;
            
            await arrancarSacrificioConfirmado(formacionInfo);
        });

        crearBoton("No, mantén la disciplina", async () => {
            limpiarBotones();
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                texto: `"Me aseguraré de que tu lealtad resuene en los ecos. Pero la formación ya está hecha, tal vez te requeriré más adelante."`, claseTexto: "txt-comandante"
            });
            await arrancarSacrificioConfirmado(formacionInfo);
        });
    } else {
        crearBoton("INICIAR EL SACRIFICIO", async () => {
            await arrancarSacrificioConfirmado(formacionInfo);
        });
    }
}

async function arrancarSacrificioConfirmado(formacionInfo) {
    for(let pos in formacionInfo.slots) {
        if(formacionInfo.slots[pos]) {
            let tr = jugador.tropas.find(t => t.idUnico === formacionInfo.slots[pos]);
            if(tr) tr.espadachin = true;
        }
    }
    
    let noblesListos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && (t.clase === "noble" || t.idUnico === jugador.mercenarioRedimidoId) && t.hp > 0 && !t.espadachin);
    let metaRequerida = Math.min(3, noblesListos.length);
    let cantTurnos = Math.max(1, Math.ceil(metaRequerida / formacionInfo.total)); 
    let metaPP = cantTurnos * formacionInfo.total * 10;
    
    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "flex";
    document.getElementById("formacion-roster").style.display = "none";
    document.getElementById("formacion-tablero").style.display = "none";
    document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
    
    let skipCine = document.getElementById("ht-skip-cine")?.checked;
    if(!skipCine && typeof playCinematicaSacrificioBosque === "function") {
        await new Promise(res => playCinematicaSacrificioBosque(formacionInfo, res));
    }
    
    if(overlay) overlay.style.display = "none";
    
    let {victoria, bajas} = await iniciarCombateSacrificio(formacionInfo, metaPP, cantTurnos);
    await finalizarCombateSacrificio(victoria, bajas);
}

function iniciarCombateSacrificio(formacion, metaPP, turnosFase) {
    return new Promise(resolve => {
        EstadoBatalla.limpiar(); 
        EstadoBatalla.tipoCombate = "sacrificio";
        
        EstadoBatalla.metaProgresoMuro = metaPP;
        EstadoBatalla.turnosFaseBosque = turnosFase;
        if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = turnosFase; 

        EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && (t.clase === "noble" || t.idUnico === jugador.mercenarioRedimidoId) && t.hp > 0 && !t.espadachin && !Object.values(formacion.slots).includes(t.idUnico));
        EstadoBatalla.maxTurnos = turnosFase;
        
        EstadoBatalla.callback = (victoria, bajas) => resolve({victoria, bajas}); 

        EstadoBatalla.tropasVivas = [
            { idUnico: formacion.slots["sacrificio-1"], posNombre: "el frente norte", slotPos: "sacrificio-1" },
            { idUnico: formacion.slots["sacrificio-2"], posNombre: "el frente central", slotPos: "sacrificio-2" },
            { idUnico: formacion.slots["sacrificio-3"], posNombre: "el frente sur", slotPos: "sacrificio-3" }
        ];

        storyArea.innerHTML = "";
        prepararBotonTurno();
        animarDialogoAvanceSacrificio();
        
        setTimeout(() => { 
            if(typeof storyArea !== 'undefined') storyArea.scrollTop = 0; 
            window.scrollTo(0, 0); 
        }, 50);
    });
}

async function animarDialogoAvanceSacrificio() {
    let divDialogo = document.createElement("div");
    storyArea.appendChild(divDialogo);

    await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", 
        nombrePersonaje: "Barón Andrew", alineacion: "izq", 
        bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡QUE DIOS OS TENGA EN SU GLORIA! ¡Luchad hasta el último aliento!"`, 
        claseTexto: "txt-lugarteniente"
    });

    animarAvanceSacrificio();
}

function animarAvanceSacrificio() {
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
        
        document.getElementById("titulo-formacion").innerText = `🩸 EL ÚLTIMO ALIENTO: TURNO ${EstadoBatalla.turnoActual} 🩸`;

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
                    
                    let slotId = `pica-slot-${pos.slotPos.split("-")[1]}`;
                    let slotPica = document.getElementById(slotId);
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
        
        document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesSacrificio;
        document.getElementById("btn-tirar-dados").style.display = "inline-block";
    });
}

function resolverDadosVisualesSacrificio() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe();

    let ballesterosParticipantes = EstadoBatalla.accionesPendientes.length;
    let puntosGanados = ballesterosParticipantes * 10;
    EstadoBatalla.progresoMuro += puntosGanados;

    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.accionesPendientes.forEach(acc => {
        let { tropa, pos, enemigo } = acc;
        let slotPicaId = `pica-slot-${pos.slotPos.split("-")[1]}`;
        let slotPica = document.getElementById(slotPicaId);
        
        let poderAtk = GestorEstado.evaluarPoderTropa(tropa, 'atk');
        let dadoGracia = (jugador.liderazgo <= -50) ? 0 : tirarDado();
        let dadoFuria = (jugador.liderazgo >= 126) ? 0 : tirarDado();
        
        let pAtkAliado = poderAtk.neto + dadoGracia + infoFe.mod;
        let pAtkEnemigo = enemigo.atk + dadoFuria;

        let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
        let classMod = (infoFe.mod >= 0) ? "mensaje-sistema" : "txt-hereje";
        if (infoFe.mod === 0) classMod = "txt-sagrado";

        let idBc = 'bc_' + Math.random().toString(36).substr(2,9);
        let phase1Cons = "";

        // FIX TÁCTICO: Combate Melee limpio sin audios
        if (pAtkAliado > pAtkEnemigo) {
            EstadoBatalla.bajasEnemigas++;
            EstadoBatalla.hordaMuertosActuales++;
            phase1Cons = `<span class="mensaje-sistema">¡Tajo Mortal! El pagano cae decapitado.</span>`;
            window.marcadoresBatalla.push({tipo: 'skull', slotPos: pos.slotPos}); 
        } else if (pAtkEnemigo > pAtkAliado) {
            tropa.hp--;
            phase1Cons = `<span class="txt-hereje">¡Carnicería! La hoja enemiga despelleja a ${tropa.nombre}.</span>`;
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN LA LÍNEA! ${tropa.nombre} derramó su sangre.</div>`;
                window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
            }
        } else {
            EstadoBatalla.bajasEnemigas++;
            EstadoBatalla.hordaMuertosActuales++;
            tropa.hp--;
            phase1Cons = `<span class="txt-hereje">¡Muerte Simultánea! Ambos se clavan el acero en las tripas.</span>`;
            window.marcadoresBatalla.push({tipo: 'skull', slotPos: pos.slotPos}); 
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN LA LÍNEA! ${tropa.nombre} derramó su sangre.</div>`;
                window.marcadoresBatalla.push({tipo: 'cross', slotPos: pos.slotPos});
            }
        }

        let dataRender = {
            posNombre: pos.posNombre, enemigoNombre: enemigo.nombre, tropaNombre: tropa.nombre,
            atkBase: poderAtk.base, stringHerido: poderAtk.stringEfectos, dadoGracia, classMod, signoMod, infoFeNombre: infoFe.nombre, pAtkAliado,
            atkEnemigoBase: enemigo.atk, dadoFuria, pAtkEnemigo, phase1Cons, idBc, autoCombat
        };

        let logStr = RenderCombate.htmlChoqueSacrificio(dataRender);
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
        EstadoBatalla.logTurnoGlobal.push(`<p class="txt-sagrado separador">¡La horda pagana se reagrupa para destrozarlos!</p>`);
    }

    if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(false);

    let metaDin = EstadoBatalla.metaProgresoMuro || 12;
    let avancePorc = Math.min(100, Math.round((EstadoBatalla.progresoMuro / metaDin) * 100));
    
    let displayStyle = autoCombat ? "block" : "none";
    EstadoBatalla.logTurnoGlobal.push(`<div class="resumen-turno-box resumen-oculto" style="display:${displayStyle};"><b>Progreso de Sacrificio: ${avancePorc}%</b><br>Bajas enemigas en el duelo: ${EstadoBatalla.bajasEnemigas}</div>`);
    
    let pending = document.querySelectorAll('.pendiente-dados').length > 0;
    if(!pending && autoCombat) {
        EstadoBatalla.turnoActual++;
        if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
    } else {
        EstadoBatalla.turnoActual++;
        if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
    }
}

async function finalizarCombateSacrificio(victoria, bajasEnemigas) {
    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "none";

    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    jugador.enemigosAsesinados += bajasEnemigas;
    
    if (victoria) {
        agregarTexto(`<h3 class='mensaje-sistema' style='text-align:center;'>¡EL SACRIFICIO NO FUE EN VANO!</h3>`);
        agregarTexto(`La última línea contuvo el asalto el tiempo suficiente para recargar.`);
        
        jugador.tropas.forEach(t => {
            if (t.tipoGeneral === "ballesteros" && !t.espadachin && t.cooldown > 0) {
                t.cooldown -= EstadoBatalla.turnosFaseBosque;
                if (t.cooldown < 0) t.cooldown = 0;
            }
        });

        if (jugador.enemigosAsesinados >= jugador.enemigosObjetivo) {
            crearBoton("LA HORDA HUYE (Asegurar el Perímetro)", async () => await evaluarVictoriaDerrotaBosque());
        } else {
            crearBoton("REPLIEGUE (Abrir Campo de Tiro)", async () => {
                let overlay = document.getElementById("formacion-overlay");
                if(overlay) overlay.style.display = "flex";

                let skipCine = document.getElementById("ht-skip-cine")?.checked;
                
                let purgarEspadachines = () => {
                    jugador.tropas.forEach(t => { 
                        if (t.espadachin) { 
                            t.espadachin = false; 
                            t.cooldown = (t.clase === 'noble') ? 1 : 2; 
                        } 
                    });
                };

                if(!skipCine && typeof playCinematicaRepliegueBosque === 'function') {
                    await new Promise(res => playCinematicaRepliegueBosque(res));
                }
                
                if(overlay) overlay.style.display = "none";
                purgarEspadachines();
                await iniciarFaseBosque();
            });
        }
    } else {
        agregarTexto(`<h3 class='txt-hereje'>LA ÚLTIMA LÍNEA HA CEDIDO</h3>`);
        agregarTexto(`Los valientes mártires han sido despedazados. La horda avanza imparable...`);
        crearBoton("Continuar (Misión Fallida)", () => {
             crearBoton("Reiniciar Campaña", iniciarJuego);
        });
    }
}