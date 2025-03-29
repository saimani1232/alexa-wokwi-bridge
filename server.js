// Bridge server to connect Alexa to Wokwi via MQTT

// Add near the top of server.js
const PORT = process.env.PORT || 3000;

// Change your app.listen line to:
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MQTT broker details (HiveMQ public broker)
const mqttBroker = 'mqtt://broker.hivemq.com';
const mqttClient = mqtt.connect(mqttBroker);

// Connect to MQTT broker
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to feedback topic
  mqttClient.subscribe('wokwi/feedback', (err) => {
    if (!err) {
      console.log('Subscribed to feedback topic');
    }
  });
});

// Handle MQTT messages
mqttClient.on('message', (topic, message) => {
  console.log(`Received message from ${topic}: ${message.toString()}`);
});

// Error handling for MQTT connection
mqttClient.on('error', (error) => {
  console.error('MQTT connection error:', error);
});

// Alexa to Wokwi bridge endpoint
app.post('/alexa-wokwi-bridge', (req, res) => {
  const { action, device, value } = req.body;
  
  console.log(`Received command: ${action} for device ${device} ${value ? `with value: ${value}` : ''}`);
  
  // Map device names to MQTT topics
  const deviceTopics = {
    'red_led': 'wokwi/control/red_led',
    'blue_led': 'wokwi/control/blue_led',
    'buzzer': 'wokwi/control/buzzer',
    'lcd': 'wokwi/control/lcd'
  };
  
  const topic = deviceTopics[device];
  
  if (!topic) {
    return res.json({
      success: false,
      message: `Unknown device: ${device}`
    });
  }
  
  let message = '';
  
  // Determine message based on action
  switch (action) {
    case 'turnOn':
      message = 'ON';
      break;
    case 'turnOff':
      message = 'OFF';
      break;
    case 'display':
      message = value;
      break;
    default:
      return res.json({
        success: false,
        message: `Unknown action: ${action}`
      });
  }
  
  // Publish message to MQTT topic
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error('Error publishing to MQTT:', err);
      return res.json({
        success: false,
        message: 'Failed to send command'
      });
    }
    
    return res.json({
      success: true,
      message: `Command sent to ${device}`
    });
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    mqttConnected: mqttClient.connected
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bridge server running on port ${PORT}`);
});
