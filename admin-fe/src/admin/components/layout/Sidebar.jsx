import {
  FaTh,
  FaFileAlt,
  FaEye,
  FaChartBar,
  FaCog,
  FaDatabase,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-56 h-screen bg-[#0B1F3A] text-white flex flex-col shadow-lg">
      <nav className="flex flex-col mt-4">
      <MenuItem 
          icon={<FaTh />} 
          label="DashBoard" 
          to="/admin" 
          active={location.pathname === "/admin"} 
        />
        <MenuItem 
          icon={<FaFileAlt />} 
          label="Quản lý đề thi" 
          to="/admin/exams" 
          active={location.pathname.startsWith("/admin/exams")} 
        />
        <MenuItem 
          icon={<FaDatabase />} 
          label="Ngân hàng câu hỏi" 
          to="/admin/questions" 
          active={location.pathname.startsWith("/admin/questions")} 
        />
        <MenuItem icon={<FaEye />} label="Giám sát thi" to="/monitor" active={location.pathname === "/monitor"} />
        <MenuItem icon={<FaChartBar />} label="Thống kê" to="/statistics" active={location.pathname === "/statistics"} />
        <MenuItem icon={<FaCog />} label="Cài đặt" to="/settings" active={location.pathname === "/settings"} />
      </nav>
    </div>
  );
};

const MenuItem = ({ icon, label, to, active }) => (
  <Link 
    to={to}
    className={`flex items-center px-4 py-3 hover:bg-blue-800 cursor-pointer border-b border-blue-950 transition ${
      active ? 'bg-blue-800' : ''
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Sidebar;
