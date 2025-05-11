import axios from "axios";

const BASE_URLS = {
  dotnet: "http://34.44.254.240:8080",
};

// Hàm refresh token
const refreshToken = async () => {
  const response = await axios.post(
    `${BASE_URLS.dotnet}/api/authen/refreshToken`,
    {
      token: localStorage.getItem("token"),
    },
    { withCredentials: true },
  );
  const newToken = response.data.token || response.data.accessToken; // Kiểm tra token hoặc accessToken
  localStorage.setItem("token", newToken);
  return newToken;
};

// Tạo instance axios với interceptor
const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
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
    ...options,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await request("dotnet", "/api/authen/login", {
    method: "POST",
    data: { email, password },
  });
  console.log("Raw API response from loginUser:", response); // Thêm log để debug
  // Chuẩn hóa phản hồi
  const token =
    response.token ||
    response.accessToken ||
    response.data?.token ||
    response.data?.accessToken;
  const role =
    response.role ||
    response.userRole ||
    response.data?.role ||
    response.data?.userRole ||
    (email === "admin@gmail.com" ? "admin" : "user");
  if (!token) {
    throw new Error("No token received from API");
  }
  return { token, role };
};

// Các hàm khác không thay đổi
export const registerUser = async (userData) => {
  return await request("dotnet", "/api/authen/register", {
    method: "POST",
    data: userData,
  });
};

export const createPersonalFlashcardList = async (listName) => {
  console.log("Starting createPersonalFlashcardList...");
  const response = await request("dotnet", "/api/personal-flashcard", {
    method: "POST",
    data: { listName },
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("API Response:", response);
  const newList = response && response.length > 0 ? response[0] : null;
  if (newList) {
    return {
      listId: newList.ListID,
      listName: newList.ListName,
      flashcardItemGuests: newList.FlashcardItemGuests,
    };
  }
  return null;
};

export const getPersonalFlashcardLists = async () => {
  const response = await request("dotnet", "/api/personal-flashcard", {
    method: "GET",
  });
  if (Array.isArray(response)) {
    return response.map((item) => ({
      listId: item.ListID,
      listName: item.ListName,
      flashcardItemGuests: item.FlashcardItemGuests,
    }));
  }
  return [];
};

export const deletePersonalFlashcardList = async (listId) => {
  return await request("dotnet", `/api/personal-flashcard/${listId}`, {
    method: "DELETE",
  });
};

export const getFlashcards = async (listId) => {
  return await request("dotnet", `/api/flashcards/all/${listId}`, {
    method: "GET",
  });
};

export const getFlashcard = async (flashcardId) => {
  return await request("dotnet", `/api/flashcards/${flashcardId}`, {
    method: "GET",
  });
};

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

export const deleteFlashcard = async (flashcardId) => {
  return await request("dotnet", `/api/flashcards/${flashcardId}`, {
    method: "DELETE",
  });
};
