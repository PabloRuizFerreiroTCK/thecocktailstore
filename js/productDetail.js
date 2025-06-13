import { ProductDetailUI } from "./ui/productDetailUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const productDetailUI = new ProductDetailUI();
window.cartUIInstance = cartUI;

// NUEVO: Esperar a que los datos del producto se carguen
setTimeout(() => {
  // Evento de visualización de la página de detalles
  const productData = getProductData();
  window.dataLayer.push({
    'event': 'view_item',
    'item_list_id': '1',
    'currency': 'USD',
    'value': productData.price,
    'items': [{
      'item_id': productData.id,
      'item_name': productData.name,
      'item_category': productData.category,
      'item_brand': 'TheCocktail',
      'price': productData.price,
      'quantity': 1
    }]
  });
  
  // Configurar eventos de tracking
  setupEventTracking(productData);
}, 1000);
});

// NUEVO: Función para configurar eventos de tracking
function setupEventTracking(productData) {
// Rastrear clic en "Añadir al Carrito"
const addToCartBtn = document.querySelector('.add-to-cart');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    window.dataLayer.push({
      'event': 'add_to_cart',
      'currency': 'USD',
      'value': productData.price * quantity,
      'items': [{
        'item_id': productData.id,
        'item_name': productData.name,
        'item_category': productData.category,
        'item_brand': 'TheCocktail',
        'price': productData.price,
        'quantity': quantity
      }]
    });
  });
}

// NUEVO: Rastrear clics en botones de cantidad (+ y -)
const quantityBtns = document.querySelectorAll('.quantity-btn');
if (quantityBtns.length > 0) {
  quantityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isPlus = e.target.classList.contains('plus');
      const quantity = 1; // Siempre es 1 para add/remove
      
      if (isPlus) {
        window.dataLayer.push({
          'event': 'add_to_cart',
          'currency': 'USD',
          'value': productData.price * quantity,
          'items': [{
            'item_id': productData.id,
            'item_name': productData.name,
            'item_category': productData.category,
            'item_brand': 'TheCocktail',
            'price': productData.price,
            'quantity': quantity
          }]
        });
      } else {
        window.dataLayer.push({
          'event': 'remove_from_cart',
          'currency': 'USD',
          'value': productData.price * quantity,
          'items': [{
            'item_id': productData.id,
            'item_name': productData.name,
            'item_category': productData.category,
            'item_brand': 'TheCocktail',
            'price': productData.price,
            'quantity': quantity
          }]
        });
      }
    });
  });
}

// Rastrear clics en el icono del carrito
const cartIcon = document.querySelector('.nav__cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    window.dataLayer.push({
      'event': 'view_cart_icon_click',
      'currency': 'USD',
      'items': getCartItems()
    });
  });
}
}

// NUEVO: Función para obtener datos del producto
function getProductData() {
try {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const productTitle = document.querySelector('.product-title').textContent;
  const productPriceText = document.querySelector('.product-price').textContent;
  const productPrice = parseFloat(productPriceText.replace('$', '').trim());
  const productCategory = document.querySelector('.category').textContent;
  
  return {
    id: productId,
    name: productTitle,
    price: productPrice,
    category: productCategory
  };
} catch (error) {
  console.error('Error obteniendo datos del producto:', error);
  return { id: '1', name: 'Producto', price: 0, category: 'Categoría' };
}
}

// NUEVO: Función para obtener productos del carrito
function getCartItems() {
const cart = JSON.parse(localStorage.getItem('cart')) || [];
return cart.map(item => ({
  'item_id': item.id,
  'item_name': item.name,
  'item_category': item.category,
  'item_brand': 'TheCocktail',
  'price': item.price,
  'quantity': item.quantity
}));
}