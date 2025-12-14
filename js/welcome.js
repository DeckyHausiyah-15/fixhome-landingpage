(() => {
  const $ = (s) => document.querySelector(s);

  $("#btnMenu")?.addEventListener("click", () => {
    $("#mobileMenu")?.classList.toggle("is-open");
  });

  // Smooth scroll untuk anchor (Feature/Showcase/About)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      $("#mobileMenu")?.classList.remove("is-open");
    });
  });
})();
