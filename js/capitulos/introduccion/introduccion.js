/* === INTRODUCCION.JS - PRÓLOGO Y RECLUTAMIENTO INICIAL === */

function obtenerTextosHora() {
    let hInfo = {
        nombre: "la Divina Providencia",
        caballero: "los cielos atestiguan tu devoción",
        papa: "el Señor guía inescrutablemente nuestros pasos",
        santo: "Todos los Santos",
        fecha: "17 de Diciembre de 1198"
    };
    
    if (typeof RelojDivino !== 'undefined' && RelojDivino.indiceActual !== -1 && typeof RelojDivino.obtenerFechaActual === 'function') {
        let h = RelojDivino.horas[RelojDivino.indiceActual];
        let diaInfo = RelojDivino.obtenerFechaActual();
        hInfo.nombre = h;
        hInfo.santo = diaInfo.santo;
        hInfo.fecha = diaInfo.fecha;
        
        switch(h) {
            case "Laudes":
                hInfo.caballero = "el canto del alba destierra a las tinieblas y anuncia la misericordia divina";
                hInfo.papa = "la luz de Cristo perfora la penumbra del mundo pagano";
                break;
            case "Prima":
                hInfo.caballero = "el primer aliento del día nos consagra al combate y a la penitencia";
                hInfo.papa = "el sol naciente renueva nuestro sagrado deber en esta efímera tierra";
                break;
            case "Tercia":
                hInfo.caballero = "el Espíritu Santo desciende como fuego para inflamar el temple de los justos";
                hInfo.papa = "el sagrado fervor del Espíritu inunda las naves de esta santa basílica";
                break;
            case "Sexta":
                hInfo.caballero = "el sol arde en lo alto, recordándonos el amargo peso de la Cruz en el Gólgota";
                hInfo.papa = "la canícula del mediodía atestigua el sufrimiento del Cordero por nuestros pecados";
                break;
            case "Nona":
                hInfo.caballero = "conmemoramos el luctuoso instante en que el Cordero entregó su santo espíritu";
                hInfo.papa = "los cielos mismos guardan luto por la pasión expiatoria del Salvador";
                break;
            case "Vísperas":
                hInfo.caballero = "las sombras se extienden y nuestras plegarias ascienden purificadoras como el incienso";
                hInfo.papa = "el ocaso nos llama a la reflexión y a agradecer las batallas que la gracia nos otorga";
                break;
            case "Completas":
                hInfo.caballero = "el manto de la noche nos envuelve, exigiendo celosa vigilia contra el maligno";
                hInfo.papa = "las tinieblas acechan el exterior, mas la llama de la Fe jamás se extingue en nuestro seno";
                break;
        }
    }
    return hInfo;
}

function iniciarJuego() {
    document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    reiniciarJugadorBase(); jugador.nombre = "Recluta Anónimo"; storyArea.innerHTML = ""; 
    limpiarBotones();
    
    let hudPrincipal = document.getElementById("hud");
    if (hudPrincipal) hudPrincipal.style.display = "none";
    
    let areaAccion = document.getElementById("action-area");
    if (areaAccion) areaAccion.style.display = "none";
    
    storyArea.style.overflowY = "hidden";
    
    agregarTexto("<h2 class='txt-sagrado' style='text-align:center; font-size: 32px; letter-spacing: 3px; text-shadow: 0 0 15px #ffaa00; margin-top: -45px; margin-bottom: 5px; font-family: \"Cinzel\", serif;'>Campañas Cruzadas</h2>");
    
    agregarTexto("<div style='margin-top: -10px; line-height: 1.3;'><span style='display:block;'>Bienvenido seas a las aventuras cruzadas, selecciona tu campaña y que El Señor te bendiga.</span><i style='font-size:13px; color:#888;'>(La selección despertará los cantos de guerra y el fragor de la batalla)</i></div>", "mensaje-sistema");
    
    agregarTexto(`
        <div style="margin: 10px auto 0 auto; text-align: center; padding: 15px; border-top: 2px solid #ffd700; border-bottom: 2px solid #ffd700; width: 85%; background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 80%);">
            <p style="font-family: 'Cinzel', serif; font-size: 16px; color: #ffd700; text-transform: uppercase; letter-spacing: 4px; text-shadow: 0 0 15px #ffaa00; margin: 0;">
                Opus ab Archangelo Raphaële et Ludovico IX perfectum
            </p>
            <p style="font-family: 'Cinzel', serif; font-size: 14px; color: #fff; letter-spacing: 2px; margin-top: 5px; margin-bottom: 0; opacity: 0.9;">
                ad laudem et gloriam Trinitatis Sacrosanctæ
            </p>
        </div>
    `);

    agregarTexto(`
        <div style="margin-top: 10px; margin-bottom: 10px; padding: 20px 20px 30px 20px; border: 3px double #8b6508; background: linear-gradient(to bottom, #110800, #000000); border-radius: 8px; text-align: center; font-size: 15px; box-shadow: inset 0 0 30px rgba(0,0,0,1), 0 10px 25px rgba(0,0,0,0.9);">
            
            <p style="color: #d4af37; font-family: 'Cinzel', serif; font-size: 19px; margin: 0 0 10px 0; text-shadow: 2px 2px 4px #000; letter-spacing: 1px; font-weight: bold; display: flex; justify-content: center; align-items: center; gap: 10px;">
                <img src="assets/img/ui/cruzier.webp" class="cruz-jerusalem" alt="Cruz de Jerusalem"> 
                EQUESTRIS ORDO SANCTI SEPULCHRI HIEROSOLYMITANI 
                <img src="assets/img/ui/cruzier.webp" class="cruz-jerusalem" alt="Cruz de Jerusalem">
            </p>
            
            <p style="color: #c0c0c0; font-style: italic; margin: 0 auto 10px auto; line-height: 1.5; max-width: 95%;">Si en vuestro corazón anida el fervor de compartir visiones, enaltecer nuestras gestas o manifestar vuestro justo disgusto ante las flaquezas de esta obra, enviad vuestras epístolas a través de nuestros mensajeros. Toda ofrenda de sabiduría será recibida con la humildad de un monje copista.</p>
            
            <img src="assets/img/ui/escudo_oessj.webp" class="escudo-orden-intro" alt="Escudo de la Orden">
            
            <p style="margin: 10px 0 5px 0;">
                <b style="color: #d4af37; font-family: 'Cinzel', serif; font-size: 16px; letter-spacing: 1px;">Epístolas:</b> <br>
                <a href="mailto:luis17sdm@hotmail.com?subject=Cruzada%20de%20la%20Santisima%20Trinidad" style="color: #ffaa00; text-decoration: none; font-weight: bold; font-size: 17px; text-shadow: 0 0 8px rgba(255,170,0,0.5); display: inline-block; margin-top: 5px; font-family: monospace; transition: 0.3s;" onmouseover="this.style.color='#fff'; this.style.textShadow='0 0 15px #fff';" onmouseout="this.style.color='#ffaa00'; this.style.textShadow='0 0 8px rgba(255,170,0,0.5)';">luis17sdm@hotmail.com</a><br>
                <span style="font-size: 12px; color: #666; font-style: italic; display: inline-block; margin-top: 3px;">(Sellad vuestro pergamino con el Asunto: Cruzada de la Santísima Trinidad)</span>
            </p>
            
            <div style="display: flex; justify-content: center; gap: 40px; align-items: center; flex-wrap: wrap; margin-top: 15px;">
                <a href="https://www.facebook.com/luis.durmon.2025/" target="_blank" style="text-decoration: none; color: #c0c0c0; display: flex; align-items: center; gap: 8px; transition: 0.3s; font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px;" onmouseover="this.style.color='#d4af37'; this.style.textShadow='0 0 10px #d4af37'; this.querySelector('img').style.filter='drop-shadow(0 0 8px #d4af37)';" onmouseout="this.style.color='#c0c0c0'; this.style.textShadow='none'; this.querySelector('img').style.filter='drop-shadow(0 0 5px #000)';">
                    <img src="assets/img/ui/fb.webp" alt="FB" style="width: 24px; height: 24px; filter: drop-shadow(0 0 5px #000); transition: 0.3s;"> Luis DurMon
                </a>
                <a href="https://www.instagram.com/sir_arcangelrafael_elmagnanimo/" target="_blank" style="text-decoration: none; color: #c0c0c0; display: flex; align-items: center; gap: 8px; transition: 0.3s; font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px;" onmouseover="this.style.color='#d4af37'; this.style.textShadow='0 0 10px #d4af37'; this.querySelector('img').style.filter='drop-shadow(0 0 8px #d4af37)';" onmouseout="this.style.color='#c0c0c0'; this.style.textShadow='none'; this.querySelector('img').style.filter='drop-shadow(0 0 5px #000)';">
                    <img src="assets/img/ui/ig.webp" alt="IG" style="width: 24px; height: 24px; filter: drop-shadow(0 0 5px #000); transition: 0.3s;"> sir_arcangelrafael_elmagnanimo
                </a>
            </div>
            
            <div style="margin-top: 35px;">
                <button id="btn-start-campana">Campaña de la Santísima Trinidad</button>
            </div>
        </div>
    `);
    
    setTimeout(() => {
        let btnInicio = document.getElementById("btn-start-campana");
        if(btnInicio) {
            btnInicio.onclick = () => {
                let actArea = document.getElementById("action-area");
                if (actArea) actArea.style.display = "flex";
                
                limpiarBotones();
                if (typeof cambiarMusica === 'function') cambiarMusica('bgm-menu'); 
                jugador.orden = "Santísima Trinidad";
                let iconoOrden = document.getElementById("icono-orden");
                if (iconoOrden) { iconoOrden.src = "assets/img/ui/cruz_trinidad.webp"; iconoOrden.style.display = "inline-block"; }
                document.querySelectorAll('.estandarte').forEach(el => el.style.display = 'block');
                let emblemaIzq = document.getElementById("emblema-izq"); let emblemaDer = document.getElementById("emblema-der");
                if (emblemaIzq && emblemaDer) { emblemaIzq.src = "assets/img/ui/cruz_trinidad.webp"; emblemaDer.src = "assets/img/ui/cruz_trinidad.webp"; }
                pantallaNombre();
            };
        }
    }, 50);
}

function pantallaNombre() {
    let hudPrincipal = document.getElementById("hud");
    if (hudPrincipal) hudPrincipal.style.display = "flex";
    
    // FIX TÁCTICO: Ocultamos orgánicamente los componentes del HUD para la revelación narrativa divina
    ["btn-nombre-hud", "btn-tienda-hud", "stat-tiempo-container", "stat-fe-container"].forEach(id => {
        let el = document.getElementById(id);
        if(el) {
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            el.style.transition = "opacity 1.5s ease-in-out"; 
        }
    });
    
    let areaHistoria = document.getElementById("story-area");
    if (areaHistoria) areaHistoria.style.overflowY = "auto";

    storyArea.innerHTML = ""; 
    limpiarBotones();

    let styleError = document.getElementById("style-placeholder-error");
    if (!styleError) {
        styleError = document.createElement('style');
        styleError.id = "style-placeholder-error";
        styleError.innerHTML = `
            .input-error-expanded {
                width: 95% !important; 
                max-width: 600px !important;
                transition: width 0.3s ease !important;
            }
            .input-error-expanded::placeholder { 
                color: #ff4c4c !important;
            }
        `;
        document.head.appendChild(styleError);
    }

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
                
                if (typeof RelojDivino !== 'undefined') RelojDivino.iniciar();
                pantallaJuramento(); 
            }
        });

        setTimeout(() => {
            let inputVN = document.getElementById("vn-input-box");
            let btnVN = document.getElementById("vn-btn-next");
            if (inputVN && btnVN) {
                inputVN.classList.remove("input-error-expanded"); 
                
                btnVN.addEventListener("click", function() {
                    if (inputVN.value.trim() === "") {
                        inputVN.placeholder = "¡Un caballero no puede carecer de nombre!";
                        inputVN.classList.add("input-error-expanded");
                    }
                });

                inputVN.addEventListener("input", function() {
                    inputVN.classList.remove("input-error-expanded");
                });
            }
        }, 100);

    } else {
        agregarTexto("<b>Bienvenido, aspirante a la Cruz Bicolor.</b>", "mensaje-sistema");
        agregarTexto("Antes de tomar los votos, dinos...");
        agregarTexto("¿Cuál es tu nombre secular?");
        storyArea.innerHTML += `<input type="text" id="input-nombre" placeholder="¿Por qué nombre te conocerá Dios en el campo de batalla?..." autocomplete="off">`;
        storyArea.innerHTML += `<p id="error-nombre" class="txt-hereje" style="font-style:italic; display:none; margin-top:15px; text-align:center;">¡Un hombre no puede marchar a la Guerra Santa sin un nombre! Dinos quién eres para inscribirlo en las crónicas.</p>`;
        
        crearBoton("Aceptar", () => {
            let inputElement = document.getElementById("input-nombre"); 
            let errorElement = document.getElementById("error-nombre");
            let nombreIngresado = inputElement.value.trim();
            if (nombreIngresado === "") { 
                inputElement.style.borderColor = "#ff4c4c"; 
                inputElement.placeholder = "¡Un caballero no puede carecer de nombre!"; 
                inputElement.classList.add("input-error-expanded");
                errorElement.style.display = "block"; 
                
                inputElement.addEventListener("input", function() {
                    inputElement.classList.remove("input-error-expanded");
                });
                return; 
            }
            jugador.nombre = nombreIngresado; 
            actualizarHUD(); 
            
            if (typeof RelojDivino !== 'undefined') RelojDivino.iniciar();
            pantallaJuramento(); 
        });
    }
}

async function pantallaJuramento() {
    storyArea.innerHTML = ""; limpiarBotones(); let n = jugador.nombre;
    let horaLore = obtenerTextosHora();
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-trinitario", nombreClase: "nombre-trinitario",
        texto: `"${n}, en esta sacra hora de ${horaLore.nombre}, en la fiesta de ${horaLore.santo}, en la que ${horaLore.caballero}, ponte de rodillas ante el Altar del Altísimo y bajo la mirada de la Corte Celestial, pon tu mano sobre el Evangelio y escucha el peso de tu corona de espinas. Jura, por la Sangre del Cordero y el Misterio de la Unidad Divina, que desde este instante dejas de pertenecerte a ti mismo para ser instrumento de la Gracia. ¿Juras defender la Fe de Pedro con el acero y el espíritu, sin que el miedo oxide tu hoja ni la soberbia nuble tu juicio?"`, claseTexto: "txt-lugarteniente"
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

// FIX TÁCTICO: Función para invocar el "Fade-in" del HUD
function revelarElementoHUD(idElemento) {
    let el = document.getElementById(idElemento);
    if (el) {
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
    }
}

function parpadearElementoHUD(idElemento, colorBrillo) {
    let el = document.getElementById(idElemento);
    if (!el) return;
    
    let clasesPrevias = Array.from(el.classList).filter(c => c.startsWith('anim-brillo_'));
    clasesPrevias.forEach(c => el.classList.remove(c));
    
    let keyframeName = "brillo_" + Math.random().toString(36).substr(2,9);
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes ${keyframeName} {
            0% { box-shadow: 0 0 5px ${colorBrillo}, inset 0 0 5px ${colorBrillo}; background-color: rgba(255,255,255,0.1); text-shadow: 0 0 8px ${colorBrillo}; transform: scale(1); }
            50% { box-shadow: 0 0 25px ${colorBrillo}, inset 0 0 15px ${colorBrillo}; background-color: rgba(255,255,255,0.5); text-shadow: 0 0 15px ${colorBrillo}; transform: scale(1.05); }
            100% { box-shadow: 0 0 5px ${colorBrillo}, inset 0 0 5px ${colorBrillo}; background-color: rgba(255,255,255,0.1); text-shadow: 0 0 8px ${colorBrillo}; transform: scale(1); }
        }
        .${keyframeName} { 
            animation: ${keyframeName} 1.5s infinite !important; 
            border-radius: 8px !important; 
            display: inline-block !important; 
            padding: 5px 10px !important;
            transition: all 0.3s ease !important;
            position: relative;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
    
    let clearAnim = () => {
        el.classList.remove(keyframeName);
        el.classList.remove(`anim-brillo_base`);
        el.removeEventListener('mouseenter', clearAnim);
        setTimeout(() => style.remove(), 500); 
    };
    
    el.classList.add(`anim-brillo_base`); 
    el.classList.add(keyframeName);
    el.addEventListener('mouseenter', clearAnim);
}

async function pantallaManual() {
    storyArea.innerHTML = ""; limpiarBotones();
    let horaLore = obtenerTextosHora();
    
    inventarioDesbloqueado = true; 
    tiendaDesbloqueada = true; 
    cronicasDesbloqueado = true; 
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

    agregarTropa("sacerdote_unico", 1); 
    agregarTropa("explorador_unico", 1); 
    actualizarHUD();
    
    // FIX TÁCTICO: Se revela el Nombre y comienza a parpadear
    revelarElementoHUD("btn-nombre-hud");
    parpadearElementoHUD("btn-nombre-hud", "#4c88ff");
    
    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    let nombreScout = scout ? scout.nombre : "Hermano Vigía";

    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>BULA OPERANTE DIVINÆ DISPOSITIONIS</h2>");
    agregarTexto(`Comendador ${jugador.nombre}, os encontráis ante Su Santidad, el Papa Inocencio III, bajo las inmensas bóvedas de la Basílica de San Juan de Letrán. El Vicario de Cristo os observa con ojos que han visto caer imperios y levantarse mártires.`);
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Hijo mío, en esta venerable hora de ${horaLore.nombre}, en la fiesta de ${horaLore.santo}... 'Operante divinæ dispositionis clementia, a qua cuncta bona procedunt...'. Por la clemencia de la divina disposición, de la cual proceden todos los bienes, hoy, ${horaLore.fecha}, acogemos bajo la protección del bienaventurado Pedro y la nuestra vuestro santo propósito."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Con la autoridad apostólica, aprobamos y consagramos la Regla de la Orden de la Santísima Trinidad. He designado a <b>Fray Bartolomé</b> para velar por vuestra ortodoxia, y al <b>${nombreScout}</b>. Su labor será vital, Comendador: él será vuestros ojos en la penumbra. Un explorador sigiloso que se adelanta a la marcha, rastrea a los demonios paganos y escudriña el terreno para evitar que caigáis en emboscadas. Él caminará entre las sombras para que vuestra hueste pueda marchar en la luz."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Fray Bartolomé, a ti te encomiendo la insobornable labor de la pluma. Serás el escriba de sus <b>Crónicas</b>. Redactarás sin omitir detalle: cada cobardía, cada hereje abatido, cada denario sacrificado para la redención. Todo quedará sellado para que la Santa Sede y el Juez Supremo juzguen si esta cruzada fue verdaderamente santa o si pereció en la vanidad."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Y a vos, Comendador, os advierto: el acero se oxida sin la doctrina. Prestad estricta vigilancia a las horas canónicas. Si en vuestra soberbia ignoráis el tiempo de Dios, el demonio devorará a vuestras tropas. Mas si <b>consultáis el reloj de arena</b> que gobierna nuestro día, el Fray os revelará la cruda enseñanza moral del Santo que honramos. Bebed de esa sabiduría o pereced en vuestra ceguera."`, claseTexto: "txt-sagrado"
    });

    // FIX TÁCTICO: Se revela el Tiempo y comienza a parpadear
    revelarElementoHUD("stat-tiempo-container");
    parpadearElementoHUD("stat-tiempo-container", "#ffd700");

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Además, para asegurar la victoria de la Fe, os entrego el mando de los tres pilares de nuestra milicia. Primero, comanda la vanguardia <b>Sir Alexandro de Cerfroid</b>, con ${cantCab} Caballeros Nobles. Estos hombres de rancio abolengo han renunciado a sus castillos para vestir la cruz; son la caballería pesada, la élite arrolladora cuya carga de lanzas está destinada a quebrar el orgullo y las formaciones de la herejía."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"A su flanco cabalga el <b>Barón Andrew el Pío</b>, liderando a ${cantBall} Ballesteros Leales. Su mandato es purgar el campo a la distancia, cubriendo los cielos con saetas bendecidas. Son tiradores metódicos, conocedores de que un virote certero desde la altura ahorra la sangre de diez buenos cristianos en el fragor del combate."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Y como espina dorsal de vuestra hueste, marcha el veterano <b>Conde JuanA</b>, al frente de ${cantPiq} Piqueros Inquebrantables. Ellos son la muralla estoica de la Orden. Alzarán un erizo de astas impenetrables para custodiar las carretas y defender a los arqueros cuando la voraz infantería pagana intente devoraros."`, claseTexto: "txt-sagrado"
    });
    
    agregarTropa("caballero_noble", cantCab); 
    agregarTropa("ballestero_noble", cantBall); 
    agregarTropa("piquero_noble", cantPiq);
    actualizarHUD();

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Sin embargo, la guerra es voraz y vuestro número, pequeño. Tomad también esta bolsa con <b>${cantDenarios} denarios de plata</b>, fruto de las limosnas. Vos, Comendador ${jugador.nombre}, sois el encargado de terminar de forjar vuestra hueste. Afuera aguardan mercenarios dispuestos a vender su espada. Mas no olvidéis que el hambre y la sed son enemigos más crueles que el acero infiel; abasteced bien los morrales de la tropa con provisiones antes de partir. Usad el oro con sabiduría."`, claseTexto: "txt-sagrado"
    });
    
    jugador.denarios = cantDenarios;
    actualizarHUD();
    
    // FIX TÁCTICO: Se revelan los Denarios y comienzan a parpadear
    revelarElementoHUD("btn-tienda-hud");
    parpadearElementoHUD("btn-tienda-hud", "#ffaa00");

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Y por encima del hierro y la plata, llevad la luz de Cristo en vuestro espíritu. Os otorgo mi bendición y la del Padre Altísimo. Que esta llama de fervor inquebrantable sea el terror de los paganos y el faro de los cautivos. Marchad en Gracia, Comendador."`, claseTexto: "txt-sagrado"
    });
    
    jugador.liderazgo = 15; jugador.liderazgoBase = 15;
    jugador.ataqueReal = 3; jugador.defensaReal = 2;
    jugador.ataqueBase = jugador.ataqueReal; jugador.defensaBase = jugador.defensaReal;
    actualizarHUD();
    
    // FIX TÁCTICO: Se revela la Fe y comienza a parpadear
    revelarElementoHUD("stat-fe-container");
    parpadearElementoHUD("stat-fe-container", "#1e90ff");

    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>LA SENDA DE LA CRUZADA (Nuevas Reglas Tácticas):</b>");
    agregarTexto("A lo largo de vuestro peregrinaje, enfrentaréis emboscadas y pruebas del espíritu. Cada decisión moldeará el alma de vuestros hombres y el destino de la campaña.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>INSTRUCCIONES DE CAMPAÑA (Manuale Militis Táctico):</b>");
    
    agregarTexto(`<b>1. Tu Ejército y el Oro (💰):</b> Tu hueste se compone de unidades individuales (Haz click en "MI CAMPAÑA"). Los <b class="txt-sagrado">Nobles (Dorado)</b> tienen mejor destreza, mientras que los <b class="txt-multitud">Mercenarios (Gris)</b> son más débiles pero útiles. Usa tus Denarios sabiamente en los campamentos para reclutar hombres, comprar provisiones para el camino, adquirir mejoras permanentes para tu compañía o restaurar la salud de tus heridos.`);
    
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
    
    if (typeof Cronicas !== "undefined") {
        let nombresCab = jugador.tropas.filter(t => t.tipoGeneral === "caballeros").map(t => t.nombre);
        let nombresPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros").map(t => t.nombre);
        let nombresBall = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros").map(t => t.nombre);

        Cronicas.registrar("JURAMENTO", {
            nombre: jugador.nombre,
            caballeros: nombresCab,
            piqueros: nombresPiq,
            ballesteros: nombresBall,
            denarios: cantDenarios
        });
    }

    if (typeof iniciarPlazaInicial === 'function') {
        crearBoton("SALIR A LA PLAZA", iniciarPlazaInicial);
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