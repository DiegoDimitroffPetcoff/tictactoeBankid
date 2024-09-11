# BankID API Integration with Express.js

This project demonstrates an integration with the BankID API using Express.js. The application supports initiating authentication and collecting the result of an authentication order using the BankID API.

## Prerequisites

Before you start, ensure you have the following:

- **Node.js** installed on your machine.
- **npm (Node Package Manager)** for managing dependencies.
- A **BankID test certificate** (`FPTestcert5_20240610.p12`), which is required for secure communication with the BankID API.
- BankID test environment access (for testing purposes).

## Project Structure


Aquí tienes el README actualizado para integrar la descripción de tu código existente en el contexto del proyecto actual:

markdown
Copy code
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

### auth.js

- **createAuth()**: Sends a POST request to the BankID API to initiate authentication. Uses a test certificate for secure communication. Returns the authentication order reference and other details.

### collect.js

- **collect(bId)**: Sends a POST request to the BankID API to collect the result of an ongoing authentication order. It uses the `orderRef` returned from `createAuth()`.

## Additional API Endpoints

In addition to the basic BankID API integration, this project also includes additional endpoints for handling authentication via phone number, canceling transactions, generating QR codes, and retrieving authentication results.

### Phone Number Authentication
- **POST /phone**
  - Initiates the authentication process using the user's personal number and call initiator.
  - **Response Codes**:
    - 200: Authentication process successfully initiated.
    - 400: Invalid request.
    - 500: Internal server error.

### Cancel Transactions
- **GET /phone/cancel**
  - Cancels an ongoing transaction using an order reference.
  - **Response Codes**:
    - 200: Transaction successfully canceled.
    - 400: No response from cancel controller.
    - 500: Error canceling the transaction.

### QR Code Generation
- **GET /sign**
  - Generates a QR code in Base64 format.
  - **Response Codes**:
    - 200: QR code successfully generated.
    - 500: Error generating QR code.

### Retrieve QR Code Image
- **GET /qr**
  - Retrieves a PNG image of the QR code generated previously.
  - **Response Codes**:
    - 200: QR code image successfully retrieved.
    - 500: Error retrieving QR code image.

### Collect Authentication Results
- **GET /collect**
  - Retrieves the result of an ongoing authentication order.
  - **Response Codes**:
    - 200: Authentication result successfully retrieved.
    - 400: Invalid request.
    - 500: Internal server error.

## Error Handling

Errors are caught and logged to the console. If an error occurs during a request, the server will respond with a 500 status code and the error message.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/ahmedhussain85/BankID-NodeJS.git


Install the dependencies:
npm install
Run the server:
npm start


Aquí tienes el README actualizado para integrar la descripción de tu código existente en el contexto del proyecto actual:

markdown
Copy code
# BankID API Integration with Express.js

This project demonstrates an integration with the BankID API using Express.js. The application supports initiating authentication and collecting the result of an authentication order using the BankID API.

## Prerequisites

Before you start, ensure you have the following:

- **Node.js** installed on your machine.
- **npm (Node Package Manager)** for managing dependencies.
- A **BankID test certificate** (`FPTestcert5_20240610.p12`), which is required for secure communication with the BankID API.
- BankID test environment access (for testing purposes).

## Project Structure

. ├── src │ └── Services │ ├── auth.js # Handles the authentication request │ └── collect.js # Handles the collect request ├── FPTestcert5_20240610.p12 # Test certificate for BankID API └── app.js # Main Express application

markdown
Copy code

## Code Explanation

### app.js

- **Express Setup**: Initializes an Express.js server with JSON body parsing.
- **GET / Route**: Calls `createAuth()` to initiate an authentication request and stores the returned `bId`.
- **GET /collect Route**: Calls `collect(bId)` to collect the result of the authentication request using the stored `bId`.

### auth.js

- **createAuth()**: Sends a POST request to the BankID API to initiate authentication. Uses a test certificate for secure communication. Returns the authentication order reference and other details.

### collect.js

- **collect(bId)**: Sends a POST request to the BankID API to collect the result of an ongoing authentication order. It uses the `orderRef` returned from `createAuth()`.

## Additional API Endpoints

In addition to the basic BankID API integration, this project also includes additional endpoints for handling authentication via phone number, canceling transactions, generating QR codes, and retrieving authentication results.

### Phone Number Authentication
- **POST /phone**
  - Initiates the authentication process using the user's personal number and call initiator.
  - **Response Codes**:
    - 200: Authentication process successfully initiated.
    - 400: Invalid request.
    - 500: Internal server error.

### Cancel Transactions
- **GET /phone/cancel**
  - Cancels an ongoing transaction using an order reference.
  - **Response Codes**:
    - 200: Transaction successfully canceled.
    - 400: No response from cancel controller.
    - 500: Error canceling the transaction.

### QR Code Generation
- **GET /sign**
  - Generates a QR code in Base64 format.
  - **Response Codes**:
    - 200: QR code successfully generated.
    - 500: Error generating QR code.

### Retrieve QR Code Image
- **GET /qr**
  - Retrieves a PNG image of the QR code generated previously.
  - **Response Codes**:
    - 200: QR code image successfully retrieved.
    - 500: Error retrieving QR code image.

### Collect Authentication Results
- **GET /collect**
  - Retrieves the result of an ongoing authentication order.
  - **Response Codes**:
    - 200: Authentication result successfully retrieved.
    - 400: Invalid request.
    - 500: Internal server error.

## Error Handling

Errors are caught and logged to the console. If an error occurs during a request, the server will respond with a 500 status code and the error message.

## Installation

1. Clone this repository:

   ```bash
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

Swagger Documentation
This API uses Swagger for documenting the endpoints. After starting the server, you can access the Swagger documentation at:
http://localhost:3000/api-docs
