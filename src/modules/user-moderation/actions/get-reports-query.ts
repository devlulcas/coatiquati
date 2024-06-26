'use server';

import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { fail, ok, type Result } from '@/shared/lib/result';
import type { SQL } from 'drizzle-orm';
import type { ReportSearchSchema } from '../schemas/report-search';
import type { Report } from '../types/report';

export async function getReportsQuery(params: ReportSearchSchema = { skip: 0, take: 30 }): Promise<Result<Report[]>> {
  const session = await getPageSession();

  if (!isAdminOrAbove(session?.user.role)) {
    return fail('Você não tem permissão para ver os reports');
  }

  const reports = await db.query.reportTable.findMany({
    limit: params.take,
    offset: params.skip,
    with: {
      reportedUser: {
        columns: {
          avatar: true,
          email: true,
          id: true,
          isBanned: true,
          username: true,
        },
      },
      reportedBy: {
        columns: {
          avatar: true,
          email: true,
          id: true,
          isBanned: true,
          username: true,
        },
      },
    },
    where: (fields, operators) => {
      const filters: SQL[] = [];

      for (const [field, value] of Object.entries(params)) {
        if (field === 'status' && typeof value !== 'undefined') {
          const filter = {
            pending: operators.eq(fields.status, 'pending'),
            resolved: operators.eq(fields.status, 'resolved'),
            rejected: operators.isNull(fields.deletedAt),
          };

          filters.push(filter[value as keyof typeof filter]);
        }

        if (value && Object.hasOwn(fields, field)) {
          const databaseField = fields[field as keyof typeof fields];

          if (Object.hasOwn(databaseField, 'columnType')) {
            filters.push(operators.eq(databaseField, value));
          }
        }
      }

      return operators.and(...filters);
    },
  });

  return ok(
    reports.map(report => ({
      ...report,
      reportedBy: {
        avatar: report.reportedBy.avatar,
        email: report.reportedBy.email,
        id: report.reportedBy.id,
        isBanned: Boolean(report.reportedBy.isBanned),
        username: report.reportedBy.username,
      },
      reportedEntity: {
        id: report.reportedEntityId,
        type: report.reportedEntityType,
      },
      user: {
        avatar: report.reportedUser.avatar,
        email: report.reportedUser.email,
        id: report.reportedUser.id,
        isBanned: Boolean(report.reportedUser.isBanned),
        username: report.reportedUser.username,
      },
    })),
  );
}
