
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { FileText, Users, DollarSign, TrendingUp, Eye, Download, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const PartnerDashboard = () => {
  const stats = {
    totalUsers: 1248,
    activeUsers: 892,
    totalReceipts: 15420,
    revenue: 2150000,
    growth: 15.3
  };

  // Charts data
  const revenueData = [
    { id: "commissions", data: [
      { x: "Jan", y: 125000 },
      { x: "Fév", y: 145000 },
      { x: "Mar", y: 135000 },
      { x: "Avr", y: 167000 },
      { x: "Mai", y: 189000 },
      { x: "Juin", y: 215000 }
    ]}
  ];

  const userActivityData = [
    { month: "Jan", nouveaux: 45, actifs: 234 },
    { month: "Fév", nouveaux: 52, actifs: 267 },
    { month: "Mar", nouveaux: 48, actifs: 245 },
    { month: "Avr", nouveaux: 67, actifs: 289 },
    { month: "Mai", nouveaux: 71, actifs: 312 },
    { month: "Juin", nouveaux: 59, actifs: 298 }
  ];

  const receiptDistributionData = [
    { id: "recus", label: "Reçus", value: 68, color: "#10B981" },
    { id: "factures", label: "Factures", value: 32, color: "#3B82F6" }
  ];

  const recentActivity = [
    { id: 1, user: "Marie Kouassi", action: "Nouveau compte créé", time: "Il y a 2 min" },
    { id: 2, user: "Jean Brou", action: "Reçu généré", time: "Il y a 5 min" },
    { id: 3, user: "Fatou Diallo", action: "Abonnement Premium", time: "Il y a 15 min" },
    { id: 4, user: "Kofi Asante", action: "10 reçus générés", time: "Il y a 1h" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Dashboard Partenaire" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="partner" />

        {/* Welcome Section */}
        <Card className="border-primary bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue, TechCorp Solutions
                </h2>
                <p className="text-gray-600 mb-4">
                  Voici un aperçu de l'activité de vos utilisateurs sur Tikiita
                </p>
                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir le rapport détaillé
                  </Button>
                  <Link to="/partner/notifications">
                    <Button variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats.growth}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Cette semaine</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reçus générés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReceipts.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus partagés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.revenue.toLocaleString()} FCFA</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Commission 15%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Évolution des commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={revenueData} height={300} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Activité utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={userActivityData} 
                keys={["nouveaux", "actifs"]} 
                indexBy="month" 
                height={300} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Receipt Distribution Chart */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Types de documents</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={receiptDistributionData} height={250} />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-gray-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Générer un rapport
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter les données
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gérer les utilisateurs
            </Button>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default PartnerDashboard;
