import React, { useState } from "react";
import { Button, Drawer, notification } from "antd";
import {
  handleUploadFile,
  updateUserAPI,
  updateUserAvatarAPI,
} from "../../services/api.service";

const ViewUserDetail = (props) => {
  const { dataDetail, setDataDetail, setIsDetailOpen, isDetailOpen, loadUser } =
    props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePreview = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateUserAvatar = async () => {
    const resUpload = await handleUploadFile(selectedFile, "avatar");
    if (resUpload.data) {
      const newAvatar = resUpload.data.fileUploaded;

      const resUpdateAvatar = await updateUserAvatarAPI(
        newAvatar,
        dataDetail._id,
        dataDetail.fullName,
        dataDetail.phone
      );
      if (resUpdateAvatar.data) {
        setIsDetailOpen(false);
        setSelectedFile(null);
        setPreview(null);
        await loadUser();
        notification.success({
          message: "Update user avatar",
          description: "Cập nhật avatar thành công",
        });
      } else {
        notification.error({
          message: "Error update avatar",
          description: JSON.stringify(resUpdateAvatar.message),
        });
      }
    } else {
      notification.error({
        message: "Error upload file",
        description: JSON.stringify(resUpload.message),
      });
    }
  };
  return (
    <Drawer
      width={"40vw"}
      title="Thông tin user"
      onClose={() => {
        setIsDetailOpen(false);
        setDataDetail(null);
      }}
      open={isDetailOpen}
    >
      {dataDetail ? (
        <>
          <p>ID:{dataDetail._id}</p>
          <p>Full name:{dataDetail.fullName}</p>
          <p>Email:{dataDetail.mail}</p>
          <p>Phone number:{dataDetail.phone}</p>
          <div>
            <img
              height={250}
              width={300}
              src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                dataDetail.avatar
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="btnUpload"
              style={{ background: "orange", padding: "5px" }}
            >
              Upload Avatar
            </label>
            <input onChange={handlePreview} type="file" hidden id="btnUpload" />
          </div>
          {preview && (
            <p>
              <div>
                <img height={250} width={300} src={preview} />
              </div>
              <Button onClick={handleUpdateUserAvatar}>Save</Button>
            </p>
          )}
        </>
      ) : (
        <div>khong co du lieu</div>
      )}
    </Drawer>
  );
};

export default ViewUserDetail;
