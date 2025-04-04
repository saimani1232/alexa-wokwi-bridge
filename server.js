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

// Add device ID mappings for Alexa (lowercase versions)
const deviceMappings = {
  "living room led": "livingRoomLed",
  "kitchen led": "kitchenLed", 
  "lcd display": "lcdDisplay",
  "living room light": "livingRoomLed",
  "kitchen light": "kitchenLed",
  "screen": "lcdDisplay",
  "display": "lcdDisplay"
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

// Get device by ID
app.get('/api/devices/:deviceId', (req, res) => {
  let deviceId = req.params.deviceId;
  
  // Check if the deviceId is a mapped name
  if (deviceMappings[deviceId.toLowerCase()]) {
    deviceId = deviceMappings[deviceId.toLowerCase()];
  }
  
  if (devices[deviceId]) {
    res.json(devices[deviceId]);
  } else {
    res.status(404).json({
      error: 'Device not found',
      availableDevices: Object.keys(devices)
    });
  }
});

// Update device
app.post('/api/devices/:deviceId', (req, res) => {
  let deviceId = req.params.deviceId;
  
  // Check if the deviceId is a mapped name
  if (deviceMappings[deviceId.toLowerCase()]) {
    deviceId = deviceMappings[deviceId.toLowerCase()];
  }
  
  if (devices[deviceId]) {
    // Log the incoming request
    console.log(`Device update request for ${deviceId}:`, req.body);
    
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
    console.log(`Device not found: ${deviceId}`);
    res.status(404).json({
      error: 'Device not found',
      requestedDevice: deviceId,
      availableDevices: Object.keys(devices)
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initialState', devices);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling for the entire app
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// Start server
http.listen(port, () => {
  console.log(`Virtual IoT device server running on port ${port}`);
  console.log('Available devices:', Object.keys(devices));
  console.log('Device name mappings:', deviceMappings);
});
