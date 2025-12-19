import * as auth from './schema/auth';
import * as category from './schema/category';
import * as comment from './schema/comment';
import * as content from './schema/content';
import * as contribution from './schema/contribution';
import * as feedback from './schema/feedback';
import * as feedbackResponse from './schema/feedback-response';
import * as file from './schema/file';
import * as pomodoroSessions from './schema/pomodoro-sessions';
import * as pomodoroSettings from './schema/pomodoro-settings';
import * as publication from './schema/publication';
import * as publicationMedia from './schema/publication-media';
import * as report from './schema/report';
import * as todos from './schema/todos';
import * as topic from './schema/topic';
import * as trail from './schema/trail';
import * as trailSubscription from './schema/trail-subscription';
import * as userFollower from './schema/user-follower';
import * as commentVote from './schema/vote';

export const schema = {
  ...auth,
  ...category,
  ...comment,
  ...commentVote,
  ...content,
  ...contribution,
  ...feedbackResponse,
  ...feedback,
  ...file,
  ...pomodoroSessions,
  ...pomodoroSettings,
  ...publicationMedia,
  ...publication,
  ...report,
  ...todos,
  ...topic,
  ...trailSubscription,
  ...trail,
  ...userFollower,
};
