import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
constructor() {
  this.initializeApp();
  
  // Esperar a que los productos se carguen completamente
  setTimeout(() => {
    this.trackViewItemList();
  }, 500);
}

initializeApp() {
  this.cartUI = cartUI;
  this.productsUI = productsUI;
  this.currentListName = 'Todos';
  this.currentListId = '1';

  this.setupMobileMenu();
  this.setupEventTracking();
}

trackViewItemList() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'view_item_list',
    'item_list_id': this.currentListId,
    'item_list_name': this.currentListName,
    'currency': 'USD',
    'items': this.getProductItems()
  });
  console.log("Evento view_item_list enviado:", this.currentListName);
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

  // 3. Rastrear clics en "Ver Detalles" - CORREGIDO
  document.querySelectorAll('.product__button--secondary, .button.button--secondary').forEach(button => {
    if (button.textContent.trim() === 'Ver Detalles') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productCard = button.closest('.product');
        if (productCard) {
          const productId = productCard.dataset.id;
          const productName = productCard.querySelector('.product__title').textContent;
          const productCategory = productCard.dataset.category;
          const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('$', ''));
          
          // Guardar información del producto y lista en localStorage
          localStorage.setItem('last_viewed_product_id', productId);
          localStorage.setItem('last_viewed_product_name', productName);
          localStorage.setItem('last_viewed_product_category', productCategory);
          localStorage.setItem('last_viewed_product_price', productPrice);
          localStorage.setItem('last_list_id', this.currentListId);
          localStorage.setItem('last_list_name', this.currentListName);
          
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
          setTimeout(() => {
            window.location.href = `product.html?id=${productId}`;
          }, 100);
        }
      });
    }
  });

  // 4. Rastrear clics en "Añadir al Carrito" (botón azul) - CORREGIDO
  document.querySelectorAll('.product__button, .button.product__button').forEach(button => {
    if (button.textContent.trim() === 'Añadir al Carrito') {
      button.addEventListener('click', (e) => {
        const productCard = button.closest('.product');
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
          
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'add_to_cart',
            'currency': 'USD',
            'item_list_id': this.currentListId,
            'value': value,
            'items': [{
              'item_id': productId,
              'item_name': productName,
              'item_category': productCategory,
              'item_brand': 'TheCocktail',
              'price': productPrice,
              'quantity': quantity
            }]
          });
          console.log(`Evento add_to_cart enviado: ${productName}`);
        }
      });
    }
  });

  // 5. Rastrear clics en el icono del carrito
  const cartIcon = document.querySelector('.nav__cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      const cartItems = this.getCartItems();
      const cartTotal = this.calculateCartTotal(cartItems);
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_icon_click',
        'item_list_id': this.currentListId,
        'currency': 'USD',
        'value': cartTotal,
        'items': cartItems
      });
      console.log('Evento view_cart_icon_click enviado');
      
      // Configurar eventos para el carrito desplegable
      setTimeout(() => {
        this.setupCartModalEvents();
      }, 300);
    });
  }

  // 6. Rastrear clics en redes sociales
  const socialLinks = document.querySelectorAll('.footer__social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const networkElement = e.currentTarget.querySelector('i');
      const network = networkElement.classList.contains('fa-facebook') ? 'Facebook' :
                     networkElement.classList.contains('fa-twitter') ? 'Twitter' : 'Instagram';
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'social_share',
        'social_network': network,
        'items': this.getCartItems()
      });
      console.log(`Evento social_share enviado: ${network}`);
    });
  });
}

setupCartModalEvents() {
  // Configurar el botón "Ver Carrito"
  const viewCartBtn = document.querySelector('.cart-modal__footer a.button--secondary');
  if (viewCartBtn) {
    const self = this;
    
    viewCartBtn.onclick = function(e) {
      e.preventDefault();
      const cartItems = self.getCartItems();
      const cartTotal = self.calculateCartTotal(cartItems);
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_click',
        'item_list_id': self.currentListId,
        'currency': 'USD',
        'value': cartTotal,
        'items': cartItems
      });
      console.log('Evento view_cart_click enviado');
      
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 100);
    };
  }
  
  // Configurar el botón "Proceder al Pago"
  const checkoutBtn = document.querySelector('.cart-modal__footer a.button--primary');
  if (checkoutBtn) {
    const self = this;
    
    checkoutBtn.onclick = function(e) {
      e.preventDefault();
      const cartItems = self.getCartItems();
      const cartTotal = self.calculateCartTotal(cartItems);
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
        'value': cartTotal,
        'items': cartItems
      });
      console.log('Evento begin_checkout enviado');
      
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 100);
    };
  }
}

getProductItems() {
  const products = document.querySelectorAll('.product');
  const items = [];
  
  products.forEach(product => {
    if (product.style.display !== 'none') {
      const category = product.dataset.category || 
                     (product.classList.contains('laptops') ? 'laptops' : 
                      product.classList.contains('smartphones') ? 'smartphones' : 
                      product.classList.contains('accessories') ? 'accesorios' : 'Categoría');
      
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
    'item_category': item.category || 'laptops', // Valor por defecto si no hay categoría
    'item_brand': 'TheCocktail',
    'price': item.price,
    'quantity': item.quantity
  }));
}

calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

setupMobileMenu() {
  // Mantener el código original de setupMobileMenu
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

  // Mantener los estilos móviles
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

document.addEventListener("DOMContentLoaded", () => {
window.app = new App();
});