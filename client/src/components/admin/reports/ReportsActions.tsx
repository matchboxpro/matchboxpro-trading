import { useToast } from "@/hooks/use-toast";

export function useReportsActions(
  selectedReports: string[],
  setSelectedReports: (reports: string[]) => void,
  reports: any[],
  setSelectedReport: (report: any) => void,
  setShowDetailModal: (show: boolean) => void,
  setShowReplitModal: (show: boolean) => void,
  setReplitText: (text: string) => void,
  bulkUpdateMutation: any,
  deleteReportsMutation: any,
  updateReportMutation: any
) {
  const { toast } = useToast();

  // Funzioni di utilità per selezione
  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(
      selectedReports.includes(reportId) 
        ? selectedReports.filter(id => id !== reportId)
        : [...selectedReports, reportId]
    );
  };

  const selectAllReports = () => {
    setSelectedReports(reports.map((r: any) => r.id));
  };

  const clearSelection = () => {
    setSelectedReports([]);
  };

  // Funzioni per visualizzazione dettagli
  const viewReportDetails = (report: any) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  // Funzioni per aggiornamento stato e priorità
  const updateReportStatus = (id: string, status: string) => {
    updateReportMutation.mutate({ id, updates: { status } });
  };

  const updateReportPriority = (id: string, priority: string) => {
    console.log(`Updating priority for report ${id} to ${priority}`);
  };

  // Funzione per cambio stato bulk
  const bulkStatusChange = (newStatus: string) => {
    console.log('🚀 [BROWSER DEBUG] bulkStatusChange called:', {
      newStatus,
      selectedReports,
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium',
      timestamp: new Date().toISOString()
    });

    // Validazione completa
    if (selectedReports.length === 0) {
      console.log('⚠️ [BROWSER DEBUG] No reports selected, showing error toast');
      toast({ 
        title: "⚠️ Errore", 
        description: "Seleziona almeno una segnalazione e uno stato valido",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    if (!newStatus || !['nuovo', 'aperto', 'inviato'].includes(newStatus)) {
      console.log('⚠️ [BROWSER DEBUG] Invalid status, showing error toast');
      toast({ 
        title: "⚠️ Errore", 
        description: "Seleziona almeno una segnalazione e uno stato valido",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    console.log('✅ [BROWSER DEBUG] Validation passed, showing confirmation dialog');
    
    // Conferma dell'azione
    const confirmed = window.confirm(`Sei sicuro di voler cambiare lo stato di ${selectedReports.length} segnalazioni a "${newStatus}"?`);
    console.log('🤔 [BROWSER DEBUG] User confirmation:', confirmed);
    
    if (!confirmed) {
      console.log('❌ [BROWSER DEBUG] User cancelled operation');
      return;
    }

    console.log('🎯 [BROWSER DEBUG] Starting mutation with data:', {
      reportIds: selectedReports,
      status: newStatus
    });

    bulkUpdateMutation.mutate({ 
      reportIds: selectedReports, 
      status: newStatus 
    });
  };

  // Funzione per eliminazione segnalazioni selezionate
  const deleteSelectedReports = () => {
    if (selectedReports.length === 0) {
      toast({ 
        title: "⚠️ Nessuna selezione", 
        description: "Seleziona almeno una segnalazione da eliminare",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    const confirmed = window.confirm(`Sei sicuro di voler eliminare ${selectedReports.length} segnalazioni? Questa azione non può essere annullata.`);
    if (!confirmed) return;

    deleteReportsMutation.mutate(selectedReports);
  };

  // Funzione per copiare segnalazioni selezionate su Replit
  const copySelectedToReplit = () => {
    if (selectedReports.length === 0) {
      toast({ 
        title: "⚠️ Nessuna selezione", 
        description: "Seleziona almeno una segnalazione per creare il prompt",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    const selectedReportsData = reports.filter(report => selectedReports.includes(report.id));
    
    const text = `# 🚨 MATCHBOX Error Reports Analysis - Debug Prompt for Cascade

## 🎯 Task Overview
Analyze and fix the following ${selectedReports.length} error reports from MatchboxPro trading cards web app.

## 📋 Error Reports to Analyze

${selectedReportsData.map((report: any, index: number) => 
`### Error ${index + 1}: ${report.type.toUpperCase()}

**Description**: ${report.description}
**Page**: ${report.page || 'N/A'}
**Priority**: ${report.priority}
**Status**: ${report.status}
**Date**: ${new Date(report.created_at).toLocaleString("it-IT")}
**Error Details**: 
\`\`\`
${report.error_details || 'No additional details'}
\`\`\`

---`).join('\n\n')}

## 🔧 Action Required

Please:
1. **Identify root causes** of the reported errors
2. **Suggest specific fixes** with file paths and code changes
3. **Prioritize fixes** based on impact and frequency
4. **Check for patterns** across multiple reports
5. **Provide implementation steps** respecting the modular architecture

## 📁 Key Files to Consider
- Frontend: \`/client/src/pages/\` and \`/client/src/components/\`
- Backend: \`/server/routes.ts\` and \`/server/storage.ts\`
- Shared: \`/shared/schema.ts\`

## 🔧 Architecture Notes
- Modular components (max 300 lines per file)
- React Query for data fetching
- Supabase PostgreSQL database
- Express.js API with session auth

Ready to debug these issues systematically.`;

    setReplitText(text);
    setShowReplitModal(true);
  };

  return {
    toggleReportSelection,
    selectAllReports,
    clearSelection,
    viewReportDetails,
    updateReportStatus,
    updateReportPriority,
    bulkStatusChange,
    deleteSelectedReports,
    copySelectedToReplit
  };
}
