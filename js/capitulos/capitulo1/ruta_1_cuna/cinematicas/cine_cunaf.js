/* === CINE_CUNAF.JS - CINEMÁTICA DE DERROTA EN CUÑA (GAME OVER ENVOLVIMIENTO) === */

window.playCinematicaDerrotaCuna = function() {
    console.group("🎬 INICIANDO CINEMÁTICA: LA CAÍDA DE LA CUÑA (ENVOLVIMIENTO)");

    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) {
        console.error("No se encontró animacion-escena1");
        return;
    }

    // FIX TÁCTICO: Eliminar clase residual que bloquea la caja con "display: none !important"
    animCaja.classList.remove("sac-escenario-reset");
    
    // Forzamos la caja al frente absoluto sobrepasando la interfaz de combate
    animCaja.style.setProperty("display", "block", "important");
    animCaja.style.setProperty("z-index", "99999", "important");
    animCaja.innerHTML = "";
    
    // Configuración asfixiante de la caja base
    animCaja.style.backgroundImage = "linear-gradient(rgba(80,0,0,0.5), rgba(0,0,0,0.9)), url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%";
    animCaja.style.backgroundPosition = "left center";
    animCaja.style.boxShadow = "inset 0 0 120px #ff0000"; // Efecto de viñeta roja (sangre/fuego)
    animCaja.style.overflow = "hidden"; // Evita que los enemigos se vean antes de entrar a la pantalla

    let titulo = document.createElement("h3");
    titulo.className = "txt-hereje titulo-cinematica-bosque"; 
    titulo.innerText = "LA CRUZADA HA SIDO APLASTADA";
    titulo.style.textShadow = "0 0 20px #ff0000";
    titulo.style.zIndex = "300";
    animCaja.appendChild(titulo);

    let zonaBatalla = document.createElement("div");
    zonaBatalla.id = "zona-batalla-anim";
    zonaBatalla.className = "zona-batalla-cinematica-bosque";
    animCaja.appendChild(zonaBatalla);

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    niebla.style.filter = "blur(15px) hue-rotate(320deg) brightness(0.6) saturate(200%)"; // Niebla rojiza
    zonaBatalla.appendChild(niebla);

    if (typeof window.forzarHalosCinematicas === 'function') window.forzarHalosCinematicas(zonaBatalla);

    // Diccionarios matemáticos de coordenadas para la cuadrícula
    let topsY = ["10%", "30%", "50%", "70%", "90%"];
    let colsX = { 
        "-5": 5, "-4": 15, "-3": 25, "-2": 35, "-1": 45, 
        "0": 55, "1": 65, "2": 75, "3": 85, "4": 95 
    };

    // 1. DIBUJAR MARCADORES EXISTENTES (Muertos de turnos anteriores)
    if (window.marcadoresBatalla) {
        window.marcadoresBatalla.forEach(m => {
            let mk = document.createElement("div");
            mk.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
            mk.className = `marcador-batalla ${m.tipo}-icon persistent-death-mark`;
            mk.style.position = "absolute";
            mk.style.fontSize = m.tipo === 'cross' ? "45px" : "30px";
            
            if (m.tipo === 'cross') {
                mk.style.color = "#ffd700";
                mk.style.textShadow = "0 0 15px #ffaa00, 0 0 30px #ffaa00";
            } else {
                mk.style.color = "#ffffff";
                mk.style.textShadow = "0 0 15px #ff0000, 0 0 30px #ff0000";
            }
            
            mk.style.top = topsY[m.row] || "50%"; 
            mk.style.left = `${colsX[m.col] || 50}%`;
            mk.style.transform = "translate(-50%, -50%)";
            mk.style.zIndex = "5";
            
            zonaBatalla.appendChild(mk);
        });
    }

    // 2. DIBUJAR CABALLEROS SOBREVIVIENTES ATRAPADOS
    if (EstadoBatalla.tropasVivas) {
        EstadoBatalla.tropasVivas.forEach(pos => {
            if (pos.idUnico && !pos.ignorarMuerto) {
                let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
                if (tr && tr.hp > 0) {
                    let card = document.createElement("div");
                    let claseBorde = tr.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                    card.className = `tropa-cinematica ${claseBorde}`;
                    card.style.zIndex = "150";
                    
                    let hpStars = "❤️".repeat(Math.max(0, tr.hp)) + "🖤".repeat(2 - Math.max(0, tr.hp));
                    let etiqueta = tr.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
                    card.innerHTML = `<img src="${tr.img}" style="transform: scaleX(-1);"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${tr.nombre} <br>${etiqueta}</div>`;

                    card.style.top = topsY[pos.row];
                    card.style.left = `${colsX[pos.col]}%`;
                    card.style.transform = "translate(-50%, -50%)";
                    
                    zonaBatalla.appendChild(card);
                }
            }
        });
    }

    // 3. DIBUJAR LA MURALLA ENEMIGA FRONTAL (Los que frenaron la cuña)
    if (EstadoBatalla.enemigos) {
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 3; c++) {
                let enemigo = EstadoBatalla.enemigos[r][c];
                if (enemigo && !enemigo.muerto) {
                    let card = document.createElement("div");
                    card.className = "tropa-cinematica";
                    card.style.border = "2px solid #ff4c4c";
                    card.style.zIndex = "100";
                    let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                    card.innerHTML = `<div class="enemigo-hp-combate">🤍</div><img src="assets/img/personajes/enemigos/${imgE}" style="transform: scaleX(-1);">`;
                    
                    card.style.top = topsY[r];
                    card.style.left = `${colsX[c]}%`; // Enemigos base están en cols 0, 1, 2
                    card.style.transform = "translate(-50%, -50%)";
                    
                    zonaBatalla.appendChild(card);
                }
            }
        }
    }

    // 4. EL ENVOLVIMIENTO (18 Enemigos corriendo desde la derecha para tapar la salida)
    // Forman una T invertida: 2 columnas completas atrás (col -5 y -4) y refuerzan los flancos (r0 y r4)
    let verdugosCoords = [
        // Retaguardia bloqueada (Columna -4)
        {r: 0, c: "-4"}, {r: 1, c: "-4"}, {r: 2, c: "-4"}, {r: 3, c: "-4"}, {r: 4, c: "-4"},
        // Refuerzo de retaguardia (Columna -5)
        {r: 0, c: "-5"}, {r: 1, c: "-5"}, {r: 2, c: "-5"}, {r: 3, c: "-5"}, {r: 4, c: "-5"},
        // Presión Flanco Superior (Fila 0)
        {r: 0, c: "-3"}, {r: 0, c: "-2"}, {r: 0, c: "-1"}, {r: 0, c: "0"},
        // Presión Flanco Inferior (Fila 4)
        {r: 4, c: "-3"}, {r: 4, c: "-2"}, {r: 4, c: "-1"}, {r: 4, c: "0"}
    ];

    verdugosCoords.forEach((coord, i) => {
        let card = document.createElement("div");
        card.className = "tropa-cinematica";
        card.style.border = "2px solid #880000"; // Borde más oscuro para los verdugos
        card.style.zIndex = "200"; // Por encima de los aliados para dar sensación de asfixia
        
        let imgE = (i % 2 === 0) ? "enemigo_piquero.webp" : "enemigo.webp";
        // Efecto visual: Ligeramente más oscuros y rojizos
        card.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="filter:brightness(0.7) sepia(100%) hue-rotate(300deg) saturate(200%);">`;
        
        // Inician completamente fuera de la pantalla a la derecha
        card.style.top = topsY[coord.r] || "50%";
        card.style.left = `130%`; 
        card.style.transform = "translate(-50%, -50%)";
        
        zonaBatalla.appendChild(card);

        // Animar la estampida
        setTimeout(() => {
            if(typeof DirectorCinematico !== 'undefined' && DirectorCinematico.setTransition) {
                DirectorCinematico.setTransition(card, "sac-trans-left-15-inout"); 
            } else {
                card.style.transition = "left 2.5s cubic-bezier(0.25, 1, 0.5, 1)";
            }
            card.style.left = `${colsX[coord.c]}%`;
        }, 500 + (i * 150)); // Entran como enjambre
    });

    // 5. DIÁLOGOS DRAMÁTICOS EN PANTALLA
    setTimeout(() => {
        if (typeof DirectorCinematico !== 'undefined' && DirectorCinematico.lanzarGlobo) {
            DirectorCinematico.lanzarGlobo(zonaBatalla, `💬 <b style="color: #ff4c4c;">Comandante Pagano:</b><br>"¡ENVUÉLVALOS! ¡MÁTENLOS A TODOS! ¡NO DEJEN NI UNO VIVO!"`, "80%", "20%", "borde-enemigo");
        }
    }, 2000);

    setTimeout(() => {
        if (typeof DirectorCinematico !== 'undefined' && DirectorCinematico.lanzarGlobo) {
            DirectorCinematico.lanzarGlobo(zonaBatalla, `💬 <b style="color: #ffaa00;">Caballeros:</b><br>"¡PADRE NUESTRO QUE ESTÁS EN LOS CIELOS...!"`, "35%", "50%");
        }
    }, 4500);

    // 6. FUNDIDO A NEGRO Y GAME OVER
    setTimeout(() => {
        let blackout = document.createElement("div");
        blackout.style.position = "absolute";
        blackout.style.top = "0"; blackout.style.left = "0";
        blackout.style.width = "100%"; blackout.style.height = "100%";
        blackout.style.backgroundColor = "#000";
        blackout.style.opacity = "0";
        blackout.style.transition = "opacity 4s ease-in";
        blackout.style.zIndex = "999";
        animCaja.appendChild(blackout);
        
        requestAnimationFrame(() => {
            blackout.style.opacity = "1";
        });

        setTimeout(() => {
            let gameOverText = document.createElement("h1");
            gameOverText.innerText = "LA CRUZADA HA FRACASADO";
            gameOverText.style.color = "#ff4c4c";
            gameOverText.style.position = "absolute";
            gameOverText.style.top = "40%";
            gameOverText.style.left = "50%";
            gameOverText.style.transform = "translate(-50%, -50%)";
            gameOverText.style.width = "100%";
            gameOverText.style.textAlign = "center";
            gameOverText.style.zIndex = "1000";
            gameOverText.style.fontFamily = "'Cinzel', serif";
            gameOverText.style.fontSize = "40px";
            gameOverText.style.letterSpacing = "5px";
            gameOverText.style.textShadow = "0 0 20px red";
            animCaja.appendChild(gameOverText);

            let btnReiniciar = document.createElement('button');
            btnReiniciar.className = "impacto-divino-btn"; 
            btnReiniciar.innerText = "REINICIAR CAMPAÑA";
            btnReiniciar.style.bottom = "30%";
            btnReiniciar.style.zIndex = "1000";
            btnReiniciar.style.background = "#550000";
            btnReiniciar.style.borderColor = "#ff4c4c";
            
            btnReiniciar.onclick = function() {
                location.reload(); // Reinicio duro del juego
            };
            animCaja.appendChild(btnReiniciar);
        }, 4000);

    }, 7000);

    console.groupEnd();
};