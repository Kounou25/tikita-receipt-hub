
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Search, Eye, Edit, UserPlus, Users, Filter } from "lucide-react";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const users = [
    {
      id: "USR-001",
      name: "Marie Kouassi",
      email: "marie.kouassi@gmail.com",
      phone: "+225 01 23 45 67",
      plan: "Premium",
      receipts: 156,
      status: "Actif",
      joinDate: "2024-01-15",
      lastLogin: "Il y a 2h",
      revenue: 780000
    },
    {
      id: "USR-002",
      name: "Jean Brou",
      email: "jean.brou@outlook.com",
      phone: "+225 07 89 12 34",
      plan: "Basic",
      receipts: 89,
      status: "Actif",
      joinDate: "2024-02-01",
      lastLogin: "Il y a 1j",
      revenue: 445000
    },
    {
      id: "USR-003",
      name: "Fatou Diallo",
      email: "fatou.diallo@yahoo.fr",
      phone: "+225 05 67 89 01",
      plan: "Entreprise",
      receipts: 324,
      status: "Actif",
      joinDate: "2024-01-20",
      lastLogin: "Il y a 30min",
      revenue: 1620000
    },
    {
      id: "USR-004",
      name: "Kofi Asante",
      email: "kofi.asante@gmail.com",
      phone: "+225 02 34 56 78",
      plan: "Basic",
      receipts: 45,
      status: "Inactif",
      joinDate: "2024-02-10",
      lastLogin: "Il y a 1 semaine",
      revenue: 225000
    },
    {
      id: "USR-005",
      name: "Aïcha Traoré",
      email: "aicha.traore@hotmail.com",
      phone: "+225 09 87 65 43",
      plan: "Premium",
      receipts: 198,
      status: "Suspendu",
      joinDate: "2024-01-25",
      lastLogin: "Il y a 3j",
      revenue: 990000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Inactif":
        return "bg-gray-100 text-gray-800";
      case "Suspendu":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Entreprise":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
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
                    placeholder="Rechercher un utilisateur..."
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
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Entreprise">Entreprise</SelectItem>
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
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
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
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === "Actif").length}
              </p>
              <p className="text-sm text-gray-600">Actifs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.plan === "Premium").length}
              </p>
              <p className="text-sm text-gray-600">Premium</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {users.reduce((sum, u) => sum + u.revenue, 0).toLocaleString()} FCFA
              </p>
              <p className="text-sm text-gray-600">Revenus totaux</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
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
                          <p className="text-sm text-gray-500">{user.id}</p>
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
                          <Button variant="outline" size="sm" className="border-gray-300">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300">
                            <Edit className="w-3 h-3" />
                          </Button>
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
      </main>

      <MobileNav />
    </div>
  );
};

export default AdminUsers;
