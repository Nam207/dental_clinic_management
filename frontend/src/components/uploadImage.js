import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { AiOutlineClose } from "react-icons/ai";
import axios from "../apis/api";

const UploadAndDisplayImage = ({ userI,value = [], onChange = () => { } }) => {
  let [files, setFiles] = useState([]);
  const [temp, setTemp] = useState(false);
  const openFileDialog = () => {
    document.getElementById("imageUrl").click();
  };

  useEffect(() => {
    onChange(files);
  }, [files]);
  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  const getPermission = async (functionName) => {
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName)

    await Promise.all(userI.role.map(async (element) => {
      const permission = await axios({
        url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
        method: "get",
      })
      if(permission.success === 0 || !permission.data) return;
      if(permission.data[0].edit === true ) {
        setTemp(true);
        return;
      }
    }))
    return;
  }

  return (
    <>
    {temp === true ? (<Button onClick={openFileDialog} variant="primary">
        Chọn ảnh
      </Button>): null}
      
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
