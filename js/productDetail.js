import { ProductDetailUI } from "./ui/productDetailUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
const productDetailUI = new ProductDetailUI();
window.cartUIInstance = cartUI;

// Esperar a que los datos del producto se carguen
setTimeout(() => {
  // Evento de visualización de la página de detalles
  const productData = getProductData();
  const listId = localStorage.getItem('last_list_id') || '1';
  const listName = localStorage.getItem('last_list_name') || 'Todos';
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'view_item',
    'item_list_id': listId,
    'item_list_name': listName,
    'currency': 'USD',
    'value': productData.price,
    'taxes': 0,
    'items': [{
      'item_id': productData.id,
      'item_name': productData.name,
      'item_category': productData.category,
      'item_brand': 'TheCocktail',
      'price': productData.price,
      'quantity': 1
    }]
  });
  console.log(`Evento view_item enviado: ${productData.name}`);
  
  // Configurar eventos de tracking
  setupEventTracking(productData, listId, listName);
}, 1000);
});

function setupEventTracking(productData, listId, listName) {
// Rastrear clic en "Añadir al Carrito"
const addToCartBtn = document.querySelector('.add-to-cart');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const value = productData.price * quantity;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_to_cart',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'value': value,
      'taxes': 0,
      'items': [{
        'item_id': productData.id,
        'item_name': productData.name,
        'item_category': productData.category,
        'item_brand': 'TheCocktail',
        'price': productData.price,
        'quantity': quantity
      }]
    });
    console.log(`Evento add_to_cart enviado: ${productData.name} x${quantity}`);
  });
}

// Rastrear clics en botones de cantidad (+ y -)
const quantityBtns = document.querySelectorAll('.quantity-btn');
if (quantityBtns.length > 0) {
  quantityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isPlus = e.target.classList.contains('plus');
      const quantity = 1; // Siempre es 1 para add/remove
      const value = productData.price * quantity;
      
      if (isPlus) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'add_to_cart',
          'item_list_id': listId,
          'item_list_name': listName,
          'currency': 'USD',
          'value': value,
          'taxes': 0,
          'items': [{
            'item_id': productData.id,
            'item_name': productData.name,
            'item_category': productData.category,
            'item_brand': 'TheCocktail',
            'price': productData.price,
            'quantity': quantity
          }]
        });
        console.log(`Evento add_to_cart enviado: ${productData.name} +1`);
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'remove_from_cart',
          'item_list_id': listId,
          'item_list_name': listName,
          'currency': 'USD',
          'value': value,
          'taxes': 0,
          'items': [{
            'item_id': productData.id,
            'item_name': productData.name,
            'item_category': productData.category,
            'item_brand': 'TheCocktail',
            'price': productData.price,
            'quantity': quantity
          }]
        });
        console.log(`Evento remove_from_cart enviado: ${productData.name} -1`);
      }
    });
  });
}

// Rastrear clics en el icono del carrito
const cartIcon = document.querySelector('.nav__cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_cart_icon_click',
      'item_list_id': listId,
      'item_list_name': listName,
      'currency': 'USD',
      'items': getCartItems()
    });
    console.log('Evento view_cart_icon_click enviado');
    
    // Agregar un evento para el botón "Ver Carrito" en el desplegable
    setTimeout(() => {
      const viewCartBtn = document.querySelector('.cart-modal__footer a.button--secondary');
      if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'view_cart_click',
            'item_list_id': listId,
            'item_list_name': listName,
            'currency': 'USD',
            'items': getCartItems()
          });
          console.log('Evento view_cart_click enviado');
        });
      }
    }, 500); // Esperar a que se abra el modal
  });
}
}

function getProductData() {
try {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const productTitle = document.querySelector('.product-title').textContent;
  const productPriceText = document.querySelector('.product-price').textContent;
  const productPrice = parseFloat(productPriceText.replace('$', '').trim());
  const productCategory = document.querySelector('.category').textContent;
  
  // Guardar información del producto en localStorage para usar en otras páginas
  localStorage.setItem('last_viewed_product_id', productId);
  localStorage.setItem('last_viewed_product_name', productTitle);
  localStorage.setItem('last_viewed_product_category', productCategory);
  localStorage.setItem('last_viewed_product_price', productPrice);
  
  return {
    id: productId,
    name: productTitle,
    price: productPrice,
    category: productCategory
  };
} catch (error) {
  console.error('Error obteniendo datos del producto:', error);
  
  // Intentar recuperar del localStorage si hay un error
  const id = localStorage.getItem('last_viewed_product_id') || '1';
  const name = localStorage.getItem('last_viewed_product_name') || 'Producto';
  const price = parseFloat(localStorage.getItem('last_viewed_product_price') || '0');
  const category = localStorage.getItem('last_viewed_product_category') || 'Categoría';
  
  return { id, name, price, category };
}
}

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