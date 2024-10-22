import React, { useState, useEffect } from 'react';
import BankIDLogin from './components/BankIDLogin';
import TicTacToe from './components/TicTacToe';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {showLogin && !isLoggedIn ? (
          <BankIDLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <TicTacToe 
            isDisabled={showLogin && !isLoggedIn} 
            timeRemaining={timeRemaining}
          />
        )}
      </div>
    </div>
  );
}

export default App;
