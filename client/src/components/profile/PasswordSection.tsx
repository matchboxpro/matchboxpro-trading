import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PasswordSectionProps {
  showPasswordSection: boolean;
  setShowPasswordSection: (show: boolean) => void;
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordData: (data: any) => void;
}

export function PasswordSection({ 
  showPasswordSection, 
  setShowPasswordSection, 
  passwordData, 
  setPasswordData 
}: PasswordSectionProps) {
  const { toast } = useToast();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/change-password", data);
      return response.json();
    },
    onSuccess: () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({ title: "Password cambiata", description: "La password è stata aggiornata con successo" });
      setShowPasswordSection(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore", 
        description: error.message || "Errore nel cambiare la password", 
        variant: "destructive" 
      });
    }
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({ title: "Errore", description: "Tutti i campi sono obbligatori", variant: "destructive" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Errore", description: "Le password non coincidono", variant: "destructive" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({ title: "Errore", description: "La nuova password deve essere di almeno 6 caratteri", variant: "destructive" });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-[#05637b]/20">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full flex items-center justify-between p-0 h-auto text-[#05637b] hover:bg-transparent"
        >
          <span className="text-lg font-semibold">Password</span>
          {showPasswordSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-[#05637b] font-medium">Password Attuale</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="border-[#05637b]/30 focus:border-[#05637b]"
                placeholder="Inserisci password attuale"
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-[#05637b] font-medium">Nuova Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="border-[#05637b]/30 focus:border-[#05637b]"
                placeholder="Inserisci nuova password (min 6 caratteri)"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#05637b] font-medium">Conferma Nuova Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="border-[#05637b]/30 focus:border-[#05637b]"
                placeholder="Conferma nuova password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#05637b] hover:bg-[#05637b]/90 text-white"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Cambiando..." : "Cambia Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
