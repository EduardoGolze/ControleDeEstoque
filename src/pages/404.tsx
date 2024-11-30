import '../styles/404.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-text">Página não encontrada.</p>
        <Link to="/" className="notfound-link">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
