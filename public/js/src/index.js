import { searchPosts } from './files/searchPosts';
import Typewriter from './typewriter';

const burger = document.querySelector('.burger');
const searchForms = document.querySelectorAll('.search-form');
const heroSubtitle = document.querySelector('.hero__subtitle');

if (heroSubtitle) {
  const words = ['Developer', 'Designer', 'Freelancer'];
  const pause = 3000;
  const speed = 150;
  const typewriter = new Typewriter(heroSubtitle, words, pause, speed);

  typewriter.type();
}

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
