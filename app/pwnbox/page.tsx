'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Cookies from 'js-cookie'
import { Terminal, Monitor, Play, Square, Copy, ExternalLink, Loader2 } from 'lucide-react'

export default function PwnBoxPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [pwnboxStatus, setPwnboxStatus] = useState<'stopped' | 'starting' | 'running'>('stopped')
    const [terminalUrl, setTerminalUrl] = useState('')
    const [desktopUrl, setDesktopUrl] = useState('')
    const [vpnConnected, setVpnConnected] = useState(false)
    const [machineIp, setMachineIp] = useState('')

    useEffect(() => {
        if (!Cookies.get('token')) {
            router.push('/login')
            return
        }
        // Check VPN status
        checkVpnStatus()
        setLoading(false)
    }, [router])

    const checkVpnStatus = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/vpn/status/`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setVpnConnected(data.connected || false)
            }
        } catch (err) {
            console.error('Error checking VPN status:', err)
        }
    }

    const handleStartPwnBox = async () => {
        setPwnboxStatus('starting')

        // In a real implementation, this would call the backend to spawn a container
        // For now, we'll use the server's PwnBox endpoints
        const serverIp = 'YOUR_SERVER_IP' // This should come from backend config

        setTerminalUrl(`http://${serverIp}:7681`)
        setDesktopUrl(`http://${serverIp}:6080`)

        // Simulate startup
        setTimeout(() => {
            setPwnboxStatus('running')
        }, 2000)
    }

    const handleStopPwnBox = () => {
        setPwnboxStatus('stopped')
        setTerminalUrl('')
        setDesktopUrl('')
    }

    if (loading) return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />
            <div className="flex items-center justify-center py-40 text-[#9fef00] animate-pulse">Loading...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9fef00]/20 rounded-full mb-4">
                        <Terminal className="w-8 h-8 text-[#9fef00]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">PwnBox</h1>
                    <p className="text-gray-400">Browser-based attack environment (like HackTheBox PwnBox)</p>
                </div>

                {/* VPN Status Alert */}
                {!vpnConnected && (
                    <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <p className="text-yellow-400">
                                <strong>VPN Required!</strong> Connect to VPN first to access lab machines.
                            </p>
                            <button
                                onClick={() => router.push('/vpn')}
                                className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
                            >
                                Connect VPN
                            </button>
                        </div>
                    </div>
                )}

                {/* PwnBox Control */}
                <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-[#9fef00]" />
                        PwnBox Attack Environment
                    </h2>

                    {pwnboxStatus === 'stopped' ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-[#9fef00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play className="w-10 h-10 text-[#9fef00]" />
                            </div>
                            <h3 className="text-lg text-white mb-2">Start Your PwnBox</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Spin up a browser-based Linux terminal and desktop environment.
                                No VPN client installation needed!
                            </p>
                            <button
                                onClick={handleStartPwnBox}
                                disabled={!vpnConnected}
                                className={`px-8 py-3 font-bold rounded-lg flex items-center gap-2 mx-auto ${vpnConnected
                                    ? 'bg-[#9fef00] text-[#111827] hover:bg-[#8bd900]'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Play className="w-5 h-5" />
                                Start PwnBox
                            </button>
                        </div>
                    ) : pwnboxStatus === 'starting' ? (
                        <div className="text-center py-8">
                            <Loader2 className="w-12 h-12 text-[#9fef00] animate-spin mx-auto mb-4" />
                            <p className="text-white text-lg">Starting PwnBox...</p>
                            <p className="text-gray-400">This may take a few seconds</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Terminal Access */}
                            <div className="bg-[#111827] rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-5 h-5 text-[#9fef00]" />
                                        <span className="text-white font-semibold">Web Terminal</span>
                                    </div>
                                    <a
                                        href={terminalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#9fef00] text-[#111827] rounded-lg hover:bg-[#8bd900]"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-gray-800 text-gray-300 px-3 py-2 rounded font-mono text-sm">
                                        {terminalUrl}
                                    </code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(terminalUrl)}
                                        className="p-2 bg-gray-700 rounded text-gray-400 hover:text-white"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Access */}
                            <div className="bg-[#111827] rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-5 h-5 text-[#9fef00]" />
                                        <span className="text-white font-semibold">Web Desktop (VNC)</span>
                                    </div>
                                    <a
                                        href={desktopUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#9fef00] text-[#111827] rounded-lg hover:bg-[#8bd900]"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-gray-800 text-gray-300 px-3 py-2 rounded font-mono text-sm">
                                        {desktopUrl}
                                    </code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(desktopUrl)}
                                        className="p-2 bg-gray-700 rounded text-gray-400 hover:text-white"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Stop Button */}
                            <button
                                onClick={handleStopPwnBox}
                                className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 flex items-center justify-center gap-2"
                            >
                                <Square className="w-5 h-5" />
                                Stop PwnBox
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Commands */}
                {pwnboxStatus === 'running' && (
                    <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Commands</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-[#111827] rounded-lg p-4">
                                <code className="text-[#9fef00]">ssh user@10.10.10.x</code>
                                <p className="text-gray-500 text-sm mt-1">Connect to lab machine</p>
                            </div>
                            <div className="bg-[#111827] rounded-lg p-4">
                                <code className="text-[#9fef00]">nmap -sV 10.10.10.x</code>
                                <p className="text-gray-500 text-sm mt-1">Scan target machine</p>
                            </div>
                            <div className="bg-[#111827] rounded-lg p-4">
                                <code className="text-[#9fef00]">curl http://10.10.10.x</code>
                                <p className="text-gray-500 text-sm mt-1">Test web service</p>
                            </div>
                            <div className="bg-[#111827] rounded-lg p-4">
                                <code className="text-[#9fef00]">nc -nv 10.10.10.x 4444</code>
                                <p className="text-gray-500 text-sm mt-1">Netcat reverse shell</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
