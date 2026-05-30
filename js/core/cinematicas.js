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
                let tops = [15, 32, 50, 68, 85];
                let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84 };
                mk.style.top = `${tops[m.row]}%`; mk.style.left = `${cols[m.col]}%`;
                animCaja.appendChild(mk);
            }
        });
    },

    crearTarjetaTropa: function(tropa) {
        let card = document.createElement("div");
        card.className = `tropa-cinematica ${tropa.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria'}`;
        // Llama de forma segura al motor central de combate que globalizamos antes
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

    crearBotonContinuar: function(animCaja, textoBtn, delay, callbackFinal, btnStyle = {}) {
        setTimeout(() => {
            let impactBtn = document.createElement('button');
            impactBtn.className = "impacto-divino-btn"; 
            impactBtn.innerText = textoBtn;
            impactBtn.style.bottom = "5px";
            
            if(btnStyle.background) impactBtn.style.background = btnStyle.background;
            if(btnStyle.borderColor) impactBtn.style.borderColor = btnStyle.borderColor;
            
            impactBtn.onclick = function() {
                if(animCaja.dataset.blinkInterval) {
                    clearInterval(animCaja.dataset.blinkInterval);
                    delete animCaja.dataset.blinkInterval;
                }
                impactBtn.style.display = "none"; 
                animCaja.style.display = "none";
                animCaja.innerHTML = "";
                animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
                animCaja.style.backgroundSize = "cover";
                animCaja.style.backgroundPosition = "center bottom";
                if(callbackFinal) callbackFinal(); 
            };
            animCaja.appendChild(impactBtn);
        }, delay);
    },

    limpiarHigieneVisual: function() {
        let ids = ["formacion-roster", "formacion-tablero", "formacion-picas-tablero", "btn-iniciar-formacion", "btn-iniciar-formacion-picas", "label-turnos-picas"];
        ids.forEach(id => { let el = document.getElementById(id); if(el) el.style.display = "none"; });
        let t = document.getElementById("titulo-formacion"); if(t) t.innerText = "";
    }
};