// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Create {
    using Counters for Counters.Counter;
    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;
    address public votingOrganizer;

    // Candidate structure
    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    event CandidateCreate(
        uint256 indexed candidateId,
        string age,
        string name,
        string image,
        uint256 voteCount,
        address _address,
        string ipfs
    );

    address[] public candidateAddress;
    mapping(address => Candidate) public candidates;

    // Voter structure
    struct Voter {
        uint256 voterId;
        string name;
        string image;
        address voterAddress;
        uint256 allowed;
        bool voted;
        uint256 vote;
        string ipfs;
    }

    event VoterCreated(
        uint256 indexed voterId,
        string name,
        string image,
        address voterAddress,
        uint256 allowed,
        bool voted,
        uint256 vote,
        string ipfs
    );

    address[] public votedVoters;
    address[] public voterAddress;
    mapping(address => Voter) public voters;

    // Constructor
    constructor() {
        votingOrganizer = msg.sender;
    }

    // Candidate functions
    function setCandidate(
        address _address,
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(votingOrganizer == msg.sender, "Only registered organizer can add");

        _candidateId.increment();
        uint256 idNumber = _candidateId.current();

        Candidate storage candidate = candidates[_address];
        candidate.age = _age;
        candidate.name = _name;
        candidate.image = _image;
        candidate.candidateId = idNumber;
        candidate.voteCount = 0;
        candidate.ipfs = _ipfs;
        candidate._address = _address;

        candidateAddress.push(_address);

        emit CandidateCreate(
            idNumber,
            _age,
            _name,
            _image,
            candidate.voteCount,
            _address,
            _ipfs
        );
    }

    function getCandidate() public view returns (address[] memory) {
        return candidateAddress;
    }

    function getCandidateLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    function getCandidateData(address _address) public view returns (
        string memory,
        string memory,
        uint256,
        string memory,
        uint256,
        address,
        string memory
    ) {
        Candidate memory candidate = candidates[_address];
        return (
            candidate.name,
            candidate.image,
            candidate.candidateId,
            candidate.age,
            candidate.voteCount,
            candidate._address,
            candidate.ipfs
        );
    }

    // Voter functions
    function voterRight(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(votingOrganizer == msg.sender, "Only registered organizer can add voter");

        _voterId.increment();
        uint256 idNumber = _voterId.current();

        Voter storage voter = voters[_address];
        require(voter.allowed == 0, "Voter already allowed");

        voter.allowed = 1;
        voter.name = _name;
        voter.image = _image;
        voter.voterAddress = _address;
        voter.voterId = idNumber;
        voter.vote = 1000;
        voter.voted = false;
        voter.ipfs = _ipfs;

        voterAddress.push(_address);

        emit VoterCreated(
            idNumber,
            _name,
            _image,
            _address,
            voter.allowed,
            voter.voted,
            voter.vote,
            _ipfs
        );
    }

    function vote(address _candidateAddress, uint256 _candidateVoteId) external {
        Voter storage voter = voters[msg.sender];
        require(!voter.voted, "You have already voted");
        require(voter.allowed != 0, "You can't vote");

        voter.voted = true;
        voter.vote = _candidateVoteId;
        votedVoters.push(msg.sender);
        candidates[_candidateAddress].voteCount += voter.allowed;
    }

    function getVoterLength() public view returns (uint256) {
        return voterAddress.length;
    }

    function getVoterData(address _address) public view returns (
        uint256,
        string memory,
        string memory,
        address,
        string memory,
        uint256,
        bool
    ) {
        Voter memory voter = voters[_address];
        return (
            voter.voterId,
            voter.name,
            voter.image,
            voter.voterAddress,
            voter.ipfs,
            voter.allowed,
            voter.voted
        );
    }

    function getVotedVoterList() public view returns (address[] memory) {
        return votedVoters;
    }

    function getVoterList() public view returns (address[] memory) {
        return voterAddress;
    }
}
