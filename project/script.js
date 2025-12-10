document.addEventListener("DOMContentLoaded", function () {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".hero-slide");
    const totalSlides = slides.length;

    document.getElementById("nextBtn").addEventListener("click", function () {
        changeSlide(1);
    });

    document.getElementById("prevBtn").addEventListener("click", function () {
        changeSlide(-1);
    });

    function changeSlide(direction) {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        slides[currentSlide].classList.add("active");
    }
});

// Підсвітка активного пункту меню
const links = document.querySelectorAll("nav a");
const current = window.location.pathname.split("/").pop();

links.forEach(link => {
    if (link.getAttribute("href") === current) {
        link.classList.add("active");
    }
});

const STORAGE_KEY = 'restaurant_catalog_v1';

function loadCatalog() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCatalog(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}


function initDemoCatalog() {
  if (loadCatalog().length) return;
  const demo = [
    {id: 'd1', name:'Карбонара', price:189, stock:10, img:'img/dish1.jpg'},
    {id: 'd2', name:'Стейк Рібай', price:349, stock:5, img:'img/dish2.jpg'},
    {id: 'd3', name:'Цезар', price:159, stock:8, img:'img/dish3.jpg'}
  ];
  saveCatalog(demo);
}

function getItem(id) {
  return loadCatalog().find(i => i.id === id);
}


function decreaseStock(id, qty=1) {
  const items = loadCatalog();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return false;
  items[idx].stock = Math.max(0, items[idx].stock - qty);
  saveCatalog(items);
  return true;
}


function renderCatalog(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const items = loadCatalog();
  container.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <h3>${it.name}</h3>
      <p class="price">${it.price} ₴</p>
      <p class="stock">Залишок: ${it.stock}</p>
      <button class="buy-btn" data-id="${it.id}">Замовити</button>
    `;
    container.appendChild(card);
  });
  
  container.querySelectorAll('.buy-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      if (decreaseStock(id, 1)) {
        renderCatalog(containerSelector);
        alert('Товар додано до замовлення (симуляція)');
      } else alert('Немає в наявності');
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initDemoCatalog();
  renderCatalog('.menu-grid'); // клас з menu.html
});
