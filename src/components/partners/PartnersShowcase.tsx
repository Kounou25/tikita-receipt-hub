
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Partner {
  name: string;
  logo: string;
  industry?: string;
}

interface PartnersShowcaseProps {
  title: string;
  description: string;
  partners: Partner[];
  className?: string;
}

const PartnersShowcase = ({ 
  title, 
  description, 
  partners,
  className 
}: PartnersShowcaseProps) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-center p-6">
                <div className="h-20 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </CardContent>
              <div className="text-center pb-4">
                <h3 className="font-medium text-sm">{partner.name}</h3>
                {partner.industry && (
                  <p className="text-xs text-gray-500">{partner.industry}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersShowcase;
