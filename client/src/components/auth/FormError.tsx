import React, { FC } from 'react';
import styled from 'styled-components';

const SFormError = styled.span`
  color: rgb(255, 0, 0);
  font-weight: 600;
  font-size: 12px;
  margin: 5px 0px 10px 0px;
`;

interface IProps {
  message?: string;
}

const FormError: FC<IProps> = ({ message }) => {
  return message === '' || !message ? null : <SFormError>{message}</SFormError>;
};

export default FormError;
