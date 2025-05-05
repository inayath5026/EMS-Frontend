import { useAuth } from './context/AuthContext';

import "./Login.css";

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="login-container">
      <button onClick={login} className="google-login-btn">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;