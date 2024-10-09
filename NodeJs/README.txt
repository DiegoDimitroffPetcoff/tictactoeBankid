# BankID API Integration with Express.js

This project demonstrates an integration with the BankID API using Express.js. The application supports initiating authentication and collecting the result of an authentication order using the BankID API.

## Prerequisites

Before you start, ensure you have the following:

- **Node.js** installed on your machine.
- **npm (Node Package Manager)** for managing dependencies.
- A **BankID test certificate** (`FPTestcert5_20240610.p12`), which is required for secure communication with the BankID API.
- BankID test environment access (for testing purposes).



## Project Structure

. ├── src 
│ └── Services 
│ ├── auth.js # Handles the authentication request 
│ └── collect.js # Handles the collect request 
├── FPTestcert5_20240610.p12 # Test certificate for BankID API 
└── app.js # Main Express application



## Code Explanation

### app.js

- **Express Setup**: Initializes an Express.js server with JSON body parsing.
- **GET / Route**: Calls `createAuth()` to initiate an authentication request and stores the returned `bId`.
- **GET /collect Route**: Calls `collect(bId)` to collect the result of the authentication request using the stored `bId`.
- **POST /econest/create-payment Route**: This route handles payment creation through an external API.

### auth.js

- **createAuth()**: Sends a POST request to the BankID API to initiate authentication. Uses a test certificate for secure communication. Returns the authentication order reference and other details.

### collect.js

- **collect(bId)**: Sends a POST request to the BankID API to collect the result of an ongoing authentication order. It uses the `orderRef` returned from `createAuth()`.

### Payment Creation Route

#### POST /econest/create-payment

This route allows merchants to create a payment by sending a request to an external payment API. The implementation is as follows:

- **Code Explanation**:
    - Uses `https` to send a POST request to the payment API.
    - **Secret API Key**: The API key is stored in an environment variable for security.
    - **Payload**: The payload for the payment request is read from a `payload.json` file.
    - **Response Handling**: 
        - Logs the response status code and headers.
        - Collects and returns the response data back to the client.

Here’s a brief code snippet for reference:

```javascript
const { Router } = require("express");
const http = require("https");
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const route = Router();

route.post("/econest/create-payment", async (req, res) => {
  const secretApiKey = process.env.SECRET_API_KEY; // Access the API key
  const options = {
    method: "POST",
    hostname: "test.api.dibspayment.eu",
    port: 443,
    path: "/v1/payments",
    headers: {
      "content-type": "application/json",
      Authorization: secretApiKey,
    },
  };

  const restreq = http.request(options, function (resp) {
    const chunks = [];

    console.log("statusCode: ", resp.statusCode);
    console.log("headers: ", resp.headers);

    resp.on("data", function (chunk) {
      console.log("on data");
      chunks.push(chunk);
    });
    resp.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      res.send(body.toString());
    });
  });

  let payload = fs.readFileSync(`${__dirname}/payload.json`);
  restreq.write(payload);

  restreq.on("error", function (e) {
    console.error("error");
    console.error(e);
  });
  restreq.end();
});

module.exports = route;
Additional API Endpoints
In addition to the basic BankID API integration, this project also includes additional endpoints for handling authentication via phone number, canceling transactions, generating QR codes, and retrieving authentication results.

Phone Number Authentication
POST /phone
Initiates the authentication process using the user's personal number and call initiator.
Response Codes:

200: Authentication process successfully initiated.
400: Invalid request.
500: Internal server error.
Cancel Transactions
GET /phone/cancel
Cancels an ongoing transaction using an order reference.
Response Codes:

200: Transaction successfully canceled.
400: No response from cancel controller.
500: Error canceling the transaction.
QR Code Generation
GET /sign
Generates a QR code in Base64 format.
Response Codes:

200: QR code successfully generated.
500: Error generating QR code.
Retrieve QR Code Image
GET /qr
Retrieves a PNG image of the QR code generated previously.
Response Codes:

200: QR code image successfully retrieved.
500: Error retrieving QR code image.
Collect Authentication Results
GET /collect
Retrieves the result of an ongoing authentication order.
Response Codes:

200: Authentication result successfully retrieved.
400: Invalid request.
500: Internal server error.
Nexi API Key Retrieval
In addition to the BankID integration, this project will also integrate with the Nexi API for payment processing. To obtain your API Key for Nexi, follow these steps:

Go to the Nexi Checkout documentation.
Access Web Integration: Nexi Web Integration.
On the documentation page, navigate to the "Web integration" section.
Create a Checkout Portal Account.
After creating your account, log in to access the dashboard and retrieve your API keys.
Error Handling
Errors are caught and logged to the console. If an error occurs during a request, the server will respond with a 500 status code and the error message.

Installation
Clone this repository:
bash
Copy code
git clone https://github.com/ahmedhussain85/BankID-NodeJS.git
Install the dependencies:
bash
Copy code
npm install
Run the server:
bash
Copy code
npm start
The server will be listening on http://localhost:3000.