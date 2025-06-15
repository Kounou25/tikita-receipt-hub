
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { ArrowLeft, Download, Eye, Share2, Mail } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ReceiptDetails = () => {
  const { id } = useParams();

  // Mock data - en réalité cela viendrait d'une API
  const receipt = {
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
    paymentMethod: "Mobile Money"
  };

  const getStatusColor = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Détails du reçu" />
      
      <main className="p-4 md:p-6 space-y-6">
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
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
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
