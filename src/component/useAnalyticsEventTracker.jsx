import React from "react";
import ReactGA from "react-ga";

const useAnalyticsEventTracker = (category="Blog category") => {
  const eventTracker = (action = "test action", label = "test label") => {
    console.log("category",category);
    console.log("action",action);
    console.log("label",label);
    ReactGA.event({category, action, label});
  }
  return eventTracker;
}
export default useAnalyticsEventTracker;