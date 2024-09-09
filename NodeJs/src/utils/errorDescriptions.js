function errorDescriptions(key) {
  switch (key) {
    case "alreadyInProgress":
      return "An auth or sign request with a personal number was sent, but an order for the user is already in progress. The order is aborted. No order is created. RP must inform the user that an auth or sign order is already in progress for the user. Message RFA4 should be used.";
    case "invalidParameters":
      return "Invalid parameter. This may occur due to various reasons such as using an old or failed orderRef, or a different RP-certificate. Completed orders can only be collected up to 3 minutes and failed orders up to 5 minutes. Timed out orders can only be collected for 3 minutes and 10 seconds. RP must not try the same request again. This is an internal error and must not be communicated to the user as a BankID error.";
    case "unauthorized":
      return "RP does not have access to the service. RP must not try the same request again. This is an internal error and must not be communicated to the user as a BankID error.";
    case "notFound":
      return "An erroneous URL path was used. RP must not try the same request again. This is an internal error and must not be communicated to the user as a BankID error.";
    case "methodNotAllowed":
      return "Only HTTP method POST is allowed. RP must not try the same request again. This is an internal error and must not be communicated to the user as a BankID error.";
    case "requestTimeout":
      return "It took too long to transmit the request. RP must not automatically try again. This error may occur if processing or communication is too slow. RP must inform the user. Message RFA5 should be used.";
    case "unsupportedMediaType":
      return "Adding a 'charset' parameter after 'application/json' is not allowed. RP must not try the same request again. This is an internal error and must not be communicated to the user as a BankID error.";
    case "internalError":
      return "Internal technical error in the BankID system. RP must not automatically try again. RP must inform the user. Message RFA5 should be used.";
    case "maintenance":
      return "The service is temporarily unavailable. RP may try again without informing the user. If this error occurs repeatedly, RP must inform the user. Message RFA5 should be used.";
    case "unknownErrorCode":
      return "We may introduce new error codes without prior notice. RP should handle unknown error codes and inform the user. Message RFA22 should be used. RP should update their implementation to support the new errorCode as soon as possible.";
    default:
      return "An unknown error occurred. Please check the error code and consult the documentation for more information.";
  }
}

module.exports = errorDescriptions;
