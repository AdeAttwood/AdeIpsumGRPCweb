import React from "react";
import { Boundary } from "@/client/error";
import Content from "@/client/components/content";

import "@/styles/index.scss";

export const App = () => {
  const [number, setNumber] = React.useState(0);

  return (
    <>
      <nav className="bg-white px-4 py-2 shadow">
        <h1>Ade Ipsum</h1>
      </nav>

      <div className="bg-white shadow p-4 m-auto mt-5 rounded" style={{ maxWidth: "800px" }}>
        <div className="form-group m-auto" style={{ maxWidth: "500px" }}>
          <label className="form-label" htmlFor="get-sentences">
            Number of Sentences
          </label>
          <div className="input-group mb-3">
            <input
              value={number}
              onChange={({ target: { value } }) => setNumber(parseInt(value || "0"))}
              type="number"
              min="1"
              step="1"
              className="form-control"
              placeholder="Number of Sentences"
              aria-label="Number of Sentences"
              id="get-sentences"
            />
          </div>
        </div>

        <Boundary>
          <Content number={number} />
        </Boundary>
      </div>
    </>
  );
};

export default App;
