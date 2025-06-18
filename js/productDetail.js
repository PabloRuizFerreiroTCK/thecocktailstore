import { ProductDetailUI } from "./ui/productDetailUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const productDetailUI = new ProductDetailUI();

  window.cartUIInstance = cartUI;
});