import { FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/image/logoDA.png"; // ✅ đường dẫn chính xác

const Header = () => {
  return (
    <div className="w-full h-20 bg-white shadow flex items-center justify-between px-6">
      {/* Logo và tên hệ thống */}
      <div className="flex items-center gap-4">
      <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
        {/* Có thể hiện thêm tên nếu muốn */}
        {/* <span className="text-xl font-semibold text-blue-700">QuiCast</span> */}
      </div>

      {/* Tên người dùng */}
      <div className="flex items-center gap-2 text-gray-700">
        <FaUserCircle size={24} />
        <span className="font-medium">NameOfUser</span>
      </div>
    </div>
  );
};

export default Header;
