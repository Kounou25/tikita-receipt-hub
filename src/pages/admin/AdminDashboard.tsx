
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { Users, Building2, DollarSign, TrendingUp, FileText, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const stats = [
    {
      title: "Utilisateurs totaux",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Partenaires actifs",
      value: "156",
      change: "+8%",
      icon: Building2,
      color: "text-green-600"
    },
    {
      title: "Revenus mensuels",
      value: "845,230 FCFA",
      change: "+22%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Reçus générés",
      value: "15,847",
      change: "+18%",
      icon: FileText,
      color: "text-orange-600"
    }
  ];

  const monthlyData = [
    { month: 'Jan', users: 1250, partners: 45, revenue: 425000 },
    { month: 'Fév', users: 1480, partners: 52, revenue: 520000 },
    { month: 'Mar', users: 1720, partners: 68, revenue: 630000 },
    { month: 'Avr', users: 1950, partners: 89, revenue: 715000 },
    { month: 'Mai', users: 2340, partners: 124, revenue: 780000 },
    { month: 'Juin', users: 2847, partners: 156, revenue: 845000 },
  ];

  const recentActivity = [
    {
      type: "user",
      action: "Nouvel utilisateur inscrit",
      details: "Jean Kouame - Abidjan",
      time: "Il y a 5 min"
    },
    {
      type: "partner",
      action: "Nouveau partenaire approuvé",
      details: "TechSolutions SARL",
      time: "Il y a 15 min"
    },
    {
      type: "receipt",
      action: "Pic d'activité détecté",
      details: "1,247 reçus générés en 1h",
      time: "Il y a 30 min"
    },
    {
      type: "system",
      action: "Maintenance programmée",
      details: "Mise à jour de sécurité effectuée",
      time: "Il y a 2h"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Administration Générale" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Admin Welcome */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Administration Tikita</h2>
          </div>
          <p className="text-gray-300">
            Vue d'ensemble de la plateforme et des opérations en temps réel.
          </p>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Croissance des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#4CAF50" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Revenus mensuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} FCFA`, 'Revenus']} />
                    <Bar dataKey="revenue" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'partner' ? 'bg-green-500' :
                      activity.type === 'receipt' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                État du système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">API Principale</span>
                  </div>
                  <span className="text-green-600">Opérationnelle</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Base de données</span>
                  </div>
                  <span className="text-green-600">Opérationnelle</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-yellow-800">Serveur de fichiers</span>
                  </div>
                  <span className="text-yellow-600">Maintenance</span>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Métriques système</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temps de réponse moyen</span>
                      <span className="font-medium">145ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disponibilité (30j)</span>
                      <span className="font-medium text-green-600">99.97%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requêtes/minute</span>
                      <span className="font-medium">2,847</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
