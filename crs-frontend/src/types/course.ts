export interface Course {
    id: number;
    tenMonHoc: string;
    soTinChi: number;
    soChoToiDa: number;
    soChoConLai: number;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

// Bổ sung kiểu dữ liệu riêng cho Form (Thêm / Sửa)
export interface CourseFormValues {
    tenMonHoc: string;
    soTinChi: string;   // Dùng string trong Form để dễ kiểm soát input rỗng
    soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
    tenMonHoc: '',
    soTinChi: '',
    soChoToiDa: '',
};