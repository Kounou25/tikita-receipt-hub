import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft,ArrowRight, Plus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { toast } from "react-toastify";
import axios from "axios";

const GenerateReceiptStep2 = () => {
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState({
    client_id: null as number | null,
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unit_price: 0 },
  ]);
  const [receiptInfo, setReceiptInfo] = useState({
    tva_rate: 0,
    payment_status: "",
    payment_method: "",
  });
  const [clients, setClients] = useState<any[]>([]);
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
      if (!companyId || !token) {
        toast.error("Informations de session manquantes.");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/user/clients/${companyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Impossible de charger les clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des clients");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [companyId, token]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity"
                  ? Math.max(1, parseInt(value) || 1)
                  : field === "unit_price"
                  ? Math.max(0, parseFloat(value.replace(/^0+/, "") || "0"))
                  : value,
            }
          : item
      )
    );
  };

  const handleClientSelect = (clientId: string) => {
    const selected = clients.find((c: any) => c.client_id.toString() === clientId);
    if (selected) {
      setClientInfo({
        client_id: selected.client_id,
        full_name: selected.client_name,
        email: selected.client_email || "",
        phone_number: selected.client_phone || "",
        address: selected.client_address || "",
      });
    } else {
      setClientInfo({
        client_id: null,
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
      });
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const tvaAmount = (subtotal * receiptInfo.tva_rate) / 100;
  const total = subtotal + tvaAmount;

  const handleGenerateReceipt = async () => {
    if (
      !clientInfo.full_name ||
      items.some((i) => !i.description || i.unit_price <= 0 || i.quantity < 1) ||
      !receiptInfo.payment_method ||
      !receiptInfo.payment_status
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires correctement.");
      return;
    }

    const payload = {
      company_id: parseInt(companyId!),
      user_id: userId,
      ...(clientInfo.client_id && { client_id: clientInfo.client_id }),
      client_info: {
        full_name: clientInfo.full_name,
        ...(clientInfo.email && { email: clientInfo.email }),
        ...(clientInfo.phone_number && { phone_number: clientInfo.phone_number }),
        ...(clientInfo.address && { address: clientInfo.address }),
      },
      items: items.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })),
      tva_rate: receiptInfo.tva_rate,
      receipt_model: localStorage.getItem("selectedTemplate") || "classic",
      payment_status: receiptInfo.payment_status,
      payment_method: receiptInfo.payment_method,
    };

    try {
      setLoading(true);
      setIsDownloading(true);
      setDownloadProgress(0);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/receipts/receipt/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token!}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.includes("abonnement")) {
          setShowSubscriptionPopup(true);
        }
        if (errorData.error?.includes("Quota")) {
          setShowQuotaPopup(true);
        }
        throw new Error(errorData.message || "Erreur lors de la création du reçu");
      }

      const result = await response.json();

      const generateResponse = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${result.receipt_id}`,
        {
          headers: { Authorization: `Bearer ${token!}` },
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setDownloadProgress(percent);
            }
          },
        }
      );

      const blob = generateResponse.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      let safeNumber = result.receipt_number || String(Date.now());
      const unsafeChars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];
      unsafeChars.forEach((ch) => {
        safeNumber = safeNumber.split(ch).join("_");
      });
      link.download = `reçu_${safeNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Reçu généré et téléchargé avec succès !");
      navigate("/receipts");
    } catch (error: any) {
      if (!showSubscriptionPopup && !showQuotaPopup) {
        toast.error(error.message || "Erreur lors de la génération du reçu");
      }
    } finally {
      setLoading(false);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Générer un reçu" />

      <main className="pt-20 px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 pb-24">
        <QuickNav userType="user" />

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <span className="text-lg font-medium text-gray-500">Modèle</span>
            </div>
            <div className="w-32 h-1 bg-gray-900 rounded-full hidden sm:block" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <span className="text-lg font-medium text-gray-900">Remplir les détails</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {/* Formulaire principal */}
          <div className="xl:col-span-2 space-y-10">
            {/* Client */}
            <Card className="shadow-lg bg-white rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Informations du client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Client existant (optionnel)
                  </Label>
                  <Select onValueChange={handleClientSelect} disabled={loading}>
                    <SelectTrigger className="h-12 text-base rounded-xl border-gray-300">
                      <SelectValue placeholder="Sélectionner ou saisir manuellement" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c: any) => (
                        <SelectItem key={c.client_id} value={c.client_id.toString()}>
                          {c.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </Label>
                    <Input
                      value={clientInfo.full_name}
                      onChange={(e) => setClientInfo({ ...clientInfo, full_name: e.target.value })}
                      placeholder="Nom du client"
                      className="h-12 text-base rounded-xl"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder="email@exemple.com"
                      className="h-12 text-base rounded-xl"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </Label>
                    <Input
                      value={clientInfo.phone_number}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone_number: e.target.value })}
                      placeholder="+227 XX XX XX XX"
                      className="h-12 text-base rounded-xl"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </Label>
                    <Input
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                      placeholder="Adresse complète"
                      className="h-12 text-base rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles */}
            <Card className="shadow-lg bg-white rounded-3xl">
              <CardHeader className="flex items-center justify-between pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Articles
                </CardTitle>
                <Button
                  onClick={addItem}
                  className="h-10 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl shadow-lg"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter un article
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Description de l'article"
                        className="h-12 text-base rounded-xl"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Quantité
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className="h-12 text-base rounded-xl"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Prix unitaire (FCFA)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.unit_price || ""}
                        onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                        placeholder="0"
                        className="h-12 text-base rounded-xl"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-12 w-12 text-red-600 hover:bg-red-50 rounded-xl"
                          disabled={loading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Paramètres */}
            <Card className="shadow-lg bg-white rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Paramètres du reçu
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    TVA (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={receiptInfo.tva_rate || ""}
                    onChange={(e) =>
                      setReceiptInfo({
                        ...receiptInfo,
                        tva_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="h-12 text-base rounded-xl"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Méthode de paiement *
                  </Label>
                  <Select
                    onValueChange={(v) => setReceiptInfo({ ...receiptInfo, payment_method: v })}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 text-base rounded-xl">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="My Nita">My Nita</SelectItem>
                      <SelectItem value="Cash">Espèces</SelectItem>
                      <SelectItem value="Bank Transfer">Virement bancaire</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Statut de paiement *
                  </Label>
                  <Select
                    onValueChange={(v) => setReceiptInfo({ ...receiptInfo, payment_status: v })}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 text-base rounded-xl">
                      <SelectValue placeholder="Choisir" />
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

          {/* Résumé sticky */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-2xl bg-white rounded-3xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Résumé du reçu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-bold">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    {receiptInfo.tva_rate > 0 && (
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">TVA ({receiptInfo.tva_rate}%)</span>
                        <span className="font-bold">+{tvaAmount.toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-2xl font-black text-gray-900">Total</span>
                        <span className="text-3xl font-black text-gray-900">
                          {total.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 rounded-2xl border-2 text-lg"
                      onClick={() => navigate("/generate")}
                      disabled={loading || isDownloading}
                    >
                      <ArrowLeft className="w-6 h-6 mr-3" />
                      Retour
                    </Button>
                    <Button
                      size="lg"
                      className="w-full h-16 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-4"
                      onClick={handleGenerateReceipt}
                      disabled={
                        loading ||
                        isDownloading ||
                        !clientInfo.full_name ||
                        items.some((i) => !i.description || i.unit_price <= 0 || i.quantity < 1) ||
                        !receiptInfo.payment_method ||
                        !receiptInfo.payment_status
                      }
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-7 h-7 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          Générer le reçu
                          <ArrowRight className="w-7 h-7" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Popups */}
        <Dialog open={showSubscriptionPopup} onOpenChange={setShowSubscriptionPopup}>
          <DialogContent className="rounded-3xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">Abonnement requis</DialogTitle>
              <DialogDescription className="text-xl">
                Votre abonnement est inactif. Souscrivez pour continuer à générer des reçus.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-6 mt-8">
              <Button variant="outline" onClick={() => setShowSubscriptionPopup(false)} className="h-16 px-10 text-xl rounded-3xl">
                Annuler
              </Button>
              <Button onClick={() => navigate("/subscription")} className="h-16 px-10 text-xl rounded-3xl bg-gray-900 hover:bg-gray-800">
                Voir les abonnements
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showQuotaPopup} onOpenChange={setShowQuotaPopup}>
          <DialogContent className="rounded-3xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">Quota atteint</DialogTitle>
              <DialogDescription className="text-xl">
                Vous avez atteint votre limite mensuelle. Passez à un plan supérieur.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-6 mt-8">
              <Button variant="outline" onClick={() => setShowQuotaPopup(false)} className="h-16 px-10 text-xl rounded-3xl">
                Annuler
              </Button>
              <Button onClick={() => navigate("/subscription")} className="h-16 px-10 text-xl rounded-3xl bg-gray-900 hover:bg-gray-800">
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Progress overlay */}
        {isDownloading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-16 shadow-3xl max-w-2xl w-full mx-4 text-center space-y-12">
              <Loader2 className="w-24 h-24 text-gray-900 animate-spin mx-auto" />
              <div>
                <p className="text-4xl font-black text-gray-900 mb-6">
                  Génération du reçu en cours
                </p>
                <p className="text-7xl font-black text-gray-900">{downloadProgress}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-gray-900 h-8 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bouton flottant mobile */}
        <div className="fixed bottom-24 right-6 z-40 md:hidden">
          <Button
            onClick={handleGenerateReceipt}
            disabled={
              loading ||
              isDownloading ||
              !clientInfo.full_name ||
              items.some((i) => !i.description || i.unit_price <= 0 || i.quantity < 1) ||
              !receiptInfo.payment_method ||
              !receiptInfo.payment_status
            }
            className="w-20 h-20 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-3xl flex items-center justify-center"
          >
            <ArrowRight className="w-12 h-12" />
          </Button>
        </div>

        <MobileNav />
      </main>
    </div>
  );
};

export default GenerateReceiptStep2;