import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { Button, Result } from "antd";

const PrivateRoute = (props) => {
  const { user } = useContext(AuthContext);

  if (user && user.id) {
    return <>{props.children}</>;
  }
  //   return <Navigate to="/login" replace />;
  return (
    <Result
      status="404"
      title="Unauthorize"
      subTitle={"Bạn cần đăng nhập để truy cập nguồn tài nguyên"}
      extra={
        <Button type="primary">
          {" "}
          <Link to="/">Back To Home</Link>
        </Button>
      }
    />
  );
};

export default PrivateRoute;
