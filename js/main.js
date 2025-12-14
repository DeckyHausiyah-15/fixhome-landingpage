(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ====== Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ====== Mobile menu
  const btnMenu = $("#btnMenu");
  const mobileMenu = $("#mobileMenu");
  btnMenu?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("is-open");
  });

  // ====== Toast
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2500);
  }

  // ====== Carousel (simple scroll + dots)
  const viewport = $("#carouselViewport");
  const track = $("#carouselTrack");
  const dotsWrap = $("#dots");
  const dots = dotsWrap ? $$(".dot") : [];

  function setActiveDot(index) {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function computeIndex() {
    if (!viewport || !track || !track.children.length) return 0;

    // hitung step pakai child pertama + gap
    const first = track.children[0].getBoundingClientRect().width || 1;
    const gap = 16; // sama seperti CSS
    const step = first + gap;

    const idx = Math.round(viewport.scrollLeft / step);
    return Math.max(0, Math.min(dots.length - 1, idx));
  }

  $$("[data-dir]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!viewport) return;
      const dir = Number(btn.getAttribute("data-dir")) || 1;
      const move = Math.round(viewport.clientWidth * 0.75) * dir;
      viewport.scrollBy({ left: move, behavior: "smooth" });
    });
  });

  viewport?.addEventListener("scroll", () => {
    setActiveDot(computeIndex());
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      if (!viewport || !track || !track.children.length) return;
      const first = track.children[0].getBoundingClientRect().width || 0;
      const gap = 16;
      viewport.scrollTo({ left: idx * (first + gap), behavior: "smooth" });
      setActiveDot(idx);
    });
  });

  // Promo buttons demo
  $("#btnPromo1")?.addEventListener("click", () => showToast("Promo: cek mitra terverifikasi (demo)."));
  $("#btnPromo2")?.addEventListener("click", () => showToast("Promo: service AC (demo)."));
  $("#btnPromo3")?.addEventListener("click", () => showToast("Promo: jasa rumah tangga (demo)."));

  // ====== Booking Modal
  const modal = $("#bookingModal");
  const bookingForm = $("#bookingForm");
  const serviceNameInput = $("#serviceName");

  function openModal(serviceName = "") {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (serviceNameInput) {
      serviceNameInput.value = serviceName || "";
      serviceNameInput.focus();
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  $("#btnOpenBooking")?.addEventListener("click", () => openModal(""));
  $("#btnOpenBooking2")?.addEventListener("click", () => openModal(""));

  // close overlay / close buttons
  modal?.addEventListener("click", (e) => {
    const target = e.target;
    if (target?.dataset?.close === "true") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });

  // Booking button in service cards
  $$("#serviceGrid [data-book]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-book") || "";
      openModal(name);
    });
  });

  bookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    console.log("BOOKING_PAYLOAD:", payload);

    showToast("Booking terkirim (demo). Integrasikan ke backend untuk produksi.");
    e.target.reset();
    closeModal();
  });

  // ====== Filter + Search (fitur dari versi sebelumnya)
  const cats = $$("#catsRow .cat");
  const chips = $$("#chipRow .chip");
  const cards = $$("#serviceGrid .serviceCard");

  const searchInput = $("#searchInput");
  const citySelect = $("#citySelect");
  const btnSearch = $("#btnSearch");
  const resultHint = $("#resultHint");

  let activeCategory = "all";

  function normalize(s) {
    return String(s || "").toLowerCase().trim();
  }

  function setActiveCategory(cat) {
    activeCategory = normalize(cat || "all");

    // sync UI: cats
    cats.forEach((c) => c.classList.toggle("is-active", normalize(c.dataset.cat) === activeCategory));

    // sync UI: chips
    chips.forEach((ch) => ch.classList.toggle("is-active", normalize(ch.dataset.filter) === activeCategory));
  }

  function applyFilters() {
    const q = normalize(searchInput?.value);
    const city = normalize(citySelect?.value || "all");

    let visible = 0;

    cards.forEach((card) => {
      const cat = normalize(card.dataset.category);
      const cardCity = normalize(card.dataset.city);
      const text = normalize(card.textContent);

      const matchCat = activeCategory === "all" ? true : cat === activeCategory;
      const matchCity = city === "all" ? true : cardCity === city;
      const matchQ = q ? text.includes(q) : true;

      const show = matchCat && matchCity && matchQ;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (resultHint) {
      resultHint.textContent = visible
        ? `Menampilkan ${visible} layanan sesuai filter.`
        : "Tidak ada layanan yang cocok. Coba ubah kata kunci/filter.";
    }
  }

  // Cats click => filter
  cats.forEach((c) => {
    c.addEventListener("click", () => {
      setActiveCategory(c.dataset.cat || "all");
      applyFilters();
      // scroll ke layanan supaya berasa seperti OLX kategori
      document.getElementById("layanan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Chips click => filter
  chips.forEach((ch) => {
    ch.addEventListener("click", () => {
      setActiveCategory(ch.dataset.filter || "all");
      applyFilters();
    });
  });

  // Search
  btnSearch?.addEventListener("click", applyFilters);
  searchInput?.addEventListener("input", applyFilters);
  citySelect?.addEventListener("change", applyFilters);

  // ====== Misc demo buttons
  $("#btnLogin")?.addEventListener("click", () => showToast("Login/daftar (demo)."));
  $("#btnPartner")?.addEventListener("click", () => showToast("Pendaftaran mitra (demo)."));

  // init
  setActiveCategory("all");
  applyFilters();
})();
