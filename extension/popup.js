document.getElementById("scrapeButton").addEventListener("click", () => {
  // Send the function to the active tab and execute it
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: scrapeProductData, // Pass the function itself
    });
  });
});

// Define the scrapeProductData function directly in popup.js
function scrapeProductData() {
  const products = document.querySelectorAll('div[id$="-item-grid-row"]');
  let productData = [];

  products.forEach((product) => {
    const sku = product.id.split("-")[0];
    const imgSrc = product.querySelector("img").src;
    const title = product.querySelector("a span").textContent.trim();
    const linkElement = product.querySelector("a");
    const link = linkElement.href;

    const newProduct = {
      sku,
      imgSrc,
      title,
      link,
    };

    const weight = product.querySelector(
      "span[id$='-item-priced-by-quantity']"
    );
    const weightNextSibling = weight?.nextElementSibling;
    const pricePerUnitData = extractPricePerUnit(
      weightNextSibling?.textContent?.trim() || ""
    );

    if (pricePerUnitData) {
      newProduct.price = pricePerUnitData.pricePerUnit;
      newProduct.unit = pricePerUnitData.unit;
    } else {
      const priceElement = product.querySelector(
        "span[id$='-item-total-price']"
      );
      const quantityElement = product.querySelector(
        ".a-column.a-span1.a-text-center"
      );
      if (quantityElement && priceElement) {
        const quantity = parseInt(quantityElement.textContent.trim());
        const price = extractPriceFromText(priceElement.textContent.trim());
        newProduct.price = parseFloat((price / quantity).toFixed(2));
      }
    }

    // const pricePerLb = product.querySelector('.a-size-small.a-color-tertiary').textContent.trim();
    // const totalPrice = product.querySelector('#' + product.id + '-item-total-price').textContent.trim();
    // const adjustedWeight = product.querySelector('.ufpo-item-status span').textContent.trim();

    productData.push(newProduct);
  });

  console.log(productData); // For debugging, see the scraped data in the console

  // Optional: Trigger a download of the scraped data as a JSON file
  // const jsonData = JSON.stringify(productData, null, 2);
  // const blob = new Blob([jsonData], { type: 'application/json' });
  // const link = document.createElement('a');
  // link.href = URL.createObjectURL(blob);
  // link.download = 'products.json';
  // link.click();

  function extractPricePerUnit(text) {
    // Use a regular expression to match the price and the unit
    const match = text.match(/\((\$?(\d+(\.\d+)?))\/([^)]+)\)/);

    if (match) {
      // Parse the matched price string into a float
      const pricePerUnit = parseFloat(match[2]);
      // Extract the unit (everything between '/' and ')')
      const unit = match[4];

      return { pricePerUnit, unit };
    }
  }

  function extractPriceFromText(text) {
    if (!text) return;
    return parseFloat(text.replace("$", ""));
  }
}
