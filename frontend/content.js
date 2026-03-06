function extractAmazonProductData() {
  const titleEl = document.getElementById("productTitle");
  const priceEl = document.querySelector(".a-price-whole");
  const reviewEls = document.querySelectorAll(".review-text-content");

  const productTitle = titleEl ? titleEl.textContent.trim() : "";
  const price = priceEl ? priceEl.textContent.trim() : "";

  const reviews = Array.from(reviewEls)
    .map((el) => el.textContent.trim())
    .filter(Boolean);

  return {
    product_title: productTitle,
    price,
    reviews_text: reviews.join(" "),
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "EXTRACT_PRODUCT_DATA") {
    const data = extractAmazonProductData();
    sendResponse({ success: true, data });
    return true;
  }

  sendResponse({ success: false, error: "Unsupported message type." });
  return true;
});
