import { useEffect, useState, useCallback } from 'react';

// ドラッグ＆ドロップの状態管理とファイル受け取りを共通化するカスタムフック
export function useGlobalDropOverlay(onDropFile: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        onDropFile(file);
        e.dataTransfer.clearData();
      }
    },
    [onDropFile]
  );

  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    window.addEventListener('dragover', preventDefault, false);
    window.addEventListener('drop', handleDrop as EventListener, false);
    window.addEventListener('dragenter', handleDragEnter, false);
    window.addEventListener('dragleave', handleDragLeave, false);
    return () => {
      window.removeEventListener('dragover', preventDefault, false);
      window.removeEventListener('drop', handleDrop as EventListener, false);
      window.removeEventListener('dragenter', handleDragEnter, false);
      window.removeEventListener('dragleave', handleDragLeave, false);
    };
  }, [handleDrop]);

  return isDragging;
}
