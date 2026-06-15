/* === NODO_SACRIFICIO.JS - LA ÚLTIMA LÍNEA DE LOS BALLESTEROS === */

window.registrarMarcadorPersistente = window.registrarMarcadorPersistente || function(slotPos, tipo, nombre = null) {
    if (!window.marcadoresBosquePersistentes) window.marcadoresBosquePersistentes = [];
    let existe = window.marcadoresBosquePersistentes.find(m => m.slotPos === slotPos && m.tipo === tipo);
    if (!existe) {
        window.marcadoresBosquePersistentes.push({ slotPos, tipo, nombre });
    }
};

async function iniciarNarrativaSacrificio() {
    storyArea.innerHTML = ""; limpiarBotones();
    
    if (jugador.narrativaSacrificioVista) {
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Repitan la formación mis ballesteros! ¡Preparad las espadas, por la sangre de Cristo!"`, claseTexto: "txt-lugarteniente"
        });

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray",
            texto: `«Nadie tiene amor más grande que el que dar la vida por sus hermanos.» - Juan 15:13`, claseTexto: "txt-sagrado"
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
                            if(tr) {
                                tr.espadachin = true;
                                if (tr.clase === 'noble') {
                                    tr.img = "assets/img/personajes/aliados/ballestero_noblesp.webp";
                                } else {
                                    tr.img = "assets/img/personajes/aliados/ballestero_mercenarioesp.webp";
                                }
                            }
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
            if(tr) {
                tr.espadachin = true;
                if (tr.clase === 'noble') {
                    tr.img = "assets/img/personajes/aliados/ballestero_noblesp.webp";
                } else {
                    tr.img = "assets/img/personajes/aliados/ballestero_mercenarioesp.webp";
                }
            }
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
        
        window.marcadoresBosquePersistentes = window.marcadoresBosquePersistentes || []; 
        EstadoBatalla.caidosEnMuro = []; 
        EstadoBatalla.enemigosCaidosEnMuro = []; 

        console.group("🛡️ DEBUG NODO: INICIO DE COMBATE SACRIFICIO");

        let cssGridReservas = "";
        let allBallesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
        
        let reservasActivas = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !t.espadachin);

        // TÁCTICA MAESTRA: Sincronización con la Memoria del Cine
        allBallesterosVivos.forEach((b, index) => {
            let col, row;
            if (window.sacrificioCurrentLayout && window.sacrificioCurrentLayout[b.idUnico]) {
                col = window.sacrificioCurrentLayout[b.idUnico].col + 1; // +1 porque CSS Grid inicia en 1
                row = window.sacrificioCurrentLayout[b.idUnico].row + 1;
            } else {
                col = Math.floor(index / 3) + 1; 
                row = (index % 3) + 1; 
            }
            cssGridReservas += `.modo-combate #zona-reservas-picas div[id*="${b.idUnico}"] { grid-column: ${col} !important; grid-row: ${row} !important; margin: 0 !important; position: relative !important; }\n`;
        });
        
        let styleId = "sacrificio-reserva-style";
        let oldStyle = document.getElementById(styleId);
        if(oldStyle) oldStyle.remove(); 
        
        let picasStyle = document.getElementById("picas-reserva-style");
        if(picasStyle) picasStyle.remove(); 
        
        let style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            #formacion-picas-tablero { position: relative; overflow: hidden; }
            .zona-batalla-anim { 
                position: absolute; top: 50%; left: 0; width: 100%; height: 400px; 
                transform: translateY(-50%); z-index: 150; 
                display: flex; align-items: center; justify-content: center; 
                gap: 15px; padding-left: 0; box-sizing: border-box; 
            }
            
            .modo-combate #zona-reservas-picas,
            .modo-combate #zona-aliada-picas,
            .modo-combate #zona-enemiga-picas {
                position: relative !important;
                transform: none !important;
            }
            
            .modo-combate #zona-aliada-picas > div { 
                display: grid !important; grid-template-columns: 75px !important; grid-template-rows: repeat(3, 75px) !important; gap: 5px !important; margin-bottom: 0 !important; 
            }
            .modo-combate #zona-aliada-picas .slot-formacion { transform: none !important; }
            .modo-combate #zona-aliada-picas { z-index: 2; margin-right: 15px !important; margin-left: 5px !important; }

            .modo-combate #zona-reservas-picas { 
                display: grid !important; 
                grid-template-rows: repeat(3, 75px) !important; 
                grid-template-columns: repeat(5, 75px) !important; 
                direction: rtl !important; 
                gap: 5px 10px !important; 
                border-right: none !important; 
                padding-right: 0 !important; 
                align-content: center !important; 
                margin-right: 0 !important;
                width: max-content !important; 
            }
            .modo-combate #zona-reservas-picas > div { 
                direction: ltr !important; 
                width: 75px !important; 
                height: 75px !important; 
                box-sizing: border-box !important;
            }

            .placeholder-vacio-bosque { 
                border: none !important; 
                background: transparent !important; 
                box-shadow: none !important;
            }

            /* MODO ESPEJO ABSOLUTO PARA MERCENARIOS */
            img[src*="ballestero_mercenarioesp.webp"],
            img[src*="ballestero_mercenario.webp"] { 
                transform: scaleX(-1) !important; 
            }

            .modo-combate #zona-enemiga-picas { z-index: 3; margin-left: 0 !important;}
            .modo-combate #zona-enemiga-picas > div { display: grid !important; grid-template-columns: repeat(3, 75px) !important; grid-template-rows: repeat(3, 75px) !important; gap: 5px 8px !important; }
            
            /* ========================================================= */
            /* FIX TÁCTICO: ANULACIÓN DE TODOS LOS SALTOS HOVER          */
            /* ========================================================= */
            .modo-combate #zona-aliada-picas .slot-formacion,
            .modo-combate #zona-aliada-picas .slot-formacion:hover { 
                transform: none !important; 
                cursor: default !important; 
                top: 0 !important;
                background: #1a1a1a !important; 
            }
            
            /* Anula el salto interno (translateY/top) de las cartas de vanguardia aliadas */
            .modo-combate #zona-aliada-picas .slot-formacion > div:not(.enemigo-atacando-pica),
            .modo-combate #zona-aliada-picas .slot-formacion > div:not(.enemigo-atacando-pica):hover {
                transform: none !important; 
                top: 0 !important;
                margin-top: 0 !important;
                bottom: 0 !important;
            }
            
            /* Anula saltos en enemigos */
            .modo-combate #zona-enemiga-picas .tropa-enemiga-pica,
            .modo-combate #zona-enemiga-picas .tropa-enemiga-pica:hover {
                transform: none !important; 
                cursor: default !important;
                top: 0 !important;
                background: #1a1a1a !important; 
            }
            
            /* Anula saltos en la retaguardia de ballesteros y asegura el fondo oscuro a los vivos */
            .modo-combate #zona-reservas-picas .caballero-reserva,
            .modo-combate #zona-reservas-picas .caballero-reserva:hover { 
                opacity: 1 !important; 
                filter: none !important; 
                transform: none !important; 
                cursor: default !important; 
                top: 0 !important;
                background: #1a1a1a !important; 
            }
            /* ========================================================= */

            .modo-combate #zona-aliada-picas .enemigo-atacando-pica { width: 75px !important; height: 75px !important; box-sizing: border-box !important; pointer-events: none !important; }
            
            .modo-combate #zona-reservas-picas .tropa-noble { border-color: #ffaa00 !important; box-shadow: 0 0 10px rgba(255, 170, 0, 0.4) !important; }
            .modo-combate #zona-reservas-picas .tropa-mercenaria { border-color: #888 !important; }

            ${cssGridReservas}
        `;
        document.head.appendChild(style);

        EstadoBatalla.metaProgresoMuro = metaPP;
        EstadoBatalla.turnosFaseBosque = turnosFase;
        if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = turnosFase; 

        EstadoBatalla.reservas = reservasActivas;
        EstadoBatalla.maxTurnos = turnosFase;
        
        EstadoBatalla.callback = (victoria, bajas) => resolve({victoria, bajas}); 

        EstadoBatalla.tropasVivas = [
            { idUnico: formacion.slots["sacrificio-1"], posNombre: "el frente norte", slotPos: "sacrificio-1" },
            { idUnico: formacion.slots["sacrificio-2"], posNombre: "el frente central", slotPos: "sacrificio-2" },
            { idUnico: formacion.slots["sacrificio-3"], posNombre: "el frente sur", slotPos: "sacrificio-3" }
        ];

        console.groupEnd();

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
            let nieblaCombat = document.createElement("div");
            nieblaCombat.id = "niebla-combate-picas";
            nieblaCombat.className = "efecto-neblina";
            nieblaCombat.style.zIndex = "900"; 
            nieblaCombat.style.pointerEvents = "none";
            tablero.appendChild(nieblaCombat);
        }

        let labelTurnos = document.getElementById("label-turnos-picas");
        if(labelTurnos) labelTurnos.style.display = "none";

        document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
        document.getElementById("btn-iniciar-formacion").style.display = "none"; 
        document.getElementById("btn-ver-reporte").style.display = "none";
        
        document.getElementById("titulo-formacion").innerText = `🩸 EL ÚLTIMO ALIENTO: TURNO ${EstadoBatalla.turnoActual} 🩸`;

        restaurarVisualesCombate();

        let zonaRes = document.getElementById("zona-reservas-picas");
        if (zonaRes) {
            zonaRes.innerHTML = ""; 

            let allBallesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);

            allBallesterosVivos.forEach(b => {
                let div = document.createElement("div");
                div.id = `drag-${b.idUnico}`;
                
                let esEspadachin = EstadoBatalla.tropasVivas.some(tv => tv.idUnico === b.idUnico);

                if (esEspadachin) {
                    div.className = "slot-reserva-picas placeholder-vacio-bosque";
                    div.innerHTML = "";
                } else {
                    let claseBorde = b.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                    div.className = `slot-reserva-picas caballero-reserva ${claseBorde}`;
                    let imgSrc = b.clase === 'noble' ? 'ballestero_noble.webp' : 'ballestero_mercenario.webp';
                    
                    let corazones = "";
                    let hpMax = b.hpMax || 2;
                    for (let i = 0; i < hpMax; i++) { corazones += (i < b.hp) ? "❤️" : "🖤"; }
                    
                    div.innerHTML = `
                        <img src="assets/img/personajes/aliados/${imgSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:2px;">
                        <div class="unidad-hp-combate" style="position:absolute; top:2px; right:2px; font-size:10px; text-shadow:1px 1px 0 #000; z-index:5;">${corazones}</div>
                        <div class="unidad-nombre-aleatorio" style="position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.7); font-size:9px; text-align:center; padding:2px 0; color:white; z-index:5;">${b.nombre}<br>(N)</div>
                    `;
                }
                zonaRes.appendChild(div);
            });
        }
        
        if (window.marcadoresBosquePersistentes && window.marcadoresBosquePersistentes.length > 0) {
            window.marcadoresBosquePersistentes.forEach(m => {
                let slotPica = document.getElementById(`pica-slot-${m.slotPos.split("-")[1]}`);
                if(slotPica && typeof window.dibujarMarcadorMuerte === 'function') {
                    window.dibujarMarcadorMuerte(slotPica, m.tipo);
                }
            });
        }

        EstadoBatalla.logTurnoGlobal = [];
        EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual));
        
        EstadoBatalla.accionesPendientes = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
                    let slotId = `pica-slot-${pos.slotPos.split("-")[1]}`;
                    let slotPica = document.getElementById(slotId);
                    
                    if(slotPica) {
                        let imgAliado = slotPica.querySelector("img:not(.icono-ballesta-vacia)");
                        if (imgAliado) {
                            imgAliado.src = tropa.img; 
                            if (tropa.clase !== 'noble') {
                                imgAliado.style.transform = "scaleX(-1)";
                            } else {
                                imgAliado.style.transform = "none";
                            }
                        }

                        let divEnemigo = document.createElement("div");
                        divEnemigo.className = "enemigo-atacando-pica";
                        divEnemigo.style.cssText = "position:absolute; top:-2px; right:-65px; width:75px; height:75px; border:2px solid #ff4c4c; background:#1a1a1a; z-index:150; transform:translateX(50px); transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius:4px; box-shadow: -5px 0 15px rgba(255,0,0,0.85); display:flex; justify-content:center; align-items:center; box-sizing: border-box; pointer-events:none;";
                        divEnemigo.innerHTML = `<img src="assets/img/personajes/enemigos/enemigo.webp" style="width:100%;height:100%;object-fit:cover; transform:scaleX(-1); border-radius:2px;">`;
                        slotPica.appendChild(divEnemigo);
                        setTimeout(() => divEnemigo.style.transform = "translateX(0)", 100);
                    }

                    let enemigo = GeneradorHordas.obtenerEnemigoPicas(); 
                    EstadoBatalla.accionesPendientes.push({ tropa, pos, enemigo });
                }
            }
        });
        
        if(typeof actualizarGrillaEnemigosPicas === 'function') actualizarGrillaEnemigosPicas(true);

        let enemigosEnGrilla = document.querySelectorAll("#zona-enemiga-picas .tropa-enemiga-pica");
        let aOcultar = Math.min(EstadoBatalla.accionesPendientes.length, enemigosEnGrilla.length);
        for(let i = 0; i < aOcultar; i++) {
            if(enemigosEnGrilla[i]) enemigosEnGrilla[i].style.visibility = "hidden";
        }

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

        if (pAtkAliado > pAtkEnemigo) {
            EstadoBatalla.bajasEnemigas++;
            EstadoBatalla.hordaMuertosActuales++;
            phase1Cons = `<span class="mensaje-sistema">¡Tajo Mortal! El pagano cae decapitado.</span>`;
            
            window.registrarMarcadorPersistente(pos.slotPos, 'skull'); 
            if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'skull');
            if(!EstadoBatalla.enemigosCaidosEnMuro) EstadoBatalla.enemigosCaidosEnMuro = [];
            EstadoBatalla.enemigosCaidosEnMuro.push(pos.slotPos);
            
        } else if (pAtkEnemigo > pAtkAliado) {
            GestorEstado.recibirDano(tropa.idUnico, 1);
            
            phase1Cons = `<span class="txt-hereje">¡Carnicería! La hoja enemiga despelleja a ${tropa.nombre}.</span>`;
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN LA LÍNEA! ${tropa.nombre} derramó su sangre.</div>`;
                window.registrarMarcadorPersistente(pos.slotPos, 'cross', tropa.nombre);
                if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'cross');
                
                if(!EstadoBatalla.caidosEnMuro) EstadoBatalla.caidosEnMuro = [];
                if(!EstadoBatalla.caidosEnMuro.find(m => m.idUnico === tropa.idUnico)) {
                    EstadoBatalla.caidosEnMuro.push({ idUnico: tropa.idUnico, img: tropa.img, nombre: tropa.nombre, clase: tropa.clase, slotPos: pos.slotPos });
                }
            }
        } else {
            EstadoBatalla.bajasEnemigas++;
            EstadoBatalla.hordaMuertosActuales++;
            GestorEstado.recibirDano(tropa.idUnico, 1);
            
            phase1Cons = `<span class="txt-hereje">¡Muerte Simultánea! Ambos se clavan el acero en las tripas.</span>`;
            
            window.registrarMarcadorPersistente(pos.slotPos, 'skull'); 
            if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'skull');
            if(!EstadoBatalla.enemigosCaidosEnMuro) EstadoBatalla.enemigosCaidosEnMuro = [];
            EstadoBatalla.enemigosCaidosEnMuro.push(pos.slotPos);
            
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN LA LÍNEA! ${tropa.nombre} derramó su sangre.</div>`;
                window.registrarMarcadorPersistente(pos.slotPos, 'cross', tropa.nombre);
                if(typeof window.dibujarMarcadorMuerte === 'function') window.dibujarMarcadorMuerte(slotPica, 'cross');
                
                if(!EstadoBatalla.caidosEnMuro) EstadoBatalla.caidosEnMuro = [];
                if(!EstadoBatalla.caidosEnMuro.find(m => m.idUnico === tropa.idUnico)) {
                    EstadoBatalla.caidosEnMuro.push({ idUnico: tropa.idUnico, img: tropa.img, nombre: tropa.nombre, clase: tropa.clase, slotPos: pos.slotPos });
                }
            }
        }

        let dataRender = {
            tropaId: tropa.idUnico,
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
    if (vivosHorda <= 2) {
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
            crearBoton("LA HORDA HUYE (Asegurar el Perímetro)", async () => {
                jugador.tropas.forEach(t => { 
                    if (t.espadachin) { 
                        t.espadachin = false; 
                        if (t.clase === 'noble') {
                            t.img = "assets/img/personajes/aliados/ballestero_noble.webp";
                        } else {
                            t.img = "assets/img/personajes/aliados/ballestero_mercenario.webp";
                        }
                    } 
                });
                await evaluarVictoriaDerrotaBosque();
            });
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
                            if (t.clase === 'noble') {
                                t.img = "assets/img/personajes/aliados/ballestero_noble.webp";
                            } else {
                                t.img = "assets/img/personajes/aliados/ballestero_mercenario.webp";
                            }
                        } 
                    });
                };

                if(!skipCine && typeof playCinematicaRepliegueSacrificio === 'function') {
                    await new Promise(res => playCinematicaRepliegueSacrificio(res));
                }
                
                if (typeof EstadoBatalla !== 'undefined') EstadoBatalla.caidosEnMuro = [];

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