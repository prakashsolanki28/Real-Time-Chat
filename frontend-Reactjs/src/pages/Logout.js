import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    // useEffect(() => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    navigate('/');
    // }, []);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
}

export default Logout;
