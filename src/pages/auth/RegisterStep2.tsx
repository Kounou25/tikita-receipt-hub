import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const RegisterStep2 = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    slogan: "",
    phone: "",
    country: "",
    address: "",
    nif: "",
    rccm: "",
    color: "#14b8a6",
    logo: null as File | null,
    stamp: null as File | null,
    userId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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

  // Récupérer user_id depuis localStorage au chargement
  useEffect(() => {
    const userId = localStorage.getItem("user_id") || "";
    if (!userId) {
      setErrorMessage("Identifiant utilisateur manquant. Veuillez recommencer le processus d'inscription.");
      setShowErrorPopup(true);
    }
    setFormData((prev) => ({ ...prev, userId }));
  }, []);

  const handleFileChange = (field: "logo" | "stamp", file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleCountryChange = (value: string) => {
    const phoneCode = countryPhoneCodes[value];
    const currentPhone = formData.phone.trim();
    // Extract digits after the country code, if any
    const phoneDigits = currentPhone.replace(/^\+\d+\s?/, '');
    // Set new phone number with code and space
    const newPhone = `${phoneCode} ${phoneDigits}`;
    setFormData({ ...formData, country: value, phone: newPhone });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the country code remains intact
    const phoneCode = countryPhoneCodes[formData.country] || '+227';
    if (!value.startsWith(phoneCode)) {
      // If user tries to modify the code, revert to the correct code with their input
      const digits = value.replace(/^\+\d+\s?/, '');
      setFormData({ ...formData, phone: `${phoneCode} ${digits}` });
    } else {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valider les champs obligatoires
    const missingFields = [];
    if (!formData.companyName) missingFields.push("nom de l'entreprise");
    if (!formData.phone) missingFields.push("numéro de téléphone");
    if (!formData.address) missingFields.push("adresse");
    if (!formData.userId) missingFields.push("identifiant utilisateur");

    if (missingFields.length > 0) {
      setErrorMessage(`Veuillez remplir les champs obligatoires suivants : ${missingFields.join(", ")}.`);
      setShowErrorPopup(true);
      return;
    }

    // Validate phone number format (code + digits)
    const phoneRegex = /^\+\d+\s\d+$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Veuillez entrer un numéro de téléphone valide (ex. +227 12345678).");
      setShowErrorPopup(true);
      return;
    }

    // Créer un objet FormData pour envoyer les données
    const formDataToSend = new FormData();
    formDataToSend.append("company_name", formData.companyName);
    formDataToSend.append("company_slogan", formData.slogan);
    formDataToSend.append("company_phone_number", formData.phone);
    formDataToSend.append("company_adress", formData.address);
    formDataToSend.append("company_nif", formData.nif);
    formDataToSend.append("company_rccm", formData.rccm);
    formDataToSend.append("company_color", formData.color);
    formDataToSend.append("user_id", formData.userId);

    // Ajouter les fichiers s'ils existent
    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }
    if (formData.stamp) {
      formDataToSend.append("tampon", formData.stamp);
    }

    try {
      setIsLoading(true);

      console.log("Sending payload to /company/company/:");
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/company/company/`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        console.error("Error response body:", errorData);
        if (errorData.error) {
          setErrorMessage(errorData.error);
          setShowErrorPopup(true);
          throw new Error(errorData.error);
        }
        if (response.status === 400) throw new Error("Données de l'entreprise invalides.");
        if (response.status === 401) throw new Error("Non autorisé. Veuillez vérifier votre session.");
        if (response.status === 500) throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
        throw new Error(`Échec de la création de l'entreprise : ${response.status}`);
      }

      const result = await response.json();
      console.log("Company creation successful, response:", result);

      // Vérifier si company_id est retourné
      if (!result.company || !result.company.company_id) {
        console.warn("No company_id returned in response");
        setErrorMessage("Aucun identifiant d'entreprise retourné. Veuillez réessayer.");
        setShowErrorPopup(true);
        return;
      }

      // Stocker company_id dans localStorage
      localStorage.setItem("company_id", result.company.company_id);
      console.log("Stored company_id in localStorage:", result.company.company_id);

      // Étape 2 : Appeler l'endpoint d'abonnement
      const subscriptionPayload = {
        companyId: result.company.company_id,
        planId: "1",
      };

      console.log("Sending subscription payload to /user/subscriptions/subscribe/:", subscriptionPayload);
      const subscriptionResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscribe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionPayload),
      });

      if (!subscriptionResponse.ok) {
        let errorData;
        try {
          errorData = await subscriptionResponse.json();
        } catch {
          errorData = {};
        }
        console.error("Error response body from subscription:", errorData);
        setErrorMessage(errorData.error || "Échec de la création de l'abonnement. Veuillez réessayer.");
        setShowErrorPopup(true);
        throw new Error("Échec de la création de l'abonnement");
      }

      console.log("Subscription successful, response:", await subscriptionResponse.json());
      toast.success("Entreprise et abonnement créés avec succès !");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error during company creation or subscription:", error);
      setErrorMessage(error.message || "Échec de la création de l'entreprise ou de l'abonnement. Veuillez réessayer.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Rediriger vers /login après fermeture de la popup de succès
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            <p className="text-white font-semibold">Création en cours...</p>
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
              <Check className="w-4 h-4" />
            </div>
            <span className="text-gray-500">Informations personnelles</span>
          </div>
          <div className="w-12 h-1 bg-green-500 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-gray-700 font-medium">Entreprise</span>
          </div>
        </motion.div>

        {/* Registration Form Step 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="border-none shadow-xl bg-white/95 backdrop-blur-md rounded-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Personnalisation
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Étape 2 : Informations de votre entreprise
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700 font-medium text-sm">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Nom de votre entreprise"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slogan" className="text-gray-700 font-medium text-sm">Slogan (optionnel)</Label>
                  <Input
                    id="slogan"
                    type="text"
                    placeholder="Votre slogan"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
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
                  <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Numéro de téléphone de l'entreprise</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={formData.country ? `${countryPhoneCodes[formData.country]} XX XX XX XX` : "+227 XX XX XX XX"}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium text-sm">Adresse</Label>
                  <Textarea
                    id="address"
                    placeholder="Adresse complète de votre entreprise"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white rounded-lg transition-all duration-200 resize-none"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nif" className="text-gray-700 font-medium text-sm">NIF (optionnel)</Label>
                    <Input
                      id="nif"
                      type="text"
                      placeholder="Votre NIF"
                      value={formData.nif}
                      onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rccm" className="text-gray-700 font-medium text-sm">RCCM (optionnel)</Label>
                    <Input
                      id="rccm"
                      type="text"
                      placeholder="Votre RCCM"
                      value={formData.rccm}
                      onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-gray-700 font-medium text-sm">Couleur de marque</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white h-11 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">Logo de l'entreprise (optionnel)</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Cliquez pour télécharger votre logo
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("logo", e.target.files?.[0] || null)}
                      className="hidden"
                      id="logo-upload"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      disabled={isLoading}
                    >
                      Choisir un fichier
                    </Button>
                    {formData.logo && (
                      <p className="text-sm text-green-600 mt-1">{formData.logo.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">Cachet de l'entreprise (optionnel)</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Cliquez pour télécharger votre cachet
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("stamp", e.target.files?.[0] || null)}
                      className="hidden"
                      id="stamp-upload"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => document.getElementById("stamp-upload")?.click()}
                      disabled={isLoading}
                    >
                      Choisir un fichier
                    </Button>
                    {formData.stamp && (
                      <p className="text-sm text-green-600 mt-1">{formData.stamp.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link to="/register" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50 h-11 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 h-11 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Chargement...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Créer mon compte
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popup d'erreur */}
        <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
          <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-none shadow-xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Erreur</DialogTitle>
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

        {/* Popup de succès */}
        <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
          <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-none shadow-xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Inscription réussie</DialogTitle>
              <DialogDescription className="text-gray-600">
                Votre entreprise a été créée avec succès. Veuillez vous connecter pour continuer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleSuccessPopupClose}
              >
                Se connecter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegisterStep2;