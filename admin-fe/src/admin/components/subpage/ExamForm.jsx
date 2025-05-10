import { useState, useEffect } from "react";

export default function ExamForm({ onClose, onCreate, onUpdate, initialData }) {
  const [form, setForm] = useState({
    title: "",
    status: "Published",
    description: "",
    createdAt: "",
    updatedAt: "",
    duration: "",
    startDate: "",
    totalQuestions: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      onUpdate({ ...form, id: initialData.id });
    } else {
      onCreate(form);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#222]">
      <div className="bg-[#f7fafd] p-8 rounded-lg shadow-lg w-[700px]">
        <div className="flex justify-center mb-6">
          <button className="bg-white border shadow px-8 py-2 rounded font-semibold">
            Thông tin bài thi
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="border-2 border-blue-400 rounded p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              {/* ... các trường như cũ ... */}
              <div>
                <label className="block mb-1">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                />
              </div>
              <div>
                <label className="block mb-1">Trạng thái bài thi</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Published">Published</option>
                  <option value="Hide">Hide</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Mô tả</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                />
              </div>
              <div>
                <label className="block mb-1">Ngày tạo bài thi</label>
                <input
                  type="text"
                  name="createdAt"
                  value={form.createdAt}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                />
              </div>
              <div>
                <label className="block mb-1">Thời gian làm bài</label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                />
              </div>
              <div>
                <label className="block mb-1">Ngày cập nhật</label>
                <input
                  type="text"
                  name="updatedAt"
                  value={form.updatedAt}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                  disabled
                />
              </div>
              <div>
                <label className="block mb-1">Ngày làm bài</label>
                <input
                  type="text"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                />
              </div>
              <div>
                <label className="block mb-1">Tổng câu hỏi</label>
                <input
                  type="text"
                  name="totalQuestions"
                  value={form.totalQuestions}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Text"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded text-lg"
            >
              {initialData ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 bg-gray-400 text-white px-8 py-2 rounded text-lg"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}