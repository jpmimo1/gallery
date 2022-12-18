import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React from 'react';
import { getPageGallery, getAllImages } from '../../utils/getPageGallery';
import { Photo } from '../../interfaces';
import { useRouter } from 'next/router';
import { Pagination } from '../../components/gallery';

import styles from '../../styles/Gallery.module.css';
import Image from 'next/image';
import { LimitSelector } from '../../components/gallery/LimitSelector';
import Head from 'next/head';

const minLimit = 3;
const maxLimit = 10;

interface Props {
  listPhotos: Array<Photo>;
  numPhotos: number;
}

const initialState = {
  currentLimit: 1
};
const reducer = () => {};

const GalleryPage: NextPage<Props> = ({ listPhotos, numPhotos }) => {
  const { query } = useRouter();

  const { page: currentPage, limit } = query as { page: string; limit: string };

  return (
    <>
      <Head>
        <title>Gallery</title>
      </Head>
      <div className={styles.gallery}>
        <div className={styles.header}>
          <div className='container'>
            <div className={styles['header-content']}>
              <div>
                <h2>Galleria.</h2>
              </div>
              <LimitSelector
                currentLimit={parseInt(limit)}
                max={maxLimit}
                min={minLimit}
              />
            </div>
          </div>
        </div>
        <div className='container'>
          <div className={styles['list-photos']}>
            {listPhotos.map(({ id, author, download_url, width, height }) => {
              return (
                <div key={id} className={styles['box-photo']}>
                  <div className={styles['photo-information']}>
                    <div className={styles.author}>{author}</div>
                    <div>{`#${id}`}</div>
                  </div>
                  <div className={styles['image-container']}>
                    <Image
                      src={download_url}
                      alt=''
                      width={width / 5}
                      height={height / 5}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles['pagination-area']}>
          <div className='container'>
            <Pagination
              currentPage={parseInt(currentPage)}
              limit={parseInt(limit)}
              numPhotos={numPhotos}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const limits = [...Array(maxLimit - minLimit + 1)].map(
    (_, i) => i + minLimit
  );

  const allPhotos = await getAllImages();
  const numPhotos = allPhotos.length;

  let newPaths: { params: { limit: string; page: string } }[] = [];

  limits.forEach((limit) => {
    const numPages = Math.ceil(numPhotos / limit);

    const pathsLimit = [...Array(numPages)].map((_, i) => {
      return {
        params: {
          limit: limit.toString(),
          page: (i + 1).toString()
        }
      };
    });

    newPaths = [...newPaths, ...pathsLimit];
  });

  return {
    paths: newPaths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { limit, page } = params as { limit: string; page: string };

  const listPhotos = await getPageGallery(parseInt(limit), parseInt(page));

  const allPhotos = await getAllImages();
  const numPhotos = allPhotos.length;

  if (listPhotos.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {
      listPhotos,
      numPhotos
    }
  };
};

export default GalleryPage;
