'use client'
import Navbar from '../../components/Navbar'
import { FileText, AlertTriangle, Flag, Wifi, Shield, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-dark-900">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 mb-4">
                        <FileText className="w-8 h-8 text-cyber-green" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-slate-400">Last updated: March 2026</p>
                </div>

                <div className="space-y-8">
                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">Acceptable Use</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <p>By using CyberTraining, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Use the platform only for ethical cybersecurity learning</li>
                                <li>Not attempt to attack or compromise the training infrastructure</li>
                                <li>Not share your VPN credentials with others</li>
                                <li>Not use the labs for any illegal activities</li>
                                <li>Respect other users and the learning environment</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-semibold text-white">Important Warnings</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-red-400">Educational Purpose Only:</strong> All machines and rooms are for learning cybersecurity skills legally</li>
                                <li><strong className="text-red-400">No Real-World Attacks:</strong> Do not use learned techniques against targets outside the platform</li>
                                <li><strong className="text-red-400">VPN Required:</strong> You must connect via VPN to access machines</li>
                                <li><strong className="text-red-400">Account Responsibility:</strong> You are responsible for all activity under your account</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Flag className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">Capturing Flags</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <p>When you capture a flag:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Flags must be submitted through the platform interface</li>
                                <li>Points are awarded based on difficulty level</li>
                                <li>Your rank updates based on total points earned</li>
                                <li>Leaderboard position reflects your achievements</li>
                                <li>Some flags require both user and root access</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Wifi className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">VPN & Lab Access</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <p>VPN usage terms:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>VPN configuration is provided for lab access only</li>
                                <li>Do not share or transfer your VPN credentials</li>
                                <li>Disconnect VPN when not actively using the labs</li>
                                <li>VPN access may be revoked for misuse</li>
                                <li>All VPN connections are logged for security</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Violations & Consequences</h2>
                        <div className="text-slate-300 space-y-2">
                            <p>Violations may result in:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Warning and point deduction</li>
                                <li>Temporary suspension of account</li>
                                <li>Permanent ban from the platform</li>
                                <li>Legal action for illegal activities</li>
                            </ul>
                        </div>
                    </section>

                    <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Related Pages</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/privacy" className="flex items-center gap-2 text-cyber-green hover:underline">
                                <ChevronRight className="w-4 h-4" />
                                Privacy Policy
                            </Link>
                            <Link href="/help" className="flex items-center gap-2 text-cyber-green hover:underline">
                                <ChevronRight className="w-4 h-4" />
                                How to Use
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-dark-700 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© 2026 CyberTraining. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
