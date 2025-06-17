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
    'currency': 'USD',
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
        'currency': 'USD',
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
      
      this.currentListId = filter === 'all' ? '1' : 
                      filter === 'laptops' ? '2' : 
                      filter === 'smartphones' ? '3' : '4';
      
      // Guardar en localStorage para mantener consistencia entre páginas
      localStorage.setItem('last_list_id', this.currentListId);
      localStorage.setItem('last_list_name', this.currentListName);
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'select_item',
        'item_list_id': this.currentListId,
        'item_list_name': this.currentListName,
        'currency': 'USD',
        'items': this.getProductItems()
      });
      console.log(`Evento select_item enviado: Filtro ${this.currentListName}`);
    });
  });

  // 3. Rastrear clics en "Ver Detalles"
  document.addEventListener('click', (e) => {
    const detailsButton = e.target.closest('.product__button, a.button.button--secondary');
    if (detailsButton && detailsButton.textContent.trim() === 'Ver Detalles') {
      e.preventDefault();
      
      const productCard = detailsButton.closest('.product');
      if (productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('.product__title').textContent;
        const productCategory = productCard.dataset.category || 'laptops';
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
          'currency': 'USD',
          'items': [{
            'item_id': productId,
            'item_name': productName,
            'item_category': productCategory,
            'item_brand': 'TheCocktail',
            'price': productPrice
          }]
        });
        console.log(`Evento select_item enviado: Ver Detalles de ${productName}`);
        
        // Redirigir después de enviar el evento
        const href = detailsButton.getAttribute('href') || `product.html?id=${productId}`;
        setTimeout(() => {
          window.location.href = href;
        }, 100);
      }
    }
  });

  // 4. Rastrear clics en "Añadir al Carrito" (icono azul)
  document.addEventListener('click', (e) => {
    const cartButton = e.target.closest('.product__cart, .product__button');
    if (cartButton && (cartButton.classList.contains('product__cart') || cartButton.textContent.trim() === 'Añadir al Carrito')) {
      e.preventDefault();
      
      const productCard = cartButton.closest('.product');
      if (productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('.product__title').textContent;
        const productCategory = productCard.dataset.category || 'laptops';
        const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('$', ''));
        const quantity = 1;
        
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
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'add_to_cart',
          'currency': 'USD',
          'item_list_id': this.currentListId,
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
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_icon_click',
        'item_list_id': this.currentListId,
        'currency': 'USD',
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
        const productCategory = cartItem.dataset.category || 'laptops';
        const productPrice = parseFloat(cartItem.dataset.price || 0);
        const quantity = 1;
        
        if (isPlus) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'add_to_cart',
            'item_list_id': this.currentListId,
            'currency': 'USD',
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
            'currency': 'USD',
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
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_click',
        'item_list_id': self.currentListId,
        'currency': 'USD',
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
      const hasCoupon = localStorage.getItem('has_coupon') === 'true';
      const coupon = localStorage.getItem('coupon') || '';
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'begin_checkout',
        'item_list_id': self.currentListId,
        'checkout_step': 1,
        'currency': 'USD',
        'has_coupon': hasCoupon,
        'coupon': coupon,
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

getProductItems() {
  const products = document.querySelectorAll('.product');
  const items = [];
  
  products.forEach(product => {
    if (product.style.display !== 'none') {
      const category = product.dataset.category || 'laptops';
      
      items.push({
        'item_id': product.dataset.id,
        'item_name': product.querySelector('.product__title').textContent,
        'item_category': category,
        'item_brand': 'TheCocktail',
        'price': parseFloat(product.querySelector('.product__price').textContent.replace('$', '')),
        'quantity': 1
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
    'item_category': item.category || 'laptops',
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

  if (nav && menu) {
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
  }

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
function viewCartClickHandler() {
// Esta función se define vacía para poder eliminar el evento
}

function checkoutClickHandler() {
// Esta función se define vacía para poder eliminar el evento
}

document.addEventListener("DOMContentLoaded", () => {
window.app = new App();
});