import axios from "axios";

// Өзгертілген жер: Vercel-дегі айнымалыны қолданады, болмаса localhost-қа жүгінеді
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "http://localhost:5000/api";

const CURRENT_USER_KEY = "qkz_current";
const PROFILE_OVERRIDES_KEY = "qkz_profile_overrides";
const TEACHER_PLAN_IDS = ["teacher-pro", "school-business"];

export const getUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`);
    return res.data;
  } catch (err) {
    console.error("Failed to load users:", err);
    return [];
  }
};

export const saveUsers = async (user) => {
  try {
    return await axios.post(`${API_URL}/users`, user);
  } catch (err) {
    console.error("Failed to save user:", err);
  }
};

const getProfileOverrides = () => JSON.parse(localStorage.getItem(PROFILE_OVERRIDES_KEY) || "{}");

export const applyUserProfileOverride = (user) => {
  if (!user?.email) {
    return user;
  }

  const overrides = getProfileOverrides();
  const userOverride = overrides[user.email];

  if (!userOverride) {
    return user;
  }

  return {
    ...user,
    ...userOverride,
    previousNames: Array.isArray(userOverride.previousNames) ? userOverride.previousNames : [],
  };
};

export const getCurrentUser = () => {
  const storedUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  return applyUserProfileOverride(storedUser);
};

export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(applyUserProfileOverride(user)));
};

export const clearCurrentUser = () => localStorage.removeItem(CURRENT_USER_KEY);

export const hasTeacherAccess = (user) => {
  if (!user) {
    return false;
  }

  if (user.role === "teacher") {
    return true;
  }

  return TEACHER_PLAN_IDS.includes(user.currentPlanId) && user.planStatus === "Active";
};

export const saveUserProfile = (user, updates) => {
  if (!user?.email) {
    return user;
  }

  const overrides = getProfileOverrides();
  const currentOverride = overrides[user.email] || {};
  const previousNames = new Set([
    ...(Array.isArray(currentOverride.previousNames) ? currentOverride.previousNames : []),
    ...(Array.isArray(user.previousNames) ? user.previousNames : []),
  ]);

  if (user.name && updates.name && user.name !== updates.name) {
    previousNames.add(user.name);
  }

  const nextUser = {
    ...user,
    ...updates,
    previousNames: Array.from(previousNames).filter(Boolean),
  };

  overrides[user.email] = {
    ...currentOverride,
    ...updates,
    name: nextUser.name,
    avatar: nextUser.avatar || "",
    previousNames: nextUser.previousNames,
  };

  localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(overrides));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));

  return nextUser;
};

export const getQuizzes = async () => {
  try {
    const res = await axios.get(`${API_URL}/quizzes`);
    return res.data;
  } catch (err) {
    console.error("Failed to load quizzes:", err);
    return [];
  }
};

export const saveQuizzes = async (quiz) => {
  try {
    return await axios.post(`${API_URL}/quizzes`, quiz);
  } catch (err) {
    console.error("Failed to save quiz:", err);
  }
};

export const getResults = async () => {
  try {
    const res = await axios.get(`${API_URL}/results`);
    return res.data;
  } catch (err) {
    console.error("Failed to load results:", err);
    return [];
  }
};

export const saveResults = async (result) => {
  try {
    return await axios.post(`${API_URL}/results`, result);
  } catch (err) {
    console.error("Failed to save result:", err);
  }
};