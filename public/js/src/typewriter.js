export default class Typewriter {
  constructor(element, words, pause, speed) {
    this.element = element;
    this.words = words;
    this.text = this.element.querySelector('.typewriter-word');
    this.cursor = document.querySelector('.typewriter-cursor');
    this.currentWord = 0;
    this.currentLetter = 0;
    this.pause = pause;
    this.speed = speed;
    this.isDeleting = false;

    setInterval(() => {
      this.blink();
    }, 500);
  }

  type() {
    let txt;

    if (this.isDeleting) {
      this.currentLetter--;
    } else {
      this.currentLetter++;
    }

    txt = this.words[this.currentWord].slice(0, this.currentLetter);
    this.text.textContent = txt;

    let typeSpeed = this.speed;
    if (this.isDeleting) typeSpeed = typeSpeed / 2;

    // When word is complete
    if (
      !this.isDeleting &&
      txt.length === this.words[this.currentWord].length
    ) {
      typeSpeed = this.pause;
      this.isDeleting = true;
    } else if (this.isDeleting && txt === '') {
      this.isDeleting = false;
      this.currentWord++;
      if (this.currentWord >= this.words.length) this.currentWord = 0;
      typeSpeed = this.pause / 3;
    }
    this.blink();
    setTimeout(() => this.type(), typeSpeed);
  }

  blink() {
    // This instead of toggle, because then we can trigger blink when typing

    if (this.cursor.classList.contains('active')) {
      this.cursor.classList.remove('active');
    } else {
      this.cursor.classList.add('active');
    }
  }
}
