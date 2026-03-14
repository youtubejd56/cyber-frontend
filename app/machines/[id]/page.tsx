'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Star, Send, Lock, CheckCircle, Heart, Share2, X, Monitor, Cloud } from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import Navbar from '../../../components/Navbar'
import { machinesAPI, authAPI, instancesAPI } from '../../../lib/api'

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
            <button key={i} onClick={() => onChange(i)} className={`text-xl transition-colors ${i <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400/60'}`}>★</button>
        ))}
    </div>
)

const diffColor = (d: string) => {
    if (d === 'Easy') return 'text-green-400'
    if (d === 'Medium') return 'text-yellow-400'
    if (d === 'Hard') return 'text-red-400'
    return 'text-purple-400'
}

type TabType = 'play' | 'info' | 'walkthroughs' | 'reviews' | 'activity'

export default function MachineDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [machine, setMachine] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<TabType>('play')
    const [userFlag, setUserFlag] = useState('')
    const [rootFlag, setRootFlag] = useState('')
    const [submitting, setSubmitting] = useState<string | null>(null)
    const [machineRunning, setMachineRunning] = useState(false)
    const [machineStarting, setMachineStarting] = useState(false)
    const [showConnect, setShowConnect] = useState(false)
    const [reviewRating, setReviewRating] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [reviews, setReviews] = useState<{ rating: number; text: string; user: string; date: string }[]>([])
    const [submittingReview, setSubmittingReview] = useState(false)
    const [playMode, setPlayMode] = useState<'adventure' | 'guided'>('adventure')
    const [expandedTask, setExpandedTask] = useState<number | null>(1)
    const [taskAnswers, setTaskAnswers] = useState<Record<number, string>>({})
    const [taskHints, setTaskHints] = useState<Record<number, boolean>>({})
    const [submittingTask, setSubmittingTask] = useState<number | null>(null)
    const [taskSolved, setTaskSolved] = useState<Record<number, boolean>>({})
    const [machineTimer, setMachineTimer] = useState(0)
    const [ratingValue, setRatingValue] = useState(0)

    useEffect(() => {
        Promise.all([
            machinesAPI.getOne(id as string),
            Cookies.get('token') ? authAPI.getMe() : Promise.resolve(null)
        ]).then(([mRes, uRes]) => {
            setMachine(mRes.data)
            if (uRes) setUser(uRes.data)
        }).finally(() => setLoading(false))

        // Check if machine is already running
        if (Cookies.get('token')) {
            instancesAPI.getInstance(id as string).then(res => {
                if (res.data.status === 'running') {
                    setMachineRunning(true)
                    setMachineTimer(0)
                }
            }).catch(() => { })
        }
    }, [id])

    const handleSubmit = async (type: 'user' | 'root') => {
        if (!Cookies.get('token')) { router.push('/login'); return }
        const flag = type === 'user' ? userFlag : rootFlag
        if (!flag?.trim()) { toast.error('Enter a flag first'); return }
        setSubmitting(type)
        try {
            const res = await machinesAPI.submitFlag(id as string, flag.trim(), type)
            if (res.data.correct) {
                toast.success(`🎉 ${res.data.message} +${res.data.points} pts`)
                // Clear the flag input
                if (type === 'user') setUserFlag('')
                else setRootFlag('')
                // Refresh machine data to get updated solved status
                const mRes = await machinesAPI.getOne(id as string)
                setMachine(mRes.data)
                // Refresh user to get updated points
                authAPI.getMe().then((r: any) => setUser(r.data))
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

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (machineRunning) {
            interval = setInterval(() => setMachineTimer(t => t + 1), 1000)
        }
        return () => clearInterval(interval)
    }, [machineRunning])

    const formatTimer = (secs: number) => {
        const h = Math.floor(secs / 3600)
        const m = Math.floor((secs % 3600) / 60)
        const s = secs % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleStartMachine = async () => {
        if (!Cookies.get('token')) { router.push('/login'); return }
        setMachineStarting(true)
        try {
            const res = await instancesAPI.startInstance(id as string)
            if (res.data.success) {
                setMachineRunning(true)
                setMachineTimer(0)
                toast.success(`Machine started! IP: ${res.data.ip}`)
            } else {
                toast.error(res.data.message || 'Failed to start machine')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to start machine')
        } finally {
            setMachineStarting(false)
        }
    }

    const handleStopMachine = async () => {
        try {
            await instancesAPI.stopInstance(id as string)
            setMachineRunning(false)
            setMachineTimer(0)
            toast.success('Machine stopped')
        } catch (err: any) {
            toast.error('Failed to stop machine')
        }
    }

    // Use machine tasks from API or fallback to default
    const defaultTasks = [
        { id: 1, title: '1. Initial Reconnaissance', question: 'Perform nmap scan to discover open ports and services', hint: 'nmap -sC -sV -p- <target_ip>', points: 10 },
        { id: 2, title: '2. Enumerate Services', question: 'Enumerate running services and identify potential attack vectors', hint: 'Check version info, search for exploits', points: 15 },
        { id: 3, title: '3. Find Initial Access', question: 'Find a way to gain initial access to the system', hint: 'Look for weak credentials, vulnerable services', points: 20 },
        { id: 4, title: '4. User Flag', question: 'Locate and submit the user flag', hint: 'user.txt usually in /home/<username>', points: 10 },
        { id: 5, title: '5. Privilege Escalation', question: 'Escalate privileges to root/admin', hint: 'Check sudo, SUID, cron jobs, kernel exploits', points: 25 },
        { id: 6, title: '6. Root Flag', question: 'Capture the root flag!', hint: 'root.txt usually in /root', points: 10 },
    ]
    const machineTasks = (!machine || !machine.tasks || !Array.isArray(machine.tasks) || machine.tasks.length === 0) ? defaultTasks : machine.tasks.map((t: any, idx: number) => ({
        id: idx + 1,
        title: t.title || `Task ${idx + 1}`,
        question: t.question || t.description || '',
        hint: t.hint || '',
        points: t.points || 10
    }))

    const handleSubmitTask = async (taskId: number) => {
        const answer = taskAnswers[taskId]?.trim()
        if (!answer) {
            toast.error('Enter your answer first')
            return
        }

        if (!Cookies.get('token')) {
            router.push('/login')
            return
        }

        setSubmittingTask(taskId)
        try {
            // Use 0-based index for API
            const taskIndex = taskId - 1
            const res = await machinesAPI.submitTask(id as string, taskIndex, answer)

            if (res.data.correct) {
                setTaskSolved((prev: any) => ({ ...prev, [taskId]: true }))
                toast.success(`🎉 ${res.data.message} +${res.data.points} pts`)
                // Refresh user points
                authAPI.getMe().then((r: any) => setUser(r.data))
            } else {
                toast.error('❌ Wrong answer! Try again.')
            }
        } catch (err: any) {
            if (err.response?.data?.error) {
                toast.error(err.response.data.error)
            } else {
                toast.error('Submission error')
            }
        } finally {
            setSubmittingTask(null)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />
            <div className="flex items-center justify-center py-40 text-[#9fef00] animate-pulse">Loading machine...</div>
        </div>
    )
    if (!machine) return null

    const tabs: { key: TabType; label: string }[] = [
        { key: 'play', label: 'Play Machine' },
        { key: 'info', label: 'Machine Info' },
        { key: 'walkthroughs', label: 'Walkthroughs' },
        { key: 'reviews', label: 'Reviews' },
        { key: 'activity', label: 'Activity' },
    ]

    return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />

            {/* Back button */}
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-0 flex items-center justify-between">
                <Link href="/machines" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                    📝 Writeups Available
                </button>
            </div>

            {/* Hero Banner */}
            <div className="relative h-44 overflow-hidden mt-3">
                <img src={machine.image} alt={machine.name} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(17,24,39,0.95) 30%, rgba(17,24,39,0.4) 70%, rgba(17,24,39,0.6))' }} />
                <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#9fef00]/60 flex-shrink-0" style={{ boxShadow: '0 0 20px rgba(159,239,0,0.25)' }}>
                        <img src={machine.image} alt={machine.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">{machine.name}</h1>
                        <div className={`text-sm font-medium ${diffColor(machine.difficulty)}`}>
                            {machine.difficulty} · {machine.os}
                        </div>
                    </div>
                    {/* Stats right */}
                    <div className="hidden sm:flex items-center gap-8">
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                                <Star className="w-4 h-4 fill-yellow-400" />
                                <span className="text-white font-bold">{machine.rating}</span>
                                <span className="text-gray-500 text-xs">({machine.solves_count || 0})</span>
                            </div>
                            <div className="text-xs text-gray-500">Machine Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-bold text-xl">{machine.total_points || 0}</div>
                            <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-end gap-0.5 h-6 justify-center mb-0.5">
                                {[...Array(8)].map((_, i) => {
                                    const diffIdx = ['Easy', 'Medium', 'Hard', 'Insane'].indexOf(machine.difficulty)
                                    const filled = i <= (diffIdx === 0 ? 2 : diffIdx === 1 ? 4 : diffIdx === 2 ? 6 : 7)
                                    const c = diffIdx === 0 ? '#4ade80' : diffIdx === 1 ? '#facc15' : diffIdx === 2 ? '#f87171' : '#a855f7'
                                    return <div key={i} style={{ width: 3, height: 8 + i * 2, backgroundColor: filled ? c : '#374151', borderRadius: 1 }} />
                                })}
                            </div>
                            <div className="text-xs text-gray-500">User-Rated Difficulty</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1f2937] border border-gray-700 text-gray-400 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1f2937] border border-gray-700 text-gray-400 hover:text-white transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-gray-800 bg-[#111827]">
                <div className="max-w-7xl mx-auto px-6 flex gap-6">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.key ? 'text-white border-[#9fef00]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {tab === 'play' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {/* Mode Toggles */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPlayMode('adventure')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${playMode === 'adventure' ? 'bg-[#9fef00] text-[#111827]' : 'bg-[#1f2937] border border-gray-700 text-gray-400 hover:text-white'}`}
                                >
                                    🏃 Adventure Mode
                                </button>
                                <button
                                    onClick={() => setPlayMode('guided')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${playMode === 'guided' ? 'bg-[#9fef00] text-[#111827]' : 'bg-[#1f2937] border border-gray-700 text-gray-400 hover:text-white'}`}
                                >
                                    📋 Guided Mode
                                </button>
                                <div className="flex-1" />
                                <button className="px-3 py-2 rounded-lg text-sm bg-[#1f2937] border border-gray-700 text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    📝 Official Writeup
                                </button>
                                <button className="px-3 py-2 rounded-lg text-sm bg-[#1f2937] border border-gray-700 text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    🎥 Video Walkthrough
                                </button>
                            </div>

                            {/* VPN Region + IP Timer */}
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Cloud className="w-4 h-4 text-gray-400" />
                                    <span className="text-white text-sm">SG Machines 1</span>
                                    <button onClick={() => setShowConnect(true)} className="text-xs text-[#9fef00] hover:underline ml-2">↑↓ Switch VPN</button>
                                </div>
                                {machineRunning && (
                                    <div className="flex items-center gap-3 bg-[#111827] px-3 py-1.5 rounded-lg border border-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-[#9fef00] animate-pulse" />
                                        <span className="text-[#9fef00] font-mono text-sm">{machine.ip_address || '10.10.11.100'}</span>
                                        <span className="text-gray-500 text-xs font-mono border-l border-gray-700 pl-3">{formatTimer(machineTimer)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Start / Stop Machine */}
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4 flex items-center justify-between">
                                <div>
                                    {machineRunning ? (
                                        <div>
                                            <div className="text-[#9fef00] text-sm font-bold">Machine Running</div>
                                            <div className="text-gray-500 text-xs mt-0.5">IP: {machine.ip_address || '10.10.11.100'}</div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm">Start the machine to begin hacking</p>
                                    )}
                                </div>
                                {machineRunning ? (
                                    <button onClick={handleStopMachine} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20">
                                        Stop Machine
                                    </button>
                                ) : (
                                    <button onClick={handleStartMachine} disabled={machineStarting} className="px-4 py-2 rounded-lg text-sm font-bold transition-colors" style={{ background: machineStarting ? '#2d3a1a' : '#9fef00', color: '#111827' }}>
                                        {machineStarting ? 'Starting...' : 'Start Machine'}
                                    </button>
                                )}
                            </div>

                            {/* Tasks 1-6 Accordion */}
                            <div className="space-y-2">
                                {machineTasks.map((task, idx) => {
                                    // Check if previous task is solved (sequential unlocking)
                                    const prevTaskId = idx > 0 ? task.id - 1 : null
                                    const isLocked = prevTaskId !== null && !taskSolved[prevTaskId] && !taskSolved[task.id]

                                    return (
                                        <div key={task.id} className={`bg-[#1f2937] rounded-xl border overflow-hidden transition-colors ${expandedTask === task.id ? 'border-[#9fef00]/40' : 'border-gray-800'} ${isLocked ? 'opacity-60' : ''}`}>
                                            <button
                                                onClick={() => !isLocked && setExpandedTask(expandedTask === task.id ? null : task.id)}
                                                disabled={isLocked}
                                                className="w-full flex items-center justify-between px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${taskSolved[task.id] ? 'bg-[#9fef00] text-[#111827]' : isLocked ? 'bg-[#111827] border border-gray-700 text-red-400' : 'bg-[#111827] border border-gray-700 text-gray-400'}`}>
                                                        {taskSolved[task.id] ? '✓' : isLocked ? '🔒' : idx + 1}
                                                    </div>
                                                    <span className={`text-sm font-medium ${taskSolved[task.id] ? 'text-[#9fef00]' : isLocked ? 'text-gray-500' : 'text-white'}`}>{task.title}</span>
                                                    <span className="text-xs text-gray-500">+{task.points} pts</span>
                                                </div>
                                                {expandedTask === task.id ? (
                                                    <ChevronLeft className="w-4 h-4 text-gray-500 rotate-90" />
                                                ) : (
                                                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>

                                            {/* Expanded Task Content */}
                                            {expandedTask === task.id && (
                                                <div className="px-4 pb-4 pt-0 space-y-3 border-t border-gray-800/50 mt-0">
                                                    {isLocked ? (
                                                        <div className="bg-[#111827] rounded-lg p-3 text-sm text-red-400 border border-red-900/50">
                                                            🔒 Complete Task {idx} first to unlock this task!
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-gray-400 text-sm mt-3">{task.question}</p>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Type your answer..."
                                                                    value={taskAnswers[task.id] || ''}
                                                                    onChange={e => setTaskAnswers(prev => ({ ...prev, [task.id]: e.target.value }))}
                                                                    className="flex-1 bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#9fef00]/50"
                                                                />
                                                                <button
                                                                    onClick={() => handleSubmitTask(task.id)}
                                                                    disabled={!taskAnswers[task.id]?.trim() || submittingTask === task.id}
                                                                    className="px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-40"
                                                                    style={{ background: '#9fef00', color: '#111827' }}
                                                                >
                                                                    {submittingTask === task.id ? '...' : 'Submit Task'}
                                                                </button>
                                                            </div>
                                                            {!taskHints[task.id] && (
                                                                <button onClick={() => setTaskHints(prev => ({ ...prev, [task.id]: true }))} className="text-xs text-gray-500 hover:text-white underline">
                                                                    💡 Need a hint?
                                                                </button>
                                                            )}
                                                            {taskHints[task.id] && (
                                                                <div className="bg-[#111827] rounded-lg p-2 text-xs text-gray-400 border border-gray-800">
                                                                    💡 Hint: {task.hint}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Submit User Flag */}
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm">Submit User Flag</span>
                                        <span className="text-xs text-[#9fef00] font-mono">+{machine.user_points} pts</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="HTB{...}"
                                        value={userFlag}
                                        onChange={e => setUserFlag(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSubmit('user')}
                                        disabled={!machineRunning}
                                        className="flex-1 bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#9fef00]/50 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleSubmit('user')}
                                        disabled={!machineRunning || submitting === 'user'}
                                        className="px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-40"
                                        style={{ background: '#9fef00', color: '#111827' }}
                                    >
                                        {submitting === 'user' ? '...' : 'Submit Flag'}
                                    </button>
                                </div>
                                {!machineRunning && <p className="text-xs text-gray-600 mt-2">Start the machine to submit the flag</p>}
                            </div>

                            {/* Submit Root Flag */}
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm">Submit Root Flag</span>
                                        <span className="text-xs text-red-400 font-mono">+{machine.root_points} pts</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="HTB{...}"
                                        value={rootFlag}
                                        onChange={e => setRootFlag(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSubmit('root')}
                                        disabled={!machineRunning}
                                        className="flex-1 bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-red-500/50 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleSubmit('root')}
                                        disabled={!machineRunning || submitting === 'root'}
                                        className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-40"
                                    >
                                        {submitting === 'root' ? '...' : 'Submit Flag'}
                                    </button>
                                </div>
                            </div>

                            {/* Difficulty Rating */}
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">Rate this Machine</span>
                                    <div className="flex items-center gap-2">
                                        <select className="bg-[#111827] border border-gray-700 rounded-lg px-2 py-1 text-xs text-white outline-none">
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                            <option>Insane</option>
                                        </select>
                                        <button className="px-3 py-1 rounded-lg text-xs font-bold transition-colors" style={{ background: '#9fef00', color: '#111827' }}>
                                            Submit Rating
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <h3 className="text-white font-bold mb-3 text-sm">Machine Details</h3>
                                <div className="space-y-2.5 text-sm">
                                    {[
                                        ['OS', machine.os],
                                        ['Difficulty', machine.difficulty],
                                        ['Points', `${machine.total_points || 0} total`],
                                        ['User Flag', `${machine.user_points} pts`],
                                        ['Root Flag', `${machine.root_points} pts`],
                                        ['Solves', (machine.solves_count || 0).toLocaleString()],
                                        ['Released', machine.release_date ? new Date(machine.release_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-gray-500">{k}</span>
                                            <span className="text-white font-mono text-xs">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <h3 className="text-white font-bold mb-3 text-sm">Tags</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {(machine.tags || []).map((t: string) => (
                                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-[#111827] border border-gray-700 text-gray-400">#{t}</span>
                                    ))}
                                    {(!machine.tags || machine.tags.length === 0) && <span className="text-gray-600 text-xs">No tags</span>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                <h3 className="text-white font-bold mb-2 text-sm">About</h3>
                                <p className="text-gray-400 text-xs leading-relaxed">{machine.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'info' && (
                    <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-6 max-w-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">Machine Info</h2>
                        <p className="text-gray-400 leading-relaxed">{machine.description}</p>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {[
                                ['OS', machine.os], ['Difficulty', machine.difficulty],
                                ['User Points', machine.user_points + ' pts'],
                                ['Root Points', machine.root_points + ' pts'],
                                ['Rating', machine.rating + ' / 5'],
                                ['Total Solves', machine.solves_count || 0],
                                ['IP Address', machine.ip_address || 'TBD'],
                                ['Status', machine.retired ? 'Retired' : 'Active'],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                                    <div className="text-white font-mono text-sm">{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'walkthroughs' && (
                    <div className="max-w-2xl space-y-4">
                        {/* Challenge Files Download */}
                        {machine.download_url && (
                            <div className="bg-[#1f2937] rounded-xl border border-blue-800 p-5">
                                <h3 className="text-white font-bold mb-1">Challenge Files</h3>
                                <p className="text-gray-500 text-xs mb-4">Download challenge files (ZIP, etc.)</p>
                                <a
                                    href={machine.download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 rounded-lg font-bold text-sm text-center transition-colors hover:opacity-90"
                                    style={{ background: '#3b82f6', color: '#ffffff' }}
                                >
                                    Download Files ↓
                                </a>
                            </div>
                        )}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-5">
                            <h3 className="text-white font-bold mb-1">Official HTB Walkthrough</h3>
                            <p className="text-gray-500 text-xs mb-4">Verify the file's integrity via the terminal.</p>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex gap-4">
                                    <span className="text-gray-500 w-20">File Name</span>
                                    <span className="text-white font-mono">{machine.name}.pdf</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-500 w-20">SHA256</span>
                                    <span className="text-[#9fef00] font-mono text-xs break-all">—</span>
                                </div>
                            </div>
                            {machine.walkthrough_url ? (
                                <a
                                    href={machine.walkthrough_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 rounded-lg font-bold text-sm text-center transition-colors hover:opacity-90"
                                    style={{ background: '#9fef00', color: '#111827' }}
                                >
                                    Download ↓
                                </a>
                            ) : (
                                <button disabled className="w-full py-2.5 rounded-lg font-bold text-sm bg-gray-700 text-gray-500 cursor-not-allowed">
                                    Coming Soon
                                </button>
                            )}
                        </div>
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-5">
                            <h3 className="text-white font-bold mb-1">Submit Community Walkthrough</h3>
                            <p className="text-gray-500 text-xs mb-4">Share your own perspective on solving {machine.name}</p>
                            <button className="w-full py-2.5 rounded-lg font-medium text-sm bg-[#111827] border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors">
                                Submit Walkthrough
                            </button>
                        </div>
                    </div>
                )}

                {tab === 'reviews' && (
                    <div className="max-w-2xl space-y-5">
                        {/* Submit Review */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-5">
                            <h3 className="text-white font-bold mb-4">Write a Review</h3>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Your Rating</label>
                                <StarRating value={reviewRating} onChange={setReviewRating} />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Your Review</label>
                                <textarea
                                    rows={4}
                                    placeholder={`Share your experience with ${machine.name}...`}
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#9fef00]/50 resize-none placeholder-gray-600"
                                />
                            </div>
                            <button
                                disabled={submittingReview || reviewRating === 0 || !reviewText.trim()}
                                onClick={() => {
                                    if (!Cookies.get('token')) { router.push('/login'); return }
                                    setSubmittingReview(true)
                                    setTimeout(() => {
                                        setReviews(prev => [{
                                            rating: reviewRating,
                                            text: reviewText,
                                            user: user?.username || 'Anonymous',
                                            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                        }, ...prev])
                                        setReviewRating(0)
                                        setReviewText('')
                                        setSubmittingReview(false)
                                        toast.success('Review submitted!')
                                    }, 800)
                                }}
                                className="px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: '#9fef00', color: '#111827' }}
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>

                        {/* Reviews List */}
                        {reviews.length > 0 ? (
                            <div className="space-y-3">
                                {reviews.map((r, i) => (
                                    <div key={i} className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#111827] border border-gray-700 flex items-center justify-center text-xs text-[#9fef00] font-bold">
                                                    {r.user[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-white text-sm font-medium">{r.user}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                                <span className="text-gray-600 text-xs">{r.date}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">{r.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-600">
                                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No reviews yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'activity' && (
                    <div className="text-center py-20 text-gray-600">
                        <p>No activity yet for this machine.</p>
                    </div>
                )}
            </div>

            {/* Connect Modal */}
            {showConnect && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowConnect(false)}>
                    <div className="bg-[#1f2937] rounded-xl border border-gray-700 w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-white font-bold text-base">Connect to Machines</h2>
                            <button onClick={() => setShowConnect(false)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* OpenVPN option */}
                        <div className="flex items-center gap-4 bg-[#111827] rounded-xl p-4 mb-3 border border-gray-800 hover:border-gray-600 cursor-pointer transition-colors">
                            <div className="w-10 h-10 rounded-full bg-[#1f2937] border border-gray-700 flex items-center justify-center flex-shrink-0">
                                <Monitor className="w-5 h-5 text-gray-300" />
                                <div className="absolute w-2 h-2 rounded-full bg-red-500 ml-4 -mt-3" />
                            </div>
                            <div>
                                <div className="text-white font-medium text-sm">OpenVPN</div>
                                <div className="text-gray-500 text-xs">The OG way of connecting to a machine.</div>
                            </div>
                        </div>

                        {/* Pwnbox option */}
                        <div className="flex items-center gap-4 bg-[#111827] rounded-xl p-4 mb-4 border border-gray-800 hover:border-gray-600 cursor-pointer transition-colors">
                            <div className="w-10 h-10 rounded-full bg-[#1f2937] border border-gray-700 flex items-center justify-center flex-shrink-0">
                                <Cloud className="w-5 h-5 text-gray-300" />
                                <div className="absolute w-2 h-2 rounded-full bg-red-500 ml-4 -mt-3" />
                            </div>
                            <div>
                                <div className="text-white font-medium text-sm">Pwnbox</div>
                                <div className="text-gray-500 text-xs">Your own web-based Parrot Linux instance to play our labs.</div>
                            </div>
                        </div>

                        {/* VIP CTA */}
                        <div className="bg-[#2d4a1a] rounded-xl p-3 text-center border border-[#9fef00]/20">
                            <span className="text-[#9fef00] text-xs font-medium">∞ Experience Unlimited Pwnbox with VIP+</span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                            <button className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Introduction to lab access</button>
                        </div>
                        <div className="text-center mt-1">
                            <button className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Trouble connecting?</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
