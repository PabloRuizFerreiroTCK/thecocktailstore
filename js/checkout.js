import { CheckoutUI } from "./ui/checkoutUI.js";

document.addEventListener("DOMContentLoaded", () => {
const checkoutUI = new CheckoutUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  trackCheckoutView();
  setupEventTracking();
}, 1000);
});

function trackCheckoutView() {
const cartItems = getCartItems();
const couponCode = localStorage.getItem('coupon') || '';
const hasCoupon = localStorage.getItem('has_coupon') === 'true';
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';
const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'view_sending_page',
  'item_list_id': listId,
  'checkout_step': 1,
  'currency': 'USD',
  'shipping_tier': shippingMethod,
  'coupon': couponCode,
  'has_coupon': hasCoupon,
  'items': cartItems
});
console.log('Evento view_sending_page enviado');
}

function setupEventTracking() {
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

// Rastrear selección de país
const countrySelect = document.getElementById('country');
if (countrySelect) {
  countrySelect.addEventListener('change', () => {
    if (countrySelect.value) {
      const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text;
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'add_shipping_info',
        'country_name': selectedCountry,
        'country_id': selectedCountry,
        'currency': 'USD'
      });
      console.log(`Evento add_shipping_info enviado: País ${selectedCountry}`);
    }
  });
}

// Rastrear selección de método de envío
const shippingOptions = document.querySelectorAll('input[name="shipping"]');
shippingOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    const shippingMethod = e.target.id === 'standard' ? 'Envío Estándar' : 'Envío Express';
    const cartItems = getCartItems();
    const couponCode = localStorage.getItem('coupon') || '';
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    // Guardar el método de envío en localStorage
    localStorage.setItem('shipping_method', shippingMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_shipping_info',
      'item_list_id': listId,
      'currency': 'USD',
      'shipping_tier': shippingMethod,
      'coupon': couponCode,
      'items': cartItems
    });
    console.log(`Evento add_shipping_info enviado: Método ${shippingMethod}`);
  });
});

// Rastrear clic en "Continuar a Pago"
const shippingForm = document.getElementById('shipping-form');
if (shippingForm) {
  shippingForm.addEventListener('submit', (e) => {
    // No prevenir el envío del formulario
    
    const shippingMethod = document.querySelector('input[name="shipping"]:checked').id === 'standard' ? 'Envío Estándar' : 'Envío Express';
    const cartItems = getCartItems();
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    // Guardar el método de envío en localStorage
    localStorage.setItem('shipping_method', shippingMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'checkout_progress',
      'item_list_id': listId,
      'checkout_step': 2,
      'shipping_tier': shippingMethod,
      'currency': 'USD',
      'coupon': getCouponCode(),
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log('Evento checkout_progress enviado: Continuar a Pago');
  });
}

// Rastrear clic en "Volver al Carrito"
const backToCartBtn = document.querySelector('a[href="/cart.html"]');
if (backToCartBtn) {
  backToCartBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_click',
      'item_list_id': listId,
      'currency': 'USD',
      'items': cartItems
    });
    console.log('Evento view_cart_click enviado: Volver al Carrito');
  });
}
}

function getCartItems() {
const cart = JSON.parse(localStorage.getItem('cart')) || [];
return cart.map(item => ({
  'item_id': item.id,
  'item_name': item.name,
  'item_category': item.category || 'laptops',
  'item_brand': 'TheCocktail',
  'price': item.price,
  'quantity': item.quantity
}));
}

function getCouponCode() {
return localStorage.getItem('coupon') || '';
}

function checkIfCouponApplied() {
return localStorage.getItem('has_coupon') === 'true';
}