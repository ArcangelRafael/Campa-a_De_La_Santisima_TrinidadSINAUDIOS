/* === CINE_VICTORIA.JS - CINEMÁTICA DE VICTORIA DECISIVA (LA CUÑA DE ACERO) === */

function playCinematicaVictoria(callbackFinal) {
    let skipCine = document.getElementById("ht-skip-cine")?.checked;
    if(skipCine) {
        if(callbackFinal) callbackFinal();
        return;
    }

    let overlay = document.getElementById("formacion-overlay");
    if(overlay) {
        overlay.style.display = "flex";
        Array.from(overlay.children).forEach(c => c.style.display = "none");
    }

    let outerContainer = document.createElement("div");
    outerContainer.id = "cine-victoria-outer";
    outerContainer.style.cssText = "width:960px; background:#181818; border:2px solid #333; border-radius:8px; padding:20px; display:flex; flex-direction:column; align-items:center; box-shadow: 0 0 50px rgba(0,0,0,0.9); margin:auto; position:relative; z-index:100;";

    let cineText = document.createElement("h2");
    cineText.style.cssText = "color:#ffd700; font-family:'Cinzel', serif; text-shadow:0 0 15px #ffaa00; margin:0 0 15px 0; min-height:35px; text-align:center; transition: opacity 0.5s;";
    outerContainer.appendChild(cineText);

    let cineContainer = document.createElement("div");
    cineContainer.id = "cine-victoria-container";
    cineContainer.style.cssText = "position:relative; width:900px; height:600px; overflow:hidden; border:4px solid #b8860b; box-shadow:0 0 40px rgba(184, 134, 11, 0.5); background:#050505;";
    outerContainer.appendChild(cineContainer);

    let btnContainer = document.createElement("div");
    btnContainer.style.cssText = "width:100%; min-height:60px; display:flex; justify-content:center; align-items:center; margin-top:20px;";
    outerContainer.appendChild(btnContainer);

    if(overlay) overlay.appendChild(outerContainer);

    let world = document.createElement("div");
    world.style.cssText = "position:absolute; width:1800px; height:100%; top:0; left:0; background:linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%), url('assets/img/fondos/puentepiso.webp') center left / auto 100%; transition: transform 5s ease-in-out;";
    cineContainer.appendChild(world);

    if (window.marcadoresBatalla && window.marcadoresBatalla.length > 0) {
        window.marcadoresBatalla.forEach(m => {
            let icon = document.createElement('div');
            icon.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
            let color = m.tipo === 'cross' ? '#c0c0c0' : '#fff';
            let textShadow = m.tipo === 'cross' ? '0 0 10px #fff' : 'none';
            let fontSize = m.tipo === 'skull' ? '35px' : '40px';
            
            let leftPx = 0;
            let topPx = 0;

            if (m.slotPos) {
                let pIndex = parseInt(m.slotPos.split("-")[1]) - 1; 
                if (isNaN(pIndex)) pIndex = Math.floor(Math.random() * 4);
                let topsPica = [70, 200, 400, 520]; 
                leftPx = 220 + (Math.random() * 60); 
                topPx = topsPica[pIndex % 4] + (Math.random() * 40 - 20); 
            } else if (m.row !== undefined && m.col !== undefined) {
                let tops = [15, 32, 50, 68, 85]; 
                let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84, "3": 95 };
                let lPct = cols[m.col] || 50; 
                let tPct = tops[m.row] || 50;
                leftPx = (lPct / 100) * 900;
                topPx = (tPct / 100) * 600;
            }

            icon.style.cssText = `position:absolute; top:${topPx}px; left:${leftPx}px; transform:translate(-50%,-50%); font-size:${fontSize}; z-index:5; opacity:0.4; color:${color}; text-shadow:${textShadow}; pointer-events:none;`;
            world.appendChild(icon);
        });
    }

    let nieblaCombat = document.createElement("div");
    nieblaCombat.className = "efecto-neblina";
    nieblaCombat.style.cssText = "position:absolute; width:100%; height:100%; top:0; left:0; pointer-events:none; z-index:250; opacity:0.8;";
    cineContainer.appendChild(nieblaCombat);

    function createUnit(tropa, isEnemy = false, isBoss = false, label = "", specificImg = null) {
        let el = document.createElement("div");
        el.style.cssText = "position:absolute; width:75px; height:95px; transition: all 2s cubic-bezier(0.25, 1, 0.5, 1); z-index:10; box-sizing: border-box;";
        
        if (isEnemy) {
            el.className = "soldier-frame tropa-mercenaria";
            let color = isBoss ? "#ffaa00" : "#ff4c4c";
            el.style.borderColor = color;
            el.style.boxShadow = `0 0 10px ${color}`;

            let imgSource = specificImg ? specificImg : "assets/img/personajes/enemigos/enemigo.webp";
            
            el.innerHTML = `<img src="${imgSource}" style="width:100%; height:100%; object-fit:cover;">
                            <div class="unidad-nombre-aleatorio" style="display:block; position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.8); color:${color}; font-size:8px; padding:2px 0; text-align:center; z-index:200; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">${label}</div>`;
            
            if(isBoss) {
                el.style.transform = "scale(1.15)";
                el.style.zIndex = "20";
            }
        } else {
            let claseBorde = tropa?.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
            el.className = `soldier-frame tropa-draggable ${claseBorde}`;
            el.innerHTML = RenderCombate.htmlFichaTropaInner(tropa);
        }
        world.appendChild(el);
        return el;
    }

    let unitEls = { knights: [], archers: [], pikes: [], enemies: [], bosses: [], alliedBosses: [] };

    let knights = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0);
    let archers = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    let pikes = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);

    // POSICIONES INICIALES ORGANIZADAS
    
    let pikesTopCount = Math.ceil(pikes.length / 2);
    let espaciadoPicas = Math.min(75, 400 / Math.max(1, pikesTopCount - 1));
    
    pikes.forEach((p, i) => {
        let el = createUnit(p);
        let isTop = i < pikesTopCount;
        let indexInGroup = isTop ? i : i - pikesTopCount;
        el.style.left = (160 + indexInGroup * espaciadoPicas) + "px";
        el.style.top = isTop ? "25px" : "475px";
        unitEls.pikes.push(el);
    });

    archers.forEach((a, i) => {
        let el = createUnit(a);
        let col = Math.floor(i / 3);
        let row = i % 3;
        el.style.left = (300 - col * 80) + "px"; 
        el.style.top = (150 + row * 100) + "px"; 
        unitEls.archers.push(el);
    });

    knights.forEach((k, i) => {
        let el = createUnit(k);
        el.style.left = (-120 - i*60) + "px";
        el.style.top = "250px"; 
        unitEls.knights.push(el);
    });

    let playerEl = document.createElement("div");
    playerEl.id = "hero-player";
    playerEl.className = "soldier-frame tropa-draggable tropa-noble caballero-reserva";
    playerEl.style.cssText = "position:absolute; width:75px; height:95px; transition: all 2s ease-out; z-index:20; box-sizing: border-box; left:-250px; top:250px; transform: scale(1.15); border-color:#ffd700; box-shadow:0 0 15px #ffd700;"; 
    playerEl.innerHTML = `
        <img src="assets/img/personajes/aliados/jugador.webp" style="width:100%; height:100%; object-fit:cover;">
        <div class="unidad-nombre-aleatorio" style="display:block; position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.8); color:#ffd700; font-size:8px; padding:2px 0; text-align:center; z-index:200;">COMENDADOR ${jugador.nombre || "Lord Tester"}</div>
    `;
    world.appendChild(playerEl);
    unitEls.alliedBosses.push(playerEl);

    let alexEl = document.createElement("div");
    alexEl.id = "hero-alexandro";
    alexEl.className = "soldier-frame tropa-draggable tropa-noble caballero-reserva";
    alexEl.style.cssText = "position:absolute; width:75px; height:95px; transition: all 2s ease-out; z-index:20; box-sizing: border-box; left:-320px; top:250px; transform: scale(1.15); border-color:#ffd700; box-shadow:0 0 15px #ffd700;";
    alexEl.innerHTML = `
        <img src="assets/img/personajes/aliados/lider_caballeromontado.webp" style="width:100%; height:100%; object-fit:cover;">
        <div class="unidad-nombre-aleatorio" style="display:block; position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.8); color:#ffd700; font-size:8px; padding:2px 0; text-align:center; z-index:200;">Sir Alexandro</div>
    `;
    world.appendChild(alexEl);
    unitEls.alliedBosses.push(alexEl);

    for(let i=0; i<9; i++) {
        let el = createUnit(null, true, false, "Hereje");
        let col = Math.floor(i / 3);
        let row = i % 3;
        el.style.left = (550 + col*85) + "px";
        el.style.top = (145 + row*105) + "px";
        unitEls.enemies.push(el);
    }

    let ge = createUnit(null, true, true, "GENERAL INFIESTA", "assets/img/personajes/enemigos/generale.webp");
    ge.style.left = "1300px"; ge.style.top = "250px";
    unitEls.bosses.push(ge);

    let le1 = createUnit(null, true, true, "LUGARTENIENTE SAA'AD", "assets/img/personajes/enemigos/lugarte1.webp");
    le1.style.left = "1420px"; le1.style.top = "100px";
    unitEls.bosses.push(le1);
    
    let le2 = createUnit(null, true, true, "LUGARTENIENTE OTHMAN", "assets/img/personajes/enemigos/lugarte2.webp");
    le2.style.left = "1420px"; le2.style.top = "250px";
    unitEls.bosses.push(le2);
    
    let le3 = createUnit(null, true, true, "LUGARTENIENTE FARID", "assets/img/personajes/enemigos/lugarte3.webp");
    le3.style.left = "1420px"; le3.style.top = "400px";
    unitEls.bosses.push(le3);

    
    setTimeout(() => { cineText.innerText = "¡La hueste avanza en fila india por el claro!"; }, 0); 
    // FIX TÁCTICO: Se adelantó el texto a 0.8s para coincidir con la evasión temprana
    setTimeout(() => { cineText.innerText = "¡Ballesteros, abrid paso a la Caballería!"; }, 800); 
    setTimeout(() => { cineText.innerText = "¡Los herejes retroceden ante el avance incesante!"; }, 5000); 

    setTimeout(() => {
        unitEls.knights.forEach((el, i) => {
            el.style.transition = "all 4s linear"; 
            el.style.left = (150 + (knights.length - i)*60) + "px";
        });
    }, 500);

    // FIX TÁCTICO: Efecto Cremallera Temprano y Suave (Zipper)
    // Inicia a los 800ms (antes) para dar tiempo a despejar el camino
    setTimeout(() => {
        let maxCol = Math.max(0, Math.floor((unitEls.archers.length - 1) / 3));
        
        unitEls.archers.forEach((el, i) => {
            let isTopHalf = i < Math.ceil(unitEls.archers.length / 2);
            let indexInGroup = isTopHalf ? i : i - Math.ceil(unitEls.archers.length / 2);
            let col = Math.floor(i / 3);
            
            // Los de la izquierda (retaguardia) se apartan primero
            let delay = (maxCol - col) * 0.2; 
            
            // Movimiento fluido (1.5s) y ease-in-out para quitar el rebote
            el.style.transition = `all 1.5s ease-in-out ${delay}s`;

            el.style.top = "105px"; if(!isTopHalf) el.style.top = "395px";
            // Se acomodan en una línea compacta sin cruzar el mapa
            el.style.left = (300 - indexInGroup * 55) + "px"; 
        });
    }, 800);

    setTimeout(() => {
        world.style.transform = "translateX(-600px)";
        
        unitEls.enemies.forEach((el, i) => {
            let col = Math.floor(i / 3);
            el.style.transition = "all 4.5s ease-out"; 
            el.style.left = (1080 + col*85) + "px"; 
        });
    }, 2800);

    setTimeout(() => {
        unitEls.knights.forEach((el, i) => {
            el.style.transition = "all 5.5s cubic-bezier(0.25, 1, 0.5, 1)"; 
            
            let row = Math.floor((-1 + Math.sqrt(1 + 8 * i)) / 2);
            let posInRow = i - (row * (row + 1)) / 2;
            
            let targetX = 820 - (row * 80); 
            let targetY = 250 + ((posInRow - row/2) * 100); 
            
            el.style.left = targetX + "px";
            el.style.top = targetY + "px";
        });
    }, 4800);

    setTimeout(() => {
        cineText.innerText = "¡Las filas enemigas se abren!";
        unitEls.enemies.forEach((el, i) => {
            el.style.transition = "all 1.5s ease-in-out";
            if (i < 4) {
                el.style.top = "120px"; 
            } else {
                el.style.top = "430px"; 
            }
        });
    }, 7000);

    setTimeout(() => {
        cineText.innerText = "¡Los líderes dan un paso al frente!";
        
        unitEls.bosses[0].style.transition = "all 2s ease-out";
        unitEls.bosses[0].style.left = "1000px";
        unitEls.bosses[0].style.top = "250px";

        unitEls.bosses[2].style.transition = "all 2s ease-out";
        unitEls.bosses[2].style.left = "1080px";
        unitEls.bosses[2].style.top = "160px";

        unitEls.alliedBosses[0].style.left = "900px";
        unitEls.alliedBosses[0].style.top = "250px";

        unitEls.alliedBosses[1].style.left = "860px";
        unitEls.alliedBosses[1].style.top = "160px"; 

    }, 8500);

    setTimeout(() => {
        unitEls.enemies.forEach((el, i) => {
            let col = Math.floor(i / 3);
            let row = i % 3;
            el.style.transition = "all 1.5s ease-in-out";
            el.style.left = (1160 + col*85) + "px"; 
            el.style.top = (145 + row*105) + "px";
        });
    }, 11000);

    setTimeout(() => {
        cineText.innerText = ""; 
    }, 13000);

    setTimeout(() => {
        let btnWrapper = document.createElement("div");
        btnWrapper.style.cssText = "position:absolute; bottom:30px; left:0; width:100%; display:flex; justify-content:center; z-index:300;";

        let btn = document.createElement("button");
        btn.innerHTML = "⚔️ DEUS VULT !";
        btn.className = "txt-animado-salto";
        btn.style.cssText = "background:#8b0000; color:#fff; border:2px solid #ff4c4c; padding:15px 35px; font-family:'Cinzel', serif; font-weight:bold; font-size:20px; cursor:pointer; box-shadow:0 0 25px #ff4c4c; transition: all 0.2s;";
        
        btn.onmouseover = () => { btn.style.background = "#ff0000"; btn.style.boxShadow = "0 0 35px #ff0000"; };
        btn.onmouseout = () => { btn.style.background = "#8b0000"; btn.style.boxShadow = "0 0 25px #ff4c4c"; };
        
        btn.onclick = () => {
            outerContainer.remove();
            if(overlay) {
                Array.from(overlay.children).forEach(c => c.style.display = "");
                overlay.style.display = "none";
            }
            if(callbackFinal) callbackFinal();
        };
        
        btnWrapper.appendChild(btn);
        btnContainer.appendChild(btnWrapper); 
    }, 14000);
}