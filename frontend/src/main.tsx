import { createRoot } from "react-dom/client";
import "@/styles/globals.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
