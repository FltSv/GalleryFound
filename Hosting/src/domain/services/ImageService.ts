import { ImageStatus } from 'src/domain/entities';

export interface ImageCompressor {
  compressImage: (imageData: Blob) => Promise<File>;
  createThumbnail: (imageData: Blob) => Promise<File>;
}

export interface ImageRepo {
  uploadImage: (userId: string, file: File) => Promise<string>;
  uploadThumbnail: (userId: string, file: File) => Promise<void>;
}

export class ImageService {
  constructor(
    private imageCompressor: ImageCompressor,
    private imageRepo: ImageRepo,
  ) {}

  async uploadImages<T extends ImageStatus>(
    userId: string,
    images: T[],
  ): Promise<T[]> {
    const tasks = images.map(image => this.uploadImage(userId, image));
    return await Promise.all(tasks);
  }

  private async uploadImage<T extends ImageStatus>(
    userId: string,
    image: T,
  ): Promise<T> {
    // イメージの更新が無ければスキップ
    if (image.tmpImageData === '') {
      return image;
    }

    // blobURL→blobオブジェクトへ変換
    const blob = await this.fetchImageBlob(image.tmpImageData);

    // 圧縮処理
    const compressedFile = await this.imageCompressor.compressImage(blob);
    const thumbnailFile = await this.imageCompressor.createThumbnail(blob);

    // アップロード
    const srcImage = await this.imageRepo.uploadImage(userId, compressedFile);
    await this.imageRepo.uploadThumbnail(userId, thumbnailFile);

    return { ...image, srcImage };
  }

  private async fetchImageBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return await response.blob();
  }
}
