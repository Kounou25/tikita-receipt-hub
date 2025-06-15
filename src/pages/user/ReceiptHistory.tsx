
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Search, Download, Eye, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const ReceiptHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const receipts = [
    {
      id: "R001",
      client: "Marie Kouassi",
      amount: "45,000 FCFA",
      date: "2024-01-15",
      status: "Payé",
      items: 3
    },
    {
      id: "R002", 
      client: "Jean Ouattara",
      amount: "78,500 FCFA",
      date: "2024-01-14",
      status: "Payé",
      items: 5
    },
    {
      id: "R003",
      client: "Fatou Traoré", 
      amount: "125,000 FCFA",
      date: "2024-01-13",
      status: "En attente",
      items: 8
    },
    {
      id: "R004",
      client: "Kofi Asante",
      amount: "32,000 FCFA", 
      date: "2024-01-12",
      status: "Payé",
      items: 2
    },
    {
      id: "R005",
      client: "Aminata Diallo",
      amount: "67,500 FCFA",
      date: "2024-01-11", 
      status: "Payé",
      items: 4
    }
  ];

  const filteredReceipts = receipts.filter(receipt =>
    receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Historique des reçus" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Filtres et recherche */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par client ou numéro de reçu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Période
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des reçus */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mes reçus ({filteredReceipts.length})</span>
              <span className="text-sm font-normal text-gray-500">
                Total: {receipts.reduce((sum, receipt) => sum + parseInt(receipt.amount.replace(/[^\d]/g, '')), 0).toLocaleString()} FCFA
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Version mobile */}
            <div className="md:hidden">
              {filteredReceipts.map((receipt) => (
                <div key={receipt.id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{receipt.id}</h3>
                      <p className="text-sm text-gray-600">{receipt.client}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      receipt.status === "Payé" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {receipt.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{receipt.amount}</p>
                      <p className="text-sm text-gray-500">{receipt.date} • {receipt.items} articles</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/receipts/${receipt.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Version desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reçu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{receipt.client}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{receipt.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{receipt.items}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          receipt.status === "Payé" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link to={`/receipts/${receipt.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default ReceiptHistory;
