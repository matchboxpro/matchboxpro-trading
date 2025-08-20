import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Crown } from "lucide-react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AccountSection } from "@/components/profile/AccountSection";
import { PasswordSection } from "@/components/profile/PasswordSection";

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
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [accountData, setAccountData] = useState({
    nickname: "",
    cap: "",
    password: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
      const response = await apiRequest("PUT", "/api/user/profile", data);
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
    <div className="h-screen bg-brand-bianco overflow-hidden fixed inset-0 w-full flex flex-col" 
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

      <div className="p-4 space-y-6 max-w-none w-full flex-1 overflow-y-auto pb-20" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Account Section */}
        <AccountSection 
          user={user}
          showAccountSection={showAccountSection}
          setShowAccountSection={setShowAccountSection}
          accountData={accountData}
          setAccountData={setAccountData}
        />

        {/* Password Section */}
        <PasswordSection 
          showPasswordSection={showPasswordSection}
          setShowPasswordSection={setShowPasswordSection}
          passwordData={passwordData}
          setPasswordData={setPasswordData}
        />

        {/* Settings Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#05637b] font-medium">Album Attivo</label>
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
                className="w-full bg-[#05637b] hover:bg-[#05637b]/90 text-white"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Salvando..." : "Salva Modifiche"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Premium Status */}
        <Card className="bg-gradient-to-r from-[#f4a623] to-[#f4a623]/80 text-black border-0">
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
        <Card className="bg-[#05637b] border-0 shadow-lg">
          <CardContent className="p-4">
            <Button
              className="w-full bg-[#05637b] hover:bg-[#05637b]/90 text-[#f4a623] font-semibold border border-white"
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
