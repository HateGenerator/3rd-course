export let comments = [];

export const updateComments = (newComments) => {
  comments = newComments.map(comment => ({
    ...comment,
    isLikeLoading: false,
  }));
};