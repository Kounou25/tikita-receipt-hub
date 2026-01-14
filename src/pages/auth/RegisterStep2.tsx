import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getCookie, setCookie } from "@/lib/cookies";

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
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const countryPhoneCodes = {
    Algeria: "+213",
    Angola: "+244",
    Benin: "+229",
    Botswana: "+267",
    "Burkina Faso": "+226",
    Burundi: "+257",
    Cameroon: "+237",
    Canada: "+1",
    Chad: "+235",
    Congo: "+242",
    "Côte d'Ivoire": "+225",
    "DR Congo": "+243",
    Egypt: "+20",
    Ethiopia: "+251",
    France: "+33",
    Gabon: "+241",
    Gambia: "+220",
    Ghana: "+233",
    Guinea: "+224",
    Kenya: "+254",
    Liberia: "+231",
    Madagascar: "+261",
    Mali: "+223",
    Morocco: "+212",
    Mozambique: "+258",
    Niger: "+227",
    Nigeria: "+234",
    Rwanda: "+250",
    Senegal: "+221",
    "Sierra Leone": "+232",
    "South Africa": "+27",
    Sudan: "+249",
    Togo: "+228",
    Tunisia: "+216",
    Uganda: "+256",
    "United Kingdom": "+44",
    "United States": "+1",
    Zambia: "+260",
    Zimbabwe: "+263",
  };

  const countries = Object.keys(countryPhoneCodes).sort();

  useEffect(() => {
    const userId = getCookie("user_id") || "";
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
    const phoneDigits = currentPhone.replace(/^\+\d+\s?/, "");
    const newPhone = `${phoneCode} ${phoneDigits}`;
    setFormData({ ...formData, country: value, phone: newPhone });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const phoneCode = countryPhoneCodes[formData.country] || "+227";
    if (!value.startsWith(phoneCode)) {
      const digits = value.replace(/^\+\d+\s?/, "");
      setFormData({ ...formData, phone: `${phoneCode} ${digits}` });
    } else {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const phoneRegex = /^\+\d+\s\d+$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Veuillez entrer un numéro de téléphone valide (ex. +227 12345678).");
      setShowErrorPopup(true);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("company_name", formData.companyName);
    formDataToSend.append("company_slogan", formData.slogan);
    formDataToSend.append("company_phone_number", formData.phone);
    formDataToSend.append("company_adress", formData.address);
    formDataToSend.append("company_nif", formData.nif);
    formDataToSend.append("company_rccm", formData.rccm);
    formDataToSend.append("company_color", formData.color);
    formDataToSend.append("user_id", formData.userId);

    if (formData.logo) formDataToSend.append("logo", formData.logo);
    if (formData.stamp) formDataToSend.append("tampon", formData.stamp);

    try {
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/company/company`, {
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

      if (!result.company || !result.company.company_id) {
        setErrorMessage("Aucun identifiant d'entreprise retourné. Veuillez réessayer.");
        setShowErrorPopup(true);
        return;
      }

      setCookie("company_id", result.company.company_id);

      const subscriptionPayload = {
        companyId: result.company.company_id,
        planId: "1",
      };

      const subscriptionResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscribe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionPayload),
      });

      if (!subscriptionResponse.ok) {
        const errorData = await subscriptionResponse.json().catch(() => ({}));
        setErrorMessage(errorData.error || "Échec de la création de l'abonnement.");
        setShowErrorPopup(true);
        throw new Error("Échec abonnement");
      }

      toast.success("Entreprise et abonnement créés avec succès !");
      setShowSuccessPopup(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Une erreur est survenue. Veuillez réessayer.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-gray-800 animate-spin" />
            <p className="text-white font-medium">Création en cours...</p>
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
            Finalisez la création de votre compte
          </p>
        </motion.div>

        {/* Progress Indicator - Horizontale, adaptée mobile */}
        <div className="mb-8 sm:mb-10 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Étape 1 - Terminée */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
                <Check className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="mt-2 text-xs sm:text-sm text-gray-900 font-medium hidden sm:block">
                Informations
              </span>
            </div>

            {/* Ligne de connexion */}
            <div className="w-16 sm:w-24 h-px bg-gray-900" />

            {/* Étape 2 - Active */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-base sm:text-lg">
                2
              </div>
              <span className="mt-2 text-xs sm:text-sm text-gray-900 font-medium hidden sm:block">
                Entreprise
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
                Informations entreprise
              </CardTitle>
              <p className="mt-2 text-gray-600">Étape 2 : Configurez votre entreprise</p>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom entreprise */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700 font-medium text-sm sm:text-base">
                    Nom de l'entreprise *
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Nom de votre entreprise"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all"
                  />
                </div>

                {/* Slogan */}
                <div className="space-y-2">
                  <Label htmlFor="slogan" className="text-gray-700 font-medium text-sm sm:text-base">
                    Slogan (optionnel)
                  </Label>
                  <Input
                    id="slogan"
                    type="text"
                    placeholder="Votre slogan"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
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
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Téléphone entreprise */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium text-sm sm:text-base">
                    Numéro de téléphone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={formData.country ? `${countryPhoneCodes[formData.country]} XX XX XX XX` : "+227 XX XX XX XX"}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    disabled={isLoading}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all"
                  />
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium text-sm sm:text-base">
                    Adresse complète *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Rue, quartier, ville..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    disabled={isLoading}
                    rows={3}
                    className="rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base transition-all resize-none"
                  />
                </div>

                {/* NIF & RCCM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nif" className="text-gray-700 font-medium text-sm sm:text-base">
                      NIF (optionnel)
                    </Label>
                    <Input
                      id="nif"
                      type="text"
                      placeholder="Votre NIF"
                      value={formData.nif}
                      onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                      disabled={isLoading}
                      className="h-12 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rccm" className="text-gray-700 font-medium text-sm sm:text-base">
                      RCCM (optionnel)
                    </Label>
                    <Input
                      id="rccm"
                      type="text"
                      placeholder="Votre RCCM"
                      value={formData.rccm}
                      onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                      disabled={isLoading}
                      className="h-12 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 text-base"
                    />
                  </div>
                </div>

                {/* Couleur de marque */}
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-gray-700 font-medium text-sm sm:text-base">
                    Couleur de marque
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-14 h-12 rounded-xl border border-gray-300 cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 h-12 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Upload Logo */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:text-base">
                    Logo (optionnel)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-4">Glissez ou cliquez pour ajouter un logo</p>
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
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      disabled={isLoading}
                      className="rounded-xl"
                    >
                      Choisir un fichier
                    </Button>
                    {formData.logo && (
                      <p className="mt-3 text-sm text-gray-900 font-medium">{formData.logo.name}</p>
                    )}
                  </div>
                </div>

                {/* Upload Tampon */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:text-base">
                    Cachet (optionnel)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-4">Glissez ou cliquez pour ajouter un cachet</p>
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
                      onClick={() => document.getElementById("stamp-upload")?.click()}
                      disabled={isLoading}
                      className="rounded-xl"
                    >
                      Choisir un fichier
                    </Button>
                    {formData.stamp && (
                      <p className="mt-3 text-sm text-gray-900 font-medium">{formData.stamp.name}</p>
                    )}
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <Link to="/register" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Retour
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        Créer mon compte
                        <Check className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dialog Erreur */}
        <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Erreur</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowErrorPopup(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Succès */}
        <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Inscription réussie !</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Votre entreprise a été créée avec succès.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button onClick={handleSuccessPopupClose} className="w-full bg-gray-900 hover:bg-gray-800">
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