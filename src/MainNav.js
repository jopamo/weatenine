import { useState, memo } from "react";
import Intro from "./Intro";
import App from "./App";
import Experiments from "./Experiments";

function MainNavImpl() {
  const [currentPage, setCurrentPage] = useState("intro");

  switch (currentPage) {
    case "app":
      return <App setCurrentPage={setCurrentPage} />;
    case "experiments":
      return <Experiments setCurrentPage={setCurrentPage} />;
    default:                               // "intro"
      return <Intro setCurrentPage={setCurrentPage} />;
  }
}

const MainNav = memo(MainNavImpl);

export default MainNav;
