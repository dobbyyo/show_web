import Router from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import AuthLayout from '../components/auth/AuthLayout';
import FormBox from '../components/auth/FormBox';
import FormError from '../components/auth/FormError';
import Modal from '../components/auth/Modal';
import { Button, Input, Select } from '../components/shared/shared';
import { RootState } from '../reducers';
import { addImagesRequest, addPostRequest, removeImages } from '../reducers/post/post';

const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const PlaceBtn = styled.button`
  /* display: flex; */
  width: 40%;
  margin-bottom: 20px;
  height: 30px;
`;

const Btn = styled.button`
  width: 40%;
  background-color: green;
  color: #fff;
  height: 30px;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;
const InputImg = styled.input`
  width: 100%;
  cursor: pointer;
  text-align: center;
  margin-bottom: 20px;
  border: 3px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  height: 40px;
  color: #000;
  &:hover {
    background-color: #000;
    color: #fff;
  }
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

const UploadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const onModal = useCallback(() => {
    setModal((cur) => !cur);
  }, []);

  const [place, setPlace] = useState('');
  const dataPlace = useCallback((data) => {
    setPlace(data);
  }, []);

  const [pageNumber, setPageNumber] = useState(0);
  const onFrontPage = useCallback(() => {
    if (pageNumber === 3) {
      setPageNumber((cur) => cur);
    }
    setModal(false);

    return setPageNumber((cur) => cur + 1);
  }, []);
  const onBackPage = useCallback(() => {
    if (pageNumber === 0) {
      setPageNumber((cur) => cur);
    }
    return setPageNumber((cur) => cur - 1);
  }, []);

  //   const onCurrentPage = useCallback(() => {}, []);

  const { imagePaths } = useSelector((state: RootState) => state.post);
  const imageInput: any = useRef();

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch(removeImages(index));
    },
    [],
  );
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((event) => {
    // console.log('images', event.target.files);
    const imageFormData = new FormData();
    [].forEach.call(event.target.files, (f) => {
      imageFormData.append('image', f);
    });

    dispatch(addImagesRequest(imageFormData));
  }, []);

  const onSubmit = useCallback(() => {
    const { title, content, hashtag, activityName, searchName, kinds } = getValues();

    if (kinds === 'none') {
      return alert('????????? ??????????????????!');
    }
    const formData = new FormData();
    imagePaths.forEach((img: any) => {
      formData.append('image', img);
    });
    formData.append('title', title);
    formData.append('content', content);
    formData.append('hashtag', hashtag);
    formData.append('kinds', kinds);
    dispatch(addPostRequest(formData));
    return Router.back();
  }, [getValues, imagePaths]);

  return (
    <AuthLayout>
      <FormBox>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {pageNumber === 0 && (
            <>
              <label>??????</label>
              <Input
                type="text"
                id="title"
                {...register('title', {
                  required: '????????? ??????????????????',
                })}
              />
              <FormError message={errors?.title?.message} />

              <label>??????</label>
              <Input
                type="text"
                id="content"
                {...register('content', {
                  required: '????????? ??????????????????',
                })}
              />
              <FormError message={errors?.content?.message} />
            </>
          )}
          {pageNumber === 1 && (
            <>
              <label>????????????</label>
              <Input type="text" id="hashtag" {...register('hashtag')} />
              <FormError message={errors?.hashtag?.message} />

              <label>????????????</label>
              <Select id="kinds" {...register('kinds')}>
                <option value="none">???????????????</option>
                <option value="?????????">?????????</option>
                <option value="?????????">?????????</option>
                <option value="??????">??????</option>
                <option value="??????">??????</option>
              </Select>
            </>
          )}
          {pageNumber === 2 && (
            <>
              <InputImg type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
              <InputImg type="button" value="????????? ?????????" onClick={onClickImageUpload} accept="image/*" />

              <ImgForm className="uploadImg">
                {imagePaths.map((v: string, i: number) => (
                  <div key={v}>
                    <img src={v} style={{ width: '200px' }} alt="img" />
                    <div>
                      <button type="button" onClick={onRemoveImage(i)}>
                        ??????
                      </button>
                    </div>
                  </div>
                ))}
              </ImgForm>
            </>
          )}
          <BtnContainer>
            {pageNumber !== 0 && (
              <Btn type="button" onClick={onBackPage}>
                ??????
              </Btn>
            )}
            {pageNumber !== 2 && (
              <Btn type="button" onClick={onFrontPage}>
                ??????
              </Btn>
            )}
          </BtnContainer>
          {pageNumber === 2 && <Button type="submit" value="?????????" />}
        </form>
      </FormBox>
    </AuthLayout>
  );
};

export default UploadForm;
