import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useReportMutations(
  selectedReports: string[],
  setSelectedReports: (reports: string[]) => void,
  reports: any[],
  refetch: () => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation per aggiornamento singolo report
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Errore nell'aggiornamento");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      toast({ 
        title: "✅ Segnalazione aggiornata", 
        description: "Lo stato è stato modificato con successo",
        duration: 4000
      });
    },
    onError: () => {
      toast({ 
        title: "❌ Errore", 
        description: "Impossibile aggiornare la segnalazione", 
        variant: "destructive",
        duration: 4000
      });
    },
  });

  // Mutation per eliminazione bulk
  const deleteReportsMutation = useMutation({
    mutationFn: async (reportIds: string[]) => {
      const response = await fetch('/api/admin/reports/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportIds })
      });
      if (!response.ok) throw new Error("Errore nell'eliminazione");
      return response.json();
    },
    onSuccess: (_, reportIds) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      setSelectedReports([]);
      toast({ 
        title: "✅ Segnalazioni eliminate", 
        description: `${reportIds.length} segnalazioni eliminate con successo`,
        duration: 4000
      });
    },
    onError: (error) => {
      toast({ 
        title: "❌ Errore eliminazione", 
        description: `Impossibile eliminare le segnalazioni: ${error.message}`, 
        variant: "destructive",
        duration: 5000
      });
    },
  });

  // Mutation per aggiornamento bulk dello stato
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ reportIds, status }: { reportIds: string[]; status: string }) => {
      const response = await fetch('/api/admin/reports/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reportIds, status })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Errore nell\'aggiornamento dello stato');
      }
      
      const result = await response.json();
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      
      // Force immediate refetch with timeout for browser compatibility
      setTimeout(() => {
        refetch();
      }, 100);
      
      setSelectedReports([]);
      
      const toastConfig = { 
        title: "✅ Successo", 
        description: `Stato aggiornato per ${variables.reportIds.length} segnalazioni`,
        duration: 3000,
        className: "z-[9999] !opacity-100 !visible"
      };
      
      toast(toastConfig);
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Errore", 
        description: error.message || "Errore nell'aggiornamento dello stato",
        variant: "destructive",
        duration: 5000
      });
    }
  });

  return {
    updateReportMutation,
    deleteReportsMutation,
    bulkUpdateMutation
  };
}
