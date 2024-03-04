import { NewFeedbackForm } from '@/modules/feedback/components/new-feedback-form';

export default function FeedbackPage() {
  return (
    <div className="flex min-h-[--view-height] w-full items-center justify-center py-4">
      <NewFeedbackForm />
    </div>
  );
}
