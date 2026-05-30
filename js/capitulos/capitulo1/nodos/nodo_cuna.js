/* === NODO_CUNA.JS - LÓGICA EXCLUSIVA DE CABALLERÍA PESADA === */

function iniciarCombateCuna(formacion) {
    return new Promise(resolve => {
        EstadoBatalla.limpiar(); 
        EstadoBatalla.tipoCombate = "cuna";
        window.marcadoresBatalla = []; 

        EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
        EstadoBatalla.maxTurnos = CONSTANTES_TACTICAS.CUNA_MAX_TURNOS;
        
        // FIX TÁCTICO: Ahora el motor de combate viejo resuelve esta promesa al terminar
        EstadoBatalla.callback = (victoria, bajas) => resolve({victoria, bajas});
        
        EstadoBatalla.tropasVivas = [
            { row: 0, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, posNombre: "el ala izquierda", slotPos: "trasera-arriba", idUnico: formacion.slots["trasera-arriba"] },
            { row: 1, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, posNombre: "el flanco izquierdo", slotPos: "media-arriba", idUnico: formacion.slots["media-arriba"] },
            { row: 2, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_PUNTA, posNombre: "la vanguardia", slotPos: "punta", idUnico: formacion.slots["punta"] },
            { row: 3, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, posNombre: "el flanco derecho", slotPos: "media-abajo", idUnico: formacion.slots["media-abajo"] },
            { row: 4, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, posNombre: "el ala derecha", slotPos: "trasera-abajo", idUnico: formacion.slots["trasera-abajo"] }
        ];

        EstadoBatalla.enemigos = GeneradorHordas.generarMatrizCuna();

        storyArea.innerHTML = "";
        
        prepararBotonTurno(); 
        animarDialogoAvanceCuna();
    });
}

async function animarDialogoAvanceCuna() {
    let divDialogo = document.createElement("div");
    storyArea.appendChild(divDialogo);

    await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", 
        nombrePersonaje: "Sir Alexandro", alineacion: "izq", 
        bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡El clamor de las trompetas nos llama a la gloria! ¡Turno ${EstadoBatalla.turnoActual}! ¡A LA CARGA!"`, 
        claseTexto: "txt-lugarteniente"
    });

    animarAvanceCuna();
}

function animarAvanceCuna() {
    document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
    
    requestAnimationFrame(() => {
        document.getElementById("formacion-overlay").style.display = "flex"; 
        
        let tablero = document.getElementById("formacion-tablero");
        tablero.style.display = "flex"; 
        tablero.classList.add("modo-combate");

        document.getElementById("btn-iniciar-formacion").style.display = "none";
        document.getElementById("btn-ver-reporte").style.display = "none";
        document.getElementById("titulo-formacion").innerText = `⚔️ COMBATE: TURNO ${EstadoBatalla.turnoActual} ⚔️`;

        restaurarVisualesCombate();

        EstadoBatalla.logTurnoGlobal = [];
        EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual));
        
        EstadoBatalla.accionesPendientes = [];
        let domUpdates = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
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
                    
                    EstadoBatalla.accionesPendientes.push(accion);
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
                    } else {
                        knightEl.classList.add("caballero-ocupando");
                    }
                }
            }
        });
        
        document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesCuna;
        document.getElementById("btn-tirar-dados").style.display = "inline-block";
    });
}

function resolverDadosVisualesCuna() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe();
    let huboCombates = false;
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

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
                pos.col = nextCol;
                window.marcadoresBatalla.push({tipo: 'skull', row: pos.row, col: pos.col});
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
                    pos.col = nextCol;
                    window.marcadoresBatalla.push({tipo: 'skull', row: pos.row, col: pos.col});
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

        } else if (tipo === "avance") {
            pos.col = nextCol;
            EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlAvanceLibre(tropa.nombre));
        }
    });

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
        await evaluarFinCombateCuna(victoria, bajas);
    });
}

async function evaluarFinCombateCuna(lineaRota, bajas) {
    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "none";

    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    
    let soldadosCaidos = window.marcadoresBatalla ? window.marcadoresBatalla.filter(m => m.tipo === 'cross').length : 0;
    jugador.enemigosAsesinados = (jugador.enemigosAsesinados || 0) + bajas;
    
    let todaNobleza = true;
    if (typeof slotsFormacion !== 'undefined') {
        for(let p in slotsFormacion){ 
            if(slotsFormacion[p]) {
                let t = jugador.tropas.find(t=>t.idUnico===slotsFormacion[p]);
                if (!t || t.clase !== "noble") todaNobleza = false;
            }
        }
    } else { todaNobleza = false; }

    if(lineaRota && bajas >= 15) {
        let bonoBase = 0; let razon = "";
        if (todaNobleza) {
            bonoBase = soldadosCaidos === 0 ? (Math.floor(Math.random() * (13 - 11 + 1)) + 11) : ((Math.floor(Math.random() * (11 - 9 + 1)) + 9) - (soldadosCaidos * 5));
            razon = soldadosCaidos === 0 ? "una carga de Sangre Azul impecable" : "una carga noble con mártires";
        } else {
            bonoBase = soldadosCaidos === 0 ? (Math.floor(Math.random() * (11 - 7 + 1)) + 7) : ((Math.floor(Math.random() * (10 - 7 + 1)) + 7) - (soldadosCaidos * 2));
            razon = soldadosCaidos === 0 ? "una carga efectiva e imbatida" : "una victoria sangrienta";
        }
        
        GestorEstado.modificarFe(bonoBase, razon);
        await ruta_IA_Victoria_Cuna();
    } else {
        agregarTexto(`Ruta I.B: El Estancamiento`, "txt-sagrado");
        agregarTexto(`Tus caballeros lograron abatir a ${bajas} enemigos, pero el empuje se detuvo.`);
        crearBoton("Continuar (Misión Fallida)", () => {
             agregarTexto("La horda enemiga se reorganiza y os rodea.", "txt-hereje");
             crearBoton("Reiniciar Campaña", iniciarJuego);
        });
    }
}

async function ruta_IA_Victoria_Cuna() {
    if (typeof window.Clima !== "undefined") window.Clima.iniciarVientoRayo();

    agregarTexto(`Ruta I.A: La Línea Quebrada`, "mensaje-sistema");
    let caidosAlAbismo = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
    jugador.enemigosAsesinados += caidosAlAbismo;
    
    agregarTexto(`Presos del pánico absoluto ante la furia celestial de tus caballeros, <span class="txt-hereje">${caidosAlAbismo} infieles</span> retroceden torpemente cayendo al abismo.`);
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Sir Alexandro! ¡Vuestros caballeros han barrido la escoria del puente! ¡Una dedicación que será cantada por los serafines en los cielos!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡TUA GRATIA ADJUTUS! ¡Que la sangre impura lave los pecados de esta tierra profanada!"`, claseTexto: "txt-lugarteniente"
    });
    
    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    let nombreScout = scout ? scout.nombre : "El monje explorador";

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Señoría... la masacre es gloriosa, mas la guerra no termina. Si sus caballeros permanecen del otro lado del puente engolosinados con la victoria, las hordas que acechan en los riscos los rodearán. Será su fin."`, claseTexto: "txt-clerigo"
    });

    agregarTexto(`<b>${jugador.nombre}:</b> (Medita en silencio observando la niebla...)`, "txt-accion");
    crearBoton("I.A: Cubrir la Retirada (Muro de Picas)", async () => await ruta_IA_Opcion1_Picas());
}

async function ruta_IA_Opcion1_Picas() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Conde JuanA... ¡Enviad a vuestros hombres al frente! Asegurad el puente para el resguardo y la retirada de la caballería."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Sir Alexandro, ordene a sus corceles volver de inmediato por los laterales del puente. Los piqueros los cubrirán en su regreso por el centro."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Mis lanzas están sedientas, mi Señor... ¡HOMBRES... MURO DE PICAS! Seremos la roca contra la que se estrelle su herejía."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Caballeros! ¡Riendas atrás! ¡Regresad al puente de INMEDIATO!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Barón Andrew, ocupamos las saetas de sus hombres al frente. Nuestros caballeros nos cubrirán desde la retaguardia ante cualquier flanqueo impío una vez crucen."`, claseTexto: "txt-comandante"
    });
    
    agregarTexto(`[El Barón Andrew desenfunda un cuerno de hueso tallado y lo hace sonar. Un eco profundo y gutural se esparce por el campamento]`, "txt-accion");

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡El momento que mis cazadores esperaban! ¡Que el Señor guíe nuestra puntería!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/multiball.webp", nombrePersonaje: "Compañía de Ballesteros", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Heeey! ¡Tened listos los virotes, nos necesitan en la vanguardia! ¡Por Nuestro Señor y por nuestra Santa Madre de Dios!"`, claseTexto: "txt-multitud"
    });

    crearBoton("DESPLEGAR MURO DE PICAS", async () => {
        if(typeof EstadoBatalla !== 'undefined') {
            let totalPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;
            let ppTurno = (totalPiq >= 4) ? 12 : (totalPiq === 3 ? 8 : (totalPiq === 2 ? 6 : (totalPiq === 1 ? 3 : 12)));
            EstadoBatalla.metaProgresoMuro = ppTurno * 4; 
            EstadoBatalla.progresoMuro = 0; 
        }
        
        let resultado = await abrirFormacionPicas();
        await preparativosMuroPicas(resultado);
    });
}

async function preparativosMuroPicas(resultado) {
    limpiarBotones(); storyArea.innerHTML = ""; 

    if (resultado.total === 0) {
        agregarTexto(`[LA LÍNEA ROTA]`, "txt-hereje");
        agregarTexto(`¡Traición a la lógica militar, Comendador ${jugador.nombre}! Habéis ordenado formar un muro, mas no enviasteis ni una sola lanza al puente. Los caballeros en retirada, confiados en la cobertura, se topan con un puente vacío.`);
        crearBoton("Soportar el Juicio Divino...", capitulo1_DerrotaFinal);
        return; 
    }

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Escuchadme, hijos de la Trinidad! Este puente es nuestro Gólgota. Si mantenemos los frentes cerrados con lo que nos queda, la Providencia nos exigirá apenas <b>cuatro horas de guardia</b> para asegurar la retirada de Sir Alexandro."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Pero sabed esto! Si la línea flaquea, si permitís que un hermano caiga y no ocupáis su lugar, el puente se estirará como el purgatorio. ¡MANTENED LOS ESCUDOS UNIDOS SI QUERÉIS VOLVER A CASA!"`, claseTexto: "txt-lugarteniente"
    });
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Firmes, Hijos de Dios! ¡Que sus cuerpos se rompan contra nuestro acero!"`, claseTexto: "txt-comandante"
    });
    
    if (resultado.vacios === 0) {
        agregarTexto("¡Un muro impecable! Los piqueros han formado una barrera densa de madera y hierro.");
        GestorEstado.modificarFe(10, "una disciplina de falange perfecta");
    } else {
        agregarTexto(`La prisa de la maniobra dejó ${resultado.vacios} huecos en vuestro muro.`);
        GestorEstado.modificarFe(-(resultado.vacios * 5), "una táctica defensiva porosa y apresurada");
    }

    crearBoton("⚔️ ¡QUE DIOS RECONOZCA A LOS SUYOS! (Sostener el Muro)", async () => {
        let overlay = document.getElementById("formacion-overlay");
        if(overlay) overlay.style.display = "flex";
        document.getElementById("formacion-roster").style.display = "none";
        document.getElementById("formacion-tablero").style.display = "none";
        document.getElementById("btn-iniciar-formacion-picas").style.display = "none";

        let skipCine = document.getElementById("ht-skip-cine")?.checked;
        if(!skipCine && typeof playCinematicaRelevoPicas === 'function') {
            await new Promise(res => playCinematicaRelevoPicas(res));
        }
        if(overlay) overlay.style.display = "none";

        let {victoria, bajas} = await new Promise(resolve => {
            if (typeof iniciarCombatePicas === 'function') {
                iniciarCombatePicas(resultado, (v, b) => resolve({victoria: v, bajas: b}));
            } else { resolve({victoria: true, bajas: 0}); }
        });
        await evaluarFinCombatePicas(victoria, bajas);
    });
}

async function evaluarFinCombatePicas(victoria, bajas) {
    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "none";

    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    jugador.enemigosAsesinados = (jugador.enemigosAsesinados || 0) + bajas;

    if (typeof GestorEstado !== 'undefined' && typeof GestorEstado.avanzarEfectosTemporales === 'function') {
        GestorEstado.avanzarEfectosTemporales();
    }
    
    if(victoria) {
        agregarTexto(`<h3 class='mensaje-sistema' style='text-align:center;'>¡ALABADO SEA EL SEÑOR! ¡LA LÍNEA RESISTIÓ!</h3>`);
        agregarTexto(`Los piqueros aguantaron estoicos el embate, protegiendo la retirada y masacrando a la horda.`);

        GestorEstado.modificarFe(20, "una heroica defensa de picas en el puente");

        crearBoton("AVANZAR", async () => {
            await nodo_IA_Victoria();
        });
    } else {
        agregarTexto(`<h3 class='txt-hereje' style='text-align:center;'>EL MURO HA CAÍDO</h3>`);
        agregarTexto(`La horda sobrepasó vuestras lanzas y la sangre sagrada tiñe el puente.`);
        crearBoton("Continuar (Misión Fallida)", () => {
             crearBoton("Reiniciar Campaña", iniciarJuego);
        });
    }
}

async function nodo_IA_Victoria() {
    storyArea.innerHTML = ""; 
    limpiarBotones();
    
    if (typeof window.Clima !== "undefined" && typeof window.Clima.iniciarLluvia === "function") {
        window.Clima.iniciarLluvia();
    }
    let audioLluvia = document.getElementById("bgm-rain");
    if (audioLluvia) { cambiarMusica("bgm-rain"); } else { cambiarMusica("bgm-juego"); }

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Barón Andrew! ¡Llegáis justo a tiempo, por la Gracia de la Trinidad!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Bueno... debía asegurar que la puntería de mi compañía estuviera moralizada por la oración. Un perno bendecido no yerra el tiro."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Déjate de sermones, Barón! ¡Tenemos demasiada sangre impía en nuestras picas, apenas podemos sostener el muro!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡SUELTA LAS SAETAS DE UNA MALDITA VEZ! ¡Están masacrando a nuestros piqueros en el centro del viaducto mientras tú ajustas las cuerdas!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"........."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Basta de riñas entre hermanos. Deja que el Conde JuanA saque a sus hombres del fango... ¡Barón, PURGAD EL PUENTE!"`, claseTexto: "txt-comandante"
    });
    
    limpiarBotones(); 
    crearBoton("🏹 ¡SUELTEN PERNOS!", async () => {
        limpiarBotones();
        let overlay = document.getElementById("formacion-overlay");
        if(overlay) overlay.style.display = "flex";
        
        let skipCine = document.getElementById("ht-skip-cine")?.checked;
        if(!skipCine && typeof playCinematicaRepliegue === 'function') {
            await new Promise(res => playCinematicaRepliegue(res));
        }
        if(overlay) overlay.style.display = "none";
        
        if(typeof iniciarFaseBosque === "function") await iniciarFaseBosque(); 
        else interludiumCapitulo1();
    });
}