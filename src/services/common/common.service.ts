'server-only';

import { remember } from '@epic-web/remember';

import { env } from '~/app/env';
import { db } from '~/services/db/prisma';

export class CommonService {
  getReportReasons() {
    return db.reportReason.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

export const commonService =
  env.NODE_ENV === 'development'
    ? new CommonService()
    : remember('commonService', () => new CommonService());
