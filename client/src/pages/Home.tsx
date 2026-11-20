import { useMemo, useState } from "react";
import { CalendarDays, Check, CheckCircle2, ChevronDown, Circle, Clock3, ListFilter, MoreHorizontal, Plus, Search, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type Status = "todo" | "doing" | "done";
type Priority = "low" | "medium" | "high";

const statusMeta: Record<Status, { label: string; color: string }> = {
  todo: { label: "Kutilmoqda", color: "blue" },
  doing: { label: "Jarayonda", color: "amber" },
  done: { label: "Bajarildi", color: "green" },
};
const priorityMeta: Record<Priority, { label: string; color: string }> = {
  low: { label: "Past", color: "slate" },
  medium: { label: "O‘rta", color: "indigo" },
  high: { label: "Yuqori", color: "rose" },
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Muddat belgilanmagan";
  return new Intl.DateTimeFormat("uz-UZ", { day: "numeric", month: "short" }).format(new Date(value));
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const tasksQuery = trpc.tasks.list.useQuery({ search: search || undefined });
  const utils = trpc.useUtils();
  const createTask = trpc.tasks.create.useMutation({ onSuccess: () => { utils.tasks.list.invalidate(); resetForm(); toast.success("Vazifa qo‘shildi"); }, onError: e => toast.error(e.message) });
  const updateTask = trpc.tasks.update.useMutation({ onSuccess: () => { utils.tasks.list.invalidate(); resetForm(); toast.success("Vazifa yangilandi"); }, onError: e => toast.error(e.message) });
  const removeTask = trpc.tasks.remove.useMutation({ onSuccess: () => { utils.tasks.list.invalidate(); toast.success("Vazifa o‘chirildi"); } });
  const clearDone = trpc.tasks.clearDone.useMutation({ onSuccess: () => { utils.tasks.list.invalidate(); toast.success("Bajarilgan vazifalar tozalandi"); } });

  const tasks = tasksQuery.data ?? [];
  const filteredTasks = useMemo(() => filter === "all" ? tasks : tasks.filter(task => task.status === filter), [filter, tasks]);
  const stats = { all: tasks.length, todo: tasks.filter(t => t.status === "todo").length, doing: tasks.filter(t => t.status === "doing").length, done: tasks.filter(t => t.status === "done").length };
  const progress = stats.all ? Math.round((stats.done / stats.all) * 100) : 0;

  function resetForm() { setShowForm(false); setEditing(null); setTitle(""); setDescription(""); setPriority("medium"); setDueDate(""); }
  function openEdit(task: typeof tasks[number]) { setEditing(task.id); setShowForm(true); setTitle(task.title); setDescription(task.description ?? ""); setPriority(task.priority as Priority); setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function submit(e: React.FormEvent) { e.preventDefault(); if (!title.trim()) return; const payload = { title, description: description || null, priority, dueDate: dueDate ? new Date(`${dueDate}T12:00:00`) : null }; if (editing) updateTask.mutate({ id: editing, ...payload }); else createTask.mutate(payload); }
  function cycleStatus(id: number, current: Status) { const next: Status = current === "todo" ? "doing" : current === "doing" ? "done" : "todo"; updateTask.mutate({ id, status: next }); }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">V</span><span>Vazifa<span className="brand-light">Flow</span></span></div>
        <div className="sidebar-copy"><span className="eyebrow">BUGUNGI FOKUS</span><p>Ishni ko‘rinadigan qil. Bir qadamdan boshlang.</p></div>
        <nav className="side-nav">
          <button className="side-link active"><span className="side-icon"><ListFilter size={17} /></span> Barcha vazifalar <span className="side-count">{stats.all}</span></button>
          <button className="side-link" onClick={() => setFilter("doing")}><span className="side-icon"><Clock3 size={17} /></span> Jarayonda <span className="side-count">{stats.doing}</span></button>
          <button className="side-link" onClick={() => setFilter("done")}><span className="side-icon"><CheckCircle2 size={17} /></span> Bajarilgan <span className="side-count">{stats.done}</span></button>
        </nav>
        <div className="sidebar-footer"><div className="tiny-dot" /> <span>Umumiy workspace</span><MoreHorizontal size={16} /></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Bugungi reja</strong></div><div className="topbar-actions"><span className="live-pill"><span className="live-dot" /> Jonli</span><button className="avatar">R</button></div></header>
        <section className="hero"><div><span className="eyebrow accent">JUMA, 20-NOYABR 2026</span><h1>Bugun nimani <em>oldinga</em> suramiz?</h1><p className="hero-note">Ro‘yxat emas, natija. Muhim ishlar shu yerda.</p></div><div className="progress-card"><div className="progress-ring" style={{ background: `conic-gradient(#3934a3 ${progress}%, #e9e8f5 0)` }}><div>{progress}<small>%</small></div></div><div><span className="eyebrow">KUNLIK PROGRESS</span><strong>{stats.done} / {stats.all || 0} bajarildi</strong><span className="muted">{progress === 100 ? "Ajoyib natija!" : "Ritmingizni saqlang"}</span></div></div></section>

        <section className="toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Vazifalardan qidiring..." /><kbd>⌘ K</kbd></div><div className="toolbar-right"><div className="select-wrap"><select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}><option value="all">Barcha holatlar</option><option value="todo">Kutilmoqda</option><option value="doing">Jarayonda</option><option value="done">Bajarildi</option></select><ChevronDown size={15} /></div><button className="primary-btn" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={18} /> Yangi vazifa</button></div></section>

        {showForm && <form className="task-form" onSubmit={submit}><div className="form-heading"><div><span className="eyebrow">{editing ? "VAZIFANI TAHRIRLASH" : "YANGI VAZIFA"}</span><h2>{editing ? "Vazifani aniqlashtiring" : "Keyingi ishingiz nima?"}</h2></div><button type="button" className="icon-btn" onClick={resetForm}><X size={18} /></button></div><div className="form-grid"><label className="field wide"><span>Sarlavha</span><input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Masalan: Hafta rejasini tayyorlash" maxLength={180} /></label><label className="field wide"><span>Izoh <small>(ixtiyoriy)</small></span><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Bu vazifa haqida qisqacha..." rows={2} /></label><label className="field"><span>Ustuvorlik</span><select value={priority} onChange={e => setPriority(e.target.value as Priority)}><option value="high">Yuqori</option><option value="medium">O‘rta</option><option value="low">Past</option></select></label><label className="field"><span>Muddat</span><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></label></div><div className="form-actions"><button type="button" className="ghost-btn" onClick={resetForm}>Bekor qilish</button><button className="primary-btn" type="submit" disabled={createTask.isPending || updateTask.isPending}>{editing ? "Saqlash" : "Vazifani qo‘shish"}</button></div></form>}

        <section className="board-heading"><div><span className="eyebrow">ISH OQIMI</span><h2>Vazifalar <span className="heading-count">{filteredTasks.length}</span></h2></div><button className="text-btn" onClick={() => clearDone.mutate()} disabled={!stats.done}>Bajarilganlarni tozalash <Trash2 size={15} /></button></section>
        {tasksQuery.isLoading ? <div className="empty-state"><div className="loader" /><p>Vazifalar yuklanmoqda...</p></div> : tasksQuery.isError ? <div className="empty-state error-state"><Sparkles size={28} /><h3>Ma’lumotni yuklab bo‘lmadi</h3><p>Server yoki ma’lumotlar bazasi bilan aloqa tekshirilmoqda.</p><button className="ghost-btn" onClick={() => tasksQuery.refetch()}>Qayta urinish</button></div> : filteredTasks.length === 0 ? <div className="empty-state"><div className="empty-icon"><Check size={25} /></div><h3>{search ? "Mos vazifa topilmadi" : "Ro‘yxat toza"}</h3><p>{search ? "Boshqa kalit so‘z bilan urinib ko‘ring." : "Birinchi vazifani qo‘shing va kunni boshlang."}</p><button className="primary-btn" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={17} /> Vazifa qo‘shish</button></div> : <div className="task-list">{filteredTasks.map(task => <article key={task.id} className={`task-card ${task.status === "done" ? "is-done" : ""}`}><button className={`status-toggle ${task.status}`} onClick={() => cycleStatus(task.id, task.status as Status)} aria-label="Holatni almashtirish">{task.status === "done" ? <Check size={17} /> : task.status === "doing" ? <span className="doing-dot" /> : <Circle size={17} />}</button><div className="task-main"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority-dot ${priorityMeta[task.priority as Priority].color}`} title={priorityMeta[task.priority as Priority].label} /></div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`status-label ${statusMeta[task.status as Status].color}`}>{statusMeta[task.status as Status].label}</span><span className="meta-separator" /> <span className="due"><CalendarDays size={14} /> {formatDate(task.dueDate)}</span></div></div><div className="task-actions"><button className="mini-btn" onClick={() => openEdit(task)}>Tahrirlash</button><button className="delete-btn" onClick={() => removeTask.mutate({ id: task.id })} aria-label="O‘chirish"><Trash2 size={16} /></button></div></article>)}</div>}
        <footer className="page-footer"><span>VazifaFlow · Ishni ko‘rinadigan qil</span><span>Oddiy. Aniq. Har kuni.</span></footer>
      </main>
    </div>
  );
}
