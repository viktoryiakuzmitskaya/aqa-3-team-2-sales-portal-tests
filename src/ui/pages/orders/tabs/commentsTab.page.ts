import { Tab } from './tab.page';
import { Locator } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { ICommentFromResponse } from 'types/orders.type';

export class CommentsTab extends Tab {
  readonly uniqueElement = this.page.locator('#comments');
  readonly commentTextarea = this.uniqueElement.locator('#textareaComments');
  readonly createButton = this.uniqueElement.locator('#create-comment-btn');
  readonly commentBlocks = this.uniqueElement.locator('div.mx-3');
  readonly commentText = (block: Locator) => block.locator('p');
  readonly commentDate = (block: Locator) => block.locator('div.mt-2 span').nth(1);
  readonly deleteButton = (block: Locator) => block.locator('button.text-danger');

  @logStep('Fill comment textarea')
  async fillComment(text: string): Promise<void> {
    await this.commentTextarea.fill(text);
  }

  @logStep('Click Create button')
  async clickCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  @logStep('Get comments count')
  async getCommentsCount(): Promise<number> {
    return await this.commentBlocks.count();
  }

  @logStep('Get first comment')
  async getFirstCommentBlock(): Promise<Locator> {
    return this.commentBlocks.first();
  }

  @logStep('Get random comment')
  async getRandomCommentBlock(): Promise<Locator> {
    const count = await this.getCommentsCount();
    if (count === 0) throw new Error('No comments found');
    const randomIndex = Math.floor(Math.random() * count);
    return this.commentBlocks.nth(randomIndex);
  }

  @logStep('Get comment data')
  async getCommentData(commentBlock: Locator): Promise<ICommentFromResponse> {
    const [text, createdOn, id] = await Promise.all([
      this.commentText(commentBlock).innerText(),
      this.commentDate(commentBlock).innerText(),
      this.deleteButton(commentBlock).getAttribute('id'),
    ]);
    return {
      _id: id ?? '',
      text,
      createdOn,
    };
  }

  @logStep('Click Delete button')
  async clickDeleteButton(commentBlock: Locator): Promise<void> {
    await this.deleteButton(commentBlock).click();
  }

  @logStep('Check if comment exists')
  async hasComment(expected: ICommentFromResponse): Promise<boolean> {
    const count = await this.getCommentsCount();
    for (let i = 0; i < count; i++) {
      const block = this.commentBlocks.nth(i);
      const data = await this.getCommentData(block);
      if (
        data._id === expected._id &&
        data.text === expected.text &&
        data.createdOn === expected.createdOn
      ) {
        return true;
      }
    }
    return false;
  }
}
