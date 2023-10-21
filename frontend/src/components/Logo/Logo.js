import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Logo = () => {
  const [clicked, setClicked] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (clicked) {
      history.push()
    }
  })
  return (
    <i className="fa-solid fa-wind fa-2xl"
    onClick={setClicked(true)}/>
  )
}

export default Logo
