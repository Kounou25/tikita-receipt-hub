import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Search, Download, Eye, Filter, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Link } from "react-router-dom";

const ReceiptHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({}); // Track progress for multiple receipts
  const companyId = localStorage.getItem("company_id") || null;
  const token = localStorage.getItem("token") || null;

  const handleDownloadPDF = async (id: string, receiptNumber: string) => {
    try {
      setError(null);
      setDownloadProgress(prev => ({ ...prev, [id]: 0 }));

      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (!prev[id]) return prev;
          const newProgress = Math.min(prev[id] + 10, 90);
          return { ...prev, [id]: newProgress };
        });
      }, 200);

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${id}`, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      clearInterval(progressInterval);
      setDownloadProgress(prev => ({ ...prev, [id]: 100 }));

      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
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
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError(error.message || "Une erreur est survenue lors du téléchargement du PDF.");
      setDownloadProgress(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }
  };

  useEffect(() => {
    const fetchReceipts = async (): Promise<void> => {
      if (!companyId) {
        setError("ID de l'entreprise non défini. Veuillez vous reconnecter.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/0`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch receipts: ${response.status} ${response.statusText}`);
        }

        const receiptsData = await response.json();
        if (!Array.isArray(receiptsData)) {
          throw new Error("Invalid receipts response: not an array");
        }

        const transformedReceipts = receiptsData.map(receipt => ({
          id: receipt.receipt_id,
          receipt_number: receipt.receipt_number,
          client: receipt.client_name,
          amount: `${receipt.total_amount.toLocaleString('fr-FR')} FCFA`,
          raw_amount: receipt.total_amount,
          date: receipt.receipt_date
            ? new Date(receipt.receipt_date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
            : 'Date inconnue',
          status: receipt.payment_status === "paid" ? "Payé" : "En attente",
          items: receipt.total_items
        }));

        setReceipts(transformedReceipts);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        setError(error.message || "Une erreur est survenue lors du chargement des reçus.");
        setReceipts([
          {
            id: "R001",
            receipt_number: "R001",
            client: "Marie Kouassi",
            amount: "45,000 FCFA",
            raw_amount: 45000,
            date: "2024-01-15",
            status: "Payé",
            items: 3
          },
          {
            id: "R002",
            receipt_number: "R002",
            client: "Jean Ouattara",
            amount: "78,500 FCFA",
            raw_amount: 78500,
            date: "2024-01-14",
            status: "Payé",
            items: 5
          },
          {
            id: "R003",
            receipt_number: "R003",
            client: "Fatou Traoré",
            amount: "125,000 FCFA",
            raw_amount: 125000,
            date: "2024-01-13",
            status: "En attente",
            items: 8
          },
          {
            id: "R004",
            receipt_number: "R004",
            client: "Kofi Asante",
            amount: "32,000 FCFA",
            raw_amount: 32000,
            date: "2024-01-12",
            status: "Payé",
            items: 2
          },
          {
            id: "R005",
            receipt_number: "R005",
            client: "Aminata Diallo",
            amount: "67,500 FCFA",
            raw_amount: 67500,
            date: "2024-01-11",
            status: "Payé",
            items: 4
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, [companyId]);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Historique des reçus" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Loading Overlay for Receipts */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

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
        {Object.keys(downloadProgress).length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          </div>
        )}

        {/* Filtres et recherche */}
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

        {/* Liste des reçus */}
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
                        onClick={() => handleDownloadPDF(receipt.id, receipt.receipt_number)}
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
                            onClick={() => handleDownloadPDF(receipt.id, receipt.receipt_number)}
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
      </main>

      <MobileNav />
    </div>
  );
};

export default ReceiptHistory;