import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import FormBox from '../components/auth/FormBox';
import { Input } from '../components/shared/shared';

const StepOne = () => {
  return (
    <AuthLayout>
      <FormBox>
        <form>
          <label>도로명을 입력해주세요</label>
          <Input type="text" />
          <label>음식 이름 입력해주세요</label>
          <Input type="text" />
        </form>
      </FormBox>
    </AuthLayout>
  );
};

export default StepOne;
