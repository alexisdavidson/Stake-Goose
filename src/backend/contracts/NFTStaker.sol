// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTStaker is ERC721Holder, ReentrancyGuard, Ownable {
    ERC721A public parentNFT;
    ERC721A public beanNFT;
    ERC20 public taleToken;
    address public wolfAddress;

    // Staker must be structured this way because of the important function getStakedTokens() below that returns the tokenIds array directly.
    struct Staker { 
        uint256[] tokenIds;
        uint256[] timestampStarts;
        uint256[] durations; // 0 to 2 from durations array
        bool[] taleflyUsed;
    }

    struct Duration {
        uint256 daysCount;
        uint256 taleflyCount;
        uint256 rewardCount;
    }

    Duration[3] public durations;
    mapping(uint256 => address) public tokenFed; // Tracks who was the last address to feed the goose
    mapping(address => Staker) private stakers;
    
    event StakeSuccessful(
        address user,
        uint256 tokenId,
        uint256 timestamp
    );
    
    event UnstakeSuccessful(
        address user,
        uint256 tokenId,
        uint256 reward
    );
    
    event FeedSuccessful(
        address user,
        uint256 tokenId
    );

    constructor(address _nftAddress, address _beanAddress, address _wolfAddress) {
        parentNFT = ERC721A(_nftAddress);
        beanNFT = ERC721A(_beanAddress);
        wolfAddress = _wolfAddress;

        durations[0] = Duration(7, 5, 7); // 7 Days, 5 Talefly, 7 Eggs
        durations[1] = Duration(30, 15, 35); // 30 Days, 15 Talefly, 35 Eggs
        durations[2] = Duration(60, 25, 80); // 60 Days, 25 Talefly, 80 Eggs
    }

    function setTokenAddress(address _tokenAddress) external onlyOwner {
        taleToken = ERC20(_tokenAddress);
    }

    function stake(uint256 _tokenId, uint256 _duration, bool _useTalefly) public nonReentrant {
        require(parentNFT.ownerOf(_tokenId) == msg.sender, "You do not own this NFT.");
        require(_duration >= 0 && _duration < 3, "Invalid duration.");

        if (_useTalefly) {
            require(taleToken.balanceOf(msg.sender) >= durations[_duration].taleflyCount, "You do not own enough tale tokens.");
            
            if (taleToken.transferFrom(msg.sender, address(this), durations[_duration].taleflyCount) == true) {
                parentNFT.safeTransferFrom(msg.sender, address(this), _tokenId);
            } else revert();
        }
        else {
            parentNFT.safeTransferFrom(msg.sender, wolfAddress, _tokenId);
        }

        stakers[msg.sender].tokenIds.push(_tokenId);
        stakers[msg.sender].timestampStarts.push(block.timestamp);
        stakers[msg.sender].durations.push(_duration);
        stakers[msg.sender].taleflyUsed.push(_useTalefly);

        emit StakeSuccessful(msg.sender, _tokenId, block.timestamp);
    }

    function findIndexForTokenStaker(uint256 _tokenId, address _stakerAddress) private view returns(uint256, bool) {
        Staker memory _staker = stakers[_stakerAddress];

        uint256 _tokenIndex = 0;
        bool _foundIndex = false;
        
        uint256 _tokensLength = _staker.tokenIds.length;
        for(uint256 i = 0; i < _tokensLength; i ++) {
            if (_staker.tokenIds[i] == _tokenId) {
                _tokenIndex = i;
                _foundIndex = true;
                break;
            }
        }

        return (_tokenIndex, _foundIndex);
    }

    function unstake(uint256 _tokenId) public nonReentrant {
        Staker memory _staker = stakers[msg.sender];
        (uint256 _tokenIndex, bool _foundIndex) = findIndexForTokenStaker(_tokenId, msg.sender);
        require(_foundIndex, "Index not found for this staker.");

        require(block.timestamp > _staker.timestampStarts[_tokenIndex] + durations[_staker.durations[_tokenIndex]].daysCount * 86400, 
            "Cannot unstake before the end of the staking duration.");
        require(_staker.taleflyUsed[_tokenIndex], "Cannot unstake eaten goose.");

        parentNFT.safeTransferFrom(address(this), msg.sender, _tokenId);

        uint256 _reward = durations[_staker.durations[_tokenIndex]].rewardCount;
        if (tokenFed[_tokenId] == msg.sender) {
            _reward *= 3;
        }

        if (taleToken.transfer(msg.sender, _reward) == true) {
            removeStakerElement(msg.sender, _tokenIndex);
        } else revert();

        tokenFed[_tokenId] = address(0);
        emit UnstakeSuccessful(msg.sender, _tokenId, _reward);
    }

    function removeStakerElement(address user, uint256 _tokenIndex) internal {
        uint256 _lastIndex = stakers[user].tokenIds.length - 1;
        stakers[user].timestampStarts[_tokenIndex] = stakers[user].timestampStarts[_lastIndex];
        stakers[user].timestampStarts.pop();

        stakers[user].tokenIds[_tokenIndex] = stakers[user].tokenIds[_lastIndex];
        stakers[user].tokenIds.pop();

        stakers[user].durations[_tokenIndex] = stakers[user].durations[_lastIndex];
        stakers[user].durations.pop();

        stakers[user].taleflyUsed[_tokenIndex] = stakers[user].taleflyUsed[_lastIndex];
        stakers[user].taleflyUsed.pop();
    }

    function isTokenStaked(uint256 _tokenId) public view returns(bool) {
        uint256 _tokensLength = stakers[msg.sender].tokenIds.length;
        for(uint256 i = 0; i < _tokensLength; i ++) {
            if (stakers[msg.sender].tokenIds[i] == _tokenId) {
                return true;
            }
        }
        return false;
    }
    
    function getStakedTokens(address _user) public view returns (uint256[] memory) {
        return stakers[_user].tokenIds;
    }
    
    function getStakedTimestamps(address _user) public view returns (uint256[] memory) {
        return stakers[_user].timestampStarts;
    }
    
    function getStakedDurations(address _user) public view returns (uint256[] memory) {
        return stakers[_user].durations;
    }
    
    function getStakedTaleflyUsed(address _user) public view returns (bool[] memory) {
        return stakers[_user].taleflyUsed;
    }

    function withdrawTalefly() public onlyOwner {
        taleToken.transfer(msg.sender, taleToken.balanceOf(address(this)));
    }

    function feedGoose(uint256 _tokenId, uint256 _beanTokenId) public {
        require(parentNFT.ownerOf(_tokenId) == msg.sender, "You do not own this NFT.");
        require(beanNFT.ownerOf(_beanTokenId) == msg.sender, "You do not own this Bean.");
        
        beanNFT.safeTransferFrom(msg.sender, 0x000000000000000000000000000000000000dEaD, _beanTokenId);
        tokenFed[_tokenId] = msg.sender;

        emit FeedSuccessful(msg.sender, _tokenId);
    }
}