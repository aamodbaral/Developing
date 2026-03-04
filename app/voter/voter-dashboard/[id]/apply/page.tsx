// (user)/voter/apply/page.tsx (or wherever ApplyList lives)
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, ChevronLeft } from "lucide-react";

export default function ApplyList() {
  const router = useRouter();
  // 'id' represents the Voter ID from the URL path, e.g., /voter-dashboard/4/apply
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/auth/login"); return; }
    fetchEvents(token);
  }, []);

  const fetchEvents = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/events/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // Filter for only 'application' phase
      const filtered = data.filter((e: any) => e.phase?.toLowerCase() === "application");
      setEvents(filtered);
    } catch (err) {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 transition-colors">
          <ChevronLeft size={20} /> <span className="text-[10px] font-black uppercase">Back</span>
        </button>

        <h1 className="text-4xl font-black text-slate-900 mb-10">Nomination <span className="text-blue-600">Desk</span></h1>

        <div className="grid gap-6">
          {events.length > 0 ? (
            events.map((event: any) => {
              const eventId = event.id || event._id;
              return (
                <div key={eventId} className="bg-white border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-slate-900">{event.title}</h3>
                      <div className="flex gap-4 text-[10px] font-bold uppercase text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={12}/> {event.allowedDept}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> Deadline: {new Date(event.candidateDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* FIXED: URL structure now includes both Voter ID and Event ID */}
                    <Link 
                      href={`/voter/voter-dashboard/${id}/apply/${eventId}`}
                      className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors"
                    >
                      Begin Application <ArrowRight size={16} className="inline ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400">
              No active election cycles open for candidacy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}