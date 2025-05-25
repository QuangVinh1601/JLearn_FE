import axios from "axios";

const BASE_URLS = {
  dotnet: "https://japstudy.id.vn",
  python: "https://japstudy.id.vn",
  // dotnet: "http://34.44.254.240:8080",
  // python: "http://127.0.0.1:5000",
  // python: "http://34.44.254.240:5000",
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
    withCredentials: true,
    ...options,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await request("dotnet", "/api/authen/login", {
    method: "POST",
    data: { email, password },
  });
  console.log("Raw API response from loginUser:", response);
  const refreshToken = 
    response.refreshToken || 
    response.refreshtoken || 
    response.refresh_token ||
    response.RefreshToken ||
    response.Refreshtoken ||
    response.data?.refreshToken || 
    response.data?.refreshtoken ||
    response.data?.refresh_token ||
    null;
  
  console.log(refreshToken);
  // Ưu tiên kiểm tra email trước khi gán role từ API
  let role;
  if (email === "admin@gmail.com") {
    role = "admin";
  } else {
    role =
      response.role ||
      response.userRole ||
      response.data?.role ||
      response.data?.userRole ||
      "user";
  }

  // Chuẩn hóa role từ API nếu cần
  if (typeof role === "number") {
    role = role === 1 ? "admin" : "user";
  } else if (role) {
    role = role.toLowerCase();
  }

  const userID = 
    response.userID || 
    response.userId || 
    response.user_id || 
    response.data?.userID || 
    response.data?.userId || 
    response.data?.user_id || 
    null;

  if (!refreshToken) {
    throw new Error("No token received from API");
  }
  console.log("12344");
  return { refreshToken, role, userID };
};

export const logoutUser = async () => {
  try {
    return await request("dotnet", "/api/authen/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  return await request("dotnet", "/api/authen/register", {
    method: "POST",
    data: userData,
  });
};

export const createPersonalFlashcardList = async (listName, description) => {
  console.log("Starting createPersonalFlashcardList...");
  const response = await request("dotnet", "/api/personal-flashcard", {
    method: "POST",
    data: { listName, description },
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
      description: newList.description || newList.Description || "",
      flashcardItemGuests: newList.FlashcardItemGuests,
    };
  }
  return null;
};

export const getFlashcards = async (listId) => {
  try {
    console.log(`Fetching flashcards for list ID: ${listId}`);

    const response = await request("dotnet", `/api/flashcards/all/${listId}`, {
      method: "GET",
    });

    console.log("Raw response from getFlashcards:", response);

    // Check if response has data property and it's an array
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map((item) => ({
        id: item.flashcardID,
        word: item.japaneseWord,
        meaning: item.vietnameseMeaning,
        romaji: item.romaji || "",
        exampleSentence: item.exampleSentence || "",
        imageUrl: item.urlImageExample || "",
        publicImageId: item.publicImageId || "",
        personalListID: item.personalListID,
      }));
    }
    // If response itself is an array
    else if (Array.isArray(response)) {
      return response.map((item) => ({
        id: item.flashcardID,
        word: item.japaneseWord,
        meaning: item.vietnameseMeaning,
        romaji: item.romaji || "",
        exampleSentence: item.exampleSentence || "",
        imageUrl: item.urlImageExample || "",
        publicImageId: item.publicImageId || "",
        personalListID: item.personalListID,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error in getFlashcards:", error);
    return [];
  }
};

export const getPersonalFlashcardLists = async () => {
  const response = await request("dotnet", "/api/personal-flashcard/user", {
    method: "GET",
  });

  console.log("Raw response from getPersonalFlashcardLists:", response);

  // Check if response has data property and it's an array
  if (response && response.data && Array.isArray(response.data)) {
    return response.data.map((item) => ({
      listId: item.listID,
      listName: item.listName,
      description: item.description || "",
      flashcards: item.flashcards,
      createdAt: item.createdAt
    }));
  }
  // If response itself is an array (fallback)
  else if (Array.isArray(response)) {
    return response.map((item) => ({
      listId: item.listID,
      listName: item.listName || item.ListName,
      description: item.description || item.Description || "",
      flashcards: item.flashcards,
      createdAt: item.createdAt
    }));
  }

  return [];
};

export const deletePersonalFlashcardList = async (listId) => {
  return await request("dotnet", `/api/personal-flashcard/${listId}`, {
    method: "DELETE",
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
  const listId = flashcardData.listId;

  return await request("dotnet", `/api/flashcards?listId=${listId}`, {
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

// Tạo ZaloPay order
export const createZaloPayOrder = async (amount, description, userId, collectionId) => {
  return await request("python", "/api/ml/create_order", { // Updated to use Python backend
    method: "POST",
    data: {
      amount,
      description,
      user_id: userId,
      collection_id: collectionId,
    },
  });
};

// Lấy trạng thái ZaloPay order
export const getZaloPayOrderStatus = async (apptransid) => {
  return await request("python", "/api/ml/api/ml/order_status", {
    
    method: "GET",
    params: { apptransid },
  });
};

// Transcribe audio
export const transcribeAudio = async (audioFile, additionalText) => {
  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("additional_text", additionalText);

  return await request("python", "/api/ml/transcribe", {
    method: "POST",
    data: formData,
    headers: {
      // "Content-Type": "multipart/form-data",
      "Accept": "application/json",
    },
  });
};

// Lấy danh sách collection ID
export const getCollections = async (userId) => {
  return await request("dotnet", "/api/get_collections", {
    // Using Python backend
    method: "GET",
    params: { user_id: userId },
  });
};

export const getAdminMetrics = async () => {
  return await request("dotnet", "/api/admin/metrics", {
    method: "GET",
    withCredentials: true,
  });
};

// export const getAdminUsers = async () => {
//   return await request("python", "/admin/users", {
//     method: "GET",
//     withCredentials: true,
//   });
// };

// export const getAdminTransactions = async () => {
//   return await request("python", "/admin/transactions", {
//     method: "GET",
//     withCredentials: true,
//   });
// };

