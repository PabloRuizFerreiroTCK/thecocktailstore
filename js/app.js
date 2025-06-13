import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
  constructor() {
    this.initializeApp();
    // NUEVO: Evento de visualización de la página principal
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_item_list',
      'item_list_id': '1',
      'item_list_name': 'Todos',
      'items': this.getProductItems()
    });
  }

  initializeApp() {
    this.cartUI = cartUI;
    this.productsUI = productsUI;

    this.setupMobileMenu();

    // NUEVO: Configurar eventos de tracking
    this.setupEventTracking();
  }

  // NUEVO: Método para configurar eventos de tracking
  setupEventTracking() {
    // 1. Rastrear clic en "Ver Productos"
    const viewProductsBtn = document.querySelector('.hero .button');
    if (viewProductsBtn) {
      viewProductsBtn.addEventListener('click', () => {
        window.dataLayer.push({
          'event': 'select_item',
          'item_list_id': '1',
          'item_list_name': 'Todos',
          'items': this.getProductItems()
        });
      });
    }

    // 2. Rastrear clics en botones de filtro
    const filterButtons = document.querySelectorAll('.filter__button');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        const listName = filter === 'all' ? 'Todos' : 
                      filter === 'laptops' ? 'Laptops' : 
                      filter === 'smartphones' ? 'Smartphones' : 'Accesorios';
      
        window.dataLayer.push({
          'event': 'select_item',
          'item_list_id': '1',
          'item_list_name': listName,
          'items': this.getProductItems()
        });
      });
    });

    // 3. Rastrear clics en "Ver Detalles"
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('product__button') || e.target.closest('.product__button')) {
        const productCard = e.target.closest('.product');
        if (productCard) {
          const productId = productCard.dataset.id;
          const productName = productCard.querySelector('.product__title').textContent;
          const productCategory = productCard.dataset.category;
          const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('$', ''));
        
          window.dataLayer.push({
            'event': 'select_item',
            'item_list_id': '1',
            'item_list_name': document.querySelector('.filter__button.active').textContent.trim(),
            'items': [{
              'item_id': productId,
              'item_name': productName,
              'item_category': productCategory,
              'item_brand': 'TheCocktail',
              'price': productPrice,
              'currency': 'USD'
            }]
          });
        }
      }
    });

    // 4. Rastrear clics en "Añadir al Carrito" (icono azul)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('product__cart') || e.target.closest('.product__cart')) {
        const productCard = e.target.closest('.product');
        if (productCard) {
          const productId = productCard.dataset.id;
          const productName = productCard.querySelector('.product__title').textContent;
          const productCategory = productCard.dataset.category;
          const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('$', ''));
        
          window.dataLayer.push({
            'event': 'add_to_cart',
            'item_list_id': '1',
            'currency': 'USD',
            'value': productPrice,
            'items': [{
              'item_id': productId,
              'item_name': productName,
              'item_category': productCategory,
              'item_brand': 'TheCocktail',
              'price': productPrice,
              'quantity': 1
            }]
          });
        }
      }
    });

    // 5. Rastrear clics en el icono del carrito
    const cartIcon = document.querySelector('.nav__cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        window.dataLayer.push({
          'event': 'view_cart_icon_click',
          'item_list_id': '1',
          'currency': 'USD',
          'items': this.getCartItems()
        });
      });
    }

    // 6. Rastrear clics en redes sociales
    const socialLinks = document.querySelectorAll('.footer__social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const networkElement = e.target.closest('a').querySelector('i');
        const network = networkElement.classList.contains('fa-facebook') ? 'Facebook' :
                     networkElement.classList.contains('fa-twitter') ? 'Twitter' : 'Instagram';
      
        window.dataLayer.push({
          'event': 'social_share',
          'social_network': network,
          'content_id': 'homepage'
        });
      });
    });
  }

  // NUEVO: Método para obtener productos visibles
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

  // NUEVO: Método para obtener productos del carrito
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

document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
