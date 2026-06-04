/* === RUTA_PARLAMENTO.JS - EL CONCLAVE EN EL BOSQUE NEGRO === */

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

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `<i>(Cierra los ojos, aprieta el crucifijo de su pecho y clama al Cielo)</i>:<br><br>"${OracionesEspeciales.veniSancteSpiritus}"<br><br>"Señor Jesucristo, concédeme el Don de Consejo. Que mis decisiones no se guíen por la prudencia cobarde de los hombres, sino por la santa locura de la Cruz."`, claseTexto: "txt-sagrado"
    });

    agregarTexto("<div class='separador'>***</div>");
    
    let actionArea = document.getElementById("action-area");
    let btnPagar = document.createElement("button");
    btnPagar.innerText = `Pagar 10 Denarios de Plata (Tienes: ${jugador.denarios})`;
    
    if (jugador.denarios >= 10) {
        btnPagar.onclick = async () => {
            window.parlamento_resuelto_cap1 = true;
            window.pagoPlata_cap1 = true;
            await escena_Pago_Denarios();
        };
    } else {
        btnPagar.disabled = true; 
        agregarTexto(`<b>Comendador ${n}:</b> (No tenemos suficiente plata en las arcas. El voto de pobreza nos ha alcanzado. Solo queda el sacrificio...)`, "txt-hereje");
    }
    actionArea.appendChild(btnPagar);

    crearBoton("Entregar a Sir Alexandro", async () => {
        window.parlamento_resuelto_cap1 = true;
        window.pagoPlata_cap1 = false;
        await escena_Sacrificio_Alexandro();
    });
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