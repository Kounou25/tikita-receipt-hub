
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import { Building2, Key, Copy, Eye, EyeOff } from "lucide-react";

const PartnerProfile = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "TechCorp Solutions",
    email: "api@techcorp.com",
    phone: "+225 07 89 12 34 56",
    website: "https://techcorp.com",
    contactPerson: "Marie Kouakou",
    apiKey: "tk_live_1234567890abcdef1234567890abcdef"
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profil Partenaire" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Company Info */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Informations de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Personne de contact</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                Enregistrer les modifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Configuration API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Clé API de production</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={formData.apiKey}
                      readOnly
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(formData.apiKey)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Cette clé vous permet d'accéder à l'API Tikita en mode production.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Sécurité importante</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ne partagez jamais votre clé API publiquement</li>
                  <li>• Utilisez HTTPS pour toutes les requêtes API</li>
                  <li>• Régénérez votre clé si elle a été compromise</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">
                  Régénérer la clé
                </Button>
                <Button variant="outline">
                  Télécharger les logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              État de l'abonnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h4 className="font-medium text-green-800">Plan Entreprise</h4>
                <p className="text-sm text-green-600">
                  50,000 requêtes/mois • Support prioritaire
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">Actif</div>
                <p className="text-sm text-green-600">Renouvellement: 15 Juil 2024</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">12,847</div>
                <p className="text-sm text-gray-600">Requêtes utilisées</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">37,153</div>
                <p className="text-sm text-gray-600">Requêtes restantes</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">25.7%</div>
                <p className="text-sm text-gray-600">Utilisation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PartnerProfile;
