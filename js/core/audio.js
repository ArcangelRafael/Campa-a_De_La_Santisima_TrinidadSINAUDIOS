/* === AUDIO.JS - GESTOR CENTRAL DE BGM, SFX Y AMBIENTE === */

window.AudioManager = {
    // Canales separados preparados para el futuro Menú de Configuración
    volumenes: {
        juego: 0.4,    
        ambiente: 0.5, 
        efectos: 0.7   
    },

    bgmActual: null,
    bgmPausada: null, 
    ambienteActual: null,

    // Arsenal de lamentos (expandible a futuro)
    lamentos: ["assets/audio/lam1.mp3", "assets/audio/lam2.mp3", "assets/audio/lam3.mp3"],

    playBGM: function(idAudio) {
        // FIX TÁCTICO: Si la pista solicitada ya está sonando, evitamos el corte y no la reiniciamos
        if (idAudio && this.bgmActual && this.bgmActual.id === idAudio) {
            if (this.bgmActual.paused) {
                this.bgmActual.play().catch(e => console.warn("Audio bloqueado:", e));
            }
            return;
        }

        if (this.bgmActual) {
            this.bgmActual.pause();
            this.bgmActual.currentTime = 0;
        }
        if (!idAudio) return;
        let audio = document.getElementById(idAudio);
        if (audio) {
            this.bgmActual = audio;
            this.bgmActual.volume = this.volumenes.juego;
            this.bgmActual.play().catch(e => console.warn("Audio bloqueado por el navegador:", e));
        }
    },

    // === NUEVAS FUNCIONES PARA MENÚS EMERGENTES (INVENTARIO/TIENDA) ===
    playBGMOverlay: function(idAudio) {
        // Pausamos la música de fondo actual SIN reiniciar su tiempo
        if (this.bgmActual && this.bgmActual.id !== idAudio) {
            this.bgmActual.pause();
            this.bgmPausada = this.bgmActual; 
        }
        
        let audio = document.getElementById(idAudio);
        if (audio) {
            this.bgmActual = audio;
            this.bgmActual.currentTime = 0; // La música del menú sí inicia desde cero
            this.bgmActual.volume = this.volumenes.juego;
            this.bgmActual.play().catch(e => {});
        }
    },

    stopBGMOverlay: function() {
        // Detenemos la música del menú
        if (this.bgmActual) {
            this.bgmActual.pause();
            this.bgmActual.currentTime = 0;
        }
        // Restauramos la música épica de fondo EXACTAMENTE donde se quedó
        if (this.bgmPausada) {
            this.bgmActual = this.bgmPausada;
            this.bgmActual.play().catch(e => {});
            this.bgmPausada = null;
        }
    },
    // =================================================================

    playSFX: function(rutaOidAudio) {
        // Soporta IDs del HTML o rutas directas a archivos .mp3
        let audioNode = document.getElementById(rutaOidAudio);
        if (audioNode) {
            let clon = audioNode.cloneNode();
            clon.volume = this.volumenes.efectos;
            clon.play().catch(e => {});
            return;
        }
        
        let sfx = new Audio(rutaOidAudio);
        sfx.volume = this.volumenes.efectos;
        sfx.play().catch(e => {});
    },

    playLamento: function() {
        let lamAleatorio = this.lamentos[Math.floor(Math.random() * this.lamentos.length)];
        this.playSFX(lamAleatorio);
    },

    iniciarMusicaTribulacion: function() {
        if (this.bgmActual) {
            this.bgmActual.pause();
            this.bgmPausada = this.bgmActual;
        }
        let pistaRandom = Math.floor(Math.random() * 3) + 1;
        let idTribulacion = "bgm-trib" + pistaRandom;
        let audio = document.getElementById(idTribulacion);
        if (audio) {
            this.bgmActual = audio;
            this.bgmActual.currentTime = 0;
            this.bgmActual.volume = this.volumenes.juego;
            this.bgmActual.play().catch(e => {});
        }
    },

    detenerMusicaTribulacion: function() {
        if (this.bgmActual) {
            this.bgmActual.pause();
            this.bgmActual.currentTime = 0;
        }
        if (this.bgmPausada) {
            this.bgmActual = this.bgmPausada;
            this.bgmActual.play().catch(e => {});
            this.bgmPausada = null;
        }
    },

    // Función lista para cuando construyamos el menú de interfaz
    setVolumen: function(canal, valor) {
        this.volumenes[canal] = valor;
        if (canal === "juego" && this.bgmActual) this.bgmActual.volume = valor;
        if (canal === "ambiente" && this.ambienteActual) this.ambienteActual.volume = valor;
    }
};

// Wrappers globales para retrocompatibilidad con el código antiguo
window.cambiarMusica = function(idAudio) { AudioManager.playBGM(idAudio); };
window.iniciarMusicaTribulacion = function() { AudioManager.iniciarMusicaTribulacion(); };
window.detenerMusicaTribulacion = function() { AudioManager.detenerMusicaTribulacion(); };