const SittaUI = (() => {
  let bar = null;
  let barTimer = null;

  const jeda = (ms) => new Promise((selesai) => setTimeout(selesai, ms));

  function buatBar() {
    if (bar) return bar;
    bar = document.createElement("div");
    bar.className = "loading-bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", "Memuat halaman");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    document.body.appendChild(bar);
    return bar;
  }

  function mulaiBar() {
    const el = buatBar();
    el.classList.remove("is-done");
    void el.offsetWidth;
    el.classList.add("is-active");
    el.setAttribute("aria-valuenow", "35");
    clearTimeout(barTimer);
    barTimer = setTimeout(() => el.setAttribute("aria-valuenow", "75"), 150);
  }

  function selesaiBar() {
    if (!bar) return;
    clearTimeout(barTimer);
    bar.classList.remove("is-active");
    bar.classList.add("is-done");
    bar.setAttribute("aria-valuenow", "100");
    setTimeout(() => bar.classList.remove("is-done"), 240);
  }

  async function denganLoading(proses, opsi = {}) {
    const minimum = opsi.minimum ?? 320;
    const mulai = Date.now();
    mulaiBar();
    try {
      const hasil = await proses();
      const sisa = minimum - (Date.now() - mulai);
      if (sisa > 0) await jeda(sisa);
      return hasil;
    } finally {
      selesaiBar();
    }
  }

  function kunciTombol(tombol, pesan = "Memproses...") {
    if (!tombol || tombol.dataset.busy === "1") return;
    tombol.dataset.busy = "1";
    tombol.dataset.label = tombol.textContent;
    tombol.disabled = true;
    tombol.setAttribute("aria-busy", "true");

    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.setAttribute("aria-hidden", "true");

    tombol.textContent = "";
    tombol.appendChild(spinner);
    tombol.appendChild(document.createTextNode(" " + pesan));
  }

  function bukaKunci(tombol) {
    if (!tombol || tombol.dataset.busy !== "1") return;
    tombol.textContent = tombol.dataset.label || tombol.textContent;
    delete tombol.dataset.busy;
    delete tombol.dataset.label;
    tombol.disabled = false;
    tombol.removeAttribute("aria-busy");
  }

  async function prosesTombol(tombol, proses, opsi = {}) {
    kunciTombol(tombol, opsi.pesan || "Memproses...");
    try {
      return await denganLoading(proses, opsi);
    } finally {
      bukaKunci(tombol);
    }
  }

  function skeletonBaris(jumlahKolom, jumlahBaris = 3) {
    const frag = document.createElement("tbody");
    for (let b = 0; b < jumlahBaris; b += 1) {
      const tr = document.createElement("tr");
      for (let k = 0; k < jumlahKolom; k += 1) {
        const td = document.createElement("td");
        const placeholder = document.createElement("div");
        placeholder.className = "skeleton skeleton-cell";
        placeholder.style.width = 40 + ((b * 17 + k * 23) % 45) + "%";
        td.appendChild(placeholder);
        tr.appendChild(td);
      }
      frag.appendChild(tr);
    }
    return frag;
  }

  async function denganSkeleton(target, jumlahKolom, render, opsi = {}) {
    if (!target) return;

    const boneka = skeletonBaris(jumlahKolom, opsi.baris || 3);
    target.replaceChildren(...Array.from(boneka.children));

    await denganLoading(async () => {
      await jeda(opsi.jedaSkeleton ?? 240);
      const isi = render();

      if (typeof isi === "string") {
        target.innerHTML = isi;
      } else if (Array.isArray(isi)) {
        target.replaceChildren(...isi);
      } else if (isi) {
        target.replaceChildren(isi);
      }
    }, opsi);

    target.classList.add("fade-in");
  }

  function pindahKe(url, jedaMs = 260) {
    mulaiBar();
    return jeda(jedaMs).then(() => {
      window.location.href = url;
    });
  }

  function sorotBaris(elemen) {
    if (!elemen) return;
    elemen.classList.add("row-flash");
    setTimeout(() => elemen.classList.remove("row-flash"), 1600);
  }

  return {
    jeda,
    mulaiBar,
    selesaiBar,
    denganLoading,
    prosesTombol,
    kunciTombol,
    bukaKunci,
    skeletonBaris,
    denganSkeleton,
    pindahKe,
    sorotBaris
  };
})();