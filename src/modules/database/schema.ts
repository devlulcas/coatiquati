import * as categorySchema from "./schema/category"
import * as commentSchema from "./schema/comment"
import * as contentSchema from "./schema/content"
import * as contributionSchema from "./schema/contribution"
import * as emailVerificationTokenSchema from "./schema/email-verification-token"
import * as feedbackSchema from "./schema/feedback"
import * as fileSchema from "./schema/file"
import * as passwordResetTokenSchema from "./schema/password-reset-token"
import * as pomodoroSessionsSchema from "./schema/pomodoro-sessions"
import * as pomodoroSettingsSchema from "./schema/pomodoro-settings"
import * as publicationSchema from "./schema/publication"
import * as publicationMediaSchema from "./schema/publication-media"
import * as reportSchema from "./schema/report"
import * as sessionSchema from "./schema/session"
import * as todosSchema from "./schema/todos"
import * as topicSchema from "./schema/topic"
import * as trailSchema from "./schema/trail"
import * as trailSubscriptionSchema from "./schema/trail-subscription"
import * as userSchema from "./schema/user"
import * as userFollowerSchema from "./schema/user-follower"

export const schema = {
  ...categorySchema,
  ...commentSchema,
  ...contentSchema,
  ...contributionSchema,
  ...emailVerificationTokenSchema,
  ...feedbackSchema,
  ...fileSchema,
  ...passwordResetTokenSchema,
  ...pomodoroSessionsSchema,
  ...pomodoroSettingsSchema,
  ...publicationMediaSchema,
  ...publicationSchema,
  ...reportSchema,
  ...sessionSchema,
  ...todosSchema,
  ...topicSchema,
  ...trailSubscriptionSchema,
  ...trailSchema,
  ...userFollowerSchema,
  ...userSchema,
};
