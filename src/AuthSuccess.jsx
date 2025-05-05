import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AuthSuccess = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const user = await checkAuth();
        if (user) {
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };
    
    authenticate();
  }, [checkAuth, navigate]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;