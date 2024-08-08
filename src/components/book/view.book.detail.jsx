import React from "react";
import { Drawer } from "antd";
const DetailBook = (props) => {
  const { isOpenDetailBook, setIsOpenDetailBook, dataDetail, setDataDetail } =
    props;

  return (
    <>
      <Drawer
        title="Chi tiết book"
        onClose={() => {
          setIsOpenDetailBook(false);
          setDataDetail(null);
        }}
        open={isOpenDetailBook}
      >
        {dataDetail ? (
          <>
            <p>ID: {dataDetail._id}</p>
            <p>Tiêu đề: {dataDetail.mainText}</p>
            <p>Tác giả {dataDetail.author}</p>
            <p>Thể loại{dataDetail.category}</p>
            <p>
              Giá tiền{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(dataDetail.price)}
            </p>
            <p>Số lượng {dataDetail.quantity}</p>
            <p>Đã bán {dataDetail.sold}</p>
            <p>
              Thumbnail
              <img
                style={{ height: "300px", width: "300px" }}
                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                  dataDetail.thumbnail
                }`}
              />
            </p>
          </>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Drawer>
    </>
  );
};

export default DetailBook;
