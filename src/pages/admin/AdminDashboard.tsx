
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Users, UserCheck, FileText, DollarSign, TrendingUp, Activity } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Utilisateurs totaux", value: "2,456", icon: Users, color: "text-blue-600", bg: "bg-blue-50", growth: "+12%" },
    { title: "Partenaires actifs", value: "89", icon: UserCheck, color: "text-green-600", bg: "bg-green-50", growth: "+8%" },
    { title: "Reçus générés", value: "45,678", icon: FileText, color: "text-purple-600", bg: "bg-purple-50", growth: "+25%" },
    { title: "Revenus totaux", value: "12,450,000 FCFA", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50", growth: "+18%" },
  ];

  const recentActivity = [
    { type: "user", message: "Nouvel utilisateur inscrit: Marie Kouassi", time: "Il y a 5 minutes" },
    { type: "partner", message: "Partenaire TechCorp a généré 150 reçus", time: "Il y a 1 heure" },
    { type: "revenue", message: "Nouveau paiement reçu: 50,000 FCFA", time: "Il y a 2 heures" },
    { type: "user", message: "Plan Premium souscrit par Jean Ouattara", time: "Il y a 3 heures" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Dashboard Administrateur" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Vue d'ensemble */}
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vue d'ensemble de Tikita 📊
                </h2>
                <p className="text-gray-600 mb-4">
                  Gérez la plateforme et surveillez les performances globales.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Dernière mise à jour</p>
                <p className="font-medium text-gray-900">Il y a 2 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques globales */}
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

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Voir tous les utilisateurs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="w-4 h-4 mr-2" />
                Gérer les partenaires
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Finances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Rapport financier
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyse des revenus
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                État du système
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Logs d'activité
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "user" ? "bg-blue-500" :
                    activity.type === "partner" ? "bg-green-500" : "bg-orange-500"
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default AdminDashboard;
