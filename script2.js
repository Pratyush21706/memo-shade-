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
var xyz;var  deleteBtn;
// DOM Elements
const datePicker = document.getElementById("datePicker");
const fetchDataBtn = document.getElementById("fetchDataBtn");
const tablesContainer = document.getElementById("tablesContainer");
const trainTables = document.getElementById("trainTables") || document.createElement("div");
const noDataMessage = document.getElementById("noDataMessage");
const generatePDFBtn = document.getElementById("generatePDF");

function showSpinner() {
  const spinner = document.getElementById("spinnerContainer");
  spinner.style.display = "flex"; // Make spinner visible
}

function hideSpinner() {
  const spinner = document.getElementById("spinnerContainer");
  spinner.style = "display:none !important"; // Hide spinner
}

window.onload = () => {
  hideSpinner();
};

// Fetch data on button click
fetchDataBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  if (!selectedDate) {
    alert("Please select a date.");
    return;
  }

  fetchDataForDate(selectedDate);
  showSpinner();
});

function fetchDataForDate(date) {
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
  hideSpinner();
  trainTables.innerHTML = "";

  Object.keys(data).forEach((trainType) => {
    xyz= trainType
    createTable(trainType.slice(0, 2), data[trainType], date);
  });

  tablesContainer.classList.remove("hidden");
  noDataMessage.classList.add("hidden");
}

function createTable(trainType, trainData, date) {
  const sanitizedTrainType = trainType.replace(/[^a-zA-Z0-9]/g, "");
  const tableId = `table${sanitizedTrainType}`;

  const tableDiv = document.createElement("div");
  tableDiv.innerHTML = `
    <center>
      <h2 class="text-heading-table">
        ${trainType} Coaches Data
        <button class="btn btn-danger btn-sm delete-table-btn" style="margin-left: 10px;">
          Delete
        </button>
      </h2>
    </center>
    <p class="hidden-date" style="display:hidden">${date}</p>
    <div class="table-container" style="overflow-x: auto;">
      <table id="${tableId}" class="table table-striped table-hover align-middle text-center">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  trainTables.appendChild(tableDiv);

  deleteBtn = tableDiv.querySelector(".delete-table-btn");  
  deleteBtn.addEventListener("click", () => {
    if (confirm(`Are you sure you want to delete ${trainType} and all its data?`)) {
      // Remove from Firebase
      database
        .ref(`/train-monitoring/${date}/${xyz}`)
        .remove()
        .then(() => {
          alert(`${trainType} successfully deleted.`);
          // Remove from DOM
          trainTables.removeChild(tableDiv);
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
          alert("Failed to delete data. Please try again.");
        });
    }
  });

  const tbody = tableDiv.querySelector("tbody");
  const totals = {
    "Brake Ringing": 0,
    "Blue Coat": 0,
    "Dash Pot": 0,
    Fan: 0,
    Tubelight: 0,
    Switch: 0,
    Blowing: 0,
    Seat: 0,
    Insulator: 0,
    Draining: 0,
    Battery: 0,
  };

  trainData.forEach((coach, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index}</td>
      <td contenteditable="false" class="editable">${coach.a || ""}</td>
      <td contenteditable="false" class="editable">${coach.b || 0}</td>
      <td contenteditable="false" class="editable">${coach.c || 0}</td>
      <td contenteditable="false" class="editable">${coach.d || 0}</td>
      <td contenteditable="false" class="editable">${coach.e || 0}</td>
      <td contenteditable="false" class="editable">${coach.f || 0}</td>
      <td contenteditable="false" class="editable">${coach.g || 0}</td>
      <td contenteditable="false" class="editable">${coach.h || 0}</td>
      <td contenteditable="false" class="editable">${coach.i || 0}</td>
      <td contenteditable="false" class="editable">${coach.j || 0}</td>
      <td contenteditable="false" class="editable">${coach.k || 0}</td>
      <td contenteditable="false" class="editable">${coach.l || 0}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn">Edit</button>
        <button class="btn btn-success btn-sm submit-btn" style="display: none;">Submit</button>
      </td>
    `;
    tbody.appendChild(row);

    // Update totals
    totals["Brake Ringing"] += parseInt(coach.b) || 0;
    totals["Blue Coat"] += parseInt(coach.c) || 0;
    totals["Dash Pot"] += parseInt(coach.d) || 0;
    totals.Fan += parseInt(coach.e) || 0;
    totals.Tubelight += parseInt(coach.f) || 0;
    totals.Switch += parseInt(coach.g) || 0;
    totals.Blowing += parseInt(coach.h) || 0;
    totals.Seat += parseInt(coach.i) || 0;
    totals.Insulator += parseInt(coach.j) || 0;
    totals.Draining += parseInt(coach.k) || 0;
    totals.Battery += parseInt(coach.l) || 0;

    const editBtn = row.querySelector(".edit-btn");
    const submitBtn = row.querySelector(".submit-btn");

    editBtn.addEventListener("click", () => {
      row.querySelectorAll(".editable").forEach((cell) => {
        cell.contentEditable = "true";
        cell.style.backgroundColor = "#fff7e6"; // Highlight editable fields
      });
      editBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
    });

    submitBtn.addEventListener("click", () => {
      const updatedData = {};
      row.querySelectorAll(".editable").forEach((cell, index) => {
        const fieldKeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
        updatedData[fieldKeys[index]] = cell.textContent.trim();
        cell.contentEditable = "false";
        cell.style.backgroundColor = "";
      });
    
      // Update the database
      database
        .ref(`/train-monitoring/${date}/${xyz}/${index}`)
        .set(updatedData)
        .then(() => {
          alert("Data updated successfully.");
    
          // Update totals dynamically
          const newTotals = {
            "Brake Ringing": 0,
            "Blue Coat": 0,
            "Dash Pot": 0,
            Fan: 0,
            Tubelight: 0,
            Switch: 0,
            Blowing: 0,
            Seat: 0,
            Insulator: 0,
            Draining: 0,
            Battery: 0,
          };
    
          // Recalculate totals from the table data
          Array.from(tbody.children).forEach((row, i) => {
            if (i < tbody.children.length - 1) {
              const cells = row.querySelectorAll(".editable");
              newTotals["Brake Ringing"] += parseInt(cells[2]?.textContent || 0);
              newTotals["Blue Coat"] += parseInt(cells[3]?.textContent || 0);
              newTotals["Dash Pot"] += parseInt(cells[4]?.textContent || 0);
              newTotals.Fan += parseInt(cells[5]?.textContent || 0);
              newTotals.Tubelight += parseInt(cells[6]?.textContent || 0);
              newTotals.Switch += parseInt(cells[7]?.textContent || 0);
              newTotals.Blowing += parseInt(cells[8]?.textContent || 0);
              newTotals.Seat += parseInt(cells[9]?.textContent || 0);
              newTotals.Insulator += parseInt(cells[10]?.textContent || 0);
              newTotals.Draining += parseInt(cells[11]?.textContent || 0);
              newTotals.Battery += parseInt(cells[12]?.textContent || 0);
            }
          });
    
          // Update totals row in the table
          const totalsRow = tbody.lastElementChild;
          totalsRow.cells[2].textContent = newTotals["Brake Ringing"];
          totalsRow.cells[3].textContent = newTotals["Blue Coat"];
          totalsRow.cells[4].textContent = newTotals["Dash Pot"];
          totalsRow.cells[5].textContent = newTotals.Fan;
          totalsRow.cells[6].textContent = newTotals.Tubelight;
          totalsRow.cells[7].textContent = newTotals.Switch;
          totalsRow.cells[8].textContent = newTotals.Blowing;
          totalsRow.cells[9].textContent = newTotals.Seat;
          totalsRow.cells[10].textContent = newTotals.Insulator;
          totalsRow.cells[11].textContent = newTotals.Draining;
          totalsRow.cells[12].textContent = newTotals.Battery;
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          alert("Failed to update data. Please try again.");
        });
    
      editBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    });
    
    });
  
    // Add a totals row to the table
    const totalsRow = document.createElement("tr");
    totalsRow.innerHTML = `
      <td colspan="2"><strong>Total</strong></td>
      <td>${totals["Brake Ringing"]}</td>
      <td>${totals["Blue Coat"]}</td>
      <td>${totals["Dash Pot"]}</td>
      <td>${totals.Fan}</td>
      <td>${totals.Tubelight}</td>
      <td>${totals.Switch}</td>
      <td>${totals.Blowing}</td>
      <td>${totals.Seat}</td>
      <td>${totals.Insulator}</td>
      <td>${totals.Draining}</td>
      <td>${totals.Battery}</td>
      <td></td>
    `;
    tbody.appendChild(totalsRow);
    
  }
  
// Clear "No Data" message
function displayNoDataMessage() {
  trainTables.innerHTML = "";
  tablesContainer.classList.add("hidden");
  noDataMessage.classList.remove("hidden");
  hideSpinner();
}

  generatePDFBtn.addEventListener("click", () => {
    deleteBtn.remove();  

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
  
      // Clone table and remove "Actions" and "Delete" button for the PDF
      const cloneTable = table.cloneNode(true);
  
      // Remove "Actions" column
      Array.from(cloneTable.rows).forEach((row) => {
        const actionCellIndex = Array.from(row.cells).findIndex(
          (cell) => cell.textContent.trim() === "Actions"
        );
      
        // Only delete the column if it exists in this row
        if (actionCellIndex !== -1) {
          row.deleteCell(actionCellIndex);
        }
      });
      
  
     // Hide button from the PDF
    

  
      // Add table heading and date
      doc.setFontSize(14);
      doc.text(heading, 130, 25, { align: "center" });
      doc.text(date, 150, 25, { align: "center" });
  
      // Add the table to the PDF
      doc.autoTable({
        html: cloneTable,
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
    doc.save(`${datePicker.value}_Working_Report.pdf`);
  });
  