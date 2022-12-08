import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { AiOutlineClose } from "react-icons/ai";

const UploadAndDisplayImage = ({ value = [], onChange = () => { } }) => {
  let [files, setFiles] = useState([]);

  const openFileDialog = () => {
    document.getElementById("imageUrl").click();
  };

  useEffect(() => {
    onChange(files);
  }, [files]);

  return (
    <>
      <Button onClick={openFileDialog} variant="primary">
        Chọn ảnh
      </Button>
      <input
        id="imageUrl"
        type="file"
        name="imageUrl"
        onChange={(event) => {
          setFiles([...event.target.files]);
        }}
        hidden
        accept="image/png, image/gif, image/jpeg"
      />

      {/* display image */}
      {(files.length > 0 || typeof value === "string") && (
        <div className="image-container">
          <AiOutlineClose
            onClick={() => { setFiles([]);}}
            id="image-close"
            size={30}
          />
          <img
            alt="Không tìm thấy"
            width={"100%"}
            height={"auto"}
            src={files.length > 0 ? URL.createObjectURL(files[0]) : value}
          />
        </div>
      )}
    </>
  );
};

export default UploadAndDisplayImage;
