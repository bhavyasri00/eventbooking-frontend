import api from "./api";

export const checkInService = {
  getEventCheckIns: async (eventId) => {
    try {
      const response = await api.get(`/checkin/event/${eventId}`);
      return response.data.checkIns || response.data;
    } catch (error) {
      console.error("❌ Failed to fetch check-ins:", error);
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to load check-ins",
      };
    }
  },

  createCheckIn: async (bookingId) => {
    try {
      const response = await api.post("/checkin", { bookingId });
      return response.data.checkIn;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  scanTicket: async (ticketId, eventId) => {
    try {
      console.log("🔍 Scanning ticket:", ticketId);
      const response = await api.post(`/checkin/scan`, { ticketId, eventId });
      return response.data;
    } catch (error) {
      console.error("❌ Ticket scan failed:", error);
      throw error.response?.data || error;
    }
  },
};

// Backward compatibility alias
export const checkinService = checkInService;
