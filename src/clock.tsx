import { useState } from "react";
import "./layout.css";

export default function Clock() {
  const [time, setTime] = useState<string>("");

  setInterval(() => {
    const time = new Date();
    const hours: string = time.getUTCHours().toString();
    const minutes: string = time.getUTCMinutes().toString();
    const seconds: string = time.getUTCSeconds().toString();

    const formattedTime =
      hours.padStart(2, "0") +
      ":" +
      minutes.padStart(2, "0") +
      ":" +
      seconds.padStart(2, "0");

    setTime(formattedTime);
  }, 1000);

  return <div className="clock">{time}</div>;
}
