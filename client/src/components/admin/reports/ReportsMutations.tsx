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
      console.log('🔄 [BROWSER DEBUG] Starting bulk status update request:', { 
        reportIds, 
        status, 
        browser: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch('/api/admin/reports/bulk-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportIds, status })
      });
      
      console.log('🌐 [BROWSER DEBUG] Response received:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium'
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ [BROWSER DEBUG] Response error:', error);
        throw new Error(error.message || 'Errore nell\'aggiornamento');
      }
      
      const result = await response.json();
      console.log('✅ [BROWSER DEBUG] Response data:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      console.log('🎉 [BROWSER DEBUG] Mutation onSuccess triggered:', {
        data,
        variables,
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium',
        timestamp: new Date().toISOString()
      });
      
      console.log('🔄 [BROWSER DEBUG] Invalidating React Query cache...');
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      
      // Force immediate refetch with timeout for Chromium compatibility
      console.log('🔄 [BROWSER DEBUG] Forcing immediate refetch...');
      setTimeout(() => {
        console.log('⏰ [BROWSER DEBUG] Timeout refetch triggered');
        refetch();
      }, 100);
      
      console.log('🗑️ [BROWSER DEBUG] Clearing selected reports...');
      setSelectedReports([]);
      
      console.log('🍞 [BROWSER DEBUG] Showing success toast...');
      
      // Force toast to stay visible with explicit timing for Chromium
      const toastConfig = { 
        title: "✅ Stato aggiornato", 
        description: `${data.updatedCount} segnalazioni aggiornate a "${variables.status}"`,
        duration: 5000,
        // Force toast to be visible
        className: "z-[9999] !opacity-100 !visible"
      };
      
      console.log('🍞 [BROWSER DEBUG] Toast config:', toastConfig);
      const toastResult = toast(toastConfig);
      console.log('🍞 [BROWSER DEBUG] Toast result:', toastResult);
      
      // Additional logging for Chromium debugging
      setTimeout(() => {
        console.log('⏰ [BROWSER DEBUG] Post-success check - 1 second later');
        console.log('📊 [BROWSER DEBUG] Current reports count:', reports.length);
        console.log('🎯 [BROWSER DEBUG] Selected reports:', selectedReports);
      }, 1000);
    },
    onError: (error: any) => {
      console.error('💥 [BROWSER DEBUG] Mutation onError triggered:', {
        error: error.message,
        stack: error.stack,
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium',
        timestamp: new Date().toISOString()
      });
      
      console.log('🍞 [BROWSER DEBUG] Showing error toast...');
      const toastResult = toast({ 
        title: "❌ Errore", 
        description: error.message || "Errore nell'aggiornamento dello stato",
        variant: "destructive",
        duration: 5000
      });
      console.log('🍞 [BROWSER DEBUG] Error toast result:', toastResult);
    }
  });

  return {
    updateReportMutation,
    deleteReportsMutation,
    bulkUpdateMutation
  };
}
