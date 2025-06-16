
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, FileText, Smartphone, Users, Star, Shield, Zap, TrendingUp, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Génération de reçus",
      description: "Créez des reçus professionnels en quelques clics, conformes aux standards nigériens."
    },
    {
      icon: Smartphone,
      title: "Application mobile",
      description: "Accédez à vos reçus partout au Niger, même avec une connexion internet limitée."
    },
    {
      icon: Users,
      title: "Gestion clients",
      description: "Organisez votre clientèle et suivez vos transactions facilement."
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Vos données sont protégées selon les normes internationales de sécurité."
    },
    {
      icon: Zap,
      title: "Rapidité optimale",
      description: "Génération instantanée même avec une connexion internet faible."
    },
    {
      icon: TrendingUp,
      title: "Suivi des ventes",
      description: "Analysez vos performances commerciales avec des statistiques détaillées."
    }
  ];

  const testimonials = [
    {
      name: "Aïcha Mamadou",
      role: "Commerçante à Niamey",
      location: "Niamey",
      content: "Tikita m'aide à professionnaliser mon commerce. Mes clients apprécient les reçus détaillés !",
      rating: 5
    },
    {
      name: "Ibrahim Souley",
      role: "Vendeur en ligne",
      location: "Zinder",
      content: "Parfait pour mon business en ligne. Interface simple et adaptée à nos besoins.",
      rating: 5
    },
    {
      name: "Mariama Issoufou",
      role: "Entrepreneuse",
      location: "Maradi",
      content: "Le meilleur outil pour digitaliser mon activité. Support client excellent !",
      rating: 5
    }
  ];

  const pricing = [
    {
      name: "Gratuit",
      price: "0",
      period: "FCFA",
      description: "Pour débuter",
      features: ["20 reçus/mois", "Modèles de base", "Support communautaire"],
      popular: false
    },
    {
      name: "Professionnel",
      price: "3,000",
      period: "FCFA/mois",
      description: "Pour les commerçants",
      features: ["200 reçus/mois", "Tous les modèles", "Support prioritaire", "Statistiques avancées"],
      popular: true
    },
    {
      name: "Entreprise",
      price: "Sur mesure",
      period: "",
      description: "Pour les grandes structures",
      features: ["Reçus illimités", "API personnalisée", "Formation incluse", "Support dédié"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/98b915da-4744-4a07-84d2-b2d5065e9c15.png" 
              alt="Tikita Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Tikita Niger
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Tarifs
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Témoignages
            </a>
            <Link to="/login">
              <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700">
                Inscription
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-orange-200">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-orange-600 to-green-600">
                Inscription
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97316" fill-opacity="0.05"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 md:py-32 relative">
          <div className="text-center space-y-8">
            <Badge className="bg-gradient-to-r from-orange-100 to-green-100 text-orange-700 hover:bg-orange-100 px-6 py-3 text-base font-bold border-2 border-orange-200 shadow-lg">
              🇳🇪 Solution 100% Nigérienne - Par et Pour le Niger
            </Badge>
            
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Révolutionnez votre
                <span className="block bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                  commerce au Niger
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
                La première plateforme nigérienne pour créer des reçus numériques professionnels. 
                Adaptée aux réalités du marché local : connexion faible, paiements mobile money, 
                langues locales supportées.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-xl px-10 py-5 h-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  Démarrer gratuitement
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-xl px-10 py-5 h-auto border-2 border-orange-300 hover:bg-orange-50 shadow-lg">
                  Voir une démo
                </Button>
              </Link>
            </div>

            {/* Niger Stats avec drapeaux et couleurs locales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-orange-200">
                <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-3">1,200+</div>
                <div className="text-gray-700 font-medium">Commerçants nigériens</div>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-green-200">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-3">45K+</div>
                <div className="text-gray-700 font-medium">Reçus générés</div>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-red-200">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-3">8</div>
                <div className="text-gray-700 font-medium">Régions du Niger</div>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-orange-200">
                <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-3">24/7</div>
                <div className="text-gray-700 font-medium">Support local</div>
              </div>
            </div>

            {/* Section spéciale Niger */}
            <div className="mt-16 p-8 bg-gradient-to-r from-orange-100 to-green-100 rounded-2xl border-2 border-orange-200 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🏪 Conçu pour les réalités nigériennes
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mobile Money</h4>
                    <p className="text-gray-700">Support Orange Money, Moov Money, Airtel Money</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🌐</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Hors ligne</h4>
                    <p className="text-gray-700">Fonctionne même avec une connexion faible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Prix local</h4>
                    <p className="text-gray-700">Tarifs adaptés au marché nigérien</p>
                  </div>
                </div>
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
              Adapté aux commerçants nigériens
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils pensés pour les entrepreneurs du Niger, de Niamey à Agadez, 
              en passant par Zinder, Maradi et toutes les régions du pays.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-orange-200 group-hover:to-green-200 transition-colors">
                    <feature.icon className="w-8 h-8 text-orange-600" />
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
      <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-br from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ils nous font confiance au Niger
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des commerçants de tout le Niger utilisent Tikita pour développer leur activité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-orange-600 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </p>
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
              Tarifs accessibles au Niger
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des prix adaptés au marché nigérien. Commencez gratuitement et évoluez selon vos besoins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-orange-500 shadow-xl scale-105' : 'border-orange-100'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-600 to-green-600 text-white">
                    Le plus choisi
                  </Badge>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-600"> {plan.period}</span>}
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
                    <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
                      Commencer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-orange-600 via-red-500 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Rejoignez la révolution digitale nigérienne
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Modernisez votre commerce avec Tikita et rejoignez des centaines de commerçants nigériens qui nous font confiance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-orange-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto">
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

          <div className="grid md:grid-cols-3 gap-6 text-white/90">
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+227 XX XX XX XX</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span>contact@tikita.ne</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Niamey, Niger</span>
            </div>
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
                <span className="text-2xl font-bold">Tikita Niger</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La première plateforme nigérienne de génération de reçus numériques. 
                Conçue par des Nigériens, pour les Nigériens.
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
              &copy; 2024 Tikita Niger. Tous droits réservés.
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
