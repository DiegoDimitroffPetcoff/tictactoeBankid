import React, { useState, useEffect } from 'react';
import BankIDLogin from './components/BankIDLogin';
import TicTacToe from './components/TicTacToe';
import { UserMenu } from './components/UserMenu';
import { ShoppingCart, CreditCard, X } from 'lucide-react';

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
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseTimeRemaining, setPurchaseTimeRemaining] = useState(5);

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

  useEffect(() => {
    if (isLoggedIn) {
      const purchaseTimer = setInterval(() => {
        setPurchaseTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(purchaseTimer);
            setShowPurchaseModal(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(purchaseTimer);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (data: UserData) => {
    console.log("Datos del usuario recibidos:", data);
    setIsLoggedIn(true);
    setUserData(data);
    setShowLogin(false);
    setPurchaseTimeRemaining(5);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogin(true);
    setShowPurchaseModal(false);
    setPurchaseTimeRemaining(5);
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

        {showPurchaseModal && isLoggedIn && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
              <button 
                onClick={() => setShowPurchaseModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center space-y-6">
                <div className="flex justify-center space-x-4">
                  <ShoppingCart className="h-12 w-12 text-blue-500" />
                  <CreditCard className="h-12 w-12 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                  ¡Compra Tic Tac Toe Premium!
                </h2>

                <p className="text-gray-600">
                  Desbloquea todas las funciones y disfruta de una experiencia sin anuncios.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-blue-800">
                    Precio especial: $9.99
                  </p>
                </div>

                <button
                  onClick={() => {
                    alert('¡Gracias por tu interés! Esta es una demo.');
                    setShowPurchaseModal(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                           text-white py-3 px-6 rounded-lg font-semibold
                           hover:from-blue-600 hover:to-blue-700 
                           transform transition-all duration-200 hover:scale-105
                           flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Comprar ahora</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
