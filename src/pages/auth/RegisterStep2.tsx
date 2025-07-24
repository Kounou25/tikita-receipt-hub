import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ArrowLeft, Check } from "lucide-react";
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

// Note : Assurez-vous que <ToastContainer /> est inclus dans votre composant racine (par exemple, App.tsx) pour que react-toastify fonctionne.

const RegisterStep2 = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    slogan: "",
    phone: "",
    address: "",
    nif: "",
    rccm: "",
    color: "#4CAF50",
    logo: null as File | null,
    stamp: null as File | null,
    userId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

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
  
      // Stocker company_id dans localStorage (facultatif, selon vos besoins)
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
      setShowSuccessPopup(true); // Afficher la popup de succès
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/lovable-uploads/d1d0c3ac-8062-46a5-b530-0b60f9d9f249.png"
              alt="Tikiita Logo"
              className="h-12"
            />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <Check className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm text-gray-500">Personnel</span>
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Entreprise</span>
          </div>
        </div>

        {/* Registration Form Step 2 */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Personnalisation
            </CardTitle>
            <p className="text-gray-600">
              Étape 2 : Informations de votre entreprise
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Nom de votre entreprise"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan (optionnel)</Label>
                <Input
                  id="slogan"
                  type="text"
                  placeholder="Votre slogan"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+123 456 789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  placeholder="Adresse complète de votre entreprise"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="border-gray-300 resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nif">NIF</Label>
                  <Input
                    id="nif"
                    type="text"
                    placeholder="Votre NIF"
                    value={formData.nif}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                    className="border-gray-300"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rccm">RCCM</Label>
                  <Input
                    id="rccm"
                    type="text"
                    placeholder="Votre RCCM"
                    value={formData.rccm}
                    onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                    className="border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur de marque</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo de l'entreprise (optionnel)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    disabled={isLoading}
                  >
                    Choisir un fichier
                  </Button>
                  {formData.logo && (
                    <p className="text-sm text-primary mt-1">{formData.logo.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cachet de l'entreprise (optionnel)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                    onClick={() => document.getElementById("stamp-upload")?.click()}
                    disabled={isLoading}
                  >
                    Choisir un fichier
                  </Button>
                  {formData.stamp && (
                    <p className="text-sm text-primary mt-1">{formData.stamp.name}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Link to="/register" className="flex-1">
                  <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? "Chargement..." : "Créer mon compte"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Popup d'erreur */}
        <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Erreur</DialogTitle>
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

        {/* Popup de succès */}
        <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Inscription réussie</DialogTitle>
              <DialogDescription>
                Votre entreprise a été créée avec succès. Veuillez vous connecter pour continuer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="default"
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