
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GenerateReceiptStep1 = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const navigate = useNavigate();

  const templates = [
    {
      id: "modern",
      name: "Moderne",
      description: "Design épuré et professionnel",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      popular: true
    },
    {
      id: "classic",
      name: "Classique",
      description: "Style traditionnel et élégant",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "minimal",
      name: "Minimaliste",
      description: "Simple et efficace",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "colorful",
      name: "Coloré",
      description: "Design vibrant et attractif",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "business",
      name: "Business",
      description: "Professionnel pour entreprises",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "invoice",
      name: "Facture",
      description: "Format facture détaillé",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const handleContinue = () => {
    if (selectedTemplate) {
      localStorage.setItem("selectedTemplate", selectedTemplate);
      navigate("/generate/step2");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Générer un reçu" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Modèle</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-medium">
              2
            </div>
            <span className="ml-2 text-sm text-gray-500">Détails</span>
          </div>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Choisissez un modèle de reçu
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sélectionnez le design qui correspond le mieux à votre marque
            </p>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                      Populaire
                    </div>
                  )}
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div className="p-3">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-2 overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleContinue}
                disabled={!selectedTemplate}
                className="bg-primary hover:bg-primary/90 px-8 py-2 rounded-lg font-medium"
                size="lg"
              >
                Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenerateReceiptStep1;
