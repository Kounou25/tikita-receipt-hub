import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        localStorage.setItem("user_id", user.user_id);
        localStorage.setItem("token", token);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("user_name", user.full_name || user.email);
        localStorage.setItem("company_id", company_id);

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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            <p className="text-white font-semibold">Connexion en cours...</p>
          </div>
        </div>
      )}

      {/* Background Ripples */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#14b8a6"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          animate={{
            r: [20, 30, 20],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="25"
          fill="none"
          stroke="#f97316"
          strokeWidth="0.5"
          strokeOpacity="0.15"
          animate={{
            r: [25, 35, 25],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
        />
      </svg>
      {/* Animated Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-400' : 'bg-orange-400'}`}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + i * 0.4,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-extrabold text-green-700">Tikiita</h1>
          <p className="text-gray-600 text-sm">Simplifiez vos reçus numériques avec style</p>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="border-none shadow-xl bg-white/95 backdrop-blur-md rounded-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Se connecter
              </CardTitle>
              <p className="text-gray-600 text-sm">Accédez à votre espace sécurisé</p>
            </CardHeader>

            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">{error}</div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email ou téléphone</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="votre@email.com ou +227 XX XX XX XX"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg pr-10 transition-all duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-gray-700 font-medium">Se souvenir de moi</Label>
                  </div>
                  <Link to="/forgot-password" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 h-11 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Pas encore de compte ?{" "}
                  <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold hover:underline">
                    Inscrivez-vous
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;