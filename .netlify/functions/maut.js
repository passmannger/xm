const fetch = require("node-fetch");

exports.handler = async (event) => {
  const video_url = event.queryStringParameters.url;

  if (!video_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ?url= parameter" })
    };
  }

  const apiUrl = "https://api.easydownloader.app/api-extract/";

  const payload = {
    video_url,
    pagination: false,
    key: "175p86550h7m5r3dsiesninx194"
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.status !== "success" || !data.final_urls) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to extract video." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal error", detail: e.message })
    };
  }
};
