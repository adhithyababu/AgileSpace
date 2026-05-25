import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
            if (res.data.success) {
                setSuccess('Registration Successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-3xl font-bold text-center mb-2 text-indigo-400">AgileSpace</h2>
                <p className="text-center text-slate-400 mb-6">Create a new account to get started</p>
                
                {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 p-3 rounded mb-4 text-sm">{success}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg transition duration-200 mt-2 shadow-md shadow-indigo-600/20">Sign Up</button>
                </form>

                <p className="text-sm text-center text-slate-400 mt-4">
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;