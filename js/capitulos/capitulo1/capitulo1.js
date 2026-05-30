/* === CAPITULO1.JS - EL ASEDIO DEL PUENTE (MOTOR VN) === */

function escena1() {
    limpiarBotones(); cambiarMusica('bgm-juego'); storyArea.innerHTML = ""; 
    
    if (typeof window.Clima !== "undefined") window.Clima.iniciarViento();

    // FIX TÁCTICO: ¡Se enciende el deber de la Liturgia de las Horas!
    if (typeof RelojDivino !== "undefined") RelojDivino.marchaIniciada = true;

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
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Ave María Purísima, Señor Comendador ${n}. Que la Gracia de la Santísima Trinidad sostenga vuestro brazo en esta hora de tribulación."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Os traigo noticias urgentes y amargas. Hemos dejado atrás las tierras seguras; nos encontramos ahora en el Desfiladero de las Sombras Eternas, la única vía hacia la Ciudad de la Luz Blanca. Bajo vuestra custodia viajan los Vasos Sagrados y las Reliquias de los Primeros Padres..."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Sin embargo, el enemigo acecha. Una horda de renegados, soldados apóstatas que han cambiado su honor por el vil metal, nos aguarda. Son sesenta almas condenadas, armadas con hierro viejo y corazones podridos. Buscan profanar lo sagrado y vender la libertad de nuestros hermanos frailes al mejor postor."`, claseTexto: "txt-clerigo"
    });
    
    let numCab = jugador.tropas.filter(t => t.tipoGeneral === "caballeros").length;
    let numBall = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros").length;
    let numPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros").length;

    agregarTexto(`<b>Vuestras fuerzas actuales:</b>`, "txt-clerigo");
    agregarTexto(`<ul><li><b>${numCab} Caballeros:</b> La punta de lanza de la hueste, listos para clavar sus lanzas.</li><li><b>${numBall} Ballesteros:</b> Saeteros que purgarán a distancia.</li><li><b>${numPiq} Piqueros:</b> El muro inquebrantable de lanzas.</li></ul>`, "txt-clerigo");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"A vuestra izquierda, la pared de roca se alza como una muralla de catedral; a vuestra derecha, un barranco profundo donde el eco no devuelve respuesta. Cien varas adelante, el Puente de Piedra de San Juan cruza el abismo. <b>El paso es angosto, Comendador, por el puente apenas caben cinco hombres a lo ancho.</b>"`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Señor Comendador, el tiempo de la oración contemplativa ha terminado; es hora de la oración de las espadas. ¿Cómo habéis de desplegar el acero de la Trinidad?"`, claseTexto: "txt-clerigo"
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
                texto: `"¡Mi Señor! ¿Ordenáis una carga de caballería? ¡Pero si no contamos con un solo corcel en nuestras filas! La locura se ha apoderado de vos. Reconsiderad la táctica o pereceremos todos en este puente."`, claseTexto: "txt-hereje"
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
        texto: `"Barón Andrew, ocupo que nos den ojos en los cielos, lleve a sus hombres a lo lo alto, resguarde la retaguardia!"`, claseTexto: "txt-comandante"
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

    crearBoton("Desplegar Tácticas", async () => { 
        let resultado = await abrirFormacionCuna(); 
        await resolverFormacionCuna(resultado);
    });
}

// === RUTAS OPCIONALES (II Y III) ===

async function capitulo1_opcionII_Inicio() {
    limpiarBotones(); storyArea.innerHTML = "";
    agregarTexto(`Has escogido: <b>II. El Muro de los Penitentes</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Que caigan las flechas de las ballestas contra esos paganos impuros! ¡Fieles Ballesteros! ¡Ascended por la cresta de piedra..."`, claseTexto: "txt-comandante"
    });

    GestorEstado.modificarFe(1, "la disciplina de hierro impuesta");
    
    let victoria = await combateAtaqueVsAtaque(4);
    if(victoria) await victoriaCombate(); else await capitulo1_opcionII_Fallo1();
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
        GestorEstado.modificarFe(-2, "una orden de repliegue apresurada");
        GestorEstado.modificarAtaque(-2, "desorganización táctica");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombate(); else await capitulo1_opcionII_DerrotaRepliegue();
    });
    crearBoton("Amparo a los Ballesteros", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡Niego tal orden! ¡Es imperativo que mantengan la posición..."`, claseTexto: "txt-comandante"
        });
        GestorEstado.modificarFe(1, "valentía táctica temeraria");
        GestorEstado.modificarAtaque(1, "posicionamiento firme");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombate(); else await capitulo1_opcionII_Fallo2();
    });
}

async function capitulo1_opcionII_DerrotaRepliegue() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    agregarTexto("Los paganos se abalanzan sobre nuestros saeteros; son feroces en la cercanía...");
    
    crearBoton("El Sacrificio de los Justos", () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        jugador.ataqueBase = 0; 
        GestorEstado.modificarFe(-3, "el sacrificio desesperado de las filas");
        GestorEstado.modificarVidas(-1, "un asalto directo al mando");
        crearBoton("Continuar", capitulo1_DerrotaFinal);
    });
    crearBoton("Luchar o Perecer", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
            texto: `"No, la salvación de esta campaña depende de esas saetas..."`, claseTexto: "txt-lugarteniente"
        });
        GestorEstado.modificarFe(1, "la moral inquebrantable del lugarteniente");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombateAlexandro(); else capitulo1_DerrotaFinal();
    });
}

async function capitulo1_opcionII_Fallo2() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡He acudido en vuestro socorro, mas requiero de vuestra puntería certera!..."`, claseTexto: "txt-comandante"
    });
    crearBoton("Auxilio al Comendador", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        GestorEstado.modificarAtaque(-1, "descoordinación en la ayuda");
        GestorEstado.modificarFe(-1, "dudas en la retaguardia");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombate(); else capitulo1_DerrotaFinal();
    });
}

async function capitulo1_opcionIII_Inicio() {
    limpiarBotones(); storyArea.innerHTML = "";
    agregarTexto(`Has escogido: <b>III. El Sacrificio del Camino</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡A prisa, crucemos el viaducto de piedra! ¡Atajad el paso con los carros de carga y sed roca ante el enemigo!..."`, claseTexto: "txt-comandante"
    });
    
    GestorEstado.modificarFe(2, "asegurar defensas improvisadas");
    crearBoton("¡Todos a la Vanguardia del Carro!", async () => await capitulo1_opcionIII_Vanguardia());
    crearBoton("¡Dividíos! ¡Dos grupos de combate!", async () => await capitulo1_opcionIII_Dividios());
}

async function capitulo1_opcionIII_Vanguardia() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Soldados de Cristo, os requiero a todos en la defensa de los carros!..."`, claseTexto: "txt-comandante"
    });
    
    GestorEstado.modificarFe(1, "presencia de mando en la línea");
    let victoria = await combateDefensaVsAtaque(4);
    
    if (victoria) {
        await victoriaVanguardia();
    } else {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡Sostened la línea! ¡Ganad tiempo para que nuestras saetas hablen! ¡No desfallezcáis!"`, claseTexto: "txt-comandante"
        });
        crearBoton("¡Firmeza y Penitencia!", () => {
            limpiarBotones(); 
            GestorEstado.modificarFe(2, "firmeza en la adversidad");
            crearBoton(`${jugador.nombre} se entrega a la lid`, async () => {
                limpiarBotones(); 
                GestorEstado.modificarAtaque(3, "la ira del Comendador en el frente");
                
                let v2 = await combateAtaqueVsAtaque(4);
                if(v2) await victoriaCombateSolemne(); else capitulo1_DerrotaFinal();
            });
        });
    }
}

async function capitulo1_opcionIII_Dividios() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    GestorEstado.modificarAtaque(-1, "división de las fuerzas");
    GestorEstado.modificarFe(-1, "la confusión en las órdenes");
    
    let victoria = await combateAtaqueVsAtaque(4);
    if(victoria) {
        await victoriaCombate();
    } else {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"¡No demoréis vuestro retorno, Alexandro!..."`, claseTexto: "txt-comandante"
        });
        crearBoton(`${jugador.nombre} Se entrega al combate`, async () => {
            limpiarBotones(); 
            GestorEstado.modificarAtaque(3, "furia desesperada del mando");
            let v2 = await combateAtaqueVsAtaque(4);
            if(v2) await victoriaCombate(); else await capitulo1_opcionIII_Dividios_Fallo2();
        });
    }
}

async function capitulo1_opcionIII_Dividios_Fallo2() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    GestorEstado.modificarAtaque(5, "sacrificio total de la línea");
    let victoria = await combateAtaqueVsAtaque(4);
    if(victoria) await victoriaCombateSolemne(); else capitulo1_DerrotaFinal();
}

function capitulo1_DerrotaFinal() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    agregarTexto("Habéis fracasado. Quizás fue vuestra soberbia la que arrastró a los vuestros al fango del combate...", "mensaje-combate");
    crearBoton("Volver a la Introducción", iniciarJuego); 
}

async function victoriaCombate() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto("¡Bien hecho novato!! Has repelido el ataque de los bárbaros."); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }
async function victoriaCombateSolemne() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto("El campo de batalla queda en un silencio sepulcral. El enemigo ha sido aplastado."); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }
async function victoriaCombateAlexandro() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto(`<b>Sir Alexandro:</b> "¡TUA GRATIA ADJUTUS!"`, "txt-lugarteniente"); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }
async function victoriaVanguardia() { cambiarMusica('bgm-victoria'); limpiarBotones(); agregarTexto("La lid prosigue con furia, hasta que el enemigo da media vuelta en vergonzosa huida."); crearBoton("Avanzar al INTERLUDIUM", interludiumCapitulo1); }

function interludiumCapitulo1() {
    storyArea.innerHTML = ""; limpiarBotones();
    
    if (typeof window.Clima !== "undefined") window.Clima.detenerTodo();
    
    agregarTexto("<h2 style='text-align:center; color:#ffaa00;'>INTERLUDIUM</h2>");
    agregarTexto("<b>La Calma tras la Tormenta:</b> La agitación de la refriega y las emociones del combate se disipan con la oración de la victoria.");
    agregarTexto("Señor Comendador, vuestro designio ha resultado ser una obra maestra de la milicia sagrada.");
    
    let loot = Math.floor(Math.random() * (18 - 9 + 1)) + 9; 
    let feLoot = Math.floor(Math.random() * (14 - 7 + 1)) + 7; 
    
    GestorEstado.modificarOro(loot, "los despojos enemigos");
    GestorEstado.modificarFe(feLoot, "una victoria guiada por la providencia");
    
    jugador.ataqueReal = (jugador.ataqueReal || 0) + 2; 
    jugador.defensaReal = (jugador.defensaReal || 0) + 1;
    jugador.ataqueBase = jugador.ataqueReal; 
    jugador.defensaBase = jugador.defensaReal;

    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("BOTÍN Y GLORIA", "txt-accion");
    crearBoton("Introducción Capítulo II", () => { alert("Fin del Capítulo 1 por ahora."); });
}

function combateAtaqueVsAtaque(enemigoAtk) {
    return new Promise(resolve => {
        agregarTexto("⚔--- CHOQUE DE FUERZAS ---⚔", "separador");
        limpiarBotones();
        crearBoton("⚔️ 'Señor, adiestra mis manos para el combate'", () => {
            limpiarBotones(); 
            agregarTexto("[Elevando una plegaria silenciosa mientras la muerte se abalanza...]", "txt-accion");
            setTimeout(() => {
                let infoFe = obtenerEstadoFe();
                let dadoJugador = (jugador.liderazgo <= -50) ? 0 : tirarDado();
                let dadoEnemigo = (jugador.liderazgo >= 126) ? 0 : tirarDado();
                let poderJugador = jugador.ataqueBase + dadoJugador + infoFe.mod;
                let poderEnemigo = enemigoAtk + dadoEnemigo;
                
                let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
                let classMod = "txt-sagrado";
                if (infoFe.mod > 0) classMod = "mensaje-sistema";
                if (infoFe.mod < 0) classMod = "txt-hereje";
                
                let avisoNoDadoJugador = (jugador.liderazgo <= -50) ? "" : ` + ✝${dadoJugador}`;
                let avisoNoDadoEnemigo = (jugador.liderazgo >= 126) ? " (Furia Anulada)" : ` + 🗡️${dadoEnemigo}`;
                
                agregarTexto(infoFe.textoCombate, "txt-sagrado");
                agregarTexto(`Tu Ataque Global: ${jugador.ataqueBase} (Base)${avisoNoDadoJugador} <span class="${classMod}"> ${signoMod} (${infoFe.nombre})</span> = <b>${poderJugador}</b>`);
                agregarTexto(`Ataque Enemigo: ${enemigoAtk} (Base)${avisoNoDadoEnemigo} = <b>${poderEnemigo}</b>`);
                
                if (poderJugador > poderEnemigo) {
                    agregarTexto(`🏆 ¡Tu fuerza de empuje rompe sus líneas!`, "mensaje-sistema");
                    crearBoton("Continuar", () => resolve(true));
                } else {
                    GestorEstado.modificarVidas(-1, "un asalto despiadado");
                    agregarTexto(`💀 El enemigo soporta tu embate y contraataca ferozmente. La campaña sufre daños.`, "txt-hereje");
                    crearBoton("Continuar", () => resolve(false));
                }
            }, 1500); 
        });
    });
}

function combateDefensaVsAtaque(enemigoAtk) {
    return new Promise(resolve => {
        agregarTexto("🛡️--- RESISTENCIA EN EL MURO ---⚔️", "separador");
        limpiarBotones();
        crearBoton("🛡️ 'Espíritu Santo, sé mi escudo'", () => {
            limpiarBotones(); 
            agregarTexto("[Elevando una plegaria silenciosa mientras la muerte se abalanza...]", "txt-accion");
            setTimeout(() => {
                let infoFe = obtenerEstadoFe();
                let dadoJugador = (jugador.liderazgo <= -50) ? 0 : tirarDado();
                let dadoEnemigo = (jugador.liderazgo >= 126) ? 0 : tirarDado();
                let poderJugador = jugador.defensaBase + dadoJugador + infoFe.mod;
                let poderEnemigo = enemigoAtk + dadoEnemigo;
                
                let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
                let classMod = "txt-sagrado";
                if (infoFe.mod > 0) classMod = "mensaje-sistema";
                if (infoFe.mod < 0) classMod = "txt-hereje";
                
                let avisoNoDadoJugador = (jugador.liderazgo <= -50) ? "" : ` + ✝${dadoJugador}`;
                let avisoNoDadoEnemigo = (jugador.liderazgo >= 126) ? " (Furia Anulada)" : ` + 🗡️${dadoEnemigo}`;
                
                agregarTexto(infoFe.textoCombate, "txt-sagrado");
                agregarTexto(`Tu Defensa Global: ${jugador.defensaBase} (Base)${avisoNoDadoJugador} <span class="${classMod}"> ${signoMod} (${infoFe.nombre})</span> = <b>${poderJugador}</b>`);
                agregarTexto(`Ataque Enemigo: ${enemigoAtk} (Base)${avisoNoDadoEnemigo} = <b>${poderEnemigo}</b>`);
                
                if (poderJugador > poderEnemigo) {
                    agregarTexto(`🏆 ¡Vuestro muro de escudos resiste estoico el embate!`, "mensaje-sistema");
                    crearBoton("Continuar", () => resolve(true));
                } else {
                    GestorEstado.modificarVidas(-1, "un muro penetrado");
                    agregarTexto(`💀 La línea se quiebra bajo la furia enemiga. La campaña sufre daños.`, "txt-hereje");
                    crearBoton("Continuar", () => resolve(false));
                }
            }, 1500); 
        });
    });
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
    agregarTexto("Tras la brutal carga, el choque de aceros cesa abruptamente. En el centro de un claro neblinoso manchado de sangre, quedáis cara a cara con la bestia que lidera la horda enemiga.", "txt-accion");
    
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

    // FIX TÁCTICO: Divinas Alabanzas invocadas desde la base de datos liturgia.js
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `<i>(agacha la mirada en obediencia, clava la rodilla en tierra y recita las Alabanzas Divinas en reparación por las blasfemias escuchadas)</i>:<br><br>${OracionesEspeciales.divinasAlabanzas}`, claseTexto: "txt-sagrado"
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

    // FIX TÁCTICO: Oración Veni Sancte Spíritus invocada desde la base de datos liturgia.js
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `<i>(Cierra los ojos, aprieta el crucifijo de su pecho y clama al Cielo)</i>:<br><br>"${OracionesEspeciales.veniSancteSpiritus}"<br><br>"Señor Jesucristo, concédeme el Don de Consejo. Que mis decisiones no se guíen por la prudencia cobarde de los hombres, sino por la santa locura de la Cruz."`, claseTexto: "txt-sagrado"
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
    
    if (typeof GestorEstado !== 'undefined') GestorEstado.modificarFe(15, "un acto heroico de cautiverio");
    
    crearBoton("Avanzar al Interludium", interludiumCapitulo1);
}

async function escena_Pago_Denarios() {
    let storyArea = document.getElementById("story-area");
    storyArea.innerHTML = ""; limpiarBotones();
    let n = jugador.nombre; 
    
    if (typeof GestorEstado !== 'undefined') GestorEstado.modificarOro(-10, "rescate de los cinco frailes");

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

async function nodo_IA_Victoria() {
    storyArea.innerHTML = ""; 
    limpiarBotones();
    
    if (typeof window.Clima !== "undefined" && typeof window.Clima.iniciarLluvia === "function") {
        window.Clima.iniciarLluvia();
    }
    
    // FIX TÁCTICO: Se ha eliminado el 'else' problemático para proteger la inmersión musical.
    let audioLluvia = document.getElementById("bgm-rain");
    if (audioLluvia) { cambiarMusica("bgm-rain"); } 

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