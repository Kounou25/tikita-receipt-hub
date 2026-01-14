import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setCookie } from "@/lib/cookies";

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

      const { user, token, company_id } = await response.json();
      console.log("Réponse de connexion:", { user, company_id, token });

      if (user && token) {
        setCookie("user_id", user.user_id);
        setCookie("token", token);
        setCookie("user_role", user.role);
        setCookie("user_name", user.full_name || user.email);
        setCookie("company_id", company_id);

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-gray-800 animate-spin" />
            <p className="text-white font-medium">Connexion en cours...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        {/* Header - Optimisé mobile */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Tikiita</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Connectez-vous à votre compte</p>
        </motion.div>

        {/* Form Card - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6 pt-8 px-6">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Se connecter
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg text-center font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                    Email ou téléphone
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="votre@email.com ou +227 XX XX XX XX"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 pr-14 text-base transition-all"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-gray-700 cursor-pointer font-medium">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline transition text-right"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-14 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base"
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

              <div className="mt-8 text-center text-sm sm:text-base text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="font-medium text-gray-900 hover:underline transition"
                >
                  Inscrivez-vous
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;