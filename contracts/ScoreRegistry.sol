// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ScoreRegistry {
    // Event emitted when a new score is recorded
    event ScoreMinted(address indexed player, uint8 score, uint256 timestamp);

    // Mapping from player address to their highest score
    mapping(address => uint8) public highestScores;
    
    // Mapping from player address to their total games played
    mapping(address => uint256) public gamesPlayed;

    // Mint a new score to the blockchain
    function mintScore(uint8 score) external {
        require(score <= 10, "Score cannot be greater than 10");

        gamesPlayed[msg.sender]++;

        // Update highest score if this score is better
        if (score > highestScores[msg.sender]) {
            highestScores[msg.sender] = score;
        }

        emit ScoreMinted(msg.sender, score, block.timestamp);
    }

    // Get stats for a specific player
    function getPlayerStats(address player) external view returns (uint8 bestScore, uint256 totalGames) {
        return (highestScores[player], gamesPlayed[player]);
    }
}
