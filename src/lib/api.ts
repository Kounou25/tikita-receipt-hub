export const fetchProfileData = async (companyId: any, token: any) => {
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

export const saveProfileData = async ({ companyId, token, profileData }: any) => {
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

// Plans
export const getPlans = async (token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/plans`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
  });
  if (!response.ok) throw new Error(`Échec de la récupération des plans : ${response.status} ${response.statusText}`);
  return response.json();
};

// Subscriptions
export const getSubscription = async (companyId: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscription/${companyId}`, {
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
  });
  if (!response.ok) throw new Error(`Échec de la récupération des données d'abonnement : ${response.status} ${response.statusText}`);
  return response.json();
};

export const subscribeCompany = async (payload: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/subscriptions/subscribe/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Échec de la création de l'abonnement : ${response.status}`);
  }
  return response.json();
};

// Payments
export const createPayment = async (payload: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/payments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Échec de la création du paiement : ${response.status}`);
  }
  return response.json();
};

// Receipts
export const generateReceiptBlob = async (id: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${id}`, {
    method: "GET",
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
  });
  if (!response.ok) throw new Error(`Échec du téléchargement du PDF: ${response.status} ${response.statusText}`);
  const blob = await response.blob();
  return blob;
};

// Variant using axios to preserve onDownloadProgress (used in GenerateReceiptStep2)
import axios from "axios";
export const generateReceiptBlobWithProgress = async (id: any, token?: any, onDownloadProgress?: any) => {
  const url = `${import.meta.env.VITE_BASE_API_URL}/receipt/generate/${id}`;
  const resp = await axios.get(url, { headers: { ...(token && { Authorization: `Bearer ${token}` }) }, responseType: "blob", onDownloadProgress });
  return resp.data;
};

export const createReceipt = async (payload: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/receipts/receipt/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.message || json.error || `Échec de la création du reçu: ${response.status}`);
  }
  return response.json();
};

export const getReceiptDetails = async (companyId: any, id: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/details/${companyId}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
  });
  if (!response.ok) throw new Error(`Échec du chargement des détails: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data;
};

// Dashboard
export const fetchDashboardData = async (companyId: any, token?: any) => {
  const [statsResponse, revenueResponse, clientsResponse, receiptsResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/${companyId}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/revenuePerMonth/${companyId}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/stats/topFiveClients/${companyId}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } }),
    fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/5`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } }),
  ]);

  if (!statsResponse.ok) {
    if (statsResponse.status === 404) return { stats: [], revenueData: null, topClients: null, recentReceipts: null };
    throw new Error(`Échec du chargement des statistiques: ${statsResponse.status} ${statsResponse.statusText}`);
  }

  const [statsData, revenueData, clientsData, receiptsData] = await Promise.all([
    statsResponse.json(),
    revenueResponse.ok ? revenueResponse.json() : null,
    clientsResponse.ok ? clientsResponse.json() : null,
    receiptsResponse.ok ? receiptsResponse.json() : null,
  ]);

  return { statsData, revenueData, clientsData, receiptsData };
};

// Receipts list
export const getReceiptsList = async (companyId: any, offsetOrPage: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/receipt/list/${companyId}/${offsetOrPage}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } });
  if (!response.ok) throw new Error(`Échec de la récupération des reçus: ${response.status} ${response.statusText}`);
  return response.json();
};

// Clients
export const getClients = async (companyId: any, token?: any) => {
  if (!companyId) throw new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/clients/${companyId}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`Échec de la récupération des clients: ${response.status} ${response.statusText}`);
  return response.json();
};

export const removeClient = async (clientId: any, token?: any) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/clients/client/delete/${clientId}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } });
  if (!response.ok) throw new Error(`Échec de la suppression du client: ${response.status} ${response.statusText}`);
  return clientId;
};

// Notifications
export const fetchNotificationsApi = async (companyId: any, token?: any) => {
  if (!companyId) {
    const error: any = new Error("ID de l'entreprise non défini. Veuillez vous reconnecter.");
    error.cause = "auth";
    throw error;
  }
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/notifications/${companyId}`, { headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) } });
  if (!response.ok) {
    if (response.status === 500) throw new Error("Erreur serveur lors de la récupération des notifications");
    if (response.status === 409 || response.status === 403) {
      const error: any = new Error("Session expirée");
      error.cause = "auth";
      throw error;
    }
    throw new Error(`Échec de la récupération des notifications: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Company creation (register)
export const createCompany = async (formData: FormData) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/company/company`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.error || `Échec de la création de l'entreprise: ${response.status}`);
  }
  return response.json();
};