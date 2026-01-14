import React from 'react';

const SubscriptionCard = ({ displayedProfile, usagePercentage, getStatusColor }: any) => {
  return (
    <div className="bg-black text-white rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-8 flex items-center justify-between">
        <span>État de l'abonnement</span>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full ${getStatusColor(displayedProfile.subscription?.status)} mr-2 animate-pulse`} />
          <span className="text-lg">
            {displayedProfile.subscription?.status === 'active' ? 'Actif' : displayedProfile.subscription?.status === 'inactive' ? 'Inactif' : 'Expiré'}
          </span>
        </div>
      </h2>
      <div className="space-y-8">
        <div>
          <p className="text-4xl font-bold">Plan {displayedProfile.subscription?.plan}</p>
          <p className="text-white/80 mt-2 text-lg">Actif jusqu'au {displayedProfile.subscription?.endDate}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-xl">
            <span>Utilisation des documents</span>
            <span className="font-bold">{displayedProfile.subscription?.docsUsed} / {displayedProfile.subscription?.docsTotal}</span>
          </div>
          <div className="h-5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-white/80 text-center text-lg">{ (displayedProfile.subscription?.docsTotal ?? 0) - (displayedProfile.subscription?.docsUsed ?? 0) } documents restants ce mois</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
