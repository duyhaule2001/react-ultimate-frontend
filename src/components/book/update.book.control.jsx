import { Input, InputNumber, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { handleUploadFile, updateBookAPI } from "../../services/api.service";

const UpdateBookModal = (props) => {
  const { isOpenUpdate, setIsOpenUpdate, dataUpdate, setDataUpdate, loadBook } =
    props;

  const [id, setId] = useState("");
  const [mainText, setMainText] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (dataUpdate && dataUpdate._id) {
      setId(dataUpdate._id);
      setMainText(dataUpdate.mainText);
      setAuthor(dataUpdate.author);
      setPrice(dataUpdate.price);
      setQuantity(dataUpdate.quantity);
      setCategory(dataUpdate.category);
      setPreview(
        `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataUpdate.thumbnail
        }`
      );
      setSelectedFile(null);
    }
  }, [dataUpdate]);

  const updateBook = async (newThumbnail) => {
    const resBook = await updateBookAPI(
      id,
      newThumbnail,
      mainText,
      author,
      price,
      quantity,
      category
    );

    if (resBook.data) {
      resetAndCloseModal();
      await loadBook();
      notification.success({
        message: "Success",
        description: "Cập nhật book thành công",
      });
    }
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

  const handleUpdate = async () => {
    if (!preview && !selectedFile) {
      notification.error({
        message: "Error",
        description: "Vui lòng upload file",
      });
      return;
    }

    let newThumbnail = "";

    if (!selectedFile && preview) {
      newThumbnail = dataUpdate.thumbnail;
    } else {
      const resUploadThumbnailBook = await handleUploadFile(
        selectedFile,
        "book"
      );
      if (resUploadThumbnailBook.data) {
        newThumbnail = resUploadThumbnailBook.data.fileUploaded;
      } else {
        notification.error({
          message: "Error Upload File",
          description: JSON.stringify(resUploadThumbnailBook.message),
        });
        return;
      }
    }
    await updateBook(newThumbnail);
  };

  const resetAndCloseModal = () => {
    setMainText("");
    setAuthor("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setSelectedFile("");
    setPreview("");
    setId("");
    setDataUpdate(null);
    setIsOpenUpdate(false);
  };
  return (
    <>
      <Modal
        title="Basic Modal"
        open={isOpenUpdate}
        onOk={handleUpdate}
        onCancel={() => setIsOpenUpdate(false)}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>ID</span>
          <Input
            disabled
            value={id}
            onChange={(event) => setMainText(event.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
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
            value={category}
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
    </>
  );
};

export default UpdateBookModal;
