import { ConfirmationUI } from "./ui/confirmationUI.js";

document.addEventListener("DOMContentLoaded", () => {
const confirmationUI = new ConfirmationUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  trackPurchase();
  setupEventTracking();
}, 1000);
});

function trackPurchase() {
const cartItems = getCartItems();
const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
const paymentMethod = localStorage.getItem('payment_method') || 'Tarjeta';
const value = parseFloat(localStorage.getItem('total_value')) || 0;
const transactionId = generateTransactionId();
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

// Guardar el ID de transacción para referencia futura
localStorage.setItem('last_transaction_id', transactionId);

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'purchase',
  'item_list_id': listId,
  'transaction_id': transactionId,
  'checkout_step': 3,
  'payment_type': paymentMethod,
  'shipping_tier': shippingMethod,
  'currency': 'USD',
  'taxes': 0,
  'value': value,
  'coupon': getCouponCode(),
  'has_coupon': checkIfCouponApplied(),
  'items': cartItems
});
console.log(`Evento purchase enviado: Transacción ${transactionId}`);
}

function setupEventTracking() {
const listId = localStorage.getItem('last_list_id') || '1';
const listName = localStorage.getItem('last_list_name') || 'Todos';

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

function generateTransactionId() {
return '111111-' + Math.floor(Math.random() * 1000000);
}