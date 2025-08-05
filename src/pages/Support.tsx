import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { MessageSquare, Mail, FileText, HelpCircle } from "lucide-react";

const Support = () => {
  const faqs = [
    {
      question: "Comment générer mon premier reçu ?",
      answer: "Pour générer votre premier reçu, cliquez sur 'Nouveau reçu' depuis votre tableau de bord, choisissez un modèle, puis remplissez les informations client et les détails des articles."
    },
    {
      question: "Puis-je personnaliser mes reçus avec mon logo ?",
      answer: "Oui, vous pouvez télécharger votre logo lors de la création de votre compte ou dans les paramètres de votre profil. Votre logo apparaîtra automatiquement sur tous vos reçus."
    },
    {
      question: "Comment gérer la TVA sur mes reçus ?",
      answer: "Vous pouvez définir le taux de TVA pour chaque article lors de la création du reçu. Les taux courants (18%, 19.25%) sont pré-configurés dans le système."
    },
    {
      question: "Mes reçus sont-ils sauvegardés automatiquement ?",
      answer: "Oui, tous vos reçus générés sont automatiquement sauvegardés dans votre historique et accessibles à tout moment depuis la section 'Mes reçus'."
    },
    {
      question: "Comment télécharger mes reçus en PDF ?",
      answer: "Depuis l'historique de vos reçus, cliquez sur l'icône de téléchargement à côté de chaque reçu pour le télécharger au format PDF."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-nav-padding">
      <Header title="Support" />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Centre d'aide</h2>
          <p className="text-gray-600">
            Nous sommes là pour vous aider à utiliser Tikiita au mieux
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Guide d'utilisation</h3>
              <p className="text-sm text-gray-600">Apprenez à utiliser toutes les fonctionnalités</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Chat en direct</h3>
              <p className="text-sm text-gray-600">Assistance immédiate par chat</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Support par email</h3>
              <p className="text-sm text-gray-600">Contactez-nous par email</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Questions fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-gray-200 bg-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Autres moyens de contact</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email :</strong> contact.tikiita@gmail.com</p>
                  <p><strong>Téléphone :</strong>+227 98362116</p>
                  <p><strong>Horaires :</strong> Lun-Ven 8h-18h </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Temps de réponse</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Chat en direct :</strong> Immédiat</p>
                  <p><strong>Email :</strong> 2-4 heures</p>
                  <p><strong>Problèmes critiques :</strong> 1 heure</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Support;