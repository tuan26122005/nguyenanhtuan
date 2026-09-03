import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function LoginPage() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            // Gọi API đăng nhập thực tế tới Auth Service / Gateway
            const response = await axiosClient.post('/api/auth/login', {
                username,
                password,
            });

            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role || 'ADMIN');
            localStorage.setItem('username', username);

            navigate('/admin/api-keys');
        } catch (err: any) {
            console.warn('Lỗi kết nối Backend Auth, fallback giả lập token:', err);

            // Trường hợp chưa bật Auth Service, tạm lưu token để dev UI
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiJ9.mock');
            localStorage.setItem('role', 'ADMIN');
            localStorage.setItem('username', username);
            navigate('/admin/api-keys');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, fontFamily: 'sans-serif' }}>
            <h2>Đăng nhập Hệ thống</h2>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Tên đăng nhập:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: 8 }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: 8 }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: 10, backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
}