export async function handler(event, context) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only GET allowed. Use ?url=" }),
    };
  }

  const card = event.queryStringParameters.url;

  if (!card) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'url' parameter" }),
    };
  }

  try {
    const response = await fetch("https://api.chkr.cc/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: card }),
    });

    let result = await response.json();

    // Modify message if it exists
    if (result?.message) {
      result.message = result.message.replace(/\[.*?\]/, "[Made by Maut]");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        card,
        result,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API call failed", details: err.message }),
    };
  }
        }
