import { ProductDetailUI } from "./ui/productDetailUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const productDetailUI = new ProductDetailUI();
window.cartUIInstance = cartUI;

// Esperar a que los datos del producto se carguen
setTimeout(() => {
  trackProductView();
  setupEventTracking();
}, 500);
});

function trackProductView() {
const productData = getProductData();

// Obtener el ID y nombre de la lista desde localStorage
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'view_item',
  'item_list_id': listId,
  'item_list_name': listName,
  'currency': 'USD',
  'items': [{
    'item_id': productData.id,
    'item_name': productData.name,
    'item_category': productData.category,
    'item_brand': 'TheCocktail',
    'price': productData.price,
    'quantity': 1
  }]
});
console.log(`Evento view_item enviado: ${productData.name}`);
}

function setupEventTracking() {
const productData = getProductData();
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

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
      'currency': 'USD',
      'value': value,
      'items': [{
        'item_id': productData.id,
        'item_name': productData.name,
        'item_category': productData.category,
        'item_brand': 'TheCocktail',
        'price': productData.price,
        'quantity': quantity
      }]
    });
    console.log(`Evento add_to_cart enviado: ${productData.name} x${quantity}`);
  });
}

// Rastrear clics en botones de cantidad (+ y -)
// Omitido según tu instrucción de olvidarnos de los eventos + y -

// Rastrear clics en el icono del carrito
const cartIcon = document.querySelector('.nav__cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_icon_click',
      'item_list_id': listId,
      'currency': 'USD',
      'value': cartTotal,
      'items': cartItems
    });
    console.log('Evento view_cart_icon_click enviado');
    
    // Configurar eventos para el carrito desplegable
    setTimeout(setupCartModalEvents, 300);
  });
}
}

function setupCartModalEvents() {
const listId = localStorage.getItem('last_list_id') || '1';

// Configurar el botón "Ver Carrito"
const viewCartBtn = document.querySelector('.cart-modal__footer a.button--secondary');
if (viewCartBtn) {
  viewCartBtn.onclick = function(e) {
    e.preventDefault();
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_click',
      'item_list_id': listId,
      'currency': 'USD',
      'value': cartTotal,
      'items': cartItems
    });
    console.log('Evento view_cart_click enviado');
    
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 100);
  };
}

// Configurar el botón "Proceder al Pago"
const checkoutBtn = document.querySelector('.cart-modal__footer a.button--primary');
if (checkoutBtn) {
  checkoutBtn.onclick = function(e) {
    e.preventDefault();
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    const hasCoupon = localStorage.getItem('has_coupon') === 'true';
    const coupon = localStorage.getItem('coupon') || '';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'checkout_step': 1,
      'currency': 'USD',
      'has_coupon': hasCoupon,
      'coupon': coupon,
      'value': cartTotal,
      'items': cartItems
    });
    console.log('Evento begin_checkout enviado');
    
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 100);
  };
}
}

function getProductData() {
try {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const productTitle = document.querySelector('.product-title').textContent;
  const productPriceText = document.querySelector('.product-price').textContent;
  const productPrice = parseFloat(productPriceText.replace('$', '').trim());
  
  // Obtener la categoría del elemento o del dataset
  let productCategory = 'laptops'; // Valor por defecto
  const categoryElement = document.querySelector('.category');
  if (categoryElement) {
    const categoryText = categoryElement.textContent.trim().toLowerCase();
    if (categoryText.includes('laptop')) {
      productCategory = 'laptops';
    } else if (categoryText.includes('smartphone')) {
      productCategory = 'smartphones';
    } else if (categoryText.includes('accesorio')) {
      productCategory = 'accesorios';
    }
  }
  
  // Guardar información del producto en localStorage para usar en otras páginas
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
  const category = localStorage.getItem('last_viewed_product_category') || 'laptops';
  
  return { id, name, price, category };
}
}

function getCartItems() {
const cart = JSON.parse(localStorage.getItem('cart')) || [];
return cart.map(item => ({
  'item_id': item.id,
  'item_name': item.name,
  'item_category': item.category || 'laptops', // Valor por defecto si no hay categoría
  'item_brand': 'TheCocktail',
  'price': item.price,
  'quantity': item.quantity
}));
}

function calculateCartTotal(cartItems) {
// Calcular el subtotal de los productos
const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

// Añadir costos de envío si están disponibles
const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
const shippingCost = shippingMethod === 'Envío Estándar' ? 4.99 : 9.99;

// Añadir impuestos (0 por defecto)
const taxes = 0;

return subtotal + shippingCost + taxes;
}