document.addEventListener("DOMContentLoaded", () => {
    
    // --- Sticky Navbar Logic ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const form = document.getElementById('medicalForm');
    const qrContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const successMsg = document.getElementById('successMsg');
    let qrcodeInstance = null;

    // --- Form Submit & JSON Generation ---
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Gather Personal Details
        const personalData = {
            name: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            contact: document.getElementById('contactInfo').value,
            address: document.getElementById('address').value
        };

        // 2. Gather Medical Details
        const medicalData = {
            allergies: document.getElementById('allergies').value || "None",
            presentCondition: document.getElementById('presentCondition').value || "N/A",
            medications: document.getElementById('currentMedication').value || "None",
            history: document.getElementById('history').value || "N/A",
            notes: document.getElementById('additionalNotes').value || "N/A"
        };

        // 3. Construct the full JSON object
        const patientRecord = {
            id: "MS-" + Math.floor(Math.random() * 1000000), // Random ID generation
            timestamp: new Date().toISOString(),
            personal: personalData,
            medical: medicalData
        };

        // 4. Convert to String
        const jsonPayload = JSON.stringify(patientRecord);
        
        // Logging to console to verify JSON structure
        console.log("Encoded JSON Payload:", jsonPayload);

        // 5. Generate QR Code
        generateQR(jsonPayload);
    });

    // --- QR Code Generator ---
    function generateQR(dataString) {
        // Clear existing placeholder or QR code
        qrContainer.innerHTML = "";
        qrContainer.style.color = "initial"; // reset color from placeholder

        // Initialize new QRCode
        // We use CorrectLevel L to allow for larger JSON payloads
        qrcodeInstance = new QRCode(qrContainer, {
            text: dataString,
            width: 256,
            height: 256,
            colorDark : "#0f172a", // Dark slate for better contrast
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.L 
        });

        // Enable the download button
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = "1";
        downloadBtn.style.cursor = "pointer";
        
        // Show success message briefly
        successMsg.style.opacity = "1";
        setTimeout(() => { successMsg.style.opacity = "0"; }, 3000);
    }

    // --- Download Logic ---
    window.downloadQR = function() {
        // qrcode.js generates a canvas element containing the code
        const canvas = qrContainer.querySelector('canvas');
        
        if (canvas) {
            const imageUrl = canvas.toDataURL("image/png");
            
            const downloadLink = document.createElement('a');
            downloadLink.href = imageUrl;
            
            // Sanitize name for filename
            const userName = document.getElementById('fullName').value.replace(/\s+/g, '_') || 'Patient';
            downloadLink.download = `MedSecure_${userName}_ID.png`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };
});
