/**
 * Welcome page controller
 * - "Pesan Sekarang" -> masuk ke index.html (marketplace)
 * - "Pelajari Lebih Lanjut" -> scroll ke section info
 */

const btnOrder = document.getElementById("btnOrder");
const btnLearn = document.getElementById("btnLearn");
const btnGoHome = document.getElementById("btnGoHome");
const yearEl = document.getElementById("year");

const workerImg = document.querySelector(".w-worker");
const workerFallback = document.querySelector(".w-worker-fallback");

init();

function init() {
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // fallback jika gambar tukang tidak ditemukan
  if (workerImg && workerFallback) {
    workerImg.addEventListener("error", () => {
      workerImg.style.display = "none";
      workerFallback.style.opacity = "1";
    });
  }

  btnOrder?.addEventListener("click", () => {
    markSeenWelcome();
    window.location.href = "index.html";
  });

  btnGoHome?.addEventListener("click", () => {
    markSeenWelcome();
    window.location.href = "index.html";
  });

  btnLearn?.addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Google Form modal behavior
  const btnForm = document.getElementById("btnForm");
  const gformModal = document.getElementById("gformModal");
  const gformFrame = document.getElementById("gformFrame");
  const btnCloseForm = document.getElementById("btnCloseForm");
  const gformFallback = document.getElementById("gformFallback");
  let loadTimer = null;
  let iframeLoaded = false;
  const formUrl = "https://forms.gle/cQjoT856Z8YTajBd6";

  function openFormModal() {
    if (!gformModal) return;
    iframeLoaded = false;
    if (gformFrame) {
      gformFrame.hidden = false;
      gformFrame.src = formUrl;
    }
    if (gformFallback) gformFallback.hidden = true;
    gformModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // fallback: show open in new tab if iframe doesn't load (some providers block embedding)
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      if (!iframeLoaded) {
        if (gformFrame) gformFrame.hidden = true;
        if (gformFallback) gformFallback.hidden = false;
      }
    }, 2500);
  }

  function closeFormModal() {
    if (!gformModal) return;
    gformModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearTimeout(loadTimer);
    if (gformFrame) {
      // optional: remove src to stop network
      gformFrame.src = "";
    }
  }

  btnForm?.addEventListener("click", openFormModal);
  btnCloseForm?.addEventListener("click", closeFormModal);
  gformModal?.addEventListener("click", (e) => {
    if (e.target?.matches("[data-close], .gform-modal__backdrop")) closeFormModal();
  });

  gformFrame?.addEventListener("load", () => {
    iframeLoaded = true;
    clearTimeout(loadTimer);
    if (gformFallback) gformFallback.hidden = true;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && gformModal?.getAttribute("aria-hidden") === "false") {
      closeFormModal();
    }
  });
}

function markSeenWelcome() {
  try {
    localStorage.setItem("fixhome_seen_welcome", "1");
  } catch (_) {}
}
