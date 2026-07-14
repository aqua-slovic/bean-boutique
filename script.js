const storageKey = 'bean-boutique-cart';

function getCart() {
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  if (!cartItems || !subtotalEl || !totalEl) return;

  const cart = getCart();

  if (!cart.length) {
    cartItems.innerHTML = '<p>Your cart is empty. Add one of our signature brews to begin.</p>';
    subtotalEl.textContent = 'MWK 0';
    totalEl.textContent = 'MWK 0';
    return;
  }

  cartItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>MWK ${item.price.toLocaleString()}</p>
      </div>
      <div class="cart-actions">
        <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
        <button class="qty-btn" data-action="remove" data-index="${index}">×</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  subtotalEl.textContent = `MWK ${subtotal.toLocaleString()}`;
  totalEl.textContent = `MWK ${subtotal.toLocaleString()}`;
}

function handleCartButtons(event) {
  const button = event.target.closest('.qty-btn');
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);
  const cart = getCart();

  if (!cart[index]) return;

  if (action === 'increase') {
    cart[index].quantity += 1;
  } else if (action === 'decrease') {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (action === 'remove') {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
  updateCartBadge();
}

function initSwiper() {
  if (window.Swiper) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 3000 },
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  }
}

function initNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNav();
  initSwiper();

  document.querySelectorAll('.add-cart-btn').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.name, Number(button.dataset.price));
    });
  });

  const cartList = document.getElementById('cart-items');
  if (cartList) {
    cartList.addEventListener('click', handleCartButtons);
    renderCart();
  }
});
