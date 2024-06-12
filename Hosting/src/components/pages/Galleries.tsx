import { useState } from 'react';
import { Card } from '@mui/joy';
import { Gallery } from '../../firebase';
import { getGalleries } from '../../Data';

export const Galleries = () => {
  const [galleries, setGalleries] = useState<Gallery[] | undefined>(undefined);
  getGalleries()
    .then(x => {
      setGalleries(x);
    })
    .catch((x: unknown) => {
      console.error(x);
    });

  return (
    <>
      <h2>Gallery List</h2>
      <p>現在データベースに登録されているギャラリー情報の一覧ページです。</p>
      <div className="mx-2 my-4 flex flex-col flex-wrap gap-2 md:flex-row">
        {galleries?.map(x => (
          <Card key={x.id}>
            <div>
              <p className="text-lg font-bold">{x.name}</p>
              <p>{x.location}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
