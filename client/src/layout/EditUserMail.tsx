/* eslint-disable max-len */
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import FormBox from '../components/auth/FormBox';
import FormError from '../components/auth/FormError';
import { Button, Input } from '../components/shared/shared';
import { RootState } from '../reducers';

import { removeImage, userChangeRequest, userImageRequest } from '../reducers/user/user';

const InputImg = styled.input`
  width: 100%;
  cursor: pointer;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #000;
  border-radius: 10px;
  height: 40px;
  background-color: #fff;
  color: #000;
`;

const ImgForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    width: 100%;
    margin: 20px 0;
    background-color: initial;
    height: 40px;
    border: 1px solid ${(props) => props.theme.borderDarkColor};
    border-radius: 10px;
    font-size: 18px;
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

const MBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

interface Props {
  onCloseEditUser: () => void;
}
const EditUser: FC<Props> = ({ onCloseEditUser }) => {
  const { me, imagePaths, userChangeDone, userChangeError } = useSelector((state: RootState) => state.user);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageInput: any = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userChangeDone) {
      onCloseEditUser();
    }
  }, [userChangeDone]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      nickname: me ? me.nickname : '',
      email: me ? me.email : '',
    },
  });

  const onRemoveImage = useCallback(
    () => () => {
      dispatch(removeImage());
    },
    [],
  );

  const onSubmit = useCallback(() => {
    const { nickname, email } = getValues();
    const formData = new FormData();
    imagePaths.forEach((img: string) => {
      formData.append('image', img);
    });
    formData.append('nickname', nickname);
    formData.append('email', email);

    dispatch(userChangeRequest({ data: formData, UserId: me.id }));
    return onCloseEditUser;
  }, [imagePaths]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((event) => {
    const imageFormData = new FormData();
    [].forEach.call(event.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch(userImageRequest(imageFormData));
  }, []);

  return (
    <div>
      <div className="line">
        <h1>유저 변경</h1>
      </div>
      <MBox>
        <FormBox>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <label id="nickname">닉네임 *</label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임"
              {...register('nickname', {
                required: true,
              })}
            />
            <FormError message={errors?.nickname?.message} />

            <label id="email">이메일 *</label>
            <Input
              id="email"
              type="email"
              placeholder="이메일"
              {...register('email', {
                required: true,
              })}
            />
            <FormError message={errors?.email?.message} />

            <InputImg type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
            <InputImg type="button" value="아바타 업로드" onClick={onClickImageUpload} accept="image/*" />

            <ImgForm className="uploadImg">
              {imagePaths.map((v: string) => (
                <div key={v}>
                  <img src={v} style={{ width: '200px' }} alt="img" />
                  <div>
                    <button type="button" onClick={onRemoveImage()}>
                      제거
                    </button>
                  </div>
                </div>
              ))}
            </ImgForm>

            {userChangeError && <span style={{ color: 'red' }}>{userChangeError}</span>}

            <Button type="submit" value="확인" />
          </form>
        </FormBox>
      </MBox>
    </div>
  );
};

export default EditUser;
