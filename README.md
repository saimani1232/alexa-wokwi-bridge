# Alexa Virtual Device Bridge

A voice-controlled interface for virtual devices using Amazon Alexa. This project allows a physical Alexa device to control simulated components like LEDs and LCD displays through a custom Alexa skill, an AWS Lambda function, and a hosted REST API.

![Project Demo](demo/demo-gif.gif)

## 🌐 Live Demo

**Hosted API URL:** [https://alexa-wokwi-bridge.onrender.com/](https://alexa-wokwi-bridge.onrender.com/)

## 🧰 Tech Stack

* **Amazon Alexa** – Custom skill to receive voice commands
* **AWS Lambda** – Serverless function to process Alexa requests
* **Node.js + Express** – REST API to bridge Alexa with virtual devices
* **JavaScript/HTML** – Frontend to simulate virtual devices (hosted or local)

## 🧠 How It Works

1. User speaks to Alexa (e.g., "Turn on the LED").
2. Alexa invokes the AWS Lambda function.
3. Lambda sends a command to the hosted API.
4. The API updates the state of the virtual devices in the browser via HTTP.


## 🛠️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/saimani1232/alexa-wokwi-bridge.git
   cd alexa-wokwi-bridge
   ```

2. Install dependencies:

   ```bash
   cd server
   npm install
   ```

3. Run the server locally:

   ```bash
   npm start
   ```

4. Create and link your Alexa skill to the deployed Lambda function.

## 🔍 Example Voice Commands

* “Alexa, ask virtual device to turn on the LED.”
* “Alexa, ask virtual device to display ‘Hello’.”

## 📌 Future Enhancements

* Add authentication for device control
* Expand command set (e.g., RGB LED, sensors)
* Real-time device updates with WebSockets


