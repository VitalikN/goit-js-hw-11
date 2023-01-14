import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { simpleLightbox } from './js.js/simpleLightbox';

import { fetchApi } from './js.js/fetchApi';

let pages = 1;
let page = 1;
let perPage = 40;

let inputForm = '';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
btnLoadMore.addEventListener('click', onLoadMarkupGallery);

async function onSearchForm(evt) {
  evt.preventDefault();
  const newInputForm = evt.currentTarget.searchQuery.value.trim();

  if (inputForm !== newInputForm) {
    inputForm = newInputForm;
    onCleanGallery();
  }
  if (inputForm || pages >= page) {
    await onLoadMarkupGallery();
    simpleLightbox.refresh();
  }
  if (!newInputForm) {
    btnLoadMore.classList.add('hidden');
  }
}

function onCleanGallery() {
  gallery.innerHTML = '';
  btnLoadMore.classList.add('hidden');
  page = 1;
}

function markupGallery(res) {
  const markup = res.reduce(
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
}

function onMessenge(searchMessenge, page, pages) {
  if (page === 1 && searchMessenge.hits.length) {
    Notify.success(`Hooray! We found ${searchMessenge.totalHits} images.`);
  }
  if (!searchMessenge.total) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (page === pages) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

async function onLoadMarkupGallery() {
  const res = await onGetData();
  btnLoadMore.classList.add('hidden');
  markupGallery(res);
  simpleLightbox.refresh();

  if (pages > page) {
    btnLoadMore.classList.remove('hidden');
    page += 1;
  }
}

//
async function onGetData() {
  try {
    const res = await fetchApi(inputForm, page, perPage);
    pages = Math.ceil(res.data.total / perPage);
    const searchMessenge = res.data;
    onMessenge(searchMessenge, page, pages);
    return searchMessenge.hits;
  } catch (error) {
    console.log(error);
  }
}
