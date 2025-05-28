import React from 'react';
import {
  FaQuestion,
  FaClock,
  FaRandom,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuizCast = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FaQuestion className="text-2xl" />
            <h1 className="text-xl ml-2 font-semibold">QuizCast</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="bg-white text-blue-500 px-5 py-2 rounded-md font-medium hover:bg-opacity-90 transition">
              Đăng nhập
            </Link>
            <Link to="/register" className="border border-white text-white px-5 py-2 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition">
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Hệ Thống Thi Trắc Nghiệm Trực Tuyến</h2>
          <p className="text-xl mb-8">Tạo và tham gia các bài thi trắc nghiệm dễ dàng, nhanh chóng và tiện lợi</p>
          <a href="#features" className="bg-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-purple-700 transition">
            Bắt đầu ngay
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-12">Tính năng chính</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:-translate-y-2 transition duration-300">
                <feature.icon className="text-4xl text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-12">Đăng nhập theo vai trò</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:-translate-y-2 transition duration-300">
                <role.icon className={`text-4xl ${role.iconColor} mb-4`} />
                <h3 className="text-xl font-semibold mb-4">{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <a
                  href={`/login?role=${role.type}`}
                  className={`inline-block px-6 py-2 rounded-md text-white ${role.buttonColor} hover:opacity-90 transition`}
                >
                  Đăng nhập {role.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-600 text-white py-8 px-4 mt-12">
        <div className="text-center">
          <p className="mb-2">© 2023 QuizCast - Hệ Thống Thi Trắc Nghiệm Trực Tuyến. Bản quyền thuộc về nhóm phát triển.</p>
          <p>Liên hệ: support@quizcast.vn | Điện thoại: 0123 456 789</p>
        </div>
      </footer>
    </div>
  );
};

// Data arrays
const features = [
  {
    icon: FaQuestion,
    title: "Ngân hàng câu hỏi",
    description: "Quản lý ngân hàng câu hỏi trắc nghiệm với nhiều dạng khác nhau, dễ dàng tái sử dụng",
  },
  {
    icon: FaClock,
    title: "Giới hạn thời gian",
    description: "Thiết lập thời gian làm bài, tự động nộp bài khi hết giờ, đảm bảo công bằng",
  },
  {
    icon: FaRandom,
    title: "Trộn câu hỏi",
    description: "Tự động trộn câu hỏi và đáp án, tạo nhiều đề thi khác nhau từ cùng một ngân hàng câu hỏi",
  },
];

const roles = [
  {
    icon: FaUserShield,
    iconColor: "text-gray-800",
    title: "Quản trị viên",
    description: "Quản lý hệ thống, tạo tài khoản, phân quyền và theo dõi hoạt động thi",
    type: "admin",
    buttonColor: "bg-gray-800",
  },
  {
    icon: FaChalkboardTeacher,
    iconColor: "text-green-600",
    title: "Giáo viên",
    description: "Tạo bài thi, quản lý ngân hàng câu hỏi, xem kết quả bài làm của thí sinh",
    type: "teacher",
    buttonColor: "bg-green-600",
  },
  {
    icon: FaUserGraduate,
    iconColor: "text-orange-500",
    title: "Thí sinh",
    description: "Tham gia các bài thi trắc nghiệm, xem kết quả và lịch sử làm bài",
    type: "student",
    buttonColor: "bg-orange-500",
  },
];

export default QuizCast;