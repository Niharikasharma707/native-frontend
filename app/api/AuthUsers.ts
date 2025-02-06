export const AuthService = {
  async fetchUsers() {
    try {
      const response = await fetch("http://localhost:3000/auth/users");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json(); // Parse JSON manually
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};
