import axiosClient from "./axiosClient";

export const getComments = (postId) => axiosClient.get(`/comments/post/${postId}`).then((r) => r.data);
export const createComment = (data) => axiosClient.post("/comments", data).then((r) => r.data);
export const deleteComment = (id) => axiosClient.delete(`/comments/${id}`);
