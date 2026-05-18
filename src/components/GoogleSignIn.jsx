import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function GoogleSignIn() {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await api.post(
            "auth/google/",
            {
              token: credentialResponse.credential,
            }
          );

          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);

          navigate("/profile");

        } catch (err) {
          console.log(err);
          alert("Google login failed");
        }
      }}
      onError={() => {
        alert("Login Failed");
      }}
    />
  );
}