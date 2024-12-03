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
var dayx;
var sum=0;

// DOM Elements
const datePicker = document.getElementById("datePicker");
const fetchDataBtn = document.getElementById("fetchDataBtn");
const tablesContainer = document.getElementById("tablesContainer");
const table12 = document.getElementById("table12").querySelector("tbody");
const table16 = document.getElementById("table16").querySelector("tbody");
const noDataMessage = document.getElementById("noDataMessage");

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
   // Rearrange the format to mm-dd-yy
   if(day>0 && day<=9){
     dayx=day[1];
   }else{
    dayx=day;
   }
   console.log(dayx)
   
   let xyz = `/train-monitoring/${dayx}-${month}-${year}`;
   console.log(xyz);

  database
    .ref(xyz)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data)
        populateTables(data);
      } else {
        displayNoDataMessage();
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function populateTables(data) {
  // Clear previous tables
  clearTable(table12);
  clearTable(table16);

  // Fill data for 12 coaches
  if (data["12"]) {
    data["12"].forEach((coach, index) => {
      addRowToTable(table12, index, coach);
    });
  }

  // Fill data for 16 coaches
  if (data["16"]) {
    data["16"].forEach((coach, index) => {
      addRowToTable(table16, index, coach);
    });
  }

  // Display tables
  tablesContainer.classList.remove("hidden");
  noDataMessage.classList.add("hidden");
}

function addRowToTable(table, coachNumber, coachData) {
   sum= sum+coachData.a;
  console.log(sum)
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${coachNumber}</td>
    <td>${coachData.a || ""}</td>
    <td>${coachData.b || ""}</td>
    <td>${coachData.c || ""}</td>
    <td>${coachData.d || ""}</td>
    <td>${coachData.e || ""}</td>
    <td>${coachData.f || ""}</td>
    <td>${coachData.g || ""}</td>
    <td>${coachData.h || ""}</td>
    <td>${coachData.i || ""}</td>
    <td>${coachData.j || ""}</td>
    <td>${coachData.k || ""}</td>
    <td>${coachData.l || ""}</td>


  `;
  table.appendChild(row);
}

function clearTable(table) {
  table.innerHTML = "";
}

function displayNoDataMessage() {
  tablesContainer.classList.add("hidden");
  noDataMessage.classList.remove("hidden");
}
