import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Search, Download, Eye, Filter, Calendar,FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCookie } from "@/lib/cookies";
import { formatCurrency, getCurrencyRate, getCurrencySymbol, getLocaleForCurrency } from "@/utils/currencyFormatter";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg", className)} />
);

const ErrorPopup = ({ message, onClose, actionButton, errorTitle }) => createPortal(
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">{errorTitle}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            {actionButton}
            <Button 
              variant="outline" 
              className="rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>,
  document.body
);

const getErrorType = (error) => {
  if (!error) return null;
  if (error.message.includes("500")) return "server";
  if (error.message.includes("403/409") || error.message.includes("ID de l'entreprise non défini")) return "auth";
  if (error.message.includes("404")) return "not_found";
  return "generic";
};

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
    amount: receipt.total_amount || 0,
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
  useScrollToTop();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadProgress, setDownloadProgress] = useState<Record<string | number, number>>({});
  const [downloadError, setDownloadError] = useState(null);
  const companyId = getCookie("company_id") || null;
  const { t } = useTranslation();
  const token = getCookie("token") || null;
  const navigate = useNavigate();

  // Get currency rate and symbol
  const rate = getCurrencyRate();
  const currencySymbol = getCurrencySymbol();

  const { data: receipts = [], isLoading, error } = useQuery({
    queryKey: ['receipts', companyId],
    queryFn: () => fetchReceipts(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });

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
      link.download = `reçu_${receiptNumber}.pdf`;
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
  const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const convertedTotalRevenue = formatCurrency(totalRevenue, currencySymbol, rate);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      <Header title={t('pages.receipts_history')} showMenu={true} />

      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />

        {/* Global Loading Overlay */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('receipts.loading')}</p>
            </div>
          </div>,
          document.body
        )}

        {/* Error Popups */}
        {error && errorType === "server" && (
          <ErrorPopup
            errorTitle={t('receipts.error')}
            message="Une erreur est survenue lors de la récupération des reçus. Veuillez réessayer."
            onClose={() => {}}
            actionButton={
              <Button 
                className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            }
          />
        )}

        {error && errorType === "auth" && (
          <ErrorPopup
            errorTitle={t('receipts.error')}
            message="Votre session a expiré. Veuillez vous reconnecter."
            onClose={() => navigate("/login")}
            actionButton={
              <Button 
                className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg"
                onClick={() => navigate("/login")}
              >
                Se reconnecter
              </Button>
            }
          />
        )}

        {downloadError && (
          <ErrorPopup
            errorTitle={t('receipts.error')}
            message={downloadError}
            onClose={() => setDownloadError(null)}
            actionButton={null}
          />
        )}

        {/* Empty State */}
        {errorType === "not_found" && !isLoading && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{t('receipts.noReceipts')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('receipts.noReceiptsYet')}</p>
            <Link to="/generate">
              <Button className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg px-6 h-11 font-medium">
                Créer mon premier reçu
              </Button>
            </Link>
          </div>
        )}

        {/* PDF Download Progress */}
        {Object.keys(downloadProgress).length > 0 && createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-8 shadow-xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
              <Loader2 className="w-12 h-12 animate-spin text-black dark:text-white" />
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white transition-all duration-300"
                  style={{ width: `${Object.values(downloadProgress)[0]}%` }}
                />
              </div>
              <p className="text-lg font-semibold text-black dark:text-white">
                Préparation du PDF... {Object.values(downloadProgress)[0] as number}%
              </p>
            </div>
          </div>,
          document.body
        )}

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder={t('placeholders.searchByClient')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white">
                <Filter className="w-5 h-5 mr-2" />
                Filtrer
              </Button>
              <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white">
                <Calendar className="w-5 h-5 mr-2" />
                Période
              </Button>
            </div>
          </div>
        </div>

        {/* Receipts List */}
        {!isLoading && errorType !== "not_found" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Mes reçus ({filteredReceipts.length})
                </h2>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  Total généré : <span className="text-black dark:text-white font-bold">{convertedTotalRevenue}</span>
                </p>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {filteredReceipts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('receipts.noResults')}</p>
                </div>
              ) : (
                filteredReceipts.map((receipt) => (
                  <div key={receipt.id} className="border-b border-gray-100 dark:border-gray-800 p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-black dark:text-white text-lg">{receipt.receipt_number}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{receipt.client}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium",
                        receipt.status === "Payé"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      )}>
                        {receipt.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-black dark:text-white">{formatCurrency(receipt.amount, currencySymbol, rate)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{receipt.date} • {receipt.items} article{receipt.items > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex gap-3">
                        <Link to={`/receipts/${receipt.id}`}>
                          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white">
                            <Eye className="w-5 h-5" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
                          onClick={() => downloadMutation.mutate({ id: receipt.id, token })}
                          disabled={downloadProgress[receipt.id] !== undefined}
                        >
                          {downloadProgress[receipt.id] !== undefined ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.receiptNumber')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.client')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.amount')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.date')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.items')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.status')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('receipts.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Aucun résultat pour cette recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-black dark:text-white">{receipt.receipt_number}</p>
                        </td>
                        <td className="px-6 py-5 text-gray-700 dark:text-gray-300">{receipt.client}</td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-black dark:text-white">{formatCurrency(receipt.amount, currencySymbol, rate)}</p>
                        </td>
                        <td className="px-6 py-5 text-gray-600 dark:text-gray-400">{receipt.date}</td>
                        <td className="px-6 py-5 text-gray-600 dark:text-gray-400">{receipt.items}</td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "inline-flex px-3 py-1.5 rounded-full text-sm font-medium",
                            receipt.status === "Payé"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          )}>
                            {receipt.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-3">
                            <Link to={`/receipts/${receipt.id}`}>
                              <Button variant="outline" className="rounded-xl h-10 px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              className="rounded-xl h-10 px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
                              onClick={() => downloadMutation.mutate({ id: receipt.id, token })}
                              disabled={downloadProgress[receipt.id] !== undefined}
                            >
                              {downloadProgress[receipt.id] !== undefined ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              PDF
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default ReceiptHistory;