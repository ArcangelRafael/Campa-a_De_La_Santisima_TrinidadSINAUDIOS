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

// =========================================================================
// SISTEMA DE SELECCIÓN DE NUEVO LÍDER DE CABALLERÍA
// =========================================================================
function seleccionarNuevoLiderCaballeria() {
    return new Promise((resolve) => {
        let overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.style.cssText = "display:flex; position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:rgba(0,0,0,0.9); justify-content:center; align-items:center; z-index:4000;";

        let box = document.createElement("div");
        box.style.cssText = "background-color: #1a1a1a; border: 2px solid #ffaa00; padding: 30px; width: 800px; max-width: 95%; text-align: center; border-radius: 5px; box-shadow: 0 0 50px rgba(255, 170, 0, 0.5);";

        let titulo = document.createElement("h2");
        titulo.className = "txt-sagrado";
        titulo.innerText = "NOMBRAMIENTO DE LUGARTENIENTE";
        box.appendChild(titulo);

        let subtitulo = document.createElement("p");
        subtitulo.className = "txt-clerigo";
        subtitulo.innerText = "Selecciona a un Caballero Noble para liderar la vanguardia:";
        box.appendChild(subtitulo);

        let grid = document.createElement("div");
        grid.className = "grid-desplegado";
        grid.style.marginTop = "20px";

        // Filtrar Caballeros Nobles vivos
        let candidatos = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.clase === "noble" && t.hp > 0);
        
        // Prevención de errores por si todos los nobles murieron
        if (candidatos.length === 0) {
            candidatos = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0);
        }
        // Prevención extrema (si no queda ningún caballero vivo en todo el ejército)
        if (candidatos.length === 0) {
            candidatos = [{ idUnico: "cmd_temp_1", nombre: "Godefroy el Implacable", img: "assets/img/personajes/aliados/caballero_noble.webp", hp: 2, hpMax: 2, clase: "noble" }];
        }

        candidatos.forEach(c => {
            let card = document.createElement("div");
            card.className = "item-card-desplegado tropa-noble";
            card.style.cursor = "pointer";
            card.innerHTML = `
                <img src="${c.img}">
                <div class="unidad-nombre-aleatorio">${c.nombre}</div>
                <span class='txt-sagrado' style='font-size:10px;'>(Noble)</span>
            `;
            card.onclick = () => {
                document.body.removeChild(overlay);
                resolve(c);
            };
            grid.appendChild(card);
        });

        box.appendChild(grid);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

// FIX TÁCTICO: Convertido a función asíncrona para soportar el Motor de Diálogos
async function interludiumCapitulo1() {
    storyArea.innerHTML = ""; limpiarBotones();
    
    if (typeof window.Clima !== "undefined") window.Clima.detenerTodo();
    
    agregarTexto("<h2 style='text-align:center; color:#ffaa00;'>INTERLUDIUM</h2>");
    agregarTexto("<b>La Calma tras la Tormenta:</b> La agitación de la refriega y las emociones del combate se disipan con la oración de la victoria.");
    
    // =====================================================================
    // LÓGICA DE BIFURCACIÓN DE CAUTIVOS (PARLAMENTO)
    // =====================================================================
    let nuevosCautivos = [];
    
    if (window.parlamento_resuelto_cap1) {
        
        if (window.pagoPlata_cap1) {
            agregarTexto("Señor Comendador, vuestro designio ha resultado ser una obra maestra de la diplomacia divina. Habéis entregado la plata de la Orden, pero habéis salvado la vida de los siervos de Dios.", "mensaje-sistema");
        } else {
            agregarTexto(`Señor Comendador... el sacrificio de Sir Alexandro pesa enormemente en nuestros corazones. Ha sido entregado a la esclavitud pagana, pero su heroico martirio en vida ha comprado la libertad de estos siervos de Dios.`, "txt-hereje");
        }

        let horaMiseria = -21; 

        for(let i=0; i<5; i++){
            let nomFinal = "";
            let intentos = 0;
            do {
                let nRand = nombresMedievalesTRAD[Math.floor(Math.random() * nombresMedievalesTRAD.length)];
                let aRand = apellidosMedievalesTRAD[Math.floor(Math.random() * apellidosMedievalesTRAD.length)];
                nomFinal = `Fray ${nRand} ${aRand}`;
                intentos++;
            } while (jugador.nombresUsados.includes(nomFinal) && intentos < 100);
            
            jugador.nombresUsados.push(nomFinal);

            let cautivo = {
                idUnico: "cautivo_" + Math.random().toString(36).substr(2, 9),
                idTipo: "fraile_cautivo",
                tipoGeneral: "cautivos",
                clase: "mercenaria", 
                nombre: nomFinal,
                hpMax: 1, hp: 1, 
                atkMax: 0, defMax: 0,
                img: "assets/img/personajes/aliados/cautivo.webp",
                mochila: [], 
                hambre: 2, 
                sed: 1,    
                saltoHambre: false, 
                inicioSed: horaMiseria 
            };
            
            jugador.tropas.push(cautivo);
            nuevosCautivos.push(cautivo);
            
            if (typeof window.mostrarNotificacionFlotante === 'function') {
                setTimeout(() => {
                    window.mostrarNotificacionFlotante(`¡El Hermano Cautivo <b>${nomFinal}</b> se ha sumado a la Campaña!`);
                }, i * 600);
            }
        }

        agregarTexto("<div class='separador'>***</div>");
        agregarTexto("<b>LOS HERMANOS RESCATADOS:</b>", "txt-sagrado");
        agregarTexto("Apenas pueden sostenerse en pie. Están famélicos y deshidratados tras semanas de martirio en manos de la horda, pero sus espíritus rebosan de gratitud hacia la Cruz Bicolor.");

        if (typeof generarCartasTropas === 'function') {
            let htmlCartas = generarCartasTropas(nuevosCautivos);
            let gridHtml = `<div class="grid-desplegado" style="margin-top:15px; margin-bottom:15px;">${htmlCartas}</div>`;
            agregarTexto(gridHtml, "", true);
        }

        // =====================================================================
        // DIÁLOGOS DE RESCATE Y BIFURCACIÓN DE LÍDER
        // =====================================================================
        let n = jugador.nombre;
        let frayHabla1 = nuevosCautivos[0].nombre;
        let frayHabla2 = nuevosCautivos[1].nombre;

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/cautivo.webp", nombrePersonaje: frayHabla1, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
            texto: `"Bendito sea el Señor que envió a la cruz bicolor. Nos ha enviado a sus ángeles de acero a liberarnos. Somos algo ancianos y débiles, pero prometemos no ser una carga para su compañía, escóltenos hasta la siguiente aldea y de ahí nos las arreglaremos solos."`, claseTexto: "txt-clerigo"
        });

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
            texto: `"Esta compañía existe únicamente para ustedes, nuestra recompensa nos estará esperando en el cielo, si nuestros pecados no son mayores."`, claseTexto: "txt-comandante"
        });

        await MotorDialogos.mostrarDialogo({
            personajeImg: "assets/img/personajes/aliados/cautivo.webp", nombrePersonaje: frayHabla2, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
            texto: `"¡DEUS LO VULT!"`, claseTexto: "txt-sagrado"
        });

        if (window.pagoPlata_cap1) {
            // RAMA: EL RESCATE FUE PAGADO CON DENARIOS
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"Me alegra saber que mi comendador ${n} haya pagado con denarios por estos pobres hermanos y no con mi libertad. Que aunque con dolor lo hubiera aceptado si hubiera sido esa la voluntad de Dios."`, claseTexto: "txt-lugarteniente"
            });

            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                texto: `"Si no tuviéramos dinero para pagar su rescate, quien debió entregarse hubiera sido YO por no saber administrar los recursos ni mucho menos acatar la valiosa regla de la orden."`, claseTexto: "txt-comandante"
            });

            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray",
                texto: `"Me alegra ver que salió bien este acto. Liberamos a cinco cautivos, inmediatamente lo sabrán las crónicas."`, claseTexto: "txt-clerigo"
            });

        } else {
            // RAMA: SACRIFICIO DE SIR ALEXANDRO
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"Mi comendador ${n}, sus caballeros necesitan un nuevo líder de inmediato."`, claseTexto: "txt-lugarteniente"
            });

            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                texto: `"¡Lo sé!"`, claseTexto: "txt-comandante"
            });

            // Invoca la ventana emergente para que el jugador elija al nuevo noble
            let liderElegido = await seleccionarNuevoLiderCaballeria();
            jugador.nuevoLiderCaballeros = { nombre: liderElegido.nombre, idUnico: liderElegido.idUnico };

            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                texto: `"¡Escuchadme bien, ${liderElegido.nombre}! En el nombre del Padre, del Hijo y del Espíritu Santo, y por la sagrada autoridad que me confiere la Orden de la Santísima Trinidad, os designo como Lugarteniente interino de nuestra caballería. Que vuestra espada sea el brazo ejecutor de la Justicia Divina y vuestro escudo, el manto protector de la Virgen María. ¡Guiad a estos hombres con honor, castidad y temor de Dios hasta que recuperemos a nuestro hermano!"`, claseTexto: "txt-comandante"
            });

            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/lug_cab2.webp", nombrePersonaje: liderElegido.nombre, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
                texto: `"Humildemente acepto este cargo, mi Comendador. Sirviéndole fiel a la cruz bicolor y abrazando todos los juramentos de estricta pobreza y obediencia de nuestra Orden. Prometo ante la Santa Cruz que mi acero no descansará hasta purgar esta tierra de herejía. Que el Señor juzgue y condene mi alma si retrocedo un solo paso. ¡Por Cristo Rey y por la Orden!"`, claseTexto: "txt-lugarteniente"
            });
        }

    } else {
        agregarTexto("Señor Comendador, vuestro designio ha resultado ser una obra maestra de la milicia sagrada.");
    }
    
    // =====================================================================
    // BOTÍN Y LORE DEL DESPOJO (Aplica a todas las rutas)
    // =====================================================================
    let nombreComandante = jugador.nombre;
    let scoutObj = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    let nombreScout = scoutObj ? scoutObj.nombre : "Hermano Vigía";

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${nombreComandante}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Mis lugartenientes! Ordenad a vuestros hombres despojar de artículos valiosos a estos herejes lo más rápido posible. Hemos de hacerlo de inmediato, antes de que el eco de nuestra victoria atraiga a otra compañía de impíos. ¡Que su oro y su acero sirvan ahora a la causa de Cristo!"`, claseTexto: "txt-comandante"
    });

    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>EL DESPOJO BENDITO</b>", "txt-accion");
    
    // Cálculos estocásticos DOD del Botín
    let denariosLoot = Math.floor(Math.random() * (78 - 60 + 1)) + 60;
    let feLoot = 20; 
    let cotasLoot = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
    let yelmosLoot = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
    let espadasLoot = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
    let escudosLoot = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    let manzanasLoot = Math.floor(Math.random() * (9 - 5 + 1)) + 5;

    // Diálogos del Vigía reportando el Botín
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Señor Comendador, la compañía ha terminado de registrar a los caídos. Sorprendentemente, pese a tratarse de herejes de aldeas paganas, hemos hallado pertenencias de singular valor para nuestra causa."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"En sus zurrones manchados de lodo y sangre, contamos <b>${denariosLoot} denarios de plata</b>. Dinero que antes compraba pecado y ahora financiará nuestra santa redención."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Hemos desanudado <b>${cotasLoot} cotas de malla</b> en inmaculadas condiciones, que bien podrían proteger la carne cristiana de nuestros soldados frente a futuros embates."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Asimismo, recogimos del puente <b>${yelmosLoot} yelmos de acero</b> sin abolladuras. Serán ideales para actualizar la pobre defensa de nuestros hombres."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Envainadas y vírgenes del choque, descubrimos <b>${espadasLoot} espadas forjadas</b> sin la más mínima melladura, a la espera de un brazo justo que las empuñe."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Bajo los cuerpos se extrajeron <b>${escudosLoot} escudos gruesos de madera de roble</b>, increíblemente sólidos, pesados y resistentes a los embates paganos."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"En sus morrales profanos, el Señor nos proveyó con <b>${manzanasLoot} manzanas</b> en perfecto estado, maduras y listas para ser devoradas por nuestros batallones exhaustos."`, claseTexto: "txt-clerigo"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq",
        texto: `"Lamentablemente, mi Señor... sus odres de cuero estaban rajados o vacíos, y no logramos recolectar ni una sola gota de agua. Debemos tener extrema precaución con la bebida de ahora en adelante, o esta valerosa compañía perecerá de sed en un futuro no muy lejano bajo este sol implacable."`, claseTexto: "txt-hereje" 
    });

    agregarTexto(`<span class="mensaje-sistema" style="font-size: 15px; color:#a3a3a3;"><i>(El corazón de la hueste se ha inflamado de un fervor inconmensurable al ver aplastados a los enemigos de Dios. Se han llenado de un liderazgo místico y heroico).</i> <b><span class="txt-sagrado">[+20 de Fe Permanente]</span></b></span>`, "", true);

    // Inyectar recompensas tácticas en el Sistema
    GestorEstado.modificarOro(denariosLoot, "los despojos enemigos");
    GestorEstado.modificarFe(feLoot, "la aplastante victoria y moral restaurada");

    // Inyectando objetos físicos a la base de datos DOD (Inventario)
    let horaRelojBase = (typeof RelojDivino !== 'undefined' && RelojDivino.indiceActual !== -1) ? RelojDivino.indiceActual : 0;
    let diaBase = (typeof RelojDivino !== 'undefined') ? RelojDivino.diaActualIndex : 0;

    for(let i=0; i<espadasLoot; i++) jugador.inventario.push({id: "espada_forjada", diaCompra: diaBase, horaCompra: horaRelojBase});
    for(let i=0; i<cotasLoot; i++) jugador.inventario.push({id: "cota_malla", diaCompra: diaBase, horaCompra: horaRelojBase});
    for(let i=0; i<yelmosLoot; i++) jugador.inventario.push({id: "yelmo_hierro", diaCompra: diaBase, horaCompra: horaRelojBase});
    for(let i=0; i<escudosLoot; i++) jugador.inventario.push({id: "escudo_roble", diaCompra: diaBase, horaCompra: horaRelojBase});
    for(let i=0; i<manzanasLoot; i++) jugador.inventario.push({id: "manzana_fresca", diaCompra: diaBase, horaCompra: horaRelojBase});

    // Experiencia pasiva
    jugador.ataqueReal = (jugador.ataqueReal || 0) + 2; 
    jugador.defensaReal = (jugador.defensaReal || 0) + 1;
    jugador.ataqueBase = jugador.ataqueReal; 
    jugador.defensaBase = jugador.defensaReal;
    
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
        
        let nombresDeCautivosRescatados = nuevosCautivos.map(c => c.nombre);
        let nombreLiderInterino = jugador.nuevoLiderCaballeros ? jugador.nuevoLiderCaballeros.nombre : null;

        Cronicas.registrar("BATALLA", {
            tactica: tactica,
            esPrudente: esPrudente,
            aliadosCaidos: caidosArray,
            enemigosCaidos: enemigosMuertos,
            botin: denariosLoot,
            tercioRespetado: respetoTercio,
            huboSacrificioMercenario: huboSacrificioMercenario,
            huboParlamento: huboParlamento,
            pagoPlata: pagoPlata,
            clima: climaBatalla,
            nombresCautivos: nombresDeCautivosRescatados,
            nuevoLugarteniente: nombreLiderInterino
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