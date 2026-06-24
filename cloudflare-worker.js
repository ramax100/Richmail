export default {
  async email(message, env, ctx) {
    // GANTI URL DENGAN URL RENDER ANDA
    var url = "https://NAMA-APP-ANDA.onrender.com/webhook/email";
    // GANTI SECRET SAMA DENGAN WEBHOOK_SECRET DI RENDER
    var secret = "GANTI-DENGAN-WEBHOOK-SECRET-ANDA";
    var subject = message.headers.get("subject") || "No Subject";
    var from = message.from || "unknown";
    var to = message.to || "unknown";
    var date = message.headers.get("date") || new Date().toISOString();
    var contentType = message.headers.get("content-type") || "";
    var raw = await new Response(message.raw).text();
    var body = "";
    var html = "";
    var idx = raw.indexOf("\r\n\r\n");
    if (idx === -1) {
      idx = raw.indexOf("\n\n");
    }
    if (idx > -1) {
      var content = raw.substring(idx + 4);
      if (contentType.indexOf("multipart") > -1) {
        var boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/);
        if (boundaryMatch) {
          var boundary = boundaryMatch[1];
          var parts = content.split("--" + boundary);
          for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part.indexOf("text/plain") > -1) {
              var partBody = part.indexOf("\r\n\r\n");
              if (partBody === -1) partBody = part.indexOf("\n\n");
              if (partBody > -1) {
                body = part.substring(partBody + 4).trim();
                body = body.replace(/--$/, "").trim();
              }
            } else if (part.indexOf("text/html") > -1) {
              var partHtml = part.indexOf("\r\n\r\n");
              if (partHtml === -1) partHtml = part.indexOf("\n\n");
              if (partHtml > -1) {
                html = part.substring(partHtml + 4).trim();
                html = html.replace(/--$/, "").trim();
              }
            }
          }
        }
      } else if (contentType.indexOf("text/html") > -1) {
        html = content.trim();
        body = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      } else {
        body = content.trim();
      }
    }
    if (!body && html) {
      body = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret
      },
      body: JSON.stringify({
        from: from,
        to: to,
        subject: subject,
        text: body,
        html: html,
        date: date
      })
    });
  }
}
