import { ProductDetailUI } from "./ui/productDetailUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const productDetailUI = new ProductDetailUI();
window.cartUIInstance = cartUI;

// Esperar a que los datos del producto se carguen
setTimeout(() => {
  // Evento de visualización de la página de detalles
  const productData = getProductData();
  
  // Obtener el ID y nombre de la lista desde localStorage
  // Estos valores se guardan en app.js cuando se hace clic en "Ver Detalles"
  const listId = localStorage.getItem('last_list_id') || '1';
  const listName = localStorage.getItem('last_list_name') || 'Todos';
  
  console.log(`Recuperando de localStorage - list_id: ${listId}, list_name: ${listName}`);
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'view_item',
    'item_list_id': listId,
    'item_list_name': listName,
    'currency': 'USD',
    'value': productData.price,
    'taxes': 0,
    'items': [{
      'item_id': productData.id,
      'item_name': productData.name,
      'item_category': productData.category,
      'item_brand': 'TheCocktail',
      'price': productData.price,
      'quantity': 1
    }]
  });
  console.log(`Evento view_item enviado: ${productData.name} desde lista ${listName} (ID: ${listId})`);
  
  // Configurar eventos de tracking
  setupEventTracking(productData, listId, listName);
}, 1000);
});

function setupEventTracking(productData, listId, listName) {
// Rastrear clic en "Añadir al Carrito"
const addToCartBtn = document.querySelector('.add-to-cart');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const value = productData.price * quantity;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_to_cart',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': value,
      'taxes': 0,
      'items': [{
        'item_id': productData.id,
        'item_name': productData.name,
        'item_category': productData.category,
        'item_brand': 'TheCocktail',
        'price': productData.price,
        'quantity': quantity
      }]
    });
    console.log(`Evento add_to_cart enviado: ${productData.name} x${quantity} desde lista ${listName}`);
  });
}

// Rastrear clics en botones de cantidad (+ y -)
const quantityBtns = document.querySelectorAll('.quantity-btn');
if (quantityBtns.length > 0) {
  quantityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isPlus = e.target.classList.contains('plus');
      const quantity = 1; // Siempre es 1 para add/remove
      const value = productData.price * quantity;
      
      if (isPlus) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'add_to_cart',
          'item_list_id': listId,
          'item_list_name': listName,
          'currency': 'USD',
          'value': value,
          'taxes': 0,
          'items': [{
            'item_id': productData.id,
            'item_name': productData.name,
            'item_category': productData.category,
            'item_brand': 'TheCocktail',
            'price': productData.price,
            'quantity': quantity
          }]
        });
        console.log(`Evento add_to_cart enviado: ${productData.name} +1 desde lista ${listName}`);
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'remove_from_cart',
          'item_list_id': listId,
          'item_list_name': listName,
          'currency': 'USD',
          'value': value,
          'taxes': 0,
          'items': [{
            'item_id': productData.id,
            'item_name': productData.name,
            'item_category': productData.category,
            'item_brand': 'TheCocktail',
            'price': productData.price,
            'quantity': quantity
          }]
        });
        console.log(`Evento remove_from_cart enviado: ${productData.name} -1 desde lista ${listName}`);
      }
    });
  });
}

// Rastrear clics en el icono del carrito
const cartIcon = document.querySelector('.nav__cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    const cartItems = getCartItems();
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_icon_click',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': cartTotal, // Añadir el valor total del carrito
      'items': cartItems
    });
    console.log(`Evento view_cart_icon_click enviado desde lista ${listName}`);
    
    // Configurar eventos para el carrito desplegable después de que se abra
    setTimeout(() => {
      setupCartModalButtons(listId, listName);
    }, 500);
  });
}

// Añadir un observador de mutaciones para detectar cuando se abre el carrito desplegable
const bodyObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        if (node.classList && node.classList.contains('cart-modal') && node.classList.contains('show')) {
          // El carrito desplegable se ha abierto, configurar los eventos
          setupCartModalEvents(listId, listName);
          setupCartModalButtons(listId, listName);
          break;
        }
      }
    }
  });
});

bodyObserver.observe(document.body, { childList: true, subtree: true });
}

// Función para configurar los botones del footer del carrito desplegable
function setupCartModalButtons(listId, listName) {
// Configurar el botón "Ver Carrito"
const viewCartBtn = document.querySelector('.cart-modal__footer a.button--secondary');
if (viewCartBtn) {
  // Eliminar eventos anteriores para evitar duplicados
  viewCartBtn.removeEventListener('click', viewCartClickHandler);
  
  // Definir el manejador de eventos
  function viewCartClickHandler(e) {
    e.preventDefault();
    const cartItems = getCartItems();
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_click',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': cartTotal,
      'items': cartItems
    });
    console.log(`Evento view_cart_click enviado desde lista ${listName}`);
    
    // Redirigir a la página del carrito
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 100);
  }
  
  // Añadir el evento
  viewCartBtn.addEventListener('click', viewCartClickHandler);
}

// Configurar el botón "Proceder al Pago"
const checkoutBtn = document.querySelector('.cart-modal__footer a.button--primary');
if (checkoutBtn) {
  // Eliminar eventos anteriores para evitar duplicados
  checkoutBtn.removeEventListener('click', checkoutClickHandler);
  
  // Definir el manejador de eventos
  function checkoutClickHandler(e) {
    e.preventDefault();
    const cartItems = getCartItems();
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': cartTotal,
      'taxes': 0,
      'items': cartItems
    });
    console.log(`Evento begin_checkout enviado desde lista ${listName}`);
    
    // Redirigir a la página de checkout
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 100);
  }
  
  // Añadir el evento
  checkoutBtn.addEventListener('click', checkoutClickHandler);
}
}

// Función para configurar los eventos de los botones + y - en el carrito desplegable
function setupCartModalEvents(listId, listName) {
// Configurar los botones + en el carrito desplegable
const plusButtons = document.querySelectorAll('.cart-modal__item-quantity-btn.plus');
plusButtons.forEach(btn => {
  // Eliminar eventos anteriores para evitar duplicados
  btn.removeEventListener('click', handlePlusButtonClick);
  
  // Añadir el evento
  btn.addEventListener('click', function() {
    const cartItem = this.closest('.cart-modal__item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.id;
    const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
    const productCategory = cartItem.dataset.category || 'Categoría';
    const productPrice = parseFloat(cartItem.dataset.price || 0);
    const quantity = 1;
    const value = productPrice * quantity;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_to_cart',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': value,
      'taxes': 0,
      'items': [{
        'item_id': productId,
        'item_name': productName,
        'item_category': productCategory,
        'item_brand': 'TheCocktail',
        'price': productPrice,
        'quantity': quantity
      }]
    });
    console.log(`Evento add_to_cart enviado: ${productName} +1 (desplegable) desde lista ${listName}`);
  });
});

// Configurar los botones - en el carrito desplegable
const minusButtons = document.querySelectorAll('.cart-modal__item-quantity-btn.minus');
minusButtons.forEach(btn => {
  // Eliminar eventos anteriores para evitar duplicados
  btn.removeEventListener('click', handleMinusButtonClick);
  
  // Añadir el evento
  btn.addEventListener('click', function() {
    const cartItem = this.closest('.cart-modal__item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.id;
    const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
    const productCategory = cartItem.dataset.category || 'Categoría';
    const productPrice = parseFloat(cartItem.dataset.price || 0);
    const quantity = 1;
    const value = productPrice * quantity;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'remove_from_cart',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': value,
      'taxes': 0,
      'items': [{
        'item_id': productId,
        'item_name': productName,
        'item_category': productCategory,
        'item_brand': 'TheCocktail',
        'price': productPrice,
        'quantity': quantity
      }]
    });
    console.log(`Evento remove_from_cart enviado: ${productName} -1 (desplegable) desde lista ${listName}`);
  });
});
}

// Funciones auxiliares para los manejadores de eventos
function handlePlusButtonClick() {
// Esta función se define vacía para poder eliminar el evento
}

function handleMinusButtonClick() {
// Esta función se define vacía para poder eliminar el evento
}

function getProductData() {
try {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const productTitle = document.querySelector('.product-title').textContent;
  const productPriceText = document.querySelector('.product-price').textContent;
  const productPrice = parseFloat(productPriceText.replace('$', '').trim());
  const productCategory = document.querySelector('.category').textContent;
  
  // Guardar información del producto en localStorage para usar en otras páginas
  // Pero NO sobrescribir last_list_id y last_list_name que vienen de la página anterior
  localStorage.setItem('last_viewed_product_id', productId);
  localStorage.setItem('last_viewed_product_name', productTitle);
  localStorage.setItem('last_viewed_product_category', productCategory);
  localStorage.setItem('last_viewed_product_price', productPrice);
  
  return {
    id: productId,
    name: productTitle,
    price: productPrice,
    category: productCategory
  };
} catch (error) {
  console.error('Error obteniendo datos del producto:', error);
  
  // Intentar recuperar del localStorage si hay un error
  const id = localStorage.getItem('last_viewed_product_id') || '1';
  const name = localStorage.getItem('last_viewed_product_name') || 'Producto';
  const price = parseFloat(localStorage.getItem('last_viewed_product_price') || '0');
  const category = localStorage.getItem('last_viewed_product_category') || 'Categoría';
  
  return { id, name, price, category };
}
}

function getCartItems() {
const cart = JSON.parse(localStorage.getItem('cart')) || [];
return cart.map(item => ({
  'item_id': item.id,
  'item_name': item.name,
  'item_category': item.category,
  'item_brand': 'TheCocktail',
  'price': item.price,
  'quantity': item.quantity
}));
}