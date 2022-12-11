/* eslint-disable no-nested-ternary */
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import styled from 'styled-components';
import gravatar from 'gravatar';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons';

import AuthLayout from '../../components/auth/AuthLayout';
import CardImg from '../../components/auth/CardImg';
import Map from '../../components/auth/Map';
import { RootState } from '../../reducers';
import {
  likePostRequest,
  loadPostRequest,
  removePostRequest,
  removeSavePostRequest,
  savePostRequest,
  unLikePostRequest,
} from '../../reducers/post/post';
import { loadMyInfoRequest } from '../../reducers/user/user';
import wrapper, { SagaStore } from '../../store/configureStore';
import CommentCard from '../../layout/Comment/CommentCard';
import { Hashtag, Liker } from '../../reducers/post/postType';
import useConfirm from '../../components/auth/useConfirm';
import Edit from '../../layout/Edit';

const Box = styled.div`
  width: 100%;
  padding: 0 40px;
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
  height: 100%;
  @media (min-width: 768px) and (max-width: 991px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  @media (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 0;
  }
`;

const CardImgContainer = styled.div`
  width: 45%;
  @media (min-width: 768px) and (max-width: 991px) {
    width: 70%;
  }
  @media (max-width: 767px) {
    width: 90%;
  }
`;
const MapBox = styled.div`
  width: 45%;
  @media (min-width: 768px) and (max-width: 991px) {
    width: 70%;
  }
  @media (max-width: 767px) {
    width: 90%;
  }
`;
const Title = styled.div`
  display: flex;
  color: #000;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  h1 {
    margin-left: 20px;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    position: absolute;
    top: 7%;
  }
  @media (max-width: 767px) {
    position: absolute;
    top: 10%;
  }
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const Info = styled.div`
  padding-top: 20px;
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
  span {
    font-size: 16px;
  }
`;
const BtnContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  @media (min-width: 768px) and (max-width: 991px) {
    justify-content: space-around;
  }
  @media (max-width: 767px) {
    justify-content: space-around;
  }
`;

const SBtn = styled.button`
  border: 1px solid #000;
  border-radius: 8px;
  width: 100px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background-color: initial;
  cursor: pointer;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    height: 40px;
    font-size: 15px;
  }
`;
const MBtn = styled.button`
  border: none;
  border-radius: 8px;
  width: 200px;
  height: 50px;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  margin: 0 20px;

  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    height: 40px;
    font-size: 15px;
  }
`;
const LBtn = styled.button`
  width: 300px;
  height: 50px;
  background-color: initial;
  border: 1px solid #000;
  cursor: pointer;
  margin-top: 20px;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
  }
`;

const HashtagContainer = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const HashtagDiv = styled.div`
  color: ${(props) => props.theme.blue};
  margin-right: 10px;
  height: 30px;
  align-items: center;
  display: flex;
  cursor: pointer;
`;
const CommentBox = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Post = () => {
  const dispatch = useDispatch();

  const { singlePost, likePostDone, unLikePostDone, savePostError, removePostError } = useSelector(
    (state: RootState) => state.post,
  );

  const { me } = useSelector((state: RootState) => state.user);
  const id = useSelector((state: RootState) => state.user.me?.id);

  const [commentBar, setCommentBar] = useState(false);

  let liked;
  if (singlePost.Likers) {
    liked = singlePost && singlePost.Likers.find((v: Liker) => v.id === id);
  }
  let saved;
  if (singlePost.Saver) {
    saved = singlePost && singlePost.Saver.find((v: any) => v.id === id);
  }

  useEffect(() => {
    dispatch(loadPostRequest(singlePost.id));
  }, [likePostDone, unLikePostDone]);

  const onHashtag = useCallback(
    (data) => () => {
      Router.push(`/hashtag/${data}`);
    },
    [],
  );
  const onComment = useCallback(() => {
    setCommentBar((cur) => !cur);
  }, [setCommentBar]);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(likePostRequest(singlePost.id));
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(unLikePostRequest(singlePost.id));
  }, [id]);
  const onUser = useCallback(() => {
    Router.push(`/user/${singlePost.User.id}`);
  }, []);

  const onClickSave = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    return dispatch(savePostRequest(singlePost.id));
  }, [id, savePostError]);

  const onClickRemoveSave = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    return dispatch(removeSavePostRequest(singlePost.id));
  }, [id, removePostError]);

  useEffect(() => {
    if (savePostError) {
      alert(savePostError);
    }
  }, [savePostError]);

  const [confirmData, setConfirmData] = useState(false);
  const ok = () => setConfirmData(true);
  const cancel = () => setConfirmData(false);
  const confirmDelete = useConfirm('삭제 하시겠습니까?', ok, cancel);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (confirmData) {
      if (id !== singlePost.UserId) {
        return alert('자신의 글만 삭제할수 있습니다.');
      }
      dispatch(removePostRequest(singlePost.id));
      return Router.back();
    }
  }, [confirmData]);

  const [edit, setEdit] = useState(false);

  const onEdit = useCallback(() => {
    setEdit((cur) => !cur);
  }, [setEdit]);

  return (
    <AuthLayout>
      {edit ? (
        <Edit post={singlePost} />
      ) : (
        <>
          <Box>
            {singlePost.Images && singlePost.Images[0] ? (
              <CardImgContainer>{singlePost.Images[0] && <CardImg images={singlePost.Images} />}</CardImgContainer>
            ) : null}
            <MapBox>
              <Title onClick={onUser}>
                {singlePost && me ? (
                  singlePost.User.Image ? (
                    <Img src={`${singlePost.User.Image.src}`} alt="img" />
                  ) : (
                    <Img src={gravatar.url(me.email, { s: '100%', d: 'retro' })} alt="img" />
                  )
                ) : null}
                <h1>{singlePost.User.nickname}</h1>
              </Title>
              <Map searchName={singlePost.searchName} activityName={singlePost.activityName} />
              <Info>
                <h1>소개</h1>
                <span>{singlePost.content}</span>
                <HashtagContainer>
                  {singlePost.Hashtags.map((v: Hashtag) => (
                    <HashtagDiv onClick={onHashtag(v.name)} key={v.id}>
                      #{v.name}
                    </HashtagDiv>
                  ))}
                </HashtagContainer>
              </Info>
              <BtnContainer>
                {liked ? (
                  <SBtn type="button" onClick={onUnLike}>
                    <FontAwesomeIcon icon={faHeart} className="icon" style={{ color: 'red', cursor: 'pointer' }} />
                  </SBtn>
                ) : (
                  <SBtn type="button" onClick={onLike}>
                    <FontAwesomeIcon icon={faHeart} className="icon" style={{ color: 'black', cursor: 'pointer' }} />
                  </SBtn>
                )}
                {saved ? (
                  <MBtn onClick={onClickRemoveSave}>
                    <FontAwesomeIcon icon={faBookmark} className="icon" style={{ color: 'red' }} />
                  </MBtn>
                ) : (
                  <MBtn onClick={onClickSave}>
                    <FontAwesomeIcon icon={faBookmark} className="icon" />
                  </MBtn>
                )}
                {me && me.id === singlePost.UserId ? (
                  <>
                    <MBtn onClick={onEdit}>수정</MBtn>
                    <SBtn onClick={confirmDelete}>삭제</SBtn>
                  </>
                ) : null}
              </BtnContainer>
            </MapBox>
          </Box>
          <CommentBox>
            <LBtn type="button" onClick={onComment}>
              {commentBar ? '댓글 닫기' : '댓글 보기'}
            </LBtn>
            {commentBar && <CommentCard comments={singlePost.Comments} />}
          </CommentBox>
        </>
      )}
    </AuthLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }: any) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.common.cookie = '';
  if (req && cookie) {
    axios.defaults.headers.common.cookie = cookie;
  }
  store.dispatch(loadMyInfoRequest());
  store.dispatch(loadPostRequest(params.id));
  store.dispatch(END);

  await (store as SagaStore).sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default Post;
