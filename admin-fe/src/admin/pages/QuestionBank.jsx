import React, { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiDownload } from 'react-icons/fi';

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('Tất cả');

  const examTypes = [
    'Tất cả',
    'Đề thi giữa kỳ',
    'Đề thi cuối kỳ',
    'Đề kiểm tra 15 phút',
    'Đề kiểm tra 45 phút'
  ];

  const questions = [
    {
      id: 'Q001',
      examType: 'Đề thi giữa kỳ',
      subject: 'Lập trình Web',
      difficulty: 'Dễ',
      time: '15 phút',
      status: 'Đã duyệt',
      content: 'Trong các framework sau, framework nào được sử dụng để phát triển frontend?',
      answers: [
        { label: 'A', text: 'Spring Boot' },
        { label: 'B', text: 'Django' },
        { label: 'C', text: 'React', isCorrect: true },
        { label: 'D', text: 'Laravel' }
      ]
    }
    // Thêm các câu hỏi khác ở đây
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'Tất cả' || question.examType === selectedExam;
    return matchesSearch && matchesExam;
  });

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-blue-600">QuestionBank</h2>
            <p className="text-gray-500 text-sm mt-1">Quản lý ngân hàng câu hỏi</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo nội dung, môn học..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <FiPlus />
              <span>Tạo câu hỏi mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-72 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Loại đề thi</h4>
            <ul className="space-y-2">
              {examTypes.map((item) => (
                <li
                  key={item}
                  onClick={() => setSelectedExam(item)}
                  className={`cursor-pointer text-sm ${
                    item === selectedExam ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-blue-600 font-medium">#{question.id}</span>
                  <span className="text-gray-600">{question.subject} - {question.examType}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {question.difficulty}
                  </span>
                  <span className="text-gray-600">{question.time}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {question.status}
                  </span>
                </div>
              </div>

              <div className="text-gray-800 font-medium mb-4">
                {question.content}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="space-y-2">
                  {question.answers.map((answer) => (
                    <div
                      key={answer.label}
                      className={`text-gray-600 ${answer.isCorrect ? 'text-green-600 font-medium' : ''}`}
                    >
                      {answer.label}. {answer.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FiEdit2 />
                  <span>Chỉnh sửa</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <FiTrash2 />
                  <span>Xóa</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <FiEye />
                  <span>Xem trước</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FiDownload />
                  <span>Xuất</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank; 