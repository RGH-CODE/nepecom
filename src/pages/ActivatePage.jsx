import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useEffect } from 'react';

export default function ActivatePage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const activate = async () => {
            try {
                // activate account
                await api.post("auth/users/activation/", {
                    uid,
                    token,
                });

                // auto login after activation
                const loginRes = await api.post("auth/jwt/create/", {
                    email: localStorage.getItem("pending_email"),
                    password: localStorage.getItem("pending_password"),
                });

                localStorage.setItem("access", loginRes.data.access);
                localStorage.setItem("refresh", loginRes.data.refresh);

                // cleanup
                localStorage.removeItem("pending_email");
                localStorage.removeItem("pending_password");

                navigate("/profile");

            } catch (err) {
                console.log(err.response?.data);
                alert("Activation failed!");
            }
        };

        activate();
    }, [uid, token, navigate]);

    return <p>Activating account...</p>;
}