import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveData } from '../api/Index';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [apierror, setApiError] = useState();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value, });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.values(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            saveData(formData, '/login')
                .then((response) => {
                    // Handle success
                    console.log('Login successful', response.data.token);
                    sessionStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('token', response.data.token);
                    navigate('/home');
                })
                .catch((error) => {
                    // Handle error
                    setApiError("Invalid Email & Password!")
                    console.error('Login failed', error);
                });
        }
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Invalid email format';
        }
        if (!data.password) {
            errors.password = 'Password is required';
        }
        return errors;
    };

    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    return (
        <div className='w-100 d-flex align-items-center' style={{ height: "100vh" }}>
            <div className='card m-auto w-25' style={{ width: "fit-content" }}>
                <div className='card-header'>
                    <h5>Messanger</h5>
                </div>
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">Email</label>
                            <input type="text" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={handleChange} placeholder="Email" />
                            {errors.email && <span className="invalid-feedback">{errors.email}</span>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={formData.password} onChange={handleChange} placeholder="Password" />
                            {errors.password && <span className="invalid-feedback">{errors.password}</span>}
                        </div>
                        {apierror && <span className='text-danger'>{apierror}</span>}
                        <div className="mt-2 mb-2">
                            <button className='btn btn-primary'>Login</button>
                        </div>
                        <span>create account? <Link to="/register">Register</Link></span><br />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login