import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
`;

const AuthButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #4caf50;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #45a049;
  }
`;

const Header = () => {

  return (
    <HeaderContainer>
      <Title>
        <Link to="/">Магазин аксессуаров</Link>
      </Title>
      <AuthButton onClick={() => {window.location.href = 'http://localhost:5174/login'}}>Авторизация</AuthButton>
    </HeaderContainer>
  );
};

export default Header;
