import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Check, Zap, Star, Briefcase } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getCookie } from "@/lib/cookies";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl", className)} />
);

const Subscription = () => {
  useScrollToTop();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [currentPlanData, setCurrentPlanData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const companyId = getCookie("company_id");
  const token = getCookie("token") || null;

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
      toast.success(`Veuillez patienter pendant que nous activons votre abonnement. \n cela peut prendre un certain temps`, { duration: 7000 });
      toast.success(`Abonnement ${selectedPlan.name} créé avec succès !`, { duration: 7000 });

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      <Toaster position="top-right" />

      <Header title={t('pages.subscription')} showMenu={true} />

      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />

        {/* Current Plan Status */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-md transition-shadow mb-12">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-black dark:text-white mb-3">Plan actuel : {currentPlanData?.name || "Gratuit"}</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">Actif jusqu'au {currentPlanData?.endDate || "-"}</p>
                </div>
                <div className="text-right">
                  <div className={cn("w-5 h-5 rounded-full inline-block mr-3 animate-pulse", getGaugeColor())} />
                  <span className="text-2xl font-bold text-black dark:text-white">
                    {currentPlanData?.status === "active" ? "Actif" : currentPlanData?.status === "inactive" ? "Inactif" : "Expiré"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xl">
                  <span className="text-gray-700 dark:text-gray-300">Utilisation ce mois</span>
                  <span className="font-bold text-black dark:text-white">
                    {currentPlanData?.receiptsUsed || 0} / {currentPlanData?.receiptsTotal || 0}
                  </span>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", getGaugeColor())}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                <p className="text-lg text-gray-600 text-center">
                  {currentPlanData?.receiptsRemaining || 0} documents restants
                </p>
              </div>
            </>
          )}
        </div>

        {/* Plans Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black dark:text-white mb-4">Choisissez votre plan</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Boostez votre expérience avec l'abonnement parfait pour vos besoins professionnels.
          </p>
        </div>

        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <Skeleton className="h-16 w-16 mx-auto rounded-full mb-6" />
                <Skeleton className="h-10 w-48 mx-auto mb-4" />
                <Skeleton className="h-16 w-32 mx-auto mb-8" />
                <div className="space-y-4 mb-8">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-6 w-full" />
                  ))}
                </div>
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.plan_id}
                className={cn(
                  "relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl transition-all duration-300",
                  plan.popular && "ring-4 ring-black/20 dark:ring-white/20 scale-105"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Recommandé
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={cn("w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6", plan.color)}>
                    <plan.icon className="w-10 h-10 text-white dark:text-black" />
                  </div>
                  <h3 className="text-3xl font-bold text-black dark:text-white mb-2">{plan.name}</h3>
                  <div className="my-6">
                    <span className="text-5xl font-extrabold text-black dark:text-white">{plan.price}</span>
                    <span className="text-xl text-gray-600 dark:text-gray-400"> FCFA/{plan.period}</span>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={cn(
                        "w-full h-14 text-lg font-semibold rounded-xl shadow-md transition-all",
                        plan.buttonColor,
                        currentPlanData && currentPlanData.name === plan.name ? "opacity-60 cursor-not-allowed" : ""
                      )}
                      disabled={currentPlanData && currentPlanData.name === plan.name}
                      onClick={() => {
                        if (!plan.plan_id || !plan.name) {
                          toast.error("Le plan sélectionné est invalide.", { duration: 5000 });
                          return;
                        }
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

                  <AlertDialogContent className="max-w-2xl rounded-xl bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-bold text-black">
                        Acheter le Plan {plan.name}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base text-gray-600">
                        Sélectionnez un mode de paiement et suivez les instructions pour effectuer le paiement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-8 py-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">Mode de paiement</Label>
                        <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                          <SelectTrigger className="h-14 text-base rounded-xl">
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

                      {paymentMethod === "NITA" && (
                        <div className="text-center space-y-6">
                          <img
                            src="/payment/nitaQrCode.jpeg"
                            alt="NITA QR Code"
                            className="mx-auto w-64 h-64 object-contain rounded-xl border border-gray-200"
                          />
                          <p className="text-gray-700 text-lg">
                            Scannez le QR code ci-dessus ou effectuez un compte-à-compte au numéro <span className="font-semibold">+227 94591058</span>, puis renseignez le code ou la référence de l'opération ci-dessous.
                          </p>
                        </div>
                      )}

                      {paymentMethod === "Amanata" && (
                        <div className="text-center space-y-6">
                          <p className="text-gray-700 text-lg">
                            Effectuez un compte-à-compte au numéro <span className="font-semibold">+227 88715276</span>, puis renseignez le code ou la référence de l'opération ci-dessous.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">Code de recharge ou référence</Label>
                        <Input
                          value={paymentCode}
                          onChange={(e) => setPaymentCode(e.target.value)}
                          placeholder="Entrez le code ou la référence"
                          className="h-14 text-base rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <AlertDialogCancel
                        className="h-12 px-8 rounded-xl"
                        onClick={() => {
                          setPaymentMethod("");
                          setPaymentCode("");
                        }}
                      >
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="h-12 px-8 rounded-xl bg-black hover:bg-black/90 text-white font-medium"
                        onClick={handlePurchase}
                      >
                        Confirmer le Paiement
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 bg-white border border-gray-200 rounded-xl p-10 hover:shadow-md transition-shadow">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Questions Fréquentes</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-semibold text-black mb-3">
                Puis-je changer de plan à tout moment ?
              </h4>
              <p className="text-gray-600 text-lg">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment.
                Les changements prennent effet immédiatement.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-black mb-3">
                Y a-t-il une période d'essai gratuite ?
              </h4>
              <p className="text-gray-600 text-lg">
                Oui, tous les nouveaux utilisateurs bénéficient de 1 mois d'essai
                gratuit sur le plan "Gratuit".
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Subscription;