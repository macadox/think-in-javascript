import dompurify from 'dompurify';

export const searchPosts = (e) => {
  e.preventDefault();
  const query = dompurify.sanitize(e.target.search.value);

  window.location.assign(`/search?q=${query}`);
};
