'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Terminal, LayoutDashboard, Target, Shield, Trophy, LogOut, User, Menu, X, ChevronDown, Wifi, Monitor, Cpu } from 'lucide-react'
import Cookies from 'js-cookie'
import { authAPI } from '../lib/api'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const token = Cookies.get('token')
        if (token) {
            authAPI.getMe().then(r => setUser(r.data)).catch(() => {
                Cookies.remove('token')
            })
        }
    }, [])

    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        router.push('/')
    }

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: '/rooms', label: 'Rooms', icon: <Shield className="w-4 h-4" /> },
        { href: '/machines', label: 'Machines', icon: <Target className="w-4 h-4" /> },
        { href: '/vpn', label: 'VPN Lab', icon: <Wifi className="w-4 h-4" /> },
        { href: '/pwnbox', label: 'PwnBox', icon: <Monitor className="w-4 h-4" /> },
        { href: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    ]

    const rankColors: Record<string, string> = {
        'Newbie': 'text-slate-400',
        'Script Kiddie': 'text-blue-400',
        'Hacker': 'text-cyber-green',
        'Pro Hacker': 'text-yellow-400',
        'Elite Hacker': 'text-red-400',
    }

    return (
        <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur border-b border-cyber-green/20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border border-cyber-green/50 flex items-center justify-center bg-cyber-green/10">
                            <Terminal className="w-4 h-4 text-cyber-green" />
                        </div>
                        <span className="text-cyber-green font-bold text-lg hidden sm:block">CyberTraining</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${pathname === link.href
                                    ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'
                                    : 'text-slate-400 hover:text-cyber-green hover:bg-cyber-green/5'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Admin Button */}
                                {user.is_superuser || user.is_staff ? (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}/admin/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
                                        title="Admin Panel"
                                    >
                                        <Cpu className="w-4 h-4" />
                                        <span className="hidden sm:inline">Admin</span>
                                    </a>
                                ) : null}
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-white text-sm font-semibold">{user.username}</span>
                                    <span className={`text-xs ${rankColors[user.profile?.rank] || 'text-slate-400'}`}>{user.profile?.rank}</span>
                                </div>
                                <Link href="/profile" className="w-9 h-9 rounded-lg overflow-hidden border border-cyber-green/30 hover:border-cyber-green/60 transition-colors">
                                    <img src={user.profile?.avatar} alt="avatar" className="w-full h-full object-cover" />
                                </Link>
                                <button onClick={logout} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex gap-2">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}/admin/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
                                    title="Admin Panel"
                                >
                                    <Cpu className="w-4 h-4" />
                                    Admin
                                </a>
                                <Link href="/login" className="btn-cyber px-4 py-2 rounded-lg text-sm">Login</Link>
                                <Link href="/register" className="btn-primary px-4 py-2 rounded-lg text-sm text-dark-900 font-bold">Register</Link>
                            </div>
                        )}
                        <button
                            className="md:hidden p-2 text-slate-400 hover:text-cyber-green"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-dark-600 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full transition-colors ${pathname === link.href ? 'bg-cyber-green/10 text-cyber-green' : 'text-slate-400 hover:text-cyber-green'
                                    }`}
                            >
                                {link.icon}{link.label}
                            </Link>
                        ))}
                        {!user && (
                            <div className="pt-2 flex gap-2">
                                <Link href="/login" className="btn-cyber px-4 py-2 rounded text-sm flex-1 text-center">Login</Link>
                                <Link href="/register" className="btn-primary px-4 py-2 rounded text-sm flex-1 text-center text-dark-900 font-bold">Register</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
