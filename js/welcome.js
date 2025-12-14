(() => {
  const $ = (sel) => document.querySelector(sel);

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
    t = setTimeout(() => toast.classList.remove("is-show"), 2400);
  }

  $("#btnSeeFeatures")?.addEventListener("click", () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#btnAbout")?.addEventListener("click", () => {
    showToast("FixHome: solusi kebutuhan tukang (demo landing).");
  });
})();
