import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access';

/**
 * Trails are groups of topics.
 */
const TRAIL_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete', // soft delete
  CHANGE_PUBLICATION_STATUS: 'change_publication_status', // draft to published and vice versa
  EDIT: 'edit', // edit content
  VIEW: 'view', // view content
  REPORT: 'report', // report content
  COMMENT: 'comment', // comment on content
  VOTE: 'vote', // vote on content
  SUBSCRIBE: 'subscribe', // user can only subscribe to a trail if they are not already subscribed
} as const;

/**
 * Topics are groups of contents.
 */
const TOPIC_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete', // soft delete
  CHANGE_PUBLICATION_STATUS: 'change_publication_status', // draft to published and vice versa
  EDIT: 'edit', // edit content
  VIEW: 'view', // view content
  REPORT: 'report', // report content
  COMMENT: 'comment', // comment on content
  VOTE: 'vote', // vote on content
} as const;

/**
 * Contents are the individual items within a topic. They can be text, images, videos, etc.
 */
const CONTENT_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete', // soft delete
  CHANGE_PUBLICATION_STATUS: 'change_publication_status', // draft to published and vice versa
  EDIT: 'edit', // edit content
  VIEW: 'view', // view content
  REPORT: 'report', // report content
  COMMENT: 'comment', // comment on content
  VOTE: 'vote', // vote on content
} as const;

/**
 * Comments are the individual replies to a content, topic or trail.
 */
const COMMENT_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete',
  EDIT: 'edit',
  VIEW: 'view',
  REPORT: 'report',
  VOTE: 'vote',
} as const;

/**
 * Categories are used to group trails.
 */
const CATEGORY_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete',
  EDIT: 'edit',
  VIEW: 'view',
} as const;

/**
 * Publications are contents that are published to the public by users in their profiles.
 */
const PUBLICATION_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete', // soft delete
  CHANGE_PUBLICATION_STATUS: 'change_publication_status', // draft to published and vice versa
  EDIT: 'edit', // edit content
  VIEW: 'view', // view content
  REPORT: 'report', // report content
  COMMENT: 'comment', // comment on content
  VOTE: 'vote', // vote on content
} as const;

const statement = {
  ...defaultStatements,
  trail: Object.values(TRAIL_ACTIONS),
  topic: Object.values(TOPIC_ACTIONS),
  content: Object.values(CONTENT_ACTIONS),
  comment: Object.values(COMMENT_ACTIONS),
  publication: Object.values(PUBLICATION_ACTIONS),
  category: Object.values(CATEGORY_ACTIONS),
} as const;

const ac = createAccessControl(statement);

const superAdmin = ac.newRole({
  category: [CATEGORY_ACTIONS.CREATE, CATEGORY_ACTIONS.DELETE, CATEGORY_ACTIONS.EDIT, CATEGORY_ACTIONS.VIEW],
  trail: [
    TRAIL_ACTIONS.CREATE,
    TRAIL_ACTIONS.DELETE,
    TRAIL_ACTIONS.CHANGE_PUBLICATION_STATUS,
    TRAIL_ACTIONS.EDIT,
    TRAIL_ACTIONS.VIEW,
    TRAIL_ACTIONS.REPORT,
    TRAIL_ACTIONS.COMMENT,
    TRAIL_ACTIONS.VOTE,
    TRAIL_ACTIONS.SUBSCRIBE,
  ],
  topic: [
    TOPIC_ACTIONS.CREATE,
    TOPIC_ACTIONS.DELETE,
    TOPIC_ACTIONS.CHANGE_PUBLICATION_STATUS,
    TOPIC_ACTIONS.EDIT,
    TOPIC_ACTIONS.VIEW,
    TOPIC_ACTIONS.REPORT,
    TOPIC_ACTIONS.COMMENT,
    TOPIC_ACTIONS.VOTE,
  ],
  content: [
    CONTENT_ACTIONS.CREATE,
    CONTENT_ACTIONS.DELETE,
    CONTENT_ACTIONS.CHANGE_PUBLICATION_STATUS,
    CONTENT_ACTIONS.EDIT,
    CONTENT_ACTIONS.VIEW,
    CONTENT_ACTIONS.REPORT,
    CONTENT_ACTIONS.COMMENT,
    CONTENT_ACTIONS.VOTE,
  ],
  comment: [
    COMMENT_ACTIONS.CREATE,
    COMMENT_ACTIONS.DELETE,
    COMMENT_ACTIONS.EDIT,
    COMMENT_ACTIONS.VIEW,
    COMMENT_ACTIONS.REPORT,
    COMMENT_ACTIONS.VOTE,
  ],
  publication: [
    PUBLICATION_ACTIONS.CREATE,
    PUBLICATION_ACTIONS.DELETE,
    PUBLICATION_ACTIONS.CHANGE_PUBLICATION_STATUS,
    PUBLICATION_ACTIONS.EDIT,
    PUBLICATION_ACTIONS.VIEW,
    PUBLICATION_ACTIONS.REPORT,
    PUBLICATION_ACTIONS.COMMENT,
    PUBLICATION_ACTIONS.VOTE,
  ],
  ...adminAc.statements,
});

const admin = ac.newRole({
  category: [CATEGORY_ACTIONS.CREATE, CATEGORY_ACTIONS.DELETE, CATEGORY_ACTIONS.EDIT, CATEGORY_ACTIONS.VIEW],
  trail: [
    TRAIL_ACTIONS.CREATE,
    TRAIL_ACTIONS.DELETE,
    TRAIL_ACTIONS.CHANGE_PUBLICATION_STATUS,
    TRAIL_ACTIONS.EDIT,
    TRAIL_ACTIONS.VIEW,
    TRAIL_ACTIONS.REPORT,
    TRAIL_ACTIONS.COMMENT,
    TRAIL_ACTIONS.VOTE,
    TRAIL_ACTIONS.SUBSCRIBE,
  ],
  topic: [
    TOPIC_ACTIONS.CREATE,
    TOPIC_ACTIONS.DELETE,
    TOPIC_ACTIONS.CHANGE_PUBLICATION_STATUS,
    TOPIC_ACTIONS.EDIT,
    TOPIC_ACTIONS.VIEW,
    TOPIC_ACTIONS.REPORT,
    TOPIC_ACTIONS.COMMENT,
    TOPIC_ACTIONS.VOTE,
  ],
  content: [
    CONTENT_ACTIONS.CREATE,
    CONTENT_ACTIONS.DELETE,
    CONTENT_ACTIONS.CHANGE_PUBLICATION_STATUS,
    CONTENT_ACTIONS.EDIT,
    CONTENT_ACTIONS.VIEW,
    CONTENT_ACTIONS.REPORT,
    CONTENT_ACTIONS.COMMENT,
    CONTENT_ACTIONS.VOTE,
  ],
  comment: [
    COMMENT_ACTIONS.CREATE,
    COMMENT_ACTIONS.DELETE,
    COMMENT_ACTIONS.EDIT,
    COMMENT_ACTIONS.VIEW,
    COMMENT_ACTIONS.REPORT,
    COMMENT_ACTIONS.VOTE,
  ],
  publication: [
    PUBLICATION_ACTIONS.CREATE,
    PUBLICATION_ACTIONS.DELETE,
    PUBLICATION_ACTIONS.CHANGE_PUBLICATION_STATUS,
    PUBLICATION_ACTIONS.EDIT,
    PUBLICATION_ACTIONS.VIEW,
    PUBLICATION_ACTIONS.REPORT,
    PUBLICATION_ACTIONS.COMMENT,
    PUBLICATION_ACTIONS.VOTE,
  ],
  ...adminAc.statements,
});

const user = ac.newRole({
  category: [CATEGORY_ACTIONS.CREATE, CATEGORY_ACTIONS.DELETE, CATEGORY_ACTIONS.EDIT, CATEGORY_ACTIONS.VIEW],
  trail: [
    TRAIL_ACTIONS.CREATE,
    TRAIL_ACTIONS.DELETE,
    TRAIL_ACTIONS.CHANGE_PUBLICATION_STATUS,
    TRAIL_ACTIONS.EDIT,
    TRAIL_ACTIONS.VIEW,
    TRAIL_ACTIONS.REPORT,
    TRAIL_ACTIONS.COMMENT,
    TRAIL_ACTIONS.VOTE,
    TRAIL_ACTIONS.SUBSCRIBE,
  ],
  topic: [
    TOPIC_ACTIONS.CREATE,
    TOPIC_ACTIONS.DELETE,
    TOPIC_ACTIONS.CHANGE_PUBLICATION_STATUS,
    TOPIC_ACTIONS.EDIT,
    TOPIC_ACTIONS.VIEW,
    TOPIC_ACTIONS.REPORT,
    TOPIC_ACTIONS.COMMENT,
    TOPIC_ACTIONS.VOTE,
  ],
  content: [
    CONTENT_ACTIONS.CREATE,
    CONTENT_ACTIONS.DELETE,
    CONTENT_ACTIONS.CHANGE_PUBLICATION_STATUS,
    CONTENT_ACTIONS.EDIT,
    CONTENT_ACTIONS.VIEW,
    CONTENT_ACTIONS.REPORT,
    CONTENT_ACTIONS.COMMENT,
    CONTENT_ACTIONS.VOTE,
  ],
  comment: [
    COMMENT_ACTIONS.CREATE,
    COMMENT_ACTIONS.DELETE,
    COMMENT_ACTIONS.EDIT,
    COMMENT_ACTIONS.VIEW,
    COMMENT_ACTIONS.REPORT,
    COMMENT_ACTIONS.VOTE,
  ],
  publication: [
    PUBLICATION_ACTIONS.CREATE,
    PUBLICATION_ACTIONS.DELETE,
    PUBLICATION_ACTIONS.CHANGE_PUBLICATION_STATUS,
    PUBLICATION_ACTIONS.EDIT,
    PUBLICATION_ACTIONS.VIEW,
    PUBLICATION_ACTIONS.REPORT,
    PUBLICATION_ACTIONS.COMMENT,
    PUBLICATION_ACTIONS.VOTE,
  ],
  ...userAc.statements,
});

const roles = { superAdmin, admin, user } as const;

export { ac, roles };
