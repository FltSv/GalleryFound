import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Button as MuiJoyButton,
  IconButton,
  Card,
  Input,
  Textarea,
} from '@mui/joy';
import { Autocomplete } from '@mui/material';
import { FaCheck, FaPen, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuthContext } from 'components/AuthContext';
import { Button, FileInput, SubmitButton, Textbox } from 'components/ui/Input';
import { Popup } from 'components/ui/Popup';
import {
  getCreatorData,
  setCreatorData,
  Creator,
  Product,
  Exhibit,
  getGalleries,
  addGallery,
  Gallery,
  getDatePeriodString,
} from 'src/Data';
import { getUlid } from 'src/ULID';
import { DraggableList, SortableProps } from 'components/ui/DraggableList';

export const Mypage = () => {
  const { user } = useAuthContext();
  const [creator, setCreator] = useState<Creator>();
  const [loading, setLoading] = useState(true);
  const [visibleProductPopup, setVisibleProductPopup] = useState(false);
  const [visibleExhibitPopup, setVisibleExhibitPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editExhibit, setEditExhibit] = useState<Exhibit>();
  const [editProduct, setEditProduct] = useState<Product>();

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
        onSubmit={e => void handleSubmit(onValid)(e)}>
        <h2>My Page</h2>
        <Textbox
          label="表示作家名"
          defaultValue={creator?.name}
          className="w-1/2"
          fieldError={errors.name}
          {...register('name', { required: '1文字以上の入力が必要です。' })}
        />

        <div>
          <div className="mb-2 flex gap-2">
            <p className="mt-auto w-full">発表作品</p>
            <FileInput
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
                    id: getUlid(),
                    title: '',
                    detail: '',
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

          {creator && (
            <DraggableList
              items={creator.products}
              setItems={items => {
                const newProducts = items
                  .map(item =>
                    creator.products.find(product => product.id === item.id),
                  )
                  .filter(x => x !== undefined);

                setCreator({ ...creator, products: newProducts });
              }}
              renderItem={(product, props) => (
                <ProductCell
                  key={product.id}
                  data={product}
                  onEdit={() => {
                    setEditProduct(product);
                    setVisibleProductPopup(true);
                  }}
                  onDelete={() => {
                    const newProducts = creator.products.filter(
                      x => x.id !== product.id,
                    );

                    setCreator({ ...creator, products: newProducts });
                  }}
                  sortableProps={props}
                />
              )}
            />
          )}
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            <p className="mt-auto w-full">展示登録</p>
            <Button
              className="min-w-fit rounded-md bg-white text-black"
              startDecorator={<FaPlus />}
              onClick={() => {
                setEditExhibit(undefined);
                setVisibleExhibitPopup(true);
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
                    setVisibleExhibitPopup(true);
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
          loading={isSubmitting}>
          確定
        </SubmitButton>
      </form>

      {/* 発表作品 */}
      {editProduct && (
        <ProductPopup
          visible={visibleProductPopup}
          setVisible={setVisibleProductPopup}
          product={editProduct}
          onSubmit={newValue => {
            if (creator === undefined) {
              return;
            }

            const editIndex = creator.products.indexOf(editProduct);
            if (editIndex !== -1) {
              creator.products[editIndex] = newValue;
            }

            setCreator(creator);
            setVisibleProductPopup(false);
          }}
        />
      )}

      {/* 展示登録 */}
      <Popup visible={visibleExhibitPopup} setVisible={setVisibleExhibitPopup}>
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
            setVisibleExhibitPopup(false);
          }}
        />
      </Popup>
    </>
  );
};

interface ProductCellProps {
  data: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  sortableProps: SortableProps;
}

const ProductCell = (props: ProductCellProps) => {
  const { data, onEdit, onDelete, sortableProps } = props;

  return (
    <div className="relative min-w-fit">
      <div className="relative">
        <img
          className="h-28 p-2 md:h-40"
          key={data.id}
          src={data.tmpImageData || data.imageUrl}
          {...sortableProps}
        />
        <p className="absolute bottom-0 w-fit bg-black bg-opacity-50 px-2 text-white">
          {data.title}
        </p>
      </div>
      <div className="absolute right-0 top-0 flex flex-col gap-2">
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          sx={{ borderRadius: 9999 }}
          onClick={() => {
            onEdit(data);
          }}>
          <FaPen />
        </IconButton>
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          sx={{ borderRadius: 9999 }}
          onClick={() => {
            onDelete(data);
          }}>
          <FaTimes />
        </IconButton>
      </div>
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
          <p>{getDatePeriodString(data.startDate, data.endDate)}</p>
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

interface ProductPopupProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  product: Product;
  onSubmit: (newValue: Product) => void;
}

const ProductPopup = (props: ProductPopupProps) => {
  const { visible, setVisible, product, onSubmit } = props;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: product,
  });

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  const onValid: SubmitHandler<Product> = data => {
    const submitData: Product = {
      ...product,
      title: data.title,
      detail: data.detail,
    };

    onSubmit(submitData);
  };

  return (
    <Popup visible={visible} setVisible={setVisible}>
      <form
        onSubmit={e => {
          e.preventDefault();
          void handleSubmit(onValid)(e);
        }}>
        <h2 className="w-fit">作品情報編集</h2>

        <div className="mb-4 mt-2 flex max-w-2xl flex-col gap-4 md:flex-row">
          <div className="flex max-w-max basis-1/2 flex-col">
            <img
              className="w-full max-w-xs"
              src={product.tmpImageData || product.imageUrl}
            />
          </div>
          <div className="flex basis-1/2 flex-col gap-2 md:w-max">
            <Textbox label="作品名" {...register('title')} />
            <div>
              <p>詳細</p>
              <Textarea
                sx={{ border: 1, borderColor: 'black', marginY: '0.25rem' }}
                minRows={3}
                {...register('detail')}
              />
            </div>
          </div>
        </div>

        <SubmitButton
          className="w-fit rounded-md border border-black bg-white text-black"
          variant="outlined"
          startDecorator={<FaCheck />}>
          変更
        </SubmitButton>
      </form>
    </Popup>
  );
};

interface ExhibitFormProps {
  exhibit?: Exhibit;
  onSubmit: (newValue: Exhibit) => void;
}

interface ExhibitFormValues extends Exhibit {
  selectedFiles?: FileList;
  startDateString: string;
  endDateString: string;
}

const ExhibitForm = (props: ExhibitFormProps) => {
  const { exhibit, onSubmit } = props;
  const [galleries, setGalleries] = useState<Gallery[] | undefined>(undefined);
  const {
    control,
    getValues,
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ExhibitFormValues>({ defaultValues: exhibit });

  const fetchGalleries = () =>
    void (async () => {
      const galleries = await getGalleries();
      setGalleries(galleries);
    })();

  useEffect(fetchGalleries, []);

  const requireMsg = '1文字以上の入力が必要です。';
  const invalidDateMsg = '有効な日付を入力してください。';
  const isAdd = exhibit === undefined;

  const selectedFiles = watch('selectedFiles');
  const tmpImage =
    selectedFiles !== undefined && selectedFiles.length > 0
      ? URL.createObjectURL(selectedFiles[0])
      : exhibit?.tmpImageData ?? '';

  const location = watch('location');
  const matchGallery = galleries?.find(x => x.name === location);
  const isMatchGallery = matchGallery !== undefined;

  const onValid: SubmitHandler<ExhibitFormValues> = data => {
    if (!isMatchGallery) {
      setError('location', {
        message: 'ギャラリー情報の指定または入力が必要です。',
      });
      return;
    }

    const submitData: Exhibit = {
      id: exhibit?.id ?? getUlid(),
      title: data.title,
      location: data.location,
      galleryId: matchGallery.id,
      startDate: new Date(data.startDateString + 'T00:00:00'),
      endDate: new Date(data.endDateString + 'T23:59:59'),
      srcImage: data.srcImage,
      tmpImageData: tmpImage,
      imageUrl: exhibit?.imageUrl ?? '',
    };

    onSubmit(submitData);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        void handleSubmit(onValid)(e);
      }}>
      <h2 className="w-fit">{isAdd ? '展示登録' : '展示修正'}</h2>

      <div className="my-2 flex max-w-2xl flex-col md:flex-row">
        <div className="flex max-w-max basis-1/2 flex-col gap-2 p-2">
          <FileInput
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
        <div className="flex basis-1/2 flex-col gap-2 p-2 md:w-max">
          <Textbox
            label="展示名"
            {...register('title', { required: requireMsg })}
            fieldError={errors.title}
          />
          <div>
            <p>場所</p>
            <Controller
              control={control}
              name="location"
              rules={{ required: requireMsg }}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={galleries?.map(x => x.name) ?? []}
                  onChange={(e, value) => {
                    field.onChange(value);
                  }}
                  value={field.value || null}
                  renderInput={params => (
                    <Input
                      slotProps={{
                        root: { ref: params.InputProps.ref },
                        input: {
                          ...params.inputProps,
                          onChange: e => {
                            field.onChange(e);
                            params.inputProps.onChange?.(e);
                          },
                        },
                      }}
                      sx={{ borderColor: 'black' }}
                    />
                  )}
                />
              )}
            />
            <p className="text-xs text-red-600">{errors.location?.message}</p>
            {location !== '' && isMatchGallery ? (
              <Card>
                <div>
                  <p className="text-lg font-bold">{matchGallery.name}</p>
                  <p>{matchGallery.location}</p>
                </div>
              </Card>
            ) : (
              <NoGalleryInfo
                newName={location}
                onChange={() => {
                  fetchGalleries();
                  setError('location', {});
                }}
              />
            )}
          </div>
          <Textbox
            label="開始日時"
            type="date"
            defaultDateValue={exhibit?.startDate}
            fieldError={errors.startDateString}
            {...register('startDateString', {
              validate: v => !isNaN(new Date(v).getDate()) || invalidDateMsg,
            })}
          />
          <Textbox
            label="終了日時"
            type="date"
            defaultDateValue={exhibit?.endDate}
            fieldError={errors.endDateString}
            {...register('endDateString', {
              validate: v => {
                const endDate = new Date(v);
                const startDate = new Date(getValues('startDateString'));

                if (isNaN(endDate.getDate())) {
                  return invalidDateMsg;
                }

                if (endDate < startDate) {
                  return '終了日は開始日以降である必要があります。';
                }

                return true;
              },
            })}
          />
        </div>
      </div>

      <button>
        <i className={`fa-solid ${isAdd ? 'fa-add' : 'fa-check'} m-0 mr-2`} />
        {isAdd ? '追加' : '変更'}
      </button>
    </form>
  );
};

interface NoGalleryProps {
  newName: string;
  onChange: () => void;
}

const NoGalleryInfo = (props: NoGalleryProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Gallery>({ defaultValues: { name: props.newName } as Gallery });

  const onValid: SubmitHandler<Gallery> = async data => {
    if (!props.newName) {
      setError('name', { message: '場所（ギャラリー名称）が未入力です。' });
      return;
    }

    try {
      await addGallery({ ...data, name: props.newName });
    } catch (error) {
      console.error('error: ', error);
      setError('name', { message: '入力された住所が見つかりませんでした。' });
      return;
    }

    props.onChange();
  };

  return (
    <Card size="sm">
      <p>
        情報がありません。
        <br />
        ギャラリー情報の新規追加
      </p>
      <div className="flex flex-col gap-2">
        <Textbox
          label="住所"
          size="sm"
          {...register('location', {
            required: 'ギャラリーの住所を入力してください。',
          })}
          fieldError={errors.name || errors.location}
        />
        <MuiJoyButton
          size="sm"
          variant="soft"
          color="neutral"
          startDecorator={<FaPlus />}
          className="w-fit"
          loading={isSubmitting}
          onClick={e => {
            clearErrors('name');
            void handleSubmit(onValid)(e);
          }}>
          追加
        </MuiJoyButton>
      </div>
    </Card>
  );
};
