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
btnLoadMore.addEventListener('click', onLoad);

async function onSearchForm(evt) {
  evt.preventDefault();

  const newInputForm = evt.currentTarget.searchQuery.value.trim();

  if (inputForm !== newInputForm) {
    inputForm = newInputForm;

    if (newInputForm && pages >= page) {
      gallery.innerHTML = '';

      await fetchApi(inputForm).then(data => {
        markupGallery(data);
        simpleLightbox.refresh();

        onMessenge(evt);
        setTimeout(() => {
          btnLoadMore.classList.remove('hidden');
        }, 0);
      });
    }
  }
}

function markupGallery({ data: { hits } }) {
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
}

async function onLoad() {
  page += 1;

  onMessenge();
  await fetchApi(searchForm.searchQuery.value.trim(), page, perPage).then(
    data => {
      console.log('102рядок ', data);
      markupGallery(data);
      simpleLightbox.refresh();

      // btnLoadMore.classList.remove('hidden');
    }
  );
}
async function onMessenge() {
  // btnLoadMore.classList.add('hidden');
  const res = await fetchApi(
    searchForm.searchQuery.value.trim(),
    page,
    perPage
  );
  pages = Math.ceil(res.data.total / perPage);
  if (page === 1 && res.data.total) {
    Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
  }
  if (!res.data.total) {
    btnLoadMore.classList.add('hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (page === pages) {
    btnLoadMore.classList.add('hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
