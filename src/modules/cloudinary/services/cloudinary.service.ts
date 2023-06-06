import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
@Injectable()
export class CloudinaryService {
  /**get public id from cloudinary url */
  getPublicId = (videoURL: string) => videoURL.split('/').pop().split('.')[0];

  async uploadVideo(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: 'video',
          chunk_size: 1024 * 1000 * 1000,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteVideo(folderName, public_id) {
    return await v2.uploader.destroy(`${folderName}/${public_id}`, {
      resource_type: 'video',
    });
  }
}
