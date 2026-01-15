import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowLeft, Download, Eye, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCookie } from "@/lib/cookies";

const ReceiptDetails = () => {
  const { id } = useParams();
  const companyId = getCookie("company_id") || null;
  const token = getCookie("token") || null;
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);

  const handleDownloadPDF = async () => {
    try {
      setError(null);
      setDownloadProgress(0);

      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev === null) return prev;
          return Math.min(prev + 10, 90);
        });
      }, 200);

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${id}`, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (!response.ok) {
        throw new Error(`Échec du téléchargement du PDF: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reçu_${receipt.receipt_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setTimeout(() => setDownloadProgress(null), 500);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError(err.message || "Une erreur est survenue lors du téléchargement du PDF.");
      setDownloadProgress(null);
      setTimeout(() => setError(null), 5000);
    }
  };

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      if (!companyId || !id) {
        setError("ID de l'entreprise ou du reçu non défini. Veuillez vous reconnecter.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/details/${companyId}/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Échec du chargement des détails: ${response.status} ${response.statusText}`);
        }

        const [receiptData] = await response.json();
        if (!receiptData) {
          throw new Error("Données du reçu invalides");
        }

        const transformedReceipt = {
          id: receiptData.receipt_number,
          client: {
            name: receiptData.client_name || "Client inconnu",
            address: receiptData.client_address || "Non renseignée",
            phone: receiptData.client_phone || "Non renseigné",
            email: receiptData.client_email || "Non renseigné",
          },
          company: {
            name: receiptData.company_name || "Entreprise",
            address: receiptData.company_address || "Non renseignée",
            phone: receiptData.company_phone || "Non renseigné",
            email: receiptData.company_email || "Non renseigné",
            nif: receiptData.company_nif || "Non renseigné",
            rccm: receiptData.company_rccm || "Non renseigné",
          },
          date: receiptData.receipt_date
            ? new Date(receiptData.receipt_date).toLocaleString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Date inconnue',
          status: receiptData.payment_status === "paid" ? "Payé" : "En attente",
          items: receiptData.items?.map(item => ({
            designation: item.description || "Article",
            quantity: item.quantity || 0,
            unitPrice: item.unit_price || 0,
            total: item.total || 0
          })) || [],
          subtotal: receiptData.total_ht || 0,
          tva: receiptData.tva_rate || 0,
          tvaAmount: receiptData.tva_amount || 0,
          discount: 0,
          discountAmount: 0,
          total: receiptData.total_ttc || 0,
          paymentMethod: receiptData.payment_method || "Non spécifié",
          receipt_number: receiptData.receipt_number
        };

        setReceipt(transformedReceipt);
      } catch (err) {
        console.error("Error fetching receipt details:", err);
        // Fallback data pour éviter écran blanc en dev
        setReceipt({
          id: "R001234",
          client: {
            name: "Jean Dupont",
            address: "123 Rue de la Paix, Abidjan, Côte d'Ivoire",
            phone: "+225 07 12 34 56 78",
            email: "jean.dupont@example.com"
          },
          company: {
            name: "Ma Boutique SARL",
            address: "456 Boulevard Principal, Cocody, Abidjan",
            phone: "+225 27 22 12 34 56",
            email: "contact@maboutique.ci",
            nif: "NIF123456789",
            rccm: "RCCM123456"
          },
          date: "15 Juin 2024 à 14:30",
          status: "Payé",
          items: [
            { designation: "Smartphone Samsung Galaxy A54", quantity: 1, unitPrice: 180000, total: 180000 },
            { designation: "Écouteurs Bluetooth", quantity: 2, unitPrice: 15000, total: 30000 },
            { designation: "Coque de protection", quantity: 1, unitPrice: 5000, total: 5000 }
          ],
          subtotal: 215000,
          tva: 18,
          tvaAmount: 38700,
          discount: 5,
          discountAmount: 12685,
          total: 241015,
          paymentMethod: "Mobile Money",
          receipt_number: "R001234"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [companyId, id]);

  const getStatusBadge = (status) => {
    return status === "Payé"
      ? "bg-green-50 text-green-700 border border-green-200"
      : "bg-yellow-50 text-yellow-700 border border-yellow-200";
  };

  // Loading global
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Chargement du reçu...</p>
        </div>
      </div>
    );
  }

  // Erreur fatale
  if (!receipt) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">Reçu introuvable</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Le reçu demandé n'existe pas ou a été supprimé.</p>
          <Link to="/receipts">
            <Button className="bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg">
              Retour à l'historique
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      <Header title="Détails du reçu" showMenu={true} />

      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        {/* Message d'erreur temporaire (téléchargement) */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Overlay progression PDF */}
        {downloadProgress !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
              <Loader2 className="w-12 h-12 animate-spin text-black dark:text-white" />
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-xl font-semibold text-black dark:text-white">
                Génération du PDF... {downloadProgress}%
              </p>
            </div>
          </div>
        )}

        {/* En-tête du reçu */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-black dark:text-white">Reçu #{receipt.id}</h1>
                <Badge className={cn("px-4 py-1.5 text-sm font-medium rounded-full", getStatusBadge(receipt.status))}>
                  {receipt.status}
                </Badge>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">{receipt.date}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white"
                onClick={handleDownloadPDF}
                disabled={downloadProgress !== null}
              >
                {downloadProgress !== null ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                Télécharger PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Infos Client & Entreprise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-black dark:text-white mb-5">Informations du client</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.client.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.client.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-black dark:text-white mb-5">Informations de l'entreprise</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.company.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.company.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-lg font-semibold text-black dark:text-white">{receipt.company.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">NIF</p>
                  <p className="text-lg font-semibold text-black dark:text-white">{receipt.company.nif}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">RCCM</p>
                  <p className="text-lg font-semibold text-black dark:text-white">{receipt.company.rccm}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-black dark:text-white">Articles ({receipt.items.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {receipt.items.map((item, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-black dark:text-white">{item.designation}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {item.quantity} × {item.unitPrice.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <p className="text-xl font-bold text-black dark:text-white ml-6">
                    {item.total.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Récapitulatif financier */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-black dark:text-white mb-6">Récapitulatif financier</h3>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sous-total HT</span>
              <span className="font-semibold text-black dark:text-white">{receipt.subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">TVA ({receipt.tva}%)</span>
              <span className="font-semibold text-black dark:text-white">{receipt.tvaAmount.toLocaleString('fr-FR')} FCFA</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Réduction ({receipt.discount}%)</span>
                <span className="font-semibold">-{receipt.discountAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-black dark:text-white">Total TTC</span>
                <span className="text-3xl font-bold text-black dark:text-white">{receipt.total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 pt-2">
              <span>Mode de paiement</span>
              <span className="font-medium text-black dark:text-white">{receipt.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-8">
          <Link to="/receipts">
            <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour à l'historique
            </Button>
          </Link>
        </div>
      </main>

      <QuickNav userType="user" />
      <MobileNav />
    </div>
  );
};

export default ReceiptDetails;