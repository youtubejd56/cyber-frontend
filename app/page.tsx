'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Terminal, Target, Trophy, Users, Zap, ChevronRight, Lock, Globe, Cpu, Github, Twitter, Linkedin } from 'lucide-react'
import { statsAPI } from '../lib/api'

interface Stats {
    total_users: number
    total_rooms: number
    total_machines: number
    total_flags_captured: number
}

export default function HomePage() {
    const [stats, setStats] = useState<Stats>({
        total_users: 0,
        total_rooms: 0,
        total_machines: 0,
        total_flags_captured: 0,
    })
    const [terminalLines, setTerminalLines] = useState<string[]>([])

    const terminalScript = [
        '$ nmap -sV -sC target.cybertraining.io',
        'Starting Nmap 7.94 ( https://nmap.org )',
        'PORT   STATE SERVICE VERSION',
        '22/tcp open  ssh     OpenSSH 8.9',
        '80/tcp open  http    Apache httpd 2.4.52',
        '$ gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt',
        '/admin  (Status: 302) [Size: 286]',
        '/login  (Status: 200) [Size: 1547]',
        '$ sqlmap -u "http://target/login" --data="user=admin&pass=test" --dbs',
        '[INFO] testing connection to target URL',
        '[INFO] GET parameter "user" is vulnerable!',
        '[SUCCESS] Database: users_db found!',
        '$ cat flag.txt',
        'THM{sql_injection_master_2024}',
        '$ sudo -l',
        'User www-data may run /usr/bin/python3',
        '$ sudo python3 -c "import os;os.system(\'/bin/bash\')"',
        'root@target:~# whoami',
        'root',
        'root@target:~# cat /root/root.txt',
        'HTB{r00t_pwn3d_2024_elite}',
    ]

    useEffect(() => {
        statsAPI.get().then(r => setStats(r.data)).catch(() => { })

        let idx = 0
        const interval = setInterval(() => {
            if (idx < terminalScript.length) {
                setTerminalLines(prev => [...prev, terminalScript[idx]])
                idx++
            } else {
                clearInterval(interval)
            }
        }, 300)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-dark-900 grid-bg">
            {/* Hero */}
            <section className="relative overflow-hidden py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-cyber-green/10 border border-cyber-green/30 rounded-full px-4 py-1.5 mb-6">
                                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
                                <span className="text-cyber-green text-xs">Platform Online • 1,337 Active Hackers</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="text-white">Learn to</span>{' '}
                                <span className="text-cyber-green neon-green">Hack.</span>
                                <br />
                                <span className="text-white">Defend the</span>{' '}
                                <span className="text-cyber-cyan neon-blue">World.</span>
                            </h1>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Master cybersecurity through hands-on challenges, real machine exploitation,
                                CTF competitions, and guided learning paths. From beginner to elite hacker.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/register" className="btn-primary px-8 py-3 rounded-lg text-dark-900 font-bold flex items-center gap-2">
                                    Start Hacking Free <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link href="/rooms" className="btn-cyber px-8 py-3 rounded-lg flex items-center gap-2">
                                    Browse Rooms <Target className="w-4 h-4" />
                                </Link>
                            </div>
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-dark-600">
                                {[
                                    { label: 'Active Hackers', value: stats.total_users.toLocaleString() },
                                    { label: 'Challenges', value: stats.total_rooms + stats.total_machines },
                                    { label: 'Flags Captured', value: stats.total_flags_captured.toLocaleString() },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="text-2xl font-bold text-cyber-green">{s.value}</div>
                                        <div className="text-slate-500 text-xs mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Terminal */}
                        <div className="relative">
                            <div className="bg-dark-800 rounded-xl border border-cyber-green/30 overflow-hidden shadow-2xl shadow-cyber-green/10">
                                <div className="flex items-center gap-2 px-4 py-3 bg-dark-700 border-b border-dark-600">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-2 text-slate-500 text-xs font-mono">terminal@cybertraining:~</span>
                                </div>
                                <div className="p-4 h-80 overflow-y-auto font-mono text-xs leading-6">
                                    {terminalLines.filter(Boolean).map((line, i) => (
                                        <div
                                            key={i}
                                            className={
                                                line.startsWith('$') ? 'text-cyber-green' :
                                                    line.startsWith('[SUCCESS]') ? 'text-cyber-green font-bold' :
                                                        line.startsWith('[INFO]') ? 'text-cyber-cyan' :
                                                            line.includes('THM{') || line.includes('HTB{') ? 'text-yellow-400 font-bold' :
                                                                line === 'root' ? 'text-red-400 font-bold' :
                                                                    'text-slate-400'
                                            }
                                        >
                                            {line}
                                        </div>
                                    ))}
                                    <span className="text-cyber-green cursor">█</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-2">
                        <span className="text-white">Why Choose </span>
                        <span className="text-cyber-green">CyberTraining?</span>
                    </h2>
                    <p className="text-slate-500 text-center mb-12">Everything you need to become a professional ethical hacker</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Target className="w-6 h-6" />,
                                title: "Real Machine Labs",
                                desc: "Practice on actual vulnerable machines similar to HackTheBox. Get user and root flags.",
                                color: "text-cyber-green",
                            },
                            {
                                icon: <Shield className="w-6 h-6" />,
                                title: "Guided Learning Rooms",
                                desc: "Structured learning paths like TryHackMe with step-by-step guided challenges.",
                                color: "text-cyber-cyan",
                            },
                            {
                                icon: <Trophy className="w-6 h-6" />,
                                title: "CTF Competitions",
                                desc: "Compete in capture-the-flag events. Climb the global leaderboard.",
                                color: "text-yellow-400",
                            },
                            {
                                icon: <Zap className="w-6 h-6" />,
                                title: "Instant Deployment",
                                desc: "Spin up vulnerable VMs in seconds. No setup required — hack from your browser.",
                                color: "text-cyber-purple",
                            },
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Active Community",
                                desc: "Join thousands of security professionals. Share writeups, tips, and tools.",
                                color: "text-pink-400",
                            },
                            {
                                icon: <Cpu className="w-6 h-6" />,
                                title: "Skill Tracking",
                                desc: "Monitor your progress across categories: Web, Network, Forensics, Crypto.",
                                color: "text-orange-400",
                            },
                        ].map((f, i) => (
                            <div key={i} className="cyber-card rounded-xl p-6">
                                <div className={`${f.color} mb-4`}>{f.icon}</div>
                                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 px-4 bg-dark-800/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        <span className="text-white">Learning </span>
                        <span className="text-cyber-green">Paths</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Web Security', icon: <Globe className="w-5 h-5" />, count: '45+ rooms', color: 'border-cyber-green/30 hover:border-cyber-green' },
                            { name: 'Network Hacking', icon: <Zap className="w-5 h-5" />, count: '30+ rooms', color: 'border-cyber-cyan/30 hover:border-cyber-cyan' },
                            { name: 'Cryptography', icon: <Lock className="w-5 h-5" />, count: '25+ rooms', color: 'border-purple-500/30 hover:border-purple-500' },
                            { name: 'Forensics', icon: <Terminal className="w-5 h-5" />, count: '20+ rooms', color: 'border-yellow-500/30 hover:border-yellow-500' },
                            { name: 'Malware Analysis', icon: <Cpu className="w-5 h-5" />, count: '15+ rooms', color: 'border-red-500/30 hover:border-red-500' },
                            { name: 'Privilege Escalation', icon: <Shield className="w-5 h-5" />, count: '35+ rooms', color: 'border-orange-500/30 hover:border-orange-500' },
                            { name: 'OSINT', icon: <Users className="w-5 h-5" />, count: '12+ rooms', color: 'border-pink-500/30 hover:border-pink-500' },
                            { name: 'Reverse Engineering', icon: <Target className="w-5 h-5" />, count: '18+ rooms', color: 'border-cyber-green/30 hover:border-cyber-green' },
                        ].map((cat, i) => (
                            <Link key={i} href="/rooms" className={`bg-dark-700 border ${cat.color} rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-300 hover:bg-dark-600 cursor-pointer`}>
                                <div className="text-cyber-green">{cat.icon}</div>
                                <div className="text-white font-semibold text-sm text-center">{cat.name}</div>
                                <div className="text-slate-500 text-xs">{cat.count}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="cyber-card rounded-2xl p-10">
                        <div className="text-6xl mb-4">🔐</div>
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="text-white">Ready to become a </span>
                            <span className="text-cyber-green neon-green">Hacker?</span>
                        </h2>
                        <p className="text-slate-400 mb-8">Join thousands of cybersecurity professionals. Free forever.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="btn-primary px-10 py-4 rounded-xl font-bold text-lg text-dark-900">
                                Create Free Account
                            </Link>
                            <Link href="/machines" className="btn-cyber px-10 py-4 rounded-xl font-bold text-lg">
                                View Machines
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-dark-600 py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="CyberTraining"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                    <p className="text-slate-400 text-sm">© {new Date().getFullYear()} CyberTraining Platform. Developed by <span className="text-cyber-green">Vinayak NV</span></p>
                    <div className="flex gap-4 text-slate-400 text-sm">
                        <Link href="/help" className="hover:text-cyber-green transition-colors">How to Use</Link>
                        <Link href="/privacy" className="hover:text-cyber-green transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-cyber-green transition-colors">Terms of Service</Link>
                    </div>
                    <div className="flex gap-4">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyber-green transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyber-green transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyber-green transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
