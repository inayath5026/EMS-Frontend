import { useAuth } from '../auth/AuthContext';

export const Login = () => {
  const { login } = useAuth();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
};

export default Login;