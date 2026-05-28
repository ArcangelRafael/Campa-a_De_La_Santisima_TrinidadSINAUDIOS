/* === RENDER_COMBATE.JS - EL DIRECTOR VISUAL DE LA GUERRA === */

const RenderCombate = {
    htmlCabeceraTurno: function(turno) {
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div class='banner-turno' style='margin:0;'>TURNO ${turno}</div>
            <button class="btn-lanzar-todos" onclick="tirarTodosLosDados(this)">TIRAR TODOS LOS DADOS</button>
        </div>`;
    },

    htmlAvanceLibre: function(nombre) {
        return `<p class="txt-accion">— ${nombre} avanza sin resistencia.</p>`;
    },

    htmlChoqueCuna: function(d) {
        if (d.autoCombat) {
            return `<div class="bloque-combate"><b class="txt-sagrado">Choque en ${d.posNombre}:</b><br>${d.tropaNombre} vs ${d.enemigoNombre}
                <div class="math-log">⚔️ ATAQUE de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + ${d.dadoGracia} (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b>${d.pAtk}</b><br>🛡️ DEFENSA de ${d.enemigoNombre}: ${d.defBase} (Base) + ${d.dadoFuria} (Furia) = <b>${d.pDef}</b></div>
                <div style="margin-top:5px;">${d.phase1Cons}</div>
            </div>`;
        } else {
            return `<div class="bloque-combate pendiente-dados" id="${d.idBc}" ${d.hasMelee ? `data-next-block="${d.idBcMelee}"` : ''}>
                <b class="txt-sagrado">Choque en ${d.posNombre}:</b><br>${d.tropaNombre} vs ${d.enemigoNombre}
                <div class="math-log">
                    ⚔️ ATAQUE de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + <span class="dado-hide al-dado" data-val="${d.dadoGracia}">__</span> (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b class="total-hide" data-val="${d.pAtk}">??</b><br>
                    🛡️ DEFENSA de ${d.enemigoNombre}: ${d.defBase} (Base) + <span class="dado-hide en-dado" data-val="${d.dadoFuria}">__</span> (Furia) = <b class="total-hide" data-val="${d.pDef}">??</b>
                </div>
                <div class="consecuencia-hide" style="display:none; margin-top:5px;">${d.phase1Cons}</div>
                <div class="panel-lanzamiento" style="display:flex; gap:15px; align-items:center; margin-top:10px; padding-top:10px; border-top:1px dashed #555;">
                     <button class="btn-lanzar-dados" onclick="resolverDadosBloque(this, '${d.idBc}')">LANZAR DADOS</button>
                     <div class="video-zona" style="display:flex; gap:10px;"></div>
                </div>
            </div>`;
        }
    },

    htmlMeleeCuna: function(d) {
        if (d.autoCombat) {
            return `<div class="bloque-combate" style="margin-top:10px; border-left:4px solid #ffaa00; padding-left:10px;">
                <div class="math-log">⚔️ RESPUESTA de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + ${d.dadoGracia2} (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b>${d.pAtk2}</b><br>🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + ${d.dadoFuria2} (Furia) = <b>${d.pAtkEnemigo}</b></div>
                <div style="margin-top:5px;">${d.phase2Cons}</div>
            </div>`;
        } else {
            return `<div class="bloque-combate pendiente-dados" id="${d.idBcMelee}" style="display:none; margin-top:10px; border-left:4px solid #ffaa00; padding-left:10px;">
                <div class="math-log">
                    ⚔️ RESPUESTA de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + <span class="dado-hide al-dado" data-val="${d.dadoGracia2}">__</span> (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b class="total-hide" data-val="${d.pAtk2}">??</b><br>
                    🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + <span class="dado-hide en-dado" data-val="${d.dadoFuria2}">__</span> (Furia) = <b class="total-hide" data-val="${d.pAtkEnemigo}">??</b>
                </div>
                <div class="consecuencia-hide" style="display:none; margin-top:5px;">${d.phase2Cons}</div>
                <div class="panel-lanzamiento" style="display:flex; gap:15px; align-items:center; margin-top:10px; padding-top:10px; border-top:1px dashed #555;">
                     <button class="btn-lanzar-dados" onclick="resolverDadosBloque(this, '${d.idBcMelee}')">DESARROLLAR COMBATE CUERPO A CUERPO</button>
                     <div class="video-zona" style="display:flex; gap:10px;"></div>
                </div>
            </div>`;
        }
    },

    htmlAsaltoPicas: function(d) {
        if (d.autoCombat) {
            return `<div class="bloque-combate"><b class="txt-comendador">Asalto en ${d.posNombre}:</b><br>${d.enemigoNombre} embiste a ${d.tropaNombre}
                <div class="math-log">🛡️ DEFENSA de ${d.tropaNombre}: ${d.defBase} (Base)${d.stringHerido} + ${d.dadoGracia} (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b>${d.pDefAliado}</b><br>🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + ${d.dadoFuria} (Furia) = <b>${d.pAtkEnemigo}</b></div>
                <div style="margin-top:5px;">${d.phase1Cons}</div>
            </div>`;
        } else {
            return `<div class="bloque-combate pendiente-dados" id="${d.idBc}" ${d.hasCounter ? `data-next-block="${d.idBcCounter}"` : ''}>
                <b class="txt-comendador">Asalto en ${d.posNombre}:</b><br>${d.enemigoNombre} embiste a ${d.tropaNombre}
                <div class="math-log">
                    🛡️ DEFENSA de ${d.tropaNombre}: ${d.defBase} (Base)${d.stringHerido} + <span class="dado-hide al-dado" data-val="${d.dadoGracia}">__</span> (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b class="total-hide" data-val="${d.pDefAliado}">??</b><br>
                    🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + <span class="dado-hide en-dado" data-val="${d.dadoFuria}">__</span> (Furia) = <b class="total-hide" data-val="${d.pAtkEnemigo}">??</b>
                </div>
                <div class="consecuencia-hide" style="display:none; margin-top:5px;">${d.phase1Cons}</div>
                <div class="panel-lanzamiento" style="display:flex; gap:15px; align-items:center; margin-top:10px; padding-top:10px; border-top:1px dashed #555;">
                     <button class="btn-lanzar-dados" onclick="resolverDadosBloque(this, '${d.idBc}')">LANZAR DADOS</button>
                     <div class="video-zona" style="display:flex; gap:10px;"></div>
                </div>
            </div>`;
        }
    },

    htmlContraataquePicas: function(d) {
        if (d.autoCombat) {
            return `<div class="bloque-combate" style="margin-top:10px; border-left:4px solid #88ff88; padding-left:10px;">
                <div class="math-log">⚔️ ATAQUE de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + ${d.dadoGracia2} (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b>${d.pAtkAliado}</b><br>🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + ${d.dadoFuria2} (Furia) = <b>${d.pAtkEnemigo2}</b></div>
                <div style="margin-top:5px;">${d.phase2Cons}</div>
            </div>`;
        } else {
            return `<div class="bloque-combate pendiente-dados" id="${d.idBcCounter}" style="display:none; margin-top:10px; border-left:4px solid #88ff88; padding-left:10px;">
                <div class="math-log">
                    ⚔️ ATAQUE de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + <span class="dado-hide al-dado" data-val="${d.dadoGracia2}">__</span> (Gracia) <span class="${d.classMod}">${d.signoMod} (${d.infoFeNombre})</span> = <b class="total-hide" data-val="${d.pAtkAliado}">??</b><br>
                    🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + <span class="dado-hide en-dado" data-val="${d.dadoFuria2}">__</span> (Furia) = <b class="total-hide" data-val="${d.pAtkEnemigo2}">??</b>
                </div>
                <div class="consecuencia-hide" style="display:none; margin-top:5px;">${d.phase2Cons}</div>
                <div class="panel-lanzamiento" style="display:flex; gap:15px; align-items:center; margin-top:10px; padding-top:10px; border-top:1px dashed #555;">
                     <button class="btn-lanzar-dados" onclick="resolverDadosBloque(this, '${d.idBcCounter}')">DESARROLLAR CONTRAATAQUE</button>
                     <div class="video-zona" style="display:flex; gap:10px;"></div>
                </div>
            </div>`;
        }
    },

    htmlChoqueSacrificio: function(d) {
        if (d.autoCombat) {
            return `<div class='bloque-combate'><b class='txt-hereje'>Duelo a Muerte en ${d.posNombre}:</b><br>${d.tropaNombre} vs ${d.enemigoNombre}
                <div class='math-log'>⚔️ ATAQUE de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + ${d.dadoGracia} (Gracia) <span class='${d.classMod}'>${d.signoMod} (${d.infoFeNombre})</span> = <b>${d.pAtkAliado}</b><br>🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + ${d.dadoFuria} (Furia) = <b>${d.pAtkEnemigo}</b></div>
                <div style='margin-top:5px;'>${d.phase1Cons}</div>
            </div>`;
        } else {
            return `<div class='bloque-combate pendiente-dados' id='${d.idBc}'>
                <b class='txt-hereje'>Duelo a Muerte en ${d.posNombre}:</b><br>${d.tropaNombre} vs ${d.enemigoNombre}
                <div class='math-log'>
                    ⚔️ ATAQUE de ${d.tropaNombre}: ${d.atkBase} (Base)${d.stringHerido} + <span class='dado-hide al-dado' data-val='${d.dadoGracia}'>__</span> (Gracia) <span class='${d.classMod}'>${d.signoMod} (${d.infoFeNombre})</span> = <b class='total-hide' data-val='${d.pAtkAliado}'>??</b><br>
                    🗡️ ATAQUE de ${d.enemigoNombre}: ${d.atkEnemigoBase} (Base) + <span class='dado-hide en-dado' data-val='${d.dadoFuria}'>__</span> (Furia) = <b class='total-hide' data-val='${d.pAtkEnemigo}'>??</b>
                </div>
                <div class='consecuencia-hide' style='display:none; margin-top:5px;'>${d.phase1Cons}</div>
                <div class='panel-lanzamiento' style='display:flex; gap:15px; align-items:center; margin-top:10px; padding-top:10px; border-top:1px dashed #555;'>
                     <button class='btn-lanzar-dados' style='background:#8b0000; border-color:#ff4c4c; color:#fff;' onclick="resolverDadosBloque(this, '${d.idBc}')">DESENVAINAR ESPADAS (LANZAR DADOS)</button>
                     <div class='video-zona' style='display:flex; gap:10px;'></div>
                </div>
            </div>`;
        }
    },

    htmlCartaBallestero: function(d) {
        if (d.cooldown > 0) {
            return `<div class="item-card-desplegado ${d.claseBorde}" style="filter:grayscale(100%); opacity:0.6;">
                <img src="${d.img}">
                <div class="unidad-nombre-aleatorio">${d.nombre}</div>
                <p class="txt-hereje" style="font-size:11px; margin:5px 0;">Recargando (${d.cooldown}T)</p>
            </div>`;
        } else {
            if (d.autoCombat) {
                return `<div class="item-card-desplegado ${d.claseBorde}">
                    <img src="${d.img}">
                    <div class="unidad-nombre-aleatorio">${d.nombre}</div>
                    <p style="font-size:11px; margin:5px 0; border-top:1px solid #444;">${d.textoDado}<br>${d.resultadoTexto}</p>
                </div>`;
            } else {
                return `<div class="item-card-desplegado ${d.claseBorde} pendiente-dados" id="${d.idBc}" style="position:relative; overflow:hidden;">
                    <img src="${d.img}">
                    <div class="unidad-nombre-aleatorio">${d.nombre}</div>
                    <p style="font-size:11px; margin:5px 0; border-top:1px solid #444; position:relative; z-index:2;">
                        ${d.textoDado}<br>
                        <span class="consecuencia-hide" style="display:none;">${d.resultadoTexto}</span>
                    </p>
                    <div class="hover-lanzar-overlay">
                        <button class="btn-lanzar-dados" style="font-size:10px; padding:5px 10px;" onclick="resolverDadosBosque(this, '${d.idBc}')">LANZAR DADO</button>
                    </div>
                    <div class="video-zona" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); z-index:5; pointer-events:none;"></div>
                </div>`;
            }
        }
    },

    htmlEnemigoPica: function(estado) {
        if (estado === "muerto") return `<div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; font-size:35px; opacity:0.7;">☠️</div>`;
        if (estado === "vacio") return "";
        return `<div class="enemigo-hp-combate" style="display:block;">🤍</div><img class="enemigo-img" src="assets/img/personajes/enemigos/enemigo.webp" style="width:100%;height:100%;object-fit:cover; border-radius:3px;">`;
    },

    // FIX TÁCTICO - GLOBALIZACIÓN DRY: Lee la vida de Database.js
    htmlFichaCinematica: function(tr) {
        let dbKey = tr.tipoGeneral.replace(/s$/, '') + '_' + (tr.clase === 'mercenaria' ? 'mercenario' : tr.clase);
        if (tr.clase === 'unico') dbKey = 'sacerdote_unico';
        if (tr.clase === 'unico_random') dbKey = 'explorador_unico';
        
        let maxVida = 2;
        if (typeof bdTiposTropa !== 'undefined' && bdTiposTropa[dbKey]) {
            maxVida = bdTiposTropa[dbKey].hp;
        } else if (tr.hpMax) {
            maxVida = tr.hpMax;
        }

        let hpStars = "❤️".repeat(Math.max(0, tr.hp)) + "🖤".repeat(Math.max(0, maxVida - Math.max(0, tr.hp)));
        let etiqueta = tr.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        
        return `<img src="${tr.img}">
                <div class="unidad-hp-combate" style="display:block !important; z-index:200;">${hpStars}</div>
                <div class="unidad-nombre-aleatorio" style="display:block; position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.75); color:#fff; font-size:8px; padding:2px 0; z-index:200; text-align:center;">${tr.nombre} <br>${etiqueta}</div>`;
    },

    htmlFichaTropaInner: function(tr) {
        return this.htmlFichaCinematica(tr); 
    },

    htmlResumenTurno: function(numTurno, perforadores, bajas) {
        let texto = `<b>RESUMEN DEL TURNO ${numTurno}</b><br>`;
        if (perforadores && perforadores.length > 0) {
            texto += `Caballeros en combate activo: <span class="mensaje-sistema">${perforadores.join(", ")}</span>.<br>`;
        }
        texto += `Enemigos abatidos: <span class="txt-hereje">${bajas}</span>`;
        return `<div class="resumen-turno-box resumen-oculto" style="display:none;">${texto}</div>`;
    },

    htmlPolvoSeAsienta: function(victoria, soldadosCaidos, bajas, feGanada, displayStyle) {
        let textoCaidos = soldadosCaidos > 0 ? `<p class="txt-hereje" style="font-style:italic;">Hemos sepultado a ${soldadosCaidos} hermanos en tierra profanada. Que el Señor los reciba en Su Reino.</p>` : `<p class="mensaje-sistema">¡Milagro de la Providencia! Ningún hermano ha perecido permanentemente en esta lid.</p>`;
        let textoBajas = `<p class="txt-multitud"><b>Bajas enemigas confirmadas en esta maniobra:</b> <span class="txt-hereje">${bajas} herejes eliminados.</span></p>`;
        let textoFe = victoria ? `<p class="txt-sagrado">[+${feGanada} de Fervor por la victoria]</p>` : `<p class="txt-hereje">[Misión Fallida: La línea ha cedido.]</p>`;
        return `<div class='resumen-turno-box resumen-oculto' style='border-color:#ff4c4c; display:${displayStyle};'><h3 class='txt-hereje' style='margin:0;'>EL POLVO SE ASIENTA</h3>${textoBajas}${textoCaidos}${textoFe}</div>`;
    },

    htmlAlertaBajas: function(nombresBajas, displayStyle) {
        return `<div class='resumen-oculto' style='display:${displayStyle};'><div class='separador'>***</div><span class='txt-sagrado'>¡Alerta en la hueste! Los hermanos ${nombresBajas} acaban de caer. ¿Deseáis enviar refuerzos desde la reserva?</span></div>`;
    },

    htmlLlegadaRefuerzos: function(lugarteniente, nombresNuevos) {
        return `<p class='txt-sagrado' style='font-family:"Cinzel", serif; text-align:center;'><b>${lugarteniente}:</b> "¡Por Cristo! ¡${nombresNuevos}! ¡Ocupad vuestro lugar y no cedáis! ¡AL COMBATE!"</p>`;
    },

    htmlCierreSinRefuerzos: function(jugadorNombre) {
        return `<p class='txt-comendador'><b>${jugadorNombre}:</b> "Cerraremos filas con los que quedamos, el Señor es nuestro escudo."</p>`;
    }
};