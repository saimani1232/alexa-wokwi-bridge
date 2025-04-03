// server.js - Main server for virtual IoT devices
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Use environment variable for port with 3000 as fallback
const port = process.env.PORT || 10000;

// Store virtual device states
const devices = {
  "livingRoomLed": {
    name: "Living Room LED",
    state: "OFF",
    color: "#ffffff",
    brightness: 100,
    type: "LED"
  },
  "kitchenLed": {
    name: "Kitchen LED",
    state: "OFF",
    color: "#ffffff",
    brightness: 100,
    type: "LED"
  },
  "lcdDisplay": {
    name: "LCD Display",
    state: "OFF",
    text: "Hello World",
    backlight: "ON",
    type: "LCD"
  }
};

app.use(bodyParser.json());
app.use(express.static('public'));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoints for device control
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.get('/api/devices/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  if (devices[deviceId]) {
    res.json(devices[deviceId]);
  } else {
    res.status(404).send('Device not found');
  }
});

app.post('/api/devices/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  if (devices[deviceId]) {
    // Update device properties based on request body
    Object.assign(devices[deviceId], req.body);
    
    // Emit the change to all connected clients
    io.emit('deviceUpdate', {
      deviceId: deviceId,
      device: devices[deviceId]
    });
    
    console.log(`Device ${deviceId} updated:`, devices[deviceId]);
    res.json(devices[deviceId]);
  } else {
    res.status(404).send('Device not found');
  }
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initialState', devices);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
http.listen(port, () => {
  console.log(`Virtual IoT device server running on port ${port}`);
});
