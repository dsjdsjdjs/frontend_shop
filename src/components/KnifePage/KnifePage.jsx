import styled from "styled-components";
import config from "../../config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../Global/Header";

const PageContainer = styled.div`
  padding: 2rem;
  background-color: #121824;
  color: #ffffff;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const KnifeInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const ImagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  img {
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    object-fit: cover;
  }
`;

const InfoContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  font-size: 1.2rem;

  span {
    font-weight: bold;
    color: #4caf50;
  }
`;

const ReviewsContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #1e293b;
  border-radius: 12px;
`;

const ReviewItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #334155;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewText = styled.p`
  font-size: 1rem;
  color: #ffffff;
`;

const ReviewDate = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const ReviewTonality = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  display: inline-block;
  color: #ffffff;
  background-color: ${({ tone }) =>
    tone === "Positive" ? "#4caf50" : tone === "Negative" ? "#f44336" : "#ff9800"};
`;

const translateTonality = (tonality) => {
  switch (tonality) {
    case "Positive":
      return "Позитивный";
    case "Negative":
      return "Негативный";
    case "Neutral":
      return "Нейтральный";
    case null:
      return "Не определен";
    default:
      return tonality;
  }
};

const KnifePage = () => {
  const { id } = useParams();
  const [knife, setKnife] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchKnife = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.backendUrl}/Accessory/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setKnife(response.data);
      } catch (error) {
        console.error("Не вдалося завантажити деталі ножа:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/Review/all`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const filteredReviews = response.data.filter(review => review.accessoryId === parseInt(id));
        setReviews(filteredReviews);
      } catch (error) {
        console.error("Не вдалося завантажити відгуки:", error);
      }
    };

    fetchKnife();
    fetchReviews();
  }, [id]);

  if (loading) {
    return <PageContainer>Загрузка...</PageContainer>;
  }

  if (!knife) {
    return <PageContainer>Информация про нож не найдена.</PageContainer>;
  }

  return (
    <PageContainer>
      <Header />
      <Title>{knife.name}</Title>
      <KnifeInfoContainer>
        <ImagesContainer>
          <img src={`${knife.photoBase64}`} alt={`Зображення ножа`} />
        </ImagesContainer>
        <InfoContainer>
          <InfoRow>
            <span>Цена:</span> {knife.price} UAH
          </InfoRow>
          <InfoRow>
            <span>Описание:</span> {knife.description}
          </InfoRow>
        </InfoContainer>
      </KnifeInfoContainer>

      <ReviewsContainer>
        <h2>Отзывы</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem key={review.id}>
              <ReviewText>{review.text}</ReviewText>
              <ReviewTonality tone={review.tonality}>{translateTonality(review.tonality)}</ReviewTonality>
              <ReviewDate>{new Date(review.createdAt).toLocaleString()}</ReviewDate>
            </ReviewItem>
          ))
        ) : (
          <p>Нет отзывов для этого товара.</p>
        )}
      </ReviewsContainer>
    </PageContainer>
  );
};

export default KnifePage;