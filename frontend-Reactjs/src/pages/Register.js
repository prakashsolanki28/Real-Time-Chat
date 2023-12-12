import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveData } from '../api/Index';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

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
            saveData(formData, '/register')
                .then((response) => {
                    console.log('Registration successful', response.data);
                    navigate('/login');
                })
                .catch((error) => {
                    // Handle error
                    console.error('Registration failed', error);
                });
        }
    }

    const validateForm = (data) => {
        const errors = {};
        if (!data.name) {
            errors.name = 'Name is required';
        }
        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Invalid email format';
        }
        if (!data.password) {
            errors.password = 'Password is required';
        }
        else if(data.password.length <= 6){
            errors.password = 'Password must be 6 and more char';
        }

        if (!data.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } 
        else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
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
                            <label className="form-label">Name</label>
                            <input type="text" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="" value={formData.name} onChange={handleChange} />
                            {errors.name && <span className="invalid-feedback">{errors.name}</span>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Email</label>
                            <input type="text" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="invalid-feedback">{errors.email}</span>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={formData.password} onChange={handleChange} placeholder="" />
                            {errors.password && <span className="invalid-feedback">{errors.password}</span>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" name="confirmPassword" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} value={formData.confirmPassword} onChange={handleChange} placeholder="" />
                            {errors.confirmPassword && <span className="invalid-feedback">{errors.confirmPassword}</span>}
                        </div>
                        <div className="mt-2 mb-2">
                            <button className='btn btn-primary'>Register</button>
                        </div>
                        <span>already have a account? <Link to="/login">Login</Link></span>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register