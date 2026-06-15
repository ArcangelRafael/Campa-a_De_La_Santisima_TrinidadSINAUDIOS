/* === CRONICAS.JS - EL DIARIO DE FRAY BARTOLOMÉ (LISTENER Y GESTOR DE CARPETAS) === */

const Cronicas = {
    historial: [],

    iniciar: function() {
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            let nombreComendador = (typeof jugador !== 'undefined' && jugador.nombre) ? jugador.nombre : "Anónimo";
            let errorSolemne = `El maligno ha entorpecido mi pluma y una sombra ha caído sobre los pergaminos. Una blasfemia oculta se manifestó en el códice: <i>"${msg}"</i> (Línea: ${lineNo}). Rezo al Altísimo para que el Comendador <b>${nombreComendador}</b> o los eruditos purguen este mal antes de que corrompa la marcha.`;
            Cronicas.registrar("ERROR_SISTEMA", { texto: errorSolemne });
            return false; 
        };
        this.registrar("INICIO_CRONICA", null);
    },

    registrar: function(tipo, datos) {
        let textoLore = "";
        let fechaActual = (typeof RelojDivino !== "undefined" && RelojDivino.indiceActual !== -1) ? RelojDivino.obtenerFechaActual() : { fecha: "Días inciertos", santo: "Dios sabrá" };
        let horaActual = (typeof RelojDivino !== "undefined" && RelojDivino.indiceActual !== -1) ? RelojDivino.horas[RelojDivino.indiceActual] : "Hora en penumbras";
        
        let nombreComendador = (typeof jugador !== 'undefined' && jugador.nombre) ? jugador.nombre : "Anónimo";

        switch(tipo) {
            case "INICIO_CRONICA":
                textoLore = `En el Nombre del Padre, del Hijo y del Espíritu Santo. Yo, Fray Bartolomé, humilde siervo de la Orden de la Santísima Trinidad, abro este nuevo libro de actas. Que Nuestro Señor guíe mi pluma en estas horas de penumbra para atestiguar la verdad de esta santa cruzada y el rescate de nuestros cautivos.
                <br><br>
                <span style="color:#a3d9a5;"><i>Hoy, los venerables fundadores de nuestra sagrada regla, <b>San Juan de Mata y el ermitaño San Félix de Valois</b>, escudriñaban las almas de los hombres buscando a aquel que habría de empuñar la espada en nombre de la Orden. A los atrios de Letrán acudieron príncipes ungidos en oro y barones de lengua jactanciosa, mas ninguno halló gracia a los ojos de nuestros santos padres; pues no buscaban coronas terrenales, sino un corazón donde la devoción venciera a la vanidad.
                <br><br>
                Fue al despuntar la hora de Tercia cuando la Divina Providencia guio nuestros pasos. Se acercó ante ellos un noble forastero de gesto adusto y temple de acero, ostentando el título de Comendador. Los ecos de su vida atestiguan una veteranía implacable en el campo de batalla, un dominio magistral de las antiguas formaciones de guerra, y una disciplina física hercúlea capaz de doblegar las voluntades más obstinadas. Mas lo que selló su destino no fue el peso de su acero, sino la inquebrantable rectitud de su espíritu, dispuesto al martirio para romper las cadenas de nuestros hermanos.
                <br><br>
                Ahora, las trompetas celestiales anuncian la lectura de la <b>BULA OPERANTE DIVINAE DISPOSITIONIS</b> ante Su Santidad Inocencio III. El velo del misterio se ha descorrido: ha resultado ser justamente este Comendador el elegido para ser nuestro faro y pastor militar. Que Dios ilumine su juicio y fortalezca su brazo, pues él nos guiará a nosotros hacia las fauces del infierno. Ahora mismo me dispongo a entrar al recinto sagrado para atestiguar la proclamación papal... y enseguida, la cruzada habrá de comenzar. ¡Deus lo vult!</i></span>`;
                break;
            
            case "NUEVA_HORA":
                let infoDiaStr = (typeof RelojDivino !== "undefined" && RelojDivino.indiceActual !== -1) ? RelojDivino.obtenerFechaActual() : {santo: "un mártir desconocido"};
                if (datos && datos.esInicio) {
                    textoLore = `Iniciamos nuestra sagrada marcha en la hora de <b>${horaActual}</b>, encomendándonos a la gracia de <b>${infoDiaStr.santo}</b>. Que su testimonio guíe nuestras espadas en la travesía.`;
                } else {
                    textoLore = `Las campanas resuenan a lo lejos, anunciando la llegada de la hora de <b>${horaActual}</b>. El sol avanza en su bóveda y nuestra fe se pone a prueba un ciclo más en la bendita fiesta de <b>${infoDiaStr.santo}</b>.`;
                }
                break;

            case "HACKTESTER":
                textoLore = `<i>(El Fray se soba la cabeza, visiblemente aturdido y con la pluma temblorosa)</i>... Señor, perdonadme. Tuve una visión confusa. Sentí que el tiempo se fracturaba abruptamente y que un poder ajeno a este mundo, autodenominado "Lord Tester", manipulaba la materia y las filas a su antojo. Mi mente está nublada, perdí la noción de los juramentos... pero aquí estoy, listo para reanudar el registro desde este extraño punto de la realidad.`;
                break;

            case "ERROR_SISTEMA":
                textoLore = datos.texto;
                break;

            case "JURAMENTO":
                textoLore = `El caballero secular de nombre <b>${datos.nombre}</b>, proveniente de tierras lejanas, tomó los hábitos en este día de Nuestro Señor. Fue consagrado bajo la sagrada Regla Trinitaria frente a Su Santidad el Papa Inocencio III, justo a la hora de <b>${horaActual}</b>, con el estruendo solemne de las campanadas de San Juan de Letrán retumbando en nuestros pechos.<br><br>
                Para tan inmensa misión, Su Santidad encomendó al Comendador <b>${nombreComendador}</b> el liderazgo de tres fieles lugartenientes: Sir Alexandro, el Barón Andrew y el Conde JuanA. Junto a ellos marchan valerosos hombres de cuna que han jurado dar la vida por la Cruz Bicolor:<br><br>
                • <b>${datos.caballeros.length} Caballeros Nobles:</b> ${datos.caballeros.join(', ')}.<br>
                • <b>${datos.piqueros.length} Piqueros Inquebrantables:</b> ${datos.piqueros.join(', ')}.<br>
                • <b>${datos.ballesteros.length} Saeteros Leales:</b> ${datos.ballesteros.join(', ')}.<br><br>
                Al concluir, le fueron otorgados <b>${datos.denarios} denarios de plata</b> en mano al Comendador <b>${nombreComendador}</b> para abastecer a la hueste y contratar mercenarios en la plaza antes de marchar al abismo del Este. ¡Deus lo vult!`;
                break;

            case "RECLUTAMIENTO":
                let textoReclutamiento = `A la hora de <b>${horaActual}</b>, atestigüé cómo el Comendador <b>${nombreComendador}</b> acudía a la plaza para engrosar nuestras filas. Entendiendo que la sagrada misión requiere también de acero profano, entregó la suma de <b>${datos.costo} denarios</b> a mercenarios y hombres de fortuna que juraron seguir nuestro estandarte únicamente por el brillo de la plata.<br><br>Fueron inscritos en el libro de leva los siguientes combatientes a sueldo:<br><br>`;
                
                if (datos.caballeros && datos.caballeros.length > 0) {
                    textoReclutamiento += `• <b>${datos.caballeros.length} Jinetes Mercenarios</b> (por <b>${datos.costoCab} denarios</b>): <span style="color:#c0c0c0;">${datos.caballeros.join(', ')}</span>.<br>`;
                }
                if (datos.piqueros && datos.piqueros.length > 0) {
                    textoReclutamiento += `• <b>${datos.piqueros.length} Lanceros a Sueldo</b> (por <b>${datos.costoPiq} denarios</b>): <span style="color:#c0c0c0;">${datos.piqueros.join(', ')}</span>.<br>`;
                }
                if (datos.ballesteros && datos.ballesteros.length > 0) {
                    textoReclutamiento += `• <b>${datos.ballesteros.length} Saeteros Mercenarios</b> (por <b>${datos.costoBall} denarios</b>): <span style="color:#c0c0c0;">${datos.ballesteros.join(', ')}</span>.<br>`;
                }
                
                textoReclutamiento += `<br>Que el Señor perdone la codicia de estos mercenarios y guíe sus armas por la senda de la rectitud.`;

                let oroTotalInicial = datos.costo + datos.denariosSobrantes;
                let tercioSagrado = Math.ceil(oroTotalInicial / 3);

                if (datos.denariosSobrantes < tercioSagrado) {
                    textoReclutamiento += `<br><br><span style="color:#ff4c4c;"><i>Al revisar las arcas tras la leva, observo con pesadumbre que restan apenas <b>${datos.denariosSobrantes} denarios</b>. Temo que en el fragor de los preparativos bélicos, el Comendador <b>${nombreComendador}</b> haya relegado al olvido la sacrosanta Regla del Tercio (debíamos resguardar al menos ${tercioSagrado} monedas). ¿Acaso la vanidad de los ejércitos terrenales ha eclipsado la memoria de los cautivos por los que juramos dar la vida? Rezaré por su alma esta noche, pues la riqueza retenida que pertenece a los encadenados es un robo a los ojos de Dios.</i></span>`;
                } else {
                    textoReclutamiento += `<br><br><span style="color:#a3d9a5;"><i>Al inspeccionar las arcas, mi espíritu se regocija. El Comendador <b>${nombreComendador}</b> ha salvaguardado <b>${datos.denariosSobrantes} denarios</b>, honrando escrupulosamente la sacrosanta Regla del Tercio. Ni la embriagadora sed de guerra ni la promesa de un ejército más vasto han quebrado su juramento. La redención de nuestros hermanos cautivos está segura en sus manos. Bendito sea Dios.</i></span>`;
                }
                textoLore = textoReclutamiento;
                break;

            case "TRIBULACION":
                textoLore = `El hermano vigía <b>${datos.nombreScout}</b> nos ha dicho que <span style="color:#c0c0c0;"><i>${datos.resumenProblema}</i></span> y el Comendador <b>${nombreComendador}</b> eligió <span style="color:#ffd700;"><b>${datos.eleccion}</b></span>. Entonces, al obrar de tal modo, <span style="color:#a3d9a5;"><i>${datos.desenlace}</i></span>`;
                break;

            case "REZO":
                if (datos.rezo) {
                    textoLore = `Atestigüé con alegría que el Comendador <b>${nombreComendador}</b> SÍ quiso detener la marcha para honrar a Dios. Juntos, con las rodillas en la tierra, entonamos con ferviente devoción la oración que corresponde a la hora de <b>${datos.hora}</b>. El Espíritu Santo reconforta a nuestra hueste.`;
                } else {
                    textoLore = `Con el corazón envuelto en pesadumbre, atestigüé que el Comendador <b>${nombreComendador}</b> NO quiso detenerse a rezar la oración que corresponde a la hora de <b>${datos.hora}</b>, excusándose en las pesadas cargas del mando terrenal. Yo mismo elevé las plegarias al Altísimo en su lugar, temiendo que la frialdad de su espíritu invite a la derrota en la batalla.`;
                }
                break;

            case "LOGISTICA_PUTREFACCION":
                let desidiaItems = [];
                if (datos.panes > 0) desidiaItems.push(`<b>${datos.panes} raciones de pan</b>`);
                if (datos.cervezas > 0) desidiaItems.push(`<b>${datos.cervezas} barriles de cerveza</b>`);
                
                textoLore = `El Señor nos provee el maná terrenal para sostener la carne en esta sagrada cruzada, mas la desidia del Comendador <b>${nombreComendador}</b> ha permitido que la podredumbre devore ${desidiaItems.join(" y ")}. El hongo y el vinagre son el castigo del Altísimo a la negligencia. Pecado de gula es comer en exceso, pero pecado mortal es acaparar la provisión hasta que se pudra mientras el prójimo padece fatiga. Ruego a Dios que se apiade de nuestra paupérrima administración.`;
                break;

            case "LOGISTICA_INANICION":
                let caidosHambre = datos.caidos.map(c => {
                    let titulo = "Comandante / Siervo Sagrado";
                    if(c.tipo === "caballeros") titulo = "Caballero " + (c.clase === "noble" ? "Noble" : "Mercenario");
                    else if(c.tipo === "piqueros") titulo = "Piquero " + (c.clase === "noble" ? "Noble" : "Mercenario");
                    else if(c.tipo === "ballesteros") titulo = "Ballestero " + (c.clase === "noble" ? "Noble" : "Mercenario");
                    
                    let arrayRequiems = (typeof requiemsHambre !== "undefined") ? requiemsHambre : ["Cayó víctima del abandono."];
                    let req = arrayRequiems[Math.floor(Math.random() * arrayRequiems.length)];
                    return `• <b style="color:#ffaa00;">${c.nombre}</b> <span style="color:#888; font-size:13px;">[${titulo}]</span><br>  <i style="color:#a3a3a3;">"${req}"</i>`;
                }).join('<br><br>');

                textoLore = `<span style="color:#ff4c4c;">¡Luto y vergüenza cubren nuestro campamento!</span> El estómago de nuestros hermanos se ha secado hasta consumirse, y el hambre ha cobrado el diezmo que la espada hereje no pudo. Han entregado sus almas al Creador por inanición:<br><br>
                ${caidosHambre}<br><br>
                Un pastor que no alimenta a su rebaño lo entrega a los lobos de la muerte. Ruego a la Santísima Trinidad que no le demande esta sangre al Comendador <b>${nombreComendador}</b> en el pavoroso Día del Juicio.`;
                break;

            case "LOGISTICA_DESHIDRATACION":
                let caidosSed = datos.caidos.map(c => {
                    let titulo = "Comandante / Siervo Sagrado";
                    if(c.tipo === "caballeros") titulo = "Caballero " + (c.clase === "noble" ? "Noble" : "Mercenario");
                    else if(c.tipo === "piqueros") titulo = "Piquero " + (c.clase === "noble" ? "Noble" : "Mercenario");
                    else if(c.tipo === "ballesteros") titulo = "Ballestero " + (c.clase === "noble" ? "Noble" : "Mercenario");
                    
                    let arrayRequiems = (typeof requiemsSed !== "undefined") ? requiemsSed : ["Cayó marchito por el polvo."];
                    let req = arrayRequiems[Math.floor(Math.random() * arrayRequiems.length)];
                    return `• <b style="color:#4c88ff;">${c.nombre}</b> <span style="color:#888; font-size:13px;">[${titulo}]</span><br>  <i style="color:#a3a3a3;">"${req}"</i>`;
                }).join('<br><br>');

                textoLore = `<span style="color:#4c88ff;">El sol inclemente, heraldo de la justicia divina, ha evaporado el aliento de nuestros hermanos.</span> Han caído por la atroz sequía en sus gargantas y sus lenguas hinchadas por el polvo:<br><br>
                ${caidosSed}<br><br>
                El agua que Cristo convirtió en vino faltó hoy en nuestras cantimploras por falta de previsión logística. El Comendador <b>${nombreComendador}</b> los ha llevado al martirio del desierto. Ruego que el Señor les ofrezca de beber abundantemente en la fuente de la vida eterna y perdone a quien debía guiarlos.`;
                break;

            case "BATALLA":
                let textoBatalla = "";

                if (datos.tactica && datos.tactica.includes("Cuña Frontal")) {
                    textoBatalla += `El estruendo del acero por fin ha cesado. He atestiguado cómo el Comendador <b>${nombreComendador}</b> guio a nuestra hueste en múltiples fases a través de este infierno de herejía.<br><br>`;
                    textoBatalla += `Primero, ordenó ejecutar <b>${datos.tactica}</b>. Un asalto vehemente e implacable que quebró sus líneas, mientras un viento helado aullaba entre los riscos como el lamento de los demonios asustados. Ruego al Altísimo que haya sido el genuino fervor de la Cruz, y no la vanagloria terrenal, lo que inflamó su corazón.<br><br>`;
                    textoBatalla += `Después, para resguardar la retirada de la caballería, la prudencia y el deber dictaron levantar un heroico <b>Muro de Picas en el puente</b> para esperar a nuestros ballesteros. Los cielos parecieron desgarrarse en ese instante: una tormenta de ira se cernió sobre nosotros, los relámpagos no cesaban de iluminar el acero ensangrentado y el sonido de los truenos era ensordecedor.<br><br>`;
                    textoBatalla += `Finalmente, la contienda se trasladó al Bosque Negro, desplegando un brillante <b>escalonamiento de Piqueros y Ballesteros</b>. Allí, bajo la furia conjunta del viento, los relámpagos, los truenos y una fuerte lluvia torrencial que lavó la sangre sagrada y la impía por igual de la tierra, culminamos la purga de los paganos.<br><br>`;
                } else {
                    let climaPoetico = "el humo de la guerra se disipa en el desfiladero";
                    if (datos.clima === "lluvia") climaPoetico = "una lluvia torrencial lava la sangre sagrada y la impía por igual";
                    else if (datos.clima === "viento") climaPoetico = "un viento helado aúlla entre los riscos como el lamento de los demonios";
                    else if (datos.clima === "tormenta") climaPoetico = "los truenos ensordecen los gritos de los moribundos bajo la tempestad";

                    textoBatalla += `El estruendo del acero ha cesado y ${climaPoetico}. He atestiguado cómo el Comendador <b>${nombreComendador}</b> guio a nuestra hueste empleando la táctica de <b>${datos.tactica}</b>. `;

                    if (datos.esPrudente) {
                        textoBatalla += `Una decisión guiada por la santa prudencia, buscando erigir un muro para preservar la sangre cristiana antes que cazar glorias vanas.<br><br>`;
                    } else {
                        textoBatalla += `Un asalto vehemente e implacable. Ruego al Altísimo que haya sido el genuino fervor de la Cruz lo que inflamó su corazón para ordenar tal derramamiento.<br><br>`;
                    }
                }

                if (datos.huboSacrificioMercenario) {
                    textoBatalla += `<span style="color:#ffd700;"><i>Un destello de luz divina iluminó las sombras de este combate: atestigüé cómo uno de nuestros ballesteros mercenarios, tocado por la Gracia Inefable, arrojó al suelo su afán de lucro y desenvainó la espada para ofrecer su propia vida en el muro de los sacrificios. Ha peleado y caído como un verdadero Cruzado de la Trinidad. Ruego a Cristo que lave sus pecados y le abra las puertas del Paraíso.</i></span><br><br>`;
                }

                if (datos.aliadosCaidos && datos.aliadosCaidos.length > 0) {
                    textoBatalla += `La tierra ha bebido sangre bendita. Dios ha llamado a su seno a nuestros hermanos caídos:<br><br>`;
                    datos.aliadosCaidos.forEach(caido => {
                        let nombreStr = typeof caido === 'string' ? caido : caido.nombreCompleto;
                        let lugarStr = typeof caido === 'string' || !caido.lugar ? "" : ` <i>(quien rindió su alma ${caido.lugar})</i>`;
                        textoBatalla += `• <span style="color:#88ff88; font-weight:bold; text-shadow: 0 0 5px #0f0;">${nombreStr}</span><span style="color:#a3a3a3;">${lugarStr}</span><br>`;
                    });
                    textoBatalla += `<br>Que los coros angélicos los reciban; pues ya fuesen de noble cuna o espadas a sueldo, hoy lavaron sus faltas y saldaron su deuda con la moneda más alta: el martirio absoluto por la Santa Madre Iglesia.<br><br>`;
                } else {
                    textoBatalla += `Milagro de la Providencia y mérito del mando: <span style="color:#a3d9a5;">ningún hermano de nuestra Orden ha perecido</span>. El Señor ha sido nuestro escudo impenetrable.<br><br>`;
                }

                textoBatalla += `En cuanto a los siervos de la oscuridad, <b>${datos.enemigosCaidos} herejes</b> fueron pasados por el filo de nuestras espadas. Cayeron en su ciega soberbia, escupiendo al madero santo y rechazando el agua del bautismo. Sus almas impenitentes han descendido irremediablemente al fuego del infierno, donde su tormento no conocerá piedad ni fin.<br><br>`;

                if (datos.huboParlamento) {
                    textoBatalla += `<br><br><div class='separador'>***</div>En medio del espeso Bosque Negro, tras la refriega, la hueste detuvo sus espadas ante el líder pagano, un hereje de nombre JoanJoz. El hedor de la blasfemia brotaba de sus labios, insultando a la Cruz y mofándose de nuestra piedad. Mas el Comendador <b>${nombreComendador}</b> no se dejó arrastrar por la ira del demonio, recordando a los hombres que el Santo Deber de la Orden es, ante todo, la redención del cautivo.<br><br>
                    El impío mercadeó con las vidas de cinco frailes ancianos de nuestra Orden, sobrevivientes de Hattin, exigiendo diez denarios de plata a cambio de sus demacradas almas.`;

                    if (datos.pagoPlata) {
                        textoBatalla += `<br><br><span style="color:#a3d9a5;"><i>Y así se hizo. El Comendador <b>${nombreComendador}</b> entregó la plata sin dudar, prefiriendo empobrecer las arcas terrenales antes que abandonar a los siervos de Dios en el yugo enemigo. El oro de la Orden ha cumplido hoy su propósito más sagrado. Los cinco frailes lloraron al ver nuestros estandartes, y el Reino de los Cielos se ha regocijado con este rescate.</i></span><br><br>`;
                    } else {
                        textoBatalla += `<br><br><span style="color:#ffd700;"><i>Mas el voto de extrema pobreza nos había dejado sin blanca. Fue entonces cuando Sir Alexandro, lugarteniente de la vanguardia, dio un paso al frente. Con el pecho henchido de valor, se despojó de sus armas y entregó su propia libertad a cambio de los ancianos frailes. Un martirio blanco y doloroso. Los herejes se llevaron al león encadenado entre escupitajos, dejando libres a las mansas ovejas. Dios anote este sacrificio supremo; juramos por la Trinidad que no descansaremos hasta rescatarle o vengar su sangre.</i></span><br><br>`;
                    }
                }
                
                // FIX TÁCTICO: Anexamos el nombre de los 5 mártires rescatados y la designación del nuevo lugarteniente
                if (datos.nombresCautivos && datos.nombresCautivos.length > 0) {
                    textoBatalla += `Anoto en este pergamino los nombres de los valientes Mártires Blancos que hoy vuelven al redil del Señor:<br>`;
                    datos.nombresCautivos.forEach(nc => {
                        textoBatalla += `• <span style="color:#ffffff;">${nc}</span><br>`;
                    });
                    textoBatalla += `<br>Que la Orden les provea pronto el alimento del cuerpo, pues del espíritu ya rebosan.<br><br>`;
                }

                if (datos.nuevoLugarteniente) {
                    textoBatalla += `Tras el doloroso martirio en vida de Sir Alexandro, la vanguardia necesitaba urgentemente una espada noble y devota. Atestigüé el solemne nombramiento del caballero <b>${datos.nuevoLugarteniente}</b> como el nuevo Lugarteniente Interino de la Caballería. Que la pureza de sus intenciones y la fuerza de su brazo nos guíen sin vacilar por la senda de la victoria.`;
                }

                if (datos.botin > 0) {
                    textoBatalla += `De los pútridos despojos impíos se recabaron <b>${datos.botin} denarios</b> de botín. `;
                    if (datos.tercioRespetado) {
                        textoBatalla += `<span style="color:#a3d9a5;">El Comendador ha separado celosamente el Tercio Sagrado de esta ganancia. La sangre derramada servirá, como manda Dios, para liberar a nuestros hermanos cautivos.</span>`;
                    } else {
                        textoBatalla += `<span style="color:#ff4c4c;">Mas advierto con horror que la codicia se cierne sobre nosotros. El Comendador ha ignorado la Regla del Tercio sobre esta ganancia de guerra. ¡Atesorar el rescate de los esclavos es robarle al mismo Cristo! Rezaré por su juicio.</span>`;
                    }
                } else {
                    textoBatalla += `No hubo oro ni riquezas terrenales que extraer de esta contienda, y es mejor así, pues la escoria de la codicia no ensuciará esta santa victoria.`;
                }

                textoLore = textoBatalla;
                break;

            default:
                textoLore = `Un evento misterioso ha ocurrido bajo el sol de ${horaActual}. Pido a Dios por la templanza del Comendador <b>${nombreComendador}</b>.`;
                break;
        }

        this.historial.push({ tipo: tipo, texto: textoLore, hora: horaActual, dia: fechaActual.fecha, santo: fechaActual.santo });
        this.renderizarEstructura();
    },

    renderizarEstructura: function() {
        let contenedor = document.getElementById("cronicas-contenido");
        if (!contenedor) return;
        contenedor.innerHTML = "";

        let arbol = {};
        this.historial.forEach((reg, i) => {
            if (!arbol[reg.dia]) arbol[reg.dia] = { santo: reg.santo, horas: {} };
            if (!arbol[reg.dia].horas[reg.hora]) arbol[reg.dia].horas[reg.hora] = [];
            arbol[reg.dia].horas[reg.hora].push({...reg, id: i});
        });

        let diasKeys = Object.keys(arbol);
        diasKeys.forEach((dia, diaIndex) => {
            let isUltimoDia = (diaIndex === diasKeys.length - 1); 
            let santoDelDia = arbol[dia].santo || "Mártir Desconocido";
            
            let divDia = document.createElement("div");
            divDia.className = "cronica-carpeta-dia";
            
            let headerDia = document.createElement("div");
            headerDia.className = "cronica-header-dia" + (isUltimoDia ? " abierto" : "");
            headerDia.innerHTML = `<span>⛪ <b>Fiesta de ${santoDelDia}</b> <span style="font-size:12px; color:#aaa; margin-left:8px;">(${dia})</span></span> <span class="icon-toggle">▶</span>`;
            
            let contentDia = document.createElement("div");
            contentDia.className = "cronica-contenido-dia";
            if (isUltimoDia) contentDia.style.display = "block";

            headerDia.onclick = () => {
                let isOpen = contentDia.style.display === "block";
                contentDia.style.display = isOpen ? "none" : "block";
                if(isOpen) headerDia.classList.remove("abierto"); else headerDia.classList.add("abierto");
            };

            let horasKeys = Object.keys(arbol[dia].horas);
            horasKeys.forEach((hora, horaIndex) => {
                let isUltimaHora = isUltimoDia && (horaIndex === horasKeys.length - 1); 
                
                let divHora = document.createElement("div");
                divHora.className = "cronica-carpeta-hora";
                
                let headerHora = document.createElement("div");
                headerHora.className = "cronica-header-hora" + (isUltimaHora ? " abierto" : "");
                headerHora.innerHTML = `<span>⏳ <b>Pergamino de ${hora}</b></span> <span class="icon-toggle">▶</span>`;
                
                let contentHora = document.createElement("div");
                contentHora.className = "cronica-contenido-hora";
                if (isUltimaHora) contentHora.style.display = "block";

                headerHora.onclick = () => {
                    let isOpen = contentHora.style.display === "block";
                    contentHora.style.display = isOpen ? "none" : "block";
                    if(isOpen) headerHora.classList.remove("abierto"); else headerHora.classList.add("abierto");
                };

                arbol[dia].horas[hora].forEach(reg => {
                    let box = document.createElement("div");
                    box.className = "dialogo-pergamino borde-fray cronica-box";
                    
                    let colorFondo = "#111"; 
                    if (reg.tipo === "ERROR_SISTEMA" || reg.tipo === "LOGISTICA_INANICION" || reg.tipo === "LOGISTICA_PUTREFACCION") colorFondo = "#2a0000"; 
                    else if (reg.tipo === "LOGISTICA_DESHIDRATACION") colorFondo = "#001a33";
                    else if (reg.tipo === "HACKTESTER") colorFondo = "#001a2a"; 
                    
                    box.style.background = `linear-gradient(to bottom, ${colorFondo}, #000)`;
                    box.style.margin = "0 0 20px 0 !important"; 
                    box.style.width = "100% !important";
                    box.style.boxSizing = "border-box";

                    box.innerHTML = `
                        <div class="dialogo-nombre nombre-fray" style="font-size: 11px; padding: 3px 15px;">FRAY BARTOLOMÉ</div>
                        <img src="assets/img/personajes/aliados/fray.webp" class="dialogo-retrato retrato-izq retrato-cronica">
                        <div class="dialogo-texto-container pad-izq texto-cronica" style="padding-bottom: 10px;">
                            ${reg.texto}
                        </div>
                    `;
                    contentHora.appendChild(box);
                });

                divHora.appendChild(headerHora);
                divHora.appendChild(contentHora);
                contentDia.appendChild(divHora);
            });

            divDia.appendChild(headerDia);
            divDia.appendChild(contentDia);
            contenedor.appendChild(divDia);
        });

        contenedor.scrollTop = contenedor.scrollHeight;
    }
};

document.addEventListener("DOMContentLoaded", () => { Cronicas.iniciar(); });
function abrirCronicas() { let m = document.getElementById("dropdown-hud"); if(m) m.style.display="none"; let o = document.getElementById("cronicas-overlay"); if(o) o.style.display="flex"; }
function cerrarCronicas() { let o = document.getElementById("cronicas-overlay"); if(o) o.style.display="none"; }