import { useEffect } from "react";
import { request } from "./utils/request";

function App() {
  useEffect(() => {
    request("/", {
      method: "get",
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}

export default App;
