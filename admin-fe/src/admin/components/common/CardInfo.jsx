export default function CardInfo({ title, value }) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center min-w-[180px]">
        <span className="text-gray-600">{title}</span>
        <span className="text-2xl font-bold mt-2">{value}</span>
      </div>
    );
  }