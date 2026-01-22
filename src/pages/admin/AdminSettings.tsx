
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { Save, Settings, Bell, Shield, CreditCard, Mail } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Tikita",
    platformDescription: "Plateforme de génération de reçus numériques",
    supportEmail: "support@tikita.com",
    maxReceiptsPerUser: 1000,
    
    // Pricing Settings
    basicPlanPrice: 5000,
    premiumPlanPrice: 15000,
    enterprisePlanPrice: 50000,
    partnerCommission: 15,
    
    // Features
    enableRegistration: true,
    enablePartnerProgram: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    maintenanceMode: false,
    
    // Security
    requireEmailVerification: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5
  });

  const handleSave = () => {
    console.log("Settings saved:", settings);
    // Save logic here
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      const { t } = useTranslation();

      <Header title={t('pages.admin_settings')} />
      
      <main className="p-4 md:p-6 space-y-6">
        <QuickNav userType="admin" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Paramètres système</h2>
            <p className="text-gray-600">Configurez les paramètres globaux de la plateforme</p>
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Nom de la plateforme</Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => updateSetting('platformName', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platformDescription">Description</Label>
                <Textarea
                  id="platformDescription"
                  value={settings.platformDescription}
                  onChange={(e) => updateSetting('platformDescription', e.target.value)}
                  className="border-gray-300"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => updateSetting('supportEmail', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxReceipts">Limite de reçus par utilisateur</Label>
                <Input
                  id="maxReceipts"
                  type="number"
                  value={settings.maxReceiptsPerUser}
                  onChange={(e) => updateSetting('maxReceiptsPerUser', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Tarification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basicPrice">Prix plan Basic (FCFA)</Label>
                <Input
                  id="basicPrice"
                  type="number"
                  value={settings.basicPlanPrice}
                  onChange={(e) => updateSetting('basicPlanPrice', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="premiumPrice">Prix plan Premium (FCFA)</Label>
                <Input
                  id="premiumPrice"
                  type="number"
                  value={settings.premiumPlanPrice}
                  onChange={(e) => updateSetting('premiumPlanPrice', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enterprisePrice">Prix plan Entreprise (FCFA)</Label>
                <Input
                  id="enterprisePrice"
                  type="number"
                  value={settings.enterprisePlanPrice}
                  onChange={(e) => updateSetting('enterprisePlanPrice', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission">Commission partenaires (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.partnerCommission}
                  onChange={(e) => updateSetting('partnerCommission', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Fonctionnalités
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Inscriptions</Label>
                  <p className="text-sm text-gray-600">Permettre les nouvelles inscriptions</p>
                </div>
                <Switch
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => updateSetting('enableRegistration', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Programme partenaires</Label>
                  <p className="text-sm text-gray-600">Activer le programme de partenariat</p>
                </div>
                <Switch
                  checked={settings.enablePartnerProgram}
                  onCheckedChange={(checked) => updateSetting('enablePartnerProgram', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications email</Label>
                  <p className="text-sm text-gray-600">Envoyer des notifications par email</p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-gray-600">Activer le mode maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Vérification email obligatoire</Label>
                  <p className="text-sm text-gray-600">Exiger la vérification email</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => updateSetting('requireEmailVerification', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de session (heures)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Tentatives de connexion max</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                  className="border-gray-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>État du système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">99.9%</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">2,847</p>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">45,623</p>
                <p className="text-sm text-gray-600">Reçus générés</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">12MB</p>
                <p className="text-sm text-gray-600">Stockage utilisé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default AdminSettings;
