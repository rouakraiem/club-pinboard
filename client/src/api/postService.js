import axiosClient from "./axiosClient";

export const getPosts = () => axiosClient.get("/posts").then((r) => r.data);
export const getPost = (id) => axiosClient.get(`/posts/${id}`).then((r) => r.data);
export const createPost = (data) => axiosClient.post("/posts", data).then((r) => r.data);
export const updatePostById = (id, data) => axiosClient.put(`/posts/${id}`, data).then((r) => r.data);
export const deletePost = (id) => axiosClient.delete(`/posts/${id}`);
