/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import RowCards from '../components/auth/RowCards';
import { RootState } from '../reducers';

import { PostsProps } from '../reducers/post/postType';
import { loadOtherUserInfoRequest } from '../reducers/user/user';
import { OtherUserInfo } from '../reducers/user/userTypes';
import { loadOtherUserPostsRequest } from '../reducers/post/post';
import FollowBox from './FollowBox';

const Container = styled.div`
  width: 100%;
`;

const MBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #000;
  padding: 40px 0;
  margin-top: 30px;
`;
const SMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    h1 {
      font-size: 13px;
    }
  }
`;
const Post = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SH1 = styled.h1<{ follow: boolean }>`
  color: ${(props) => (props.follow ? 'red' : 'black')};
`;

interface Props {
  UserInfo: OtherUserInfo;
}

const MyInfo: FC<Props> = ({ UserInfo }) => {
  const { mainPosts, morePosts, savedPosts, loadOtherUserPostsLoading } = useSelector((state: RootState) => state.post);
  const { followDone, unFollowDone, Followings, Followers } = useSelector((state: RootState) => state.user);
  const [ref, inView] = useInView();

  const dispatch = useDispatch();
  const [followersBar, setFollowersBar] = useState(false);
  const [followingsBar, setFollowingsBar] = useState(false);
  const [postsBar, setPostsBar] = useState(true);
  const [savedPostsBar, setSavedPostsBar] = useState(false);

  useEffect(() => {
    if (inView && morePosts && !loadOtherUserPostsLoading && postsBar) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      const data = { id: UserInfo.id, lastId };
      dispatch(loadOtherUserPostsRequest(data));
    }
  }, [inView, morePosts, loadOtherUserPostsLoading]);

  const onFollowers = useCallback(() => {
    setFollowersBar(true);
    setFollowingsBar(false);
    setPostsBar(false);
    setSavedPostsBar(false);
  }, [setFollowersBar, setFollowingsBar, setPostsBar, setSavedPostsBar]);
  const onFollowings = useCallback(() => {
    setFollowingsBar(true);
    setFollowersBar(false);
    setPostsBar(false);
    setSavedPostsBar(false);
  }, [setFollowingsBar, setFollowersBar, setPostsBar, setSavedPostsBar]);
  const onPosts = useCallback(() => {
    setPostsBar(true);
    setFollowersBar(false);
    setFollowingsBar(false);
    setSavedPostsBar(false);
  }, [setPostsBar, setFollowersBar, setFollowingsBar, setSavedPostsBar]);
  const onSavePosts = useCallback(() => {
    setSavedPostsBar(true);
    setPostsBar(false);
    setFollowersBar(false);
    setFollowingsBar(false);
  }, [setPostsBar, setFollowersBar, setFollowingsBar, setSavedPostsBar]);

  const followBar = followersBar || followingsBar;

  useEffect(() => {
    if (followDone || unFollowDone) {
      dispatch(loadOtherUserInfoRequest(UserInfo.id));
    }
  }, [followDone, unFollowDone]);

  return (
    <Container>
      <div className="line">
        <h1>활동 정보</h1>
      </div>
      <MBox>
        <SMenu>
          <SH1 follow={postsBar} onClick={onPosts}>
            포스터
          </SH1>
        </SMenu>
        <SMenu>
          <SH1 follow={savedPostsBar} onClick={onSavePosts}>
            북마크
          </SH1>
        </SMenu>
        <SMenu>
          <SH1 follow={followersBar} onClick={onFollowers}>
            팔로워
          </SH1>
          <h1>{UserInfo.Followers}</h1>
        </SMenu>
        <SMenu>
          <SH1 follow={followingsBar} onClick={onFollowings}>
            팔로잉
          </SH1>
          <h1>{UserInfo.Followings}</h1>
        </SMenu>
      </MBox>
      <Post>
        {!followBar
          ? savedPostsBar
            ? savedPosts.map((v: PostsProps) => <RowCards posts={v} key={v.id} />)
            : mainPosts.map((v: PostsProps) => <RowCards posts={v} key={v.id} />)
          : null}
        <div ref={morePosts && !loadOtherUserPostsLoading ? ref : undefined} style={{ margin: '30px' }} />
      </Post>
      {followBar && <FollowBox Followings={Followings} Followers={Followers} followersBar={followersBar} />}
    </Container>
  );
};

export default MyInfo;
