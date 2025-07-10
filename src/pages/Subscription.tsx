import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { Check, Crown, Zap, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-2xl", className)} />
);

const Subscription = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlanData, setCurrentPlanData] = useState({
    name: "Premium",
    status: "active",
    endDate: "15/07/2024",
    receiptsUsed: 847,
    receiptsTotal: 1000,
    receiptsRemaining: 153,
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const companyId = localStorage.getItem("company_id") || "18";
  const token = localStorage.getItem("token") || null;

  const plans = [
    {
      name: "Basic",
      price: "5,000",
      period: "mois",
      description: "Parfait pour débuter",
      features: [
        "100 reçus par mois",
        "3 modèles de reçus",
        "Support par email",
        "Historique 3 mois",
        "Logo personnalisé"
      ],
      icon: Zap,
      color: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false
    },
    {
      name: "Premium",
      price: "15,000",
      period: "mois",
      description: "Le plus populaire",
      features: [
        "1,000 reçus par mois",
        "Tous les modèles",
        "Support prioritaire",
        "Historique illimité",
        "Personnalisation avancée",
        "Statistiques détaillées",
        "Export PDF/Excel"
      ],
      icon: Crown,
      color: "bg-gradient-to-br from-teal-500 to-teal-700 text-white",
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      popular: true
    },
    {
      name: "Entreprise",
      price: "50,000",
      period: "mois",
      description: "Pour les grandes entreprises",
      features: [
        "Reçus illimités",
        "Modèles personnalisés",
        "Support téléphonique",
        "Formation incluse",
        "API dédiée",
        "Multi-utilisateurs",
        "Intégrations avancées",
        "Manager dédié"
      ],
      icon: Star,
      color: "bg-gradient-to-br from-purple-500 to-purple-700 text-white",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false
    }
  ];

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Échec de la récupération des données d'abonnement: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCurrentPlanData({
          name: data.plan_name,
          status: data.subscription_status,
          endDate: new Date(data.end_date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          receiptsUsed: data.receipts_generated,
          receiptsTotal: data.total_quota,
          receiptsRemaining: data.remaining_quota,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'abonnement:", error);
        toast.error(error.message || "Erreur lors du chargement des données d'abonnement.", { duration: 5000 });
        setCurrentPlanData({
          name: "Premium",
          status: "active",
          endDate: "15/07/2024",
          receiptsUsed: 847,
          receiptsTotal: 1000,
          receiptsRemaining: 153,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [companyId]);

  const handlePurchase = async () => {
    if (!paymentMethod || !paymentCode) {
      toast.error("Veuillez sélectionner un mode de paiement et entrer un code.", { duration: 5000 });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/purchase/${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          plan_name: selectedPlan,
          payment_method: paymentMethod,
          payment_code: paymentCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Échec de l'achat: ${response.status} ${response.statusText}`);
      }

      toast.success(`Abonnement ${selectedPlan} acheté avec succès !`, { duration: 3000 });
      setCurrentPlanData({
        ...currentPlanData,
        name: selectedPlan,
        status: "active",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        receiptsUsed: 0,
        receiptsTotal: selectedPlan === "Basic" ? 100 : selectedPlan === "Premium" ? 1000 : Infinity,
        receiptsRemaining: selectedPlan === "Basic" ? 100 : selectedPlan === "Premium" ? 1000 : Infinity,
      });
      setSelectedPlan(null);
      setPaymentMethod("");
      setPaymentCode("");
    } catch (error) {
      console.error("Erreur lors de l'achat:", error);
      toast.error(error.message || "Erreur lors de l'achat de l'abonnement.", { duration: 5000 });
    }
  };

  const usagePercentage = (currentPlanData.receiptsUsed / currentPlanData.receiptsTotal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mobile-nav-padding">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
      <Header title="Abonnement" />
      
      <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Current Plan Status */}
        {isLoading ? (
          <Card className="shadow-xl rounded-2xl border-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-64" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-4" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-3 ml-auto rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mt-6" />
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl rounded-2xl border-none bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Plan Actuel : {currentPlanData.name}</h3>
                  <p className="text-gray-600 mb-3">
                    Actif jusqu'au {currentPlanData.endDate}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-teal-600 font-semibold">
                      {currentPlanData.receiptsUsed} / {currentPlanData.receiptsTotal} reçus utilisés
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{currentPlanData.receiptsRemaining} restants</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full mb-2 ml-auto ${
                    currentPlanData.status === "active" ? "bg-teal-500" :
                    currentPlanData.status === "inactive" ? "bg-gray-500" : "bg-red-500"
                  } animate-pulse`}></div>
                  <span className={`font-semibold ${
                    currentPlanData.status === "active" ? "text-teal-600" :
                    currentPlanData.status === "inactive" ? "text-gray-600" : "text-red-600"
                  }`}>
                    {currentPlanData.status === "active" ? "Actif" : currentPlanData.status === "inactive" ? "Inactif" : "Expiré"}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
              Choisissez Votre Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Boostez votre expérience avec l'abonnement parfait pour vos besoins professionnels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={cn(
                  "relative border-none shadow-xl rounded-2xl transform transition-all duration-300 hover:scale-105",
                  plan.color,
                  plan.popular ? 'ring-4 ring-teal-300' : ''
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                      Plus Populaire
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 bg-white/20">
                    <plan.icon className="w-8 h-8" />
                  </div>
                  
                  <CardTitle className="text-3xl font-extrabold text-white">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-center">
                    <span className="text-5xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-white/80 text-lg"> FCFA/{plan.period}</span>
                  </div>
                  
                  <p className="text-white/80 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className={cn(
                          "w-full text-lg font-semibold shadow-lg",
                          plan.buttonColor,
                          currentPlanData.name === plan.name ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transition-all duration-300'
                        )}
                        disabled={currentPlanData.name === plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                      >
                        {currentPlanData.name === plan.name ? 'Plan Actuel' : 'Choisir ce Plan'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl animate-in fade-in duration-300">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                          Acheter le Plan {plan.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          Sélectionnez un mode de paiement et entrez votre code de recharge ou d'envoi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod" className="text-gray-900 font-medium">
                            Mode de paiement
                          </Label>
                          <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                            <SelectTrigger id="paymentMethod" className="border-gray-300 rounded-lg">
                              <SelectValue placeholder="Choisir un mode de paiement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NITA">
                                <div className="flex items-center gap-3">
                                  <img
                                    src="http://nitatransfert.com/wp-content/uploads/2018/03/logo-NITA.png"
                                    alt="NITA"
                                    className="h-6 w-auto"
                                  />
                                  NITA
                                </div>
                              </SelectItem>
                              <SelectItem value="Amanata">
                                <div className="flex items-center gap-3">
                                  <div className="h-6 w-6 bg-gray-200 rounded" />
                                  Amanata
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentCode" className="text-gray-900 font-medium">
                            Code de recharge ou d'envoi
                          </Label>
                          <Input
                            id="paymentCode"
                            value={paymentCode}
                            onChange={(e) => setPaymentCode(e.target.value)}
                            placeholder="Entrez le code"
                            className="border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <AlertDialogCancel
                          className="bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg"
                          onClick={() => { setPaymentMethod(""); setPaymentCode(""); }}
                        >
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
                          onClick={handlePurchase}
                        >
                          Confirmer le Paiement
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-none shadow-xl rounded-2xl bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Questions Fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  Puis-je changer de plan à tout moment ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                  Les changements prennent effet immédiatement.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  Que se passe-t-il si je dépasse ma limite de reçus ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Vous serez automatiquement facturé pour les reçus supplémentaires 
                  au tarif de 100 FCFA par reçu.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  Y a-t-il une période d'essai gratuite ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Oui, tous les nouveaux utilisateurs bénéficient de 7 jours d'essai 
                  gratuit sur le plan Premium.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Subscription;