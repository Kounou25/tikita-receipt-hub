
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { ArrowLeft, Plus, Trash2, Check, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const GenerateReceiptStep2 = () => {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const [items, setItems] = useState([
    { designation: "", quantity: 1, unitPrice: 0 }
  ]);

  const [receiptTva, setReceiptTva] = useState(0);
  const [receiptDiscount, setReceiptDiscount] = useState(0);

  const navigate = useNavigate();

  const addItem = () => {
    setItems([...items, { designation: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const withTva = subtotal + (subtotal * receiptTva / 100);
    const withDiscount = withTva - (withTva * receiptDiscount / 100);
    return withDiscount;
  };

  const handleGenerate = () => {
    navigate("/receipts");
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Générer un reçu" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <Check className="w-4 h-4" />
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

        {/* Client Information */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Informations du client
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client</Label>
                <Input
                  id="clientName"
                  placeholder="Nom complet du client"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Téléphone</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="+225 07 12 34 56 78"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress">Adresse</Label>
              <Textarea
                id="clientAddress"
                placeholder="Adresse du client"
                value={clientInfo.address}
                onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                className="border-gray-300 resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Receipt Items */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-900">
              Articles du reçu
            </CardTitle>
            <Button onClick={addItem} size="sm" variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Article {index + 1}</h4>
                  {items.length > 1 && (
                    <Button
                      onClick={() => removeItem(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <Label>Désignation</Label>
                    <Input
                      placeholder="Description de l'article"
                      value={item.designation}
                      onChange={(e) => updateItem(index, "designation", e.target.value)}
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <Label>Prix unitaire (FCFA)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">Sous-total: </span>
                  <span className="font-medium text-gray-900">
                    {(item.quantity * item.unitPrice).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            ))}

            {/* Receipt Totals */}
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>TVA (%)</Label>
                  <Select onValueChange={(value) => setReceiptTva(parseFloat(value))}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="0%" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="19.25">19.25%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Réduction (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={receiptDiscount}
                    onChange={(e) => setReceiptDiscount(parseFloat(e.target.value) || 0)}
                    className="border-gray-300"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Sous-total :</span>
                  <span className="font-medium text-gray-900">
                    {calculateSubtotal().toLocaleString()} FCFA
                  </span>
                </div>
                {receiptTva > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">TVA ({receiptTva}%) :</span>
                    <span className="font-medium text-gray-900">
                      {(calculateSubtotal() * receiptTva / 100).toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                {receiptDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Réduction ({receiptDiscount}%) :</span>
                    <span className="font-medium text-red-600">
                      -{((calculateSubtotal() * (1 + receiptTva / 100)) * receiptDiscount / 100).toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total général :</span>
                    <span className="text-2xl font-bold text-primary">
                      {calculateTotal().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/generate" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <Button onClick={handleGenerate} className="flex-1 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Générer le reçu
          </Button>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenerateReceiptStep2;
