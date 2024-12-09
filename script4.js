// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-Euqpq0HC0IebmfcRmVJz4gTYGlcowYg",
  authDomain: "memo-shade.firebaseapp.com",
  databaseURL: "https://memo-shade-default-rtdb.firebaseio.com",
  projectId: "memo-shade",
  storageBucket: "memo-shade.appspot.com",
  messagingSenderId: "970376470206",
  appId: "1:970376470206:web:b91f57037cebc7e83bc8ef",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let mechanicalType = "Mechanical"; // Default type
// Get the current URL path
const urlPath = window.location.pathname; // This gets the path part of the URL, e.g., "/page1.html"

// Extract the part after the first "/"
const afterdark = urlPath.split('/')[1]; // This gets "page1.html" if the path is "/page1.html"

// Use an if...else if ladder to verify the value
if (afterdark === "page4.html") {
    console.log("This is Page 1");
   mechanicalType = "Mechanical"; // Default type

    // Perform actions for page1.html
} else if (afterdark === "page5.html") {
    console.log("This is Page 2");
   mechanicalType = "Electrical"; // Defaulfdt type

    // afterdark actions for page2.html
} else if (afterdark === "page6.html") {
    console.log("This is Page 3");
   mechanicalType = "Pneumatic"; // Default type

    // Perform actions for page3.html
} else {
    console.log("Unknown page");
    console.log(mechanicalType)
    // Handle unknown cases
}

let texxt = document.getElementById("bitch");
texxt.innerText=` ${mechanicalType} Details `;


// Function to save data to Firebase
function saveCoachDataToFirebase(coachData, emuType, currentDate) {
  const uniqueId = push(ref(database, `train-monitoring`)).key; // Generate a unique ID
  const parentPath = `train-monitoring/${currentDate}/${emuType}-${mechanicalType}-${uniqueId}`;

  // Create numeric child nodes (1, 2, 3, etc.)
  const promises = coachData.map((coach, index) => {
    const engineRef = ref(database, `${parentPath}/${index + 1}`); // 1, 2, 3...
    return set(engineRef, coach);
  });

  return Promise.all(promises);
}

// DOM Elements
const datePicker = document.getElementById("date-picker");
const emuTypeButtons = document.querySelectorAll(".emu-type-btn");
const coachNumberSpan = document.getElementById("coach-number");
const nextBtn = document.querySelector(".next-btn");
const mcNumberInput = document.getElementById("mcNumber");
const otherInput = document.getElementById("otherInput");
const uploadAnimation = document.getElementById("upload-animation");

// IA, IC, ICO, TI Buttons
const tagButtons = document.querySelectorAll(".btn-outline-secondary");

// Global Variables
let maxEngines = 3; // Default number of engines
let currentEngine = 1;
let engineData = [];
let emuType = "12";

// Initialize Date Picker
const today = new Date();
datePicker.value = today.toISOString().split("T")[0];

// Event Listener for EMU Type Selection
emuTypeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    emuTypeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    maxEngines = parseInt(btn.dataset.coaches) === 12 ? 3 : 4; // 12 Coaches = 3 Engines, 16 Coaches = 4 Engines
    currentEngine = 1;
    emuType = `${btn.dataset.coaches}`; // Save only the coach number
    updateEngineNumber();
    clearEngineForm();
  });
});

// Event listener for the custom coaches button
document.getElementById("custom-coaches-btn").addEventListener("click", () => {
    const customCoachModal = document.createElement("div");
    customCoachModal.innerHTML = `
      <div class="custom-coach-modal d-flex justify-content-center  gap-2 mb-3">
        <p class="mb-3">Select the number of coaches:</p>
        <button id="btn-12-coaches" class="btn btn-warning me-2">12</button>
        <button id="btn-16-coaches" class="btn btn-primary me-2">16</button>
      </div>
    `;
  
    document.body.appendChild(customCoachModal);
  
    document.getElementById("btn-12-coaches").addEventListener("click", () => {
      maxEngines = 3;
      currentEngine = 1;
      engineData = [];
      updateEngineNumber();
      alert("Custom configuration set for 12 coaches.");
      document.body.removeChild(customCoachModal);
    });
  
    document.getElementById("btn-16-coaches").addEventListener("click", () => {
      maxEngines = 4;
      currentEngine = 1;
      engineData = [];
      updateEngineNumber();
      alert("Custom configuration set for 16 coaches.");
      document.body.removeChild(customCoachModal);
    });
  });

// Update Engine Number Display
function updateEngineNumber() {
  coachNumberSpan.textContent = `(${currentEngine}/${maxEngines})`;
  nextBtn.textContent = currentEngine === maxEngines ? "Submit to Database" : "Next Engine";
}

// Clear Form Inputs
function clearEngineForm() {
  mcNumberInput.value = "";
  otherInput.value = "";
  tagButtons.forEach((btn) => btn.classList.remove("active"));
}

// Save Data and Move to the Next Engine
function saveAndNextEngine() {
  const selectedDate = datePicker.value;

  // Create an object to track the IA, IC, ICO, TI values
  const tags = {
    IA: 0,
    IC: 0,
    ICO: 0,
    TI: 0,
  };

  // Update the tags object based on active buttons
  tagButtons.forEach((btn) => {
    if (btn.classList.contains("active")) {
      tags[btn.textContent] = 1; // Set 1 for active
    }
  });

  const engineDataEntry = {
    mcNumber: mcNumberInput.value,
    otherInput: otherInput.value,
    ...tags, // Spread the IA, IC, ICO, TI values
  };

  engineData.push(engineDataEntry);

  if (currentEngine < maxEngines) {
    currentEngine++;
    updateEngineNumber();
    clearEngineForm();
  } else {
    showUploadAnimation();
    saveCoachDataToFirebase(engineData, emuType, selectedDate)
      .then(() => {
        alert("Data successfully submitted to Firebase!");
        hideUploadAnimation();
        resetFormAfterSubmission();
      })
      .catch((error) => {
        alert("Error saving data to Firebase: " + error.message);
        hideUploadAnimation();
      });
  }
}

// Show Upload Animation
function showUploadAnimation() {
  uploadAnimation.classList.remove("d-none");
}

// Hide Upload Animation
function hideUploadAnimation() {
  uploadAnimation.classList.add("d-none");
}

// Reset Form After Submission
function resetFormAfterSubmission() {
  const activeButton = document.querySelector(".emu-type-btn.active");
  if (activeButton) {
    activeButton.disabled = true;
    activeButton.classList.remove("active");
  }

  currentEngine = 1;
  engineData = [];
  updateEngineNumber();
  clearEngineForm();
}

// Add Event Listener to Next Button
nextBtn.addEventListener("click", saveAndNextEngine);

// Event Listener for Tag Buttons
tagButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});
