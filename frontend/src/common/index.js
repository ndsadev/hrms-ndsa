const backendDomain = "http://localhost:5000";

const SummaryApi = {

  // LOGIN
  signIn: {
    url: `${backendDomain}/api/auth/login`,
    method: "post",
  },

  // LOGOUT
  logout: {
    url: `${backendDomain}/api/auth/logout`,
    method: "post",
  },

  // CREATE USER (PROTECTED)
  createUser: {
    url: `${backendDomain}/api/auth/create-user`,
    method: "post",
  },

  // REFRESH TOKEN
  refreshToken: {
    url: `${backendDomain}/api/auth/refresh-token`,
    method: "post",
  },

  // USER PROFILE
  getUserDetails: {
    url: `${backendDomain}/api/auth/me`,
    method: "get",
  },

   // ALL USERS (SUPER ADMIN)
  getAllUsers: {
    url: `${backendDomain}/api/auth/all-users`,
    method: "get",
  },

    // UPDATE USER ROLE / DESIGNATION
  updateUser: {
    url: (userId) =>
      `${backendDomain}/api/auth/update-user/${userId}`,
    method: "put",
  },

  // DELETE USER
  deleteUser: {
    url: (userId) =>
      `${backendDomain}/api/auth/delete-user/${userId}`,
    method: "delete",
  },
};

export default SummaryApi;
