// Mock client to prevent errors
export const base44 = {
  entities: {
    Property: {
      list: async (_order?: string, _limit?: number) => [] as any[],
      get: async (_id: string) => ({} as any),
      filter: async (_filters: Record<string, unknown>) => [] as any[],
    },
    Partner: {
      list: async () => [] as any[],
      filter: async (_filters: Record<string, unknown>) => [] as any[],
    },
    Settings: {
      get: async () => ({} as any),
    },
  },
  auth: {
    getUser: async () => null,
  },
};
