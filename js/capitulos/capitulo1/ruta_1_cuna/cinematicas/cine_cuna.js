/* === CINE_CUNA.JS - CINEMÁTICA DE LA CARGA EN CUÑA === */

window.animarRupturaLinea = function(idTropa, arrastrarReservas) {
    let knightEl = document.getElementById("drag-" + idTropa);
    if (knightEl) {
        knightEl.style.setProperty("position", "absolute", "important");
        knightEl.style.setProperty("z-index", "100", "important");
        knightEl.style.setProperty("transform", "translateX(800px)", "important");
        knightEl.style.setProperty("opacity", "0", "important");
        knightEl.style.setProperty("transition", "transform 3.0s ease-in, opacity 1.5s ease-in 1.5s", "important");
        knightEl.style.setProperty("pointer-events", "none", "important");
    }

    if (arrastrarReservas) {
        let resZona = document.getElementById("zona-reservas");
        if (resZona && !resZona.classList.contains("ruptura-masiva")) {
            resZona.classList.add("ruptura-masiva");
            resZona.style.setProperty("transition", "transform 4.0s ease-in, opacity 2.0s ease-in 2.0s", "important");
            resZona.style.setProperty("transform", "translateX(1200px)", "important");
            resZona.style.setProperty("opacity", "0", "important");
            resZona.style.setProperty("pointer-events", "none", "important");
        }
    }
};

function playCinematicaCargaCuna(formacionInfo, callbackFinal) {
    const animCaja = document.getElementById("animacion-escena1");
    animCaja.style.display = "block";
    animCaja.innerHTML = "";

    let zonaBatalla = document.createElement("div");
    zonaBatalla.id = "zona-batalla-anim";
    zonaBatalla.style.cssText = "position:absolute; top:50%; left:0; width:100%; height:400px; transform:translateY(-50%); z-index:150;";
    animCaja.appendChild(zonaBatalla);

    let elementosAnimar = [];
    let slots = formacionInfo.slots;
    let duracionCarga = 7000; 
    let cssTransition = `top ${duracionCarga}ms linear, left ${duracionCarga}ms linear, opacity 1s ease`;

    let carrilesY = ["0px", "81px", "162px", "243px", "325px"];
    let hordaCompletaArr = [];
    let finalLeftColsEnemigos = ["70%", "80%", "90%"];

    for(let r=0; r < carrilesY.length; r++) {
        for(let c=0; c < finalLeftColsEnemigos.length; c++) {
            let esPiqueroEnemigo = (r + c) % 2 === 0;
            hordaCompletaArr.push({
                top: carrilesY[r], left: finalLeftColsEnemigos[c],
                img: esPiqueroEnemigo ? "enemigo_piquero.webp" : "enemigo.webp",
                id: `enemigo-cine-${r}-${c}`
            });
        }
    }
    
    hordaCompletaArr.forEach(e => {
        let card = document.createElement("div");
        card.className = "tropa-cinematica cinematica-enemigo"; 
        card.id = e.id;
        card.style.top = e.top; card.style.left = "88%"; 
        card.style.filter = "sepia(50%) brightness(0.5)"; 
        card.style.zIndex = "100"; card.style.opacity = "0"; 
        card.innerHTML = `<img src="assets/img/personajes/enemigos/${e.img}">`;
        zonaBatalla.appendChild(card); 
        card.getBoundingClientRect(); 
        elementosAnimar.push({ el: card, top: e.top, left: e.left, opacity: "1" });
    });

    let startPos = {
        "punta":          { top: carrilesY[2], left: "-10%" }, 
        "media-arriba":   { top: carrilesY[1], left: "-18%" }, 
        "media-abajo":    { top: carrilesY[3], left: "-18%" }, 
        "trasera-arriba": { top: carrilesY[0], left: "-26%" }, 
        "trasera-abajo":  { top: carrilesY[4], left: "-26%" }  
    };

    let destPos = {
        "punta":          { top: carrilesY[2], left: "55%" }, 
        "media-arriba":   { top: carrilesY[1], left: "47%" },
        "media-abajo":    { top: carrilesY[3], left: "47%" },
        "trasera-arriba": { top: carrilesY[0], left: "39%" }, 
        "trasera-abajo":  { top: carrilesY[4], left: "39%" }  
    };

    for(let pos in slots) {
        let idTropa = slots[pos];
        if(idTropa) {
            let cab = jugador.tropas.find(t => t.idUnico === idTropa);
            if(cab) {
                let card = document.createElement("div");
                let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                card.className = `tropa-cinematica ${claseBorde}`;
                card.style.zIndex = "250";
                
                let hpStars = "❤️".repeat(Math.max(0, cab.hp)) + "🖤".repeat(2 - Math.max(0, cab.hp));
                let etiqueta = cab.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
                card.innerHTML = `<img src="${cab.img}" style="transform: scaleX(-1);"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${cab.nombre} <br>${etiqueta}</div>`;

                let inicial = startPos[pos] || { top: carrilesY[2], left: "-20%" };
                card.style.top = inicial.top; card.style.left = inicial.left; card.style.opacity = "1"; 
                zonaBatalla.appendChild(card); 
                card.getBoundingClientRect(); 
                let destino = destPos[pos] || { top: carrilesY[2], left: "50%" };
                elementosAnimar.push({ el: card, top: destino.top, left: destino.left });
            }
        }
    }

    let reservas = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0 && !Object.values(slots).includes(t.idUnico));
    let numMostrados = 0;
    let mapeoFilas = [2, 1, 3, 0, 4]; 
    
    // =====================================================================
    // [NUEVO] LÓGICA DE CABEZA DE RESERVA INYECTADA PARA LA CINEMÁTICA INICIAL
    // =====================================================================
    let traseraArribaLlena = slots["trasera-arriba"] !== null;
    let traseraAbajoLlena = slots["trasera-abajo"] !== null;
    let traserosAvanzan = traseraArribaLlena || traseraAbajoLlena;
    
    let offsetCabeza = traserosAvanzan ? 0 : -20; // Si no hay retaguardia, la cabeza no asoma
    let offsetCuna = [offsetCabeza, -8, -8, -16, -16]; 
    let baseLeftPunta = 31; 

    reservas.forEach((cab) => {
        let olaIndice = Math.floor(numMostrados / 5); 
        let posEnLaCuna = numMostrados % 5;           

        let card = document.createElement("div");
        let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150";
        
        let hpStars = "❤️".repeat(Math.max(0, cab.hp)) + "🖤".repeat(2 - Math.max(0, cab.hp));
        let etiqueta = cab.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${cab.img}" style="transform: scaleX(-1);"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${cab.nombre} <br>${etiqueta}</div>`;

        let verticalPos = carrilesY[mapeoFilas[posEnLaCuna]]; 
        let endLeft = baseLeftPunta - (olaIndice * 24) + offsetCuna[posEnLaCuna]; 
        let startLeft = endLeft - 60; 

        card.style.top = verticalPos; card.style.left = `${startLeft}%`; card.style.opacity = "1"; 
        zonaBatalla.appendChild(card); 
        card.getBoundingClientRect(); 
        elementosAnimar.push({ el: card, top: verticalPos, left: `${endLeft}%` });
        numMostrados++;
    });

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    niebla.style.cssText = "z-index: 350; pointer-events: none; opacity: 0.75; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background-size: 50% 100%;";
    animCaja.appendChild(niebla);

    setTimeout(() => {
        elementosAnimar.forEach(anim => {
            anim.el.style.transition = cssTransition; 
            anim.el.style.top = anim.top; anim.el.style.left = anim.left;
            if(anim.opacity) anim.el.style.opacity = anim.opacity;
        });
    }, 50);

    setTimeout(() => {
        document.querySelectorAll('.cinematica-enemigo').forEach(e => {
            e.style.animation = "clashFlash 0.3s infinite alternate"; e.style.filter = "sepia(0%) brightness(1)";
        });
    }, duracionCarga - 400);

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; impactBtn.innerText = "DEUS LO VULT !";
        impactBtn.style.bottom = "10px"; impactBtn.style.zIndex = "9999999"; 
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; animCaja.style.display = "none"; animCaja.innerHTML = "";
            document.getElementById("formacion-overlay").style.display = "none"; 
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, duracionCarga);
}