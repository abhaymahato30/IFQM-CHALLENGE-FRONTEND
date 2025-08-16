import axios from "axios";

const USER_ABSOLUTE_URL_KEY = "user_absolute_url";
const TEST_FIREBASE_UID_KEY = "test_firebase_uid";

// -------------------------
// Local Storage Utilities
// -------------------------
const getUserAbsoluteUrl = () => {
  return localStorage.getItem(USER_ABSOLUTE_URL_KEY) || null;
};

const setUserAbsoluteUrl = (url: string) => {
  localStorage.setItem(USER_ABSOLUTE_URL_KEY, url);
};

const clearUserAbsoluteUrl = () => {
  localStorage.removeItem(USER_ABSOLUTE_URL_KEY);
};

const getCurrentUserFirebaseUid = () => {
  return localStorage.getItem(TEST_FIREBASE_UID_KEY) || null;
};

const setCurrentUserFirebaseUid = (uid: string) => {
  localStorage.setItem(TEST_FIREBASE_UID_KEY, uid);
};

const clearCurrentUserFirebaseUid = () => {
  localStorage.removeItem(TEST_FIREBASE_UID_KEY);
};

// -------------------------
// API Calls
// -------------------------
const getUserByMongoId = async () => {
  const url = getUserAbsoluteUrl();
  if (!url) throw new Error("No absolute URL set for user");
  const res = await axios.get(url);
  return res.data;
};

const getUserByAbsoluteUrl = async () => {
  const url = getUserAbsoluteUrl();
  if (!url) throw new Error("No absolute URL set for user");
  const res = await axios.get(url);
  return res.data;
};

const getUserByFirebaseUid = async (idToken: string) => {
  const res = await axios.get("http://localhost:5000/api/users/profile", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.data;
};

export const userService = {
  // Local storage helpers
  getUserAbsoluteUrl,
  setUserAbsoluteUrl,
  clearUserAbsoluteUrl,
  getCurrentUserFirebaseUid,
  setCurrentUserFirebaseUid,
  clearCurrentUserFirebaseUid,

  // API functions
  getUserByMongoId,
  getUserByFirebaseUid,
  getUserByAbsoluteUrl, // ✅ added so no missing function error
};
