import "./bottombar.css";

function createNewStrip() {
  console.log("h1");
}

export default function BottomBar() {
  return (
    <div className="bottom-bar">
      <button onClick={createNewStrip}>Create new</button>
    </div>
  );
}
