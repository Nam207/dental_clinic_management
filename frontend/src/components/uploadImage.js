import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { AiOutlineClose } from "react-icons/ai";
import axios from "../apis/api";

const UploadAndDisplayImage = ({ permission,value = [], onChange = () => { } }) => {
  let [files, setFiles] = useState([]);
  const openFileDialog = () => {
    document.getElementById("imageUrl").click();
  };

  useEffect(() => {
    onChange(files);
    getPermission("Quản lý thuốc")
  }, [files]);
  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  return (
    <>
    {permission === true ? (<Button onClick={openFileDialog} variant="primary">
        Chọn ảnh
      </Button>): <></>}
      
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
