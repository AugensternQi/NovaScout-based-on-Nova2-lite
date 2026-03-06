const summarizeBtn = document.getElementById("summarizeBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const resultEl = document.getElementById("result");

const mockProductData = {
  title: "Sony WH-1000XM5",
  price: "$398",
  reviews:
    "Amazing noise cancellation, but the headband feels a bit fragile after 6 months.",
};

function setLoading(isLoading) {
  loadingSpinner.classList.toggle("hidden", !isLoading);
  loadingSpinner.classList.toggle("flex", isLoading);
  summarizeBtn.disabled = isLoading;
  summarizeBtn.classList.toggle("opacity-60", isLoading);
  summarizeBtn.classList.toggle("cursor-not-allowed", isLoading);
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

function formatResult(text) {
  const safeText = escapeHtml(text || "No response returned.");
  const paragraphs = safeText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "<p>No response returned.</p>";
  }

  return paragraphs.map((line) => `<p class="mb-2">${line}</p>`).join("");
}

async function summarizeMockProduct() {
  setLoading(true);
  resultEl.innerHTML = '<p class="text-slate-500">Waiting for AI response...</p>';

  try {
    const response = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockProductData),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    resultEl.innerHTML = `
      <div class="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          AI Summary
        </p>
        ${formatResult(payload.result)}
      </div>
    `;
  } catch (error) {
    resultEl.innerHTML = `
      <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
        <p class="font-semibold">Could not fetch summary</p>
        <p class="mt-1 text-sm">${escapeHtml(error.message || "Unknown error")}</p>
      </div>
    `;
  } finally {
    setLoading(false);
  }
}

summarizeBtn.addEventListener("click", summarizeMockProduct);
