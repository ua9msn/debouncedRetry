import { retriable } from "./fetcher";
import { debouncible } from "./debounce";
import { xhrMock } from "./xhrMock";
import "./styles.css";
import { useRef } from "react";
import { abortable } from "./abortable";

const simpleFetcher = retriable(xhrMock);
const delayedSimpleFetcher = debouncible(simpleFetcher, 300);
const fetcher = abortable(delayedSimpleFetcher);

export default function App() {
  console.log("render app");

  const con = useRef<AbortController | undefined>();

  const onSimple = async () => {
    fetcher("simple", 123)
      .then((simpleResponse) => {
        console.log("simpleFetch: ", simpleResponse);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox!</h1>

      <div>
        <button onClick={onSimple}>Simple Fetch</button>
      </div>
    </div>
  );
}
