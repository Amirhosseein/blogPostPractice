import { cloneElement, useContext, useState } from "react";
import { MouseEvent } from "react";
import modalContext from "./Modalcontext";
import classes from "./Modal.module.css";

const StyledModal = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string | React.ReactNode;
}) => {
  return (
    <div className={classes["modal--overlay"]}>
      <div className={classes["modal--container"]}>{children}</div>
    </div>
  );
};



const Modal = ({ children }: { children: JSX.Element | JSX.Element[] | string | React.ReactNode; }) => {
  const [openName, setOpen] = useState("");
  const closeModal = () => setOpen("");
  const openModal = setOpen;
  
  return (
    <modalContext.Provider value={{ openName, openModal, closeModal }}>
      {children}
    </modalContext.Provider>
  );
};

const Open = ({
  children,
  openWindow,
}: {
  children: React.ReactElement;
  openWindow: string;
}) => {
  const { openModal} = useContext(modalContext);

  return cloneElement(children, { onClick: (e:MouseEvent<HTMLButtonElement>) => { e.preventDefault();  openModal(openWindow);} });
};

const Window = ({
  children,
  name,
}: {
  children: React.ReactElement;
  name: string;
}) => {
  const { openName, closeModal } = useContext(modalContext);
  if (name !== openName) return null;

  return (
    <StyledModal>
      <button className={classes["modal--btn--close"]} onClick={closeModal}> X </button> <div>{cloneElement(children,{onCloseModal:closeModal})}</div>
    </StyledModal>
  );
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
