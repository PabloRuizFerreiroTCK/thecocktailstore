import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
constructor() {
  this.initializeApp();
  
  // Evento de visualización de la página principal
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'view_item_list',
    'item_list_id': '1',
    'item_list_name': 'Todos',
    'items': this.getProductItems()
  });
  console.log("Evento view_item_list enviado");
}

initializeApp() {
  this.cartUI = cartUI;
  this.productsUI = productsUI;
  this.currentListName = 'Todos'; // Inicializar con el valor por defecto
  this.currentListId = '1'; // Inicializar con el valor por defecto

  this.setupMobileMenu();
  this.setupEventTracking();
}

setupEventTracking() {
  // 1. Rastrear clic en "Ver Productos"
  const viewProductsBtn = document.querySelector('.hero .button');
  if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'select_item',
        'item_list_id': this.currentListId,
        'item_list_name': this.currentListName,
        'items': this.getProductItems()
      });
      console.log("Evento select_item enviado: Ver Productos");
    });
  }

  // 2. Rastrear clics en botones de filtro
  const filterButtons = document.querySelectorAll('.filter__button');
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter;
      
      // Actualizar el nombre y ID de la lista actual
      this.currentListName = filter === 'all' ? 'Todos' : 
                        filter === 'laptops' ? 'Laptops' : 
                        filter === 'smartphones' ? 'Smartphones' : 'Accesorios';
      
      // Asignar un ID único para cada lista
      this.currentListId = filter === 'all' ? '1' : 
                      filter === 'laptops' ? '2' : 
                      filter === 'smartphones' ? '3' : '4';
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'select_item',
        'item_list_id': this.currentListId,
        'item_list_name': this.currentListName,
        'items': this.getProductItems()
      });
      console.log(`Evento select_item enviado: Filtro ${this.currentListName}`);
    });
  });

  // 3. Rastrear clics en "Ver Detalles"
document.addEventListener('click', (e) => {
// Buscar si el clic fue en un botón "Ver Detalles" o en algún elemento dentro de él
const detailsButton = e.target.closest('.product__button');
if (detailsButton) {
  e.preventDefault(); // Prevenir comportamiento predeterminado
  
  const productCard = detailsButton.closest('.product');
  if (productCard) {
    const productId = productCard.dataset.id;
    const productName = productCard.querySelector('.product__title').textContent;
    const productCategory = productCard.dataset.category;
    const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('$', ''));
    
    // Guardar información del producto y lista en localStorage para usar en otras páginas
    localStorage.setItem('last_viewed_product_id', productId);
    localStorage.setItem('last_viewed_product_name', productName);
    localStorage.setItem('last_viewed_product_category', productCategory);
    localStorage.setItem('last_viewed_product_price', productPrice);
    localStorage.setItem('last_list_id', this.currentListId);
    localStorage.setItem('last_list_name', this.currentListName);
    
    // Enviar el evento select_item
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'select_item',
      'item_list_id': this.currentListId,
      'item_list_name': this.currentListName,
      'items': [{
        'item_id': productId,
        'item_name': productName,
        'item_category': productCategory,
        'item_brand': 'TheCocktail',
        'price': productPrice,
        'currency': 'USD'
      }]
    });
    console.log(`Evento select_item enviado: Ver Detalles de ${productName}`);
    
    // Redirigir después de enviar el evento
    setTimeout(() => {
      window.location.href = `product.html?id=${productId}`;
    }, 100);
  }
}
});

// 4. Rastrear clics en "Añadir al Carrito" (icono azul)
document.addEventListener('click', (e) => {
// Buscar si el clic fue en un icono de carrito o en algún elemento dentro de él
const cartButton = e.target.closest('.product__cart');
if (cartButton) {
  e.preventDefault(); // Prevenir comportamiento predeterminado
  
  const productCard = cartButton.closest('.product');
  if (productCard) {
    const productId = productCard.dataset.id;
    const productName = productCard.querySelector('.product__title').textContent;
    const productCategory = productCard.dataset.category;
    const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('$', ''));
    const quantity = 1;
    const value = productPrice * quantity;
    
    // Añadir el producto al carrito
    if (this.cartUI && typeof this.cartUI.addToCart === 'function') {
      this.cartUI.addToCart({
        id: productId,
        name: productName,
        category: productCategory,
        price: productPrice,
        quantity: quantity
      });
    }
    
    // Enviar el evento add_to_cart
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'add_to_cart',
      'item_list_id': this.currentListId,
      'item_list_name': this.currentListName,
      'currency': 'USD',
      'value': value,
      'taxes': 0,
      'items': [{
        'item_id': productId,
        'item_name': productName,
        'item_category': productCategory,
        'item_brand': 'TheCocktail',
        'price': productPrice,
        'quantity': quantity
      }]
    });
    console.log(`Evento add_to_cart enviado: ${productName} (icono azul)`);
  }
}
});

  // 5. Rastrear clics en el icono del carrito
  const cartIcon = document.querySelector('.nav__cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      const cartItems = this.getCartItems();
      const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_icon_click',
        'item_list_id': this.currentListId,
        'item_list_name': this.currentListName,
        'currency': 'USD',
        'value': cartTotal, // Añadir el valor total del carrito
        'items': cartItems
      });
      console.log('Evento view_cart_icon_click enviado');
      
      // Configurar eventos para el carrito desplegable después de que se abra
      const self = this;
      setTimeout(() => {
        self.setupCartModalButtons();
      }, 500);
    });
  }

  // 6. Rastrear clics en redes sociales
  const socialLinks = document.querySelectorAll('.footer__social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const networkElement = e.target.closest('a').querySelector('i');
      const network = networkElement.classList.contains('fa-facebook') ? 'Facebook' :
                     networkElement.classList.contains('fa-twitter') ? 'Twitter' : 'Instagram';
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'social_share',
        'social_network': network,
        'content_id': 'homepage'
      });
      console.log(`Evento social_share enviado: ${network}`);
    });
  });
  
  // 7. Rastrear clics en + y - en el carrito desplegable
  document.addEventListener('click', (e) => {
    // Verificar si el carrito desplegable está abierto
    const cartModal = document.querySelector('.cart-modal.show');
    if (!cartModal) return;
    
    // Verificar si se hizo clic en un botón de cantidad
    const quantityBtn = e.target.closest('.cart-modal__item-quantity-btn');
    if (quantityBtn) {
      const isPlus = quantityBtn.classList.contains('plus');
      const cartItem = quantityBtn.closest('.cart-modal__item');
      
      if (cartItem) {
        const productId = cartItem.dataset.id;
        const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
        const productCategory = cartItem.dataset.category || 'Categoría';
        const productPrice = parseFloat(cartItem.dataset.price || 0);
        const quantity = 1;
        const value = productPrice * quantity;
        
        if (isPlus) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'add_to_cart',
            'item_list_id': this.currentListId,
            'item_list_name': this.currentListName,
            'currency': 'USD',
            'value': value,
            'taxes': 0,
            'items': [{
              'item_id': productId,
              'item_name': productName,
              'item_category': productCategory,
              'item_brand': 'TheCocktail',
              'price': productPrice,
              'quantity': quantity
            }]
          });
          console.log(`Evento add_to_cart enviado: ${productName} +1 (desplegable)`);
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'remove_from_cart',
            'item_list_id': this.currentListId,
            'item_list_name': this.currentListName,
            'currency': 'USD',
            'value': value,
            'taxes': 0,
            'items': [{
              'item_id': productId,
              'item_name': productName,
              'item_category': productCategory,
              'item_brand': 'TheCocktail',
              'price': productPrice,
              'quantity': quantity
            }]
          });
          console.log(`Evento remove_from_cart enviado: ${productName} -1 (desplegable)`);
        }
      }
    }
  });

  // Añadir un observador de mutaciones para detectar cuando se abre el carrito desplegable
  const self = this;
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.classList && node.classList.contains('cart-modal') && node.classList.contains('show')) {
            // El carrito desplegable se ha abierto, configurar los eventos
            self.setupCartModalEvents();
            self.setupCartModalButtons();
            break;
          }
        }
      }
    });
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

// Función para configurar los botones del footer del carrito desplegable
setupCartModalButtons() {
  // Configurar el botón "Ver Carrito"
  const viewCartBtn = document.querySelector('.cart-modal__footer a.button--secondary');
  if (viewCartBtn) {
    // Eliminar eventos anteriores para evitar duplicados
    const self = this;
    viewCartBtn.removeEventListener('click', viewCartClickHandler);
    
    function viewCartClickHandler(e) {
      e.preventDefault();
      const cartItems = self.getCartItems();
      const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_click',
        'item_list_id': self.currentListId,
        'item_list_name': self.currentListName,
        'currency': 'USD',
        'value': cartTotal,
        'items': cartItems
      });
      console.log('Evento view_cart_click enviado');
      
      // Redirigir a la página del carrito
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 100);
    }
    
    viewCartBtn.addEventListener('click', viewCartClickHandler);
  }
  
  // Configurar el botón "Proceder al Pago"
  const checkoutBtn = document.querySelector('.cart-modal__footer a.button--primary');
  if (checkoutBtn) {
    // Eliminar eventos anteriores para evitar duplicados
    const self = this;
    checkoutBtn.removeEventListener('click', checkoutClickHandler);
    
    function checkoutClickHandler(e) {
      e.preventDefault();
      const cartItems = self.getCartItems();
      const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'begin_checkout',
        'item_list_id': self.currentListId,
        'item_list_name': self.currentListName,
        'currency': 'USD',
        'value': cartTotal,
        'taxes': 0,
        'items': cartItems
      });
      console.log('Evento begin_checkout enviado');
      
      // Redirigir a la página de checkout
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 100);
    }
    
    checkoutBtn.addEventListener('click', checkoutClickHandler);
  }
}

// Función para configurar los eventos de los botones + y - en el carrito desplegable
setupCartModalEvents() {
  // Configurar los botones + en el carrito desplegable
  const plusButtons = document.querySelectorAll('.cart-modal__item-quantity-btn.plus');
  const self = this;
  
  plusButtons.forEach(btn => {
    // Eliminar eventos anteriores para evitar duplicados
    btn.removeEventListener('click', handlePlusButtonClick);
    
    // Añadir el evento
    btn.addEventListener('click', function() {
      const cartItem = this.closest('.cart-modal__item');
      if (!cartItem) return;
      
      const productId = cartItem.dataset.id;
      const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
      const productCategory = cartItem.dataset.category || 'Categoría';
      const productPrice = parseFloat(cartItem.dataset.price || 0);
      const quantity = 1;
      const value = productPrice * quantity;
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'add_to_cart',
        'item_list_id': self.currentListId,
        'item_list_name': self.currentListName,
        'currency': 'USD',
        'value': value,
        'taxes': 0,
        'items': [{
          'item_id': productId,
          'item_name': productName,
          'item_category': productCategory,
          'item_brand': 'TheCocktail',
          'price': productPrice,
          'quantity': quantity
        }]
      });
      console.log(`Evento add_to_cart enviado: ${productName} +1 (desplegable)`);
    });
  });
  
  // Configurar los botones - en el carrito desplegable
  const minusButtons = document.querySelectorAll('.cart-modal__item-quantity-btn.minus');
  minusButtons.forEach(btn => {
    // Eliminar eventos anteriores para evitar duplicados
    btn.removeEventListener('click', handleMinusButtonClick);
    
    // Añadir el evento
    btn.addEventListener('click', function() {
      const cartItem = this.closest('.cart-modal__item');
      if (!cartItem) return;
      
      const productId = cartItem.dataset.id;
      const productName = cartItem.querySelector('.cart-modal__item-name').textContent;
      const productCategory = cartItem.dataset.category || 'Categoría';
      const productPrice = parseFloat(cartItem.dataset.price || 0);
      const quantity = 1;
      const value = productPrice * quantity;
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'remove_from_cart',
        'item_list_id': self.currentListId,
        'item_list_name': self.currentListName,
        'currency': 'USD',
        'value': value,
        'taxes': 0,
        'items': [{
          'item_id': productId,
          'item_name': productName,
          'item_category': productCategory,
          'item_brand': 'TheCocktail',
          'price': productPrice,
          'quantity': quantity
        }]
      });
      console.log(`Evento remove_from_cart enviado: ${productName} -1 (desplegable)`);
    });
  });
}

getProductItems() {
  const products = document.querySelectorAll('.product');
  const items = [];
  
  products.forEach(product => {
    if (product.style.display !== 'none') {
      items.push({
        'item_id': product.dataset.id,
        'item_name': product.querySelector('.product__title').textContent,
        'item_category': product.dataset.category,
        'item_brand': 'TheCocktail',
        'price': parseFloat(product.querySelector('.product__price').textContent.replace('$', '')),
        'quantity': 1,
        'currency': 'USD'
      });
    }
  });
  
  return items;
}

getCartItems() {
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

setupMobileMenu() {
  const menuButton = document.createElement("button");
  menuButton.className = "nav__toggle";
  menuButton.innerHTML = '<i class="fas fa-bars"></i>';

  const nav = document.querySelector(".nav");
  const menu = document.querySelector(".nav__menu");

  nav.insertBefore(menuButton, menu);

  menuButton.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  const navLinks = document.querySelectorAll(".nav__link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("show");
    });
  });

  if (!document.getElementById("mobileStyles")) {
    const styles = document.createElement("style");
    styles.id = "mobileStyles";
    styles.textContent = `
              .nav__toggle {
                  display: none;
                  font-size: 1.25rem;
                  cursor: pointer;
                  color: var(--text-color);
                  transition: .3s;
              }

              @media screen and (max-width: 768px) {
                  .nav__toggle {
                      display: block;
                  }

                  .nav__menu {
                      position: fixed;
                      top: 4rem;
                      left: -100%;
                      width: 80%;
                      height: 100vh;
                      padding: 2rem;
                      background-color: var(--bg-color);
                      box-shadow: 2px 0 4px rgba(0,0,0,.1);
                      transition: .4s;
                  }

                  .nav__menu.show {
                      left: 0;
                  }

                  .nav__list {
                      flex-direction: column;
                  }

                  .nav__item {
                      margin: 1.5rem 0;
                  }
              }
          `;
    document.head.appendChild(styles);
  }
}
}

// Funciones auxiliares para los manejadores de eventos
function handlePlusButtonClick() {
// Esta función se define vacía para poder eliminar el evento
}

function handleMinusButtonClick() {
// Esta función se define vacía para poder eliminar el evento
}

document.addEventListener("DOMContentLoaded", () => {
window.app = new App();
});