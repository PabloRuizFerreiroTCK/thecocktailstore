import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
constructor() {
  // Inicializamos el item_list_id y item_list_name
  this.currentItemListId = '1';
  this.currentItemListName = 'Todos';
  
  console.log('App inicializada');
  this.initializeApp();
}

initializeApp() {
  this.cartUI = cartUI;
  this.productsUI = productsUI;

  this.setupMobileMenu();
  this.setupEventTracking();
  console.log('Event tracking configurado');
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

// Método para enviar eventos al dataLayer con log
pushToDataLayer(eventData) {
  console.log('Enviando evento a dataLayer:', eventData);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
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
  
  console.log(`Item list actualizada: ID=${this.currentItemListId}, Name=${this.currentItemListName}`);
  
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
  console.log('Configurando trackViewItemList');
  
  // Disparamos el evento inmediatamente
  this.sendViewItemListEvent();
  
  // También lo configuramos para cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - Verificando productos');
    const productElements = document.querySelectorAll('.product');
    console.log(`Productos encontrados: ${productElements.length}`);
    
    if (productElements.length === 0) {
      // Si aún no hay productos, esperamos un poco más
      console.log('No se encontraron productos, esperando 500ms');
      setTimeout(() => {
        this.sendViewItemListEvent();
      }, 500);
    }
  });
}

sendViewItemListEvent() {
  console.log('Ejecutando sendViewItemListEvent');
  const productElements = document.querySelectorAll('.product');
  console.log(`Productos encontrados para view_item_list: ${productElements.length}`);
  
  const items = [];
  
  if (productElements.length > 0) {
    productElements.forEach(product => {
      const productId = product.dataset.id;
      const productTitle = product.querySelector('.product__title')?.textContent;
      const productCategory = product.dataset.category;
      const productPrice = parseFloat(product.querySelector('.product__price')?.textContent.replace('$', '').trim());
      
      console.log(`Producto encontrado: ID=${productId}, Nombre=${productTitle}`);
      
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
  } else {
    // Si no hay productos en el DOM, usamos datos de ejemplo
    console.log('No se encontraron productos, usando datos de ejemplo');
    items.push({
      item_id: '1',
      item_name: 'NovaTech Phantom X9',
      item_category: 'Laptop',
      item_brand: 'TheCocktail',
      price: 2499.99,
      quantity: 1
    });
  }
  
  if (items.length > 0) {
    const eventData = {
      'event': 'view_item_list',
      'item_list_id': this.getCurrentItemListId(),
      'item_list_name': this.getCurrentItemListName(),
      'currency': 'USD',
      'items': items
    };
    
    this.pushToDataLayer(eventData);
  }
}

// 2. Evento select_item al hacer clic en "Ver Productos"
trackViewProductsButton() {
  console.log('Configurando trackViewProductsButton');
  const viewProductsBtn = document.querySelector('a.button[href="#products"]');
  
  if (viewProductsBtn) {
    console.log('Botón "Ver Productos" encontrado');
    viewProductsBtn.addEventListener('click', () => {
      console.log('Clic en "Ver Productos"');
      
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
        const eventData = {
          'event': 'select_item',
          'item_list_id': this.getCurrentItemListId(),
          'item_list_name': this.getCurrentItemListName(),
          'currency': 'USD',
          'items': items
        };
        
        this.pushToDataLayer(eventData);
      } else {
        console.log('No se encontraron productos para select_item');
      }
    });
  } else {
    console.log('Botón "Ver Productos" NO encontrado');
  }
}

// 3. Evento select_item al hacer clic en los botones de filtro
trackFilterButtons() {
  console.log('Configurando trackFilterButtons');
  const filterButtons = document.querySelectorAll('.filter__button');
  console.log(`Botones de filtro encontrados: ${filterButtons.length}`);
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');
      console.log(`Clic en filtro: ${category}`);
      
      // Actualizamos el item_list_id y item_list_name según la categoría
      this.updateItemListInfo(category);
      
      // Esperamos a que se aplique el filtro
      setTimeout(() => {
        const productElements = document.querySelectorAll('.product:not(.hidden)');
        console.log(`Productos visibles después del filtro: ${productElements.length}`);
        
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
          const eventData = {
            'event': 'select_item',
            'item_list_id': this.getCurrentItemListId(),
            'item_list_name': this.getCurrentItemListName(),
            'currency': 'USD',
            'items': items
          };
          
          this.pushToDataLayer(eventData);
        } else {
          console.log('No se encontraron productos para select_item después del filtro');
        }
      }, 100);
    });
  });
}

// 4. Evento add_to_cart al hacer clic en el botón azul de carrito
trackAddToCartButtons() {
  console.log('Configurando trackAddToCartButtons');
  
  // Primero intentamos añadir listeners directamente a los botones existentes
  const addToCartButtons = document.querySelectorAll('.button.product__button');
  console.log(`Botones "Añadir al Carrito" encontrados: ${addToCartButtons.length}`);
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('Clic directo en "Añadir al Carrito"');
      this.handleAddToCartClick(button);
    });
  });
  
  // También usamos delegación de eventos para capturar botones añadidos dinámicamente
  document.addEventListener('click', (e) => {
    const addToCartButton = e.target.closest('.button.product__button');
    
    if (addToCartButton && !e.target._processedByDirectListener) {
      console.log('Clic delegado en "Añadir al Carrito"');
      e.target._processedByDirectListener = true; // Evitar duplicados
      this.handleAddToCartClick(addToCartButton);
    }
  });
}

handleAddToCartClick(button) {
  // Obtenemos el producto que se está añadiendo al carrito
  const productElement = button.closest('.product');
  if (productElement) {
    const productId = productElement.dataset.id;
    const productTitle = productElement.querySelector('.product__title')?.textContent;
    const productCategory = productElement.dataset.category;
    const productPrice = parseFloat(productElement.querySelector('.product__price')?.textContent.replace('$', '').trim());
    
    console.log(`Producto para add_to_cart: ID=${productId}, Nombre=${productTitle}`);
    
    if (productId && productTitle) {
      const eventData = {
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
      };
      
      this.pushToDataLayer(eventData);
    } else {
      console.log('No se pudo obtener información del producto para add_to_cart');
    }
  } else {
    console.log('No se encontró el elemento del producto para add_to_cart');
  }
}

// 5. Evento view_cart_icon_click al hacer clic en el icono del carrito
trackCartIconClick() {
  console.log('Configurando trackCartIconClick');
  const cartIcon = document.querySelector('.nav__cart-icon');
  const cartContainer = document.querySelector('.nav__cart');
  
  if (cartIcon) {
    console.log('Icono de carrito encontrado');
    cartIcon.addEventListener('click', () => {
      console.log('Clic en icono de carrito');
      this.handleCartIconClick();
    });
  } else {
    console.log('Icono de carrito NO encontrado');
  }
  
  if (cartContainer) {
    console.log('Contenedor de carrito encontrado');
    cartContainer.addEventListener('click', (e) => {
      // Solo disparamos si el clic fue en el contenedor, no en el icono (para evitar duplicados)
      if (e.target === cartContainer) {
        console.log('Clic en contenedor de carrito');
        this.handleCartIconClick();
      }
    });
  }
  
  // También usamos delegación para mayor seguridad
  document.addEventListener('click', (e) => {
    if ((e.target.classList.contains('nav__cart-icon') || 
         e.target.closest('.nav__cart')) && 
        !e.target._processedByDirectListener) {
      console.log('Clic delegado en icono/contenedor de carrito');
      e.target._processedByDirectListener = true; // Evitar duplicados
      this.handleCartIconClick();
    }
  });
}

handleCartIconClick() {
  // Obtenemos los productos del carrito
  const cartItems = this.getCartItems();
  console.log(`Productos en el carrito: ${cartItems.length}`);
  
  const eventData = {
    'event': 'view_cart_icon_click',
    'item_list_id': this.getCurrentItemListId(),
    'currency': 'USD',
    'items': cartItems.length > 0 ? cartItems : [{
      'item_id': '1',
      'item_name': 'NovaTech Phantom X9',
      'item_category': 'Laptop',
      'item_brand': 'TheCocktail',
      'price': 2499.99,
      'quantity': 1
    }]
  };
  
  this.pushToDataLayer(eventData);
}

// 6. Evento view_cart_click al hacer clic en "Ver Carrito"
trackViewCartButton() {
  console.log('Configurando trackViewCartButton');
  
  document.addEventListener('click', (e) => {
    const viewCartButton = e.target.closest('a.button.button--secondary[href="cart.html"]');
    
    if (viewCartButton) {
      console.log('Clic en "Ver Carrito"');
      
      // Obtenemos los productos del carrito
      const cartItems = this.getCartItems();
      console.log(`Productos en el carrito para view_cart_click: ${cartItems.length}`);
      
      const eventData = {
        'event': 'view_cart_click',
        'item_list_id': this.getCurrentItemListId(),
        'currency': 'USD',
        'items': cartItems.length > 0 ? cartItems : [{
          'item_id': '1',
          'item_name': 'NovaTech Phantom X9',
          'item_category': 'Laptop',
          'item_brand': 'TheCocktail',
          'price': 2499.99,
          'quantity': 1
        }]
      };
      
      this.pushToDataLayer(eventData);
    }
  });
}

// 7. Evento begin_checkout al hacer clic en "Proceder al Pago"
trackProceedToCheckoutButton() {
  console.log('Configurando trackProceedToCheckoutButton');
  
  document.addEventListener('click', (e) => {
    const checkoutButton = e.target.closest('a.button.button--primary[href="checkout.html"]');
    
    if (checkoutButton) {
      console.log('Clic en "Proceder al Pago"');
      
      // Obtenemos los productos del carrito
      const cartItems = this.getCartItems();
      console.log(`Productos en el carrito para begin_checkout: ${cartItems.length}`);
      
      // Verificamos si hay un cupón aplicado
      const hasCoupon = this.hasCouponApplied();
      const couponCode = this.getCouponCode();
      
      const eventData = {
        'event': 'begin_checkout',
        'item_list_id': this.getCurrentItemListId(),
        'checkout_step': 1,
        'currency': 'USD',
        'has_coupon': hasCoupon,
        'coupon': couponCode,
        'items': cartItems.length > 0 ? cartItems : [{
          'item_id': '1',
          'item_name': 'NovaTech Phantom X9',
          'item_category': 'Laptop',
          'item_brand': 'TheCocktail',
          'price': 2499.99,
          'quantity': 1
        }]
      };
      
      this.pushToDataLayer(eventData);
    }
  });
}

// 8. Eventos add_to_cart y remove_from_cart para los botones + y -
trackCartQuantityButtons() {
  console.log('Configurando trackCartQuantityButtons');
  
  document.addEventListener('click', (e) => {
    const quantityButton = e.target.closest('.quantity-btn');
    
    if (quantityButton) {
      const action = quantityButton.getAttribute('data-action');
      console.log(`Clic en botón de cantidad: ${action}`);
      
      // Buscar el elemento padre que contiene la información del producto
      const cartItem = quantityButton.closest('.cart-item') || quantityButton.closest('.cart-modal__item');
      
      if (cartItem) {
        const productId = cartItem.dataset.id;
        const productName = cartItem.querySelector('.cart-modal__item-name')?.textContent;
        const productCategory = cartItem.dataset.category;
        const productPrice = parseFloat(cartItem.querySelector('.cart-modal__item-price')?.textContent.replace('$', '').trim());
        
        console.log(`Producto para ${action}: ID=${productId}, Nombre=${productName}`);
        
        if (productId && productName) {
          if (action === 'increase') {
            const eventData = {
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
            };
            
            this.pushToDataLayer(eventData);
          } else if (action === 'decrease') {
            const eventData = {
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
            };
            
            this.pushToDataLayer(eventData);
          }
        } else {
          console.log('No se pudo obtener información del producto para el botón de cantidad');
        }
      } else {
        console.log('No se encontró el elemento del carrito para el botón de cantidad');
      }
    }
  });
}

// 9. Evento social_share al hacer clic en los iconos de redes sociales
trackSocialShareButtons() {
  console.log('Configurando trackSocialShareButtons');
  const socialLinks = document.querySelectorAll('.footer__social-link');
  console.log(`Enlaces de redes sociales encontrados: ${socialLinks.length}`);
  
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevenir la navegación por defecto
      
      let socialNetwork = 'Facebook';
      if (link.querySelector('.fa-twitter')) {
        socialNetwork = 'Twitter';
      } else if (link.querySelector('.fa-instagram')) {
        socialNetwork = 'Instagram';
      }
      
      console.log(`Clic en red social: ${socialNetwork}`);
      
      // Obtenemos el producto destacado o el último añadido al carrito
      const featuredProduct = this.getFeaturedProduct();
      
      const eventData = {
        'event': 'social_share',
        'social_network': socialNetwork,
        'items': featuredProduct ? [featuredProduct] : [{
          'item_id': '1',
          'item_name': 'NovaTech Phantom X9',
          'item_category': 'Laptop',
          'item_brand': 'TheCocktail',
          'price': 2499.99,
          'quantity': 1
        }]
      };
      
      this.pushToDataLayer(eventData);
    });
  });
}

// Método para obtener los productos del carrito
getCartItems() {
  console.log('Obteniendo productos del carrito');
  
  // Intentamos obtener los productos del carrito desde el localStorage
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      console.log('Carrito encontrado en localStorage');
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
    console.log(`Productos del carrito encontrados en el DOM: ${cartItems.length}`);
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
  console.log('No se encontraron productos en el carrito');
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
  console.log('Obteniendo producto destacado');
  
  // Intentamos obtener el primer producto visible
  const featuredProduct = document.querySelector('.product');
  if (featuredProduct) {
    const productId = featuredProduct.dataset.id;
    const productTitle = featuredProduct.querySelector('.product__title')?.textContent;
    const productCategory = featuredProduct.dataset.category;
    const productPrice = parseFloat(featuredProduct.querySelector('.product__price')?.textContent.replace('$', '').trim());
    
    console.log(`Producto destacado encontrado: ID=${productId}, Nombre=${productTitle}`);
    
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
  if (cartItems.length > 0) {
    console.log('Usando primer producto del carrito como destacado');
    return cartItems[0];
  }
  
  console.log('No se encontró producto destacado');
  return null;
}
}

document.addEventListener("DOMContentLoaded", () => {
console.log('DOMContentLoaded - Inicializando App');
window.app = new App();
});

// Log inicial para verificar que el script se está cargando
console.log('Script app.js cargado');