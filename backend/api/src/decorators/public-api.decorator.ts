import { SetMetadata } from '@nestjs/common';
import { PUBLIC_API } from '../constants';

export const Public = () => SetMetadata(PUBLIC_API, true);
