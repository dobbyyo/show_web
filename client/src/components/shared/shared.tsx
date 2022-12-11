import styled from 'styled-components';

export const BaseBox = styled.div`
  border-color: ${(props) => props.theme.borderColor};
  border: 1px solid ${(props) => props.theme.bgColor};
`;

export const FatLink = styled.span`
  font-weight: 600;
  color: rgb(142, 142, 142);
`;

export const FatText = styled.span`
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #000;
  height: 50px;
  margin-bottom: 20px;

  &::placeholder {
    padding-left: 10px;
    font-size: 20px;
  }
`;

export const Button = styled.input`
  width: 100%;
  border: none;
  background-color: #000;
  color: #fff;
  text-align: center;
  font-size: 25px;
  font-weight: 700;
  display: block;
  padding: 20px 0;
  margin-top: 20px;
  border-radius: 10px;
  cursor: pointer;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    padding: 10px 0;
    font-size: 12px;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  border: 1px solid #000;
`;
