export interface ResponseData {
    errorCode: string;
    errorMessage: string;
    tranDate: string;
    data: unknown;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
}

export interface PaginatedResponseData<T> {
    errorCode: string;
    errorMessage: string;
    tranDate: string;
    data: PaginatedResponse<T>;
}
