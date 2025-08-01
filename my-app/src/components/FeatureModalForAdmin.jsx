import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import CreateQuest from "./AdminFeatures/CreateQuest";
import EndQuest from "./AdminFeatures/EndQuest";
import ViewQuestion from "./AdminFeatures/ViewQuestion";
import ViewTotalVotes from "./AdminFeatures/ViewTotalVotes";

const FeatureModalForAdmin = ({ featureId, onClose }) => {
  const renderFeatureContent = () => {
    switch (featureId) {
      case "createQuest":
        return <CreateQuest />;
      case "endQuest":
        return <EndQuest />;
      case "viewQuestion":
        return <ViewQuestion />;
      case "viewTotalVotes":
        return <ViewTotalVotes />;
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

export default FeatureModalForAdmin;