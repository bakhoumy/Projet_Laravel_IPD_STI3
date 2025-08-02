// src/layouts/ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProtectedLayout = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <main className="flex-grow-1 p-4" style={{ marginLeft: '260px' }}>
                <div className="container-fluid">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProtectedLayout;