import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        type="button"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}