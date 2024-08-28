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


const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  v1SwaggerDocs(app, PORT);
});
