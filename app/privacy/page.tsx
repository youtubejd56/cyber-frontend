'use client'
import Navbar from '../../components/Navbar'
import { Shield, Lock, Eye, Database, Mail, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-dark-900">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 mb-4">
                        <Shield className="w-8 h-8 text-cyber-green" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: March 2026</p>
                </div>

                <div className="space-y-8">
                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <p>We collect the following information when you register and use our platform:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Username and email address</li>
                                <li>Password (encrypted)</li>
                                <li>Profile information (avatar, rank, points)</li>
                                <li>Activity logs (tasks completed, machines solved)</li>
                                <li>VPN connection logs for security purposes</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">How We Protect Your Data</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <p>We implement industry-standard security measures:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>All passwords are hashed using industry-standard algorithms</li>
                                <li>API communications use JWT authentication</li>
                                <li>SSL/TLS encryption for all data transmission</li>
                                <li>Regular security audits and updates</li>
                                <li>Isolated database connections</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">Data Usage</h2>
                        </div>
                        <div className="text-slate-300 space-y-3">
                            <p>Your data is used solely for:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Providing cybersecurity training services</li>
                                <li>Tracking your progress and ranking</li>
                                <li>Managing VPN connections to labs</li>
                                <li>Communicating important updates</li>
                                <li>Maintaining leaderboards and achievements</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Mail className="w-5 h-5 text-cyber-green" />
                            <h2 className="text-xl font-semibold text-white">Contact Us</h2>
                        </div>
                        <div className="text-slate-300">
                            <p>If you have questions about this Privacy Policy, please contact us through the platform or at:</p>
                            <p className="mt-2 text-cyber-green">privacy@cybertraining.local</p>
                        </div>
                    </section>

                    <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Related Pages</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/terms" className="flex items-center gap-2 text-cyber-green hover:underline">
                                <ChevronRight className="w-4 h-4" />
                                Terms of Service
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
