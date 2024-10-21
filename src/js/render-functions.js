import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let gallery = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
  captionsData: 'alt',
});

function clearGallery(galleryRef) {
  galleryRef.innerHTML = '';
}

function createImageCardsMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}" class="gallery-item">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b>${likes}</p>
          <p class="info-item"><b>Views</b>${views}</p>
          <p class="info-item"><b>Comments</b>${comments}</p>
          <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
      </div>
      `
    )
    .join('');
}

function renderGallery(galleryRef, markup) {
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function refreshLightbox() {
  gallery.refresh();
}

export { clearGallery, createImageCardsMarkup, renderGallery, refreshLightbox };
