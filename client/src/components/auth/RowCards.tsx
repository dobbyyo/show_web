/* eslint-disable operator-linebreak */
import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import gravatar from 'gravatar';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import { Hashtag, PostsProps } from '../../reducers/post/postType';
import CardImg from './CardImg';
import { RootState } from '../../reducers';
import { likePostRequest, unLikePostRequest } from '../../reducers/post/post';

interface Props {
  posts: PostsProps;
}

const Container = styled.div`
  width: 40%;
  margin-top: 50px;
  border: 1px solid #000;
  position: relative;
  @media (min-width: 768px) and (max-width: 991px) {
    width: 70%;
  }
  @media (max-width: 767px) {
    width: 90%;
    font-size: 12px;
  }
`;

const UserName = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 30px;
  cursor: pointer;
`;

const Img = styled.img`
  margin-right: 20px;
  height: 20px;
  width: 20px;
  border-radius: 50%;
`;

const CardImgContainer = styled.div`
  /* width: 100%; */
  /* height: 100%; */
`;

const Box = styled.div`
  width: 100%;
  border-bottom: 1px solid #000;
  padding: 20px;
  .title {
    font-size: 16px;
    font-weight: 800;
    text-align: center;
  }
  .middle {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
  }
  .like {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon {
    margin-right: 10px;
    color: red;
  }
`;

const Content = styled.div`
  font-size: 16px;
  margin-top: 20px;
`;

const EventClick = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px 0;
  font-size: 30px;
  @media (min-width: 768px) and (max-width: 991px) {
    font-size: 20px;
  }
  @media (max-width: 767px) {
    font-size: 17px;
  }
`;

const MoreInfo = styled.p`
  font-size: 18px;
  cursor: pointer;
`;

const HashtagContainer = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
`;
const HashtagDiv = styled.div`
  color: ${(props) => props.theme.blue};
  margin-right: 10px;
  height: 30px;
  align-items: center;
  display: flex;
  cursor: pointer;
`;

const RowCards: FC<Props> = ({ posts }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  let liked;

  if (posts.Likers) {
    liked = posts && posts.Likers.find((v) => v.id === id);
  }

  const onUser = useCallback(
    (UserId) => () => {
      Router.push(`/user/${UserId}`);
    },
    [],
  );
  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(likePostRequest(posts.id));
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(unLikePostRequest(posts.id));
  }, [id]);

  const onClick = useCallback(() => {
    Router.push(`/post/${posts.id}`);
  }, []);

  const onHashtag = useCallback(
    (data) => () => {
      Router.push(`/hashtag/${data}`);
    },
    [],
  );
  return (
    <Container>
      <UserName onClick={onUser(posts.UserId)}>
        {posts.User.Image ? (
          <Img src={`${posts.User.Image.src}`} alt="img" />
        ) : (
          <Img src={gravatar.url(posts.User.email, { s: '100%', d: 'retro' })} alt="img" />
        )}
        {posts.User.nickname}
      </UserName>

      {posts.Images && posts.Images[0] ? (
        <CardImgContainer>{posts.Images[0] && <CardImg images={posts.Images} />}</CardImgContainer>
      ) : null}

      <Box>
        <h1 className="title">{posts.title}</h1>
        <div className="middle">
          <h2 className="like">
            <FontAwesomeIcon icon={faHeart} className="icon" />
            {posts.Likers.length}
          </h2>
          <h3>{posts.createdAt.slice(2, 10)}</h3>
        </div>
        <Content>
          <h3>{posts.content}</h3>
          <HashtagContainer>
            {posts.Hashtags &&
              posts.Hashtags.map((v: Hashtag) => (
                <HashtagDiv onClick={onHashtag(v.name)} key={v.id}>
                  #{v.name}
                </HashtagDiv>
              ))}
          </HashtagContainer>
        </Content>
      </Box>
      <EventClick>
        {liked ? (
          <FontAwesomeIcon
            icon={faHeart}
            onClick={onUnLike}
            className="likeIcon"
            style={{ color: 'red', cursor: 'pointer' }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faHeart}
            onClick={onLike}
            className="likeIcon"
            style={{ color: 'black', cursor: 'pointer' }}
          />
        )}
        <MoreInfo onClick={onClick}>자세히 보기</MoreInfo>
      </EventClick>
    </Container>
  );
};

export default RowCards;
