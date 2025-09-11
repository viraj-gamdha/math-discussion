import { LucideLogOut } from "lucide-react";
import { Button } from "../ui/button";
import s from "./header.module.scss";
import { useLogoutMutation } from "@/redux/apis/authApiSlice";
import { errorToast, successToast } from "../ui/toast";
import { parseError } from "@/utils/helpers";
import { useAppSelector } from "@/hooks/reduxHooks";

const Header = () => {
  const [logout, { isLoading }] = useLogoutMutation();

  const userInfo = useAppSelector((state) => state.auth.userInfo);

  const handleLogout = async () => {
    try {
      const res = await logout({}).unwrap();

      if (res.success) {
        successToast(res.message);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <h5>Math Discussion</h5>
      </div>

      {userInfo?.accessToken && (
        <div className={s.wrapper}>
          <p>{userInfo?.username}</p>
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={isLoading}
            style={{ opacity: isLoading ? "0.8" : "1" }}
          >
            <LucideLogOut size={18} /> Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
