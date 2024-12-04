const firebaseConfig = {
    apiKey: "AIzaSyB-Euqpq0HC0IebmfcRmVJz4gTYGlcowYg",
    authDomain: "memo-shade.firebaseapp.com",
    databaseURL: "https://memo-shade-default-rtdb.firebaseio.com",
    projectId: "memo-shade",
    storageBucket: "memo-shade.appspot.com",
    messagingSenderId: "970376470206",
    appId: "1:970376470206:web:b91f57037cebc7e83bc8ef",
  };


firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const startDatePicker = document.getElementById('startDate');
const endDatePicker = document.getElementById('endDate');
const submitBtn = document.getElementById('submitBtn');
const tableContainer = document.getElementById('tableContainer');
const serviceTableBody = document.querySelector('#serviceTable tbody');
const noDataMessage = document.getElementById('noDataMessage');
const pdfDownloadContainer = document.getElementById('pdfDownloadContainer');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// Submit Button Event
submitBtn.addEventListener('click', () => {
    const startDate = startDatePicker.value;
    const endDate = endDatePicker.value;
    
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    fetchData(startDate, endDate);
});

// Fetch Data from Firebase
function fetchData(startDate, endDate) {
    const path = `/train-monitoring`;
    const formattedStartDate = startDate;
    const formattedEndDate = endDate;

    database.ref(path).orderByKey().startAt(formattedStartDate).endAt(formattedEndDate)
        .once("value", snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                processData(data);
            } else {
                showNoDataMessage();
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Process Data and Populate Table
function processData(data) {
    const totals = {
        "Brake Ringing": 0,
        "Blue Coat": 0,
        "Dash Pot": 0,
        "Fan": 0,
        "Tubelight": 0,
        "Switch": 0,
        "Blowing": 0,
        "Seat": 0,
        "Insulator": 0,
        "Draining": 0,
        "Battery": 0
    };

    Object.keys(data).forEach(dateKey => {
        const dateData = data[dateKey];
        
        // Add up all the work done in each category
        Object.keys(dateData).forEach(trainType => {
            const trainData = dateData[trainType];

            trainData.forEach(coach => {
                totals["Brake Ringing"] += parseInt(coach.b) || 0;
                totals["Blue Coat"] += parseInt(coach.c) || 0;
                totals["Dash Pot"] += parseInt(coach.d) || 0;
                totals["Fan"] += parseInt(coach.e) || 0;
                totals["Tubelight"] += parseInt(coach.f) || 0;
                totals["Switch"] += parseInt(coach.g) || 0;
                totals["Blowing"] += parseInt(coach.h) || 0;
                totals["Seat"] += parseInt(coach.i) || 0;
                totals["Insulator"] += parseInt(coach.j) || 0;
                totals["Draining"] += parseInt(coach.k) || 0;
                totals["Battery"] += parseInt(coach.l) || 0;
            });
        });
    });

    updateTable(totals);
}

// Update the Table
function updateTable(totals) {
    serviceTableBody.innerHTML = "";

    const serviceCategories = [
        "Brake Ringing", "Blue Coat", "Dash Pot", "Fan", "Tubelight",
        "Switch", "Blowing", "Seat", "Insulator", "Draining", "Battery"
    ];

    serviceCategories.forEach(service => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${service}</td>
            <td>${totals[service]}</td>
        `;
        serviceTableBody.appendChild(row);
    });

    tableContainer.style.display = 'block';
    noDataMessage.style.display = 'none';
    pdfDownloadContainer.style.display = 'block';
}

// Show No Data Message
function showNoDataMessage() {
    tableContainer.style.display = 'none';
    noDataMessage.style.display = 'block';
}

// Download PDF Button Event
// Download PDF Button Event
downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;  // Correct way to access jsPDF

    // Create a new PDF instance
    const doc = new jsPDF();

    // Title Page
    doc.setFontSize(18);
    doc.text("Memo Shed Jhajha", 105, 20, { align: "center" });

    // Date Range
    const startDate = startDatePicker.value;
    const endDate = endDatePicker.value;
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} - ${endDate}`, 105, 30, { align: "center" });

    // Table
    doc.autoTable({
        html: '#serviceTable',
        startY: 40,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 51, 102],
            textColor: [255, 255, 255]
        }
    });

    // Save PDF
    doc.save(`${startDate}_to_${endDate}_Memo_Shed_Report.pdf`);
});
