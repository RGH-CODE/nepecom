import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useEffect } from 'react';

export default function ActivatePage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const activate = async () => {
            try {
                await api.post("auth/users/activation/", {
                    uid,
                    token,
                });

                alert("Account activated successfully!");
                navigate("/login");
               

            } catch (err) {
                console.log(err.response?.data);
                alert("Activation failed!");
            }
        };

        activate();
    }, [uid, token, navigate]);

    return <p>Activating account...</p>;
}