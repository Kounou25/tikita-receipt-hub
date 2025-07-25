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
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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

  const countryPhoneCodes = {
    "Algeria": "+213",
    "Angola": "+244",
    "Benin": "+229",
    "Botswana": "+267",
    "Burkina Faso": "+226",
    "Burundi": "+257",
    "Cameroon": "+237",
    "Canada": "+1",
    "Chad": "+235",
    "Congo": "+242",
    "Côte d'Ivoire": "+225",
    "DR Congo": "+243",
    "Egypt": "+20",
    "Ethiopia": "+251",
    "France": "+33",
    "Gabon": "+241",
    "Gambia": "+220",
    "Ghana": "+233",
    "Guinea": "+224",
    "Kenya": "+254",
    "Liberia": "+231",
    "Madagascar": "+261",
    "Mali": "+223",
    "Morocco": "+212",
    "Mozambique": "+258",
    "Niger": "+227",
    "Nigeria": "+234",
    "Rwanda": "+250",
    "Senegal": "+221",
    "Sierra Leone": "+232",
    "South Africa": "+27",
    "Sudan": "+249",
    "Togo": "+228",
    "Tunisia": "+216",
    "Uganda": "+256",
    "United Kingdom": "+44",
    "United States": "+1",
    "Zambia": "+260",
    "Zimbabwe": "+263"
  };

  const countries = Object.keys(countryPhoneCodes).sort();

  const handleCountryChange = (value) => {
    const phoneCode = countryPhoneCodes[value];
    const currentPhone = formData.user_phone.trim();
    // Extract digits after the country code, if any
    const phoneDigits = currentPhone.replace(/^\+\d+\s?/, '');
    // Set new phone number with code and space
    const newPhone = `${phoneCode} ${phoneDigits}`;
    setFormData({ ...formData, country: value, user_phone: newPhone });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Ensure the country code remains intact
    const phoneCode = countryPhoneCodes[formData.country] || '+227';
    if (!value.startsWith(phoneCode)) {
      // If user tries to modify the code, revert to the correct code with their input
      const digits = value.replace(/^\+\d+\s?/, '');
      setFormData({ ...formData, user_phone: `${phoneCode} ${digits}` });
    } else {
      setFormData({ ...formData, user_phone: value });
    }
  };

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

    // Validate phone number format (code + digits)
    const phoneRegex = /^\+\d+\s\d+$/;
    if (!phoneRegex.test(formData.user_phone)) {
      setErrorMessage("Veuillez entrer un numéro de téléphone valide (ex. +227 12345678).");
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            <p className="text-white font-semibold">Inscription en cours...</p>
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
            r: [20, 40, 20],
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
            r: [25, 45, 25],
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
          {/* <div className="flex items-center justify-center">
            <img
              src="/lovable-uploads/tikiita.png"
              alt="Tikiita Logo"
              className="h-14 object-contain"
              style={{ filter: 'drop-shadow(0 3px 6px rgba(20,184,166,0.3))' }}
            />
          </div> */}
          <h1 className="text-3xl font-extrabold text-green-700">Tikiita</h1>
          <p className="text-gray-600 text-sm">Simplifiez vos reçus numériques avec style</p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          className="flex justify-center items-center space-x-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-gray-700 font-medium">Informations personnelles</span>
          </div>
          <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-gray-500">Configuration</span>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="border-none shadow-xl bg-white/95 backdrop-blur-md rounded-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Créer un compte
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Entrez vos informations personnelles
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm">Nom complet</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Votre nom complet"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700 font-medium text-sm">Pays</Label>
                  <Select onValueChange={handleCountryChange} disabled={isLoading}>
                    <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg">
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_phone" className="text-gray-700 font-medium text-sm">Numéro de téléphone</Label>
                  <Input
                    id="user_phone"
                    type="tel"
                    placeholder={formData.country ? `${countryPhoneCodes[formData.country]} XX XX XX XX` : "+227 XX XX XX XX"}
                    value={formData.user_phone}
                    onChange={handlePhoneChange}
                    required
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Choisissez un mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg pr-10 transition-all duration-200"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg pr-10 transition-all duration-200"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 h-11 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      S'inscrire
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Déjà un compte ?{" "}
                  <Link 
                    to="/login" 
                    className="text-green-600 hover:text-green-700 font-medium hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
          <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-none shadow-xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Erreur d'inscription</DialogTitle>
              <DialogDescription className="text-gray-600">{errorMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={() => setShowErrorPopup(false)}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegisterStep1;