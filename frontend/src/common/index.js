// const backendDomain = "http://localhost:5000";
const backendDomain = import.meta.env.VITE_BACKEND_URL;

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


  // CREATE / UPDATE PREBOARDING PROFILE (WITH FILES)
  savePreboardingProfile: {
    url: `${backendDomain}/api/hr/preboarding`,
    method: "post",
  },

  // GET PREBOARDING PROFILE (LOGGED-IN USER)
  getPreboardingProfile: {
    url: `${backendDomain}/api/hr/preboarding`,
    method: "get",
  },

  // GET PREBOARDING PROFILE BY USER ID (HR / ADMIN)
  getPreboardingProfileByUser: {
    url: (userId) =>
      `${backendDomain}/api/hr/preboarding/${userId}`,
    method: "get",
  },

  // employeeId | name | status
  getPreboardingList: {
    url: `${backendDomain}/api/hr/preboarding/all`,
    method: "get",
  },

  //  HR VIEW (FULL PROFILE)
  getPreboardingProfileByEmployeeId: {
    url: (employeeId) =>
      `${backendDomain}/api/hr/preboarding/view/${employeeId}`,
    method: "get",
  },

  deletePreboardingProfile: {
    url: (employeeId) =>
      `${backendDomain}/api/hr/preboarding/delete/${employeeId}`,
    method: "delete",
  },

};

export default SummaryApi;
