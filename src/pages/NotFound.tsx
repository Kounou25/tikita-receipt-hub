
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Tikita</span>
          </div>
        </div>

        {/* 404 Content */}
        <Card className="border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-gray-400">404</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Page introuvable
            </h1>
            
            <p className="text-gray-600 mb-6">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="space-y-3">
              <Link to="/dashboard">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Home className="w-4 h-4 mr-2" />
                  Retour au tableau de bord
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Page précédente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug info */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-gray-900 mb-2">Information de débogage :</h3>
            <p className="text-sm text-gray-600">
              <strong>URL tentée :</strong> {location.pathname}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
