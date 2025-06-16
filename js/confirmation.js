import { ConfirmationUI } from "./ui/confirmationUI.js";

document.addEventListener("DOMContentLoaded", () => {
const confirmationUI = new ConfirmationUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  // Evento de compra completada
  trackPurchase();
  
  // Configurar eventos de tracking
  setupEventTracking();
}, 1000);
});

function trackPurchase() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const shippingMethod = getShippingMethod();
const paymentMethod = getPaymentMethod();
const couponCode = getCouponCode();
const transactionId = generateTransactionId();
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

// Guardar el ID de transacción para referencia futura
localStorage.setItem('last_transaction_id', transactionId);

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'purchase',
  'item_list_id': listId,
  'item_list_name': listName,
  'transaction_id': transactionId,
  'checkout_step': 3,
  'payment_type': paymentMethod,
  'shipping_tier': shippingMethod,
  'currency': 'USD',
  'taxes': 0,
  'value': cartTotal,
  'coupon': couponCode,
  'has_coupon': checkIfCouponApplied(),
  'items': cartItems
});
console.log(`Evento purchase enviado: Transacción ${transactionId}`);
}

function setupEventTracking() {
// Rastrear clic en "Continuar Comprando"
const continueShoppingBtn = document.querySelector('.button.button--primary');
if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', () => {
    const listId = localStorage.getItem('last_list_id') || '1';
    const listName = localStorage.getItem('last_list_name') || 'Todos';
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'continue_shopping',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'coupon': getCouponCode(),
      'has_coupon': checkIfCouponApplied(),
      'items': getCartItems()
    });
    console.log('Evento continue_shopping enviado');
    
    // Limpiar el carrito y los cupones después de una compra exitosa
    localStorage.removeItem('cart');
    localStorage.removeItem('coupon');
    localStorage.removeItem('has_coupon');
  });
}
}

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

function calculateCartTotal(cartItems) {
return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCouponCode() {
return localStorage.getItem('coupon') || '';
}

function checkIfCouponApplied() {
return localStorage.getItem('has_coupon') === 'true';
}

function getShippingMethod() {
return localStorage.getItem('shipping_method') || 'Envío Estándar';
}

function getPaymentMethod() {
return localStorage.getItem('payment_method') || 'Tarjeta';
}

function generateTransactionId() {
return '111111-' + Math.floor(Math.random() * 1000000);
}