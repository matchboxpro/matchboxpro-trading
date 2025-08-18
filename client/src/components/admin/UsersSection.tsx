import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, Calendar, UserCheck, UserX, Clock, Loader2 } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export const UsersSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Errore nel caricamento utenti');
      }
      return response.json();
    }
  });

  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeUsers = users.filter((user: User) => user.is_active).length;
  const inactiveUsers = users.length - activeUsers;

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento stato utente');
      }

      refetch();
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Caricamento utenti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserX className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">Errore nel caricamento degli utenti</p>
          <Button onClick={() => refetch()} className="mt-2">
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header azzurro */}
      <div className="bg-[#05637b] p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-[#f8b400]" />
            <div>
              <h2 className="text-2xl font-bold text-white">Gestione Utenti</h2>
              <p className="text-white/70">
                {users.length} utenti registrati
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cerca utenti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#05637b] p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Utenti Totali</p>
              <p className="text-white text-3xl font-bold">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-[#f8b400]" />
          </div>
        </div>
        <div className="bg-[#05637b] p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Utenti Attivi</p>
              <p className="text-green-400 text-3xl font-bold">{activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#05637b] p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Utenti Disattivati</p>
              <p className="text-red-400 text-3xl font-bold">{inactiveUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Lista Utenti - Box bianco */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-[#05637b] p-4 rounded-t-lg">
          <h3 className="text-white font-semibold">Elenco Utenti</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user: User) => (
            <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#05637b] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{user.username}</h3>
                    <Badge 
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {user.is_active ? "Attivo" : "Disattivato"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Iscritto: {new Date(user.created_at).toLocaleDateString('it-IT')}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Ultimo accesso: {user.last_login ? new Date(user.last_login).toLocaleDateString('it-IT') : 'Mai'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant={user.is_active ? "destructive" : "default"}
                size="sm"
                onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                disabled={false}
                className={user.is_active ? "" : "bg-green-600 hover:bg-green-700"}
              >
                {user.is_active ? (
                  "Disattiva"
                ) : (
                  "Attiva"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
