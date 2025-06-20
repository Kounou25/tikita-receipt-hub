import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Bell, Check, Trash2, Settings, AlertCircle, Users, Shield, TrendingUp, DollarSign, UserCheck } from "lucide-react";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "security",
      title: "Tentative de connexion suspecte",
      message: "Multiple tentatives de connexion depuis une IP non reconnue",
      time: "Il y a 10 minutes",
      read: false,
      icon: Shield,
      color: "text-red-600 bg-red-100",
      priority: "high"
    },
    {
      id: 2,
      type: "user",
      title: "Nouveau partenaire inscrit",
      message: "TechCorp Solutions a rejoint la plateforme",
      time: "Il y a 30 minutes",
      read: false,
      icon: UserCheck,
      color: "text-green-600 bg-green-100",
      priority: "medium"
    },
    {
      id: 3,
      type: "revenue",
      title: "Objectif mensuel atteint",
      message: "Les revenus de janvier ont dépassé l'objectif de 15%",
      time: "Il y a 1 heure",
      read: true,
      icon: DollarSign,
      color: "text-blue-600 bg-blue-100",
      priority: "low"
    },
    {
      id: 4,
      type: "system",
      title: "Maintenance programmée",
      message: "Maintenance système prévue demain à 02:00",
      time: "Il y a 2 heures",
      read: false,
      icon: AlertCircle,
      color: "text-orange-600 bg-orange-100",
      priority: "medium"
    },
    {
      id: 5,
      type: "users",
      title: "Pic d'activité utilisateurs",
      message: "1,200 utilisateurs actifs simultanément - nouveau record",
      time: "Il y a 3 heures",
      read: true,
      icon: Users,
      color: "text-purple-600 bg-purple-100",
      priority: "low"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.read).length;

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Critique";
      case "medium": return "Important";
      case "low": return "Info";
      default: return "Info";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Notifications Admin" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Header avec alertes critiques */}
        <div className="flex flex-col space-y-4">
          {highPriorityCount > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">
                      {highPriorityCount} notification{highPriorityCount > 1 ? 's' : ''} critique{highPriorityCount > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-700">Attention immédiate requise</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-primary-600" />
                Notifications Administrateur
                {unreadCount > 0 && (
                  <Badge className="bg-primary-600 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                Surveillance système et activité plateforme
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
                Paramètres alertes
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
              <div className="text-sm text-gray-600">Critiques</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.priority === "medium" && !n.read).length}
              </div>
              <div className="text-sm text-gray-600">Importantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Non lues</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`border-l-4 ${
              notification.priority === "high" ? "border-red-500" :
              notification.priority === "medium" ? "border-orange-500" :
              "border-gray-300"
            } ${notification.read ? 'bg-white' : 'bg-primary-50/30'} hover:shadow-md transition-all duration-200`}>
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
                        <Badge className={getPriorityColor(notification.priority)}>
                          {getPriorityLabel(notification.priority)}
                        </Badge>
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
                <p className="text-gray-600">Système surveillé, tout fonctionne normalement.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default AdminNotifications;
