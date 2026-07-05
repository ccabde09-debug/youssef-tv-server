const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

// إنشاء خادم HTTP (مطلوب على Render)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Youssef TV 6 WebSocket Server is running");
});

const wss = new WebSocket.Server({ server });

console.log("Starting WebSocket server...");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({
    type: "AUTH",
    status: "connected"
  }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "MATCH_UPDATE") {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }

    } catch (err) {
      console.error(err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});