// Updated client script — paste into your GitHub repo (script.js)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxYwLjV9fbDFb7BtAK89zReV4Lm-rZ1yt1InpbhFpymSqlOWGR2-YAjaCdTFSvPm4Qk/exec";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const statusText = document.getElementById("status");

// start camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
  .then(stream => { video.srcObject = stream; })
  .catch(err => {
    alert("Camera access denied or not available. Error: " + err);
    console.error(err);
  });

document.getElementById("captureBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const className = document.getElementById("className").value.trim();

  if (!name || !roll || !className) {
    alert("Please fill in Name, Roll and Class.");
    return;
  }

  // Resize to reduce payload (helps avoid "payload too large")
  const desiredWidth = 640; // smaller = smaller upload
  const vw = video.videoWidth || 640;
  const vh = video.videoHeight || 480;
  const scale = desiredWidth / vw;
  canvas.width = desiredWidth;
  canvas.height = Math.round(vh * scale);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Use JPEG with quality to reduce size
  const imageData = canvas.toDataURL("image/jpeg", 0.6);

  statusText.textContent = "⏳ Sending attendance...";

  const payload = {
    name: name,
    roll: roll,
    className: className,
    image: imageData
  };

  try {
    // NOTE: do NOT set Content-Type header (avoids triggering a CORS preflight)
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(payload)
      // no headers
    });

    // response may be opaque if CORS issues exist; try to read text
    let text = "No readable response (possible CORS response).";
    try { text = await response.text(); } catch (err) { /* ignore */ }

    console.log("Server reply:", response, text);

    // If response.ok is true, treat as saved; if opaque or unknown, still give success message but check sheet
    if (response && (response.ok || response.type === "opaque" || response.status === 0)) {
      statusText.textContent = "✅ Attendance sent — check Google Sheet (refresh).";
    } else {
      statusText.textContent = "❌ Something went wrong. See console and Apps Script logs.";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    statusText.textContent = "❌ Network error: " + err.message;
  }

  // Clear fields
  document.getElementById("name").value = "";
  document.getElementById("roll").value = "";
  document.getElementById("className").value = "";
});
