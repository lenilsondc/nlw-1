import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

import "./styles.css";

interface Props {
  onSelectFile: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onSelectFile }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onDrop = useCallback(
    ([file]) => {
      const fileUrl = URL.createObjectURL(file);

      setSelectedFileUrl(fileUrl);
      onSelectFile(file);
    },
    [onSelectFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="File thumbnail" />
      ) : (
        <p>
          <FiUpload />
          {isDragActive
            ? "Drop the files here ..."
            : "Drag 'n' drop some files here, or click to select files"}
        </p>
      )}
    </div>
  );
};

export default Dropzone;
