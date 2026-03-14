'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Star, Users, CheckCircle, Circle, Flag, Lock, ChevronLeft, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import Navbar from '../../../components/Navbar'
import { roomsAPI, authAPI } from '../../../lib/api'

export default function RoomDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [room, setRoom] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [joined, setJoined] = useState(false)
    const [flags, setFlags] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            roomsAPI.getOne(id as string),
            Cookies.get('token') ? authAPI.getMe() : Promise.resolve(null)
        ]).then(([roomRes, userRes]) => {
            setRoom(roomRes.data)
            if (userRes) {
                setUser(userRes.data)
                setJoined(userRes.data.rooms_joined?.includes(parseInt(id as string)))
            }
        }).finally(() => setLoading(false))
    }, [id])

    const handleJoin = async () => {
        if (!Cookies.get('token')) { router.push('/login'); return }
        try {
            await roomsAPI.join(id as string)
            setJoined(true)
            toast.success('Joined room! Good luck, hacker.')
        } catch {
            toast.error('Failed to join room')
        }
    }

    const handleSubmitFlag = async (taskId: string) => {
        if (!Cookies.get('token')) { router.push('/login'); return }
        const flag = flags[taskId]?.trim()
        if (!flag) { toast.error('Enter a flag first'); return }
        setSubmitting(taskId)
        try {
            const res = await roomsAPI.submitFlag(id as string, taskId, flag)
            if (res.data.correct) {
                toast.success(`🎉 ${res.data.message}`)
                // Clear the flag input
                setFlags(prev => ({ ...prev, [taskId]: '' }))
                // Refresh room to get updated solved_tasks
                const roomRes = await roomsAPI.getOne(id as string)
                setRoom(roomRes.data)
                // Refresh user to get updated points
                authAPI.getMe().then(r => setUser(r.data))
            } else {
                toast.error('❌ Wrong answer! Try again.')
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message)
            } else {
                toast.error('Submission error')
            }
        } finally {
            setSubmitting(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900">
                <Navbar />
                <div className="flex items-center justify-center py-40 text-cyber-green animate-pulse">Loading room...</div>
            </div>
        )
    }

    if (!room) return null

    const solvedTasks = room?.solved_tasks || []

    return (
        <div className="min-h-screen bg-dark-900 grid-bg">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Back */}
                <Link href="/rooms" className="flex items-center gap-1 text-slate-500 hover:text-cyber-green text-sm mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Rooms
                </Link>

                {/* Room Header */}
                <div className="cyber-card rounded-xl overflow-hidden mb-8">
                    <div className="h-56 relative">
                        <img src={room.image} alt={room.title} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs px-2 py-1 rounded badge-${room.difficulty.toLowerCase()}`}>{room.difficulty}</span>
                                <span className="text-xs bg-dark-800/80 text-cyber-cyan px-2 py-1 rounded">{room.category}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">{room.title}</h1>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-400 mb-6">{room.description}</p>
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <span className="flex items-center gap-1 text-slate-400"><Users className="w-4 h-4" />{room.members_count?.toLocaleString()} members</span>
                            <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4" />{room.rating}/5</span>
                            <span className="text-slate-400">{room.tasks?.length} tasks</span>
                            <span className="flex gap-1 flex-wrap">
                                {room.tags?.map((t: string) => (
                                    <span key={t} className="text-xs bg-dark-700 border border-dark-600 text-slate-400 px-2 py-0.5 rounded">#{t}</span>
                                ))}
                            </span>
                        </div>
                        {!joined ? (
                            <button onClick={handleJoin} className="mt-6 btn-primary px-8 py-3 rounded-lg font-bold text-dark-900">
                                Join Room
                            </button>
                        ) : (
                            <div className="mt-6 flex items-center gap-2 text-cyber-green text-sm">
                                <CheckCircle className="w-4 h-4" /> You have joined this room
                            </div>
                        )}
                    </div>
                </div>

                {/* Tasks */}
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-cyber-green" /> Tasks ({solvedTasks.length}/{room.tasks?.length} completed)
                </h2>

                <div className="space-y-4">
                    {room.tasks?.map((task: any, idx: number) => {
                        // Get the previous task ID for sequential locking
                        const prevTask = idx > 0 ? room.tasks[idx - 1] : null
                        const solved = solvedTasks.includes(task.id)
                        // Task is locked if: not joined OR previous task not solved
                        const prevTaskSolved = !prevTask || solvedTasks.includes(prevTask.id)
                        const locked = !joined || !prevTaskSolved

                        return (
                            <div key={task.id} className={`cyber-card rounded-xl p-6 ${solved ? 'border-cyber-green/40' : ''}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${solved ? 'bg-cyber-green/20 text-cyber-green' : 'bg-dark-700 text-slate-500'}`}>
                                        {solved ? <CheckCircle className="w-4 h-4" /> : locked ? <Lock className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className={`font-semibold ${solved ? 'text-cyber-green' : 'text-white'}`}>
                                                    Task {idx + 1}: {task.title}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                                            </div>
                                            <span className="text-cyber-green text-sm font-mono font-bold flex-shrink-0">+{task.points} pts</span>
                                        </div>

                                        {!locked && !solved && (
                                            <div className="mt-4 flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="THM{flag_here}"
                                                    value={flags[task.id] || ''}
                                                    onChange={e => setFlags({ ...flags, [task.id]: e.target.value })}
                                                    onKeyDown={e => e.key === 'Enter' && handleSubmitFlag(task.id)}
                                                    className="flex-1 bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg px-4 py-2 text-white text-sm font-mono outline-none placeholder-slate-600"
                                                />
                                                <button
                                                    onClick={() => handleSubmitFlag(task.id)}
                                                    disabled={submitting === task.id}
                                                    className="btn-cyber px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    {submitting === task.id ? 'Checking...' : 'Submit'}
                                                </button>
                                            </div>
                                        )}

                                        {solved && (
                                            <div className="mt-3 text-xs text-cyber-green flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Flag captured! +{task.points} points
                                            </div>
                                        )}

                                        {locked && (
                                            <p className="mt-2 text-slate-600 text-xs flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Join the room to access this task
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
