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

  .additional-images {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    img {
      max-width: 150px;
      width: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
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
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3RBZG1pbiIsImVtYWlsIjoidGVzdEFkbWluMTIzQGdtYWlsLmNvbSIsImlzQWRtaW4iOiJ0cnVlIiwiZXhwIjoxNzQyODEyMTgyfQ.Xbic2qiiguwut8OyNd8saKSUBN--RD6IgveGzhSgFiI'
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
          <img
            src={`${knife.photoBase64}`}
            alt={`Зображення ножа 1`}
          />
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
              <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
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