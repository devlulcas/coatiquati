import { handleActionAuthRequest } from './handle-auth-request';

export const getActionSession = () => {
  const authRequest = handleActionAuthRequest();
  return authRequest.validate();
};
