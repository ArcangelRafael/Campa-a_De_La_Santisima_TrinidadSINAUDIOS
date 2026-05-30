/* === TRIBULACIONES.JS - CANASTA DE EVENTOS ALEATORIOS === */

const canastaTribulaciones = [
    {
        titulo: "El Falso Inocente",
        texto: "Vuestra campaña marcha firme mientras la tropa entona solemne 'Media Vita in Morte Sumus'. De repente, a lo lejos, observáis a un niño desharrapado que llora y suplica vuestra ayuda para alcanzar un fruto de las ramas altas de un viejo roble. Sus ojos ruegan caridad.",
        opciones: [
            {
                texto: "Romper filas y ayudar al niño",
                costo: 0,
                consecuencia: () => {
                    GestorEstado.modificarDefensa(-1);
                    return {
                        narrativa: "¡Era una emboscada! Al acercaros, el niño huye con burla y de la espesura silba una lluvia de flechas paganas. Vuestros hombres alzan los escudos, mas la formación se ha roto temporalmente.<br><br><span class='txt-accion'>[Lección: La caridad es virtud divina, mas en tierras de herejes, la disciplina castrense es el escudo de tu hueste. No te fíes de las sombras.]</span>",
                        efectos: "<b class='txt-hereje'>[-1 Defensa Base]</b>"
                    };
                }
            },
            {
                texto: "Mantener la marcha y la disciplina",
                costo: 0,
                consecuencia: () => {
                    return {
                        narrativa: "Das la orden inquebrantable de ignorar el ruego y mantener la formación de escudos cerrada. El niño, viendo frustrado su engaño, saca una navaja herrumbrada y profiere maldiciones. Tus ballesteros, preparados, disparan un certero tiro de advertencia que lo hace huir despavorido.<br><br><span class='txt-accion'>[Lección: El buen juicio militar ha preservado la sangre de tus hermanos. Ya habrá un momento de paz para ejercer la caridad.]</span>",
                        efectos: "<b class='mensaje-sistema'>[Disciplina Mantenida. Sin bajas]</b>"
                    };
                }
            }
        ]
    },
    {
        titulo: "El Mercader de Reliquias Falsas",
        texto: "Un buhonero andrajoso se acerca a tu columna de marcha. Con ojos brillantes, asegura tener una astilla de la 'Vera Cruz' y la ofrece a cambio de 10 denarios de plata. Tus soldados, agotados, miran el objeto con esperanza; un objeto sagrado podría renovar sus ánimos para la batalla. Sin embargo, sospechas que es madera común de un olivo cercano.",
        opciones: [
            {
                texto: "Comprar la reliquia (10 denarios)",
                costo: 10,
                consecuencia: () => {
                    GestorEstado.modificarOro(-10);
                    GestorEstado.modificarFe(9);
                    GestorEstado.modificarAtaque(-2);
                    return {
                        narrativa: "Buena idea darles ese consuelo; a veces el corazón necesita un símbolo, aunque sea incierto. Ahora tus hombres marchan cantando salmos, aunque tus arcas pesen menos. San Luis IX de Francia entendería tu deseo de honrar lo sagrado, aunque te advertiría sobre la astucia de los hombres.",
                        efectos: "<b class='mensaje-sistema'>[+9 Fe/Liderazgo]</b> <br><b class='txt-hereje'>[-10 Denarios, -2 Ataque Base]</b>"
                    };
                }
            },
            {
                texto: "Reprender y exponer el fraude",
                costo: 0,
                consecuencia: () => {
                    GestorEstado.modificarAtaque(3);
                    GestorEstado.modificarOro(100);
                    GestorEstado.modificarFe(-20);
                    return {
                        narrativa: "Has preferido la verdad sobre el consuelo fácil. Tus soldados ahora confían más en sus brazos que en amuletos. Santo Tomás de Aquino estaría orgulloso de tu uso de la razón, pues la fe no debe basarse en engaños, sino en la verdad firme.",
                        efectos: "<b class='mensaje-sistema'>[+3 Ataque, +100 Denarios ahorrados/confiscados]</b> <br><b class='txt-hereje'>[-20 Fe/Liderazgo]</b>"
                    };
                }
            }
        ]
    },
    {
        titulo: "El Carro de la Viuda en el Paso",
        texto: "En un sendero estrecho, el carro de una viuda local ha perdido una rueda, bloqueando el paso de tus suministros. El tiempo apremia para llegar al campamento antes del anochecer. Tus sargentos sugieren simplemente empujar el carro al barranco para despejar el camino rápidamente y mantener la formación.",
        opciones: [
            {
                texto: "Ayudar a reparar el carro",
                costo: 0,
                consecuencia: () => {
                    GestorEstado.modificarDefensa(3);
                    GestorEstado.modificarAtaque(-3);
                    return {
                        narrativa: "Buena idea ayudar a la mujer; un caballero de la Trinidad debe ser primero un servidor. Ahora la viuda reza por tus hombres y la población local ve en ti a un libertador, no a un opresor. San Martín de Tours estaría orgulloso de tu compañía, pues él mismo dividió su capa para vestir al necesitado, priorizando la caridad sobre el rango.",
                        efectos: "<b class='mensaje-sistema'>[+3 Defensa Base]</b> <br><b class='txt-hereje'>[-3 Ataque Base]</b>"
                    };
                }
            },
            {
                texto: "Despejar el camino a la fuerza",
                costo: 0,
                consecuencia: () => {
                    GestorEstado.modificarOro(10);
                    GestorEstado.modificarFe(-10);
                    return {
                        narrativa: "Has mantenido la eficiencia militar y el horario de marcha, pero a costa de la piedad. El camino está despejado, pero el corazón de tus hombres se ha vuelto un poco más de piedra.",
                        efectos: "<b class='mensaje-sistema'>[+10 Denarios recuperados]</b> <br><b class='txt-hereje'>[-10 Fe/Liderazgo]</b>"
                    };
                }
            }
        ]
    },
    {
        titulo: "La Taberna del Blasfemo",
        texto: "Tus hombres descansan en una aldea fronteriza. De repente, escuchas gritos en la taberna: un ex-soldado amargado está insultando públicamente el nombre de Dios y la misión de las Cruzadas delante de tus reclutas más jóvenes. La situación podría escalar a una riña violenta o sembrar la duda en tus filas.",
        opciones: [
            {
                texto: "Intervenir con la palabra",
                costo: 0,
                consecuencia: () => {
                    GestorEstado.modificarFe(15);
                    GestorEstado.modificarDefensa(-2);
                    return {
                        narrativa: "Buena idea usar la retórica; la espada convence al cuerpo, pero la palabra convierte el alma. Ahora tus reclutas admiran tu convicción y el blasfemo ha quedado mudo de vergüenza. San Antonio de Padua estaría orgulloso, pues su lengua era tan poderosa que incluso los peces parecían escuchar sus sermones cuando los hombres le daban la espalda.",
                        efectos: "<b class='mensaje-sistema'>[+15 Fe/Liderazgo]</b> <br><b class='txt-hereje'>[-2 Defensa Base]</b>"
                    };
                }
            },
            {
                texto: "Imponer castigo físico (20 denarios)",
                costo: 20,
                consecuencia: () => {
                    GestorEstado.modificarDefensa(3);
                    GestorEstado.modificarFe(-5);
                    GestorEstado.modificarOro(-20);
                    return {
                        narrativa: "Has cortado el problema de raíz mediante la fuerza, manteniendo el orden público. Sin embargo, has dejado una semilla de rencor en la aldea y miedo en tus hombres. Has ganado silencio, pero no respeto.",
                        efectos: "<b class='mensaje-sistema'>[+3 Defensa Base]</b> <br><b class='txt-hereje'>[-5 Fe/Liderazgo, -20 Denarios]</b>"
                    };
                }
            }
        ]
    }
];