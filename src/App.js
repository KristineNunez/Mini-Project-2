import { useState, useEffect } from "react";

// Components
import Navbar from "./components/Navbar";
import {addBalanceOwnerOperation, addBalanceCounterpartyOperation,
        claimOwnerOperation, claimCounterpartyOperation,
        revertOwnerOperation, revertCounterpartyOperation, revertFundsOperation} from "./utils/operation.js"

const App = () => {
  // Players holding lottery tickets
  //const [players, setPlayers] = useState([]);
  //const [tickets, setTickets] = useState(3);
  const [loading, setLoading] = useState(false);

  // Set players and tickets remaining
  /*useEffect(() => {
    // TODO 9 - Fetch players and tickets remaining from storage
    (async () => {
      setPlayers([]);
      setTickets(3);
    })();
  }, []);*/

  //Triggers when someone deposits
  const onAddBalance = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formData_entries = formData.entries();

    const party = formData_entries.next().value[1];
    const deposit = formData_entries.next().value[1];

    if(party == "Owner"){
      await addBalanceOwnerOperation(deposit)
    }
    else{
      await addBalanceCounterpartyOperation(deposit)
    }

    alert(party + " has successfully deposited funds.")
  };

  //Triggers when someone claims funds
  const onClaim = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formData_entries = formData.entries();

    const party = formData_entries.next().value[1];

    if(party == "Owner"){
      await claimOwnerOperation()
    }
    else{
      const secret = formData_entries.next().value[1];
      await claimCounterpartyOperation(secret)
    }

    alert(party + " has successfully claimed funds.")
  };

  //Triggers when someone wants to revert funds
  const onRevert = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formData_entries = formData.entries();

    const party = formData_entries.next().value[1];

    if(party == "Owner"){
      await revertOwnerOperation()
    }
    else{
      await revertCounterpartyOperation()
    }

    alert(party + " has decided to withdraw from the contract.")
  };

  //Triggers when admin authorizes withdrawal
  const onAuthorize = async () => {
    await revertFundsOperation()

    alert("Funds have been successfully reverted.")
  };

  return (
    <div className="h-100">
      <Navbar />
      <br/><br/>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        {/*Depositing*/}
        <form onSubmit={onAddBalance}>
          Party:<br/>
          <input type="radio" id="Owner" name="party" value="Owner" />
          <label for="Owner">Owner</label>
          <input type="radio" id="Counterparty" name="party" value="Counterparty" />
          <label for="Counterparty">Counterparty</label><br/><br/>

          <label for="deposit">Deposit Amount (tez):</label><br/>
          <input type="text" id="deposit" name="deposit" /><br/><br/>

          <button type="submit" className="btn btn-primary btn-lg">
            {/* TODO 7.c - Show "loading..." when buying operation is pending */}
            Deposit Funds
          </button>
        </form>

        <br/><br/>

        {/*Claiming*/}
        <form onSubmit={onClaim}>
          Party:<br/>
          <input type="radio" id="Owner2" name="party" value="Owner" />
          <label for="Owner2">Owner</label>
          <input type="radio" id="Counterparty2" name="party" value="Counterparty" />
          <label for="Counterparty2">Counterparty</label><br/><br/>

          <label for="secret">Secret:</label><br/>
          <input type="text" id="secret" name="secret" /><br/><br/>

          <button type="submit" className="btn btn-primary btn-lg">
            {/* TODO 7.c - Show "loading..." when buying operation is pending */}
            Claim Funds
          </button>
        </form>

        <br/><br/>

        {/*Withdrawing from Contract*/}
        <form onSubmit={onRevert}>
          Party:<br/>
          <input type="radio" id="Owner3" name="party" value="Owner" />
          <label for="Owner3">Owner</label>
          <input type="radio" id="Counterparty3" name="party" value="Counterparty" />
          <label for="Counterparty3">Counterparty</label><br/><br/>

          <button type="submit" className="btn btn-primary btn-lg">
            {/* TODO 7.c - Show "loading..." when buying operation is pending */}
            Withdraw from Contract
          </button>
        </form>

        <br/><br/>

        {/*Authorizing withdrawal*/}
        <button onClick={onAuthorize} className="btn btn-primary btn-lg">
           {/* TODO 7.c - Show "loading..." when buying operation is pending */}
           Authorize Withdrawal
        </button>
      </div>
    </div>
  );
};

export default App;
