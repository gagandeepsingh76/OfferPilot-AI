import { createOpenAI } from '@ai-sdk/openai'

export function isOpenAIConfigured() {
  const apiKey = process.env.OPENAI_API_KEY
  return Boolean(apiKey && apiKey.startsWith("sk-") && !apiKey.includes("...") && apiKey.length > 20)
}

export const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!isOpenAIConfigured() || !apiKey) return null

  return createOpenAI({
    apiKey,
  })
}
