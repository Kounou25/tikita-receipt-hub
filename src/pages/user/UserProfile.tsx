import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { User, Building2, Palette, Save, BadgeCheck, Upload, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);

const ErrorPopup = ({ message, onClose, actionButton }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-lg mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            {actionButton}
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    avatar: "",
    userNumber: "",
    companyName: "",
    slogan: "",
    address: "",
    nif: "",
    rccm: "",
    brandColor: "",
    subscription: {
      plan: "Premium",
      status: "active",
      endDate: "15/07/2024",
      docsUsed: 847,
      docsTotal: 1000,
    },
  });

  const companyId = localStorage.getItem("company_id");
  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setErrorType(null);

        // Récupération des données du profil
        const profileResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/profile/${companyId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 500) {
            setErrorType("server");
            throw new Error("Erreur lors de la récupération des informations");
          } else if (profileResponse.status === 409 || profileResponse.status === 403) {
            setErrorType("auth");
            throw new Error("Session expirée");
          } else if (profileResponse.status === 404) {
            setErrorType("not_found");
            throw new Error("Aucune donnée trouvée");
          } else {
            throw new Error(`Échec de la récupération des données du profil: ${profileResponse.status} ${profileResponse.statusText}`);
          }
        }

        const profileDataResponse = await profileResponse.json();

        // Récupération des données d'abonnement
        const subscriptionResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        let subscriptionData = {
          plan: "Premium",
          status: "active",
          endDate: "15/07/2024",
          docsUsed: 847,
          docsTotal: 1000,
        };

        if (subscriptionResponse.ok) {
          const subData = await subscriptionResponse.json();
          subscriptionData = {
            plan: subData.plan_name,
            status: subData.subscription_status,
            endDate: new Date(subData.end_date).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            docsUsed: subData.receipts_generated,
            docsTotal: subData.total_quota,
          };
        } else if (subscriptionResponse.status === 500) {
          console.warn("Erreur serveur lors de la récupération de l'abonnement");
        } else if (subscriptionResponse.status === 409 || subscriptionResponse.status === 403) {
          setErrorType("auth");
          throw new Error("Session expirée");
        }

        setProfileData({
          fullName: profileDataResponse.user.full_name,
          email: profileDataResponse.user.email,
          phone: profileDataResponse.user.phone_number,
          country: profileDataResponse.user.country,
          avatar: profileDataResponse.logos[0]?.logo_url || "",
          userNumber: `TKT-USER-${profileDataResponse.user.user_id.toString().padStart(5, "0")}`,
          companyName: profileDataResponse.company.company_name,
          slogan: profileDataResponse.company.company_slogan,
          address: profileDataResponse.company.company_adress,
          nif: profileDataResponse.company.nif,
          rccm: profileDataResponse.company.rccm,
          brandColor: profileDataResponse.company.company_color,
          subscription: subscriptionData,
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des données.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [companyId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/profile/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          user: {
            full_name: profileData.fullName,
            email: profileData.email,
            phone_number: profileData.phone,
            country: profileData.country,
          },
          company: {
            company_name: profileData.companyName,
            company_slogan: profileData.slogan,
            company_adress: profileData.address,
            nif: profileData.nif,
            rccm: profileData.rccm,
            company_color: profileData.brandColor,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          setErrorType("server");
          throw new Error("Erreur lors de la sauvegarde des modifications");
        } else if (response.status === 409 || response.status === 403) {
          setErrorType("auth");
          throw new Error("Session expirée");
        } else {
          throw new Error(`Échec de la sauvegarde des modifications: ${response.status} ${response.statusText}`);
        }
      }

      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const usagePercentage = (profileData.subscription.docsUsed / profileData.subscription.docsTotal) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading && !error) {
    return (
      <div className="min-h-screen bg-gray-50 mobile-nav-padding flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Mon Profil" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Error Popups */}
        {error && errorType === "server" && (
          <ErrorPopup
            message="Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion internet et réessayer."
            onClose={() => setError(null)}
            actionButton={null}
          />
        )}

        {error && errorType === "auth" && (
          <ErrorPopup
            message="Votre session a expiré. Veuillez vous reconnecter."
            onClose={() => setError(null)}
            actionButton={
              <Link to="/login">
                <Button>Se connecter</Button>
              </Link>
            }
          />
        )}

        {/* Message pour erreur 404 */}
        {errorType === "not_found" && (
          <Card className="border-gray-200">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Aucune donnée de profil trouvée.</p>
            </CardContent>
          </Card>
        )}

        {/* Contenu principal seulement s'il n'y a pas d'erreur bloquante */}
        {!errorType && (
          <>
            {/* En-tête du profil sans bannière */}
            <Card className="border-gray-200 shadow-lg rounded-xl bg-gradient-to-br from-gray-50 to-primary-50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <img
                        src={profileData.avatar || "https://via.placeholder.com/96"}
                        alt={profileData.fullName}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 group-hover:scale-105 transition-transform duration-200"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <Button variant="secondary" size="sm" className="bg-white text-primary-600 hover:bg-gray-100">
                            <Upload className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-primary-600">{profileData.fullName}</h2>
                        <BadgeCheck className="h-5 w-5 text-primary-500" />
                      </div>
                      <p className="text-sm text-gray-600">{profileData.email}</p>
                      <p className="text-xs text-gray-500">ID: {profileData.userNumber}</p>
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className={cn(
                      "shadow-md hover:shadow-lg transition-all duration-200",
                      isEditing ? "bg-primary-600 hover:bg-primary-700" : "border-gray-300"
                    )}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    ) : (
                      "Modifier mon profil"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Colonne de gauche - Informations Personnelles et Entreprise */}
              <div className="md:col-span-2 space-y-6">
                {/* Informations personnelles */}
                <Card className="border-gray-200 shadow-lg rounded-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-primary-600">
                      <User className="w-5 h-5" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={profileData.country}
                          disabled
                          className="border-gray-300 bg-gray-50 rounded-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations entreprise */}
                <Card className="border-gray-200 shadow-lg rounded-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-primary-600">
                      <Building2 className="w-5 h-5" />
                      Informations entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nom de l'entreprise</Label>
                        <Input
                          id="companyName"
                          value={profileData.companyName}
                          onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slogan">Slogan</Label>
                        <Input
                          id="slogan"
                          value={profileData.slogan}
                          onChange={(e) => setProfileData({ ...profileData, slogan: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Textarea
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nif">NIF</Label>
                        <Input
                          id="nif"
                          value={profileData.nif}
                          onChange={(e) => setProfileData({ ...profileData, nif: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rccm">RCCM</Label>
                        <Input
                          id="rccm"
                          value={profileData.rccm}
                          onChange={(e) => setProfileData({ ...profileData, rccm: e.target.value })}
                          disabled={!isEditing}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personnalisation */}
                <Card className="border-gray-200 shadow-lg rounded-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-primary-600">
                      <Palette className="w-5 h-5" />
                      Personnalisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brandColor">Couleur de marque</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="brandColor"
                            value={profileData.brandColor}
                            onChange={(e) => setProfileData({ ...profileData, brandColor: e.target.value })}
                            disabled={!isEditing}
                            className="w-12 h-10 border border-gray-300 rounded-lg"
                          />
                          <Input
                            value={profileData.brandColor}
                            disabled
                            className="border-gray-300 bg-gray-50 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Logo de l'entreprise</Label>
                        <div className="flex items-center gap-4">
                          {profileData.avatar ? (
                            <img
                              src={profileData.avatar}
                              alt="Logo entreprise"
                              className="w-16 h-16 rounded-lg object-contain border-2 border-gray-200 group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          {isEditing && (
                            <Button variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-all duration-200">
                              <Upload className="w-4 h-4 mr-2" />
                              Changer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne de droite - État de l'abonnement */}
              <div className="space-y-6">
                {/* État de l'abonnement */}
                <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>État de l'abonnement</span>
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(profileData.subscription.status)} mr-2 animate-pulse`}></span>
                        <span className="text-sm font-normal">{profileData.subscription.status === "active" ? "Actif" : profileData.subscription.status === "inactive" ? "Inactif" : "Expiré"}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xl font-bold">Plan {profileData.subscription.plan}</p>
                      <p className="text-sm text-white/80">
                        Actif jusqu'au {profileData.subscription.endDate}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilisation des documents</span>
                        <span className="font-medium">
                          {profileData.subscription.docsUsed} / {profileData.subscription.docsTotal}
                        </span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${usagePercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-white/70">
                        {profileData.subscription.docsTotal - profileData.subscription.docsUsed} documents restants ce mois
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <Button variant="secondary" className="w-full bg-white text-primary-700 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
                        Gérer l'abonnement
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sécurité */}
                <Card className="border-gray-200 shadow-lg rounded-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardTitle className="text-lg font-semibold text-primary-600">Sécurité</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full shadow-md hover:shadow-lg transition-all duration-200">
                        Changer le mot de passe
                      </Button>
                      <Button variant="outline" className="w-full shadow-md hover:shadow-lg transition-all duration-200">
                        Activer la 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card className="border-gray-200 shadow-lg rounded-xl bg-gradient-to-br from-gray-50 to-blue-50">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2 text-primary-600">Besoin d'aide ?</h3>
                    <p className="text-sm text-gray-600 mb-4">Notre équipe est disponible pour vous aider avec toutes vos questions.</p>
                    <Button variant="outline" className="w-full shadow-md hover:shadow-lg transition-all duration-200">
                      Contacter le support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default UserProfile;