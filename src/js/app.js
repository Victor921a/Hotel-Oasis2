// Oasis Hotel - client-side app (simulado con localStorage)

const APP_KEYS = {
  USERS: 'oasis_users',
  CURRENT: 'oasis_current',
  RESERVATIONS: 'oasis_reservations',
  SERVICES: 'oasis_serviceRequests',
  PENDING: 'oasis_pending',
  ITEM_STOCK: 'oasis_itemStock',
  HOTELS: 'oasis_hotels',
  ADMIN_EMAIL: 'admin@oasishotel.com'
};

function read(key){
  try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){return []}
}
function write(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

function getUsers(){ return read(APP_KEYS.USERS); }
function saveUsers(u){ write(APP_KEYS.USERS,u); }
function getHotels(){ return read(APP_KEYS.HOTELS); }
function saveHotels(h){ write(APP_KEYS.HOTELS,h); }
function ensureHotels(){
  const existing = read(APP_KEYS.HOTELS);
  if(existing.length > 0) return;
  const defaults = [
    {
      id: 'hotel_oasis_playa',
      name: 'Oasis Playa',
      address: 'Cancún, México',
      description: 'Frente al mar turquesa y arenas blancas de Cancún. Piscina infinita, bar en playa y suites con balcón privado.',
      image: 'img/WhatsApp Image 2026-05-20 at 11.58.32 AM.jpeg',
      features: ['⭐ 5 Estrellas', '🏊 Piscina Climatizada', '🍽️ Restaurante Gourmet', '📶 Wi-Fi Premium'],
      categories: [
        { id: 'cat_simple', title: 'Simple', desc: 'Habitación ideal para viajeros individuales. Incluye cama individual, baño privado, Wi-Fi de alta velocidad, escritorio y café de cortesía.', price: 80, maxGuests: 1, image: 'img/Habitacion-Simple.png' },
        { id: 'cat_deluxe', title: 'Deluxe', desc: 'Amplia habitación de lujo. Incluye cama King Size, vistas panorámicas, balcón privado, minibar completo y TV inteligente.', price: 140, maxGuests: 3, image: 'img/EPWSZJEF5ND37BQAKKDE2T7EIM.jpg' },
        { id: 'cat_matrimonial', title: 'Matrimonial', desc: 'Perfecta para parejas. Incluye cama King Size de lujo, jacuzzi de hidromasaje privado y servicio a la habitación preferencial.', price: 220, maxGuests: 3, image: 'img/MATRIMONIAL-scaled.jpg' }
      ]
    },
    {
      id: 'hotel_oasis_montana',
      name: 'Oasis Montaña',
      address: 'Bariloche, Argentina',
      description: 'Rodeado de bosques autóctonos y lagos cristalinos. Chimeneas de piedra, jacuzzis climatizados y senderos privados.',
      image: 'img/WhatsApp Image 2026-05-20 at 12.00.53 PM.jpeg',
      features: ['⭐ 5 Estrellas', '🔥 Chimeneas', '🛁 Jacuzzi Exterior', '🌲 Senderos Privados'],
      categories: [
        { id: 'cat_simple_mountain', title: 'Simple', desc: 'Habitación acogedora y cálida. Ideal para viajeros que buscan tranquilidad junto a la montaña.', price: 80, maxGuests: 1, image: 'img/Habitacion-Simple.png' },
        { id: 'cat_deluxe_mountain', title: 'Deluxe', desc: 'Habitación con vista al bosque, cama King Size, minibar y balcón con chimenea.', price: 140, maxGuests: 3, image: 'img/EPWSZJEF5ND37BQAKKDE2T7EIM.jpg' },
        { id: 'cat_matrimonial_mountain', title: 'Matrimonial', desc: 'Suite para parejas con jacuzzi privado, servicio personalizado y vista panorámica.', price: 220, maxGuests: 3, image: 'img/MATRIMONIAL-scaled.jpg' }
      ]
    },
    {
      id: 'hotel_oasis_ciudad',
      name: 'Oasis Ciudad',
      address: 'Madrid, España',
      description: 'Lujo cosmopolita en el corazón histórico de Madrid. Terraza rooftop y habitaciones insonorizadas con sábanas de algodón egipcio.',
      image: 'img/WhatsApp Image 2026-05-20 at 12.03.21 PM.jpeg',
      features: ['⭐ 5 Estrellas', '🌇 Rooftop', '🍸 Coctelería', '🛎️ Servicio VIP'],
      categories: [
        { id: 'cat_simple_city', title: 'Simple', desc: 'Habitación compacta y elegante en el centro de la ciudad, ideal para escapadas urbanas.', price: 80, maxGuests: 1, image: 'img/Habitacion-Simple.png' },
        { id: 'cat_deluxe_city', title: 'Deluxe', desc: 'Suite Deluxe con diseño moderno, minibar y vistas a la ciudad.', price: 140, maxGuests: 3, image: 'img/EPWSZJEF5ND37BQAKKDE2T7EIM.jpg' },
        { id: 'cat_matrimonial_city', title: 'Matrimonial', desc: 'Suite romántica con cama King Size, jacuzzi y detalles de lujo.', price: 220, maxGuests: 3, image: 'img/MATRIMONIAL-scaled.jpg' }
      ]
    }
  ];
  write(APP_KEYS.HOTELS, defaults);
}

function isAdmin(email){
  return email === APP_KEYS.ADMIN_EMAIL;
}

function requireLogin(){
  const cur = localStorage.getItem(APP_KEYS.CURRENT);
  if(!cur){ location.href = 'login.html'; return null; }
  if(cur === APP_KEYS.ADMIN_EMAIL){ location.href = 'admin.html'; return null; }
  return cur;
}

function requireAdmin(){
  const cur = localStorage.getItem(APP_KEYS.CURRENT);
  if(!cur || cur !== APP_KEYS.ADMIN_EMAIL){ location.href = 'login.html'; return null; }
  return cur;
}

// ── Seeder automático de stock ────────────────────────────────────────────────
function ensureStock(){
  const existing = read(APP_KEYS.ITEM_STOCK);
  if(existing.length > 0) return;
  const defaults = [
    { title:'Picarones',       qty:20 },
    { title:'Crema volteada',  qty:15 },
    { title:'Pionono',         qty:12 },
    { title:'Alfajores',       qty:30 },
    { title:'Churros',         qty:25 },
    { title:'Turrón',          qty:10 },
    { title:'Ají de gallina',  qty:10 },
    { title:'Lomo saltado',    qty:10 },
    { title:'Ceviche',         qty:12 },
    { title:'Chaufa salvaje',  qty:10 },
    { title:'Seco de cabrito', qty:8 },
    { title:'Pachamanca',      qty:6 },
    { title:'Guiso de cochayuyo', qty:12 },
    { title:'Jugos naturales',      qty:20 },
    { title:'Café pasado',          qty:30 },
    { title:'Gaseosas',             qty:40 },
    { title:'Pisco sour',           qty:15 },
    { title:'Agua mineral',         qty:50 },
    { title:'Botella de Maracuyá',  qty:12 },
    { title:'Afrodiciaco',          qty:8 },
    { title:'Agua de puquio',       qty:20 }
  ];
  write(APP_KEYS.ITEM_STOCK, defaults);
}

function getStock(){
  ensureStock();
  return read(APP_KEYS.ITEM_STOCK);
}

function updateStockItem(title, qty, price, category){
  const stock = getStock();
  const idx = stock.findIndex(s => s.title === title);
  if(idx >= 0){
    stock[idx].qty = Math.max(0, qty);
    if(price != null) stock[idx].price = price;
    if(category != null) stock[idx].category = category;
  } else {
    const item = { title, qty: Math.max(0, qty) };
    if(price != null) item.price = price;
    if(category != null) item.category = category;
    stock.push(item);
  }
  write(APP_KEYS.ITEM_STOCK, stock);
}

function consumeStock(items){
  const stock = getStock();
  items.forEach(item => {
    const idx = stock.findIndex(s => s.title === item.title);
    if(idx >= 0){
      stock[idx].qty = Math.max(0, stock[idx].qty - item.qty);
    }
  });
  write(APP_KEYS.ITEM_STOCK, stock);
}

function getAvailableQty(title){
  const stock = getStock();
  const item = stock.find(s => s.title === title);
  return item ? item.qty : 0;
}

// ── Páginas ───────────────────────────────────────────────────────────────────
function onRegisterPage(){
  const form = document.getElementById('registerForm');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    if(!email||!password) return alert('Rellena los campos');
    const users = getUsers();
    if(users.find(u => u.email === email)){
      return alert('Ya existe una cuenta con ese email. Usa otro email o inicia sesión.');
    }
    localStorage.setItem(APP_KEYS.PENDING, JSON.stringify({email,password}));
    location.href = 'personal.html';
  });
}

function onPersonalPage(){
  const form = document.getElementById('personalForm');
  if(!form) return;
  const pending = JSON.parse(localStorage.getItem(APP_KEYS.PENDING) || 'null');
  if(!pending) { location.href = 'register.html'; return; }
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const doc = document.getElementById('doc').value.trim();
    const address = document.getElementById('address').value.trim();
    const users = getUsers();
    if(users.find(u=>u.email===pending.email)){
      const goLogin = confirm('Ya existe una cuenta con ese email. ¿Quieres ir a iniciar sesión? Pulsa Aceptar para ir a login o Cancelar para corregir tus datos.');
      if(goLogin){
        localStorage.removeItem(APP_KEYS.PENDING);
        location.href = 'login.html';
      }
      return;
    }
    const user = Object.assign({}, pending, {firstName,lastName,phone,doc,address,createdAt:new Date().toISOString()});
    users.push(user); saveUsers(users);
    localStorage.removeItem(APP_KEYS.PENDING);
    alert('Registro completado. Por favor inicia sesión.');
    location.href = 'login.html';
  });
}

function onLoginPage(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    // permitir login admin hardcodeado
    if(email === APP_KEYS.ADMIN_EMAIL && password === 'admin123'){
      localStorage.setItem(APP_KEYS.CURRENT, APP_KEYS.ADMIN_EMAIL);
      location.href = 'admin.html';
      return;
    }
    const u = users.find(x=> x.email === email && x.password === password);
    if(!u) return alert('Usuario o contraseña incorrectos');
    localStorage.setItem(APP_KEYS.CURRENT, u.email);
    location.href = 'reservations.html';
  });
}

// ══════════════════════════════════════════════════════════════
//  RESERVAS — ahora con botón cancelar (1 día de anticipación)
// ══════════════════════════════════════════════════════════════
function onReservationsPage(){
  if(!location.pathname.endsWith('reservations.html')) return;
  const email = requireLogin(); if(!email) return;
  const users = getUsers(); const user = users.find(u=>u.email===email);
  document.getElementById('welcomeUser').textContent = `Hola, ${user.firstName || user.email}`;

  ensureHotels();
  const hotelExperience = document.querySelector('.hotel-experience');
  const hotelList = document.getElementById('hotelList');
  const detailsPlaceholder = document.getElementById('detailsPlaceholder');
  const detailsContent = document.getElementById('detailsContent');
  const detailSedeName = document.getElementById('detailSedeName');
  const detailSedeDescription = document.getElementById('detailSedeDescription');
  const hotelFeatures = document.getElementById('hotelFeatures');

  const categoryList = document.getElementById('categoryList');
  const categoryDetail = document.getElementById('categoryDetail');
  const catName = document.getElementById('catName');
  const catDesc = document.getElementById('catDesc');
  const catPrice = document.getElementById('catPrice');

  const bookCategoryBtn = document.getElementById('bookCategoryBtn');
  const reserveFormContainer = document.getElementById('reserveFormContainer');

  const summarySede = document.getElementById('summarySede');
  const summaryRoom = document.getElementById('summaryRoom');
  const summaryPrice = document.getElementById('summaryPrice');

  const reserveForm = document.getElementById('reserveForm');
  const cancelReserve = document.getElementById('cancelReserve');
  const reservationsList = document.getElementById('reservationsList');
  const guestInput = document.getElementById('guests');

  let selectedHotel = null;
  let selectedCategory = "";
  let selectedCategoryObject = null;
  let selectedPrice = 0;

  function renderHotelCards() {
    if(!hotelList) return;
    const hotels = getHotels();
    hotelList.innerHTML = '';
    hotels.forEach(hotel => {
      const card = document.createElement('div');
      card.className = 'hotel-card';
      card.dataset.hotelId = hotel.id;
      card.innerHTML = `
        <img src="${hotel.image}" class="hotel-card-img" alt="${hotel.name}">
        <h4>${hotel.name}</h4>
        <p class="hotel-address">📍 ${hotel.address}</p>
      `;
      card.addEventListener('click', () => selectHotel(hotel.id));
      hotelList.appendChild(card);
    });
  }

  function renderHotelFeatures() {
    if(!hotelFeatures) return;
    hotelFeatures.innerHTML = '';
    if(!selectedHotel || !Array.isArray(selectedHotel.features)) return;
    selectedHotel.features.forEach(feature => {
      const span = document.createElement('span');
      span.className = 'hotel-pill';
      span.textContent = feature;
      hotelFeatures.appendChild(span);
    });
  }

  function renderCategoryButtons() {
    if(!categoryList) return;
    categoryList.innerHTML = '';
    if(!selectedHotel || !Array.isArray(selectedHotel.categories) || selectedHotel.categories.length === 0){
      categoryList.innerHTML = '<p style="color:#666;">Este hotel no tiene categorías de habitación definidas.</p>';
      return;
    }
    selectedHotel.categories.forEach(category => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'categoryBtn';
      btn.dataset.category = category.title;
      btn.dataset.price = category.price;
      btn.innerHTML = `
        <img src="${category.image}" alt="${category.title}">
        <div>
          <strong>${category.title}</strong>
          <span>S/${category.price} / noche</span>
        </div>
      `;
      btn.addEventListener('click', () => {
        categoryList.querySelectorAll('.categoryBtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = category.title;
        selectedCategoryObject = category;
        selectedPrice = category.price;
        catName.textContent = `Habitación ${category.title}`;
        catDesc.textContent = `${category.desc} Capacidad máxima: ${category.maxGuests} huésped${category.maxGuests === 1 ? '' : 'es'}.`;
        catPrice.textContent = `S/${selectedPrice} / noche`;
        guestInput.max = category.maxGuests;
        guestInput.value = Math.min(guestInput.value || 1, category.maxGuests);
        categoryDetail.classList.remove('hidden');
        reserveFormContainer.classList.add('hidden');
      });
      categoryList.appendChild(btn);
    });
  }

  function selectHotel(hotelId) {
    const hotels = getHotels();
    selectedHotel = hotels.find(h => h.id === hotelId) || null;
    selectedCategory = "";
    selectedCategoryObject = null;
    selectedPrice = 0;
    if(!hotelList) return;
    hotelList.querySelectorAll('.hotel-card').forEach(card => {
      card.classList.toggle('active', card.dataset.hotelId === hotelId);
    });
    if(selectedHotel){
      hotelExperience.classList.add('has-selection');
      detailSedeName.textContent = selectedHotel.name;
      detailSedeDescription.textContent = selectedHotel.description;
      detailsPlaceholder.classList.add('hidden');
      detailsContent.classList.remove('hidden');
      categoryDetail.classList.add('hidden');
      reserveFormContainer.classList.add('hidden');
      renderHotelFeatures();
      renderCategoryButtons();
    }
  }

  renderHotelCards();

  // –– Botón reservar ––
  bookCategoryBtn.addEventListener('click', () => {
    if (!selectedHotel || !selectedCategoryObject) return;
    summarySede.textContent = selectedHotel.name;
    summaryRoom.textContent = selectedCategoryObject.title;
    summaryPrice.textContent = `S/${selectedPrice} / noche`;
    reserveFormContainer.classList.remove('hidden');
    reserveFormContainer.scrollIntoView({ behavior: 'smooth' });
  });

  // –– Botón cancelar formulario ––
  cancelReserve.addEventListener('click', () => {
    reserveFormContainer.classList.add('hidden');
    reserveForm.reset();
  });

  // –– Confirmar reserva ––
  reserveForm.addEventListener('submit', e => {
    e.preventDefault();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;

    if (!checkin || !checkout) { alert('Selecciona las fechas de llegada y salida.'); return; }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (checkoutDate <= checkinDate) { alert('La fecha de salida debe ser posterior a la fecha de llegada.'); return; }

    const guestCount = Number(guests);
    if (!selectedCategoryObject) { alert('Selecciona una habitación.'); return; }
    if (guestCount > selectedCategoryObject.maxGuests) { alert(`La categoría ${selectedCategoryObject.title} permite máximo ${selectedCategoryObject.maxGuests} huésped${selectedCategoryObject.maxGuests === 1 ? '':'es'}.`); return; }

    const reservations = read(APP_KEYS.RESERVATIONS);
    const id = 'r_' + Date.now();
    const rec = {
      id, userEmail: email,
      hotel: selectedHotel ? selectedHotel.name : '', category: selectedCategoryObject.title,
      room: `${selectedHotel ? selectedHotel.name : ''} - ${selectedCategoryObject.title}`,
      checkin, checkout, guests,
      createdAt: new Date().toISOString()
    };

    reservations.push(rec);
    write(APP_KEYS.RESERVATIONS, reservations);

    alert('¡Reserva confirmada con éxito!');
    reserveForm.reset();
    reserveFormContainer.classList.add('hidden');
    categoryDetail.classList.add('hidden');
    if(categoryList){
      categoryList.querySelectorAll('.categoryBtn').forEach(btn => btn.classList.remove('active'));
    }
    hotelExperience.classList.remove('has-selection');
    if(hotelList){
      hotelList.querySelectorAll('.hotel-card').forEach(c => c.classList.remove('active'));
    }
    selectedHotel = null;
    selectedCategory = "";
    selectedCategoryObject = null;
    detailsContent.classList.add('hidden');
    detailsPlaceholder.classList.remove('hidden');
    renderReservations();
  });

  // –– Renderizar reservas + botón cancelar ––
  function renderReservations(){
    reservationsList.innerHTML = '';
    const reservations = read(APP_KEYS.RESERVATIONS).filter(r => r.userEmail === email);
    if (reservations.length === 0) {
      reservationsList.innerHTML = '<li style="color:#666; font-style:italic;">No tienes reservas activas actualmente.</li>';
      return;
    }

    const now = new Date();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    reservations.forEach(r => {
      const li = document.createElement('li');
      const checkinDate = new Date(r.checkin);
      const canCancel = now < checkinDate - ONE_DAY_MS;
      const cancelBtn = canCancel
        ? `<button type="button" class="btn btn-ghost cancel-res-btn" data-id="${r.id}" title="Cancelar con 1 día de anticipación">✕ Cancelar reserva</button>`
        : '<span style="color:#999;font-size:.85rem;">No se puede cancelar (falta menos de 1 día)</span>';

      li.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.8rem;flex-wrap:wrap;">
          <div>
            <strong>${r.hotel || 'Oasis Hotel'}</strong> — Habitación <strong>${r.category || 'Estándar'}</strong><br>
            <span style="font-size:.9rem;color:#555;">📅 ${r.checkin} ➔ ${r.checkout} | 👥 ${r.guests} huéspedes</span>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;">${cancelBtn}</div>
        </div>
      `;
      reservationsList.appendChild(li);
    });

    // listeners cancelar
    reservationsList.querySelectorAll('.cancel-res-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const confirmMsg = '¿Confirmas la cancelación de esta reserva?';
        if(!UI || !UI.confirm) return alert(confirmMsg);
        UI.confirm(confirmMsg, { okText: 'Sí, cancelar', cancelText: 'No' }).then(ok => {
          if(!ok) return;
          const all = read(APP_KEYS.RESERVATIONS).filter(r => r.id !== id);
          write(APP_KEYS.RESERVATIONS, all);
          renderReservations();
        });
      });
    });
  }

  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem(APP_KEYS.CURRENT);
    location.href = 'index.html';
  });

  renderReservations();
}

// ══════════════════════════════════════════════════════════════
//  SERVICIO A LA HABITACIÓN — límites + cancelar pedido (5 min)
// ══════════════════════════════════════════════════════════════
function onServicePage(){
  if(!location.pathname.endsWith('service.html')) return;
  const email = requireLogin(); if(!email) return;
  const users = getUsers(); const user = users.find(u=>u.email===email);
  document.getElementById('serviceWelcome').textContent = `Hola, ${user.firstName || user.email}`;

  const categoryList = document.getElementById('serviceCategoryList');
  const reservationList = document.getElementById('serviceReservationList');
  const reservationInfo = document.getElementById('serviceReservationInfo');
  const serviceGrid = document.querySelector('.service-grid');
  const detailPanel = document.getElementById('serviceDetailPanel');
  const serviceDetailTitle = document.getElementById('serviceDetailTitle');
  const serviceDetailDesc = document.getElementById('serviceDetailDesc');
  const serviceItems = document.getElementById('serviceItems');
  const serviceCart = document.getElementById('serviceCart');
  const serviceCartList = document.getElementById('serviceCartList');
  const serviceCartTotal = document.getElementById('serviceCartTotal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutCartBtn = document.getElementById('checkoutCartBtn');
  const backToCategories = document.getElementById('backToCategories');
  const list = document.getElementById('serviceList');

  let selectedReservationId = null;
  let hasActiveReservation = false;
  let cartItems = [];

  const categories = [
    { id:'postres', title:'Postres', description:'Dulces tentaciones listas para tu habitación.', image:'img/postres.webp' },
    { id:'platos',  title:'Platos',  description:'Comidas completas y sabrosas para cualquier momento.', image:'img/comidas.jpg' },
    { id:'bebidas', title:'Bebidas', description:'Refrescos, jugos y cocteles que acompañan tu estadía.', image:'img/bebidas.avif' }
  ];

  const items = {
    postres:[
      { title:'Picarones',       image:'img/pICARONES.jpg',      price: 7 },
      { title:'Crema volteada',  image:'img/crema volteada.jpg', price: 6 },
      { title:'Pionono',         image:'img/pionono.jpg',        price: 6 },
      { title:'Alfajores',       image:'img/Alfajores.jpg',      price: 5 },
      { title:'Churros',         image:'img/ChurroS.jpeg',       price: 6 },
      { title:'Turrón',          image:'img/tURRON.jpg',         price: 8 }
    ],
    platos:[
      { title:'Ají de gallina',    image:'img/Aji de gallina.jpg',       price: 18 },
      { title:'Lomo saltado',      image:'img/Lomo Saltado.jpg',         price: 20 },
      { title:'Ceviche',           image:'img/ceviche.jpg',              price: 16 },
      { title:'Chaufa salvaje',    image:'img/chaufa salvaje.jpg',       price: 17 },
      { title:'Seco de cabrito',   image:'img/Seco de cabrito.jpg',      price: 19 },
      { title:'Pachamanca',        image:'img/Pachamanca.jpg',           price: 21 },
      { title:'Guiso de cochayuyo',image:'img/guiso cochayuyo.webp',     price: 15 }
    ],
    bebidas:[
      { title:'Jugos naturales',   image:'img/Jugos.jpg',                  price: 5 },
      { title:'Café pasado',       image:'img/bebida caliente cafe pasado.jpg', price: 4 },
      { title:'Gaseosas',          image:'img/Gaseosas.jpg',               price: 4 },
      { title:'Pisco sour',        image:'img/pisco-sour.jpg',             price: 12 },
      { title:'Agua mineral',      image:'img/Agua mineral.jpg',           price: 3 },
      { title:'Botella de Maracuyá',image:'img/Botella de Maracuya.png',    price: 7 },
      { title:'Afrodiciaco',       image:'img/aFRODICIACO.jpg',            price: 14 },
      { title:'Agua de puquio',    image:'img/agua de puquio.jpg',         price: 5 }
    ]
  };

  // –– Agregar al carrito con límite de stock ––
  function addToCart(categoryId, item){
    if(!hasActiveReservation || !selectedReservationId){
      alert('Selecciona primero una reserva activa para pedir un servicio.');
      return;
    }
    // Buscar cantidad actual en carrito + stock disponible
    const existing = cartItems.find(ci => ci.title === item.title && ci.categoryId === categoryId);
    const inCart = existing ? existing.qty : 0;
    const available = getAvailableQty(item.title);
    if(inCart >= available){
      alert(`No hay más stock disponible de "${item.title}". Quedan ${available} unidad(es).`);
      return;
    }

    if(existing){
      existing.qty += 1;
    } else {
      cartItems.push({
        categoryId,
        category: categories.find(cat => cat.id === categoryId).title,
        title: item.title,
        price: item.price,
        qty: 1
      });
    }
    renderCart();
  }

  function renderCategories(){
    if (!hasActiveReservation) {
      categoryList.innerHTML = '<div class="service-no-reservation"><p>No puedes pedir servicio sin una reserva activa. <a href="reservations.html">Reserva primero</a> para poder continuar.</p></div>';
      return;
    }

    categoryList.innerHTML = '';
    categories.forEach(category => {
      const card = document.createElement('article');
      card.className = 'service-category-card';
      card.innerHTML = `
        <img class="service-card-img" src="${category.image}" alt="${category.title}">
        <div class="service-card-body">
          <h4>${category.title}</h4>
          <p>${category.description}</p>
        </div>
      `;
      card.addEventListener('click', () => showCategory(category.id));
      categoryList.appendChild(card);
    });
  }

  function showCategory(categoryId){
    if(!hasActiveReservation || !selectedReservationId){
      alert('Selecciona primero una reserva activa para ver los insumos.');
      return;
    }
    const category = categories.find(cat => cat.id === categoryId);
    if(!category) return;
    serviceDetailTitle.textContent = category.title;
    serviceDetailDesc.textContent = category.description;
    detailPanel.classList.remove('hidden');
    serviceGrid.classList.add('has-selection');
    renderItems(categoryId);
  }

  function renderItems(categoryId){
    serviceItems.innerHTML = '';
    const dynamicItems = getStock()
      .filter(item => item.category === categoryId && item.price > 0)
      .map(item => ({
        title: item.title,
        image: (categories.find(cat => cat.id === categoryId) || {}).image || '',
        price: item.price,
        categoryId
      }));
    const staticItems = items[categoryId] || [];
    const seenTitles = new Set();
    const combinedItems = [...dynamicItems, ...staticItems].filter(item => {
      const title = item.title.toLowerCase();
      if(seenTitles.has(title)) return false;
      seenTitles.add(title);
      return true;
    });

    if(combinedItems.length === 0){
      serviceItems.innerHTML = '<div style="color:#666;padding:1rem;font-style:italic;">No hay insumos disponibles en esta categoría.</div>';
      return;
    }

    combinedItems.forEach(item => {
      const available = getAvailableQty(item.title);
      const inCart = cartItems.find(ci => ci.title === item.title);
      const inCartQty = inCart ? inCart.qty : 0;
      const disabledClass = available <= 0 || inCartQty >= available ? ' disabled' : '';
      const btnText = available <= 0 ? 'Sin stock' : (inCartQty >= available ? 'Stock agotado' : 'Agregar');

      const el = document.createElement('article');
      el.className = 'service-item-card';
      el.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="service-item-body">
          <div>
            <h4>${item.title}</h4>
            <p>S/${item.price.toFixed(2)} • Stock: ${available} unid.</p>
          </div>
          <button type="button" class="btn btn-primary${disabledClass}" ${available <= 0 ? 'disabled' : ''}>${btnText}</button>
        </div>
      `;
      if(available > 0 && inCartQty < available){
        el.querySelector('button').addEventListener('click', () => addToCart(categoryId, item));
      }
      serviceItems.appendChild(el);
    });
  }

  function loadReservations(){
    const activeReservations = read(APP_KEYS.RESERVATIONS).filter(r => r.userEmail === email);
    reservationList.innerHTML = '';
    if(activeReservations.length === 0){
      reservationInfo.textContent = 'No tienes reservas activas. Reserva primero para pedir servicio a habitación.';
      reservationList.innerHTML = '<div class="service-no-reservation"><p>No hay reservas activas.</p></div>';
      reservationList.classList.remove('has-selection');
      selectedReservationId = null;
      hasActiveReservation = false;
      detailPanel.classList.add('hidden');
      renderCategories();
      return;
    }

    reservationInfo.textContent = 'Selecciona tu reserva activa para pedir room service.';
    hasActiveReservation = true;
    reservationList.classList.add('has-selection');

    activeReservations.forEach((r, index) => {
      const card = document.createElement('article');
      card.className = 'service-reservation-card';
      card.innerHTML = `
        <div>
          <strong>${r.hotel}</strong>
          <p>${r.category} · ${r.checkin} → ${r.checkout}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        selectedReservationId = r.id;
        reservationList.querySelectorAll('.service-reservation-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
      reservationList.appendChild(card);
      if(index === 0){
        selectedReservationId = r.id;
        card.classList.add('active');
      }
    });

    renderCategories();
  }

  // –– Carrito con botones + y - y límite de stock ––
  function renderCart(){
    if(cartItems.length === 0){
      serviceCart.classList.add('hidden');
      return;
    }

    serviceCart.classList.remove('hidden');
    serviceCartList.innerHTML = '';
    const availableMap = {};
    getStock().forEach(s => availableMap[s.title] = s.qty);

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    cartItems.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'service-cart-item';
      row.innerHTML = `
        <div>
          <strong>${item.title}</strong>
          <p>${item.category} · S/${item.price.toFixed(2)} x ${item.qty} = S/${(item.price * item.qty).toFixed(2)}</p>
        </div>
        <div class="service-cart-item-controls">
          <button type="button" class="btn btn-ghost qty-btn" data-action="decrease" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button type="button" class="btn btn-ghost qty-btn" data-action="increase" data-index="${index}" ${item.qty >= availableMap[item.title] ? 'disabled' : ''}>+</button>
        </div>
      `;
      serviceCartList.appendChild(row);
    });

    serviceCartTotal.textContent = `S/${total.toFixed(2)}`;

    serviceCartList.querySelectorAll('.qty-btn').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        const idx = Number(button.dataset.index);
        const ci = cartItems[idx];
        if(!ci) return;
        const avail = availableMap[ci.title];

        if(action === 'increase'){
          if(ci.qty < avail){ ci.qty += 1; }
          else { alert(`No hay más stock. Quedan ${avail} unidad(es).`); return; }
        } else if(action === 'decrease'){
          ci.qty -= 1;
          if(ci.qty <= 0){ cartItems.splice(idx, 1); }
        }
        renderCart();
        // refrescar lista de items
        const catId = cartItems.length ? cartItems[0].categoryId : null;
        if(catId) renderItems(catId);
      });
    });
  }

  function clearCart(){ cartItems = []; renderCart(); }

  // –– Checkout: confirmar, guardar y descontar stock ––
  function checkoutCart(){
    if(cartItems.length === 0){ alert('Agrega al menos un insumo al carrito.'); return; }

    // verificar que quede stock suficiente
    const stock = getStock();
    let stockOk = true;
    cartItems.forEach(item => {
      const s = stock.find(si => si.title === item.title);
      if(!s || s.qty < item.qty) stockOk = false;
    });
    if(!stockOk){ alert('No hay suficiente stock. Actualiza el carrito y vuelve a intentar.'); return; }

    const services = read(APP_KEYS.SERVICES);
    const total = cartItems.reduce((a, i) => a + i.price * i.qty, 0);

    services.push({
      id: 's_' + Date.now(),
      userEmail: email,
      reservationId: selectedReservationId,
      category: 'Room Service',
      items: cartItems.map(item => ({ title: item.title, qty: item.qty, price: item.price, category: item.category })),
      total,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    });
    write(APP_KEYS.SERVICES, services);
    consumeStock(cartItems);
    alert('Pedido enviado al servicio.');
    clearCart();
    renderCartList();
    renderMyServices();
  }

  clearCartBtn.addEventListener('click', clearCart);
  checkoutCartBtn.addEventListener('click', checkoutCart);

  backToCategories.addEventListener('click', () => {
    detailPanel.classList.add('hidden');
    serviceGrid.classList.remove('has-selection');
  });

  // –– Mi historial de pedidos con botón cancelar (5 min) ––
  function renderMyServices(){
    list.innerHTML = '';
    const services = read(APP_KEYS.SERVICES).filter(s => s.userEmail === email);
    if (services.length === 0) {
      list.innerHTML = '<li>No hay solicitudes</li>';
      return;
    }

    const now = new Date();
    const FIVE_MIN_MS = 5 * 60 * 1000;

    services.forEach(s => {
      const li = document.createElement('li');
      const created = new Date(s.createdAt);
      const canCancel = now - created < FIVE_MIN_MS;
      const cancelBtn = canCancel
        ? `<button class="btn btn-ghost cancel-svc-btn" data-id="${s.id}" style="margin-left:.5rem;">✕ Cancelar pedido</button>`
        : '<span style="color:#999;font-size:.85rem;">No cancelable (han pasado más de 5 minutos)</span>';

      if (Array.isArray(s.items)) {
        const details = s.items.map(i => `${i.title} x${i.qty}`).join(', ');
        li.innerHTML = `
          <div>
            <strong>${s.category}</strong>
            <p>${details}</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;">
            <span>${s.items.length} artículo${s.items.length === 1 ? '':'s'}</span>
            <span>Total: S/${(s.total || 0).toFixed(2)}</span>
            <span>${s.status || 'pendiente'}</span>
            ${cancelBtn}
          </div>
        `;
      } else {
        li.innerHTML = `<strong>${s.category}</strong> · ${s.item || s.type || ''} <span>${s.status || 'pendiente'}</span>${cancelBtn}`;
      }

      list.appendChild(li);
    });

    // listeners cancelar pedido
    list.querySelectorAll('.cancel-svc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if(!UI || !UI.confirm) return alert('¿Cancelar este pedido?');
        UI.confirm('¿Confirmas la cancelación de este pedido?', { okText: 'Sí, cancelar', cancelText: 'No' }).then(ok => {
          if(!ok) return;
          const all = read(APP_KEYS.SERVICES).filter(s => s.id !== id);
          write(APP_KEYS.SERVICES, all);
          renderMyServices();
        });
      });
    });
  }

  function renderCartList(){ renderCart(); }

  document.getElementById('logoutBtn2').addEventListener('click', ()=>{ localStorage.removeItem(APP_KEYS.CURRENT); location.href='index.html'; });

  loadReservations();
  renderCartAndServices();

  function renderCartAndServices(){
    renderCartList();
    renderMyServices();
  }
}

// ══════════════════════════════════════════════════════════════
//  PÁGINA ADMIN
// ══════════════════════════════════════════════════════════════
function onAdminPage(){
  if(!location.pathname.endsWith('admin.html')) return;
  requireAdmin();

  const welcome = document.getElementById('adminWelcome');
  if(welcome) welcome.textContent = 'Panel de Administrador';
  ensureHotels();

  // ── Tabla de stock ──
  const stockList = document.getElementById('stockList');
  const searchInput = document.getElementById('stockSearch');
  const saveAllBtn = document.getElementById('saveAllStock');
  const newStockTitle = document.getElementById('newStockTitle');
  const newStockPrice = document.getElementById('newStockPrice');
  const newStockCategory = document.getElementById('newStockCategory');
  const newStockQty = document.getElementById('newStockQty');
  const addStockItemBtn = document.getElementById('addStockItem');

  const serviceCategoryOptions = [
    { id: 'postres', title: 'Postres' },
    { id: 'platos', title: 'Platos' },
    { id: 'bebidas', title: 'Bebidas' }
  ];

  function buildCategoryOptions(selected){
    return serviceCategoryOptions.map(option => `
      <option value="${option.id}" ${option.id === selected ? 'selected' : ''}>${option.title}</option>
    `).join('');
  }

  function renderStock(filter){
    if(!stockList) return;
    const stock = getStock();
    const term = (filter || '').toLowerCase();
    stockList.innerHTML = '';
    stock.filter(s => s.title.toLowerCase().includes(term)).forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.title}</td>
        <td><input type="number" min="0" value="${s.price || 0}" data-title="${s.title}" class="stock-price-input" style="width:100px;padding:.4rem .6rem;border:1px solid #ddd;border-radius:6px;"></td>
        <td>
          <select class="stock-category-select" data-title="${s.title}" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:6px;">${buildCategoryOptions(s.category || '')}</select>
        </td>
        <td><input type="number" min="0" value="${s.qty}" data-title="${s.title}" class="stock-qty-input" style="width:100px;padding:.4rem .6rem;border:1px solid #ddd;border-radius:6px;"></td>
        <td style="white-space:nowrap;">
          <button class="btn btn-secondary save-stock-btn" data-title="${s.title}" style="padding:.3rem .6rem;">Guardar</button>
          <button class="btn btn-danger delete-stock-btn" data-title="${s.title}" style="padding:.3rem .6rem;">Eliminar</button>
        </td>
      `;
      stockList.appendChild(tr);
    });
  }

  if(searchInput) searchInput.addEventListener('input', e => renderStock(e.target.value));
  if(saveAllBtn) saveAllBtn.addEventListener('click', () => {
    const rows = stockList.querySelectorAll('tr');
    rows.forEach(row => {
      const title = row.querySelector('.save-stock-btn').dataset.title;
      const qty = parseInt(row.querySelector('.stock-qty-input').value, 10) || 0;
      const price = parseFloat(row.querySelector('.stock-price-input').value) || 0;
      const category = row.querySelector('.stock-category-select').value;
      updateStockItem(title, qty, price, category);
    });
    renderStock(searchInput ? searchInput.value : '');
    if(UI) UI.toast('success', 'Stock actualizado.');
  });

  if(addStockItemBtn) addStockItemBtn.addEventListener('click', () => {
    const title = newStockTitle.value.trim();
    const price = parseFloat(newStockPrice.value) || 0;
    const category = newStockCategory.value;
    const qty = parseInt(newStockQty.value, 10) || 0;
    if(!title) return alert('Ingresa el nombre del producto.');
    if(price <= 0) return alert('Ingresa un precio válido para el producto.');
    if(!category) return alert('Selecciona una categoría para el producto.');
    const stock = getStock();
    if(stock.find(item => item.title.toLowerCase() === title.toLowerCase())){
      return alert('Ya existe un producto con ese nombre.');
    }
    stock.push({ title, qty, price, category });
    write(APP_KEYS.ITEM_STOCK, stock);
    newStockTitle.value = '';
    newStockPrice.value = '0';
    newStockCategory.value = '';
    newStockQty.value = '1';
    renderStock(searchInput ? searchInput.value : '');
    if(UI) UI.toast('success', 'Producto agregado.');
  });

  // guardar fila individual
  if(stockList) stockList.addEventListener('click', e => {
    const saveBtn = e.target.closest('.save-stock-btn');
    const deleteBtn = e.target.closest('.delete-stock-btn');
    if(saveBtn){
      const row = saveBtn.closest('tr');
      const qty = parseInt(row.querySelector('.stock-qty-input').value, 10) || 0;
      const price = parseFloat(row.querySelector('.stock-price-input').value) || 0;
      const category = row.querySelector('.stock-category-select').value;
      updateStockItem(saveBtn.dataset.title, qty, price, category);
      if(UI) UI.toast('success', `Stock de "${saveBtn.dataset.title}" actualizado.`);
      return;
    }
    if(deleteBtn){
      const title = deleteBtn.dataset.title;
      if(!confirm(`¿Eliminar el producto "${title}"?`)) return;
      const stock = getStock().filter(item => item.title !== title);
      write(APP_KEYS.ITEM_STOCK, stock);
      renderStock(searchInput ? searchInput.value : '');
      if(UI) UI.toast('success', `Producto "${title}" eliminado.`);
      return;
    }
  });

  // ── Tabla de pedidos (cambiar estado) ──
  const reservationsAdminList = document.getElementById('reservationsAdminList');
  const serviceListAdmin = document.getElementById('serviceListAdmin');
  const filterStatus = document.getElementById('filterStatus');

  function renderReservationsAdmin(){
    if(!reservationsAdminList) return;
    const reservations = read(APP_KEYS.RESERVATIONS);
    reservationsAdminList.innerHTML = '';
    if(reservations.length === 0){
      reservationsAdminList.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#666;">No hay reservas.</td></tr>';
      return;
    }
    reservations.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code style="font-size:.8rem;background:#f5f0e6;padding:.1rem .4rem;border-radius:4px;">${r.id.slice(-6)}</code></td>
        <td>${r.userEmail}</td>
        <td>${r.hotel || '—'}</td>
        <td>${r.category || '—'}</td>
        <td>${r.checkin} → ${r.checkout}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-danger cancel-reservation-admin-btn" data-id="${r.id}" style="padding:.3rem .6rem;">Cancelar</button>
        </td>
      `;
      reservationsAdminList.appendChild(tr);
    });
  }

  function renderServicesAdmin(){
    if(!serviceListAdmin) return;
    const services = read(APP_KEYS.SERVICES);
    const statusFilter = filterStatus ? filterStatus.value : 'all';
    serviceListAdmin.innerHTML = '';

    const filtered = statusFilter === 'all' ? services : services.filter(s => (s.status || 'pendiente') === statusFilter);

    if(filtered.length === 0){
      serviceListAdmin.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#666;">No hay pedidos.</td></tr>';
      return;
    }

    filtered.forEach(s => {
      const tr = document.createElement('tr');
      const details = Array.isArray(s.items)
        ? s.items.map(i => `${i.title} x${i.qty}`).join(', ')
        : (s.item || s.type || '—');
      // status-select arriba, fecha abajo
      tr.innerHTML = `
        <td><code style="font-size:.8rem;background:#f5f0e6;padding:.1rem .4rem;border-radius:4px;">${s.id.slice(-6)}</code></td>
        <td>${s.userEmail}</td>
        <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${details}">${details}</td>
        <td><strong>$${(s.total || 0).toFixed(2)}</strong></td>
        <td>
          <select class="status-select" data-id="${s.id}" style="padding:.4rem;border-radius:8px;border:1px solid #ddd;background:#fff;font-weight:600;">
            <option value="pendiente" ${(s.status||'pendiente')==='pendiente'?'selected':''}>Pendiente</option>
            <option value="entregado" ${s.status==='entregado'?'selected':''}>Entregado</option>
            <option value="cancelado" ${s.status==='cancelado'?'selected':''}>Cancelado</option>
          </select>
        </td>
        <td style="color:#8a826f;font-size:.88rem;">${new Date(s.createdAt).toLocaleString('es-PE')}</td>
      `;
      serviceListAdmin.appendChild(tr);
    });

    // listeners para cambio de estado
    serviceListAdmin.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const all = read(APP_KEYS.SERVICES);
        const idx = all.findIndex(s => s.id === sel.dataset.id);
        if(idx >= 0){
          all[idx].status = sel.value;
          write(APP_KEYS.SERVICES, all);
          if(UI) UI.toast('success', `Pedido ${sel.value} marcado como "${sel.value}".`);
        }
      });
    });
  }

  if(filterStatus) filterStatus.addEventListener('change', renderServicesAdmin);
  renderServicesAdmin();
  renderReservationsAdmin();
  renderStock('');

  // ── Gestión de hoteles y habitaciones ──
  const hotelsTable = document.getElementById('hotelsTable');
  const hotelSelect = document.getElementById('hotelSelect');
  const hotelName = document.getElementById('hotelName');
  const hotelAddress = document.getElementById('hotelAddress');
  const saveHotelBtn = document.getElementById('saveHotelBtn');
  const addRoomBtn = document.getElementById('addRoomBtn');
  const roomForm = document.getElementById('roomForm');
  const roomTitle = document.getElementById('roomTitle');
  const roomPrice = document.getElementById('roomPrice');
  const roomGuests = document.getElementById('roomGuests');
  const roomDesc = document.getElementById('roomDesc');
  const saveRoomBtn = document.getElementById('saveRoomBtn');
  const cancelRoomBtn = document.getElementById('cancelRoomBtn');
  const roomsTable = document.getElementById('roomsTable');

  let editingHotelId = null;
  let editingRoomId = null;
  let selectedHotelId = null;

  function loadHotelOptions() {
    if(!hotelSelect) return;
    const hotels = getHotels();
    hotelSelect.innerHTML = '<option value="">Selecciona un hotel</option>';
    hotels.forEach(hotel => {
      const opt = document.createElement('option');
      opt.value = hotel.id;
      opt.textContent = hotel.name;
      hotelSelect.appendChild(opt);
    });
  }

  function renderHotelsAdmin() {
    if(!hotelsTable) return;
    const hotels = getHotels();
    hotelsTable.innerHTML = '';
    hotels.forEach(hotel => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${hotel.name}</td>
        <td>${hotel.address}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-warning edit-hotel-btn" data-id="${hotel.id}" style="padding:.3rem .6rem;">Editar</button>
          <button class="btn btn-danger delete-hotel-btn" data-id="${hotel.id}" style="padding:.3rem .6rem;">Eliminar</button>
        </td>
      `;
      hotelsTable.appendChild(tr);
    });
  }

  function renderRoomsAdmin() {
    if(!roomsTable) return;
    const hotels = getHotels();
    const hotel = hotels.find(h => h.id === selectedHotelId);
    roomsTable.innerHTML = '';
    if(!hotel || !hotel.categories || hotel.categories.length === 0){
      roomsTable.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#666;">Selecciona un hotel o agrega categorías.</td></tr>';
      return;
    }
    hotel.categories.forEach(category => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${category.title}</td>
        <td>S/${category.price}</td>
        <td>${category.maxGuests}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-warning edit-room-btn" data-hotel="${hotel.id}" data-id="${category.id}" style="padding:.3rem .6rem;">Editar</button>
          <button class="btn btn-danger delete-room-btn" data-hotel="${hotel.id}" data-id="${category.id}" style="padding:.3rem .6rem;">Eliminar</button>
        </td>
      `;
      roomsTable.appendChild(tr);
    });
  }

  function renderHotelAdmin() {
    renderHotelsAdmin();
    loadHotelOptions();
    if(selectedHotelId){
      hotelSelect.value = selectedHotelId;
      renderRoomsAdmin();
    } else {
      renderRoomsAdmin();
    }
  }

  function clearHotelForm() {
    hotelName.value = '';
    hotelAddress.value = '';
    editingHotelId = null;
    saveHotelBtn.textContent = 'Agregar hotel';
  }

  function clearRoomForm() {
    roomTitle.value = '';
    roomPrice.value = '';
    roomGuests.value = '1';
    roomDesc.value = '';
    editingRoomId = null;
    roomForm.style.display = 'none';
  }

  function selectHotelForRooms(id) {
    selectedHotelId = id;
    renderRoomsAdmin();
  }

  if(hotelSelect) hotelSelect.addEventListener('change', () => selectHotelForRooms(hotelSelect.value));

  if(saveHotelBtn) saveHotelBtn.addEventListener('click', () => {
    const name = hotelName.value.trim();
    const address = hotelAddress.value.trim();
    if(!name || !address) return alert('Completa nombre y ubicación del hotel.');
    const hotels = getHotels();
    if(editingHotelId){
      const idx = hotels.findIndex(h => h.id === editingHotelId);
      if(idx >= 0){
        hotels[idx].name = name;
        hotels[idx].address = address;
      }
    } else {
      hotels.push({
        id: 'hotel_' + Date.now(),
        name,
        address,
        description: `${name} en ${address}`,
        image: 'img/WhatsApp Image 2026-05-20 at 11.58.32 AM.jpeg',
        features: ['⭐ 5 Estrellas', '🏨 Servicio Premium'],
        categories: []
      });
    }
    saveHotels(hotels);
    clearHotelForm();
    renderHotelAdmin();
    if(UI) UI.toast('success', 'Hotel guardado.');
  });

  if(addRoomBtn) addRoomBtn.addEventListener('click', () => {
    if(!selectedHotelId){ return alert('Selecciona un hotel para agregar una categoría.'); }
    roomForm.style.display = 'block';
    saveRoomBtn.textContent = 'Agregar categoría';
    editingRoomId = null;
  });

  if(cancelRoomBtn) cancelRoomBtn.addEventListener('click', () => {
    clearRoomForm();
  });

  if(saveRoomBtn) saveRoomBtn.addEventListener('click', () => {
    if(!selectedHotelId) return alert('Selecciona un hotel primero.');
    const title = roomTitle.value.trim();
    const price = Number(roomPrice.value);
    const guests = Number(roomGuests.value);
    const desc = roomDesc.value.trim();
    if(!title || !price || !guests || !desc) return alert('Completa todos los campos de la categoría.');
    const hotels = getHotels();
    const hotel = hotels.find(h => h.id === selectedHotelId);
    if(!hotel) return;
    if(!hotel.categories) hotel.categories = [];
    if(editingRoomId){
      const idx = hotel.categories.findIndex(c => c.id === editingRoomId);
      if(idx >= 0){
        hotel.categories[idx] = Object.assign(hotel.categories[idx], { title, price, maxGuests: guests, desc });
      }
    } else {
      hotel.categories.push({ id: 'room_' + Date.now(), title, price, maxGuests: guests, desc, image: 'img/Habitacion-Simple.png' });
    }
    saveHotels(hotels);
    clearRoomForm();
    renderHotelAdmin();
    if(UI) UI.toast('success', 'Categoría guardada.');
  });

  if(hotelsTable) hotelsTable.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-hotel-btn');
    const deleteBtn = e.target.closest('.delete-hotel-btn');
    if(editBtn){
      const id = editBtn.dataset.id;
      const hotel = getHotels().find(h => h.id === id);
      if(hotel){
        hotelName.value = hotel.name;
        hotelAddress.value = hotel.address;
        editingHotelId = id;
        saveHotelBtn.textContent = 'Actualizar hotel';
      }
      return;
    }
    if(deleteBtn){
      const id = deleteBtn.dataset.id;
      if(!confirm('Eliminar hotel y sus categorías?')) return;
      const hotels = getHotels().filter(h => h.id !== id);
      saveHotels(hotels);
      if(selectedHotelId === id) selectedHotelId = null;
      renderHotelAdmin();
      if(UI) UI.toast('success', 'Hotel eliminado.');
    }
  });

  if(roomsTable) roomsTable.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-room-btn');
    const deleteBtn = e.target.closest('.delete-room-btn');
    if(!selectedHotelId) return;
    const hotels = getHotels();
    const hotel = hotels.find(h => h.id === selectedHotelId);
    if(!hotel) return;
    if(editBtn){
      const roomId = editBtn.dataset.id;
      const category = hotel.categories.find(c => c.id === roomId);
      if(category){
        roomTitle.value = category.title;
        roomPrice.value = category.price;
        roomGuests.value = category.maxGuests;
        roomDesc.value = category.desc;
        editingRoomId = roomId;
        roomForm.style.display = 'block';
        saveRoomBtn.textContent = 'Actualizar categoría';
      }
      return;
    }
    if(deleteBtn){
      const roomId = deleteBtn.dataset.id;
      if(!confirm('Eliminar esta categoría?')) return;
      hotel.categories = hotel.categories.filter(c => c.id !== roomId);
      saveHotels(hotels);
      renderHotelAdmin();
      if(UI) UI.toast('success', 'Categoría eliminada.');
    }
  });

  if(reservationsAdminList) reservationsAdminList.addEventListener('click', e => {
    const btn = e.target.closest('.cancel-reservation-admin-btn');
    if(!btn) return;
    const id = btn.dataset.id;
    if(!confirm('¿Eliminar esta reserva?')) return;
    const all = read(APP_KEYS.RESERVATIONS).filter(r => r.id !== id);
    write(APP_KEYS.RESERVATIONS, all);
    renderReservationsAdmin();
    if(UI) UI.toast('success', 'Reserva cancelada.');
  });

  renderHotelAdmin();

  // logout admin
  const logoutBtn = document.getElementById('logoutBtnAdmin');
  if(logoutBtn){
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem(APP_KEYS.CURRENT);
      location.href = 'index.html';
    });
  }
}

// Initialize depending on page
document.addEventListener('DOMContentLoaded', ()=>{
  // seeder
  ensureStock();
  try{
    onRegisterPage(); onPersonalPage(); onLoginPage(); onReservationsPage(); onServicePage(); onAdminPage();
  }catch(e){console.error(e)}
});
