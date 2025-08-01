# AIDAO Nexus - AI-DAO Voting Insight Platform

## Overview

**AIDAO Nexus** is an AI-powered decentralized voting platform that transforms global news and hot topics into on-chain survey questions. It enables DAO members to vote on AI-curated questions and earn token rewards for their participation. The platform generates valuable community sentiment insights in real-time, which can serve as a key resource for research institutes, investment firms, and financial organizations.

### Key Features

- 🔍 **AI-curated daily survey questions** based on global news (finance, crypto, geopolitics, etc.)
- 🗳️ **On-chain voting** via Solana smart contracts using Anchor framework
- 🎁 **Token incentives** to encourage community participation
- 📈 **Live analytics and insights** from user voting data
- 🔐 **Role-based access control** (admin and voter)
- 🌍 **Global accessibility** with Phantom wallet support

---

## Context

In times of global uncertainty—wars, financial crises, and volatile crypto markets—real-time public sentiment becomes invaluable. Financial institutions, startups, and researchers often struggle to access clean, timely, and decentralized data reflecting the voice of the masses.

**AIDAO Nexus** addresses this need by combining AI and blockchain. It ensures that the latest, relevant global topics are automatically converted into structured questions for the DAO community to vote on. The system guarantees:
- **Transparency** (on-chain data),
- **Speed** (automated AI data pipeline),
- **Incentivization** (rewarded participation), and
- **Global reach** (web3 compatibility).

---

## System Architecture

### 1. **Smart Contract Layer**
- **Chain**: Solana
- **Language**: Rust
- **Framework**: Anchor
- **Responsibilities**:
  - Create and store questions on-chain
  - Allow users to vote on questions
  - Enforce role-based permissions
  - Retrieve voting results and metadata

### 2. **AI Backend**
- **Responsibilities**:
  - Scrape and analyze hot topics from reliable news sources
  - Generate multiple-choice survey questions
  - Allow admin review and adjustment
  - Interact with Solana smart contract to publish questions on-chain

### 3. **Frontend**
- **Tech Stack**: React.js, Chakra UI
- **Features**:
  - Connect Phantom wallet
  - Auto-detect user role (Admin / Voter)
  - Redirect to Admin Panel or Voting Interface
  - Display live voting stats and question details

---

## Value Proposition

- 📊 **Clean, real-time sentiment data** on global issues  
- 🌐 **Decentralized access** to community opinion worldwide  
- 🤖 **Automated question generation** through AI pipelines  
- 🔁 **On-chain transparency** with verifiable results  
- 🏦 **Insightful datasets** for financial, academic, and media sectors  

---

## Team - A-Squad

| Name                  | GitHub / Handle    | Discord              |
|-----------------------|--------------------|----------------------|
| Trương Nguyên Minh    | `minh47857`        | `minh47857`          |
| Đoàn Xuân Công Đạt    | `CptDat9`          | `datt9355`           |
| Nguyễn Lương Uy       | `uy1302`           | `dung_0808`          |
| Đỗ Đình Nam           | `Sakana186`        | `con_ca_can_cap`     |

---

## Getting Started (Coming Soon)

We will soon publish setup instructions for:
- Running the smart contract locally with Anchor
- Interacting with the contract using CLI scripts
- Starting the React frontend
- Running the AI backend and admin dashboard

---

## License

MIT License

---

> AIDAO Nexus – Your gateway to real-time, decentralized public opinion powered by AI and Web3.
