const { swaggerDocs: v1SwaggerDocs } = require("./swagger.js");
const app = require("./src/app/app.js");
/**
 * @swagger
 * /phone:
 *   post:
 *     summary: Authenticate a user via phone number
 *     description: Initiates an authentication process for a user using their phone number. The request requires a personal number to identify the user and initiate the authentication process.
 *     requestBody:
 *       description: The request body containing the personal number to authenticate.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personalNumber:
 *                 type: string
 *                 description: The personal number of the user to authenticate.
 *                 example: "1234567890"
 *               callInitiator:
 *                 type: string
 *                 description: Indicates who is initiating the call. Default is "user".
 *                 example: "user"
 *             required:
 *               - personalNumber
 *     responses:
 *       200:
 *         description: Successful initiation of authentication process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the authentication process initiation.
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   description: Detailed message about the result of the initiation.
 *                   example: "Authentication process started successfully."
 *       400:
 *         description: Bad Request. Invalid personal number or other request issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   description: Error code indicating the reason for the failure.
 *                   example: "invalidParameters"
 *                 errorMessage:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Invalid personal number provided."
 *       500:
 *         description: Internal Server Error. An unexpected error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   description: Error code indicating the type of server error.
 *                   example: "internalError"
 *                 errorMessage:
 *                   type: string
 *                   description: Detailed message about the server error.
 *                   example: "An internal server error occurred."
 */
/**
 * @swagger
 * /phone/cancel:
 *   get:
 *     summary: Cancel an ongoing transaction
 *     description: Cancels an ongoing transaction using the provided order reference. Returns the response from the cancel controller or an error message if the operation fails.
 
 *     responses:
 *       200:
 *         description: Successful cancellation of the transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Response from the cancel controller
 *       400:
 *         description: No response received from the cancel controller
 *       500:
 *         description: Error cancelling the transaction
 */
/**
 * @openapi
 * /:
 *   get:
 *     summary: Initiate Authentication
 *     description: Initiates an authentication request using BankID and returns order details.
 *     responses:
 *       200:
 *         description: Successfully initiated authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderRef:
 *                   type: string
 *                   description: Reference ID for the authentication order.
 *                 autoStartToken:
 *                   type: string
 *                   description: Token for automatic start of the BankID client.
 *                 qrStartToken:
 *                   type: string
 *                   description: Token to be used in QR code generation.
 *                 qrStartSecret:
 *                   type: string
 *                   description: Secret to be used in QR code generation.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
/**
 * @swagger
 * /cancel:
 *   get:
 *     summary: Cancel an ongoing transaction
 *     description: Cancels an ongoing transaction using the provided order reference. Returns the response from the cancel controller or an error message if the operation fails.
 
 *     responses:
 *       200:
 *         description: Successful cancellation of the transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Response from the cancel controller
 *       400:
 *         description: No response received from the cancel controller
 *       500:
 *         description: Error cancelling the transaction
 */
/**
 * @openapi
 * /collect:
 *   get:
 *     summary: Collect Authentication Result
 *     description: Collects the result of an ongoing authentication order using the stored order reference.
 *     responses:
 *       200:
 *         description: Successfully retrieved authentication result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the authentication order (pending, complete, failed).
 *                 hintCode:
 *                   type: string
 *                   description: Hint code providing more information on the order status.
 *                 completionData:
 *                   type: object
 *                   description: Data returned upon successful authentication, including user details.
 *                 orderRef:
 *                   type: string
 *                   description: Reference ID for the authentication order.
 *       400:
 *         description: Bad request. Missing or invalid order reference.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     QRCode:
 *       type: object
 *       properties:
 *         qrBase64:
 *           type: string
 *           description: Base64 encoded QR code image as a plain text string.
 *   responses:
 *     NotFound:
 *       description: Resource not found
 *     InternalServerError:
 *       description: Server error
 */

/**
 * @swagger
 * /sign:
 *   get:
 *     summary: Generate QR code and return Base64 string
 *     description: Generates a QR code and returns it as a Base64-encoded string. This Base64 string can be used to retrieve the QR code image from the /qr endpoint.
 *     responses:
 *       200:
 *         description: Successful response with QR code Base64 string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 base64:
 *                   type: string
 *                   description: Base64-encoded QR code image
 *       500:
 *         description: Error retrieving QR code image
 */

/**
 * @swagger
 * /qr:
 *   get:
 *     summary: Retrieve QR code image
 *     description: Retrieves the QR code image as a PNG from the previously generated Base64 string. This endpoint requires that the /sign endpoint has been called first to generate the QR code.
 *     responses:
 *       200:
 *         description: Successful response with QR code image in PNG format
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error retrieving QR code image
 */

/**
 * @swagger
 * /sign/cancel:
 *   get:
 *     summary: Cancel an ongoing transaction
 *     description: Cancels an ongoing transaction using the provided order reference. Returns the response from the cancel controller or an error message if the operation fails.
 
 *     responses:
 *       200:
 *         description: Successful cancellation of the transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Response from the cancel controller
 *       400:
 *         description: No response received from the cancel controller
 *       500:
 *         description: Error cancelling the transaction
 */
/**
 * @swagger
 * /econest/create-payment:
 *   post:
 *     summary: Create a payment
 *     description: Initiates a payment process using the DIBS payment API. The request requires a payload containing payment details in JSON format.
 *     requestBody:
 *       description: The request body containing payment details.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentDetails:
 *                 type: object
 *                 description: Payment details required to process the payment.
 *                 example: 
 *                   {
 *                     "amount": 1000,
 *                     "currency": "SEK",
 *                     "orderId": "123456789",
 *                     "description": "Payment for order #123456789"
 *                   }
 *             required:
 *               - paymentDetails
 *     responses:
 *       200:
 *         description: Successful initiation of payment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the payment initiation.
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   description: Detailed message about the result of the payment initiation.
 *                   example: "Payment initiated successfully."
 *                 paymentResponse:
 *                   type: object
 *                   description: Response from the DIBS payment API.
 *       400:
 *         description: Bad Request. Invalid payment details or other request issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   description: Error code indicating the reason for the failure.
 *                   example: "invalidParameters"
 *                 errorMessage:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Invalid payment details provided."
 *       500:
 *         description: Internal Server Error. An unexpected error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   description: Error code indicating the type of server error.
 *                   example: "internalError"
 *                 errorMessage:
 *                   type: string
 *                   description: Detailed message about the server error.
 *                   example: "An internal server error occurred."
 */


const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  v1SwaggerDocs(app, PORT);
});
