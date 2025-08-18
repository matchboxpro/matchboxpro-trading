import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReportsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  onPageChange: (page: number) => void;
}

export function ReportsPagination({
  currentPage,
  totalPages,
  totalReports,
  onPageChange
}: ReportsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-[#052b3e]/70">
        Pagina {currentPage} di {totalPages} ({totalReports} segnalazioni totali)
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-gray-300 text-[#052b3e] hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Precedente
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-gray-300 text-[#052b3e] hover:bg-gray-50 disabled:opacity-50"
        >
          Successiva
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
