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
const serviceTableBody = document.querySelector('#serviceTable tbody');
const noDataMessage = document.getElementById('noDataMessage');
const pdfDownloadContainer = document.getElementById('pdfDownloadContainer');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

hideSpinner()

submitBtn.addEventListener('click', () => {
    const startDate = startDatePicker.value;
    const endDate = endDatePicker.value;
    
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    fetchData(startDate, endDate);
});

function showSpinner() {
    const spinner = document.getElementById("spinnerContainer");
    spinner.style.display = "flex";
}

function hideSpinner() {
    const spinner = document.getElementById("spinnerContainer");
    spinner.style = "display:none !important";
}

// Fetch Data from Firebase
function fetchData(startDate, endDate) {
    showSpinner();
    const path = `/train-monitoring`;

    database.ref(path)
        .orderByKey().startAt(startDate).endAt(endDate)
        .once("value", snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                processData(data);
            } else {
                showNoDataMessage();
                hideSpinner();
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function processData(data) {
    hideSpinner();

    const totals = {
        IA: 0,
        IC: 0,
        IC0: 0,
        TI: 0,
        services: {
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
        }
    };

    Object.keys(data).forEach(dateKey => {
        const dateData = data[dateKey];

        Object.keys(dateData).forEach(trainType => {
            const trainData = dateData[trainType];

            trainData.forEach(coach => {
                totals.IA += parseInt(coach.IA) || 0;
                totals.IC += parseInt(coach.IC) || 0;
                totals.IC0 += parseInt(coach.IC0) || 0;
                totals.TI += parseInt(coach.TI) || 0;

                totals.services["Brake Ringing"] += parseInt(coach.b) || 0;
                totals.services["Blue Coat"] += parseInt(coach.c) || 0;
                totals.services["Dash Pot"] += parseInt(coach.d) || 0;
                totals.services["Fan"] += parseInt(coach.e) || 0;
                totals.services["Tubelight"] += parseInt(coach.f) || 0;
                totals.services["Switch"] += parseInt(coach.g) || 0;
                totals.services["Blowing"] += parseInt(coach.h) || 0;
                totals.services["Seat"] += parseInt(coach.i) || 0;
                totals.services["Insulator"] += parseInt(coach.j) || 0;
                totals.services["Draining"] += parseInt(coach.k) || 0;
                totals.services["Battery"] += parseInt(coach.l) || 0;
            });
        });
    });

    updateTable(totals);
}

// Update the Table Dynamically
function updateTable(totals) {
    var hex = document.querySelector("#tableContainer");
    hex.style.display="block";
    serviceTableBody.innerHTML = "";

    const serviceCategories = Object.keys(totals.services);

    // Existing Service Categories
    serviceCategories.forEach(service => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${service}</td>
            <td>${totals.services[service]}</td>
        `;
        serviceTableBody.appendChild(row);
    console.log(serviceTableBody)

    });

    // Adding new rows for IA, IC, IC0, TI
    const sections = ["IA", "IC", "IC0", "TI"];
    sections.forEach(section => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${section}</strong></td>
            <td>${totals[section]}</td>
        `;
        serviceTableBody.appendChild(row);
    });

    pdfDownloadContainer.style.display = 'block';
}

// No Data Handling
function showNoDataMessage() {
    noDataMessage.style.display = 'block';
}

downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Memo Shed Jhajha", 105, 20, { align: "center" });

    const startDate = startDatePicker.value;
    const endDate = endDatePicker.value;
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} - ${endDate}`, 105, 30, { align: "center" });

    doc.autoTable({
        html: "#serviceTable",
        startY: 40,
        theme: "striped",
        headStyles: {
            fillColor: [0, 51, 102],
            textColor: [255, 255, 255],
          },
    });

    doc.save(`${startDate}_${endDate}_Memo_Shed_Report.pdf`);
});
