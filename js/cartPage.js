import { CartPageUI } from "./ui/cartPageUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const cartPageUI = new CartPageUI();
window.cartUIInstance = cartUI;

// Esperar a que los datos del carrito se carguen
setTimeout(() => {
  trackCartView();
  setupEventTracking();
}, 500);
});

function trackCartView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const hasCoupon = localStorage.getItem('has_coupon') === 'true';
const couponCode = localStorage.getItem('coupon') || '';
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'view_cart',
  'item_list_id': listId,
  'currency': 'USD',
  'value': cartTotal,
  'has_coupon': hasCoupon,
  'coupon': couponCode,
  'items': cartItems
});
console.log('Evento view_cart enviado');
}

function setupEventTracking() {
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

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
      const value = productPrice;
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': isPlus ? 'add_to_cart' : 'remove_from_cart',
        'item_list_id': listId,
        'currency': 'USD',
        'value': value,
        'items': [{
          'item_id': productId,
          'item_name': productName,
          'item_category': productCategory,
          'item_brand': 'TheCocktail',
          'price': productPrice,
          'quantity': 1
        }]
      });
      console.log(`Evento ${isPlus ? 'add_to_cart' : 'remove_from_cart'} enviado: ${productName}`);
    }
  }
});

// Rastrear aplicación de cupón
const applyCouponBtn = document.querySelector('.apply-coupon');
if (applyCouponBtn) {
  applyCouponBtn.addEventListener('click', () => {
    const couponInput = document.querySelector('.coupon-section input');
    if (!couponInput) return;
    
    const couponCode = couponInput.value.trim();
    if (!couponCode) return;
    
    // Guardar el cupón en localStorage
    localStorage.setItem('coupon', couponCode);
    localStorage.setItem('has_coupon', 'true');
    
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_coupon',
      'item_list_id': listId,
      'coupon': couponCode,
      'currency': 'USD',
      'value': cartTotal,
      'items': cartItems
    });
    console.log(`Evento add_coupon enviado: ${couponCode}`);
  });
}

// Rastrear clic en "Continuar Comprando"
const continueShoppingBtn = document.querySelector('.continue-shopping');
if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'continue_shopping',
      'item_list_id': listId,
      'currency': 'USD',
      'items': getCartItems()
    });
    console.log('Evento continue_shopping enviado');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  });
}

// Rastrear clic en "Proceder al Checkout"
const checkoutBtn = document.querySelector('.checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    const hasCoupon = localStorage.getItem('has_coupon') === 'true';
    const couponCode = localStorage.getItem('coupon') || '';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'checkout_step': 1,
      'currency': 'USD',
      'value': cartTotal,
      'has_coupon': hasCoupon,
      'coupon': couponCode,
      'items': cartItems
    });
    console.log('Evento begin_checkout enviado');
    
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 100);
  });
}

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

// Rastrear clics en redes sociales
const socialLinks = document.querySelectorAll('.footer__social-link');
socialLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const networkElement = e.currentTarget.querySelector('i');
    const network = networkElement.classList.contains('fa-facebook') ? 'Facebook' :
                   networkElement.classList.contains('fa-twitter') ? 'Twitter' : 'Instagram';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'social_share',
      'social_network': network,
      'items': getCartItems()
    });
    console.log(`Evento social_share enviado: ${network}`);
  });
});
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
    const couponCode = localStorage.getItem('coupon') || '';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'checkout_step': 1,
      'currency': 'USD',
      'has_coupon': hasCoupon,
      'coupon': couponCode,
      'value': cartTotal,
      'items': cartItems
    });
    console.log('Evento begin_checkout enviado');
    
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 100);
  };
}

// Configurar los botones + y - en el carrito desplegable
const plusButtons = document.querySelectorAll('.cart-modal__item-quantity-btn.plus');
const minusButtons = document.querySelectorAll('.cart-modal__item-quantity-btn.minus');

plusButtons.forEach(btn => {
  btn.onclick = function() {
    const cartItem = this.closest('.cart-modal__item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.id;
    const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
    const productCategory = cartItem.dataset.category || 'Categoría';
    const productPrice = parseFloat(cartItem.dataset.price || 0);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_to_cart',
      'item_list_id': listId,
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
    console.log(`Evento add_to_cart enviado: ${productName} +1`);
  };
});

minusButtons.forEach(btn => {
  btn.onclick = function() {
    const cartItem = this.closest('.cart-modal__item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.id;
    const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
    const productCategory = cartItem.dataset.category || 'Categoría';
    const productPrice = parseFloat(cartItem.dataset.price || 0);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'remove_from_cart',
      'item_list_id': listId,
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
    console.log(`Evento remove_from_cart enviado: ${productName} -1`);
  };
});
}

function getCartItems() {
try {
  // Intentar obtener los items del DOM primero
  const cartItemElements = document.querySelectorAll('.cart-item');
  if (cartItemElements.length > 0) {
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
  }
  
  // Si no hay elementos en el DOM, usar localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.map(item => ({
    'item_id': item.id,
    'item_name': item.name,
    'item_category': item.category,
    'item_brand': 'TheCocktail',
    'price': item.price,
    'quantity': item.quantity
  }));
} catch (error) {
  console.error('Error obteniendo items del carrito:', error);
  return [];
}
}

function calculateCartTotal(cartItems) {
return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}