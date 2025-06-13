import { ConfirmationUI } from "./ui/confirmationUI.js";

document.addEventListener("DOMContentLoaded", () => {
const confirmationUI = new ConfirmationUI();

// NUEVO: Esperar a que los datos se carguen
setTimeout(() => {
  // Evento de compra completada
  trackPurchase();
  
  // Configurar eventos de tracking
  setupEventTracking();
}, 1000);
});

// NUEVO: Función para rastrear la compra
function trackPurchase() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const shippingMethod = getShippingMethod();
const paymentMethod = getPaymentMethod();
const couponCode = getCouponCode();
const transactionId = generateTransactionId();

// Guardar el ID de transacción para referencia futura
localStorage.setItem('last_transaction_id', transactionId);

window.dataLayer.push({
  'event': 'purchase',
  'item_list_id': '1',
  'transaction_id': transactionId,
  'checkout_step': 3,
  'payment_type': paymentMethod,
  'shipping_tier': shippingMethod,
  'currency': 'USD',
  'taxes': 0,
  'value': cartTotal,
  'coupon': couponCode,
  'items': cartItems
});
}

// NUEVO: Función para configurar eventos de tracking
function setupEventTracking() {
// Rastrear clic en "Continuar Comprando"
const continueShoppingBtn = document.querySelector('.button.button--primary');
if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', () => {
    window.dataLayer.push({
      'event': 'continue_shopping',
      'item_list_id': '1',
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
  console.error('Error obteniendo items de la confirmación:', error);
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

// NUEVO: Función para obtener el método de pago
function getPaymentMethod() {
return localStorage.getItem('payment_method') || 'Tarjeta';
}

// NUEVO: Función para generar un ID de transacción único
function generateTransactionId() {
return '111111-' + Math.floor(Math.random() * 1000000);
}