
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { User, Building2, MapPin, Phone, Mail, Upload, Palette, Save, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Informations personnelles
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+225 01 02 03 04 05",
    country: "Côte d'Ivoire",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces",
    userNumber: "TKT-USER-00125",
    
    // Informations entreprise
    companyName: "Boutique John",
    slogan: "Votre satisfaction, notre priorité",
    address: "Cocody, Abidjan",
    nif: "NIF123456789",
    rccm: "RCCM987654321",
    brandColor: "#4CAF50",

    // Informations abonnement
    subscription: {
      plan: "Premium",
      status: "active",
      endDate: "15/07/2024",
      docsUsed: 847,
      docsTotal: 1000
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    // Logique de sauvegarde
    console.log("Profil sauvegardé:", profileData);
  };

  // Calculer le pourcentage d'utilisation
  const usagePercentage = (profileData.subscription.docsUsed / profileData.subscription.docsTotal) * 100;

  const getStatusColor = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Mon Profil" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* En-tête du profil avec avatar */}
        <div className="mb-6">
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700 relative">
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <CardContent className="pt-0 -mt-16 relative">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                  <div className="ring-4 ring-white rounded-full bg-white">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileData.avatar} alt={profileData.fullName} />
                      <AvatarFallback className="bg-primary-100 text-primary-800 text-2xl font-semibold">
                        {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Button variant="secondary" size="sm" className="bg-white">
                          <Upload className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="md:mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                      <BadgeCheck className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{profileData.email}</div>
                    <div className="text-xs text-gray-500">ID: {profileData.userNumber}</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="md:mb-4"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    ) : (
                      "Modifier mon profil"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne de gauche - Informations Personnelles et Entreprise */}
          <div className="md:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
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
                      className="border-gray-300"
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
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      disabled
                      className="border-gray-300 bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations entreprise */}
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-500" />
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
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slogan">Slogan</Label>
                    <Input
                      id="slogan"
                      value={profileData.slogan}
                      onChange={(e) => setProfileData({ ...profileData, slogan: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300"
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
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rccm">RCCM</Label>
                    <Input
                      id="rccm"
                      value={profileData.rccm}
                      onChange={(e) => setProfileData({ ...profileData, rccm: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personnalisation */}
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-500" />
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
                        className="w-12 h-10 border border-gray-300 rounded"
                      />
                      <Input
                        value={profileData.brandColor}
                        disabled
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Logo de l'entreprise</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      {isEditing && (
                        <Button variant="outline" size="sm">
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
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>État de l'abonnement</span>
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full bg-green-300 mr-2 animate-pulse`}></span>
                    <span className="text-sm font-normal">Actif</span>
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
                      className="h-full bg-white rounded-full" 
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-white/70">
                    {profileData.subscription.docsTotal - profileData.subscription.docsUsed} documents restants ce mois
                  </p>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <Button variant="secondary" className="w-full bg-white text-primary-700 hover:bg-gray-100">
                    Gérer l'abonnement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-primary-50">
                <CardTitle className="text-lg font-semibold">Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Changer le mot de passe
                  </Button>
                  <Button variant="outline" className="w-full">
                    Activer la 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-gray-200 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600 mb-4">Notre équipe est disponible pour vous aider avec toutes vos questions.</p>
                <Button variant="outline" className="w-full">
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserProfile;
