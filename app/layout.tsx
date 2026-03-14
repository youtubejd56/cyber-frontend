import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
    title: 'CyberTraining - Hack The World',
    description: 'The ultimate cybersecurity training platform. Learn penetration testing, CTF challenges, and ethical hacking.',
    keywords: 'cybersecurity, hacking, CTF, penetration testing, ethical hacking',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-dark-900 text-slate-200 font-mono">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#0f1629',
                            color: '#00ff41',
                            border: '1px solid rgba(0,255,65,0.3)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '14px',
                        },
                        success: {
                            iconTheme: { primary: '#00ff41', secondary: '#0a0e1a' },
                        },
                        error: {
                            iconTheme: { primary: '#ff4060', secondary: '#0a0e1a' },
                            style: {
                                color: '#ff4060',
                                border: '1px solid rgba(255,64,96,0.3)',
                            }
                        }
                    }}
                />
                {children}
            </body>
        </html>
    )
}
