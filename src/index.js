import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { simpleLightbox } from './js.js/simpleLightbox';

import { fetchApi } from './js.js/fetchApi';

let page = 1;
// let perPage = 40;
// let search = dog;
let inputForm = '';
//

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
btnLoadMore.addEventListener('click', onLoad);

function onSearchForm(evt) {
  evt.preventDefault();

  btnLoadMore.classList.add('hidden');
  const newInputForm = evt.currentTarget.searchQuery.value.trim();
  //
  if (inputForm !== newInputForm) {
    inputForm = newInputForm;
    gallery.innerHTML = '';
    fetchApi(inputForm).then(data => {
      markupGallery(data);
      simpleLightbox.refresh();
      btnLoadMore.classList.remove('hidden');
    });
  }
  // else if (!searchForm) {
  //   Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // }
  // if (inputForm !== newInputForm) {
}

function markupGallery({ data: { hits, total } }) {
  const markup = hits.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
      return (acc += `<div class="photo-card">
    <a  class="photo__link" href="${largeImageURL}">
  <img  class="photo__img" src="${webformatURL}" alt="${tags}" loading="lazy"  />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`);
    },
    ''
  );

  gallery.insertAdjacentHTML('beforeend', markup);
  Notify.success(`Hooray! We found ${total} images.`);
}

function onLoad() {
  page += 1;

  fetchApi(searchForm.searchQuery.value.trim(), page).then(data => {
    console.log(data);
    markupGallery(data);
    simpleLightbox.refresh();
  });
  // if () {

  // }
  //Notify.success( "We're sorry, but you've reached the end of search results.");
}
