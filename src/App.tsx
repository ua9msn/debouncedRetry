import { fetcherFactory } from "./fetcher";
import { debounce } from "./debounce";
import { xhrMock } from "./xhrMock";
import "./styles.css";
import { useRef } from "react";

const simpleFetcher = fetcherFactory(xhrMock);
const delayedSimpleFetcher = debounce(simpleFetcher, 5000);

export default function App() {
  console.log("render app");

  const con = useRef<AbortController | undefined>();

  const onSimple = async () => {
    if (con.current) {
      con.current.abort();
    }

    con.current = new AbortController();

    delayedSimpleFetcher("simple", 123, con.current.signal)
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
