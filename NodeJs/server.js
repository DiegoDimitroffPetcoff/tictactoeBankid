const { swaggerDocs: v1SwaggerDocs } = require("./swagger.js");
const app = require("./src/app/app.js");
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
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Error generating QR code
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
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  v1SwaggerDocs(app, PORT);
});
