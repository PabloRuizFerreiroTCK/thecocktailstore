import { CartPageUI } from "./ui/cartPageUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const cartPageUI = new CartPageUI();
window.cartUIInstance = cartUI;

// Esperar a que los datos del carrito se carguen
setTimeout(() => {
  // Evento de visualización de la página del carrito
  trackCartView();
  
  // Configurar eventos de tracking
  setupEventTracking();
}, 1000);
});

function trackCartView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const hasCoupon = checkIfCouponApplied();
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'view_cart',
  'item_list_id': listId,
  'item_list_name': listName,
  'currency': 'USD',
  'value': cartTotal,
  'taxes': 0,
  'has_coupon': hasCoupon,
  'coupon': getCouponCode(),
  'items': cartItems
});
console.log('Evento view_cart enviado');
}

function setupEventTracking() {
// Rastrear clics en botones de cantidad (+ y -)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('quantity-btn')) {
    const isPlus = e.target.classList.contains('plus');
    const cartItem = e.target.closest('.cart-item');
    
    if (cartItem) {
      const productId = cartItem.dataset.id;
      const productName = cartItem.querySelector('.item-name')?.textContent || 'Producto';
      const productCategory = cartItem.dataset.category || 'Categoría';
      const productPrice = parseFloat(cartItem.dataset.price || 0);
      const quantity = 1;
      const value = productPrice * quantity;
      const listId = localStorage.getItem('last_list_id') || '1';
      const listName = localStorage.getItem('last_list_name') || 'Todos';
      
      if (isPlus) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'add_to_cart',
          'item_list_id': listId,
          'item_list_name': listName,
          'currency': 'USD',
          'value': value,
          'taxes': 0,
          'coupon': getCouponCode(),
          'has_coupon': checkIfCouponApplied(),
          'items': [{
            'item_id': productId,
            'item_name': productName,
            'item_category': productCategory,
            'item_brand': 'TheCocktail',
            'price': productPrice,
            'quantity': quantity
          }]
        });
        console.log(`Evento add_to_cart enviado: ${productName} +1`);
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'remove_from_cart',
          'item_list_id': listId,
          'item_list_name': listName,
          'currency': 'USD',
          'value': value,
          'taxes': 0,
          'coupon': getCouponCode(),
          'has_coupon': checkIfCouponApplied(),
          'items': [{
            'item_id': productId,
            'item_name': productName,
            'item_category': productCategory,
            'item_brand': 'TheCocktail',
            'price': productPrice,
            'quantity': quantity
          }]
        });
        console.log(`Evento remove_from_cart enviado: ${productName} -1`);
      }
    }
  }
});

// Rastrear aplicación de cupón
const applyCouponBtn = document.querySelector('.apply-coupon');
if (applyCouponBtn) {
  applyCouponBtn.addEventListener('click', () => {
    const couponInput = document.querySelector('.coupon-section input');
    const couponCode = couponInput.value.trim();
    
    if (couponCode) {
      // Guardar el cupón en localStorage para usarlo en otros eventos
      localStorage.setItem('coupon', couponCode);
      localStorage.setItem('has_coupon', 'true');
      
      const cartItems = getCartItems();
      const cartTotal = calculateCartTotal(cartItems);
      const listId = localStorage.getItem('last_list_id') || '1';
      const listName = localStorage.getItem('last_list_name') || 'Todos';
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'add_coupon',
        'item_list_id': listId,
        'item_list_name': listName,
        'coupon': couponCode,
        'value': cartTotal,
        'taxes': 0,
        'currency': 'USD',
        'has_coupon': true,
        'items': cartItems
      });
      console.log(`Evento add_coupon enviado: ${couponCode}`);
    }
  });
}

// Rastrear clic en "Continuar Comprando"
const continueShoppingBtn = document.querySelector('.continue-shopping');
if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    const couponCode = getCouponCode();
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'continue_shopping',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'coupon': couponCode,
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log('Evento continue_shopping enviado');
  });
}

// Rastrear clic en "Proceder al Checkout"
const checkoutBtn = document.querySelector('.checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    const couponCode = getCouponCode();
    const cartTotal = calculateCartTotal(cartItems);
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'item_list_name': listName,
      'checkout_step': 1,
      'currency': 'USD',
      'value': cartTotal,
      'taxes': 0,
      'coupon': couponCode,
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log('Evento begin_checkout enviado');
  });
}

// Rastrear clics en el icono del carrito
const cartIcon = document.querySelector('.nav__cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    const cartItems = getCartItems();
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_icon_click',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'coupon': getCouponCode(),
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log('Evento view_cart_icon_click enviado');
  });
}
}

function getCartItems() {
try {
  const cartItemElements = document.querySelectorAll('.cart-item');
  if (cartItemElements.length === 0) {
    return [];
  }
  
  return Array.from(cartItemElements).map(item => {
    const id = item.dataset.id;
    const name = item.querySelector('.item-name')?.textContent || 'Producto';
    const category = item.dataset.category || 'Categoría';
    const price = parseFloat(item.dataset.price || 0);
    const quantityInput = item.querySelector('.item-quantity input');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    return {
      'item_id': id,
      'item_name': name,
      'item_category': category,
      'item_brand': 'TheCocktail',
      'price': price,
      'quantity': quantity
    };
  });
} catch (error) {
  console.error('Error obteniendo items del carrito:', error);
  return [];
}
}

function calculateCartTotal(cartItems) {
return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function checkIfCouponApplied() {
return localStorage.getItem('has_coupon') === 'true';
}

function getCouponCode() {
return localStorage.getItem('coupon') || '';
}