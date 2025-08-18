import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
    cap: "",
    raggioKm: 10,
  });
  const { toast } = useToast();

  const authMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister && (!formData.cap || formData.cap.length !== 5)) {
      toast({
        title: "Errore",
        description: "Il CAP deve essere di 5 cifre",
        variant: "destructive",
      });
      return;
    }

    const submitData = isRegister ? formData : {
      nickname: formData.nickname,
      password: formData.password,
    };

    authMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-brand-bianco flex flex-col justify-center p-6">
      <Card className="w-full max-w-md mx-auto bg-brand-azzurro border-0">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="w-60 h-44 mx-auto mb-6 flex items-center justify-center">
              <img 
                src="/matchbox-logo.png" 
                alt="MATCHBOX"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-brand-bianco/90 text-lg mb-6">Scambia le tue figurine Panini</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-brand-bianco">Nickname</Label>
              <Input
                type="text"
                placeholder="Il tuo nickname"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                className="mt-2 bg-white text-[#052b3e] placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-[#f8b400]"
                required
              />
            </div>
            
            <div>
              <Label className="text-brand-bianco">Password</Label>
              <Input
                type="password"
                placeholder="La tua password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="mt-2 bg-white text-[#052b3e] placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-[#f8b400]"
                required
              />
            </div>

            {isRegister && (
              <div>
                <Label className="text-brand-bianco">CAP</Label>
                <Input
                  type="text"
                  placeholder="Il tuo CAP (5 cifre)"
                  value={formData.cap}
                  onChange={(e) => setFormData(prev => ({ ...prev, cap: e.target.value }))}
                  className="mt-2 bg-white text-[#052b3e] placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-[#f8b400]"
                  maxLength={5}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-brand-giallo hover:bg-brand-giallo/90 text-black font-semibold"
              disabled={authMutation.isPending}
            >
              {authMutation.isPending 
                ? "Caricamento..." 
                : isRegister 
                  ? "Registrati" 
                  : "Accedi"
              }
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-brand-bianco/60">
              {isRegister ? "Hai già un account?" : "Non hai un account?"}
            </p>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-brand-giallo font-medium hover:underline hover:text-brand-giallo/80"
            >
              {isRegister ? "Accedi" : "Registrati"}
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Button - Centralmente sotto il modale */}
      <div className="mt-8 text-center">
        <Button
          onClick={() => window.location.href = '/admin'}
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-brand-azzurro/10 hover:bg-brand-azzurro/20 text-brand-azzurro hover:text-brand-azzurro opacity-60 hover:opacity-100 transition-all"
        >
          <Shield className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
