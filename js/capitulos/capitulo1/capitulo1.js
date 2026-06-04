/* === CAPITULO1.JS - EL GENERAL SUPREMO (INTRO, OPCIONES E INTERLUDIO) === */

function escena1() {
    limpiarBotones(); cambiarMusica('bgm-juego'); storyArea.innerHTML = ""; 
    
    // FIX TÁCTICO: Guardamos el estado del clima para el Fray
    if (typeof window.Clima !== "undefined") {
        window.Clima.iniciarViento();
        window.clima_actual_cap1 = "viento";
    }

    if (typeof RelojDivino !== "undefined") RelojDivino.marchaIniciada = true;

    jugador.caidosBatallaActual = [];

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
        window.tactica_elegida_cap1 = "La Carga de la Justicia Divina (Formación de Cuña Frontal)";
        window.tactica_prudente_cap1 = false;
        await capitulo1_opcionI_Inicio();
    });
    crearBoton("II. El Muro de los Penitentes", async () => {
        window.tactica_elegida_cap1 = "El Muro de los Penitentes (Posicionamiento en Altura)";
        window.tactica_prudente_cap1 = true;
        await capitulo1_opcionII_Inicio();
    });
    crearBoton("III. El Sacrificio del Camino", async () => {
        window.tactica_elegida_cap1 = "El Sacrificio del Camino (Atrincheramiento defensivo)";
        window.tactica_prudente_cap1 = true;
        await capitulo1_opcionIII_Inicio();
    });
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
    
    if (typeof Cronicas !== 'undefined') {
        let tactica = window.tactica_elegida_cap1 || "Combate caótico no registrado";
        let esPrudente = window.tactica_prudente_cap1 || false;
        
        let caidosArray = [];
        if (jugador.caidosBatallaActual && jugador.caidosBatallaActual.length > 0) {
            caidosArray = [...jugador.caidosBatallaActual];
        }

        let enemigosMuertos = jugador.enemigosAsesinados || 0; 
        let respetoTercio = true; 
        let huboSacrificioMercenario = jugador.mercenarioRedimidoId ? true : false;
        let huboParlamento = window.parlamento_resuelto_cap1 || false;
        let pagoPlata = window.pagoPlata_cap1 || false;

        let climaBatalla = window.clima_actual_cap1 || "despejado";

        Cronicas.registrar("BATALLA", {
            tactica: tactica,
            esPrudente: esPrudente,
            aliadosCaidos: caidosArray,
            enemigosCaidos: enemigosMuertos,
            botin: loot,
            tercioRespetado: respetoTercio,
            huboSacrificioMercenario: huboSacrificioMercenario,
            huboParlamento: huboParlamento,
            pagoPlata: pagoPlata,
            clima: climaBatalla
        });
        
        jugador.caidosBatallaActual = [];
    }

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
                let infoFe = typeof obtenerEstadoFe === 'function' ? obtenerEstadoFe() : {mod:0, nombre:"Neutro", textoCombate:""};
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
                let infoFe = typeof obtenerEstadoFe === 'function' ? obtenerEstadoFe() : {mod:0, nombre:"Neutro", textoCombate:""};
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