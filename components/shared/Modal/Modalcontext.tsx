import React from "react";

const modalContext = React.createContext({
    openName: "",
    openModal: (name: string) => {console.log(name)},
    closeModal: () => {},
  });

  export default modalContext;