import { CheckoutUI } from "./ui/checkoutUI.js";

document.addEventListener("DOMContentLoaded", () => {
const checkoutUI = new CheckoutUI();

// Esperar a que los datos se carguen
setTimeout(() => {
  trackCheckoutView();
  setupEventTracking();
}, 500);
});

function trackCheckoutView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
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
  'value': cartTotal,
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
    const cartTotal = calculateCartTotal(cartItems);
    const couponCode = localStorage.getItem('coupon') || '';
    
    // Guardar el método de envío en localStorage
    localStorage.setItem('shipping_method', shippingMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_shipping_info',
      'item_list_id': listId,
      'currency': 'USD',
      'shipping_tier': shippingMethod,
      'value': cartTotal,
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
    e.preventDefault();
    
    const shippingMethod = document.querySelector('input[name="shipping"]:checked').id === 'standard' ? 'Envío Estándar' : 'Envío Express';
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    const couponCode = localStorage.getItem('coupon') || '';
    const hasCoupon = localStorage.getItem('has_coupon') === 'true';
    
    // Guardar el método de envío en localStorage
    localStorage.setItem('shipping_method', shippingMethod);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'checkout_progress',
      'item_list_id': listId,
      'checkout_step': 2,
      'shipping_tier': shippingMethod,
      'currency': 'USD',
      'value': cartTotal,
      'coupon': couponCode,
      'has_coupon': hasCoupon,
      'items': cartItems
    });
    console.log('Evento checkout_progress enviado: Continuar a Pago');
    
    setTimeout(() => {
      window.location.href = 'payment.html';
    }, 100);
  });
}

// Rastrear clic en "Volver al Carrito"
const backToCartBtn = document.querySelector('a[href="/cart.html"]');
if (backToCartBtn) {
  backToCartBtn.addEventListener('click', (e) => {
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
    console.log('Evento view_cart_click enviado: Volver al Carrito');
    
    setTimeout(() => {
      window.location.href = 'cart.html';
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
  console.error('Error obteniendo items del checkout:', error);
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