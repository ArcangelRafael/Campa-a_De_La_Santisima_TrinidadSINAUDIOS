/* === CAPITULO1.JS - EL ASEDIO DEL PUENTE (MOTOR VN) === */

function escena1() {
    limpiarBotones(); cambiarMusica('bgm-juego'); storyArea.innerHTML = ""; 
    
    // FIX TÁCTICO: Arranca el Viento Seco al salir de la zona de mercenarios.
    if (typeof window.Clima !== "undefined") window.Clima.iniciarViento();

    agregarTexto("<h2 style='text-align:center; color:#ffaa00;'>LA MARCHA COMIENZA</h2>");
    agregarTexto("Se escucha el crepitar de una antorcha y el viento silbando entre las grietas de la piedra. Vuestra hueste, ahora reforzada por los mercenarios, inicia la marcha adentrándose en tierras sombrías. Los estandartes trinitarios ondean con fiereza.");
    agregarTexto("[El ejército avanza por caminos inciertos...]", "txt-accion");
    setTimeout(() => { storyArea.scrollTop = 0; }, 50);
    setTimeout(() => { dispararTribulacionAleatoria(async () => { await mostrarOpcionesCapitulo1(); }); }, 1500);
}

async function mostrarOpcionesCapitulo1() {
    let n = jugador.nombre; 
    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    let nombreScout = scout ? scout.nombre : "El monje explorador";
    
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto(`Tras el altercado en el camino, lográis recomponer la marcha. Fray Bartolomé alza su cruz de madera bendiciendo el campamento mientras el monje explorador, con el rostro curtido por el sol y la túnica blanca manchada de polvo, se arrodilla ante ti.`);
    agregarTexto(`Capitulo I; Conozcamos el valor de ${n}`, "txt-sagrado");
    agregarTexto("<b>El Informe del Vigía: Sombra sobre el Paso de los Mártires</b>");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Ave María Purísima, Señor Comendador ${n}. Que la Gracia de la Santísima Trinidad sostenga vuestro brazo en esta hora de tribulación."`,
        claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Os traigo noticias urgentes y amargas. Hemos dejado atrás las tierras seguras; nos encontramos ahora en el Desfiladero de las Sombras Eternas, la única vía hacia la Ciudad de la Luz Blanca. Bajo vuestra custodia viajan los Vasos Sagrados y las Reliquias de los Primeros Padres..."`,
        claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Sin embargo, el enemigo acecha. Una horda de renegados, soldados apóstatas que han cambiado su honor por el vil metal, nos aguarda. Son sesenta almas condenadas, armadas con hierro viejo y corazones podridos. Buscan profanar lo sagrado y vender la libertad de nuestros hermanos frailes al mejor postor."`,
        claseTexto: "txt-clerigo"
    });
    
    let numCab = jugador.tropas.filter(t => t.tipoGeneral === "caballeros").length;
    let numBall = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros").length;
    let numPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros").length;

    agregarTexto(`<b>Vuestras fuerzas actuales:</b>`, "txt-clerigo");
    agregarTexto(`<ul><li><b>${numCab} Caballeros:</b> La punta de lanza de la hueste, listos para clavar sus lanzas.</li><li><b>${numBall} Ballesteros:</b> Saeteros que purgarán a distancia.</li><li><b>${numPiq} Piqueros:</b> El muro inquebrantable de lanzas.</li></ul>`, "txt-clerigo");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"A vuestra izquierda, la pared de roca se alza como una muralla de catedral; a vuestra derecha, un barranco profundo donde el eco no devuelve respuesta. Cien varas adelante, el Puente de Piedra de San Juan cruza el abismo. <b>El paso es angosto, Comendador, por el puente apenas caben cinco hombres a lo ancho.</b>"`,
        claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Señor Comendador, el tiempo de la oración contemplativa ha terminado; es hora de la oración de las espadas. ¿Cómo habéis de desplegar el acero de la Trinidad?"`,
        claseTexto: "txt-clerigo"
    });
    
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>El Tablero de la Fe (Vuestras Opciones):</b>");
    agregarTexto("<b>I. La Carga de la Justicia Divina:</b> <i>'Comendador, ordenad a vuestros caballeros formar una cuña de acero...'</i>");
    agregarTexto("<b>II. El Muro de los Penitentes:</b> <i>'Haced que los ballesteros trepen por la pared de roca como sombras...'</i>");
    agregarTexto("<b>III. El Sacrificio del Camino:</b> <i>'Crucemos el puente de inmediato, Señor. Usemos las carretas para sellar el paso...'</i>");
    
    limpiarBotones();
    crearBoton("I. La Carga de la Justicia Divina", async () => {
        let caballerosDisponibles = jugador.tropas.filter(t => t.tipoGeneral === "caballeros").length;
        if (caballerosDisponibles === 0) {
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"¡Mi Señor! ¿Ordenáis una carga de caballería? ¡Pero si no contamos con un solo corcel en nuestras filas! La locura se ha apoderado de vos. Reconsiderad la táctica o pereceremos todos en este puente."`,
                claseTexto: "txt-hereje"
            });
            return;
        }
        await capitulo1_opcionI_Inicio();
    });
    crearBoton("II. El Muro de los Penitentes", async () => await capitulo1_opcionII_Inicio());
    crearBoton("III. El Sacrificio del Camino", async () => await capitulo1_opcionIII_Inicio());
}

async function capitulo1_opcionI_Inicio() {
    limpiarBotones(); storyArea.innerHTML = ""; 
    agregarTexto(`Has escogido: <b>I. La Carga de la Justicia Divina</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Sir Alexandro, forme a sus hombres en formación cuña sobre el puente de inmediaaato."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Caballeros, formación en CUÑA! Que estos malditos apóstatas conozcan el acero soberano del Padre."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Barón Andrew, ocupo que nos den ojos en los cielos, lleve a sus hombres a lo alto, resguarde la retaguardia!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Nos perderemos la oportunidad de masacrar infieles... pero les brindaremos ojos en lo alto."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Conde JuanA, que sus hombres defiendan con su vida la carreta."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Pobre de aquel que ponga un dedo sobre estas reliquias sagradas."`, claseTexto: "txt-lugarteniente"
    });

    crearBoton("Desplegar Tácticas", () => { abrirFormacionCuna(resolverFormacionCuna); });
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
            jugador.liderazgoBase += 30; jugador.liderazgo += 30; 
            agregarTexto("[Fe de Batalla: +30 por formación perfecta e inspiradora]", "txt-sagrado");
        } else {
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/multicab.webp", nombrePersonaje: "Hueste de Caballeros", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"Una carga digna, pero la presencia de un veterano noble al frente habría quebrado sus espíritus antes del choque..."`, claseTexto: "txt-multitud"
            });
            jugador.liderazgoBase += 25; jugador.liderazgo += 25; 
            agregarTexto("[Fe de Batalla: +25 por formación completa sin noble al frente]", "txt-sagrado");
        }
        jugador.ataqueBase += 2; actualizarHUD(); 
        agregarTexto("[+2 Ataque por ventaja táctica]", "txt-sagrado");
    } else {
        let penalizacionFe = resultado.vacios * multiplicadorPenalizacion;
        
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
        jugador.liderazgoBase -= penalizacionFe; jugador.liderazgo -= penalizacionFe; jugador.ataqueBase = Math.max(0, jugador.ataqueBase - 1); actualizarHUD();
    }

    if (resultado.todaNobleza && resultado.total > 0) {
        agregarTexto("<div class='separador'>***</div>");
        agregarTexto(`Al ver que solo sangre noble conforma la vanguardia, la hueste entera ruge con un orgullo ensordecedor. "¡Pura sangre de reyes y mártires! ¡Nada puede quebrar esta carga!"`, "txt-sagrado");
        jugador.liderazgoBase += 5; jugador.liderazgo += 5; actualizarHUD();
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
        if(skipCine) {
            if(overlay) overlay.style.display = "none";
            iniciarCombateCuna(resultado, evaluarFinCombateCuna);
        } else {
            if (typeof playCinematicaCargaCuna === 'function') {
                playCinematicaCargaCuna(resultado, () => {
                    if(overlay) overlay.style.display = "none";
                    iniciarCombateCuna(resultado, evaluarFinCombateCuna); 
                });
            }
        }
    });
}

async function evaluarFinCombateCuna(lineaRota, bajas) {
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
        let bonoBase = 0; let logFe = "";
        if (todaNobleza) {
            bonoBase = soldadosCaidos === 0 ? (Math.floor(Math.random() * (13 - 11 + 1)) + 11) : ((Math.floor(Math.random() * (11 - 9 + 1)) + 9) - (soldadosCaidos * 5));
            logFe = soldadosCaidos === 0 ? `[+${bonoBase} FE BASE por Carga de Sangre Azul Perfecta]` : `[FE BASE: Bono de Nobleza menos penalidad = ${bonoBase}]`;
        } else {
            bonoBase = soldadosCaidos === 0 ? (Math.floor(Math.random() * (11 - 7 + 1)) + 7) : ((Math.floor(Math.random() * (10 - 7 + 1)) + 7) - (soldadosCaidos * 2));
            logFe = soldadosCaidos === 0 ? `[+${bonoBase} FE BASE por Carga Efectiva]` : `[FE BASE: Bono menos penalidad = ${bonoBase}]`;
        }
        jugador.liderazgoBase = (jugador.liderazgoBase || 0) + bonoBase;
        jugador.liderazgo = jugador.liderazgoBase; actualizarHUD();
        agregarTexto(logFe, "mensaje-sistema");
        
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
    // FIX TÁCTICO: Arranca el Viento con Relámpagos al quebrar la línea.
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

    crearBoton("DESPLEGAR MURO DE PICAS", () => {
        if(typeof EstadoBatalla !== 'undefined') {
            let totalPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;
            let ppTurno = (totalPiq >= 4) ? 12 : (totalPiq === 3 ? 8 : (totalPiq === 2 ? 6 : (totalPiq === 1 ? 3 : 12)));
            EstadoBatalla.metaProgresoMuro = ppTurno * 4; 
            EstadoBatalla.progresoMuro = 0; 
        }
        abrirFormacionPicas(preparativosMuroPicas);
    });
}

async function preparativosMuroPicas(resultado) {
    limpiarBotones(); storyArea.innerHTML = ""; agregarTexto("<div class='separador'>***</div>");

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
        jugador.liderazgoBase = (jugador.liderazgoBase || 0) + 10; jugador.liderazgo = jugador.liderazgoBase;
        agregarTexto("[Fe de Batalla: +10 por disciplina de falange perfecta]", "txt-sagrado");
    } else {
        agregarTexto(`La prisa de la maniobra dejó ${resultado.vacios} huecos en vuestro muro.`);
        jugador.liderazgoBase = (jugador.liderazgoBase || 0) - (resultado.vacios * 5); jugador.liderazgo = jugador.liderazgoBase;
    }

    crearBoton("⚔️ ¡QUE DIOS RECONOZCA A LOS SUYOS! (Sostener el Muro)", async () => {
        let overlay = document.getElementById("formacion-overlay");
        if(overlay) overlay.style.display = "flex";
        document.getElementById("formacion-roster").style.display = "none";
        document.getElementById("formacion-tablero").style.display = "none";
        document.getElementById("btn-iniciar-formacion-picas").style.display = "none";

        let skipCine = document.getElementById("ht-skip-cine")?.checked;
        if(skipCine) {
            if(overlay) overlay.style.display = "none";
            iniciarCombatePicas(resultado, evaluarFinCombatePicas);
        } else {
            if (typeof playCinematicaRelevoPicas === 'function') {
                playCinematicaRelevoPicas(() => {
                    if(overlay) overlay.style.display = "none";
                    iniciarCombatePicas(resultado, evaluarFinCombatePicas);
                });
            }
        }
    });
}

async function evaluarFinCombatePicas(victoria, bajas) {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    jugador.enemigosAsesinados = (jugador.enemigosAsesinados || 0) + bajas;
    
    if(victoria) {
        await nodo_IA_Victoria();
    } else {
        agregarTexto(`EL MURO HA CAÍDO`, "txt-hereje");
        agregarTexto(`La horda sobrepasó vuestras lanzas y la sangre sagrada tiñe el puente.`);
        crearBoton("Continuar (Misión Fallida)", () => {
             crearBoton("Reiniciar Campaña", iniciarJuego);
        });
    }
}

async function nodo_IA_Victoria() {
    storyArea.innerHTML = "";
    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>NODO I.A - VICTORIA: EL CIELO SE OSCURECE</h2>");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Barón Andrew! ¡Llegáis justo a tiempo, por la Gracia de la Trinidad!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Bueno... debía asegurar que la puntería de mi compañía estuviera moralizada por la oración. Un perno bendecido no yerra el tiro."`, claseTexto: "txt-lugarteniente"
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
        if(skipCine) {
            if(overlay) overlay.style.display = "none";
            if(typeof iniciarFaseBosque === "function") iniciarFaseBosque(); else interludiumCapitulo1();
        } else {
            if (typeof playCinematicaRepliegue === 'function') {
                playCinematicaRepliegue(() => {
                    if(overlay) overlay.style.display = "none";
                    if(typeof iniciarFaseBosque === "function") iniciarFaseBosque(); else interludiumCapitulo1();
                });
            }
        }
    });
}

// === RUTAS OPCIONALES (II Y III) REFACTORIZADAS ===

async function capitulo1_opcionII_Inicio() {
    limpiarBotones(); storyArea.innerHTML = "";
    agregarTexto(`Has escogido: <b>II. El Muro de los Penitentes</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Que caigan las flechas de las ballestas contra esos paganos impuros! ¡Fieles Ballesteros! ¡Ascended por la cresta de piedra..."`, claseTexto: "txt-comandante"
    });

    jugador.liderazgo = (jugador.liderazgo || 0) + 1; actualizarHUD();
    agregarTexto("[Fe de Batalla: +1 por la disciplina de hierro impuesta]", "txt-sagrado");
    combateAtaqueVsAtaque(4, victoriaCombate, async () => await capitulo1_opcionII_Fallo1());
}

async function capitulo1_opcionII_Fallo1() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Señor, los paganos han advertido la posición de nuestros ballesteros... ¿Qué ordenáis, ${jugador.nombre}?"`, claseTexto: "txt-lugarteniente"
    });

    crearBoton("El Repliegue de las Saetas", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡Hijos de la Luz! ¡Replegaos al instante!"`, claseTexto: "txt-comandante"
        });
        jugador.ataqueBase = Math.max(0, (jugador.ataqueBase || 0) - 2); jugador.liderazgo = (jugador.liderazgo || 0) - 2; actualizarHUD();
        combateAtaqueVsAtaque(4, victoriaCombate, async () => await capitulo1_opcionII_DerrotaRepliegue());
    });
    crearBoton("Amparo a los Ballesteros", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡Niego tal orden! ¡Es imperativo que mantengan la posición..."`, claseTexto: "txt-comandante"
        });
        jugador.ataqueBase = (jugador.ataqueBase || 0) + 1; jugador.liderazgo = (jugador.liderazgo || 0) + 1; actualizarHUD();
        combateAtaqueVsAtaque(4, victoriaCombate, async () => await capitulo1_opcionII_Fallo2());
    });
}

async function capitulo1_opcionII_DerrotaRepliegue() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    agregarTexto("Los paganos se abalanzan sobre nuestros saeteros; son feroces en la cercanía...");
    crearBoton("El Sacrificio de los Justos", () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        jugador.ataqueBase = 0; jugador.liderazgo = (jugador.liderazgo || 0) - 3; actualizarHUD();
        jugador.vidas = (jugador.vidas || 3) - 1; actualizarHUD(); crearBoton("Continuar", capitulo1_DerrotaFinal);
    });
    crearBoton("Luchar o Perecer", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
            texto: `"No, la salvación de esta campaña depende de esas saetas..."`, claseTexto: "txt-lugarteniente"
        });
        jugador.liderazgo = (jugador.liderazgo || 0) + 1; actualizarHUD();
        combateAtaqueVsAtaque(4, victoriaCombateAlexandro, capitulo1_DerrotaFinal);
    });
}

async function capitulo1_opcionII_Fallo2() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡He acudido en vuestro socorro, mas requiero de vuestra puntería certera!..."`, claseTexto: "txt-comandante"
    });
    crearBoton("Auxilio al Comendador", () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        jugador.ataqueBase = Math.max(0, (jugador.ataqueBase || 0) - 1); jugador.liderazgo = (jugador.liderazgo || 0) - 1; actualizarHUD();
        combateAtaqueVsAtaque(4, victoriaCombate, capitulo1_DerrotaFinal);
    });
}

async function capitulo1_opcionIII_Inicio() {
    limpiarBotones(); storyArea.innerHTML = "";
    agregarTexto(`Has escogido: <b>III. El Sacrificio del Camino</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡A prisa, crucemos el viaducto de piedra! ¡Atajad el paso con los carros de carga y sed roca ante el enemigo!..."`, claseTexto: "txt-comandante"
    });
    
    jugador.liderazgo = (jugador.liderazgo || 0) + 2; actualizarHUD();
    crearBoton("¡Todos a la Vanguardia del Carro!", async () => await capitulo1_opcionIII_Vanguardia());
    crearBoton("¡Dividíos! ¡Dos grupos de combate!", async () => await capitulo1_opcionIII_Dividios());
}

async function capitulo1_opcionIII_Vanguardia() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Soldados de Cristo, os requiero a todos en la defensa de los carros!..."`, claseTexto: "txt-comandante"
    });
    jugador.liderazgo = (jugador.liderazgo || 0) + 1; actualizarHUD();
    combateDefensaVsAtaque(4, victoriaVanguardia, async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡Sostened la línea! ¡Ganad tiempo para que nuestras saetas hablen! ¡No desfallezcáis!"`, claseTexto: "txt-comandante"
        });
        crearBoton("¡Firmeza y Penitencia!", () => {
            limpiarBotones(); jugador.liderazgo = (jugador.liderazgo || 0) + 2; actualizarHUD();
            crearBoton(`${jugador.nombre} se entrega a la lid`, () => {
                limpiarBotones(); jugador.ataqueBase = (jugador.ataqueBase || 0) + 3; 
                combateAtaqueVsAtaque(4, victoriaCombateSolemne, capitulo1_DerrotaFinal);
            });
        });
    });
}

async function capitulo1_opcionIII_Dividios() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    jugador.ataqueBase = Math.max(0, (jugador.ataqueBase || 0) - 1); jugador.liderazgo = (jugador.liderazgo || 0) - 1; actualizarHUD();
    combateAtaqueVsAtaque(4, victoriaCombate, async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡No demoréis vuestro retorno, Alexandro!..."`, claseTexto: "txt-comandante"
        });
        crearBoton(`${jugador.nombre} Se entrega al combate`, () => {
            limpiarBotones(); jugador.ataqueBase = (jugador.ataqueBase || 0) + 3;
            combateAtaqueVsAtaque(4, victoriaCombate, async () => await capitulo1_opcionIII_Dividios_Fallo2());
        });
    });
}

async function capitulo1_opcionIII_Dividios_Fallo2() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    jugador.ataqueBase = (jugador.ataqueBase || 0) + 5; actualizarHUD();
    combateAtaqueVsAtaque(4, victoriaCombateSolemne, capitulo1_DerrotaFinal);
}

function capitulo1_DerrotaFinal() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    agregarTexto("Habéis fracasado. Quizás fue vuestra soberbia la que arrastró a los vuestros al fango del combate...", "mensaje-combate");
    crearBoton("Volver a la Introducción", iniciarJuego); 
}

function victoriaCombate() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto("¡Bien hecho novato!! Has repelido el ataque de los bárbaros."); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }
function victoriaCombateSolemne() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto("El campo de batalla queda en un silencio sepulcral. El enemigo ha sido aplastado."); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }
function victoriaCombateAlexandro() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto(`<b>Sir Alexandro:</b> "¡TUA GRATIA ADJUTUS!"`, "txt-lugarteniente"); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }
function victoriaVanguardia() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto("La lid prosigue con furia, hasta que el enemigo da media vuelta en vergonzosa huida."); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }

function interludiumCapitulo1() {
    storyArea.innerHTML = ""; limpiarBotones();
    
    // FIX TÁCTICO: Limpiamos por completo el cielo para descansar.
    if (typeof window.Clima !== "undefined") window.Clima.detenerTodo();
    
    jugador.liderazgoBase = jugador.liderazgoBase || 0;
    jugador.liderazgo = jugador.liderazgoBase; 
    jugador.ataqueBase = jugador.ataqueReal || 0; 
    jugador.defensaBase = jugador.defensaReal || 0;
    
    agregarTexto("<h2 style='text-align:center; color:#ffaa00;'>INTERLUDIUM</h2>");
    agregarTexto("<b>La Calma tras la Tormenta:</b> La agitación de la refriega y las emociones del combate se disipan con la oración de la victoria.");
    agregarTexto("Señor Comendador, vuestro designio ha resultado ser una obra maestra de la milicia sagrada.");
    
    let loot = Math.floor(Math.random() * (18 - 9 + 1)) + 9; jugador.denarios += loot;
    jugador.ataqueReal = (jugador.ataqueReal || 0) + 2; 
    jugador.defensaReal = (jugador.defensaReal || 0) + 1;
    let feLoot = Math.floor(Math.random() * (14 - 7 + 1)) + 7; jugador.liderazgoBase += feLoot;
    actualizarHUD();

    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("BOTÍN Y GLORIA", "txt-accion");
    agregarTexto(`Habéis recolectado <b>${loot} denarios de plata</b> y vuestra hueste se ve renovada en vigor.`);
    crearBoton("Introducción Capítulo II", () => { alert("Fin del Capítulo 1 por ahora."); });
}

// =====================================================================
// === FASE DEL BOSQUE: EL PARLAMENTO DE LAS ESPADAS Y EL SACRIFICIO ===
// =====================================================================

async function iniciarParlamentoBosque() {
    let storyArea = document.getElementById("story-area");
    storyArea.innerHTML = ""; 
    if(typeof limpiarBotones === "function") limpiarBotones();
    
    let n = jugador.nombre;

    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>EL PARLAMENTO EN EL BOSQUE NEGRO</h2>");
    agregarTexto("Tras la brutal carga, el choque de aceros cesa abruptamente. En el centro de un claro neblinoso manchado de sangre, Quedáis cara a cara con la bestia que lidera la horda enemiga.", "txt-accion");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"¿Así que esta es la maldita compañía de escoria de la que todo el Medio Oriente está hablando? ¿Vienen a liberar hombres, eh? Pero... ¿No era su secta de paz y sin violencia? ¿Acaso su Dios enclavado en un madero no les prohíbe matar? ¡Herejes de su propia fe!"`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Soy ${n} de la noble ciudad de Toledo. Ya conociste el valor de mi compañía y el peso de nuestra ira, maldita escoria impía. Tu falta de caridad nubla tu intelecto y te ciega ante la Verdad Divina."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Nuestro Señor nos manda amar al prójimo, y es precisamente ese santo deber el que nos obliga a empuñar la espada. El amor exige la legítima defensa del inocente frente a lobos rapaces como tú. Estamos aquí para liberar a los cautivos, y como has visto, mis hombres y yo estamos dispuestos a dar nuestra propia vida por nuestro juramento ante el estandarte bicolor."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/lugarte1.webp", nombrePersonaje: "Lugarteniente Pagano", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"¡Blah, blah, blah! Menuda homilía... ¿Comenzarán las negociaciones materiales o cortamos la cabeza de estos estúpidos monjes cautivos de una buena vez?"`, claseTexto: "txt-lug-pagano"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"Me apetecen los denarios de su secta para ir a gastarlos con mujeres y vino en las tabernas de Damasco..."`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `<i>(Desenvainando lentamente su espada, cuyo roce frío hace eco en el bosque)</i>: "¡Pues será con las rameras del infierno cuando el acero de mi espada corte tu asquerosa yugular!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz y Lugarteniente", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"¡Ahahaahahahaahah...!"`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/lugarte1.webp", nombrePersonaje: "Lugarteniente Pagano", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"Apuesto a que tu fe se doblará como la rama de un árbol frágil, viejo y torcido cuando te infunda el mismo terror con el que hemos aterrorizado a sus indefensos pueblos cristianos..."`, claseTexto: "txt-lug-pagano"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Sir Alexandro! Le ordeno estrictamente disciplina ante las malditas serpientes. La ira desordenada es veneno del demonio; no caigáis en su provocación. Purificad vuestra lengua."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `<i>(agacha la mirada en obediencia, clava la rodilla en tierra y recita las Alabanzas Divinas en reparación por las blasfemias escuchadas)</i>:<br><br>Benedictus Deus.<br>Benedictum Nomen Sanctum eius.<br>Benedictus Iesus Christus, verus Deus et verus homo.<br>Benedictum Nomen Iesu.<br>Benedictum Cor eius sacratissimum.<br>Benedictus Sanguis eius pretiosissimus.<br>Benedictus Iesus in sanctissimo altaris Sacramento.<br>Benedictus Sanctus Spiritus, Paraclitus.<br>Benedicta excelsa Mater Dei, Maria sanctissima.<br>Benedicta sancta eius et immaculata Conceptio.<br>Benedicta eius gloriosa Assumptio.<br>Benedictum nomen Mariae, Virginis et Matris.<br>Benedictus sanctus Ioseph, eius castissimus Sponsus.<br>Benedictus Deus in Angelis et in Sanctis suis. Amen.`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Exigimos un trato justo y digno para el intercambio de nuestros frailes! JoanJoz, tu fuerza está gravemente mermada por el impacto de mis hombres. Por tu propia vida y la de tus súbditos... ¡exijo un trato aquí y ahora!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"Entiendo que su patética misión es rescatar cautivos... y he de imaginar que la paga divina es mejor cuando mis prisioneros resultan ser unos viejos inútiles y débiles monjes. Tengo únicamente a 5 frailes de los 8 que logramos secuestrar en la Batalla de los Cuernos de Hattin..."`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"¿Te parecen 2 denarios por cada hombre? Eso da un total de heemm..."`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/lugarte1.webp", nombrePersonaje: "Lugarteniente Pagano", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"Diez... Diez hermosos y relucientes denarios de plata."`, claseTexto: "txt-lug-pagano"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `<i>(-piensa con amargura-)</i>: "Partimos sin recursos de Roma. Los pocos denarios que quedan en el morral son para la supervivencia y las levas de la tropa. No podemos gastarlos o moriremos de hambre antes de la próxima luna..."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡Mi propia libertad por la de los cinco frailes cautivos! ¡Llevadme a mí!"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/lugarte1.webp", nombrePersonaje: "Lugarteniente Pagano", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"Ahahahaha... Y yo que creía que los que hacían votos de extrema pobreza eran los Templarios..."`, claseTexto: "txt-lug-pagano"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"¿Su apuesto lugarteniente de la caballería? Mmmm... Podrían pagar por él el doble de denarios en los mercados de carne de pueblos paganos... ¿Qué dice su 'enmendador'?"`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `<i>(Cierra los ojos, aprieta el crucifijo de su pecho y clama al Cielo)</i>: "Veni, Sancte Spíritus... Señor Jesucristo, concédeme el Don de Consejo. Que mis decisiones no se guíen por la prudencia cobarde de los hombres, sino por la santa locura de la Cruz."`, claseTexto: "txt-sagrado"
    });

    agregarTexto("<div class='separador'>***</div>");
    
    let actionArea = document.getElementById("action-area");
    let btnPagar = document.createElement("button");
    btnPagar.innerText = `Pagar 10 Denarios de Plata (Tienes: ${jugador.denarios})`;
    
    if (jugador.denarios >= 10) {
        btnPagar.onclick = async () => await escena_Pago_Denarios();
    } else {
        btnPagar.disabled = true; 
        agregarTexto(`<b>Comendador ${n}:</b> (No tenemos suficiente plata en las arcas. El voto de pobreza nos ha alcanzado. Solo queda el sacrificio...)`, "txt-hereje");
    }
    actionArea.appendChild(btnPagar);

    crearBoton("Entregar a Sir Alexandro", async () => await escena_Sacrificio_Alexandro());
    setTimeout(() => { storyArea.scrollTop = storyArea.scrollHeight; }, 50);
}

async function escena_Sacrificio_Alexandro() {
    let storyArea = document.getElementById("story-area");
    storyArea.innerHTML = ""; limpiarBotones();
    let n = jugador.nombre;

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Aceptamos el trato. Fiel a la sagrada Regla de la Orden Trinitaria, un hermano entrega su propia libertad por la del cautivo sufriente. Pero quiero ver primero a mis cinco monjes cautivos con vida."`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/enemigos/generale.webp", nombrePersonaje: "JoanJoz", alineacion: "der", bordeClase: "borde-enemigo", nombreClase: "nombre-der",
        texto: `"¡No! ¡Cállate y escucha, yo soy el que pone las reglas aquí! Ahahahaha... Quiero toda su armadura pesada y sus pertenencias conmigo... ¡incluyendo su maldito caballo de guerra! Y tendrán que dejarnos ir a nosotros."`, claseTexto: "txt-joanjoz"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Trae a los cautivos de una vez!"`, claseTexto: "txt-comandante"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `<i>(-piensa en silencio, con el corazón roto pero firme-)</i>: "Que Dios te proteja en todo momento en este martirio blanco. Si está en nuestras manos, volveremos y pagaremos con sangre o plata por tu libertad."`, claseTexto: "txt-comandante"
    });

    agregarTexto(`Sir Alexandro asiente con serenidad. Baja lentamente de su corcel de guerra, se despoja de sus armas, y voltea a ver a sus hombres. La tropa mantiene una formación de cuña perfecta, inquebrantable, con lágrimas en los ojos de algunos veteranos. Sir Alexandro infla el pecho y les grita con la fuerza de un león:`, "txt-accion");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡¡DEUS LO VULT!!"`, claseTexto: "txt-lugarteniente"
    });

    agregarTexto(`Los vitroles de la caballería y la infantería responden al unísono, rompiendo el silencio del bosque mientras alzan el estandarte de la orden de la Santisima Trinidad y apuntan sus lanzas hacia El Padre en el cielo:`, "txt-accion");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/multicab.webp", nombrePersonaje: "Hueste Trinitaria", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"¡¡DEUS VULT!!"`, claseTexto: "txt-sagrado"
    });

    agregarTexto(`El ejército de los paganos, lleno de inmundicia, ridiculiza, escupe y humilla frente a sus propios hombres a Sir Alexandro, arrancándole la capa. Antes de encadenarlo, JoanJoz entrega a ${n} a los 5 cautivos. Son monjes ancianos, débiles y demacrados, sombras de lo que alguna vez fueron antes de ser capturados en la Batalla de los Cuernos de Hattin.`, "txt-accion");
    
    if (jugador && jugador.tropas) {
        let indexAlex = jugador.tropas.findIndex(t => t.idUnico === "hero-alexandro" || t.nombre === "Sir Alexandro");
        if(indexAlex !== -1) jugador.tropas.splice(indexAlex, 1);
    }
    jugador.liderazgoBase += 15; jugador.liderazgo += 15; actualizarHUD();
    crearBoton("Avanzar al Interludium", interludiumCapitulo1);
}

async function escena_Pago_Denarios() {
    let storyArea = document.getElementById("story-area");
    storyArea.innerHTML = ""; limpiarBotones();
    let n = jugador.nombre; jugador.denarios -= 10; actualizarHUD();

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Tomad vuestra sucia plata, hijos de la perdición. Diez denarios, tal como exigís. Pero liberad a los siervos de Dios ahora mismo."`, claseTexto: "txt-comandante"
    });
    
    agregarTexto(`JoanJoz arrebata la bolsa de cuero, sopesando las monedas con una sonrisa torcida y avariciosa. Tras comprobar la plata, empuja a los cinco frailes hacia la línea cristiana. Son ancianos demacrados, sobrevivientes de la Batalla de los Cuernos de Hattin, que caen de rodillas alabando a la Trinidad al ver las cruces bicolores.`, "txt-accion");

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"El oro se recupera, pero un alma salvada del yugo pagano tiene un valor eterno en el Reino de los Cielos."`, claseTexto: "txt-lugarteniente"
    });

    agregarTexto(`Los herejes se retiran rápidamente hacia las sombras del bosque, llevándose sus monedas, pero dejando atrás la luz de la Gracia.`, "txt-accion");
    crearBoton("Avanzar al Interludium", interludiumCapitulo1);
}