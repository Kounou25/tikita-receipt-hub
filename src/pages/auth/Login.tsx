
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - redirect to dashboard
    navigate("/dashboard");
  };

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

        {/* Login Form */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Connexion
            </CardTitle>
            <p className="text-gray-600">
              Accédez à votre espace de génération de reçus
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email ou numéro de téléphone</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="votre@email.com ou +123456789"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="border-gray-300 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Se souvenir de moi
                  </Label>
                </div>
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Se connecter
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-gray-900 mb-3">Comptes de démonstration :</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Vendeur :</strong> vendeur@demo.com / demo123</p>
              <p><strong>Partenaire :</strong> partenaire@demo.com / demo123</p>
              <p><strong>Admin :</strong> admin@demo.com / demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
