// Inside global.d.ts
declare global {
    interface Window {
        voiceflow: {
            chat: {
                load: (config: {
                    verify: { projectID: string };
                    url: string;
                    versionID: string;
                    assistant: { color: string, stylesheet: string };
                }) => void;
            };
        };
    }
}

export { };
