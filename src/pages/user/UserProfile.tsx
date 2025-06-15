
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { User, Building2, MapPin, Phone, Mail, Upload, Palette, Save } from "lucide-react";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Informations personnelles
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+225 01 02 03 04 05",
    country: "Côte d'Ivoire",
    
    // Informations entreprise
    companyName: "Boutique John",
    slogan: "Votre satisfaction, notre priorité",
    address: "Cocody, Abidjan",
    nif: "NIF123456789",
    rccm: "RCCM987654321",
    brandColor: "#4CAF50"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Logique de sauvegarde
    console.log("Profil sauvegardé:", profileData);
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Mon Profil" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Informations personnelles */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations personnelles
            </CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              ) : (
                "Modifier"
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informations entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Personnalisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* État de l'abonnement */}
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">État de l'abonnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Plan Premium</p>
                <p className="text-sm text-gray-600">Actif jusqu'au 15 juillet 2024</p>
                <p className="text-sm text-primary">847 / 1,000 reçus utilisés ce mois</p>
              </div>
              <Button variant="outline">
                Gérer l'abonnement
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default UserProfile;
