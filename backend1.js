import { saveCoachDataToFirebase } from './backend.js';

// Set default date to today
const datePicker = document.getElementById("date-picker");
const today = new Date();
const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
datePicker.value = formattedDate;

let maxEngines = 3; // Default to 12-coach train (3 engines)
let currentEngine = 1;
let engineData = [];
let emuType = ""; // Store the EMU type (e.g., "12-Coach-EMU")

// Listen for changes in the date picker
datePicker.addEventListener("change", () => {
  const selectedDate = datePicker.value;
  console.log("Selected Date:", selectedDate);
});

const uploadAnimation = document.getElementById("upload-animation");

function showUploadAnimation() {
  uploadAnimation.classList.remove("d-none");
}

function hideUploadAnimation() {
  uploadAnimation.classList.add("d-none");
}

// DOM elements
const emuTypeButtons = document.querySelectorAll('.emu-type-btn');
const engineForm = document.querySelector('.coach-form');
const mcNumberInput = document.getElementById('mcNumber');
const otherInput = document.getElementById('otherInput');
const coachNumberSpan = document.getElementById('coach-number');
const nextBtn = document.querySelector('.next-btn');
const category = "Mechanical"; // Constant category value

// Add click event listener to EMU type buttons
emuTypeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!btn.disabled) {
      emuTypeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const coachCount = parseInt(btn.dataset.coaches);
      maxEngines = coachCount === 12 ? 3 : 4; // Determine engine count based on coaches
      currentEngine = 1;
      emuType = `${coachCount}-Coaches`; // Set EMU type dynamically based on the button
      updateEngineNumber();
      clearEngineForm();
    }
  });
});

// Update the engine number display
function updateEngineNumber() {
  coachNumberSpan.textContent = `(${currentEngine}/${maxEngines})`; // Display engine progress
  if (currentEngine === maxEngines) {
    nextBtn.textContent = 'Submit to Database';
  } else {
    nextBtn.textContent = 'Next Engine';
  }
}

// Clear the engine form
function clearEngineForm() {
  mcNumberInput.value = '';
  otherInput.value = '';
  document.querySelectorAll('.btn-outline-secondary').forEach(btn => btn.classList.remove('active'));
}

// Save the engine data and move to the next engine
function saveAndNextEngine() {
  const selectedDate = datePicker.value; // Get selected date from the date picker
  const selectedTags = Array.from(document.querySelectorAll('.btn-outline-secondary.active')).map(btn => btn.textContent);

  const engineDataEntry = {
    engine: currentEngine, // Save the current engine number
    mcNumber: mcNumberInput.value,
    tags: selectedTags,
    otherInput: otherInput.value,
    category
  };

  engineData.push(engineDataEntry);

  if (currentEngine < maxEngines) {
    currentEngine++;
    updateEngineNumber();
    clearEngineForm();
  } else {
    showUploadAnimation();
    saveDataToFirebase(selectedDate)
      .then(() => {
        alert("Data successfully submitted!");
        hideUploadAnimation();
        resetFormAfterUpload();
      })
      .catch((error) => {
        alert("Error saving data: " + error.message);
        hideUploadAnimation();
      });
  }
}

// Save all data to Firebase
function saveDataToFirebase(selectedDate) {
  const firebaseData = engineData.map((engine) => ({
    ...engine
  }));

  return saveCoachDataToFirebase(firebaseData, emuType, selectedDate);
}

// Reset form after upload
function resetFormAfterUpload() {
  const activeButton = document.querySelector(".emu-type-btn.active");
  if (activeButton) {
    activeButton.disabled = true;
    activeButton.classList.remove("active");
  }

  currentEngine = 1;
  updateEngineNumber();
  clearEngineForm();
  engineData = [];
}

// Handle the next/submit button click
nextBtn.addEventListener('click', saveAndNextEngine);

// Add click listeners to category buttons
document.querySelectorAll('.btn-outline-secondary').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});
