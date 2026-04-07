export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: IPagination;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
