import '../styles/Home.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

type Produto = {
  id: string;
  codigo: string;
  descricao: string;
  preco: number;
  quantidade: number;
};

const Home = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosCollection = collection(db, 'produtos');
        const produtosSnapshot = await getDocs(produtosCollection);
        const produtosData = produtosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Produto[];
        setProdutos(produtosData);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    if (!/^[A-Z]{2}\d{3}-\d{2}$/.test(codigo)) {
      setError('Código inválido. Deve seguir o padrão AA999-99.');
      return;
    }

    if (descricao.length < 5) {
      setError('A descrição deve ter pelo menos 5 caracteres.');
      return;
    }

    if (preco < 0.5) {
      setError('O preço unitário não pode ser inferior a R$ 0,50.');
      return;
    }

    if (quantidade < 0) {
      setError('A quantidade em estoque não pode ser negativa.');
      return;
    }

    setError(''); // Limpar o erro caso as validações passem

    // Adicionar produto no Firestore
    try {
      const produtoRef = collection(db, 'produtos');
      await addDoc(produtoRef, {
        codigo,
        descricao,
        preco,
        quantidade,
      });

      // Atualizar lista de produtos
      setProdutos([
        ...produtos,
        { id: Date.now().toString(), codigo, descricao, preco, quantidade },
      ]);

      // Limpar os campos do formulário
      setCodigo('');
      setDescricao('');
      setPreco(0);
      setQuantidade(0);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

const formatarCodigo = (e: React.ChangeEvent<HTMLInputElement>) => {
  let valor = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Permite apenas letras (A-Z) e números (0-9)
  
  // Restringir as duas primeiras posições a serem letras (A-Z) e as próximas aos números (0-9)
  if (valor.length > 2) {
    valor = valor.substring(0, 2) + valor.substring(2).replace(/\D/g, ''); // A partir do 3º caractere, apenas números
  }

  // Formatar o valor para o padrão "AA999-99"
  if (valor.length > 5) {
    valor = valor.substring(0, 5) + '-' + valor.substring(5, 7); // Adiciona o hífen após o 5º caractere
  }

  setCodigo(valor); // Atualiza o valor no estado
};


  return (
    <div>
      <header className="home-header">
        <h1>Controle de Estoque</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main className="home-container">
        <h2 className="home-title">Produtos em Estoque</h2>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit}>
          <h3>Cadastro de Produto</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <label>Código:</label>
            <input
              type="text"
              value={codigo}
              onChange={formatarCodigo} // Chama a função para formatar o código
              placeholder="AA999-99"
              required
            />
          </div>
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do produto"
              required
            />
          </div>
          <div>
            <label>Preço Unitário:</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(parseFloat(e.target.value))}
              placeholder="Preço"
              required
            />
          </div>
          <div>
            <label>Quantidade em Estoque:</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              placeholder="Quantidade"
              required
              min="0"
            />
          </div>
          <button type="submit">Cadastrar Produto</button>
        </form>

        {/* Lista de Produtos */}
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              <strong>Código:</strong> {produto.codigo} | 
              <strong> Descrição:</strong> {produto.descricao} | 
              <strong> Preço:</strong> R$ {produto.preco.toFixed(2)} | 
              <strong> Quantidade:</strong> {produto.quantidade}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
