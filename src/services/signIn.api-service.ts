import { APIRequestContext } from '@playwright/test';
import { SignInController } from 'api/controllers/signIn.controller';
import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { STATUS_CODES } from 'data/status.code';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { logStep } from 'utils/reporter.utils';

export class SignInApiService {
  controller: SignInController;
  constructor(request: APIRequestContext) {
    this.controller = new SignInController(request);
  }

  @logStep('Login via API')
  async loginAsLocalUser() {
    const response = await this.controller.signIn({
      username: USER_LOGIN,
      password: USER_PASSWORD,
    });
    validateResponse(response, STATUS_CODES.OK, true, null);
    const token = response.headers['authorization'];
    return token;
  }
}
