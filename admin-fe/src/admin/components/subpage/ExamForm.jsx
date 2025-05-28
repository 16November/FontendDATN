import { useState, useEffect } from "react";

export default function ExamForm({
  onClose = () => {},
  onCreate = () => {},
  onUpdate = () => {},
  initialData,
}) {
  // Format UTC date to local datetime string for display
  // Format UTC date to local datetime string for display
  const formatForDisplay = (utcDateString) => {
  if (!utcDateString) return "";
  try {
    // Đảm bảo xử lý cả chuỗi có Z và không có Z
    const dateStr = utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z';
    const date = new Date(dateStr);
    
    // Format thành chuỗi phù hợp với datetime-local (YYYY-MM-DDTHH:MM)
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch {
    return "";
  }
};


  const parseToUTC = (localDateString) => {
  if (!localDateString) return new Date().toISOString();
  try {
    // Tạo date từ local string (trình duyệt tự xử lý múi giờ)
    const date = new Date(localDateString);
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

  const [form, setForm] = useState({
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    durationInMinutes: 60,
    startDay: new Date().toISOString(),
    isPublished: false,
    createdByUserId: "",
  });

  useEffect(() => {

    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        createdAt: initialData.createdAt || new Date().toISOString(),
        updatedAt: initialData.updatedAt || new Date().toISOString(),
        durationInMinutes: initialData.durationInMinutes || 60,
        startDay: initialData.startDay || new Date().toISOString(),
        isPublished: initialData.isPublished || false,
      });
    } else {
      const userId = "005106a0-4e6b-b3fb-d759-08dd88065a39";
      if (userId) {
        setForm((prev) => ({ ...prev, createdByUserId: userId }));
      }
    }
  }, [initialData]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "durationInMinutes") {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setForm((prev) => ({
          ...prev,
          [name]: numValue,
        }));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        name.endsWith("At") || name === "startDay" 
          ? parseToUTC(value) 
          : type === "checkbox" 
            ? checked 
            : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.durationInMinutes < 1 || form.durationInMinutes > 1000) {
      alert("Thời gian làm bài phải từ 1 đến 1000 phút");
      return;
    }

    const submitData = {
      ...form,
      updatedAt: new Date().toISOString(),
    };

    if (initialData) {
      onUpdate({
        ...submitData,
        examId: initialData.examId,
      });
    } else {
      onCreate(submitData);
    }

    onClose(); // Đóng form sau khi submit
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
              <div className="col-span-2">
                <label className="block mb-1">Tiêu đề*</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nhập tiêu đề bài thi"
                  required
                  maxLength={200}
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nhập mô tả bài thi"
                  maxLength={1000}
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">Thời gian làm bài (phút)*</label>
                <input
                  type="number"
                  name="durationInMinutes"
                  value={form.durationInMinutes}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="60"
                  min="1"
                  max="1000"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Ngày bắt đầu*</label>
                <input
                  type="datetime-local"
                  name="startDay"
                  value={formatForDisplay(form.startDay)}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  step="60" // Chỉ cho phép chọn phút chẵn (0, 1, 2,... phút)
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="mr-2"
                  id="isPublished"
                />
                <label htmlFor="isPublished" className="block mb-1">
                  Công khai
                </label>
              </div>

              <div>
                <label className="block mb-1">Ngày tạo</label>
                <input
                  type="datetime-local"
                  name="createdAt"
                  value={formatForDisplay(form.createdAt)}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  disabled
                />
              </div>

              <div>
                <label className="block mb-1">Ngày cập nhật</label>
                <input
                  type="datetime-local"
                  name="updatedAt"
                  value={formatForDisplay(form.updatedAt)}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
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
              {initialData ? "Cập nhật" : "Tạo mới"}
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