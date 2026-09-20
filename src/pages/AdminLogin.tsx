import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import type { AdminLoginRequest, AdminLoginResponse } from "@/lib/types";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminLoginRequest>({ email: "", password: "" });
  const login = useMutation({
    mutationFn: (payload: AdminLoginRequest) => apiPost<AdminLoginResponse>("/auth/login", payload),
    onSuccess: () => {
      beginSession();
      toast.success("Welcome to the lead desk.");
      navigate("/admin");
    },
    onError: () => toast.error("Those admin credentials were not recognised."),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate(form);
  };

  return <div className="min-h-screen bg-[#1f2423] px-4 py-8 text-[#1a1a1a] sm:px-8" data-testid="admin-login-page">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1200px] items-center justify-center">
      <div className="grid w-full overflow-hidden bg-[#fafafa] shadow-[0_8px_30px_rgb(0,0,0,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[620px] bg-[#a38068] p-10 text-white lg:block" data-testid="admin-login-brand-panel"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,0.2),transparent_30%)]" /><div className="relative flex h-full flex-col justify-between"><div><div className="mb-16 flex items-center gap-3"><span className="grid size-9 place-items-center bg-[#1a1a1a] text-white"><span className="font-heading text-xl">A</span></span><span className="text-sm font-bold tracking-[0.08em]" data-testid="admin-login-brand">AANGAN BUILDWORKS</span></div><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70" data-testid="admin-login-eyebrow">Internal workspace</p><h1 className="mt-5 max-w-md text-5xl font-medium leading-[0.98] text-white" data-testid="admin-login-title">Keep every home conversation moving.</h1></div><p className="max-w-sm text-sm leading-6 text-white/70" data-testid="admin-login-description">Review qualified enquiries, prioritise follow-up and keep the next step visible to the team.</p></div></div>
        <div className="p-7 sm:p-12 lg:p-16" data-testid="admin-login-card"><Link to="/" className="mb-16 inline-flex items-center gap-2 text-xs font-semibold text-[#666] hover:text-[#a38068]" data-testid="admin-login-back-link"><ArrowLeft size={15} /> Back to public site</Link><div className="mb-10"><div className="mb-5 grid size-12 place-items-center bg-[#f3eee9] text-[#a38068]"><LockKeyhole size={21} /></div><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a38068]" data-testid="admin-login-form-eyebrow">Team sign in</p><h2 className="mt-3 text-4xl font-medium" data-testid="admin-login-form-title">Admin login</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#777]" data-testid="admin-login-form-copy">Sign in to see new home enquiries and move them through the sales process.</p></div><form onSubmit={submit} className="space-y-5" data-testid="admin-login-form"><label className="block" data-testid="admin-email-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="admin-email-label">Email</span><Input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="admin@aanganbuildworks.example" className="h-12 rounded-none border-[#ded9d4]" data-testid="admin-email-input" /></label><label className="block" data-testid="admin-password-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="admin-password-label">Password</span><Input required type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Enter your password" className="h-12 rounded-none border-[#ded9d4]" data-testid="admin-password-input" /></label><Button type="submit" disabled={login.isPending} className="h-12 w-full rounded-md bg-[#a38068] text-white hover:-translate-y-0.5 hover:bg-[#8c6b55]" data-testid="admin-login-submit-button">{login.isPending ? "Signing in…" : "Sign in to lead desk"}<ArrowRight size={16} /></Button>{login.isError && <p className="text-sm text-red-700" data-testid="admin-login-error">Invalid admin credentials. Try again.</p>}</form><p className="mt-8 border-l-2 border-[#a38068] bg-[#faf8f6] p-4 text-xs leading-5 text-[#777]" data-testid="admin-login-security-note">This workspace uses a secure, httpOnly session cookie. Your password is never stored in the browser.</p></div>
      </div>
    </div>
  </div>;
}
