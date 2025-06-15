
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { Check, Crown, Zap, Star } from "lucide-react";

const Subscription = () => {
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
      color: "border-blue-200",
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
      color: "border-primary",
      buttonColor: "bg-primary hover:bg-primary/90",
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
      color: "border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false
    }
  ];

  const currentPlan = "Premium"; // This would come from user data

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Abonnement" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Current Plan Status */}
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Actuel : Premium</h3>
                <p className="text-gray-600 mb-2">
                  Votre abonnement est actif jusqu'au 15 juillet 2024
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 font-medium">847 / 1,000 reçus utilisés</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">153 reçus restants</span>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 bg-green-500 rounded-full mb-2 ml-auto"></div>
                <span className="text-green-600 font-medium">Actif</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '84.7%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choisissez votre plan
            </h2>
            <p className="text-gray-600">
              Sélectionnez l'abonnement qui correspond le mieux à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    plan.name === 'Basic' ? 'bg-blue-100' :
                    plan.name === 'Premium' ? 'bg-primary/10' : 'bg-purple-100'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.name === 'Basic' ? 'text-blue-600' :
                      plan.name === 'Premium' ? 'text-primary' : 'text-purple-600'
                    }`} />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600"> FCFA/{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.buttonColor} ${
                      currentPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={currentPlan === plan.name}
                  >
                    {currentPlan === plan.name ? 'Plan actuel' : 'Choisir ce plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Questions fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Puis-je changer de plan à tout moment ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                  Les changements prennent effet immédiatement.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Que se passe-t-il si je dépasse ma limite de reçus ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Vous serez automatiquement facturé pour les reçus supplémentaires 
                  au tarif de 100 FCFA par reçu.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
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
