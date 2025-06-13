import { CartPageUI } from "./ui/cartPageUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const cartPageUI = new CartPageUI();
window.cartUIInstance = cartUI;

// NUEVO: Esperar a que los datos del carrito se carguen
setTimeout(() => {
  // Evento de visualización de la página del carrito
  trackCartView();
  
  // Configurar eventos de tracking
  setupEventTracking();
}, 1000);
});

// NUEVO: Función para rastrear visualización del carrito
function trackCartView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const hasCoupon = checkIfCouponApplied();

window.dataLayer.push({
  'event': 'view_cart',
  'item_list_id': '1',
  'currency': 'USD',
  'value': cartTotal,
  'has_coupon': hasCoupon,
  'items': cartItems
});
}

// NUEVO: Función para configurar eventos de tracking
function setupEventTracking() {
// Rastrear clics en botones de cantidad (+ y -)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('quantity-btn')) {
    const isPlus = e.target.classList.contains('plus');
    const cartItem = e.target.closest('.cart-item');
    
    if (cartItem) {
      const productId = cartItem.dataset.id;
      const productName = cartItem.querySelector('.item-name').textContent;
      const productCategory = cartItem.dataset.category || 'Categoría';
      const productPrice = parseFloat(cartItem.dataset.price || 0);
      
      if (isPlus) {
        window.dataLayer.push({
          'event': 'add_to_cart',
          'item_list_id': '1',
          'currency': 'USD',
          'value': productPrice,
          'items': [{
            'item_id': productId,
            'item_name': productName,
            'item_category': productCategory,
            'item_brand': 'TheCocktail',
            'price': productPrice,
            'quantity': 1
          }]
        });
      } else {
        window.dataLayer.push({
          'event': 'remove_from_cart',
          'currency': 'USD',
          'item_list_id': '1',
          'value': productPrice,
          'items': [{
            'item_id': productId,
            'item_name': productName,
            'item_category': productCategory,
            'item_brand': 'TheCocktail',
            'price': productPrice,
            'quantity': 1
          }]
        });
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
      const cartItems = getCartItems();
      const cartTotal = calculateCartTotal(cartItems);
      
      window.dataLayer.push({
        'event': 'add_coupon',
        'item_list_id': '1',
        'coupon': couponCode,
        'value': cartTotal,
        'currency': 'USD',
        'items': cartItems
      });
    }
  });
}

// Rastrear clic en "Continuar Comprando"
const continueShoppingBtn = document.querySelector('.continue-shopping');
if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    const couponCode = getCouponCode();
    
    window.dataLayer.push({
      'event': 'continue_shopping',
      'item_list_id': '1',
      'currency': 'USD',
      'coupon': couponCode,
      'items': cartItems
    });
  });
}

// Rastrear clic en "Proceder al Checkout"
const checkoutBtn = document.querySelector('.checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    const couponCode = getCouponCode();
    
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': '1',
      'checkout_step': 1,
      'currency': 'USD',
      'coupon': couponCode,
      'items': cartItems
    });
  });
}
}

// NUEVO: Función para obtener productos del carrito
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

// NUEVO: Función para calcular el total del carrito
function calculateCartTotal(cartItems) {
return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// NUEVO: Función para verificar si hay un cupón aplicado
function checkIfCouponApplied() {
return localStorage.getItem('coupon') !== null;
}

// NUEVO: Función para obtener el código de cupón
function getCouponCode() {
return localStorage.getItem('coupon') || '';
}