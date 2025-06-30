import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la connexion. Vérifiez vos identifiants.");
      }

      const { user, token } = await response.json();
      console.log("Réponse de connexion:", { user, token });

      if (user && token) {
        localStorage.setItem("user_id", user.user_id);
        localStorage.setItem("token", token);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("user_name", user.full_name || user.email);

        if (user.role === "user") {
          navigate("/dashboard");
        } else {
          setError("Rôle non autorisé pour cette redirection.");
        }
      } else {
        setError("Réponse inattendue du serveur.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Overlay de chargement pleine page */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="text-white text-lg font-medium">Chargement...</p>
          </div>
        </div>
      )}

      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
              <img src="/lovable-uploads/98b915da-4744-4a07-84d2-b2d5065e9c15.png" alt="Tikiita Logo" className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Tikiita</h1>
          <p className="text-gray-600 mt-2">La révolution des reçus numériques</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              Connexion
            </CardTitle>
            <p className="text-gray-600">Accédez à votre espace de génération intelligente</p>
          </CardHeader>

          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email ou téléphone</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="votre@email.com ou +227 XX XX XX XX"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-primary-500 focus:ring-primary-500 bg-white/50 backdrop-blur-sm h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe sécurisé"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="border-gray-200 focus:border-primary-500 focus:ring-primary-500 bg-white/50 backdrop-blur-sm h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onChecked loCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 font-medium">Se souvenir de moi</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 transition-colors font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Nouveau sur Tikiita ?{" "}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Créer un compte gratuit
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Comptes de démonstration
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                <span className="font-medium">Vendeur :</span>
                <span className="text-primary-600 font-mono">vendeur@demo.com / demo123</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                <span className="font-medium">Partenaire :</span>
                <span className="text-secondary-600 font-mono">partenaire@demo.com / demo123</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                <span className="font-medium">Admin :</span>
                <span className="text-accent-600 font-mono">admin@demo.com / demo123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;