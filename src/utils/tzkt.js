// TODO 8 - Fetch storage of the Lottery by completing fetchStorage

import axios from "axios";

export const fetchStorage = async () => { //Change contract
  const res = await axios.get(
    "https://api.ghostnet.tzkt.io/v1/contracts/KT1VfFaAZn867JPkivbJBFKpktW13Jv4WeUj/storage"
  );
  return res.data
};
