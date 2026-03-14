'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Terminal, Eye, EyeOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../../lib/api'

export default function RegisterPage() {
    const router = useRouter()
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password !== form.confirm) {
            toast.error('Passwords do not match')
            return
        }
        setLoading(true)
        try {
            await authAPI.register({ username: form.username, email: form.email, password: form.password })
            toast.success('Account created! Please login.')
            router.push('/login')
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark-900 grid-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Terminal className="w-8 h-8 text-cyber-green" />
                        <span className="text-cyber-green font-bold text-2xl neon-green">CyberTraining</span>
                    </Link>
                    <p className="text-slate-500 mt-2 text-sm">// create your hacker profile</p>
                </div>

                <div className="cyber-card rounded-xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">💀</span>
                        </div>
                        <h1 className="text-white font-bold text-2xl">Create Account</h1>
                        <p className="text-slate-500 text-sm mt-1">Join the hacking community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { key: 'username', label: 'USERNAME', type: 'text', placeholder: 'h4ck3r_name' },
                            { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'hacker@proton.me' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="block text-cyber-green text-xs mb-2 font-mono">{field.label}</label>
                                <input
                                    type={field.type}
                                    value={(form as any)[field.key]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    className="w-full bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg px-4 py-3 text-white text-sm font-mono outline-none transition-colors placeholder-slate-600"
                                    placeholder={field.placeholder}
                                    required
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-cyber-green text-xs mb-2 font-mono">PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg px-4 py-3 text-white text-sm font-mono outline-none transition-colors placeholder-slate-600 pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-green">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-cyber-green text-xs mb-2 font-mono">CONFIRM PASSWORD</label>
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={form.confirm}
                                onChange={e => setForm({ ...form, confirm: e.target.value })}
                                className="w-full bg-dark-700 border border-dark-600 focus:border-cyber-green/50 rounded-lg px-4 py-3 text-white text-sm font-mono outline-none transition-colors placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-lg font-bold text-dark-900 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Creating Account...' : 'REGISTER →'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        Already a hacker?{' '}
                        <Link href="/login" className="text-cyber-green hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
