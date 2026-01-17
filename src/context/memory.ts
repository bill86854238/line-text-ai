// Simple in-memory storage for context.
// Note: Resets on Cloud Functions restart/cold start.
const memoryStore = new Map<string, string[]>();
const providerStore = new Map<string, string>();

// Strict limit as per requirements
const LIMIT = 5;

export const memory = {
  addMessage: (userId: string, message: string) => {
    let currentHistory = memoryStore.get(userId) || [];
    currentHistory.push(message);

    // Keep only the last N messages
    if (currentHistory.length > LIMIT) {
      currentHistory = currentHistory.slice(-LIMIT);
    }

    memoryStore.set(userId, currentHistory);
  },

  getHistory: (userId: string): string[] => {
    return memoryStore.get(userId) || [];
  },
  
  // Optional: functionality to manually reset if needed in future debugging
  clear: (userId: string) => {
    memoryStore.delete(userId);
    providerStore.delete(userId);
  },

  setProvider: (userId: string, provider: string) => {
    providerStore.set(userId, provider);
  },

  getProvider: (userId: string): string | undefined => {
    return providerStore.get(userId);
  }
};
