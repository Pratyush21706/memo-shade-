// --- script1.js ---
import { saveCoachDataToFirebase } from './backend.js';

// Set default date to today
const datePicker = document.getElementById("date-picker");
const today = new Date();
const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
datePicker.value = formattedDate;

let maxCoaches = 12; // Default to 12 coaches
let currentCoach = 1;
let coachData = [];

// Listen for changes in date picker
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
const coachForm = document.querySelector('.coach-form');
const coachInputs = coachForm.querySelectorAll('input');
const coachNumberSpan = document.getElementById('coach-number');
const nextBtn = document.querySelector('.next-btn');

// Add click event listener to EMU type buttons
emuTypeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!btn.disabled) {
      emuTypeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      maxCoaches = parseInt(btn.dataset.coaches);
      currentCoach = 1;
      updateCoachNumber();
      clearCoachForm();
    }
  });
});

// Event listener for the custom coaches button
document.getElementById("custom-coaches-btn").addEventListener("click", () => {
  const customCoachCount = prompt("Enter the number of coaches:");
  const coachNumber = parseInt(customCoachCount, 10);

  if (isNaN(coachNumber) || coachNumber <= 0) {
    alert("Please enter a valid positive number.");
    return;
  }

  maxCoaches = coachNumber;
  currentCoach = 1;
  coachData = [];
  updateCoachNumber();

  alert(`Custom configuration set for ${coachNumber} coaches.`);
});

// Update the coach number display
function updateCoachNumber() {
  coachNumberSpan.textContent = `(${currentCoach}/${maxCoaches})`;
  if (currentCoach === maxCoaches) {
    nextBtn.textContent = 'Submit to Database';
  } else {
    nextBtn.textContent = 'Next Coach';
  }
}

// Clear the coach form
function clearCoachForm() {
  coachInputs.forEach((input) => {
    input.value = '';
    input.classList.remove('filled');
  });
}

// Save the coach data and move to the next coach
function saveAndNextCoach() {
  const selectedDate = datePicker.value; // Get selected date from the date picker
  const emuType = document.querySelector(".emu-type-btn.active")
    ? document.querySelector(".emu-type-btn.active").dataset.coaches
    : `${maxCoaches} - ${generateUniqueId()}`; // Generate unique ID for custom configurations

  const coachDataEntry = {
    coach: currentCoach,
    a: document.getElementById("a").value,
    b: document.getElementById("b").value,
    c: document.getElementById("c").value,
    d: document.getElementById("d").value,
    e: document.getElementById("e").value,
    f: document.getElementById("f").value,
    g: document.getElementById("g").value,
    h: document.getElementById("h").value,
    i: document.getElementById("i").value,
    j: document.getElementById("j").value,
    k: document.getElementById("k").value,
    l: document.getElementById("l").value,
  };

  coachData.push(coachDataEntry);

  if (currentCoach < maxCoaches) {
    currentCoach++;
    updateCoachNumber();
    clearCoachForm();
  } else {
    showUploadAnimation();
    saveCoachDataToFirebase(coachData, emuType, selectedDate)
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

// Generate a unique ID for custom configurations
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Reset form after upload
function resetFormAfterUpload() {
  const activeButton = document.querySelector(".emu-type-btn.active");
  if (activeButton) {
    activeButton.disabled = true;
    activeButton.classList.remove("active");
  }

  currentCoach = 1;
  updateCoachNumber();
  clearCoachForm();
  coachData = [];
}

// Handle the next/submit button click
nextBtn.addEventListener('click', saveAndNextCoach);

// Add 'filled' class to input fields when they have a value
coachInputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      input.classList.add('filled');
    } else {
      input.classList.remove('filled');
    }
  });
});

const loginBtn = document.getElementById('loginBtn');


// Event listener for login button
loginBtn.addEventListener('click', function() {
  // Hide the modal
  const modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
  modal.hide();
  console.log(modal)
  document.getElementById("welcomeModal").style="display:hidden;"
console.log("hello")
  
});



// --- backend.js ---
