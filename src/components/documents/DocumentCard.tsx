
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Star, Pencil } from "lucide-react";

interface DocumentCardProps {
  type: "reçu" | "facture";
  title: string;
  description: string;
  preview: string;
  isPremium?: boolean;
  onSelect?: () => void;
}

const DocumentCard = ({ 
  type, 
  title, 
  description, 
  preview, 
  isPremium = false, 
  onSelect 
}: DocumentCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group border">
      <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
        {isPremium && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 border-0">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {t('common.premium')}
            </Badge>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/50 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onSelect} className="bg-primary-500 hover:bg-primary-600">
              {t('common.use')}
            </Button>
          </div>
        </div>
        
        <img 
          src={preview} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              <FileText className="h-3 w-3 mr-1" />
              {type === "reçu" ? "Reçu" : "Facture"}
            </Badge>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
