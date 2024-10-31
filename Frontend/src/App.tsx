import React, { useState, useEffect } from 'react';
import BankIDLogin from './components/BankIDLogin';
import TicTacToe from './components/TicTacToe';
import { UserMenu } from './components/UserMenu';

interface UserData {
  name: string;
  // Agrega otros campos según la respuesta de BankID
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
    setIsLoggedIn(true);
    setUserData(data);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row gap-8 relative">
        {showLogin && !isLoggedIn ? (
          <BankIDLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <TicTacToe 
              isDisabled={showLogin && !isLoggedIn} 
              timeRemaining={timeRemaining}
            />
            {isLoggedIn && userData && (
              <div className="absolute top-4 right-4">
                <UserMenu 
                  userName={userData.name} 
                  onLogout={handleLogout}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
