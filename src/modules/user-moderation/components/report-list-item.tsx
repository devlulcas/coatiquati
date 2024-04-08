import { REPORT_REASON_LABELS, type ReportReason } from '@/modules/user-moderation/constants/report';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import type { Report } from '../types/report';
import { BanActionConfirmationDialog } from './ban-action-confirmation-dialog';
import { IgnoreReportButton } from './ignore-report-button';

type ReportListItemProps = {
  report: Report;
};

export default async function ReportListItem({ report }: ReportListItemProps) {
  return (
    <li className="flex flex-col gap-2 border-l-2 border-destructive bg-background/75 py-4 pl-4">
      <div className="flex items-center space-x-2">
        <UserAvatar user={report.reportedBy} />

        <p className="flex flex-wrap items-center gap-[.5ch]">
          {report.reportedBy.username} reportou{' '}
          <span className="rounded bg-destructive/75 px-2 text-sm text-destructive-foreground">
            {report.user.username}
          </span>
          por
          <ReportReasonLabel reason={report.type} />
          {report.deletedAt === null && report.status === 'resolved' && (
            <span className="rounded bg-green-500/75 px-2 text-sm text-green-50">resolvido</span>
          )}
          {report.deletedAt === null && report.status === 'pending' && (
            <span className="rounded bg-yellow-700/75 px-2 text-sm text-yellow-50">pendente</span>
          )}
          {report.deletedAt !== null && (
            <span className="rounded bg-gray-700/75 px-2 text-sm text-gray-50">ignorado</span>
          )}
        </p>
      </div>

      <p className="text-wrap">{report.description}</p>
      <div className="flex w-full items-center justify-end space-x-2">
        <BanActionConfirmationDialog
          reportId={report.id}
          user={{
            username: report.user.username,
            isBanned: report.user.isBanned,
          }}
        />

        <IgnoreReportButton reportId={report.id} />
      </div>
    </li>
  );
}

function ReportReasonLabel({ reason }: { reason: ReportReason }) {
  return (
    <span className="rounded bg-destructive/75 px-2 text-sm text-destructive-foreground">
      {REPORT_REASON_LABELS[reason]}
    </span>
  );
}
