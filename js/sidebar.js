const SittaSidebar = (() => {
  const KUNCI = "sitta.sidebar";
  const PARAM = "sidebar";
  const AKTIF = "sidebar-collapsed";

  const backing = (() => {
    const uji = "__sitta_sidebar_uji__";
    const kandidat = [
      () => window.localStorage,
      () => window.sessionStorage
    ];
    for (const ambil of kandidat) {
      try {
        const storage = ambil();
        if (!storage || typeof storage.setItem !== "function") continue;
        storage.setItem(uji, "1");
        storage.removeItem(uji);
        return storage;
      } catch (error) {
        continue;
      }
    }
    return null;
  })();

  function baca() {
    try {
      if (!backing) return null;
      const mentah = backing.getItem(KUNCI);
      if (mentah === null) return null;
      return mentah === "1";
    } catch (error) {
      return null;
    }
  }

  function simpan(nilai) {
    try {
      if (backing) backing.setItem(KUNCI, nilai ? "1" : "0");
    } catch (error) {
      return;
    }
  }

  function dariUrl() {
    try {
      const nilai = new URL(window.location.href).searchParams.get(PARAM);
      if (nilai === null) return null;
      return nilai === "1";
    } catch (error) {
      return null;
    }
  }

  function bersihkanUrl() {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has(PARAM)) return;
      url.searchParams.delete(PARAM);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (error) {
      return;
    }
  }

  function tautanDenganParam(dasar, ciut) {
    try {
      const url = new URL(dasar, window.location.href);
      if (url.origin !== window.location.origin) return dasar;
      url.searchParams.set(PARAM, ciut ? "1" : "0");
      return url.pathname.split("/").pop() + url.search + url.hash;
    } catch (error) {
      return dasar;
    }
  }

  /* Keep the sidebar flush to the footer by measuring the real chrome height
     instead of guessing it. Runs on load and whenever the viewport changes. */
  function renggangkanShell() {
    const shell = document.querySelector(".app-shell");
    if (!shell) return;

    // Only the chrome above the shell counts. The footer is deliberately excluded:
    // it already sits below the shell, so subtracting it here would open the very
    // gap we are trying to close.
    let tinggi = 0;
    for (const el of [document.querySelector(".utility-bar"), document.querySelector(".masthead")]) {
      if (el) tinggi += el.getBoundingClientRect().height;
    }

    const akar = document.documentElement;
    const sisa = Math.max(0, window.innerHeight - tinggi);
    akar.style.setProperty("--shell-min-height", `${Math.round(sisa)}px`);
  }

  function pantauRenggang() {
    renggangkanShell();

    let jeda = null;
    const tunda = () => {
      clearTimeout(jeda);
      jeda = setTimeout(renggangkanShell, 120);
    };

    window.addEventListener("resize", tunda);
    window.addEventListener("orientationchange", tunda);

    if (typeof ResizeObserver === "function") {
      const kaki = document.querySelector(".site-footer");
      if (kaki) new ResizeObserver(tunda).observe(kaki);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(renggangkanShell).catch(() => {});
    }

    window.addEventListener("load", renggangkanShell);
  }

  function pasang() {
    const tombol = document.querySelector("#sidebarToggle");
    if (!tombol) return;

    const akar = document.documentElement;
    const teks = tombol.querySelector(".sidebar-toggle-text");
    const nav = tombol.parentElement ? tombol.parentElement.querySelector("nav") : null;

    pantauRenggang();

    const tanamTautan = (ciut) => {
      if (!nav) return;
      for (const tautan of nav.querySelectorAll("a.nav-link")) {
        const dasar = tautan.dataset.hrefAsal || tautan.getAttribute("href") || "";
        tautan.dataset.hrefAsal = dasar;
        if (!dasar || dasar.startsWith("#")) continue;
        tautan.setAttribute("href", tautanDenganParam(dasar, ciut));
      }
    };

    const terapkan = (ciut) => {
      akar.classList.toggle(AKTIF, ciut);
      tombol.setAttribute("aria-expanded", ciut ? "false" : "true");
      tombol.setAttribute("data-hint", ciut ? "Perluas menu" : "Tutup menu");
      if (teks) teks.textContent = ciut ? "Perluas menu" : "Tutup menu";
      tanamTautan(ciut);
    };

    const dariUrlState = dariUrl();
    const awal = dariUrlState === null ? baca() : dariUrlState;
    terapkan(awal === true);

    if (dariUrlState !== null) {
      simpan(dariUrlState);
      bersihkanUrl();
    }

    tombol.addEventListener("click", () => {
      const ciut = !akar.classList.contains(AKTIF);
      terapkan(ciut);
      simpan(ciut);
    });
  }

  return { pasang };
})();