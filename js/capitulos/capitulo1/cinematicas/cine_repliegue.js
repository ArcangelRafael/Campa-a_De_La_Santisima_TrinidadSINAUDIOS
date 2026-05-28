/* === CINE_REPLIEGUE.JS - CINEMÁTICA DE LA RETIRADA DE PICAS === */

// SISTEMA GLOBAL DE CLIMA Y AUDIO AMBIENTAL
window.Clima = {
    audioViento: null,
    audioVientoRayo: null,
    audioLluvia: null,
    
    // Nivel 1: Viento seco (Para el inicio del asedio)
    iniciarViento: function() {
        this.detenerTodo(); 
        if (!this.audioViento) {
            this.audioViento = new Audio("assets/audio/amb_wind.mp3");
            this.audioViento.loop = true;
            this.audioViento.volume = 0.5; 
        }
        this.audioViento.play().catch(e => console.log("Audio bloqueado."));
    },
    
    // Nivel 2: Viento + Truenos (Al quebrar la línea con la cuña)
    iniciarVientoRayo: function() {
        this.detenerTodo();
        if (!this.audioVientoRayo) {
            this.audioVientoRayo = new Audio("assets/audio/amb_windlightning.mp3");
            this.audioVientoRayo.loop = true;
            this.audioVientoRayo.volume = 0.6;
        }
        this.audioVientoRayo.play().catch(e => console.log("Audio bloqueado."));
    },

    // Nivel 3: Tormenta Total Visual y Auditiva (Alabado sea el Señor)
    iniciarLluvia: function() {
        this.detenerTodo();
        
        let capa = document.getElementById("capa-clima");
        if (!capa) {
            capa = document.createElement("div");
            capa.id = "capa-clima";
            capa.className = "rain";
            document.body.appendChild(capa);
        }
        capa.style.display = "block"; 
        
        if (!this.audioLluvia) {
            this.audioLluvia = new Audio("assets/audio/amb_rain.mp3");
            this.audioLluvia.loop = true;
            this.audioLluvia.volume = 0.6; 
        }
        this.audioLluvia.play().catch(e => console.log("Audio bloqueado."));
    },

    // Botón de pánico para limpiar todo el ambiente (Para el Interludium)
    detenerTodo: function() {
        let capa = document.getElementById("capa-clima");
        if (capa) capa.style.display = "none";
        
        if (this.audioViento) { this.audioViento.pause(); this.audioViento.currentTime = 0; }
        if (this.audioVientoRayo) { this.audioVientoRayo.pause(); this.audioVientoRayo.currentTime = 0; }
        if (this.audioLluvia) { this.audioLluvia.pause(); this.audioLluvia.currentTime = 0; }
    }
};

function playModalAlivioPicas() {
    return new Promise((resolve) => {
        let huidos = Math.floor(Math.random() * 3) + 2; 
        jugador.enemigosAsesinados = (jugador.enemigosAsesinados || 0) + huidos;

        let overlayAlivio = document.createElement("div"); 
        overlayAlivio.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:2000; display:flex; justify-content:center; align-items:center;";
        
        let autoCombat = document.getElementById("ht-auto-combat")?.checked;
        let pending = document.querySelectorAll('.pendiente-dados').length > 0;
        if (!autoCombat && pending) {
            overlayAlivio.style.display = "none";
            overlayAlivio.classList.add("victoria-oculta");
        }
        
        let modal = document.createElement("div"); 
        modal.style.cssText = "background:#111; border:2px solid #ffaa00; padding:30px; width:600px; max-height:80vh; overflow-y:auto; overflow-x:hidden; text-align:center; box-shadow: 0 0 30px rgba(255,170,0,0.3); border-radius:8px;";
        
        modal.innerHTML = `
            <div style="padding: 10px; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
                <h2 class="txt-sagrado" style='font-family:"Cinzel", serif; margin-top:0; margin-bottom:20px; position:relative; z-index:5000; text-shadow: 2px 2px 8px #000, 0 0 15px #000;'>¡ALABADO SEA EL SEÑOR!</h2>
                <div id="alivio-dialogs" style="width: 100%; transform: scale(0.85); transform-origin: top center; display: flex; flex-direction: column; align-items: center; margin-bottom: -50px;"></div>
                <hr class="separador" style='border-color:#444; margin:30px 0 20px 0; width: 80%;'>
                <p id="alivio-text-final" class="txt-accion" style='font-size: 0.9em; display:none; max-width: 90%;'>[Se escucha el bramido de un cuerno de guerra que resuena en todo el desfiladero, marcando el fin de la masacre. Ante el ensordecedor sonido y la inminente lluvia de saetas, <b>${huidos} paganos</b> rompen filas y huyen despavoridos hacia la niebla].</p>
                <button id="btn-cerrar-alivio" style="display:none; margin-top:20px; padding:10px 30px; font-size:16px; font-weight:bold; background:#222; color:#ffaa00; border:2px solid #ffaa00; border-radius:5px; cursor:pointer; font-family:'Cinzel', serif;">AVANZAR LA CRUZADA</button>
            </div>
        `;
        
        overlayAlivio.appendChild(modal); 
        document.body.appendChild(overlayAlivio);

        setTimeout(async () => {
            let container = document.getElementById("alivio-dialogs");
            let btn = document.getElementById("btn-cerrar-alivio");
            let textFinal = document.getElementById("alivio-text-final");
            if(!container) return;

            // FIX TÁCTICO: Desatar la tormenta divina
            if (typeof window.Clima !== "undefined") window.Clima.iniciarLluvia();
            
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", 
                nombrePersonaje: "Barón Andrew", alineacion: "izq", 
                bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡Comendador! ¡Los birotes han llegado y el hierro está sediento! ¡Mis hombres tienen el puente bajo la mira!"`, 
                claseTexto: "txt-lugarteniente"
            });

            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", 
                nombrePersonaje: "Barón Andrew", alineacion: "izq", 
                bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡CONDE JUAN-A! ¡Retire a sus perros de esa carnicería de inmediato si no quiere que mis saetas los confundan con herejes! ¡EL PUENTE ES NUESTRO!"`, 
                claseTexto: "txt-lugarteniente"
            });

            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", 
                nombrePersonaje: "Conde JuanA", alineacion: "izq", 
                bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡MISERICORDIA DIVINA...! ¡ESCUCHAD EL CUERNO, HERMANOS! ¡REPLIEGUE! ¡REPLIEGUE POR LA TRINIDAD!"`, 
                claseTexto: "txt-lugarteniente"
            });

            if(textFinal) textFinal.style.display = "block";
            if(btn) btn.style.display = "inline-block";
            
            btn.onclick = () => { 
                document.body.removeChild(overlayAlivio); 
                resolve(); 
            };
        }, 50);
    });
}

function playCinematicaRepliegue(callbackFinal) {
    console.log("INICIANDO OPERACIÓN DE REPLIEGUE TÁCTICO...");
    
    let idsOcultar = [
        "formacion-roster", 
        "formacion-tablero", 
        "formacion-picas-tablero",
        "btn-iniciar-formacion",
        "btn-iniciar-formacion-picas",
        "label-turnos-picas"
    ];
    idsOcultar.forEach(id => {
        let el = document.getElementById(id);
        if(el) el.style.display = "none";
    });
    
    let tituloForm = document.getElementById("titulo-formacion");
    if(tituloForm) tituloForm.innerText = "";
    
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) {
        console.error("CRÍTICO: No se encontró el contenedor animacion-escena1 en el DOM.");
        if (callbackFinal) callbackFinal();
        return;
    }

    animCaja.style.display = "block";
    
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    
    animCaja.innerHTML = `<h3 class="txt-sagrado" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">EL REPLIEGUE TÁCTICO</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    // 1. BALLESTEROS
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        card.innerHTML = RenderCombate.htmlFichaCinematica(ballestero);

        let row = index % 3; 
        let col = Math.floor(index / 3); 
        
        let finalLeft = 34 - (col * 8.5); 
        let finalTop = 23 + (row * 16);  

        let startLeft = -20 - (index * 12); 
        let startTop = finalTop; 

        card.style.top = `${startTop}%`;
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.transition = "left 5.5s ease-out";
        
        animCaja.appendChild(card);
        
        setTimeout(() => { 
            card.style.left = `${finalLeft}%`;
        }, 100);
    });

    // 2. PIQUEROS
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        card.innerHTML = RenderCombate.htmlFichaCinematica(pica);

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        
        let col = posIndex % 5; 
        let depth = Math.floor(posIndex / 5); 
        
        let finalLeft = 48 - (col * 8) - (depth * 3); 
        let finalTop = isTop ? 8 - (depth * 3) : 74 + (depth * 3); 

        card.style.zIndex = 200 - depth;

        let isTopRow = index % 2 === 0;
        let filaCol = Math.floor(index / 2);
        
        let startLeft = 90 + (filaCol * 12); 
        let startTop = isTopRow ? 42 : 58;   

        card.style.top = `${startTop}%`;
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1";
        
        card.style.transition = `left 6.5s ease-out, top 6.5s ease-out`;
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${finalLeft}%`;
            card.style.top = `${finalTop}%`;
        }, 500); 
    });

    // 3. ENEMIGOS ESTÁTICOS
    setTimeout(() => {
        let rowsTopEnemigos = ["28%", "46%", "64%"]; 
        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                
                let startLeftE = 110 + (c * 10); 
                let endLeftE = 62 + (c * 10); 

                cardE.style.top = rowsTopEnemigos[r];
                cardE.style.left = `${startLeftE}%`;
                cardE.style.filter = "sepia(50%) brightness(0.6)"; 
                cardE.style.transition = `left 8s linear, filter 8s linear`; 
                
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                animCaja.appendChild(cardE);
                cardE.getBoundingClientRect(); 

                setTimeout(() => {
                    cardE.style.left = `${endLeftE}%`;
                    cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                }, 50);
            }
        }
    }, 1500); 

    // BOTÓN DE CONTINUAR
    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        
        impactBtn.style.bottom = "5px";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            
            if(callbackFinal) callbackFinal(); 
        };
        
        animCaja.appendChild(impactBtn);
    }, 8500); 
}