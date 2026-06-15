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
        
        timeContainer.onclick = () => {
            if (window.RelojDivino) window.RelojDivino.abrirSantoralDetallado();
        };
    }
    
    setInterval(() => {
        let overlayTienda = document.getElementById("tienda-overlay");
        let isTiendaClosed = !overlayTienda || window.getComputedStyle(overlayTienda).display === "none";
        let hasTropas = typeof jugador !== "undefined" && jugador.tropas && jugador.tropas.length > 0;
        let isReclutando = typeof faseReclutamientoInicial !== "undefined" ? faseReclutamientoInicial : false;
        
        if (window.RelojDivino && window.RelojDivino.indiceActual === -1 && isTiendaClosed && hasTropas && !isReclutando) {
            window.RelojDivino.marchaIniciada = true;
            window.RelojDivino.iniciar();
        }
    }, 1000);

    document.addEventListener("click", (e) => {
        if (window.RelojDivino && window.RelojDivino.rezoPendiente && !window.RelojDivino.timerRezoIniciado) {
            setTimeout(() => {
                let animCaja = document.getElementById("animacion-escena1");
                let formOverlay = document.getElementById("formacion-overlay");
                
                // FIX TÁCTICO: Usar getComputedStyle para evitar el bug del Fray fantasma
                let animDisp = animCaja ? window.getComputedStyle(animCaja).display : "none";
                let formDisp = formOverlay ? window.getComputedStyle(formOverlay).display : "none";
                
                let enCinematica = (animDisp !== "none" && animCaja.innerHTML !== "") || (formDisp !== "none");
                
                if (!enCinematica) {
                    window.RelojDivino.timerRezoIniciado = true;
                    setTimeout(() => {
                        let animNow = document.getElementById("animacion-escena1");
                        let formNow = document.getElementById("formacion-overlay");
                        
                        let animDispNow = animNow ? window.getComputedStyle(animNow).display : "none";
                        let formDispNow = formNow ? window.getComputedStyle(formNow).display : "none";
                        
                        let ocupadaNow = (animDispNow !== "none" && animNow.innerHTML !== "") || (formDispNow !== "none");

                        if (!ocupadaNow && window.RelojDivino.rezoPendiente) {
                            window.RelojDivino.rezoPendiente = false;
                            window.RelojDivino.timerRezoIniciado = false;
                            window.RelojDivino.invocarRezo(window.RelojDivino.horas[window.RelojDivino.indiceActual], true);
                        } else {
                            window.RelojDivino.timerRezoIniciado = false;
                        }
                    }, 3000); 
                }
            }, 150);
        }
    });
});

window.RelojDivino = {
    horas: ["Laudes", "Prima", "Tercia", "Sexta", "Nona", "Vísperas", "Completas"],
    diaActualIndex: 0,
    
    descripciones: typeof DescripcionesHoras !== "undefined" ? DescripcionesHoras : [],
    oraciones: typeof OracionesCanonicas !== "undefined" ? OracionesCanonicas : {},

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
        if(typeof CalendarioSantoral !== "undefined") {
            if(index >= CalendarioSantoral.length) index = CalendarioSantoral.length - 1;
            return CalendarioSantoral[index];
        }
        return { fecha: "Día Desconocido", santo: "Todos los Santos", biografia: "..." };
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
            if (typeof CalendarioSantoral !== "undefined" && this.diaActualIndex >= CalendarioSantoral.length) {
                console.log("%c ¡SE ACABÓ EL CALENDARIO SANTORAL! Han pasado más de 20 días en la Cruzada. Faltan más días por implementar en el código.", "color: #ffaa00; font-size: 16px; font-weight: bold; background: #000; padding: 5px;");
                this.diaActualIndex = CalendarioSantoral.length - 1; 
            }
        }
        
        this.actualizarHUD();
        this.notificarCambio(false);

        if (this.marchaIniciada) {
            let animCaja = document.getElementById("animacion-escena1");
            let formOverlay = document.getElementById("formacion-overlay");
            
            // FIX TÁCTICO: Blindaje getComputedStyle para detectar pantallas ocultas con certeza absoluta
            let animDisp = animCaja ? window.getComputedStyle(animCaja).display : "none";
            let formDisp = formOverlay ? window.getComputedStyle(formOverlay).display : "none";
            
            let enCinematica = (animDisp !== "none" && animCaja.innerHTML !== "") || (formDisp !== "none");
            
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

        if (typeof Cronicas !== 'undefined') {
            Cronicas.registrar("NUEVA_HORA", { esInicio: esInicio });
        }

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

        let msgPodridos = {};

        if (typeof jugador !== "undefined" && jugador.inventario && Array.isArray(jugador.inventario)) {
            for (let i = 0; i < jugador.inventario.length; i++) {
                let item = jugador.inventario[i];
                if (!item) continue;
                
                if (typeof item === 'object') {
                    let diasPasados = this.diaActualIndex - (item.diaCompra || 0);
                    let horasPasadas = this.indiceActual - (item.horaCompra || 0);
                    
                    let horasTotalesTranscurridas = (diasPasados * 7) + horasPasadas;
                    if (horasTotalesTranscurridas < 0) horasTotalesTranscurridas = 0;
                    
                    item.edad = horasTotalesTranscurridas; 

                    let itemData = typeof bdObjetos !== "undefined" ? bdObjetos[item.id] : null;
                    if (itemData && typeof itemData.onPasoDelTiempo === "function") {
                        let resultadoTiempo = itemData.onPasoDelTiempo(item);
                        if (resultadoTiempo) {
                            if (!msgPodridos[resultadoTiempo]) msgPodridos[resultadoTiempo] = 0;
                            msgPodridos[resultadoTiempo]++;
                        }
                    }
                }
            }
        }
        
        if (msgPodridos["pudrio_pan"] > 0 && typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<div class="mensaje-combate" style="border: 1px dashed #ff4c4c; padding: 10px; margin: 10px 0; border-radius: 5px;"><b>¡EL PAN SE PUDRE!</b><br>Las inclemencias del tiempo han echado a perder <span class="txt-hereje">${msgPodridos["pudrio_pan"]} panes</span> en el morral. Sus hongos podrían ser letales.</div>`, "", true);
        }
        if (msgPodridos["agrio_cerveza"] > 0 && typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<div class="mensaje-combate" style="border: 1px dashed #4c88ff; padding: 10px; margin: 10px 0; border-radius: 5px;"><b>¡LA CERVEZA SE HA AGRIADO!</b><br>El sol implacable ha arruinado <span class="txt-hereje">${msgPodridos["agrio_cerveza"]} barriles</span> en el morral. El líquido ahora es un vinagre insalubre.</div>`, "", true);
        }

        if (!esInicio && (msgPodridos["pudrio_pan"] > 0 || msgPodridos["agrio_cerveza"] > 0)) {
            if (typeof Cronicas !== 'undefined') {
                Cronicas.registrar("LOGISTICA_PUTREFACCION", {
                    panes: msgPodridos["pudrio_pan"] || 0,
                    cervezas: msgPodridos["agrio_cerveza"] || 0
                });
            }
        }

        // =========================================================================
        // LÓGICA DE INANICIÓN (Hambre en Tercia y Vísperas)
        // =========================================================================
        let comandanteMuerto = false;
        let htSinHambre = document.getElementById("ht-sin-hambre")?.checked; 

        if (typeof jugador !== "undefined" && !htSinHambre && (horaActual === "Tercia" || horaActual === "Vísperas")) {
            let hambreAumentada = false;
            let muertesInanicion = [];
            let desmayosInanicion = []; 
            let alertDelayHambre = 0;
            
            let listas = [jugador.tropas, jugador.comandantes];
            listas.forEach(lista => {
                if (lista && lista.length > 0) {
                    for (let i = lista.length - 1; i >= 0; i--) {
                        let t = lista[i];
                        if (t.hp > 0) {
                            if (t.saltoHambre) {
                                t.saltoHambre = false;
                            } else {
                                if (!t.hambreInamovible) {
                                    if (t.hambre === undefined) t.hambre = 5;
                                    t.hambre--;
                                    hambreAumentada = true;
                                    
                                    // TÁCTICA: Alerta individual de Desmayo
                                    if (t.hambre === 0) {
                                        desmayosInanicion.push(t.nombre);
                                        if (typeof window.mostrarNotificacionFlotante === 'function') {
                                            setTimeout(() => {
                                                window.mostrarNotificacionFlotante(`⚠️ ¡El hermano <b>${t.nombre}</b> se ha desmayado por hambre!`);
                                            }, alertDelayHambre);
                                            alertDelayHambre += 600; // Escalonamiento de alertas
                                        }
                                    }

                                    if (t.hambre <= -2) {
                                        let globalInmortal = document.getElementById("ht-sin-vidas-perdidas")?.checked;
                                        if (!t.hpInamovible && !globalInmortal) {
                                            t.hp = 0;
                                            t.lugarMuerte = "por inanición severa";
                                            if (typeof jugador.cementerio === 'undefined') jugador.cementerio = [];
                                            jugador.cementerio.push(t);
                                            
                                            muertesInanicion.push({ nombre: t.nombre, tipo: t.tipoGeneral, clase: t.clase });
                                            
                                            if (t.idUnico === "cmd_player") comandanteMuerto = true;
                                            lista.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            if (hambreAumentada && typeof agregarTexto === 'function' && !esInicio) {
                agregarTexto(`<i class="txt-hereje">El estómago de la hueste ruge... Exigen provisiones.</i>`, "", true);
            }

            if (desmayosInanicion.length > 0 && typeof agregarTexto === 'function' && !esInicio) {
                agregarTexto(`<div class="mensaje-combate" style="border: 1px dashed #ffaa00; padding: 10px; margin: 10px 0; border-radius: 5px; color: #ffaa00;"><b>¡HOMBRES DESMAYADOS!</b><br>Las siguientes tropas han colapsado por hambre extrema y no podrán luchar: <span class="txt-sagrado">${desmayosInanicion.join(", ")}</span>.</div>`, "", true);
            }
            
            if (muertesInanicion.length > 0 && typeof agregarTexto === 'function' && !esInicio) {
                agregarTexto(`<div class="mensaje-combate" style="border: 1px solid #ff4c4c; padding: 10px; margin: 10px 0; border-radius: 5px;"><b>¡TRAGEDIA EN EL CAMPAMENTO!</b><br>Han perecido por inanición: <span class="txt-hereje">${muertesInanicion.map(m=>m.nombre).join(", ")}</span>. La falta de raciones los ha llevado a la tumba.</div>`, "", true);
                if (typeof GestorEstado !== "undefined") GestorEstado.modificarFe(-10, "bajas por hambruna");
                
                if (typeof Cronicas !== 'undefined') {
                    Cronicas.registrar("LOGISTICA_INANICION", { caidos: muertesInanicion });
                }
            }
        }

        // =========================================================================
        // LÓGICA DE DESHIDRATACIÓN (Sed Diaria Personalizada)
        // =========================================================================
        let sedAumentada = false;
        let muertesDeshidratacion = [];
        let desmayosDeshidratacion = [];
        let alertDelaySed = 0;
        let htSinSed = document.getElementById("ht-sin-sed")?.checked; 

        if (typeof jugador !== "undefined" && !htSinSed) {
            let listasSed = [jugador.tropas, jugador.comandantes];
            listasSed.forEach(lista => {
                if (lista && lista.length > 0) {
                    for (let i = lista.length - 1; i >= 0; i--) {
                        let t = lista[i];
                        if (t.hp > 0) {
                            let inicioRelativo = t.inicioSed !== undefined ? t.inicioSed : 0;
                            let horasDesdeInicio = (this.diaActualIndex * 7 + this.indiceActual) - inicioRelativo;
                            
                            if (horasDesdeInicio > 0 && horasDesdeInicio % 7 === 0) {
                                if (!t.sedInamovible) {
                                    if (t.sed === undefined) t.sed = 3;
                                    t.sed--;
                                    sedAumentada = true;

                                    // TÁCTICA: Alerta individual de Desmayo
                                    if (t.sed === 0) {
                                        desmayosDeshidratacion.push(t.nombre);
                                        if (typeof window.mostrarNotificacionFlotante === 'function') {
                                            setTimeout(() => {
                                                window.mostrarNotificacionFlotante(`⚠️ ¡El hermano <b>${t.nombre}</b> se ha desmayado por deshidratación!`);
                                            }, alertDelaySed);
                                            alertDelaySed += 600; // Escalonamiento de alertas
                                        }
                                    }

                                    if (t.sed <= -1) {
                                        let globalInmortal = document.getElementById("ht-sin-vidas-perdidas")?.checked;
                                        if (!t.hpInamovible && !globalInmortal) {
                                            t.hp = 0;
                                            t.lugarMuerte = "por deshidratación severa";
                                            if (typeof jugador.cementerio === 'undefined') jugador.cementerio = [];
                                            jugador.cementerio.push(t);
                                            
                                            muertesDeshidratacion.push({ nombre: t.nombre, tipo: t.tipoGeneral, clase: t.clase });
                                            
                                            if (t.idUnico === "cmd_player") comandanteMuerto = true;
                                            lista.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        if (sedAumentada && typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<i class="txt-hereje" style="color:#4c88ff;">El sofocante calor seca los gaznates... La hueste exige agua o cerveza.</i>`, "", true);
        }

        if (desmayosDeshidratacion.length > 0 && typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<div class="mensaje-combate" style="border: 1px dashed #4c88ff; padding: 10px; margin: 10px 0; border-radius: 5px; color: #4c88ff;"><b>¡HOMBRES DESMAYADOS!</b><br>Las siguientes tropas han colapsado por deshidratación extrema y no podrán luchar: <span class="txt-sagrado">${desmayosDeshidratacion.join(", ")}</span>.</div>`, "", true);
        }
        
        if (muertesDeshidratacion.length > 0 && typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<div class="mensaje-combate" style="border: 1px solid #4c88ff; padding: 10px; margin: 10px 0; border-radius: 5px;"><b>¡TRAGEDIA EN LA MARCHA!</b><br>Han perecido de sed: <span class="txt-hereje">${muertesDeshidratacion.map(m=>m.nombre).join(", ")}</span>. Sus lenguas se hincharon y cayeron muertos al polvo.</div>`, "", true);
            if (typeof GestorEstado !== "undefined") GestorEstado.modificarFe(-10, "bajas por deshidratación");

            if (typeof Cronicas !== 'undefined') {
                Cronicas.registrar("LOGISTICA_DESHIDRATACION", { caidos: muertesDeshidratacion });
            }
        }

        if (comandanteMuerto && typeof agregarTexto === 'function' && !esInicio) {
            agregarTexto(`<div class="mensaje-combate" style="border: 3px double #ff0000; padding: 20px; font-size: 20px; text-align: center; margin: 20px 0; background: #1a0000;"><b>EL COMANDANTE HA MUERTO.</b><br>Tus ojos se cerraron por la miseria de tu propia gestión logística. La cruzada continuará sin ti... si es que pueden.</div>`, "", true);
        }

        setTimeout(() => {
            if(textElement.classList.contains("hora-tanendo")) {
                textElement.classList.remove("hora-tanendo");
            }
        }, 10000);
    },

    abrirSantoralDetallado: function() {
        if (this.indiceActual === -1) return; 
        
        let overlay = document.getElementById("santoral-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "santoral-overlay";
            overlay.className = "modal-overlay";
            overlay.style.cssText = "display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:rgba(0,0,0,0.85); z-index:2600; justify-content:center; align-items:center;";
            
            let box = document.createElement("div");
            box.id = "santoral-box";
            box.style.cssText = "background-color:#1a1a1a; border:2px solid #a3d9a5; padding:30px; width:600px; max-width:90%; position:relative; text-align:center; border-radius:5px; color:#d4c4a8; font-family:'Georgia', serif; box-shadow:0 0 40px rgba(163, 217, 165, 0.3);";
            
            let closeBtn = document.createElement("span");
            closeBtn.className = "close-btn";
            closeBtn.innerHTML = "✖";
            closeBtn.style.cssText = "position:absolute; top:15px; right:20px; cursor:pointer; font-size:22px; color:#555; transition:0.3s;";
            closeBtn.onmouseover = () => { closeBtn.style.color = "#ff4c4c"; };
            closeBtn.onmouseout = () => { closeBtn.style.color = "#555"; };
            closeBtn.onclick = () => { overlay.style.display = "none"; };
            
            let titulo = document.createElement("h3");
            titulo.id = "santoral-titulo";
            titulo.style.cssText = "color:#a3d9a5; border-bottom:1px solid #555; padding-bottom:10px; margin-top:0; font-family:'Cinzel', serif;";
            
            let contenido = document.createElement("div");
            contenido.id = "santoral-contenido";
            contenido.style.cssText = "margin:20px 0; font-size:18px; line-height:1.6;";
            
            box.appendChild(closeBtn);
            box.appendChild(titulo);
            box.appendChild(contenido);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }

        let infoDia = this.obtenerFechaActual();
        document.getElementById("santoral-titulo").innerHTML = `⛪ Fiesta de ${infoDia.santo}`;
        
        let htmlLore = `
            <div style="color:#aaa; font-style:italic; margin-bottom:15px;">${infoDia.fecha} - En la hora de ${this.horas[this.indiceActual]}</div>
            <div style="background:#111; padding:20px; border:1px inset #333; border-radius:5px;">
                <img src="assets/img/personajes/aliados/fray.webp" style="width:100px; border-radius:5px; border:1px solid #ffd700; margin-bottom:15px; box-shadow:0 5px 15px rgba(0,0,0,0.8);">
                <div style="color:#a3d9a5; font-style:italic;">"¿Sabíais, Comendador, que en este día se conmemora cuando ${infoDia.biografia}"</div>
            </div>
        `;
        document.getElementById("santoral-contenido").innerHTML = htmlLore;
        
        overlay.style.display = "flex";
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

        let nombreComandante = (typeof jugador !== "undefined" && jugador.nombre !== "...") ? jugador.nombre : "Comendador";
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
            if (typeof GestorEstado !== "undefined") GestorEstado.modificarFe(2); 
            if (typeof Cronicas !== "undefined") { Cronicas.registrar("REZO", { rezo: true, hora: horaActual }); }

            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"${rezo.v1}"`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: nombreComandante, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", retratoClase: "retrato-tribulacion", texto: `"${rezo.r1}"`, claseTexto: "txt-comandante" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: `"${rezo.v2}"`, claseTexto: "txt-clerigo" }); dialogContainer.innerHTML = "";
            await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: nombreComandante, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", retratoClase: "retrato-tribulacion", texto: `"${rezo.r2}"`, claseTexto: "txt-comandante" }); dialogContainer.innerHTML = "";
        } else {
            if (typeof GestorEstado !== "undefined") GestorEstado.modificarFe(-5);
            if (typeof Cronicas !== "undefined") { Cronicas.registrar("REZO", { rezo: false, hora: horaActual }); }

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