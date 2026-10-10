const sesi = SittaAuth.wajibMasuk();

if (sesi) {
  SittaSidebar.pasang();

  const jam = new Date().getHours();

  const sapaan =
    jam >= 5 && jam < 11
      ? "Selamat pagi"
      : jam >= 11 && jam < 15
        ? "Selamat siang"
        : jam >= 15 && jam < 18
          ? "Selamat sore"
          : "Selamat malam";

  document.querySelector("#greeting").textContent = `${sapaan}, ${sesi.nama}`;
  document.querySelector("#userChip").textContent = `${sesi.role} - ${sesi.lokasi}`;
  document.querySelector("#loginTime").textContent = `Masuk pada ${sesi.masukPada}`;

  SittaProfile.pasang(sesi);

  const totalStok = dataBahanAjar.reduce((jumlah, item) => jumlah + item.stok, 0);
  const daftarDO = Object.values(dataTracking);
  const selesai = daftarDO.filter((item) => item.progress === 100).length;

  document.querySelector("#statBahan").textContent = dataBahanAjar.length;
  document.querySelector("#statStok").textContent = totalStok;
  document.querySelector("#statDO").textContent = daftarDO.length;
  document.querySelector("#statSelesai").textContent = `${selesai}/${daftarDO.length}`;

  const renderDO = () =>
    daftarDO
      .map(
        (item) => `
      <li>
        <strong>${item.nomorDO}</strong>
        <span class="muted">${item.nama} - ${item.ekspedisi}</span>
        <span class="status ${item.progress === 100 ? "status-done" : "status-progress"}">${item.status}</span>
      </li>`
      )
      .join("");

  const renderLaporanDO = () =>
    daftarDO
      .map(
        (item) => `
      <tr>
        <td>${item.nomorDO}</td>
        <td>${item.nama}</td>
        <td>${item.ekspedisi}</td>
        <td class="progress-cell">
          <div class="progress" role="progressbar" aria-valuenow="${item.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ${item.nomorDO}">
            <span style="width:${item.progress}%"></span>
          </div>
          <small class="muted">${item.progress}%</small>
        </td>
        <td>${item.status}</td>
      </tr>`
      )
      .join("");

  const renderRekap = () =>
    dataBahanAjar
      .map(
        (item) => `
      <tr>
        <td>${item.kodeBarang}</td>
        <td>${item.namaBarang}</td>
        <td>${item.kodeLokasi}</td>
        <td>${item.jenisBarang}</td>
        <td>Edisi ${item.edisi}</td>
        <td>${item.stok}</td>
      </tr>`
      )
      .join("");

  const renderTransaksi = () =>
    dataTransaksi
      .map(
        (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.tanggal}</td>
        <td>${item.nomorDO}</td>
        <td>${item.penerima}</td>
        <td>${item.lokasi}</td>
        <td>${item.jumlah}</td>
        <td>${item.total}</td>
        <td><span class="status ${item.status === "Selesai" ? "status-done" : "status-progress"}">${item.status}</span></td>
      </tr>`
      )
      .join("");

  SittaUI.denganSkeleton(document.querySelector("#reportDO"), 5, () => renderLaporanDO(), {
    jedaSkeleton: 300,
    baris: 2
  });

  SittaUI.denganSkeleton(document.querySelector("#reportRekap"), 6, () => renderRekap(), {
    jedaSkeleton: 260,
    baris: 3
  });

  SittaUI.denganSkeleton(document.querySelector("#transaksiBody"), 8, () => renderTransaksi(), {
    jedaSkeleton: 240,
    baris: 2
  });

  (async () => {
    const target = document.querySelector("#recentDO");
    const sementara = document.createElement("li");
    sementara.className = "loading-block";
    sementara.innerHTML =
      '<span class="spinner spinner-lg" aria-hidden="true"></span> Memuat daftar delivery order...';
    target.replaceChildren(sementara);

    await SittaUI.denganLoading(async () => {
      await SittaUI.jeda(220);
      const wadah = document.createElement("div");
      wadah.innerHTML = renderDO();
      target.replaceChildren(...wadah.childNodes);
    }, { minimum: 260 });

    target.classList.add("fade-in");
  })();

  document.querySelector("#reportFilter").addEventListener("change", async (event) => {
    const hanyaSelesai = event.target.value === "selesai";

    await SittaUI.denganLoading(
      async () => {
        document.querySelectorAll("#reportDO tr").forEach((baris) => {
          const status = baris.lastElementChild.textContent.trim();
          baris.hidden = hanyaSelesai ? status !== "Selesai" : false;
        });
      },
      { minimum: 180 }
    );
  });

  document.querySelector("#cariTransaksi").addEventListener("input", (event) => {
    const kata = event.target.value.toLowerCase();
    document.querySelectorAll("#transaksiBody tr").forEach((baris) => {
      baris.hidden = !baris.textContent.toLowerCase().includes(kata);
    });
  });
}