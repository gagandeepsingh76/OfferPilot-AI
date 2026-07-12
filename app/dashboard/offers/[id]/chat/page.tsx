"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ChatPage({ params }: { params: { id: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatOptions: any = {
    api: "/api/chat",
    body: {
      offerId: params.id,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err.message || "Failed to send message")
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat(chatOptions) as any

  // Auto-scroll
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/dashboard/offers/${params.id}`} 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to offer
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Negotiation Coach</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered advice on how to negotiate this offer.</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-card border border-border rounded-xl shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">I&apos;m your Negotiation Coach</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                I&apos;ve reviewed your offer details. Ask me for negotiation strategies, salary market rates, or ask me to draft a professional email to the recruiter.
              </p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages.map((m: any) => (
              <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                </div>
                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask for advice or request an email draft..."
              className="flex-1 h-12 rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          {error && <p className="text-xs text-destructive mt-2">{error.message}</p>}
        </div>
      </div>
    </div>
  )
}
