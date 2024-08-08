import { Form, Input, InputNumber, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { handleUploadFile, updateBookAPI } from "../../services/api.service";

const UpdateBookControlled = (props) => {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { isOpenUpdate, setIsOpenUpdate, dataUpdate, setDataUpdate, loadBook } =
    props;

  useEffect(() => {
    if (dataUpdate && dataUpdate._id) {
      form.setFieldsValue({
        id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        quantity: dataUpdate.quantity,
        category: dataUpdate.category,
      });
      setPreview(
        `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataUpdate.thumbnail
        }`
      );
    }
  }, [dataUpdate, form]);

  const updateBook = async (values, newThumbnail) => {
    const resBook = await updateBookAPI(
      values.id,
      newThumbnail,
      values.mainText,
      values.author,
      values.price,
      values.quantity,
      values.category
    );

    if (resBook.data) {
      setIsOpenUpdate(false);
      form.resetFields;
      await loadBook();
      setDataUpdate(null);
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

  const handleUpdate = async (values) => {
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
    await updateBook(values, newThumbnail);
  };

  return (
    <>
      <Modal
        title="Update Book Uncontrolled"
        open={isOpenUpdate}
        onCancel={() => setIsOpenUpdate(false)}
        style={{ width: "100%" }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          name="basic"
          onFinish={handleUpdate}
          autoComplete="off"
        >
          <Form.Item
            label="Id"
            name="id"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiêu đề",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

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
    </>
  );
};

export default UpdateBookControlled;
