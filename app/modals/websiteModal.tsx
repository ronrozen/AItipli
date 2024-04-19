"use client"

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (url: string) => void;
}

const WebsiteModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [url, setUrl] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="modal-header justify-center"><h1 style={{ fontSize: "26px", textAlign: "center", justifyContent: "center" }}>New Website</h1></ModalHeader>
                <ModalBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Input
                        value={url}
                        onChange={e => {
                            setUrl(e.target.value)
                        }}
                        fullWidth
                        label="Enter the URL of the website (i.e. https://)"
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
                            onSuccess(url)
                        }}>
                        Add Website
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default WebsiteModal;

