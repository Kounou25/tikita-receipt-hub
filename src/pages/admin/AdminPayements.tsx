import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Search, DollarSign, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface Payment {
  id: string;
  user_id: string;
  user_name: string;
  company_name: string;
  plan_name: string;
  amount: number;
  payment_date: string;
  status: string;
}

const AdminPayments = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data for payments
  const payments: Payment[] = [
    {
      id: "PAY-001",
      user_id: "6",
      user_name: "Faridatou Gourmantché",
      company_name: "N/A",
      plan_name: "Boubeyni",
      amount: 10000,
      payment_date: "2025-07-10",
      status: "Payé",
    },
    {
      id: "PAY-002",
      user_id: "15",
      user_name: "Raoudatou Kelessi",
      company_name: "Bahatlife",
      plan_name: "Boubeyni",
      amount: 10000,
      payment_date: "2025-07-11",
      status: "Payé",
    },
    {
      id: "PAY-003",
      user_id: "18",
      user_name: "Halidou Moussa",
      company_name: "Conficious",
      plan_name: "Boubeyni",
      amount: 10000,
      payment_date: "2025-07-17",
      status: "En attente",
    },
    {
      id: "PAY-004",
      user_id: "19",
      user_name: "Ouhoudou Mahamadou",
      company_name: "Mo Company",
      plan_name: "Boubeyni",
      amount: 10000,
      payment_date: "2025-07-17",
      status: "Payé",
    },
    {
      id: "PAY-005",
      user_id: "16",
      user_name: "Baby Haoua",
      company_name: "Babyshop",
      plan_name: "Aucun",
      amount: 0,
      payment_date: "2025-07-11",
      status: "Échoué",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Échoué":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Boubeyni":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Entreprise":
        return "bg-orange-100 text-orange-800";
      case "Aucun":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || payment.plan_name === filterPlan;
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title={t('pages.admin_payments')} />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Paiements</h2>
            <p className="text-gray-600">Gérez les paiements d'abonnement de la plateforme</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, ID ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterPlan} onValueChange={setFilterPlan}>
                  <SelectTrigger className="w-[150px] border-gray-300">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les plans</SelectItem>
                    <SelectItem value="Boubeyni">Boubeyni</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Entreprise">Entreprise</SelectItem>
                    <SelectItem value="Aucun">Aucun</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px] border-gray-300">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Échoué">Échoué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              <p className="text-sm text-gray-600">Total paiements</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === "Payé").length}
              </p>
              <p className="text-sm text-gray-600">Payés</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(payments.reduce((sum, p) => sum + (p.status === "Payé" ? p.amount : 0), 0))}
              </p>
              <p className="text-sm text-gray-600">Revenus totaux</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Liste des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Paiement ID</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Utilisateur</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Entreprise</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Plan</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Montant</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <p className="text-sm text-gray-500">{payment.id}</p>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{payment.user_name}</p>
                          <p className="text-sm text-gray-500">{payment.user_id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm">{payment.company_name}</p>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getPlanColor(payment.plan_name)}>
                          {payment.plan_name}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm">{payment.payment_date}</span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun paiement trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <MobileNav userType="admin" />
    </div>
  );
};

export default AdminPayments;