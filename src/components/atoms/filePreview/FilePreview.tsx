import { getFileMimeType } from '@/utils/getMimeType';
import Image from 'next/image';
interface FilePreviewProps {
  file: File;
  onDelete: () => void;
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`; // 바이트
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`; // 킬로바이트
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`; // 메가바이트
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`; // 기가바이트
}

export default function FilePreview({ file, onDelete }: FilePreviewProps) {
  const fileName = file.name.split('.')[0] || '';
  const fileType = file.name.split('.').pop().toUpperCase() || '';
  const fileSize = formatFileSize(file.size);
  return (
    <div className="flex gap-20 bg-black3 w-fit border border-black4 rounded-[8px] px-12 py-12 items-start mb-16">
      <div className="flex flex-col gap-8">
        <span className="text-13 text-black12 font-semibold">{fileName}</span>
        <span className="text-13 text-black6 font-regular">
          {fileType} • {fileSize}
        </span>
      </div>
      <button onClick={onDelete} className="cursor-pointer">
        <Image
          src={'/icons/Close.svg'}
          width={20}
          height={20}
          className="width-20 height-20 "
          alt="close-button"
        />
      </button>
    </div>
  );
}
