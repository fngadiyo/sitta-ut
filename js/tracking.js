const sesi = SittaAuth.wajibMasuk();

if (sesi) {
  SittaSidebar.pasang();

  const form = document.querySelector("#trackingForm");
  const result = document.querySelector("#trackingResult");
  const input = document.querySelector("#doNumber");

  const daftarDO = Object.values(dataTracking);

  document.querySelector("#doSuggestions").innerHTML = daftarDO
    .map((item) => `<li><button type="button" class="demo-fill" data-do="${item.nomorDO}">${item.nomorDO} - ${item.nama}</button></li>`)
    .join("");

  document.querySelector("#doSuggestions").addEventListener("click", (event) => {
    const tombol = event.target.closest(".demo-fill");
    if (!tombol) return;
    input.value = tombol.dataset.do;
    form.requestSubmit();
  });

  function buatElemen(tag, kelas, teks) {
    const elemen = document.createElement(tag);
    if (kelas) elemen.className = kelas;
    if (teks !== undefined) elemen.textContent = teks;
    return elemen;
  }

  function cariNomorDO(nomor) {
    const kunci = nomor.trim();
    if (dataTracking[kunci]) return dataTracking[kunci];
    return daftarDO.find((item) => item.nomorDO === kunci) || null;
  }

  function renderMemuat() {
    result.replaceChildren();
    result.classList.remove("hidden");

    const blok = buatElemen("div", "loading-block");
    blok.innerHTML =
      '<span class="spinner spinner-lg" aria-hidden="true"></span> Mencari delivery order...';
    result.appendChild(blok);
  }

  function renderDetail(data) {
    result.replaceChildren();
    result.classList.add("fade-in");

    const header = buatElemen("div", "tracking-header");
    const identitas = buatElemen("div");
    identitas.append(
      buatElemen("p", "eyebrow", "DELIVERY ORDER"),
      buatElemen("h2", null, data.nomorDO)
    );

    const nama = buatElemen("p", "muted", "Nama Mahasiswa: ");
    nama.appendChild(buatElemen("strong", null, data.nama));
    identitas.appendChild(nama);
    header.appendChild(identitas);

    const kelasStatus = data.progress === 100 ? "status-done" : "status-progress";
    header.appendChild(buatElemen("span", `status ${kelasStatus}`, data.status));
    result.appendChild(header);

    const bar = buatElemen("div", "progress");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuenow", String(data.progress));
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-label", `Progress pengiriman ${data.nomorDO}`);
    const isi = buatElemen("span");
    isi.style.width = `${data.progress}%`;
    bar.appendChild(isi);
    result.appendChild(bar);
    result.appendChild(buatElemen("p", "muted", `Progress pengiriman: ${data.progress}%`));

    const detail = buatElemen("div", "detail-grid");
    [
      ["Ekspedisi", data.ekspedisi],
      ["Tanggal Kirim", data.tanggalKirim],
      ["Jenis Paket", `Kode Paket ${data.paket}`],
      ["Total Pembayaran", data.total]
    ].forEach(([label, nilai]) => {
      const kotak = buatElemen("div", "detail");
      kotak.append(buatElemen("small", null, label), buatElemen("strong", null, nilai));
      detail.appendChild(kotak);
    });
    result.appendChild(detail);

    result.appendChild(buatElemen("h3", "subheading", "Riwayat Perjalanan"));

    const daftar = buatElemen("ol", "timeline");
    data.perjalanan.forEach((titik) => {
      const item = buatElemen("li", "timeline-item");
      item.append(
        buatElemen("time", "timeline-time", titik.waktu),
        buatElemen("span", "timeline-text", titik.keterangan)
      );
      daftar.appendChild(item);
    });
    result.appendChild(daftar);
  }

  function renderTidakDitemukan(nomor) {
    result.replaceChildren();
    result.classList.add("fade-in");
    result.append(buatElemen("h2", null, "Data tidak ditemukan"));
    result.appendChild(
      buatElemen("p", "muted", `Nomor Delivery Order "${nomor}" tidak ditemukan pada data simulasi.`)
    );
    result.appendChild(buatElemen("p", "muted", "Gunakan nomor DO yang tersedia pada daftar di atas."));
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nomor = input.value.trim();
    const tombolCari = form.querySelector("button[type='submit']");

    await SittaUI.prosesTombol(tombolCari, async () => {
      renderMemuat();
      await SittaUI.jeda(320);

      const data = nomor === "" ? null : cariNomorDO(nomor);
      if (!data) {
        renderTidakDitemukan(nomor);
        return;
      }

      renderDetail(data);
    });
  });

  SittaProfile.pasang(sesi);
}