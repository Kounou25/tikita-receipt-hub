import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';import { getCookie, removeCookie } from "@/lib/cookies";import { formatCurrency, getCurrencyRate, getCurrencySymbol, convertStringAmount } from "@/utils/currencyFormatter";import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, TrendingUp, TrendingDown, ArrowUpRight, ArrowRight, Receipt, FileText, Users, Wallet, Calendar, DollarSign, Activity } from "lucide-react";

interface DashboardData {
  stats: Array<{
    titleKey: string;
    value: string;
    icon: any;
    trend: string;
    trendUp: boolean;
    color: string;
  }>;
  revenueData: Array<{
    id: string;
    color: string;
    data: Array<{ x: string; y: number }>;
  }>;
  topClients: Array<{
    name: string;
    purchases: number;
    amount: string;
  }>;
  recentReceipts: Array<{
    id: string;
    client: string;
    amount: string;
    type: string;
    statusKey: string;
    date: string;
  }>;
}
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import QuickNav from "@/components/layout/QuickNav";
import LineChart from "@/components/charts/LineChart";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 rounded-lg", className)} />
);

// Fonction pour fetch toutes les données en parallèle
const fetchDashboardData = async (companyId, token, t) => {
  const [statsResponse, revenueResponse, clientsResponse, receiptsResponse, allReceiptsResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/revenuePerMonth/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/topFiveClients/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/5`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    // Fetch all receipts for accurate total revenue calculation
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
  ]);

  if (!statsResponse.ok) {
    if (statsResponse.status === 500) throw new Error(`500: ${t('dashboard.serverErrorStats')}`);
    if (statsResponse.status === 401 || statsResponse.status === 409 || statsResponse.status === 403)
      throw new Error(`401/403/409: ${t('dashboard.sessionExpiredAuth')}`);
    if (statsResponse.status === 404) {
      return {
        stats: [
          { titleKey: "receiptsGenerated", value: "0", icon: Receipt, trend: "+0%", trendUp: false, color: "yellow" },
          { titleKey: "items", value: "0", icon: FileText, trend: "+0%", trendUp: false, color: "blue" },
          { titleKey: "activeClients", value: "0", icon: Users, trend: "+0%", trendUp: false, color: "green" },
          { titleKey: "totalRevenue", value: "0 FCFA", icon: Wallet, trend: "+0%", trendUp: false, color: "purple" },
        ],
        revenueData: null,
        topClients: null,
        recentReceipts: null,
      };
    }
    throw new Error(`${t('dashboard.failedLoadStats')}: ${statsResponse.status} ${statsResponse.statusText}`);
  }

  if (!revenueResponse.ok) {
    if (revenueResponse.status === 500) throw new Error(`500: ${t('dashboard.serverErrorRevenue')}`);
    if (revenueResponse.status === 401 || revenueResponse.status === 409 || revenueResponse.status === 403)
      throw new Error(`401/403/409: ${t('dashboard.sessionExpiredAuth')}`);
    if (revenueResponse.status === 404) {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
      });
      return {
        stats: null,
        revenueData: [{
          id: "revenus",
          color: "#000000",
          data: months.map(month => ({ x: month, y: 0 })),
        }],
        topClients: null,
        recentReceipts: null,
      };
    }
    throw new Error(`${t('dashboard.failedLoadRevenue')}: ${revenueResponse.status} ${revenueResponse.statusText}`);
  }

  if (!clientsResponse.ok) {
    if (clientsResponse.status === 500) throw new Error(`500: ${t('dashboard.serverErrorClients')}`);
    if (clientsResponse.status === 401 || clientsResponse.status === 409 || clientsResponse.status === 403)
      throw new Error(`401/403/409: ${t('dashboard.sessionExpiredAuth')}`);
    if (clientsResponse.status === 404) return { stats: null, revenueData: null, topClients: [], recentReceipts: null };
    throw new Error(`${t('dashboard.failedLoadClients')}: ${clientsResponse.status} ${clientsResponse.statusText}`);
  }

  if (!receiptsResponse.ok) {
    if (receiptsResponse.status === 500) throw new Error(`500: ${t('dashboard.serverErrorReceipts')}`);
    if (receiptsResponse.status === 401 || receiptsResponse.status === 409 || receiptsResponse.status === 403)
      throw new Error(`401/403/409: ${t('dashboard.sessionExpiredAuth')}`);
    if (receiptsResponse.status === 404) return { stats: null, revenueData: null, topClients: null, recentReceipts: [] };
    throw new Error(`${t('dashboard.failedLoadReceipts')}: ${receiptsResponse.status} ${receiptsResponse.statusText}`);
  }

  if (!allReceiptsResponse.ok && allReceiptsResponse.status !== 404) {
    console.warn('Failed to load all receipts for total calculation:', allReceiptsResponse.status);
  }

  const [statsData, revenueData, clientsData, receiptsData, allReceiptsData] = await Promise.all([
    statsResponse.json(),
    revenueResponse.json(),
    clientsResponse.json(),
    receiptsResponse.json(),
    allReceiptsResponse.ok ? allReceiptsResponse.json() : [],
  ]);

  // Calculate total revenue from actual receipts for consistency with ReceiptHistory page
  let calculatedTotalRevenue = 0;
  if (Array.isArray(allReceiptsData) && allReceiptsData.length > 0) {
    calculatedTotalRevenue = allReceiptsData.reduce((sum, receipt) => sum + (receipt.total_amount || 0), 0);
  }

  let stats = [
    { titleKey: "receiptsGenerated", value: "0", icon: Receipt, trend: "+0%", trendUp: false, color: "yellow" },
    { titleKey: "items", value: "0", icon: FileText, trend: "+0%", trendUp: false, color: "blue" },
    { titleKey: "activeClients", value: "0", icon: Users, trend: "+0%", trendUp: false, color: "green" },
    { titleKey: "totalRevenue", value: formatCurrency(0), icon: Wallet, trend: "+0%", trendUp: false, color: "purple" },
  ];

  if (Array.isArray(statsData) && statsData.length > 0) {
    const apiStats = statsData[0];
    stats = [
      { titleKey: "receiptsGenerated", value: apiStats.total_receipts?.toString() || "0", icon: Receipt, trend: "+12%", trendUp: true, color: "yellow" },
      { titleKey: "items", value: apiStats.total_items?.toString() || "0", icon: FileText, trend: "+8%", trendUp: true, color: "blue" },
      { titleKey: "activeClients", value: apiStats.total_clients?.toString() || "0", icon: Users, trend: "+23%", trendUp: true, color: "green" },
      { titleKey: "totalRevenue", value: formatCurrency(calculatedTotalRevenue), icon: Wallet, trend: "+15%", trendUp: true, color: "purple" },
    ];
  }

  let revenueTransformed = [{
    id: "revenus",
    color: "#000000",
    data: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return { x: date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' }), y: 0 };
    }),
  }];

  if (Array.isArray(revenueData) && revenueData.length > 0) {
    revenueTransformed = [{
      id: "revenus",
      color: "#000000",
      data: revenueData.map(item => ({ x: item.mois, y: item.chiffre_affaire })),
    }];
  }

  let clientsTransformed = [];
  if (Array.isArray(clientsData) && clientsData.length > 0) {
    clientsTransformed = clientsData.map(client => ({
      name: client.client_name,
      purchases: client.total_items,
      amount: formatCurrency(client.total_purchases || 0),
    }));
  }

  let receiptsTransformed = [];
  if (Array.isArray(receiptsData) && receiptsData.length > 0) {
    receiptsTransformed = receiptsData.map(receipt => ({
      id: receipt.receipt_number,
      client: receipt.client_name,
      amount: formatCurrency(receipt.total_amount || 0),
      type: "Reçu",
      statusKey: receipt.payment_status === "paid" ? "paid" : "pending",
      date: new Date(receipt.receipt_date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));
  }

  return { stats, revenueData: revenueTransformed, topClients: clientsTransformed, recentReceipts: receiptsTransformed };
};

const StatCard = ({ stat, isLoading }) => {
  const { t } = useTranslation();
  const colorClasses = {
    yellow: {
      bg: "bg-gradient-to-br from-yellow-300 to-yellow-400",
      iconBg: "bg-yellow-600/20",
      iconColor: "text-yellow-800",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-300 to-blue-400",
      iconBg: "bg-blue-600/20",
      iconColor: "text-blue-800",
    },
    green: {
      bg: "bg-gradient-to-br from-green-300 to-green-400",
      iconBg: "bg-green-600/20",
      iconColor: "text-green-800",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-300 to-purple-400",
      iconBg: "bg-purple-600/20",
      iconColor: "text-purple-800",
    },
  };

  const colors = colorClasses[stat.color] || colorClasses.yellow;

  if (isLoading) {
    return <Skeleton className="h-44" />;
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105",
      colors.bg
    )}>
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-black/80 mb-3 truncate" title={t(`dashboard.${stat.titleKey}`)}>
          {t(`dashboard.${stat.titleKey}`)}
        </h3>
        <div className="flex items-baseline gap-2 mb-4 overflow-hidden">
          <span className="text-4xl font-bold text-black break-words line-clamp-2" title={stat.value}>
            {stat.value}
          </span>
        </div>
        <p className="text-xs font-medium text-black/60 truncate">
          {t('dashboard.total')}
        </p>
      </div>
      
      {/* Icon décoratif */}
      <div className={cn(
        "absolute -right-4 -bottom-4 w-32 h-32 rounded-full flex items-center justify-center",
        colors.iconBg
      )}>
        <stat.icon className={cn("w-20 h-20", colors.iconColor)} />
      </div>
    </div>
  );
};

const UserDashboard = () => {
  useScrollToTop();
  const [show500Error, setShow500Error] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const username = getCookie("user_name") || "Utilisateur";
  const companyId = getCookie("company_id") || null;
  const token = getCookie("token") || null;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Apply currency conversion
  const rate = getCurrencyRate();
  const currencySymbol = getCurrencySymbol();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardData', companyId],
    queryFn: () => fetchDashboardData(companyId, token, t),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      if (error.message.includes("500")) {
        setShow500Error(true);
      } else if (error.message.includes("401/403/409")) {
        setShowSessionExpired(true);
      }
    }
  }, [error]);

  const stats = data?.stats || [
    { titleKey: "receiptsGenerated", value: "0", icon: Receipt, trend: "+0%", trendUp: false, color: "yellow" },
    { titleKey: "items", value: "0", icon: FileText, trend: "+0%", trendUp: false, color: "blue" },
    { titleKey: "activeClients", value: "0", icon: Users, trend: "+0%", trendUp: false, color: "green" },
    { titleKey: "totalRevenue", value: formatCurrency(0), icon: Wallet, trend: "+0%", trendUp: false, color: "purple" },
  ];

  const revenueData = data?.revenueData.map(series => ({
    ...series,
    data: series.data.map(point => ({
      ...point,
      y: point.y / rate
    }))
  })) || [{
    id: "revenus",
    color: "#000000",
    data: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return { x: date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' }), y: 0 };
    }),
  }];

  const topClients = data?.topClients || [];
  const recentReceipts = data?.recentReceipts || [];

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("user_name");
    removeCookie("company_id");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('dashboard.loading')}</span>
          </div>
        </div>
      )}
      
      <Header title={t('pages.dashboard')} />
      
      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />
        
        {/* Error Messages */}
        {error && !show500Error && !showSessionExpired && (
          <div className="mb-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error.message || t('dashboard.errorOccurred')}</p>
          </div>
        )}
        
        <AlertDialog open={show500Error} onOpenChange={setShow500Error}>
          <AlertDialogContent className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-white">{t('dashboard.connectionError')}</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                {t('dashboard.errorTryAgain')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg" 
                onClick={() => window.location.reload()}
              >
                {t('dashboard.retry')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog open={showSessionExpired} onOpenChange={setShowSessionExpired}>
          <AlertDialogContent className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-white">{t('dashboard.sessionExpired')}</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                {t('dashboard.sessionExpiredMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                className="bg-black hover:bg-black/90 text-white rounded-lg" 
                onClick={handleLogout}
              >
                {t('dashboard.reconnect')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Welcome Header */}
        {isLoading ? (
          <div className="mb-8 space-y-2">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-5 w-96" />
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              {t('dashboard.hello')}, {username} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('dashboard.activityOverview')}
            </p>
          </div>
        )}  
        
        {/* Quick Actions */}
        {isLoading ? (
          <div className="mb-8 flex gap-3">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-40" />
          </div>
        ) : (
          <div className="mb-8 flex flex-wrap gap-3">
            <Link to="/generate">
              <Button className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg px-6 h-11 font-medium shadow-sm">
                {t('dashboard.newReceipt')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/receipts">
              <Button 
                variant="outline" 
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white rounded-lg px-6 h-11 font-medium"
              >
                {t('dashboard.viewHistory')}
              </Button>
            </Link>
          </div>
        )}
        
        {/* Stats Grid avec nouveau design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} isLoading={isLoading} />
          ))}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-1">{t('dashboard.revenue')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.monthlyPerformance')}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    12 {t('dashboard.months')}
                  </Button>
                </div>
                <LineChart data={revenueData} height={300} />
              </div>
            )}
          </div>
          
          {/* Top Clients */}
          <div>
            {isLoading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-black dark:text-white">{t('dashboard.topClients')}</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                
                {topClients.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.noClients')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topClients.map((client, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-black dark:text-white text-sm">{client.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{client.purchases} {t('dashboard.purchases')}</p>
                          </div>
                        </div>
                        <p className="font-bold text-black dark:text-white text-sm">{client.amount}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Activity */}
        {isLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-1">{t('dashboard.recentActivity')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.recentTransactions')}</p>
              </div>
              <Link to="/receipts">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium"
                >
                  {t('dashboard.viewAll')}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {recentReceipts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.noRecentActivity')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.receipt')}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.client')}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.amount')}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.status')}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReceipts.map((receipt, i) => (
                      <tr 
                        key={i} 
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              <Receipt className="w-4 h-4 text-black dark:text-white" />
                            </div>
                            <span className="font-semibold text-sm text-black dark:text-white">{receipt.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{receipt.client}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-black dark:text-white">{receipt.amount}</td>
                        <td className="py-4 px-4">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                            receipt.statusKey === "paid" 
                              ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                              : "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                          )}>
                            {t(`dashboard.${receipt.statusKey}`)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{receipt.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default UserDashboard;