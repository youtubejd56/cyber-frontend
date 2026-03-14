'use client'
import { useEffect, useState } from 'react'
import { Trophy, Crown, Medal, Zap, Flag, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { leaderboardAPI } from '../../lib/api'

const ITEMS_PER_PAGE = 20

// HackTheBox-style Pagination
function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}: {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const maxVisiblePages = 5

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push('...')

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) pages.push(i)

            if (currentPage < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-dark-800 border-t border-dark-600">
            <div className="text-slate-500 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-slate-500 hover:text-cyber-green hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) => (
                    typeof page === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                ? 'bg-cyber-green text-dark-900'
                                : 'text-slate-500 hover:text-white hover:bg-dark-700'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={idx} className="px-2 text-slate-600">...</span>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-slate-500 hover:text-cyber-green hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        leaderboardAPI.get().then(r => {
            setUsers(r.data)
        }).finally(() => setLoading(false))
    }, [])

    // Paginated data
    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const rankColors: Record<string, string> = {
        'Newbie': '#94a3b8',
        'Script Kiddie': '#60a5fa',
        'Hacker': '#00ff41',
        'Pro Hacker': '#ffd700',
        'Elite Hacker': '#ff4060',
    }

    const positionIcon = (pos: number) => {
        if (pos === 1) return <Crown className="w-5 h-5 text-yellow-400" />
        if (pos === 2) return <Medal className="w-5 h-5 text-slate-300" />
        if (pos === 3) return <Medal className="w-5 h-5 text-amber-600" />
        return <span className="text-slate-600 font-mono text-sm w-5 text-center">#{pos}</span>
    }

    // Get users for podium (based on current page)
    const getPodiumUsers = () => {
        if (currentPage === 1 && users.length >= 3) {
            return [users[1], users[0], users[2]]
        }
        return null
    }

    const podiumUsers = getPodiumUsers()

    return (
        <div className="min-h-screen bg-dark-900 grid-bg">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-yellow-400/10 border border-yellow-400/30 mb-4">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h1 className="text-4xl font-bold">
                        <span className="text-white">Global </span>
                        <span className="text-yellow-400">Leaderboard</span>
                    </h1>
                    <p className="text-slate-400 mt-2">Top hackers ranked by points</p>
                </div>

                {/* Top 3 Podium - Only show on first page */}
                {!loading && currentPage === 1 && users.length >= 3 && (
                    <div className="flex items-end justify-center gap-4 mb-10">
                        {/* 2nd */}
                        <div className="flex flex-col items-center">
                            <img src={users[1]?.avatar} alt="" className="w-14 h-14 rounded-xl border-2 border-slate-400 mb-2" />
                            <div className="text-white font-bold text-sm">{users[1]?.username}</div>
                            <div className="text-slate-400 text-xs">{users[1]?.points?.toLocaleString()} pts</div>
                            <div className="w-20 bg-slate-600 rounded-t-lg mt-2 flex items-center justify-center h-16 text-slate-300 font-bold text-2xl">2</div>
                        </div>
                        {/* 1st */}
                        <div className="flex flex-col items-center -mt-6">
                            <div className="w-6 h-6 text-yellow-400 mb-1">👑</div>
                            <img src={users[0]?.avatar} alt="" className="w-18 h-18 rounded-xl border-2 border-yellow-400 mb-2 w-16 h-16" />
                            <div className="text-white font-bold">{users[0]?.username}</div>
                            <div className="text-yellow-400 text-xs font-bold">{users[0]?.points?.toLocaleString()} pts</div>
                            <div className="w-20 bg-yellow-600 rounded-t-lg mt-2 flex items-center justify-center h-24 text-white font-bold text-2xl">1</div>
                        </div>
                        {/* 3rd */}
                        <div className="flex flex-col items-center">
                            <img src={users[2]?.avatar} alt="" className="w-14 h-14 rounded-xl border-2 border-amber-600 mb-2" />
                            <div className="text-white font-bold text-sm">{users[2]?.username}</div>
                            <div className="text-slate-400 text-xs">{users[2]?.points?.toLocaleString()} pts</div>
                            <div className="w-20 bg-amber-700 rounded-t-lg mt-2 flex items-center justify-center h-12 text-white font-bold text-2xl">3</div>
                        </div>
                    </div>
                )}

                {/* Full List */}
                <div className="cyber-card rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-dark-600 text-xs text-slate-500 uppercase">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">Hacker</div>
                        <div className="col-span-3">User Rank</div>
                        <div className="col-span-2 text-right">Points</div>
                        <div className="col-span-1 text-right">Flags</div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-cyber-green animate-pulse">Loading leaderboard...</div>
                    ) : (
                        <>
                            <div className="divide-y divide-dark-700">
                                {paginatedUsers.map((user: any, idx: number) => {
                                    const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1
                                    return (
                                        <div
                                            key={user.username}
                                            className={`grid grid-cols-12 gap-2 px-6 py-4 hover:bg-dark-700/50 transition-colors items-center ${globalRank <= 3 ? 'bg-dark-700/30' : ''
                                                }`}
                                        >
                                            <div className="col-span-1 flex items-center justify-center">
                                                {positionIcon(globalRank)}
                                            </div>
                                            <div className="col-span-5 flex items-center gap-3">
                                                <img src={user.avatar} alt="" className="w-9 h-9 rounded-lg border border-dark-600" />
                                                <div>
                                                    <div className="text-white font-semibold text-sm">{user.username}</div>
                                                    <div className="text-slate-600 text-xs truncate">{user.email}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <span
                                                    className="text-xs font-semibold px-2 py-0.5 rounded"
                                                    style={{
                                                        color: rankColors[user.rank] || '#94a3b8',
                                                        background: `${rankColors[user.rank] || '#94a3b8'}22`,
                                                        border: `1px solid ${rankColors[user.rank] || '#94a3b8'}44`
                                                    }}
                                                >
                                                    {user.rank}
                                                </span>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <span className="text-cyber-green font-mono font-bold text-sm">{user.points?.toLocaleString()}</span>
                                            </div>
                                            <div className="col-span-1 text-right text-slate-400 text-sm flex items-center justify-end gap-1">
                                                <Flag className="w-3 h-3" />{user.flags_captured || 0}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* HackTheBox-style Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalItems={users.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
