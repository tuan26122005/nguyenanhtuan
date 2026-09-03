// path: crs-frontend/src/components/CourseList.tsx
import type { Course } from '../types/course';

// Nhận các kiểu state từ useCourses ("LOADING" | "SUCCESS" | "ERROR" hoặc chữ thường)
export type CourseListState = 'LOADING' | 'SUCCESS' | 'ERROR' | 'loading' | 'success' | 'error' | 'empty' | string;

export interface CourseListProps {
    courses: Course[];
    state: CourseListState;
    errorMessage?: string;
    onRetry?: () => void | Promise<void>;
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;
    onRegister?: (course: Course) => void | Promise<void>;
    registeringId?: number | null;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onEdit,
                                       onDelete,
                                       onRegister,
                                       registeringId,
                                   }: CourseListProps) {
    const isLoading = state === 'LOADING' || state === 'loading';
    const isError = state === 'ERROR' || state === 'error';

    if (isLoading) {
        return <p style={{ textAlign: 'center' }}>Đang tải danh sách môn học...</p>;
    }

    if (isError) {
        return (
            <div style={{ textAlign: 'center', color: '#b91c1c', margin: '20px 0' }}>
                <p>{errorMessage || 'Đã xảy ra lỗi khi tải dữ liệu.'}</p>
                {onRetry && (
                    <button onClick={() => void onRetry()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Thử lại
                    </button>
                )}
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return <p style={{ textAlign: 'center', color: '#6c757d' }}>Không tìm thấy môn học nào phù hợp.</p>;
    }

    const showActions = !!onEdit || !!onDelete || !!onRegister;

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1} cellPadding={12}>
            <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                <th>Mã MH</th>
                <th>Tên môn học</th>
                <th>Số tín chỉ</th>
                <th>Số chỗ còn lại</th>
                {showActions && <th>Thao tác</th>}
            </tr>
            </thead>
            <tbody>
            {courses.map((course) => (
                <tr key={course.id} style={{ textAlign: 'center' }}>
                    <td>{course.id}</td>
                    <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{course.tenMonHoc}</td>
                    <td>{course.soTinChi}</td>
                    <td style={{ color: course.soChoConLai <= 0 ? '#b91c1c' : 'green', fontWeight: 'bold' }}>
                        {course.soChoConLai} / {course.soChoToiDa}
                    </td>
                    {showActions && (
                        <td>
                            {onEdit && (
                                <button onClick={() => onEdit(course)} style={{ padding: '6px 12px', marginRight: 8, cursor: 'pointer' }}>
                                    Sửa
                                </button>
                            )}
                            {onDelete && (
                                <button onClick={() => onDelete(course)} style={{ padding: '6px 12px', color: '#b91c1c', cursor: 'pointer' }}>
                                    Xóa
                                </button>
                            )}
                            {onRegister && (
                                <button
                                    onClick={() => void onRegister(course)}
                                    disabled={course.soChoConLai <= 0 || registeringId === course.id}
                                    style={{
                                        padding: '6px 14px',
                                        fontSize: '14px',
                                        backgroundColor: course.soChoConLai > 0 ? '#28a745' : '#6c757d',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: course.soChoConLai > 0 && registeringId !== course.id ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {registeringId === course.id
                                        ? 'Đang đăng ký...'
                                        : course.soChoConLai <= 0
                                            ? 'Hết chỗ'
                                            : 'Đăng ký'}
                                </button>
                            )}
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}