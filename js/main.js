/**
 * Marketplace demo controller (frontend-only)
 * - Render kategori populer
 * - Render listing cards
 * - Filter: city, radius (demo), price range, rating min, verified/certified, category, search keyword
 * - Sort: newest, cheapest, rating
 * - "Pasang Permintaan" -> Google Form (ganti URL di FORM_URL)
 */

const FORM_URL = "https://docs.google.com/forms/d/e/FORM_ID/viewform"; // <-- GANTI LINK GFORM DI SINI

const el = {
  year: document.getElementById("year"),

  // top controls
  topCity: document.getElementById("topCity"),
  topRadius: document.getElementById("topRadius"),
  btnAuthTop: document.getElementById("btnAuthTop"),
  btnPostTop: document.getElementById("btnPostTop"),

  // search
  searchCategory: document.getElementById("searchCategory"),
  searchQuery: document.getElementById("searchQuery"),
  btnSearch: document.getElementById("btnSearch"),

  // categories
  popularCats: document.getElementById("popularCats"),

  // filters
  fCity: document.getElementById("fCity"),
  fRadius: document.getElementById("fRadius"),
  priceMin: document.getElementById("priceMin"),
  priceMax: document.getElementById("priceMax"),
  ratingAny: document.getElementById("ratingAny"),
  rating40: document.getElementById("rating40"),
  rating45: document.getElementById("rating45"),
  fVerified: document.getElementById("fVerified"),
  fCertified: document.getElementById("fCertified"),
  sortBy: document.getElementById("sortBy"),
  btnReset: document.getElementById("btnReset"),

  // listing
  listingGrid: document.getElementById("listingGrid"),
  resultMeta: document.getElementById("resultMeta"),
};

const CATEGORIES = [
  { name: "Renovasi", icon: "🏠" },
  { name: "Listrik", icon: "⚡" },
  { name: "Ledeng", icon: "🚰" },
  { name: "AC", icon: "❄️" },
  { name: "Cat & Plafon", icon: "🎨" },
  { name: "Keramik", icon: "🧱" },
  { name: "Furniture", icon: "🪑" },
  { name: "CCTV / Smart Home", icon: "📷" },
  { name: "Kunci & Pintu", icon: "🔑" },
  { name: "Atap & Bocor", icon: "🏚️" },
  { name: "Taman", icon: "🌿" },
  { name: "Jasa Bersih", icon: "🧼" },
];

// Dummy listing data
const LISTINGS = [
  {
    id: 1,
    title: "Dingin Sejuk AC",
    category: "AC",
    city: "Surabaya",
    district: "Gubeng",
    distanceKm: 3.4,
    priceFrom: 175000,
    rating: 4.7,
    reviews: 221,
    verified: true,
    certified: true,
    fast: false,
    warranty: true
  },
  {
    id: 2,
    title: "Sumber Ledeng Mandiri",
    category: "Ledeng",
    city: "Surabaya",
    district: "Wonocolo",
    distanceKm: 4.7,
    priceFrom: 120000,
    rating: 4.6,
    reviews: 198,
    verified: true,
    certified: true,
    fast: true,
    warranty: false
  },
  {
    id: 3,
    title: "Budi Jaya Teknik",
    category: "Listrik",
    city: "Surabaya",
    district: "Wonokromo",
    distanceKm: 2.1,
    priceFrom: 150000,
    rating: 4.8,
    reviews: 312,
    verified: true,
    certified: false,
    fast: true,
    warranty: true
  },
  {
    id: 4,
    title: "Rapi Cat & Plafon",
    category: "Cat & Plafon",
    city: "Jakarta",
    district: "Tebet",
    distanceKm: 3.0,
    priceFrom: 200000,
    rating: 4.4,
    reviews: 92,
    verified: false,
    certified: false,
    fast: false,
    warranty: false
  },
  {
    id: 5,
    title: "Keramik Presisi",
    category: "Keramik",
    city: "Bandung",
    district: "Cicendo",
    distanceKm: 5.2,
    priceFrom: 250000,
    rating: 4.5,
    reviews: 140,
    verified: true,
    certified: true,
    fast: false,
    warranty: true
  },
];

boot();

function boot() {
  if (el.year) el.year.textContent = new Date().getFullYear();

  hydrateFromTopToFilter();
  renderCategories();
  bindEvents();
  render();
}

function hydrateFromTopToFilter() {
  // keep city/radius synced
  if (el.topCity && el.fCity) el.fCity.value = el.topCity.value;
  if (el.topRadius && el.fRadius) el.fRadius.value = el.topRadius.value;
}

function bindEvents() {
  el.btnAuthTop?.addEventListener("click", () => alert("Demo: Masuk/Daftar (butuh backend auth)."));

  el.btnPostTop?.addEventListener("click", () => {
    // open google form
    window.open(FORM_URL, "_blank", "noopener");
  });

  el.topCity?.addEventListener("change", () => {
    if (el.fCity) el.fCity.value = el.topCity.value;
    render();
  });
  el.topRadius?.addEventListener("change", () => {
    if (el.fRadius) el.fRadius.value = el.topRadius.value;
    render();
  });

  el.fCity?.addEventListener("change", () => {
    if (el.topCity) el.topCity.value = el.fCity.value;
    render();
  });
  el.fRadius?.addEventListener("change", () => {
    if (el.topRadius) el.topRadius.value = el.fRadius.value;
    render();
  });

  el.btnSearch?.addEventListener("click", render);
  el.searchQuery?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") render();
  });

  el.searchCategory?.addEventListener("change", render);
  el.priceMin?.addEventListener("input", debounce(render, 150));
  el.priceMax?.addEventListener("input", debounce(render, 150));
  el.ratingAny?.addEventListener("change", render);
  el.rating40?.addEventListener("change", render);
  el.rating45?.addEventListener("change", render);
  el.fVerified?.addEventListener("change", render);
  el.fCertified?.addEventListener("change", render);
  el.sortBy?.addEventListener("change", render);

  el.btnReset?.addEventListener("click", () => {
    if (el.searchQuery) el.searchQuery.value = "";
    if (el.searchCategory) el.searchCategory.value = "";
    if (el.priceMin) el.priceMin.value = 0;
    if (el.priceMax) el.priceMax.value = 500000;
    if (el.ratingAny) el.ratingAny.checked = true;
    if (el.fVerified) el.fVerified.checked = false;
    if (el.fCertified) el.fCertified.checked = false;
    if (el.sortBy) el.sortBy.value = "newest";
    render();
  });
}

function renderCategories() {
  if (!el.popularCats) return;

  el.popularCats.innerHTML = CATEGORIES.map(c => `
    <button class="catBtn" type="button" data-cat="${escapeHtml(c.name)}">
      <span class="catIcon" aria-hidden="true">${c.icon}</span>
      <span>${escapeHtml(c.name)}</span>
    </button>
  `).join("");

  el.popularCats.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    const cat = btn.getAttribute("data-cat") || "";

    // set dropdown category if exists
    if (el.searchCategory) {
      const opt = Array.from(el.searchCategory.options).find(o => o.value === cat);
      if (opt) el.searchCategory.value = cat;
    }
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function render() {
  const city = (el.fCity?.value || el.topCity?.value || "").trim();
  const radius = Number(el.fRadius?.value || el.topRadius?.value || 0);

  const category = (el.searchCategory?.value || "").trim();
  const query = (el.searchQuery?.value || "").trim().toLowerCase();

  const minPrice = Number(el.priceMin?.value || 0);
  const maxPrice = Number(el.priceMax?.value || 999999999);

  const ratingMin =
    (el.rating45?.checked ? 4.5 : el.rating40?.checked ? 4.0 : 0);

  const mustVerified = Boolean(el.fVerified?.checked);
  const mustCertified = Boolean(el.fCertified?.checked);

  let data = LISTINGS.slice();

  // filter city
  if (city) data = data.filter(x => x.city === city);

  // filter radius (demo)
  if (radius > 0) data = data.filter(x => x.distanceKm <= radius);

  // filter category
  if (category) data = data.filter(x => x.category === category);

  // filter query
  if (query) {
    data = data.filter(x =>
      (x.title + " " + x.category + " " + x.district).toLowerCase().includes(query)
    );
  }

  // filter price
  data = data.filter(x => x.priceFrom >= minPrice && x.priceFrom <= maxPrice);

  // filter rating
  if (ratingMin > 0) data = data.filter(x => x.rating >= ratingMin);

  // filter verified/certified
  if (mustVerified) data = data.filter(x => x.verified);
  if (mustCertified) data = data.filter(x => x.certified);

  // sort
  const sort = el.sortBy?.value || "newest";
  if (sort === "cheapest") data.sort((a,b) => a.priceFrom - b.priceFrom);
  else if (sort === "rating") data.sort((a,b) => b.rating - a.rating);
  else data.sort((a,b) => b.id - a.id); // newest by id

  // render meta
  if (el.resultMeta) {
    el.resultMeta.textContent = `${data.length} hasil • Kota: ${city || "-"} • Radius: ${radius === 0 ? "Bebas" : "≤ " + radius + " km"}`;
  }

  // render cards
  if (!el.listingGrid) return;

  el.listingGrid.innerHTML = data.map(item => cardTemplate(item)).join("");

  el.listingGrid.addEventListener("click", (e) => {
    const chatBtn = e.target.closest("[data-chat]");
    const orderBtn = e.target.closest("[data-order]");

    if (chatBtn) {
      alert("Demo: Chat (butuh backend realtime).");
    }
    if (orderBtn) {
      // contoh: arahkan ke gform juga
      window.open(FORM_URL, "_blank", "noopener");
    }
  }, { once: true });
}

function cardTemplate(x) {
  const badges = [];
  if (x.verified) badges.push("Terverifikasi");
  if (x.fast) badges.push("Fast Response");
  if (x.warranty) badges.push("Bergaransi");
  if (x.certified) badges.push("Bersertifikat");

  return `
    <article class="card">
      <div class="thumb" aria-hidden="true"></div>
      <div class="card__body">
        <h4 class="card__title">${escapeHtml(x.title)}</h4>

        <div class="badges">
          ${badges.slice(0,3).map(b => `<span class="badge">${escapeHtml(b)}</span>`).join("")}
          <span class="badge">${escapeHtml(x.category)}</span>
        </div>

        <div class="row">
          <span>★ ${x.rating.toFixed(1)} (${x.reviews} ulasan)</span>
          <span>•</span>
          <span>${escapeHtml(x.district)}, ${escapeHtml(x.city)}</span>
          <span>•</span>
          <span>${x.distanceKm.toFixed(1)} km</span>
        </div>

        <div class="priceRow">
          <div class="price">Mulai Rp ${formatRupiah(x.priceFrom)}</div>
        </div>

        <div class="actions">
          <button class="btn btn--outline" type="button" data-chat="1">Chat</button>
          <button class="btn btn--primary" type="button" data-order="1">Pesan</button>
        </div>
      </div>
    </article>
  `;
}

function formatRupiah(n) {
  try {
    return new Intl.NumberFormat("id-ID").format(n);
  } catch (_) {
    return String(n);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
