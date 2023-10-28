
import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  modalClasses
}) {
  const { setModalContent, setOnModalClose } = useModal();
  let classes;
  if (modalClasses) {
    classes = modalClasses.length > 1 ? modalClasses.join(' ') : modalClasses[0]
  }

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button className={classes} onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
