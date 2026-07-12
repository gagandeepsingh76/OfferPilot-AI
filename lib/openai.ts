import { createOpenAI } from '@ai-sdk/openai'

export const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  return createOpenAI({
    apiKey,
  })
}
