import axiosClient from './axiosClient';
import type { Course, PagedResponse, CourseFormValues } from '../types/course';

export const getCourses = async (keyword?: string, page = 0, size = 10): Promise<PagedResponse<Course>> => {
    const res: any = await axiosClient.get('/api/courses', {
        params: { keyword, page, size },
    });

    // Bóc tách dữ liệu đúng cách nếu axiosClient có/không dùng response interceptor
    const data = res?.data !== undefined ? res.data : res;

    // Trường hợp Backend trả về Mảng trực tiếp [...]
    if (Array.isArray(data)) {
        return {
            content: data,
            totalPages: 1,
            totalElements: data.length,
            number: page,
            size: size,
        };
    }

    // Trường hợp Backend trả về Pageable { content: [...] }
    return {
        content: data?.content || [],
        totalPages: data?.totalPages || 1,
        totalElements: data?.totalElements || (data?.content?.length || 0),
        number: data?.number || page,
        size: data?.size || size,
    };
};

export const getCourseById = (id: number) => {
    return axiosClient.get<Course>(`/api/courses/${id}`);
};

// Chuyển đổi dữ liệu form (string) về đúng kiểu dữ liệu của Payload (number) trước khi gửi API
const toPayload = (values: CourseFormValues) => ({
    tenMonHoc: values.tenMonHoc.trim(),
    soTinChi: Number(values.soTinChi),
    soChoToiDa: Number(values.soChoToiDa),
});

export const createCourse = (values: CourseFormValues) => {
    return axiosClient.post<Course>('/api/courses', toPayload(values));
};

export const updateCourse = (id: number, values: CourseFormValues) => {
    return axiosClient.put<Course>(`/api/courses/${id}`, toPayload(values));
};

export const deleteCourse = (id: number) => {
    return axiosClient.delete(`/api/courses/${id}`);
};