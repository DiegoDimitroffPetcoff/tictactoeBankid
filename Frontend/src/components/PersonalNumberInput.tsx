import React, { useState } from 'react'
import { Button } from "./ui/button"

interface PersonalNumberInputProps {
  onSubmit: (personalNumber: string) => void;
}

export function PersonalNumberInput({ onSubmit }: PersonalNumberInputProps) {
  const [personalNumber, setPersonalNumber] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Solo permite dígitos
    if (value.length <= 10) {
      setPersonalNumber(value)
    }
  }

  const handleSubmit = () => {
    if (personalNumber.length === 10) {
      onSubmit(personalNumber)
    } else {
      alert('Por favor, ingrese un número personal válido de 10 dígitos.')
    }
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Ingrese su número personal (10 dígitos)"
        value={personalNumber}
        onChange={handleChange}
        className="mb-2 w-full p-2 border rounded"
      />
      <Button onClick={handleSubmit} className="w-full">
        Enviar
      </Button>
    </div>
  )
}
