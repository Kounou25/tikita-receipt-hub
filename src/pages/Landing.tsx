
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, FileText, Smartphone, Users, Star, Shield, Zap, TrendingUp, Sparkles, Globe, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Génération intelligente",
      description: "Créez des reçus professionnels avec IA intégrée et modèles adaptatifs.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Smartphone,
      title: "Mobile-first",
      description: "Interface entièrement optimisée pour smartphone avec mode hors-ligne.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "CRM intégré",
      description: "Gestion avancée des clients avec historique et analytics prédictifs.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Chiffrement bout-à-bout et conformité aux standards bancaires nigériens.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Globe,
      title: "Multi-devises",
      description: "Support FCFA, USD, EUR avec taux de change en temps réel.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: BarChart,
      title: "Analytics IA",
      description: "Insights business alimentés par intelligence artificielle.",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const testimonials = [
    {
      name: "Amina Abdoul",
      role: "E-commerçante • Niamey",
      content: "Tikiita a transformé mon business. Mes clients adorent recevoir des reçus si professionnels !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Ibrahim Moussa", 
      role: "Vendeur mobile • Maradi",
      content: "Interface parfaite même avec une connexion limitée. Révolutionnaire pour le Niger !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Fatouma Hassan",
      role: "Boutique mode • Zinder",
      content: "Mes ventes ont augmenté de 40% grâce à la confiance que donnent ces reçus numériques.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "0",
      period: "Gratuit",
      description: "Parfait pour débuter",
      features: ["25 reçus/mois", "Templates de base", "Support communauté", "Mode hors-ligne"],
      popular: false,
      gradient: "from-gray-50 to-gray-100"
    },
    {
      name: "Pro",
      price: "3,500",
      period: "/mois",
      description: "Pour entrepreneurs actifs",
      features: ["Reçus illimités", "Templates premium", "Support prioritaire", "Analytics avancés", "Multi-devises", "API accès"],
      popular: true,
      gradient: "from-primary-50 to-primary-100"
    },
    {
      name: "Business",
      price: "Sur mesure",
      period: "",
      description: "Solutions entreprises",
      features: ["Infrastructure dédiée", "Formation équipe", "Support 24/7", "Intégrations custom", "Conformité bancaire", "Manager dédié"],
      popular: false,
      gradient: "from-secondary-50 to-secondary-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Header avec glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5">
        <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/d1d0c3ac-8062-46a5-b530-0b60f9d9f249.png" 
                alt="Tikiita Logo" 
                className="h-6 w-6"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Tikiita
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link to="/login">
              <Button variant="outline" className="border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Inscription
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-primary-200">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary-600 to-primary-700">
                Inscription
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section avec animations */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-secondary-50/30"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="text-center space-y-8">
            <div className="animate-fade-in">
              <Badge className="bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 hover:from-primary-200 hover:to-secondary-200 px-6 py-2 text-sm font-medium border-0 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Nouveau : IA intégrée pour reçus intelligents
              </Badge>
            </div>
            
            <div className="animate-fade-in space-y-6">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                L'avenir des
                <span className="block bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent animate-glow">
                  reçus numériques
                </span>
                <span className="block text-gray-800">au Niger</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                La première plateforme nigérienne de reçus intelligents. 
                <span className="font-semibold text-primary-700"> Alimentée par IA</span>, 
                conçue pour l'écosystème économique local.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Démarrer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300">
                  Découvrir la démo
                </Button>
              </Link>
            </div>

            {/* Stats avec animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
              {[
                { value: "2,500+", label: "Entrepreneurs" },
                { value: "150K+", label: "Reçus générés" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support local" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section modernisée */}
      <section id="features" className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-50/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <Badge className="bg-primary-100 text-primary-700 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Fonctionnalités avancées
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Technologie de pointe pour le Niger
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils pensés spécifiquement pour l'écosystème économique nigérien, 
              alliant simplicité et innovation technologique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors">
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

      {/* Testimonials Section avec avatars */}
      <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-br from-primary-50 to-secondary-50 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <Badge className="bg-white/80 text-primary-700 mb-6 shadow-lg">
              <Users className="w-4 h-4 mr-2" />
              Témoignages clients
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ils révolutionnent leur business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plus de 2,500 entrepreneurs nigériens nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover shadow-lg"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-primary-600 text-sm font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section modernisée */}
      <section id="pricing" className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-secondary-50/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <Badge className="bg-secondary-100 text-secondary-700 mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tarification transparente
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des tarifs adaptés au marché nigérien. Sans engagement, sans frais cachés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 ${plan.popular ? 'scale-105 shadow-2xl' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-600 p-3">
                    <p className="text-white text-center font-semibold text-sm">
                      ⭐ Le plus populaire
                    </p>
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`}></div>
                <CardContent className={`relative p-8 text-center ${plan.popular ? 'pt-16' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-gray-600"> FCFA{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg' : 'bg-gray-900 hover:bg-gray-800'} transition-all duration-300 transform hover:scale-105`}>
                      Commencer maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section avec gradient animé */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Prêt à révolutionner votre business ?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Rejoignez la révolution numérique au Niger. Plus de 2,500 entrepreneurs 
            nous font déjà confiance pour leurs reçus intelligents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Créer mon compte gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto transition-all duration-300">
                Voir une démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer modernisé */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/d1d0c3ac-8062-46a5-b530-0b60f9d9f249.png" 
                    alt="Tikiita Logo" 
                    className="h-6 w-6"
                  />
                </div>
                <span className="text-xl font-bold">Tikiita</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                La première plateforme nigérienne de reçus intelligents. 
                Révolutionnez votre business avec la technologie de demain.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-primary-400">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors hover:text-primary-300">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors hover:text-primary-300">Tarifs</a></li>
                <li><Link to="/support" className="hover:text-white transition-colors hover:text-primary-300">Support</Link></li>
                <li><a href="#" className="hover:text-white transition-colors hover:text-primary-300">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-primary-400">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:text-primary-300">CGU</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:text-primary-300">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:text-primary-300">CGV</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:text-primary-300">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 Tikiita. Tous droits réservés. Fait avec ❤️ au Niger.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm">Tous systèmes opérationnels</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
