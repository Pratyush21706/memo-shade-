// Function to update the greeting based on the time of day
function updateGreeting() {
    const currentHour = new Date().getHours();
    let greeting = "Good ";
  
    if (currentHour < 12) {
      greeting += "Morning";
    } else if (currentHour < 18) {
      greeting += "Afternoon";
    } else {
      greeting += "Evening";
    }
  
    document.getElementById("greeting").textContent = greeting+",";
    
  }
  

const carouselItems = document.querySelectorAll('.carousel-item');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');


let currentIndex = 0;

function showCarouselItem(index) {
  carouselItems.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });

  carouselIndicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });
}

function nextCarouselItem() {
  currentIndex = (currentIndex + 1) % carouselItems.length;
  showCarouselItem(currentIndex);
}

setInterval(nextCarouselItem, 3000);

window.onload = () => {
  showCarouselItem(currentIndex);
  updateGreeting();
};


const nameInput = document.getElementById('nameInput');
const loginBtn = document.getElementById('loginBtn');
const departmentButtons = document.querySelectorAll('.btn-group .btn');
let selectedDepartment = null;

// Function to check if both conditions are met
function checkConditions() {
  if (nameInput.value.trim() !== "" && selectedDepartment !== null) {
    loginBtn.disabled = false;
  } else {
    loginBtn.disabled = true;
  }
}

// Event listeners for name input
nameInput.addEventListener('input', checkConditions);

// Event listeners for department buttons
departmentButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Set selected department
    selectedDepartment = this.id.replace('Btn', ''); // Get the department name from button ID
    departmentButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    checkConditions();
  });
});

// Event listener for login button
loginBtn.addEventListener('click', function() {
  // Hide the modal
  const modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
  modal.hide();
  console.log(modal)
  document.getElementById("welcomeModal").style="display:hidden;"

  // Optionally, you can add more logic here (e.g., store data in localStorage, etc.)
  alert('Logged in as: ' + nameInput.value + ', Department: ' + selectedDepartment);
});
