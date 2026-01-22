
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Search, Eye, Edit, UserPlus, Building } from "lucide-react";

const AdminPartners = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const partners = [
    {
      id: "PTR-001",
      name: "TechCorp Solutions",
      contact: "Amadou Diallo",
      email: "contact@techcorp.ci",
      users: 1248,
      receipts: 15420,
      revenue: 2150000,
      status: "Actif",
      joinDate: "2024-01-15",
      commission: 15
    },
    {
      id: "PTR-002",
      name: "Digital Ivory",
      contact: "Sarah Kouamé",
      email: "info@digitalivy.com",
      users: 892,
      receipts: 8950,
      revenue: 1340000,
      status: "Actif",
      joinDate: "2024-02-01",
      commission: 12
    },
    {
      id: "PTR-003",
      name: "InnovateCorp",
      contact: "Pierre Yao",
      email: "pierre@innovate.ci",
      users: 445,
      receipts: 3200,
      revenue: 650000,
      status: "En attente",
      joinDate: "2024-02-15",
      commission: 10
    },
    {
      id: "PTR-004",
      name: "WebSolutions Pro",
      contact: "Marie Bamba",
      email: "marie@websolutions.ci",
      users: 156,
      receipts: 1850,
      revenue: 320000,
      status: "Suspendu",
      joinDate: "2024-01-30",
      commission: 8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Suspendu":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title={t('pages.admin_partners')} />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Partenaires</h2>
            <p className="text-gray-600">Gérez tous les partenaires de la plateforme</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un partenaire
          </Button>
        </div>

        {/* Search */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un partenaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
              <p className="text-sm text-gray-600">Total partenaires</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {partners.filter(p => p.status === "Actif").length}
              </p>
              <p className="text-sm text-gray-600">Actifs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {partners.reduce((sum, p) => sum + p.users, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Utilisateurs totaux</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {partners.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()} FCFA
              </p>
              <p className="text-sm text-gray-600">Revenus générés</p>
            </CardContent>
          </Card>
        </div>

        {/* Partners List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{partner.name}</CardTitle>
                    <p className="text-gray-600">{partner.contact}</p>
                    <p className="text-sm text-gray-500">{partner.email}</p>
                  </div>
                  <Badge className={getStatusColor(partner.status)}>
                    {partner.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{partner.users.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Utilisateurs</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{partner.receipts.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Reçus</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{partner.commission}%</p>
                    <p className="text-xs text-gray-600">Commission</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Revenus générés</span>
                    <span className="font-bold text-primary">{partner.revenue.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Membre depuis</span>
                    <span className="text-sm">{partner.joinDate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-300">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-gray-300">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Aucun partenaire trouvé</p>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default AdminPartners;
