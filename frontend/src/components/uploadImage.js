import React, { useState } from "react";

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {selectedImage && (
        <div>
          <img
            alt="not fount"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />

      <br />
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event);
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
        accept="image/png, image/gif, image/jpeg"
      />
    </>
  );
};

export default UploadAndDisplayImage;