import '../styles/Login.css';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Falha ao realizar login. Tente novamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Controle de Estoque</h1>
        <button className="login-button" onClick={handleLogin}>
          Login com Google
        </button>
      </div>
    </div>
  );
};

export default Login;
