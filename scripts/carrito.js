document.addEventListener('DOMContentLoaded', () => {
    const carritoButton = document.getElementById('carritoButton');
    const carritoSidebar = document.getElementById('carritoSidebar');
    const cerrarCarrito = document.getElementById('cerrarCarrito');
    const carritoLista = document.getElementById('carritoLista');
    const totalElement = document.getElementById('total');
    const carritoCount = document.getElementById('carritoCount');  // Elemento del contador

    let carrito = [];

    // Abrir el carrito
    carritoButton.addEventListener('click', () => {
        carritoSidebar.classList.add('open');
    });

    // Cerrar el carrito
    cerrarCarrito.addEventListener('click', () => {
        carritoSidebar.classList.remove('open');
    });

    // Agregar productos al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const producto = button.dataset.producto;
            const precio = parseFloat(button.dataset.precio);

            // Agregar al carrito
            carrito.push({ producto, precio });

            // Actualizar la UI
            actualizarCarrito();
        });
    });

    // Actualizar la UI del carrito
    function actualizarCarrito() {
        carritoLista.innerHTML = '';  // Limpiar la lista de productos en el carrito
        let total = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.producto} - $${item.precio.toFixed(2)}`;
            carritoLista.appendChild(li);
            total += item.precio;
        });

        totalElement.textContent = `Total: $${total.toFixed(2)}`;

        // Actualizar el contador en el botón del carrito
        carritoCount.textContent = carrito.length;  // Mostrar la cantidad de productos
    }
});

   // Configuración de productos con stock y descuentos
   const productos = {
    laptop: { 
        nombre: 'SPY X FAMILY - TOMO 1', 
        precio: 7000, 
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    smartphone: { 
        nombre: 'HAJIME NO IPPO - TOMO 1', 
        precio: 10000, 
        stock: 15,
        descuento: 0.05  // 5% de descuento
    },
    tablet: { 
        nombre: 'VINLAND SAGA - TOMO 1', 
        precio: 8000, 
        stock: 8,
        descuento: 0  // Sin descuento
    }
};

// Constante para el IVA
const IVA = 0.21;  // 21% de IVA

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);

function agregarAlCarrito(nombre, precio, productoKey) {
    // Obtener el producto específico
    const producto = productos[productoKey];

    // Validar stock
    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carritoSidebar')) || [];
    
    // Agregar nuevo producto
    carrito.push({ 
        nombre: producto.nombre, 
        precio: producto.precio,
        productoKey: productoKey
    });
    
    // Reducir stock
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar vista del carrito
    renderizarCarrito();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Limpiar lista anterior
    listaCarrito.innerHTML = '';
    
    // Totales iniciales
    let subtotal = 0;
    let descuentoTotal = 0;
    
    // Renderizar cada producto
    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        // Calcular descuento individual
        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;
        
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            ${productoInfo.descuento > 0 ? 
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                -$${descuentoProducto.toFixed(2)})</span>` 
                : ''}
        `;
        
        // Botón para eliminar producto
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        // Sumar al subtotal y descuentos
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });
    
    // Calcular IVA
    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;
    
    // Actualizar totales
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carritoSidebar')) || [];
    
    // Recuperar el producto para devolver stock
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    // Eliminar producto por índice
    carrito.splice(index, 1);
    
    // Actualizar localStorage
    localStorage.setItem('carritoSidebar', JSON.stringify(carrito));
    
    // Renderizar de nuevo
    renderizarCarrito();
}

function vaciarCarrito() {
    // Restaurar stock de todos los productos
    const carrito = JSON.parse(localStorage.getItem('carritoSidebar')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    // Limpiar localStorage
    localStorage.removeItem('carritoSidebar');
    
    // Renderizar
    renderizarCarrito();
}

function cargarCarrito() {
    // Cargar carrito al iniciar la página
    renderizarCarrito();
}

// Funciones de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carritoSidebar')) || [];
    
    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Mostrar modal de checkout
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert('¡Compra realizada con éxito!');
    
    // Vaciar carrito
    localStorage.removeItem('carritoSidebar');
    
    // Cerrar modal
    cerrarCheckout();
    
    // Renderizar carrito vacío
    renderizarCarrito();
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}