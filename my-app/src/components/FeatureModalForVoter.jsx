import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from "@chakra-ui/react";
import VoteQuestion from "./VoterFeatures/VoteQuestion";
import ClaimReward from "./VoterFeatures/ClaimReward";
import ViewQuestion from "./VoterFeatures/ViewQuestion";
import ViewAllActiveQuestions from "./VoterFeatures/ViewAllActiveQuestions";

const FeatureModalForVoter = ({ featureId, onClose }) => {
  const renderFeatureContent = () => {
    switch (featureId) {
      case "voteQuestion":
        return <VoteQuestion />;
      case "claimReward":
        return <ClaimReward />;
      case "viewQuestion":
        return <ViewQuestion />;
      case "viewAllActiveQuestions":
        return <ViewAllActiveQuestions />;
      default:
        return <p>Unknown feature.</p>;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Feature Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderFeatureContent()}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeatureModalForVoter;