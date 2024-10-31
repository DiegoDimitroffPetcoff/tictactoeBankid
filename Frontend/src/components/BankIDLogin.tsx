import React, { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { QRCodeSVG } from 'qrcode.react'
import { PersonalNumberInput } from './PersonalNumberInput'

interface BankIDLoginProps {
  onLoginSuccess: (userData: { name: string }) => void;
}

export default function BankIDLogin({ onLoginSuccess }: BankIDLoginProps) {
  const [showPersonalNumberInput, setShowPersonalNumberInput] = useState<boolean>(false)
  const [qrData, setQrData] = useState<string | null>(null)
  const [_orderRef, setOrderRef] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<string | null>(null)
  const [qrStartToken, setQrStartToken] = useState<string | null>(null)
  const [qrStartSecret, setQrStartSecret] = useState<string | null>(null)
  const [timeCounter, setTimeCounter] = useState<number>(0)

  const generateQRData = async (qrStartToken: string, qrStartSecret: string, time: number) => {
    const timeString = time.toString()
    
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
      encoder.encode(timeString)
    )
    
    const qrAuthCode = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const finalQrData = `bankid.${qrStartToken}.${timeString}.${qrAuthCode}`
    
    // Mejorar el log para ver claramente la secuencia
    console.log(finalQrData)
    
    return {
      qrData: finalQrData,
      time: time
    }
  }

  // Separar el fetch inicial
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('http://localhost:3000/')
        if (!response.ok) {
          throw new Error('Error en la autenticación')
        }
        const data = await response.json()
        setOrderRef(data.orderRef)
        setQrStartToken(data.qrStartToken)
        setQrStartSecret(data.qrStartSecret)
        
        // Generar QR inicial con tiempo 0
        if (data.qrStartToken && data.qrStartSecret) {
          const { qrData } = await generateQRData(
            data.qrStartToken, 
            data.qrStartSecret,
            0
          )
          setQrData(qrData)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchInitialData()
  }, []) // Solo se ejecuta una vez al montar el componente

  // Manejar la actualización del QR cada 3 segundos
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const updateQR = async () => {
      if (qrStartToken && qrStartSecret) {
        // Incrementar contador y reiniciar si es mayor a 2
        setTimeCounter(prevCounter => {
          const newCounter = prevCounter >= 2 ? 0 : prevCounter + 1
          return newCounter
        })
      }
    }

    if (qrStartToken && qrStartSecret) {
      // Iniciar el intervalo
      intervalId = setInterval(updateQR, 3000) // Actualizar cada 3 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [qrStartToken, qrStartSecret])

  // Actualizar QR cuando cambie el timeCounter
  useEffect(() => {
    const updateQRData = async () => {
      if (qrStartToken && qrStartSecret) {
        const { qrData } = await generateQRData(qrStartToken, qrStartSecret, timeCounter)
        setQrData(qrData)
      }
    }
    updateQRData()
  }, [timeCounter, qrStartToken, qrStartSecret])

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
            onLoginSuccess({
              name: data.completionData?.user?.name || 'Usuario'
            })
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

  const handlePersonalNumberSubmit = async (personalNumber: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth', {
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

  // Agregar función para manejar el inicio de sesión desde el dispositivo
  const handleSameDeviceLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/')
      if (!response.ok) {
        throw new Error('Error en la autenticación')
      }
      const data = await response.json()
      console.log("Datos de inicio de sesión:", data);
      
      // Guardar orderRef para el polling
      setOrderRef(data.orderRef)
      
      // Redireccionar a BankID
      if (data.bankIdUrl) {
        window.location.href = data.bankIdUrl
      }
      
      // Iniciar polling inmediatamente
      startPolling(data.orderRef)
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al iniciar la autenticación. Por favor, intente de nuevo.')
    }
  }

  // Función auxiliar para el polling
  const startPolling = async (orderRef: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3000/collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderRef }),
        })
        
        if (!response.ok) {
          throw new Error('Error al verificar la autenticación')
        }
        
        const data = await response.json()
        console.log("Estado de autenticación:", data);
        
        setAuthStatus(data.status)
        
        if (data.status === 'complete') {
          clearInterval(pollInterval)
          console.log("Usuario autenticado:", data.completionData?.user);
          onLoginSuccess({
            name: data.completionData?.user?.name || 'Usuario'
          })
        }
      } catch (error) {
        console.error('Error en polling:', error)
        clearInterval(pollInterval)
      }
    }, 2000)
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
          <div className="w-full space-y-2">
            <Button onClick={() => setShowPersonalNumberInput(true)} className="w-full">
              Ingresar con número personal
            </Button>
            <Button onClick={handleSameDeviceLogin} className="w-full">
              Iniciar sesión desde este dispositivo
            </Button>
          </div>
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
