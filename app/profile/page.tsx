'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { Trophy, Flag, Target, Star, ChevronRight, Clock, Lock, Crown, Gem, Award, Shield, Zap, Camera, Download } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { authAPI, roomsAPI, machinesAPI, framesAPI, certificateAPI } from '../../lib/api'

// Hexagon SVG clip
const HEX_CLIP = `polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)`

const rankColors: Record<string, string> = {
    'Newbie': '#94a3b8',
    'Script Kiddie': '#60a5fa',
    'Hacker': '#9fef00',
    'Pro Hacker': '#ffd700',
    'Elite Hacker': '#ff4060',
}

// Frame colors based on frame type
const frameStyles: Record<string, { border: string; gradient: string; glow: string; shadow: string }> = {
    'default': { border: '#374151', gradient: 'linear-gradient(135deg, #374151, #1f2937)', glow: '0 0 0', shadow: '0 0 0' },
    'bronze': { border: '#cd7f32', gradient: 'linear-gradient(135deg, #cd7f32, #8b4513)', glow: '0 0 15px rgba(205, 127, 50, 0.5)', shadow: '0 4px 20px rgba(205, 127, 50, 0.3)' },
    'silver': { border: '#c0c0c0', gradient: 'linear-gradient(135deg, #e8e8e8, #a8a8a8)', glow: '0 0 20px rgba(192, 192, 192, 0.6)', shadow: '0 4px 25px rgba(192, 192, 192, 0.4)' },
    'gold': { border: '#ffd700', gradient: 'linear-gradient(135deg, #ffd700, #ffaa00)', glow: '0 0 25px rgba(255, 215, 0, 0.6)', shadow: '0 4px 30px rgba(255, 215, 0, 0.4)' },
    'platinum': { border: '#e5e4e2', gradient: 'linear-gradient(135deg, #e5e4e2, #8e8e8e)', glow: '0 0 30px rgba(229, 228, 226, 0.7)', shadow: '0 4px 35px rgba(229, 228, 226, 0.5)' },
    'diamond': { border: '#b9f2ff', gradient: 'linear-gradient(135deg, #b9f2ff, #4fc3f7)', glow: '0 0 35px rgba(79, 195, 247, 0.7)', shadow: '0 4px 40px rgba(79, 195, 247, 0.5)' },
    'conqueror': { border: '#ff4060', gradient: 'linear-gradient(135deg, #ff4060, #ff6b6b, #ffd700)', glow: '0 0 40px rgba(255, 64, 96, 0.8)', shadow: '0 4px 50px rgba(255, 64, 96, 0.6)' },
}

const nextRankThresholds: Record<string, number> = {
    'Newbie': 500,
    'Script Kiddie': 2000,
    'Hacker': 5000,
    'Pro Hacker': 10000,
    'Elite Hacker': 99999,
}

// Frame reward thresholds
const frameRewards = [
    { frame_id: 'bronze', name: 'Bronze', icon: '🥉', points: 50, color: '#cd7f32' },
    { frame_id: 'silver', name: 'Silver', icon: '🥈', points: 200, color: '#c0c0c0' },
    { frame_id: 'gold', name: 'Gold', icon: '🥇', points: 400, color: '#ffd700' },
    { frame_id: 'platinum', name: 'Platinum', icon: '💎', points: 600, color: '#e5e4e2' },
    { frame_id: 'diamond', name: 'Diamond', icon: '💠', points: 800, color: '#4fc3f7' },
    { frame_id: 'conqueror', name: 'Conqueror', icon: '👑', points: 1000, color: '#ff4060' },
]

// Avatar character options for profile customization
const avatarOptions = [
    { seed: 'hacker1', name: 'Cyber Ninja' },
    { seed: 'ghost', name: 'Ghost' },
    { seed: 'phantom', name: 'Phantom' },
    { seed: 'shadow', name: 'Shadow' },
    { seed: 'storm', name: 'Storm' },
    { seed: 'blaze', name: 'Blaze' },
    { seed: 'frost', name: 'Frost' },
    { seed: 'thunder', name: 'Thunder' },
    { seed: 'neon', name: 'Neon' },
    { seed: 'cipher', name: 'Cipher' },
    { seed: 'zero', name: 'Zero' },
    { seed: 'nexus', name: 'Nexus' },
    { seed: 'pixel', name: 'Pixel' },
    { seed: 'byte', name: 'Byte' },
    { seed: 'node', name: 'Node' },
    { seed: 'root', name: 'Root' },
    { seed: 'admin', name: 'Admin' },
    { seed: 'system', name: 'System' },
    { seed: 'daemon', name: 'Daemon' },
    { seed: 'kernel', name: 'Kernel' },
    { seed: 'vector', name: 'Vector' },
    { seed: 'matrix', name: 'Matrix' },
    { seed: 'proxy', name: 'Proxy' },
    { seed: 'firewall', name: 'Firewall' },
    { seed: 'malware', name: 'Malware' },
    { seed: 'exploit', name: 'Exploit' },
    { seed: 'payload', name: 'Payload' },
    { seed: 'shellcode', name: 'Shellcode' },
    { seed: 'buffer', name: 'Buffer' },
    { seed: 'overflow', name: 'Overflow' },
    { seed: 'injection', name: 'Injection' },
    { seed: 'backdoor', name: 'Backdoor' },
    { seed: 'trojan', name: 'Trojan' },
    { seed: 'worm', name: 'Worm' },
    { seed: 'virus', name: 'Virus' },
    { seed: 'keylogger', name: 'Keylogger' },
    { seed: 'sniffer', name: 'Sniffer' },
    { seed: 'spoofer', name: 'Spoofer' },
    { seed: 'cracker', name: 'Cracker' },
    { seed: 'anon', name: 'Anonymous' },
    { seed: 'legion', name: 'Legion' },
    { seed: 'lizard', name: 'Lizard' },
    { seed: 'anonymous', name: 'Anon' },
    { seed: 'h4ck3r', name: 'H4ck3r' },
    { seed: 'n3trunner', name: 'Netrunner' },
    { seed: 'cyb3r', name: 'Cyb3r' },
    { seed: 'dr4g0n', name: 'Dr4g0n' },
    { seed: 'ph03nix', name: 'Ph03nix' },
    { seed: 'titan', name: 'Titan' },
    { seed: 'vortex', name: 'Vortex' },
    { seed: 'quantum', name: 'Quantum' },
    { seed: 'neural', name: 'Neural' },
    { seed: 'synthetic', name: 'Synthetic' },
    { seed: 'android', name: 'Android' },
    { seed: 'cyborg', name: 'Cyborg' },
    { seed: 'reaper', name: 'Reaper' },
    { seed: 'spectre', name: 'Spectre' },
]

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [rooms, setRooms] = useState<any[]>([])
    const [machines, setMachines] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'foryou' | 'inprogress' | 'favorites'>('foryou')
    const [showFrameModal, setShowFrameModal] = useState(false)
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [myFrames, setMyFrames] = useState<any>(null)
    const [currentFrame, setCurrentFrame] = useState('default')
    const [certificate, setCertificate] = useState<any>(null)
    const [certEligibility, setCertEligibility] = useState<any>(null)

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) { router.push('/login'); return }
        Promise.all([authAPI.getMe(), roomsAPI.getAll(), machinesAPI.getAll(), framesAPI.getMyFrames()])
            .then(([uRes, rRes, mRes, fRes]) => {
                setUser(uRes.data)
                setRooms(rRes.data)
                setMachines(mRes.data)
                setMyFrames(fRes.data)
                setCurrentFrame(fRes.data.current_frame || 'default')
            })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false))

        // Check certificate eligibility
        certificateAPI.getEligibility().then(res => setCertEligibility(res.data)).catch(() => { })
        certificateAPI.getMyCertificate().then(res => setCertificate(res.data)).catch(() => { })
    }, [])

    const handleSelectFrame = async (frameId: string) => {
        try {
            await framesAPI.selectFrame(frameId)
            setCurrentFrame(frameId)
            setShowFrameModal(false)
        } catch (error) {
            console.error('Failed to select frame:', error)
        }
    }

    const handleSelectAvatar = async (seed: string) => {
        try {
            const newAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`
            await authAPI.updateAvatar(seed)
            setUser((prev: any) => ({
                ...prev,
                profile: { ...prev.profile, avatar: newAvatar }
            }))
            setShowAvatarModal(false)
        } catch (error) {
            console.error('Failed to update avatar:', error)
        }
    }

    const handleGenerateCertificate = async () => {
        try {
            const res = await certificateAPI.generate()
            setCertificate(res.data)
        } catch (error) {
            console.error('Failed to generate certificate:', error)
        }
    }

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
    const unlockedFrames = myFrames?.unlocked_frames || ['default']

    const currentFrameStyle = frameStyles[currentFrame] || frameStyles.default

    const inProgressRooms = rooms.filter((r: any) => joinedRoomIds.has(r.id)).slice(0, 6)
    const forYouMachines = machines.filter((m: any) => !m.retired).slice(0, 6)

    return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="relative w-20 h-20 flex-shrink-0 rounded-xl"
                        style={{
                            background: currentFrameStyle.gradient,
                            boxShadow: currentFrameStyle.shadow,
                            padding: '3px'
                        }}
                    >
                        <div className="w-full h-full rounded-lg overflow-hidden" style={{ clipPath: HEX_CLIP, background: '#111827' }}>
                            <img src={avatar} alt="avatar" className="w-full h-full object-cover" style={{ clipPath: HEX_CLIP }} />
                        </div>
                        {/* Frame glow effect */}
                        <div
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{ boxShadow: currentFrameStyle.glow }}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1f2937] text-gray-400 border border-gray-700">FREE</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded border" style={{ color: rankColor, borderColor: rankColor + '60', background: rankColor + '15' }}>{rank.toUpperCase()}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={() => setShowFrameModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-[#9fef00] to-[#7acc00] border-0 rounded text-sm text-black font-bold hover:from-[#afff00] hover:to-[#9fef00] transition-all"
                        >
                            🎨 Change Frame
                        </button>
                        <button
                            onClick={() => setShowAvatarModal(true)}
                            className="px-4 py-2 bg-[#1f2937] border border-gray-700 rounded text-sm text-white hover:border-gray-500 transition-colors flex items-center gap-2"
                        >
                            <Camera className="w-4 h-4" />
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
                                className="relative w-28 h-32 flex items-center justify-center mb-3 rounded-xl"
                                style={{
                                    background: currentFrameStyle.gradient,
                                    boxShadow: currentFrameStyle.shadow,
                                    padding: '4px'
                                }}
                            >
                                <div className="w-full h-full rounded-lg overflow-hidden" style={{ clipPath: HEX_CLIP, background: '#111827' }}>
                                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" style={{ clipPath: HEX_CLIP }} />
                                </div>
                                <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: currentFrameStyle.glow }} />
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

                        {/* Certificate Card */}
                        {certEligibility && (
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <h3 className="text-white font-bold">Certificate</h3>
                                </div>

                                {certificate?.has_certificate ? (
                                    <div className="space-y-3">
                                        <p className="text-green-400 text-sm">✓ You have earned your certificate!</p>
                                        <div className="bg-[#111827] rounded-lg p-3 space-y-1">
                                            <p className="text-xs text-gray-400">Certificate ID</p>
                                            <p className="text-white font-mono text-sm">{certificate.certificate_id}</p>
                                        </div>
                                        <a
                                            href={certificate.download_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg text-black font-bold text-sm transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Certificate
                                        </a>
                                    </div>
                                ) : certEligibility?.eligible ? (
                                    <div className="space-y-2">
                                        <p className="text-green-400 text-sm">🎉 You are eligible! Generate your certificate now.</p>
                                        <button
                                            onClick={handleGenerateCertificate}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg text-black font-bold text-sm transition-all"
                                        >
                                            <Award className="w-4 h-4" />
                                            Generate Certificate
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-gray-400 text-sm">{certEligibility.message || 'Complete all machines to earn your certificate!'}</p>
                                        <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 rounded-full transition-all"
                                                style={{ width: `${certEligibility.total ? (certEligibility.completed / certEligibility.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 text-center">{certEligibility.completed || 0} / {certEligibility.total || 0} machines</p>
                                    </div>
                                )}
                            </div>
                        )}
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
                                    <button
                                        onClick={() => setShowFrameModal(true)}
                                        className="text-xs text-[#9fef00] hover:underline"
                                    >
                                        View Rewards →
                                    </button>
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

            {/* Frame Selection Modal */}
            {showFrameModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1f2937] rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">🏅 Frame Collection</h2>
                                    <p className="text-gray-400 text-sm mt-1">Unlock frames by earning points!</p>
                                </div>
                                <button
                                    onClick={() => setShowFrameModal(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mt-4 bg-[#111827] rounded-lg p-3 flex items-center justify-between">
                                <span className="text-gray-400">Your Points:</span>
                                <span className="text-2xl font-bold text-[#9fef00]">{points}</span>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {/* Default Frame */}
                            <button
                                onClick={() => handleSelectFrame('default')}
                                className={`relative p-4 rounded-xl border-2 transition-all ${currentFrame === 'default'
                                    ? 'border-[#9fef00] bg-[#9fef00]/10'
                                    : 'border-gray-700 hover:border-gray-500 bg-[#111827]'
                                    }`}
                            >
                                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gray-700 flex items-center justify-center">
                                    <span className="text-3xl">⬜</span>
                                </div>
                                <p className="text-white font-bold text-center">Default</p>
                                <p className="text-gray-500 text-xs text-center">Free</p>
                                {currentFrame === 'default' && (
                                    <div className="absolute top-2 right-2 text-[#9fef00]">✓</div>
                                )}
                            </button>

                            {/* Frame Rewards */}
                            {frameRewards.map((frame) => {
                                const isUnlocked = unlockedFrames.includes(frame.frame_id)
                                const canUnlock = points >= frame.points
                                const style = frameStyles[frame.frame_id]

                                return (
                                    <button
                                        key={frame.frame_id}
                                        onClick={() => isUnlocked && handleSelectFrame(frame.frame_id)}
                                        disabled={!isUnlocked}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${currentFrame === frame.frame_id
                                            ? 'border-[#9fef00] bg-[#9fef00]/10'
                                            : isUnlocked
                                                ? 'border-gray-500 hover:border-gray-300 bg-[#111827]'
                                                : 'border-gray-800 bg-[#111827] opacity-60'
                                            }`}
                                        style={isUnlocked ? {
                                            background: `${style.border}15`,
                                            borderColor: style.border
                                        } : {}}
                                    >
                                        <div
                                            className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                                            style={isUnlocked ? {
                                                background: style.gradient,
                                                boxShadow: style.glow
                                            } : { background: '#374151' }}
                                        >
                                            <span className="text-3xl">{frame.icon}</span>
                                        </div>
                                        <p className="text-white font-bold text-center">{frame.name}</p>
                                        <p className={`text-xs text-center ${canUnlock ? 'text-green-400' : 'text-gray-500'}`}>
                                            {isUnlocked ? 'Unlocked!' : `${frame.points} pts`}
                                        </p>

                                        {!isUnlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                                                <Lock className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}

                                        {currentFrame === frame.frame_id && (
                                            <div className="absolute top-2 right-2 text-[#9fef00] font-bold">✓</div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Progress Info */}
                        <div className="p-6 border-t border-gray-700">
                            <h3 className="text-white font-bold mb-3">Next Frame Progress</h3>
                            <div className="space-y-2">
                                {frameRewards.filter(f => !unlockedFrames.includes(f.frame_id)).slice(0, 1).map((frame) => (
                                    <div key={frame.frame_id} className="bg-[#111827] rounded-lg p-3">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Next: {frame.name}</span>
                                            <span className="text-white">{points} / {frame.points} pts</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(100, (points / frame.points) * 100)}%`,
                                                    background: frame.color
                                                }}
                                            />
                                        </div>
                                        <p className="text-gray-500 text-xs mt-2">
                                            Need {frame.points - points} more points to unlock {frame.name} frame!
                                        </p>
                                    </div>
                                ))}
                                {frameRewards.every(f => unlockedFrames.includes(f.frame_id)) && (
                                    <div className="bg-gradient-to-r from-[#ffd700]/20 to-[#ff4060]/20 rounded-lg p-4 text-center">
                                        <Crown className="w-8 h-8 mx-auto mb-2 text-[#ffd700]" />
                                        <p className="text-white font-bold">You've unlocked all frames!</p>
                                        <p className="text-gray-400 text-sm">You're a true Conqueror! 👑</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1f2937] rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">🎭 Choose Your Avatar</h2>
                                    <p className="text-gray-400 text-sm mt-1">Select a character for your profile!</p>
                                </div>
                                <button
                                    onClick={() => setShowAvatarModal(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {avatarOptions.map((option) => (
                                <button
                                    key={option.seed}
                                    onClick={() => handleSelectAvatar(option.seed)}
                                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${avatar === `https://api.dicebear.com/7.x/pixel-art/svg?seed=${option.seed}`
                                        ? 'border-[#9fef00] bg-[#9fef00]/10'
                                        : 'border-gray-700 hover:border-gray-500 bg-[#111827]'
                                        }`}
                                >
                                    <img
                                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${option.seed}`}
                                        alt={option.name}
                                        className="w-16 h-16 mx-auto mb-2"
                                    />
                                    <p className="text-white text-xs font-bold text-center">{option.name}</p>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 border-t border-gray-700">
                            <p className="text-gray-400 text-sm text-center">
                                More avatars coming soon! 🎮
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
