import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800 border-red-200";
      case "in_progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
                  <Badge className={`mt-1 ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority}
                  </Badge>
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

              <div className="flex justify-end gap-3 pt-4 border-t">
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
