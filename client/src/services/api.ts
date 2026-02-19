const API_BASE_URL = 'http://localhost:8080/api/v1';

// Mock data for development
const MOCK_ARTWORKS = [
  { id: '1', title: 'Abstract Dreams', artist: 'John Doe', price: 5000 },
  { id: '2', title: 'Digital Landscape', artist: 'Jane Smith', price: 7500 },
  { id: '3', title: 'Modern Sculpture', artist: 'Mike Johnson', price: 12000 },
];

const MOCK_AUCTIONS = [
  { id: '1', title: 'Rare Painting', currentPrice: 8000, startPrice: 5000, endTime: new Date(Date.now() + 86400000).toISOString(), bidsCount: 5 },
  { id: '2', title: 'Contemporary Art', currentPrice: 3500, startPrice: 2000, endTime: new Date(Date.now() + 172800000).toISOString(), bidsCount: 12 },
];

const MOCK_STATS = {
  totalTransactions: 42,
  totalVolume: 125000,
  activeAuctions: 8,
  portfolioValue: 500000,
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests with fallback to mock data
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: headers as HeadersInit,
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn(`API request failed for ${endpoint}, using mock data:`, error);
    // Return mock data based on endpoint
    if (endpoint.includes('/artworks')) {
      return { artworks: MOCK_ARTWORKS, total: MOCK_ARTWORKS.length } as T;
    }
    if (endpoint.includes('/auctions')) {
      return MOCK_AUCTIONS as T;
    }
    if (endpoint.includes('/dashboard/stats')) {
      return MOCK_STATS as T;
    }
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (email: string, password: string, role: string) =>
    apiRequest<{ token: string; user_id: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),
};

// Users API
export const usersAPI = {
  getUser: (userId: string) =>
    apiRequest<any>(`/users/${userId}`),
  
  updateProfile: (userId: string, data: any) =>
    apiRequest<any>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Artworks API
export const artworksAPI = {
  getAll: async (page = 1, limit = 20) => {
    try {
      return await apiRequest<{ artworks: any[]; total: number }>(
        `/artworks?page=${page}&limit=${limit}`
      );
    } catch (error) {
      console.warn('Using mock artworks:', error);
      return { artworks: MOCK_ARTWORKS, total: MOCK_ARTWORKS.length };
    }
  },
  
  getById: (id: string) =>
    apiRequest<any>(`/artworks/${id}`),
  
  create: (data: any) =>
    apiRequest<any>('/artworks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/artworks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Auctions API
export const auctionsAPI = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<{ auctions: any[]; total: number }>(
      `/auctions?page=${page}&limit=${limit}`
    ),
  
  getById: (id: string) =>
    apiRequest<any>(`/auctions/${id}`),
  
  create: (data: any) =>
    apiRequest<any>('/auctions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  placeBid: (auctionId: string, amount: number) =>
    apiRequest<any>(`/auctions/${auctionId}/bid`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  
  getActive: async () => {
    try {
      return await apiRequest<any[]>('/auctions/active');
    } catch (error) {
      console.warn('Using mock auctions:', error);
      return MOCK_AUCTIONS;
    }
  },
};

// Wallets API
export const walletsAPI = {
  getWallet: (userId: string) =>
    apiRequest<any>(`/wallets/${userId}`),
  
  getTransactions: (walletId: string, page = 1, limit = 20) =>
    apiRequest<{ transactions: any[]; total: number }>(
      `/wallets/${walletId}/transactions?page=${page}&limit=${limit}`
    ),
  
  deposit: (walletId: string, amount: number) =>
    apiRequest<any>(`/wallets/${walletId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  
  withdraw: (walletId: string, amount: number) =>
    apiRequest<any>(`/wallets/${walletId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

// Streams API
export const streamsAPI = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<{ streams: any[]; total: number }>(
      `/streams?page=${page}&limit=${limit}`
    ),
  
  getById: (id: string) =>
    apiRequest<any>(`/streams/${id}`),
  
  create: (data: any) =>
    apiRequest<any>('/streams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getComments: (streamId: string) =>
    apiRequest<any[]>(`/streams/${streamId}/comments`),
  
  addComment: (streamId: string, content: string) =>
    apiRequest<any>(`/streams/${streamId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Clubs API
export const clubsAPI = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<{ clubs: any[]; total: number }>(
      `/clubs?page=${page}&limit=${limit}`
    ),
  
  getById: (id: string) =>
    apiRequest<any>(`/clubs/${id}`),
  
  create: (data: any) =>
    apiRequest<any>('/clubs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getMembers: (clubId: string) =>
    apiRequest<any[]>(`/clubs/${clubId}/members`),
  
  joinClub: (clubId: string) =>
    apiRequest<any>(`/clubs/${clubId}/join`, {
      method: 'POST',
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (userId: string) => {
    try {
      return await apiRequest<any>(`/dashboard/stats?user_id=${userId}`);
    } catch (error) {
      console.warn('Using mock stats:', error);
      return MOCK_STATS;
    }
  },
  
  getRecentArtworks: async (limit = 10) => {
    try {
      return await apiRequest<any[]>(`/dashboard/recent-artworks?limit=${limit}`);
    } catch (error) {
      console.warn('Using mock recent artworks:', error);
      return MOCK_ARTWORKS;
    }
  },
  
  getActiveAuctions: async (limit = 10) => {
    try {
      return await apiRequest<any[]>(`/dashboard/active-auctions?limit=${limit}`);
    } catch (error) {
      console.warn('Using mock active auctions:', error);
      return MOCK_AUCTIONS;
    }
  },
  
  getUpcomingStreams: (limit = 5) =>
    apiRequest<any[]>(`/dashboard/upcoming-streams?limit=${limit}`),
};

// ML Pricing API
export const pricingAPI = {
  evaluateArtwork: (artworkId: string) =>
    apiRequest<any>(`/ml/evaluate/${artworkId}`, {
      method: 'POST',
    }),
  
  getPriceHistory: (artworkId: string) =>
    apiRequest<any[]>(`/ml/price-history/${artworkId}`),
};

// Consultants API
export const consultantsAPI = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<{ consultants: any[]; total: number }>(
      `/consultants?page=${page}&limit=${limit}`
    ),
  
  getById: (id: string) =>
    apiRequest<any>(`/consultants/${id}`),
  
  grantPermission: (consultantId: string, permission: string) =>
    apiRequest<any>(`/consultants/${consultantId}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ permission }),
    }),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (userId: string) =>
    apiRequest<any[]>(`/notifications?user_id=${userId}`),
  
  updatePreferences: (userId: string, preferences: any) =>
    apiRequest<any>(`/notifications/preferences`, {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, ...preferences }),
    }),
};


// Unified API object for backward compatibility
export const api = {
  get: async <T = any>(endpoint: string) => apiRequest<T>(endpoint),
  post: async <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: async <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: async <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
    }),
};
