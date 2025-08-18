import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, ImageIcon } from 'lucide-react';

interface DashboardSectionProps {
  stats: any;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-[#05637b] border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-2xl">
            🎯 Dashboard Amministratore
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#05637b] border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Utenti Totali</p>
                <p className="text-3xl font-bold text-white">{(stats as any)?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#f8b400] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#052b3e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#05637b] border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Album Attivi</p>
                <p className="text-3xl font-bold text-white">{(stats as any)?.activeAlbums || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#f8b400] rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-[#052b3e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#05637b] border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Segnalazioni</p>
                <p className="text-3xl font-bold text-white">{(stats as any)?.pendingReports || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#f8b400] rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#052b3e]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
