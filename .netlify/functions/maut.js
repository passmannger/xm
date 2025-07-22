const fetch = require("node-fetch");

exports.handler = async (event) => {
  const video_url = event.queryStringParameters.url;

  if (!video_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'url' parameter" })
    };
  }

  try {
    const response = await fetch("https://api.easydownloader.app/api-extract/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        video_url: video_url,
        pagination: false,
        key: "175p86550h7m5r3dsiesninx194"
      })
    });

    const result = await response.json();

    if (
      result.status !== "success" ||
      !result.final_urls ||
      result.final_urls.length === 0 ||
      !result.final_urls[0].links
    ) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Video extraction failed or invalid structure" })
      };
    }

    const video = result.final_urls[0];
    const unique = new Set();

    const links = video.links
      .filter(link => {
        const valid = link.link_url.includes(".mp4") && !link.link_url.includes(".m3u8") && !unique.has(link.link_url);
        if (valid) unique.add(link.link_url);
        return valid;
      })
      .map(link => ({
        quality: link.file_quality,
        url: link.link_url
      }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: video.title,
        thumb: video.thumb,
        links: links
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: err.message })
    };
  }
};
