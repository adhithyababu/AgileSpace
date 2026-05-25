import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // 👈 ഇമ്പോർട്ട് ഒരൊറ്റ വരിയിൽ ഒതുക്കി

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard'); 
            } else {
                setError('Invalid Credentials');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-3xl font-bold text-center mb-2 text-indigo-400">AgileSpace</h2>
                <p className="text-center text-slate-400 mb-6">Log in to manage your projects</p>
                
                {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg transition duration-200 mt-2 shadow-md shadow-indigo-600/20">Sign In</button>
                </form>

                {/* 👈 ലിങ്ക് വരേണ്ടത് ദാ ഇവിടെയാണ്, ഫോമിന് തൊട്ടുതാഴെ */}
                <p className="text-sm text-center text-slate-400 mt-4">
                    Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;