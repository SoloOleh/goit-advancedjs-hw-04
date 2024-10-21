import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '46451021-7873f1dc2ed25ef257fef9075';

async function getPhotos({ query, page, perPage }) {
  const res = await axios.get('', {
    params: {
      key: API_KEY,
      q: query,
      page: page,
      per_page: perPage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  });
  return res.data;
}
export { getPhotos };
