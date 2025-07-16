import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token and redirect
      localStorage.setItem('token', token);
      
      // Decode token to get user info (simple decode, not verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        login(token, { id: payload.id, role: payload.role });
        
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing OAuth token:', error);
        toast.error('Authentication error. Please try again.');
        navigate('/login');
      }
    } else {
      toast.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Completing authentication...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we log you in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;
