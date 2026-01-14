import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Trash2, Users, Phone, Mail, MapPin, Plus, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 rounded-lg", className)} />
);

const fetchClients = async (companyId, token) => {
  if (!companyId) {
    throw new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
  }

  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/clients/${companyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (response.status === 404) {
    return { clients: [], noClientsFound: true };
  }

  if (!response.ok) {
    throw new Error(`Échec de la récupération des clients: ${response.status} ${response.statusText}`);
  }

  const clientsData = await response.json();
  if (!Array.isArray(clientsData)) {
    throw new Error("Réponse invalide: pas un tableau");
  }

  const transformedClients = clientsData.map(client => {
    const lastOrderDate = client.last_order_date ? new Date(client.last_order_date) : new Date(0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      id: client.client_id,
      name: client.client_name || "Client sans nom",
      email: client.client_email || "Non renseigné",
      phone: client.client_phone || "Non renseigné",
      address: client.client_address || "Non renseignée",
      totalOrders: client.total_receipts || 0,
      totalAmount: `${Math.round(client.total_spent || 0).toLocaleString('fr-FR')} FCFA`,
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

  const { data = { clients: [], noClientsFound: false }, isLoading, error } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: () => fetchClients(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });

  const { clients, noClientsFound } = data;

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: (clientId) => {
      queryClient.setQueryData(['clients', companyId], (oldData: any) => ({
        ...oldData,
        clients: oldData.clients.filter((c: any) => c.id !== clientId),
      }));
      toast.success("Client supprimé avec succès", { duration: 3000 });
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression du client.", { duration: 5000 });
    },
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const activeClients = clients.filter(c => c.status === "Actif").length;
  const totalRevenue = clients.reduce((sum, c) => {
    const amount = parseInt(c.totalAmount.replace(/[^\d]/g, ""), 10) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] mobile-nav-padding">
      <Toaster position="top-right" />

      <Header title="Gestion des Clients" showMenu={true} />

      <main className="pt-6 px-4 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />

        {/* Global Loading */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black" />
              <p className="text-lg font-medium text-gray-700">Chargement des clients...</p>
            </div>
          </div>,
          document.body
        )}

        {/* Error Overlay */}
        {error && createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Erreur de chargement</h3>
              <p className="text-gray-600 mb-6">
                {error.message.includes("ID de l'entreprise")
                  ? "Session invalide. Veuillez vous reconnecter."
                  : error.message || "Impossible de charger les clients."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {error.message.includes("ID de l'entreprise") && (
                  <Button className="bg-black hover:bg-black/90 text-white rounded-lg" onClick={() => window.location.href = "/login"}>
                    Se reconnecter
                  </Button>
                )}
                <Button variant="outline" className="rounded-lg border-gray-300 hover:bg-gray-50" onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Mes Clients</h1>
              <p className="text-lg text-gray-600">Gérez et suivez votre base de clientèle</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 text-lg rounded-xl border-gray-300 focus:border-black"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-black mt-2">{clients.length}</p>
              </div>
              <div className="w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                <p className="text-3xl font-bold text-black mt-2">{activeClients}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center border border-green-200">
                <Users className="w-7 h-7 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                <p className="text-3xl font-bold text-black mt-2">{totalRevenue.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">₣</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        {!isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">
                Liste des Clients ({filteredClients.length})
              </h2>
            </div>

            {noClientsFound || filteredClients.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  {noClientsFound ? "Aucun client enregistré" : "Aucun résultat"}
                </h3>
                <p className="text-lg text-gray-600">
                  {noClientsFound 
                    ? "Votre base de clients est vide. Les clients s’ajoutent automatiquement lors des ventes."
                    : "Aucun client ne correspond à votre recherche."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredClients.map((client) => (
                  <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-5 flex-1">
                        <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {client.name.split(' ').map(n => n[0]?.toUpperCase() || '').join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-black">{client.name}</h3>
                            <Badge className={cn(
                              "px-3 py-1 text-sm font-medium rounded-full",
                              client.status === "Actif"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-700 border border-gray-300"
                            )}>
                              {client.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-700 mt-3">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-500" />
                              <span>{client.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-500" />
                              <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-gray-500" />
                              <span>{client.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-500">Dernière commande :</span>
                              <span className="font-medium text-black">{client.lastOrder}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="text-right sm:text-left">
                          <p className="text-2xl font-bold text-black">{client.totalAmount}</p>
                          <p className="text-gray-600">{client.totalOrders} commande{client.totalOrders > 1 ? 's' : ''}</p>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-12 w-12 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold text-black">
                                Supprimer le client
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base text-gray-600">
                                Êtes-vous sûr de vouloir supprimer <strong>{client.name}</strong> ?<br />
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                              <AlertDialogCancel className="rounded-lg">Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                onClick={() => deleteMutation.mutate({ clientId: client.id, token })}
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default UserClients;