// Initialize Firebase (ensure this matches your existing configuration)
const firebaseConfig = {
  apiKey: "AIzaSyB-Euqpq0HC0IebmfcRmVJz4gTYGlcowYg",
  authDomain: "memo-shade.firebaseapp.com",
  databaseURL: "https://memo-shade-default-rtdb.firebaseio.com",
  projectId: "memo-shade",
  storageBucket: "memo-shade.appspot.com",
  messagingSenderId: "970376470206",
  appId: "1:970376470206:web:b91f57037cebc7e83bc8ef",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const datePicker = document.getElementById("datePicker");
const fetchDataBtn = document.getElementById("fetchDataBtn");
const tablesContainer = document.getElementById("tablesContainer");
const trainTables = document.getElementById("trainTables") || document.createElement("div");
const noDataMessage = document.getElementById("noDataMessage");
const generatePDFBtn = document.getElementById("generatePDF");

// Fetch data on button click
fetchDataBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  if (!selectedDate) {
    alert("Please select a date.");
    return;
  }

  fetchDataForDate(selectedDate);
});

function fetchDataForDate(date) {
  // Split the date into year, month, and day components
  const [year, month, day] = date.split("-");
  const formattedDate = `${year}-${month}-${day}`;

  const path = `/train-monitoring/${formattedDate}`;
  console.log(`Fetching data from: ${path}`);

  database
    .ref(path)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        populateTables(data, formattedDate);
      } else {
        displayNoDataMessage();
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function populateTables(data, date) {
  // Clear previous tables
  trainTables.innerHTML = "";

  // Generate tables dynamically based on train types
  Object.keys(data).forEach((trainType) => {
    createTable(trainType, data[trainType], date);
  });

  // Display tables and hide "no data" message
  tablesContainer.classList.remove("hidden");
  noDataMessage.classList.add("hidden");
}

function createTable(trainType, trainData, date) {
  // Generate a safe table ID
  const sanitizedTrainType = trainType.replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters
  const tableId = `table${sanitizedTrainType}`;

  // Create table structure
  const tableDiv = document.createElement("div");
  tableDiv.innerHTML = `
    <center><h2 class="text-heading-table">${trainType} Coaches Data</h2></center>
    <p style="display:hidden">${date}</p> <!-- Add the date paragraph here -->
    <table id="${tableId}" class="table table-striped table-hover align-middle text-center table-fixed">
      <thead>
        <tr>
          <th>Coach No.</th>
          <th>MC/TC NO</th>
          <th>Brake Ringing</th>
          <th>Blue Coat</th>
          <th>Dash Pot</th>
          <th>Fan</th>
          <th>Tubelight</th>
          <th>Switch</th>
          <th>Blowing</th>
          <th>Seat</th>
          <th>Insulator</th>
          <th>Draining</th>
          <th>Battery</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  trainTables.appendChild(tableDiv);

  // Populate table rows
  const tbody = tableDiv.querySelector("tbody");
  let totals = Array(11).fill(0); // Exclude MC/TC NO from summation

  trainData.forEach((coach, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td> <!-- Coach number now starts from 1 -->
      <td>${coach.a || ""}</td>
      <td>${coach.b || 0}</td> <!-- Brake Ringing -->
      <td>${coach.c || 0}</td> <!-- Blue Coat -->
      <td>${coach.d || 0}</td> <!-- Dash Pot -->
      <td>${coach.e || 0}</td> <!-- Fan -->
      <td>${coach.f || 0}</td> <!-- Tubelight -->
      <td>${coach.g || 0}</td> <!-- Switch -->
      <td>${coach.h || 0}</td> <!-- Blowing -->
      <td>${coach.i || 0}</td> <!-- Seat -->
      <td>${coach.j || 0}</td> <!-- Insulator -->
      <td>${coach.k || 0}</td> <!-- Draining -->
      <td>${coach.l || 0}</td> <!-- Battery -->
    `;

    tbody.appendChild(row);

    // Update totals (exclude MC/TC NO at index 1)
    totals = totals.map((sum, colIndex) => {
      const valueKey = Object.keys(coach)[colIndex + 2]; // Skip first two columns (Coach No. and MC/TC NO)
      return sum + Number(coach[valueKey] || 0);
    });
  });

  // Add totals row
  const totalsRow = document.createElement("tr");
  totalsRow.innerHTML = `
    <td>Total</td>
    <td></td> <!-- Skip MC/TC NO in totals -->
    ${totals.map((total) => `<td>${total}</td>`).join("")}
  `;
  tbody.appendChild(totalsRow);
}


// Clear "No Data" message
function displayNoDataMessage() {
  trainTables.innerHTML = "";
  tablesContainer.classList.add("hidden");
  noDataMessage.classList.remove("hidden");
}

// Generate PDF
generatePDFBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape" });

  // Add title page
  doc.setFontSize(18);
  doc.text("Memu Shed JHAJHA", 140, 20, { align: "center" });

  const tables = trainTables.children;

  Array.from(tables).forEach((tableDiv, index) => {
    if (index > 0) doc.addPage(); // Add a new page for each subsequent table

    const table = tableDiv.querySelector("table");
    const heading = tableDiv.querySelector("h2").textContent;
    const date = tableDiv.querySelector("p").textContent;

    // Add table heading and date
    doc.setFontSize(14);
    doc.text(heading, 140, 30, { align: "center" });
    doc.text(date, 140, 40, { align: "center" });

    // Add the table to the PDF
    doc.autoTable({
      html: `#${table.id}`,
      startY: 50,
      theme: "striped",
      headStyles: {
        fillColor: [0, 51, 102],
        textColor: [255, 255, 255],
      },
    });
  });

  // Save the PDF
  const today = new Date();
  const formattedDate = today.toDateString();
  doc.save(`${formattedDate}_Working_Report.pdf`);
});
