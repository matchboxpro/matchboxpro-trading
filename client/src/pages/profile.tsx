import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Crown, ChevronDown, ChevronUp } from "lucide-react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    queryFn: () => fetch('/api/auth/me', { credentials: 'include' }).then(res => res.json()),
  });

  const { data: albums = [] } = useQuery<any[]>({
    queryKey: ["/api/albums"],
    queryFn: () => fetch('/api/albums', { credentials: 'include' }).then(res => res.json()),
  });

  const [showAccountSection, setShowAccountSection] = useState(false);
  const [accountData, setAccountData] = useState({
    nickname: "",
    cap: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    albumSelezionato: "",
  });

  useEffect(() => {
    if (user) {
      setAccountData({
        nickname: user?.nickname || "",
        cap: user?.cap || "",
        password: "",
      });
      setFormData({
        albumSelezionato: user?.albumSelezionato || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/users/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profilo aggiornato!",
        description: "Le modifiche sono state salvate",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento del profilo",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      queryClient.clear();
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il logout",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bianco flex items-center justify-center">
        <p className="text-brand-nero/60">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bianco overflow-y-auto pb-20" 
         style={{ 
           WebkitOverflowScrolling: 'touch',
           touchAction: 'pan-y',
           overscrollBehavior: 'contain'
         }}>
      <div className="bg-brand-azzurro border-b border-brand-azzurro p-2">
        <div className="flex items-center justify-center">
          <img 
            src="/matchbox-logo.png" 
            alt="MATCHBOX" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-none w-full">
        {/* Account Section */}
        <Card className="bg-brand-azzurro border-0 shadow-lg">
          <CardContent className="p-4">
            <Button
              className="w-full bg-brand-azzurro hover:bg-brand-azzurro/90 text-brand-bianco font-semibold border border-brand-bianco"
              onClick={() => setShowAccountSection(!showAccountSection)}
            >
              Account
            </Button>
            
            {showAccountSection && (
              <div className="mt-4 space-y-4 border-t border-brand-bianco/20 pt-4">
                <div>
                  <Label className="text-brand-bianco">Nickname</Label>
                  <Input
                    type="text"
                    value={accountData.nickname}
                    onChange={(e) => {
                      const value = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '')
                        .slice(0, 8);
                      setAccountData(prev => ({ ...prev, nickname: value }));
                    }}
                    className="mt-2 text-black"
                    placeholder="MAX 8 CARATTERI"
                    maxLength={8}
                  />
                </div>
                
                <div>
                  <Label className="text-brand-bianco">CAP</Label>
                  <Input
                    type="text"
                    value={accountData.cap}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                      setAccountData(prev => ({ ...prev, cap: value }));
                    }}
                    className="mt-2 text-black"
                    placeholder="12345"
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <Label className="text-brand-bianco">Password</Label>
                  <Input
                    type="password"
                    value={accountData.password}
                    onChange={(e) => setAccountData(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-2 text-black"
                    placeholder="Nuova password (opzionale)"
                  />
                </div>
                
                <Button
                  className="w-full bg-brand-giallo hover:bg-brand-giallo/90 text-brand-nero font-semibold"
                  onClick={() => {
                    // Controllo se c'è una nuova password
                    if (accountData.password && accountData.password.trim() !== "") {
                      const confirmChange = window.confirm("Sei sicuro di voler cambiare la password?");
                      if (!confirmChange) {
                        return;
                      }
                    }
                    
                    // Merge account data with form data for submission
                    const dataToSubmit: any = { ...accountData, ...formData };
                    if (!accountData.password) {
                      delete dataToSubmit.password;
                    }
                    updateProfileMutation.mutate(dataToSubmit);
                  }}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Salvando..." : "Salva Account"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Album Attivo</Label>
                <Select
                  value={formData.albumSelezionato}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, albumSelezionato: value }))}
                >
                  <SelectTrigger className="mt-2 text-black">
                    <SelectValue placeholder="Seleziona un album" />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map((album: any) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.name} ({album.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-bianco hover:bg-brand-bianco/90 text-brand-nero"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Salvando..." : "Salva Modifiche"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Premium Status */}
        <Card className="bg-gradient-to-r from-brand-giallo to-brand-giallo/80 text-brand-nero border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Stato Premium</h3>
                <p className="text-sm opacity-90">
                  {user?.isPremium ? "Premium attivo" : "Trial attivo"}
                </p>
              </div>
              <Crown className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="bg-brand-azzurro border-0 shadow-lg">
          <CardContent className="p-4">
            <Button
              className="w-full bg-brand-azzurro hover:bg-brand-azzurro/90 text-brand-giallo font-semibold border border-brand-bianco"
              onClick={handleLogout}
            >
              Esci
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Button - Discreto a fondo pagina */}
      <div className="fixed bottom-4 left-4">
        <Button
          onClick={() => window.location.href = '/admin'}
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-gray-600 opacity-50 hover:opacity-100 transition-opacity"
        >
          Admin
        </Button>
      </div>
    </div>
  );
}
