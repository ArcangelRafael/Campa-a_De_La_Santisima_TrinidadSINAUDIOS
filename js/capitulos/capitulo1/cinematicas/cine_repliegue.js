/* === CINE_REPLIEGUE.JS - CINEMÁTICA DE LA RETIRADA DE PICAS === */

// SISTEMA GLOBAL DE CLIMA Y AUDIO AMBIENTAL
window.Clima = {
    audioViento: null,
    audioVientoRayo: null,
    audioLluvia: null,
    
    iniciarViento: function() {
        this.detenerTodo(); 
        if (!this.audioViento) { this.audioViento = new Audio("assets/audio/amb_wind.mp3"); this.audioViento.loop = true; this.audioViento.volume = 0.5; }
        this.audioViento.play().catch(e => console.log("Audio bloqueado."));
    },
    iniciarVientoRayo: function() {
        this.detenerTodo();
        if (!this.audioVientoRayo) { this.audioVientoRayo = new Audio("assets/audio/amb_windlightning.mp3"); this.audioVientoRayo.loop = true; this.audioVientoRayo.volume = 0.6; }
        this.audioVientoRayo.play().catch(e => console.log("Audio bloqueado."));
    },
    iniciarLluvia: function() {
        this.detenerTodo();
        let capa = document.getElementById("capa-clima");
        if (!capa) { capa = document.createElement("div"); capa.id = "capa-clima"; capa.className = "rain"; document.body.appendChild(capa); }
        capa.style.display = "block"; 
        if (!this.audioLluvia) { this.audioLluvia = new Audio("assets/audio/amb_rain.mp3"); this.audioLluvia.loop = true; this.audioLluvia.volume = 0.6; }
        this.audioLluvia.play().catch(e => console.log("Audio bloqueado."));
    },
    detenerTodo: function() {
        let capa = document.getElementById("capa-clima"); if (capa) capa.style.display = "none";
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

            if (typeof window.Clima !== "undefined") window.Clima.iniciarLluvia();
            
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡Comendador! ¡Los birotes han llegado y el hierro está sediento! ¡Mis hombres tienen el puente bajo la mira!"`, claseTexto: "txt-lugarteniente"
            });
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡CONDE JUAN-A! ¡Retire a sus perros de esa carnicería de inmediato si no quiere que mis saetas los confundan con herejes! ¡EL PUENTE ES NUESTRO!"`, claseTexto: "txt-lugarteniente"
            });
            await MotorDialogos.mostrarDialogoEnContenedor(container, {
                personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡MISERICORDIA DIVINA...! ¡ESCUCHAD EL CUERNO, HERMANOS! ¡REPLIEGUE! ¡REPLIEGUE POR LA TRINIDAD!"`, claseTexto: "txt-lugarteniente"
            });

            if(textFinal) textFinal.style.display = "block";
            if(btn) btn.style.display = "inline-block";
            btn.onclick = () => { document.body.removeChild(overlayAlivio); resolve(); };
        }, 50);
    });
}

function playCinematicaRepliegue(callbackFinal) {
    console.log("INICIANDO OPERACIÓN DE REPLIEGUE TÁCTICO...");
    
    DirectorCinematico.limpiarHigieneVisual();
    const animCaja = DirectorCinematico.prepararEscenario("EL RELEVO TÁCTICO", "assets/img/fondos/puentepiso.webp");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    // 1. BALLESTEROS
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = DirectorCinematico.crearTarjetaTropa(ballestero);
        card.style.zIndex = "150"; 
        card.style.top = `${23 + ((index % 3) * 16)}%`;
        card.style.left = `${-20 - (index * 12)}%`;
        card.style.opacity = "1"; 
        card.style.transition = "left 5.5s ease-out";
        animCaja.appendChild(card);
        setTimeout(() => { card.style.left = `${34 - (Math.floor(index / 3) * 8.5)}%`; }, 100);
    });

    // 2. PIQUEROS
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let c_arriba = 0; let c_abajo = 0;

    piquerosVivos.forEach((pica, index) => {
        let card = DirectorCinematico.crearTarjetaTropa(pica);
        let isTop = index < Math.ceil(piquerosVivos.length / 2);
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let depth = Math.floor(posIndex / 5); 
        
        card.style.zIndex = 200 - depth;
        card.style.top = `${(index % 2 === 0) ? 42 : 58}%`;
        card.style.left = `${90 + (Math.floor(index / 2) * 12)}%`;
        card.style.opacity = "1";
        card.style.transition = `left 6.5s ease-out, top 6.5s ease-out`;
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${48 - ((posIndex % 5) * 8) - (depth * 3)}%`;
            card.style.top = `${isTop ? 8 - (depth * 3) : 74 + (depth * 3)}%`;
        }, 500); 
    });

    // 3. ENEMIGOS Y BOTÓN
    setTimeout(() => { DirectorCinematico.crearEnemigosEstaticos(animCaja, 62, true); }, 1500); 
    DirectorCinematico.crearBotonContinuar(animCaja, "DEUS LO VULT !", 8500, callbackFinal);
}