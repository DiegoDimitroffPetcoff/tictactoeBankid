import React, { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { QRCodeSVG } from 'qrcode.react'
import { PersonalNumberInput } from './PersonalNumberInput'

interface BankIDLoginProps {
  onLoginSuccess: () => void;
}

export default function BankIDLogin({ onLoginSuccess }: BankIDLoginProps) {
  const [showPersonalNumberInput, setShowPersonalNumberInput] = useState<boolean>(false)
  const [qrData, setQrData] = useState<string | null>(null)
  const [_orderRef, setOrderRef] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<string | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const fetchQRData = async () => {
      try {
        const response = await fetch('http://localhost:3000/')
        if (!response.ok) {
          throw new Error('Error en la autenticación')
        }
        const data = await response.json()
        setOrderRef(data.orderRef)
        
        // Generar el QR data
        const time = Math.floor(Date.now() / 1000).toString()
        const qrAuthCode = await generateQRAuthCode(data.qrStartSecret, time)
        const newQrData = `bankid.${data.qrStartToken}.${time}.${qrAuthCode}`
        setQrData(newQrData)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchQRData()
    intervalId = setInterval(fetchQRData, 3000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const checkAuthStatus = async () => {
      if (_orderRef) {
        try {
          const response = await fetch('http://localhost:3000/collect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderRef: _orderRef }),
          })
          if (!response.ok) {
            throw new Error('Error al verificar la autenticación')
          }
          const data = await response.json()
          setAuthStatus(data.status)
          if (data.status === 'complete') {
            clearInterval(intervalId)
            onLoginSuccess()
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }

    if (_orderRef) {
      checkAuthStatus()
      intervalId = setInterval(checkAuthStatus, 2000)
    }

    return () => clearInterval(intervalId)
  }, [_orderRef, onLoginSuccess])

  const generateQRAuthCode = async (qrStartSecret: string, time: string) => {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(qrStartSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(time)
    )
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const handlePersonalNumberSubmit = async (personalNumber: string) => {
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalNumber }),
      })
      if (!response.ok) {
        throw new Error('Error en la autenticación')
      }
      const data = await response.json()
      setOrderRef(data.orderRef)
      setShowPersonalNumberInput(false)
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al iniciar la autenticación. Por favor, intente de nuevo.')
    }
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">BankID Login</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-4 text-center text-blue-500">
          Please log in to continue playing Tic Tac Toe
        </div>
        {!showPersonalNumberInput ? (
          <Button onClick={() => setShowPersonalNumberInput(true)} className="w-full mb-4">
            Ingresar con número personal
          </Button>
        ) : (
          <PersonalNumberInput onSubmit={handlePersonalNumberSubmit} />
        )}
        {qrData && (
          <div className="mt-4 text-center">
            <QRCodeSVG value={qrData} size={200} className="mx-auto" />
            <p className="mt-2">Escanee este código QR con su app BankID</p>
          </div>
        )}
        {authStatus && (
          <div className="mt-4 text-center">
            Estado de autenticación: {authStatus}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
