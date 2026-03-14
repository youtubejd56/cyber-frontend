'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { Trophy, Flag, Target, Star, ChevronRight, Clock, Lock } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { authAPI, roomsAPI, machinesAPI } from '../../lib/api'

// Hexagon SVG clip
const HEX_CLIP = `polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)`

const rankColors: Record<string, string> = {
    'Newbie': '#94a3b8',
    'Script Kiddie': '#60a5fa',
    'Hacker': '#9fef00',
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

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [rooms, setRooms] = useState<any[]>([])
    const [machines, setMachines] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'foryou' | 'inprogress' | 'favorites'>('foryou')

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) { router.push('/login'); return }
        Promise.all([authAPI.getMe(), roomsAPI.getAll(), machinesAPI.getAll()])
            .then(([uRes, rRes, mRes]) => {
                setUser(uRes.data)
                setRooms(rRes.data)
                setMachines(mRes.data)
            })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-[#111827] flex items-center justify-center">
            <div className="text-[#9fef00] text-lg font-mono animate-pulse">Loading...</div>
        </div>
    )
    if (!user) return null

    const rank = user.profile?.rank || 'Newbie'
    const points = user.profile?.points || 0
    const avatar = user.profile?.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + user.username
    const rankColor = rankColors[rank] || '#9fef00'
    const progressPct = Math.min(100, (points / (nextRankThresholds[rank] || 500)) * 100)
    const flagsCaptured = user.flags_captured || 0
    const roomsJoined = (user.rooms_joined || []).length
    const joinedRoomIds = new Set(user.rooms_joined || [])

    const inProgressRooms = rooms.filter((r: any) => joinedRoomIds.has(r.id)).slice(0, 6)
    const forYouMachines = machines.filter((m: any) => !m.retired).slice(0, 6)
    const featuredMachine = machines[0]
    const seasonalMachine = machines.find((m: any) => !m.retired) || machines[1]

    return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 flex-shrink-0" style={{ clipPath: HEX_CLIP, background: rankColor + '22', outline: `2px solid ${rankColor}55` }}>
                        <img src={avatar} alt="avatar" className="w-full h-full object-cover" style={{ clipPath: HEX_CLIP }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1f2937] text-gray-400 border border-gray-700">FREE</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded border" style={{ color: rankColor, borderColor: rankColor + '60', background: rankColor + '15' }}>{rank.toUpperCase()}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
                    </div>
                    <div className="ml-auto">
                        <button className="px-4 py-2 bg-[#1f2937] border border-gray-700 rounded text-sm text-white hover:border-gray-500 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Main 2-col layout */}
                <div className="grid lg:grid-cols-3 gap-5">
                    {/* Left col: rank + stats */}
                    <div className="space-y-4">
                        {/* Rank Card */}
                        <div className="bg-[#1f2937] rounded-xl p-6 border border-gray-800 flex flex-col items-center">
                            <div
                                className="relative w-28 h-32 flex items-center justify-center mb-3"
                                style={{ clipPath: HEX_CLIP, background: '#111827', border: `2px solid ${rankColor}` }}
                            >
                                <img src={avatar} alt="avatar" className="w-24 h-28 object-cover" style={{ clipPath: HEX_CLIP }} />
                            </div>
                            <p className="text-gray-400 text-xs mb-1">Hack The Box Rank</p>
                            <h2 className="text-2xl font-bold text-white mb-3">{rank}</h2>

                            {/* Content Ownership / Progress */}
                            <div className="w-full">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>XP Progress</span>
                                    <span>{progressPct.toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-[#111827] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, backgroundColor: rankColor }} />
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
                            <div className="flex divide-x divide-gray-800">
                                {[
                                    { label: 'Points', value: points },
                                    { label: 'Flags', value: flagsCaptured },
                                    { label: 'Rooms', value: roomsJoined },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex-1 p-4 text-center">
                                        <div className="text-xl font-bold text-white font-mono">{value}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Solve CTA */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                            <p className="text-[#9fef00] font-bold text-sm mb-1">Solve 1 flag to get promoted!</p>
                            <p className="text-gray-500 text-xs mb-3">Earn points and rise in rank by completing challenges</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-[#111827] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, flagsCaptured * 100)}%`, background: `repeating-linear-gradient(90deg, #9fef00 0px, #9fef00 6px, transparent 6px, transparent 10px)` }} />
                                </div>
                                <span className="text-xs text-gray-400 font-mono">{flagsCaptured} / 1</span>
                            </div>
                        </div>

                        {/* Account info */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Username</span>
                                <span className="text-white font-mono">{user.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email</span>
                                <span className="text-white font-mono truncate max-w-[160px]">{user.email || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Joined</span>
                                <span className="text-white font-mono">{user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right col: season progress + content tabs */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Season Progress Card */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-5">
                            <h3 className="text-white font-bold mb-4">Season Progress</h3>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {[
                                    { label: 'Points', value: points || '—' },
                                    { label: 'User Solves', value: flagsCaptured || '—' },
                                    { label: 'System Solves', value: roomsJoined || '—' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">{label}</div>
                                        <div className="text-xl font-bold text-white font-mono">{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Season rank row */}
                            <div className="flex items-center gap-4 bg-[#111827] rounded-lg p-3">
                                <div className="w-10 h-10 flex items-center justify-center" style={{ clipPath: HEX_CLIP, background: rankColor + '22' }}>
                                    <Trophy className="w-5 h-5" style={{ color: rankColor }} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Season Rank</div>
                                    <div className="text-white font-bold">{rank}</div>
                                </div>
                                <div className="ml-auto">
                                    <button className="text-xs text-[#9fef00] hover:underline">View Rewards →</button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>{points} pts</span>
                                    <span>{nextRankThresholds[rank]} pts for next rank</span>
                                </div>
                                <div className="h-2 bg-[#111827] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, backgroundColor: rankColor }} />
                                </div>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
                            <div className="flex border-b border-gray-800">
                                {(['foryou', 'inprogress', 'favorites'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'text-white border-b-2 border-[#9fef00] bg-[#111827]' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {tab === 'foryou' ? 'For you' : tab === 'inprogress' ? `In progress ${inProgressRooms.length > 0 ? `(${inProgressRooms.length})` : ''}` : 'Favorites'}
                                    </button>
                                ))}
                            </div>

                            <div className="p-4">
                                {activeTab === 'foryou' && (
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {forYouMachines.map((m: any) => (
                                            <Link key={m.id} href={`/machines/${m.id}`} className="bg-[#111827] rounded-lg overflow-hidden border border-gray-800 hover:border-[#9fef00]/40 transition-colors group">
                                                <div className="h-28 relative overflow-hidden">
                                                    <img src={m.image} alt={m.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
                                                    <div className="absolute top-2 left-2">
                                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${m.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : m.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : m.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>{m.difficulty}</span>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="font-bold text-white text-sm group-hover:text-[#9fef00] transition-colors">{m.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{m.os}</div>
                                                </div>
                                            </Link>
                                        ))}
                                        {forYouMachines.length === 0 && (
                                            <div className="col-span-3 text-center text-gray-500 py-10">
                                                <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                                <p>No machines available</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'inprogress' && (
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {inProgressRooms.map((r: any) => (
                                            <Link key={r.id} href={`/rooms/${r.id}`} className="bg-[#111827] rounded-lg overflow-hidden border border-gray-800 hover:border-[#9fef00]/40 transition-colors group">
                                                <div className="h-28 relative overflow-hidden">
                                                    <img src={r.image || 'https://picsum.photos/seed/' + r.id + '/400/200'} alt={r.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
                                                    <button className="absolute top-2 right-2 w-5 h-5 bg-gray-900/80 rounded-full flex items-center justify-center text-gray-400 hover:text-white text-xs">×</button>
                                                </div>
                                                <div className="p-3">
                                                    <div className="font-bold text-white text-sm group-hover:text-[#9fef00] transition-colors">{r.title}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{r.category}</div>
                                                </div>
                                            </Link>
                                        ))}
                                        {inProgressRooms.length === 0 && (
                                            <div className="col-span-3 text-center text-gray-500 py-10">
                                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                                <p className="text-sm">You haven't joined any rooms yet</p>
                                                <Link href="/rooms" className="text-[#9fef00] text-xs mt-1 inline-block hover:underline">Browse rooms →</Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'favorites' && (
                                    <div className="text-center text-gray-500 py-10">
                                        <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm">No favorites yet</p>
                                        <p className="text-xs mt-1">Star machines and rooms to find them here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
