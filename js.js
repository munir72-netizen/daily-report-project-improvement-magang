// ==========================================================
// VARIABEL GLOBAL UNTUK CAROUSEL (DIPERLUKAN UNTUK SLIDER)
// ==========================================================
let currentSlideIndex = 0;
let activeGalleryUrls = [];

// ==========================================================
// FUNGSI INTI CAROUSEL
// ==========================================================

// Fungsi inti untuk menampilkan slide ke-n
function showSlide(n) {
  if (activeGalleryUrls.length === 0) return;

  // Logika Looping: Kembali ke awal atau akhir saat mencapai batas
  if (n >= activeGalleryUrls.length) {
    currentSlideIndex = 0;
  } else if (n < 0) {
    currentSlideIndex = activeGalleryUrls.length - 1;
  } else {
    currentSlideIndex = n;
  }

  const modalImage = document.getElementById("modal-image");
  const modalCounter = document.getElementById("modal-counter");

  if (modalImage && modalCounter) {
    // Atur sumber gambar ke URL saat ini
    modalImage.src = activeGalleryUrls[currentSlideIndex].trim();

    // Perbarui counter (misal: 1/3, 2/3)
    modalCounter.textContent = `${currentSlideIndex + 1}/${
      activeGalleryUrls.length
    }`;
  }
}

// Fungsi untuk maju ke slide berikutnya
function nextSlide() {
  showSlide(currentSlideIndex + 1);
}

// Fungsi untuk mundur ke slide sebelumnya
function prevSlide() {
  showSlide(currentSlideIndex - 1);
}

// ==========================================================
// FUNGSI MODAL & PENGAMBIL DATA (DIPANGGIL DARI ONCLICK)
// ==========================================================

// Fungsi yang dipanggil dari onclick pada card (HARUS DITAMBAHKAN)
function openModalFromCard(cardElement) {
  // 1. Ambil data yang dibutuhkan
  const title = cardElement.querySelector(".card-footer h4").textContent;
  const dept = cardElement.querySelector(".dept-badge").textContent;
  const date = cardElement.querySelector(".date-badge").textContent;

  // 2. Ambil URL Galeri (String) dan konversi ke Array
  const galleryUrlsString = cardElement.getAttribute("data-gallery-urls");
  const galleryUrls = galleryUrlsString ? galleryUrlsString.split(",") : [];

  // 3. Ambil detail
  const detail = cardElement.getAttribute("data-detail");

  // 4. Panggil fungsi modal utama
  openModal(title, galleryUrls, detail, dept, date);
}

// Fungsi openModal direvisi untuk menerima array URL dan menginisialisasi carousel
function openModal(title, galleryUrls, detail, dept, date) {
  // galleryUrls sekarang adalah ARRAY
  const modal = document.getElementById("image-modal");
  const modalCaption = document.getElementById("modal-caption");
  const modalDetail = document.getElementById("modal-detail");
  const modalDept = document.getElementById("modal-dept");
  const modalDate = document.getElementById("modal-date");

  if (modal) {
    modal.style.display = "block";
    modalCaption.textContent = title;

    if (modalDetail) {
      modalDetail.innerHTML = detail;
    }

    if (modalDept) {
      modalDept.textContent = dept;
    }
    if (modalDate) {
      modalDate.textContent = date;
    }

    // KUNCI: INISIALISASI CAROUSEL
    activeGalleryUrls = galleryUrls;
    showSlide(0); // Tampilkan gambar pertama

    // Tampilkan/Sembunyikan tombol navigasi jika hanya ada 1 gambar
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const counter = document.getElementById("modal-counter");

    if (activeGalleryUrls.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      // Hanya sembunyikan counter jika ada elemennya dan gambar hanya 1
      if (counter) counter.style.display = "none";
    } else {
      if (prevBtn) prevBtn.style.display = "block";
      if (nextBtn) nextBtn.style.display = "block";
      if (counter) counter.style.display = "block";
    }
  }
}

// ==========================================================
// FUNGSI DOMContentLoaded (KODE ANDA YANG SUDAH ADA)
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  // -----------------------------------------------------------------
  // A. Fungsionalitas Hamburger Menu (NEW)
  // -----------------------------------------------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      // Toggle class 'open' pada navigasi (digunakan oleh CSS untuk menampilkan/menyembunyikan)
      mainNav.classList.toggle("open");

      // Mengganti ikon (fa-bars <-> fa-times)
      const icon = menuToggle.querySelector("i");
      if (mainNav.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times"); // Ikon silang/tutup
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars"); // Ikon hamburger
      }
    });

    // Opsional: Tutup menu saat link diklik di tampilan mobile
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        // Hanya tutup jika menu sedang terbuka (untuk mobile)
        if (mainNav.classList.contains("open")) {
          menuToggle.click(); // Simulasikan klik tombol toggle
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // B. Fungsionalitas Tab & Card Count (Diresmikan dan dipanggil di sini)
  // -----------------------------------------------------------------
  updateTabCounts(); // Panggil fungsi penghitung saat DOM siap

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Hapus kelas 'active' dari semua tombol dan konten
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Tambahkan kelas 'active' ke tombol yang diklik dan konten yang sesuai
      this.classList.add("active");
      const targetElement = document.getElementById(`tab-${targetTab}`);
      if (targetElement) {
        targetElement.classList.add("active");
      }
    });
  });

  // -----------------------------------------------------------------
  // C. Fungsionalitas Modal (Dirapikan)
  // -----------------------------------------------------------------
  const modal = document.getElementById("image-modal");
  const closeBtn = document.querySelector(".close-btn");

  if (closeBtn) {
    // Tutup modal ketika tombol X diklik
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };
  }

  if (modal) {
    // Tutup modal ketika mengklik di luar modal
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

  // KUNCI REVISI: Tambahkan listeners untuk navigasi carousel di Modal
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
  }

  // -----------------------------------------------------------------
  // D. Penanganan Navigasi Aktif (Opsional, agar tidak ada duplikasi kode)
  // -----------------------------------------------------------------
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    const currentFileName = currentPath.split("/").pop();

    if (currentFileName === linkPath && currentFileName !== "") {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    } else if (
      (currentFileName === "" || currentFileName === "index.html") &&
      linkPath === "halaman.html"
    ) {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
});

// -----------------------------------------------------------------
// E. Fungsi Global (Tetap di luar DOMContentLoaded)
// -----------------------------------------------------------------

// Fungsi Penghitung Card (dipanggil di dalam DOMContentLoaded)
function updateTabCounts() {
  const tabButtons = document.querySelectorAll(".tab-button");

  tabButtons.forEach((button) => {
    const tabName = button.getAttribute("data-tab");
    const tabContent = document.getElementById(`tab-${tabName}`);

    if (tabContent) {
      const cardCount = tabContent.querySelectorAll(".content-card").length;
      const badge = button.querySelector(".badge");
      if (badge) {
        badge.textContent = cardCount;
      }
    }
  });
}
