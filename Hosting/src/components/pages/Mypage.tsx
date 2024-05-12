import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CircularProgress } from '@mui/joy';
import { useAuthContext } from '../AuthContext';
import { Popup } from '../ui/Popup';
import {
  getCreatorData,
  setCreatorData,
  Creator,
  Product,
  Exhibit,
} from '../../Data';

export const Mypage = () => {
  const { user } = useAuthContext();
  const [creator, setCreator] = useState<Creator>();
  const [loading, setLoading] = useState(true);
  const [tmpProducts, setTmpProducts] = useState<Product[]>([]);
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editExhibit, setEditExhibit] = useState<Exhibit | undefined>();

  useEffect(() => {
    // データの取得
    if (user === null) {
      return;
    }

    getCreatorData(user)
      .then(x => {
        setCreator(x);
        setLoading(false);
      })
      .catch((x: unknown) => {
        console.error('failed fetch data: ', x);
      });
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Creator>();

  if (loading) {
    //todo ローディングコンポーネントに置き換え
    return <p>Now loading...</p>;
  }

  const onValid: SubmitHandler<Creator> = async data => {
    // 一時データの結合
    data.products = [...(creator?.products ?? []), ...tmpProducts];
    data.exhibits = creator?.exhibits ?? [];

    if (user === null) {
      return;
    }

    // ローディングの表示
    setIsSubmitting(true);

    // 情報の送信
    console.debug('submit: ', data);
    await setCreatorData(user, data);

    // リロード
    window.location.reload();
  };

  return (
    <>
      <form
        className="flex flex-col gap-4"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onValid)}>
        <h2>My Page</h2>
        <div>
          <p>表示作家名</p>
          <input
            type="text"
            defaultValue={creator?.name}
            {...register('name', { required: '1文字以上の入力が必要です。' })}
          />
          <p className="text-xs text-red-600">{errors.name?.message}</p>
        </div>

        <div>
          <p>発表作品</p>
          <div className="flex w-[500px] overflow-x-auto [&>img]:m-2 [&>img]:h-40">
            {creator?.products.map(product => (
              <img
                key={product.id}
                src={product.tmpImageData || product.imageUrl}
              />
            ))}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => {
              const files = e.currentTarget.files;
              if (files === null || files.length === 0) {
                return;
              }

              for (const file of Array.from(files)) {
                const url = URL.createObjectURL(file);
                const product: Product = {
                  id: crypto.randomUUID(),
                  tmpImageData: url,
                  srcImage: '',
                  imageUrl: '',
                };
                tmpProducts.push(product);
              }
              setTmpProducts([...tmpProducts]);
            }}
          />
          <div className="flex w-[500px] overflow-x-auto [&>img]:m-2 [&>img]:h-40">
            {tmpProducts.map(product => (
              <img key={product.id} src={product.tmpImageData} />
            ))}
          </div>
        </div>

        <div>
          <p>展示登録</p>
          <button
            type="button"
            onClick={() => {
              setEditExhibit(undefined);
              setVisiblePopup(true);
            }}>
            展示を登録する
          </button>
          <table className="w-full">
            <tbody>
              {creator?.exhibits.map(exhibit => (
                <ExhibitRow
                  key={exhibit.id}
                  data={exhibit}
                  onEdit={() => {
                    setEditExhibit(exhibit);
                    setVisiblePopup(true);
                  }}
                  onDelete={() => {
                    const newExhibits = creator.exhibits.filter(
                      x => x.id !== exhibit.id,
                    );

                    setCreator({ ...creator, exhibits: newExhibits });
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-fit rounded-md border px-4 py-2 
              ${isSubmitting ? 'bg-zinc-300' : 'bg-white'}`}>
            {isSubmitting ? (
              <div className="flex justify-center gap-2">
                <CircularProgress size="sm" /> Loading...
              </div>
            ) : (
              <>
                <i className="fa-solid fa-check"></i> 確定
              </>
            )}
          </button>
        </div>
      </form>

      {/* <!-- popup window --> */}
      <Popup visible={visiblePopup} setVisible={setVisiblePopup}>
        <ExhibitForm
          exhibit={editExhibit}
          onSubmit={newValue => {
            if (creator === undefined) {
              return;
            }

            if (editExhibit === undefined) {
              // 追加
              creator.exhibits.push(newValue);
            } else {
              // 編集
              const editIndex = creator.exhibits.indexOf(editExhibit);
              if (editIndex !== -1) {
                creator.exhibits[editIndex] = newValue;
              }
            }

            setCreator(creator);
            setVisiblePopup(false);
          }}
        />
      </Popup>
    </>
  );
};

interface ExhibitRowProps {
  data: Exhibit;
  onEdit: (exhibit: Exhibit) => void;
  onDelete: (exhibit: Exhibit) => void;
}

const ExhibitRow = (props: ExhibitRowProps) => {
  const { data, onEdit, onDelete } = props;

  return (
    <tr className="odd:bg-neutral-200 even:bg-neutral-50 [&>td]:p-2">
      {/* 画像セル */}
      <td className="max-w-40">
        <img
          className=""
          src={data.tmpImageData || data.imageUrl}
          alt={data.title}
        />
      </td>
      {/* 内容セル */}
      <td className="w-max align-top [&>p]:m-1">
        <p>{data.title}</p>
        <p>{data.location}</p>
        <p>{data.date}</p>
      </td>
      {/* ボタンセル */}
      <td className="flex w-fit flex-col gap-2 align-top">
        <button
          type="button"
          onClick={() => {
            onEdit(data);
          }}>
          編集
        </button>
        <button
          type="button"
          onClick={() => {
            onDelete(data);
          }}>
          削除
        </button>
      </td>
    </tr>
  );
};

interface ExhibitFormProps {
  exhibit?: Exhibit;
  onSubmit: (newValue: Exhibit) => void;
}

interface ExhibitWithFile extends Exhibit {
  selectedFiles?: FileList;
}

const ExhibitForm = (props: ExhibitFormProps) => {
  const { exhibit, onSubmit } = props;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExhibitWithFile>();

  const reqMessage = '1文字以上の入力が必要です。';
  const isAdd = exhibit === undefined;

  const selectedFiles = watch('selectedFiles');
  const tmpImage =
    selectedFiles !== undefined && selectedFiles.length > 0
      ? URL.createObjectURL(selectedFiles[0])
      : exhibit?.tmpImageData ?? '';

  const onValid: SubmitHandler<Exhibit> = data => {
    data.id = exhibit?.id ?? crypto.randomUUID();
    data.tmpImageData = tmpImage;
    data.imageUrl = exhibit?.imageUrl ?? '';
    onSubmit(data);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onValid)}>
      <h2>{isAdd ? '展示登録' : '展示修正'}</h2>

      <div className="flex">
        <div className="w-1/2 p-2.5">
          <input
            type="file"
            accept="image/*"
            {...register('selectedFiles', {
              validate: value => {
                if (!isAdd) {
                  return true;
                }
                if (value === undefined) {
                  return false;
                }
                return value.length > 0 || 'ファイルを選択してください。';
              },
            })}
          />
          <p className="text-xs text-red-600">
            {errors.selectedFiles?.message}
          </p>
          <img
            className="mx-0 my-2.5 w-full"
            src={tmpImage || exhibit?.imageUrl}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-2 p-2.5">
          <div>
            <p>展示名</p>
            <input
              type="text"
              defaultValue={exhibit?.title}
              {...register('title', {
                required: reqMessage,
              })}
            />{' '}
            <p className="text-xs text-red-600">{errors.title?.message}</p>
          </div>
          <div>
            <p>場所</p>
            <input
              type="text"
              defaultValue={exhibit?.location}
              {...register('location', { required: reqMessage })}
            />
            <p className="text-xs text-red-600">{errors.location?.message}</p>
          </div>
          <div>
            <p>日時</p>
            <input
              type="text"
              defaultValue={exhibit?.date}
              {...register('date', { required: reqMessage })}
            />
            <p className="text-xs text-red-600">{errors.date?.message}</p>
          </div>
        </div>
      </div>

      <button>
        <i className={`fa-solid ${isAdd ? 'fa-add' : 'fa-check'} m-0 mr-2`} />
        {isAdd ? '追加' : '変更'}
      </button>
    </form>
  );
};
