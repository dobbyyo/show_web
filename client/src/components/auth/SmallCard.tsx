import React, { FC, useCallback } from 'react';
import gravatar from 'gravatar';
import styled from 'styled-components';
import Router from 'next/router';
import { Follow } from '../../reducers/user/userTypes';

interface Props {
  data: Follow;
}

const Box = styled.div`
  width: 100%;
  font-size: 30px;
  display: flex;
  align-items: center;
  padding: 20px 0;
`;
const Img = styled.img`
  height: 40px;
  border-radius: 50%;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    height: 20px;
  }
`;

const Name = styled.div`
  margin-left: 20px;
  font-size: 18px;
  cursor: pointer;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

const SmallCard: FC<Props> = ({ data }) => {
  const onClick = useCallback(
    (a) => () => {
      Router.push(`/user/${a}`);
    },
    [],
  );

  return (
    <Box onClick={onClick(data.id)}>
      {data && data.Image ? (
        <Img src={`${data.Image.src}`} alt="img" />
      ) : (
        <Img src={gravatar.url(data.email, { s: '100%', d: 'retro' })} alt="img" />
      )}
      <Img />
      <Name>{data.nickname}</Name>
    </Box>
  );
};

export default SmallCard;
