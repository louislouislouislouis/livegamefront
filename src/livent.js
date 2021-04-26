import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";

import { useHttpClient } from "./hooks/http-hook";

const Live = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //POSSIBLY NEXT PLAYERID
  const [name, setname] = useState("");
  //FEEDBACKFOR PLAYERID
  const [retour, setretour] = useState("Veuillez choisir un PlayerId");

  //SOURCELIVE EXIST OVER RENDER
  const evtSrclive = useRef(null);

  //VERIFY FEEDBACK FOR NAME EVERY TIME CHANGE
  useEffect(() => {
    const fonction = async () => {
      if (name) {
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/${name}/isExisting`
          );

          if (rep.msg === "Ok") {
            setretour("Ce nom est op");
          }
        } catch (err) {
          setretour("Ce nom n'est pas op");
        }
      } else {
        setretour("Veuillez choisir un PlayerId");
      }
    };
    fonction();
  }, [name, sendRequest]);

  //CREATE A PAYERID
  const submithandler = (e) => {
    e.preventDefault();
    if (!evtSrclive.current) {
      evtSrclive.current = new EventSource(
        `${process.env.REACT_APP_BACKENDURL}/api/live/${name}`
      );
      evtSrclive.current.addEventListener("count", (event) => {
        console.log(event.data);
      });
      console.log(`${process.env.REACT_APP_BACKENDURL}/api/live/${name}`);
    } else {
      evtSrclive.current.close();
      evtSrclive.current = new EventSource(
        `${process.env.REACT_APP_BACKENDURL}/api/live/${name}`
      );
      evtSrclive.current.addEventListener("count", (event) => {
        console.log(event.data);
      });
    }
  };

  //CHANGE NAME VALUE ON CHANGE
  const changeHandler = (e) => {
    setname(e.target.value);
  };

  return (
    <React.Fragment>
      <form onSubmit={submithandler}>
        <input value={name} onChange={changeHandler} />
        <button type="submit"> SEND</button>
      </form>
      <p>{name}</p>
      <p>{retour}</p>
    </React.Fragment>
  );
};

export default Live;
