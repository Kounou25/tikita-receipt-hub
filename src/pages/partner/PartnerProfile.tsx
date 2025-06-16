
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Edit, Save, Eye, EyeOff, Copy, RefreshCw, Camera, Building2 } from "lucide-react";

const PartnerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [profile, setProfile] = useState({
    companyName: "TechCorp Solutions Niger",
    contactName: "Ibrahim Mamadou",
    email: "contact@techcorp.ne",
    phone: "+227 96 23 45 67",
    address: "Plateau, Niamey, Niger",
    website: "https://techcorp.ne",
    description: "Partenaire technologique spécialisé dans l'intégration de solutions de facturation pour les entreprises nigériennes.",
    partnerSince: "Janvier 2024",
    logo: "/lovable-uploads/98b915da-4744-4a07-84d2-b2d5065e9c15.png"
  });

  const apiCredentials = {
    apiKey: "tk_live_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
    secretKey: "sk_live_ZyXwVuTsRqPoNmLkJiHgFeDcBa987654",
    webhookUrl: "https://api.techcorp.ne/webhooks/tikita"
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile saved:", profile);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regenerateApiKey = () => {
    console.log("Regenerating API key...");
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Profil Partenaire" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="partner" />

        {/* En-tête avec logo et informations principales */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={profile.logo} alt={profile.companyName} />
                  <AvatarFallback className="text-2xl">
                    <Building2 className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.companyName}</h2>
                <p className="text-gray-600 mb-1">Contact : {profile.contactName}</p>
                <p className="text-sm text-gray-500 mb-4">Partenaire depuis {profile.partnerSince}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{profile.email}</span>
                  <span>{profile.phone}</span>
                  <span>{profile.website}</span>
                </div>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 w-full md:w-auto"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Informations de l'entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={profile.companyName}
                  onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom du contact</Label>
                <Input
                  id="contactName"
                  value={profile.contactName}
                  onChange={(e) => setProfile({...profile, contactName: e.target.value})}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                disabled={!isEditing}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                disabled={!isEditing}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({...profile, description: e.target.value})}
                disabled={!isEditing}
                className="border-gray-300"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Credentials */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Clés API</CardTitle>
            <p className="text-gray-600">
              Utilisez ces clés pour intégrer Tikita à vos applications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Clé API publique</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={apiCredentials.apiKey}
                  readOnly
                  className="border-gray-300 bg-gray-50 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiCredentials.apiKey)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Clé secrète</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={apiCredentials.secretKey}
                  readOnly
                  className="border-gray-300 bg-gray-50 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiCredentials.secretKey)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL de webhook</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={apiCredentials.webhookUrl}
                  readOnly
                  className="border-gray-300 bg-gray-50 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiCredentials.webhookUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={regenerateApiKey}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Régénérer les clés API
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Attention : La régénération des clés cassera les intégrations existantes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Statistiques du partenariat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">648</p>
                <p className="text-sm text-gray-600">Utilisateurs référés</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">8,420</p>
                <p className="text-sm text-gray-600">Reçus générés</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">92%</p>
                <p className="text-sm text-gray-600">Taux de satisfaction</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">1.8M</p>
                <p className="text-sm text-gray-600">Revenus générés (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default PartnerProfile;
