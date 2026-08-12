import { useRef, useState } from "react";
import type { ChatInputUiType } from "../index";

const MAX_FILES = 6;

export function useFileUpload() {
  const [uitype, setUitype] = useState<ChatInputUiType>("file-upload");
  const [mediaUrls, setMediaUrls] = useState<Array<string | undefined>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).slice(0, MAX_FILES - mediaUrls.length);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setMediaUrls((prev) => [...prev, ...newUrls].slice(0, MAX_FILES));
    setUitype("multi-upload");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMediaEmptyClick = (_index: number) => {
    fileInputRef.current?.click();
  };

  const handleMediaRemove = (index: number) => {
    setMediaUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setUitype("file-upload");
      }
      return updated;
    });
  };

  return {
    uitype,
    mediaUrls,
    fileInputRef,
    handleFileUploadClick,
    handleFileChange,
    handleMediaEmptyClick,
    handleMediaRemove,
  };
}
