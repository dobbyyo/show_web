/* eslint-disable no-alert */
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Router from 'next/router';
import React, { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

interface Props {
  onCloseSearchBar: () => void;
}

const Box = styled.div`
  width: 100%;
  z-index: 9999;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  position: fixed;
`;

const Form = styled.form`
  width: 80%;
  background-color: #fff;
  height: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  .cancelIcon {
    position: absolute;
    right: 15%;
    font-size: 16px;
    cursor: pointer;
  }
  .searchLogo {
    margin-right: 3px;
  }
`;

export const InputOption = styled.select`
  position: absolute;
  left: 12%;
  border: none;
  padding-right: 1rem;
  cursor: pointer;
`;

const Search: FC<Props> = ({ onCloseSearchBar }) => {
  const { register, handleSubmit, getValues, reset } = useForm();

  const onSubmit = useCallback(() => {
    const { search, option } = getValues();
    if (option === '이름') {
      if (search.length === 0 || search.trim().length === 0) {
        alert('검색어를 입력해주세요');
      }
      Router.push(`/title/${search}`);
      onCloseSearchBar();
    } else {
      Router.push(`/hashtag/${search}`);
      onCloseSearchBar();
    }
  }, [getValues]);

  const onRemove = useCallback(() => {
    reset();
  }, []);

  return (
    <Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FontAwesomeIcon icon={faSearch} className="searchLogo" />
        <input placeholder="검색" {...register('search')} />
        <InputOption id="option" {...register('option')}>
          <option value="이름">이름</option>
          <option value="해시태그">해시태그</option>
        </InputOption>
        <FontAwesomeIcon icon={faX} className="cancelIcon" onClick={onRemove} />
      </Form>
    </Box>
  );
};

export default Search;
