import React, { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers';
import { addCommentRequest } from '../../reducers/post/post';
import { Input } from '../../components/shared/shared';
import CommentContent from './CommentContent';
import { Comment } from '../../reducers/post/postType';

const Container = styled.div`
  width: 100%;
  padding: 0 40px;
  @media (min-width: 768px) and (max-width: 991px) {
    padding: 0;
  }
  @media (max-width: 767px) {
    padding: 0;
  }
`;

const Form = styled.form`
  width: 100%;
  margin-top: 20px;
  position: relative;
  .submit {
    position: absolute;
    right: 2%;
    top: 30%;
    cursor: pointer;
  }
  .enterInput::placeholder {
    font-size: 16px;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    .enterInput::placeholder {
      font-size: 12px;
    }
  }
  @media (max-width: 767px) {
    .enterInput::placeholder {
      font-size: 8px;
    }
  }
`;

interface Props {
  comments: Comment[];
}
const CommentCard: FC<Props> = ({ comments }) => {
  console.log(comments);
  const dispatch = useDispatch();
  const { addCommentError, singlePost } = useSelector((state: RootState) => state.post);
  const id = useSelector((state: RootState) => state.user.me?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onComment = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    const { content } = getValues();

    dispatch(addCommentRequest({ content, postId: singlePost.id, userId: id }));
    return reset();
  }, []);

  return (
    <Container>
      {comments && comments.map((v) => <CommentContent comment={v} key={v.id} />)}

      <Form onSubmit={handleSubmit(onComment)}>
        <Input
          id="content"
          className="enterInput"
          placeholder="댓글을 작성해주세요"
          {...register('content', {
            required: true,
          })}
        />
        {errors.content && errors.content.type === 'required' && (
          <span style={{ color: 'red' }}>댓글을 작성해주세요</span>
        )}

        {addCommentError && <span style={{ color: 'red' }}>{addCommentError}</span>}
        <div className="submit">
          <input type="submit" value="확인" />
        </div>
      </Form>
    </Container>
  );
};

export default CommentCard;
