
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Search, Filter, Plus, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const AdminPartners = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const partners = [
    {
      id: "1",
      name: "TechCorp Solutions",
      email: "api@techcorp.com",
      status: "active",
      plan: "Enterprise",
      monthlyRequests: 45000,
      requestLimit: 50000,
      joinDate: "15 Mar 2024",
      lastActivity: "Il y a 2h"
    },
    {
      id: "2",
      name: "E-commerce Plus",
      email: "dev@ecommerceplus.com",
      status: "active",
      plan: "Professional",
      monthlyRequests: 28000,
      requestLimit: 30000,
      joinDate: "3 Avr 2024",
      lastActivity: "Il y a 1j"
    },
    {
      id: "3",
      name: "Mobile Apps Studio",
      email: "contact@mobileapps.ci",
      status: "pending",
      plan: "Starter",
      monthlyRequests: 0,
      requestLimit: 10000,
      joinDate: "12 Juin 2024",
      lastActivity: "Jamais"
    },
    {
      id: "4",
      name: "RetailTech Solutions",
      email: "api@retailtech.com",
      status: "suspended",
      plan: "Professional",
      monthlyRequests: 15000,
      requestLimit: 30000,
      joinDate: "20 Jan 2024",
      lastActivity: "Il y a 1 sem"
    }
  ];

  const statusConfig = {
    active: { label: "Actif", color: "bg-green-100 text-green-800", icon: CheckCircle },
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    suspended: { label: "Suspendu", color: "bg-red-100 text-red-800", icon: XCircle }
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Gestion des Partenaires" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <p className="text-sm text-gray-600">Total partenaires</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">142</div>
              <p className="text-sm text-gray-600">Actifs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-sm text-gray-600">En attente</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">6</div>
              <p className="text-sm text-gray-600">Suspendus</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
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
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau partenaire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partners List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Liste des partenaires ({filteredPartners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPartners.map((partner) => {
                const statusInfo = statusConfig[partner.status as keyof typeof statusConfig];
                const usagePercentage = (partner.monthlyRequests / partner.requestLimit) * 100;
                
                return (
                  <div
                    key={partner.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{partner.name}</h4>
                          <Badge className={statusInfo.color}>
                            <statusInfo.icon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline">{partner.plan}</Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{partner.email}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Inscription:</span>
                            <p className="font-medium">{partner.joinDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Dernière activité:</span>
                            <p className="font-medium">{partner.lastActivity}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Utilisation API:</span>
                            <p className="font-medium">
                              {partner.monthlyRequests.toLocaleString()} / {partner.requestLimit.toLocaleString()}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                            {partner.status === "pending" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approuver
                              </Button>
                            )}
                            {partner.status === "active" && (
                              <Button variant="destructive" size="sm">
                                Suspendre
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
                Affichage de 1 à {filteredPartners.length} sur {partners.length} partenaires
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

export default AdminPartners;
