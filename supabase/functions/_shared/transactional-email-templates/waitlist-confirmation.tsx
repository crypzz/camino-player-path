/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Camino Development'
const SITE_URL = 'https://caminodevelopment.com'

interface Props {
  name?: string
  role?: 'player' | 'coach' | 'parent' | 'director' | string
  clubName?: string | null
}

const ROLE_BLURB: Record<string, string> = {
  player:
    "You'll get early access to your verified player passport — track your CPI, log fitness tests, and showcase your progress to coaches.",
  coach:
    "You'll be among the first coaches to evaluate players, run sessions, and build season-long development plans inside Camino.",
  parent:
    "You'll get a clear view into your child's development — verified stats, coach feedback, and growth over time.",
  director:
    "You'll get a director's view of your entire club — players, coaches, leaderboards, and club-wide performance trends.",
}

const WaitlistConfirmation = ({ name, role, clubName }: Props) => {
  const greeting = name ? `Welcome, ${name}.` : 'Welcome.'
  const blurb = role && ROLE_BLURB[role] ? ROLE_BLURB[role] : ROLE_BLURB.player
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're on the Camino waitlist</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandBar}>
            <Text style={brandWord}>CAMINO</Text>
          </Section>

          <Heading style={h1}>
            {greeting}{' '}
            <span style={serif}>You're in.</span>
          </Heading>

          <Text style={text}>
            Thanks for joining the <strong>{SITE_NAME}</strong> waitlist. We're
            onboarding select clubs in Calgary first — and you're now on the
            list.
          </Text>

          <Text style={text}>{blurb}</Text>

          {clubName ? (
            <Text style={meta}>
              Club on file: <strong>{clubName}</strong>
            </Text>
          ) : null}

          <Hr style={divider} />

          <Heading as="h2" style={h2}>
            What happens next
          </Heading>
          <Text style={text}>
            1. We review every signup and prioritize clubs in our launch region.
            <br />
            2. When it's your turn, we'll email you a personal invite link.
            <br />
            3. You'll set up your passport in under 2 minutes.
          </Text>

          <Text style={small}>
            Questions? Reply to this email or write to{' '}
            <Link href="mailto:hello@caminodevelopment.com" style={linkSubtle}>
              hello@caminodevelopment.com
            </Link>
            .
          </Text>

          <Text style={footer}>
            &copy; {new Date().getFullYear()} {SITE_NAME} ·{' '}
            <Link href={SITE_URL} style={linkSubtle}>
              caminodevelopment.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: WaitlistConfirmation,
  subject: "You're on the Camino waitlist",
  displayName: 'Waitlist confirmation',
  previewData: { name: 'Alex Rivera', role: 'player', clubName: 'Camino FC' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
  margin: 0,
  padding: 0,
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = {
  borderBottom: '1px solid #e8e8ec',
  paddingBottom: '16px',
  marginBottom: '28px',
}
const brandWord = {
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.24em',
  color: '#0a0e1a',
  margin: 0,
}
const h1 = {
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  fontSize: '26px',
  fontWeight: 700,
  color: '#0a0e1a',
  margin: '0 0 18px',
  letterSpacing: '-0.02em',
  lineHeight: '1.2',
}
const h2 = {
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: '#0a0e1a',
  margin: '0 0 10px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase' as const,
}
const serif = {
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontStyle: 'italic' as const,
  fontWeight: 400,
  color: '#c89b2b',
}
const text = {
  fontSize: '15px',
  color: '#3d4150',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const meta = {
  fontSize: '13px',
  color: '#6a6f7d',
  margin: '4px 0 0',
}
const divider = {
  borderTop: '1px solid #e8e8ec',
  margin: '28px 0',
}
const small = {
  fontSize: '13px',
  color: '#6a6f7d',
  lineHeight: '1.5',
  margin: '20px 0 0',
}
const linkSubtle = { color: '#0a0e1a', textDecoration: 'underline' }
const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '28px 0 0',
  borderTop: '1px solid #e8e8ec',
  paddingTop: '20px',
}
