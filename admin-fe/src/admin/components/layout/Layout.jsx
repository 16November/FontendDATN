import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header luôn trên cùng, full width */}
      <Header />

      {/* Dưới Header chia làm Sidebar + Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
