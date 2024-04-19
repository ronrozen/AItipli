"use client"

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Spinner, Spacer, Button, Divider, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import ErrorModal from "@/app/modals/errorModal";

import { createChatbot, getChatbot, updateChatbot } from "@/managers/chatbotManager"

const models = [
    {
        value: 'gpt-3.5-turbo'
    },
    {
        value: 'gpt-4-0125-preview'
    }
]

const knowledge_type = [
    {
        value: 'doc',
        label: 'Only documents'
    },
    {
        value: 'web',
        label: 'Only websites'
    },
    {
        value: 'both',
        label: 'Documents and websites'
    }
]

export default function SettingsPage() {
    const router = useRouter()
    const { isAuthenticated: isAuthenticatedClient } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');

    const [chatbotId, setChatbotId] = useState('');
    const [openAIKey, setOpenAIKey] = useState('');
    const [model, setModel] = useState('');
    const [prompt, setPrompt] = useState('');
    const [knowledgeType, setKnowledgeType] = useState('');
    const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
    const [presencePenalty, setPresencePenalty] = useState(0.0);
    const [temperature, setTemperature] = useState(0.0);
    const [matchThreshold, setMatchThreshold] = useState(0.0);
    const [matchCount, setMatchCount] = useState(0.0);

    // Simulate fetching documents from an API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const result = await getChatbot()
                console.log(result)
                setChatbotId(result.id)
                setModel(result.model)
                setPrompt(result.prompt)
                setFrequencyPenalty(result.frequency_penalty)
                setPresencePenalty(result.presence_penalty)
                setTemperature(result.temperature)
                setOpenAIKey(result.open_ai_key)
                setMatchThreshold(result.match_threshold)
                setMatchCount(result.match_count)
                setKnowledgeType(result.doc_type)
                setIsLoading(false)
            } catch (e) {
                setIsLoading(false)
            }
        };

        if (!isAuthenticatedClient) {
            router.push('/')
        } else {
            fetchData()
        }
    }, []);

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
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>
                {
                    !chatbotId &&
                    <Button color="success" style={{ color: "white" }} size="sm" onClick={async () => {
                        setIsLoading(true)
                        const result = await createChatbot()
                        console.log(result[0])
                        setChatbotId(result[0].id)
                        setModel(result[0].model)
                        setPrompt(result[0].prompt)
                        setMatchThreshold(result[0].match_threshold)
                        setMatchCount(result[0].match_count)
                        setIsLoading(false)
                    }}>
                        New Chatbot
                    </Button>
                }
            </div >
            <Spacer y={8} />
            {
                chatbotId &&
                <Card>
                    <CardHeader>
                        <p className="text-md">Chatbot</p>
                    </CardHeader>
                    <Spacer y={4} />
                    <Divider />
                    <Spacer y={4} />
                    <CardBody>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input
                                isRequired
                                value={openAIKey}
                                onChange={e => {
                                    setOpenAIKey(e.target.value);
                                }}
                                fullWidth
                                label="Open AI Key"
                                type="text"
                                size='sm'
                                radius='lg'
                                variant="bordered"
                            />
                            <Select
                                isRequired
                                size="sm"
                                label="Model"
                                placeholder="Select a model"
                                defaultSelectedKeys={[model]}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setModel(e.target.value)
                                }}
                            >
                                {models.map((ai_model) => (
                                    <SelectItem key={ai_model.value} value={ai_model.value}>
                                        {ai_model.value}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <Spacer y={4} />
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Textarea
                                isRequired
                                label="Prompt"
                                value={prompt}
                                onChange={e => {
                                    setPrompt(e.target.value)
                                }}
                            />
                        </div>
                        <Spacer y={4} />
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input
                                value={frequencyPenalty?.toString()}
                                onChange={e => {
                                    const newValue = parseFloat(e.target.value);
                                    if (!isNaN(newValue)) {
                                        setFrequencyPenalty(newValue);
                                    } else {
                                        setFrequencyPenalty(0);
                                    }
                                }}
                                fullWidth
                                label="Frequency penalty"
                                type="number"
                                size='sm'
                                radius='lg'
                                variant="bordered"
                            />

                            <Input
                                value={presencePenalty?.toString()}
                                onChange={e => {
                                    const newValue = parseFloat(e.target.value);
                                    if (!isNaN(newValue)) {
                                        setPresencePenalty(newValue);
                                    } else {
                                        setPresencePenalty(0);
                                    }
                                }}
                                fullWidth
                                label="Presence penalty"
                                type="number"
                                size='sm'
                                radius='lg'
                                variant="bordered"
                            />

                            <Input
                                value={temperature?.toString()}
                                onChange={e => {
                                    const newValue = parseFloat(e.target.value);
                                    if (!isNaN(newValue)) {
                                        setTemperature(newValue);
                                    } else {
                                        setTemperature(0);
                                    }
                                }}
                                fullWidth
                                label="Temperature"
                                type="number"
                                size='sm'
                                radius='lg'
                                variant="bordered"
                            />

                        </div>
                        <Spacer y={8} />
                        <p className="text-md">Knowledge Base</p>
                        <Spacer y={4} />
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Select
                                isRequired
                                size="sm"
                                label="Knowledge Type"
                                placeholder="Select knowledge type"
                                defaultSelectedKeys={[knowledgeType]}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setKnowledgeType(e.target.value)
                                }}
                            >
                                {knowledge_type.map((kb_type) => (
                                    <SelectItem key={kb_type.value} value={kb_type.value}>
                                        {kb_type.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <Spacer y={4} />
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input
                                value={matchThreshold?.toString()}
                                onChange={e => {
                                    const newValue = parseFloat(e.target.value);
                                    if (!isNaN(newValue)) {
                                        setMatchThreshold(newValue);
                                    } else {
                                        setMatchThreshold(0);
                                    }
                                }}
                                fullWidth
                                label="Match Threshold"
                                type="number"
                                size='sm'
                                radius='lg'
                                variant="bordered"
                            />
                            <Input
                                value={matchCount?.toString()}
                                onChange={e => {
                                    const newValue = parseFloat(e.target.value);
                                    if (!isNaN(newValue)) {
                                        setMatchCount(newValue);
                                    } else {
                                        setMatchCount(0);
                                    }
                                }}
                                fullWidth
                                label="Match Count"
                                type="number"
                                size='sm'
                                radius='lg'
                                variant="bordered"
                            />
                        </div>
                    </CardBody>
                    <Spacer y={8} />
                    <Divider />
                    <Spacer y={8} />
                    <CardFooter>
                        <Button
                            isDisabled={!openAIKey || !prompt || !model}
                            color="success"
                            variant="ghost"
                            onClick={async () => {
                                try {
                                    setIsLoading(true)
                                    await updateChatbot(model, prompt, frequencyPenalty, presencePenalty, temperature, openAIKey, matchThreshold, matchCount, knowledgeType)
                                    setIsLoading(false)
                                } catch (e) {
                                    console.log(e)
                                    setIsLoading(false)
                                }
                            }}>
                            Update Chatbot
                        </Button>
                    </CardFooter>
                </Card>
            }


            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                message={errorModalMessage}
            />
        </div >
    );
}
