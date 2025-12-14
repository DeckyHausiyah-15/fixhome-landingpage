(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Mobile menu
  $("#btnMenu")?.addEventListener("click", () => $("#mobileMenu")?.classList.toggle("is-open"));

  // Toast
  const toast = $("#toast");
  let t = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove("is-show"), 2500);
  }

  // ===== Carousel
  const viewport = $("#carouselViewport");
  const track = $("#carouselTrack");
  const dotsWrap = $("#dots");
  const dots = dotsWrap ? $$(".dot") : [];

  function setActiveDot(index) {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function computeIndex() {
    if (!viewport || !track || !track.children.length) return 0;
    const first = track.children[0].getBoundingClientRect().width || 1;
    const gap = 16;
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

  viewport?.addEventListener("scroll", () => setActiveDot(computeIndex()));

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      if (!viewport || !track || !track.children.length) return;
      const first = track.children[0].getBoundingClientRect().width || 0;
      const gap = 16;
      viewport.scrollTo({ left: idx * (first + gap), behavior: "smooth" });
      setActiveDot(idx);
    });
  });

  // ===== Filter + Search
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
    cats.forEach((c) => c.classList.toggle("is-active", normalize(c.dataset.cat) === activeCategory));
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

  cats.forEach((c) => {
    c.addEventListener("click", () => {
      setActiveCategory(c.dataset.cat || "all");
      applyFilters();
      $("#layanan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  chips.forEach((ch) => {
    ch.addEventListener("click", () => {
      setActiveCategory(ch.dataset.filter || "all");
      applyFilters();
    });
  });

  btnSearch?.addEventListener("click", applyFilters);
  searchInput?.addEventListener("input", applyFilters);
  citySelect?.addEventListener("change", applyFilters);

  // Demo booking buttons
  $$("[data-demo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const msg = btn.getAttribute("data-demo") || "Booking (demo)";
      console.log("BOOKING_DEMO:", msg);
      showToast(`${msg} — cek console`);
    });
  });

  // init
  setActiveCategory("all");
  applyFilters();

  $("#btnLogin")?.addEventListener("click", () => showToast("Login/daftar (demo)."));
})();
