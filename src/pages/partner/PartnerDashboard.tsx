
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { FileText, DollarSign, Users, TrendingUp, Eye, Key } from "lucide-react";

const PartnerDashboard = () => {
  const stats = [
    {
      title: "Reçus générés",
      value: "2,847",
      change: "+18%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Revenus générés",
      value: "1,245,890 FCFA",
      change: "+22%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Utilisateurs actifs",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Croissance API",
      value: "+35%",
      change: "Ce mois",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    {
      id: "API001",
      action: "Reçu généré",
      user: "Application Mobile X",
      amount: "15,000 FCFA",
      time: "Il y a 2 min"
    },
    {
      id: "API002",
      action: "Reçu généré",
      user: "Site E-commerce Y",
      amount: "28,500 FCFA",
      time: "Il y a 5 min"
    },
    {
      id: "API003",
      action: "Nouveau client",
      user: "Application Z",
      amount: "-",
      time: "Il y a 15 min"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Tableau de bord Partenaire" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Espace Partenaire API</h2>
          <p className="text-primary-50 mb-4">
            Gérez vos intégrations et suivez l'utilisation de l'API Tikita.
          </p>
          <div className="flex gap-3">
            <Button className="bg-white text-primary hover:bg-gray-50">
              <Key className="w-4 h-4 mr-2" />
              Gérer les clés API
            </Button>
          </div>
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

        {/* API Usage & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Utilisation API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Requêtes ce mois</span>
                  <span className="font-bold">12,847 / 50,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25.7%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de succès</span>
                  <span className="font-bold text-green-600">99.8%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temps de réponse moyen</span>
                  <span className="font-bold">120ms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                Activité récente
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.action}</h4>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.amount !== "-" && (
                      <div className="text-right">
                        <span className="font-bold text-primary">{activity.amount}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Ressources pour développeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Documentation API</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Guide complet d'intégration de l'API Tikita
                </p>
                <Button variant="outline" size="sm">Consulter</Button>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Exemples de code</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Exemples d'implémentation dans différents langages
                </p>
                <Button variant="outline" size="sm">Télécharger</Button>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Support technique</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Assistance dédiée aux partenaires API
                </p>
                <Button variant="outline" size="sm">Contacter</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PartnerDashboard;
