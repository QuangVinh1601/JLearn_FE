import axios from "axios";

// Kiểu dữ liệu trả về từ các API (bạn có thể chỉnh lại theo response thực tế)
interface ApiResponse<T = any> {
  data: T;
}

// Hàm đăng ký
export const register = async (
  fullName: string,
  userName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(
      "https://localhost:7230/api/Login/register/user",
      {
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error registering:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Hàm đăng nhập
export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(
      "https://localhost:7230/api/Login/login",
      {
        email,
        password,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error logging in:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Hàm gửi tin nhắn
export const sendMessage = async (
  message: string,
  chatId: string,
  chatCode: string,
): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(
      "http://127.0.0.1:5000/send_message",
      {
        message,
        chatId,
        chatCode,
      },
    );
    console.log("Message sent:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Hàm thêm cuộc trò chuyện đang chờ
export const addPendingConversation = async (
  status: string,
  user_Id: string,
  fullName: string,
): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(
      "http://127.0.0.1:5000/add_pending_conversation",
      {
        status,
        user_Id,
        fullName,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding pending conversation:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Hàm thêm tin nhắn
export const addMessage = async (
  conversationId: string,
  message: string,
  sender: string,
  receiverId: string,
): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(
      "http://127.0.0.1:5000/add_message",
      {
        conversationId,
        message,
        sender,
        receiverId,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding message:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Get tổng số người dùng
export const getUserCount = async (): Promise<any> => {
  try {
    const response = await axios.get<ApiResponse>(
      "http://localhost:5000/user-count",
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error getting user count:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Get số người dùng mới trong n ngày
export const getNewUserCount = async (days: number): Promise<any> => {
  try {
    const response = await axios.get<ApiResponse>(
      "http://localhost:5000/new-user-count",
      {
        params: { days },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error getting new user count:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Get số lần click quảng cáo
export const get_AD_Click = async (): Promise<any> => {
  try {
    const response = await axios.get<ApiResponse>(
      "http://localhost:5000/get-ad-click",
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error getting AD_Click:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Set AD_Click
export const AD_Click = async (): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:5000/set-ad-click",
      {},
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error setting AD_Click:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Get số lượng visitor
export const getVisitor = async (): Promise<any> => {
  try {
    const response = await axios.get<ApiResponse>(
      "http://127.0.0.1:5000/visitor-count",
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error getting visitor count:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
