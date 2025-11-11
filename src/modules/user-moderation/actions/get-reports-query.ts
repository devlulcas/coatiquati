'use server';

import { getRole } from '@/modules/auth/lib/auth-client';
import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ok, type Result } from '@/shared/lib/result';
import type { SQL } from 'drizzle-orm';
import type { ReportSearchSchema } from '../schemas/report-search';
import type { Report } from '../types/report';

export async function getReportsQuery(
  params: ReportSearchSchema
): Promise<Result<Report[]>> {
  const currentUser = await getCurrentUser();
  assertAuthenticated(currentUser);

  const reports = await db.query.reports.findMany({
    limit: params.take,
    offset: params.skip,
    with: {
      reportedUser: {
        columns: {
          image: true,
          email: true,
          id: true,
          banned: true,
          name: true,
          banExpires: true,
          banReason: true,
          createdAt: true,
          role: true,
          username: true,
        },
      },
      reportedBy: {
        columns: {
          image: true,
          email: true,
          id: true,
          banned: true,
          name: true,
          banExpires: true,
          banReason: true,
          createdAt: true,
          role: true,
          username: true,
        },
      },
    },
    where: (fields, operators) => {
      const filters: SQL[] = [];

      params.search &&
        filters.push(operators.like(fields.description, `%${params.search}%`));
      params.reportedById &&
        filters.push(operators.eq(fields.reportedById, params.reportedById));
      params.reportedEntityId &&
        filters.push(
          operators.eq(fields.reportedById, params.reportedEntityId)
        );
      params.type && filters.push(operators.eq(fields.type, params.type));
      params.status && filters.push(operators.eq(fields.status, params.status));

      return operators.and(...filters);
    },
  });

  return ok(
    reports.map(({ reportedBy, reportedUser, ...report }) => ({
      ...report,
      reportedBy: {
        id: reportedBy.id,
        name: reportedBy.name,
        username: reportedBy.username,
        image: reportedBy.image,
        banned: Boolean(reportedBy.banned),
        createdAt: reportedBy.createdAt,
        role: getRole(reportedBy.role),
      },
      reportedUser: {
        id: reportedUser.id,
        name: reportedUser.name,
        username: reportedUser.username,
        image: reportedUser.image,
        banned: Boolean(reportedUser.banned),
        createdAt: reportedUser.createdAt,
        role: getRole(reportedUser.role),
      },
    }))
  );
}
