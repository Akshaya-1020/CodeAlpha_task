// Utility: Get and Save Bookings from localStorage
function getBookings() {
  return JSON.parse(localStorage.getItem("hotelBookings")) || [];
}

function saveBookings(bookings) {
  localStorage.setItem("hotelBookings", JSON.stringify(bookings));
}

// Booking Submission Handler (for book.html)
function handleBookingSubmit() {
  const name = document.getElementById("guestName").value.trim();
  const roomType = document.getElementById("roomType").value;
  const payment = document.getElementById("paymentMethod").value;
  const checkin = document.getElementById("checkinDate").value;
  const checkout = document.getElementById("checkoutDate").value;

  if (!name || !checkin || !checkout) {
    alert("Please fill all the fields.");
    return;
  }

  const newBooking = { name, roomType, payment, checkin, checkout };
  const bookings = getBookings();
  bookings.push(newBooking);
  saveBookings(bookings);

  alert("Booking successful!");
  document.getElementById("bookingForm").reset();
  renderMyBookings();
}

// My Bookings Page (mybookings.html)
function renderMyBookings() {
  const list = document.getElementById("bookingTableBody");
  if (!list) return;

  const bookings = getBookings();
  list.innerHTML = "";

  bookings.forEach((b, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${b.name}</td>
      <td>${b.roomType}</td>
      <td>${b.payment}</td>
      <td>${b.checkin} to ${b.checkout}</td>
      <td><button onclick="cancelBooking(${index})" class="cancel-btn">Cancel</button></td>
    `;
    list.appendChild(row);
  });
}

function cancelBooking(index) {
  if (confirm("Are you sure you want to cancel this booking?")) {
    const bookings = getBookings();
    bookings.splice(index, 1);
    saveBookings(bookings);
    renderMyBookings();
  }
}

// Admin Dashboard (dashboard.html)
function renderDashboard() {
  const stats = document.getElementById("dashboardStats");
  if (!stats) return;

  const bookings = getBookings();
  const total = bookings.length;
  const byType = { Standard: 0, Deluxe: 0, Suite: 0 };

  bookings.forEach(b => {
    if (byType[b.roomType] !== undefined) {
      byType[b.roomType]++;
    }
  });

  stats.innerHTML = `
    <p>Total Bookings: <strong>${total}</strong></p>
    <p>Standard Rooms: ${byType.Standard}</p>
    <p>Deluxe Rooms: ${byType.Deluxe}</p>
    <p>Suites: ${byType.Suite}</p>
  `;
}

// Auto-init for pages
document.addEventListener("DOMContentLoaded", () => {
  renderMyBookings();
  renderDashboard();

  const bookForm = document.getElementById("bookingForm");
  if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleBookingSubmit();
    });
  }
});
