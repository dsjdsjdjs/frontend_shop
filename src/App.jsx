import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import Layout from './components/Global/Layout/Layout';
import IndexPage from './components/IndexPage/IndexPage';
import KnifePage from './components/KnifePage/KnifePage';

import './index.css';
import "react-toastify/dist/ReactToastify.css";

import { LoginProvider } from './core/contexts/LoginContext';

const App = () => {
  return (
    <Router>
      <LoginProvider>
        <Layout>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/product/:id" element={<KnifePage />} />
          </Routes>

        </Layout>
      </LoginProvider>
    </Router>
  );
};

export default App;