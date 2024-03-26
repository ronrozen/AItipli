"use client"

import React, { useRef, useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Spacer, Button } from "@nextui-org/react";
import { retrieveDocuments, uploadDocument, removeDocument } from "@/managers/documentsManager"
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import ErrorModal from "@/app/modals/errorModal";

import {
	TrashIcon
} from "@heroicons/react/24/outline";

interface DocumentRow {
	id: number;
	documentname: string;
}

interface Column {
	key: string;
	name: string;
}

const columns: Column[] = [
	{ key: "documentname", name: "NAME" },
	{ key: "actions", name: "" }
];

export default function DocumentsPage() {
	const router = useRouter()
	const { isAuthenticated: isAuthenticatedClient } = useAuth();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [documents, setDocuments] = useState<DocumentRow[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorModalMessage, setErrorModalMessage] = useState('');

	// Simulate fetching documents from an API
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			const user_documents = await retrieveDocuments()
			setDocuments(user_documents);
			setIsLoading(false)
		};

		if (!isAuthenticatedClient) {
			router.push('/')
		} else {
			fetchData()
		}
	}, []);

	// Function to simulate click on file input when "Upload Document" is clicked
	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	// Function to handle file selection
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (file) {
			try {
				setIsLoading(true)
				console.log("File selected:", file.name);
				const uploadedDocument = await uploadDocument(file);
				if (uploadedDocument) {
					// Assuming `uploadedDocument` contains the `id` and `documentname`
					setDocuments(currentDocuments => [...currentDocuments, {
						id: uploadedDocument.id, // Ensure this matches your actual response structure
						documentname: uploadedDocument.documentname // Ensure this matches your actual response structure
					}]);
					setIsLoading(false)
				}
			} catch (e) {
				setIsLoading(false)
				const error = e as any;
				if (error.response) {
					console.log(error.response.data.response)
					setErrorModalMessage(error.response.data.response)
					setIsErrorModalOpen(true);
				}
			}

		}
	};

	const renderCell = (item: DocumentRow, columnKey: keyof DocumentRow | 'actions') => {
		if (columnKey === "documentname") {
			return <span>{item.documentname}</span>;
		} else if (columnKey === "actions") {
			return (
				<div style={{ textAlign: 'right' }}>
					<Button
						variant="light"
						color="danger"
						size="sm"
						onClick={async () => {
							setIsLoading(true)
							const success = await removeDocument(item.documentname);
							if (success) {
								setDocuments(currentDocuments => currentDocuments.filter(doc => doc.documentname !== item.documentname));
								setIsLoading(false)
							}
						}}
					>
						<TrashIcon width={18} color="danger" />
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
				<h1 className="text-3xl font-bold">All Documents</h1>
				<Button color="success" style={{ color: "white" }} size="sm" onClick={handleUploadClick}>
					Upload Document
				</Button>
				<input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={async (file) => await handleFileChange(file)} />
			</div>
			<Spacer y={8} />
			<Table aria-label="Example table with custom cells">
				<TableHeader columns={columns}>
					{(column: Column) => ( // Use the Column interface here
						<TableColumn key={column.key}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={documents}>
					{(item: DocumentRow) => (
						<TableRow key={item.id.toString()}>
							{columns.map((column) => (
								<TableCell key={column.key}>{renderCell(item, column.key as keyof DocumentRow | "actions")}</TableCell>
							))}
						</TableRow>
					)}
				</TableBody>
			</Table>

			<ErrorModal
				isOpen={isErrorModalOpen}
				onClose={() => setIsErrorModalOpen(false)}
				message={errorModalMessage}
			/>
		</div>
	);
}
