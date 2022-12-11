/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EditPasswordProps,
  FollowSuccess,
  initialState,
  JoinProps,
  LoadUserFollow,
  loginProps,
  MyFollow,
  MyInfo,
  OtherUserInfo,
  UserChangeProps,
} from './userTypes';

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 로그인
    loginRequest: (state, _action: PayloadAction<loginProps>) => {
      state.logInLoading = true;
      state.logInDone = false;
      state.loginError = null;
    },
    loginSuccess: (state, action: PayloadAction<MyInfo>) => {
      state.logInLoading = false;
      state.logInDone = true;
      state.loginError = null;
      state.me = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string | unknown>) => {
      state.logInLoading = false;
      state.logInDone = false;
      state.loginError = action.payload;
    },

    // 회원가입
    joinRequest: (state, _action: PayloadAction<JoinProps>) => {
      state.joinLoading = true;
      state.joinDone = false;
      state.joinError = null;
    },
    joinSuccess: (state) => {
      state.joinLoading = false;
      state.joinDone = true;
      state.joinError = null;
    },
    joinFailure: (state, action: PayloadAction<string | unknown>) => {
      state.joinLoading = false;
      state.joinDone = false;
      state.joinError = action.payload;
    },

    // 로그아웃
    logoutRequest: (state) => {
      state.logoutLoading = true;
      state.logoutDone = false;
      state.logoutError = null;
    },
    logoutSuccess: (state) => {
      state.logoutLoading = false;
      state.logoutError = null;
      state.logoutDone = true;
      state.me = null;
    },
    logoutFailure: (state, action: PayloadAction<string | unknown>) => {
      state.logoutLoading = false;
      state.logoutDone = false;
      state.logoutError = action.payload;
    },

    // 로그인한 정보 가져오기
    loadMyInfoRequest: (state) => {
      state.loadMyInfoLoading = true;
      state.loadMyInfoDone = false;
      state.loadMyInfoError = null;
    },
    loadMyInfoSuccess: (state, action: PayloadAction<MyInfo>) => {
      state.loadMyInfoLoading = false;
      state.loadMyInfoError = null;
      state.loadMyInfoDone = true;
      state.me = action.payload;
    },
    loadMyInfoFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadMyInfoLoading = false;
      state.loadMyInfoDone = false;
      state.loadMyInfoError = action.payload;
    },

    // 유저 정보 수정
    userChangeRequest: (state, _action: PayloadAction<UserChangeProps>) => {
      state.userChangeLoading = true;
      state.userChangeDone = false;
      state.userChangeError = null;
    },
    userChangeSuccess: (state, action: PayloadAction<MyInfo>) => {
      state.userChangeLoading = false;
      state.userChangeError = null;
      state.userChangeDone = true;
      state.me = action.payload;
      if (state.me?.Image) {
        state.me.Image = action.payload.Image;
      }
    },
    userChangeFailure: (state, action: PayloadAction<string | unknown>) => {
      state.userChangeLoading = false;
      state.userChangeDone = false;
      state.userChangeError = action.payload;
    },

    // 비밀번호 변경
    passwordChangeRequest: (state, _action: PayloadAction<EditPasswordProps>) => {
      state.passwordChangeLoading = true;
      state.passwordChangeDone = false;
      state.passwordChangeError = null;
    },
    passwordChangeSuccess: (state, action: PayloadAction<string>) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = null;
      state.passwordChangeDone = true;
      state.me = null;
    },
    passwordChangeFailure: (state, action: PayloadAction<string | unknown>) => {
      state.passwordChangeLoading = false;
      state.passwordChangeDone = false;
      state.passwordChangeError = action.payload;
    },

    // 회원탈퇴
    deleteUserRequest: (state, _action: PayloadAction<string | number>) => {
      state.deleteUserLoading = true;
      state.deleteUserDone = false;
      state.deleteUserError = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<null>) => {
      state.deleteUserLoading = false;
      state.deleteUserError = null;
      state.deleteUserDone = true;
      state.me = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string | unknown>) => {
      state.deleteUserLoading = false;
      state.deleteUserDone = false;
      state.deleteUserError = action.payload;
    },

    // 아바타 등록
    userImageRequest: (state, _action: PayloadAction<FormData>) => {
      state.userImageLoading = true;
      state.userImageDone = false;
      state.userImageError = null;
    },
    userImageSuccess: (state, action: PayloadAction<string>) => {
      state.userImageLoading = false;
      state.userImageError = null;
      state.userImageDone = true;
      state.imagePaths = state.imagePaths.concat(action.payload);
    },
    userImageFailure: (state, action: PayloadAction<string | unknown>) => {
      state.userImageLoading = false;
      state.userImageDone = false;
      state.userImageError = action.payload;
    },

    // 포스터 나한테 등록
    addPostToMe: (state, action: PayloadAction<number>) => {
      state.me?.Posts.unshift({ id: action.payload });
    },

    loadOtherUserInfoRequest: (state, _action: PayloadAction<number>) => {
      state.loadOtherUserInfoLoading = true;
      state.loadOtherUserInfoDone = false;
      state.loadOtherUserInfoError = null;
    },
    loadOtherUserInfoSuccess: (state, action: PayloadAction<OtherUserInfo>) => {
      state.loadOtherUserInfoLoading = false;
      state.loadOtherUserInfoError = null;
      state.loadOtherUserInfoDone = true;
      state.userInfo = action.payload;
    },
    loadOtherUserInfoFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadOtherUserInfoLoading = false;
      state.loadOtherUserInfoDone = false;
      state.loadOtherUserInfoError = action.payload;
    },

    followRequest: (state, _action: PayloadAction<number>) => {
      state.followLoading = true;
      state.followDone = false;
      state.followError = null;
    },
    followSuccess: (state, action: PayloadAction<FollowSuccess>) => {
      state.followLoading = false;
      state.followError = null;
      state.followDone = true;
      state.me?.Followings.push({ id: action.payload.UserId });
    },
    followFailure: (state, action: PayloadAction<string | unknown>) => {
      state.followLoading = false;
      state.followDone = false;
      state.followError = action.payload;
    },

    unFollowRequest: (state, _action: PayloadAction<number>) => {
      state.unFollowLoading = true;
      state.unFollowDone = false;
      state.unFollowError = null;
    },
    unFollowSuccess: (state, action: PayloadAction<FollowSuccess>) => {
      state.unFollowLoading = false;
      state.unFollowError = null;
      state.unFollowDone = true;
      if (state.me?.Followings) {
        state.me.Followings = state.me?.Followings.filter((v) => v.id !== action.payload.UserId);
      }
    },
    unFollowFailure: (state, action: PayloadAction<string | unknown>) => {
      state.unFollowLoading = false;
      state.unFollowDone = false;
      state.unFollowError = action.payload;
    },

    loadUserFollowingsRequest: (state, _action: PayloadAction<number>) => {
      state.loadUserFollowingsLoading = true;
      state.loadUserFollowingsDone = false;
      state.loadUserFollowingsError = null;
    },
    loadUserFollowingsSuccess: (state, action: PayloadAction<any>) => {
      state.loadUserFollowingsLoading = false;
      state.loadUserFollowingsError = null;
      state.loadUserFollowingsDone = true;
      state.Followings = action.payload;
    },
    loadUserFollowingsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadUserFollowingsLoading = false;
      state.loadUserFollowingsDone = false;
      state.loadUserFollowingsError = action.payload;
    },

    loadUserUnFollowersRequest: (state, _action: PayloadAction<number>) => {
      state.loadUserUnFollowersLoading = true;
      state.loadUserUnFollowersDone = false;
      state.loadUserUnFollowersError = null;
    },
    loadUserUnFollowersSuccess: (state, action: PayloadAction<any>) => {
      state.loadUserUnFollowersLoading = false;
      state.loadUserUnFollowersError = null;
      state.loadUserUnFollowersDone = true;
      state.Followers = action.payload;
    },
    loadUserUnFollowersFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadUserUnFollowersLoading = false;
      state.loadUserUnFollowersDone = false;
      state.loadUserUnFollowersError = action.payload;
    },

    // 이미지 제거
    removeImage: (state) => {
      state.imagePaths = [];
    },

    // 포스터 나한테 제거
    removePostToMe: (state, action: PayloadAction<any>) => {
      console.log(action);
      if (state.me?.Posts) {
        state.me.Posts = state.me?.Posts.filter((v: any) => v.id !== action.payload);
      }
    },
  },
});

const { reducer, actions } = userSlice;
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  joinRequest,
  joinSuccess,
  joinFailure,
  loadMyInfoRequest,
  loadMyInfoSuccess,
  loadMyInfoFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  addPostToMe,
  removeImage,
  removePostToMe,
  userChangeRequest,
  userChangeSuccess,
  userChangeFailure,
  passwordChangeRequest,
  passwordChangeSuccess,
  passwordChangeFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  userImageRequest,
  userImageSuccess,
  userImageFailure,
  loadOtherUserInfoRequest,
  loadOtherUserInfoSuccess,
  loadOtherUserInfoFailure,
  followRequest,
  followSuccess,
  followFailure,
  unFollowRequest,
  unFollowSuccess,
  unFollowFailure,
  loadUserFollowingsRequest,
  loadUserFollowingsSuccess,
  loadUserFollowingsFailure,
  loadUserUnFollowersRequest,
  loadUserUnFollowersSuccess,
  loadUserUnFollowersFailure,
} = actions;

export default reducer;
