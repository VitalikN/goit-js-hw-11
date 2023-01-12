import { fetchApi } from './js.js/fetchApi';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { simpleLightbox } from './js.js/simpleLightbox';
let page = 1;
// let perPage = 40;
// let search = dog;
// let inputForm = '';
//

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
btnLoadMore.addEventListener('click', onLoad);

function onSearchForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';

  fetchApi(evt.currentTarget.searchQuery.value.trim())
    .then(data => {
      markupGallery(data);
      simpleLightbox.refresh();
    })
    .catch(err => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
  setTimeout(() => {
    btnLoadMore.classList.remove('hidden');
  }, 1500);
}

function markupGallery({ data: { hits, totalHits } }) {
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
  Notify.success(`Hooray! We found ${totalHits} images.`);
  gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoad() {
  page += 1;

  fetchApi(page).then(data => {
    console.log(data);
    markupGallery(data);
    simpleLightbox.refresh();
  });
  //Notify.success( "We're sorry, but you've reached the end of search results.");
}
