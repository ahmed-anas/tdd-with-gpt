import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";



export class CodeMaker {
    private readonly promptTemplate: ChatPromptTemplate<any, any>;
    // private readonly promptTemplate: PromptTemplate;
    private readonly chain: LLMChain;

    constructor(openAiKey: string) {
        const openAi = new ChatOpenAI({
            openAIApiKey: openAiKey,
            temperature: 0,
            verbose: true
        });

        this.promptTemplate = ChatPromptTemplate.fromPromptMessages([
            [
                'system',
                `Your are my software engineer responsible for writing application code given unit tests. Your output should only contain application code and nothing else, without any omissions.`
            ],
            [
                'user',
                `Generate and provide only the modified application code that strictly implements the functionality required by the provided unit tests.
                The output should contain no additional text, comments, or introductory phrases and should include any required imports.
                Ensure that the generated code aligns precisely with the unit tests provided, without introducing any additional error handling or cases 
                not explicitly specified in those tests.
                `
            ],
            [
                'user',
                `Given the following unit tests code that specifies the required functionality:
                \`\`\`typescript
                {unitTestsCode}
                \`\`\`
                And the following application code file: 
                \`\`\`typescript
                {existingCode}
                \`\`\`
                `
            ]
        ]);

        this.chain = new LLMChain({
            llm: openAi,
            prompt: this.promptTemplate,

        });
    }

    async generateCode(unitTests: string, code: string) {

        const response = await this.chain.call({
            unitTestsCode: unitTests,
            existingCode: code,
        });

        // Remove the code block delimiters
        const codeWithoutDelimiters = response.text.replace(/^```typescript\n/, '').replace(/```$/, '');
        return codeWithoutDelimiters;
    }
}
