import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import LineChart from "@/components/charts/LineChart";
import { Receipt, FileText, Users, TrendingUp, Plus, Eye, Download, Bell, Crown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);

// Fonction pour fetch toutes les données en parallèle
const fetchDashboardData = async (companyId, token) => {
  const [statsResponse, revenueResponse, clientsResponse, receiptsResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/revenuePerMonth/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/topFiveClients/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/5`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
  ]);

  // Vérifier les erreurs pour chaque réponse
  if (!statsResponse.ok) {
    if (statsResponse.status === 500) throw new Error("500: Erreur serveur pour les statistiques");
    if (statsResponse.status === 409 || statsResponse.status === 403) throw new Error("403/409: Session expirée");
    if (statsResponse.status === 404) {
      return {
        stats: [
          { title: "Reçus générés", value: "0", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+0%" },
          { title: "Documents créés", value: "0", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+0%" },
          { title: "Clients actifs", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+0%" },
          { title: "Revenus totaux", value: "0 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+0%" },
        ],
        revenueData: null,
        topClients: null,
        recentReceipts: null,
      };
    }
    throw new Error(`Échec du chargement des statistiques: ${statsResponse.status} ${statsResponse.statusText}`);
  }

  if (!revenueResponse.ok) {
    if (revenueResponse.status === 500) throw new Error("500: Erreur serveur pour les revenus");
    if (revenueResponse.status === 409 || revenueResponse.status === 403) throw new Error("403/409: Session expirée");
    if (revenueResponse.status === 404) {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
      });
      return {
        stats: null,
        revenueData: [{
          id: "revenus",
          color: "#4CAF50",
          data: months.map(month => ({ x: month, y: 0 })),
        }],
        topClients: null,
        recentReceipts: null,
      };
    }
    throw new Error(`Échec du chargement des revenus: ${revenueResponse.status} ${revenueResponse.statusText}`);
  }

  if (!clientsResponse.ok) {
    if (clientsResponse.status === 500) throw new Error("500: Erreur serveur pour les clients");
    if (clientsResponse.status === 409 || clientsResponse.status === 403) throw new Error("403/409: Session expirée");
    if (clientsResponse.status === 404) return { stats: null, revenueData: null, topClients: [], recentReceipts: null };
    throw new Error(`Échec du chargement des clients: ${clientsResponse.status} ${clientsResponse.statusText}`);
  }

  if (!receiptsResponse.ok) {
    if (receiptsResponse.status === 500) throw new Error("500: Erreur serveur pour les reçus");
    if (receiptsResponse.status === 409 || receiptsResponse.status === 403) throw new Error("403/409: Session expirée");
    if (receiptsResponse.status === 404) return { stats: null, revenueData: null, topClients: null, recentReceipts: [] };
    throw new Error(`Échec du chargement des reçus récents: ${receiptsResponse.status} ${receiptsResponse.statusText}`);
  }

  // Traiter les réponses valides
  const [statsData, revenueData, clientsData, receiptsData] = await Promise.all([
    statsResponse.json(),
    revenueResponse.json(),
    clientsResponse.json(),
    receiptsResponse.json(),
  ]);

  // Transformer les stats
  let stats = [
    { title: "Reçus générés", value: "0", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+0%" },
    { title: "Documents créés", value: "0", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+0%" },
    { title: "Clients actifs", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+0%" },
    { title: "Revenus totaux", value: "0 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+0%" },
  ];
  if (Array.isArray(statsData) && statsData.length > 0) {
    const apiStats = statsData[0];
    stats = [
      { title: "Reçus générés", value: apiStats.total_receipts?.toString() || "0", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+0%" },
      { title: "Documents créés", value: apiStats.total_items?.toString() || "0", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+0%" },
      { title: "Clients actifs", value: apiStats.total_clients?.toString() || "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+0%" },
      { title: "Revenus totaux", value: apiStats.total_revenue ? `${apiStats.total_revenue.toLocaleString('fr-FR')} FCFA` : "0 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+0%" },
    ];
  }

  // Transformer les revenus
  let revenueTransformed = [{
    id: "revenus",
    color: "#4CAF50",
    data: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return { x: date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' }), y: 0 };
    }),
  }];
  if (Array.isArray(revenueData) && revenueData.length > 0) {
    revenueTransformed = [{
      id: "revenus",
      color: "#4CAF50",
      data: revenueData.map(item => ({ x: item.mois, y: item.chiffre_affaire })),
    }];
  }

  // Transformer les clients
  let clientsTransformed = [];
  if (Array.isArray(clientsData) && clientsData.length > 0) {
    clientsTransformed = clientsData.map(client => ({
      name: client.client_name,
      purchases: client.total_items,
      amount: `${client.total_purchases.toLocaleString('fr-FR')} FCFA`,
      growth: "+0%",
    }));
  }

  // Transformer les reçus
  let receiptsTransformed = [];
  if (Array.isArray(receiptsData) && receiptsData.length > 0) {
    receiptsTransformed = receiptsData.map(receipt => ({
      id: receipt.receipt_number,
      client: receipt.client_name,
      amount: `${receipt.total_amount.toLocaleString('fr-FR')} FCFA`,
      type: "Reçu",
      status: receipt.payment_status === "paid" ? "Payé" : "En attente",
      date: new Date(receipt.receipt_date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));
  }

  return { stats, revenueData: revenueTransformed, topClients: clientsTransformed, recentReceipts: receiptsTransformed };
};

const UserDashboard = () => {
  const [show500Error, setShow500Error] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const username = localStorage.getItem("user_name") || "Utilisateur";
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;
  const navigate = useNavigate();

  // Utiliser react-query pour gérer les requêtes
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', companyId],
    queryFn: () => fetchDashboardData(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    onError: (err) => {
      if (err.message.includes("500")) {
        setShow500Error(true);
      } else if (err.message.includes("403/409")) {
        setShowSessionExpired(true);
      }
    },
  });

  // Définir les états à partir des données ou valeurs par défaut
  const stats = data?.stats || [
    { title: "Reçus générés", value: "0", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50", growth: "+0%" },
    { title: "Documents créés", value: "0", icon: FileText, color: "text-green-600", bg: "bg-green-50", growth: "+0%" },
    { title: "Clients actifs", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50", growth: "+0%" },
    { title: "Revenus totaux", value: "0 FCFA", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", growth: "+0%" },
  ];
  const revenueData = data?.revenueData || [{
    id: "revenus",
    color: "#4CAF50",
    data: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return { x: date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' }), y: 0 };
    }),
  }];
  const topClients = data?.topClients || [];
  const recentReceipts = data?.recentReceipts || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("company_id");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 mobile-nav-padding">
      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      <Header title="Dashboard" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Error Message */}
        {error && !show500Error && !showSessionExpired && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error.message || "Une erreur est survenue lors du chargement des données."}</p>
            </CardContent>
          </Card>
        )}

        {/* Error 500 Dialog */}
        <AlertDialog open={show500Error} onOpenChange={setShow500Error}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Erreur de connexion</AlertDialogTitle>
              <AlertDialogDescription>
                Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion internet et réessayer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => window.location.reload()}>
                Réessayer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Session Expired Dialog */}
        <AlertDialog open={showSessionExpired} onOpenChange={setShowSessionExpired}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Session expirée</AlertDialogTitle>
              <AlertDialogDescription>
                Votre session a expiré. Veuillez vous reconnecter pour continuer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleLogout}>
                Se connecter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Welcome Section */}
        {isLoading ? (
          <Card className="border-primary">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full max-w-md" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
              <Skeleton className="h-8 w-32 md:ml-auto" />
            </CardContent>
          </Card>
        ) : (
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
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </CardContent>
                </Card>
              ))
          ) : (
            stats.map((stat, index) => (
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
            ))
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <Card className="border-gray-200">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  {Array(5)
                    .fill(null)
                    .map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
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
                  {topClients.length === 0 ? (
                    <p className="text-gray-600 text-center">Aucun client de premier plan disponible</p>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Activity */}
        {isLoading ? (
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ) : (
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
              {recentReceipts.length === 0 ? (
                <p className="text-gray-600 text-center">Aucune activité récente disponible</p>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserDashboard;