import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCheckMiddleware({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return children;
}

export default AuthCheckMiddleware;