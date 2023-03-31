// @ts-nocheck
import { ChatGPTConversation } from "./ChatGPTConversation";

import {
    generateSystemPromptV1,
    generateSystemPromptV2,
    generateFirstPersonPrompt,
    getJsonDataPrompt,
} from "./prompts.utils";

interface LessonData {
  student: string
  lesson: string
  chatHistory: Array<{ role: string, content: string }>
}

class XLesson {
    private readonly heavyPrompt: string
  private readonly chat: ChatGPTConversation

  constructor ({ student, lesson, chatHistory }: LessonData) {
    // console.log(student, lesson);
        this.heavyPrompt = generateSystemPromptV1(student, lesson)
    this.chat = new ChatGPTConversation({
            chatHistory,
            heavyPrompt: this.heavyPrompt
    })
  }

    async continueConversation (message: string | undefined) {
        message &&
            this.chat.chatHistory.push({ role: "user", content: message })
    console.log("continueConversation");
        const response = await this.chat.generateChatCompletion()
    this.chat.chatHistory.push(response)
    let json: any
    do {
            json = await this.getJsonData()
      // console.log("json:", json);
    } while (json === null)

    return {
            ...json,
            content: response.content
    };
    }

    // async getJsonDataV2()

    async getJsonData () {
        console.log("Getting json data");
        const { content } = await this.chat.generateChatCompletion(
            { role: "system", content: getJsonDataPrompt },
            { silent: true }
        );
        const dataString = content
    console.log("Json data:", dataString, "end of json data");

        let startingIndex = 0
    let endingIndex = dataString.length
    while (
            startingIndex < endingIndex &&
            dataString.charAt(startingIndex) !== "{"
        ) {
            startingIndex++
    }
        while (
            startingIndex < endingIndex &&
            dataString.charAt(endingIndex - 1) !== "}"
        ) {
            endingIndex--
    }
        const jsonString = dataString.substring(startingIndex, endingIndex)
    if (jsonString.length == 0) return null
    let isValidJson = true
    let json
    try {
            json = JSON.parse(jsonString)
    } catch (e) {
            isValidJson = false
    }
        if (!isValidJson) return null
    return json
  }
}

export { XLesson }
