import { IVideoCategoryReponse } from 'src/modules/video-category/responses';

export interface IVideoResponse {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoCategory: IVideoCategoryReponse;
  createdAt: Date;
}
