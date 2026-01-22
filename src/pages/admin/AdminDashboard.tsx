
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { Users, UserCheck, FileText, DollarSign, TrendingUp, Activity, Bell, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const stats = [
    { title: "Utilisateurs totaux", value: "2,456", icon: Users, color: "text-blue-600", bg: "bg-blue-50", growth: "+12%" },
    { title: "Partenaires actifs", value: "89", icon: UserCheck, color: "text-green-600", bg: "bg-green-50", growth: "+8%" },
    { title: "Reçus générés", value: "45,678", icon: FileText, color: "text-purple-600", bg: "bg-purple-50", growth: "+25%" },
    { title: "Revenus totaux", value: "12,450,000 FCFA", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50", growth: "+18%" },
  ];

  // Charts data
  const platformGrowthData = [
    { id: "utilisateurs", data: [
      { x: "Jan", y: 1850 },
      { x: "Fév", y: 1920 },
      { x: "Mar", y: 2050 },
      { x: "Avr", y: 2180 },
      { x: "Mai", y: 2320 },
      { x: "Juin", y: 2456 }
    ]},
    { id: "partenaires", data: [
      { x: "Jan", y: 45 },
      { x: "Fév", y: 52 },
      { x: "Mar", y: 61 },
      { x: "Avr", y: 72 },
      { x: "Mai", y: 83 },
      { x: "Juin", y: 89 }
    ]}
  ];

  const revenueBySourceData = [
    { month: "Jan", abonnements: 2500000, commissions: 750000 },
    { month: "Fév", abonnements: 2800000, commissions: 840000 },
    { month: "Mar", abonnements: 3100000, commissions: 930000 },
    { month: "Avr", abonnements: 3400000, commissions: 1020000 },
    { month: "Mai", abonnements: 3700000, commissions: 1110000 },
    { month: "Juin", abonnements: 4050000, commissions: 1215000 }
  ];

  const userDistributionData = [
    { id: "gratuit", label: "Plan Gratuit", value: 65, color: "#6B7280" },
    { id: "pro", label: "Plan Pro", value: 28, color: "#10B981" },
    { id: "business", label: "Plan Business", value: 7, color: "#3B82F6" }
  ];

  const recentActivity = [
    { type: "user", message: "Nouvel utilisateur inscrit: Marie Kouassi", time: "Il y a 5 minutes", priority: "low" },
    { type: "partner", message: "Partenaire TechCorp a généré 150 reçus", time: "Il y a 1 heure", priority: "medium" },
    { type: "revenue", message: "Nouveau paiement reçu: 50,000 FCFA", time: "Il y a 2 heures", priority: "low" },
    { type: "alert", message: "Pic de trafic détecté: +200% d'activité", time: "Il y a 3 heures", priority: "high" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title={t('pages.admin_dashboard')} />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Vue d'ensemble */}
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vue d'ensemble de Tikiita 📊
                </h2>
                <p className="text-gray-600 mb-4">
                  Gérez la plateforme et surveillez les performances globales.
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Link to="/admin/notifications">
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </Link>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Dernière mise à jour</p>
                  <p className="font-medium text-gray-900">Il y a 2 minutes</p>
                </div>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Croissance de la plateforme</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={platformGrowthData} height={300} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Revenus par source</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={revenueBySourceData} 
                keys={["abonnements", "commissions"]} 
                indexBy="month" 
                height={300} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Répartition des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={userDistributionData} height={250} />
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Gestion système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les utilisateurs
                </Button>
              </Link>
              <Link to="/admin/partners">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Gérer les partenaires
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Paramètres système
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">État du système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Serveurs</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de données</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-orange-600">Maintenance</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-gray-900">99.9%</span>
              </div>
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
                    activity.priority === "high" ? "bg-red-500" :
                    activity.priority === "medium" ? "bg-orange-500" : 
                    "bg-blue-500"
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      {activity.priority === "high" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
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
