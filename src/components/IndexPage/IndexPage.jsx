import { useNavigate } from "react-router-dom";
import config from "../../config";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  PageContainer,
  SearchContainer,
  SearchInput,
  KnivesGrid,
  KnifeCard,
  KnifeImage,
  KnifeTitle,
  KnifePrice,
  Pagination,
  PageButton,
  KnifeDescription,
} from "./IndexPage.styled";

import Header from "../Global/Header";

const IndexPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [knives, setKnives] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate(); // для редиректа

  useEffect(() => {
    const fetchKnives = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.backendUrl}/Accessory/all`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );
        setKnives(response.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch knife data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnives();
  }, [currentPage, search]); // Trigger when currentPage or search changes

  const handleCardClick = (id) => {
    navigate(`/product/${id}`); // Редирект на страницу ножа
  };

  return (
    <PageContainer>
      <Header />

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Поиск товаров"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchContainer>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <KnivesGrid>
          {knives.map((knife) => (
            <KnifeCard key={knife.id} onClick={() => handleCardClick(knife.id)}>
              <KnifeImage
                src={`${knife.photoBase64}`}
                alt={knife.name}
              />
              <KnifeTitle>{knife.name}</KnifeTitle>
              <KnifePrice>{knife.price} UAH</KnifePrice>
              <KnifeDescription>{knife.description}</KnifeDescription>
            </KnifeCard>
          ))}
        </KnivesGrid>
      )}

      <Pagination>
        <PageButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Назад
        </PageButton>

        <span style={{ marginTop: "6px" }}>
          {currentPage} / 1{totalPages}
        </span>

        <PageButton
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Вперед
        </PageButton>
      </Pagination>
    </PageContainer>
  );
};

export default IndexPage;
