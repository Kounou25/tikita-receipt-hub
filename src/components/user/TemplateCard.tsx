import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const TemplateCard = ({ template, selectedTemplate, onSelect }: any) => (
  <Card
    key={template.id}
    className={cn(
      "cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 bg-white dark:bg-gray-900",
      selectedTemplate === template.id
        ? "border-gray-900 dark:border-white shadow-xl ring-4 ring-gray-900/10 dark:ring-white/10"
        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
    )}
    onClick={() => onSelect(template.id)}
  >
    <CardContent className="p-6">
      <div className="relative">
        {template.popular && (
          <div className="absolute -top-3 -right-3 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1 rounded-full z-10">
            Populaire
          </div>
        )}
        {selectedTemplate === template.id && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center z-10">
            <Check className="w-5 h-5 text-white dark:text-black" />
          </div>
        )}
        <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-6 shadow-inner">
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{template.name}</h3>
        <p className="text-base text-gray-600 dark:text-gray-400">{template.description}</p>
      </div>
    </CardContent>
  </Card>
);

export default TemplateCard;
