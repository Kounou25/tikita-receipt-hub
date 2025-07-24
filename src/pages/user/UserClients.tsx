import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Trash2, Users, Phone, Mail, MapPin, Plus, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Define Skeleton component
const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);

// Function to fetch clients
const fetchClients = async (companyId, token) => {
  if (!companyId) {
    throw new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
  }

  // Use Promise.all for potential multiple requests
  const [clientsResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/clients/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }),
  ]);

  if (clientsResponse.status === 404) {
    return { clients: [], noClientsFound: true };
  }

  if (!clientsResponse.ok) {
    throw new Error(`Échec de la récupération des clients: ${clientsResponse.status} ${clientsResponse.statusText}`);
  }

  const clientsData = await clientsResponse.json();
  if (!Array.isArray(clientsData)) {
    throw new Error("Réponse invalide: pas un tableau");
  }

  const transformedClients = clientsData.map(client => {
    const lastOrderDate = new Date(client.last_order_date);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    return {
      id: client.client_id,
      name: client.client_name,
      email: client.client_email,
      phone: client.client_phone,
      address: client.client_address,
      totalOrders: client.total_receipts,
      totalAmount: `${Math.round(client.total_spent).toLocaleString('fr-FR')} FCFA`,
      lastOrder: lastOrderDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: lastOrderDate >= thirtyDaysAgo ? "Actif" : "Inactif"
    };
  });

  return { clients: transformedClients, noClientsFound: false };
};

// Function to delete a client
const deleteClient = async ({ clientId, token }) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/clients/client/delete/${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Échec de la suppression du client: ${response.status} ${response.statusText}`);
  }

  return clientId;
};

const UserClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;
  const queryClient = useQueryClient();

  // Fetch clients with useQuery
  const { data = { clients: [], noClientsFound: false }, isLoading, error } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: () => fetchClients(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { clients, noClientsFound } = data;

  // Handle deletion with useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: (clientId) => {
      // Update client list locally
      queryClient.setQueryData(['clients', companyId], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.clients)) {
          return oldData;
        }
        return {
          ...oldData,
          clients: oldData.clients.filter((client: any) => client.id !== clientId),
        };
      });
      toast.success("Client supprimé avec succès", { duration: 3000 });
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      toast.error(error.message || "Une erreur est survenue lors de la suppression du client.", { duration: 5000 });
    },
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 10001,
          },
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
      <Header title="Gestion des Clients" />
      
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
                    {error.message.includes("ID de l'entreprise non défini")
                      ? "ID de l'entreprise non défini. Veuillez vous reconnecter."
                      : error.message || "Une erreur est survenue lors du chargement des clients."}
                  </p>
                  <div className="flex justify-end gap-2">
                    {error.message.includes("ID de l'entreprise non défini") && (
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

        {/* Header Section */}
        {isLoading ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        ) : (
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
        )}

        {/* Search Bar */}
        {isLoading ? (
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : (
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
        )}

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="w-12 h-12 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {clients.length || 0}
                    </p>
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
                      }, 0).toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clients List */}
        {isLoading ? (
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-16 rounded-full" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ) : noClientsFound ? (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Liste des Clients (0)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 animate-pulse">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-[pulse_1.5s_ease-in-out_infinite]" />
                <p className="text-gray-500 text-lg font-medium">Aucun client trouvé pour cette entreprise</p>
                <p className="text-gray-400 mt-2">Ajoutez un nouveau client pour commencer.</p>
                <Button className="mt-4 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau client
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                        {createPortal(
                          <AlertDialogContent className="z-[10000]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer <strong>{client.name}</strong> ? 
                                Cette action ne peut pas être annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-end gap-2 pt-4">
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteMutation.mutate({ clientId: client.id, token })}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>,
                          document.body
                        )}
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>

              {filteredClients.length === 0 && !noClientsFound && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun client trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default UserClients;