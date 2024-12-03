import { saveCoachDataToFirebase } from './backend.js';

// Get the current date
const today = new Date();
// const [year, month, day] = date.split("-")
const dateString = today.toLocaleDateString().replace(/\//g, '-');
 // Format date as "MM-DD-YYYY"
document.getElementById('dynamic-date').textContent = dateString;

// DOM elements
const emuTypeButtons = document.querySelectorAll('.emu-type-btn');
const coachForm = document.querySelector('.coach-form');
const coachInputs = coachForm.querySelectorAll('input');
const coachNumberSpan = document.getElementById('coach-number');
const nextBtn = document.querySelector('.next-btn');
const feedback = document.getElementById('firebase-feedback');

let currentCoach = 1;
let maxCoaches = 12;
let coachData = [];

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


// Update the coach number display
function updateCoachNumber() {
  coachNumberSpan.textContent = `(${currentCoach}/${maxCoaches})`;
  // Change button text to "Submit to Firebase" if on the last coach
  if (currentCoach === maxCoaches) {
    nextBtn.textContent = 'Submit to Database';
  } else {
    nextBtn.textContent = 'Next Coach'; // Reset button text for other cases
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
  // Collect data from the form
  const coachDataEntry = {
    coach: currentCoach,
    a: document.getElementById('a').value,
    b: document.getElementById('b').value,
    c: document.getElementById('c').value,
    d: document.getElementById('d').value,
    e: document.getElementById('e').value,
    f: document.getElementById('f').value,
    g: document.getElementById('g').value,
    h: document.getElementById('h').value,
    i: document.getElementById('i').value,
    j: document.getElementById('j').value,
    k: document.getElementById('k').value,
    l: document.getElementById('l').value,
  };

  coachData.push(coachDataEntry);

  // Check if it's the last coach
  if (currentCoach < maxCoaches) {
    currentCoach++;
    updateCoachNumber();
    clearCoachForm();
  } else {
    // Submit the data to Firebase
    const emuType = document.querySelector('.emu-type-btn.active').dataset.coaches;
    saveCoachDataToFirebase(coachData, emuType, dateString)
    .then(() => {
      alert('Data successfully submitted!');
      // Disable the active button
      const activeButton = document.querySelector('.emu-type-btn.active');
      activeButton.disabled = true;
      activeButton.classList.remove('active');
  
      // Automatically select the next button (if available)
      const nextButton = document.querySelector(
        `.emu-type-btn[data-coaches="${emuType === '12' ? '16' : '12'}"]`
      );
      if (nextButton && !nextButton.disabled) {
        nextButton.classList.add('active');
        nextButton.disabled = false; // Ensure the next button is enabled
        maxCoaches = parseInt(nextButton.dataset.coaches); // Update the max coaches
      }
  
      // Reset for the next set of coaches
      currentCoach = 1;
      updateCoachNumber();
      clearCoachForm();
      coachData = [];
  
      // Check if both 12-coach and 16-coach buttons are disabled
      const allDisabled = Array.from(emuTypeButtons).every((btn) => btn.disabled);
      if (allDisabled) {
        alert('All data submitted! Redirecting...');
        window.location.href = 'index.html'; // Redirect to index.html
      }
    })
    .catch((error) => {
      alert('Error saving data: ' + error.message);
    });
  
  }
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

