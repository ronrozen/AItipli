"use client"

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Spacer, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { getColleges, resetPassword, getUser, createCollege } from "@/managers/userManager"
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import ErrorModal from "@/app/modals/errorModal";

import PasswordModal from "../modals/passwordModal";
import CollegeModal from "../modals/collegeModal";

interface UserRow {
    id: number;
    email: string;
}

interface Column {
    key: string;
    name: string;
}

const columns: Column[] = [
    { key: "email", name: "EMAIL" },
    { key: "actions", name: "" }
];

export default function CollegesPage() {
    const router = useRouter()
    const { isAuthenticated: isAuthenticatedClient } = useAuth();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedEmail, setSelectedEmail] = useState('');

    const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');

    // Simulate fetching documents from an API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const all_users = await getColleges()
            setUsers(all_users);
            setIsLoading(false)

            const user = await getUser()
            if (user.role != 'admin') {
                window.location.href = '/settings'
            }
        };

        if (!isAuthenticatedClient) {
            router.push('/')
        } else {
            fetchData()
        }
    }, []);


    const renderCell = (item: UserRow, columnKey: keyof UserRow | 'actions') => {
        if (columnKey === "email") {
            return (
                <div className="flex items-center">{item.email}</div>
            );
        }
        else if (columnKey === "actions") {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        onClick={async () => {
                            setSelectedEmail(item.email)
                            setIsPasswordModalOpen(true)
                        }}
                    >
                        Reset Password
                    </Button>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div style={{ marginTop: "10%" }} className="text-center items-center align-center">
                <Spinner color="success" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">All Colleges</h1>
                </div>
                <Button color="success" style={{ color: "white" }} size="sm" onClick={() => {
                    setIsCollegeModalOpen(true)
                }}>
                    New College
                </Button>

            </div >
            <Spacer y={8} />

            <Table aria-label="Documents table" selectionMode="single">
                <TableHeader columns={columns}>
                    {(column: Column) => ( // Use the Column interface here
                        <TableColumn key={column.key}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={users}>
                    {(item: UserRow) => (
                        <TableRow
                            key={item.id.toString()}
                        >
                            {columns.map((column) => (
                                <TableCell key={column.key}>{renderCell(item, column.key as keyof UserRow | "actions")}</TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <CollegeModal
                isOpen={isCollegeModalOpen}
                onClose={() => setIsCollegeModalOpen(false)}
                onSuccess={async (email, password) => {
                    setIsCollegeModalOpen(false)
                    setIsLoading(true)
                    const response = await createCollege(email, password)
                    const newCollege = { email: email, id: response.id };
                    setUsers(prevUsers => [...prevUsers, newCollege]);
                    setIsLoading(false)
                }}
            />

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSuccess={async (password) => {
                    setIsPasswordModalOpen(false)
                    setIsLoading(true)
                    await resetPassword(selectedEmail, password)
                    setIsLoading(false)
                }}
            />

            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                message={errorModalMessage}
            />
        </div >
    );
}
