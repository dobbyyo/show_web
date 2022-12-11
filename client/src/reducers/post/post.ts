/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Comment,
  CommentProps,
  CommentSuccess,
  CommentUpdate,
  initialState,
  LikeProps,
  OtherPosts,
  PostsProps,
  updatePost,
} from './postType';

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // ADD POST
    addPostRequest: (state, _action: PayloadAction<FormData>) => {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    addPostSuccess: (state, action: PayloadAction<PostsProps>) => {
      state.addPostLoading = false;
      state.addPostDone = true;
      state.addPostError = null;
      state.mainPosts.unshift(action.payload);
      state.imagePaths = [];
    },
    addPostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.addPostLoading = false;
      state.addPostDone = false;
      state.addPostError = action.payload;
    },

    // Remove POST
    removePostRequest: (state, _action: PayloadAction<number>) => {
      state.removePostLoading = true;
      state.removePostDone = false;
      state.removePostError = null;
    },
    removePostSuccess: (state, action: PayloadAction<LikeProps>) => {
      state.removePostLoading = false;
      state.removePostDone = true;
      state.removePostError = null;
      state.mainPosts = state.mainPosts.filter((v) => v.id !== action.payload.PostId);
    },
    removePostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.removePostLoading = false;
      state.removePostDone = false;
      state.removePostError = action.payload;
    },

    // POST IMAGES ADD
    addImagesRequest: (state, _action: PayloadAction<FormData>) => {
      state.addImagesLoading = true;
      state.addImagesDone = false;
      state.addImagesError = null;
    },
    addImagesSuccess: (state, action: PayloadAction<string[]>) => {
      state.addImagesLoading = false;
      state.addImagesDone = true;
      state.addImagesError = null;
      state.imagePaths = state.imagePaths.concat(action.payload);
    },
    addImagesFailure: (state, action: PayloadAction<string | unknown>) => {
      state.addImagesLoading = false;
      state.addImagesDone = false;
      state.addImagesError = action.payload;
    },

    // LOAD POSTS
    loadPostsRequest: (state, _action?: PayloadAction<number | null>) => {
      state.loadPostsLoading = true;
      state.loadPostsDone = false;
      state.loadPostsError = null;
    },
    loadPostsSuccess: (state, action: PayloadAction<PostsProps[]>) => {
      state.loadPostsLoading = false;
      state.loadPostsDone = true;
      state.loadPostsError = null;
      state.mainPosts = state.mainPosts.concat(action.payload);
      state.morePosts = action.payload.length === 5;
    },
    loadPostsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadPostsLoading = false;
      state.loadPostsDone = false;
      state.loadPostsError = action.payload;
    },

    // LOAD POST
    loadPostRequest: (state, _action: PayloadAction<number>) => {
      state.loadPostLoading = true;
      state.loadPostDone = false;
      state.loadPostError = null;
    },
    loadPostSuccess: (state, action: PayloadAction<PostsProps>) => {
      state.loadPostLoading = false;
      state.loadPostDone = true;
      state.loadPostError = null;
      state.singlePost = action.payload;
    },
    loadPostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadPostLoading = false;
      state.loadPostDone = false;
      state.loadPostError = action.payload;
    },

    // LIKE POST
    likePostRequest: (state, _action: PayloadAction<number>) => {
      state.likePostLoading = true;
      state.likePostDone = false;
      state.likePostError = null;
    },
    likePostSuccess: (state, action: PayloadAction<LikeProps>) => {
      state.likePostLoading = false;
      state.likePostDone = true;
      state.likePostError = null;
      const post = state.mainPosts.find((v) => v.id === action.payload.PostId);
      if (post) {
        post.Likers.push({ id: action.payload.UserId });
      }
    },
    likePostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.likePostLoading = false;
      state.likePostDone = false;
      state.likePostError = action.payload;
    },

    // UNLIKE POST
    unLikePostRequest: (state, _action: PayloadAction<number>) => {
      state.unLikePostLoading = true;
      state.unLikePostDone = false;
      state.unLikePostError = null;
    },
    unLikePostSuccess: (state, action: PayloadAction<LikeProps>) => {
      state.unLikePostLoading = false;
      state.unLikePostDone = true;
      state.unLikePostError = null;
      const post = state.mainPosts.find((v) => v.id === action.payload.PostId);
      if (post) {
        post.Likers = post.Likers.filter((v) => v.id !== action.payload.UserId);
      }
    },
    unLikePostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.unLikePostLoading = false;
      state.unLikePostDone = false;
      state.unLikePostError = action.payload;
    },

    // ADD COMMENT
    addCommentRequest: (state, _action: PayloadAction<CommentProps>) => {
      state.addCommentLoading = true;
      state.addCommentDone = false;
      state.addCommentError = null;
    },
    addCommentSuccess: (state, action: PayloadAction<Comment>) => {
      state.addCommentLoading = false;
      state.addCommentDone = true;
      state.addCommentError = null;
      const post = state.singlePost;
      if (post) {
        post.Comments.unshift(action.payload);
      }
    },
    addCommentFailure: (state, action: PayloadAction<string | unknown>) => {
      state.addCommentLoading = false;
      state.addCommentDone = false;
      state.addCommentError = action.payload;
    },

    // REMOVE COMMENT
    removeCommentRequest: (state, _action: PayloadAction<number>) => {
      state.removeCommentLoading = true;
      state.removeCommentDone = false;
      state.removeCommentError = null;
    },
    removeCommentSuccess: (state, action: PayloadAction<CommentSuccess>) => {
      state.removeCommentLoading = false;
      state.removeCommentDone = true;
      state.removeCommentError = null;
      const post = state.singlePost;
      if (post) {
        post.Comments = post.Comments.filter((v: Comment) => v.id !== action.payload.commentId);
      }
    },
    removeCommentFailure: (state, action: PayloadAction<string | unknown>) => {
      state.removeCommentLoading = false;
      state.removeCommentDone = false;
      state.removeCommentError = action.payload;
    },

    // UPDATE COMMENT
    updateCommentRequest: (state, _action: PayloadAction<CommentUpdate>) => {
      state.updateCommentLoading = true;
      state.updateCommentDone = false;
      state.updateCommentError = null;
    },
    updateCommentSuccess: (state, action: PayloadAction<CommentUpdate>) => {
      state.updateCommentLoading = false;
      state.updateCommentDone = true;
      state.updateCommentError = null;
      const post = state.singlePost;
      if (post && post.Comments.find((v: Comment) => v.id === action.payload.commentId)) {
        post.Comments.find((v: Comment) => v.id === action.payload.commentId).content = action.payload.content;
      }
    },
    updateCommentFailure: (state, action: PayloadAction<string | unknown>) => {
      state.updateCommentLoading = false;
      state.updateCommentDone = false;
      state.updateCommentError = action.payload;
    },

    // SAVE POST
    savePostRequest: (state, _action: PayloadAction<number>) => {
      state.savePostLoading = true;
      state.savePostDone = false;
      state.savePostError = null;
    },
    savePostSuccess: (state, action: PayloadAction<LikeProps>) => {
      state.savePostLoading = false;
      state.savePostDone = true;
      state.savePostError = null;
      const post = state.singlePost;
      if (post) {
        post.Saver.push({ id: action.payload.UserId });
      }
    },
    savePostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.savePostLoading = false;
      state.savePostDone = false;
      state.savePostError = action.payload;
    },

    // REMOVE SAVE POST
    removeSavePostRequest: (state, _action: PayloadAction<number>) => {
      state.removeSavePostLoading = true;
      state.removeSavePostDone = false;
      state.removeSavePostError = null;
    },
    removeSavePostSuccess: (state, action: PayloadAction<LikeProps>) => {
      state.removeSavePostLoading = false;
      state.removeSavePostDone = true;
      state.removeSavePostError = null;
      const post = state.singlePost;
      if (post) {
        post.Saver = post.Saver.filter((v: PostsProps) => v.id !== action.payload.UserId);
      }
    },
    removeSavePostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.removeSavePostLoading = false;
      state.removeSavePostDone = false;
      state.removeSavePostError = action.payload;
    },

    // LOAD OTHER USER POSTS
    loadOtherUserPostsRequest: (state, _action: PayloadAction<OtherPosts>) => {
      state.loadOtherUserPostsLoading = true;
      state.loadOtherUserPostsDone = false;
      state.loadOtherUserPostsError = null;
    },
    loadOtherUserPostsSuccess: (state, action: PayloadAction<PostsProps[]>) => {
      state.loadOtherUserPostsLoading = false;
      state.loadOtherUserPostsDone = true;
      state.loadOtherUserPostsError = null;
      state.mainPosts = state.mainPosts.concat(action.payload);
      state.morePosts = action.payload.length === 5;
    },
    loadOtherUserPostsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadOtherUserPostsLoading = false;
      state.loadOtherUserPostsDone = false;
      state.loadOtherUserPostsError = action.payload;
    },

    // LOAD SAVE POSTS
    loadSavePostsRequest: (state, _action: PayloadAction<number | null>) => {
      state.loadSavePostsLoading = true;
      state.loadSavePostsDone = false;
      state.loadSavePostsError = null;
    },
    loadSavePostsSuccess: (state, action: PayloadAction<PostsProps[]>) => {
      state.loadSavePostsLoading = false;
      state.loadSavePostsDone = true;
      state.loadSavePostsError = null;
      state.savedPosts = state.savedPosts.concat(action.payload);
      state.morePosts = action.payload.length === 5;
    },
    loadSavePostsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadSavePostsLoading = false;
      state.loadSavePostsDone = false;
      state.loadSavePostsError = action.payload;
    },

    // SEARCH POSTS
    searchPostsRequest: (state, _action: PayloadAction<any>) => {
      state.searchPostsLoading = true;
      state.searchPostsDone = false;
      state.searchPostsError = null;
    },
    searchPostsSuccess: (state, action: PayloadAction<PostsProps[]>) => {
      state.searchPostsLoading = false;
      state.searchPostsDone = true;
      state.searchPostsError = null;
      state.mainPosts = state.mainPosts.concat(action.payload);
      state.morePosts = action.payload.length === 5;
    },
    searchPostsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.searchPostsLoading = false;
      state.searchPostsDone = false;
      state.searchPostsError = action.payload;
    },

    // LOAD CATEGORY POSTS
    loadCategoryPostsRequest: (state, _action: PayloadAction<any>) => {
      state.loadCategoryPostsLoading = true;
      state.loadCategoryPostsDone = false;
      state.loadCategoryPostsError = null;
    },
    loadCategoryPostsSuccess: (state, action: PayloadAction<PostsProps[]>) => {
      state.loadCategoryPostsLoading = false;
      state.loadCategoryPostsDone = true;
      state.loadCategoryPostsError = null;
      state.categoryPosts = state.categoryPosts.concat(action.payload);
      state.morePosts = action.payload.length === 5;
    },
    loadCategoryPostsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadCategoryPostsLoading = false;
      state.loadCategoryPostsDone = false;
      state.loadCategoryPostsError = action.payload;
    },

    // UPDATE POST
    updatePostRequest: (state, _action: PayloadAction<updatePost>) => {
      state.updatePostLoading = true;
      state.updatePostDone = false;
      state.updatePostError = null;
    },
    updatePostSuccess: (state, action: PayloadAction<PostsProps>) => {
      console.log(action);
      state.updatePostLoading = false;
      state.updatePostDone = true;
      state.updatePostError = null;
      state.singlePost = action.payload;
      if (state.singlePost) {
        state.singlePost.Images = action.payload.Images;
      }
    },
    updatePostFailure: (state, action: PayloadAction<string | unknown>) => {
      state.updatePostLoading = false;
      state.updatePostDone = false;
      state.updatePostError = action.payload;
    },

    // GET HASHTAG POSTS
    loadHashtagPostsRequest: (state, _action: PayloadAction<any>) => {
      state.loadHashtagPostsLoading = true;
      state.loadHashtagPostsDone = false;
      state.loadHashtagPostsError = null;
    },
    loadHashtagPostsSuccess: (state, action: PayloadAction<PostsProps[]>) => {
      state.loadHashtagPostsLoading = false;
      state.loadHashtagPostsDone = true;
      state.loadHashtagPostsError = null;
      state.mainPosts = state.mainPosts.concat(action.payload);
      state.morePosts = action.payload.length === 5;
    },
    loadHashtagPostsFailure: (state, action: PayloadAction<string | unknown>) => {
      state.loadHashtagPostsLoading = false;
      state.loadHashtagPostsDone = false;
      state.loadHashtagPostsError = action.payload;
    },

    // REMOVE IMAGES
    removeImages: (state, action: PayloadAction<number>) => {
      state.imagePaths = state.imagePaths.filter((v, i) => i !== action.payload);
    },
  },
});

const { reducer, actions } = postSlice;

export const {
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  removePostRequest,
  removePostSuccess,
  removePostFailure,
  addImagesRequest,
  addImagesSuccess,
  addImagesFailure,
  removeImages,
  loadPostsSuccess,
  loadPostsRequest,
  loadPostsFailure,
  loadPostRequest,
  loadPostSuccess,
  loadPostFailure,
  likePostRequest,
  likePostSuccess,
  likePostFailure,
  unLikePostRequest,
  unLikePostSuccess,
  unLikePostFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  removeCommentRequest,
  removeCommentSuccess,
  removeCommentFailure,
  updateCommentRequest,
  updateCommentSuccess,
  updateCommentFailure,
  savePostRequest,
  savePostSuccess,
  savePostFailure,
  removeSavePostRequest,
  removeSavePostSuccess,
  removeSavePostFailure,
  loadOtherUserPostsRequest,
  loadOtherUserPostsSuccess,
  loadOtherUserPostsFailure,
  loadSavePostsRequest,
  loadSavePostsSuccess,
  loadSavePostsFailure,
  searchPostsRequest,
  searchPostsSuccess,
  searchPostsFailure,
  loadCategoryPostsRequest,
  loadCategoryPostsSuccess,
  loadCategoryPostsFailure,
  updatePostRequest,
  updatePostSuccess,
  updatePostFailure,
  loadHashtagPostsRequest,
  loadHashtagPostsSuccess,
  loadHashtagPostsFailure,
} = actions;

export default reducer;
