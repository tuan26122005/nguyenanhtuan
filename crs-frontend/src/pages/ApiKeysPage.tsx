import React, { useState, useEffect } from 'react';
import type { ApiKey } from '../types/apiKey';
import { apiKeyApi } from '../api/apiKeyApi';

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [name, setName] = useState('');
    const [scope, setScope] = useState('courses:read');
    const [loading, setLoading] = useState(false);

    const calculate30DaysExpiry = (): string => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    };

    const fetchApiKeys = async () => {
        try {
            setLoading(true);
            const data = await apiKeyApi.getAll();
            if (Array.isArray(data)) {
                setApiKeys(data);
            }
        } catch (error) {
            console.warn('Chưa lấy được dữ liệu từ Backend:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const expiryDate = calculate30DaysExpiry();

        const newKeyMock: ApiKey = {
            id: Date.now(),
            name: name.trim(),
            scope,
            key: 'ak_live_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
            active: true,
            expiresAt: expiryDate,
        };

        try {
            const createdKey = await apiKeyApi.create({ name, scope });
            setApiKeys((prev) => [...prev, createdKey || newKeyMock]);
        } catch (error) {
            console.warn('Backend chưa sẵn sàng, cập nhật trên UI:', error);
            setApiKeys((prev) => [...prev, newKeyMock]);
        } finally {
            setName('');
        }
    };

    const handleRevoke = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn thu hồi API Key này?')) return;

        try {
            await apiKeyApi.revoke(id);
        } catch (error) {
            console.warn('Lỗi thu hồi từ Backend:', error);
        } finally {
            setApiKeys((prev) =>
                prev.map((item) => (item.id === id ? { ...item, active: false } : item))
            );
        }
    };

    const handleCopy = (keyText: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(keyText);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = keyText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        alert('Đã sao chép API Key vào bộ nhớ tạm!');
    };

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Quản lý API Key (Partner Access)</h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Tên đối tác / Mô tả (VD: Doi tac Test)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ flex: 1, padding: 8 }}
                    required
                />
                <select value={scope} onChange={(e) => setScope(e.target.value)} style={{ padding: 8 }}>
                    <option value="courses:read">courses:read</option>
                    <option value="courses:write">courses:write</option>
                </select>
                <button
                    type="submit"
                    style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                    Tạo API Key
                </button>
            </form>

            {loading ? (
                <p>Đang tải danh sách...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, border: '1px solid #e5e7eb' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>ID</th>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Tên</th>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>API Key</th>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Scope</th>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Thời hạn</th>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Trạng thái</th>
                        <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {apiKeys.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
                                Chưa có API Key nào. Hãy nhập tên đối tác và bấm "Tạo API Key".
                            </td>
                        </tr>
                    ) : (
                        apiKeys.map((item) => (
                            <tr key={item.id}>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{item.id}</td>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{item.name}</td>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb', fontFamily: 'monospace' }}>
                                    {item.key}
                                </td>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{item.scope}</td>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>
                                    {item.expiresAt || calculate30DaysExpiry()} (30 ngày)
                                </td>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>
                    <span style={{ color: item.active ? 'green' : 'red', fontWeight: 'bold' }}>
                      {item.active ? 'ACTIVE' : 'REVOKED'}
                    </span>
                                </td>
                                <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => handleCopy(item.key)} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                                            Copy
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleRevoke(item.id)}
                                                style={{ padding: '4px 8px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                            >
                                                Thu hồi
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}