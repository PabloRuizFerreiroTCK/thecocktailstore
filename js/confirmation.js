import { ConfirmationUI } from "./ui/confirmationUI.js";

document.addEventListener("DOMContentLoaded", () => {
const confirmationUI = new ConfirmationUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  trackPurchase();
  setupEventTracking();
}, 500);
});

function trackPurchase() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const shippingMethod = localStorage.getItem('shipping_method') || 'Envío Estándar';
const paymentMethod = localStorage.getItem('payment_method') || 'Tarjeta';
const couponCode = localStorage.getItem('coupon') || '';
const hasCoupon = localStorage.getItem('has_coupon') === 'true';
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
  'value': cartTotal,
  'coupon': couponCode,
  'has_coupon': hasCoupon,
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
    
    // Limpiar el carrito y los cupones después de una compra exitosa
    localStorage.removeItem('cart');
    localStorage.removeItem('coupon');
    localStorage.removeItem('has_coupon');
    
    setTimeout(() => {
      window.location.href = '/';
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
  console.error('Error obteniendo items de la confirmación:', error);
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

function generateTransactionId() {
return '111111-' + Math.floor(Math.random() * 1000000);
}