import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  KeyboardEvent,
  MouseEventHandler,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  useForm,
  SubmitHandler,
  Controller,
  ControllerRenderProps,
} from 'react-hook-form';
import {
  Button as MuiJoyButton,
  IconButton,
  Card,
  Input,
  Textarea,
} from '@mui/joy';
import { Autocomplete, AutocompleteRenderInputParams } from '@mui/material';
import { FaCheck, FaPen, FaPlus, FaTimes } from 'react-icons/fa';
import { RiDraggable } from 'react-icons/ri';
import { useAuthContext } from 'components/AuthContext';
import {
  Button,
  FileInput,
  HashtagTextarea,
  Switch,
  SubmitButton,
  Textbox,
} from 'components/ui/Input';
import { Popup } from 'components/ui/Popup';
import { Gallery, Creator, Product, Exhibit } from 'src/domain/entities';
import { DraggableList, SortableProps } from 'components/ui/DraggableList';
import { getConfig } from 'src/infra/firebase/firebaseConfig';
import { UserName } from 'src/domain/UserName';
import { getCreatorData, setCreatorData } from 'src/infra/firebase/CreatorRepo';
import { addGallery, getGalleries } from 'src/application/GalleryMapService';
import {
  createExhibit,
  createProduct,
  updateExhibit,
} from 'src/application/CreatorService';
import { ProgressBar } from 'components/ui/ProgressBar';

export const Mypage = () => {
  const { user } = useAuthContext();
  const [creator, setCreator] = useState<Creator>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addLink, setAddLink] = useState('');
  const [addLinkError, setAddLinkError] = useState(false);
  const [visibleProductPopup, setVisibleProductPopup] = useState(false);
  const [visibleExhibitPopup, setVisibleExhibitPopup] = useState(false);
  const [editExhibit, setEditExhibit] = useState<Exhibit>();
  const [editProduct, setEditProduct] = useState<Product>();
  const [genres, setGenres] = useState<string[]>([]);
  const [profileHashtags, setProfileHashtags] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    totalFiles: number;
    fileProgresses: number[];
  } | null>(null);

  useEffect(() => {
    if (user === null) {
      return;
    }

    void (async () => {
      // データの取得
      const creator = await getCreatorData(user);
      setCreator(creator);

      const genres = (await getConfig()).genres;
      setGenres(genres);

      setLoading(false);
    })().catch((e: unknown) => {
      console.error('failed fetch data: ', e);
    });
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Creator>();

  // - - - - - - - -
  // SNSリンク関係の処理

  const isValidUrl = (url: string) => {
    if (url.length == 0) return false;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /** Linkが検証されていれば、Linkを追加 */
  const onAddLink = useCallback(() => {
    if (creator === undefined) return;
    if (addLinkError) return;

    const links = [...creator.links, addLink];
    setCreator({ ...creator, links });
    setAddLink('');
  }, [creator, addLink, addLinkError]);

  /** Linkの削除 */
  const handleRemoveLink = useCallback(
    (link: string) => () => {
      if (creator === undefined) return;

      const links = creator.links.filter(x => x !== link);
      setCreator({ ...creator, links });
    },
    [creator],
  );

  /** Linkの入力値変更時に、入力値の更新と検証を行う */
  const onChangeLinkInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setAddLink(input);
    setAddLinkError(!isValidUrl(input));
  }, []);

  const onKeyDownLinkInput = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onAddLink();
      }
    },
    [onAddLink],
  );

  // - - - - - - - -
  // 発表作品

  /**
   * 選択された各ファイルに対して `Product` オブジェクトを作成し、
   * `creator.Products` を更新
   */
  const onChangeProductFileInput = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (user === null) return;
      if (creator === undefined) return;

      const files = e.currentTarget.files;
      if (files === null) return;
      if (files.length === 0) return;

      setUploadProgress({
        totalFiles: files.length,
        fileProgresses: new Array(files.length).fill(0),
      });

      const tasks = Array.from(files).map(async (file, i) => {
        const order = creator.products.length + i + 1;
        const result = await createProduct(
          user.uid,
          file,
          order,
          (progress: number) => {
            setUploadProgress(prev => {
              if (!prev) return null;
              return {
                ...prev,
                fileProgresses: prev.fileProgresses.map((p, index) =>
                  index === i ? progress : p,
                ),
              };
            });
          },
        );
        return result;
      });

      const newProducts = await Promise.all(tasks);

      setCreator({
        ...creator,
        products: [...creator.products, ...newProducts],
      });

      setUploadProgress(null);
    },
    [creator, user],
  );

  const uploadProgressPercent = useMemo(() => {
    if (!uploadProgress) return 0;

    const { totalFiles, fileProgresses } = uploadProgress;
    return (
      fileProgresses.reduce((sum, progress) => sum + progress, 0) / totalFiles
    );
  }, [uploadProgress]);

  /**
   * `DraggableList` で並び替え後のアイテムを設定するコールバック関数
   */
  const setDraggableProducts = useCallback(
    (items: Product[]) => {
      if (creator === undefined) return;

      const newProducts = items
        .map(item => creator.products.find(product => product.id === item.id))
        .filter(x => x !== undefined);

      setCreator({ ...creator, products: newProducts });
    },
    [creator],
  );

  /** 作品の削除 */
  const onDeleteRenderProduct = useCallback(
    (product: Product) => {
      if (creator === undefined) return;

      const newProducts = creator.products.filter(x => x.id !== product.id);
      setCreator({ ...creator, products: newProducts });
    },
    [creator],
  );

  /** 作品の編集画面の表示 */
  const onEditRenderProduct = useCallback((product: Product) => {
    setEditProduct(product);
    setVisibleProductPopup(true);
  }, []);

  const renderProductItem = useCallback(
    (product: Product, props: SortableProps) => (
      <ProductCell
        data={product}
        key={product.id}
        onDelete={onDeleteRenderProduct}
        onEdit={onEditRenderProduct}
        sortableProps={props}
      />
    ),
    [onDeleteRenderProduct, onEditRenderProduct],
  );

  // - - - - - - - -
  // 展示

  /** 展示追加 */
  const onClickAddExhibit = useCallback(() => {
    setEditExhibit(undefined);
    setVisibleExhibitPopup(true);
  }, []);

  /** 展示削除 */
  const onDeleteExhibit = useCallback(
    (exhibit: Exhibit) => {
      if (creator === undefined) return;

      const newExhibits = creator.exhibits.filter(x => x.id !== exhibit.id);
      setCreator({ ...creator, exhibits: newExhibits });
    },
    [creator],
  );

  /** 展示編集画面の表示 */
  const onEditExhibit = useCallback((exhibit: Exhibit) => {
    setEditExhibit(exhibit);
    setVisibleExhibitPopup(true);
  }, []);

  // - - - - - - - -
  // Popup関連

  const onSubmitProductPopup = useCallback(
    (newValue: Product) => {
      if (creator === undefined) return;
      if (editProduct === undefined) return;

      // Productsの中でisHighlightがtrueの要素は1つのみにする処理
      // editProductのisHighlightがtrueに変化した場合、他のisHighlightをfalseにする
      const newProducts = creator.products.map(product => {
        if (product.id === editProduct.id) {
          return newValue;
        }
        if (newValue.isHighlight && product.isHighlight) {
          return { ...product, isHighlight: false };
        }
        return product;
      });

      setCreator({ ...creator, products: newProducts });
      setVisibleProductPopup(false);
    },
    [creator, editProduct],
  );

  const onSubmitExhibitPopup = useCallback(
    (newValue: Exhibit) => {
      if (creator === undefined) return;

      if (editExhibit === undefined) {
        // 追加
        const newExhibits = [...creator.exhibits, newValue];
        setCreator({ ...creator, exhibits: newExhibits });
      } else {
        // 編集
        const newExhibits = creator.exhibits.map(exhibit =>
          exhibit.id === editExhibit.id ? newValue : exhibit,
        );
        setCreator({ ...creator, exhibits: newExhibits });
      }

      setVisibleExhibitPopup(false);
    },
    [creator, editExhibit],
  );

  // - - - - - - - -
  // フォーム全体の検証、送信

  const onValid: SubmitHandler<Creator> = useCallback(
    async data => {
      if (user === null) return;
      if (creator === undefined) return;

      // 一時データの結合
      const submitData = {
        ...data,
        name: new UserName(data.name).toString(),
        profileHashtags: profileHashtags,
        links: creator.links,
        products: creator.products,
        exhibits: creator.exhibits,
      };

      // ローディングの表示
      setIsSubmitting(true);

      // 情報の送信
      console.debug('submit: ', submitData);
      await setCreatorData(user, submitData);

      // リロード
      window.location.reload();
    },
    [creator, profileHashtags, user],
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      handleSubmit(onValid)(e);
    },
    [handleSubmit, onValid],
  );

  if (loading) {
    //todo ローディングコンポーネントに置き換え
    return <p>Now loading...</p>;
  }

  return (
    <>
      <form
        className="mx-auto flex w-full max-w-xl flex-col gap-4"
        onSubmit={onSubmit}>
        <h2>My Page</h2>
        <Textbox
          className="w-1/2"
          defaultValue={creator?.name}
          fieldError={errors.name}
          label="表示作家名"
          {...register('name', {
            validate: value => {
              try {
                new UserName(value);
                return true;
              } catch (e) {
                return (e as Error).message;
              }
            },
          })}
        />

        <div>
          <p>作品ジャンル</p>
          <select
            className={`
              my-1 block w-fit rounded-md border border-black bg-transparent
              px-2 py-2

              focus:border-2 focus:border-blue-600 focus:outline-none
            `}
            defaultValue={creator?.genre}
            {...register('genre')}>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>プロフィール</p>
          <HashtagTextarea
            defaultValue={creator?.profile}
            onHashtagsChange={setProfileHashtags}
            rows={3}
            {...register('profile')}
          />
        </div>

        <div>
          <p>SNSリンク</p>
          {creator?.links.map(link => {
            const removeLink = handleRemoveLink(link);

            return (
              <div className="flex items-center gap-2" key={link}>
                <img
                  className="h-4 w-4"
                  src={`http://www.google.com/s2/favicons?domain=${link}`}
                />
                <a
                  className="text-blue-600 underline"
                  href={link}
                  rel="noreferrer"
                  target="_blank">
                  {link}
                </a>
                <MuiJoyButton
                  color="neutral"
                  onClick={removeLink}
                  size="sm"
                  variant="plain">
                  <FaTimes />
                  <label
                    className={`
                      hidden

                      md:inline md:pl-2
                    `}>
                    削除
                  </label>
                </MuiJoyButton>
              </div>
            );
          })}
          <Input
            color={addLinkError ? 'danger' : 'neutral'}
            endDecorator={
              <MuiJoyButton
                color="neutral"
                disabled={addLinkError || addLink.length == 0}
                onClick={onAddLink}
                size="sm"
                variant="plain">
                <FaPlus />
                <label
                  className={`
                    hidden

                    md:inline md:pl-2
                  `}>
                  追加
                </label>
              </MuiJoyButton>
            }
            onChange={onChangeLinkInput}
            onKeyDown={onKeyDownLinkInput}
            placeholder="https://..."
            sx={{
              borderColor: 'black',
              backgroundColor: 'transparent',
            }}
            value={addLink}
          />
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            <p className="mt-auto w-full">発表作品</p>
            <FileInput
              accept="image/*"
              className="min-w-fit"
              disabled={uploadProgress !== null}
              multiple
              onChange={onChangeProductFileInput}
            />
          </div>
          {uploadProgress && (
            <div className="pb-4">
              <ProgressBar value={uploadProgressPercent / 100} />
            </div>
          )}
          {creator && (
            <DraggableList
              items={creator.products}
              renderItem={renderProductItem}
              setItems={setDraggableProducts}
            />
          )}
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            <p className="mt-auto w-full">展示登録</p>
            <Button
              className="min-w-fit rounded-md bg-white text-black"
              onClick={onClickAddExhibit}
              startDecorator={<FaPlus />}>
              展示追加
            </Button>
          </div>
          <table className="w-full">
            <tbody>
              {creator?.exhibits.map(exhibit => (
                <ExhibitRow
                  data={exhibit}
                  key={exhibit.id}
                  onDelete={onDeleteExhibit}
                  onEdit={onEditExhibit}
                />
              ))}
            </tbody>
          </table>
        </div>

        <SubmitButton
          className="w-fit rounded-md border bg-white text-black"
          loading={isSubmitting}
          startDecorator={<FaCheck />}>
          確定
        </SubmitButton>
      </form>

      {/* 発表作品 */}
      {editProduct && (
        <ProductPopup
          onSubmit={onSubmitProductPopup}
          product={editProduct}
          setVisible={setVisibleProductPopup}
          visible={visibleProductPopup}
        />
      )}

      {/* 展示登録 */}
      <Popup setVisible={setVisibleExhibitPopup} visible={visibleExhibitPopup}>
        <ExhibitForm exhibit={editExhibit} onSubmit={onSubmitExhibitPopup} />
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

  const onEditClick = useCallback(() => {
    onEdit(data);
  }, [data, onEdit]);

  const onDeleteClick = useCallback(() => {
    onDelete(data);
  }, [data, onDelete]);

  // 代表作品として設定されていれば、背景を黄色にする
  const bgHighlight = data.isHighlight ? 'bg-yellow-100' : '';

  return (
    <div
      className={`
        relative min-w-fit

        ${bgHighlight}
      `}>
      <div className="flex">
        <div className="max-w-min content-center" {...sortableProps}>
          <RiDraggable />
        </div>
        <img
          className={`
            h-28 p-2

            md:h-40
          `}
          key={data.id}
          src={data.tmpImageData || data.imageUrl}
        />
        <p
          className={`
            absolute bottom-0 w-fit bg-black bg-opacity-50 px-2 text-white
          `}>
          {data.title}
        </p>
      </div>
      <div className="absolute right-0 top-0 flex flex-col gap-2">
        <IconButton
          color="neutral"
          onClick={onEditClick}
          size="sm"
          sx={{ borderRadius: 9999 }}
          variant="soft">
          <FaPen />
        </IconButton>
        <IconButton
          color="neutral"
          onClick={onDeleteClick}
          size="sm"
          sx={{ borderRadius: 9999 }}
          variant="soft">
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

  const onEditClick = useCallback(() => {
    onEdit(data);
  }, [data, onEdit]);

  const onDeleteClick = useCallback(() => {
    onDelete(data);
  }, [data, onDelete]);

  return (
    <tr
      className={`
        even:bg-neutral-50

        odd:bg-neutral-200
      `}>
      <td className="flex gap-4 p-2">
        {/* 画像 */}
        <img
          alt={data.title}
          className={`
            max-w-32

            md:max-w-40
          `}
          src={data.tmpImageData || data.imageUrl}
        />
        {/* 内容 */}
        <div className="flex w-full flex-col gap-1 align-top">
          <p>{data.title}</p>
          <p>{data.location}</p>
          <p>{data.getDatePeriod()}</p>
        </div>
        {/* 編集/削除ボタン */}
        <div className="flex min-w-max flex-col gap-1 align-top">
          <MuiJoyButton
            color="neutral"
            onClick={onEditClick}
            size="sm"
            variant="plain">
            <FaPen />
            <label
              className={`
                hidden

                md:inline md:pl-2
              `}>
              編集
            </label>
          </MuiJoyButton>
          <MuiJoyButton
            color="neutral"
            onClick={onDeleteClick}
            size="sm"
            variant="plain">
            <FaTimes />
            <label
              className={`
                hidden

                md:inline md:pl-2
              `}>
              削除
            </label>
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
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: product,
  });

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  const onValid: SubmitHandler<Product> = useCallback(
    data => {
      const submitData: Product = {
        ...product,
        title: data.title,
        isHighlight: data.isHighlight,
        detail: data.detail,
      };

      onSubmit(submitData);
    },
    [onSubmit, product],
  );

  const onSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit(onValid)(e);
    },
    [handleSubmit, onValid],
  );

  return (
    <Popup setVisible={setVisible} visible={visible}>
      <form onSubmit={onSubmitForm}>
        <h2 className="w-fit">作品情報編集</h2>

        <div
          className={`
            mb-4 mt-2 flex max-w-2xl flex-col gap-4

            md:flex-row
          `}>
          <div className="flex max-w-max basis-1/2 flex-col">
            <img
              className="w-full max-w-xs"
              src={product.tmpImageData || product.imageUrl}
            />
          </div>
          <div
            className={`
              flex basis-1/2 flex-col gap-2

              md:w-max
            `}>
            <Textbox label="作品名" {...register('title')} />
            <div>
              <Switch
                control={control}
                name="isHighlight"
                startDecorator={<p>これを代表作品として表示する</p>}
              />
            </div>
            <div>
              <p>詳細</p>
              <Textarea
                minRows={3}
                sx={{ border: 1, borderColor: 'black', marginY: '0.25rem' }}
                {...register('detail')}
              />
            </div>
          </div>
        </div>

        <SubmitButton
          className="w-fit rounded-md border border-black bg-white text-black"
          startDecorator={<FaCheck />}
          variant="outlined">
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
  const { user } = useAuthContext();
  const { exhibit, onSubmit } = props;
  const [galleries, setGalleries] = useState<Gallery[] | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string>(
    exhibit?.imageUrl ?? '',
  );
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const {
    control,
    getValues,
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ExhibitFormValues>({ defaultValues: exhibit });

  const fetchGalleries = useCallback(
    () =>
      void (async () => {
        const galleries = await getGalleries();
        setGalleries(galleries);
      })(),
    [],
  );

  useEffect(fetchGalleries, [fetchGalleries]);

  const requireMsg = '1文字以上の入力が必要です。';
  const invalidDateMsg = '有効な日付を入力してください。';
  const isAdd = exhibit === undefined;

  // 画像選択時の処理
  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file === undefined) {
        return;
      }

      setSelectedFile(file);
      clearErrors('selectedFiles');

      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    },
    [clearErrors],
  );

  const location = watch('location');
  const matchGallery = galleries?.find(x => x.name === location);
  const isMatchGallery = matchGallery !== undefined;

  type LocationFieldProps = ControllerRenderProps<
    ExhibitFormValues,
    'location'
  >;

  const handleLocationChange = useCallback(
    (field: LocationFieldProps) =>
      (event: SyntheticEvent, value: string | null) => {
        field.onChange(value);
      },
    [],
  );

  const handleRenderInput = useCallback((field: LocationFieldProps) => {
    const renderAutocompleteInput = (params: AutocompleteRenderInputParams) => (
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
    );
    return renderAutocompleteInput;
  }, []);

  const renderLocation = useCallback(
    ({ field }: { field: LocationFieldProps }) => {
      const onChange = handleLocationChange(field);
      const renderInput = handleRenderInput(field);

      return (
        <Autocomplete
          freeSolo
          onChange={onChange}
          options={galleries?.map(x => x.name) ?? []}
          renderInput={renderInput}
          value={field.value || null}
        />
      );
    },
    [galleries, handleLocationChange, handleRenderInput],
  );

  const onChangeLocation = useCallback(() => {
    fetchGalleries();
    setError('location', {});
  }, [setError, fetchGalleries]);

  const onValid: SubmitHandler<ExhibitFormValues> = useCallback(
    async data => {
      if (!isMatchGallery) {
        setError('location', {
          message: 'ギャラリー情報の指定または入力が必要です。',
        });
        return;
      }

      if (user === null) return;

      // 処理開始
      setUploadProgress(0);

      const exhibitData = {
        title: data.title,
        location: data.location,
        galleryId: matchGallery.id,
        startDate: new Date(data.startDateString + 'T00:00:00'),
        endDate: new Date(data.endDateString + 'T23:59:59'),
      };

      if (exhibit === undefined) {
        // 新規登録
        if (!selectedFile) {
          setError('selectedFiles', {
            message: 'ファイルを選択してください。',
          });
          return;
        }

        const createdExhibit = await createExhibit(
          user.uid,
          exhibitData,
          selectedFile,
          (progress: number) => setUploadProgress(progress),
        );

        onSubmit(createdExhibit);
      } else {
        // 編集
        const editedExhibit = {
          ...exhibit,
          ...exhibitData,
        };
        const updatedExhibit = await updateExhibit(
          user.uid,
          editedExhibit,
          selectedFile,
          (progress: number) => setUploadProgress(progress),
        );

        onSubmit(updatedExhibit);
      }

      setUploadProgress(null);
    },
    [
      exhibit,
      isMatchGallery,
      matchGallery?.id,
      onSubmit,
      selectedFile,
      setError,
      user,
    ],
  );

  const onSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit(onValid)(e);
    },
    [handleSubmit, onValid],
  );

  return (
    <form onSubmit={onSubmitForm}>
      <h2 className="w-fit">{isAdd ? '展示登録' : '展示修正'}</h2>

      <div
        className={`
          my-2 flex max-w-2xl flex-col

          md:flex-row
        `}>
        <div className="flex max-w-max basis-1/2 flex-col gap-2 p-2">
          <FileInput accept="image/*" onChange={onFileChange} />
          <p className="text-xs text-red-600">
            {errors.selectedFiles?.message}
          </p>
          <img className="w-full max-w-xs" src={previewImage} />
        </div>
        <div
          className={`
            flex basis-1/2 flex-col gap-2 p-2

            md:w-max
          `}>
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
              render={renderLocation}
              rules={{ required: requireMsg }}
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
              <NoGalleryInfo newName={location} onChange={onChangeLocation} />
            )}
          </div>
          <Textbox
            defaultDateValue={exhibit?.startDate}
            fieldError={errors.startDateString}
            label="開始日時"
            type="date"
            {...register('startDateString', {
              validate: v => !isNaN(new Date(v).getDate()) || invalidDateMsg,
            })}
          />
          <Textbox
            defaultDateValue={exhibit?.endDate}
            fieldError={errors.endDateString}
            label="終了日時"
            type="date"
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

      <MuiJoyButton
        className={`
          border border-solid border-neutral-300 bg-neutral-50 text-neutral-900
        `}
        disabled={uploadProgress !== null}
        loading={uploadProgress !== null}
        loadingPosition="start"
        startDecorator={isAdd ? <FaPlus /> : <FaCheck />}
        style={{ opacity: uploadProgress !== null ? 0.4 : 1 }}
        type="submit">
        {isAdd ? '追加' : '変更'}
      </MuiJoyButton>
      {uploadProgress !== null && (
        <div className="pt-4">
          <ProgressBar value={uploadProgress / 100} />
        </div>
      )}
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

  const onValid: SubmitHandler<Gallery> = useCallback(
    async data => {
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
    },
    [props, setError],
  );

  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    e => {
      clearErrors('name');
      void handleSubmit(onValid)(e);
    },
    [clearErrors, handleSubmit, onValid],
  );

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
          className="w-fit"
          color="neutral"
          loading={isSubmitting}
          onClick={onClick}
          size="sm"
          startDecorator={<FaPlus />}
          variant="soft">
          追加
        </MuiJoyButton>
      </div>
    </Card>
  );
};
