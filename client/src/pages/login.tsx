import React, { useCallback, useEffect } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthLayout from '../components/auth/AuthLayout';
import BottomBox from '../components/auth/BottomBox';
import FormBox from '../components/auth/FormBox';
import FormError from '../components/auth/FormError';
import { Button, Input } from '../components/shared/shared';
import { RootState } from '../reducers';
import { loginRequest } from '../reducers/user/user';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { logInDone, loginError } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const onSubmit = useCallback((data) => {
    dispatch(loginRequest(data));
  }, []);

  useEffect(() => {
    if (logInDone) {
      toast.success('로그인이 완려되었습니다.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      Router.push('/');
    }
  }, [logInDone]);

  return (
    <AuthLayout>
      <FormBox>
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

          <label id="password">비밀번호 *</label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: '비밀번호를 작성해주세요',
            })}
          />
          <FormError message={errors?.password?.message} />
          {loginError && <span style={{ color: 'red' }}>{loginError}</span>}

          <Button type="submit" value="로그인" />
        </form>
      </FormBox>

      <BottomBox cta="Don't have an account?" linkText="Sign Up" link="/join" />
      {logInDone && (
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

export default Login;
