
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Search, Filter, Eye, Ban, CheckCircle, XCircle, Crown } from "lucide-react";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: "1",
      name: "Jean Kouame",
      email: "jean.kouame@email.com",
      phone: "+225 07 12 34 56 78",
      company: "Boutique Jean",
      status: "active",
      plan: "Premium",
      receiptsCount: 1247,
      revenue: "385,000 FCFA",
      joinDate: "15 Jan 2024",
      lastLogin: "Il y a 2h",
      country: "Côte d'Ivoire"
    },
    {
      id: "2",
      name: "Marie Diallo",
      email: "marie.diallo@shop.com",
      phone: "+221 77 123 45 67",
      company: "Fashion Marie",
      status: "active",
      plan: "Basic",
      receiptsCount: 456,
      revenue: "125,000 FCFA",
      joinDate: "3 Fév 2024",
      lastLogin: "Il y a 1j",
      country: "Sénégal"
    },
    {
      id: "3",
      name: "Ahmed Traoré",
      email: "ahmed.traore@commerce.ml",
      phone: "+223 65 78 90 12",
      company: "Électronique Plus",
      status: "inactive",
      plan: "Premium",
      receiptsCount: 892,
      revenue: "290,000 FCFA",
      joinDate: "20 Mar 2024",
      lastLogin: "Il y a 2 sem",
      country: "Mali"
    },
    {
      id: "4",
      name: "Sophie Martin",
      email: "sophie.martin@beauty.bf",
      phone: "+226 70 11 22 33",
      company: "Cosmétiques Sophie",
      status: "suspended",
      plan: "Basic",
      receiptsCount: 234,
      revenue: "78,000 FCFA",
      joinDate: "5 Avr 2024",
      lastLogin: "Il y a 1 mois",
      country: "Burkina Faso"
    }
  ];

  const statusConfig = {
    active: { label: "Actif", color: "bg-green-100 text-green-800", icon: CheckCircle },
    inactive: { label: "Inactif", color: "bg-gray-100 text-gray-800", icon: XCircle },
    suspended: { label: "Suspendu", color: "bg-red-100 text-red-800", icon: Ban }
  };

  const planConfig = {
    Basic: { color: "bg-blue-100 text-blue-800" },
    Premium: { color: "bg-purple-100 text-purple-800" }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Gestion des Utilisateurs" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <p className="text-sm text-gray-600">Total utilisateurs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">2,456</div>
              <p className="text-sm text-gray-600">Actifs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">312</div>
              <p className="text-sm text-gray-600">Inactifs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">79</div>
              <p className="text-sm text-gray-600">Suspendus</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Liste des utilisateurs ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const statusInfo = statusConfig[user.status as keyof typeof statusConfig];
                const planInfo = planConfig[user.plan as keyof typeof planConfig];
                
                return (
                  <div
                    key={user.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <Badge className={statusInfo.color}>
                            <statusInfo.icon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge className={planInfo.color}>
                            {user.plan === "Premium" && <Crown className="w-3 h-3 mr-1" />}
                            {user.plan}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <p>{user.email}</p>
                          <p>{user.phone}</p>
                          <p><strong>Entreprise:</strong> {user.company}</p>
                          <p><strong>Pays:</strong> {user.country}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Inscription:</span>
                            <p className="font-medium">{user.joinDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Dernière connexion:</span>
                            <p className="font-medium">{user.lastLogin}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Reçus générés:</span>
                            <p className="font-medium">{user.receiptsCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Revenus totaux:</span>
                            <p className="font-medium">{user.revenue}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                            {user.status === "active" && (
                              <Button variant="destructive" size="sm">
                                <Ban className="w-4 h-4 mr-1" />
                                Suspendre
                              </Button>
                            )}
                            {user.status === "suspended" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Réactiver
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminUsers;
