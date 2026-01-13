import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countryPhoneCodes } from "@/utils/countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";

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
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const sortedCountries = [...countryPhoneCodes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleCountryChange = (value: string) => {
    const selected = countryPhoneCodes.find((c) => c.code === value);
    if (!selected) return;

    const phoneCode = selected.phone;
    const currentPhone = formData.user_phone.trim();
    const phoneDigits = currentPhone.replace(/^\+\d+\s?/, "");
    const newPhone = `${phoneCode} ${phoneDigits}`;

    setFormData({ ...formData, country: value, user_phone: newPhone });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selected = countryPhoneCodes.find((c) => c.code === formData.country);
    const phoneCode = selected ? selected.phone : "+227";

    if (!value.startsWith(phoneCode)) {
      const digits = value.replace(/^\+\d+\s?/, "");
      setFormData({ ...formData, user_phone: `${phoneCode} ${digits}` });
    } else {
      setFormData({ ...formData, user_phone: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.user_phone ||
      !formData.country ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setShowErrorPopup(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setShowErrorPopup(true);
      return;
    }

    const phoneRegex = /^\+\d+\s\d+$/;
    if (!phoneRegex.test(formData.user_phone)) {
      setErrorMessage("Veuillez entrer un numéro de téléphone valide (ex. +227 12345678).");
      setShowErrorPopup(true);
      return;
    }

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      user_phone: formData.user_phone,
      country: formData.country,
      password: formData.password,
    };

    try {
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/signIn/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
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
      if (result.user?.user_id) {
        localStorage.setItem("user_id", result.user.user_id);
      }

      toast.success("Inscription réussie ! Veuillez vous connecter.");
      navigate("/register/step2");
    } catch (error: any) {
      console.error("Error during registration:", error);
      if (!showErrorPopup) {
        setErrorMessage(error.message || "Échec de l'inscription. Veuillez réessayer.");
        setShowErrorPopup(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountry = countryPhoneCodes.find((c) => c.code === formData.country);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-gray-800 animate-spin" />
            <p className="text-white font-medium">Inscription en cours...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Tikiita
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Créez votre compte en quelques étapes
          </p>
        </motion.div>

        {/* Progress Indicator - Horizontale, adaptée mobile */}
        <div className="mb-8 sm:mb-10 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Étape 1 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-base sm:text-lg">
                1
              </div>
              <span className="mt-2 text-xs sm:text-sm text-gray-900 font-medium hidden sm:block">
                Informations
              </span>
            </div>

            {/* Ligne de connexion */}
            <div className="w-16 sm:w-24 h-px bg-gray-300" />

            {/* Étape 2 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-base sm:text-lg">
                2
              </div>
              <span className="mt-2 text-xs sm:text-sm text-gray-500 hidden sm:block">
                Configuration
              </span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6 pt-8 px-6">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Créer un compte
              </CardTitle>
              <p className="mt-2 text-gray-600">Étape 1 : Vos informations personnelles</p>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom complet */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm sm:text-base">
                    Nom complet
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Votre nom complet"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all"
                  />
                </div>

                {/* Pays */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700 font-medium text-sm sm:text-base">
                    Pays
                  </Label>
                  <Select onValueChange={handleCountryChange} value={formData.country} disabled={isLoading}>
                    <SelectTrigger className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20">
                      <SelectValue placeholder="Sélectionnez votre pays">
                        {selectedCountry && (
                          <div className="flex items-center gap-3">
                            <ReactCountryFlag
                              countryCode={selectedCountry.code.toUpperCase()}
                              svg
                              style={{ width: "24px", height: "18px" }}
                              className="rounded-sm shadow-sm"
                            />
                            <span>{selectedCountry.name}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {sortedCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <ReactCountryFlag
                                countryCode={country.code.toUpperCase()}
                                svg
                                style={{ width: "24px", height: "18px" }}
                                className="rounded-sm shadow-sm"
                              />
                              <span>{country.name}</span>
                            </div>
                            <span className="text-gray-500 text-sm">{country.phone}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="user_phone" className="text-gray-700 font-medium text-sm sm:text-base">
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="user_phone"
                    type="tel"
                    placeholder={selectedCountry ? `${selectedCountry.phone} XX XX XX XX` : "+227 XX XX XX XX"}
                    value={formData.user_phone}
                    onChange={handlePhoneChange}
                    required
                    disabled={isLoading}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all"
                  />
                </div>

                {/* Mot de passe */}
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
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </Button>
                  </div>
                </div>

                {/* Confirmation mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm sm:text-base">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 pr-14 text-base transition-all"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 h-10 w-10"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-14 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Inscription...
                    </span>
                  ) : (
                    "Continuer"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm sm:text-base text-gray-600">
                Déjà un compte ?{" "}
                <Link to="/login" className="font-medium text-gray-900 hover:underline transition">
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dialog d'erreur */}
        <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Erreur</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowErrorPopup(false)}
                className="w-full sm:w-auto"
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