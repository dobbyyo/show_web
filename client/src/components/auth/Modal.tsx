import React, { FC } from 'react';
import DaumPostcode from 'react-daum-postcode';
import styled from 'styled-components';

interface Props {
  dataPlace: any;
}

const Box = styled.div`
  width: 500px;
  position: fixed;
  top: 200px;
  background-color: red;
`;

const Modal: FC<Props> = ({ dataPlace }) => {
  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    dataPlace(fullAddress);
  };

  return (
    <Box>
      <DaumPostcode onComplete={handleComplete} />
    </Box>
  );
};

export default Modal;
