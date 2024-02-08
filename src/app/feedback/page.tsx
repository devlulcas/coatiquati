import { NewFeedbackForm } from '@/modules/feedback/components/new-feedback-form';

export default function FeedbackPage() {
  return (
    <div className="h-[--view-height] w-full flex items-center justify-center">
      <NewFeedbackForm />
    </div>
  );
}
