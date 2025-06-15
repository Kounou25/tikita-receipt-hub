
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { Search, Download, Eye, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const ReceiptHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const receipts = [
    {
      id: "R001234",
      client: "Jean Dupont",
      amount: "25,000 FCFA",
      date: "15 Juin 2024",
      status: "Payé",
      items: 3
    },
    {
      id: "R001235",
      client: "Marie Kouakou",
      amount: "18,500 FCFA",
      date: "14 Juin 2024",
      status: "Payé",
      items: 2
    },
    {
      id: "R001236",
      client: "Ahmed Hassan",
      amount: "42,000 FCFA",
      date: "14 Juin 2024",
      status: "En attente",
      items: 5
    },
    {
      id: "R001237",
      client: "Sophie Martin",
      amount: "12,500 FCFA",
      date: "13 Juin 2024",
      status: "Payé",
      items: 1
    },
    {
      id: "R001238",
      client: "Omar Diallo",
      amount: "35,750 FCFA",
      date: "12 Juin 2024",
      status: "Annulé",
      items: 4
    },
    {
      id: "R001239",
      client: "Fatou Ba",
      amount: "21,200 FCFA",
      date: "11 Juin 2024",
      status: "Payé",
      items: 2
    }
  ];

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch = receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || receipt.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <Header title="Historique des reçus" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes reçus</h2>
            <p className="text-gray-600">Gérez et consultez tous vos reçus générés</p>
          </div>
          <Link to="/generate">
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau reçu
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom de client ou numéro de reçu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>
              
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="payé">Payé</SelectItem>
                    <SelectItem value="en attente">En attente</SelectItem>
                    <SelectItem value="annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipts List */}
        <div className="space-y-4">
          {filteredReceipts.map((receipt) => (
            <Card key={receipt.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{receipt.client}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(receipt.status)}`}
                      >
                        {receipt.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                      <span>Reçu #{receipt.id}</span>
                      <span>{receipt.items} article(s)</span>
                      <span>{receipt.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{receipt.amount}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Voir</span>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">PDF</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReceipts.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun reçu trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun reçu ne correspond à vos critères de recherche.
              </p>
              <Link to="/generate">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier reçu
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default ReceiptHistory;
