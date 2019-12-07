pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Deal.sol";

contract TestAdoption {
 // The address of the Deal contract to be tested
 Deal deal = Deal(DeployedAddresses.Deal());

 // The id of the car that will be used for testing
 uint expectedCarId = 8;

 //The expected owner of car is this contract
 address expectedBuyer = address(this);

 // Testing the buy() function
function testUserCanBuyCar() public {
  uint returnedId = deal.buy(expectedCarId);

  Assert.equal(returnedId, expectedCarId, "Adoption of the expected pet should match what is returned.");
}

// Testing retrieval of a single car owner
function testGetBuyerAddressByCarId() public {
  address buyer = deal.buyers(expectedCarId);

  Assert.equal(buyer, expectedBuyer, "Owner of the expected pet should be this contract");
}

// Testing retrieval of all car owners
function testGetBuyerAddressByCarIdInArray() public {
  // Store buyers in memory rather than contract's storage
  address[16] memory buyers = deal.getBuyers();

  Assert.equal(buyers[expectedCarId], expectedBuyer, "Owner of the expected pet should be this contract");
}

}