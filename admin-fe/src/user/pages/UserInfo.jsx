import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const initialState = {
  mssv: "",
  fullName: "",
  email: "",
  userId: "",
  avatar: "https://via.placeholder.com/120",
};

const UserInfo = () => {
  const [form, setForm] = useState(initialState);
  const [avatarPreview, setAvatarPreview] = useState(initialState.avatar);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setForm(initialState);
    setAvatarPreview(initialState.avatar);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Lưu thay đổi thành công!");
    // Gửi dữ liệu lên API tại đây nếu cần
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-purple-600">
            <i className="fas fa-question-circle"></i>
          </span>
          <h1 className="text-xl font-bold text-purple-700">QuizCast</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/student/dashboard"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Quay lại Dashboard
          </Link>
          <img
            src={avatarPreview}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto mt-8 px-2">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            Hồ sơ cá nhân
          </h2>
          <div className="flex flex-col items-center mb-8">
            <img
              src={avatarPreview}
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 mb-3"
            />
            <div className="relative">
              <label
                htmlFor="avatar-upload"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
              >
                <i className="fas fa-camera mr-2"></i>Thay đổi ảnh đại diện
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="mssv" className="block mb-1 font-medium">
                MSSV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mssv"
                value={form.mssv}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fullName" className="block mb-1 font-medium">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userId" className="block mb-1 font-medium">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={form.userId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                onClick={handleCancel}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;