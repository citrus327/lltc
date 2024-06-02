import ReactDOM from "react-dom/client";
import { A } from "./A";
import { B } from "./B";
import "./index.css";

ReactDOM.createRoot(document.getElementById("A")!).render(<A />);
ReactDOM.createRoot(document.getElementById("B")!).render(<B />);
