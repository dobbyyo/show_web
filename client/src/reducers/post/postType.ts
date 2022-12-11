/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostHashtag {
  createdAt: Date;
  updatedAt: Date;
  PostId: number;
  HashtagId: number;
}
export interface Hashtag {
  id: number;
  name: string;
  PostHashtag: PostHashtag;
}
export interface Image {
  id: number;
  src: string;
  createdAt: Date;
  updatedAt: Date;
  PostId: number | null;
  UserId: number | null;
}

export interface User {
  id: number;
  nickname: string;
  email: string;
  Image: Image;
}

export interface Like {
  createdAt: Date;
  updatedAt: Date;
  PostId: number | null;
  UserId: number | null;
}
export interface Liker {
  id: number;
  nickname: string;
  Like: Like;
}
export interface LikeProps {
  UserId?: number;
  PostId?: number;
  content?: string;
}
export interface CommentUser {
  id: number;
  nickname: string;
}
export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: string;
  PostId: number;
  UserId: number;
  User: CommentUser;
}
export interface CommentProps {
  userId: number;
  postId: number;
  content: string;
  commentId?: string;
}
export interface CommentSuccess {
  commentId: number;
}
export interface CommentUpdate {
  commentId: number;
  content: string;
}
export interface PostsProps {
  id: number;
  title: string;
  content: string;
  activityName: string;
  searchName: string;
  kinds: string;
  createdAt: any;
  updatedAt: Date;
  UserId: number;
  User: User;
  Images: Image[];
  Comments: any[];
  Likers: any[];
  Hashtags: Hashtag[];
  Saver: any[];
}
export interface OtherPosts {
  id: number;
  lastId?: number | null;
}
export interface search {
  title: string;
  lastId?: number;
}
export interface categoryProps {
  category: string;
  lastId?: number;
}
export interface HashProps {
  tag: string;
  lastId?: number;
}
export interface updatePost {
  data: FormData;
  PostId: number;
}
export interface PostState {
  mainPosts: PostsProps[];
  savedPosts: PostsProps[];
  categoryPosts: PostsProps[];
  imagePaths: string[];
  singlePost: PostsProps | null;

  morePosts: boolean;

  addPostLoading: boolean;
  addPostDone: boolean;
  addPostError: string | null | unknown;

  removePostLoading: boolean;
  removePostDone: boolean;
  removePostError: string | null | unknown;

  addImagesLoading: boolean;
  addImagesDone: boolean;
  addImagesError: string | null | unknown;

  removeImagesLoading: boolean;
  removeImagesDone: boolean;
  removeImagesError: string | null | unknown;

  loadPostsLoading: boolean;
  loadPostsDone: boolean;
  loadPostsError: string | null | unknown;

  loadKoreaPostsLoading: boolean;
  loadKoreaPostsDone: boolean;
  loadKoreaPostsError: string | null | unknown;

  loadJapanPostsLoading: boolean;
  loadJapanPostsDone: boolean;
  loadJapanPostsError: string | null | unknown;

  loadEuPostsLoading: boolean;
  loadEuPostsDone: boolean;
  loadEuPostsError: string | null | unknown;

  loadChinaPostsLoading: boolean;
  loadChinaPostsDone: boolean;
  loadChinaPostsError: string | null | unknown;

  loadPostLoading: boolean;
  loadPostDone: boolean;
  loadPostError: string | null | unknown;

  likePostLoading: boolean;
  likePostDone: boolean;
  likePostError: string | null | unknown;

  unLikePostLoading: boolean;
  unLikePostDone: boolean;
  unLikePostError: string | null | unknown;

  addCommentLoading: boolean;
  addCommentDone: boolean;
  addCommentError: string | null | unknown;

  removeCommentLoading: boolean;
  removeCommentDone: boolean;
  removeCommentError: string | null | unknown;

  updateCommentLoading: boolean;
  updateCommentDone: boolean;
  updateCommentError: string | null | unknown;

  savePostLoading: boolean;
  savePostDone: boolean;
  savePostError: string | null | unknown;

  removeSavePostLoading: boolean;
  removeSavePostDone: boolean;
  removeSavePostError: string | null | unknown;

  loadHashtagPostsLoading: boolean;
  loadHashtagPostsDone: boolean;
  loadHashtagPostsError: string | null | unknown;

  loadOtherUserPostsLoading: boolean;
  loadOtherUserPostsDone: boolean;
  loadOtherUserPostsError: string | null | unknown;

  loadSavePostsLoading: boolean;
  loadSavePostsDone: boolean;
  loadSavePostsError: string | null | unknown;

  searchPostsLoading: boolean;
  searchPostsDone: boolean;
  searchPostsError: string | null | unknown;

  loadCategoryPostsLoading: boolean;
  loadCategoryPostsDone: boolean;
  loadCategoryPostsError: string | null | unknown;

  updatePostLoading: boolean;
  updatePostDone: boolean;
  updatePostError: string | null | unknown;
}

export const initialState: PostState = {
  mainPosts: [],
  savedPosts: [],
  categoryPosts: [],

  imagePaths: [],
  singlePost: null,

  morePosts: true,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  addImagesLoading: false,
  addImagesDone: false,
  addImagesError: null,

  removeImagesLoading: false,
  removeImagesDone: false,
  removeImagesError: null,

  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,

  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,

  likePostLoading: false,
  likePostDone: false,
  likePostError: null,

  unLikePostLoading: false,
  unLikePostDone: false,
  unLikePostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,

  removeCommentLoading: false,
  removeCommentDone: false,
  removeCommentError: null,

  updateCommentLoading: false,
  updateCommentDone: false,
  updateCommentError: null,

  loadKoreaPostsLoading: false,
  loadKoreaPostsDone: false,
  loadKoreaPostsError: null,

  loadJapanPostsLoading: false,
  loadJapanPostsDone: false,
  loadJapanPostsError: null,

  loadEuPostsLoading: false,
  loadEuPostsDone: false,
  loadEuPostsError: null,

  loadChinaPostsLoading: false,
  loadChinaPostsDone: false,
  loadChinaPostsError: null,

  savePostLoading: false,
  savePostDone: false,
  savePostError: null,

  removeSavePostLoading: false,
  removeSavePostDone: false,
  removeSavePostError: null,

  loadHashtagPostsLoading: false,
  loadHashtagPostsDone: false,
  loadHashtagPostsError: null,

  loadOtherUserPostsLoading: false,
  loadOtherUserPostsDone: false,
  loadOtherUserPostsError: null,

  loadSavePostsLoading: false,
  loadSavePostsDone: false,
  loadSavePostsError: null,

  searchPostsLoading: false,
  searchPostsDone: false,
  searchPostsError: null,

  loadCategoryPostsLoading: false,
  loadCategoryPostsDone: false,
  loadCategoryPostsError: null,

  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
};
