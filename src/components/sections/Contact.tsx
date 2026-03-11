'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/types/contact'
import { contactIntents } from '@/data/contactIntents'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LocalizedText, getLocalizedData } from '@/components/shared/LocalizedText'
import { useTranslations, useLocale } from 'next-intl'

export function Contact() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      intent: 'general',
      message: '',
    },
  })

  // Safe intent retrieval to provide dynamic placeholders
  const selectedIntent = form.watch('intent')
  const currentIntentConfig = contactIntents.find((i) => i.key === selectedIntent) || contactIntents[3]

  const onSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const formData = new URLSearchParams({
        'form-name': 'contact',
        name: values.name,
        email: values.email,
        intent: values.intent,
        message: values.message,
      })

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!res.ok) throw new Error('Form submission failed')

      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error('Contact form error:', error)
      setErrorMsg(t('errorGeneric'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="mx-auto mt-12 w-full max-w-2xl">
          {isSuccess ? (
            <Card className="border-primary/50 bg-primary/5 text-center">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-2xl font-bold">{t('successTitle')}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t('successMessage')}
                </p>
                <Button
                  className="mt-8"
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                >
                  {t('successCta')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-6 sm:p-8">
                {/* Netlify needs this hidden form so it picks up the schema during build */}
                <form name="contact" data-netlify="true" hidden>
                  <input type="hidden" name="form-name" value="contact" />
                  <input type="text" name="name" />
                  <input type="email" name="email" />
                  <input type="text" name="intent" />
                  <textarea name="message" />
                </form>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" name="contact-form">
                    
                    {/* Intent Selector */}
                    <FormField
                      control={form.control}
                      name="intent"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-base">{t('formIntentLabel')}</FormLabel>
                          <FormControl>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {contactIntents.map((intent) => (
                                <button
                                  key={intent.key}
                                  type="button"
                                  onClick={() => field.onChange(intent.key)}
                                  className={cn(
                                    'flex h-auto w-full flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:bg-muted/50',
                                    field.value === intent.key
                                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                      : 'border-border bg-background'
                                  )}
                                >
                                  <span className="font-semibold text-foreground">
                                    <LocalizedText en={intent.label} th={intent.labelTh || intent.label} />
                                  </span>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Meta Fields */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('formNameLabel')}</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('formEmailLabel')}</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message Area */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <LocalizedText en={currentIntentConfig.heading} th={currentIntentConfig.headingTh || currentIntentConfig.heading} />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={getLocalizedData(currentIntentConfig, 'placeholder', locale)}
                              className="min-h-[160px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {errorMsg && (
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {errorMsg}
                      </div>
                    )}

                    <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('formSubmitting')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('formSubmit')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
