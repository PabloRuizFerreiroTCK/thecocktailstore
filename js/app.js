import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
constructor() {
  // Inicializamos el item_list_id y item_list_name
  this.currentItemListId = '1';
  this.currentItemListName = 'Todos';
  
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

// Método para actualizar el item_list_id y item_list_name según la categoría
updateItemListInfo(category) {
  switch(category) {
    case 'all':
      this.currentItemListId = '1';
      this.currentItemListName = 'Todos';
      break;
    case 'laptops':
      this.currentItemListId = '2';
      this.currentItemListName = 'Laptops';
      break;
    case 'smartphones':
      this.currentItemListId = '3';
      this.currentItemListName = 'Smartphones';
      break;
    case 'accessories':
      this.currentItemListId = '4';
      this.currentItemListName = 'Accesorios';
      break;
    default:
      this.currentItemListId = '1';
      this.currentItemListName = 'Todos';
  }
  
  // Guardamos estos valores en localStorage para mantenerlos entre páginas
  localStorage.setItem('currentItemListId', this.currentItemListId);
  localStorage.setItem('currentItemListName', this.currentItemListName);
}

// Método para obtener el item_list_id actual
getCurrentItemListId() {
  // Intentamos recuperar el valor de localStorage primero
  const storedId = localStorage.getItem('currentItemListId');
  return storedId || this.currentItemListId || '1';
}

// Método para obtener el item_list_name actual
getCurrentItemListName() {
  // Intentamos recuperar el valor de localStorage primero
  const storedName = localStorage.getItem('currentItemListName');
  return storedName || this.currentItemListName || 'Todos';
}

// 1. Evento view_item_list al cargar la página
trackViewItemList() {
  // Esperamos a que los productos se carguen en la página
  document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos los productos directamente del DOM
    const productElements = document.querySelectorAll('.product');
    if (productElements.length === 0) {
      // Si aún no hay productos, esperamos un poco más
      setTimeout(() => {
        this.sendViewItemListEvent();
      }, 500);
    } else {
      this.sendViewItemListEvent();
    }
  });
}

sendViewItemListEvent() {
  const productElements = document.querySelectorAll('.product');
  const items = [];
  
  productElements.forEach(product => {
    const productId = product.dataset.id;
    const productTitle = product.querySelector('.product__title')?.textContent;
    const productCategory = product.dataset.category;
    const productPrice = parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim());
    
    if (productId && productTitle) {
      items.push({
        item_id: productId,
        item_name: productTitle,
        item_category: productCategory || '',
        item_brand: 'TheCocktail',
        price: productPrice || 0,
        quantity: 1
      });
    }
  });
  
  if (items.length > 0) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'view_item_list',
      'item_list_id': this.getCurrentItemListId(),
      'item_list_name': this.getCurrentItemListName(),
      'currency': 'USD',
      'items': items
    });
  }
}

// 2. Evento select_item al hacer clic en "Ver Productos"
trackViewProductsButton() {
  const viewProductsBtn = document.querySelector('a.button[href="#products"]');
  if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', () => {
      // Al hacer clic en "Ver Productos", volvemos a la lista "Todos"
      this.updateItemListInfo('all');
      
      const productElements = document.querySelectorAll('.product');
      const items = [];
      
      productElements.forEach(product => {
        const productId = product.dataset.id;
        const productTitle = product.querySelector('.product__title')?.textContent;
        const productCategory = product.dataset.category;
        const productPrice = parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim());
        
        if (productId && productTitle) {
          items.push({
            item_id: productId,
            item_name: productTitle,
            item_category: productCategory || '',
            item_brand: 'TheCocktail',
            price: productPrice || 0,
            quantity: 1
          });
        }
      });
      
      if (items.length > 0) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'select_item',
          'item_list_id': this.getCurrentItemListId(),
          'item_list_name': this.getCurrentItemListName(),
          'currency': 'USD',
          'items': items
        });
      }
    });
  }
}

// 3. Evento select_item al hacer clic en los botones de filtro
trackFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter__button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');
      
      // Actualizamos el item_list_id y item_list_name según la categoría
      this.updateItemListInfo(category);
      
      // Esperamos a que se aplique el filtro
      setTimeout(() => {
        const productElements = document.querySelectorAll('.product:not(.hidden)');
        const items = [];
        
        productElements.forEach(product => {
          const productId = product.dataset.id;
          const productTitle = product.querySelector('.product__title')?.textContent;
          const productCategory = product.dataset.category;
          const productPrice = parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim());
          
          if (productId && productTitle) {
            items.push({
              item_id: productId,
              item_name: productTitle,
              item_category: productCategory || '',
              item_brand: 'TheCocktail',
              price: productPrice || 0,
              quantity: 1
            });
          }
        });
        
        if (items.length > 0) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'select_item',
            'item_list_id': this.getCurrentItemListId(),
            'item_list_name': this.getCurrentItemListName(),
            'currency': 'USD',
            'items': items
          });
        }
      }, 100);
    });
  });
}

// 4. Evento add_to_cart al hacer clic en el botón azul de carrito
trackAddToCartButtons() {
  // Usamos delegación de eventos para capturar todos los botones "Añadir al Carrito"
  document.addEventListener('click', (e) => {
    // Verificamos si el clic fue en el botón o en su icono
    const addToCartButton = e.target.closest('.button.product__button');
    
    if (addToCartButton) {
      // Obtenemos el producto que se está añadiendo al carrito
      const productElement = addToCartButton.closest('.product');
      if (productElement) {
        const productId = productElement.dataset.id;
        const productTitle = productElement.querySelector('.product__title')?.textContent;
        const productCategory = productElement.dataset.category;
        const productPrice = parseFloat(productElement.querySelector('.product__price')?.textContent.replace('$', '').trim());
        
        if (productId && productTitle) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'add_to_cart',
            'currency': 'USD',
            'item_list_id': this.getCurrentItemListId(),
            'items': [{
              'item_id': productId,
              'item_name': productTitle,
              'item_category': productCategory || '',
              'item_brand': 'TheCocktail',
              'price': productPrice || 0,
              'quantity': 1
            }]
          });
          
          console.log('Evento add_to_cart enviado:', {
            'event': 'add_to_cart',
            'currency': 'USD',
            'item_list_id': this.getCurrentItemListId(),
            'items': [{
              'item_id': productId,
              'item_name': productTitle,
              'item_category': productCategory || '',
              'item_brand': 'TheCocktail',
              'price': productPrice || 0,
              'quantity': 1
            }]
          });
        }
      }
    }
  });
}

// 5. Evento view_cart_icon_click al hacer clic en el icono del carrito
trackCartIconClick() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__cart-icon') || 
        e.target.closest('.nav__cart')) {
      
      // Obtenemos los productos del carrito desde localStorage o donde estén almacenados
      const cartItems = this.getCartItems();
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_icon_click',
        'item_list_id': this.getCurrentItemListId(),
        'currency': 'USD',
        'items': cartItems
      });
    }
  });
}

// 6. Evento view_cart_click al hacer clic en "Ver Carrito"
trackViewCartButton() {
  document.addEventListener('click', (e) => {
    const viewCartButton = e.target.closest('a.button.button--secondary[href="cart.html"]');
    
    if (viewCartButton) {
      // Obtenemos los productos del carrito
      const cartItems = this.getCartItems();
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'view_cart_click',
        'item_list_id': this.getCurrentItemListId(),
        'currency': 'USD',
        'items': cartItems
      });
    }
  });
}

// 7. Evento begin_checkout al hacer clic en "Proceder al Pago"
trackProceedToCheckoutButton() {
  document.addEventListener('click', (e) => {
    const checkoutButton = e.target.closest('a.button.button--primary[href="checkout.html"]');
    
    if (checkoutButton) {
      // Obtenemos los productos del carrito
      const cartItems = this.getCartItems();
      
      // Verificamos si hay un cupón aplicado
      const hasCoupon = this.hasCouponApplied();
      const couponCode = this.getCouponCode();
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'begin_checkout',
        'item_list_id': this.getCurrentItemListId(),
        'checkout_step': 1,
        'currency': 'USD',
        'has_coupon': hasCoupon,
        'coupon': couponCode,
        'items': cartItems
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
      // Buscar el elemento padre que contiene la información del producto
      const cartItem = quantityButton.closest('.cart-item') || quantityButton.closest('.cart-modal__item');
      
      if (cartItem) {
        const productId = cartItem.dataset.id;
        const productName = cartItem.querySelector('.cart-modal__item-name')?.textContent;
        const productCategory = cartItem.dataset.category;
        const productPrice = parseFloat(cartItem.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim());
        
        if (productId && productName) {
          if (action === 'increase') {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': 'add_to_cart',
              'currency': 'USD',
              'item_list_id': this.getCurrentItemListId(),
              'items': [{
                'item_id': productId,
                'item_name': productName,
                'item_category': productCategory || '',
                'item_brand': 'TheCocktail',
                'price': productPrice || 0,
                'quantity': 1
              }]
            });
          } else if (action === 'decrease') {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': 'remove_from_cart',
              'currency': 'USD',
              'item_list_id': this.getCurrentItemListId(),
              'items': [{
                'item_id': productId,
                'item_name': productName,
                'item_category': productCategory || '',
                'item_brand': 'TheCocktail',
                'price': productPrice || 0,
                'quantity': 1
              }]
            });
          }
        }
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
      
      // Obtenemos el producto destacado o el último añadido al carrito
      const featuredProduct = this.getFeaturedProduct();
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'social_share',
        'social_network': socialNetwork,
        'items': featuredProduct ? [featuredProduct] : []
      });
    });
  });
}

// Método para obtener los productos del carrito
getCartItems() {
  // Intentamos obtener los productos del carrito desde el localStorage
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      return cart.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || '',
        item_brand: 'TheCocktail',
        price: item.price || 0,
        quantity: item.quantity || 1
      }));
    }
  } catch (e) {
    console.error('Error al obtener productos del carrito:', e);
  }
  
  // Si no podemos obtener los productos del localStorage, intentamos obtenerlos del DOM
  const cartItems = document.querySelectorAll('.cart-modal__item');
  if (cartItems.length > 0) {
    return Array.from(cartItems).map(item => {
      const productId = item.dataset.id;
      const productName = item.querySelector('.cart-modal__item-name')?.textContent;
      const productCategory = item.dataset.category;
      const productPrice = parseFloat(item.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim());
      const quantity = parseInt(item.querySelector('.cart-modal__item-quantity')?.textContent || '1');
      
      return {
        item_id: productId || '',
        item_name: productName || '',
        item_category: productCategory || '',
        item_brand: 'TheCocktail',
        price: productPrice || 0,
        quantity: quantity || 1
      };
    });
  }
  
  // Si no hay productos en el carrito, devolvemos un array vacío
  return [];
}

// Método para verificar si hay un cupón aplicado
hasCouponApplied() {
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      return !!cart.coupon;
    }
  } catch (e) {
    console.error('Error al verificar cupón:', e);
  }
  return false;
}

// Método para obtener el código del cupón
getCouponCode() {
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      return cart.coupon || '';
    }
  } catch (e) {
    console.error('Error al obtener código de cupón:', e);
  }
  return '';
}

// Método para obtener el producto destacado
getFeaturedProduct() {
  // Intentamos obtener el primer producto visible
  const featuredProduct = document.querySelector('.product');
  if (featuredProduct) {
    const productId = featuredProduct.dataset.id;
    const productTitle = featuredProduct.querySelector('.product__title')?.textContent;
    const productCategory = featuredProduct.dataset.category;
    const productPrice = parseFloat(featuredProduct.querySelector('.product__price')?.textContent.replace('$', '').trim());
    
    if (productId && productTitle) {
      return {
        item_id: productId,
        item_name: productTitle,
        item_category: productCategory || '',
        item_brand: 'TheCocktail',
        price: productPrice || 0,
        quantity: 1
      };
    }
  }
  
  // Si no hay productos visibles, intentamos obtener uno del carrito
  const cartItems = this.getCartItems();
  return cartItems.length > 0 ? cartItems[0] : null;
}
}

document.addEventListener("DOMContentLoaded", () => {
window.app = new App();
});