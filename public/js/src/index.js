import { searchPosts } from './files/searchPosts';

const burger = document.querySelector('.burger');
const searchForms = document.querySelectorAll('.search-form');

if (burger) {
  const menu = document.querySelector('.menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger--active');
    menu.classList.toggle('menu--active');
  });
}

if (searchForms) {
  searchForms.forEach((form) => form.addEventListener('submit', searchPosts));
}
