import axios from "axios";

const BASE_URLS = {
  dotnet: "http://localhost",
};

// Hàm refresh token
const refreshToken = async () => {
  const response = await axios.post(
    `${BASE_URLS.dotnet}/api/authen/refreshToken`,
    {
      token: localStorage.getItem("token"),
    },
  );
  const newToken = response.data.token;
  localStorage.setItem("token", newToken);
  return newToken;
};

// Tạo instance axios với interceptor
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        // Thử lại yêu cầu ban đầu với token mới
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        // Nếu refresh thất bại, đăng xuất người dùng
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

const request = async (source, endpoint, options = {}) => {
  const baseUrl = BASE_URLS[source];
  const response = await axiosInstance({
    url: `${baseUrl}${endpoint}`,
    withCredentials: true,
    ...options,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  return await request("dotnet", "/api/authen/login", {
    method: "POST",
    data: { email, password },
  });
};

export const registerUser = async (userData) => {
  return await request("dotnet", "/api/authen/register", {
    method: "POST",
    data: userData,
  });
};

// Tạo PersonalFlashcardList
export const createPersonalFlashcardList = async (listName) => {
  console.log("startting...")
  return await request("dotnet", "/api/personal-flashcard", {
    method: "POST",
    data: { listName },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Lấy danh sách PersonalFlashcardList
export const getPersonalFlashcardLists = async () => {
  return await request("dotnet", "/api/personal-flashcard", {
    method: "GET",
  });
};

// Xóa PersonalFlashcardList
export const deletePersonalFlashcardList = async (listId) => {
  return await request("dotnet", `/api/personal-flashcard/${listId}`, {
    method: "DELETE",
  });
};

// Lấy danh sách flashcard
export const getFlashcards = async (listId) => {
  return await request("dotnet", `/api/flashcards/all/${listId}`, {
    method: "GET",
  });
};

// Lấy chi tiết flashcard
export const getFlashcard = async (flashcardId) => {
  return await request("dotnet", `/api/flashcards/${flashcardId}`, {
    method: "GET",
  });
};

// Thêm flashcard
export const addFlashcard = async (flashcardData) => {
  const formData = new FormData();
  formData.append("JapaneseWord", flashcardData.japaneseWord);
  formData.append("Romaji", flashcardData.romaji);
  formData.append("VietnameseMeaning", flashcardData.vietnameseMeaning);
  formData.append("ExampleSentence", flashcardData.exampleSentence);
  formData.append("PublicImageId", flashcardData.publicImageId || "");
  if (flashcardData.imageFile) {
    formData.append("ImageFile", flashcardData.imageFile);
  }
  formData.append("listId", flashcardData.listId || "");

  return await request("dotnet", "/api/flashcards", {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Cập nhật flashcard
export const updateFlashcard = async (flashcardId, flashcardData) => {
  return await request("dotnet", `/api/flashcards/${flashcardId}`, {
    method: "PUT",
    data: {
      JapaneseWord: flashcardData.japaneseWord,
      Romaji: flashcardData.romaji,
      VietnameseMeaning: flashcardData.vietnameseMeaning,
      ExampleSentence: flashcardData.exampleSentence,
      PublicImageId: flashcardData.publicImageId || "",
    },
  });
};

// Xóa flashcard
export const deleteFlashcard = async (flashcardId) => {
  return await request("dotnet", `/api/flashcards/${flashcardId}`, {
    method: "DELETE",
  });
};