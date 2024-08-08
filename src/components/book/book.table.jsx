import React, { useState } from "react";
import { Button, Space, Table, Modal, Popconfirm, notification } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import DetailBook from "./view.book.detail";
import BookForm from "./book.form.controlled";
import CreateBookUncontrolled from "./book.form.unControlled";
import UpdateBookModal from "./update.book.control";
import UpdateBookControlled from "./update.book.unControlled";
import { deleteBookAPI } from "../../services/api.service";

const BookTable = (props) => {
  const {
    loadBook,
    dataBook,
    current,
    pageSize,
    total,
    setCurrent,
    setPageSize,
    loadingBook,
    setLoadingBook,
  } = props;

  const [isOpenDetailBook, setIsOpenDetailBook] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const handleDeleteBook = async (id) => {
    const res = await deleteBookAPI(id);
    if (res.data) {
      notification.success({
        message: "Thành công",
        description: "Xoá sách thành công",
      });
      await loadBook();
    } else {
      notification.error({
        message: "Lỗi",
        description: "Không thể xoá sách",
      });
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "name",
      render: (_, record, index) => {
        return <>{index + 1 + (current - 1) * pageSize}</>;
      },
    },
    {
      title: "Id",
      dataIndex: "_id",
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              setIsOpenDetailBook(true);
              setDataDetail(record);
            }}
            href="#"
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "mainText",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      render: (text, record, index, action) => {
        if (text)
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(text);
      },
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Xoá"
            description="Bạn có chắc muốn xoá mục này không"
            onConfirm={() => handleDeleteBook(record._id)}
            // onCancel={cancel}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>

          <EditOutlined
            onClick={() => {
              setIsOpenUpdate(true);
              setDataUpdate(record);
            }}
            style={{ color: "orange" }}
          />
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    //nếu thay đổi trang : current
    if (pagination && pagination.current) {
      if (+pagination.current !== +current) {
        setCurrent(+pagination.current);
      }
    }
    //nếu thay đổi tổng số phần từ
    if (pagination && pagination.pageSize) {
      if (+pagination.pageSize !== +pageSize) {
        setPageSize(+pagination.pageSize);
      }
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: " 10px 0",
        }}
      >
        <h2>Table Book</h2>
        <Button onClick={() => setOpenModal(true)} type="primary">
          Create Book
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataBook}
        rowKey={"_id"}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        onChange={onChange}
      />
      <DetailBook
        isOpenDetailBook={isOpenDetailBook}
        setIsOpenDetailBook={setIsOpenDetailBook}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />
      {/* <BookForm
        openModal={openModal}
        setOpenModal={setOpenModal}
        loadBook={loadBook}
      /> */}
      <UpdateBookControlled
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadBook={loadBook}
      />
      {/* <UpdateBookModal
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadBook={loadBook}
      /> */}
      <CreateBookUncontrolled
        openModal={openModal}
        setOpenModal={setOpenModal}
        loadBook={loadBook}
      />
    </div>
  );
};
export default BookTable;
