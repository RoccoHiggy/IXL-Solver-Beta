document.getElementById('solveBtn').addEventListener('click', async () => {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, function(dataUrl) {
    fetch("https://your-backend-url.onrender.com/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: dataUrl })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerText = "Result: " + data.result;
    })
    .catch(err => {
      document.getElementById("result").innerText = "Error: " + err.message;
    });
  });
});