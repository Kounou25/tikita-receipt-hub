import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Search, UserPlus, Users, UserCheck, PowerOff, Star, DollarSign } from "lucide-react";

interface User {
  id: string;
  number: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  logoUrl?: string;
  plan: string;
  receipts: number;
  status: string;
  joinDate: string;
  lastActivity: string;
  revenue: number;
}

interface ApiUser {
  user_id: number;
  user_number: string | null;
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  user_created_at: string;
  company_id: number | null;
  company_name: string | null;
  company_slogan: string | null;
  company_phone_number: string | null;
  company_adress: string | null;
  nif: string | null;
  rccm: string | null;
  company_color: string | null;
  company_type: string | null;
  company_created_at: string | null;
  company_is_active: boolean | null;
  logo_url: string | null;
  plan_name: string | null;
  price_per_month: number | null;
  price_per_year: number | null;
  plan_max_receipts: number | null;
  plan_max_requests: number | null;
  total_receipts: number;
  total_revenue: number;
  subscription_status: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/admin/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const apiUsers: ApiUser[] = await response.json();
        
        const mappedUsers: User[] = apiUsers.map((apiUser) => ({
          id: apiUser.user_id.toString(),
          number: apiUser.user_number || "N/A",
          name: apiUser.full_name,
          email: apiUser.email,
          phone: apiUser.phone_number,
          company: apiUser.company_name || "N/A",
          logoUrl: apiUser.logo_url || undefined,
          plan: apiUser.plan_name || "Aucun",
          receipts: apiUser.total_receipts,
          status: apiUser.subscription_status === "active" ? "Actif" : "Inactif",
          joinDate: new Date(apiUser.user_created_at).toISOString().split("T")[0],
          lastActivity: apiUser.last_login ? new Date(apiUser.last_login).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          revenue: apiUser.total_revenue,
        }));
        
        setUsers(mappedUsers);
      } catch (err) {
        setError("Erreur lors de la récupération des utilisateurs");
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/admin/users/activate/${userId}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to activate user");
      }
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: "Actif" } : user
      ));
      const user = users.find(u => u.id === userId);
      toast({
        title: "Utilisateur activé",
        description: `${user?.name} (${user?.company}) a été activé avec succès.`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer l'utilisateur. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/admin/users/deactivate/${userId}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: "Inactif" } : user
      ));
      const user = users.find(u => u.id === userId);
      toast({
        title: "Utilisateur désactivé",
        description: `${user?.name} (${user?.company}) a été désactivé.`,
        variant: "destructive",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver l'utilisateur. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Inactif":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Boubeyni":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Entreprise":
        return "bg-orange-100 text-orange-800";
      case "Aucun":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Gestion des Utilisateurs" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
            <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, email, ID ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterPlan} onValueChange={setFilterPlan}>
                  <SelectTrigger className="w-[150px] border-gray-300">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les plans</SelectItem>
                    <SelectItem value="Boubeyni">Boubeyni</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Entreprise">Entreprise</SelectItem>
                    <SelectItem value="Aucun">Aucun</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px] border-gray-300">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {loading && (
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-gray-600">Chargement des utilisateurs...</p>
            </CardContent>
          </Card>
        )}
        {error && !loading && (
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === "Actif").length}
                </p>
                <p className="text-sm text-gray-600">Actifs</p>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.plan === "Boubeyni").length}
                </p>
                <p className="text-sm text-gray-600">Boubeyni</p>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  {users.reduce((sum, u) => sum + u.revenue, 0).toLocaleString()} FCFA
                </p>
                <p className="text-sm text-gray-600">Revenus totaux</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users List */}
        {!loading && !error && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Liste des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Utilisateur</th>
                      <th className="text-left楠0; left py-3 px-2 font-medium text-gray-700">Entreprise</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Contact</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Plan</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Reçus</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Revenus</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.number}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {user.logoUrl ? (
                              <img
                                src={user.logoUrl}
                                alt={`Logo ${user.company}`}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/48?text=NA";
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                                NA
                              </div>
                            )}
                            <p className="text-sm">{user.company}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="text-sm">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={getPlanColor(user.plan)}>
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-medium">{user.receipts}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-bold text-primary">{user.revenue.toLocaleString()} FCFA</span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            {user.status === "Actif" ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                onClick={() => handleDeactivateUser(user.id)}
                                title="Désactiver"
                              >
                                <PowerOff className="w-3 h-3" />
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-300 text-green-600 hover:bg-green-50"
                                onClick={() => handleActivateUser(user.id)}
                                title="Activer"
                              >
                                <UserCheck className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun utilisateur trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav userType="admin" />
    </div>
  );
};

export default AdminUsers;