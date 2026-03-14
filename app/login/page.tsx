'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Terminal, Eye, EyeOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { authAPI } from '../../lib/api'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await authAPI.login(username, password)
            Cookies.set('token', res.data.access, { expires: 1 })
            toast.success('Access granted. Welcome back, hacker.')
            router.push('/dashboard')
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark-900 grid-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Terminal className="w-8 h-8 text-cyber-green" />
                        <span className="text-cyber-green font-bold text-2xl neon-green">CyberTraining</span>
                    </Link>
                    <p className="text-slate-500 mt-2 text-sm">// authenticate to gain access</p>
                </div>

                <div className="cyber-card rounded-xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🔓</span>
                        </div>
                        <h1 className="text-white font-bold text-2xl">Login</h1>
                        <p className="text-slate-500 text-sm mt-1">Enter your credentials to proceed</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-cyber-green text-xs mb-2 font-mono">USERNAME</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg px-4 py-3 text-white text-sm font-mono outline-none transition-colors placeholder-slate-600"
                                placeholder="your_username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-cyber-green text-xs mb-2 font-mono">PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg px-4 py-3 text-white text-sm font-mono outline-none transition-colors placeholder-slate-600 pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-green"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-lg font-bold text-dark-900 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Authenticating...' : 'LOGIN →'}
                        </button>
                    </form>

                    {/* Demo creds */}
                    <div className="mt-6 p-3 bg-dark-700 rounded-lg border border-dark-600">
                        <p className="text-xs text-slate-500 mb-2 font-mono">// demo credentials</p>
                        <button
                            onClick={() => { setUsername('admin'); setPassword('admin123') }}
                            className="text-xs text-cyber-cyan hover:underline font-mono cursor-pointer"
                        >
                            admin / admin123
                        </button>
                    </div>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        No account?{' '}
                        <Link href="/register" className="text-cyber-green hover:underline">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
