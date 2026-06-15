/* === CINEMATICAS.JS - DIRECTOR DE ESCENAS VISUALES (DRY REFACTOR) === */

window.DirectorCinematico = {
    obtenerCaja: function() {
        return document.getElementById("animacion-escena1");
    },

    prepararEscenario: function(titulo, fondoUrl, claseTitulo = "txt-sagrado") {
        const animCaja = this.obtenerCaja();
        if (!animCaja) return null;

        animCaja.style.display = "block";
        animCaja.style.backgroundImage = `url('${fondoUrl}')`;
        animCaja.style.backgroundSize = "160%";
        animCaja.style.backgroundPosition = "left center";
        
        let colorOverride = "";
        if (titulo === "EL RELEVO TÁCTICO" || titulo === "LA CARGA DIVINA") colorOverride = "color:#ffaa00;";
        
        animCaja.innerHTML = `<h3 class="${claseTitulo}" style="${colorOverride} text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">${titulo}</h3>`;

        let niebla = document.createElement("div");
        niebla.className = "efecto-neblina";
        animCaja.appendChild(niebla);

        return animCaja;
    },

    // HELPER UNIVERSAL: Limpia y asigna transiciones sin estorbar (Traído de Sacrificio)
    setTransition: function(element, transitionClass) {
        if (!element) return;
        let classesToRemove = [];
        Array.from(element.classList).forEach(c => {
            if (c.startsWith('sac-trans-') || c.startsWith('cine-trans-')) classesToRemove.push(c);
        });
        classesToRemove.forEach(c => element.classList.remove(c));
        if (transitionClass) element.classList.add(transitionClass);
    },

    // HELPER UNIVERSAL: Fábrica de globos de diálogo (Reemplaza a Lugarteniente y Requiem)
    lanzarGlobo: function(zonaBatalla, textoHTML, left, top, claseExtra = "") {
        let globo = document.createElement("div");
        globo.className = `in-board-requiem sac-globo-base sac-globo-opacity-0 ${claseExtra}`;
        globo.innerHTML = textoHTML;
        if(left) globo.style.left = left;
        if(top) globo.style.top = top;

        zonaBatalla.appendChild(globo);

        setTimeout(() => {
            globo.classList.remove("sac-globo-opacity-0");
            globo.classList.add("sac-globo-fade-in");
        }, 20);

        let isHovered = false;
        let removeTimer;

        let iniciarVuelo = () => {
            globo.classList.remove("sac-globo-fade-in");
            globo.classList.add("sac-globo-vuelo");
            let cTop = globo.style.top ? parseFloat(globo.style.top) : parseFloat(top || 20);
            globo.style.top = `${cTop - 15}%`; 
            
            removeTimer = setTimeout(() => {
                if (!isHovered && globo.parentNode) globo.parentNode.removeChild(globo);
            }, 4000);
        };

        globo.onmouseenter = () => {
            isHovered = true;
            clearTimeout(removeTimer);
            globo.classList.add("sac-globo-hover");
        };

        globo.onmouseleave = () => {
            isHovered = false;
            globo.classList.remove("sac-globo-hover");
            iniciarVuelo(); 
        };

        setTimeout(() => {
            if (!isHovered) iniciarVuelo();
        }, 3500); 
    },

    renderizarMarcadores: function(animCaja) {
        if (!window.marcadoresBatalla) return;
        
        window.marcadoresBatalla.forEach(m => {
            let mk = document.createElement("div");
            mk.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
            mk.style.position = "absolute";
            mk.style.fontSize = "35px";
            mk.style.color = m.tipo === 'cross' ? "#c0c0c0" : "#fff";
            mk.style.textShadow = m.tipo === 'cross' ? "0 0 10px #fff" : "none";
            mk.style.opacity = "0.5"; 
            mk.style.zIndex = "5"; 
            mk.style.pointerEvents = "none";
            
            if (m.slotPos && m.slotPos.startsWith('sacrificio-')) {
                let tops = { 1: 28, 2: 46, 3: 64 };
                mk.style.top = `${tops[parseInt(m.slotPos.split('-')[1])] || 46}%`;
                mk.style.left = `53%`; 
                animCaja.appendChild(mk);
            } else if (m.slotPos && m.slotPos.startsWith('pica-')) {
                let posicionesEscalonadas = { 1: { left: 45, top: 25 }, 2: { left: 53, top: 35 }, 3: { left: 45, top: 50 }, 4: { left: 53, top: 60 } };
                let pos = posicionesEscalonadas[parseInt(m.slotPos.split('-')[1])] || {left: 50, top: 50};
                mk.style.top = `${pos.top}%`; mk.style.left = `${pos.left}%`;
                animCaja.appendChild(mk);
            } else if (m.row !== undefined && m.col !== undefined) {
                let zonaBatalla = document.getElementById("zona-batalla-anim");
                let targetContainer = zonaBatalla ? zonaBatalla : animCaja;
                let topsPx = ["20px", "101px", "182px", "263px", "345px"]; 
                let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84 };
                
                mk.style.top = topsPx[m.row] || "182px"; 
                mk.style.left = `${cols[m.col]}%`;
                
                targetContainer.appendChild(mk);
            }
        });
    },

    crearTarjetaTropa: function(tropa) {
        let card = document.createElement("div");
        card.className = `tropa-cinematica ${tropa.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria'}`;
        if (typeof RenderCombate !== "undefined") {
            card.innerHTML = RenderCombate.htmlFichaCinematica(tropa);
        }
        return card;
    },

    crearEnemigosEstaticos: function(animCaja, startLeft = 62, animated = false) {
        let enemyCardsFront = [];
        let rowsTopEnemigos = ["28%", "46%", "64%"]; 
        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                cardE.style.top = rowsTopEnemigos[r];
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                animCaja.appendChild(cardE);

                if (animated) {
                    cardE.style.left = `${110 + (c * 10)}%`;
                    cardE.style.filter = "sepia(50%) brightness(0.6)"; 
                    cardE.style.transition = `left 8s linear, filter 8s linear`; 
                    cardE.getBoundingClientRect(); 
                    setTimeout(() => {
                        cardE.style.left = `${startLeft + (c * 10)}%`;
                        cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                    }, 50);
                } else {
                    cardE.style.left = `${startLeft + (c * 10)}%`;
                }

                if (c === 0) enemyCardsFront.push({ el: cardE, numSlot: r + 1 });
            }
        }
        return enemyCardsFront;
    },

    crearBotonContinuar: function(animCaja, textoBtn, delay, callbackFinal, btnStyle = {}, extraClasses = "") {
        setTimeout(() => {
            if (!animCaja || !animCaja.parentNode) return;
            let impactBtn = document.createElement('button');
            impactBtn.className = `impacto-divino-btn ${extraClasses}`; 
            impactBtn.innerText = textoBtn;
            impactBtn.style.bottom = "10px";
            
            if(btnStyle.background) impactBtn.style.background = btnStyle.background;
            if(btnStyle.borderColor) impactBtn.style.borderColor = btnStyle.borderColor;
            
            impactBtn.onclick = function() {
                if(animCaja.dataset.blinkInterval) {
                    clearInterval(animCaja.dataset.blinkInterval);
                    delete animCaja.dataset.blinkInterval;
                }
                impactBtn.style.display = "none"; 
                
                if (animCaja.classList.contains("sac-escenario-activo")) {
                    animCaja.classList.remove("sac-escenario-activo");
                    animCaja.classList.add("sac-escenario-reset");
                } else {
                    animCaja.style.display = "none";
                    animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
                    animCaja.style.backgroundSize = "cover";
                    animCaja.style.backgroundPosition = "center bottom";
                }
                animCaja.innerHTML = "";
                if(callbackFinal) callbackFinal(); 
            };
            animCaja.appendChild(impactBtn);
        }, delay);
    },

    limpiarHigieneVisual: function() {
        let ids = ["formacion-roster", "formacion-tablero", "formacion-picas-tablero", "btn-iniciar-formacion", "btn-iniciar-formacion-picas", "label-turnos-picas"];
        ids.forEach(id => { let el = document.getElementById(id); if(el) el.style.display = "none"; });
        let t = document.getElementById("titulo-formacion"); if(t) t.innerText = "";
    },

    crearClonAnimado: function(tropa, box, colorSombra = "transparent") {
        let clone = document.createElement("div");
        let claseBorde = tropa.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        
        clone.className = `soldier-frame tropa-draggable ${claseBorde} caballero-ocupando`;
        clone.innerHTML = typeof RenderCombate !== "undefined" ? RenderCombate.htmlFichaTropaInner(tropa) : "";

        clone.style.setProperty("position", "fixed", "important");
        
        clone.style.setProperty("width", "75px", "important");
        clone.style.setProperty("height", "75px", "important");
        
        let topSeguro = (box && box.top !== undefined) ? box.top : window.innerHeight / 2;
        let leftSeguro = (box && box.left !== undefined) ? box.left : window.innerWidth / 2;

        if (typeof logTraza !== "undefined") logTraza(`[DIRECTOR] Clon Invocado: ${tropa.nombre} en TOP ${topSeguro.toFixed(1)}, LEFT ${leftSeguro.toFixed(1)}`);

        clone.style.setProperty("top", topSeguro + "px", "important");
        clone.style.setProperty("left", leftSeguro + "px", "important");
        clone.style.setProperty("margin", "0", "important");
        clone.style.setProperty("z-index", "9999", "important");
        clone.style.setProperty("background-color", "rgba(0,0,0,0.8)", "important");
        
        if (colorSombra !== "transparent") {
            clone.style.setProperty("box-shadow", `0 0 25px ${colorSombra}`, "important"); 
        }
        
        let img = clone.querySelector('img');
        if(img) img.style.setProperty("transform", "scaleX(-1)", "important");
        
        document.body.appendChild(clone);
        return clone;
    },

    animarTrasladoFase1: function(dataLeaving, dataStaying, tiempoViajeMs, sombraLeaving, callbackFinal) {
        if (typeof logTraza !== "undefined") logTraza("--> [DIRECTOR] Iniciando Traslado Fase 1 (Vanguardia)");
        let clonesStaying = [];

        dataLeaving.forEach(item => { 
            if (item.startBox && item.targetBox) {
                item.clone = this.crearClonAnimado(item.tropa, item.startBox, sombraLeaving); 
            }
        });
        
        dataStaying.forEach(item => { 
            if (item.startBox && item.targetBox) {
                let c = this.crearClonAnimado(item.tropa, item.startBox);
                clonesStaying.push({ clone: c, tropa: item.tropa, targetBox: item.targetBox, targetId: item.targetId });
            }
        });

        requestAnimationFrame(() => {
            setTimeout(() => {
                let transitionSecs = (tiempoViajeMs / 1000).toFixed(1);
                dataLeaving.forEach(item => {
                    if (item.clone && item.targetBox) {
                        item.clone.style.setProperty("transition", `top ${transitionSecs}s ease-in-out, left ${transitionSecs}s ease-in-out`, "important");
                        let targetTop = item.targetBox.top !== undefined ? item.targetBox.top : window.innerHeight / 2;
                        let targetLeft = item.targetBox.left !== undefined ? item.targetBox.left : window.innerWidth / 2;
                        item.clone.style.setProperty("top", targetTop + "px", "important");
                        item.clone.style.setProperty("left", targetLeft + "px", "important");
                    }
                });
            }, 50);
        });

        setTimeout(() => {
            dataLeaving.forEach(item => {
                let el = document.querySelector("#formacion-tablero #" + item.targetId);
                if (el) { 
                    el.style.setProperty("transition", "opacity 0.3s ease", "important"); 
                    el.style.setProperty("opacity", "1", "important"); 
                }
                if (item.clone) item.clone.remove();
            });
            
            if (callbackFinal) callbackFinal(clonesStaying);
        }, tiempoViajeMs + 100); 
    },

    animarTrasladoFase2: function(clonesStaying, tiempoViajeMs, sombraStaying, callbackFinal) {
        if (typeof logTraza !== "undefined") logTraza("--> [DIRECTOR] Iniciando Traslado Fase 2 (Reagrupamiento)");

        let finishCinematica = () => {
            let overlay = document.getElementById("formacion-overlay");
            if (!overlay) {
                if (callbackFinal) callbackFinal();
                return;
            }

            let btnNativo = document.getElementById("btn-iniciar-formacion");
            if (btnNativo) {
                let onclickOriginal = btnNativo.onclick;
                
                btnNativo.innerText = "⚔️ RETORNAR AL COMBATE ⚔️";
                btnNativo.style.display = "inline-block";
                
                btnNativo.onclick = () => {
                    btnNativo.style.display = "none";
                    btnNativo.onclick = onclickOriginal;
                    
                    clonesStaying.forEach(item => {
                        let el = document.querySelector("#formacion-tablero #" + item.targetId);
                        if (el) { 
                            el.style.setProperty("transition", "opacity 0.3s ease", "important"); 
                            el.style.setProperty("opacity", "1", "important"); 
                        }
                        if (item.clone) item.clone.remove();
                    });
                    if (callbackFinal) callbackFinal();
                };
            } else {
                clonesStaying.forEach(item => { if (item.clone) item.clone.remove(); });
                if (callbackFinal) callbackFinal();
            }
        };

        if (!clonesStaying || clonesStaying.length === 0) {
            finishCinematica();
            return;
        }

        requestAnimationFrame(() => {
            setTimeout(() => {
                let transitionSecs = (tiempoViajeMs / 1000).toFixed(1);
                clonesStaying.forEach(item => {
                    if (item.clone && item.targetBox) {
                        item.clone.style.setProperty("box-shadow", `0 0 10px ${sombraStaying}`, "important"); 
                        item.clone.style.setProperty("transition", `top ${transitionSecs}s ease-in-out, left ${transitionSecs}s ease-in-out`, "important");
                        let targetTop = item.targetBox.top !== undefined ? item.targetBox.top : window.innerHeight / 2;
                        let targetLeft = item.targetBox.left !== undefined ? item.targetBox.left : window.innerWidth / 2;
                        item.clone.style.setProperty("top", targetTop + "px", "important");
                        item.clone.style.setProperty("left", targetLeft + "px", "important");
                    }
                });
            }, 50);
        });

        setTimeout(finishCinematica, tiempoViajeMs + 100);
    }
};