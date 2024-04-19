"use client"

import React, { useRef, useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Spacer, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { retrieveDocuments, uploadDocument, removeDocument, retrieveFolders, newFolder, removeFolder, scrapeWebsite } from "@/managers/documentsManager"
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';

import WebsiteModal from "../modals/websiteModal";
import ErrorModal from "@/app/modals/errorModal";
import FolderModal from "../modals/folderModal";

import {
	TrashIcon
} from "@heroicons/react/24/outline";

interface DocumentRow {
	id: number;
	documentname: string;
	isUploading: boolean;
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

export default function KnowledgePage() {
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
	const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);

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
		if (event.target.files && event.target.files.length > 0) {
			const files = Array.from(event.target.files);

			// Immediately add files to the state with isUploading = true
			const newDocuments = files.map((file, index) => ({
				id: -Math.random(), // Temporary negative ID; replace with real ID after upload
				documentname: file.name,
				isUploading: true
			}));

			setDocuments(currentDocuments => [...currentDocuments, ...newDocuments]);

			// Upload files
			files.forEach((file, index) => {
				uploadDocument(file, selectedFolder?.id || 0)
					.then(uploadedDocument => {
						// Update the document to reflect it has been uploaded
						setDocuments(currentDocuments =>
							currentDocuments.map(doc =>
								doc.documentname === file.name ? { ...uploadedDocument, isUploading: false } : doc
							)
						);
					})
					.catch(error => {
						console.error("Error uploading file:", error);
						// Optionally remove the document or indicate an error state
					});
			});
		}
	};

	const renderDocumentsCell = (item: DocumentRow, columnKey: keyof DocumentRow | 'actions') => {
		if (columnKey === "documentname") {
			return (
				<div className="flex items-center">
					<span>{item.documentname}</span>
					{item.isUploading && <Spinner size="sm" className="ml-2" color="success" />}
				</div>
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
							<h1 className="text-3xl font-bold">Your Knowledge Base</h1>
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
							<div className="flex gap-2">
								<>
									<Button color="success" style={{ color: "white" }} size="sm" onClick={handleUploadClick}>
										Upload Document
									</Button>
									<input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} multiple />
								</>
								<Button color="success" variant="ghost" size="sm" onClick={() => {
									setIsWebsiteModalOpen(true)
								}}>
									Add Website
								</Button>
							</div>


						</>
				}

			</div >
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
									className="cursor-pointer"
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

			<WebsiteModal
				isOpen={isWebsiteModalOpen}
				onClose={() => setIsWebsiteModalOpen(false)}
				onSuccess={async (url) => {
					setIsWebsiteModalOpen(false)

					const newDocuments = documents.map((file, index) => ({
						id: -Math.random(), // Temporary negative ID; replace with real ID after upload
						documentname: url,
						isUploading: true
					}));

					setDocuments(currentDocuments => [...currentDocuments, ...newDocuments]);

					const uploadedDocument = await scrapeWebsite(url, selectedFolder?.id)

					setDocuments(currentDocuments =>
						currentDocuments.map(doc =>
							doc.documentname === url ? { ...uploadedDocument, isUploading: false } : doc
						)
					);
				}}
			/>

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
		</div >
	);
}
