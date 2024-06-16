import ReactGA from "react-ga4";

export const handleButtonClick = (category: string, action: string) => {
  ReactGA.event({ category, action });
  console.log("evented");
};
