import { getPhotos } from './js/pixabay-api';
import {
  clearGallery,
  createImageCardsMarkup,
  renderGallery,
  refreshLightbox,
} from './js/render-functions';
import ButtonService from './js/button-service';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

const loadMoreBtnService = new ButtonService(loadMoreBtn);

const params = {
  page: 1,
  perPage: 15,
  maxPage: 1,
  query: '',
};

searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  params.page = 1;
  const query = event.target.elements.searchQuery.value.trim();

  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }
  params.query = query;

  clearGallery(galleryRef);

  fetchImages(query);
}

async function fetchImages(query) {
  loader.style.display = 'inline-block';
  loadMoreBtnService.hide();
  try {
    const data = await getPhotos({
      query: params.query,
      page: params.page,
      perPage: params.perPage,
    });
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    params.maxPage = Math.ceil(data.totalHits / params.perPage);

    const markup = createImageCardsMarkup(data.hits);
    renderGallery(galleryRef, markup);
    refreshLightbox();

    if (params.maxPage > params.page) {
      loadMoreBtnService.show();
      loadMoreBtn.addEventListener('click', handleLoadMore);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
  }
}

async function handleLoadMore(event) {
  loadMoreBtnService.setLoading();
  params.page += 1;

  try {
    const data = await getPhotos({
      query: params.query,
      page: params.page,
      perPage: params.perPage,
    });

    const markup = createImageCardsMarkup(data.hits);
    renderGallery(galleryRef, markup);
    refreshLightbox();

    const { height: cardHeight } =
      galleryRef.firstElementChild.getBoundingClientRect();
    const gap = 16;

    window.scrollBy({
      top: (cardHeight + gap) * 2,
      behavior: 'smooth',
    });

    loadMoreBtnService.setNormal();

    if (params.maxPage === params.page) {
      loadMoreBtnService.hide();
      loadMoreBtn.removeEventListener('click', handleLoadMore);
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
  }
}
