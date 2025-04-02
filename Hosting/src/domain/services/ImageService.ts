import { ImageStatus } from 'src/domain/entities';

export interface ImageCompressor {
  compressImage: (imageData: Blob) => Promise<File>;
  createThumbnail: (imageData: Blob) => Promise<File>;
}

export interface UploadImageProps {
  userId: string;
  file: File;
  documentId: string;

  /** 0～100%の数値で進捗を通知する */
  progressCallback?: (progress: number) => void;
}

export interface UploadImageResult {
  imageUrl: string;
  thumbUrl: string;
}

export interface ImageRepo {
  uploadImage: (props: UploadImageProps) => Promise<string>;
  uploadThumbnail: (props: UploadImageProps) => Promise<string>;

  /** 指定された画像とサムネイル画像を削除 */
  deleteImage: (image: ImageStatus) => Promise<void>;
}

export class ImageService {
  constructor(
    private imageCompressor: ImageCompressor,
    private imageRepo: ImageRepo,
  ) {}

  async uploadImage(
    userId: string,
    imageFile: File,
    imageId: string,
    progressCallback?: (progress: number) => void,
  ): Promise<UploadImageResult> {
    // blobオブジェクトへ変換
    const blob = await this.fetchImageBlob(URL.createObjectURL(imageFile));

    // 圧縮処理
    const compressedFile = await this.imageCompressor.compressImage(blob);
    progressCallback?.(10);

    const thumbnailFile = await this.imageCompressor.createThumbnail(blob);
    progressCallback?.(20);

    // アップロード
    const imageUrl = await this.imageRepo.uploadImage({
      userId,
      file: compressedFile,
      documentId: imageId,
      progressCallback: progressCallback
        ? progress => progressCallback(20 + progress * 0.4)
        : undefined,
    });
    const thumbUrl = await this.imageRepo.uploadThumbnail({
      userId,
      file: thumbnailFile,
      documentId: imageId,
      progressCallback: progressCallback
        ? progress => progressCallback(60 + progress * 0.4)
        : undefined,
    });

    return { imageUrl, thumbUrl };
  }

  private async fetchImageBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return await response.blob();
  }

  async deleteImage(image: ImageStatus) {
    this.imageRepo.deleteImage(image);
  }
}
