'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { vpnAPI, pwnboxAPI } from '../../lib/api'
import { Download, Key, Server, Shield, Lock, Copy, Check, Terminal, Monitor, Play, ExternalLink, Loader2, Wifi, Circle, FileDown, FileText, Terminal as TerminalIcon, Zap, Globe } from 'lucide-react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export default function VPNPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [hasConfig, setHasConfig] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [configContent, setConfigContent] = useState('')
    const [vpnStatus, setVpnStatus] = useState<any>(null)
    const [pwnboxStatus, setPwnboxStatus] = useState<'stopped' | 'starting' | 'running'>('stopped')
    const [pwnboxUrls, setPwnboxUrls] = useState<{ terminal?: string; desktop?: string }>({})
    const [activeTab, setActiveTab] = useState<'openvpn' | 'pwnbox'>('openvpn')

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }
        setLoading(true)
        loadData()
    }, [router])

    const loadData = async () => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

        // First check localStorage for custom OVPN
        const savedOVPN = localStorage.getItem('custom_ovpn')
        if (savedOVPN) {
            setConfigContent(savedOVPN)
            setHasConfig(true)
            setLoading(false)
            return
        }

        try {
            const [configRes, statusRes, pwnboxRes] = await Promise.all([
                vpnAPI.getConfig().catch((err) => {
                    // If auth error, return empty config
                    if (err.response?.status === 401) {
                        return { data: { has_config: false, config_content: '' } }
                    }
                    throw err
                }),
                vpnAPI.getStatus().catch((err) => {
                    // If 401, user not authenticated for VPN
                    if (err.response?.status === 401) {
                        return { data: { connected: false, has_config: false } }
                    }
                    return { data: { connected: false } }
                }),
                pwnboxAPI.getStatus().catch(() => ({ data: { status: 'stopped' } }))
            ])

            if (configRes.data.has_config) {
                setHasConfig(true)
                setUsername(configRes.data.username)
                setPassword(configRes.data.password || '')
                setConfigContent(configRes.data.config_content || '')
            }
            setVpnStatus(statusRes.data)

            if (pwnboxRes.data.status === 'running') {
                setPwnboxStatus('running')
                setPwnboxUrls({
                    terminal: pwnboxRes.data.terminal_url,
                    desktop: pwnboxRes.data.desktop_url
                })
            }
        } catch (err) {
            console.error('Error loading data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateConfig = async () => {
        setCreating(true)
        try {
            const res = await vpnAPI.createConfig()
            if (res.data.success) {
                setHasConfig(true)
                setUsername(res.data.username)
                setPassword(res.data.password || '')
                setConfigContent(res.data.config_content || '')
                toast.success('Configuration created!')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to create config')
        } finally {
            setCreating(false)
        }
    }

    const handleDownload = async () => {
        if (!configContent) {
            toast.error('No config available')
            return
        }

        // Create blob with proper encoding - no URL limits
        const blob = new Blob([configContent], { type: 'application/x-openvpn-profile' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cybertraining.ovpn'
        document.body.appendChild(a)
        a.click()

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        }, 100)

        toast.success('Downloaded!')
    }

    const handleCopyToClipboard = async () => {
        if (!configContent) {
            toast.error('No config available')
            return
        }
        try {
            await navigator.clipboard.writeText(configContent)
            toast.success('Copied! Paste into a .ovpn file')
        } catch {
            toast.error('Failed to copy')
        }
    }

    const handleUploadOVPN = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            setConfigContent(content)
        }
        reader.readAsText(file)
    }

    const handlePasteOVPN = async () => {
        try {
            const text = await navigator.clipboard.readText()
            if (text.includes('client') && text.includes('openvpn')) {
                setConfigContent(text)
                toast.success('OVPN loaded from clipboard!')
            } else {
                toast.error('Invalid OVPN - must contain client and openvpn')
            }
        } catch {
            toast.error('Failed to read clipboard')
        }
    }

    const handleSaveCustomOVPN = async () => {
        if (!configContent) return
        if (!configContent.includes('client') || !configContent.includes('openvpn')) {
            toast.error('Invalid OVPN format')
            return
        }

        // Save to backend
        try {
            await vpnAPI.saveCustomConfig(configContent)
        } catch (e) {
            // Continue anyway - we'll use localStorage
        }

        // Save to localStorage for persistence
        localStorage.setItem('custom_ovpn', configContent)

        setHasConfig(true)
        toast.success('Custom OVPN loaded!')
    }

    const handleStartPwnBox = async () => {
        setPwnboxStatus('starting')
        try {
            const res = await pwnboxAPI.start()
            if (res.data.success) {
                setPwnboxStatus('running')
                setPwnboxUrls({
                    terminal: res.data.terminal_url,
                    desktop: res.data.desktop_url
                })
                toast.success('PwnBox started!')
            } else {
                toast.error(res.data.error || 'Failed')
                setPwnboxStatus('stopped')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed')
            setPwnboxStatus('stopped')
        }
    }

    const handleStopPwnBox = async () => {
        try {
            await pwnboxAPI.stop()
            setPwnboxStatus('stopped')
            setPwnboxUrls({})
            toast.success('PwnBox stopped')
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed')
        }
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9fef00]/20 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-[#9fef00]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Lab Access</h1>
                    <p className="text-gray-400">Connect to the cyber training lab</p>
                </div>

                {/* Tab Selection */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('openvpn')}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all ${activeTab === 'openvpn'
                            ? 'bg-[#9fef00] text-[#111827]'
                            : 'bg-[#1f2937] text-gray-400 border border-gray-700 hover:border-[#9fef00]'
                            }`}
                    >
                        <Wifi className="w-6 h-6" />
                        <span>OpenVPN</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('pwnbox')}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all ${activeTab === 'pwnbox'
                            ? 'bg-[#9fef00] text-[#111827]'
                            : 'bg-[#1f2937] text-gray-400 border border-gray-700 hover:border-[#9fef00]'
                            }`}
                    >
                        <Monitor className="w-6 h-6" />
                        <span>PwnBox</span>
                    </button>
                </div>

                {/* OpenVPN Tab - CONNECT TO MACHINE style */}
                {activeTab === 'openvpn' && (
                    <div className="space-y-6">
                        {/* Active Connection Status */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
                            <div className="flex items-center gap-3">
                                <Circle className={`w-3 h-3 ${hasConfig ? 'fill-green-500 text-green-500' : 'fill-gray-500 text-gray-500'}`} />
                                <span className={`font-semibold ${hasConfig ? 'text-green-400' : 'text-gray-500'}`}>
                                    {hasConfig ? 'Active Connection' : 'No Active Connection'}
                                </span>
                            </div>
                        </div>

                        {/* CONNECT TO MACHINE - Main Card */}
                        <div className="bg-[#1f2937] rounded-xl border-2 border-[#9fef00]/30 p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">CONNECT TO MACHINE</h2>

                            {!hasConfig ? (
                                <div className="space-y-6">
                                    <p className="text-gray-400 text-center mb-6">
                                        Upload your own .ovpn file (e.g., from HackTheBox) or generate a new config
                                    </p>

                                    {/* Upload/Paste Options */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="cursor-pointer bg-[#111827] hover:bg-[#1f2937] border border-gray-700 hover:border-[#9fef00] rounded-lg p-4 text-center transition-colors">
                                            <input
                                                type="file"
                                                accept=".ovpn,.conf"
                                                onChange={handleUploadOVPN}
                                                className="hidden"
                                            />
                                            <FileText className="w-8 h-8 text-[#9fef00] mx-auto mb-2" />
                                            <div className="text-white font-semibold">Upload .ovpn</div>
                                            <div className="text-gray-500 text-xs">from your computer</div>
                                        </label>

                                        <button
                                            onClick={handlePasteOVPN}
                                            className="bg-[#111827] hover:bg-[#1f2937] border border-gray-700 hover:border-[#9fef00] rounded-lg p-4 text-center transition-colors"
                                        >
                                            <Copy className="w-8 h-8 text-[#9fef00] mx-auto mb-2" />
                                            <div className="text-white font-semibold">Paste Config</div>
                                            <div className="text-gray-500 text-xs">from clipboard</div>
                                        </button>
                                    </div>

                                    {/* Show uploaded config */}
                                    {configContent && (
                                        <div className="space-y-2">
                                            <textarea
                                                value={configContent}
                                                onChange={(e) => setConfigContent(e.target.value)}
                                                placeholder="Paste your OVPN config here..."
                                                className="w-full h-32 bg-[#111827] border border-gray-700 rounded-lg p-3 text-gray-300 font-mono text-xs resize-none"
                                            />
                                            <button
                                                onClick={handleSaveCustomOVPN}
                                                disabled={creating}
                                                className="w-full py-3 bg-[#9fef00] text-[#111827] font-bold rounded-lg hover:bg-[#8bd900] transition-colors"
                                            >
                                                {creating ? 'Saving...' : 'Use This Config'}
                                            </button>
                                        </div>
                                    )}

                                    <div className="relative flex py-2 items-center">
                                        <div className="flex-grow border-t border-gray-700"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR</span>
                                        <div className="flex-grow border-t border-gray-700"></div>
                                    </div>

                                    <button
                                        onClick={handleCreateConfig}
                                        disabled={creating}
                                        className="w-full py-4 bg-[#1f2937] border border-gray-700 hover:border-[#9fef00] text-gray-300 font-bold rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {creating ? 'Creating...' : 'Generate New Configuration'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Download Button - Big like HackTheBox */}
                                    <button
                                        onClick={handleDownload}
                                        className="w-full py-6 bg-[#9fef00] hover:bg-[#8bd900] text-[#111827] font-bold rounded-lg transition-colors flex items-center justify-center gap-3 text-lg"
                                    >
                                        <Download className="w-6 h-6" />
                                        DOWNLOAD .OVPN FILE
                                    </button>

                                    {/* Copy Button */}
                                    <button
                                        onClick={handleCopyToClipboard}
                                        className="w-full py-3 bg-[#1f2937] hover:bg-[#374151] border border-gray-700 text-gray-300 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Copy className="w-5 h-5" />
                                        COPY TO CLIPBOARD
                                    </button>

                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-[#111827] rounded-lg p-3 text-center">
                                            <div className="text-gray-500 text-xs">Server</div>
                                            <div className="text-white font-mono">{vpnStatus?.server || '10.10.10.1'}</div>
                                        </div>
                                        <div className="flex-1 bg-[#111827] rounded-lg p-3 text-center">
                                            <div className="text-gray-500 text-xs">Protocol</div>
                                            <div className="text-white font-mono">UDP</div>
                                        </div>
                                        <div className="flex-1 bg-[#111827] rounded-lg p-3 text-center">
                                            <div className="text-gray-500 text-xs">Port</div>
                                            <div className="text-white font-mono">1194</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connection Info */}
                        {hasConfig && (
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Connection Info</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#111827] rounded-lg p-3">
                                        <div className="text-gray-500 text-xs">Username</div>
                                        <div className="text-[#9fef00] font-mono">{username}</div>
                                    </div>
                                    <div className="bg-[#111827] rounded-lg p-3">
                                        <div className="text-gray-500 text-xs">IP Address</div>
                                        <div className="text-[#9fef00] font-mono">10.8.0.2</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">How to Connect</h3>
                            <div className="text-gray-400 space-y-2 text-sm">
                                <p>1. Download the .ovpn configuration file</p>
                                <p>2. Import it into your OpenVPN client</p>
                                <p>3. Connect to access lab machines at 10.10.10.x</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* PwnBox Tab */}
                {activeTab === 'pwnbox' && (
                    <div className="space-y-6">
                        {pwnboxStatus === 'stopped' ? (
                            /* Start PwnBox - Big Button */
                            <button
                                onClick={handleStartPwnBox}
                                className="w-full py-8 bg-[#9fef00] hover:bg-[#8bd900] text-[#111827] font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
                            >
                                <Zap className="w-6 h-6" />
                                START PWNBOX
                            </button>
                        ) : pwnboxStatus === 'starting' ? (
                            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-8 text-center">
                                <Loader2 className="w-16 h-16 text-[#9fef00] animate-spin mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-white">Starting PwnBox...</h2>
                            </div>
                        ) : (
                            /* PwnBox Running */
                            <div className="space-y-4">
                                {/* Terminal */}
                                <a
                                    href={pwnboxUrls.terminal || 'http://localhost:7681'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-6 bg-[#1f2937] hover:bg-[#374151] border border-[#9fef00] rounded-xl transition-colors flex items-center justify-between px-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <TerminalIcon className="w-8 h-8 text-[#9fef00]" />
                                        <div className="text-left">
                                            <div className="text-white font-bold text-lg">Web Terminal</div>
                                            <div className="text-gray-400 text-sm">Browser-based Linux terminal</div>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-6 h-6 text-[#9fef00]" />
                                </a>

                                {/* Desktop */}
                                {pwnboxUrls.desktop && (
                                    <a
                                        href={pwnboxUrls.desktop}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-6 bg-[#1f2937] hover:bg-[#374151] border border-gray-700 rounded-xl transition-colors flex items-center justify-between px-6"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Monitor className="w-8 h-8 text-gray-400" />
                                            <div className="text-left">
                                                <div className="text-white font-bold text-lg">Web Desktop</div>
                                                <div className="text-gray-400 text-sm">VNC-based desktop</div>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-6 h-6 text-gray-400" />
                                    </a>
                                )}

                                {/* Stop */}
                                <button
                                    onClick={handleStopPwnBox}
                                    className="w-full py-4 bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-400 font-bold rounded-xl transition-colors"
                                >
                                    STOP PWNBOX
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
