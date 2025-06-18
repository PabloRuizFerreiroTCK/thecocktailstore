import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
constructor() {
  // Aseguramos que dataLayer esté inicializado
  window.dataLayer = window.dataLayer || [];
  
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
  
  // Aseguramos que dataLayer esté inicializado
  window.dataLayer = window.dataLayer || [];
  
  // Usamos el método push directamente
  try {
    window.dataLayer.push(eventData);
    console.log('Evento enviado correctamente al dataLayer');
  } catch (error) {
    console.error('Error al enviar evento al dataLayer:', error);
  }
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

// Método para extraer información de productos del DOM
extractProductsFromDOM() {
  const productElements = document.querySelectorAll('.product');
  const items = [];
  
  productElements.forEach(product => {
    const productId = product.dataset.id;
    const productTitle = product.querySelector('.product__title')?.textContent;
    const productCategory = product.dataset.category;
    const productPriceText = product.querySelector('.product__price')?.textContent;
    const productPrice = productPriceText ? parseFloat(productPriceText.replace('$', '').trim()) : 0;
    
    if (productId && productTitle) {
      items.push({
        item_id: productId,
        item_name: productTitle,
        item_category: productCategory || '',
        item_brand: 'TheCocktail',
        price: productPrice,
        quantity: 1
      });
    }
  });
  
  return items;
}

// Método para extraer información de un producto específico del DOM
extractProductInfoFromElement(productElement) {
  if (!productElement) return null;
  
  const productId = productElement.dataset.id;
  const productTitle = productElement.querySelector('.product__title')?.textContent;
  const productCategory = productElement.dataset.category;
  const productPriceText = productElement.querySelector('.product__price')?.textContent;
  const productPrice = productPriceText ? parseFloat(productPriceText.replace('$', '').trim()) : 0;
  
  if (productId && productTitle) {
    return {
      item_id: productId,
      item_name: productTitle,
      item_category: productCategory || '',
      item_brand: 'TheCocktail',
      price: productPrice,
      quantity: 1
    };
  }
  
  return null;
}

// 1. Evento view_item_list al cargar la página
trackViewItemList() {
  console.log('Configurando trackViewItemList');
  
  // Esperamos a que el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const items = this.extractProductsFromDOM();
      
      if (items.length > 0) {
        const eventData = {
          'event': 'view_item_list',
          'item_list_id': this.getCurrentItemListId(),
          'item_list_name': this.getCurrentItemListName(),
          'currency': 'USD',
          'items': items
        };
        
        this.pushToDataLayer(eventData);
      } else {
        console.log('No se encontraron productos para view_item_list');
      }
    }, 500); // Damos tiempo para que se carguen los productos
  });
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
      
      // Esperamos un momento para que se muestren los productos
      setTimeout(() => {
        const items = this.extractProductsFromDOM();
        
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
      }, 100);
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
        // Obtenemos solo los productos visibles después de aplicar el filtro
        const productElements = document.querySelectorAll('.product:not(.hidden)');
        const items = [];
        
        productElements.forEach(product => {
          const productInfo = this.extractProductInfoFromElement(product);
          if (productInfo) {
            items.push(productInfo);
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
          console.log('No se encontraron productos visibles después de aplicar el filtro');
        }
      }, 100);
    });
  });
}

// 4. Evento add_to_cart al hacer clic en el botón azul de carrito
trackAddToCartButtons() {
  console.log('Configurando trackAddToCartButtons');
  
  // Usamos delegación de eventos para capturar todos los botones "Añadir al Carrito"
  document.addEventListener('click', (e) => {
    // Verificamos si el clic fue en el botón o en su icono
    const addToCartButton = e.target.closest('.button.product__button');
    
    if (addToCartButton) {
      console.log('Clic en "Añadir al Carrito"');
      
      // Obtenemos el producto que se está añadiendo al carrito
      const productElement = addToCartButton.closest('.product');
      const productInfo = this.extractProductInfoFromElement(productElement);
      
      if (productInfo) {
        const eventData = {
          'event': 'add_to_cart',
          'currency': 'USD',
          'item_list_id': this.getCurrentItemListId(),
          'items': [productInfo]
        };
        
        this.pushToDataLayer(eventData);
      } else {
        console.log('No se pudo obtener información del producto para add_to_cart');
      }
    }
  });
}

// 5. Evento view_cart_icon_click al hacer clic en el icono del carrito
trackCartIconClick() {
  console.log('Configurando trackCartIconClick');
  
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__cart-icon') || 
        e.target.closest('.nav__cart')) {
      console.log('Clic en icono de carrito');
      
      // Esperamos a que se abra el modal del carrito
      setTimeout(() => {
        // Obtenemos los productos del carrito desde el modal
        const cartItems = this.getCartItemsFromModal();
        
        const eventData = {
          'event': 'view_cart_icon_click',
          'item_list_id': this.getCurrentItemListId(),
          'currency': 'USD',
          'items': cartItems
        };
        
        this.pushToDataLayer(eventData);
      }, 100);
    }
  });
}

// 6. Evento view_cart_click al hacer clic en "Ver Carrito"
trackViewCartButton() {
  console.log('Configurando trackViewCartButton');
  
  document.addEventListener('click', (e) => {
    const viewCartButton = e.target.closest('a.button.button--secondary[href="cart.html"]');
    
    if (viewCartButton) {
      console.log('Clic en "Ver Carrito"');
      
      // Obtenemos los productos del carrito desde el modal
      const cartItems = this.getCartItemsFromModal();
      
      const eventData = {
        'event': 'view_cart_click',
        'item_list_id': this.getCurrentItemListId(),
        'currency': 'USD',
        'items': cartItems
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
      
      // Obtenemos los productos del carrito desde el modal
      const cartItems = this.getCartItemsFromModal();
      
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
        'items': cartItems
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
        const productPriceText = cartItem.querySelector('.cart-modal__item-price')?.textContent;
        const productPrice = productPriceText ? parseFloat(productPriceText.replace('$', '').trim()) : 0;
        
        if (productId && productName) {
          const productInfo = {
            item_id: productId,
            item_name: productName,
            item_category: productCategory || '',
            item_brand: 'TheCocktail',
            price: productPrice,
            quantity: 1
          };
          
          if (action === 'increase') {
            const eventData = {
              'event': 'add_to_cart',
              'currency': 'USD',
              'item_list_id': this.getCurrentItemListId(),
              'items': [productInfo]
            };
            
            this.pushToDataLayer(eventData);
          } else if (action === 'decrease') {
            const eventData = {
              'event': 'remove_from_cart',
              'currency': 'USD',
              'item_list_id': this.getCurrentItemListId(),
              'items': [productInfo]
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
        'items': featuredProduct ? [featuredProduct] : []
      };
      
      this.pushToDataLayer(eventData);
    });
  });
}

// Método para obtener los productos del carrito desde el modal
getCartItemsFromModal() {
  const cartItems = document.querySelectorAll('.cart-modal__item');
  const items = [];
  
  if (cartItems.length > 0) {
    cartItems.forEach(item => {
      const productId = item.dataset.id;
      const productName = item.querySelector('.cart-modal__item-name')?.textContent;
      const productCategory = item.dataset.category;
      const productPriceText = item.querySelector('.cart-modal__item-price')?.textContent;
      const productPrice = productPriceText ? parseFloat(productPriceText.replace('$', '').trim()) : 0;
      const quantityText = item.querySelector('.cart-modal__item-quantity')?.textContent;
      const quantity = quantityText ? parseInt(quantityText) : 1;
      
      if (productId && productName) {
        items.push({
          item_id: productId,
          item_name: productName,
          item_category: productCategory || '',
          item_brand: 'TheCocktail',
          price: productPrice,
          quantity: quantity
        });
      }
    });
  }
  
  return items;
}

// Método para verificar si hay un cupón aplicado
hasCouponApplied() {
  // Buscar algún elemento en el DOM que indique que hay un cupón aplicado
  const couponElement = document.querySelector('.cart-modal__coupon') || document.querySelector('.coupon-applied');
  return !!couponElement;
}

// Método para obtener el código del cupón
getCouponCode() {
  // Buscar el código del cupón en el DOM
  const couponElement = document.querySelector('.cart-modal__coupon-code') || document.querySelector('.coupon-code');
  return couponElement ? couponElement.textContent.trim() : '';
}

// Método para obtener el producto destacado
getFeaturedProduct() {
  // Intentamos obtener el primer producto visible
  const featuredProduct = document.querySelector('.product');
  if (featuredProduct) {
    return this.extractProductInfoFromElement(featuredProduct);
  }
  
  // Si no hay productos visibles, intentamos obtener uno del carrito
  const cartItems = this.getCartItemsFromModal();
  return cartItems.length > 0 ? cartItems[0] : null;
}
}

// Aseguramos que dataLayer esté inicializado antes de cualquier otra cosa
window.dataLayer = window.dataLayer || [];
console.log('dataLayer inicializado:', window.dataLayer);

document.addEventListener("DOMContentLoaded", () => {
console.log('DOMContentLoaded - Inicializando App');
window.app = new App();
});

// Log inicial para verificar que el script se está cargando
console.log('Script app.js cargado');