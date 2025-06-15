
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
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      popular: true
    },
    {
      id: "classic",
      name: "Classique",
      description: "Style traditionnel et élégant",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "minimal",
      name: "Minimaliste",
      description: "Simple et efficace",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "colorful",
      name: "Coloré",
      description: "Design vibrant et attractif",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "business",
      name: "Business",
      description: "Professionnel pour entreprises",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "invoice",
      name: "Facture",
      description: "Format facture détaillé",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
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

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Choisissez un modèle de reçu
            </CardTitle>
            <p className="text-gray-600">
              Sélectionnez le design qui correspond le mieux à votre marque
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                      Populaire
                    </div>
                  )}
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleContinue}
                disabled={!selectedTemplate}
                className="bg-primary hover:bg-primary/90"
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
