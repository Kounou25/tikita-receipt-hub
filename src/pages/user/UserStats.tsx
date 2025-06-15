
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, ShoppingBag, Users } from "lucide-react";

const UserStats = () => {
  const monthlyData = [
    { month: 'Jan', receipts: 65, revenue: 45000 },
    { month: 'Fév', receipts: 78, revenue: 52000 },
    { month: 'Mar', receipts: 90, revenue: 61000 },
    { month: 'Avr', receipts: 81, revenue: 58000 },
    { month: 'Mai', receipts: 95, revenue: 72000 },
    { month: 'Juin', receipts: 110, revenue: 85000 },
  ];

  const categoryData = [
    { name: 'Électronique', value: 35, color: '#4CAF50' },
    { name: 'Vêtements', value: 25, color: '#FF9800' },
    { name: 'Alimentation', value: 20, color: '#2196F3' },
    { name: 'Cosmétiques', value: 20, color: '#9C27B0' },
  ];

  const stats = [
    {
      title: "Revenus totaux",
      value: "385,000 FCFA",
      change: "+15.3%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Reçus générés",
      value: "519",
      change: "+8.2%",
      changeType: "increase",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Articles vendus",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase",
      icon: ShoppingBag,
      color: "text-purple-600"
    },
    {
      title: "Clients uniques",
      value: "89",
      change: "-2.1%",
      changeType: "decrease",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Statistiques" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === "increase" ? "text-green-500" : "text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Évolution des revenus (6 derniers mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `${value} FCFA` : value,
                      name === 'revenue' ? 'Revenus' : 'Reçus'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receipts Chart */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Reçus générés par mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="receipts" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Répartition par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Résumé des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">72%</div>
                <p className="text-gray-600">Taux de conversion</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4,321 FCFA</div>
                <p className="text-gray-600">Panier moyen</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <p className="text-gray-600">Délai moyen de paiement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserStats;
