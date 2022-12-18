import { useRouter } from 'next/router';
import { ChangeEvent, ChangeEventHandler, FC, FormEvent, useMemo } from 'react';

interface Props {
  min: number;
  max: number;
  currentLimit: number;
}

export const LimitSelector: FC<Props> = ({ min, max, currentLimit }) => {
  const router = useRouter();
  const values = useMemo(() => {
    const list = [...Array(max - min + 1)].map((_, i) => i + min);
    return list;
  }, [min, max]);

  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    router.push(`/${e.target.value}/1`);
  };

  return (
    <div>
      <select value={currentLimit} onChange={onChange}>
        {values.map((val) => {
          return <option key={val} value={val}>{`Limit: ${val}`}</option>;
        })}
      </select>
    </div>
  );
};
