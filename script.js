// ✅ AI Attendance Script (Connected to Google Sheet)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxYwLjV9fbDFb7BtAK89zReV4Lm-rZ1yt1InpbhFpymSqlOWGR2-YAjaCdTFSvPm4Qk/exec";

// Access camera
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const statusText = document.getElementById("status");

// Start camera stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Camera access denied or not available."));

document.getElementById("captureBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const className = document.getElementById("className").value.trim();

  if (!name || !roll || !className) {
    alert("Please fill in all fields before marking attendance.");
    return;
  }

  // Capture photo
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");

  statusText.textContent = "⏳ Saving attendance...";

  // Send to Google Apps Script
  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        roll: roll,
        className: className,
        image: imageData
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.text();
    statusText.textContent = "✅ Attendance saved successfully!";
    console.log(result);
  } catch (error) {
    console.error(error);
    statusText.textContent = "❌ Error saving attendance. Please try again.";
  }

  // Clear fields
  document.getElementById("name").value = "";
  document.getElementById("roll").value = "";
  document.getElementById("className").value = "";
});
