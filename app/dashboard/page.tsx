'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { Shield, Target, Trophy, Zap, TrendingUp, Flag, Clock, ChevronRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { authAPI, roomsAPI, machinesAPI, statsAPI } from '../../lib/api'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [rooms, setRooms] = useState<any[]>([])
    const [machines, setMachines] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) { router.push('/login'); return }

        Promise.all([
            authAPI.getMe(),
            roomsAPI.getAll(),
            machinesAPI.getAll(),
            statsAPI.get(),
        ]).then(([userRes, roomsRes, machinesRes, statsRes]) => {
            setUser(userRes.data)
            setRooms(roomsRes.data.slice(0, 4))
            setMachines(machinesRes.data.slice(0, 4))
            setStats(statsRes.data)
        }).catch(() => router.push('/login')).finally(() => setLoading(false))
    }, [])

    const rankColors: Record<string, string> = {
        'Newbie': '#94a3b8',
        'Script Kiddie': '#60a5fa',
        'Hacker': '#00ff41',
        'Pro Hacker': '#ffd700',
        'Elite Hacker': '#ff4060',
    }

    const nextRankThresholds: Record<string, number> = {
        'Newbie': 500,
        'Script Kiddie': 2000,
        'Hacker': 5000,
        'Pro Hacker': 10000,
        'Elite Hacker': 99999,
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-cyber-green text-xl font-mono animate-pulse">Loading dashboard...</div>
            </div>
        )
    }

    const progressToNextRank = user?.profile?.points ? Math.min(100, (user.profile.points / (nextRankThresholds[user.profile.rank] || 500)) * 100) : 0

    return (
        <div className="min-h-screen bg-dark-900 grid-bg">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Banner */}
                <div className="cyber-card rounded-xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.profile?.avatar}
                            alt="avatar"
                            className="w-16 h-16 rounded-xl border-2 border-cyber-green/40"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-white">Welcome back, <span className="text-cyber-green">{user?.username}</span></h1>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <span
                                    className="text-sm font-semibold px-2 py-0.5 rounded"
                                    style={{ color: rankColors[user?.profile?.rank] || '#94a3b8', background: `${rankColors[user?.profile?.rank] || '#94a3b8'}22`, border: `1px solid ${rankColors[user?.profile?.rank] || '#94a3b8'}44` }}
                                >
                                    {user?.profile?.rank}
                                </span>
                                <span className="text-slate-400 text-sm">{user?.profile?.points?.toLocaleString()} points</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/rooms" className="btn-cyber px-4 py-2 rounded-lg text-sm">Browse Rooms</Link>
                        <Link href="/machines" className="btn-primary px-4 py-2 rounded-lg text-sm text-dark-900 font-bold">Hack Machines</Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Points', value: user?.profile?.points?.toLocaleString() || '0', icon: <Zap className="w-5 h-5" />, color: 'text-cyber-green', bg: 'bg-cyber-green/10' },
                        { label: 'Flags Captured', value: user?.flags_captured || '0', icon: <Flag className="w-5 h-5" />, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10' },
                        { label: 'Rooms Joined', value: user?.rooms_joined?.length || '0', icon: <Shield className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        { label: 'Global Rank', value: `#${Math.floor(Math.random() * 500) + 1}`, icon: <Trophy className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    ].map((stat, i) => (
                        <div key={i} className="cyber-card rounded-xl p-5">
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Rank Progress */}
                <div className="cyber-card rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-white font-semibold">Rank Progress</h3>
                            <p className="text-slate-500 text-sm">{user?.profile?.points} / {nextRankThresholds[user?.profile?.rank]} points to next rank</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm">{user?.profile?.rank}</span>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className={`text-sm font-semibold`} style={{ color: rankColors[user?.profile?.rank] }}>
                                {user?.profile?.rank === 'Elite Hacker' ? 'MAX' : Object.keys(nextRankThresholds)[Object.keys(nextRankThresholds).indexOf(user?.profile?.rank) + 1]}
                            </span>
                        </div>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                        <div
                            className="progress-bar h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${progressToNextRank}%` }}
                        />
                    </div>
                    <div className="text-right text-cyber-green text-xs mt-1">{Math.round(progressToNextRank)}%</div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Rooms */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Shield className="w-5 h-5 text-cyber-green" /> Featured Rooms
                            </h2>
                            <Link href="/rooms" className="text-cyber-green text-sm hover:underline">See all →</Link>
                        </div>
                        <div className="space-y-3">
                            {rooms.map((room: any) => (
                                <Link key={room.id} href={`/rooms/${room.id}`} className="cyber-card rounded-xl p-4 flex items-center justify-between group">
                                    <div>
                                        <h3 className="text-white font-semibold text-sm group-hover:text-cyber-green transition-colors">{room.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded badge-${room.difficulty.toLowerCase()}`}>{room.difficulty}</span>
                                            <span className="text-slate-500 text-xs">{room.members_count?.toLocaleString()} members</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyber-green transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Machines */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Target className="w-5 h-5 text-cyber-cyan" /> Active Machines
                            </h2>
                            <Link href="/machines" className="text-cyber-green text-sm hover:underline">See all →</Link>
                        </div>
                        <div className="space-y-3">
                            {machines.map((machine: any) => (
                                <Link key={machine.id} href={`/machines/${machine.id}`} className="cyber-card rounded-xl p-4 flex items-center justify-between group">
                                    <div>
                                        <h3 className="text-white font-semibold text-sm group-hover:text-cyber-green transition-colors">{machine.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded badge-${machine.os.toLowerCase()}`}>{machine.os}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded badge-${machine.difficulty.toLowerCase()}`}>{machine.difficulty}</span>
                                            <span className="text-slate-500 text-xs">{machine.total_points} pts</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-500 text-xs">{machine.solves_count?.toLocaleString()} solves</div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyber-green transition-colors ml-auto mt-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Platform Stats */}
                {stats && (
                    <div className="mt-8 cyber-card rounded-xl p-6">
                        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyber-green" /> Platform Stats
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Hackers', value: stats.total_users },
                                { label: 'Total Rooms', value: stats.total_rooms },
                                { label: 'Total Machines', value: stats.total_machines },
                                { label: 'Flags Captured', value: stats.total_flags_captured },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-bold text-cyber-green">{s.value}</div>
                                    <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
