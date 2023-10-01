import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from '../services/lucia';

export const handleActionAuthRequest = () => {
  const authRequest = auth.handleRequest('POST', context);
  return authRequest;
};

export const handlePageAuthRequest = () => {
  const authRequest = auth.handleRequest('GET', context);
  return authRequest;
};

export const handleApiAuthRequest = (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  return authRequest;
};
