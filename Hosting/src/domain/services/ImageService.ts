import { Exhibit } from 'src/domain/entities';

export interface ImageCompressor {
  compressImage: (imageData: Blob) => Promise<File>;
  createThumbnail: (imageData: Blob) => Promise<File>;
}

export interface UploadImageProps {
  userId: string;
  file: File;
  documentId: string;
  progressCallback?: (progress: number) => void;
}

export interface UploadImageResult {
  imageUrl: string;
  thumbUrl: string;
}

export interface ImageRepo {
  uploadImage: (props: UploadImageProps) => Promise<string>;
  uploadThumbnail: (props: UploadImageProps) => Promise<string>;
}

export class ImageService {
  constructor(
    private imageCompressor: ImageCompressor,
    private imageRepo: ImageRepo,
  ) {}

  async uploadImages(userId: string, images: Exhibit[]): Promise<Exhibit[]> {
    const tasks = images.map(image => this.uploadImage_legacy(userId, image));
    return await Promise.all(tasks);
  }

  private async uploadImage_legacy(
    userId: string,
    image: Exhibit,
  ): Promise<Exhibit> {
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
    const srcImage = await this.imageRepo.uploadImage({
      userId,
      file: compressedFile,
      documentId: image.id,
    });
    await this.imageRepo.uploadThumbnail({
      userId,
      file: thumbnailFile,
      documentId: image.id,
    });

    return { ...image, srcImage };
  }

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
    const thumbnailFile = await this.imageCompressor.createThumbnail(blob);

    // アップロード
    const imageUrl = await this.imageRepo.uploadImage({
      userId,
      file: compressedFile,
      documentId: imageId,
      progressCallback,
    });
    const thumbUrl = await this.imageRepo.uploadThumbnail({
      userId,
      file: thumbnailFile,
      documentId: imageId,
      progressCallback,
    });

    return { imageUrl, thumbUrl };
  }

  private async fetchImageBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return await response.blob();
  }
}
