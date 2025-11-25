// === Elements ===
const monthYearDisplay = document.getElementById("month-year") || document.getElementById("month-display");
const calendarDaysGrid = document.getElementById("calendar-days");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const weekdaysContainer = document.querySelector(".weekdays");

// Add weekday labels
if (weekdaysContainer && weekdaysContainer.children.length === 0) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(day => {
    const div = document.createElement("div");
    div.textContent = day;
    weekdaysContainer.appendChild(div);
  });
}

// === Calendar Data ===
let currentDate = new Date();
let events = {}; // { 'YYYY-MM-DD': [ { name, desc } ] }

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// === Render Calendar ===
function renderCalendar() {
  calendarDaysGrid.innerHTML = "";
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  if (monthYearDisplay.tagName === "SPAN") {
    monthYearDisplay.textContent = `${monthNames[month]}`;
    document.getElementById("year-select").value = year;
  } else {
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
  }

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add padding before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty-day");
    calendarDaysGrid.appendChild(emptyDiv);
  }

  // Add all days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add("current-day");
    }

    // Check for events
    const dateKey = `${year}-${month + 1}-${day}`;
    if (events[dateKey]) {
      dayDiv.classList.add("has-event");
    }

    // Click to show events
    dayDiv.addEventListener("click", () => showEventsPopup(dateKey, day, month, year));

    calendarDaysGrid.appendChild(dayDiv);
  }
}

// === Event Popup ===
function showEventsPopup(dateKey, day, month, year) {
  const popup = document.getElementById("eventDetailsPopup");
  const popupTitle = document.getElementById("popupDateTitle");
  const eventList = document.getElementById("eventList");

  popupTitle.textContent = `Events on ${day} ${monthNames[month]} ${year}`;
  eventList.innerHTML = "";

  if (events[dateKey]) {
    events[dateKey].forEach(ev => {
      const li = document.createElement("li");
      li.textContent = `${ev.name}: ${ev.desc}`;
      eventList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No events added yet.";
    eventList.appendChild(li);
  }

  popup.style.display = "flex";
}

// === Navigation ===
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// === Year Dropdown ===
const yearSelect = document.getElementById("year-select");
if (yearSelect) {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    if (y === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }

  yearSelect.addEventListener("change", e => {
    currentDate.setFullYear(parseInt(e.target.value));
    renderCalendar();
  });
}

// === Event Form Integration ===
const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("userName").value.trim();
    const date = document.getElementById("eventDate").value;
    const desc = document.getElementById("eventDescription").value.trim();

    if (!date || !name || !desc) return;

    if (!events[date]) events[date] = [];
    events[date].push({ name, desc });

    alert("Event added successfully!");
    eventForm.reset();
    renderCalendar();
  });
}

// === Styling Enhancement for Highlighted Dates ===
const style = document.createElement("style");
style.innerHTML = `
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    padding: 14px;
  }
  .day, .empty-day {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .day:hover {
    background: linear-gradient(135deg, rgba(155,89,182,0.2), rgba(199,146,44,0.2));
    transform: scale(1.06);
  }
  .current-day {
    border: 2px solid var(--accent2);
    box-shadow: 0 0 10px rgba(199,146,44,0.4);
  }
  .has-event {
    background: rgba(155,89,182,0.15);
    border: 1px solid rgba(155,89,182,0.4);
    box-shadow: 0 0 10px rgba(155,89,182,0.3);
  }
`;
document.head.appendChild(style);

// === Initialize ===
renderCalendar();
