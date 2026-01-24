import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import MobileNav from "@/components/layout/MobileNav";
import QuickNav from "@/components/layout/QuickNav";
import { User, Building2, Palette, Save, BadgeCheck, Upload, Loader2, AlertCircle } from "lucide-react";
import UserProfileHeader from '@/components/user/UserProfileHeader';
import PersonalInfoSection from '@/components/user/PersonalInfoSection';
import CompanyInfoSection from '@/components/user/CompanyInfoSection';
import PersonalizationSection from '@/components/user/PersonalizationSection';
import SubscriptionCard from '@/components/user/SubscriptionCard';
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getCookie, setCookie } from "@/lib/cookies";
import { fetchProfileData, saveProfileData } from "@/lib/api";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg", className)} />
);

// API functions moved to `src/lib/api.ts` and imported above to centralize requests.

const UserProfile = () => {
  useScrollToTop();
  const [isEditing, setIsEditing] = useState(false);
  const companyId = getCookie("company_id") || null;
  const token = getCookie("token") || null;
  const queryClient = useQueryClient();

  const { data: profileData = {} as any, isLoading, error } = useQuery({
    queryKey: ['profile', companyId],
    queryFn: () => fetchProfileData(companyId, token),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
  if (profileData.avatar) {
    setCookie("user_avatar", profileData.avatar); // Met à jour l'avatar dans le stockage via cookies
  }

  const [profileState, setProfileState] = useState<any>(profileData || {});

  useEffect(() => {
    setProfileState(profileData || {});
  }, [profileData]);

  const displayedProfile = isEditing ? profileState : profileData;

  const saveMutation = useMutation({
    mutationFn: saveProfileData,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['profile', companyId], updatedData);
      setIsEditing(false);
      setProfileState(updatedData || {});
      toast.success("Profil mis à jour avec succès", { duration: 3000 });
    },
    onError: (err) => {
      console.error("Error saving profile:", err);
      toast.error(err.message || "Une erreur est survenue lors de la sauvegarde.", { duration: 5000 });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ companyId, token, profileData: profileState });
  };

  const usagePercentage = ((displayedProfile.subscription?.docsUsed ?? 0) / (displayedProfile.subscription?.docsTotal ?? 1)) * 100 || 0;

  const getStatusColor = (status) => {
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

  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      <Toaster position="top-right" />

      <Header title={t('pages.profile')} showMenu={true} />

      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />

        {/* Loading Overlay */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('profile.loadingProfile')}</p>
            </div>
          </div>,
          document.body
        )}

        {/* Error Popup */}
        {error && createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">{t('profile.error')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {(error as any)?.cause === "auth"
                  ? t('profile.sessionExpired')
                  : (error as any)?.cause === "not_found"
                  ? t('profile.noDataFound')
                  : error.message || t('profile.loadError')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(error as any)?.cause === "auth" && (
                  <Link to="/login">
                    <Button className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black rounded-lg">
                      Se connecter
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white" onClick={() => queryClient.invalidateQueries({ queryKey: ['profile', companyId] })}>
                  {t('profile.retry')}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Main Content */}
        {!error && (
          <>
            {/* Profile Header */}
            {isLoading ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <Skeleton className="w-32 h-32 rounded-xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-64" />
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-48" />
                </div>
              </div>
            ) : (
              <UserProfileHeader
                displayedProfile={displayedProfile}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                saveMutation={saveMutation}
                handleSave={handleSave}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Informations personnelles */}
                {isLoading ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <Skeleton className="h-8 w-64 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ) : (
                  <PersonalInfoSection displayedProfile={displayedProfile} isEditing={isEditing} setProfileState={setProfileState} />
                )}

                {/* Informations entreprise */}
                {isLoading ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <Skeleton className="h-8 w-64 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-32 w-full md:col-span-2" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ) : (
                  <CompanyInfoSection displayedProfile={displayedProfile} isEditing={isEditing} setProfileState={setProfileState} />
                )}

                {/* Personnalisation */}
                {isLoading ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <Skeleton className="h-8 w-64 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="w-24 h-24 rounded-xl" />
                    </div>
                  </div>
                ) : (
                  <PersonalizationSection displayedProfile={displayedProfile} isEditing={isEditing} setProfileState={setProfileState} />
                )}
              </div>

              {/* Abonnement */}
              {isLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <Skeleton className="h-8 w-64 mb-6" />
                  <Skeleton className="h-10 w-48 mb-2" />
                  <Skeleton className="h-6 w-64 mb-6" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <SubscriptionCard displayedProfile={displayedProfile} usagePercentage={usagePercentage} getStatusColor={getStatusColor} />
              )}
            </div>
          </>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default UserProfile;