const WebSocket = require("ws");
const http = require("http");
const chatController = require('./src/controllers/chatController');

const server = http.createServer((req, res) => {
    // Handle any HTTP requests here if needed
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    // Handle new WebSocket connections here

    ws.on("message", (message) => {
        if (typeof message === "string") {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        } else if (message instanceof Buffer) {
            const messageString = message.toString();
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(messageString);
                }
            });
            const messageis = JSON.parse(message);
            chatController.sendMessage(messageis);
        }
    });
});

server.listen(8086, () => {
    console.log("WebSocket server is running on port 8086");
});
