"use client"

import React, { useMemo, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface CollegeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (email: string, password: string) => void;
}

const CollegeModal: React.FC<CollegeModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [collegeEmail, setCollegeEmail] = useState('');
    const [collegePassword, setCollegePassword] = useState('');

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const isInvalidPassword = useMemo(() => collegePassword === "" ? null : !validatePassword(collegePassword), [collegePassword]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="modal-header justify-center"><h1 style={{ fontSize: "26px", textAlign: "center", justifyContent: "center" }}>New College</h1></ModalHeader>
                <ModalBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className='flex flex-col w-full'>
                        <Input
                            value={collegeEmail}
                            onChange={e => {
                                setCollegeEmail(e.target.value)
                            }}
                            fullWidth
                            label="Enter the college email"
                            type="email"
                            isRequired
                            size='sm'
                            radius='lg'
                            variant="bordered"
                        />
                        <Input
                            value={collegePassword}
                            onChange={e => {
                                setCollegePassword(e.target.value)
                            }}
                            fullWidth
                            label="Enter the college password"
                            type="password"
                            isRequired
                            size='sm'
                            radius='lg'
                            variant="bordered"
                            className='mt-4'
                            isInvalid={isInvalidPassword == null ? undefined : isInvalidPassword}
                            errorMessage={isInvalidPassword && "Password must be at least 8 characters long with 1 capital letter and 1 number"}
                            color={isInvalidPassword == null ? undefined : (isInvalidPassword ? "danger" : "success")}
                        />
                    </div>

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
                            onSuccess(collegeEmail, collegePassword)
                        }}>
                        Save College
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CollegeModal;

