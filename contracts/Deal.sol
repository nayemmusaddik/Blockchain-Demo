pragma solidity ^0.5.0;

contract Deal {
    address[16] public buyers;


// Buying a car
function buy(uint carId) public payable returns (uint) {
  require(carId >= 0 && carId <= 15);
  buyers[carId] = msg.sender;  
  return carId;
}

// Retrieving the buyers
function getBuyers() public view returns (address[16] memory) {
  return buyers;
}

function pay() public payable {
}

}