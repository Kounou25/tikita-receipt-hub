
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Bell, Check, Trash2, Settings, Users, DollarSign, TrendingUp, FileText, AlertCircle } from "lucide-react";

const PartnerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "revenue",
      title: "Nouveau paiement de commission",
      message: "Commission de 15,750 FCFA créditée pour les reçus de janvier",
      time: "Il y a 30 minutes",
      read: false,
      icon: DollarSign,
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      type: "user",
      title: "Nouvel utilisateur actif",
      message: "Jean Ouattara a généré son premier reçu via votre partenariat",
      time: "Il y a 1 heure",
      read: false,
      icon: Users,
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      type: "stats",
      title: "Rapport d'activité disponible",
      message: "Votre rapport d'activité de janvier est prêt à consulter",
      time: "Il y a 2 heures",
      read: true,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      type: "receipts",
      title: "Pic d'activité détecté",
      message: "50 reçus générés par vos utilisateurs aujourd'hui",
      time: "Il y a 4 heures",
      read: true,
      icon: FileText,
      color: "text-orange-600 bg-orange-100"
    },
    {
      id: 5,
      type: "system",
      title: "Mise à jour partenaire",
      message: "Nouvelles fonctionnalités disponibles dans votre tableau de bord",
      time: "Il y a 1 jour",
      read: false,
      icon: AlertCircle,
      color: "text-indigo-600 bg-indigo-100"
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

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Notifications Partenaire" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="partner" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary-600" />
              Notifications Partenaire
              {unreadCount > 0 && (
                <Badge className="bg-primary-600 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Activité de vos utilisateurs et commissions
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
              Préférences
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">45,250</div>
              <div className="text-sm text-gray-600">FCFA ce mois</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">1,248</div>
              <div className="text-sm text-gray-600">Utilisateurs actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">3,420</div>
              <div className="text-sm text-gray-600">Reçus générés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">+15%</div>
              <div className="text-sm text-gray-600">Croissance</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
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

          {notifications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                <p className="text-gray-600">Vous êtes à jour avec toute l'activité de vos utilisateurs.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default PartnerNotifications;
