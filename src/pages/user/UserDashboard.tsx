
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Plus, FileText, BarChart, TrendingUp, Users, Zap, Eye, Download, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import UserProfileCard from "@/components/user/UserProfileCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LineChart from "@/components/charts/LineChart";

const UserDashboard = () => {
  const stats = [
    { 
      title: "Reçus générés", 
      value: "127", 
      change: "+12%",
      icon: FileText, 
      color: "text-primary-600", 
      bg: "bg-gradient-to-br from-primary-50 to-primary-100",
      gradient: "from-primary-500 to-primary-600"
    },
    { 
      title: "Articles vendus", 
      value: "1,456", 
      change: "+23%",
      icon: BarChart, 
      color: "text-secondary-600", 
      bg: "bg-gradient-to-br from-secondary-50 to-secondary-100",
      gradient: "from-secondary-500 to-secondary-600"
    },
    { 
      title: "Recettes totales", 
      value: "2,450,000", 
      unit: "FCFA",
      change: "+18%",
      icon: TrendingUp, 
      color: "text-accent-600", 
      bg: "bg-gradient-to-br from-accent-50 to-accent-100",
      gradient: "from-accent-500 to-accent-600"
    },
    { 
      title: "Clients actifs", 
      value: "89", 
      change: "+7%",
      icon: Users, 
      color: "text-emerald-600", 
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      gradient: "from-emerald-500 to-emerald-600"
    },
  ];

  const recentReceipts = [
    { id: "TKT-20250626-001", client: "Amina Abdoul", amount: "45,000", date: "2024-01-15", status: "Payé", statusColor: "bg-green-100 text-green-800", type: "reçu" },
    { id: "TKT-20250626-002", client: "Ibrahim Moussa", amount: "78,500", date: "2024-01-14", status: "Payé", statusColor: "bg-green-100 text-green-800", type: "facture" },
    { id: "TKT-20250625-003", client: "Fatouma Hassan", amount: "125,000", date: "2024-01-13", status: "En attente", statusColor: "bg-yellow-100 text-yellow-800", type: "facture" },
    { id: "TKT-20250625-004", client: "Moussa Ali", amount: "32,000", date: "2024-01-12", status: "Payé", statusColor: "bg-green-100 text-green-800", type: "reçu" },
  ];

  // Données pour le graphique
  const chartData = [
    {
      id: "Reçus",
      color: "hsl(142, 69%, 30%)",
      data: [
        { x: "Jan", y: 30 },
        { x: "Fév", y: 40 },
        { x: "Mar", y: 35 },
        { x: "Avr", y: 50 },
        { x: "Mai", y: 45 },
        { x: "Juin", y: 62 },
      ],
    },
    {
      id: "Factures",
      color: "hsl(210, 79%, 46%)",
      data: [
        { x: "Jan", y: 20 },
        { x: "Fév", y: 25 },
        { x: "Mar", y: 22 },
        { x: "Avr", y: 30 },
        { x: "Mai", y: 28 },
        { x: "Juin", y: 35 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 mobile-nav-padding">
      <Header title="Tableau de bord" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Profil utilisateur et informations d'abonnement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UserProfileCard 
            name="John Doe" 
            email="john.doe@example.com" 
            avatar="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces" 
            userNumber="TKT-USER-00125"
            subscriptionStatus="active"
            subscriptionType="Plan Premium"
            subscriptionEndDate="15 juillet 2024"
          />
          
          <Card className="col-span-1 lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100">
              <CardTitle className="text-lg font-semibold text-primary-800">Aperçu de l'activité</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <LineChart data={chartData} height={250} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Évolution des documents générés au cours des 6 derniers mois</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid avec animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className={`absolute inset-0 ${stat.bg} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      {stat.unit && <span className="text-sm text-gray-600 font-medium">{stat.unit}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Création de document - Deux options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Générer un Reçu</h3>
              <p className="mb-6 opacity-90">Créez rapidement un reçu de paiement pour vos clients</p>
              <Link to="/generate?type=receipt">
                <Button className="bg-white text-primary-700 hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau reçu
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Générer une Facture</h3>
              <p className="mb-6 opacity-90">Créez une facture professionnelle avec tous les détails nécessaires</p>
              <Link to="/generate?type=invoice">
                <Button className="bg-white text-secondary-700 hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle facture
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Receipts avec design moderne */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50 border-b border-gray-100">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Documents récents
              </CardTitle>
              <Link to="/receipts">
                <Button variant="outline" className="border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir tout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentReceipts.map((receipt, index) => (
                    <tr key={receipt.id} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-700">#{receipt.id.slice(-3)}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{receipt.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={receipt.type === "reçu" ? "border-primary-300 text-primary-800 bg-primary-50" : "border-secondary-300 text-secondary-800 bg-secondary-50"}>
                          {receipt.type === "reçu" ? "Reçu" : "Facture"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {receipt.client.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{receipt.client}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{receipt.amount} <span className="text-xs text-gray-500">FCFA</span></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{receipt.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${receipt.statusColor}`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserDashboard;
