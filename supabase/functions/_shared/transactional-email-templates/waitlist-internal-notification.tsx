/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  role?: string
  clubName?: string | null
}

const InternalNotification = ({ name, email, role, clubName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Camino waitlist signup</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New waitlist signup</Heading>
        <Section style={card}>
          <Text style={row}>
            <strong style={label}>Name:</strong> {name || '—'}
          </Text>
          <Text style={row}>
            <strong style={label}>Email:</strong> {email || '—'}
          </Text>
          <Text style={row}>
            <strong style={label}>Role:</strong> {role || '—'}
          </Text>
          <Text style={row}>
            <strong style={label}>Club:</strong> {clubName || '—'}
          </Text>
        </Section>
        <Text style={footer}>
          Sent automatically from caminodevelopment.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InternalNotification,
  subject: (data: Record<string, any>) =>
    `New waitlist signup — ${data.name || data.email || 'unknown'}`,
  displayName: 'Waitlist internal notification',
  previewData: {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'player',
    clubName: 'Camino FC',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
  margin: 0,
  padding: 0,
}
const container = { padding: '32px 28px', maxWidth: '520px' }
const h1 = {
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: '#0a0e1a',
  margin: '0 0 20px',
  letterSpacing: '-0.01em',
}
const card = {
  border: '1px solid #e8e8ec',
  borderRadius: '8px',
  padding: '16px 20px',
}
const row = {
  fontSize: '14px',
  color: '#3d4150',
  margin: '0 0 8px',
  lineHeight: '1.5',
}
const label = { color: '#0a0e1a', display: 'inline-block', minWidth: '60px' }
const footer = {
  fontSize: '11px',
  color: '#999999',
  margin: '24px 0 0',
}
