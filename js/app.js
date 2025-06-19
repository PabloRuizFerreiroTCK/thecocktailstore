import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
constructor() {
  this.initializeApp();
}

initializeApp() {
  this.cartUI = cartUI;
  this.productsUI = productsUI;

  this.setupMobileMenu();
  this.setupEventTracking();
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

setupEventTracking() {
  // 1. Evento view_item_list al cargar la página
  this.trackViewItemList();

  // 2. Evento select_item al hacer clic en "Ver Productos"
  this.trackViewProductsButton();

  // 3. Evento select_item al hacer clic en los botones de filtro
  this.trackFilterButtons();

  // 4. Evento add_to_cart al hacer clic en el botón azul de carrito
  this.trackAddToCartButtons();

  // 5. Evento view_cart_icon_click al hacer clic en el icono del carrito
  this.trackCartIconClick();

  // 6. Evento view_cart_click al hacer clic en "Ver Carrito"
  this.trackViewCartButton();

  // 7. Evento begin_checkout al hacer clic en "Proceder al Pago"
  this.trackProceedToCheckoutButton();

  // 8. Eventos add_to_cart y remove_from_cart para los botones + y -
  this.trackCartQuantityButtons();

  // 9. Evento social_share al hacer clic en los iconos de redes sociales
  this.trackSocialShareButtons();
}

// 1. Evento view_item_list al cargar la página
trackViewItemList() {
   window.dataLayer || [];
  window.dataLayer.push({
    'event': 'view_item_list',
    'item_list_id': '1',
    'item_list_name': 'Todos',
    'currency': 'USD',
    'items': [
      {
        'item_id': '1',
        'item_name': 'NovaTech Phantom X9',
        'item_category': 'Laptop',
        'item_brand': 'TheCocktail',
        'price': 2499.99,
        'quantity': 1
      }
    ]
  });
}

// 2. Evento select_item al hacer clic en "Ver Productos"
trackViewProductsButton() {
  const viewProductsBtn = document.querySelector('a.button[href="#products"]');
  if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'select_item',
        'item_list_id': '1',
        'item_list_name': 'Todos',
        'currency': 'USD',
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    });
  }
}

// 3. Evento select_item al hacer clic en los botones de filtro
trackFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter__button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');
      let categoryName = 'Todos';
      let categoryId = '1';
      
      switch(category) {
        case 'laptops':
          categoryName = 'Laptops';
          categoryId = '2';
          break;
        case 'smartphones':
          categoryName = 'Smartphones';
          categoryId = '3';
          break;
        case 'accessories':
          categoryName = 'Accesorios';
          categoryId = '4';
          break;
      }
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'select_item',
        'item_list_id': categoryId,
        'item_list_name': categoryName,
        'currency': 'USD',
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    });
  });
}

// 4. Evento add_to_cart al hacer clic en el botón azul de carrito
trackAddToCartButtons() {
  document.addEventListener('click', (e) => {
    const addToCartButton = e.target.closest('.button.product__button');
    
    if (addToCartButton) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'add_to_cart',
        'currency': 'USD',
        'item_list_id': '1',
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    }
  });
}

// 5. Evento view_cart_icon_click al hacer clic en el icono del carrito
trackCartIconClick() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__cart-icon') || 
        e.target.closest('.nav__cart')) {
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_icon_click',
        'item_list_id': '1',
        'currency': 'USD',
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    }
  });
}

// 6. Evento view_cart_click al hacer clic en "Ver Carrito"
trackViewCartButton() {
  document.addEventListener('click', (e) => {
    const viewCartButton = e.target.closest('a.button.button--secondary[href="cart.html"]');
    
    if (viewCartButton) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_click',
        'item_list_id': '1',
        'currency': 'USD',
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    }
  });
}

// 7. Evento begin_checkout al hacer clic en "Proceder al Pago"
trackProceedToCheckoutButton() {
  document.addEventListener('click', (e) => {
    const checkoutButton = e.target.closest('a.button.button--primary[href="checkout.html"]');
    
    if (checkoutButton) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'begin_checkout',
        'item_list_id': '1',
        'checkout_step': 1,
        'currency': 'USD',
        'has_coupon': false,
        'coupon': '',
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    }
  });
}

// 8. Eventos add_to_cart y remove_from_cart para los botones + y -
trackCartQuantityButtons() {
  document.addEventListener('click', (e) => {
    const quantityButton = e.target.closest('.quantity-btn');
    
    if (quantityButton) {
      const action = quantityButton.getAttribute('data-action');
      
      if (action === 'increase') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'add_to_cart',
          'currency': 'USD',
          'item_list_id': '1',
          'items': [
            {
              'item_id': '1',
              'item_name': 'NovaTech Phantom X9',
              'item_category': 'Laptop',
              'item_brand': 'TheCocktail',
              'price': 2499.99,
              'quantity': 1
            }
          ]
        });
      } else if (action === 'decrease') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'remove_from_cart',
          'currency': 'USD',
          'item_list_id': '1',
          'items': [
            {
              'item_id': '1',
              'item_name': 'NovaTech Phantom X9',
              'item_category': 'Laptop',
              'item_brand': 'TheCocktail',
              'price': 2499.99,
              'quantity': 1
            }
          ]
        });
      }
    }
  });
}

// 9. Evento social_share al hacer clic en los iconos de redes sociales
trackSocialShareButtons() {
  document.querySelectorAll('.footer__social-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevenir la navegación por defecto
      
      let socialNetwork = 'Facebook';
      if (link.querySelector('.fa-twitter')) {
        socialNetwork = 'Twitter';
      } else if (link.querySelector('.fa-instagram')) {
        socialNetwork = 'Instagram';
      }
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'social_share',
        'social_network': socialNetwork,
        'items': [
          {
            'item_id': '1',
            'item_name': 'NovaTech Phantom X9',
            'item_category': 'Laptop',
            'item_brand': 'TheCocktail',
            'price': 2499.99,
            'quantity': 1
          }
        ]
      });
    });
  });
}
}

document.addEventListener("DOMContentLoaded", () => {
window.app = new App();
});