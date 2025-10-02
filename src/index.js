import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../public/css/main.css'

const calcularBtn = document.getElementById('calcular');
const operacionInput = document.getElementById('operacion');
const validacion = /^[\d+\-*/() \t]+$/;

const tokenizar = (operacion) => {
    return operacion.match(/\d+|[+\-*/()]/g) || [];
}

const infija = (operacion) => {
    let inicio = performance.now();
    const fin = performance.now();
    const tiempo = (fin - inicio).toFixed(5);
    document.getElementById("tiempo_infija").textContent ="Tiempo de ejecución: " + tiempo + " ms";
    return operacion;
}

const prefija = (operacion, separador = "_") => {
    let resultado = [];
    const inicio = performance.now();
    const pila = [];
    const operadores = "+-*/";
    const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2 };

    const tokens = tokenizar(operacion).reverse();

    for (const token of tokens) {
        if (/^\d+$/.test(token)) {
            resultado.push(token);
        } else if (token === ")") {
            pila.push(token);
        } else if (token === "(") {
            while (pila.length && pila[pila.length - 1] !== ")") {
                resultado.push(pila.pop());
            }
            pila.pop();
        } else if (operadores.includes(token)) {
            while (pila.length && prioridad[token] < prioridad[pila[pila.length - 1]]) {
                resultado.push(pila.pop());
            }
            pila.push(token);
        }
    }
    while (pila.length) {
        resultado.push(pila.pop());
    }
    const fin = performance.now();
    const tiempo = (fin - inicio).toFixed(5);
    document.getElementById("tiempo_prefija").textContent =
        "Tiempo de ejecución: " + tiempo + " ms";

    return resultado.reverse().join(separador);
};


const postfija = (operacion, separador = "_") => {
    let resultado = [];
    const inicio = performance.now();
    const pila = [];
    const operadores = "+-*/";
    const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2 };

    const tokens = tokenizar(operacion);

    for (const token of tokens) {
        if (/^\d+$/.test(token)) {
            resultado.push(token);
        } else if (token === "(") {
            pila.push(token);
        } else if (token === ")") {
            while (pila.length && pila[pila.length - 1] !== "(") {
                resultado.push(pila.pop());
            }
            pila.pop();
        } else if (operadores.includes(token)) {
            while (pila.length && prioridad[token] <= prioridad[pila[pila.length - 1]]) {
                resultado.push(pila.pop());
            }
            pila.push(token);
        }
    }
    while (pila.length) {
        resultado.push(pila.pop());
    }
    const fin = performance.now();
    const tiempo = (fin - inicio).toFixed(5);
    document.getElementById("tiempo_postfija").textContent =
        "Tiempo de ejecución: " + tiempo + " ms";

    return resultado.join(separador);
};


const evaluar = (operacion) => {
    try {
        return eval(operacion);
    } catch (error) {
        return 'Error en la operacion';
    }
}

calcularBtn.addEventListener('click', () => {
    const operacion = operacionInput.value.replace(/\s+/g, '');
    if (!validacion.test(operacion)) {
        alert('Operacion no valida. Solo se permiten numeros y operadores +, -, *, /, (, )');
        return;
    } else if (operacion === '') {
        alert('Por favor ingresa una operacion');
        return;
    } else if (/[\+\-\*\/]{2,}/.test(operacion)) {
        alert('Operacion no valida. No se permiten operadores consecutivos');
        return;
    } else if (/[+\-*/]$/.test(operacion)) {
        alert('Operacion no valida. No puede terminar en un operador');
        return;
    }else if (/\([+\-*/]/.test(operacion)) {
        alert("Operacion no valida. No puede haber un operador justo después de '('");
        return;
    }else if (/[+\-*/]\)/.test(operacion)){
        alert('Operacion no valida. No puede haber un operador antes de )');
        return;
    } else if (!/[+\-*/]/.test(operacion)){
        alert('Operacion no valida. Debe incluir operadores');
        return;
    } else if (!/[\d]/.test(operacion)){
        alert('Operacion no valida. Debe incluir numeros');
        return;
    }

    document.getElementById('contenido_infija').innerText = infija(operacion);
    document.getElementById('contenido_prefija').innerText = prefija(operacion);
    document.getElementById('contenido_postfija').innerText = postfija(operacion);
    document.getElementById('contenido_resultado').innerText = evaluar(operacion);
});