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

  // 4. Evento select_item al hacer clic en "Ver Detalles"
  this.trackViewDetailsButtons();

  // 5. Evento add_to_cart al hacer clic en el botón azul de carrito
  this.trackAddToCartButtons();

  // 6. Evento view_cart_icon_click al hacer clic en el icono del carrito
  this.trackCartIconClick();

  // 7. Evento view_cart_click al hacer clic en "Ver Carrito"
  this.trackViewCartButton();

  // 8. Evento begin_checkout al hacer clic en "Proceder al Pago"
  this.trackProceedToCheckoutButton();

  // 9. Eventos add_to_cart y remove_from_cart para los botones + y -
  this.trackCartQuantityButtons();

  // 10. Evento social_share al hacer clic en los iconos de redes sociales
  this.trackSocialShareButtons();
}

// 1. Evento view_item_list al cargar la página
trackViewItemList() {
  // Esperamos a que los productos se carguen en la página
  setTimeout(() => {
    // Obtenemos los productos directamente del DOM
    const productElements = document.querySelectorAll('.product');
    const items = Array.from(productElements).map(product => {
      return {
        item_id: product.dataset.id || '',
        item_name: product.querySelector('.product__title')?.textContent || '',
        item_category: product.dataset.category || '',
        item_brand: 'TheCocktail',
        price: parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim()) || 0,
        quantity: 1
      };
    });

    // Solo enviamos el evento si hay productos
    if (items.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_item_list',
        'item_list_id': '1',
        'item_list_name': 'Todos',
        'currency': 'USD',
        'items': items
      });
    }
  }, 500); // Damos tiempo para que se carguen los productos
}

// 2. Evento select_item al hacer clic en "Ver Productos"
trackViewProductsButton() {
  const viewProductsBtn = document.querySelector('a.button[href="#products"]');
  if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', () => {
      // Obtenemos los productos visibles en ese momento
      const productElements = document.querySelectorAll('.product');
      const items = Array.from(productElements).map(product => {
        return {
          item_id: product.dataset.id || '',
          item_name: product.querySelector('.product__title')?.textContent || '',
          item_category: product.dataset.category || '',
          item_brand: 'TheCocktail',
          price: parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim()) || 0,
          quantity: 1
        };
      });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'select_item',
        'item_list_id': '1',
        'item_list_name': 'Todos',
        'currency': 'USD',
        'items': items
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
      
      switch(category) {
        case 'laptops':
          categoryName = 'Laptops';
          break;
        case 'smartphones':
          categoryName = 'Smartphones';
          break;
        case 'accessories':
          categoryName = 'Accesorios';
          break;
      }
      
      // Esperamos a que se aplique el filtro y se muestren los productos
      setTimeout(() => {
        // Obtenemos solo los productos visibles después de aplicar el filtro
        const productElements = document.querySelectorAll('.product:not(.hidden)');
        const items = Array.from(productElements).map(product => {
          return {
            item_id: product.dataset.id || '',
            item_name: product.querySelector('.product__title')?.textContent || '',
            item_category: product.dataset.category || '',
            item_brand: 'TheCocktail',
            price: parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim()) || 0,
            quantity: 1
          };
        });

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'select_item',
          'item_list_id': '1',
          'item_list_name': categoryName,
          'currency': 'USD',
          'items': items
        });
      }, 100);
    });
  });
}

// 4. Evento select_item al hacer clic en "Ver Detalles"
trackViewDetailsButtons() {
  document.addEventListener('click', (e) => {
    const detailsButton = e.target.closest('a.button.button--secondary[href^="product.html"]');
    
    if (detailsButton) {
      // Obtenemos el producto del que se están viendo los detalles
      const productElement = detailsButton.closest('.product');
      if (productElement) {
        const productId = productElement.dataset.id || '';
        const productName = productElement.querySelector('.product__title')?.textContent || '';
        const productCategory = productElement.dataset.category || '';
        const productPrice = parseFloat(productElement.querySelector('.product__price')?.textContent.replace('$', '').trim()) || 0;
        
        // Obtenemos la categoría actual (filtro activo)
        const activeFilter = document.querySelector('.filter__button.active');
        const categoryName = activeFilter ? activeFilter.textContent.trim() : 'Todos';
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'select_item',
          'item_list_id': '1',
          'item_list_name': categoryName,
          'currency': 'USD',
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
}

// 5. Evento add_to_cart al hacer clic en el botón azul de carrito
trackAddToCartButtons() {
  document.addEventListener('click', (e) => {
    const addToCartButton = e.target.closest('.button.product__button');
    
    if (addToCartButton) {
      // Obtenemos el producto que se está añadiendo al carrito
      const productElement = addToCartButton.closest('.product');
      if (productElement) {
        const productId = productElement.dataset.id || '';
        const productName = productElement.querySelector('.product__title')?.textContent || '';
        const productCategory = productElement.dataset.category || '';
        const productPrice = parseFloat(productElement.querySelector('.product__price')?.textContent.replace('$', '').trim()) || 0;
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'add_to_cart',
          'currency': 'USD',
          'item_list_id': '1',
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
}

// 6. Evento view_cart_icon_click al hacer clic en el icono del carrito
trackCartIconClick() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__cart-icon') || 
        e.target.closest('.nav__cart')) {
      
      // Esperamos a que se abra el modal del carrito
      setTimeout(() => {
        // Obtenemos los productos del carrito desde el modal
        const cartItems = document.querySelectorAll('.cart-modal__item');
        const items = Array.from(cartItems).map(item => {
          const productId = item.dataset.id || '';
          const productName = item.querySelector('.cart-modal__item-name')?.textContent || '';
          const productPrice = parseFloat(item.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim()) || 0;
          const quantity = parseInt(item.querySelector('.cart-modal__item-quantity')?.textContent || '1');
          
          return {
            'item_id': productId,
            'item_name': productName,
            'item_category': item.dataset.category || '',
            'item_brand': 'TheCocktail',
            'price': productPrice,
            'quantity': quantity
          };
        });
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'view_cart_icon_click',
          'item_list_id': '1',
          'currency': 'USD',
          'items': items
        });
      }, 100);
    }
  });
}

// 7. Evento view_cart_click al hacer clic en "Ver Carrito"
trackViewCartButton() {
  document.addEventListener('click', (e) => {
    const viewCartButton = e.target.closest('a.button.button--secondary[href="cart.html"]');
    
    if (viewCartButton) {
      // Obtenemos los productos del carrito desde el modal
      const cartItems = document.querySelectorAll('.cart-modal__item');
      const items = Array.from(cartItems).map(item => {
        const productId = item.dataset.id || '';
        const productName = item.querySelector('.cart-modal__item-name')?.textContent || '';
        const productPrice = parseFloat(item.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim()) || 0;
        const quantity = parseInt(item.querySelector('.cart-modal__item-quantity')?.textContent || '1');
        
        return {
          'item_id': productId,
          'item_name': productName,
          'item_category': item.dataset.category || '',
          'item_brand': 'TheCocktail',
          'price': productPrice,
          'quantity': quantity
        };
      });
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_click',
        'item_list_id': '1',
        'currency': 'USD',
        'items': items
      });
    }
  });
}

// 8. Evento begin_checkout al hacer clic en "Proceder al Pago"
trackProceedToCheckoutButton() {
  document.addEventListener('click', (e) => {
    const checkoutButton = e.target.closest('a.button.button--primary[href="checkout.html"]');
    
    if (checkoutButton) {
      // Obtenemos los productos del carrito desde el modal
      const cartItems = document.querySelectorAll('.cart-modal__item');
      const items = Array.from(cartItems).map(item => {
        const productId = item.dataset.id || '';
        const productName = item.querySelector('.cart-modal__item-name')?.textContent || '';
        const productPrice = parseFloat(item.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim()) || 0;
        const quantity = parseInt(item.querySelector('.cart-modal__item-quantity')?.textContent || '1');
        
        return {
          'item_id': productId,
          'item_name': productName,
          'item_category': item.dataset.category || '',
          'item_brand': 'TheCocktail',
          'price': productPrice,
          'quantity': quantity
        };
      });
      
      // Verificamos si hay un cupón aplicado
      const hasCoupon = false; // Aquí deberías verificar si hay un cupón aplicado
      const couponCode = ''; // Aquí deberías obtener el código del cupón si existe
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'begin_checkout',
        'item_list_id': '1',
        'checkout_step': 1,
        'currency': 'USD',
        'has_coupon': hasCoupon,
        'coupon': couponCode,
        'items': items
      });
    }
  });
}

// 9. Eventos add_to_cart y remove_from_cart para los botones + y -
trackCartQuantityButtons() {
  document.addEventListener('click', (e) => {
    const quantityButton = e.target.closest('.quantity-btn');
    
    if (quantityButton) {
      const action = quantityButton.getAttribute('data-action');
      // Buscar el elemento padre que contiene la información del producto
      const cartItem = quantityButton.closest('.cart-item') || quantityButton.closest('.cart-modal__item');
      
      if (cartItem) {
        const productId = cartItem.dataset.id || '';
        const productName = cartItem.querySelector('.cart-modal__item-name')?.textContent || '';
        const productPrice = parseFloat(cartItem.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim()) || 0;
        const productCategory = cartItem.dataset.category || '';
        
        if (action === 'increase') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'add_to_cart',
            'currency': 'USD',
            'item_list_id': '1',
            'items': [{
              'item_id': productId,
              'item_name': productName,
              'item_category': productCategory,
              'item_brand': 'TheCocktail',
              'price': productPrice,
              'quantity': 1
            }]
          });
        } else if (action === 'decrease') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'remove_from_cart',
            'currency': 'USD',
            'item_list_id': '1',
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
    }
  });
}

// 10. Evento social_share al hacer clic en los iconos de redes sociales
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
      
      // Para social_share, usamos el producto que está en vista o el último añadido al carrito
      // Esto es una aproximación, ya que no sabemos exactamente qué producto quiere compartir el usuario
      const featuredProduct = document.querySelector('.product');
      let items = [];
      
      if (featuredProduct) {
        const productId = featuredProduct.dataset.id || '';
        const productName = featuredProduct.querySelector('.product__title')?.textContent || '';
        const productCategory = featuredProduct.dataset.category || '';
        const productPrice = parseFloat(featuredProduct.querySelector('.product__price')?.textContent.replace('$', '').trim()) || 0;
        
        items = [{
          'item_id': productId,
          'item_name': productName,
          'item_category': productCategory,
          'item_brand': 'TheCocktail',
          'price': productPrice,
          'quantity': 1
        }];
      }
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'social_share',
        'social_network': socialNetwork,
        'items': items
      });
    });
  });
}
}

document.addEventListener("DOMContentLoaded", () => {
window.app = new App();
});