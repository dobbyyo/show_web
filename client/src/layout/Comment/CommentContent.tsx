import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useConfirm from '../../components/auth/useConfirm';
import { Input } from '../../components/shared/shared';

import { RootState } from '../../reducers';
import { removeCommentRequest, updateCommentRequest } from '../../reducers/post/post';
import { Comment } from '../../reducers/post/postType';

interface Props {
  comment: Comment;
}
const Container = styled.div`
  width: 100%;
`;

const CommentUser = styled.div`
  width: 100%;
  height: 10rem;
  overflow: scroll;
  margin-bottom: 1rem;
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    height: 3rem;
    align-items: center;
    button[type='button'] {
      margin-left: 0.5rem;
    }
  }
  div {
    padding: 1rem 0;
  }
`;
const Form = styled.form<{ editMode: boolean }>`
  width: 100%;
  .submit {
    cursor: pointer;
  }
`;

const CommentContent: FC<Props> = ({ comment }) => {
  const { me } = useSelector((state: RootState) => state.user);
  const id = useSelector((state: RootState) => state.user.me?.id);

  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      content: comment.content,
    },
  });

  const onClickUpdate = useCallback(() => {
    setEditMode((cur) => !cur);
  }, []);

  const onSubmit = useCallback(
    (commentId) => () => {
      const { content } = getValues();
      dispatch(updateCommentRequest({ commentId, content }));
      setEditMode((cur) => !cur);
    },
    [],
  );

  const [confirmData, setConfirmData] = useState(false);
  const ok = () => setConfirmData(true);
  const cancel = () => setConfirmData(false);
  const confirmDelete = useConfirm('삭제 하시겠습니까?', ok, cancel);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (confirmData) {
      if (id !== comment.UserId) {
        return alert('자신의 댓글만 삭제할수 있습니다.');
      }

      dispatch(removeCommentRequest(comment.id));
      // return Router.back();
    }
  }, [confirmData]);

  return (
    <Container>
      <CommentUser>
        <div className="header">
          {comment.User.nickname && <div>작성자: {comment.User.nickname}</div>}

          {me && me.id === comment.User.id ? (
            <div>
              {comment.updatedAt.slice(0, 10)}
              <button type="button" onClick={onClickUpdate}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button type="button">
                <FontAwesomeIcon icon={faTrash} onClick={confirmDelete} />
              </button>
            </div>
          ) : null}
        </div>

        {editMode ? (
          <Form onSubmit={handleSubmit(onSubmit(comment.id))} editMode={editMode}>
            <Input id="content" type="text" {...register('content')} autoFocus />
            <div className="submit">
              <input type="submit" value="확인" />
            </div>
          </Form>
        ) : (
          <div>{comment.content}</div>
        )}
      </CommentUser>
    </Container>
  );
};

export default CommentContent;
