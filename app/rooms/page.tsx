'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Shield, Star, Users, ChevronRight, ChevronLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { roomsAPI } from '../../lib/api'

const CATEGORIES = ['All', 'Learning Path', 'Web Security', 'Networking', 'Operating Systems', 'Post Exploitation', 'Cryptography']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Insane']
const ITEMS_PER_PAGE = 12

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
        <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-t border-dark-600">
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

export default function RoomsPage() {
    const [rooms, setRooms] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [difficulty, setDifficulty] = useState('All')
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        roomsAPI.getAll().then(r => {
            setRooms(r.data)
            setFiltered(r.data)
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        let result = rooms
        if (search) result = result.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
        if (category !== 'All') result = result.filter(r => r.category === category)
        if (difficulty !== 'All') result = result.filter(r => r.difficulty === difficulty)
        setFiltered(result)
        setCurrentPage(1) // Reset to first page on filter change
    }, [search, category, difficulty, rooms])

    // Paginated data
    const paginatedData = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const diffColors: Record<string, string> = {
        Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard', Insane: 'badge-insane'
    }

    return (
        <div className="min-h-screen bg-dark-900 grid-bg">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-white">Learning </span>
                        <span className="text-cyber-green">Rooms</span>
                    </h1>
                    <p className="text-slate-400">Guided hacking rooms with step-by-step challenges</p>
                </div>

                {/* Filters */}
                <div className="cyber-card rounded-xl p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg pl-10 pr-4 py-2 text-white text-sm font-mono outline-none"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-cyber-green/50"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-cyber-green/50"
                        >
                            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div className="text-slate-500 text-sm mb-4">{filtered.length} rooms found</div>

                {/* Rooms Grid */}
                {loading ? (
                    <div className="text-cyber-green text-center py-20 animate-pulse">Loading rooms...</div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedData.map((room: any) => (
                                <Link key={room.id} href={`/rooms/${room.id}`} className="cyber-card rounded-xl overflow-hidden group">
                                    <div className="h-40 relative overflow-hidden">
                                        <img
                                            src={room.image}
                                            alt={room.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent" />
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-md ${diffColors[room.difficulty] || 'badge-easy'}`}>
                                                {room.difficulty}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="text-xs bg-dark-800/80 text-cyber-cyan px-2 py-1 rounded">{room.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyber-green transition-colors">{room.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{room.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{room.members_count?.toLocaleString()}</span>
                                                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{room.rating}</span>
                                                <span>{room.tasks?.length} tasks</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyber-green transition-colors" />
                                        </div>
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {room.tags?.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="text-xs bg-dark-700 text-slate-400 px-2 py-0.5 rounded border border-dark-600">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {paginatedData.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <div className="text-white text-xl font-bold mb-2">No rooms found</div>
                                <div className="text-slate-500">Try adjusting your search filters</div>
                            </div>
                        )}

                        {/* HackTheBox-style Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
