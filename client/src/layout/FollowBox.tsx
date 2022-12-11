import React, { FC } from 'react';
import styled from 'styled-components';

import SmallCard from '../components/auth/SmallCard';
import { Follow } from '../reducers/user/userTypes';

const Container = styled.div`
  height: 100%;
  width: 100%;
  align-items: center;
  display: flex;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
`;

interface Props {
  Followings: Follow[];
  Followers: Follow[];
  followersBar: boolean;
}

const FollowBox: FC<Props> = ({ Followings, Followers, followersBar }) => {
  return (
    <Container>
      <div>
        {followersBar
          ? Followers.map((v) => <SmallCard data={v} key={v.id} />)
          : Followings.map((v) => <SmallCard data={v} key={v.id} />)}
      </div>
    </Container>
  );
};

export default FollowBox;
