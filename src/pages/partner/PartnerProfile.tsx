
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Edit, Save, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";

const PartnerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [profile, setProfile] = useState({
    companyName: "TechCorp Solutions",
    contactName: "Amadou Diallo",
    email: "contact@techcorp.ci",
    phone: "+225 01 02 03 04 05",
    address: "Plateau, Abidjan, Côte d'Ivoire",
    website: "https://techcorp.ci",
    description: "Partenaire technologique spécialisé dans l'intégration de solutions de facturation pour les entreprises ivoiriennes.",
    partnerSince: "Janvier 2024"
  });

  const { t } = useTranslation();
  const apiCredentials = {
    apiKey: "tk_live_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
    secretKey: "sk_live_ZyXwVuTsRqPoNmLkJiHgFeDcBa987654",
    webhookUrl: "https://api.techcorp.ci/webhooks/tikita"
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
    console.log("Profile saved:", profile);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const regenerateApiKey = () => {
    // Logic to regenerate API key
    console.log("Regenerating API key...");
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Profil Partenaire" />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="partner" />

        {/* Company Information */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Informations de l'entreprise</CardTitle>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-primary hover:bg-primary/90"
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

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>Partenaire depuis :</strong> {profile.partnerSince}
              </p>
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
                  className="border-gray-300 bg-gray-50"
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
                  className="border-gray-300 bg-gray-50"
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
                  className="border-gray-300 bg-gray-50"
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
                <p className="text-2xl font-bold text-blue-600">1,248</p>
                <p className="text-sm text-gray-600">Utilisateurs référés</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">15,420</p>
                <p className="text-sm text-gray-600">Reçus générés</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">89%</p>
                <p className="text-sm text-gray-600">Taux de satisfaction</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">2.1M</p>
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
