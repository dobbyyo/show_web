/* eslint-disable max-len */
import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { RootState } from '../reducers';
import FormBox from '../components/auth/FormBox';
import { Button, Input } from '../components/shared/shared';
import FormError from '../components/auth/FormError';
import { logoutRequest, passwordChangeRequest } from '../reducers/user/user';

const MBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
interface Props {
  onCloseEditUser: () => void;
}

const EditPassword: FC<Props> = ({ onCloseEditUser }) => {
  const { passwordChangeDone, passwordChangeError } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    if (passwordChangeDone) {
      onCloseEditUser();
    }
  }, [passwordChangeDone]);

  const onUpdatePassword = useCallback((data) => {
    const { changePassword, newPasswordOk } = getValues();
    if (changePassword !== newPasswordOk) {
      alert('새로운 비밀번호가 다릅니다.');
    }
    dispatch(passwordChangeRequest(data));
    dispatch(logoutRequest());
    Router.push('/');
  }, []);

  return (
    <div>
      <div className="line">
        <h1>비밀번호 변경</h1>
      </div>
      <MBox>
        <FormBox>
          <form onSubmit={handleSubmit(onUpdatePassword)}>
            <label id="currentPassword">현재 비밀번호 *</label>
            <Input
              id="currentPassword"
              type="password"
              {...register('currentPassword', {
                required: true,
              })}
            />
            <FormError message={errors?.currentPassword?.message} />

            <label id="changePassword">새로운 비밀번호 *</label>
            <Input
              id="changePassword"
              type="password"
              {...register('changePassword', {
                required: true,
                minLength: {
                  value: 1,
                  message: '최소4글자 이상 작성해주세요',
                },
              })}
            />
            <FormError message={errors?.changePassword?.message} />

            <label id="newPasswordOk">새로운 비밀번호 확인 *</label>
            <Input
              id="newPasswordOk"
              type="password"
              {...register('newPasswordOk', {
                required: true,
                minLength: {
                  value: 1,
                  message: '최소4글자 이상 작성해주세요',
                },
              })}
            />
            <FormError message={errors?.newPasswordOk?.message} />

            {passwordChangeError && <span style={{ color: 'red' }}>{passwordChangeError}</span>}

            <Button type="submit" value="확인" />
          </form>
        </FormBox>
      </MBox>
    </div>
  );
};

export default EditPassword;
