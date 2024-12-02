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
  
    document.getElementById("greeting").textContent = greeting;
    
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

setInterval(nextCarouselItem, 5000);

window.onload = () => {
  showCarouselItem(currentIndex);
  updateGreeting();
};



