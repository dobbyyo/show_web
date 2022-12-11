import Router from 'next/router';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import FormBox from '../components/auth/FormBox';
import FormError from '../components/auth/FormError';
import Modal from '../components/auth/Modal';

import { Button, FatLink, Input, Select } from '../components/shared/shared';
import { RootState } from '../reducers';
import { addImagesRequest, removeImages, updatePostRequest } from '../reducers/post/post';
import { PostsProps } from '../reducers/post/postType';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;
`;
const PlaceBtn = styled.button`
  width: 40%;
  margin-bottom: 20px;
  height: 30px;
`;
const Subtitle = styled(FatLink)`
  font-size: 30px;
  text-align: center;
  color: #000;
`;

const InputImg = styled.input`
  width: 100%;
  cursor: pointer;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.borderColor};
  height: 40px;
  background-color: ${(props) => props.theme.borderDarkColor};
  color: ${(props) => props.theme.bgColor};
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
interface Props {
  post: PostsProps;
}

const Edit: FC<Props> = ({ post }) => {
  const dispatch = useDispatch();
  const { imagePaths } = useSelector((state: RootState) => state.post);
  const imageInput: any = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      title: post.title,
      content: post.content,
      hashtag: post.Hashtags && post.Hashtags.map((v: any) => `#${v.name} `).join(''),
      kinds: post.kinds,
      activityName: post.activityName,
      searchName: post.searchName,
    },
  });

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch(removeImages(index));
    },
    [],
  );

  const [place, setPlace] = useState('');
  const dataPlace = useCallback((data) => {
    setPlace(data);
  }, []);
  const [modal, setModal] = useState(false);
  const onModal = useCallback(() => {
    setModal((cur) => !cur);
  }, []);

  const onSubmit = useCallback(() => {
    const { title, content, hashtag, activityName, kinds } = getValues();
    console.log(place);
    const formData = new FormData();
    imagePaths.forEach((img: any) => {
      formData.append('image', img);
    });
    formData.append('title', title);
    formData.append('content', content);
    formData.append('hashtag', hashtag);
    formData.append('kinds', kinds);
    formData.append('activityName', activityName);
    formData.append('searchName', place);

    dispatch(updatePostRequest({ data: formData, PostId: post.id }));
    return Router.push('/');
  }, [setModal, setPlace, place]);

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

  return (
    <FormBox>
      <HeaderContainer>
        <Subtitle>포스터 수정</Subtitle>
      </HeaderContainer>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <PlaceBtn type="button" onClick={onModal}>
          {modal ? '도로명 닫기' : '도로명 찾기'}
        </PlaceBtn>
        {modal && <Modal dataPlace={dataPlace} />}
        <Input
          type="text"
          value={place}
          placeholder="주소를 작성해주세요"
          id="searchName"
          {...register('searchName')}
        />
        <Input type="text" placeholder="음식 이름을 작성해주세요" id="activityName" {...register('activityName')} />

        <Input
          type="text"
          placeholder="Title"
          id="title"
          {...register('title', {
            required: '제목을 작성해주세요',
          })}
        />
        <FormError message={errors?.title?.message} />
        <Input
          type="text"
          placeholder="Content"
          id="content"
          {...register('content', {
            required: '설명을 작성해주세요',
          })}
        />
        <FormError message={errors?.content?.message} />

        <Input type="text" placeholder="Hashtag" id="hashtag" {...register('hashtag')} />
        <FormError message={errors?.hashtag?.message} />

        <Select id="kinds" {...register('kinds')}>
          <option value="none" disabled>
            선택하세요
          </option>
          <option value="양식">양식</option>
          <option value="중식">중식</option>
          <option value="일식">일식</option>
          <option value="한식">한식</option>
        </Select>

        <InputImg type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <InputImg type="button" value="이미지 업로드" onClick={onClickImageUpload} accept="image/*" />

        <ImgForm className="uploadImg">
          {imagePaths.map((v: string, i: number) => (
            <div key={v}>
              <img src={v} style={{ width: '200px' }} alt="img" />
              <div>
                <button type="button" onClick={onRemoveImage(i)}>
                  제거
                </button>
              </div>
            </div>
          ))}
        </ImgForm>

        <Button type="submit" value="전송" />
      </form>
    </FormBox>
  );
};

export default Edit;
