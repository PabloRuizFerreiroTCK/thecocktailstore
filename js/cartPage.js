import { CartPageUI } from "./ui/cartPageUI.js";
import { cartUI } from "./ui/cartUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const cartPageUI = new CartPageUI();

  window.cartUIInstance = cartUI;
});