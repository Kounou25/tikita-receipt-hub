
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import LineChart from "@/components/charts/LineChart";
import { Receipt, FileText, Users, TrendingUp, Plus, Eye, Download, Bell, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  // Sample data for charts
  const revenueData = [
    { name: "Jan", value: 45000 },
    { name: "Fév", value: 52000 },
    { name: "Mar", value: 48000 },
    { name: "Avr", value: 67000 },
    { name: "Mai", value: 71000 },
    { name: "Juin", value: 59000 }
  ];

  const stats = [
    { title: "Reçus générés", value: "342", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+12%" },
    { title: "Documents créés", value: "128", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+8%" },
    { title: "Clients actifs", value: "89", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+25%" },
    { title: "Revenus totaux", value: "4,250,000 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+18%" },
  ];

  const recentReceipts = [
    { id: "TKT-20250118-001", client: "Marie Kouassi", amount: "25,000 FCFA", type: "Reçu", status: "Payé", date: "18 Jan 2025" },
    { id: "TKT-20250118-002", client: "Ibrahim Moussa", amount: "45,000 FCFA", type: "Reçu", status: "En attente", date: "18 Jan 2025" },
    { id: "TKT-20250117-003", client: "Fatou Diallo", amount: "12,500 FCFA", type: "Reçu", status: "Payé", date: "17 Jan 2025" },
    { id: "TKT-20250117-004", client: "Kofi Asante", amount: "67,000 FCFA", type: "Reçu", status: "Payé", date: "17 Jan 2025" },
  ];

  const topClients = [
    { name: "Boutique Elegance", purchases: 12, amount: "320,000 FCFA", growth: "+25%" },
    { name: "Restaurant Sahel", purchases: 8, amount: "280,000 FCFA", growth: "+18%" },
    { name: "Magasin Central", purchases: 6, amount: "195,000 FCFA", growth: "+12%" },
    { name: "Pharmacie Moderne", purchases: 5, amount: "150,000 FCFA", growth: "+8%" },
    { name: "Atelier Mécanique", purchases: 4, amount: "125,000 FCFA", growth: "+5%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Dashboard" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Welcome Section */}
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bonjour ! 👋
                </h2>
                <p className="text-gray-600 mb-4">
                  Voici un aperçu de votre activité commerciale sur Tikiita.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/generate">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau reçu
                    </Button>
                  </Link>
                  <Link to="/receipts">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir l'historique
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link to="/notifications">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.growth}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Évolution des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={revenueData} height={300} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                Top 5 Clients du Mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.purchases} achats</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{client.amount}</p>
                      <p className="text-sm text-green-600">{client.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activité récente</CardTitle>
            <Link to="/receipts">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReceipts.map((receipt, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{receipt.id}</p>
                      <p className="text-sm text-gray-600">{receipt.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{receipt.amount}</p>
                    <p className={`text-sm ${
                      receipt.status === "Payé" ? "text-green-600" : "text-orange-600"
                    }`}>
                      {receipt.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/generate">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau document
                </Button>
              </Link>
              <Link to="/clients">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les clients
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Exporter les données
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Raccourcis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/receipts">
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="w-4 h-4 mr-2" />
                  Mes reçus
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Mon profil
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Button>
              <Link to="/support">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Contacter le support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserDashboard;
