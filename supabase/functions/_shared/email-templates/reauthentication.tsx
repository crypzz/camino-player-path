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

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandWord}>CAMINO</Text>
        </Section>
        <Heading style={h1}>
          Confirm your <em style={serif}>identity.</em>
        </Heading>
        <Text style={text}>Use the code below to confirm it's you:</Text>
        <Section style={codeWrap}>
          <Text style={codeStyle}>{token}</Text>
        </Section>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", margin: 0, padding: 0 }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { borderBottom: '1px solid #e8e8ec', paddingBottom: '16px', marginBottom: '28px' }
const brandWord = { fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.24em', color: '#0a0e1a', margin: 0 }
const h1 = { fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: '26px', fontWeight: 700, color: '#0a0e1a', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: '1.2' }
const serif = { fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: '#c89b2b' }
const text = { fontSize: '15px', color: '#3d4150', lineHeight: '1.6', margin: '0 0 16px' }
const codeWrap = { backgroundColor: '#0a0e1a', borderRadius: '10px', padding: '24px', textAlign: 'center' as const, margin: '8px 0 28px', border: '1px solid #c89b2b' }
const codeStyle = { fontFamily: "'Plus Jakarta Sans', 'Courier New', monospace", fontSize: '32px', fontWeight: 700, color: '#f3c047', margin: 0, letterSpacing: '0.4em' }
const footer = { fontSize: '12px', color: '#999999', margin: '28px 0 0', borderTop: '1px solid #e8e8ec', paddingTop: '20px' }
