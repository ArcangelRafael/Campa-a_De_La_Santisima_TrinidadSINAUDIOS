/* === SISTEMA_REFUERZOS.JS - GESTIÓN DE BAJAS Y REPOSICIONES === */

function cerrarMesaDeGuerra() {
    let btnReporte = document.getElementById("btn-ver-reporte");
    if(btnReporte) btnReporte.style.display = "none";
    
    document.getElementById("formacion-overlay").style.display = "none";
    
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.logTurnoGlobal.forEach(html => {
        const parrafo = document.createElement("div"); 
        parrafo.innerHTML = html;
        
        let ocultos = parrafo.querySelectorAll('.resumen-oculto');
        if (!autoCombat && ocultos.length > 0) {
            ocultos.forEach(el => el.style.display = 'none');
        }
        storyArea.appendChild(parrafo); 
    });
    
    let pending = document.querySelectorAll('.pendiente-dados').length > 0;
    if (!pending) {
        evaluarBajasYContinuar();
    }
}

function evaluarBajasYContinuar() {
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    if (EstadoBatalla.tipoCombate === "picas" && EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) { 
        evaluarContinuacionBatalla(); 
        return; 
    }
    if (EstadoBatalla.tipoCombate === "picas_bosque" && EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) { 
        evaluarContinuacionBatalla(); 
        return; 
    }
    // FIX TÁCTICO: Agregado el caso de éxito para el Sacrificio
    if (EstadoBatalla.tipoCombate === "sacrificio" && EstadoBatalla.progresoMuro >= EstadoBatalla.metaProgresoMuro) { 
        evaluarContinuacionBatalla(); 
        return; 
    }
    
    if (EstadoBatalla.reservas.length === 0) { evaluarContinuacionBatalla(); return; }

    let bajasNuevas = EstadoBatalla.tropasVivas.filter(pos => {
        if (!pos.idUnico) return false;
        let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
        return tr && tr.hp <= 0 && !pos.ignorarMuerto; 
    });

    if (bajasNuevas.length > 0) {
        let nombresBajas = bajasNuevas.map(b => `<b class='txt-hereje'>${jugador.tropas.find(t=>t.idUnico===b.idUnico).nombre}</b> (${b.posNombre})`).join(", ");

        let alertHtml = RenderCombate.htmlAlertaBajas(nombresBajas, 'block');
        agregarTexto(alertHtml, "", true);
        
        limpiarBotones();
        
        let imgLugarteniente = EstadoBatalla.tipoCombate === "cuna" ? "assets/img/personajes/aliados/lider_caballeromontado.webp" : "assets/img/personajes/aliados/lider_piqueros.webp";
        let nomLugarteniente = EstadoBatalla.tipoCombate === "cuna" ? "Sir Alexandro" : "Conde JuanA";
        
        if (EstadoBatalla.tipoCombate === "sacrificio") {
            imgLugarteniente = "assets/img/personajes/aliados/lider_ballesteros.webp";
            nomLugarteniente = "Barón Andrew";
        }

        let divRefuerzo = document.createElement("div");
        storyArea.appendChild(divRefuerzo);

        MotorDialogos.mostrarDialogoEnContenedor(divRefuerzo, {
            personajeImg: imgLugarteniente, 
            nombrePersonaje: nomLugarteniente, alineacion: "izq", 
            bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Mi señor! ¡Las bestias han masacrado a <span class='txt-hereje'>${nombresBajas}</span>! Hay fisuras en nuestra formación. ¿Llamamos a las reservas para tapar la sangre?"`, 
            claseTexto: "txt-lugarteniente"
        }).then(() => {
            crearBoton(`Sí, ¡adelante por el Señor!`, async () => {
                limpiarBotones();
                
                document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');

                let divRespuesta = document.createElement("div");
                storyArea.appendChild(divRespuesta);
                await MotorDialogos.mostrarDialogoEnContenedor(divRespuesta, {
                    personajeImg: "assets/img/personajes/aliados/jugador.webp", 
                    nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", 
                    bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                    texto: `"¡Sí, adelante por el Señor! ¡Que las reservas ocupen la brecha de inmediato y no cedan un palmo!"`, 
                    claseTexto: "txt-comandante"
                });
                
                let todasLasBajas = EstadoBatalla.tropasVivas.filter(pos => {
                    let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
                    return tr && tr.hp <= 0;
                });

                abrirFormacionReposicion(todasLasBajas, (reforzados) => {
                    document.querySelectorAll("button").forEach(b => {
                        if (b.innerText.includes("REEMPLAZO")) b.style.display = "none";
                    });

                    reforzados.forEach(nuevo => { EstadoBatalla.reservas = EstadoBatalla.reservas.filter(r => r.idUnico !== nuevo.idUnico); });

                    if (typeof slotsFormacion !== 'undefined') {
                        EstadoBatalla.tropasVivas.forEach(pos => {
                            if (pos.slotPos && slotsFormacion[pos.slotPos]) {
                                pos.idUnico = slotsFormacion[pos.slotPos];
                            }
                        });
                    }

                    EstadoBatalla.tropasVivas.forEach(pos => {
                        if (pos.idUnico) {
                            let tr = jugador.tropas.find(t => t.idUnico === pos.idUnico);
                            if (tr && tr.hp <= 0) { 
                                pos.ignorarMuerto = true; 
                            } else {
                                pos.ignorarMuerto = false; 
                            }
                        }
                    });

                    restaurarVisualesCombate(); 
                    
                    if (reforzados.length > 0) {
                        let nombresNuevos = reforzados.map(r => r.nombre).join(" y ");
                        
                        let divLlegada = document.createElement("div");
                        storyArea.appendChild(divLlegada);
                        
                        MotorDialogos.mostrarDialogoEnContenedor(divLlegada, {
                            personajeImg: imgLugarteniente, 
                            nombrePersonaje: nomLugarteniente, alineacion: "izq", 
                            bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                            texto: `"¡Firmes! ¡${nombresNuevos} han ocupado la brecha! ¡Sangre fresca para la cruzada!"`, 
                            claseTexto: "txt-lugarteniente"
                        }).then(() => {
                            evaluarContinuacionBatalla();
                        });
                    } else {
                        evaluarContinuacionBatalla();
                    }
                });
            });
            
            crearBoton(`No, mantened la disciplina`, async () => { 
                limpiarBotones();
                
                document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
                bajasNuevas.forEach(b => b.ignorarMuerto = true);

                let divRespuesta = document.createElement("div");
                storyArea.appendChild(divRespuesta);
                await MotorDialogos.mostrarDialogoEnContenedor(divRespuesta, {
                    personajeImg: "assets/img/personajes/aliados/jugador.webp", 
                    nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", 
                    bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
                    texto: `"¡No, mantened la disciplina! ¡La línea debe resistir con los valientes que están! ¡Confiad en la Providencia Divina!"`, 
                    claseTexto: "txt-comandante"
                });
                
                let htmlCierre = RenderCombate.htmlCierreSinRefuerzos(jugador.nombre);
                agregarTexto(htmlCierre);
                
                restaurarVisualesCombate(); 
                evaluarContinuacionBatalla(); 
            });
        });

    } else { 
        evaluarContinuacionBatalla();
    }
}