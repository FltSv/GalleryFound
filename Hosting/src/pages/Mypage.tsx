import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  KeyboardEvent,
  SetStateAction,
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
import { Button as MuiJoyButton, IconButton, Card, Input } from '@mui/joy';
import { FaCheck, FaPen, FaPlus, FaTimes } from 'react-icons/fa';
import { RiDraggable } from 'react-icons/ri';
import { useAuthContext } from 'src/contexts/AuthContext';
import {
  Button,
  FileInput,
  HashtagTextarea,
  Switch,
  SubmitButton,
  Textarea,
  Textbox,
  EditableText,
} from 'src/components/Input';
import { Popup } from 'components/Popup';
import { Creator, Product, Exhibit, Gallery } from 'src/domain/entities';
import { DraggableList, SortableProps } from 'components/DraggableList';
import { getConfig } from 'src/infra/firebase/firebaseConfig';
import { UserName } from 'src/domain/UserName';
import { setCreatorData } from 'src/infra/firebase/CreatorRepo';
import {
  createExhibit,
  createProduct,
  deleteExhibit,
  deleteProduct,
  updateExhibit,
} from 'src/application/CreatorService';
import {
  getGallery,
  getGalleryByPlaceId,
  updateGallery,
} from 'src/application/GalleryMapService';
import { ProgressBar } from 'components/ProgressBar';
import { FeedbackButton } from 'components/FeedbackButton';
import { useFormGuard } from 'src/hooks/useFormGuard';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { Spinner } from 'components/Spinner';
import { Snackbar } from 'src/components/Snackbar';
import { useCreatorContext } from 'src/contexts/CreatorContext';
import { MapLocationPicker } from 'src/components/MapLocationPicker';
import { PlaceData } from 'src/domain/place';
import { SelectableText } from 'src/components/Input/SelectableText';

export const Mypage = () => {
  const {
    creator: contextCreator,
    loading,
    update: updateCreator,
  } = useCreatorContext();
  const [creator, setCreator] = useState<Creator | null>(null);
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
  const { isDirty, markAsDirty, markAsClean } = useFormGuard();

  // contextCreatorが変更されたらcreatorを更新
  useEffect(() => {
    if (contextCreator !== null) {
      setCreator(contextCreator);
    }
  }, [contextCreator]);

  // ジャンル情報の取得
  useEffect(() => {
    void (async () => {
      const genres = (await getConfig()).genres;
      setGenres(genres);
    })().catch((e: unknown) => {
      console.error('failed fetch genres data: ', e);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Creator>();

  // フォームの変更を監視
  useEffect(() => {
    const subscription = watch(() => markAsDirty());
    return () => subscription.unsubscribe();
  }, [watch, markAsDirty]);

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
    if (creator === null) return;
    if (addLinkError) return;

    const links = [...creator.links, addLink];
    setCreator({ ...creator, links });
    setAddLink('');
    markAsDirty();
  }, [creator, addLink, addLinkError, markAsDirty]);

  /** Linkの削除 */
  const handleRemoveLink = useCallback(
    (link: string) => () => {
      if (creator === null) return;

      const links = creator.links.filter(x => x !== link);
      setCreator({ ...creator, links });
      markAsDirty();
    },
    [creator, markAsDirty],
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
      if (creator === null) return;

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
          creator.id,
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
      markAsDirty();

      setUploadProgress(null);
    },
    [creator, markAsDirty],
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
      if (creator === null) return;

      const newProducts = items
        .map(item => creator.products.find(product => product.id === item.id))
        .filter(x => x !== undefined);

      setCreator({ ...creator, products: newProducts });
      markAsDirty();
    },
    [creator, markAsDirty],
  );

  /** 作品の削除 */
  const onDeleteRenderProduct = useCallback(
    async (product: Product) => {
      if (creator === null) return;

      await deleteProduct(creator.id, product);

      const newProducts = creator.products.filter(x => x.id !== product.id);
      setCreator({ ...creator, products: newProducts });
      markAsDirty();
    },
    [creator, markAsDirty],
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
    async (exhibit: Exhibit) => {
      if (creator === null) return;

      await deleteExhibit(creator.id, exhibit);

      const newExhibits = creator.exhibits.filter(x => x.id !== exhibit.id);
      setCreator({ ...creator, exhibits: newExhibits });
      markAsDirty();
    },
    [creator, markAsDirty],
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
      if (creator === null) return;
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
      markAsDirty();
      setVisibleProductPopup(false);
    },
    [creator, editProduct, markAsDirty],
  );

  const onSubmitExhibitPopup = useCallback(
    (newValue: Exhibit) => {
      if (creator === null) return;

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

      markAsDirty();
      setVisibleExhibitPopup(false);
    },
    [creator, editExhibit, markAsDirty],
  );

  // - - - - - - - -
  // フォーム全体の検証、送信

  const onValid: SubmitHandler<Creator> = useCallback(
    async data => {
      if (creator === null) return;

      // 一時データの結合
      const submitData = {
        ...data,
        id: creator.id,
        name: new UserName(data.name).toString(),
        profileHashtags: profileHashtags,
        links: creator.links,
        products: creator.products,
        exhibits: creator.exhibits,
        highlightThumbUrl:
          creator.products.find(p => p.isHighlight)?.thumbUrl ?? null,
      };

      // ローディングの表示
      setIsSubmitting(true);

      // 情報の送信
      console.debug('submit: ', submitData);
      await setCreatorData(submitData);

      // CreatorContextを更新
      updateCreator(submitData);

      // 変更状態をリセット
      markAsClean();
      setIsSubmitting(false);
      await Snackbar.call({
        message: '更新が完了しました！',
        theme: 'success',
      });
    },
    [creator, profileHashtags, markAsClean, updateCreator],
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      handleSubmit(onValid)(e);
    },
    [handleSubmit, onValid],
  );

  if (loading || creator === null) {
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
              my-1 w-fit rounded-md border border-black bg-transparent px-2 py-2
              outline-hidden
              focus:border-blue-600 focus:ring-1 focus:ring-blue-600
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
          {creator !== null && (
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
              {creator?.exhibits
                .slice()
                .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
                .map(exhibit => (
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
          className="w-fit rounded-md bg-white text-black"
          disabled={!isDirty}
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

      <FeedbackButton />
      <ConfirmDelete.Root />
      <Snackbar.Root />
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

  const [loading, setLoading] = useState<boolean>(false);

  const onEditClick = useCallback(() => {
    onEdit(data);
  }, [data, onEdit]);

  const onDeleteClick = useCallback(async () => {
    const isAccepted = await ConfirmDelete.call({
      title: 'この項目を削除しますか？',
      message: 'この操作は元に戻せません。',
    });

    if (!isAccepted) {
      return;
    }

    setLoading(true);
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
        <div className="relative inline-block">
          {loading && (
            <div
              className={`
                absolute inset-0 z-10 flex items-center justify-center
              `}>
              <Spinner />
            </div>
          )}
          <img
            className={`
              h-28 p-2 transition-opacity duration-300
              ${loading ? 'opacity-50' : ''}
              md:h-40
            `}
            key={data.id}
            src={data.imageUrl}
          />
        </div>
        <p className="absolute bottom-0 w-fit bg-black/50 px-2 text-white">
          {data.title}
        </p>
      </div>
      <div className="absolute top-0 right-0 flex flex-col gap-2">
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

  const [loading, setLoading] = useState<boolean>(false);

  const onEditClick = useCallback(() => {
    onEdit(data);
  }, [data, onEdit]);

  const onDeleteClick = useCallback(async () => {
    const isAccepted = await ConfirmDelete.call({
      title: 'この項目を削除しますか？',
      message: 'この操作は元に戻せません。',
    });

    if (!isAccepted) {
      return;
    }

    setLoading(true);
    onDelete(data);
  }, [data, onDelete]);

  return (
    <tr
      className={`
        odd:bg-neutral-200
        even:bg-neutral-50
      `}>
      <td className="relative flex gap-4 p-2">
        {loading && (
          <div
            className={`
              absolute inset-0 z-10 flex items-center justify-center bg-white/60
            `}>
            <Spinner />
          </div>
        )}
        {/* 画像 */}
        <img
          alt={data.title}
          className={`
            max-w-32
            md:max-w-40
          `}
          src={data.imageUrl}
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
            mt-2 mb-4 flex max-w-2xl flex-col gap-4
            md:flex-row
          `}>
          <div className="flex max-w-max basis-1/2 flex-col">
            <img className="w-full max-w-xs" src={product.imageUrl} />
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
              <Textarea rows={3} {...register('detail')} />
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
  const [previewImage, setPreviewImage] = useState<string>(
    exhibit?.imageUrl ?? '',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [gallery, setGallery] = useState<Gallery | null>(null);

  const {
    control,
    getValues,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ExhibitFormValues>({ defaultValues: exhibit });

  const requireMsg = '1文字以上の入力が必要です。';
  const invalidDateMsg = '有効な日付を入力してください。';
  const isAdd = exhibit === undefined;

  // 編集時、ギャラリー情報を取得
  useEffect(() => {
    if (exhibit?.galleryId === undefined) return;

    const fetchGallery = async () => {
      try {
        const galleryData = await getGallery(exhibit.galleryId);

        if (galleryData !== undefined) {
          setGallery(galleryData);
        }
      } catch (error) {
        console.error('ギャラリー情報の取得に失敗しました:', error);
      }
    };

    fetchGallery();
  }, [exhibit]);

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

  const onInitialLoad = useCallback(
    (locationData: PlaceData) => {
      if (gallery === null) {
        return;
      }

      if (gallery.placeId === undefined) {
        setSelectedPlace(locationData);
      }
    },
    [gallery],
  );

  type LocationFieldProps = ControllerRenderProps<
    ExhibitFormValues,
    'location'
  >;

  const createLocationSelectHandler = useCallback(
    (field: LocationFieldProps) => async (locationData: PlaceData) => {
      field.onChange(locationData.name);
      setSelectedPlace(locationData);

      // PlaceIdに一致するギャラリーを取得
      const galleryData = await getGalleryByPlaceId(locationData.placeId);
      if (galleryData !== undefined) {
        setGallery(galleryData);
        return;
      }

      // ギャラリーが存在しない場合、PlaceDataを使用して新規作成
      setGallery({
        id: '',
        placeId: locationData.placeId,
        name: locationData.name,
        location: locationData.address,
        latLng: locationData.position,
        openingHours: locationData.openingHours,
      });
    },
    [],
  );

  const renderLocation = useCallback(
    ({ field }: { field: LocationFieldProps }) => {
      const locationSelectHandler = createLocationSelectHandler(field);

      return (
        <MapLocationPicker
          initialLocation={field.value}
          initialPosition={gallery?.latLng}
          onInitialLoad={onInitialLoad}
          onSelectLocation={locationSelectHandler}
        />
      );
    },
    [createLocationSelectHandler, gallery?.latLng, onInitialLoad],
  );

  // ファイル選択の検証
  const validateSelectedFiles = (fileList?: FileList) => {
    if (!isAdd) {
      return true;
    }

    return (fileList?.length ?? 0) > 0 || 'ファイルを選択してください。';
  };

  // 開始日時の検証
  const validateStartDate = (dateString: string) =>
    !isNaN(new Date(dateString).getDate()) || invalidDateMsg;

  // 終了日時の検証
  const validateEndDate = (dateString: string) => {
    const endDate = new Date(dateString);
    const startDate = new Date(getValues('startDateString'));

    if (isNaN(endDate.getDate())) {
      return invalidDateMsg;
    }

    if (endDate < startDate) {
      return '終了日は開始日以降である必要があります。';
    }

    return true;
  };

  const onValid: SubmitHandler<ExhibitFormValues> = useCallback(
    async data => {
      if (gallery === null) {
        setError('location', {
          message: 'ギャラリー情報の指定または入力が必要です。',
        });
        return;
      }

      if (user === null) return;

      // 処理開始
      setUploadProgress(0);

      // ギャラリー情報の追加・編集
      const updatedGallery = await updateGallery(gallery);

      const exhibitData = {
        title: data.title,
        location: updatedGallery.name,
        galleryId: updatedGallery.id,
        startDate: new Date(data.startDateString),
        endDate: new Date(data.endDateString),
      };

      if (exhibit === undefined) {
        // 新規登録
        if (selectedFile === null) {
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
          selectedFile ?? undefined,
          (progress: number) => setUploadProgress(progress),
        );

        onSubmit(updatedExhibit);
      }

      setUploadProgress(null);
    },
    [exhibit, onSubmit, selectedFile, setError, user, gallery],
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
          <FileInput
            accept="image/*"
            {...register('selectedFiles', {
              validate: validateSelectedFiles,
            })}
            onChange={onFileChange}
          />
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
              rules={{ required: '場所を選択してください。' }}
            />
            <GalleryInfoCard
              gallery={gallery}
              onEdit={setGallery}
              placeData={selectedPlace}
            />
            <p className="text-xs text-red-600">{errors.location?.message}</p>
          </div>
          <Textbox
            defaultDateValue={exhibit?.startDate}
            fieldError={errors.startDateString}
            label="開始日時"
            type="date"
            {...register('startDateString', {
              validate: validateStartDate,
            })}
          />
          <Textbox
            defaultDateValue={exhibit?.endDate}
            fieldError={errors.endDateString}
            label="終了日時"
            type="date"
            {...register('endDateString', {
              validate: validateEndDate,
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

interface GalleryInfoCardProps {
  gallery: Gallery | null;
  placeData: PlaceData | null;
  onEdit?: (gallery: Gallery) => void;
}

const GalleryInfoCard = ({
  gallery,
  placeData,
  onEdit,
}: GalleryInfoCardProps) => {
  const [galleryState, setGalleryState] = useState<Gallery | null>(gallery);

  // galleryまたはplaceDataが変更されたときにgalleryStateを更新
  useEffect(() => {
    setGalleryState(state => {
      if (gallery === null) {
        return null;
      }

      // 営業時間が未設定の場合、PlaceDataを使用して更新
      if (gallery?.openingHours === undefined && placeData !== null) {
        return {
          ...gallery,
          ...state,
          openingHours: placeData.openingHours,
        };
      }

      // PlaceIdが未設定の場合、PlaceDataを使用して更新
      if (gallery?.placeId === undefined && placeData !== null) {
        return {
          ...gallery,
          ...state,
          placeId: placeData.placeId,
        };
      }

      return gallery;
    });
  }, [gallery, placeData]);

  // galleryStateが変更されたときに親コンポーネントに通知
  useEffect(() => {
    if (galleryState !== null) {
      if (galleryState.operationType === '不明') {
        onEdit?.({ ...galleryState, operationType: undefined });
        return;
      }

      onEdit?.(galleryState);
    }
  }, [galleryState, onEdit]);

  const handlePropertyChange = useCallback(
    (property: keyof Gallery) => (value: string) => {
      if (galleryState !== null) {
        setGalleryState({ ...galleryState, [property]: value });
        return;
      }

      if (placeData === null) {
        return;
      }

      const newGallery: Gallery = {
        id: '',
        placeId: placeData.placeId,
        name: placeData.name,
        location: placeData.address,
        latLng: placeData.position,
        openingHours: placeData.openingHours,
      };

      setGalleryState({
        ...newGallery,
        [property]: value,
      });
    },
    [galleryState, placeData],
  );

  if (placeData === null && gallery === null) {
    return (
      <Card>
        <p>場所が選択されていません。</p>
      </Card>
    );
  }

  const name = gallery?.name ?? placeData?.name;
  const address = gallery?.location ?? placeData?.address;
  const openingHours = gallery?.openingHours ?? placeData?.openingHours;
  const artType = gallery?.artType;
  const operationType = gallery?.operationType;

  return (
    <Card className="flex flex-col gap-2">
      <div>
        <EditableText
          className="text-lg font-bold"
          onChange={handlePropertyChange('name')}
          value={name}
        />
        <EditableText
          onChange={handlePropertyChange('location')}
          value={address}
        />
      </div>

      <div>
        <p className="text-sm font-semibold">営業時間</p>
        <div>
          {(openingHours?.weekdayDescriptionsWithoutClosed.length ?? 0) > 0 ? (
            openingHours?.weekdayDescriptionsWithoutClosed.map(openingHour => (
              <p className="text-sm" key={openingHour}>
                {openingHour}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-400">情報がありません</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">取扱作品</p>
        <EditableText
          onChange={handlePropertyChange('artType')}
          value={artType}
        />
      </div>

      <div>
        <p className="text-sm font-semibold">運営形態</p>
        <SelectableText
          onChange={handlePropertyChange('operationType')}
          options={['貸出', 'コマーシャル']}
          undefinedOption="不明"
          value={operationType}
        />
      </div>
    </Card>
  );
};
