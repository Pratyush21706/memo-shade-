// Get the current date
const today = new Date();
const dateString = today.toLocaleDateString();
document.getElementById('dynamic-date').textContent = dateString;

// Get the EMU type buttons, coach form, and next/submit button
const emuTypeButtons = document.querySelectorAll('.emu-type-btn');
const coachForm = document.querySelector('.coach-form');
const coachInputs = coachForm.querySelectorAll('input');
const coachNumberSpan = document.getElementById('coach-number');
const nextBtn = document.querySelector('.next-btn');

let currentCoach = 1;
let maxCoaches = 12;
let coachData = [];

// Add click event listener to EMU type buttons
emuTypeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    emuTypeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    maxCoaches = parseInt(btn.dataset.coaches);
    currentCoach = 1;
    updateCoachNumber();
    clearCoachForm();
  });
});

// Update the coach number display
function updateCoachNumber() {
  coachNumberSpan.textContent = `(${currentCoach}/${maxCoaches})`;
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
  };

  // Check if the coach data is already present in the array
  const existingIndex = coachData.findIndex((entry) => entry.coach === currentCoach);
  if (existingIndex !== -1) {
    coachData[existingIndex] = coachDataEntry;
  } else {
    coachData.push(coachDataEntry);
  }

  if (currentCoach < maxCoaches) {
    currentCoach++;
    updateCoachNumber();
    clearCoachForm();
  } else {
    // All coaches entered, submit the data
    console.log(coachData)
    alert('Data Successfully Submitted');
    coachData = [];
    nextBtn.textContent = 'Next Coach';
  }
}

// Handle the next/submit button click
nextBtn.addEventListener('click', () => {
  saveAndNextCoach();
});

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