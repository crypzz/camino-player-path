/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to join {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandWord}>CAMINO</Text>
        </Section>
        <Heading style={h1}>
          You're <em style={serif}>invited.</em>
        </Heading>
        <Text style={text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          . Accept the invitation to create your account and start tracking
          verified performance.
        </Text>
        <Section style={buttonWrap}>
          <Button style={button} href={confirmationUrl}>
            Accept invitation
          </Button>
        </Section>
        <Text style={small}>
          Or paste this link into your browser:
          <br />
          <Link href={confirmationUrl} style={linkSubtle}>
            {confirmationUrl}
          </Link>
        </Text>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", margin: 0, padding: 0 }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { borderBottom: '1px solid #e8e8ec', paddingBottom: '16px', marginBottom: '28px' }
const brandWord = { fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.24em', color: '#0a0e1a', margin: 0 }
const h1 = { fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: '26px', fontWeight: 700, color: '#0a0e1a', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: '1.2' }
const serif = { fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: '#c89b2b' }
const text = { fontSize: '15px', color: '#3d4150', lineHeight: '1.6', margin: '0 0 24px' }
const buttonWrap = { margin: '8px 0 28px' }
const button = { backgroundColor: '#0a0e1a', color: '#f3c047', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: '14px', fontWeight: 600, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none', letterSpacing: '0.02em', border: '1px solid #c89b2b' }
const small = { fontSize: '12px', color: '#6a6f7d', lineHeight: '1.5', margin: '0 0 24px', wordBreak: 'break-all' as const }
const link = { color: '#0a0e1a', textDecoration: 'underline' }
const linkSubtle = { color: '#6a6f7d', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#999999', margin: '28px 0 0', borderTop: '1px solid #e8e8ec', paddingTop: '20px' }
