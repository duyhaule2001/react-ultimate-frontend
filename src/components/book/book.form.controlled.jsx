import { Modal, Input, InputNumber, Select, notification } from "antd";
import { useState } from "react";
import { createBookAPI, handleUploadFile } from "../../services/api.service";

const BookForm = (props) => {
  const { openModal, setOpenModal, loadBook } = props;
  const [mainText, setMainText] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const resetAndCloseModal = () => {
    setOpenModal(false);
    setMainText("");
    setAuthor("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setSelectedFile(null);
    setPreview(null);
  };

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

  const handleCreateBook = async () => {
    if (!selectedFile) {
      notification.error({
        message: "Error",
        description: "Vui lòng thêm hình ảnh",
      });
      return;
    }
    const resUpload = await handleUploadFile(selectedFile, "book");
    if (resUpload.data) {
      const newAvatar = resUpload.data.fileUploaded;

      const resCreateBook = await createBookAPI(
        newAvatar,
        mainText,
        author,
        price,
        quantity,
        category
      );
      if (resCreateBook.data) {
        notification.success({
          message: "Success",
          description: "Đăng kí tài khoản thành công",
        });
        resetAndCloseModal();
        await loadBook();
      }
    } else {
      notification.error({
        message: "Error  upload file",
        description: "Upload file thất bại",
      });
    }
  };

  return (
    <Modal
      title="Create User"
      open={openModal}
      onOk={handleCreateBook}
      onCancel={() => setOpenModal(false)}
    >
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <span>Tiêu đề</span>
        <Input
          value={mainText}
          onChange={(event) => setMainText(event.target.value)}
        />
      </div>
      <div>
        <span>Tác giả</span>
        <Input
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />
      </div>
      <div>
        <span>Giá tiền</span>
        <InputNumber
          style={{ width: "100%" }}
          value={price}
          min={1}
          max={100000}
          addonAfter="đ"
          defaultValue={1}
          onChange={(value) => setPrice(value)}
        />
      </div>
      <div>
        <span>Số lượng</span>
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          max={100000}
          value={quantity}
          onChange={(value) => setQuantity(value)}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Thể loại</span>
        <Select
          defaultValue="Arts"
          style={{ width: "100%" }}
          onChange={(value) => setCategory(value)}
          options={[
            { value: "Arts", label: "Arts" },
            { value: "Business", label: "Business" },
            { value: "Comics", label: "Comics" },
            { value: "Cooking", label: "Cooking" },
            { value: "Entertainment", label: "Entertainment" },
            { value: "History", label: "History" },
            { value: "Music", label: "Music" },
            { value: "Sports", label: "Sports" },
            { value: "Teen", label: "Teen" },
            { value: "Travel", label: "Travel" },
          ]}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Ảnh thumbnail</span>
        <input
          onChange={handlePreview}
          onClick={(event) => {
            event.target.value = null;
          }}
          type="file"
          id="btnUpload"
        />
      </div>
      {preview && (
        <div>
          <img height={250} width={300} src={preview} />
        </div>
      )}
    </Modal>
  );
};

export default BookForm;
