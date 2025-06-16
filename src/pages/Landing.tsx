
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, FileText, Smartphone, Users, Star, Shield, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Génération de reçus",
      description: "Créez des reçus professionnels en quelques clics avec nos modèles personnalisables."
    },
    {
      icon: Smartphone,
      title: "Application mobile",
      description: "Interface optimisée mobile pour générer vos reçus n'importe où, n'importe quand."
    },
    {
      icon: Users,
      title: "Gestion clients",
      description: "Gérez facilement vos clients et conservez un historique complet de vos transactions."
    },
    {
      icon: Shield,
      title: "Sécurité avancée",
      description: "Vos données sont protégées avec un chiffrement de niveau bancaire."
    },
    {
      icon: Zap,
      title: "Performance rapide",
      description: "Génération instantanée de reçus pour une expérience utilisateur optimale."
    },
    {
      icon: TrendingUp,
      title: "Analytics détaillés",
      description: "Suivez vos performances avec des statistiques complètes et des rapports."
    }
  ];

  const testimonials = [
    {
      name: "Marie Kouassi",
      role: "Vendeuse en ligne",
      content: "Tikita a révolutionné ma façon de gérer mes reçus. Simple, rapide et professionnel !",
      rating: 5
    },
    {
      name: "Jean Brou",
      role: "E-commerçant",
      content: "Interface intuitive et fonctionnalités complètes. Je recommande vivement !",
      rating: 5
    },
    {
      name: "Fatou Diallo",
      role: "Entrepreneur",
      content: "Le meilleur outil pour la gestion de reçus en Côte d'Ivoire. Support client excellent !",
      rating: 5
    }
  ];

  const pricing = [
    {
      name: "Basic",
      price: "0",
      period: "Gratuit",
      description: "Pour commencer",
      features: ["10 reçus/mois", "Modèles de base", "Support email"],
      popular: false
    },
    {
      name: "Premium",
      price: "2,500",
      period: "/mois",
      description: "Pour les pros",
      features: ["100 reçus/mois", "Tous les modèles", "Support prioritaire", "Analytics avancés"],
      popular: true
    },
    {
      name: "Entreprise",
      price: "Sur mesure",
      period: "",
      description: "Pour les grandes équipes",
      features: ["Reçus illimités", "API personnalisée", "Support dédié", "Formation incluse"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/98b915da-4744-4a07-84d2-b2d5065e9c15.png" 
              alt="Tikita Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Tikita
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Tarifs
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Témoignages
            </a>
            <Link to="/login">
              <Button variant="outline" className="border-green-200 hover:bg-green-50">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-green-600 hover:bg-green-700">
                Inscription
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-green-200">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Inscription
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="text-center space-y-8">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-2 text-sm font-medium">
              🎉 Nouveau : Interface mobile optimisée
            </Badge>
            
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Révolutionnez
                <span className="block bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  vos reçus numériques
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                La plateforme #1 en Côte d'Ivoire pour créer des reçus professionnels. 
                Simple, rapide et adapté aux vendeurs en ligne modernes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 h-auto">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-green-200 hover:bg-green-50">
                  Voir une démo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600">Reçus générés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-gray-600">Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils puissants et intuitifs pour simplifier la gestion de vos reçus 
              et développer votre activité en ligne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-green-100 hover:border-green-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plus de 1000 vendeurs nous font confiance pour leurs reçus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-green-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-green-600 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Tarifs transparents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Pas de frais cachés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-green-500 shadow-xl scale-105' : 'border-green-100'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                    Le plus populaire
                  </Badge>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-600"> FCFA{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
                      Commencer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Prêt à révolutionner vos reçus ?
          </h2>
          <p className="text-xl text-green-100 mb-12">
            Rejoignez des milliers de vendeurs qui font confiance à Tikita 
            pour leurs reçus numériques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto">
                Créer mon compte gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto">
                Voir une démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/lovable-uploads/98b915da-4744-4a07-84d2-b2d5065e9c15.png" 
                  alt="Tikita Logo" 
                  className="w-10 h-10 rounded-lg"
                />
                <span className="text-2xl font-bold">Tikita</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La plateforme de référence pour la génération de reçus numériques 
                en Côte d'Ivoire. Simple, rapide et professionnel.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGV</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 Tikita. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
