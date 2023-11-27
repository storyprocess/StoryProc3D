import { useEffect, useState } from "react";
import { BaseAPI, ApplicationDB } from "../assets/assetsLocation";

const Button = ({ id }) => {
  const [title, setTitle] = useState();
  const [link, setLink] = useState();
  useEffect(() => {
    fatchPartnerSolutionGraphicsData(id);
  }, [id]);

  const fatchPartnerSolutionGraphicsData = async (id) => {
    try {
      const baseAPIUrl = `${BaseAPI}solution_details/${id}?db=${ApplicationDB}`;
      const address = baseAPIUrl; //address for fetching sectiondata
      const response = await fetch(address); //fetch section data files for specific config id
      const responseData = await response.json();
      if (responseData) {
        setTitle(responseData.Solution[0].short_label);
        setLink(responseData.Solution[0].details_url);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <button className="CTA-ButtonList" onClick={() => window.open(link)}>
      {title}
    </button>
  );
};
export default Button;
