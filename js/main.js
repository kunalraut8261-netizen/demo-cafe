function toggleMenu() {
  const navLinks = document.getElementById("navLinks");

  if (navLinks) {
    navLinks.classList.toggle("active");
  }
}

async function bookTable() {
  const name = document.getElementById("resName").value.trim();
  const email = document.getElementById("resEmail").value.trim();
  const phone = document.getElementById("resPhone").value.trim();
  const date = document.getElementById("resDate").value;
  const time = document.getElementById("resTime").value;
  const guests = document.getElementById("resGuests").value;
  const message = document.getElementById("resMessage").value.trim();

  if (!name || !phone || !date || !time) {
    alert("Please fill name, phone, date and time.");
    return;
  }

  if (name.length > 50) {
    alert("Name too long");
    return;
  }

  if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
    alert("Please enter valid phone number");
    return;
  }

  if (message.length > 500) {
    alert("Message too long");
    return;
  }

  try {
    await window.addDoc(
      window.collection(window.db, "reservations"),
      {
        name,
        email,
        phone,
        date,
        time,
        guests,
        message,
        status: "Pending",
        createdAt: Date.now()
      }
    );

    alert("Reservation request sent successfully!");

    document.getElementById("resName").value = "";
    document.getElementById("resEmail").value = "";
    document.getElementById("resPhone").value = "";
    document.getElementById("resDate").value = "";
    document.getElementById("resTime").value = "";
    document.getElementById("resMessage").value = "";
  } catch (error) {
    console.error(error);
    alert("Booking failed. Check console.");
  }
}