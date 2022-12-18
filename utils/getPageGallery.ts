import { imageApi } from '../api';
import { Photo } from '../interfaces';

export const getPageGallery = async (limit: number, page: number) => {
  try {
    const { data } = await imageApi.get<Photo[]>(
      `?page=${page}&limit=${limit}`
    );

    return data;
  } catch (error) {
    return [];
  }
};

export const getAllImages = async () => {
  let photos: Array<Photo> = [];

  let currentPage = 1;
  while (true) {
    const photosPage = await getPageGallery(100, currentPage);

    if (photosPage.length === 0) {
      break;
    } else {
      photos = [...photos, ...photosPage];
    }
    currentPage++;
  }

  return photos;
};
