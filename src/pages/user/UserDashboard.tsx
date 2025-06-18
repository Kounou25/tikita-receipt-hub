
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Plus, FileText, BarChart3, TrendingUp, Users, DollarSign, Zap, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";

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
      icon: BarChart3, 
      color: "text-secondary-600", 
      bg: "bg-gradient-to-br from-secondary-50 to-secondary-100",
      gradient: "from-secondary-500 to-secondary-600"
    },
    { 
      title: "Recettes totales", 
      value: "2,450,000", 
      unit: "FCFA",
      change: "+18%",
      icon: DollarSign, 
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
    { id: "R001", client: "Amina Abdoul", amount: "45,000", date: "2024-01-15", status: "Payé", statusColor: "bg-green-100 text-green-800" },
    { id: "R002", client: "Ibrahim Moussa", amount: "78,500", date: "2024-01-14", status: "Payé", statusColor: "bg-green-100 text-green-800" },
    { id: "R003", client: "Fatouma Hassan", amount: "125,000", date: "2024-01-13", status: "En attente", statusColor: "bg-yellow-100 text-yellow-800" },
    { id: "R004", client: "Moussa Ali", amount: "32,000", date: "2024-01-12", status: "Payé", statusColor: "bg-green-100 text-green-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 mobile-nav-padding">
      <Header title="Tableau de bord" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Welcome Card avec gradient animé */}
        <Card className="border-0 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
                  Bienvenue sur Tikiita ! 
                </h2>
                <p className="text-white/90 text-lg mb-4 max-w-2xl">
                  Gérez intelligemment vos reçus et développez votre business avec 
                  notre plateforme révolutionnaire alimentée par IA.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Système opérationnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>IA activée</span>
                  </div>
                </div>
              </div>
              <Link to="/generate">
                <Button className="bg-white text-primary-700 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  Nouveau reçu intelligent
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid avec animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
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

        {/* Recent Receipts avec design moderne */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50 border-b border-gray-100">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Derniers reçus générés
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
                      Reçu
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
                            <span className="text-xs font-bold text-primary-700">#{receipt.id.slice(-2)}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{receipt.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.client}</div>
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
