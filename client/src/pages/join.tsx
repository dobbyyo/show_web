import React, { useCallback, useEffect } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styled from 'styled-components';
import AuthLayout from '../components/auth/AuthLayout';
import BottomBox from '../components/auth/BottomBox';
import FormBox from '../components/auth/FormBox';
import FormError from '../components/auth/FormError';
import { Button, FatLink, Input } from '../components/shared/shared';
import { RootState } from '../reducers';
import { joinRequest } from '../reducers/user/user';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
  color: #000;
`;

const Join = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      repassword: '',
      name: '',
    },
  });
  const { joinDone, joinError } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = useCallback(() => {
    const { email, nickname, password, repassword, name } = getValues();
    if (password !== repassword) {
      alert('비밀번호가 일치하지 않습니다.');
      reset();
    }
    console.log(email, nickname, password, name);

    dispatch(joinRequest({ email, nickname, password, name }));
  }, [getValues]);

  useEffect(() => {
    if (joinDone) {
      toast.success('회원가입이 완려되었습니다.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      Router.push('/login');
    }
  }, [joinDone]);

  return (
    <AuthLayout>
      <FormBox>
        <HeaderContainer>
          <Subtitle>회원가입</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label id="email">이메일 *</label>
          <Input
            type="email"
            id="email"
            {...register('email', {
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: '이메일 형식입니다.',
              },
            })}
          />
          <FormError message={errors?.email?.message} />

          <label id="nickname">아이디 *</label>
          <Input
            id="nickname"
            type="text"
            {...register('nickname', {
              required: '아이디를 작성해주세요',
            })}
          />
          <FormError message={errors?.email?.message} />

          <label id="password">비밀번호 *</label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: '비밀번호를 작성해주세요',
            })}
          />
          <FormError message={errors?.password?.message} />

          <label id="repassword">비밀번호 확인 *</label>
          <Input
            id="repassword"
            type="password"
            {...register('repassword', {
              required: '비밀번호를 작성해주세요',
            })}
          />
          <FormError message={errors?.repassword?.message} />

          <label id="name">이름 *</label>
          <Input
            id="name"
            type="text"
            {...register('name', {
              required: '이름을 작성해주세요',
            })}
          />
          <FormError message={errors?.name?.message} />
          {joinError && <span style={{ color: 'red' }}>{joinError}</span>}

          <Button type="submit" value="회원가입" />
        </form>
      </FormBox>

      <BottomBox cta="Have an account?" linkText="Log in" link="/login" />
      {joinDone && (
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      )}
    </AuthLayout>
  );
};

export default Join;
