/* === TABLEROS.JS - GENERACIÓN DINÁMICA DE CAMPOS DE BATALLA === */

function inyectarTableroCuna() {
    const tablero = document.getElementById("formacion-tablero");
    if (!tablero) return;
    
    tablero.innerHTML = `
        <div id="zona-reservas" style="display:none; grid-template-columns: repeat(2, 75px); gap:10px; margin-left:15px; align-content:center; justify-content:center; border-right:2px dashed #333; padding-right:15px;"></div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-left: 15px;">
            <div style="display:grid; grid-template-columns: repeat(3, 75px); grid-template-rows: repeat(5, 75px); gap:10px; padding:10px; border:2px solid transparent; box-sizing:border-box;">
                <div class="slot-formacion valid-start" data-pos="trasera-arriba" id="aliado-0--3"></div>
                <div class="invisible-slot" id="aliado-0--2"></div>
                <div class="invisible-slot" id="aliado-0--1"></div>
                <div class="invisible-slot" id="aliado-1--3"></div>
                <div class="slot-formacion valid-start" data-pos="media-arriba" id="aliado-1--2"></div>
                <div class="invisible-slot" id="aliado-1--1"></div>
                <div class="invisible-slot" id="aliado-2--3"></div>
                <div class="invisible-slot" id="aliado-2--2"></div>
                <div class="slot-formacion slot-lider valid-start" data-pos="punta" id="aliado-2--1"></div>
                <div class="invisible-slot" id="aliado-3--3"></div>
                <div class="slot-formacion valid-start" data-pos="media-abajo" id="aliado-3--2"></div>
                <div class="invisible-slot" id="aliado-3--1"></div>
                <div class="slot-formacion valid-start" data-pos="trasera-abajo" id="aliado-4--3"></div>
                <div class="invisible-slot" id="aliado-4--2"></div>
                <div class="invisible-slot" id="aliado-4--1"></div>
            </div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-left: auto; margin-right: 20px;">
            <div id="grid-enemigo" style="display:grid; grid-template-columns: repeat(4, 75px); grid-template-rows: repeat(5, 75px); gap:10px; padding:10px; border:2px solid transparent; box-sizing:border-box;">
                <div class="slot-enemigo" id="enemigo-0-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-0-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="enemigo-0-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="invisible-slot" id="enemigo-0-3" style="position:relative;"></div>
                <div class="slot-enemigo" id="enemigo-1-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-1-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-1-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="invisible-slot" id="enemigo-1-3" style="position:relative;"></div>
                <div class="slot-enemigo" id="enemigo-2-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-2-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-2-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="invisible-slot" id="enemigo-2-3" style="position:relative;"></div>
                <div class="slot-enemigo" id="enemigo-3-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-3-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-3-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="invisible-slot" id="enemigo-3-3" style="position:relative;"></div>
                <div class="slot-enemigo" id="enemigo-4-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="enemigo-4-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="enemigo-4-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="invisible-slot" id="enemigo-4-3" style="position:relative;"></div>
            </div>
        </div>
    `;
}

function inyectarTableroPicas() {
    const tablero = document.getElementById("formacion-picas-tablero");
    if (!tablero) return;

    tablero.innerHTML = `
        <div id="zona-reservas-picas" style="display:none; grid-template-columns: repeat(2, 75px); gap:10px; margin-left:15px; align-content:center; justify-content:center; border-right:2px dashed #333; padding-right:15px;"></div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-left: 15px;">
            <div style="display:grid; grid-template-columns: repeat(2, 75px); grid-template-rows: repeat(2, 75px); gap:10px; padding:10px; border:2px solid transparent; box-sizing:border-box; margin-bottom: 40px;">
                <div class="slot-formacion valid-start" data-pos="pica-1" id="pica-slot-1"></div>
                <div class="slot-formacion valid-start" data-pos="pica-2" id="pica-slot-2" style="transform: translateY(42px);"></div>
                <div class="slot-formacion valid-start" data-pos="pica-3" id="pica-slot-3"></div>
                <div class="slot-formacion valid-start" data-pos="pica-4" id="pica-slot-4" style="transform: translateY(42px);"></div>
            </div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-left: auto; margin-right: 20px;">
            <div id="grid-enemigo-picas" style="display:grid; grid-template-columns: repeat(3, 75px); grid-template-rows: repeat(3, 75px); gap:10px; padding:10px; border:2px solid transparent; box-sizing:border-box;">
                <div class="slot-enemigo" id="en-pica-0-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-0-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-0-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-1-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="en-pica-1-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="en-pica-1-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-2-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-2-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-2-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
            </div>
        </div>
    `;
}

// FIX TÁCTICO: Nuevo tablero exclusivo para el duelo de espadas (3 espacios verticales)
function inyectarTableroSacrificio() {
    const tablero = document.getElementById("formacion-picas-tablero");
    if (!tablero) return;

    tablero.innerHTML = `
        <div id="zona-reservas-picas" style="display:none; grid-template-columns: repeat(2, 75px); gap:10px; margin-left:15px; align-content:center; justify-content:center; border-right:2px dashed #333; padding-right:15px;"></div>

        <div style="display:flex; flex-direction:column; align-items:flex-end; justify-content:center; flex-grow: 1; margin-right: 15px;">
            <div style="display:grid; grid-template-columns: 75px; grid-template-rows: repeat(3, 75px); gap:15px; padding:10px; border:2px solid transparent; box-sizing:border-box;">
                <div class="slot-formacion valid-start" data-pos="sacrificio-1" id="pica-slot-1"></div>
                <div class="slot-formacion valid-start" data-pos="sacrificio-2" id="pica-slot-2"></div>
                <div class="slot-formacion valid-start" data-pos="sacrificio-3" id="pica-slot-3"></div>
            </div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:flex-start; justify-content:center; margin-right: 40px;">
            <div id="grid-enemigo-picas" style="display:grid; grid-template-columns: repeat(3, 75px); grid-template-rows: repeat(3, 75px); gap:10px; padding:10px; border:2px solid transparent; box-sizing:border-box;">
                <div class="slot-enemigo" id="en-pica-0-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-0-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-0-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-1-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="en-pica-1-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo_piquero.webp"></div>
                <div class="slot-enemigo" id="en-pica-1-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-2-0"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-2-1"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
                <div class="slot-enemigo" id="en-pica-2-2"><div class="enemigo-hp-combate">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp"></div>
            </div>
        </div>
    `;
}