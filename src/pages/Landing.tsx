
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, CheckCircle, FileText, Smartphone, Users } from "lucide-react";
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      {/* Header */}
      <header className="px-4 py-6 md:px-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Tikita</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Tarifs
            </a>
            <Link to="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button>Inscription</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Inscription</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="text-center space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Générez vos reçus
              <span className="block text-primary">en toute simplicité</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tikita est la plateforme de génération de reçus numériques dédiée aux vendeurs en ligne. 
              Créez des reçus professionnels, gérez vos clients et suivez vos performances.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Voir une démo
              </Button>
            </Link>
          </div>

          <div className="mt-16 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Dashboard Tikita"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils puissants pour simplifier la gestion de vos reçus et développer votre activité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-primary-50 mb-8">
            Rejoignez des milliers de vendeurs qui font confiance à Tikita pour leurs reçus.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-50">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Tikita</span>
            </div>
            
            <div className="flex space-x-6 text-gray-400">
              <Link to="/support" className="hover:text-white transition-colors">
                Support
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Conditions
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Confidentialité
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tikita. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
