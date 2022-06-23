'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// const tabs = document.querySelectorAll('.operations__tab');
// const tabsContainer = document.querySelector('.operations__tab-container');
// const tabsContent = document.querySelectorAll('.operations__content');
const allSections = document.querySelectorAll('.section');
allSections.forEach(section => section.classList.add('section--hidden'));//nasconde le sezioni al caricamento dell pagina


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

console.log('event delegation, implementing page navigation');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('Height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);


  //new way scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation
// document.querySelectorAll('.nav__link').forEach(function (element) {
//   element.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     // e.scrollIntoView({ behavior: 'smooth' });
//   });
// });

// add event listener to common parent element
// determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});


//navbar fade animation
const navbarParent = document.querySelector('.nav');
// const links = navbarParent.querySelectorAll('.nav__link');
// const logo = navbarParent.querySelector('img');

// function mouseHoverNav (link, opacity) {
//   links.forEach((el) => {
//     if (el !== link) el.style.opacity = opacity;
//   });
//   logo.style.opacity = opacity;
// }

// navbarParent.addEventListener('mouseover', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     mouseHoverNav(link, 0.5);
//   }
// });
// navbarParent.addEventListener('mouseout', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     mouseHoverNav(link, 1);
//   }
// });


//advanced refactoring navbar fade animation
//      utilizzo di bind per passare "argomenti" alla funzione delle'event listener

function handleHover (e) {

  // console.log('this', this);
  // console.log('e.currentTarget', e.currentTarget);
  // console.log('e.target', e.target);

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const links = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    links.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

navbarParent.addEventListener('mouseover', handleHover.bind(0.5));
navbarParent.addEventListener('mouseout', handleHover.bind(1));



//sticky navigation, old implementation
const coordsSection1 = section1.getBoundingClientRect();
const navbarHeight = navbarParent.getBoundingClientRect().height;

// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);
//   if (window.scrollY >= coordsSection1.top) navbarParent.classList.add('sticky');
//   else navbarParent.classList.remove('sticky');
// });

// function obsCallback (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// } //when the conditions are met, this function is called

// const obsOptions = {
//   root: null, //element intercepted by the target(null=> viewport)
//   threshold: [0, 0.2],//percentage of interception of the observer(0=>0% of the target is visible in the viewport,1=> 100% of the target is visible in the viewport)
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);


//sticky navigation bar with intersection observer API
function stickyNav (entries) {
  const [entry] = entries;
  // console.log(entry.target, entry.isIntersecting);
  if (!entry.isIntersecting) navbarParent.classList.add('sticky');
  else navbarParent.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //rootMargin: '-90px'//height of the navbar, not responsive
  rootMargin: `-${navbarHeight}px`
});

headerObserver.observe(header);





//reveal sections on scroll
// const allSections = document.querySelectorAll('.section');

function revealSection (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target.id, entry.target.classList[1]);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});





//lazy loading images
const allImages = document.querySelectorAll('img[data-src]');
console.log(allImages);

function loadImg (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  //sostituzione delle lazy loaded images, sostituire il valore di src attribute con il valore di data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {//togliere il blur dalle immagini non appena si siano effettivamente caricate
    entry.target.classList.remove('lazy-img');
  });
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

allImages.forEach(img => {
  imgObserver.observe(img);
});

//tabbed components
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(function (el) {
//   el.addEventListener('click', () => console.log('tab clicked'));//poco efficiente, preferibile event delegation sul parent
// });

tabsContainer.addEventListener('click', function (el) {
  const clicked = el.target.closest('.operations__tab');

  if (!clicked) return;//if no clicked element, guard clause
  // console.log(clicked);

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));//deactivate all tabs
  clicked.classList.add('operations__tab--active');//activate only the clicked tab

  //activate content area
  const tab = clicked.getAttribute('data-tab');
  // const tab = clicked.dataset.tab;
  // console.log(tab);

  // const clickedContent = `${tabsContent}--${tab}`;
  // console.log(clickedContent);

  tabsContent.forEach(tabs => tabs.classList.remove('operations__content--active'));//deactivate all tabs content
  document.querySelector(`.operations__content--${tab}`).classList.add('operations__content--active');//activate only the clicked tab content
});









/////////////////////////////////////////////////////
console.log('------');

console.log('selecting, creating and deleting elements');

//selecting items
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);


console.log(document.querySelector('.header'));
// const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//creating and inserting elements

const message = document.createElement('div');
message.classList.add('cookie-message');

// message.textContent = 'We use cookies just for spying on you';
message.innerHTML = 'We use cookies just for spying on you.<button class="btn btn--close--cookie">Thank you internet</button>';

header.prepend(message);
// header.append(message.cloneNode(true));
// header.append(message);

// header.before(message);
// header.after(message.cloneNode(true));

document.querySelector('.btn--close--cookie').addEventListener('click', function () {
  message.remove();
  // message.parentElement.removeChild(message);
});
console.log('------');

console.log('styles, attribute and classes');
//styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
console.log(message.style.height);
console.log(getComputedStyle(message).height);
console.log(message.style.backgroundColor);
message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
console.log(getComputedStyle(message).height);

document.documentElement.style.setProperty('--color-primary', 'orangered');
console.log('');
//Attributes
// const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
logo.setAttribute('alt', 'much logo, such minimalism');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.getAttribute('src'));
console.log(logo.className);
console.log(logo.getAttribute('designer'));
console.log('');
const linkTwitter = document.querySelector('.twitter-link');
console.log(linkTwitter.href);
console.log(linkTwitter.getAttribute('href'));

const navlink = document.querySelector('.nav__link--btn');
console.log(navlink.href);
console.log(navlink.getAttribute('href'));
console.log('');

//data attributes
console.log(logo.dataset.versionNumber);

//classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// logo.className = 'jonas';//non usare, sovrascrive le classi già presenti
console.log('------');

console.log('implementing smooth scrolling');
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');


// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   // console.log(e.target.getBoundingClientRect());

//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

//   console.log('Height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

//   //old way scrolling  
//   // window.scrollTo(s1coords.left, s1coords.top);//relative to the start of the page, if clicked elsewhere doesn't work

//   // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth'
//   // });

//   //new way scrolling
//   section1.scrollIntoView({ behavior: 'smooth' });
// });
console.log('------');

console.log('events');

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('bro addeventlistener, che caBBo fai');
  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1); //new way, chaining is possible, without overwriting

// h1.onmouseenter = alertH1 //old way

setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 1000);
console.log('------');

console.log('bubbling and capturing events');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
//   console.log(e.target === e.currentTarget);//uguali
//   // e.stopPropagation()//possibile interrompere la propagazione dell'effetto, ma rischioso e poco usato
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
//   console.log(e.target === e.currentTarget);//diversi
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
//   console.log(e.target === e.currentTarget);//diversi
// });
console.log('------');

console.log('event delegation, implementing page navigation');


console.log('------');

console.log('dom traversing');

//going downwards:child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);//figli intesi come elementi tra testo, tag, commenti
console.log(h1.children);//figli intesi come elementi html veri e propri
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//going upwards:parents
console.log(h1.parentNode);
console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

//going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);//nodes
console.log(h1.nextSibling);

console.log(h1.parentElement.children); //all siblings, h1, included

[...h1.parentElement.children].forEach(function (el) {//spreading elements and applying a transformation with foreach
  // if (el !== h1) el.style.transform = 'scale(0.5)';
});
console.log('------');

console.log();
console.log();
console.log();
console.log('------');