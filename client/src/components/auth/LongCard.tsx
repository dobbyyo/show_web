import Router from 'next/router';
import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { PostsProps } from '../../reducers/post/postType';

interface Props {
  posts: PostsProps;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LongCard: FC<Props> = ({ posts }) => {
  const onClick = useCallback(() => {
    Router.push(`/post/${posts.id}}`);
  }, []);

  return <Container>{posts.Images[0] && <Img onClick={onClick} src={`${posts.Images[0].src}`} alt="img" />}</Container>;
};

export default LongCard;
