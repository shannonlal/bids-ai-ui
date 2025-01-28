/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: any;
        promise: Promise<any> | null;
      }
    | undefined;
}

export {};
