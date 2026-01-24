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
import { ArrowLeft,ArrowRight, Plus, Trash2, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { toast } from "react-toastify";
import axios from "axios";
import { getCookie } from "@/lib/cookies";
import currenciesData from "@/utils/Common-Currency.json";
import { currencyToCountry } from "@/utils/currency-country-mapping";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const GenerateReceiptStep2 = () => {
  useScrollToTop();
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
    receipt_currency: "XAF",
  });
  const [currencySearch, setCurrencySearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showQuotaPopup, setShowQuotaPopup] = useState(false);

  const companyId = getCookie("company_id");
  const token = getCookie("token");
  const userId = getCookie("user_id") || "1";

  const { t } = useTranslation();

  useEffect(() => {
    const fetchClients = async () => {
      if (!companyId || !token) {
        toast.error(t('generateReceipt.errorSessionMissing'));
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

        if (!response.ok) throw new Error(t('generateReceipt.errorFailedLoadClients'));
        const data = await response.json();
        setClients(data);
      } catch (error) {
        toast.error(t('generateReceipt.errorLoadClients'));
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
      toast.error(t('generateReceipt.errorFillAllFields'));
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
      receipt_model: getCookie("selectedTemplate") || "classic",
      payment_status: receiptInfo.payment_status,
      payment_method: receiptInfo.payment_method,
      receipt_currency: receiptInfo.receipt_currency,
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
        throw new Error(errorData.message || t('generateReceipt.errorCreatingReceipt'));
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

      toast.success(t('generateReceipt.successGenerated'));
      navigate("/receipts");
    } catch (error: any) {
      if (!showSubscriptionPopup && !showQuotaPopup) {
        toast.error(error.message || t('generateReceipt.errorGeneratingReceipt'));
      }
    } finally {
      setLoading(false);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header title={t('pages.generate_receipt')} />

      <main className="pt-20 px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 pb-24">
        <QuickNav userType="user" />

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{t('generateReceipt.template')}</span>
            </div>
            <div className="w-32 h-1 bg-gray-900 dark:bg-white rounded-full hidden sm:block" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">{t('generateReceipt.step2')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 max-w-[1400px] mx-auto">
          {/* Formulaire principal */}
          <div className="xl:col-span-2 space-y-10">
            {/* Client */}
            <Card className="shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('generateReceipt.clientInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('generateReceipt.existingClient')}
                  </Label>
                  <Select onValueChange={handleClientSelect} disabled={loading}>
                    <SelectTrigger className="h-12 text-base rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
                      <SelectValue placeholder={t('generateReceipt.selectClient')} />
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
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('generateReceipt.fullNameRequired')}
                    </Label>
                    <Input
                      value={clientInfo.full_name}
                      onChange={(e) => setClientInfo({ ...clientInfo, full_name: e.target.value })}
                      placeholder={t('generateReceipt.clientName')}
                      className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('generateReceipt.email')}
                    </Label>
                    <Input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder={t('generateReceipt.clientEmail')}
                      className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('generateReceipt.phone')}
                    </Label>
                    <Input
                      value={clientInfo.phone_number}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone_number: e.target.value })}
                      placeholder={t('generateReceipt.clientPhone')}
                      className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('generateReceipt.address')}
                    </Label>
                    <Input
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                      placeholder={t('generateReceipt.clientAddress')}
                      className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles */}
            <Card className="shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg">
              <CardHeader className="flex items-center justify-between pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('generateReceipt.articles')}
                </CardTitle>
                <Button
                  onClick={addItem}
                  className="h-10 px-6 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-semibold text-sm rounded-md shadow-lg"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('generateReceipt.addArticle')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('generateReceipt.descriptionRequired')}
                      </Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder={t('generateReceipt.itemDescription')}
                        className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('generateReceipt.quantityLabel')}
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('generateReceipt.unitPrice')}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.unit_price || ""}
                        onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                        placeholder="0"
                        className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-12 w-12 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md"
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
            <Card className="shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('generateReceipt.receiptSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('generateReceipt.vat')} (%)
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
                    className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('generateReceipt.currency')}
                  </Label>
                  <Select
                    value={receiptInfo.receipt_currency}
                    onValueChange={(v) => setReceiptInfo({ ...receiptInfo, receipt_currency: v })}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white">
                      <SelectValue>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img 
                            src={`/flags/4x3/${currencyToCountry[receiptInfo.receipt_currency] || "xx"}.svg`} 
                            alt={receiptInfo.receipt_currency}
                            className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <span className="truncate">
                            {(currenciesData as any)[receiptInfo.receipt_currency]?.symbol} - {(currenciesData as any)[receiptInfo.receipt_currency]?.name}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      <div className="flex items-center border-b px-3 pb-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                          placeholder="Rechercher une devise..."
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {Object.entries(currenciesData)
                          .filter(([code, currency]: [string, any]) => {
                            const searchLower = currencySearch.toLowerCase();
                            return (
                              code.toLowerCase().includes(searchLower) ||
                              currency.name.toLowerCase().includes(searchLower) ||
                              currency.symbol.toLowerCase().includes(searchLower)
                            );
                          })
                          .map(([code, currency]: [string, any]) => {
                            const countryCode = currencyToCountry[code] || "xx";
                            return (
                              <SelectItem key={code} value={code}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <img 
                                    src={`/flags/4x3/${countryCode}.svg`} 
                                    alt={countryCode}
                                    className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <span className="truncate">{currency.symbol} - {currency.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 truncate">
                    {t('generateReceipt.paymentMethod')}
                  </Label>
                  <Select
                    onValueChange={(v) => setReceiptInfo({ ...receiptInfo, payment_method: v })}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white">
                      <SelectValue placeholder={t('generateReceipt.choose')} className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="My Nita"><span className="truncate">My Nita</span></SelectItem>
                      <SelectItem value="Cash"><span className="truncate">{t('generateReceipt.cash')}</span></SelectItem>
                      <SelectItem value="Bank Transfer"><span className="truncate">{t('generateReceipt.bankTransfer')}</span></SelectItem>
                      <SelectItem value="Mobile Money"><span className="truncate">{t('generateReceipt.mobileMoney')}</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('generateReceipt.paymentStatus')}
                  </Label>
                  <Select
                    onValueChange={(v) => setReceiptInfo({ ...receiptInfo, payment_status: v })}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 text-base rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white">
                      <SelectValue placeholder={t('generateReceipt.choose')} className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid"><span className="truncate">{t('generateReceipt.paid')}</span></SelectItem>
                      <SelectItem value="unpaid"><span className="truncate">{t('generateReceipt.unpaid')}</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé sticky */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-2xl bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('generateReceipt.receiptSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600 dark:text-gray-400">{t('generateReceipt.subtotal')}</span>
                      <span className="font-bold text-black dark:text-white">{subtotal.toLocaleString()} {(currenciesData as any)[receiptInfo.receipt_currency]?.symbol || receiptInfo.receipt_currency}</span>
                    </div>
                    {receiptInfo.tva_rate > 0 && (
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600 dark:text-gray-400">{t('generateReceipt.vat')} ({receiptInfo.tva_rate}%)</span>
                        <span className="font-bold text-black dark:text-white">+{tvaAmount.toLocaleString()} {(currenciesData as any)[receiptInfo.receipt_currency]?.symbol || receiptInfo.receipt_currency}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{t('generateReceipt.total')}</span>
                        <span className="text-3xl font-black text-gray-900 dark:text-white">
                          {total.toLocaleString()} {(currenciesData as any)[receiptInfo.receipt_currency]?.symbol || receiptInfo.receipt_currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 rounded-md border-2 text-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white"
                      onClick={() => navigate("/generate")}
                      disabled={loading || isDownloading}
                    >
                      <ArrowLeft className="w-6 h-6 mr-3" />
                      {t('generateReceipt.back')}
                    </Button>
                    <Button
                      size="lg"
                      className="w-full h-16 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-bold text-xl rounded-md shadow-2xl flex items-center justify-center gap-4"
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
                          {t('generateReceipt.generating')}
                        </>
                      ) : (
                        <>
                          {t('generateReceipt.generate')}
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
          <DialogContent className="rounded-lg max-w-lg dark:bg-gray-900 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold dark:text-white">{t('generateReceipt.subscriptionRequired')}</DialogTitle>
              <DialogDescription className="text-xl dark:text-gray-400">
                {t('generateReceipt.subscriptionInactive')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-6 mt-8">
              <Button variant="outline" onClick={() => setShowSubscriptionPopup(false)} className="h-16 px-10 text-xl rounded-lg dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">
                {t('generateReceipt.cancel')}
              </Button>
              <Button onClick={() => navigate("/subscription")} className="h-16 px-10 text-xl rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black">
                {t('generateReceipt.viewSubscriptions')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showQuotaPopup} onOpenChange={setShowQuotaPopup}>
          <DialogContent className="rounded-lg max-w-lg dark:bg-gray-900 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold dark:text-white">{t('generateReceipt.quotaReached')}</DialogTitle>
              <DialogDescription className="text-xl dark:text-gray-400">
                {t('generateReceipt.quotaReachedMessage')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-6 mt-8">
              <Button variant="outline" onClick={() => setShowQuotaPopup(false)} className="h-16 px-10 text-xl rounded-lg dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">
                {t('generateReceipt.cancel')}
              </Button>
              <Button onClick={() => navigate("/subscription")} className="h-16 px-10 text-xl rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black">
                {t('generateReceipt.upgrade')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Progress overlay */}
        {isDownloading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-16 shadow-3xl max-w-2xl w-full mx-4 text-center space-y-12">
              <Loader2 className="w-24 h-24 text-gray-900 dark:text-white animate-spin mx-auto" />
              <div>
                <p className="text-4xl font-black text-gray-900 dark:text-white mb-6">
                  {t('generateReceipt.generatingReceipt')}
                </p>
                <p className="text-7xl font-black text-gray-900 dark:text-white">{downloadProgress}%</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                <div
                  className="bg-gray-900 dark:bg-white h-8 rounded-full transition-all duration-500 ease-out"
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
            className="w-20 h-20 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black rounded-full shadow-3xl flex items-center justify-center"
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


