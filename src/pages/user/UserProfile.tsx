import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
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

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg", className)} />
);

const fetchProfileData = async (companyId, token) => {
  if (!companyId) {
    throw new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
  }

  const [profileResponse, subscriptionResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/profile/${companyId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }),
  ]);

  if (!profileResponse.ok) {
    if (profileResponse.status === 500) {
      throw new Error("Erreur serveur lors de la récupération des informations");
    } else if (profileResponse.status === 409 || profileResponse.status === 403) {
      const error: any = new Error("Session expirée");
      error.cause = "auth";
      throw error;
    } else if (profileResponse.status === 404) {
      const error: any = new Error("Aucune donnée trouvée");
      error.cause = "not_found";
      throw error;
    } else {
      throw new Error(`Échec de la récupération des données du profil: ${profileResponse.status} ${profileResponse.statusText}`);
    }
  }

  const profileDataResponse = await profileResponse.json();

  let subscriptionData = {
    plan: "Premium",
    status: "active",
    endDate: "15/07/2024",
    docsUsed: 847,
    docsTotal: 1000,
  };

  if (subscriptionResponse.ok) {
    const subData = await subscriptionResponse.json();
    subscriptionData = {
      plan: subData.plan_name,
      status: subData.subscription_status,
      endDate: new Date(subData.end_date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      docsUsed: subData.receipts_generated,
      docsTotal: subData.total_quota,
    };
  } else if (subscriptionResponse.status === 500) {
    console.warn("Erreur serveur lors de la récupération de l'abonnement");
  } else if (subscriptionResponse.status === 409 || subscriptionResponse.status === 403) {
    const error: any = new Error("Session expirée");
    error.cause = "auth";
    throw error;
  }

  return {
    fullName: profileDataResponse.user.full_name,
    email: profileDataResponse.user.email,
    phone: profileDataResponse.user.phone_number,
    country: profileDataResponse.user.country,
    avatar: profileDataResponse.logos && profileDataResponse.logos.length > 0 ? profileDataResponse.logos[0].logo_url : "",
    userNumber: `TKT-USER-${profileDataResponse.user.user_id.toString().padStart(5, "0")}`,
    companyName: profileDataResponse.company.company_name,
    slogan: profileDataResponse.company.company_slogan,
    address: profileDataResponse.company.company_adress,
    nif: profileDataResponse.company.nif,
    rccm: profileDataResponse.company.rccm,
    brandColor: profileDataResponse.company.company_color,
    subscription: subscriptionData,
  };
};

const saveProfileData = async ({ companyId, token, profileData }) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/profile/${companyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      user: {
        full_name: profileData.fullName,
        email: profileData.email,
        phone_number: profileData.phone,
        country: profileData.country,
      },
      company: {
        company_name: profileData.companyName,
        company_slogan: profileData.slogan,
        company_adress: profileData.address,
        nif: profileData.nif,
        rccm: profileData.rccm,
        company_color: profileData.brandColor,
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("Erreur lors de la sauvegarde des modifications");
    } else if (response.status === 409 || response.status === 403) {
      const error: any = new Error("Session expirée");
      error.cause = "auth";
      throw error;
    } else {
      throw new Error(`Échec de la sauvegarde des modifications: ${response.status} ${response.statusText}`);
    }
  }

  return profileData;
};

const UserProfile = () => {
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

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 mobile-nav-padding">
      <Toaster position="top-right" />

      <Header title="Mon Profil" showMenu={true} />

      <main className="pt-6 px-1 md:px-6 lg:px-8 pb-24 max-w-[1400px] mx-auto">
        <QuickNav userType="user" />

        {/* Loading Overlay */}
        {isLoading && createPortal(
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Chargement du profil...</p>
            </div>
          </div>,
          document.body
        )}

        {/* Error Popup */}
        {error && createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">Erreur</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {(error as any)?.cause === "auth"
                  ? "Votre session a expirée. Veuillez vous reconnecter."
                  : (error as any)?.cause === "not_found"
                  ? "Aucune donnée de profil trouvée."
                  : error.message || "Une erreur est survenue lors du chargement des données."}
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
                  Réessayer
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