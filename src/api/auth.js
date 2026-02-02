import api from "./axios";
//SINGUP
export const signUp=async(data)=>{
  const res =await api.post("/auth/users/",data);
  return res.data;
}

// LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/auth/jwt/create/", data);
  return res.data;
};

// PROFILE
export const fetchProfile = async () => {
  const res = await api.get("/auth/users/me/");
  return res.data;
};

