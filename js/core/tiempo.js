/* === TIEMPO.JS - EL RELOJ DE LAS HORAS CANÓNICAS Y MOTOR DEL CLIMA === */

document.addEventListener("DOMContentLoaded", () => {
    const styleTiempo = document.createElement("style");
    styleTiempo.innerHTML = `
        @keyframes repiqueCampanas {
            0% { color: #c0c0c0; text-shadow: none; transform: scale(1); }
            50% { color: #ffffff; text-shadow: 0 0 15px #ffd700, 0 0 25px #ffffff; transform: scale(1.1); }
            100% { color: #c0c0c0; text-shadow: none; transform: scale(1); }
        }
        .hora-tanendo {
            animation: repiqueCampanas 1s infinite !important;
            font-weight: bold;
            color: #ffd700 !important;
            display: inline-block;
        }
    `;
    document.head.appendChild(styleTiempo);

    let timeContainer = document.getElementById("stat-tiempo-container");
    if(timeContainer) {
        timeContainer.onmouseover = () => { 
            let tooltip = document.getElementById("tiempo-tooltip");
            if(tooltip) tooltip.style.display = "block"; 
        };
        timeContainer.onmouseout = () => { 
            let tooltip = document.getElementById("tiempo-tooltip");
            if(tooltip) tooltip.style.display = "none"; 
        };
    }
    
    RelojDivino.actualizarTooltip(); 

    document.addEventListener("click", (e) => {
        if (RelojDivino.rezoPendiente && !RelojDivino.timerRezoIniciado) {
            setTimeout(() => {
                let animCaja = document.getElementById("animacion-escena1");
                let formOverlay = document.getElementById("formacion-overlay");
                
                let enCinematica = (animCaja && animCaja.style.display !== "none" && animCaja.innerHTML !== "") || 
                                   (formOverlay && formOverlay.style.display !== "none");
                
                if (!enCinematica) {
                    RelojDivino.timerRezoIniciado = true;
                    setTimeout(() => {
                        let animNow = document.getElementById("animacion-escena1");
                        let formNow = document.getElementById("formacion-overlay");
                        let ocupadaNow = (animNow && animNow.style.display !== "none" && animNow.innerHTML !== "") || 
                                         (formNow && formNow.style.display !== "none");

                        if (!ocupadaNow && RelojDivino.rezoPendiente) {
                            RelojDivino.rezoPendiente = false;
                            RelojDivino.timerRezoIniciado = false;
                            RelojDivino.invocarRezo(RelojDivino.horas[RelojDivino.indiceActual], true);
                        } else {
                            RelojDivino.timerRezoIniciado = false;
                        }
                    }, 3000); 
                }
            }, 150);
        }
    });
});

const RelojDivino = {
    horas: ["Laudes", "Prima", "Tercia", "Sexta", "Nona", "Vísperas", "Completas"],
    diaActualIndex: 0,
    
    // Inyectamos las bases de datos externas de liturgia.js
    descripciones: DescripcionesHoras,
    oraciones: OracionesCanonicas,

    indiceActual: -1, 
    duracionHora: 240000, 
    
    intervalo: null,
    tiempoInicioHora: 0,
    tiempoRestante: 0,
    
    marchaIniciada: false, 
    rezoPendiente: false, 
    timerRezoIniciado: false, 
    retrasoPorBatalla: false,

    obtenerFechaActual: function() {
        let index = this.diaActualIndex;
        if(index >= CalendarioSantoral.length) index = CalendarioSantoral.length - 1;
        return CalendarioSantoral[index];
    },

    iniciar: function() {
        if(this.intervalo) clearTimeout(this.intervalo); 
        this.diaActualIndex = 0;
        this.indiceActual = Math.random() < 0.5 ? 2 : 3; 
        
        this.actualizarHUD();
        this.notificarCambio(true);
        
        this.programarSiguienteHora(this.duracionHora);
        
        console.log(`[Reloj Divino] La cruzada ha comenzado bajo el sol de ${this.horas[this.indiceActual]}`);
    },

    programarSiguienteHora: function(delay) {
        if(this.intervalo) clearTimeout(this.intervalo);
        this.tiempoInicioHora = Date.now();
        this.tiempoRestante = delay;
        this.intervalo = setTimeout(() => {
            this.avanzarHora();
            this.programarSiguienteHora(this.duracionHora);
        }, delay);
    },

    pausar: function() {
        if (this.intervalo) {
            clearTimeout(this.intervalo);
            this.intervalo = null;
            let transcurrido = Date.now() - this.tiempoInicioHora;
            this.tiempoRestante = Math.max(0, this.tiempoRestante - transcurrido);
            console.log(`[Reloj Divino] PAUSA. Faltan ${Math.round(this.tiempoRestante/1000)}s para la siguiente hora canónica.`);
        }
    },

    reanudar: function() {
        if (!this.intervalo && this.marchaIniciada) {
            console.log("[Reloj Divino] REANUDADO. La Marcha continúa.");
            this.programarSiguienteHora(this.tiempoRestante);
        }
    },

    avanzarHora: function() {
        this.indiceActual++;
        if (this.indiceActual >= this.horas.length) {
            this.indiceActual = 0; 
        }

        if (this.horas[this.indiceActual] === "Vísperas") {
            this.diaActualIndex++;
            if (this.diaActualIndex >= CalendarioSantoral.length) {
                console.log("%c ¡SE ACABÓ EL CALENDARIO SANTORAL! Han pasado más de 20 días en la Cruzada. Faltan más días por implementar en el código.", "color: #ffaa00; font-size: 16px; font-weight: bold; background: #000; padding: 5px;");
                this.diaActualIndex = CalendarioSantoral.length - 1; 
            }
        }
        
        this.actualizarHUD();
        this.notificarCambio(false);

        if (this.marchaIniciada) {
            let animCaja = document.getElementById("animacion-escena1");
            let formOverlay = document.getElementById("formacion-overlay");
            
            let enCinematica = (animCaja && animCaja.style.display !== "none" && animCaja.innerHTML !== "") || 
                               (formOverlay && formOverlay.style.display !== "none");
            
            if (enCinematica) {
                this.rezoPendiente = true;
                this.retrasoPorBatalla = true;
            } else {
                this.rezoPendiente = false;
                this.retrasoPorBatalla = false;
                this.invocarRezo(this.horas[this.indiceActual], false);
            }
        }
    },

    actualizarHUD: function() {
        let relojElemento = document.getElementById("stat-tiempo");
        if (relojElemento) {
            if (this.indiceActual === -1) {
                relojElemento.innerText = "----";
            } else {
                relojElemento.innerText = this.horas[this.indiceActual];
            }
        }
        this.actualizarTooltip();
    },
    
    actualizarTooltip: function() {
        const tooltip = document.getElementById("tiempo-tooltip");
        if(tooltip) {
            if(this.indiceActual === -1) {
                tooltip.innerHTML = `<b class='txt-sagrado'>Reloj Divino</b><hr style='border-color:#555; margin: 5px 0;'/><i>La marcha aún no ha comenzado. Aguardando el juramento.</i>`;
            } else {
                let horaStr = this.horas[this.indiceActual];
                let descStr = this.descripciones[this.indiceActual];
                let infoDia = this.obtenerFechaActual();
                tooltip.innerHTML = `<b class='txt-sagrado'>Hora de ${horaStr}</b><hr style='border-color:#555; margin: 5px 0;'/><i>${descStr}</i><br><br><span style='color:#a3d9a5; font-size:12px;'>📅 ${infoDia.fecha}<br>⛪ Fiesta de ${infoDia.santo}</span>`;
            }
        }
    },

    notificarCambio: function(esInicio = false) {
        let textElement = document.getElementById("stat-tiempo");
        if (!textElement) return;

        textElement.classList.remove("hora-tanendo");
        void textElement.offsetWidth; 
        textElement.classList.add("hora-tanendo");

        let horaActual = this.horas[this.indiceActual];

        if (typeof AudioManager !== 'undefined') {
            let archivoCampana = "";
            switch(horaActual) {
                case "Laudes": archivoCampana = "assets/audio/camp_laudes.mp3"; break;
                case "Prima": archivoCampana = "assets/audio/camp_prima.mp3"; break;
                case "Tercia": case "Nona": archivoCampana = "assets/audio/camp_tercia.mp3"; break;
                case "Sexta": archivoCampana = "assets/audio/camp_sexta.mp3"; break;
                case "Vísperas": archivoCampana = "assets/audio/camp_visperas.mp3"; break;
                case "Completas": archivoCampana = "assets/audio/camp_completas.mp3"; break;
            }
            if (archivoCampana) {
                AudioManager.playSFX(archivoCampana);
            }
        }

        if (typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<br><i class="txt-clerigo">Las campanas resuenan a lo lejos... La hueste entra en la hora de <b>${horaActual}</b>.</i><br>`);
        }

        setTimeout(() => {
            if(textElement.classList.contains("hora-tanendo")) {
                textElement.classList.remove("hora-tanendo");
            }
        }, 10000);
    },

    invocarRezo: async function(horaActual, huboRetraso) {
        let skipPopups = document.getElementById("ht-disable-popups")?.checked;
        if (skipPopups) return;

        this.pausar();

        const overlay = document.createElement("div");
        overlay.id = "fray-rezo-overlay"; 
        overlay.style.position = "fixed"; overlay.style.top = "0"; overlay.style.left = "0";
        overlay.style.width = "100vw"; overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
        overlay.style.zIndex = "2147483647"; 
        overlay.style.display = "flex"; overlay.style.justifyContent = "center"; overlay.style.alignItems = "center";
        document.body.appendChild(overlay);

        let dialogContainer = document.createElement("div");
        dialogContainer.style.width = "100%"; dialogContainer.style.maxWidth = "1000px";
        overlay.appendChild(dialogContainer);

        let nombreComandante = jugador.nombre !== "..." ? jugador.nombre : "Comendador";
        let rezo = this.oraciones[horaActual];
        let infoDia = this.obtenerFechaActual();

        let textoFrayInicial = `"¡Caray, la hora de <b>${horaActual}</b>! Si mis viejos oídos no me fallan... lo sé porque escuché las campanadas en la distancia."`;
        if (huboRetraso) {
            textoFrayInicial = `"Mi Señor... hace rato que las campanas anunciaron la hora de <b>${horaActual}</b> en esta bendita fiesta de ${infoDia.santo}, pero estaba esperando pacientemente a mi Comendador por si quería rezar conmigo."`;
        }

        await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
            personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray",
            texto: textoFrayInicial, claseTexto: "txt-clerigo"
        });
        dialogContainer.innerHTML = "";

        if (!huboRetraso) {
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
                personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray",
                texto: `"${nombreComandante}, ¿deseáis detener un instante la marcha para elevar nuestras plegarias al Altísimo por la gloria de ${infoDia.santo}?"`, claseTexto: "txt-clerigo"
            });
            dialogContainer.innerHTML = "";
        }

        let opcionSeleccionada = await new Promise((resolve) => {
            let box = document.createElement("div");
            box.className = "dialogo-pergamino borde-comandante"; box.style.cursor = "default";

            let retrato = document.createElement("img");
            retrato.className = "dialogo-retrato retrato-izq retrato-tribulacion"; retrato.src = "assets/img/personajes/aliados/jugador.webp"; box.appendChild(retrato);

            let nameTag = document.createElement("div");
            nameTag.className = "dialogo-nombre nombre-comandante"; nameTag.innerHTML = nombreComandante; box.appendChild(nameTag);

            let textContainer = document.createElement("div");
            textContainer.className = "dialogo-texto-container pad-izq";
            let textSpan = document.createElement("span");
            textSpan.className = "txt-comandante"; textSpan.style.fontSize = "20px"; textSpan.style.textAlign = "center"; textSpan.style.display = "block";
            textSpan.innerHTML = "¿Responderéis al llamado del Espíritu?";
            textContainer.appendChild(textSpan); box.appendChild(textContainer);

            let btnContainer = document.createElement("div");
            btnContainer.style.cssText = "position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); display: flex; gap: 15px; z-index: 25; width: max-content; max-width: 90%; justify-content: center;";
            box.appendChild(btnContainer);

            let btnSi = document.createElement("button");
            btnSi.className = "btn-siguiente-medieval"; btnSi.style.position = "relative"; btnSi.style.bottom = "auto"; btnSi.style.left = "auto"; btnSi.style.transform = "none";
            btnSi.innerText = `Adelante Fray, di la respectiva oración de ${horaActual}`;
            btnSi.onclick = () => resolve(true);

            let btnNo = document.createElement("button");
            btnNo.className = "btn-siguiente-medieval"; btnNo.style.position = "relative"; btnNo.style.bottom = "auto"; btnNo.style.left = "auto"; btnNo.style.transform = "none"; btnNo.style.background = "linear-gradient(to bottom, #4a1111, #220505)"; btnNo.style.borderColor = "#888";
            btnNo.innerText = "Será en otro momento, tengo cosas en la cabeza";
            btnNo.onclick = () => resolve(false);

            btnContainer.appendChild(btnSi); btnContainer.appendChild(btnNo); dialogContainer.appendChild(box);
        });
        dialogContainer.innerHTML = "";

        if (opcionSeleccionada) {
            GestorEstado.modificarFe(2); 
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"${rezo.v1}"`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: nombreComandante, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", retratoClase: "retrato-tribulacion", texto: `"${rezo.r1}"`, claseTexto: "txt-comandante" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"${rezo.v2}"`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: nombreComandante, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", retratoClase: "retrato-tribulacion", texto: `"${rezo.r2}"`, claseTexto: "txt-comandante" }); dialogContainer.innerHTML = "";
        } else {
            GestorEstado.modificarFe(-5);
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"(El monje baja la mirada con un suspiro piadoso) Comprendo, mi Señor. El peso del mando enmudece a veces el llamado de los cielos. Rezaré por vuestra alma en vuestro lugar..."`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"${rezo.v1} ${rezo.r1}"`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"${rezo.v2} ${rezo.r2}"`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
        }

        if (horaActual === "Vísperas") {
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
                personajeImg: "assets/img/personajes/aliados/fray.webp",
                nombrePersonaje: "Fray Bartolomé",
                alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray",
                retratoClase: "retrato-tribulacion retrato-tribulacion-fray",
                texto: `"Un nuevo día litúrgico comienza con el ocaso, compañía. Celebramos la fiesta de <b>${infoDia.santo}</b>. ¿Sabíais que ${infoDia.biografia}"`,
                claseTexto: "txt-clerigo"
            });
            dialogContainer.innerHTML = "";
        }

        document.body.removeChild(overlay);
        this.reanudar();
    }
};