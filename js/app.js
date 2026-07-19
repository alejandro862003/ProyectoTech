// ===================================================
// APP.JS — Carrito de compras
// ===================================================
// Maneja: agregar productos, quitarlos, vaciar el carrito,
// guardar todo en localStorage (persiste al recargar o
// cambiar de página), calcular el total, y mostrar el
// modal de "¡Compra exitosa!" al agregar un producto.
// ===================================================

const STORAGE_KEY = "carrito";

// Elementos del DOM (pueden no existir en todas las páginas,
// por eso se valida antes de usarlos)
const carrito = document.getElementById("carrito");
const elementos1 = document.getElementById("lista-1");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const totalCarritoEl = document.getElementById("total-carrito");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const comprarCarritoBtn = document.getElementById("comprar-carrito");
const modal = document.getElementById("purchase-modal");

// Estado del carrito en memoria, sincronizado con localStorage
let carritoItems = [];

document.addEventListener("DOMContentLoaded", function () {
    carritoItems = leerLocalStorage();
    renderizarCarrito();
    cargarEventListeners();
});

function cargarEventListeners() {
    // "Agregar" solo existe en index.html
    if (elementos1) {
        elementos1.addEventListener("click", comprarElemento);
    }
    // El carrito (quitar ítems) puede estar en cualquier página
    if (carrito) {
        carrito.addEventListener("click", eliminarElemento);
    }
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    }
    if (comprarCarritoBtn) {
        comprarCarritoBtn.addEventListener("click", procesarCompra);
    }
}

// ---------- Agregar producto ----------
function comprarElemento(e) {
    e.preventDefault();
    if (!e.target.classList.contains("agregar-carrito")) return;

    const elemento = e.target.closest(".product");
    if (!elemento) return;

    const infoElemento = leerDatosElemento(elemento);
    agregarAlCarrito(infoElemento);
    
    mostrarModal("¡Producto Agregado!", "El producto se agregó a tu carrito.");
}

function leerDatosElemento(elemento) {
    return {
        imagen: elemento.querySelector("img").src,
        titulo: elemento.querySelector("h3").textContent,
        precio: elemento.querySelector(".precio").textContent,
        id: elemento.querySelector("a").getAttribute("data-id"),
    };
}

function agregarAlCarrito(item) {
    carritoItems.push(item);
    guardarLocalStorage();
    renderizarCarrito();
}

// ---- Procesar la compra final ----------
function procesarCompra(e) {
    e.preventDefault();

    // Validamos si el carrito está vacío
    if (carritoItems.length === 0) {
        alert("Tu carrito está vacío. ¡Agrega productos antes de comprar!");
        return;
    }

    // Mostramos el modal configurado para "Compra Exitosa"
    mostrarModal("¡Compra exitosa! 🎉", "Tu pedido ha sido procesado correctamente.");

    // Vaciamos el carrito de manera automática tras la compra
    carritoItems = [];
    guardarLocalStorage();
    renderizarCarrito();
}

// ---------- Quitar un producto ----------
function eliminarElemento(e) {
    e.preventDefault();
    if (!e.target.classList.contains("borrar")) return;

    const fila = e.target.closest("tr");
    if (!fila) return;

    const index = Array.from(listaCarrito.children).indexOf(fila);
    if (index > -1) {
        carritoItems.splice(index, 1);
        guardarLocalStorage();
        renderizarCarrito();
    }
}

// ---------- Vaciar todo el carrito ----------
function vaciarCarrito(e) {
    if (e) e.preventDefault();
    carritoItems = [];
    guardarLocalStorage();
    renderizarCarrito();
    return false;
}

// ---------- Render ----------
function renderizarCarrito() {
    if (!listaCarrito) return;

    listaCarrito.innerHTML = "";

    if (carritoItems.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" class="carrito-vacio">Tu carrito está vacío</td>`;
        listaCarrito.appendChild(row);
    } else {
        carritoItems.forEach(function (item) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.imagen}" width="60" alt="${item.titulo}"></td>
                <td>${item.titulo}</td>
                <td>${item.precio}</td>
                <td><a href="#" class="borrar" data-id="${item.id}">X</a></td>
            `;
            listaCarrito.appendChild(row);
        });
    }

    actualizarTotal();
}

function actualizarTotal() {
    if (!totalCarritoEl) return;

    const total = carritoItems.reduce(function (acumulado, item) {
        // Convierte "$50.000" -> 50000
        const numero = parseInt(item.precio.replace(/\D/g, ""), 10) || 0;
        return acumulado + numero;
    }, 0);

    totalCarritoEl.textContent = "$" + total.toLocaleString("es-AR");
}

// ---------- localStorage ----------
function guardarLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carritoItems));
}

function leerLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    try {
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

// ---------- Modal "¡Compra exitosa!" ----------
let modalTimeoutId = null;

function mostrarModal(titulo, descripcion) {
    if (!modal) return;

    modal.querySelector("h3").textContent = titulo;
    modal.querySelector("p").textContent = descripcion;

    modal.classList.add("modal--show");

    clearTimeout(modalTimeoutId);
    modalTimeoutId = setTimeout(function () {
        modal.classList.remove("modal--show");
    }, 2500);
}

// Permite cerrar el modal haciendo clic afuera de la caja blanca
if (modal) {
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.classList.remove("modal--show");
            clearTimeout(modalTimeoutId);
        }
    });
}
