
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GenerateReceiptStep2 = () => {
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [items, setItems] = useState([
    { id: 1, name: "", quantity: 1, price: 0 }
  ]);

  const [receiptInfo, setReceiptInfo] = useState({
    tva: 0,
    discount: 0,
    notes: ""
  });

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * receiptInfo.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tvaAmount = (taxableAmount * receiptInfo.tva) / 100;
  const total = taxableAmount + tvaAmount;

  const handleGenerateReceipt = () => {
    // Logic to generate the receipt
    console.log("Generating receipt with:", { clientInfo, items, receiptInfo, total });
    navigate("/receipts");
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Générer un reçu" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Progress indicator */}
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
          {/* Client Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nom complet *</Label>
                    <Input
                      id="clientName"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                      placeholder="Nom du client"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                      placeholder="email@exemple.com"
                      className="border-gray-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Téléphone</Label>
                    <Input
                      id="clientPhone"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                      placeholder="+225 XX XX XX XX"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientAddress">Adresse</Label>
                    <Input
                      id="clientAddress"
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                      placeholder="Adresse du client"
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Articles</CardTitle>
                <Button onClick={addItem} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5 space-y-2">
                      <Label>Article {index + 1}</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Nom de l'article"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="col-span-3 space-y-2">
                      <Label>Prix unitaire</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Paramètres additionnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tva">TVA (%)</Label>
                    <Input
                      id="tva"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={receiptInfo.tva}
                      onChange={(e) => setReceiptInfo({...receiptInfo, tva: parseFloat(e.target.value) || 0})}
                      placeholder="18"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Réduction (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={receiptInfo.discount}
                      onChange={(e) => setReceiptInfo({...receiptInfo, discount: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={receiptInfo.notes}
                    onChange={(e) => setReceiptInfo({...receiptInfo, notes: e.target.value})}
                    placeholder="Merci pour votre achat !"
                    className="border-gray-300"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
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
                  {receiptInfo.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Réduction ({receiptInfo.discount}%)</span>
                      <span className="font-medium text-red-600">-{discountAmount.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  {receiptInfo.tva > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA ({receiptInfo.tva}%)</span>
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
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleGenerateReceipt}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!clientInfo.name || items.some(item => !item.name || !item.price)}
                  >
                    Générer le reçu
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenerateReceiptStep2;
