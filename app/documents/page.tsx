"use client"

import React, { useRef, useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Spacer, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { retrieveDocuments, uploadDocument, removeDocument, retrieveFolders, newFolder, removeFolder } from "@/managers/documentsManager"
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import ErrorModal from "@/app/modals/errorModal";
import FolderModal from "../modals/folderModal";

import {
	TrashIcon
} from "@heroicons/react/24/outline";

interface DocumentRow {
	id: number;
	documentname: string;
}

interface FolderRow {
	id: number;
	name: string;
}

interface Column {
	key: string;
	name: string;
}

const documentsColumns: Column[] = [
	{ key: "documentname", name: "NAME" },
	{ key: "actions", name: "" }
];

const foldersColumns: Column[] = [
	{ key: "name", name: "NAME" },
	{ key: "actions", name: "" }
];

export default function DocumentsPage() {
	const router = useRouter()
	const { isAuthenticated: isAuthenticatedClient } = useAuth();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [folders, setFolders] = useState<FolderRow[]>([]);
	const [documents, setDocuments] = useState<DocumentRow[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorModalMessage, setErrorModalMessage] = useState('');
	const [showFolders, setShowFolders] = useState(true);
	const [selectedFolder, setSelectedFolder] = useState<FolderRow>();

	// Simulate fetching documents from an API
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			const user_folders = await retrieveFolders()
			setFolders(user_folders);
			setIsLoading(false)
		};

		if (!isAuthenticatedClient) {
			router.push('/')
		} else {
			fetchData()
		}
	}, []);

	const handleNewFolder = async (name: string) => {
		setIsFolderModalOpen(false)
		setIsLoading(true)
		const new_folder = await newFolder(name)
		setFolders(currentFolders => [...currentFolders, {
			id: new_folder.id, // Ensure this matches your actual response structure
			name: new_folder.name // Ensure this matches your actual response structure
		}]);
		setIsLoading(false)
	};

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
				const uploadedDocument = await uploadDocument(file, selectedFolder.id)
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

	const renderDocumentsCell = (item: DocumentRow, columnKey: keyof DocumentRow | 'actions') => {
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

	const renderFoldersCell = (item: FolderRow, columnKey: keyof FolderRow | 'actions') => {
		if (columnKey === "name") {
			return <span>{item.name}</span>;
		} else if (columnKey === "actions") {
			return (
				<div style={{ textAlign: 'right' }}>
					<Button
						variant="light"
						color="danger"
						size="sm"
						onClick={async () => {
							setIsLoading(true)
							const success = await removeFolder(item.id);
							if (success) {
								setFolders(currentFolders => currentFolders.filter(folder => folder.id !== item.id));
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
				<div>
					{showFolders && <h1 className="text-3xl font-bold">All Folders</h1>}
					{
						!showFolders &&
						<>
							<h1 className="text-3xl font-bold">All Documents</h1>
							<Breadcrumbs className="mt-4">
								<BreadcrumbItem onClick={() => {
									setSelectedFolder(undefined)
									setShowFolders(true)
								}}>All folders</BreadcrumbItem>
								<BreadcrumbItem>{selectedFolder?.name}</BreadcrumbItem>
							</Breadcrumbs>
						</>

					}
				</div>
				{
					showFolders ?
						<>
							<Button color="success" style={{ color: "white" }} size="sm" onClick={() => setIsFolderModalOpen(true)}>
								New Folder
							</Button>
						</>
						:
						<>
							<Button color="success" style={{ color: "white" }} size="sm" onClick={handleUploadClick}>
								Upload Document
							</Button>
							<input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={async (file) => await handleFileChange(file)} />
						</>
				}

			</div>
			<Spacer y={8} />

			{
				showFolders ?
					<Table aria-label="Documents table" selectionMode="single">
						<TableHeader columns={foldersColumns}>
							{(column: Column) => ( // Use the Column interface here
								<TableColumn key={column.key}>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody items={folders}>
							{(item: FolderRow) => (
								<TableRow
									key={item.id.toString()}
									onClick={async () => {
										setIsLoading(true)
										setSelectedFolder(item)
										const user_documents = await retrieveDocuments(item.id)
										setDocuments(user_documents);
										setShowFolders(false)
										setIsLoading(false)
									}}
								>
									{foldersColumns.map((column) => (
										<TableCell key={column.key}>{renderFoldersCell(item, column.key as keyof FolderRow | "actions")}</TableCell>
									))}
								</TableRow>
							)}
						</TableBody>
					</Table>
					:
					<Table aria-label="Documents table">
						<TableHeader columns={documentsColumns}>
							{(column: Column) => ( // Use the Column interface here
								<TableColumn key={column.key}>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody items={documents}>
							{(item: DocumentRow) => (
								<TableRow key={item.id.toString()}>
									{documentsColumns.map((column) => (
										<TableCell key={column.key}>{renderDocumentsCell(item, column.key as keyof DocumentRow | "actions")}</TableCell>
									))}
								</TableRow>
							)}
						</TableBody>
					</Table>
			}

			<FolderModal
				isOpen={isFolderModalOpen}
				onClose={() => setIsFolderModalOpen(false)}
				onSuccess={async (name) => {
					await handleNewFolder(name)
				}}
			/>


			<ErrorModal
				isOpen={isErrorModalOpen}
				onClose={() => setIsErrorModalOpen(false)}
				message={errorModalMessage}
			/>
		</div>
	);
}
