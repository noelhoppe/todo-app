import {FadeLoader} from "react-spinners"


export default function ServerWakeupIndicator() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#fffbe6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <FadeLoader color="#333" />
      <div style={{ marginTop: 32, fontSize: "1.2rem", color: "#333", textAlign: "center" }}>
        Waking up the server, please wait a moment...
      </div>
    </div>
  );
}