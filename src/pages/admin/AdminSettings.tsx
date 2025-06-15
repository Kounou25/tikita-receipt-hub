
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/layout/Header";
import { Settings, Database, Mail, Bell, Shield, DollarSign } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformName: "Tikita",
    supportEmail: "support@tikita.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    partnerApprovalRequired: true,
    basicPlanPrice: "5000",
    premiumPlanPrice: "15000",
    enterprisePlanPrice: "50000",
    maxReceiptsBasic: "100",
    maxReceiptsPremium: "1000",
    maxReceiptsEnterprise: "unlimited"
  });

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Paramètres Généraux" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Platform Settings */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration de la plateforme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Nom de la plateforme</Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Mode maintenance</h4>
                  <p className="text-sm text-gray-600">Désactive temporairement l'accès à la plateforme</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Inscription ouverte</h4>
                  <p className="text-sm text-gray-600">Permet aux nouveaux utilisateurs de s'inscrire</p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, registrationEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Approbation partenaires</h4>
                  <p className="text-sm text-gray-600">Exige une approbation manuelle pour les nouveaux partenaires</p>
                </div>
                <Switch
                  checked={settings.partnerApprovalRequired}
                  onCheckedChange={(checked) => setSettings({ ...settings, partnerApprovalRequired: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Tarification des abonnements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Plan Basic</h3>
                <div className="space-y-2">
                  <Label htmlFor="basicPrice">Prix mensuel (FCFA)</Label>
                  <Input
                    id="basicPrice"
                    value={settings.basicPlanPrice}
                    onChange={(e) => setSettings({ ...settings, basicPlanPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basicLimit">Limite de reçus/mois</Label>
                  <Input
                    id="basicLimit"
                    value={settings.maxReceiptsBasic}
                    onChange={(e) => setSettings({ ...settings, maxReceiptsBasic: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Plan Premium</h3>
                <div className="space-y-2">
                  <Label htmlFor="premiumPrice">Prix mensuel (FCFA)</Label>
                  <Input
                    id="premiumPrice"
                    value={settings.premiumPlanPrice}
                    onChange={(e) => setSettings({ ...settings, premiumPlanPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premiumLimit">Limite de reçus/mois</Label>
                  <Input
                    id="premiumLimit"
                    value={settings.maxReceiptsPremium}
                    onChange={(e) => setSettings({ ...settings, maxReceiptsPremium: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Plan Entreprise</h3>
                <div className="space-y-2">
                  <Label htmlFor="enterprisePrice">Prix mensuel (FCFA)</Label>
                  <Input
                    id="enterprisePrice"
                    value={settings.enterprisePlanPrice}
                    onChange={(e) => setSettings({ ...settings, enterprisePlanPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enterpriseLimit">Limite de reçus/mois</Label>
                  <Input
                    id="enterpriseLimit"
                    value={settings.maxReceiptsEnterprise}
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              État du système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Métriques en temps réel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilisateurs connectés</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requêtes API/min</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temps de réponse</span>
                    <span className="font-medium text-green-600">145ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibilité</span>
                    <span className="font-medium text-green-600">99.97%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Actions système</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Sauvegarder la base de données
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Analyser la sécurité
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Tester les notifications
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Enregistrer tous les paramètres
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
