import { PaymentUI } from "./ui/paymentUI.js";

document.addEventListener("DOMContentLoaded", () => {
const paymentUI = new PaymentUI();

// NUEVO: Esperar a que los datos se carguen
setTimeout(() => {
  // Evento de visualización de la página de pago
  trackPaymentView();
  
  // Configurar eventos de tracking
  setupEventTracking();
}, 1000);
});

// NUEVO: Función para rastrear visualización de la página de pago
function trackPaymentView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const shippingMethod = getShippingMethod();

window.dataLayer.push({
  'event': 'checkout_progress',
  'item_list_id': '1',
  'checkout_step': 2,
  'payment_type': 'Tarjeta', // Valor por defecto
  'shipping_tier': shippingMethod,
  'currency': 'USD',
  'taxes': 0,
  'value': cartTotal,
  'items': cartItems
});
}

// NUEVO: Función para configurar eventos de tracking
function setupEventTracking() {
// Rastrear selección de método de pago
const paymentOptions = document.querySelectorAll('input[name="payment"]');
paymentOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    const paymentMethod = e.target.id === 'credit-card' ? 'Tarjeta' : 'Paypal';
    const cartTotal = calculateCartTotal(getCartItems());
    const couponCode = getCouponCode();
    
    window.dataLayer.push({
      'event': 'add_payment_info',
      'payment_type': paymentMethod,
      'value': cartTotal,
      'currency': 'USD',
      'taxes': 0,
      'coupon': couponCode,
      'items': [{
        'item_id': e.target.id === 'credit-card' ? '1' : '2'
      }]
    });
  });
});

// Rastrear clic en "Revisar y Finalizar"
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    // No prevenir el envío del formulario
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').id === 'credit-card' ? 'Tarjeta' : 'Paypal';
    const shippingMethod = getShippingMethod();
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    
    window.dataLayer.push({
      'event': 'checkout_progress',
      'checkout_step': 3,
      'payment_type': paymentMethod,
      'shipping_tier': shippingMethod,
      'currency': 'USD',
      'taxes': 0,
      'value': cartTotal,
      'items': cartItems
    });
  });
}

// CORREGIDO: Rastrear clic en "Volver a Envío"
const backToShippingBtn = document.querySelector('a[href="/checkout.html"]');
if (backToShippingBtn) {
  backToShippingBtn.addEventListener('click', () => {
    window.dataLayer.push({
      'event': 'begin_checkout',
      'checkout_step': 1,
      'currency': 'USD',
      'coupon': getCouponCode(),
      'items': getCartItems()
    });
  });
}
}

// NUEVO: Función para obtener productos del carrito
function getCartItems() {
try {
  const orderItems = document.querySelectorAll('.order-item');
  if (orderItems.length === 0) {
    return JSON.parse(localStorage.getItem('cart') || '[]').map(item => ({
      'item_id': item.id,
      'item_name': item.name,
      'item_category': item.category,
      'item_brand': 'TheCocktail',
      'price': item.price,
      'quantity': item.quantity
    }));
  }
  
  return Array.from(orderItems).map(item => {
    const id = item.dataset.id;
    const name = item.querySelector('.item-name')?.textContent || 'Producto';
    const category = item.dataset.category || 'Categoría';
    const price = parseFloat(item.dataset.price || 0);
    const quantity = parseInt(item.querySelector('.item-quantity')?.textContent || 1);
    
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
  console.error('Error obteniendo items del pago:', error);
  return [];
}
}

// NUEVO: Función para calcular el total del carrito
function calculateCartTotal(cartItems) {
return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// NUEVO: Función para obtener el código de cupón
function getCouponCode() {
return localStorage.getItem('coupon') || '';
}

// NUEVO: Función para obtener el método de envío
function getShippingMethod() {
return localStorage.getItem('shipping_method') || 'Envío Estándar';
}