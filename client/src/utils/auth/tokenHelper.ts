export const decodeJwt: (token: string) => any = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}