import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { ReportsFilters } from "./reports/ReportsFilters";
import { ReportsTable } from "./reports/ReportsTable";
import { ReportsModals } from "./reports/ReportsModals";
import { ReportsPagination } from "./reports/ReportsPagination";
import { useReportMutations } from "./reports/ReportsMutations";
import { useReportsActions } from "./reports/ReportsActions";

export function ReportsSection() {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    page: 1,
    limit: 20,
  });
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReplitModal, setShowReplitModal] = useState(false);
  const [replitText, setReplitText] = useState("");

  // Query per segnalazioni con paginazione e filtri
  const { data: reportsData, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/reports", filters.status, filters.priority, filters.type, filters.page],
    queryFn: async () => {
      console.log('🔄 [BROWSER DEBUG] Starting reports query:', {
        filters,
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium',
        timestamp: new Date().toISOString()
      });

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          console.log(`Adding filter: ${key} = ${value}`);
          params.set(key, String(value));
        }
      });
      const timestamp = Date.now();
      console.log(`Final URL params: ${params.toString()}`);
      const response = await fetch(`/api/admin/reports?${params}&_t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('📥 [BROWSER DEBUG] Reports query response:', {
        ok: response.ok,
        status: response.status,
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium'
      });

      if (!response.ok) throw new Error("Errore nel caricamento segnalazioni");
      const data = await response.json();
      
      console.log('✅ [BROWSER DEBUG] Reports data received:', {
        reportsCount: data.reports?.length || 0,
        total: data.total,
        hasNextPage: data.hasNextPage,
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Chromium'
      });
      
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const reports = reportsData?.reports || [];
  const totalPages = reportsData?.totalPages || 1;
  const totalReports = reportsData?.total || 0;

  console.log('ReportsSection - Current filters:', filters);
  console.log('ReportsSection - Reports from query:', reports.length);
  console.log('ReportsSection - Total from backend:', totalReports);

  // Effetto per forzare refetch quando cambiano i filtri
  useEffect(() => {
    console.log('Filters changed, forcing refetch:', filters);
    refetch();
  }, [filters.status, filters.priority, filters.type, refetch]);

  // Mutations
  const { updateReportMutation, deleteReportsMutation, bulkUpdateMutation } = useReportMutations(
    selectedReports,
    setSelectedReports,
    reports,
    refetch
  );

  // Actions
  const {
    toggleReportSelection,
    selectAllReports,
    clearSelection,
    viewReportDetails,
    updateReportStatus,
    updateReportPriority,
    bulkStatusChange,
    deleteSelectedReports,
    copySelectedToReplit
  } = useReportsActions(
    selectedReports,
    setSelectedReports,
    reports,
    setSelectedReport,
    setShowDetailModal,
    setShowReplitModal,
    setReplitText,
    bulkUpdateMutation,
    deleteReportsMutation,
    updateReportMutation
  );

  return (
    <div className="space-y-6">
      {/* Header con titolo e icona */}
      <div className="bg-[#05637b] border-0 shadow-lg rounded-lg p-6">
        <h2 className="flex items-center gap-3 text-white text-xl font-bold">
          <AlertTriangle className="w-6 h-6 text-[#f8b400]" />
          Segnalazioni
        </h2>
      </div>

      {/* Filtri */}
      <ReportsFilters
        filters={filters}
        onFiltersChange={setFilters}
        selectedReports={selectedReports}
        onCopyToReplit={copySelectedToReplit}
      />


      {/* Tabella segnalazioni */}
      <ReportsTable
        reports={reports}
        isLoading={isLoading}
        selectedReports={selectedReports}
        onToggleSelection={toggleReportSelection}
        onSelectAll={selectAllReports}
        onClearSelection={clearSelection}
        onViewDetails={viewReportDetails}
        onUpdateStatus={updateReportStatus}
        onUpdatePriority={updateReportPriority}
        onDeleteSelected={deleteSelectedReports}
        onBulkStatusChange={bulkStatusChange}
      />

      {/* Paginazione */}
      <ReportsPagination
        currentPage={filters.page}
        totalPages={totalPages}
        totalReports={totalReports}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />

      {/* Modals */}
      <ReportsModals
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        selectedReport={selectedReport}
        showReplitModal={showReplitModal}
        setShowReplitModal={setShowReplitModal}
        replitText={replitText}
      />
    </div>
  );
}