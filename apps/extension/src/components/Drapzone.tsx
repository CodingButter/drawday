import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function DropZone({ callback }: { callback: (files: File[]) => void }) {
  const onDrop = useCallback(callback, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="rounded-md border-2 border-dashed border-slate-600 p-10 text-center text-slate-400">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}
