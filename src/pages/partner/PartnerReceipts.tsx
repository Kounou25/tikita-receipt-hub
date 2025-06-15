
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import { Search, Filter, Download, Eye } from "lucide-react";

const PartnerReceipts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const receipts = [
    {
      id: "R001234",
      client: "Application Mobile Shop",
      amount: "25,000 FCFA",
      date: "15 Juin 2024 14:30",
      status: "Succès",
      requestId: "req_1234567890"
    },
    {
      id: "R001235",
      client: "E-commerce Platform",
      amount: "18,500 FCFA",
      date: "15 Juin 2024 12:15",
      status: "Succès",
      requestId: "req_1234567891"
    },
    {
      id: "R001236",
      client: "Point de Vente Cloud",
      amount: "42,000 FCFA",
      date: "15 Juin 2024 10:45",
      status: "Succès",
      requestId: "req_1234567892"
    },
    {
      id: "R001237",
      client: "Mobile App Restaurant",
      amount: "12,500 FCFA",
      date: "14 Juin 2024 16:20",
      status: "Erreur",
      requestId: "req_1234567893"
    },
    {
      id: "R001238",
      client: "Boutique en ligne Fashion",
      amount: "35,750 FCFA",
      date: "14 Juin 2024 14:10",
      status: "Succès",
      requestId: "req_1234567894"
    }
  ];

  const filteredReceipts = receipts.filter(receipt =>
    receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Reçus générés via API" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <p className="text-sm text-gray-600">Total des reçus</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">2,789</div>
              <p className="text-sm text-gray-600">Succès</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">58</div>
              <p className="text-sm text-gray-600">Erreurs</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">98.0%</div>
              <p className="text-sm text-gray-600">Taux de succès</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par client ou ID de reçu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipts List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Liste des reçus ({filteredReceipts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{receipt.client}</h4>
                      <span className="font-bold text-primary">{receipt.amount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Reçu #{receipt.id}</span>
                        <span>•</span>
                        <span>Req. {receipt.requestId}</span>
                      </div>
                      <span>{receipt.date}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receipt.status === "Succès"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {receipt.status}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Affichage de 1 à {filteredReceipts.length} sur {receipts.length} reçus
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PartnerReceipts;
