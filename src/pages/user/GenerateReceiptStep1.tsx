
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { ArrowRight, User, Package, CreditCard, FileText } from "lucide-react";

const GenerateReceiptStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    paymentMethod: "",
    notes: ""
  });

  const handleNext = () => {
    // Validation logic here
    navigate("/generate/step2");
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Nouveau Reçu - Étape 1" />
      
      <main className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <QuickNav userType="user" />

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
              1
            </div>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-primary">Informations</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
              2
            </div>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">Aperçu</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Informations Client */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Informations du client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-sm font-medium">
                    Nom du client *
                  </Label>
                  <Input
                    id="clientName"
                    placeholder="Nom complet du client"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="border-gray-300 h-10 sm:h-12"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone" className="text-sm font-medium">
                      Téléphone
                    </Label>
                    <Input
                      id="clientPhone"
                      placeholder="+227 XX XX XX XX"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="border-gray-300 h-10 sm:h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail" className="text-sm font-medium">
                      Email (optionnel)
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="client@email.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="border-gray-300 h-10 sm:h-12"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations Produit */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Détails du produit/service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-sm font-medium">
                  Nom du produit/service *
                </Label>
                <Input
                  id="productName"
                  placeholder="Nom du produit ou service vendu"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="border-gray-300 h-10 sm:h-12"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantité *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="border-gray-300 h-10 sm:h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice" className="text-sm font-medium">
                    Prix unitaire (FCFA) *
                  </Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    placeholder="1000"
                    min="0"
                    step="100"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="border-gray-300 h-10 sm:h-12"
                  />
                </div>
              </div>

              {/* Calcul automatique du total */}
              {formData.quantity && formData.unitPrice && (
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">Total :</span>
                    <span className="text-lg sm:text-xl font-bold text-green-600">
                      {(parseInt(formData.quantity) * parseInt(formData.unitPrice)).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations Paiement */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Méthode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mode de paiement *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger className="border-gray-300 h-10 sm:h-12">
                    <SelectValue placeholder="Sélectionnez un mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes additionnelles */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Notes (optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Informations complémentaires
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Garantie, conditions particulières, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border-gray-300 min-h-[80px] sm:min-h-[100px] resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bouton Suivant */}
          <div className="flex justify-end pb-20 md:pb-6">
            <Button 
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 px-6 sm:px-8 py-3 h-auto text-sm sm:text-base w-full sm:w-auto"
              disabled={!formData.clientName || !formData.productName || !formData.quantity || !formData.unitPrice || !formData.paymentMethod}
            >
              Continuer
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenerateReceiptStep1;
