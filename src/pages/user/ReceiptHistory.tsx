import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Search, Download, Eye, Filter, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);

const ErrorPopup = ({ message, onClose, actionButton }) => createPortal(
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000]">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-lg mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            {actionButton}
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>,
  document.body
);

// Fonction pour déterminer le type d'erreur
const getErrorType = (error) => {
  if (!error) return null;
  if (error.message.includes("500")) return "server";
  if (error.message.includes("403/409") || error.message.includes("ID de l'entreprise non défini")) return "auth";
  if (error.message.includes("404")) return "not_found";
  return "generic";
};

// Fonction pour récupérer les reçus
const fetchReceipts = async (companyId, token) => {
  if (!companyId) {
    throw new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
  }

  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/0`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("500: Erreur serveur lors de la récupération des reçus");
    } else if (response.status === 409 || response.status === 403) {
      throw new Error("403/409: Session expirée");
    } else if (response.status === 404) {
      throw new Error("404: Aucune donnée trouvée");
    } else {
      throw new Error(`Échec de la récupération des reçus: ${response.status} ${response.statusText}`);
    }
  }

  const receiptsData = await response.json();
  if (!Array.isArray(receiptsData)) {
    throw new Error("Réponse invalide: pas un tableau");
  }

  return receiptsData.map(receipt => ({
    id: receipt.receipt_id,
    receipt_number: receipt.receipt_number,
    client: receipt.client_name || "Client inconnu",
    amount: `${receipt.total_amount.toLocaleString('fr-FR')} FCFA`,
    raw_amount: receipt.total_amount || 0,
    date: receipt.receipt_date
      ? new Date(receipt.receipt_date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : 'Date inconnue',
    status: receipt.payment_status === "paid" ? "Payé" : "En attente",
    items: receipt.total_items || 0,
  }));
};

// Fonction pour télécharger un PDF
const downloadPDF = async ({ id, token }) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${id}`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Échec du téléchargement du PDF: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  return { blob, id };
};

const ReceiptHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadError, setDownloadError] = useState(null);
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;
  const navigate = useNavigate();

  // Gérer les reçus avec useQuery
  const { data: receipts = [], isLoading, error } = useQuery({
    queryKey: ['receipts', companyId],
    queryFn: () => fetchReceipts(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });

  // Gérer le téléchargement PDF avec useMutation
  const downloadMutation = useMutation({
    mutationFn: downloadPDF,
    onMutate: ({ id }) => {
      setDownloadError(null);
      setDownloadProgress(prev => ({ ...prev, [id]: 0 }));
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (!prev[id]) return prev;
          const newProgress = Math.min(prev[id] + 10, 90);
          return { ...prev, [id]: newProgress };
        });
      }, 200);
      return { progressInterval };
    },
    onSuccess: ({ blob, id }, _, { progressInterval }) => {
      clearInterval(progressInterval);
      setDownloadProgress(prev => ({ ...prev, [id]: 100 }));

      const receipt = receipts.find(r => r.id === id);
      const receiptNumber = receipt?.receipt_number || id;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setDownloadProgress(prev => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }, 500);
    },
    onError: (error, { id }, { progressInterval }) => {
      clearInterval(progressInterval);
      setDownloadProgress(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      setDownloadError(error.message || "Une erreur est survenue lors du téléchargement du PDF.");
      setTimeout(() => setDownloadError(null), 5000);
    },
  });

  const filteredReceipts = receipts.filter(receipt =>
    receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const errorType = getErrorType(error);

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Historique des reçus" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Loading Overlay for Receipts */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>,
          document.body
        )}

        {/* Error Popups */}
        {error && errorType === "server" && (
          <ErrorPopup
            message="Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion internet et réessayer."
            onClose={() => {}}
            actionButton={
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            }
          />
        )}

        {error && errorType === "auth" && (
          <ErrorPopup
            message="Votre session a expirée. Veuillez vous reconnecter."
            onClose={() => navigate("/login")}
            actionButton={
              <Link to="/login">
                <Button>Se connecter</Button>
              </Link>
            }
          />
        )}

        {downloadError && (
          <ErrorPopup
            message={downloadError}
            onClose={() => setDownloadError(null)}
            actionButton={null}
          />
        )}

        {/* Message pour erreur 404 */}
        {errorType === "not_found" && (
          <Card className="border-gray-200">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Aucun reçu trouvé pour le moment.</p>
            </CardContent>
          </Card>
        )}

        {/* PDF Download Progress Overlay */}
        {Object.keys(downloadProgress).length > 0 && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200 ease-out"
                  style={{ width: `${Object.values(downloadProgress)[0]}%` }}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Téléchargement en cours... {String(Object.values(downloadProgress)[0])}%
              </p>
            </div>
          </div>,
          document.body
        )}

        {/* Filtres et recherche */}
        {isLoading ? (
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 w-full flex-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par client ou numéro de reçu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Période
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des reçus */}
        {isLoading ? (
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="p-0">
              {/* Version mobile */}
              <div className="md:hidden">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="border-b border-gray-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Version desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Reçu", "Client", "Montant", "Date", "Articles", "Statut", "Actions"].map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-16" />
                              <Skeleton className="h-8 w-16" />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : errorType !== "not_found" && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mes reçus ({filteredReceipts.length})</span>
                <span className="text-sm font-normal text-gray-500">
                  Total: {receipts.reduce((sum, receipt) => sum + receipt.raw_amount, 0).toLocaleString('fr-FR')} FCFA
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Version mobile */}
              <div className="md:hidden">
                {filteredReceipts.map((receipt) => (
                  <div key={receipt.id} className="border-b border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{receipt.receipt_number}</h3>
                        <p className="text-sm text-gray-600">{receipt.client}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        receipt.status === "Payé" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {receipt.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{receipt.amount}</p>
                        <p className="text-sm text-gray-500">{receipt.date} • {receipt.items} articles</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/receipts/${receipt.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadMutation.mutate({ id: receipt.id, token })}
                          disabled={downloadProgress[receipt.id] !== undefined}
                        >
                          {downloadProgress[receipt.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Version desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Articles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{receipt.receipt_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{receipt.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{receipt.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{receipt.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{receipt.items}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            receipt.status === "Payé" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {receipt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Link to={`/receipts/${receipt.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Voir
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => downloadMutation.mutate({ id: receipt.id, token })}
                              disabled={downloadProgress[receipt.id] !== undefined}
                            >
                              {downloadProgress[receipt.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                              ) : (
                                <Download className="w-4 h-4 mr-1" />
                              )}
                              PDF
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default ReceiptHistory;