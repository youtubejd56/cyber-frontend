'use client'
import Navbar from '../../components/Navbar'
import { BookOpen, Wifi, Target, Flag, Server, Terminal, Lock, Eye, ChevronRight, ExternalLink, Download, Key } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-dark-900">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 mb-4">
                        <BookOpen className="w-8 h-8 text-cyber-green" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">How to Use CyberTraining</h1>
                    <p className="text-slate-400">Complete guide to getting started with cybersecurity training</p>
                </div>

                {/* Table of Contents */}
                <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <a href="#vpn-setup" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> VPN Setup Guide
                        </a>
                        <a href="#machine-info" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Understanding Machine Info
                        </a>
                        <a href="#attacking-targets" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> How to Attack Targets
                        </a>
                        <a href="#capturing-flags" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Capturing Flags
                        </a>
                        <a href="#room-tasks" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Room Tasks
                        </a>
                        <a href="#machines-list" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Available Machines (107)
                        </a>
                    </div>
                </div>

                {/* VPN Setup */}
                <section id="vpn-setup" className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">VPN Setup</h2>
                    </div>
                    <div className="text-slate-300 space-y-4">
                        <p>You must connect to our VPN to access training machines. Follow these steps:</p>

                        <div className="bg-dark-900 rounded-lg p-4 mt-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Download className="w-4 h-4" /> Step 1: Get Your VPN Configuration
                            </h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Go to <Link href="/vpn" className="text-cyber-green hover:underline">VPN Lab</Link> in the menu</li>
                                <li>Click "Generate Config" to create your VPN credentials</li>
                                <li>Download the <code className="bg-dark-700 px-2 py-1 rounded">.ovpn</code> configuration file</li>
                            </ol>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Step 2: Connect with OpenVPN
                            </h3>
                            <div className="space-y-2 text-sm font-mono">
                                <p className="text-slate-400"># Linux/Mac:</p>
                                <p className="text-cyber-green">sudo openvpn --config your_config.ovpn</p>
                                <p className="text-slate-400 mt-2"># Windows (with OpenVPN GUI):</p>
                                <p className="text-cyber-green">Right-click OpenVPN icon → Connect → Select your config</p>
                            </div>
                        </div>

                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                            <p className="text-yellow-400 text-sm">
                                <strong>Important:</strong> Your VPN IP will be in the 10.8.0.0/24 range.
                                All target machines are accessible within this network.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Machine Information */}
                <section id="machine-info" className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                            <Server className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Understanding Machine Information</h2>
                    </div>
                    <div className="text-slate-300 space-y-4">
                        <p>Each machine page shows important information you need to know:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-dark-900 rounded-lg p-4">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-red-400" /> IP Address
                                </h3>
                                <p className="text-sm">The target's IP address (e.g., 10.10.10.100). Use this to connect via VPN.</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-4">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                                    <Server className="w-4 h-4 text-blue-400" /> Operating System
                                </h3>
                                <p className="text-sm">The OS running on the machine (Linux, Windows, etc.).</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-4">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-yellow-400" /> Difficulty
                                </h3>
                                <p className="text-sm">Easy, Medium, Hard, or Insane. Higher difficulty = more points.</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-4">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                                    <Flag className="w-4 h-4 text-cyber-green" /> Points
                                </h3>
                                <p className="text-sm">User Points + Root Points. Earn both to complete the machine!</p>
                            </div>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4 mt-4">
                            <h3 className="text-white font-semibold mb-2">Machine Tags</h3>
                            <p className="text-sm mb-2">Tags indicate the techniques needed:</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">Buffer Overflow</span>
                                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">SQL Injection</span>
                                <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">Privilege Escalation</span>
                                <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">Web</span>
                                <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">Crypto</span>
                                <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded text-xs">Forensics</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Attacking Targets */}
                <section id="attacking-targets" className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">How to Attack Targets</h2>
                    </div>
                    <div className="text-slate-300 space-y-4">
                        <div className="bg-dark-900 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3">Basic Attack Methodology</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center text-xs flex-shrink-0">1</span>
                                    <div>
                                        <p className="text-white">Connect to VPN</p>
                                        <p className="text-slate-500">Ensure your OpenVPN is connected first</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center text-xs flex-shrink-0">2</span>
                                    <div>
                                        <p className="text-white">Scan the target</p>
                                        <p className="text-slate-500">Use nmap: <code className="text-cyber-green">nmap -sV -p- 10.10.10.100</code></p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center text-xs flex-shrink-0">3</span>
                                    <div>
                                        <p className="text-white">Identify vulnerabilities</p>
                                        <p className="text-slate-500">Look for outdated services, misconfigurations</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center text-xs flex-shrink-0">4</span>
                                    <div>
                                        <p className="text-white">Exploit & get user access</p>
                                        <p className="text-slate-500">Use exploits, brute force, or bypass techniques</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center text-xs flex-shrink-0">5</span>
                                    <div>
                                        <p className="text-white">Privilege Escalation</p>
                                        <p className="text-slate-500">Escalate to root/admin and get the second flag!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3">Common Tools</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><code className="text-cyber-green">nmap</code> - Port scanning</div>
                                <div><code className="text-cyber-green">nikto</code> - Web scanning</div>
                                <div><code className="text-cyber-green">hydra</code> - Password brute force</div>
                                <div><code className="text-cyber-green">john</code> - Hash cracking</div>
                                <div><code className="text-cyber-green">gobuster</code> - Directory brute force</div>
                                <div><code className="text-cyber-green">msfconsole</code> - Metasploit framework</div>
                                <div><code className="text-cyber-green">burpsuite</code> - Web proxy</div>
                                <div><code className="text-cyber-green">wireshark</code> - Packet analysis</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Capturing Flags */}
                <section id="capturing-flags" className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyber-green/20 flex items-center justify-center">
                            <Flag className="w-5 h-5 text-cyber-green" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Capturing Flags</h2>
                    </div>
                    <div className="text-slate-300 space-y-4">
                        <p>Each machine has TWO flags to capture:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-dark-900 rounded-lg p-4 border-l-4 border-blue-500">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                                    <Key className="w-4 h-4 text-blue-400" /> User Flag
                                </h3>
                                <p className="text-sm">Usually found in <code className="text-cyber-green">/home/USER/flag.txt</code> or similar user-owned location.</p>
                                <p className="text-sm mt-2 text-blue-400">Worth 10-30 points typically</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-4 border-l-4 border-red-500">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4 text-red-400" /> Root Flag
                                </h3>
                                <p className="text-sm">Found in <code className="text-cyber-green">/root/flag.txt</code> after privilege escalation.</p>
                                <p className="text-sm mt-2 text-red-400">Worth 20-50 points typically</p>
                            </div>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4 mt-4">
                            <h3 className="text-white font-semibold mb-3">Submitting Flags</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Go to the machine page on CyberTraining</li>
                                <li>Enter the flag text in the submission box</li>
                                <li>Click "Submit" to receive your points</li>
                                <li>The flag format is usually: <code className="text-cyber-green">flag&#123;some_hash&#125;</code></li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Room Tasks */}
                <section id="room-tasks" className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Room Tasks</h2>
                    </div>
                    <div className="text-slate-300 space-y-4">
                        <p>Rooms are guided challenges with multiple tasks. Each room teaches specific skills.</p>

                        <div className="bg-dark-900 rounded-lg p-4 mt-4">
                            <h3 className="text-white font-semibold mb-3">How Rooms Work</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Browse available rooms in <Link href="/rooms" className="text-cyber-green hover:underline">Rooms</Link></li>
                                <li>Join a room to unlock its tasks</li>
                                <li>Complete each task in order</li>
                                <li>Tasks include learning materials and practical exercises</li>
                                <li>Earn points for completing tasks</li>
                                <li>Rooms can be done collaboratively</li>
                            </ol>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3">Task Types</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="text-yellow-400">📖 Reading</span> - Learn concepts</div>
                                <div><span className="text-blue-400">💻 Exercise</span> - Hands-on practice</div>
                                <div><span className="text-red-400">🎯 Challenge</span> - Solve a problem</div>
                                <div><span className="text-cyber-green">🚩 Quiz</span> - Test your knowledge</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Machines List */}
                <section id="machines-list" className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                            <Server className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Available Machines (107 Total)</h2>
                    </div>
                    <div className="text-slate-300 space-y-4">
                        <p>CyberTraining has 107 machines across various categories and difficulty levels.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <div className="bg-dark-900 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-cyber-green">20</p>
                                <p className="text-xs text-slate-400">Easy</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-yellow-400">45</p>
                                <p className="text-xs text-slate-400">Medium</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-orange-400">30</p>
                                <p className="text-xs text-slate-400">Hard</p>
                            </div>
                            <div className="bg-dark-900 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-red-400">12</p>
                                <p className="text-xs text-slate-400">Insane</p>
                            </div>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4 mt-4">
                            <h3 className="text-white font-semibold mb-3">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">Linux</span>
                                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">Windows</span>
                                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">Network</span>
                                <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">Web</span>
                                <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">OSCP</span>
                                <span className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-full text-sm">Active Directory</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Link href="/machines" className="inline-flex items-center gap-2 text-cyber-green hover:underline">
                                <ChevronRight className="w-4 h-4" />
                                Browse all machines
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Getting Help */}
                <section className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Need More Help?</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/rooms" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Browse Rooms
                        </Link>
                        <Link href="/leaderboard" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Leaderboard
                        </Link>
                        <a href="https://discord.gg/cybertraining" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyber-green hover:underline">
                            <ChevronRight className="w-4 h-4" /> Join Discord
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </section>
            </main>

            <footer className="border-t border-dark-700 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© 2026 CyberTraining. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
