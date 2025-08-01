import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from "@chakra-ui/react";
import VoteQuestion from "./VoterFeatures/VoteQuestion";
import ClaimReward from "./VoterFeatures/ClaimReward";
import ViewQuestion from "./AdminFeatures/ViewQuestion";

const FeatureModalForVoter = ({ featureId, onClose }) => {
  const renderFeatureContent = () => {
    switch (featureId) {
      case "voteQuestion":
        return <VoteQuestion />;
      case "claimReward":
        return <ClaimReward />;
      case "viewQuestion":
        return <ViewQuestion />;
      default:
        return <p>Chức năng không xác định.</p>;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết Tính Năng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderFeatureContent()}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeatureModalForVoter;