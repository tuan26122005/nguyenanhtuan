import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Course {
    id: number;
    tenMonHoc: string;
    soTinChi: number;
    soChoToiDa: number;
    soChoConLai: number;
}

export function useCourses(keyword: string = '', page: number = 0) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [state, setState] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchCourses = useCallback(async () => {
        setState('LOADING');
        setErrorMessage('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/courses', {
                params: { keyword, page, size: 5 },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            const data = response.data;
            // Xử lý dữ liệu phân trang Spring Data Page
            if (data && Array.isArray(data.content)) {
                setCourses(data.content);
                setTotalPages(data.totalPages || 0);
            } else if (Array.isArray(data)) {
                setCourses(data);
                setTotalPages(1);
            } else {
                setCourses([]);
                setTotalPages(0);
            }
            setState('SUCCESS');
        } catch (err: any) {
            console.error('Lỗi khi gọi API courses:', err);
            setState('ERROR');
            setErrorMessage(
                err.response?.status === 401 || err.response?.status === 403
                    ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                    : 'Không thể kết nối đến hệ thống server.'
            );
        }
    }, [keyword, page]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return { courses, totalPages, state, errorMessage, refetch: fetchCourses };
}