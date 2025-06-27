import { Tab } from './tab.page';
import { Locator } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { ICommentFromResponse } from 'types/orders.type';
export class CommentsTab extends Tab {
  readonly uniqueElement = this.page.locator('#comments');
  readonly createButton = this.uniqueElement.locator('#create-comment-btn');
  readonly commentTextarea = this.uniqueElement.locator('#textareaComments');
  readonly commentBlock = this.uniqueElement.locator('div.div.mx-3');
  readonly deleteCommentButton = this.commentBlock.locator('button.text-danger');
  commentBlockByText(text: string): Locator {
    return this.uniqueElement
      .locator('div.mx-3')
      .filter({ has: this.page.locator(`p:has-text("${text}")`) });
  }

  @logStep('Fill comment textarea')
  async fillComment(comment: string): Promise<void> {
    await this.commentTextarea.fill(comment);
  }

  @logStep('Click Create button')
  async clickDeliveryButton(): Promise<void> {
    await this.createButton.click();
  }

  @logStep('Get comments count')
  async getCommentsCount(): Promise<number> {
    return await this.commentBlock.count();
  }

  @logStep('Get latest comment')
  async getFirstCommentBlock(): Promise<Locator> {
    return this.commentBlock.first();
  }

  @logStep('Get first comment data')
  async getFirstCommentData(): Promise<Pick<ICommentFromResponse, 'text' | 'createdOn'>> {
    const firstComment = this.commentBlock.first();
    const [text, createdOn] = await Promise.all([
      firstComment.locator('p').innerText(),
      firstComment.locator('div.mt-2 span').nth(1).innerText(),
    ]);
    return { text, createdOn };
  }

  async getRandomCommentBlock(): Promise<Locator> {
    const count = await this.commentBlock.count();
    const randomIndex = Math.floor(Math.random() * count);
    return this.commentBlock.nth(randomIndex);
  }

  async getRandomCommentData(): Promise<Pick<ICommentFromResponse, 'text' | 'createdOn'>> {
    const randomComment = await this.getRandomCommentBlock();
    const [text, createdOn] = await Promise.all([
      randomComment.locator('p').innerText(),
      randomComment.locator('div.mt-2 span').nth(1).innerText(),
    ]);
    return { text, createdOn };
  }

  async clickDeleteOnSpecificComment(comment: Locator): Promise<void> {
    await comment.locator('button.text-danger').click();
  }
}
