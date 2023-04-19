# Escrow - Example for illustrative purposes only.

import smartpy as sp

class Escrow(sp.Contract):
    #Modified
    def __init__(self, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret, admin):
        self.init(fromOwner            = fromOwner,
                  fromCounterparty     = fromCounterparty,
                  balanceOwner         = sp.tez(0),
                  balanceCounterparty  = sp.tez(0),
                  hashedSecret         = hashedSecret,
                  epoch                = epoch,
                  owner                = owner,
                  counterparty         = counterparty,
                  admin                = admin,
                  withdrawalAuthorized = sp.bool(False),
                  withdrawOwner        = sp.bool(False),
                  withdrawCounterparty = sp.bool(False))

    #Modified
    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(sp.sender == self.data.owner, "NOT AUTHORIZED: ESCROW OWNER ONLY")
        sp.verify(self.data.balanceOwner == sp.tez(0), "OWNER HAS ALREADY ADDED BALANCE")
        sp.verify(sp.amount == self.data.fromOwner)
        self.data.balanceOwner = self.data.fromOwner

    #Modified
    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty, "NOT AUTHORIZED: ESCROW COUNTERPARTY ONLY")
        sp.verify(self.data.balanceCounterparty == sp.tez(0), "COUNTERPARTY HAS ALREADY ADDED BALANCE")
        sp.verify(sp.amount == self.data.fromCounterparty)
        self.data.balanceCounterparty = self.data.fromCounterparty

    def claim(self, identity):
        sp.verify(sp.sender == identity)
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

    #Modified
    @sp.entry_point
    def claimCounterparty(self, params):
        sp.verify(sp.sender == self.data.counterparty, "NOT AUTHORIZED: ESCROW COUNTERPARTY ONLY")
        sp.verify(sp.now < self.data.epoch)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        self.claim(self.data.counterparty)

    #Modified
    @sp.entry_point
    def claimOwner(self):
        sp.verify(sp.sender == self.data.owner, "NOT AUTHORIZED: ESCROW OWNER ONLY")
        sp.verify(self.data.epoch < sp.now)
        self.claim(self.data.owner)

    #Added
    @sp.entry_point
    def revertOwner(self):
        sp.verify(sp.sender == self.data.owner, "NOT AUTHORIZED: ESCROW OWNER ONLY")
        self.data.withdrawOwner = sp.bool(True)

    #Added
    @sp.entry_point
    def revertCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty, "NOT AUTHORIZED: ESCROW COUNTERPARTY ONLY")
        self.data.withdrawCounterparty = sp.bool(True)
    
    #Added
    @sp.entry_point
    def revertFunds(self):
        sp.verify(sp.sender == self.data.admin, "NOT AUTHORIZED: ESCROW ADMIN ONLY")
        sp.verify(self.data.withdrawOwner, "OWNER MUST AGREE TO WITHDRAW FROM CONTRACT")
        sp.verify(self.data.withdrawCounterparty, "COUNTERPARTY MUST AGREE TO WITHDRAW FROM CONTRACT")
        
        self.data.withdrawalAuthorized = sp.bool(True)
        sp.send(self.data.owner, self.data.balanceOwner)
        sp.send(self.data.counterparty, self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)
        

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))
    alice = sp.test_account("Alice")
    bob = sp.test_account("Bob")
    admin = sp.test_account("Admin")
    c1 = Escrow(alice.address, sp.tez(50), bob.address, sp.tez(4), sp.timestamp(123), hashSecret, admin.address)
    scenario += c1
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    scenario.h3("Erronous secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223343"))    .run(sender = bob, valid = False)
    scenario.h3("Correct secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob)

sp.add_compilation_target("escrow", Escrow(sp.address("tz1cqPT2LkjD8LhXMiW8fKzFTkqTUrcgznNN"), sp.tez(50),
                                           sp.address("tz1UbYuXW4sAczjvMzrgTM96vp2NHhsxqu77"), sp.tez(4),
                                           sp.timestamp(1712479881), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e"),
                                           sp.address("tz1cftYcJt2rQydsbCDCP19zTpqeztLauFBM")))
