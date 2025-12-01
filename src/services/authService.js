import { loginApi, signupApi } from "../api/authApi";

async function loginWithCredentials(userId, password) {
  return loginApi({ userId, password });
}

function logout() {
  localStorage.removeItem("moa_user");
}

async function signup(data) {
  return signupApi(data);
}

const authService = {
  loginWithCredentials,
  logout,
  signup,
};

export default authService;
