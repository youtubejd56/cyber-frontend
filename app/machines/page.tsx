'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Star, Users, Hash, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { machinesAPI } from '../../lib/api'

const DIFF_FILTERS = ['All Difficulties', 'Easy', 'Medium', 'Hard', 'Insane']
const OS_FILTERS = ['OS', 'Linux', 'Windows', 'FreeBSD']
const ITEMS_PER_PAGE = 15

const diffColor = (d: string) => {
    if (d === 'Easy') return 'text-green-400'
    if (d === 'Medium') return 'text-yellow-400'
    if (d === 'Hard') return 'text-red-400'
    if (d === 'Insane') return 'text-purple-400'
    return 'text-gray-400'
}

const diffBarColor = (d: string) => {
    if (d === 'Easy') return '#4ade80'
    if (d === 'Medium') return '#facc15'
    if (d === 'Hard') return '#f87171'
    if (d === 'Insane') return '#a855f7'
    return '#6b7280'
}

// Mini difficulty bar like HTB
function DiffBar({ difficulty }: { difficulty: string }) {
    const bars = ['Easy', 'Medium', 'Hard', 'Insane']
    const idx = bars.indexOf(difficulty)
    return (
        <div className="flex items-end gap-0.5 h-5">
            {[...Array(8)].map((_, i) => {
                const filled = i <= (idx === 0 ? 2 : idx === 1 ? 4 : idx === 2 ? 6 : 7)
                const color = filled ? diffBarColor(difficulty) : '#374151'
                const height = 8 + i * 2
                return <div key={i} style={{ width: 3, height, backgroundColor: filled ? color : '#374151', borderRadius: 1 }} />
            })}
        </div>
    )
}

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
        <div className="flex items-center justify-between px-4 py-3 bg-[#1f2937] border-t border-gray-800">
            <div className="text-gray-500 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) => (
                    typeof page === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                ? 'bg-[#9fef00] text-black'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={idx} className="px-2 text-gray-600">...</span>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default function MachinesPage() {
    const [machines, setMachines] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [os, setOs] = useState('OS')
    const [diff, setDiff] = useState('All Difficulties')
    const [tab, setTab] = useState<'all' | 'active' | 'retired'>('all')
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        machinesAPI.getAll().then(r => {
            setMachines(r.data)
            setFiltered(r.data)
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        let result = machines
        if (tab === 'active') result = result.filter(m => !m.retired)
        if (tab === 'retired') result = result.filter(m => m.retired)
        if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
        if (os !== 'OS') result = result.filter(m => m.os === os)
        if (diff !== 'All Difficulties') result = result.filter(m => m.difficulty === diff)
        setFiltered(result)
        setCurrentPage(1) // Reset to first page on filter change
    }, [search, os, diff, machines, tab])

    // Paginated data
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginatedData = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const featured = machines.filter(m => !m.retired).slice(0, 2)

    return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Featured machines banner */}
                {featured.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {featured.map((m, i) => (
                            <Link key={m.id} href={`/machines/${m.id}`} className="relative rounded-xl overflow-hidden h-32 group border border-gray-800 hover:border-[#9fef00]/40 transition-colors">
                                <img src={m.image} alt={m.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 to-transparent" />
                                <div className="absolute inset-0 flex items-center gap-4 px-5">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#9fef00]/50 flex-shrink-0" style={{ boxShadow: '0 0 15px rgba(159,239,0,0.3)' }}>
                                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {i === 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#9fef00]/20 text-[#9fef00] border border-[#9fef00]/30">SEASONAL</span>}
                                            {i === 1 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">STAFF PICK</span>}
                                        </div>
                                        <div className="text-white font-bold text-xl">{m.name}</div>
                                        <div className={`text-xs ${diffColor(m.difficulty)}`}>{m.difficulty} · {m.os}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-800 mb-4 gap-6">
                    {(['all', 'active', 'retired'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-3 text-sm font-medium transition-colors capitalize border-b-2 -mb-px ${tab === t ? 'text-white border-[#9fef00]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            {t === 'all' ? 'All Machines' : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                    <button className="pb-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-300 -mb-px ml-auto" disabled>Favorites</button>
                    <button className="pb-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-300 -mb-px" disabled>Unreleased</button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Machines..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#1f2937] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm outline-none focus:border-[#9fef00]/50 placeholder-gray-600"
                        />
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <select value={diff} onChange={e => setDiff(e.target.value)} className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none">
                            {DIFF_FILTERS.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <select value={os} onChange={e => setOs(e.target.value)} className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none">
                            {OS_FILTERS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-20 text-[#9fef00] animate-pulse">Loading machines...</div>
                ) : (
                    <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-500 text-xs">
                                    <th className="text-left px-4 py-3 font-medium">Machine</th>
                                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">User-Rated Difficulty</th>
                                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Rating</th>
                                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">User Flag Solves</th>
                                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">System Flag Solves</th>
                                    <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Release Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {paginatedData.map((m: any) => (
                                    <tr key={m.id} className="hover:bg-[#111827]/60 transition-colors group">
                                        <td className="px-4 py-3">
                                            <Link href={`/machines/${m.id}`} className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
                                                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium group-hover:text-[#9fef00] transition-colors">{m.name}</div>
                                                    <div className={`text-xs ${diffColor(m.difficulty)}`}>{m.difficulty} · {m.os}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <DiffBar difficulty={m.difficulty} />
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="flex items-center gap-1 text-yellow-400">
                                                <Star className="w-3 h-3 fill-yellow-400" />
                                                <span className="text-white">{m.rating}</span>
                                                <span className="text-gray-600 text-xs">({m.solves_count || 0})</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Users className="w-3 h-3" />
                                                {m.solves_count?.toLocaleString() || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Hash className="w-3 h-3" />
                                                {Math.floor((m.solves_count || 0) * 0.9).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden xl:table-cell">
                                            <span className="text-gray-400 text-xs">{m.release_date ? new Date(m.release_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-14 text-gray-500">
                                            No machines found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* HackTheBox-style Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
