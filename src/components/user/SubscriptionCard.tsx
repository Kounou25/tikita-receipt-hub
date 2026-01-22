import React from 'react';
import { useTranslation } from 'react-i18next';

const SubscriptionCard = ({ displayedProfile, usagePercentage, getStatusColor }: any) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-black dark:bg-white text-white dark:text-black rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-8 flex items-center justify-between">
        <span>{t('subscription.status')}</span>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full ${getStatusColor(displayedProfile.subscription?.status)} mr-2 animate-pulse`} />
          <span className="text-lg">
            {displayedProfile.subscription?.status === 'active' ? t('subscription.active') : displayedProfile.subscription?.status === 'inactive' ? t('subscription.inactive') : t('subscription.expired')}
          </span>
        </div>
      </h2>
      <div className="space-y-8">
        <div>
          <p className="text-4xl font-bold">{t('subscription.plan')} {displayedProfile.subscription?.plan}</p>
          <p className="text-white/80 dark:text-black/70 mt-2 text-lg">{t('subscription.activeUntil')} {displayedProfile.subscription?.endDate}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-xl">
            <span>{t('subscription.usage')}</span>
            <span className="font-bold">{displayedProfile.subscription?.docsUsed} / {displayedProfile.subscription?.docsTotal}</span>
          </div>
          <div className="h-5 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white dark:bg-black rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-white/80 dark:text-black/70 text-center text-lg">{(displayedProfile.subscription?.docsTotal ?? 0) - (displayedProfile.subscription?.docsUsed ?? 0)} {t('subscription.remaining')}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
