function generateCC(bin, month, year, cvv, quantity) {
  const cards = [];

  for (let i = 0; i < quantity; i++) {
    // Complete BIN with random digits to reach 15, then add Luhn check digit
    let base = bin;
    while (base.length < 15) {
      base += Math.floor(Math.random() * 10);
    }

    // Add Luhn check digit
    const checkDigit = getLuhnDigit(base);
    const card = base + checkDigit;

    const mm = month || String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const yy = year || String(Math.floor(Math.random() * 4) + 2026); // 2026–2029
    const cv = cvv || String(Math.floor(Math.random() * 900) + 100); // random 3-digit

    cards.push(`${card}|${mm}|${yy}|${cv}`);
  }

  return cards;
}

// Luhn algorithm
function getLuhnDigit(number) {
  let sum = 0;
  let shouldDouble = true;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (10 - (sum % 10)) % 10;
}

export async function handler(event, context) {
  const raw = event.queryStringParameters.url;

  if (!raw) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing url param. Example: 5666/10 or 42377|05|2026|417/10" }),
    };
  }

  try {
    let [info, quantityStr] = raw.split("/");
    const quantity = parseInt(quantityStr) || 10;

    let bin = "", mm = null, yy = null, cvv = null;

    if (info.includes("|")) {
      const parts = info.split("|");
      bin = parts[0];
      mm = parts[1] || null;
      yy = parts[2] || null;
      cvv = parts[3] || null;
    } else {
      bin = info;
    }

    if (bin.length < 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "BIN too short" }),
      };
    }

    const generated = generateCC(bin, mm, yy, cvv, quantity);

    return {
      statusCode: 200,
      body: JSON.stringify({ generated }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
  }
