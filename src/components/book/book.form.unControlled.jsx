import React, { useState } from "react";
import { Form, Input, InputNumber, Modal, notification, Select } from "antd";
import { createBookAPI, handleUploadFile } from "../../services/api.service";

const CreateBookUncontrolled = (props) => {
  const [form] = Form.useForm();
  const { openModal, setOpenModal, loadBook } = props;
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

  const resetAndCloseModal = () => {
    form.resetFields();
    setSelectedFile(null);
    setPreview(null);
    setOpenModal(false);
  };

  const handleCreateBook = async (values) => {
    if (!selectedFile) {
      notification.error({
        message: "Error",
        description: "Vui lòng thêm hình ảnh",
      });
      return;
    }

    const resUpload = await handleUploadFile(selectedFile, "book");
    if (resUpload.data) {
      const newThumbnail = resUpload.data.fileUploaded;

      const resCreateBook = await createBookAPI(
        newThumbnail,
        values.mainText,
        values.author,
        values.price,
        values.quantity,
        values.category
      );
      if (resCreateBook.data) {
        notification.success({
          message: "Success",
          description: "Tạo sách thành công",
        });
        resetAndCloseModal();
        await loadBook();
      } else {
        notification.error({
          message: "Error",
          description: "Lỗi thêm dữ liệu",
        });
      }
    }
  };

  return (
    <Modal
      title="Create Book Uncontrolled"
      open={openModal}
      onCancel={() => setOpenModal(false)}
      style={{ width: "100%" }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        name="basic"
        onFinish={handleCreateBook}
        autoComplete="off"
      >
        <Form.Item
          label="Tiêu đề"
          name="mainText"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tác giả"
          name="author"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên tác giả",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá tiền"
          name="price"
          style={{ width: "100%" }}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá tiền",
            },
          ]}
        >
          <InputNumber addonAfter="đ" />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          style={{ width: "100%" }}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Thể loại"
          name="category"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thể loại",
            },
          ]}
        >
          <Select
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
        </Form.Item>
      </Form>

      <label
        style={{
          background: "orange",
          padding: "3px 3px",
          alignContent: "center",
        }}
        htmlFor="btnUpload"
      >
        Upload
        <input
          onChange={handlePreview}
          onClick={(event) => {
            event.target.value = null;
          }}
          type="file"
          id="btnUpload"
          hidden
          style={{ display: "none" }}
        />
      </label>
      {preview && (
        <div>
          <img height={250} width={300} src={preview} />
        </div>
      )}
    </Modal>
  );
};

export default CreateBookUncontrolled;
