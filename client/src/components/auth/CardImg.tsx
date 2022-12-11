import React, { FC } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import { Image } from '../../reducers/post/postType';

const ImgContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;
const Img = styled.img`
  width: 100%;
  height: 600px;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    width: 100%;
    height: 400px;
    font-size: 12px;
  }
`;

interface Props {
  images: Image[];
}
const CardImg: FC<Props> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <ImgContainer>
      <Slider {...settings}>
        {images.map((img: Image, i: number) => (
          <Img key={img.id} src={`${images[i].src}`} />
        ))}
      </Slider>
    </ImgContainer>
  );
};

export default CardImg;
