import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { User } from 'lucide-react'

interface UserMenuProps {
  userName: string;
  givenName?: string;
  surname?: string;
  personalNumber?: string;
  notBefore?: string;
  notAfter?: string;
  ipAddress?: string;
  onLogout: () => void;
}

export function UserMenu({ 
  userName, 
  givenName,
  surname,
  personalNumber,
  notBefore,
  notAfter,
  ipAddress,
  onLogout 
}: UserMenuProps) {

  // Función auxiliar para formatear fechas
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200">
          <User className="h-6 w-6 text-blue-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex flex-col p-3 space-y-4">
          {/* Cabecera con nombre completo */}
          <div className="text-center pb-2 border-b">
            <h3 className="font-bold text-lg text-blue-600">{userName}</h3>
            <p className="text-sm text-gray-500">{personalNumber}</p>
          </div>

          {/* Información detallada */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Nombre</p>
                <p>{givenName || 'No disponible'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Apellido</p>
                <p>{surname || 'No disponible'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-gray-600">Validez</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Desde</p>
                  <p>{formatDate(notBefore)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Hasta</p>
                  <p>{formatDate(notAfter)}</p>
                </div>
              </div>
            </div>

            {ipAddress && (
              <div className="text-sm">
                <p className="font-semibold text-gray-600">IP</p>
                <p className="text-gray-500">{ipAddress}</p>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        
        {/* Botones de acción */}
        <div className="p-2">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 