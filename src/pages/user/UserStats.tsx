
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, BarChart3, Calendar, Filter } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserStats = () => {
  const [period, setPeriod] = useState("month");

  const stats = {
    totalReceipts: 245,
    totalRevenue: 1250000,
    avgReceiptValue: 5102,
    topClient: "Boutique Elegance",
    growthRate: 12.5,
    lastMonthReceipts: 189
  };

  // Données pour les graphiques
  const revenueData = [
    {
      id: "revenu",
      color: "#4CAF50",
      data: [
        { x: "Jan", y: 320000 },
        { x: "Fév", y: 390000 },
        { x: "Mar", y: 460000 },
        { x: "Avr", y: 425000 },
        { x: "Mai", y: 490000 },
        { x: "Juin", y: 560000 }
      ],
    }
  ];

  const documentsData = [
    {
      id: "Reçus",
      color: "#4CAF50",
      data: [
        { x: "Jan", y: 65 },
        { x: "Fév", y: 78 },
        { x: "Mar", y: 92 },
        { x: "Avr", y: 85 },
        { x: "Mai", y: 98 },
        { x: "Juin", y: 112 }
      ],
    },
    {
      id: "Factures",
      color: "#2196F3",
      data: [
        { x: "Jan", y: 45 },
        { x: "Fév", y: 52 },
        { x: "Mar", y: 63 },
        { x: "Avr", y: 59 },
        { x: "Mai", y: 67 },
        { x: "Juin", y: 75 }
      ],
    }
  ];

  const categoryData = [
    { id: "Vêtements", label: "Vêtements", value: 45, color: "#4CAF50" },
    { id: "Accessoires", label: "Accessoires", value: 30, color: "#2196F3" },
    { id: "Chaussures", label: "Chaussures", value: 25, color: "#9C27B0" }
  ];

  const clientsBarData = [
    { 
      client: "Client A",
      "Reçus": 12,
      "Factures": 8,
      "Total": 20
    },
    { 
      client: "Client B", 
      "Reçus": 18,
      "Factures": 6,
      "Total": 24
    },
    { 
      client: "Client C",
      "Reçus": 8,
      "Factures": 14,
      "Total": 22
    },
    { 
      client: "Client D",
      "Reçus": 15, 
      "Factures": 10,
      "Total": 25
    },
    { 
      client: "Client E", 
      "Reçus": 9,
      "Factures": 11, 
      "Total": 20
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 mobile-nav-padding">
      <Header title="Statistiques" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Period Selector */}
        <Card className="shadow-md border-0 dark:bg-gray-900 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium dark:text-white">Période:</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={period === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod("week")}
                  className={period === "week" ? "bg-primary hover:bg-primary-600" : ""}
                >
                  7 jours
                </Button>
                <Button
                  variant={period === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod("month")}
                  className={period === "month" ? "bg-primary hover:bg-primary-600" : ""}
                >
                  30 jours
                </Button>
                <Button
                  variant={period === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod("year")}
                  className={period === "year" ? "bg-primary hover:bg-primary-600" : ""}
                >
                  1 an
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all dark:bg-gray-900 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Documents générés</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReceipts}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats.growthRate}%</span>
                <span className="text-xs text-gray-500 ml-1">vs période préc.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all dark:bg-gray-900 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRevenue.toLocaleString()} <span className="text-base">FCFA</span></p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2%</span>
                <span className="text-xs text-gray-500 ml-1">vs période préc.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all dark:bg-gray-900 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Panier moyen</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgReceiptValue.toLocaleString()} <span className="text-base">FCFA</span></p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600 dark:text-red-400">-2.1%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs période préc.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all dark:bg-gray-900 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Clients actifs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">64</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+15%</span>
                <span className="text-xs text-gray-500 ml-1">vs période préc.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold dark:text-white">Évolution des revenus</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <LineChart data={revenueData} height={280} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold dark:text-white">Documents générés</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <LineChart data={documentsData} height={280} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <Tabs defaultValue="categories" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">Analyse détaillée</h2>
            <TabsList>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="clients">Top Clients</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="categories" className="mt-0">
            <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="h-96">
                  <PieChart data={categoryData} height={380} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-0">
            <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="h-96">
                  <BarChart 
                    data={clientsBarData} 
                    keys={["Reçus", "Factures"]}
                    indexBy="client"
                    height={380}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-0">
            <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - index);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center rounded-full mr-4">
                            <Calendar className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{2 + index} documents générés</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600 dark:text-primary-400">{(35000 + index * 2500).toLocaleString()} FCFA</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">de revenus</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Actions */}
        <div className="flex justify-end">
          <div className="space-x-4">
            <Button variant="outline">Exporter en PDF</Button>
            <Button variant="outline">Exporter en Excel</Button>
            <Button>Rapport détaillé</Button>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserStats;
