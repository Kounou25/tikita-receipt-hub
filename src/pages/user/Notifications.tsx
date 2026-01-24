import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Bell, AlertCircle, FileText, CreditCard, Users, TrendingUp, Settings, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getCookie } from "@/lib/cookies";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg", className)} />
);

const formatRelativeTime = (createdAt) => {
  const now = new Date();
  const date = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `Il y a ${diffInSeconds} seconde${diffInSeconds !== 1 ? 's' : ''}`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours !== 1 ? 's' : ''}`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays !== 1 ? 's' : ''}`;
  return `Il y a ${Math.floor(diffInDays / 7)} semaine${Math.floor(diffInDays / 7) !== 1 ? 's' : ''}`;
};

const notificationStyles = {
  abonnement: { icon: AlertCircle, color: "text-red-600 bg-red-50 border-red-200" },
  bienvenue: { icon: Users, color: "text-purple-600 bg-purple-50 border-purple-200" },
  receipt: { icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-200" },
  payment: { icon: CreditCard, color: "text-green-600 bg-green-50 border-green-200" },
  stats: { icon: TrendingUp, color: "text-orange-600 bg-orange-50 border-orange-200" },
  client: { icon: Users, color: "text-purple-600 bg-purple-50 border-purple-200" },
};

const fetchNotifications = async (companyId, token) => {
  if (!companyId) {
    const error: any = new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
    error.cause = "auth";
    throw error;
  }

  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/notifications/${companyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("Erreur serveur lors de la récupération des notifications");
    } else if (response.status === 409 || response.status === 403) {
      const error: any = new Error("Session expirée");
      error.cause = "auth";
      throw error;
    } else {
      throw new Error(`Échec de la récupération des notifications: ${response.status} ${response.statusText}`);
    }
  }

  const data = await response.json();
  return data.map((notif) => ({
    id: notif.notification_id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    time: formatRelativeTime(notif.created_at),
    read: notif.is_read,
    icon: notificationStyles[notif.type]?.icon || AlertCircle,
    color: notificationStyles[notif.type]?.color || "text-gray-600 bg-gray-50 border-gray-200",
  }));
};

const Notifications = () => {
  useScrollToTop();
  const companyId = getCookie("company_id") || null;
  const { t } = useTranslation();
  const token = getCookie("token") || null;

  const { data: notifications = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['notifications', companyId],
    queryFn: () => fetchNotifications(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationsByDate = () => {
    const today = notifications.filter((n) => 
      n.time.includes("minute") || n.time.includes("heure")
    );
    const yesterday = notifications.filter((n) => 
      n.time.includes("1 jour")
    );
    const older = notifications.filter((n) => 
      !today.includes(n) && !yesterday.includes(n)
    );

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getNotificationsByDate();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      <Toaster position="top-right" />

      <Header title={t('pages.notifications')} showMenu={true} />

      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />

        {/* Global Loading */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('notifications.loading')}</p>
            </div>
          </div>,
          document.body
        )}

        {/* Error Overlay */}
        {error && createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">{t('notifications.loadError')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {(error as any)?.cause === "auth"
                  ? "Votre session a expiré. Veuillez vous reconnecter."
                  : error.message || "Impossible de charger les notifications."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(error as any)?.cause === "auth" && (
                  <Link to="/login">
                    <Button className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg w-full sm:w-auto">
                      Se reconnecter
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  className="rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Main Content */}
        {!error && (
          <>
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-black flex items-center gap-3 mb-2">
                    <Bell className="w-8 h-8" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge className="bg-black text-white px-3 py-1 text-sm font-medium">
                        {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Restez informé de toute l’activité de votre compte
                  </p>
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-100">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-8">
              {/* Aujourd'hui */}
              {(isLoading || today.length > 0) && (
                <section>
                  <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t('notifications.today')}</h2>
                  <div className="space-y-4">
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                          <div className="flex items-start gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1 space-y-3">
                              <Skeleton className="h-6 w-64" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      today.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200",
                            !n.read && "border-l-4 border-l-black dark:border-l-white"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border", n.color)}>
                              <n.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn("font-semibold text-black dark:text-white", !n.read && "font-bold")}>
                                  {n.title}
                                </h3>
                                {!n.read && <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full" />}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">{n.message}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {/* Hier */}
              {yesterday.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t('notifications.yesterday')}</h2>
                  <div className="space-y-4">
                    {yesterday.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all",
                          !n.read && "border-l-4 border-l-black dark:border-l-white"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border", n.color)}>
                            <n.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={cn("font-semibold text-black dark:text-white", !n.read && "font-bold")}>{n.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1 mb-2">{n.message}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Plus ancien */}
              {older.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t('notifications.older')}</h2>
                  <div className="space-y-4">
                    {older.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all",
                          !n.read && "border-l-4 border-l-black dark:border-l-white"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border", n.color)}>
                            <n.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={cn("font-semibold text-black dark:text-white", !n.read && "font-bold")}>{n.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1 mb-2">{n.message}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {notifications.length === 0 && !isLoading && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-16 text-center hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('notifications.noNotifications')}</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">{t('notifications.upToDate')}</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default Notifications;