import React from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface BankIDLoginProps {
  onLoginSuccess: () => void;
}

export default function BankIDLogin({ onLoginSuccess }: BankIDLoginProps) {
  const handleLogin = () => {
    // Aquí iría la lógica de inicio de sesión con BankID
    // Por ahora, simplemente llamamos a onLoginSuccess
    onLoginSuccess();
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>BankID Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center text-blue-500">
          Please log in to continue playing Tic Tac Toe
        </div>
        <Button onClick={handleLogin} className="w-full">
          Login with BankID
        </Button>
      </CardContent>
    </Card>
  );
}
