import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/image/logoDA.png";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logout ở đây (xóa token, clear storage, etc.)
    // Sau đó chuyển hướng về trang login
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    console.log(sessionStorage.getItem("token"));
    console.log(sessionStorage.getItem("userId"));
    navigate("/login");
  };

  return (
    <div className="w-full h-20 bg-white shadow flex items-center justify-between px-6 relative">
      {/* Logo và tên hệ thống */}
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
      </div>

      {/* Tên người dùng và dropdown */}
      <div 
        className="flex items-center gap-2 text-gray-700 cursor-pointer relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaUserCircle size={24} />
        <span className="font-medium"></span>
        
        {/* Dropdown menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;