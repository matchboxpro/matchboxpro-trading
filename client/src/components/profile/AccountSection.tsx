import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AccountSectionProps {
  user: any;
  showAccountSection: boolean;
  setShowAccountSection: (show: boolean) => void;
  accountData: {
    nickname: string;
    cap: string;
    password: string;
  };
  setAccountData: (data: any) => void;
}

export function AccountSection({ 
  user, 
  showAccountSection, 
  setShowAccountSection, 
  accountData, 
  setAccountData 
}: AccountSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profilo aggiornato", description: "Le modifiche sono state salvate con successo" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore", 
        description: error.message || "Errore nell'aggiornare il profilo", 
        variant: "destructive" 
      });
    }
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountData.nickname.trim()) {
      toast({ title: "Errore", description: "Il nickname è obbligatorio", variant: "destructive" });
      return;
    }

    if (accountData.nickname.length > 8) {
      toast({ title: "Errore", description: "Il nickname non può superare 8 caratteri", variant: "destructive" });
      return;
    }

    if (!/^[A-Z0-9]+$/.test(accountData.nickname)) {
      toast({ title: "Errore", description: "Il nickname deve contenere solo lettere maiuscole e numeri", variant: "destructive" });
      return;
    }

    const updateData = {
      nickname: accountData.nickname.toUpperCase(),
      cap: accountData.cap,
    };

    updateProfileMutation.mutate(updateData);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-[#05637b]/20">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          onClick={() => setShowAccountSection(!showAccountSection)}
          className="w-full flex items-center justify-between p-0 h-auto text-[#05637b] hover:bg-transparent"
        >
          <span className="text-lg font-semibold">Account</span>
          {showAccountSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>

        {showAccountSection && (
          <form onSubmit={handleAccountSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="nickname" className="text-[#05637b] font-medium">Nickname</Label>
              <Input
                id="nickname"
                value={accountData.nickname}
                onChange={(e) => setAccountData(prev => ({ ...prev, nickname: e.target.value.toUpperCase() }))}
                className="border-[#05637b]/30 focus:border-[#05637b]"
                placeholder="Inserisci nickname (max 8 caratteri)"
                maxLength={8}
              />
              <p className="text-xs text-[#05637b]/60 mt-1">Solo lettere maiuscole e numeri, massimo 8 caratteri</p>
            </div>

            <div>
              <Label htmlFor="cap" className="text-[#05637b] font-medium">CAP</Label>
              <Input
                id="cap"
                value={accountData.cap}
                onChange={(e) => setAccountData(prev => ({ ...prev, cap: e.target.value }))}
                className="border-[#05637b]/30 focus:border-[#05637b]"
                placeholder="Inserisci CAP"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#05637b] hover:bg-[#05637b]/90 text-white"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Salvando..." : "Salva Modifiche"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
