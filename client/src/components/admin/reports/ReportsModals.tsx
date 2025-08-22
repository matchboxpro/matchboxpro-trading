import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";

interface ReportsModalsProps {
  showDetailModal: boolean;
  setShowDetailModal: (show: boolean) => void;
  selectedReport: any;
  showReplitModal: boolean;
  setShowReplitModal: (show: boolean) => void;
  replitText: string;
}

export function ReportsModals({
  showDetailModal,
  setShowDetailModal,
  selectedReport,
  showReplitModal,
  setShowReplitModal,
  replitText
}: ReportsModalsProps) {
  const [promptCopied, setPromptCopied] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "nuovo": return "bg-blue-100 text-blue-800 border-blue-200";
      case "aperto": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inviato": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-800 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const generateCascadePrompt = (report: any) => {
    return `# 🚨 MATCHBOX Error Report - Debug Prompt for Cascade

## Context
- **Project**: MatchboxPro (MATCHBOX) - Trading cards web app
- **Stack**: React + TypeScript + Express + Supabase
- **Location**: /Users/dero/Documents/MatchboxPro_Portable/matchboxpro_current
- **Generated**: ${new Date().toLocaleString("it-IT")}

## 📋 Error Report Details

**Tipo di errore**: ${report.type}
**Descrizione**: ${report.description}
**Pagina coinvolta**: ${report.page || "N/A"}
**Data**: ${new Date(report.created_at).toLocaleString("it-IT")}
**Utente**: ${report.user_id || "Anonimo"}
**Stato**: ${report.status}
**Priorità**: ${report.priority}

${report.error_details ? `**Dettagli tecnici/Stack trace**:
\`\`\`
${report.error_details}
\`\`\`
` : ""}
**URL**: ${report.url || "N/A"}
**User Agent**: ${report.user_agent || "N/A"}

## 🎯 Richiesta per Cascade

Analizza questo errore e:

1. **Identifica la causa principale** del problema riportato
2. **Suggerisci una soluzione specifica** con percorsi file e modifiche al codice
3. **Valuta l'impatto** e la priorità della correzione
4. **Fornisci i passaggi di implementazione** rispettando l'architettura modulare

## 📁 File chiave da considerare
- Frontend: \`/client/src/pages/\` e \`/client/src/components/\`
- Backend: \`/server/routes.ts\` e \`/server/storage.ts\`
- Shared: \`/shared/schema.ts\`

## 🔧 Note architettura
- Componenti modulari (max 300 righe per file)
- React Query per data fetching
- Database Supabase PostgreSQL
- API Express.js con autenticazione sessione

Pronto per il debug sistematico di questo problema.`;
  };

  return (
    <>
      {/* Modal dettagli segnalazione */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#052b3e] text-xl font-bold">
              Dettagli Segnalazione
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Tipo</label>
                  <Badge variant="outline" className="mt-1 border-[#05637b] text-[#05637b] bg-[#05637b]/5">
                    {selectedReport.type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Data</label>
                  <p className="text-[#052b3e] mt-1">
                    {new Date(selectedReport.created_at).toLocaleString("it-IT")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Stato</label>
                  <Badge className={`mt-1 ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Priorità</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority === 'alta' ? '🔴❗ Alta' : selectedReport.priority === 'media' ? '🟡 Media' : selectedReport.priority}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#052b3e]/70">Descrizione</label>
                <p className="text-[#052b3e] mt-2 p-3 bg-gray-50 rounded-lg">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.error_details && (
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Dettagli Errore</label>
                  <pre className="text-[#052b3e] mt-2 p-3 bg-gray-50 rounded-lg text-sm overflow-x-auto">
                    {selectedReport.error_details}
                  </pre>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[#052b3e]/70">Log Completo</label>
                <Textarea
                  value={generateCascadePrompt(selectedReport)}
                  readOnly
                  className="min-h-[300px] font-mono text-sm bg-gray-50 border-gray-300 text-[#052b3e] mt-2"
                />
              </div>

              {selectedReport.page && (
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Pagina</label>
                  <p className="text-[#052b3e] mt-1">{selectedReport.page}</p>
                </div>
              )}

              {selectedReport.user_id && (
                <div>
                  <label className="text-sm font-medium text-[#052b3e]/70">Utente</label>
                  <p className="text-[#052b3e] mt-1">{selectedReport.user_id}</p>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    const cascadePrompt = generateCascadePrompt(selectedReport);
                    navigator.clipboard.writeText(cascadePrompt);
                    setPromptCopied(true);
                    setTimeout(() => setPromptCopied(false), 2000);
                  }}
                  className="bg-[#f8b400] hover:bg-[#f8b400]/90 text-[#052b3e] font-semibold relative"
                >
                  {promptCopied ? "✅ Copiato!" : "Crea Prompt Cascade"}
                  {promptCopied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                      Prompt copiato negli appunti
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                  className="border-gray-300 text-[#052b3e] hover:bg-gray-50"
                >
                  Chiudi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal testo Replit */}
      <Dialog open={showReplitModal} onOpenChange={setShowReplitModal}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#052b3e] text-xl font-bold">
              Testo per Replit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[#052b3e]/70 text-sm">
              Copia il testo sottostante e incollalo in Replit per condividere le segnalazioni selezionate.
            </p>
            <Textarea
              value={replitText}
              readOnly
              className="min-h-[400px] font-mono text-sm bg-gray-50 border-gray-300 text-[#052b3e]"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReplitModal(false)}
                className="border-gray-300 text-[#052b3e] hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Chiudi
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(replitText);
                  setShowReplitModal(false);
                }}
                className="bg-[#f8b400] hover:bg-[#f8b400]/90 text-[#052b3e] font-semibold"
              >
                Copia negli appunti
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
