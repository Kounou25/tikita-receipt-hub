
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";

interface UserProfileCardProps {
  name: string;
  email: string;
  avatar?: string;
  userNumber: string;
  subscriptionStatus: "active" | "inactive" | "expired";
  subscriptionType: string;
  subscriptionEndDate: string;
}

const UserProfileCard = ({
  name,
  email,
  avatar,
  userNumber,
  subscriptionStatus,
  subscriptionType,
  subscriptionEndDate
}: UserProfileCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700"></div>
      <CardContent className="pt-0 -mt-12">
        <div className="flex flex-col items-center">
          <div className="ring-4 ring-white rounded-full">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary-100 text-primary-800 text-xl font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h3 className="mt-4 text-xl font-bold flex items-center gap-2">
            {name}
            <BadgeCheck className="h-5 w-5 text-primary-500" />
          </h3>
          
          <p className="text-gray-500 text-sm">{email}</p>
          
          <p className="text-xs text-gray-400 mt-1">
            ID: {userNumber}
          </p>
          
          <div className="mt-4 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getStatusColor(subscriptionStatus)}`}></span>
            <span className="font-medium text-sm">
              {subscriptionType} 
              <span className="text-gray-500"> - valide jusqu'au {subscriptionEndDate}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
