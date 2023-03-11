let casillas = document.getElementsByClassName("casilla");
let reloj;
let contador = 0;
let p;
let posicionGanadora;
// keyframes son los estados que tomara el elemento al aplicar la animacion
let keyframes = [
    { transform: "translateY(0)" },
    { transform: "translateY(-10px)" },
    { transform: "translateY(0px)" },
];
let pFichaActual = document.getElementsByClassName("fichaActual")[0];
let pCronometro = document.getElementsByClassName("cronometro")[0];
// con opcionesAnimacion establesco la configuracion de la animacion
let opcionesAnimacion = { duration: 150 };
let fichaActual = true;
let posicionesO = [];
let posicionesX = [];
let contadorX = 0;
let contadorO = 0;
let contadorTurnos = 0;
let combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];


/**
 * Funcion que crea una linea la cual se posicion dentro de la casilla del medio de la combinacion ganadora proporcionada por paramatro
 * si la combinacion ganadora es horizontal no se aplica grado de rotacion a la lina, si vertical se aplica 90 grados y si es diagonal se aplica o 45 o 135 dependiendo de la diferencia obtenida.
 * @param {number[]} combinacionGanadora 
 * @returns {void} no
 */

function createLinea(combinacionGanadora) {
    let linea = document.createElement("div");
    let diferencia = combinacionGanadora[0] - combinacionGanadora[1];
    linea.setAttribute("class", "linea")
    switch (diferencia) {
        case -3:
            linea.style.transform = "rotate(90deg)";
            break;
        case -4:
            linea.style.transform = "rotate(45deg)";
            break;
        case 2:
            linea.style.transform = "rotate(135deg)";
            break;
        default:
            break;
    }
    casillas[combinacionGanadora[1]].appendChild(linea);
    linea.animate([
        { width: "0" },
        { width: "90%" }
    ], { duration: 200, fill: "forwards" });

}

/**
 * Funcion que recibe por parametro el segundo y lo pinta en el cronometro.
 * @param {number} segundo
 * @returns {void} no
 */
function pintarCronometro(segundo) {
    pCronometro.textContent = segundo;
}

/**
 * Funcion que recibe por parametro un array con las posiciones ocupadas por alguna ficha ya sea x u o, valida si en ellas esta incluida alguna combinacion ganadora
 * De ser el caso retorna true, si no retorna false.
 * @param {number[]} posicionesOcupadas 
 * @returns {boolean} boolean
 */
function validarGanador(posicionesOcupadas) {
    let ganadoPadre = false;
    let ganado = true;
    let contadorCombinacion = 0;
    let contadorPos = 0;

    do {
        contadorPos = 0;
        ganado = true;
        do {
            if (posicionesOcupadas.includes(combinacionesGanadoras[contadorCombinacion][contadorPos])) {
                contadorPos++;
            } else {
                ganado = false;
            }
        } while (ganado && contadorPos < 3);

        if (ganado) {
            ganadoPadre = true;
            posicionGanadora = combinacionesGanadoras[contadorCombinacion];
        } else {
            contadorCombinacion++;
        }

    } while (!ganadoPadre && contadorCombinacion < 8);
    return ganadoPadre;
}

/**
 * Funcion que recibe por parametro el id de la ficha a sumar, se recoge su contenido y se le suma uno cambiandolo en el HTML.
 * @param  {String} ficha
 * @returns {void} no 
 */
function sumarContador(ficha) {
    let textoFicha = document.getElementById(ficha);
    let valor = textoFicha.innerHTML;
    valor = parseInt(valor);
    valor++;
    textoFicha.innerHTML = valor;
}


/**
 * Funcion que se encarga de reiniciar todos aquellos valores necesarios para jugar, regresandolos a sus valores iniciales.
 * @param no
 * @returns no
 */
function reset() {
    for (let i = 0; i < casillas.length; i++) {
        casillas[i].setAttribute("onclick", `addFicha(${i})`);
        casillas[i].innerHTML = '';
        fichaActual = true;
        pintarFichaActual();
        posicionesO = [];
        posicionesX = [];
        contadorTurnos = 0;
        pintarCronometro("");
        stopReloj();
        reloj = false;
    }
}

/**
 * Funcion que crea un cronometro para el tiempo de los turnos, la primera vez que se ejecuta se crea uno nuevo, si la segunda vez se cumple que ya existe uno creado,
 * solo se reinicia el valor a 15.
 * @param no
 * @returns {void} no
 */
function timer() {
    contador = 15;
    pintarCronometro(contador);
    if (!reloj) {
        reloj = setInterval(() => {
            contador--;
            console.log(`contador: ${contador}`);
            pintarCronometro(contador);
            if (contador === 0) {
                contador = 15;
                if (fichaActual) {
                    fichaActual = false;
                } else {
                    fichaActual = true;
                }
                pintarFichaActual();
            }
        }, 1000);
    }
}

/**
 * Funcion que eliminar el cronometro en caso de estar creado.
 * @param no 
 * @returns {void} no
 */
function stopReloj() {
    if (reloj) {
        clearInterval(reloj);
    }
}

/**
 * Funcion que eliminar el atributo onclick de todas las casillas
 * @param no
 * @returns {void} no
 */
function removerOnClick() {
    for (let i = 0; i < casillas.length; i++) {
        casillas[i].removeAttribute("onclick");
    }
}

/**
 * Funcion que pinta la ficha actual en el HTML
 * @param no 
 * @returns {void} no
 */
function pintarFichaActual() {
    if (fichaActual) {
        pFichaActual.textContent = "X";
        pFichaActual.classList.remove("o");
        pFichaActual.classList.add("x");
    } else {
        pFichaActual.textContent = "O";
        pFichaActual.classList.remove("x");
        pFichaActual.classList.add("o");
    }
}

/**
 * Funcion que recibe por parametro el numero de la ficha presionada y dependiendo del turno actual pinta en ella X u O, cambia el turno, reinicia el contador y valida si hay un ganador.
 * de ser el caso se muestra un mensje acorde y se eliminan los eventos de click y se suma un punto ya sea para X, O o tablas.
 * @param {number} numero 
 * @returns {void} no
 */
function addFicha(numero) {
    contadorTurnos++;
    casillas[numero].removeAttribute("onclick");
    timer();
    p = document.createElement("p");


    if (fichaActual) {
        p.setAttribute("class", "x");
        p.textContent = "X";
        posicionesX.push(numero);
        fichaActual = false;
    } else {
        p.setAttribute("class", "o");
        p.textContent = "O";
        posicionesO.push(numero);
        fichaActual = true;
        pintarFichaActual();
    }

    casillas[numero].appendChild(p);
    p.animate(keyframes, opcionesAnimacion);
    pintarFichaActual();


    if (validarGanador(posicionesO)) {
        sumarContador("O");
        alert("Has ganado O");
        stopReloj();
        removerOnClick();
        createLinea(posicionGanadora);
    } else if (validarGanador(posicionesX)) {
        sumarContador("X");
        alert("Has ganado X");
        stopReloj();
        removerOnClick();
        createLinea(posicionGanadora);
    } else if (contadorTurnos == 9) {
        alert("Empate");
        sumarContador("tablas");
        stopReloj();
    }
}