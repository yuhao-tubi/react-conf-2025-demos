'use server'

export async function submitFormAction(prevState: any, formData: FormData) {
  // Simulate server processing time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // Validation
  if (!name || !email || !message) {
    return {
      error: 'Please fill in all fields',
      success: false,
    }
  }

  if (!email.includes('@')) {
    return {
      error: 'Please enter a valid email address',
      success: false,
    }
  }

  // Simulate successful submission
  return {
    success: true,
    message: `Thanks ${name}! We received your message and will contact you at ${email} soon.`,
  }
}
