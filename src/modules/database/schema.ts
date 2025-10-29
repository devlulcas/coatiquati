import * as authSchema from './schema/auth';
import * as categorySchema from './schema/category';
import * as commentSchema from './schema/comment';
import * as contentSchema from './schema/content';
import * as contributionSchema from './schema/contribution';
import * as feedbackSchema from './schema/feedback';
import * as fileSchema from './schema/file';
import * as pomodoroSessionsSchema from './schema/pomodoro-sessions';
import * as pomodoroSettingsSchema from './schema/pomodoro-settings';
import * as publicationSchema from './schema/publication';
import * as publicationMediaSchema from './schema/publication-media';
import * as reportSchema from './schema/report';
import * as todosSchema from './schema/todos';
import * as topicSchema from './schema/topic';
import * as trailSchema from './schema/trail';
import * as trailSubscriptionSchema from './schema/trail-subscription';
import * as userFollowerSchema from './schema/user-follower';

export const schema = {
  ...categorySchema,
  ...commentSchema,
  ...contentSchema,
  ...contributionSchema,
  ...authSchema,
  ...feedbackSchema,
  ...fileSchema,
  ...pomodoroSessionsSchema,
  ...pomodoroSettingsSchema,
  ...publicationMediaSchema,
  ...publicationSchema,
  ...reportSchema,
  ...todosSchema,
  ...topicSchema,
  ...trailSubscriptionSchema,
  ...trailSchema,
  ...userFollowerSchema,
};
