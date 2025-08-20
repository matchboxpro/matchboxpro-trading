import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ReportsSection } from "@/components/admin/ReportsSection";
import { UsersSection } from "@/components/admin/UsersSection";
import { EditAlbumDialog } from "@/components/admin/dialogs/EditAlbumDialog";
import { DeleteAlbumDialog } from "@/components/admin/dialogs/DeleteAlbumDialog";
import { DashboardSection } from "@/components/admin/sections/DashboardSection";
import { AlbumsSection } from "@/components/admin/sections/AlbumsSection";
import { SettingsSection } from "@/components/admin/sections/SettingsSection";
import { StickerManagementModal } from "@/components/admin/modals/StickerManagementModal";
import { NewAlbumModal } from "@/components/admin/modals/NewAlbumModal";
import { AdminSidebar } from "@/components/admin/navigation/AdminSidebar";

export default function Admin() {
  const [albumForm, setAlbumForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    stickers: "",
  });
  const [activeSection, setActiveSection] = useState<"dashboard" | "albums" | "users" | "reports" | "settings">("dashboard");
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editAlbumDialog, setEditAlbumDialog] = useState<{show: boolean, album: any | null}>({show: false, album: null});
  const [deleteAlbumDialog, setDeleteAlbumDialog] = useState<{show: boolean, album: any | null}>({show: false, album: null});
  const [stickerManagementModal, setStickerManagementModal] = useState<{show: boolean, album: any | null}>({show: false, album: null});
  const [editAlbumName, setEditAlbumName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetch('/api/admin/stats').then(res => res.json()),
  });

  const { data: albums = [], isLoading, error, isError } = useQuery({
    queryKey: ["albums", refreshTrigger],
    queryFn: () => fetch('/api/albums').then(res => res.json()),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: false,
  }) as { data: any[], isLoading: boolean, error: any, isError: boolean };

  // Albums loaded successfully

  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () => fetch('/api/admin/reports?page=1&limit=20').then(res => res.json()),
    enabled: true,
  });

  const createAlbumMutation = useMutation({
    mutationFn: async (data: any) => {
      // First create the album
      const albumResponse = await apiRequest("POST", "/api/albums", {
        name: data.name,
        year: data.year,
      });
      const album = await albumResponse.json();

      // Then parse and create stickers
      if (data.stickers.trim()) {
        const stickerLines = data.stickers.trim().split('\n');
        const stickers = stickerLines.map((line: string) => {
          const [number, name, team] = line.split('|').map(s => s.trim());
          return { number, name, team: team || null };
        });

        await apiRequest("POST", `/api/albums/${album.id}/stickers`, { stickers });
      }

      return album;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/albums"] });
      setAlbumForm({ name: "", year: new Date().getFullYear(), stickers: "" });
      toast({
        title: "Album creato!",
        description: "Album e figurine create con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione dell'album",
        variant: "destructive",
      });
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId: string) => {
      await apiRequest("DELETE", `/api/albums/${albumId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/albums"] });
      toast({
        title: "Album eliminato",
        description: "Album eliminato con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'eliminazione dell'album",
        variant: "destructive",
      });
    },
  });

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.name.trim()) {
      toast({
        title: "Errore",
        description: "Il nome dell'album è obbligatorio",
        variant: "destructive",
      });
      return;
    }
    createAlbumMutation.mutate(albumForm);
  };

  return (
    <div className="min-h-screen bg-[#fff4d6]">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#052b3e]">
                {activeSection === "dashboard" && ""}
                {activeSection === "albums" && ""}
                {activeSection === "reports" && ""}
                {activeSection === "settings" && ""}
              </h1>
              <p className="text-[#05637b] text-lg">
                {activeSection === "dashboard" && ""}
                {activeSection === "albums" && ""}
                {activeSection === "reports" && ""}
                {activeSection === "settings" && ""}
              </p>
            </div>
          </div>

          {/* Dashboard Content */}
          {activeSection === "dashboard" && (
            <DashboardSection stats={stats} />
          )}

          {/* Albums Section */}
          {activeSection === "albums" && (
            <AlbumsSection
              albums={albums}
              isLoading={isLoading}
              error={error}
              onNewAlbum={() => setShowNewAlbumModal(true)}
              onManageStickers={(album) => {
                setStickerManagementModal({show: true, album});
              }}
              onEditAlbum={(album) => {
                setEditAlbumDialog({show: true, album});
                setEditAlbumName(album.name);
              }}
              onDeleteAlbum={(album) => {
                setDeleteAlbumDialog({show: true, album});
              }}
            />
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <UsersSection />
          )}

          {/* Reports Section - Sistema completo */}
          {activeSection === "reports" && (
            <ReportsSection />
          )}

          {/* Settings Section */}
          {activeSection === "settings" && <SettingsSection />}

          {/* Sticker Management Modal */}
          <StickerManagementModal
            isOpen={stickerManagementModal.show}
            onClose={() => setStickerManagementModal({show: false, album: null})}
            album={stickerManagementModal.album}
          />  

          {/* New Album Modal */}
          <NewAlbumModal
            isOpen={showNewAlbumModal}
            onClose={() => setShowNewAlbumModal(false)}
            onSuccess={() => setRefreshTrigger(prev => prev + 1)}
          />

          {/* Edit Album Dialog */}
          <EditAlbumDialog
            isOpen={editAlbumDialog.show}
            onClose={() => setEditAlbumDialog({show: false, album: null})}
            album={editAlbumDialog.album}
            onSuccess={() => setRefreshTrigger(prev => prev + 1)}
          />

          {/* Delete Album Dialog */}
          <DeleteAlbumDialog
            isOpen={deleteAlbumDialog.show}
            onClose={() => setDeleteAlbumDialog({show: false, album: null})}
            album={deleteAlbumDialog.album}
            onSuccess={() => setRefreshTrigger(prev => prev + 1)}
          />
        </main>
      </div>
    </div>
  );
}
