
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { Check, Zap, Star, Briefcase } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-full", className)} />
);

const Subscription = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [currentPlanData, setCurrentPlanData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const companyId = localStorage.getItem("company_id");
  const token = localStorage.getItem("token") || null;

  // Map plan names to icons and colors
  const planStyles = {
    Gratuit: {
      icon: Zap,
      color: "bg-black text-white",
      buttonColor: "bg-green-700 hover:bg-green-800",
    },
    "Tikiita plus": {
      icon: Star,
      color: "bg-black text-white",
      buttonColor: "bg-green-700 hover:bg-green-800",
    },
    "Tikiita pro": {
      icon: Briefcase,
      color: "bg-black text-white",
      buttonColor: "bg-red-700 hover:bg-red-800",
    },
  };

  // Fetch plans dynamically
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        console.log("Récupération des plans depuis /plans", {
          url: `${import.meta.env.VITE_BASE_API_URL}/plans`,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          date: new Date().toISOString(),
        });
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/plans`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!response.ok) {
          throw new Error(`Échec de la récupération des plans : ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Données brutes des plans reçues :", data);

        // Transform API data to match frontend structure
        const transformedPlans = data.map((plan, index) => {
          const transformed = {
            plan_id: plan.id || plan.planId || plan.plan_id || `fallback-${index}`,
            name: plan.name || plan.plan_name || `Plan ${index + 1}`,
            price: plan.price_per_month ? plan.price_per_month.toLocaleString("fr-FR") : "0",
            max_receipts_per_month: plan.max_receipts_per_month || 0,
            period: "mois",
            description: getPlanDescription(plan.name || plan.plan_name || `Plan ${index + 1}`),
            features: getPlanFeatures(plan),
            popular: index === 1,
            ...planStyles[plan.name || plan.plan_name] || {
              icon: Zap,
              color: "bg-black text-white",
              buttonColor: "bg-gray-700 hover:bg-gray-800",
              popular: index === 1,
            },
          };
          if (!transformed.plan_id || !transformed.name) {
            console.warn("Plan mal formé détecté :", { plan, transformed });
          }
          return transformed;
        });
        console.log("Plans transformés :", transformedPlans);
        setPlans(transformedPlans);
      } catch (error) {
        console.error("Erreur lors de la récupération des plans :", error);
        toast.error(error.message || "Erreur lors du chargement des plans.", { duration: 5000 });
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, [token]);

  // Helper function to generate plan description
  const getPlanDescription = (planName) => {
    switch (planName) {
      case "Gratuit":
        return "Parfait pour débuter";
      case "Tikiita plus":
        return "Le plus populaire";
      case "Tikiita pro":
        return "Pour les grandes entreprises";
      default:
        return "Plan personnalisé";
    }
  };

  // Helper function to generate plan features
  const getPlanFeatures = (plan) => {
    const planName = plan.name || plan.plan_name;
    switch (planName) {
      case "Gratuit":
        return [
          "5 reçus par mois",
          "1 modèle de reçus",
          "Support 24h/24",
          "Historique 3 mois",
        ];
      case "Tikiita plus":
        return [
          "140 reçus par mois",
          "3 modèles de reçus",
          "Support 24/7",
          "Historique 5 mois",
        ];
      case "Tikiita pro":
        return [
          "Reçus illimités",
          "Modèles illimités",
          "Support 24h/7",
          "Historique illimité",
          "Statistiques détaillées (à venir)",
        ];
      default:
        return ["Fonctionnalités personnalisées"];
    }
  };

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setIsLoading(true);
        console.log("Récupération des données d'abonnement depuis /user/subscriptions/subscription/", {
          url: `${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          date: new Date().toISOString(),
        });
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!response.ok) {
          throw new Error(`Échec de la récupération des données d'abonnement : ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Données d'abonnement reçues :", data);
        setCurrentPlanData({
          name: data.plan_name,
          status: data.subscription_status,
          endDate: new Date(data.end_date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          receiptsUsed: data.receipts_generated || 0,
          receiptsTotal: data.total_quota || 0,
          receiptsRemaining: data.remaining_quota || 0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'abonnement :", error);
        toast.error(error.message || "Erreur lors du chargement des données d'abonnement.", { duration: 5000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptionData();
  }, [companyId, token]);

  const handlePurchase = async () => {
    console.log("Démarrage de handlePurchase", {
      companyId,
      token: token ? "Présent" : "Absent",
      selectedPlan,
      paymentMethod,
      paymentCode,
      date: new Date().toISOString(),
    });
    if (!paymentMethod || !paymentCode) {
      console.warn("Validation échouée : méthode de paiement ou code manquant", { paymentMethod, paymentCode });
      toast.error("Veuillez sélectionner un mode de paiement et entrer une référence.", { duration: 5000 });
      return;
    }
    if (!selectedPlan || !selectedPlan.plan_id || !selectedPlan.name) {
      console.warn("Validation échouée : plan sélectionné invalide", { selectedPlan });
      toast.error("Veuillez sélectionner un plan valide.", { duration: 5000 });
      return;
    }
    const selectedPlanData = plans.find((plan) => plan.plan_id === selectedPlan.plan_id);
    if (!selectedPlanData) {
      console.warn("Plan sélectionné non trouvé dans la liste des plans", { selectedPlan, plans });
      toast.error("Plan sélectionné invalide.", { duration: 5000 });
      return;
    }
    try {
      // Préparer et logger la requête d'abonnement
      const subscribePayload = {
        companyId: String(companyId),
        planId: String(selectedPlan.plan_id),
      };
      console.log("Envoi à /user/subscriptions/subscribe/", {
        url: `${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscribe/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "Aucun",
        },
        payload: subscribePayload,
        date: new Date().toISOString(),
      });
      // Étape 1 : Créer l'abonnement
      const subscribeResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscribe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(subscribePayload),
      });
      const subscribeResponseText = await subscribeResponse.text();
      console.log("Réponse brute de /user/subscriptions/subscribe/", {
        status: subscribeResponse.status,
        statusText: subscribeResponse.statusText,
        responseText: subscribeResponseText,
        date: new Date().toISOString(),
      });
      if (!subscribeResponse.ok) {
        let errorMessage = `Échec de la création de l'abonnement : ${subscribeResponse.status} ${subscribeResponse.statusText}`;
        try {
          const parsedError = JSON.parse(subscribeResponseText);
          console.log("Réponse d'erreur parsée :", parsedError);
          errorMessage = parsedError.message || errorMessage;
        } catch (e) {
          console.error("Impossible de parser la réponse d'erreur en JSON :", e);
        }
        throw new Error(errorMessage);
      }
      const subscribeData = JSON.parse(subscribeResponseText);
      const subscriptionId = subscribeData.data[0].subscription_id;
      console.log("Abonnement créé avec succès :", subscribeData);
      // Préparer et logger la requête de paiement
      const paymentPayload = {
        company_id: String(companyId),
        subscription_id: subscriptionId,
        amount: parseInt(selectedPlan.price.replace(/\s/g, ""), 10),
        payment_method: paymentMethod,
        reference: paymentCode,
      };
      console.log("Envoi à /payments/", {
        url: `${import.meta.env.VITE_BASE_API_URL}/payments/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "Aucun",
        },
        payload: paymentPayload,
        date: new Date().toISOString(),
      });
      // Étape 2 : Créer le paiement
      const paymentResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/payments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(paymentPayload),
      });
      const paymentResponseText = await paymentResponse.text();
      console.log("Réponse brute de /payments/", {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        responseText: paymentResponseText,
        date: new Date().toISOString(),
      });
      if (!paymentResponse.ok) {
        let errorMessage = `Échec de la création du paiement : ${paymentResponse.status} ${paymentResponse.statusText}`;
        try {
          const parsedError = JSON.parse(paymentResponseText);
          console.log("Réponse d'erreur parsée (paiement) :", parsedError);
          errorMessage = parsedError.message || errorMessage;
        } catch (e) {
          console.error("Impossible de parser la réponse d'erreur (paiement) en JSON :", e);
        }
        throw new Error(errorMessage);
      }
      // Mettre à jour l'état après succès
      toast.success(`Abonnement ${selectedPlan.name} créé avec succès !`, { duration: 5000 });
      setCurrentPlanData({
        name: selectedPlan.name,
        status: subscribeData.data[0].status,
        endDate: new Date(subscribeData.data[0].end_date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        receiptsUsed: 0,
        receiptsTotal: selectedPlanData.max_receipts_per_month || 0,
        receiptsRemaining: selectedPlanData.max_receipts_per_month || 0,
      });
      setSelectedPlan(null);
      setPaymentMethod("");
      setPaymentCode("");
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
      toast.error(error.message || "Erreur lors de la création de l'abonnement ou du paiement.", { duration: 5000 });
    }
  };

  const usagePercentage = currentPlanData && currentPlanData.receiptsTotal
    ? (currentPlanData.receiptsUsed / currentPlanData.receiptsTotal) * 100
    : 0;

  const getGaugeColor = () => {
    if (usagePercentage <= 50) return "bg-green-600";
    if (usagePercentage <= 80) return "bg-black";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mobile-nav-padding">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#f0fff4",
              color: "#15803d",
              border: "1px solid #bbf7d0",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            },
          },
        }}
      />
      <Header title="Abonnement" />
      <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Current Plan Status */}
        {isLoading || !currentPlanData ? (
          <Card className="shadow-lg rounded-3xl border-none bg-white">
            <CardContent className="p-8">
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
              <Skeleton className="h-4 w-full mt-6" />
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg rounded-3xl border-none bg-gradient-to-br from-white to-gray-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Plan Actuel : {currentPlanData.name}</h3>
                  <p className="text-gray-600 mb-4 text-lg">
                    Actif jusqu'au {currentPlanData.endDate}
                  </p>
                  <div className="flex items-center gap-4 text-base">
                    <span className="text-green-600 font-semibold">
                      {currentPlanData.receiptsUsed} / {currentPlanData.receiptsTotal} reçus utilisés
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{currentPlanData.receiptsRemaining} restants</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`w-4 h-4 rounded-full mb-3 ml-auto ${
                      currentPlanData.status === "active"
                        ? "bg-green-600"
                        : currentPlanData.status === "inactive"
                        ? "bg-black"
                        : "bg-red-600"
                    } animate-pulse`}
                  ></div>
                  <span
                    className={`font-semibold text-lg ${
                      currentPlanData.status === "active"
                        ? "text-green-600"
                        : currentPlanData.status === "inactive"
                        ? "text-black"
                        : "text-red-600"
                    }`}
                  >
                    {currentPlanData.status === "active" ? "Actif" : currentPlanData.status === "inactive" ? "Inactif" : "Expiré"}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${getGaugeColor()}`}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Choisissez Votre Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Boostez votre expérience avec l'abonnement parfait pour vos besoins professionnels.
            </p>
          </div>
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="shadow-lg rounded-3xl border-none">
                  <CardContent className="p-6">
                    <Skeleton className="h-14 w-14 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-32 mx-auto mt-4" />
                    <Skeleton className="h-12 w-48 mx-auto mt-2" />
                    <Skeleton className="h-5 w-64 mx-auto mt-2" />
                    <div className="space-y-2 mt-6">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-12 w-full mt-6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.plan_id}
                  className={cn(
                    "relative border-none shadow-lg rounded-3xl transform transition-all duration-300 hover:shadow-2xl hover:scale-105",
                    plan.color
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse">
                      <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                        Recommandé
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-6 pt-8">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-white/30 transform hover:scale-110 transition-transform duration-300">
                      <plan.icon className="w-12 h-12" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white">
                      {plan.name}
                    </CardTitle>
                    <div className="text-center mt-2">
                      <span className="text-5xl font-extrabold text-orange-600">
                        {plan.price}
                      </span>
                      <span className="text-white/80 text-lg"> FCFA/{plan.period}</span>
                    </div>
                    <p className="text-white/90 mt-3 text-base font-medium">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6 px-6 pb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                          <span className="text-white text-base font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className={cn(
                            "w-full text-lg font-semibold shadow-md rounded-xl py-6 transition-all duration-300",
                            plan.buttonColor,
                            currentPlanData && currentPlanData.name === plan.name ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
                          )}
                          disabled={currentPlanData && currentPlanData.name === plan.name}
                          onClick={() => {
                            if (!plan.plan_id || !plan.name) {
                              console.warn("Tentative de sélection d'un plan invalide :", plan);
                              toast.error("Le plan sélectionné est invalide. Veuillez réessayer.", { duration: 5000 });
                              return;
                            }
                            console.log("Plan sélectionné :", plan);
                            setSelectedPlan({
                              plan_id: plan.plan_id,
                              name: plan.name,
                              price: plan.price,
                            });
                          }}
                        >
                          {currentPlanData && currentPlanData.name === plan.name ? "Plan Actuel" : "Choisir ce Plan"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-xl animate-in fade-in duration-300">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                            Acheter le Plan {plan.name}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Sélectionnez un mode de paiement et suivez les instructions pour effectuer le paiement.
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
                                    <img
                                      src="https://play-lh.googleusercontent.com/3VQdrow4EaN_z5Vt-2qYJOKZ2L5c8VAqf-QYGqD7wxgqR4PE2KUc9NbsUkjT60cIlg0=w240-h480"
                                      alt="Amanata"
                                      className="h-6 w-auto"
                                    />
                                    Amanata
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Payment Instructions */}
                          {paymentMethod === "NITA" && (
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <img
                                  src="/payment/nitaQrCode.jpeg"
                                  alt="NITA QR Code"
                                  className="h-48 w-48 object-contain"
                                />
                              </div>
                              <p className="text-gray-700 text-center">
                                Scannez le QR code ci-dessus ou effectuez un compte-à-compte au numéro <span className="font-semibold">+227 94591058</span>, puis renseignez le code ou la référence de l'opération ci-dessous.
                              </p>
                            </div>
                          )}
                          {paymentMethod === "Amanata" && (
                            <div className="space-y-4">
                              <p className="text-gray-700 text-center">
                                Effectuez un compte-à-compte au numéro <span className="font-semibold">+227 88715276</span>, puis renseignez le code ou la référence de l'opération ci-dessous.
                              </p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="paymentCode" className="text-gray-900 font-medium">
                              Code de recharge ou référence
                            </Label>
                            <Input
                              id="paymentCode"
                              value={paymentCode}
                              onChange={(e) => setPaymentCode(e.target.value)}
                              placeholder="Entrez le code ou la référence"
                              className="border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                          <AlertDialogCancel
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg"
                            onClick={() => {
                              setPaymentMethod("");
                              setPaymentCode("");
                            }}
                          >
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
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
          )}
        </div>
        {/* FAQ Section */}
        <Card className="border-none shadow-lg rounded-3xl bg-gradient-to-br from-white to-gray-100">
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
                <p className="text-gray-600 text-base">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment.
                  Les changements prennent effet immédiatement.
                </p>
              </div>
              {/* <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  Que se passe-t-il si je dépasse ma limite de reçus ?
                </h4>
                <p className="text-gray-600 text-base">
                  Vous serez automatiquement facturé pour les reçus supplémentaires
                  au tarif de 100 FCFA par reçu.
                </p>
              </div> */}
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  Y a-t-il une période d'essai gratuite ?
                </h4>
                <p className="text-gray-600 text-base">
                  Oui, tous les nouveaux utilisateurs bénéficient de 1 mois d'essai
                  gratuit sur le plan "Gratuit".
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
