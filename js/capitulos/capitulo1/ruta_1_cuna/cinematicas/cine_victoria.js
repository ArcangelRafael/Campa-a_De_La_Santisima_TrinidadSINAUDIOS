/* === CINE_VICTORIA.JS - CINEMÁTICA DE VICTORIA DECISIVA (LA CUÑA DE ACERO) === */

function playCinematicaVictoria(callbackFinal, modoSaetas = false) {
    let skipCine = document.getElementById("ht-skip-cine")?.checked;
    if(skipCine) {
        if(callbackFinal) callbackFinal();
        return;
    }

    let overlay = document.getElementById("formacion-overlay");
    if(overlay) {
        overlay.style.display = "flex";
        Array.from(overlay.children).forEach(c => c.style.display = "none");
        // Inyectamos la estructura global desde RenderCombate
        overlay.insertAdjacentHTML('beforeend', RenderCombate.htmlCineEstructuraGlobal());
    }

    let outerContainer = document.getElementById("cine-victoria-outer");
    let cineText = document.getElementById("cine-victoria-text");
    let world = document.getElementById("cine-victoria-world");
    let btnContainer = document.getElementById("cine-victoria-btn-container");

    // =========================================================================
    // RENDER DE MARCADORES ACUMULADOS (Tijeras aplicadas)
    // =========================================================================
    const LIMITE_SUPERIOR = 160;
    const LIMITE_INFERIOR = 420;

    if (window.marcadoresBatalla && window.marcadoresBatalla.length > 0) {
        window.marcadoresBatalla.forEach(m => {
            let leftPx = 0; let topPx = 0;
            if (m.slotPos) {
                let pIndex = parseInt(m.slotPos.split("-")[1]) - 1; 
                if (isNaN(pIndex)) pIndex = Math.floor(Math.random() * 4);
                let topsPica = [70, 200, 400, 520]; 
                leftPx = 220 + (Math.random() * 60); 
                topPx = topsPica[pIndex % 4] + (Math.random() * 40 - 20); 
            } else if (m.row !== undefined && m.col !== undefined) {
                let tops = [15, 32, 50, 68, 85]; 
                let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84, "3": 95 };
                leftPx = (cols[m.col] || 50) / 100 * 900; 
                topPx = (tops[m.row] || 50) / 100 * 600;
            }
            topPx = Math.max(LIMITE_SUPERIOR, Math.min(topPx, LIMITE_INFERIOR));
            world.insertAdjacentHTML('beforeend', RenderCombate.htmlCineMarcador(m.tipo, leftPx, topPx));
        });
    }

    if (window.marcadoresBosquePersistentes && window.marcadoresBosquePersistentes.length > 0) {
        window.marcadoresBosquePersistentes.forEach(m => {
            let numSlot = m.slotPos ? parseInt(m.slotPos.split("-").pop()) || Math.floor(Math.random() * 4) + 1 : 1;
            let leftPx = m.tipo === 'cross' ? 430 + (Math.random() * 30) : 500 + (Math.random() * 60);
            let topPx = (152 + ((numSlot - 1) * 65)) + (Math.random() * 40 - 20);
            
            topPx = Math.max(LIMITE_SUPERIOR, Math.min(topPx, LIMITE_INFERIOR));
            world.insertAdjacentHTML('beforeend', RenderCombate.htmlCineMarcador(m.tipo, leftPx, topPx));
        });
    }

    // =========================================================================
    // CREADOR DE UNIDADES (DRY - Delega el HTML)
    // =========================================================================
    function createUnit(tropa, isEnemy = false, isBoss = false, label = "", specificImg = null, flipImg = false) {
        let el = document.createElement("div");
        el.className = "soldier-frame tropa-cine-victoria";
        
        let flipStyle = flipImg ? " scaleX(-1)" : "";
        let imgTransform = isBoss ? `transform: scale(1.35)${flipStyle};` : (flipStyle ? `transform:${flipStyle};` : "");

        if (isEnemy) {
            el.classList.add("tropa-mercenaria", isBoss ? "tropa-cine-enemigo-boss" : "tropa-cine-enemigo");
            let imgSource = specificImg ? specificImg : "assets/img/personajes/enemigos/enemigo.webp";
            el.innerHTML = RenderCombate.htmlCineEnemigo(imgSource, imgTransform, label, isBoss);
        } else {
            let claseBorde = tropa?.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
            el.classList.add("tropa-draggable", claseBorde);
            el.innerHTML = RenderCombate.htmlFichaCinematica(tropa);
            if (flipImg) {
                let img = el.querySelector("img");
                if (img) img.style.transform = "scaleX(-1)";
            }
        }
        world.appendChild(el);
        return el;
    }

    let unitEls = { knights: [], archers: [], pikes: [], enemies: [], bosses: [], alliedBosses: [] };

    let knights = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0);
    let archers = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    let pikes = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);

    // DEPLOY: PIQUEROS
    let pikesTopCount = Math.ceil(pikes.length / 2);
    let espaciadoPicas = Math.min(75, 400 / Math.max(1, pikesTopCount - 1));
    let pikemenEnMuro = Math.min(pikes.length, 4);
    let startTopWall = 250 - ((pikemenEnMuro - 1) * 65) / 2;

    pikes.forEach((p, i) => {
        let el = createUnit(p);
        let isTop = i < pikesTopCount;
        let targetLeft = 160 + (isTop ? i : i - pikesTopCount) * espaciadoPicas;
        let targetTop = isTop ? 25 : 475;

        if (modoSaetas && i < 4) {
            el.style.left = "450px"; el.style.top = (startTopWall + i * 65) + "px"; 
            el.dataset.inWall = "true";
        } else {
            el.style.left = targetLeft + "px"; el.style.top = targetTop + "px";
            el.dataset.inWall = "false";
        }
        el.dataset.targetLeft = targetLeft; el.dataset.targetTop = targetTop;
        unitEls.pikes.push(el);
    });

    // DEPLOY: BALLESTEROS
    archers.forEach((a, i) => {
        let el = createUnit(a);
        el.style.left = (300 - Math.floor(i / 3) * 80) + "px"; 
        el.style.top = (150 + (i % 3) * 100) + "px"; 
        unitEls.archers.push(el);
    });

    // DEPLOY: CABALLEROS RASOS
    knights.forEach((k, i) => {
        let el = createUnit(k, false, false, "", null, true);
        el.style.left = (-310 - i*60) + "px"; el.style.top = "250px"; 
        unitEls.knights.push(el);
    });

    // DEPLOY: LÍDERES ALIADOS
    let playerEl = document.createElement("div");
    playerEl.className = "soldier-frame tropa-cine-victoria tropa-draggable tropa-noble caballero-reserva tropa-cine-aliado-boss";
    playerEl.style.left = "-150px"; playerEl.style.top = "250px";
    playerEl.innerHTML = RenderCombate.htmlCineAliadoBoss("assets/img/personajes/aliados/jugador.webp", `COMENDADOR ${jugador.nombre || "Lord Tester"}`);
    world.appendChild(playerEl); unitEls.alliedBosses.push(playerEl);

    let alexEl = document.createElement("div");
    alexEl.className = "soldier-frame tropa-cine-victoria tropa-draggable tropa-noble caballero-reserva tropa-cine-aliado-boss";
    alexEl.style.left = "-230px"; alexEl.style.top = "150px";
    alexEl.innerHTML = RenderCombate.htmlCineAliadoBoss("assets/img/personajes/aliados/lider_caballeromontado.webp", "Sir Alexandro");
    world.appendChild(alexEl); unitEls.alliedBosses.push(alexEl);

    // DEPLOY: ENEMIGOS
    for(let i=0; i<9; i++) {
        let el = createUnit(null, true, false, ""); 
        el.style.left = (550 + Math.floor(i / 3)*85) + "px"; el.style.top = (145 + (i % 3)*105) + "px";
        unitEls.enemies.push(el);
    }

    // DEPLOY: JEFES ENEMIGOS
    let ge = createUnit(null, true, true, "Gral. Joanjoz", "assets/img/personajes/enemigos/generale.webp", true);
    ge.style.left = "1300px"; ge.style.top = "250px"; unitEls.bosses.push(ge);

    let le1 = createUnit(null, true, true, "LUGARTENIENTE SAA'AD", "assets/img/personajes/enemigos/lugarte1.webp", true);
    le1.style.left = "1420px"; le1.style.top = "40px"; unitEls.bosses.push(le1);
    
    let le2 = createUnit(null, true, true, "LUGARTENIENTE OTHMAN", "assets/img/personajes/enemigos/lugarte2.webp", true);
    le2.style.left = "1420px"; le2.style.top = "250px"; unitEls.bosses.push(le2);
    
    let le3 = createUnit(null, true, true, "LUGARTENIENTE FARID", "assets/img/personajes/enemigos/lugarte3.webp", true);
    le3.style.left = "1420px"; le3.style.top = "460px"; unitEls.bosses.push(le3);

    // DEPLOY: CAUTIVOS
    for(let i=0; i<5; i++) {
        let cautivo = document.createElement("div");
        cautivo.className = "soldier-frame tropa-cine-victoria cine-cautivo";
        cautivo.innerHTML = RenderCombate.htmlCineCautivo();
        cautivo.style.left = (1420 + Math.random() * 20) + "px";
        cautivo.style.top = (140 + i * 60) + "px";
        world.appendChild(cautivo);
    }
    
    // COREOGRAFÍA 
    setTimeout(() => { 
        cineText.innerText = modoSaetas ? "¡Piqueros, abrid formación! ¡Ballesteros, despejad!" : "¡Ballesteros, abrid paso a la Caballería!"; 
    }, 0); 
    
    setTimeout(() => {
        let maxCol = Math.max(0, Math.floor((unitEls.archers.length - 1) / 3));
        let countUp = 0; let countDown = 0;

        unitEls.archers.forEach((el, i) => {
            let col = Math.floor(i / 3); let row = i % 3;
            let goesUp = (row === 0) ? true : (row === 2 ? false : (col % 2 === 0)); 
            let delay = (maxCol - col) * 0.2; 
            
            el.style.transition = `all 1.5s ease-in-out ${delay}s`;
            el.style.top = goesUp ? "105px" : "395px";
            el.style.left = (300 - (goesUp ? countUp++ : countDown++) * 55) + "px"; 
        });

        if (modoSaetas) {
            unitEls.pikes.filter(el => el.dataset.inWall === "true").forEach(el => {
                el.style.transition = "top 0.8s ease-in-out";
                el.style.top = el.dataset.targetTop + "px";
                setTimeout(() => {
                    el.style.transition = "left 1.2s ease-out";
                    el.style.left = el.dataset.targetLeft + "px";
                }, 800);
            });
        }
    }, 0);

    setTimeout(() => { cineText.innerText = "¡La hueste avanza por el claro!"; }, 1500); 

    setTimeout(() => {
        unitEls.alliedBosses[0].style.transition = "all 4s linear"; unitEls.alliedBosses[0].style.left = "250px";
        unitEls.alliedBosses[1].style.transition = "all 4s linear"; unitEls.alliedBosses[1].style.left = "170px";
        unitEls.knights.forEach((el, i) => {
            el.style.transition = "all 4s linear"; el.style.left = (90 - i*60) + "px";
        });
    }, 1500);

    setTimeout(() => {
        world.style.transform = "translateX(-600px)";
        unitEls.enemies.forEach((el, i) => {
            el.style.transition = "all 4.5s ease-out"; el.style.left = (1080 + Math.floor(i / 3)*85) + "px"; 
        });
    }, 3800); 

    setTimeout(() => {
        unitEls.alliedBosses[0].style.transition = "all 5.5s cubic-bezier(0.25, 1, 0.5, 1)";
        unitEls.alliedBosses[0].style.left = "840px"; unitEls.alliedBosses[0].style.top = "250px";

        unitEls.alliedBosses[1].style.transition = "all 5.5s cubic-bezier(0.25, 1, 0.5, 1)";
        unitEls.alliedBosses[1].style.left = "760px"; unitEls.alliedBosses[1].style.top = "150px";

        let wedgeCoords = [
            {x: 680, y: 250}, {x: 600, y: 150}, {x: 600, y: 350},
            {x: 520, y: 50},  {x: 520, y: 450}, {x: 440, y: 250},
            {x: 440, y: 150}, {x: 440, y: 350} 
        ];

        unitEls.knights.forEach((el, i) => {
            el.style.transition = "all 5.5s cubic-bezier(0.25, 1, 0.5, 1)"; 
            let target = wedgeCoords[i] || { x: 440 - (i*40), y: 250 }; 
            el.style.left = target.x + "px"; el.style.top = target.y + "px";
        });
    }, 5800); 

    setTimeout(() => { cineText.innerText = "¡Los herejes retroceden ante el avance incesante!"; }, 6000); 

    setTimeout(() => {
        cineText.innerText = "¡Las filas enemigas se abren!";
        unitEls.enemies.forEach((el, i) => {
            let row = i % 3;
            let goesUp = (row === 0) ? true : (row === 2 ? false : (Math.floor(i / 3) % 2 === 0)); 
            el.style.transition = "all 1.5s ease-in-out"; el.style.top = goesUp ? "130px" : "370px"; 
        });
    }, 8000); 

    setTimeout(() => {
        cineText.innerText = "¡Los líderes dan un paso al frente!";
        unitEls.bosses[0].style.transition = "all 2s ease-out"; unitEls.bosses[0].style.left = "980px"; unitEls.bosses[0].style.top = "250px";
        unitEls.bosses[2].style.transition = "all 2s ease-out"; unitEls.bosses[2].style.left = "1060px"; unitEls.bosses[2].style.top = "340px";
        
        unitEls.alliedBosses[0].style.transition = "all 2s ease-out"; unitEls.alliedBosses[0].style.left = "880px"; unitEls.alliedBosses[0].style.top = "250px";
        unitEls.alliedBosses[1].style.transition = "all 2s ease-out"; unitEls.alliedBosses[1].style.left = "800px"; unitEls.alliedBosses[1].style.top = "160px"; 
    }, 9500);

    setTimeout(() => {
        unitEls.enemies.forEach((el, i) => {
            el.style.transition = "all 1.5s ease-in-out"; 
            el.style.left = (1160 + Math.floor(i / 3)*85) + "px"; el.style.top = (145 + (i % 3)*105) + "px";
        });
    }, 12000);

    setTimeout(() => { cineText.innerText = ""; }, 14000);

    setTimeout(() => {
        btnContainer.innerHTML = RenderCombate.htmlCineBotonVictoria();
        document.getElementById("cine-btn-deus-vult").onclick = () => {
            outerContainer.remove();
            if(overlay) { Array.from(overlay.children).forEach(c => c.style.display = ""); overlay.style.display = "none"; }
            if(callbackFinal) callbackFinal();
        };
    }, 15000); 
}