/* === DIALOGOS.JS - SISTEMA DE NOVELA VISUAL === */

const SistemaDialogos = {
    velocidadEscritura: 35, 
    escribiendo: false,
    intervalo: null,
    callbackActual: null,

    mostrarEscenaAsync: function(opciones) {
        return new Promise((resolve) => {
            opciones.callback = (val) => resolve(val);
            this.iniciarEscena(opciones);
        });
    },

    iniciarEscena: function(opciones) {
        let { personajeImg, nombrePersonaje, texto, requiereInput, placeholderInput, textoErrorVacio, textoBoton, imgClase, callback } = opciones;

        let modoPlano = document.getElementById("ht-textos-planos");
        if (modoPlano && modoPlano.checked) {
            if (requiereInput) {
                let val = prompt((nombrePersonaje ? nombrePersonaje + ": " : "") + texto + "\n\n" + (placeholderInput || "Escribe aquí..."));
                while (!val || val.trim() === "") {
                    val = prompt((textoErrorVacio || "No puedes dejar esto vacío.") + "\n\n" + (placeholderInput || "Escribe aquí..."));
                }
                if (callback) callback(val.trim());
            } else {
                let storyArea = document.getElementById("story-area");
                if (storyArea) {
                    let p = document.createElement("p");
                    p.style.cssText = "margin-bottom: 10px; font-style: italic; color: #c0c0c0;";
                    if (nombrePersonaje) {
                        p.innerHTML = `<b style="color: #ffaa00; font-style: normal;">${nombrePersonaje}:</b> ${texto}`;
                    } else {
                        p.innerHTML = texto;
                    }
                    storyArea.appendChild(p);
                    storyArea.scrollTop = storyArea.scrollHeight;
                }
                if (callback) callback();
            }
            return; 
        }

        let overlay = document.getElementById("vn-overlay");
        let imgEl = document.getElementById("vn-character-img");
        let speakerEl = document.getElementById("vn-speaker-name");
        let textEl = document.getElementById("vn-text-content");
        let inputArea = document.getElementById("vn-input-area");
        let inputBox = document.getElementById("vn-input-box");
        let btnNext = document.getElementById("vn-btn-next");

        imgEl.src = personajeImg;
        imgEl.className = imgClase || ""; 
        speakerEl.innerText = nombrePersonaje;
        textEl.innerHTML = ""; 
        
        inputArea.style.display = "none";
        btnNext.style.display = "none";
        if(requiereInput) {
            inputBox.value = "";
            inputBox.style.borderColor = "#b8860b"; 
            inputBox.style.boxShadow = "inset 0 0 10px #000";
            inputBox.placeholder = placeholderInput || "Escribe aquí...";
        }

        this.callbackActual = callback;
        overlay.style.display = "flex";
        
        btnNext.onclick = () => {
            if(requiereInput) {
                let val = inputBox.value.trim();
                if(val === "") {
                    inputBox.style.borderColor = "#ff4c4c"; 
                    inputBox.style.boxShadow = "inset 0 0 15px rgba(255, 76, 76, 0.4)";
                    btnNext.style.display = "none"; 
                    textEl.innerHTML = ""; 
                    let txtError = textoErrorVacio || "¡Habla, no te quedes en silencio!";
                    
                    this.escribirTexto(txtError, textEl, () => {
                        btnNext.style.display = "block"; 
                        inputBox.focus();
                    });
                    return; 
                }
                this.cerrarEscena();
                if(this.callbackActual) this.callbackActual(val);
            } else {
                this.cerrarEscena();
                if(this.callbackActual) this.callbackActual();
            }
        };

        this.escribirTexto(texto, textEl, () => {
            if(requiereInput) {
                inputArea.style.display = "flex";
                btnNext.innerText = textoBoton || "ACEPTAR";
                inputBox.focus();
            } else {
                btnNext.innerText = textoBoton || "SIGUIENTE ⮞";
            }
            btnNext.style.display = "block";
        });
    },

    escribirTexto: function(texto, elemento, callbackFin) {
        this.escribiendo = true;
        let i = 0;
        clearInterval(this.intervalo);
        
        this.intervalo = setInterval(() => {
            elemento.innerHTML += texto.charAt(i);
            i++;
            if (i >= texto.length) {
                clearInterval(this.intervalo);
                this.escribiendo = false;
                if(callbackFin) callbackFin();
            }
        }, this.velocidadEscritura);
    },

    cerrarEscena: function() {
        clearInterval(this.intervalo);
        document.getElementById("vn-overlay").style.display = "none";
    }
};

/* === MOTOR DE DIÁLOGOS SECUENCIALES (EN EL PERGAMINO) === */
const MotorDialogos = {
    velocidadEscritura: 25, 

    mostrarDialogo: function(opciones) {
        return new Promise((resolve) => {
            let { personajeImg, nombrePersonaje, alineacion, bordeClase, nombreClase, retratoClase, texto, claseTexto } = opciones;
            let storyArea = document.getElementById("story-area");

            let modoPlano = document.getElementById("ht-textos-planos");
            if (modoPlano && modoPlano.checked) {
                let p = document.createElement("p");
                p.style.cssText = "margin-bottom: 10px; font-style: italic; color: #c0c0c0;";
                
                let colorNombre = "#4c88ff"; 
                if (bordeClase === "borde-enemigo") colorNombre = "#ff4c4c";
                else if (bordeClase === "borde-papa") colorNombre = "#ffccff";
                else if (bordeClase === "borde-comandante") colorNombre = "#ffd700";

                p.innerHTML = `<b style="color: ${colorNombre}; font-style: normal;">${nombrePersonaje}:</b> <span class="${claseTexto || ''}">${texto}</span>`;
                storyArea.appendChild(p);
                storyArea.scrollTop = storyArea.scrollHeight;
                
                setTimeout(() => resolve(), 10);
                return;
            }

            let box = document.createElement("div");
            box.className = "dialogo-pergamino " + (bordeClase || (alineacion === "izq" ? "borde-aliado" : "borde-enemigo"));

            if (personajeImg) {
                let retrato = document.createElement("img");
                retrato.className = "dialogo-retrato " + (alineacion === "izq" ? "retrato-izq" : "retrato-der") + (retratoClase ? " " + retratoClase : "");
                retrato.src = personajeImg;
                box.appendChild(retrato);
            }

            if (nombrePersonaje) {
                let nameTag = document.createElement("div");
                nameTag.className = "dialogo-nombre " + (nombreClase || (alineacion === "izq" ? "nombre-izq" : "nombre-der"));
                nameTag.innerHTML = nombrePersonaje;
                box.appendChild(nameTag);
            }

            let textContainer = document.createElement("div");
            let padClass = alineacion === "izq" ? "pad-izq" : (alineacion === "der" ? "pad-der" : "pad-centro");
            textContainer.className = "dialogo-texto-container " + padClass;
            
            let textSpan = document.createElement("span");
            if (claseTexto) textSpan.className = claseTexto;
            textContainer.appendChild(textSpan);
            box.appendChild(textContainer);

            let btnNext = document.createElement("button");
            btnNext.className = "btn-siguiente-medieval";
            btnNext.innerText = "SIGUIENTE ⮞";
            btnNext.style.display = "none";
            box.appendChild(btnNext);

            storyArea.appendChild(box);
            storyArea.scrollTop = storyArea.scrollHeight;

            let isTyping = true;

            box.onclick = () => {
                if (isTyping) {
                    isTyping = false;
                    textSpan.innerHTML = texto;
                    btnNext.style.display = "block";
                    storyArea.scrollTop = storyArea.scrollHeight;
                }
            };

            let contentArray = texto.split(/(<[^>]*>)/g);
            let currentChunkIndex = 0;
            let currentCharIndex = 0;

            let interval = setInterval(() => {
                if (!isTyping) {
                    clearInterval(interval);
                    return;
                }

                if (currentChunkIndex >= contentArray.length) {
                    clearInterval(interval);
                    isTyping = false;
                    btnNext.style.display = "block";
                    storyArea.scrollTop = storyArea.scrollHeight;
                    return;
                }

                let chunk = contentArray[currentChunkIndex];
                if (chunk.startsWith("<")) {
                    textSpan.innerHTML += chunk; 
                    currentChunkIndex++;
                } else {
                    if (currentCharIndex < chunk.length) {
                        textSpan.innerHTML += chunk.charAt(currentCharIndex);
                        currentCharIndex++;
                    } else {
                        currentCharIndex = 0;
                        currentChunkIndex++;
                    }
                }
                storyArea.scrollTop = storyArea.scrollHeight;
            }, this.velocidadEscritura);

            btnNext.onclick = (e) => {
                e.stopPropagation(); 
                btnNext.style.display = "none"; 
                resolve();
            };
        });
    },

    // FIX TÁCTICO: Se inyectó el motor de máquina de escribir también a los contenedores Modales
    mostrarDialogoEnContenedor: function(contenedor, opciones) {
        return new Promise((resolve) => {
            let { personajeImg, nombrePersonaje, alineacion, bordeClase, nombreClase, retratoClase, texto, claseTexto } = opciones;

            let modoPlano = document.getElementById("ht-textos-planos");
            if (modoPlano && modoPlano.checked) {
                let p = document.createElement("p");
                p.style.cssText = "margin-bottom: 10px; font-style: italic; color: #c0c0c0; text-align: left;";
                
                let colorNombre = "#4c88ff"; 
                if (bordeClase === "borde-enemigo") colorNombre = "#ff4c4c";
                else if (bordeClase === "borde-papa") colorNombre = "#ffccff";
                else if (bordeClase === "borde-comandante") colorNombre = "#ffd700";

                p.innerHTML = `<b style="color: ${colorNombre}; font-style: normal;">${nombrePersonaje}:</b> <span class="${claseTexto || ''}">${texto}</span>`;
                contenedor.appendChild(p);
                
                setTimeout(() => resolve(), 10);
                return;
            }

            let box = document.createElement("div");
            box.className = "dialogo-pergamino " + (bordeClase || (alineacion === "izq" ? "borde-aliado" : "borde-enemigo"));
            
            if (personajeImg) {
                let retrato = document.createElement("img");
                retrato.className = "dialogo-retrato " + (alineacion === "izq" ? "retrato-izq" : "retrato-der") + (retratoClase ? " " + retratoClase : "");
                retrato.src = personajeImg;
                box.appendChild(retrato);
            }

            if (nombrePersonaje) {
                let nameTag = document.createElement("div");
                nameTag.className = "dialogo-nombre " + (nombreClase || (alineacion === "izq" ? "nombre-izq" : "nombre-der"));
                nameTag.innerHTML = nombrePersonaje;
                box.appendChild(nameTag);
            }

            let textContainer = document.createElement("div");
            textContainer.className = "dialogo-texto-container " + (alineacion === "izq" ? "pad-izq" : "pad-der");
            
            let textSpan = document.createElement("span");
            if (claseTexto) textSpan.className = claseTexto;
            textContainer.appendChild(textSpan);
            box.appendChild(textContainer);

            let btnNext = document.createElement("button");
            btnNext.className = "btn-siguiente-medieval";
            btnNext.innerText = "SIGUIENTE ⮞";
            btnNext.style.display = "none";
            box.appendChild(btnNext);

            contenedor.appendChild(box);

            // Efecto de máquina de escribir adaptado al modal
            let isTyping = true;

            box.onclick = () => {
                if (isTyping) {
                    isTyping = false;
                    textSpan.innerHTML = texto;
                    btnNext.style.display = "block";
                    if(contenedor.parentNode) contenedor.parentNode.scrollTop = contenedor.parentNode.scrollHeight;
                }
            };

            let contentArray = texto.split(/(<[^>]*>)/g);
            let currentChunkIndex = 0;
            let currentCharIndex = 0;

            let interval = setInterval(() => {
                if (!isTyping) {
                    clearInterval(interval);
                    return;
                }

                if (currentChunkIndex >= contentArray.length) {
                    clearInterval(interval);
                    isTyping = false;
                    btnNext.style.display = "block";
                    if(contenedor.parentNode) contenedor.parentNode.scrollTop = contenedor.parentNode.scrollHeight;
                    return;
                }

                let chunk = contentArray[currentChunkIndex];
                if (chunk.startsWith("<")) {
                    textSpan.innerHTML += chunk; 
                    currentChunkIndex++;
                } else {
                    if (currentCharIndex < chunk.length) {
                        textSpan.innerHTML += chunk.charAt(currentCharIndex);
                        currentCharIndex++;
                    } else {
                        currentCharIndex = 0;
                        currentChunkIndex++;
                    }
                }
                if(contenedor.parentNode) contenedor.parentNode.scrollTop = contenedor.parentNode.scrollHeight;
            }, this.velocidadEscritura);

            btnNext.onclick = (e) => {
                e.stopPropagation();
                btnNext.style.display = "none";
                resolve();
            };
        });
    }
};