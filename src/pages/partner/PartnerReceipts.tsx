
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Search, Download, Eye, Filter } from "lucide-react";

const PartnerReceipts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const receipts = [
    {
      id: "RCP-001",
      user: "Marie Kouassi",
      client: "Boutique Elegance",
      amount: 45000,
      date: "2024-01-15",
      status: "Payé",
      template: "Moderne"
    },
    {
      id: "RCP-002",
      user: "Jean Brou",
      client: "Restaurant Le Palmier",
      amount: 125000,
      date: "2024-01-14",
      status: "En attente",
      template: "Classique"
    },
    {
      id: "RCP-003",
      user: "Fatou Diallo",
      client: "Pharmacie Centrale",
      amount: 78000,
      date: "2024-01-14",
      status: "Payé",
      template: "Business"
    },
    {
      id: "RCP-004",
      user: "Kofi Asante",
      client: "Garage Auto Plus",
      amount: 95000,
      date: "2024-01-13",
      status: "Annulé",
      template: "Minimaliste"
    },
    {
      id: "RCP-005",
      user: "Aïcha Traoré",
      client: "Salon de beauté Reine",
      amount: 32000,
      date: "2024-01-13",
      status: "Payé",
      template: "Coloré"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || receipt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title={t('pages.partner_receipts')} />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="partner" />

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par utilisateur, client ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Plus de filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{receipts.length}</p>
              <p className="text-sm text-gray-600">Total reçus</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {receipts.filter(r => r.status === "Payé").length}
              </p>
              <p className="text-sm text-gray-600">Payés</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {receipts.filter(r => r.status === "En attente").length}
              </p>
              <p className="text-sm text-gray-600">En attente</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(receipts.reduce((sum, r) => sum + r.amount, 0))}
              </p>
              <p className="text-sm text-gray-600">Montant total</p>
            </CardContent>
          </Card>
        </div>

        {/* Receipts List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Liste des reçus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Utilisateur</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Client</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Montant</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Statut</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <span className="font-mono text-sm">{receipt.id}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-medium">{receipt.user}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-600">{receipt.client}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-bold text-primary">{formatCurrency(receipt.amount)}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-600">{receipt.date}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="border-gray-300">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReceipts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun reçu trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default PartnerReceipts;
