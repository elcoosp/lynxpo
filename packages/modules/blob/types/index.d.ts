/** @lynxmodule */
export declare class BlobModule {
  create(payload: string, type: string): string | null;
  size(blobId: string): number;
  type(blobId: string): string;
  slice(
    blobId: string,
    start: number,
    end: number,
    contentType: string,
  ): string | null;
  bytes(blobId: string): string | null;
  text(blobId: string): string | null;
  arrayBuffer(blobId: string): string | null;
}
