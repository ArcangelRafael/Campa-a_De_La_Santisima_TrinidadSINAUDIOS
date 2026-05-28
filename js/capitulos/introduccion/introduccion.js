/* === INTRODUCCION.JS - PRÓLOGO Y RECLUTAMIENTO INICIAL === */

function iniciarJuego() {
    document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    reiniciarJugadorBase(); jugador.nombre = "Recluta Anónimo"; storyArea.innerHTML = ""; 
    limpiarBotones();
    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>Campañas Cruzadas</h2>");
    agregarTexto("Bienvenido seas a las aventuras cruzadas, selecciona tu campaña y que El Señor te bendiga. (esto habilitará el sonido del juego).", "mensaje-sistema");
    agregarTexto("Desarrollo by: Sir Archangel Raphael & Luis IX", "mensaje-sistema");
    
    crearBoton("Campaña de la Santísima Trinidad", () => {
        limpiarBotones();
        if (typeof cambiarMusica === 'function') cambiarMusica('bgm-menu'); 
        jugador.orden = "Santísima Trinidad";
        let iconoOrden = document.getElementById("icono-orden");
        if (iconoOrden) { iconoOrden.src = "assets/img/ui/cruz_trinidad.webp"; iconoOrden.style.display = "inline-block"; }
        document.querySelectorAll('.estandarte').forEach(el => el.style.display = 'block');
        let emblemaIzq = document.getElementById("emblema-izq"); let emblemaDer = document.getElementById("emblema-der");
        if (emblemaIzq && emblemaDer) { emblemaIzq.src = "assets/img/ui/cruz_trinidad.webp"; emblemaDer.src = "assets/img/ui/cruz_trinidad.webp"; }
        pantallaNombre();
    });
}

function pantallaNombre() {
    storyArea.innerHTML = ""; 
    limpiarBotones();

    if (typeof SistemaDialogos !== 'undefined') {
        SistemaDialogos.iniciarEscena({
            personajeImg: "assets/img/personajes/aliados/cabaini.webp", 
            nombrePersonaje: "CABALLERO TRINITARIO",
            texto: "Bienvenido, aspirante a la Cruz Bicolor. Antes de tomar los votos, dinos... ¿Cuál es tu nombre secular?",
            requiereInput: true,
            placeholderInput: "¿Por qué nombre te conocerá Dios?...",
            textoErrorVacio: "¡Un hombre no puede marchar a la Guerra Santa sin un nombre! Dinos quién eres para inscribirlo en las crónicas.",
            callback: function(nombreIngresado) {
                jugador.nombre = nombreIngresado; 
                actualizarHUD(); 
                pantallaJuramento(); 
            }
        });
    } else {
        agregarTexto("<b>Bienvenido, aspirante a la Cruz Bicolor.</b>", "mensaje-sistema");
        agregarTexto("Antes de tomar los votos, dinos...");
        agregarTexto("¿Cuál es tu nombre secular?");
        storyArea.innerHTML += `<input type="text" id="input-nombre" placeholder="¿Por qué nombre te conocerá Dios en el campo de batalla?..." autocomplete="off">`;
        storyArea.innerHTML += `<p id="error-nombre" class="txt-hereje" style="font-style:italic; display:none; margin-top:15px; text-align:center;">¡Un hombre no puede marchar a la Guerra Santa sin un nombre! Dinos quién eres para inscribirlo en las crónicas.</p>`;
        
        crearBoton("Aceptar", () => {
            let inputElement = document.getElementById("input-nombre"); let errorElement = document.getElementById("error-nombre");
            let nombreIngresado = inputElement.value.trim();
            if (nombreIngresado === "") { inputElement.style.borderColor = "#ff4c4c"; errorElement.style.display = "block"; return; }
            jugador.nombre = nombreIngresado; actualizarHUD(); pantallaJuramento(); 
        });
    }
}

async function pantallaJuramento() {
    storyArea.innerHTML = ""; limpiarBotones(); let n = jugador.nombre;
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-trinitario", nombreClase: "nombre-trinitario",
        texto: `"${n}, ponte de rodillas ante el Altar del Altísimo y bajo la mirada de la Corte Celestial, pon tu mano sobre el Evangelio y escucha el peso de tu corona de espinas. Jura, por la Sangre del Cordero y el Misterio de la Unidad Divina, que desde este instante dejas de pertenecerte a ti mismo para ser instrumento de la Gracia. ¿Juras defender la Fe de Pedro con el acero y el espíritu, sin que el miedo oxide tu hoja ni la soberbia nuble tu juicio?"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-trinitario", nombreClase: "nombre-trinitario",
        texto: `"¿Juras observar el Voto del Tercio, consagrando la tercera parte de toda ganancia, honor y botín a la libertad de los hermanos que gimen bajo el yugo del infiel? ¿Juras, por la Cruz Roja de la Pasión y la Cruz Azul de la Esperanza que ahora marcas en tu pecho, que si el oro no bastara para romper las cadenas del cautivo, ofrecerás tu propia carne, tus propios años y tu propia libertad, entregándote a la esclavitud para que otro pueda volver a ver la luz de la cristiandad?"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-trinitario", nombreClase: "nombre-trinitario",
        texto: `"No busques gloria para tu nombre, pues tu nombre muere hoy para renacer en la Orden. No busques tesoros en la tierra, pues tu tesoro es el alma que rescatas del abismo. Levántate, Caballero de la Trinidad. Que el Padre te sostenga, el Hijo te guíe y el Espíritu Santo sea tu escudo en la batalla.<br><br>Gloria Tibi Trinitas, et Captivis Libertas."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Acepto humildemente, con el favor de Dios y la Santísima Virgen María. Que mi sangre sea semilla de libertad."`, claseTexto: "txt-comandante"
    });

    pantallaIntroduccion();
}

function pantallaIntroduccion() {
    storyArea.innerHTML = ""; limpiarBotones();
    agregarTexto("<h3 class='txt-sagrado'>El Eco de las Cadenas: El Surgimiento de la Trinidad</h3>");
    agregarTexto("Año del Señor de 1198. El mundo conocido está fracturado. Mientras los reyes se disputan tierras y coronas, miles de almas olvidadas gimen bajo el peso de los grilletes. En las costas del Mediterráneo y las arenas del norte de África, el viento no solo trae sal, sino el lamento de los cautivos. Para el mundo, son solo moneda de cambio; para el olvido, son sombras.");
    agregarTexto("Pero no para los hijos de la Cruz Bicolor.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b class='txt-sagrado'>El Pacto de los Maestros</b>");
    agregarTexto("En los bosques de Cerfroid, lejos del estruendo de las batallas, dos hombres forjaron un destino diferente. San Juan de Mata, un teólogo de visión inquebrantable, y San Félix de Valois, un ermitaño que halló a Dios en el silencio, recibieron un llamado que los reyes no pudieron escuchar: <i class='txt-accion'>“No busquen la gloria del acero, sino la libertad de los oprimidos”</i>.");
    agregarTexto("Bajo la bendición del Papa Inocencio III, fundaron la Orden de la Santísima Trinidad y de la Redención de Cautivos. No nacieron para conquistar reinos, sino para vaciar prisiones.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b class='txt-sagrado'>El Voto de Sangre y Oro</b>");
    agregarTexto("Como caballero de esta orden, no solo portas una espada, sino una responsabilidad que pesaría sobre el alma de cualquier hombre común. Te riges por leyes inquebrantables que definen tu existencia:");
    agregarTexto("<ul><li><b>El Tercio de los Bienes:</b> Cada moneda de oro que encuentres, cada tesoro recuperado de las ruinas y cada diezmo recibido no te pertenece. Un tercio exacto debe ser consagrado exclusivamente al rescate. El lujo es tu enemigo; la libertad ajena, tu único botín.</li><li><b>El Cambio de Almas:</b> Esta es la prueba máxima de tu fe. Si el oro falla, si el captor es implacable y el cautivo desfallece, tienes el permiso —y el sagrado deber— de ofrecer tu propia libertad a cambio de la del prisionero. Serás esclavo para que otro sea libre. Serás sombra para que otro vea la luz.</li></ul>");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b class='txt-sagrado'>Tu Identidad: La Cruz Bicolor</b>");
    agregarTexto("Vistes el hábito de lana blanca, símbolo de pureza y sacrificio. Pero sobre tu pecho late el verdadero corazón de la orden: la Cruz Trinitaria.");
    agregarTexto("<ul><li>La barra vertical de color rojo, representando la pasión y la sangre derramada por la humanidad.</li><li>La barra horizontal de color azul, representando la serenidad celestial y la protección divina.</li></ul>");
    agregarTexto("Esta cruz es tu escudo y tu estandarte. En las tierras donde el nombre de tu Dios es susurrado con miedo, esta insignia es un faro de esperanza... o un recordatorio para los tiranos de que el rescate ha llegado.");
    
    const btnTut = document.createElement("button"); btnTut.innerText = "MANUALE MILITIS"; btnTut.className = "btn-tutorial"; btnTut.onclick = pantallaManual; actionArea.appendChild(btnTut);
    storyArea.scrollTop = 0;
}

// FIX TÁCTICO: El parpadeo ahora solo se detiene cuando el ratón pasa por encima. Sin límite de tiempo.
function parpadearElementoHUD(idElemento, colorBrillo) {
    let el = document.getElementById(idElemento);
    if (!el) return;
    
    let keyframeName = "brilloTemporal_" + Math.random().toString(36).substr(2,9);
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes ${keyframeName} {
            0% { box-shadow: 0 0 5px ${colorBrillo}, inset 0 0 5px ${colorBrillo}; background-color: rgba(255,255,255,0.1); }
            50% { box-shadow: 0 0 25px ${colorBrillo}, inset 0 0 15px ${colorBrillo}; background-color: rgba(255,255,255,0.3); }
            100% { box-shadow: 0 0 5px ${colorBrillo}, inset 0 0 5px ${colorBrillo}; background-color: rgba(255,255,255,0.1); }
        }
        .anim-${keyframeName} { animation: ${keyframeName} 1.5s infinite; border-radius: 5px; cursor: pointer; }
    `;
    document.head.appendChild(style);
    
    el.classList.add(`anim-${keyframeName}`);
    
    let clearAnim = () => {
        el.classList.remove(`anim-${keyframeName}`);
        el.removeEventListener('mouseenter', clearAnim);
        setTimeout(() => style.remove(), 100);
    };
    
    el.addEventListener('mouseenter', clearAnim);
}

async function pantallaManual() {
    storyArea.innerHTML = ""; limpiarBotones();
    
    inventarioDesbloqueado = true; tiendaDesbloqueada = true; 
    let flecha = document.getElementById("flecha-inventario"); if(flecha) flecha.style.display = "inline";

    jugador.liderazgo = 0; jugador.liderazgoBase = 0; 
    jugador.denarios = 0; 
    jugador.tropas = [];
    jugador.vidas = 3; 
    jugador.ataqueReal = 2; jugador.defensaReal = 2;
    jugador.ataqueBase = jugador.ataqueReal; jugador.defensaBase = jugador.defensaReal;
    actualizarHUD();

    let cantDenarios = Math.floor(Math.random() * 10) + 24; 
    let cantCab = Math.floor(Math.random() * 3) + 3; 
    let cantBall = Math.floor(Math.random() * 3) + 5; 
    let cantPiq = Math.floor(Math.random() * 4) + 5; 
    let nombreScout = "El monje explorador"; 

    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>AUDIENCIA PAPAL</h2>");
    agregarTexto(`Comendador ${jugador.nombre}, os encontráis ante Su Santidad, el Papa Inocencio III, bajo las inmensas bóvedas de la Basílica de San Juan de Letrán. El Vicario de Cristo os observa con ojos que han visto caer imperios y levantarse mártires.`);
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Hijo mío, he designado a <b>Fray Bartolomé</b> y a un <b>Hermano Vigía</b> para que marchen a vuestro lado. Su labor será guiar el alma de vuestros hombres y los pasos de vuestra hueste."`, claseTexto: "txt-sagrado"
    });
    
    agregarTropa("sacerdote_unico", 1); 
    agregarTropa("explorador_unico", 1); 
    actualizarHUD();
    parpadearElementoHUD("btn-nombre-hud", "#4c88ff");
    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    if(scout) nombreScout = scout.nombre;

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Además, para proteger la fe, os entrego el mando de los pilares de nuestra cristiandad: <br><br><b>Sir Alexandro</b>, con ${cantCab} Caballeros Nobles.<br><b>Barón Andrew</b>, liderando a ${cantBall} Ballesteros Leales.<br><b>Conde JuanA</b>, al frente de ${cantPiq} Piqueros Inquebrantables."`, claseTexto: "txt-sagrado"
    });
    
    agregarTropa("caballero_noble", cantCab); 
    agregarTropa("ballestero_noble", cantBall); 
    agregarTropa("piquero_noble", cantPiq);
    actualizarHUD();
    parpadearElementoHUD("btn-nombre-hud", "#4c88ff");

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Estos hombres son la verdadera élite de Europa. No buscan oro, sino limpiar sus pecados con la sangre del infiel."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Sin embargo, la guerra es voraz y vuestro número, pequeño. Tomad también esta bolsa con <b>${cantDenarios} denarios de plata</b>, fruto de las limosnas. Vos, Comendador ${jugador.nombre}, sois el encargado de terminar de forjar vuestra hueste. Afuera aguardan mercenarios dispuestos a vender su espada. Usad el oro con sabiduría."`, claseTexto: "txt-sagrado"
    });
    
    jugador.denarios = cantDenarios;
    actualizarHUD();
    parpadearElementoHUD("btn-tienda-hud", "#ffaa00");

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Y por encima del hierro y la plata, llevad la luz de Cristo en vuestro espíritu. Os otorgo mi bendición y la del Padre Altísimo. Que esta llama de fervor inquebrantable sea el terror de los paganos y el faro de los cautivos. Marchad en Gracia, Comendador."`, claseTexto: "txt-sagrado"
    });
    
    jugador.liderazgo = 15; jugador.liderazgoBase = 15;
    jugador.ataqueReal = 3; jugador.defensaReal = 2;
    jugador.ataqueBase = jugador.ataqueReal; jugador.defensaBase = jugador.defensaReal;
    actualizarHUD();
    parpadearElementoHUD("stat-fe-container", "#1e90ff");

    // FIX TÁCTICO: Manuale Militis rescrito por completo, integrando las mecánicas que ordenaste.
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>LA SENDA DE LA CRUZADA (Nuevas Reglas Tácticas):</b>");
    agregarTexto("A lo largo de vuestro peregrinaje, enfrentaréis emboscadas y pruebas del espíritu. Cada decisión moldeará el alma de vuestros hombres y el destino de la campaña.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>INSTRUCCIONES DE CAMPAÑA (Manuale Militis Táctico):</b>");
    agregarTexto(`<b>1. Tu Ejército y el Oro (💰):</b> Tu hueste se compone de unidades individuales (Haz click en "MI CAMPAÑA"). Los <b class="txt-sagrado">Nobles (Dorado)</b> tienen mejor destreza, mientras que los <b class="txt-multitud">Mercenarios (Gris)</b> son más débiles pero útiles. Usa tus Denarios sabiamente en los campamentos para reclutar hombres, comprar mejoras permanentes para tu compañía o restaurar la salud de tus heridos.`);
    agregarTexto(`<b>2. La Suerte del Dado (🎲):</b> En cada choque de acero, Dios y el azar dictan sentencia. Tanto tú como el enemigo lanzaréis un dado de 6 caras que sumará su resultado a vuestras estadísticas base de Ataque y Defensa. ¡Un buen tiro puede cambiar el curso de la guerra!`);
    agregarTexto(`<b>3. El Arte del Combate (⚔️ vs 🛡️):</b> La guerra consta de dos fases implacables. Primero, el <b>Asalto</b>: El Ataque del agresor choca contra la Defensa del agredido (solo el defensor puede morir aquí). Si el defensor sobrevive a la embestida, comienza la <b>Refriega (Cuerpo a Cuerpo)</b>: Ataque contra Ataque, un duelo a muerte donde cualquiera de los dos hombres puede perecer.`);
    agregarTexto(`<b>4. Los Ballesteros (🏹):</b> Los tiradores son letales a distancia. Necesitan un turno de recarga para tensar cuerdas y asegurar pernos, pero cuando disparan, su proyectil ignora la defensa y abate al enemigo instantáneamente. ¡Protégelos! Si la horda enemiga logra llegar hasta su línea, se verán obligados a pelear cuerpo a cuerpo usando sus bajísimas estadísticas.`);
    agregarTexto(`<b>5. Sistema de Heridas (❤️):</b> Cada hombre soporta 2 heridas. Al perder su primera Vida, quedará HERIDO y luchará con penalidad (-1 Ataque y Defensa). Si pierde su última vida, será un mártir y morirá permanentemente.`);
    agregarTexto(`<b>6. La Fe y el Liderazgo (🕊️):</b> Sigue siendo el núcleo moral. Tu devoción o caída en pecado afectará el desempeño de TODO tu ejército:
    <ul>
        <li class="txt-sagrado"><b>126 o más (Estado de Gracia):</b> Anuláis por completo el dado de furia del oponente.</li>
        <li class="mensaje-sistema"><b>101 a 125 (Fervor Celestial):</b> +2 a vuestro cálculo de Ataque y Defensa general.</li>
        <li class="mensaje-sistema"><b>76 a 100 (Bendición Divina):</b> +1 a vuestro cálculo de Ataque y Defensa general.</li>
        <li><b>0 a 75 (Fe Firme):</b> Combate normal. Sin bonos ni penas.</li>
        <li class="txt-hereje"><b>-1 a -10 (Incertidumbre):</b> -1 a vuestro cálculo de Ataque y Defensa general.</li>
        <li class="txt-hereje"><b>-11 a -20 (Fatiga del Espíritu):</b> -2 a vuestro cálculo de Ataque y Defensa general.</li>
        <li class="txt-hereje"><b>-50 o menos (Noche Oscura del Alma):</b> Perdéis el derecho a lanzar vuestro Dado de Gracia.</li>
    </ul>`);
    
    if (typeof iniciarReclutamiento === 'function') {
        crearBoton("SALIR A LA PLAZA (RECLUTAR)", iniciarReclutamiento);
    } else {
        crearBoton("INICIAR MARCHA", escena1);
    }
    
    setTimeout(() => {
        let scrollTarget = storyArea.scrollHeight - storyArea.clientHeight;
        storyArea.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });
    }, 150);
}

iniciarJuego();