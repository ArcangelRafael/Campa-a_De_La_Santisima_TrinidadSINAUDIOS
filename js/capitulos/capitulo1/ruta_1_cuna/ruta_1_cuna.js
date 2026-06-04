/* === RUTA_1_CUNA.JS - NARRATIVA OPCIÓN 1 (LA CARGA DE LA JUSTICIA DIVINA) === */

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
        if (typeof abrirFormacionCuna === 'function') {
            let resultado = await abrirFormacionCuna(); 
            if (typeof resolverFormacionCuna === 'function') {
                await resolverFormacionCuna(resultado);
            }
        }
    });
}

async function evaluarFinCombateCuna(lineaRota, bajas) {
    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "none";

    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    
    let soldadosCaidos = window.marcadoresBatalla ? window.marcadoresBatalla.filter(m => m.tipo === 'cross').length : 0;
    jugador.enemigosAsesinados = (jugador.enemigosAsesinados || 0) + bajas;
    
    if(lineaRota && bajas >= 15) {
        let bonoBase = soldadosCaidos === 0 ? (Math.floor(Math.random() * (11 - 7 + 1)) + 7) : ((Math.floor(Math.random() * (10 - 7 + 1)) + 7) - (soldadosCaidos * 2));
        let razon = soldadosCaidos === 0 ? "una carga efectiva e imbatida" : "una victoria sangrienta";
        
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
    
    // FIX TÁCTICO: Solo declaramos el clima para la crónica. Eliminamos las llamadas de reinicio visual y auditivo para no cortar la inmersión de la lluvia.
    window.clima_actual_cap1 = "lluvia";

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