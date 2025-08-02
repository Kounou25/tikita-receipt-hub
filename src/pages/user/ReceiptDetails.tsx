import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowLeft, Download, Eye, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { Link, useParams } from "react-router-dom";

const ReceiptDetails = () => {
  const { id } = useParams();
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;
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
        throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${receipt.receipt_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setTimeout(() => setDownloadProgress(null), 500);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError(error.message || "Une erreur est survenue lors du téléchargement du PDF.");
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
          throw new Error(`Failed to fetch receipt details: ${response.status} ${response.statusText}`);
        }

        const [receiptData] = await response.json();
        if (!receiptData) {
          throw new Error("Invalid receipt data: empty response");
        }

        const transformedReceipt = {
          id: receiptData.receipt_number,
          client: {
            name: receiptData.client_name,
            address: receiptData.client_address,
            phone: receiptData.client_phone,
            email: receiptData.client_email,
          },
          company: {
            name: receiptData.company_name,
            address: receiptData.company_address,
            phone: receiptData.company_phone,
            email: receiptData.company_email, // Default email as not provided
            nif: receiptData.company_nif, // Default as not provided
            rccm: receiptData.company_rccm // Default as not provided
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
          items: receiptData.items.map(item => ({
            designation: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            total: item.total
          })),
          subtotal: receiptData.total_ht,
          tva: receiptData.tva_rate,
          tvaAmount: receiptData.tva_amount,
          discount: 0, // Not provided by API
          discountAmount: 0, // Not provided by API
          total: receiptData.total_ttc,
          paymentMethod: receiptData.payment_method,
          receipt_number: receiptData.receipt_number // For PDF download
        };

        setReceipt(transformedReceipt);
      } catch (error) {
        console.error("Error fetching receipt details:", error);
        setError(error.message || "Une erreur est survenue lors du chargement des détails du reçu.");
        setReceipt({
          id: "R001234",
          client: {
            name: "Jean Dupont",
            address: "123 Rue de la Paix, Abidjan, Côte d'Ivoire",
            phone: "+225 07 12 34 56 78"
          },
          company: {
            name: "Ma Boutique SARL",
            address: "456 Boulevard Principal, Cocody, Abidjan",
            phone: "+225 27 22 12 34 56",
            email: "contact@maboutique.ci",
            nif: "NIF123456789",
            rccm: "RCCM123456"
          },
          date: "15 Juin 2024 14:30",
          status: "Payé",
          items: [
            {
              designation: "Smartphone Samsung Galaxy A54",
              quantity: 1,
              unitPrice: 180000,
              total: 180000
            },
            {
              designation: "Écouteurs Bluetooth",
              quantity: 2,
              unitPrice: 15000,
              total: 30000
            },
            {
              designation: "Coque de protection",
              quantity: 1,
              unitPrice: 5000,
              total: 5000
            }
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Payé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-orange-100 text-orange-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>Aucun reçu trouvé.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Détails du reçu" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* PDF Download Progress Overlay */}
        {downloadProgress !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200 ease-out"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Téléchargement en cours... {downloadProgress}%
              </p>
            </div>
          </div>
        )}

        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Reçu #{receipt.id}</h2>
              <Badge className={getStatusColor(receipt.status)}>
                {receipt.status}
              </Badge>
            </div>
            <p className="text-gray-600">{receipt.date}</p>
          </div>
          
          <div className="flex gap-2">
            {/* <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button> */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPDF}
              disabled={downloadProgress !== null}
            >
              {downloadProgress !== null ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              PDF
            </Button>
            {/* <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Informations du client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-medium text-gray-900">{receipt.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium text-gray-900">{receipt.client.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{receipt.client.email || "Non fourni"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-medium text-gray-900">{receipt.client.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Informations de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-medium text-gray-900">{receipt.company.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium text-gray-900">{receipt.company.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{receipt.company.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">NIF</p>
                  <p className="font-medium text-gray-900">{receipt.company.nif}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RCCM</p>
                  <p className="font-medium text-gray-900">{receipt.company.rccm}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Articles ({receipt.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.designation}</h4>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity} × {item.unitPrice.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{item.total.toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Récapitulatif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium text-gray-900">{receipt.subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">TVA ({receipt.tva}%)</span>
                <span className="font-medium text-gray-900">{receipt.tvaAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Réduction ({receipt.discount}%)</span>
                <span className="font-medium text-red-600">-{receipt.discountAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{receipt.total.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Mode de paiement</span>
                <span className="font-medium text-gray-900">{receipt.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back button */}
        <div className="flex justify-start">
          <Link to="/receipts">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ReceiptDetails;