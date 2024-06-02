import { useEffect } from "react";
import { request } from "./utils/request";
import { PanelA } from "./components/PanelA";
import { PanelB } from "./components/PanelB";

function App() {
  useEffect(() => {
    request("/", {
      method: "get",
    });
  }, []);

  return (
    <div className="w-full h-full flex divide-x">
      <PanelA className="flex-1 basis-1/2 bg-blue-50 h-full p-5" />

      <PanelB className="flex-1 basis-1/2 bg-green-50 h-full p-5" />
    </div>
  );
}

export default App;
