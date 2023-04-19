import {tezos} from "./tezos"

//const contract_address = "KT1WmwEHA2Aqyv4me8mfctELL645idtx25RW"; //Timestamp = 123
//const contract_address = "KT1V8DHDJYNrJSajbibfEdWZx2p35d23YAgA"; //Timestamp = 1712479881
const contract_address = "KT1VfFaAZn867JPkivbJBFKpktW13Jv4WeUj"; //Revised

//For owner deposit
export const addBalanceOwnerOperation = async (amount) => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.addBalanceOwner().send({
      amount: amount,
      mutez: false,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};

//For counterparty deposit
export const addBalanceCounterpartyOperation = async (amount) => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.addBalanceCounterparty().send({
      amount: amount,
      mutez: false,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};

//For owner claim
export const claimOwnerOperation = async () => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.claimOwner().send({
      amount: 0,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};

//For counterparty claim
export const claimCounterpartyOperation = async (secret) => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.claimCounterparty(secret).send({
      amount: 0,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};

//For owner's permission to revert funds
export const revertOwnerOperation = async () => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.revertOwner().send({
      amount: 0,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};

//For counterparty's permission to revert funds
export const revertCounterpartyOperation = async () => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.revertCounterparty().send({
      amount: 0,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};

//For admin fund reversion
export const revertFundsOperation = async () => {
  try{
    const contract = await tezos.wallet.at(contract_address);
    const op = await contract.methods.revertFunds().send({
      amount: 0,
    })
    await op.confirmation(1);
  }
  catch(err){
    throw err;
  }
};
