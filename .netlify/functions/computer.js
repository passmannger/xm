export async function handler(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use GET with ?url=" }),
    };
  }

  // Get card data from query param
  const card = event.queryStringParameters.url;

  if (!card) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'url' parameter with card data." }),
    };
  }

  try {
    // Call chkr.cc API
    const response = await fetch("https://api.chkr.cc/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: card }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, card, result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to contact chkr.cc", details: error.message }),
    };
  }
      }
