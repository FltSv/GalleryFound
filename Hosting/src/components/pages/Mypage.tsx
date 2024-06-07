import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button as MuiJoyButton, IconButton } from '@mui/joy';
import { FaCheck, FaPen, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuthContext } from '../AuthContext';
import { Button, SubmitButton } from '../ui/Input';
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
    data.products = creator?.products ?? [];
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
        className="mx-auto flex w-full max-w-xl flex-col gap-4"
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
          <div className="mb-2 flex gap-2">
            <p className="mt-auto w-full">発表作品</p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="min-w-fit"
              onChange={e => {
                if (creator === undefined) return;

                const files = e.currentTarget.files;
                if (files === null) return;
                if (files.length === 0) return;

                for (const file of Array.from(files)) {
                  const url = URL.createObjectURL(file);
                  const product: Product = {
                    id: crypto.randomUUID(),
                    tmpImageData: url,
                    srcImage: '',
                    imageUrl: '',
                  };
                  creator.products.push(product);
                }

                setCreator({ ...creator, products: creator.products });
              }}
            />
          </div>

          <div className="flex overflow-x-auto">
            {creator?.products.map(product => (
              <ProductCell
                key={product.id}
                data={product}
                onDelete={() => {
                  const newProducts = creator.products.filter(
                    x => x.id !== product.id,
                  );

                  setCreator({ ...creator, products: newProducts });
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            <p className="mt-auto w-full">展示登録</p>
            <Button
              className="min-w-fit rounded-md bg-white text-black"
              startDecorator={<FaPlus />}
              onClick={() => {
                setEditExhibit(undefined);
                setVisiblePopup(true);
              }}>
              展示追加
            </Button>
          </div>
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

        <SubmitButton
          className="w-fit rounded-md border bg-white text-black"
          startDecorator={<FaCheck />}
          isSubmitted={isSubmitting}>
          確定
        </SubmitButton>
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

interface ProductCellProps {
  data: Product;
  onDelete: (product: Product) => void;
}

const ProductCell = (props: ProductCellProps) => {
  const { data, onDelete } = props;

  return (
    <div className="relative min-w-fit">
      <img
        className="h-28 p-2 md:h-40"
        key={data.id}
        src={data.tmpImageData || data.imageUrl}
      />
      <IconButton
        size="sm"
        variant="soft"
        color="neutral"
        sx={{ borderRadius: 9999 }}
        className="absolute right-0 top-0"
        onClick={() => {
          onDelete(data);
        }}>
        <FaTimes />
      </IconButton>
    </div>
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
    <tr className="odd:bg-neutral-200 even:bg-neutral-50">
      <td className="flex gap-4 p-2">
        {/* 画像 */}
        <img
          className="max-w-32 md:max-w-40"
          src={data.tmpImageData || data.imageUrl}
          alt={data.title}
        />
        {/* 内容 */}
        <div className="flex w-full flex-col gap-1 align-top">
          <p>{data.title}</p>
          <p>{data.location}</p>
          <p>{data.date}</p>
        </div>
        {/* 編集/削除ボタン */}
        <div className="flex min-w-max flex-col gap-1 align-top">
          <MuiJoyButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={() => {
              onEdit(data);
            }}>
            <FaPen />
            <label className="hidden md:inline md:pl-2">編集</label>
          </MuiJoyButton>
          <MuiJoyButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={() => {
              onDelete(data);
            }}>
            <FaTimes />
            <label className="hidden md:inline md:pl-2">削除</label>
          </MuiJoyButton>
        </div>
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

      <div className="my-2 flex max-w-xl flex-col md:flex-row">
        <div className="flex basis-1/2 flex-col gap-2 p-2">
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
            className="w-full max-w-xs"
            src={tmpImage || exhibit?.imageUrl}
          />
        </div>
        <div className="flex basis-1/2 flex-col gap-2 p-2">
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
