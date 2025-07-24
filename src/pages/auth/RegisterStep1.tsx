import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterStep1 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    user_phone: "",
    country: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const countries = [
    "Niger", "France", "Cameroun", "Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso",
    "Guinée", "Bénin", "Togo", "Madagascar", "Congo", "Gabon"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.user_phone || !formData.country || !formData.password || !formData.confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setShowErrorPopup(true);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setShowErrorPopup(true);
      return;
    }

    // Build payload for /users/signIn/
    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      user_phone: formData.user_phone,
      country: formData.country,
      password: formData.password
    };
    
    

    try {
      setIsLoading(true);

      console.log("Sending payload to /users/signIn/:", JSON.stringify(payload, null, 2));
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/signIn/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("Registration response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response body:", errorData);
        if (errorData.error) {
          setErrorMessage(errorData.error);
          setShowErrorPopup(true);
          throw new Error(errorData.error);
        }
        if (response.status === 400) throw new Error("Données d'inscription invalides.");
        if (response.status === 409) throw new Error("Cet email est déjà utilisé.");
        if (response.status === 500) throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
        throw new Error(`Échec de l'inscription: ${response.status}`);
      }

      const result = await response.json();
      console.log("Registration successful, response:", result);
      if (result.user && result.user.user_id) {
        localStorage.setItem("user_id", result.user.user_id);
        console.log("Stored user_id in localStorage:", result.user.user_id);
      } else {
        console.warn("No user_id returned in response");
      }
      

      toast.success("Inscription réussie ! Veuillez vous connecter.");
      navigate("/register/step2");
    } catch (error) {
      console.error("Error during registration:", error);
      if (!showErrorPopup) {
        setErrorMessage(error.message || "Échec de l'inscription. Veuillez réessayer.");
        setShowErrorPopup(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center p-4">
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/lovable-Uploads/d1d0c3ac-8062-46a5-b530-0b60f9d9f249.png" 
              alt="Tikiita Logo" 
              className="h-12"
            />
          </div>
        </div>

        {/* Registration Form */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Créer un compte
            </CardTitle>
            <p className="text-gray-600">
              Entrez vos informations personnelles
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, country: value })} disabled={isLoading}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_phone">Numéro de téléphone</Label>
                <Input
                  id="user_phone"
                  type="tel"
                  placeholder="+227 XX XX XX XX"
                  value={formData.user_phone}
                  onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choisissez un mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="border-gray-300 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="border-gray-300 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "S'inscrire"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{" "}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Erreur d'inscription</DialogTitle>
              <DialogDescription>{errorMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowErrorPopup(false)}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterStep1;