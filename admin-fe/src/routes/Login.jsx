import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Dùng để chuyển hướng mà không reload trang

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
  
    setError('');
    const loginRequest = {
      username: username.trim(),
      password: password
    }
    try {
      
      const response = await fetch('https://localhost:7128/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });
  
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        sessionStorage.setItem('token', data.jwtToken);
        sessionStorage.setItem('userId', data.userId);
        
        switch(data.role) {
          case 'Manager':
            navigate('/admin/dashboard');
            break;
          case 'Teacher':
            navigate('/teacher');
            break;
          default:
            navigate('/student/dashboard');
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        stack: error.stack
      });
      setError('Không thể kết nối đến server. Vui lòng thử lại sau!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="login-container bg-white rounded-lg shadow-lg w-96 p-8 text-center">
        <div className="logo mb-6">
          <h1 className="text-2xl font-bold text-gray-800">HỆ THỐNG QUẢN LÝ</h1>
        </div>

        <form onSubmit={handleLogin}>
          

          <div className="input-group mb-4 text-left">
            <label htmlFor="username" className="block mb-1 font-medium">
              Tên đăng nhập/Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập hoặc email"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="input-group mb-4 text-left">
            <label htmlFor="password" className="block mb-1 font-medium">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="login-btn bg-blue-500 text-white w-full py-3 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="links mt-5 flex justify-between text-sm">
          <a href="#" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </a>
          <Link to="/Register" className="text-blue-500 hover:underline">
            Đăng ký tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
