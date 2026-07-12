'use server'

import { createClient } from '@/lib/supabase/server'
import { headers, cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Demo Account Bypass
  if (email === 'demo@offerpilot.ai' && password === 'Demo@12345') {
    const cookieStore = await cookies()
    cookieStore.set('demo_mode', 'true', { maxAge: 60 * 60 * 24 * 7 })
    return { success: true }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const supabase = await createClient()

  const requestOrigin = (await headers()).get('origin')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin || 'https://offerpilot.ai'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('demo_mode')

  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const { redirect } = await import('next/navigation')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const requestOrigin = (await headers()).get('origin')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin || 'https://offerpilot.ai'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })
  
  if (data.url) {
    return { url: data.url }
  }
  
  return { error: error?.message || 'Failed to authenticate with Google' }
}

export async function enableDemoMode() {
  const cookieStore = await cookies()
  cookieStore.set('demo_mode', 'true', { maxAge: 60 * 60 * 24 * 7 }) // 1 week
  
  // Seed demo data if it doesn't exist
  const existingOffers = await prisma.offer.count({ where: { userId: "demo-user-id" } })
  
  if (existingOffers === 0) {
    await prisma.offer.createMany({
      data: [
        {
          userId: "demo-user-id",
          companyName: "TechNova Solutions",
          jobTitle: "Senior Frontend Engineer",
          status: "PENDING"
        },
        {
          userId: "demo-user-id",
          companyName: "DataSphere Inc.",
          jobTitle: "Full Stack Developer",
          status: "PENDING"
        }
      ]
    })
  }

  const { redirect } = await import('next/navigation')
  redirect('/dashboard')
}
