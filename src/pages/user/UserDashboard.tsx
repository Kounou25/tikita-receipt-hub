
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { FileText, DollarSign, ShoppingBag, TrendingUp, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const stats = [
    {
      title: "Reçus générés",
      value: "1,234",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Articles vendus",
      value: "5,678",
      change: "+8%",
      icon: ShoppingBag,
      color: "text-green-600"
    },
    {
      title: "Recettes totales",
      value: "245,890 FCFA",
      change: "+15%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Croissance",
      value: "+24%",
      change: "Ce mois",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentReceipts = [
    {
      id: "R001234",
      client: "Jean Dupont",
      amount: "25,000 FCFA",
      date: "15 Juin 2024",
      status: "Payé"
    },
    {
      id: "R001235",
      client: "Marie Kouakou",
      amount: "18,500 FCFA",
      date: "14 Juin 2024",
      status: "Payé"
    },
    {
      id: "R001236",
      client: "Ahmed Hassan",
      amount: "42,000 FCFA",
      date: "14 Juin 2024",
      status: "En attente"
    },
    {
      id: "R001237",
      client: "Sophie Martin",
      amount: "12,500 FCFA",
      date: "13 Juin 2024",
      status: "Payé"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Tableau de bord" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Bonjour ! 👋</h2>
          <p className="text-primary-50 mb-4">
            Voici un aperçu de votre activité commerciale aujourd'hui.
          </p>
          <Link to="/generate">
            <Button className="bg-white text-primary hover:bg-gray-50">
              <Plus className="w-4 h-4 mr-2" />
              Créer un nouveau reçu
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
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
                <Eye className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{receipt.client}</h4>
                      <span className="font-bold text-primary">{receipt.amount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Reçu #{receipt.id}</span>
                      <span>{receipt.date}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receipt.status === "Payé"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {receipt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/generate">
            <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Nouveau reçu</h3>
                <p className="text-sm text-gray-600">Créer un reçu rapidement</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/stats">
            <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Statistiques</h3>
                <p className="text-sm text-gray-600">Voir vos performances</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Mon profil</h3>
                <p className="text-sm text-gray-600">Gérer mes informations</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserDashboard;
