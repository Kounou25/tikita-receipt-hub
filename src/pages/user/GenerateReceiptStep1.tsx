import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { cn } from "@/lib/utils"; // ← Import ajouté
import TemplateCard from '@/components/user/TemplateCard';
import { getCookie, setCookie } from '@/lib/cookies';

const GenerateReceiptStep1 = () => {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);
  const navigate = useNavigate();

  const allTemplates = [
    {
      id: "classic",
      nameKey: "templates.classic.name",
      descriptionKey: "templates.classic.description",
      thumbnail: "/receipts_models/classic.png",
      popular: false,
    },
    {
      id: "modern",
      nameKey: "templates.modern.name",
      descriptionKey: "templates.modern.description",
      thumbnail: "/receipts_models/modern.png",
      popular: false,
    },
    {
      id: "tarmamu",
      nameKey: "templates.tarmamu.name",
      descriptionKey: "templates.tarmamu.description",
      thumbnail: "/receipts_models/tarmamu.png",
      popular: true,
    },
    {
      id: "saraounia",
      nameKey: "templates.saraounia.name",
      descriptionKey: "templates.saraounia.description",
      thumbnail: "/receipts_models/saraounia.png",
      popular: true,
    },
  ];

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const companyId = getCookie("company_id");
        if (!companyId) {
          console.error("No company ID found in cookies");
          setFilteredTemplates([allTemplates[0]]);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();
        const planName = data.plan_name;

        let availableTemplates = [];
        if (planName === "Gratuit") {
          availableTemplates = [allTemplates[0]];
        } else if (planName === "Tikiita plus") {
          availableTemplates = allTemplates.slice(0, 3);
        } else if (planName === "Tikiita pro") {
          availableTemplates = allTemplates;
        } else {
          availableTemplates = [allTemplates[0]];
        }

        setFilteredTemplates(availableTemplates);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setFilteredTemplates([allTemplates[0]]);
      }
    };

    fetchSubscription();
  }, []);

  const handleContinue = () => {
    if (selectedTemplate) {
      setCookie("selectedTemplate", selectedTemplate);
      navigate("/generate/step2");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header title={t('pages.generate_receipt')} />

      <main className="pt-20 px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 pb-24">
        <QuickNav userType="user" />

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">{t('generateReceipt.step1')}</span>
            </div>
            <div className="w-32 h-1 bg-gray-300 dark:bg-gray-700 rounded-full hidden sm:block" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{t('generateReceipt.step2')}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
              {t('generateReceipt.chooseTemplate')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('generateReceipt.selectDesign')}
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedTemplate}
              className={cn(
                "h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl flex items-center gap-4 transition-all",
                selectedTemplate
                  ? "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black shadow-3xl"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              )}
            >
              {t('generateReceipt.continue')}
              <ArrowRight className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenerateReceiptStep1;