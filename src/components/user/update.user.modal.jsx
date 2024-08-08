import { useEffect, useState } from "react";
import { updateUserAPI } from "../../services/api.service";
import { Input, notification, Modal } from "antd";

const UpdateUserModal = (props) => {
  const [fullName, setFullName] = useState("");
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");

  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataUpdate,
    setDataUpdate,
    loadUser,
  } = props;

  useEffect(() => {
    if (dataUpdate) {
      setId(dataUpdate._id);
      setFullName(dataUpdate.fullName);
      setPhone(dataUpdate.phone);
    }
  }, [dataUpdate]);

  const handleSubmit = async () => {
    const res = await updateUserAPI(id, fullName, phone);
    if (res.data) {
      notification.success({
        message: "Create user",
        description: "Tạo mới tài khoản thành công",
      });
      resetAndCloseModal();
      await loadUser();
    } else {
      notification.error({
        message: "Error create user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const resetAndCloseModal = () => {
    setFullName("");
    setPhone("");
    setIsModalUpdateOpen(false);
    setId("");
    setDataUpdate(null);
  };

  return (
    <Modal
      title="Update User"
      open={isModalUpdateOpen}
      onOk={handleSubmit}
      onCancel={() => resetAndCloseModal()}
      maskClosable={false}
      okText={"Save"}
    >
      <div>
        <span>Id</span>
        <Input value={id} disabled />
      </div>
      <div>
        <span>FulName</span>
        <Input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </div>
      <div>
        <span>Phone number</span>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
    </Modal>
  );
};

export default UpdateUserModal;
