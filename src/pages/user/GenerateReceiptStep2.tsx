import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { toast } from "react-toastify";
import axios from "axios";

const GenerateReceiptStep2 = () => {
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState({
    client_id: null,
    full_name: "",
    email: "",
    phone_number: "",
    address: ""
  });
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unit_price: 0 }
  ]);
  const [receiptInfo, setReceiptInfo] = useState({
    tva_rate: 0,
    payment_status: "",
    payment_method: ""
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showQuotaPopup, setShowQuotaPopup] = useState(false);
  const companyId = localStorage.getItem("company_id");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id") || "1";

  useEffect(() => {
    const fetchClients = async () => {
      if (!companyId) {
        toast.error("Company ID is missing. Please log in again.");
        return;
      }
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/clients/${companyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized access. Please log in.");
          if (response.status === 403) throw new Error("Access forbidden.");
          if (response.status === 404) throw new Error("Clients not found.");
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error(error.message || "Failed to load clients. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [companyId, token]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unit_price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id
        ? {
            ...item,
            [field]:
              field === "quantity"
                ? Math.max(1, parseInt(value) || 1)
                : field === "unit_price"
                ? Math.max(0, parseFloat(value.replace(/^0+/, '') || '0'))
                : value
          }
        : item
    ));
  };

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find(client => client.client_id.toString() === clientId);
    if (selectedClient) {
      setClientInfo({
        client_id: selectedClient.client_id,
        full_name: selectedClient.client_name,
        email: selectedClient.client_email || "",
        phone_number: selectedClient.client_phone || "",
        address: selectedClient.client_address || ""
      });
    } else {
      setClientInfo({
        client_id: null,
        full_name: "",
        email: "",
        phone_number: "",
        address: ""
      });
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const tvaAmount = (subtotal * Math.max(0, receiptInfo.tva_rate)) / 100;
  const total = subtotal + tvaAmount;

  const handleGenerateReceipt = async () => {
    if (!companyId || isNaN(parseInt(companyId))) {
      toast.error("Invalid company ID. Please log in again.");
      return;
    }
    if (!userId) {
      toast.error("Invalid user ID. Please log in again.");
      return;
    }
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }
    if (
      !clientInfo.full_name ||
      items.some(item => !item.description || item.unit_price <= 0 || isNaN(item.unit_price) || isNaN(item.quantity)) ||
      !receiptInfo.payment_method ||
      !receiptInfo.payment_status
    ) {
      toast.error("Please fill all required fields correctly (client name, item descriptions, valid prices, payment method, and status).");
      return;
    }

    const clientInfoPayload = {
      full_name: clientInfo.full_name,
      ...(clientInfo.email && { email: clientInfo.email }),
      ...(clientInfo.phone_number && { phone_number: clientInfo.phone_number }),
      ...(clientInfo.address && { address: clientInfo.address })
    };

    const payload = {
      company_id: parseInt(companyId),
      user_id: userId,
      ...(clientInfo.client_id && { client_id: clientInfo.client_id }),
      client_info: clientInfoPayload,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      tva_rate: receiptInfo.tva_rate,
      receipt_model: localStorage.getItem("selectedTemplate") || "classic",
      payment_status: receiptInfo.payment_status,
      payment_method: receiptInfo.payment_method
    };

    try {
      setLoading(true);
      setIsDownloading(true);
      setDownloadProgress(0);

      const simulateProgress = () => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setDownloadProgress(Math.min(progress, 50));
            if (progress >= 50) {
              clearInterval(interval);
              resolve(null);
            }
          }, 200);
        });
      };

      console.log("Sending payload to /receipts/receipt/:", JSON.stringify(payload, null, 2));
      await simulateProgress();
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/receipts/receipt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log("Receipt creation response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response body:", errorData);
        if (errorData.error === "Aucun abonnement actif trouvé.") {
          setShowSubscriptionPopup(true);
          throw new Error("No active subscription found.");
        }
        if (errorData.error === "Quota mensuel de reçus atteint.") {
          setShowQuotaPopup(true);
          throw new Error("Monthly receipt quota reached.");
        }
        if (response.status === 400) throw new Error(errorData.message || "Invalid receipt data.");
        if (response.status === 401) throw new Error("Unauthorized access. Please log in.");
        if (response.status === 403) throw new Error("Access forbidden.");
        if (response.status === 500) throw new Error(`Server error: ${errorData.message || "Unknown server issue"}`);
        throw new Error(`Failed to create receipt: ${response.status}`);
      }

      const result = await response.json();
      console.log("Receipt creation result:", result);
      if (!result.receipt_id || !result.receipt_number) {
        throw new Error("Missing receipt ID or receipt number from server.");
      }

      console.log(`Generating receipt with ID: ${result.receipt_id}, Number: ${result.receipt_number}`);
      const generateResponse = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${result.receipt_id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = 50 + Math.round((progressEvent.loaded * 50) / progressEvent.total);
            setDownloadProgress(percentCompleted);
          }
        }
      });

      const contentType = generateResponse.headers["content-type"];
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Invalid response format: Expected a PDF file.");
      }

      const sanitizedReceiptNumber = result.receipt_number.replace(/[\/\\:*?"<>|]/g, "_");
      let filename = `receipt_${sanitizedReceiptNumber}.pdf`;
      const contentDisposition = generateResponse.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      console.log(`Downloading file as: ${filename}`);
      const blob = generateResponse.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Receipt generation and download successful");
      toast.success("Receipt created and downloaded successfully!");
      navigate("/receipts");
    } catch (error) {
      console.error("Error generating receipt:", error);
      if (error.message !== "No active subscription found." && error.message !== "Monthly receipt quota reached.") {
        toast.error(error.message || "Failed to generate receipt. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Générer un reçu" />

      <main className="p-4 sm:p-6 space-y-6">
        <QuickNav userType="user" />

        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-medium">
              1
            </div>
            <span className="ml-2 text-sm text-gray-500">Modèle</span>
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Détails</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientSelect" className="text-sm font-medium">Sélectionner un client</Label>
                  <Select onValueChange={handleClientSelect} disabled={loading || isDownloading}>
                    <SelectTrigger id="clientSelect" className="border-gray-300 text-sm h-12">
                      <SelectValue placeholder={loading || isDownloading ? "Chargement..." : "Choisir un client"} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.client_id} value={client.client_id.toString()}>
                          {client.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-sm font-medium">Nom complet *</Label>
                    <Input
                      id="clientName"
                      value={clientInfo.full_name}
                      onChange={(e) => setClientInfo({ ...clientInfo, full_name: e.target.value })}
                      placeholder="Nom du client"
                      className="border-gray-300 text-sm h-12 px-4"
                      disabled={loading || isDownloading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail" className="text-sm font-medium">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder="email@exemple.com"
                      className="border-gray-300 text-sm h-12 px-4"
                      disabled={loading || isDownloading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone" className="text-sm font-medium">Téléphone</Label>
                    <Input
                      id="clientPhone"
                      value={clientInfo.phone_number}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone_number: e.target.value })}
                      placeholder="+227 XX XX XX XX"
                      className="border-gray-300 text-sm h-12 px-4"
                      disabled={loading || isDownloading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientAddress" className="text-sm font-medium">Adresse</Label>
                    <Input
                      id="clientAddress"
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                      placeholder="Adresse du client"
                      className="border-gray-300 text-sm h-12 px-4"
                      disabled={loading || isDownloading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Articles</CardTitle>
                <Button onClick={addItem} size="sm" className="bg-orange-600 hover:bg-orange-700 h-10 px-4" disabled={loading || isDownloading}>
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div className="sm:col-span-5 space-y-2">
                      <Label className="text-sm font-medium">Article {index + 1}</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description de l'article"
                        className="border-gray-300 text-sm h-12 px-4"
                        disabled={loading || isDownloading}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-sm font-medium">Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="border-gray-300 text-sm h-12 px-4"
                        disabled={loading || isDownloading}
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-2">
                      <Label className="text-sm font-medium">Prix unitaire</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price === 0 ? '' : item.unit_price} // Hide 0 in the input field
                        onChange={(e) => updateItem(item.id, 'unit_price', e.target.value.replace(/^0+(?=\d)/, ''))}
                        placeholder="0"
                        className="border-gray-300 text-sm h-12 px-4"
                        disabled={loading || isDownloading}
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end mt-4 sm:mt-0">
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 h-10 w-10"
                          disabled={loading || isDownloading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Paramètres additionnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tva" className="text-sm font-medium">TVA (%)</Label>
                    <Input
                      id="tva"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={receiptInfo.tva_rate === 0 ? '' : receiptInfo.tva_rate} // Hide 0 in TVA input for consistency
                      onChange={(e) =>
                        setReceiptInfo({
                          ...receiptInfo,
                          tva_rate: Math.max(0, parseFloat(e.target.value.replace(/^0+(?=\d)/, '') || '0'))
                        })
                      }
                      placeholder="0"
                      className="border-gray-300 text-sm h-12 px-4"
                      disabled={loading || isDownloading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod" className="text-sm font-medium">Méthode de paiement</Label>
                    <Select
                      onValueChange={(value) => setReceiptInfo({ ...receiptInfo, payment_method: value })}
                      disabled={loading || isDownloading}
                    >
                      <SelectTrigger id="paymentMethod" className="border-gray-300 text-sm h-12">
                        <SelectValue placeholder="Choisir une méthode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="My Nita">My Nita</SelectItem>
                        <SelectItem value="Cash">Espèces</SelectItem>
                        <SelectItem value="Bank Transfer">Virement bancaire</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus" className="text-sm font-medium">Statut de paiement</Label>
                  <Select
                    onValueChange={(value) => setReceiptInfo({ ...receiptInfo, payment_status: value })}
                    disabled={loading || isDownloading}
                  >
                    <SelectTrigger id="paymentStatus" className="border-gray-300 text-sm h-12">
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="unpaid">Non payé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-gray-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  {receiptInfo.tva_rate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA ({receiptInfo.tva_rate}%)</span>
                      <span className="font-medium">+{tvaAmount.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg text-primary">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={() => navigate('/generate')}
                    variant="outline"
                    className="w-full h-12 text-sm"
                    disabled={loading || isDownloading}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleGenerateReceipt}
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-sm"
                    disabled={
                      loading ||
                      isDownloading ||
                      !clientInfo.full_name ||
                      items.some(item => !item.description || item.unit_price <= 0) ||
                      !receiptInfo.payment_method ||
                      !receiptInfo.payment_status
                    }
                  >
                    {loading || isDownloading ? "Chargement..." : "Générer le reçu"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showSubscriptionPopup} onOpenChange={setShowSubscriptionPopup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Aucun abonnement actif</DialogTitle>
              <DialogDescription>
                Aucun abonnement actif trouvé. Votre abonnement a peut-être expiré. Veuillez souscrire pour continuer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSubscriptionPopup(false)}
                className="h-10 text-sm"
              >
                Fermer
              </Button>
              <Button
                onClick={() => navigate('/subscription/')}
                className="bg-primary hover:bg-primary/90 h-10 text-sm"
              >
                Souscrire maintenant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showQuotaPopup} onOpenChange={setShowQuotaPopup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Quota mensuel atteint</DialogTitle>
              <DialogDescription>
                Votre quota mensuel de reçus est atteint. Veuillez mettre à jour votre abonnement pour continuer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowQuotaPopup(false)}
                className="h-10 text-sm"
              >
                Fermer
              </Button>
              <Button
                onClick={() => navigate('/subscription/')}
                className="bg-primary hover:bg-primary/90 h-10 text-sm"
              >
                Mettre à jour l'abonnement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isDownloading && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="w-3/4 sm:w-1/2 max-w-md space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <div className="text-center text-white text-lg font-medium">{downloadProgress}%</div>
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default GenerateReceiptStep2;