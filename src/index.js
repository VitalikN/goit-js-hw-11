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

// btnLoadMore.classList.add('hidden');

async function onSearchForm(evt) {
  evt.preventDefault();
  btnLoadMore.classList.add('hidden');

  const newInputForm = evt.currentTarget.searchQuery.value.trim();

  if (inputForm !== newInputForm) {
    inputForm = newInputForm;

    if (inputForm && pages >= page) {
      gallery.innerHTML = '';

      await fetchApi(inputForm).then(data => {
        console.log(data);
        markupGallery(data);
        simpleLightbox.refresh();

        btnLoadMore.classList.remove('hidden');

        onMessenge(evt);
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
  await fetchApi(searchForm.searchQuery.value.trim(), page, perPage).then(
    data => {
      console.log('102рядок ', data);
      markupGallery(data);
      simpleLightbox.refresh();
    }
  );
  onMessenge();
}
async function onMessenge() {
  const res = await fetchApi(
    searchForm.searchQuery.value.trim(),
    page,
    perPage
  );
  pages = Math.ceil(res.data.total / perPage);
  if (page === 1 && res.data.total >= perPage) {
    Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    setTimeout(() => {
      btnLoadMore.classList.remove('hidden');
    }, 1000);
  }
  if (!res.data.hits.length) {
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
