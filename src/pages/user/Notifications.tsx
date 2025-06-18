
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Bell, Check, Trash2, Settings, AlertCircle, FileText, CreditCard, Users, TrendingUp } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "receipt",
      title: "Nouveau reçu généré",
      message: "Votre reçu TKT-20250118-001 a été créé avec succès",
      time: "Il y a 5 minutes",
      read: false,
      icon: FileText,
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 2,
      type: "payment",
      title: "Paiement reçu",
      message: "Nouveau paiement de 25,000 FCFA - Facture TKT-20250118-002",
      time: "Il y a 1 heure",
      read: false,
      icon: CreditCard,
      color: "text-green-600 bg-green-100"
    },
    {
      id: 3,
      type: "client",
      title: "Nouveau client",
      message: "Marie Kouassi a été ajoutée à votre liste de clients",
      time: "Il y a 2 heures",
      read: true,
      icon: Users,
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      type: "stats",
      title: "Rapport mensuel",
      message: "Vos statistiques de janvier sont disponibles",
      time: "Il y a 1 jour",
      read: true,
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-100"
    },
    {
      id: 5,
      type: "alert",
      title: "Limite d'abonnement",
      message: "Vous avez utilisé 80% de vos reçus gratuits ce mois",
      time: "Il y a 2 jours",
      read: false,
      icon: AlertCircle,
      color: "text-red-600 bg-red-100"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationsByDate = () => {
    const today = notifications.filter(n => 
      n.time.includes("minute") || n.time.includes("heure")
    );
    const yesterday = notifications.filter(n => 
      n.time.includes("1 jour")
    );
    const older = notifications.filter(n => 
      n.time.includes("2 jours") || n.time.includes("semaine")
    );

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getNotificationsByDate();

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Notifications" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Header */}
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
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                className="text-sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {/* Today */}
          {today.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aujourd'hui</h2>
              <div className="space-y-3">
                {today.map((notification) => (
                  <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-500 bg-primary-50/30'} hover:shadow-md transition-all duration-200`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
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
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Yesterday */}
          {yesterday.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hier</h2>
              <div className="space-y-3">
                {yesterday.map((notification) => (
                  <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-500 bg-primary-50/30'} hover:shadow-md transition-all duration-200`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
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
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
                      <div className="flex items-start justify-between">
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
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {notifications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                <p className="text-gray-600">Vous êtes à jour ! Toutes vos notifications ont été traitées.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Notifications;
