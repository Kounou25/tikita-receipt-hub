
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { User, Building2, MapPin, Phone, Mail, Upload, Palette, Save, Camera } from "lucide-react";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Informations personnelles
    fullName: "Amadou Souley",
    email: "amadou.souley@example.com",
    phone: "+227 96 12 34 56",
    country: "Niger",
    profileImage: "/lovable-uploads/98b915da-4744-4a07-84d2-b2d5065e9c15.png",
    
    // Informations entreprise
    companyName: "Boutique Amadou",
    slogan: "Qualité et service, notre engagement",
    address: "Quartier Terminus, Niamey",
    nif: "NIF987654321",
    rccm: "RCCM123456789",
    brandColor: "#f97316"
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profil sauvegardé:", profileData);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, profileImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Mon Profil" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="user" />

        {/* Photo de profil et informations de base */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={profileData.profileImage} alt={profileData.fullName} />
                  <AvatarFallback className="text-2xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.fullName}</h2>
                <p className="text-gray-600 mb-1">{profileData.companyName}</p>
                <p className="text-sm text-gray-500 mb-4">{profileData.slogan}</p>
                <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileData.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profileData.phone}
                  </span>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="w-full md:w-auto"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                ) : (
                  "Modifier le profil"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations personnelles
            </CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="brandColor">Couleur de marque</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="brandColor"
                  value={profileData.brandColor}
                  onChange={(e) => setProfileData({ ...profileData, brandColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={profileData.brandColor}
                  disabled
                  className="border-gray-300 bg-gray-50"
                />
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
                <p className="font-medium text-gray-900">Plan Professionnel</p>
                <p className="text-sm text-gray-600">Actif jusqu'au 15 juillet 2024</p>
                <p className="text-sm text-primary">147 / 200 reçus utilisés ce mois</p>
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
