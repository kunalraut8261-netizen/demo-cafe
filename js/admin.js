import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkAZs7BCjantGossmvdeoEJKAS25eoo4U",
  authDomain: "breeze-ed53c.firebaseapp.com",
  projectId: "breeze-ed53c",
  storageBucket: "breeze-ed53c.firebasestorage.app",
  messagingSenderId: "559457391957",
  appId: "1:559457391957:web:470427f751c34740d8cbdc",
  measurementId: "G-M1Q0FJJFY7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
    return;
  }

  loadMenuItems();
  loadMessages();
  loadGalleryImages();
  loadReservations();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "admin-login.html";
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab-content").forEach((tab) => {
      tab.style.display = "none";
    });

    document.getElementById(btn.dataset.tab).style.display = "block";

    adminSlideMenu.classList.remove("active");
    adminMenuOverlay.classList.remove("active");
  });
});

/* ADMIN SLIDE MENU */

const adminMenuToggle = document.getElementById("adminMenuToggle");
const adminSlideMenu = document.getElementById("adminSlideMenu");
const adminCloseMenu = document.getElementById("adminCloseMenu");
const adminMenuOverlay = document.getElementById("adminMenuOverlay");

adminMenuToggle.addEventListener("click", () => {
  adminSlideMenu.classList.add("active");
  adminMenuOverlay.classList.add("active");
});

adminCloseMenu.addEventListener("click", () => {
  adminSlideMenu.classList.remove("active");
  adminMenuOverlay.classList.remove("active");
});

adminMenuOverlay.addEventListener("click", () => {
  adminSlideMenu.classList.remove("active");
  adminMenuOverlay.classList.remove("active");
});

/* MENU */

document.getElementById("addMenuBtn").addEventListener("click", async () => {
  const name = document.getElementById("itemName").value.trim();
  const price = document.getElementById("itemPrice").value.trim();
  const category = document.getElementById("itemCategory").value.trim();
  const description = document.getElementById("itemDescription").value.trim();

  if (!name || !price || !category || !description) {
    alert("Please fill all fields");
    return;
  }

  await addDoc(collection(db, "menuItems"), {
    name,
    price,
    category,
    description,
    createdAt: Date.now()
  });

  alert("Menu Item Added!");

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemCategory").value = "";
  document.getElementById("itemDescription").value = "";

  loadMenuItems();
});

async function loadMenuItems() {
  const container = document.getElementById("menuItems");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "menuItems"));

  if (snapshot.empty) {
    container.innerHTML = "<p>No menu items yet.</p>";
    return;
  }

  snapshot.forEach((itemDoc) => {
    const item = itemDoc.data();

    container.innerHTML += `
      <div class="review-card">
        <h3>${item.name}</h3>
        <p><strong>${item.price}</strong></p>
        <p>${item.category}</p>
        <p>${item.description}</p>

        <button class="btn delete-menu-btn" data-id="${itemDoc.id}">
          Delete
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".delete-menu-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "menuItems", btn.dataset.id));
      loadMenuItems();
    });
  });
}

/* MESSAGES */

async function loadMessages() {
  const container = document.getElementById("messagesList");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "messages"));

  if (snapshot.empty) {
    container.innerHTML = "<p>No customer messages yet.</p>";
    return;
  }

  snapshot.forEach((messageDoc) => {
    const msg = messageDoc.data();

    container.innerHTML += `
      <div class="review-card">
        <h3>${msg.name || "Customer"}</h3>
        <p><strong>Email:</strong> ${msg.email || "-"}</p>
        <p><strong>Phone:</strong> ${msg.phone || "-"}</p>
        <p>${msg.message || ""}</p>

        <button class="btn delete-message-btn" data-id="${messageDoc.id}">
          Delete
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".delete-message-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "messages", btn.dataset.id));
      loadMessages();
    });
  });
}

/* GALLERY */

document.getElementById("uploadGalleryBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("galleryImageInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  const fileName = Date.now() + "-" + file.name;
  const imageRef = ref(storage, "gallery/" + fileName);

  await uploadBytes(imageRef, file);

  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "galleryImages"), {
    imageUrl,
    filePath: "gallery/" + fileName,
    createdAt: Date.now()
  });

  alert("Image uploaded!");

  fileInput.value = "";
  loadGalleryImages();
});

async function loadGalleryImages() {
  const container = document.getElementById("adminGalleryImages");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "galleryImages"));

  if (snapshot.empty) {
    container.innerHTML = "<p>No gallery images yet.</p>";
    return;
  }

  snapshot.forEach((imageDoc) => {
    const image = imageDoc.data();

    container.innerHTML += `
      <div class="review-card">
        <img src="${image.imageUrl}" style="width:100%; border-radius:15px; margin-bottom:20px;">
        <button class="btn delete-gallery-btn" data-id="${imageDoc.id}" data-path="${image.filePath}">
          Delete
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".delete-gallery-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const imageRef = ref(storage, btn.dataset.path);

      await deleteObject(imageRef);
      await deleteDoc(doc(db, "galleryImages", btn.dataset.id));

      alert("Image deleted!");
      loadGalleryImages();
    });
  });
}

/* RESERVATIONS */

async function loadReservations() {
  const container = document.getElementById("reservationsList");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "reservations"));

  if (snapshot.empty) {
    container.innerHTML = "<p>No reservations yet.</p>";
    return;
  }

  snapshot.forEach((resDoc) => {
    const res = resDoc.data();

    container.innerHTML += `
      <div class="review-card">
        <h3>${res.name}</h3>
        <p><strong>Phone:</strong> ${res.phone}</p>
        <p><strong>Email:</strong> ${res.email || "-"}</p>
        <p><strong>Date:</strong> ${res.date}</p>
        <p><strong>Time:</strong> ${res.time}</p>
        <p><strong>Guests:</strong> ${res.guests}</p>
        <p>${res.message || ""}</p>
        <p><strong>Status:</strong> ${res.status || "Pending"}</p>

        <button class="btn delete-reservation-btn" data-id="${resDoc.id}">
          Delete
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".delete-reservation-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "reservations", btn.dataset.id));
      loadReservations();
    });
  });
}