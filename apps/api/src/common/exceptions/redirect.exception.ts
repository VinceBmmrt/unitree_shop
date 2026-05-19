export class RedirectException {
  constructor(
    public readonly url: string,
    public readonly statusCode = 302,
  ) {}
}
