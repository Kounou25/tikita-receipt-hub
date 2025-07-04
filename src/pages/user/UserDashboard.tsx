import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import LineChart from "@/components/charts/LineChart";
import { Receipt, FileText, Users, TrendingUp, Plus, Eye, Download, Bell, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  // State for dynamic data
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [recentReceipts, setRecentReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("user_name") || "Utilisateur";
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) {
        setError("ID de l'entreprise non défini. Veuillez vous reconnecter.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching data with companyId:", companyId);

        // Fetch stats
        const statsResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/${companyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
        });
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats: ${statsResponse.status} ${statsResponse.statusText}`);
        }
        const statsData = await statsResponse.json();
        if (!Array.isArray(statsData) || statsData.length === 0) {
          throw new Error("Invalid stats response: empty or not an array");
        }
        const apiStats = statsData[0];
        const transformedStats = [
          { title: "Reçus générés", value: apiStats.total_receipts?.toString() || "0", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+0%" },
          { title: "Documents créés", value: apiStats.total_items?.toString() || "0", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+0%" },
          { title: "Clients actifs", value: apiStats.total_clients?.toString() || "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+0%" },
          { title: "Revenus totaux", value: apiStats.total_revenue ? `${apiStats.total_revenue.toLocaleString('fr-FR')} FCFA` : "0 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+0%" },
        ];
        setStats(transformedStats);

        // Fetch revenue per month
        const revenueResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/revenuePerMonth/${companyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
        });
        if (!revenueResponse.ok) {
          throw new Error(`Failed to fetch revenue: ${revenueResponse.status} ${revenueResponse.statusText}`);
        }
        const revenueData = await revenueResponse.json();
        if (!Array.isArray(revenueData)) {
          throw new Error("Invalid revenue response: not an array");
        }
        const transformedRevenue = [{
          id: "revenus",
          color: "#4CAF50",
          data: revenueData.map(item => ({
            x: item.mois,
            y: item.chiffre_affaire
          }))
        }];
        setRevenueData(transformedRevenue);

        // Fetch top 5 clients
        const clientsResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/topFiveClients/${companyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
        });
        if (!clientsResponse.ok) {
          throw new Error(`Failed to fetch top clients: ${clientsResponse.status} ${clientsResponse.statusText}`);
        }
        const clientsData = await clientsResponse.json();
        if (!Array.isArray(clientsData)) {
          throw new Error("Invalid clients response: not an array");
        }
        const transformedClients = clientsData.map(client => ({
          name: client.client_name,
          purchases: client.total_items,
          amount: `${client.total_purchases.toLocaleString('fr-FR')} FCFA`,
          growth: "+0%"
        }));
        setTopClients(transformedClients);

        // Fetch recent receipts
        const receiptsResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/5`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
        });
        if (!receiptsResponse.ok) {
          throw new Error(`Failed to fetch recent receipts: ${receiptsResponse.status} ${receiptsResponse.statusText}`);
        }
        const receiptsData = await receiptsResponse.json();
        if (!Array.isArray(receiptsData)) {
          throw new Error("Invalid receipts response: not an array");
        }
        const transformedReceipts = receiptsData.map(receipt => ({
          id: receipt.receipt_number,
          client: receipt.client_name,
          amount: `${receipt.total_amount.toLocaleString('fr-FR')} FCFA`,
          type: "Reçu",
          status: receipt.payment_status === "paid" ? "Payé" : "En attente",
          date: new Date(receipt.receipt_date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        }));
        setRecentReceipts(transformedReceipts);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Une erreur est survenue lors du chargement des données.");
        // Fallback data
        setStats([
          { title: "Reçus générés", value: "342", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+12%" },
          { title: "Documents créés", value: "128", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+8%" },
          { title: "Clients actifs", value: "89", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+25%" },
          { title: "Revenus totaux", value: "4,250,000 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+18%" },
        ]);
        setRevenueData([{
          id: "revenus",
          color: "#4CAF50",
          data: [
            { x: "Jan", y: 45000 },
            { x: "Fév", y: 52000 },
            { x: "Mar", y: 48000 },
            { x: "Avr", y: 67000 },
            { x: "Mai", y: 71000 },
            { x: "Juin", y: 59000 }
          ]
        }]);
        setTopClients([
          { name: "Boutique Elegance", purchases: 12, amount: "320,000 FCFA", growth: "+25%" },
          { name: "Restaurant Sahel", purchases: 8, amount: "280,000 FCFA", growth: "+18%" },
          { name: "Magasin Central", purchases: 6, amount: "195,000 FCFA", growth: "+12%" },
          { name: "Pharmacie Moderne", purchases: 5, amount: "150,000 FCFA", growth: "+8%" },
          { name: "Atelier Mécanique", purchases: 4, amount: "125,000 FCFA", growth: "+5%" },
        ]);
        setRecentReceipts([
          { id: "TKT-20250118-001", client: "Marie Kouassi", amount: "25,000 FCFA", type: "Reçu", status: "Payé", date: "18 Jan 2025" },
          { id: "TKT-20250118-002", client: "Ibrahim Moussa", amount: "45,000 FCFA", type: "Reçu", status: "En attente", date: "18 Jan 2025" },
          { id: "TKT-20250117-003", client: "Fatou Diallo", amount: "12,500 FCFA", type: "Reçu", status: "Payé", date: "17 Jan 2025" },
          { id: "TKT-20250117-004", client: "Kofi Asante", amount: "67,000 FCFA", type: "Reçu", status: "Payé", date: "17 Jan 2025" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Dashboard" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bonjour ! {username} 👋
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
                    <p className={`text-sm ${receipt.status === "Payé" ? "text-green-600" : "text-orange-600"}`}>
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