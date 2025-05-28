import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và nhập lại mật khẩu không khớp!');
      return false;
    }

    if (!formData.agreeTerms) {
      setError('Bạn cần đồng ý với điều khoản sử dụng!');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const registerRequest = {
      username: formData.username.trim(),
      password: formData.password,
      role: formData.role
    };
    console.log('Register Request:', registerRequest);
    try {
      const response = await fetch('https://localhost:7128/api/Auth/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">ĐĂNG KÝ TÀI KHOẢN</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 font-medium">
              Chọn vai trò
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Manager">Quản trị viên</option>
              <option value="Teacher">Giáo viên</option>
              <option value="Student">Học sinh</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm">
              Tôi đồng ý với điều khoản sử dụng
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-6 w-full py-3 px-4 rounded-md font-semibold text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} transition-colors`}
        >
          {isSubmitting ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-green-600 hover:text-green-800 hover:underline">
            ← Quay lại trang đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;