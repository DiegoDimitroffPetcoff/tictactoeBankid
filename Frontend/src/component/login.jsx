import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import CryptoJS from "crypto-js";

export function Login() {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    function getData() {
      fetch("http://localhost:3000/")
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Http error: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          const { orderRef, autoStartToken, qrStartToken, qrStartSecret } =
            data;

          // Start generating QR codes
          generateQrCodes(
            orderRef,
            autoStartToken,
            qrStartToken,
            qrStartSecret
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }

    const timer = setInterval(() => {
      getData();
      console.log("eject");
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  function generateQrCodes(
    orderRef,
    autoStartToken,
    qrStartToken,
    qrStartSecret
  ) {
    const qrList = [];
    const currentTime = Math.floor(Date.now() / 1000);

    for (let t = 0; t < 3; t++) {
      const qrTime = currentTime - t;
      const hmac = CryptoJS.HmacSHA256(
        qrTime.toString(),
        qrStartSecret
      ).toString(CryptoJS.enc.Hex);
      const qrData = `bankid.${qrStartToken}.${t}.${hmac}`;
      console.log(qrData);
      
      setQr(qrData);
      qrList.push(qrData);
    }
  }

  return (
    <div>
      <h1>QR Code Generator</h1>
      {!qr ? <>Loading...</> : <QRCodeSVG value={qr} />}
    </div>
  );
}
