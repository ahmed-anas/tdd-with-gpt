import { ChatOpenAI } from "langchain/chat_models/openai";

class CodeGenerator {
    private chat: ChatOpenAI;

    constructor(private openAiKey: string) {
        this.chat = new ChatOpenAI({
            openAIApiKey: openAiKey,
            temperature: 0
          });
    }

    generateCode(unitTests: string, fileCode: string) {
        
    }
}
