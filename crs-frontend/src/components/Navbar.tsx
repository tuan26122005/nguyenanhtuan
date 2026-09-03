import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    // Đọc thông tin trực tiếp từ localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav style={{
            padding: '12px 24px',
            backgroundColor: '#1f2937',
            color: '#ffffff',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            fontFamily: 'sans-serif'
        }}>
            <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
                CRS System
            </Link>

            <Link to="/courses" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                Danh sách môn học
            </Link>

            {/* Hiển thị Menu Quản lý API Key khi có token và role là ADMIN */}
            {token && role === 'ADMIN' && (
                <Link to="/admin/api-keys" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>
                    Quản lý API Key
                </Link>
            )}

            {/* Khu vực trạng thái tài khoản */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                {token ? (
                    <>
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>{username} ({role})</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
}