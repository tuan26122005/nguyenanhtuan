import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useCourses } from "./api/useCourses";
import SearchBox from "./components/SearchBox";
import CourseList from "./components/CourseList";
import Pagination from "./components/Pagination";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import ApiKeysPage from "./pages/ApiKeysPage";
import LoginPage from "./pages/LoginPage";

function CourseListPage() {
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);

    const { courses, totalPages, state, errorMessage, refetch } = useCourses(
        keyword,
        page
    );

    const handleSearch = (text: string) => {
        setKeyword(text);
        setPage(0);
    };

    return (
        <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 800, margin: "0 auto" }}>
            <h1>Danh sách môn học</h1>
            <SearchBox onSearch={handleSearch} placeholder="Tìm kiếm môn học..." />
            <div style={{ marginTop: 20 }}>
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
                />
            </div>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<CourseListPage />} />
                <Route path="/courses" element={<CourseListPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/admin/api-keys"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <ApiKeysPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}