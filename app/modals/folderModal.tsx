"use client"

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (name: string) => void;
}

const FolderModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [folderName, setFolderName] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="modal-header justify-center"><h1 style={{ fontSize: "26px", textAlign: "center", justifyContent: "center" }}>New Folder</h1></ModalHeader>
                <ModalBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Input
                        value={folderName}
                        onChange={e => {
                            setFolderName(e.target.value)
                        }}
                        fullWidth
                        label="Enter the new name"
                        type="text"
                        isRequired
                        size='sm'
                        radius='lg'
                        variant="bordered"
                    //className='mt-16'
                    />
                </ModalBody>
                <ModalFooter className="mt-4 mb-2 justify-center">
                    <Button
                        fullWidth
                        color="danger"
                        variant='ghost'
                        onPress={() => {
                            onClose()
                        }}>
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        color="success"
                        style={{ color: "white" }}
                        onPress={() => {
                            onSuccess(folderName)
                        }}>
                        Create Folder
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default FolderModal;

