"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle,
  Activity,
  UserPlus,
  ArrowRight,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    voters: 0,
    admins: 0,
    totalVotes: 0,
    pendingCandidates: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "superadmin") {
      router.replace("/auth/login?role=admin");
      return;
    }

    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/superadmin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (response.ok) setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/auth/login?role=admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
              Super Admin <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              Live Election Metrics 2026
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Users size={20} />}
            label="Registered Voters"
            value={stats.voters}
            color="blue"
          />
          <StatCard
            icon={<ShieldCheck size={20} />}
            label="System Admins"
            value={stats.admins}
            color="green"
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Votes Cast"
            value={stats.totalVotes}
            color="emerald"
          />
          <StatCard
            icon={<UserPlus size={20} />}
            label="Pending Nominees"
            value={stats.pendingCandidates}
            color="orange"
            highlight
          />
        </div>

        {/* QUICK ACTION CARD */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div>
              <span className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                Action Required
              </span>

              <h2 className="text-3xl font-black text-slate-900">
                Candidate <span className="text-blue-600">Approvals</span>
              </h2>

              <p className="text-slate-500 mt-2 max-w-md">
                There are {stats.pendingCandidates} applications awaiting review.
              </p>
            </div>

            <Link
              href="/super/approvals"
              className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg active:scale-95"
            >
              Review Applications
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
}) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div
      className={`bg-white border ${
        highlight
          ? "border-orange-200 ring-4 ring-orange-50"
          : "border-slate-200"
      } rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
        {label}
      </p>

      <p className="text-5xl font-black text-slate-900">{value}</p>
    </div>
  );
}