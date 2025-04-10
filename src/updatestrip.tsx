import { StripData } from "./types";

export function UpdateStrip(oldStripData: StripData) {
  const newStripData: StripData = oldStripData;
  const callsign: string = newStripData.fpdata.cs;

  function getTTRorER(route: string) {
    route = route.replace("/", " ");
    const isTTR = route.match(
      /(V601 |V611 |V621 |V631 |V641 |V651 |V10 |V11 |V12)/
    );
    if (!isTTR) {
      const isBEKOL = route.match(/(G471 |B208 |A461 |G586 )/);
      if (!isTTR) {
        return null;
      } else {
        newStripData.fpdata.er = isBEKOL![0].trim();
      }
    } else {
      newStripData.fpdata.ttr = isTTR[0].trim();
    }
  }

  async function fetchData() {
    const res = await fetch(`api/get-fp-data?callsign=${callsign}`);
    const fetchedData = await res.json();

    newStripData.fpdata.eobt = fetchedData["data"].eobt;
    newStripData.fpdata.fr = fetchedData["data"].fr;
    newStripData.fpdata.atyp = fetchedData["data"].atyp;
    newStripData.fpdata.wtc = fetchedData["data"].wtc;
    newStripData.fpdata.ssr = fetchedData["data"].ssr;
    newStripData.fpdata.drwy = fetchedData["data"].drwy;
    newStripData.fpdata.arwy = fetchedData["data"].arwy;
    newStripData.fpdata.rfl = fetchedData["data"].rfl;
    newStripData.fpdata.sid = fetchedData["data"].sid;
    newStripData.fpdata.adep = fetchedData["data"].adep;
    newStripData.fpdata.ades = fetchedData["data"].ades;
    newStripData.fpdata.cfl = fetchedData["data"].cfl;
    newStripData.fpdata.a_rmk = fetchedData["data"].rmk;

    getTTRorER(fetchedData["data"].route);

    newStripData.fpdata.act =
      fetchedData["data"].g_state === "DEPA" ? "T/O" : null;

    console.log(newStripData);
  }

  fetchData();
}
