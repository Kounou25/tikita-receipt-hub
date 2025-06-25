
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Search, Trash2, Users, Phone, Mail, MapPin, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const UserClients = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    {
      id: 1,
      name: "Marie Kouassi",
      email: "marie.kouassi@email.com",
      phone: "+227 96 12 34 56",
      address: "Niamey, Niger",
      totalOrders: 15,
      totalAmount: "450,000 FCFA",
      lastOrder: "18 Jan 2025",
      status: "Actif"
    },
    {
      id: 2,
      name: "Ibrahim Moussa",
      email: "ibrahim.moussa@email.com",
      phone: "+227 97 23 45 67",
      address: "Maradi, Niger",
      totalOrders: 8,
      totalAmount: "280,000 FCFA",
      lastOrder: "15 Jan 2025",
      status: "Actif"
    },
    {
      id: 3,
      name: "Fatou Diallo",
      email: "fatou.diallo@email.com",
      phone: "+227 98 34 56 78",
      address: "Zinder, Niger",
      totalOrders: 12,
      totalAmount: "350,000 FCFA",
      lastOrder: "12 Jan 2025",
      status: "Actif"
    },
    {
      id: 4,
      name: "Kofi Asante",
      email: "kofi.asante@email.com",
      phone: "+227 99 45 67 89",
      address: "Dosso, Niger",
      totalOrders: 6,
      totalAmount: "180,000 FCFA",
      lastOrder: "10 Jan 2025",
      status: "Inactif"
    },
    {
      id: 5,
      name: "Aminata Traoré",
      email: "aminata.traore@email.com",
      phone: "+227 95 56 78 90",
      address: "Tahoua, Niger",
      totalOrders: 20,
      totalAmount: "650,000 FCFA",
      lastOrder: "20 Jan 2025",
      status: "Actif"
    },
    {
      id: 6,
      name: "Ousmane Sanogo",
      email: "ousmane.sanogo@email.com",
      phone: "+227 94 67 89 01",
      address: "Agadez, Niger",
      totalOrders: 3,
      totalAmount: "95,000 FCFA",
      lastOrder: "5 Jan 2025",
      status: "Inactif"
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleDeleteClient = (clientId: number) => {
    console.log(`Suppression du client ${clientId}`);
    // Logique de suppression ici
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Gestion des Clients" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Clients</h1>
            <p className="text-gray-600">Gérez votre base de clients</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau client
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un client par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.filter(c => c.status === "Actif").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.reduce((sum, client) => {
                      const amount = parseInt(client.totalAmount.replace(/[^\d]/g, ''));
                      return sum + amount;
                    }, 0).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Liste des Clients ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1 space-y-2 md:space-y-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === "Actif" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {client.address}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Dernière commande:</span>
                        {client.lastOrder}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{client.totalAmount}</p>
                      <p className="text-sm text-gray-600">{client.totalOrders} commandes</p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer <strong>{client.name}</strong> ? 
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteClient(client.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun client trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserClients;
