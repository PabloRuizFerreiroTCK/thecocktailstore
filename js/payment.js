import { PaymentUI } from "./ui/paymentUI.js";

document.addEventListener("DOMContentLoaded", () => {
const paymentUI = new PaymentUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  trackPaymentView();
  setupEventTracking();
}, 1000);
});

function trackPaymentView() {
const cartItems = getCartItems();
const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';
const paymentMethod = localStorage.getItem('payment_method') || 'Tarjeta';

// Calcular el valor total aquí por primera vez
const value = calculateTotalValue(cartItems, shippingMethod);

// Guardar el valor total en localStorage para usarlo en la página de confirmación
localStorage.setItem('total_value', value.toString());

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'view_payment_page',
  'item_list_id': listId,
  'checkout_step': 2,
  'payment_type': paymentMethod,
  'shipping_tier': shippingMethod,
  'currency': 'USD',
  'value': value,
  'coupon': getCouponCode(),
  'has_coupon': checkIfCouponApplied(),
  'items': cartItems
});
console.log('Evento view_payment_page enviado');
}

function setupEventTracking() {
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

// Rastrear selección de método de pago
const paymentOptions = document.querySelectorAll('input[name="payment"]');
paymentOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    const paymentMethod = e.target.id === 'credit-card' ? 'Tarjeta' : 'Paypal';
    const cartItems = getCartItems();
    const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
    const value = parseFloat(localStorage.getItem('total_value')) || calculateTotalValue(cartItems, shippingMethod);
    
    // Guardar el método de pago en localStorage
    localStorage.setItem('payment_method', paymentMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_payment_info',
      'item_list_id': listId,
      'payment_type': paymentMethod,
      'value': value,
      'currency': 'USD',
      'coupon': getCouponCode(),
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log(`Evento add_payment_info enviado: Método ${paymentMethod}`);
  });
});

// Rastrear clic en "Revisar y Finalizar"
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    // No prevenir el envío del formulario
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').id === 'credit-card' ? 'Tarjeta' : 'Paypal';
    const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
    const cartItems = getCartItems();
    const value = parseFloat(localStorage.getItem('total_value')) || calculateTotalValue(cartItems, shippingMethod);
    
    // Guardar el método de pago en localStorage
    localStorage.setItem('payment_method', paymentMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'checkout_progress',
      'item_list_id': listId,
      'checkout_step': 3,
      'payment_type': paymentMethod,
      'shipping_tier': shippingMethod,
      'currency': 'USD',
      'value': value,
      'coupon': getCouponCode(),
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log('Evento checkout_progress enviado: Revisar y Finalizar');
  });
}

// Rastrear clic en "Volver a Envío"
const backToShippingBtn = document.querySelector('a[href="/checkout.html"]');
if (backToShippingBtn) {
  backToShippingBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'checkout_step': 1,
      'currency': 'USD',
      'coupon': getCouponCode(),
      'has_coupon': checkIfCouponApplied(),
      'items': cartItems
    });
    console.log('Evento begin_checkout enviado: Volver a Envío');
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

function calculateTotalValue(cartItems, shippingMethod) {
// Calcular el subtotal de los productos
const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

// Añadir costos de envío
const shippingCost = shippingMethod === 'Envío Estándar' ? 4.99 : 9.99;

// Añadir impuestos (0 por defecto)
const taxes = 0;

return subtotal + shippingCost + taxes;
}

function getCouponCode() {
return localStorage.getItem('coupon') || '';
}

function checkIfCouponApplied() {
return localStorage.getItem('has_coupon') === 'true';
}