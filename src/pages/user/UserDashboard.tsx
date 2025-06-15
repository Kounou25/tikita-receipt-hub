
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Plus, FileText, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const stats = [
    { title: "Reçus générés", value: "127", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Articles vendus", value: "1,456", icon: BarChart3, color: "text-green-600", bg: "bg-green-50" },
    { title: "Recettes totales", value: "2,450,000 FCFA", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Clients actifs", value: "89", icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const recentReceipts = [
    { id: "R001", client: "Marie Kouassi", amount: "45,000 FCFA", date: "2024-01-15", status: "Payé" },
    { id: "R002", client: "Jean Ouattara", amount: "78,500 FCFA", date: "2024-01-14", status: "Payé" },
    { id: "R003", client: "Fatou Traoré", amount: "125,000 FCFA", date: "2024-01-13", status: "En attente" },
    { id: "R004", client: "Kofi Asante", amount: "32,000 FCFA", date: "2024-01-12", status: "Payé" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Tableau de bord" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Welcome Card */}
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue sur Tikita ! 👋
                </h2>
                <p className="text-gray-600 mb-4">
                  Gérez facilement vos reçus et suivez vos performances commerciales.
                </p>
              </div>
              <Link to="/generate">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau reçu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Receipts */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              Derniers reçus générés
            </CardTitle>
            <Link to="/receipts">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reçu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{receipt.client}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{receipt.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          receipt.status === "Payé" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {receipt.status}
                        </span>
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
