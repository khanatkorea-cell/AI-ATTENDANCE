const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const markBtn = document.getElementById('markBtn');
const status = document.getElementById('status');

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied or not available.");
  });

// Google Script Web App URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz5GswCmLUI-lgIv6GjQcTHB2yE9INA5__cF971ZPCsvH_KZ1FoXHnUTXOSRvN2VyTg/exec";

markBtn.addEventListener('click', async () => {
  const name = document.getElementById('studentName').value.trim();
  const roll = document.getElementById('rollNumber').value.trim();
  const className = document.getElementById('className').value.trim();

  if (!name || !roll || !className) {
    alert("Please fill in all fields!");
    return;
  }

  // Capture photo
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  // Prepare data
  const data = {
    name: name,
    roll: roll,
    className: className,
    image: imageData
  };

  status.innerText = "Saving attendance...";

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    status.innerText = `✅ Attendance saved for ${name}`;
  } catch (error) {
    status.innerText = "❌ Error saving attendance!";
    console.error(error);
  }
});
