import api from "./api";

export const eventService = {
  getAllEvents: async () => {
    try {
      const response = await api.get("/events");
      console.log("getAllEvents response:", response.data);

      if (response.data.events && Array.isArray(response.data.events)) {
        return response.data.events;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("getAllEvents error:", error);
      throw error.response?.data || error;
    }
  },

  getEventById: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data.event || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const formData = new FormData();
      formData.append("name", eventData.name || eventData.title || "");
      formData.append("description", eventData.description || "");
      formData.append("date", eventData.date || "");
      formData.append("venue", eventData.venue || "");
      formData.append("category", eventData.category || "");

      if (
        eventData.image &&
        typeof eventData.image === "string" &&
        eventData.image.startsWith("data:")
      ) {
        const blob = await fetch(eventData.image).then((res) => res.blob());
        formData.append("image", blob, "event-image.jpg");
      }

      const response = await api.post("/events", formData);
      return response.data.event || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const formData = new FormData();
      formData.append("name", eventData.name || eventData.title || "");
      formData.append("description", eventData.description || "");
      formData.append("date", eventData.date || "");
      formData.append("venue", eventData.venue || "");
      formData.append("category", eventData.category || "");

      if (
        eventData.image &&
        typeof eventData.image === "string" &&
        eventData.image.startsWith("data:")
      ) {
        const blob = await fetch(eventData.image).then((res) => res.blob());
        formData.append("image", blob, "event-image.jpg");
      }

      const response = await api.put(`/events/${eventId}`, formData);
      return response.data.event || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveEvent: async (eventId) => {
    try {
      try {
        const response = await api.patch(`/events/${eventId}/approve`, {});
        return response.data.event || response.data;
      } catch {
        const response = await api.post(`/events/${eventId}/approve`, {});
        return response.data.event || response.data;
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectEvent: async (eventId) => {
    try {
      try {
        const response = await api.patch(`/events/${eventId}/reject`, {});
        return response.data.event || response.data;
      } catch {
        const response = await api.post(`/events/${eventId}/reject`, {});
        return response.data.event || response.data;
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getEventsByStatus: async (status) => {
    try {
      const url = `/events/status/${status}`;
      const response = await api.get(url);

      if (response.data.events) return response.data.events;
      if (Array.isArray(response.data)) return response.data;
      if (response.data.data) return response.data.data;
      return [];
    } catch {
      try {
        const fallbackUrl = `/events?status=${status}`;
        const response = await api.get(fallbackUrl);

        if (response.data.events) return response.data.events;
        if (Array.isArray(response.data)) return response.data;
        if (response.data.data) return response.data.data;
        return [];
      } catch {
        return [];
      }
    }
  },

  getApprovedEvents: async () => eventService.getEventsByStatus("approved"),

  getPendingEvents: async () => eventService.getEventsByStatus("pending"),
};
