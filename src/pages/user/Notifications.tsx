import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Bell, AlertCircle, FileText, CreditCard, Users, TrendingUp, Settings, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Composant Skeleton pour l'animation de chargement
const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);

// Fonction pour formater la date en durée relative
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

// Mapping des types de notification vers les icônes et couleurs
const notificationStyles = {
  abonnement: { icon: AlertCircle, color: "text-red-600 bg-red-100" },
  bienvenue: { icon: Users, color: "text-purple-600 bg-purple-100" },
  receipt: { icon: FileText, color: "text-blue-600 bg-blue-100" },
  payment: { icon: CreditCard, color: "text-green-600 bg-green-100" },
  stats: { icon: TrendingUp, color: "text-orange-600 bg-orange-100" },
  client: { icon: Users, color: "text-purple-600 bg-purple-100" },
};

// Fetch notifications
const fetchNotifications = async (companyId, token) => {
  if (!companyId) {
    throw new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.", { cause: "auth" });
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
      throw new Error("Session expirée", { cause: "auth" });
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
    color: notificationStyles[notif.type]?.color || "text-gray-600 bg-gray-100",
  }));
};

const Notifications = () => {
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;

  // Fetch notifications with useQuery
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications', companyId],
    queryFn: () => fetchNotifications(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    onError: (err) => {
      toast.error(err.message || "Une erreur est survenue lors du chargement des notifications.", { duration: 5000 });
    },
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
      n.time.includes("2 jours") || n.time.includes("semaine")
    );

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getNotificationsByDate();

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { zIndex: 10001 },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
      <Header title="Notifications" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Loading Overlay */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>,
          document.body
        )}

        {/* Error Popup */}
        {error && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">Erreur</h3>
                  <p className="text-gray-600 mb-4">
                    {error.cause === "auth"
                      ? "Votre session a expiré. Veuillez vous reconnecter."
                      : error.message || "Une erreur est survenue lors du chargement des notifications."}
                  </p>
                  <div className="flex justify-end gap-2">
                    {error.cause === "auth" && (
                      <Link to="/login">
                        <Button>Se connecter</Button>
                      </Link>
                    )}
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Réessayer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Main Content */}
        {!error && (
          <>
            {/* Header */}
            {isLoading ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="w-32 h-8" />
                  <Skeleton className="w-8 h-6 rounded-full" />
                </div>
                <Skeleton className="w-24 h-10" />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-primary-600" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge className="bg-primary-600 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Restez informé de toute l'activité de votre compte
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-6">
              {/* Today */}
              {isLoading ? (
                <div>
                  <Skeleton className="w-24 h-6 mb-4" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <Card key={index} className="border-l-4 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="w-48 h-5" />
                              <Skeleton className="w-64 h-4" />
                              <Skeleton className="w-24 h-3" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : today.length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Aujourd'hui</h2>
                  <div className="space-y-3">
                    {today.map((notification) => (
                      <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-500 bg-primary-50/30'} hover:shadow-md transition-all duration-200`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                              <notification.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Yesterday */}
              {yesterday.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Hier</h2>
                  <div className="space-y-3">
                    {yesterday.map((notification) => (
                      <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-500 bg-primary-50/30'} hover:shadow-md transition-all duration-200`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                              <notification.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {older.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Plus ancien</h2>
                  <div className="space-y-3">
                    {older.map((notification) => (
                      <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-500 bg-primary-50/30'} hover:shadow-md transition-all duration-200`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                              <notification.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {notifications.length === 0 && !isLoading && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                    <p className="text-gray-600">Vous êtes à jour ! Toutes vos notifications ont été traitées.</p>
                  </CardContent>
                </Card>
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