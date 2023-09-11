import { OpenAI } from "langchain/llms/openai";
import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

export class CodeMaker {
    private readonly template = `You are a software developer and we are using TDD.

    Given the unit tests, I want you to give the code that will make these unit tests pass.
 
    The current code is as follow: 
    {existingCode}

    Unit Tests are as follow:
    {unitTestsCode}
    `;


    private readonly promptTemplate: PromptTemplate;
    private readonly chain: LLMChain;

    constructor(openAiKey: string) {
        const openAi = new ChatOpenAI({
            openAIApiKey: openAiKey,
            temperature: 0
        });

        this.promptTemplate = new PromptTemplate({
            template: this.template,
            inputVariables: ['unitTestsCode', 'existingCode'],
        });

        this.chain = new LLMChain({ llm: openAi, prompt: this.promptTemplate });
    }


    async generateCode(unitTests: string, code: string) {
        const response = await this.chain.call({
            unitTestsCode: unitTests,
            existingCode: code
        });

        return response;
    }
}
