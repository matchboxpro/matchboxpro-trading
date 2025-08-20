import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Toast di conferma prima di procedere
    toast({
      title: "Conferma cambio password",
      description: "Sei sicuro di voler cambiare la password? Questa azione non può essere annullata.",
      action: (
        <div className="flex gap-2">
          <button
            onClick={() => {
              changePasswordMutation.mutate({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Conferma
          </button>
        </div>
      ),
    });
  };

  return (
    <Card className="bg-[#05637b] border-0 shadow-lg">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full flex items-center justify-between p-0 h-auto text-white hover:bg-white/10"
        >
          <span className="text-lg font-semibold">Password</span>
          {showPasswordSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-white font-medium">Password Attuale</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((prev: any) => ({ ...prev, currentPassword: e.target.value }))}
                  className="border-gray-300 focus:border-[#05637b] bg-white text-black placeholder:text-gray-500 pr-10"
                  placeholder=""
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-1">minimo 6 caratteri</p>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-white font-medium">Nuova Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev: any) => ({ ...prev, newPassword: e.target.value }))}
                  className="border-gray-300 focus:border-[#05637b] bg-white text-black placeholder:text-gray-500 pr-10"
                  placeholder=""
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-1">minimo 6 caratteri</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white font-medium">Conferma Nuova Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev: any) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="border-gray-300 focus:border-[#05637b] bg-white text-black placeholder:text-gray-500 pr-10"
                  placeholder=""
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-1">minimo 6 caratteri</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white"
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
