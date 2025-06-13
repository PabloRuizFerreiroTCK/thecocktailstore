import { CheckoutUI } from "./ui/checkoutUI.js";

document.addEventListener("DOMContentLoaded", () => {
const checkoutUI = new CheckoutUI();

// NUEVO: Esperar a que los datos se carguen
setTimeout(() => {
  // Evento de visualización de la página de envío
  trackCheckoutView();
  
  // Configurar eventos de tracking
  setupEventTracking();
}, 1000);
});

// NUEVO: Función para rastrear visualización de la página de envío
function trackCheckoutView() {
const cartItems = getCartItems();
const cartTotal = calculateCartTotal(cartItems);
const couponCode = getCouponCode();

window.dataLayer.push({
  'event': 'checkout_progress',
  'item_list_id': '1',
  'checkout_step': 1,
  'currency': 'USD',
  'coupon': couponCode,
  'shipping_tier': 'Envío Estándar', // Valor por defecto
  'taxes': 0,
  'value': cartTotal,
  'items': cartItems
});
}

// NUEVO: Función para configurar eventos de tracking
function setupEventTracking() {
// Rastrear selección de país
const countrySelect = document.getElementById('country');
if (countrySelect) {
  countrySelect.addEventListener('change', () => {
    if (countrySelect.value) {
      const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text;
      
      window.dataLayer.push({
        'event': 'add_shipping_info',
        'item_list_id': '1',
        'selected_value': selectedCountry,
        'country': selectedCountry
      });
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
    const couponCode = getCouponCode();
    
    window.dataLayer.push({
      'event': 'add_shipping_info',
      'item_list_id': '1',
      'currency': 'USD',
      'shipping_tier': shippingMethod,
      'taxes': 0,
      'value': cartTotal,
      'coupon': couponCode,
      'items': [{
        'item_id': e.target.id === 'standard' ? '1' : '2'
      }]
    });
  });
});

// Rastrear clic en "Continuar a Pago"
const shippingForm = document.getElementById('shipping-form');
if (shippingForm) {
  shippingForm.addEventListener('submit', (e) => {
    // No prevenir el envío del formulario
    
    const shippingMethod = document.querySelector('input[name="shipping"]:checked').id === 'standard' ? 'Envío Estándar' : 'Envío Express';
    const cartItems = getCartItems();
    const cartTotal = calculateCartTotal(cartItems);
    
    window.dataLayer.push({
      'event': 'checkout_progress',
      'item_list_id': '1',
      'checkout_step': 2,
      'shipping_tier': shippingMethod,
      'currency': 'USD',
      'taxes': 0,
      'value': cartTotal,
      'items': cartItems
    });
  });
}

// CORREGIDO: Rastrear clic en "Volver al Carrito"
const backToCartBtn = document.querySelector('a[href="/cart.html"]');
if (backToCartBtn) {
  backToCartBtn.addEventListener('click', () => {
    const cartItems = getCartItems();
    
    window.dataLayer.push({
      'event': 'view_cart_icon_click',
      'item_list_id': '1',
      'currency': 'USD',
      'items': cartItems
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
  console.error('Error obteniendo items del checkout:', error);
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