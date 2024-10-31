import React, { useState, useEffect } from 'react';
import BankIDLogin from './components/BankIDLogin';
import TicTacToe from './components/TicTacToe';
import { UserMenu } from './components/UserMenu';

interface UserData {
  name: string;
  givenName: string;
  surname: string;
  personalNumber: string;
  notBefore: string;
  notAfter: string;
  ipAddress: string;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowLogin(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = (data: UserData) => {
    console.log("Datos del usuario recibidos:", data);
    setIsLoggedIn(true);
    setUserData(data);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="fixed top-0 right-0 p-4 z-50">
        {isLoggedIn && userData && (
          <UserMenu 
            userName={userData.name}
            givenName={userData.givenName}
            surname={userData.surname}
            personalNumber={userData.personalNumber}
            notBefore={userData.notBefore}
            notAfter={userData.notAfter}
            ipAddress={userData.ipAddress}
            onLogout={handleLogout}
          />
        )}
      </header>

      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Tic Tac Toe</h1>
        
        <div className="flex flex-col items-center gap-8">
          {showLogin && !isLoggedIn ? (
            <BankIDLogin onLoginSuccess={handleLoginSuccess} />
          ) : (
            <TicTacToe 
              isDisabled={showLogin && !isLoggedIn} 
              timeRemaining={timeRemaining}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
