const sesi = SittaAuth.wajibMasuk();

if (sesi) {
  SittaSidebar.pasang();

  const tableBody = document.querySelector("#stockTableBody");
  const searchInput = document.querySelector("#stockSearch");
  const modal = document.querySelector("#stockModal");
  const form = document.querySelector("#stockForm");

  const BATAS_STOK_RENDAH = 200;

  const OPSI_COVER = [
    { label: "Tanpa cover", value: "" },
    { label: "Pengantar Ilmu Komunikasi", value: "img/pengantar_komunikasi.jpg" },
    { label: "Manajemen Keuangan", value: "img/manajemen_keuangan.jpg" },
    { label: "Kepemimpinan", value: "img/kepemimpinan.jpg" },
    { label: "Mikrobiologi Dasar", value: "img/mikrobiologi.jpg" },
    { label: "Perkembangan Anak Usia Dini", value: "img/paud_perkembangan.jpeg" }
  ];

  document.querySelector("#stockCover").innerHTML = OPSI_COVER.map(
    (opsi) => `<option value="${opsi.value}">${opsi.label}</option>`
  ).join("");

  function selaraskanKode() {
    const kode = document.querySelector("#stockCode").value.trim().toUpperCase();
    if (kode === "") return;
    const bentrok = dataBahanAjar.some((item) => item.kodeBarang === kode);
    document.querySelector("#stockCodeError").textContent = bentrok
      ? "Kode barang sudah dipakai, gunakan kode lain."
      : "";
  }

  function statusStok(jumlah) {
    return jumlah < BATAS_STOK_RENDAH
      ? { kelas: "stock-low", teks: "Stok Rendah" }
      : { kelas: "stock-ok", teks: "Tersedia" };
  }

  function renderStock(filter = "", target = tableBody) {
    const kata = filter.trim().toLowerCase();

    const hasil = dataBahanAjar.filter((item) =>
      `${item.kodeBarang} ${item.kodeLokasi} ${item.namaBarang} ${item.jenisBarang} ${item.edisi}`
        .toLowerCase()
        .includes(kata)
    );

    if (hasil.length === 0) {
      target.replaceChildren();
      const kosong = document.createElement("tr");
      const sel = document.createElement("td");
      sel.className = "empty-cell";
      sel.colSpan = 7;
      sel.textContent = "Data bahan ajar tidak ditemukan.";
      kosong.appendChild(sel);
      target.appendChild(kosong);
      document.querySelector("#stockCount").textContent = "0 data";
      return;
    }

    target.replaceChildren();

    hasil.forEach((item) => {
      const { kelas, teks } = statusStok(item.stok);
      const baris = document.createElement("tr");
      baris.dataset.kode = item.kodeBarang;

      const selCover = document.createElement("img");
      selCover.className = "cover";
      selCover.alt = `Sampul ${item.namaBarang}`;
      selCover.loading = "lazy";
      if (item.cover) {
        selCover.src = item.cover;
      } else {
        selCover.classList.add("cover-empty");
        selCover.textContent = item.kodeBarang;
      }
      selCover.addEventListener("error", () => {
        selCover.classList.add("cover-empty");
        selCover.removeAttribute("src");
        selCover.textContent = item.kodeBarang;
      });

      const selKode = document.createElement("td");
      selKode.className = "kode-cell";
      selKode.textContent = item.kodeBarang;

      const selNama = document.createElement("td");
      selNama.textContent = `${item.namaBarang} (Edisi ${item.edisi})`;

      const selLokasi = document.createElement("td");
      selLokasi.textContent = item.kodeLokasi;

      const selJenis = document.createElement("td");
      selJenis.textContent = item.jenisBarang;

      const selStok = document.createElement("td");
      selStok.className = "stok-cell";
      selStok.textContent = item.stok;

      const selStatus = document.createElement("td");
      selStatus.className = kelas;
      selStatus.textContent = teks;

      const selCoverCell = document.createElement("td");
      selCoverCell.className = "cover-cell";
      selCoverCell.appendChild(selCover);

      baris.append(selCoverCell, selKode, selNama, selLokasi, selJenis, selStok, selStatus);
      target.appendChild(baris);
    });

    document.querySelector("#stockCount").textContent = `${hasil.length} data`;
  }

  function bukaModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.querySelector("#stockCode").focus();
  }

  function tutupModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  SittaUI.denganSkeleton(
    tableBody,
    7,
    () => {
      const wadah = document.createElement("tbody");
      renderStock("", wadah);
      return Array.from(wadah.children);
    },
    { baris: 5, jedaSkeleton: 280, minimum: 420 }
  );

  searchInput.addEventListener("input", (event) => {
    const kata = event.target.value.trim();
    tableBody.classList.add("is-fading");
    setTimeout(() => {
      renderStock(kata);
      tableBody.classList.remove("is-fading");
    }, 160);
  });

  document.querySelector("#addStockButton").addEventListener("click", bukaModal);
  document.querySelector(".modal-close").addEventListener("click", tutupModal);
  document.querySelector("#stockCode").addEventListener("input", selaraskanKode);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) tutupModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") tutupModal();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const kodeLokasi = document.querySelector("#stockLocation").value.trim().toUpperCase();
    const kodeBarang = document.querySelector("#stockCode").value.trim().toUpperCase();
    const namaBarang = document.querySelector("#stockName").value.trim();
    const jenisBarang = document.querySelector("#stockType").value.trim();
    const edisi = document.querySelector("#stockEdition").value.trim();
    const stok = Number(document.querySelector("#stockAmount").value);
    const cover = document.querySelector("#stockCover").value;

    if (kodeLokasi === "" || kodeBarang === "" || namaBarang === "" || jenisBarang === "" || edisi === "") {
      alert("Semua kolom wajib diisi.");
      return;
    }

    if (dataBahanAjar.some((item) => item.kodeBarang === kodeBarang)) {
      alert("Kode barang sudah dipakai, gunakan kode lain.");
      return;
    }

    if (document.querySelector("#stockAmount").value.trim() === "" || Number.isNaN(stok) || stok < 0) {
      alert("Jumlah stok harus berupa angka nol atau lebih.");
      return;
    }

    dataBahanAjar.push({ kodeLokasi, kodeBarang, namaBarang, jenisBarang, edisi, stok, cover });

    await SittaUI.prosesTombol(
      form.querySelector("button[type='submit']"),
      async () => {
        tableBody.classList.add("is-fading");
        await SittaUI.jeda(200);
        renderStock(searchInput.value);
        tableBody.classList.remove("is-fading");
      },
      { pesan: "Menyimpan..." }
    );

    form.reset();
    document.querySelector("#stockCodeError").textContent = "";
    tutupModal();

    SittaUI.sorotBaris(tableBody.querySelector(`tr[data-kode="${kodeBarang}"]`));

    alert(`Bahan ajar ${namaBarang} berhasil ditambahkan ke tabel.`);
  });

  SittaProfile.pasang(sesi);
}