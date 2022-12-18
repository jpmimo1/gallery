import Link from 'next/link';
import { FC, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import styles from '../../styles/Pager.module.css';

interface Props {
  currentPage: number;
  numPhotos: number;
  limit: number;
}

export const Pagination: FC<Props> = ({ currentPage, numPhotos, limit }) => {
  const [maxPages, setMaxPages] = useState(9);
  const isSmall = useMediaQuery({ query: '(max-width:900px)' });

  const totalPages = Math.ceil(numPhotos / limit);

  useEffect(() => {
    isSmall ? setMaxPages(5) : setMaxPages(9);
  }, [isSmall]);

  const buttonsPager = useMemo(() => {
    if (totalPages <= maxPages) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    } else {
      let firstButton = currentPage - Math.floor(maxPages / 2);
      let lastButton = currentPage + Math.floor(maxPages / 2);

      if (firstButton < 1) {
        firstButton = 1;
        lastButton = firstButton + maxPages - 1;
      } else if (lastButton > totalPages) {
        lastButton = totalPages;
        firstButton = lastButton - maxPages + 1;
      }

      return [...Array(maxPages)].map((_, i) => i + firstButton);
    }
  }, [totalPages, currentPage, maxPages]);

  return (
    <div className={styles.pagination}>
      <ButtonPagination
        text='Prev'
        disabled={currentPage === 1}
        url={currentPage === 1 ? '' : `/${limit}/${currentPage - 1}`}
      />
      {buttonsPager.map((value) => {
        return (
          <ButtonPagination
            key={value}
            active={value === currentPage}
            text={value.toString()}
            url={value === currentPage ? '' : `/${limit}/${value}`}
          />
        );
      })}
      <ButtonPagination
        text='Next'
        disabled={currentPage === totalPages}
        url={currentPage === totalPages ? '' : `/${limit}/${currentPage + 1}`}
      />
    </div>
  );
};

interface ButtonPaginationProps {
  text: string;
  disabled?: boolean;
  active?: boolean;
  url: string;
}
const ButtonPagination: FC<ButtonPaginationProps> = ({
  text,
  disabled,
  active,
  url
}) => {
  if (disabled) {
    return (
      <div className={`${styles.button} ${styles.buttonDisabled}`}>{text}</div>
    );
  }
  if (active) {
    return (
      <div className={`${styles.button} ${styles.buttonActive}`}>{text}</div>
    );
  }
  return (
    <Link href={url} className={styles.button}>
      {text}
    </Link>
  );
};
