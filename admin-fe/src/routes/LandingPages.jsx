import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hệ thống Quản lý Thi trực tuyến</h1>
        <p className="mb-8">Chào mừng đến với hệ thống quản lý thi trực tuyến</p>
        <Link 
          to="/admin" 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Vào trang quản trị
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

