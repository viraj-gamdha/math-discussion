import { Outlet } from "react-router-dom";
import s from "./main-layout.module.scss";
import Header from "./header";

const MainLayout = () => {
  return (
    <main className={s.container}>
      <Header />
      <div className={s.content}>
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
