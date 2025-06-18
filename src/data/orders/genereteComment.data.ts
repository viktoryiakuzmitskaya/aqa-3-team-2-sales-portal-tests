import { faker } from '@faker-js/faker';

export function generateCommentText() {
  return `Notes ${faker.string.alpha(244)}`;
}
