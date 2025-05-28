import React, { useState, useEffect } from 'react';

const defaultAnswer = () => ({ content: '', isCorrect: false });

const QuestionForm = ({ onClose, exams = [], editingQuestion, onSubmit }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [answers, setAnswers] = useState([defaultAnswer()]);
  const [error, setError] = useState("");
  const [answersError, setAnswersError] = useState("");
  const [examError, setExamError] = useState("");

  // Load initial data for edit mode
  useEffect(() => {
    if (editingQuestion) {
      setContent(editingQuestion.content || "");
      setImageUrl(editingQuestion.imageUrl || "");
      setSelectedExamId(editingQuestion.examId || "");
      setAnswers(
        editingQuestion.answersDto && editingQuestion.answersDto.length > 0
          ? editingQuestion.answersDto.map((a) => ({
              content: a.content,
              isCorrect: a.isCorrect,
              answerId: a.answerId,
            }))
          : [defaultAnswer()]
      );
    } else {
      // Reset form when creating new question
      setContent("");
      setImageUrl("");
      setSelectedExamId("");
      setAnswers([defaultAnswer()]);
    }
  }, [editingQuestion]);

  // Add answer
  const handleAddAnswer = () => {
    setAnswers([...answers, defaultAnswer()]);
    setAnswersError("");
  };

  // Remove answer
  const handleRemoveAnswer = (idx) => {
    const newAnswers = answers.filter((_, i) => i !== idx);
    setAnswers(newAnswers.length ? newAnswers : [defaultAnswer()]);
    setAnswersError("");
  };

  // Update answer
  const handleAnswerChange = (idx, field, value) => {
    setAnswers((answers) =>
      answers.map((ans, i) => (i === idx ? { ...ans, [field]: value } : ans))
    );
    setAnswersError("");
  };

  // Validate form
  const validate = () => {
    let isValid = true;

    if (!selectedExamId) {
      setExamError("Vui lòng chọn đề thi");
      isValid = false;
    } else {
      setExamError("");
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung câu hỏi");
      isValid = false;
    } else {
      setError("");
    }

    if (answers.length === 0) {
      setAnswersError("Vui lòng thêm ít nhất một câu trả lời");
      isValid = false;
    } else {
      let hasCorrect = false;
      for (const ans of answers) {
        if (!ans.content.trim()) {
          setAnswersError("Vui lòng nhập nội dung cho tất cả câu trả lời");
          isValid = false;
          break;
        }
        if (ans.isCorrect) hasCorrect = true;
      }
      if (!hasCorrect) {
        setAnswersError("Phải có ít nhất một câu trả lời đúng");
        isValid = false;
      } else {
        setAnswersError("");
      }
    }

    return isValid;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = {
      content,
      imageUrl,
      examId: selectedExamId,
      answers: answers.map((ans) => ({
        content: ans.content,
        isCorrect: ans.isCorrect,
        answerId: ans.answerId, // Use existing answerId if editing
      })),
    };

    if (editingQuestion) {
      formData.questionId = editingQuestion.questionId;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">
          {editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Exam Selection */}
        <div className="mb-5">
          <label className="block font-medium mb-1 text-gray-700">
            Chọn đề thi <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              examError ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">-- Chọn đề thi --</option>
            {exams.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.title}
              </option>
            ))}
          </select>
          {examError && (
            <div className="text-red-500 text-sm mt-1">{examError}</div>
          )}
        </div>

        {/* Question Content */}
        <div className="mb-5">
          <label className="block font-medium mb-1 text-gray-700">
            Nội dung câu hỏi <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>

        {/* Image URL */}
        <div className="mb-5">
          <label className="block font-medium mb-1 text-gray-700">
            URL hình ảnh
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Answers */}
        <div className="mb-5 bg-gray-50 p-4 rounded">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700">Câu trả lời</span>
            <button
              type="button"
              onClick={handleAddAnswer}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              + Thêm câu trả lời
            </button>
          </div>
          {answers.map((ans, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded p-4 mb-3 relative"
            >
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 hover:bg-red-100 rounded-full w-7 h-7 flex items-center justify-center"
                onClick={() => handleRemoveAnswer(idx)}
                title="Xóa câu trả lời"
                disabled={answers.length === 1}
              >
                ×
              </button>
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Nội dung câu trả lời <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    answersError && !ans.content.trim()
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={ans.content}
                  onChange={(e) =>
                    handleAnswerChange(idx, "content", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2 w-5 h-5"
                  checked={ans.isCorrect}
                  onChange={(e) =>
                    handleAnswerChange(idx, "isCorrect", e.target.checked)
                  }
                  id={`isCorrect_${idx}`}
                />
                <label htmlFor={`isCorrect_${idx}`} className="text-gray-700">
                  Đáp án đúng
                </label>
              </div>
            </div>
          ))}
          {answersError && (
            <div className="text-red-500 text-sm mt-1">{answersError}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {editingQuestion ? "Lưu câu hỏi" : "Thêm câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;