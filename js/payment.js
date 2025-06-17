import { PaymentUI } from "./ui/paymentUI.js";

document.addEventListener("DOMContentLoaded", () => {
const paymentUI = new PaymentUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  trackPaymentView();
  setupEventTracking();
}, 500);
});

function trackPaymentView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
const couponCode = localStorage.getItem('coupon') || '';
const hasCoupon = localStorage.getItem('has_coupon') === 'true';
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';
const paymentMethod = localStorage.getItem('payment_method') || 'Tarjeta';

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'view_payment_page',
  'item_list_id': listId,
  'checkout_step': 2,
  'payment_type': paymentMethod,
  'shipping_tier': shippingMethod,
  'currency': 'USD',
  'value': cartTotal,
  'coupon': couponCode,
  'has_coupon': hasCoupon,
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
    const cartTotal = calculateCartTotal(cartItems);
    const couponCode = localStorage.getItem('coupon') || '';
    const hasCoupon = localStorage.getItem('has_coupon') === 'true';
    
    // Guardar el método de pago en localStorage
    localStorage.setItem('payment_method', paymentMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_payment_info',
      'item_list_id': listId,
      'payment_type': paymentMethod,
      'value': cartTotal,
      'currency': 'USD',
      'coupon': couponCode,
      'has_coupon': hasCoupon,
      'items': cartItems
    });
    console.log(`Evento add_payment_info enviado: Método ${paymentMethod}`);
  });
});

// Rastrear clic en "Revisar y Finalizar"
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').id === 'credit-card' ? 'Tarjeta' : 'Paypal';
    const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    const couponCode = localStorage.getItem('coupon') || '';
    const hasCoupon = localStorage.getItem('has_coupon') === 'true';
    
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
      'value': cartTotal,
      'coupon': couponCode,
      'has_coupon': hasCoupon,
      'items': cartItems
    });
    console.log('Evento checkout_progress enviado: Revisar y Finalizar');
    
    setTimeout(() => {
      window.location.href = 'confirmation.html';
    }, 100);
  });
}

// Rastrear clic en "Volver a Envío"
const backToShippingBtn = document.querySelector('a[href="/checkout.html"]');
if (backToShippingBtn) {
  backToShippingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    const couponCode = localStorage.getItem('coupon') || '';
    const hasCoupon = localStorage.getItem('has_coupon') === 'true';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'item_list_id': listId,
      'checkout_step': 1,
      'currency': 'USD',
      'value': cartTotal,
      'coupon': couponCode,
      'has_coupon': hasCoupon,
      'items': cartItems
    });
    console.log('Evento begin_checkout enviado: Volver a Envío');
    
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 100);
  });
}
}

function getCartItems() {
try {
  // Intentar obtener los items del DOM primero
  const orderItems = document.querySelectorAll('.order-item');
  if (orderItems.length > 0) {
    return Array.from(orderItems).map(item => {
      const id = item.dataset.id || '';
      const name = item.querySelector('.item-name')?.textContent || 'Producto';
      const category = item.dataset.category || 'laptops';
      const priceElement = item.querySelector('.item-price');
      const price = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
      const quantityElement = item.querySelector('.item-quantity');
      const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;
      
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
    'item_category': item.category || 'laptops',
    'item_brand': 'TheCocktail',
    'price': item.price,
    'quantity': item.quantity
  }));
} catch (error) {
  console.error('Error obteniendo items del pago:', error);
  return [];
}
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