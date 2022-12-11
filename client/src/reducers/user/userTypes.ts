export interface JoinProps {
  email: string;
  password: string;
  name: string;
  nickname: string;
}
export interface loginProps {
  email: string;
  password: string;
}
export interface Post {
  id: number;
}

export interface Image {
  id: number;
  src: string;
  createdAt: Date;
  updatedAt: Date;
  PostId: null;
  UserId: number;
}
export interface OtherUserInfo {
  id: number;
  name: string;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  Posts: number;
  Followings: number;
  Followers: number;
  Image: Image;
}
export interface FollowProps {
  createdAt: Date;
  updatedAt: Date;
  FollowingId: number;
  FollowerId: number;
}
export interface MyFollow {
  id: number;
  nickname: string;
  Follow: FollowProps;
}
export interface MyInfo {
  id: number;
  name: string;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  Posts: Post[];
  Followings: any[];
  Followers: any[];
  Image: null;
}
export interface Follow {
  id: number;
  name: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  Image: Image;
}
export interface UserChangeProps {
  data: FormData;
  UserId: number;
}

export interface EditPasswordProps {
  currentPassword: string;
  changePassword: string;
  newPasswordOk: string;
}
export interface FollowSuccess {
  UserId: number;
}
export interface LoadUserFollow {
  id: number;
  name: string;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  Image: Image;
}
export interface UserState {
  me?: MyInfo | null;
  userInfo?: OtherUserInfo | null;
  imagePaths: string[];
  Followings: LoadUserFollow[];
  Followers: LoadUserFollow[];

  logInLoading: boolean;
  logInDone: boolean;
  loginError: string | null | unknown;
  joinLoading: boolean;
  joinDone: boolean;
  joinError: string | null | unknown;
  logoutLoading: boolean;
  logoutDone: boolean;
  logoutError: string | null | unknown;

  loadMyInfoLoading: boolean;
  loadMyInfoDone: boolean;
  loadMyInfoError: string | null | unknown;

  userChangeLoading: boolean;
  userChangeDone: boolean;
  userChangeError: string | null | unknown;

  passwordChangeLoading: boolean;
  passwordChangeDone: boolean;
  passwordChangeError: string | null | unknown;

  deleteUserLoading: boolean;
  deleteUserDone: boolean;
  deleteUserError: string | null | unknown;

  userImageLoading: boolean;
  userImageDone: boolean;
  userImageError: string | null | unknown;

  loadOtherUserInfoLoading: boolean;
  loadOtherUserInfoDone: boolean;
  loadOtherUserInfoError: string | null | unknown;

  followLoading: boolean;
  followDone: boolean;
  followError: string | null | unknown;

  unFollowLoading: boolean;
  unFollowDone: boolean;
  unFollowError: string | null | unknown;

  loadUserFollowingsLoading: boolean;
  loadUserFollowingsDone: boolean;
  loadUserFollowingsError: string | null | unknown;

  loadUserUnFollowersLoading: boolean;
  loadUserUnFollowersDone: boolean;
  loadUserUnFollowersError: string | null | unknown;
}
export const initialState: UserState = {
  me: null,
  userInfo: null,
  Followings: [],
  Followers: [],
  imagePaths: [],

  logInLoading: false,
  logInDone: false,
  loginError: null,

  joinLoading: false,
  joinDone: false,
  joinError: null,

  logoutLoading: false,
  logoutDone: false,
  logoutError: null,

  loadMyInfoLoading: false,
  loadMyInfoDone: false,
  loadMyInfoError: null,

  userChangeLoading: false,
  userChangeDone: false,
  userChangeError: null,

  passwordChangeLoading: false,
  passwordChangeDone: false,
  passwordChangeError: null,

  deleteUserLoading: false,
  deleteUserDone: false,
  deleteUserError: null,

  userImageLoading: false,
  userImageDone: false,
  userImageError: null,

  loadOtherUserInfoLoading: false,
  loadOtherUserInfoDone: false,
  loadOtherUserInfoError: null,

  followLoading: false,
  followDone: false,
  followError: null,
  unFollowLoading: false,
  unFollowDone: false,
  unFollowError: null,

  loadUserFollowingsLoading: false,
  loadUserFollowingsDone: false,
  loadUserFollowingsError: null,

  loadUserUnFollowersLoading: false,
  loadUserUnFollowersDone: false,
  loadUserUnFollowersError: null,
};
