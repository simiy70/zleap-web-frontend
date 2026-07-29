import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PageShell, GlassHeader, GlassDock, NewItemCard, CardPagination } from '../components/shell';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import {
  AssistantDetailPage,
  CreateAssistantMenu,
  ExternalAgentPage,
  INFO_SOURCE_OPTIONS,
  PUBLIC_SOURCE_IDS,
  ScopeBadge,
  ZleapCreatePage,
} from '../components/assistant/AssistantCreation';

/* ─── SVG ICONS ─── */
const Icon = {
  Search:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Filter:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 5h16l-6.5 7.2V18l-3 1.5v-7.3L4 5z"/></svg>,
  Close:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  List:    () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Card:    () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Plus:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  More:    () => <svg width="15" height="15" fill="none" viewBox="0 0 15 15"><circle cx="7.5" cy="2.5" r="1.2" fill="currentColor"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="7.5" cy="12.5" r="1.2" fill="currentColor"/></svg>,
  Check:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Send:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  ChevronDown: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  Bell:    () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>,
  Help:    () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor"/></svg>,
  Lang:    () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 5h10"/><path d="M9 3v2"/><path d="M6 5c0 5 4 8 8 9"/><path d="M14 5c0 4-4 7-8 8"/><path d="M13 21l4-10 4 10"/><path d="M14.5 18h5"/></svg>,
  Bot:     () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="3"/><circle cx="8.5" cy="13" r="1.2" fill="currentColor"/><circle cx="15.5" cy="13" r="1.2" fill="currentColor"/><path d="M12 7V4"/><circle cx="12" cy="3" r="1" fill="currentColor"/></svg>,
  Compass: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polygon points="16 8 12 14 8 16 12 10 16 8"/></svg>,
  Star:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Sparkle: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z"/></svg>,
  Chat:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Grid:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>,
};

/* ─── 助手数据 ─── */
const assistants = [
  { id: 1, name: "test小狗",   emoji: "🐶", desc: "暂无简介", tone: "amber",   followed: true,  creator: "这里最…", followers: 28, dynamics: 16 },
  { id: 2, name: "飞书CLI",    emoji: "🤖", desc: "飞书研发全流程的智能助手，可代为召集会议、写报告。", tone: "slate", followed: true, creator: "研发团队" },
  { id: 3, name: "搜索引擎",   emoji: "🍇", desc: "多源信息聚合检索，同步整理关键结论。", tone: "violet", followed: true, creator: "运营团队" },
  { id: 4, name: "界面新闻",   emoji: "📰", desc: "追踪产品与设计动态，日报级摘要。", tone: "rose",   followed: true, creator: "运营团队" },
  { id: 5, name: "WENDANG",   emoji: "🐘", desc: "文档管理专家，帮你规整长文档。", tone: "gray",   followed: false },
  { id: 6, name: "611test",    emoji: "🦜", desc: "内部测试机器人，用于回归测试对话。", tone: "green",  followed: true, creator: "这里最…", followers: 12, dynamics: 8 },
];

/* ─── 对话数据 ─── */
const chatSessions = [
  { id: 101, name: "飞书CLI",    avatarKind: "cli",   time: "15:05",     preview: "收到。全景梳理与核心结论已就…", unread: false },
  { id: 102, name: "搜索引擎",   avatarKind: "grape", time: "15:03",     preview: "✅ 任务终结·档案封存确认 收…", unread: true  },
  { id: 103, name: "哦i皮",      avatarKind: "man1",  time: "三天前",    preview: "1", unread: false },
  { id: 104, name: "Theshy",     avatarKind: "man2",  time: "2026-6-30", preview: "你好呀，很开心见到你。以后你…", unread: false },
  { id: 105, name: "界面新闻",   avatarKind: "woman", time: "2026-6-16", preview: "知识库有哪些数据", unread: true  },
  { id: 106, name: "test小狗",   avatarKind: "dog",   time: "2026-6-16", preview: "嗨~看到你发了个 11，是手滑了…", unread: false },
  { id: 107, name: "611test",    avatarKind: "bird",  time: "2026-6-11", preview: "你好呀，很开心见到你。以后…", unread: false },
  { id: 108, name: "WENDANG",   avatarKind: "elephant", time: "2026-6-11", preview: "抱歉，处理出现问题了", unread: true },
];

/* 会话线程（右侧展示，简化示例：飞书CLI） */
const chatThread = [
  { role: "bot", type: "text", content: `整体来看，智跃平台已经从早期的"敏捷试错"平稳过渡到 **规范化管理** 阶段，管理颗粒度和底层稳定性都有了质的飞跃。这轮的信息盘点算是圆满完成了。看您是准备结案，还是有其他想要关注的点？` },
  { role: "time", content: "15:01" },
  { role: "bot", type: "card-success", title: "报告已创建《智跃平台研发迭代与架构演进全景回顾》", sub: "智跃平台研发迭代与架构演进全景回顾", rows: [["状态", "已完成"], ["进度", "100%"]], link: "点击查看详情" },
  { role: "bot", type: "text", content: `收到。全景梳理与核心结论已就位。您看是走归档结案，还是锁定特定模块（如 RAG 检索、MCP 治理或自动化分发）继续深潜？我随时配合您的节奏。` },
  { role: "time", content: "15:11" },
  { role: "bot", type: "card-error", title: "报告创建失败，失败原因：该时间段内暂无数据", rows: [["原因", "该时间段内暂无数据"], ["状态", "失败"]] },
];

/* ─── 头像组件 ─── */
const AVATAR_TONES = {
  amber:  { ring: "bg-[radial-gradient(circle_at_50%_50%,#fff2cf_0%,#ffe6a6_45%,rgba(255,230,166,0)_72%)]" },
  slate:  { ring: "bg-[radial-gradient(circle_at_50%_50%,#e6edf6_0%,#c6d3e2_50%,rgba(198,211,226,0)_75%)]" },
  violet: { ring: "bg-[radial-gradient(circle_at_50%_50%,#ede4ff_0%,#c9b6ee_50%,rgba(201,182,238,0)_75%)]" },
  rose:   { ring: "bg-[radial-gradient(circle_at_50%_50%,#ffe1e6_0%,#f5b9c4_50%,rgba(245,185,196,0)_75%)]" },
  gray:   { ring: "bg-[radial-gradient(circle_at_50%_50%,#eaeef2_0%,#c9d1da_50%,rgba(201,209,218,0)_75%)]" },
  green:  { ring: "bg-[radial-gradient(circle_at_50%_50%,#dff5c8_0%,#a9dc7b_50%,rgba(169,220,123,0)_75%)]" },
};

function AssistantAvatar({ emoji, tone = "amber", size = 76 }) {
  const t = AVATAR_TONES[tone] || AVATAR_TONES.amber;
  return (
    <div className={`flex items-center justify-center rounded-full ${t.ring}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.6), lineHeight: 1 }}>
      <span>{emoji}</span>
    </div>
  );
}

/* 会话头像（小尺寸带小圆点未读） */
function ChatAvatar({ kind, unread }) {
  const styles = {
    bell:     { cls: "bg-emerald-500 text-white",              content: <Icon.Bell /> },
    cli:      { cls: "bg-slate-600 text-white",                content: "🧑‍💼" },
    grape:    { cls: "bg-violet-500 text-white text-lg",       content: "🍇" },
    man1:     { cls: "bg-orange-400 text-white text-lg",       content: "🧔" },
    man2:     { cls: "bg-sky-500 text-white text-lg",          content: "🧑" },
    woman:    { cls: "bg-rose-400 text-white text-lg",         content: "👩" },
    dog:      { cls: "bg-amber-200",                           content: "🐶" },
    bird:     { cls: "bg-emerald-500",                         content: "🦜" },
    elephant: { cls: "bg-neutral-400 text-white text-lg",      content: "🐘" },
  };
  const s = styles[kind] || styles.cli;
  return (
    <div className="relative shrink-0">
      <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${s.cls}`}>
        <span>{s.content}</span>
      </div>
      {unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />}
    </div>
  );
}

/* ─── ASSISTANT CARD (管理视图) ─── */
function AssistantCard({ item, onEdit }) {
  return (
    <div className="group flex cursor-pointer flex-col items-center rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-md"
      style={{ minHeight: "220px" }}>
      <div className="flex w-full items-start justify-end">
        {onEdit && <DropdownMenu>
          <DropdownMenuTrigger><button onClick={e => e.stopPropagation()} aria-label={`操作${item.name}`}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-neutral-500/60 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-700"><Icon.More /></button></DropdownMenuTrigger>
          <DropdownMenuContent className="w-36"><DropdownMenuItem onClick={() => onEdit(item)}><i className="ri-edit-line" />编辑助手</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>}
      </div>
      <div className="mt-1">
        <AssistantAvatar emoji={item.emoji} tone={item.tone} />
      </div>
      <div className="mt-3 line-clamp-1 text-[15px] font-semibold text-neutral-900">{item.name}</div>
      {item.scope && <div className="mt-2 flex items-center gap-2"><ScopeBadge scope={item.scope} />{item.sourceIds && <span className="text-[10px] text-neutral-400">{item.sourceIds.length} 个信息源</span>}</div>}
      {item.creator === "这里最…" && (
        <div className="mt-2 flex items-center gap-2 text-[12px] text-neutral-400">
          <span><b className="font-medium text-neutral-600">{item.followers ?? 0}</b>粉丝</span>
          <span className="h-3 w-px bg-neutral-200" />
          <span><b className="font-medium text-neutral-600">{item.dynamics ?? 0}</b>动态</span>
        </div>
      )}
      {item.creator !== "这里最…" && <div className="mt-auto pt-4">
        {item.followed ? (
          <button className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3.5 py-1 text-[12px] font-medium text-emerald-600 transition hover:bg-emerald-50">
            <Icon.Check />
            <span>已关注</span>
          </button>
        ) : (
          <button className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3.5 py-1 text-[12px] font-medium text-white shadow-sm shadow-orange-500/25 transition hover:bg-orange-600">
            <Icon.Plus />
            <span>关注</span>
          </button>
        )}
      </div>}
    </div>
  );
}

/* ─── ASSISTANT LIST ROW (列表视图) ─── */
function AssistantRow({ item, onEdit }) {
  return (
    <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-all hover:border-neutral-300 hover:shadow-sm">
      <AssistantAvatar emoji={item.emoji} tone={item.tone} size={48} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-semibold text-neutral-900">{item.name}</div>
        <div className="mt-0.5 line-clamp-1 text-[12px] text-neutral-400">{item.desc}</div>
      </div>
      {item.creator && <div className="hidden shrink-0 text-[12px] text-neutral-400 md:block">创建人：{item.creator}</div>}
      {item.followed ? (
        <button className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[12px] font-medium text-emerald-600 transition hover:bg-emerald-50">
          <Icon.Check />
          <span>已关注</span>
        </button>
      ) : (
        <button className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[12px] font-medium text-white shadow-sm shadow-orange-500/25 transition hover:bg-orange-600">
          <Icon.Plus />
          <span>关注</span>
        </button>
      )}
      <button onClick={e => { e.stopPropagation(); onEdit?.(item); }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-500/60 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-700">
        <Icon.More />
      </button>
    </div>
  );
}

/* ─── 管理视图 ─── */
function ManagementView({ items, view, onCreateSelect, onEdit }) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const itemKey = items.map(item => item.id).join('|');
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [itemKey]);
  useEffect(() => setPage(current => Math.min(current, totalPages)), [totalPages]);

  if (view === "list") {
    return (
      <div className="space-y-2 p-6">
        {items.map(a => <AssistantRow key={a.id} item={a} onEdit={onEdit} />)}
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {onCreateSelect && <CreateAssistantMenu trigger={<NewItemCard label="创建助手" className="min-h-full" />} onSelect={onCreateSelect} />}
        {pagedItems.map(a => <AssistantCard key={a.id} item={a} onEdit={a.creator === "这里最…" ? onEdit : null} />)}
      </div>
      <CardPagination page={page} totalPages={totalPages} totalItems={items.length} onPageChange={setPage} className="mt-auto pt-8" />
    </div>
  );
}

/* ─── 对话视图 ─── */
function ChatView({ sessions, threadsBySessionId, activeChatId, onActiveChatChange, onSend, initialDraft = "" }) {
  const [chatSearch, setChatSearch] = useState("");
  const [draft, setDraft] = useState(initialDraft);
  const [visibleSessionCount, setVisibleSessionCount] = useState(6);
  const messagesRef = useRef(null);
  const sessionsListRef = useRef(null);
  const activeChat = sessions.find(c => c.id === activeChatId) || sessions[0];
  const thread = threadsBySessionId[activeChat?.id] || [];

  const filteredSessions = useMemo(() => {
    const kw = chatSearch.trim().toLowerCase();
    if (!kw) return sessions;
    return sessions.filter(c =>
      c.name.toLowerCase().includes(kw) || c.preview.toLowerCase().includes(kw)
    );
  }, [chatSearch, sessions]);

  const visibleSessions = filteredSessions.slice(0, visibleSessionCount);

  useEffect(() => {
    setVisibleSessionCount(6);
  }, [chatSearch]);

  useEffect(() => {
    const list = sessionsListRef.current;
    if (list && list.scrollHeight <= list.clientHeight && visibleSessionCount < filteredSessions.length) {
      setVisibleSessionCount(count => Math.min(count + 6, filteredSessions.length));
    }
  }, [visibleSessionCount, filteredSessions.length]);

  const handleSessionScroll = (event) => {
    const list = event.currentTarget;
    if (list.scrollHeight - list.scrollTop - list.clientHeight < 64) {
      setVisibleSessionCount(count => Math.min(count + 6, filteredSessions.length));
    }
  };

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [activeChatId, thread.length]);

  useEffect(() => {
    if (initialDraft) setDraft(initialDraft);
  }, [initialDraft]);

  if (!activeChat) return <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">暂无对话</div>;

  const send = () => {
    const value = draft.trim();
    if (!value) return;
    onSend(activeChat.id, value);
    setDraft("");
  };

  return (
    <div className="px-6 pt-8">
      <div className="flex min-h-0 overflow-hidden bg-white"
        style={{ height: "calc(100vh - 56px - 61px - 104px)" }}>
        {/* Left: chat list */}
        <aside className="flex w-[300px] shrink-0 flex-col border-r border-neutral-100 bg-[#fafaf8]">
          <div className="flex items-center gap-2 px-3 pt-3 pb-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Icon.Search /></span>
              <input value={chatSearch} onChange={e => setChatSearch(e.target.value)}
                className="h-8 w-full rounded-xl bg-white pl-9 pr-3 text-sm ring-1 ring-neutral-200 placeholder-neutral-400 outline-none transition focus:ring-orange-200"
                placeholder="搜索" />
            </div>
          </div>
          <div ref={sessionsListRef} onScroll={handleSessionScroll} className="flex-1 overflow-y-auto no-scrollbar px-2 pb-3">
            {visibleSessions.map(c => (
              <button key={c.id} onClick={() => onActiveChatChange(c.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${c.id === activeChatId ? "bg-white shadow-sm ring-1 ring-neutral-200" : "hover:bg-white/70"}`}>
                <ChatAvatar kind={c.avatarKind} unread={c.unread} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13.5px] font-semibold text-neutral-900">{c.name}</span>
                    <span className="shrink-0 text-[11px] text-neutral-400">{c.time}</span>
                  </div>
                  <div className="truncate text-[12px] text-neutral-500">{c.preview}</div>
                </div>
              </button>
            ))}
            {visibleSessionCount < filteredSessions.length && (
              <div className="py-3 text-center text-[11px] text-neutral-400">继续下滑加载</div>
            )}
          </div>
        </aside>

        {/* Right: chat area */}
        <main className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-100 px-6">
            <div className="text-[15px] font-semibold text-neutral-900">{activeChat.name}</div>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700">
              <Icon.More />
            </button>
          </div>

          <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto no-scrollbar bg-[#fafaf8] px-8 py-6">
            {thread.map((m, idx) => {
              if (m.role === "time") {
                return <div key={idx} className="py-1 text-center text-[12px] text-neutral-400">{m.content}</div>;
              }
              if (m.role === "user") {
                return <div key={idx} className="ml-auto max-w-[78%] whitespace-pre-wrap rounded-2xl bg-orange-500 px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-sm shadow-orange-500/15">{m.content}</div>;
              }
              if (m.type === "text") {
                const parts = m.content.split(/\*\*(.+?)\*\*/g);
                return (
                  <div key={idx} className="max-w-[80%] self-start rounded-2xl bg-white px-4 py-3 text-[13.5px] leading-relaxed text-neutral-800 ring-1 ring-neutral-100">
                    {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-neutral-900">{p}</strong> : <span key={i}>{p}</span>)}
                  </div>
                );
              }
              if (m.type === "card-success") {
                return (
                  <div key={idx} className="max-w-[72%] self-start rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3.5">
                    <div className="text-[13.5px] font-semibold text-neutral-900">{m.title}</div>
                    {m.sub && <div className="mt-1 text-[13px] text-neutral-600">{m.sub}</div>}
                    <div className="mt-2 flex items-center gap-6 text-[12.5px] text-neutral-600">
                      {m.rows.map(([k, v], i) => (
                        <span key={i}><span className="text-neutral-500">{k}：</span><span className="font-medium text-neutral-800">{v}</span></span>
                      ))}
                    </div>
                    {m.link && (
                      <button className="mt-2 inline-flex items-center gap-0.5 text-[12.5px] font-medium text-emerald-600 hover:text-emerald-700">
                        <span>{m.link}</span>
                        <span>›</span>
                      </button>
                    )}
                  </div>
                );
              }
              if (m.type === "card-error") {
                return (
                  <div key={idx} className="max-w-[72%] self-start rounded-2xl border border-rose-200/70 bg-rose-50/70 px-4 py-3.5">
                    <div className="text-[13.5px] font-semibold text-rose-800">{m.title}</div>
                    <div className="mt-2 space-y-1 text-[12.5px] text-rose-700">
                      {m.rows.map(([k, v], i) => (
                        <div key={i}><span className="text-rose-600/80">{k}：</span><span className="font-medium">{v}</span></div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="shrink-0 border-t border-neutral-100 bg-white p-4">
            <button className="mb-2 inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-[12px] text-neutral-600 transition hover:bg-neutral-200">
              开启新话题
            </button>
            <div className="relative rounded-xl border border-neutral-200 bg-white p-3 pr-11 transition focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows="2"
                placeholder={`随便给 ${activeChat.name} 发点什么~`}
                className="w-full resize-none border-0 bg-transparent text-[13.5px] text-neutral-800 outline-none placeholder-neutral-400" />
              <button onClick={send} disabled={!draft.trim()} className={`absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full transition ${draft.trim() ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-600" : "bg-neutral-100 text-neutral-400"}`}
                title="发送" aria-label="发送消息">
                <Icon.Send />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
const VIEW_TABS = [
  { id: "chat",       label: "对话",     Icon: Icon.Chat },
  { id: "management", label: "助手管理", Icon: Icon.Grid },
];

const SUB_TABS = [
  { id: "mine",      label: "我的关注" },
  { id: "created",   label: "我创建的" },
  { id: "recommend", label: "推荐" },
];

export default function AssistantPage({ onNavigate, initialPrompt = "", initialChat = "" }) {
  const [viewMode, setViewMode] = useState(initialPrompt || initialChat ? "chat" : "management");
  const [surface, setSurface] = useState("home"); // home | create | external | detail
  const [subTab, setSubTab] = useState("created");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [followFilter, setFollowFilter] = useState("all");
  const [customAssistants, setCustomAssistants] = useState([]);
  const [assistantEdits, setAssistantEdits] = useState({});
  const [detailId, setDetailId] = useState(null);
  const [sessions, setSessions] = useState(chatSessions);
  const [threadsBySessionId, setThreadsBySessionId] = useState(() => Object.fromEntries(
    chatSessions.map((session, index) => [session.id, index === 0 ? chatThread : [{ role: "bot", type: "text", content: session.preview }]])
  ));
  const [activeChatId, setActiveChatId] = useState(() => chatSessions.find(session => session.name === initialChat)?.id ?? 101);

  const normalizeAssistant = assistant => ({
    prompt: assistant.prompt || assistant.desc || "",
    scope: assistant.scope || (assistant.creator === "这里最…" ? "mine" : "enterprise"),
    visibleTargets: assistant.visibleTargets || [],
    sourceIds: assistant.sourceIds || PUBLIC_SOURCE_IDS,
    origin: assistant.origin || "Zleap",
    compatibility: assistant.compatibility || "compatible",
    ...assistant,
    ...(assistantEdits[assistant.id] || {}),
  });

  const allAssistants = useMemo(
    () => [...customAssistants, ...assistants].map(normalizeAssistant),
    [customAssistants, assistantEdits],
  );
  const detailAssistant = allAssistants.find(item => item.id === detailId) || null;

  const handleCreate = items => {
    const list = (Array.isArray(items) ? items : [items]).map((item, index) => ({
      id: item.id || `assistant-${Date.now()}-${index}`,
      followed: true,
      creator: "这里最…",
      followers: 0,
      dynamics: 0,
      scope: "mine",
      visibleTargets: [],
      sourceIds: PUBLIC_SOURCE_IDS,
      ...item,
    }));
    setCustomAssistants(previous => [...list, ...previous]);
    setSubTab("created");
    return list;
  };

  const openCreateSurface = kind => {
    setViewMode("management");
    setSurface(kind === "external" ? "external" : "create");
  };

  const openDetail = assistant => {
    setDetailId(assistant.id);
    setViewMode("management");
    setSurface("detail");
  };

  const saveAssistant = updated => {
    setCustomAssistants(previous => previous.map(item => item.id === updated.id ? { ...item, ...updated } : item));
    setAssistantEdits(previous => ({ ...previous, [updated.id]: { ...(previous[updated.id] || {}), ...updated } }));
    setSessions(previous => previous.map(session => session.assistantId === updated.id ? { ...session, name: updated.name } : session));
    setSurface("home");
    setSubTab("created");
  };

  const sendMessage = (sessionId, content) => {
    setThreadsBySessionId(previous => ({
      ...previous,
      [sessionId]: [...(previous[sessionId] || []), { role: "user", type: "text", content }],
    }));
    setSessions(previous => previous.map(session => session.id === sessionId ? { ...session, preview: content.replace(/\n/g, " ").slice(0, 34), time: "刚刚" } : session));
  };

  const finishExternalImport = (created, shouldSendInstruction) => {
    const newSessions = created.map((assistant, index) => ({
      id: `session-${assistant.id}`,
      assistantId: assistant.id,
      name: assistant.name,
      avatarKind: index % 2 ? "grape" : "cli",
      time: "刚刚",
      preview: shouldSendInstruction ? "已发送 Zleap 信息源连接指令" : "Agent 已接入 Zleap",
      unread: false,
    }));
    const newThreads = {};
    created.forEach((assistant, index) => {
      const sourceNames = INFO_SOURCE_OPTIONS.filter(source => assistant.sourceIds.includes(source.id)).map(source => source.name);
      newThreads[`session-${assistant.id}`] = shouldSendInstruction ? [{
        role: "user",
        type: "text",
        content: `请为当前 Agent 连接 Zleap 信息源能力。\n\n可访问的信息源：${sourceNames.join("、")}\n\n请执行：zleap mcp connect --assistant ${assistant.id} --sources ${assistant.sourceIds.join(",")}`,
      }] : [];
    });
    setSessions(previous => [...newSessions, ...previous]);
    setThreadsBySessionId(previous => ({ ...previous, ...newThreads }));
    setSurface("home");
    setSubTab("created");
    if (shouldSendInstruction && newSessions[0]) {
      setActiveChatId(newSessions[0].id);
      setViewMode("chat");
    } else {
      setViewMode("management");
    }
  };

  useEffect(() => {
    if (!initialChat) return;
    const match = sessions.find(session => session.name === initialChat);
    if (match) {
      setActiveChatId(match.id);
      setViewMode("chat");
      setSurface("home");
    }
  }, [initialChat, sessions]);

  const filteredAssistants = useMemo(() => {
    let base = allAssistants;
    if (subTab === "mine") base = base.filter(item => item.followed && item.creator !== "这里最…");
    if (subTab === "created") base = base.filter(item => item.creator === "这里最…");
    if (subTab === "recommend") base = allAssistants.filter(item => item.creator !== "这里最…");
    if (followFilter !== "all") base = base.filter(item => item.followed === (followFilter === "followed"));
    const keyword = search.trim().toLowerCase();
    if (!keyword) return base;
    return base.filter(item => item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword));
  }, [allAssistants, subTab, followFilter, search]);

  return <PageShell>
    <div className="flex min-h-screen flex-col">
      <GlassHeader />
      <main className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="glass-soft flex shrink-0 items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
          <nav className="flex shrink-0 items-center gap-1">
            {VIEW_TABS.map(tab => <button key={tab.id} onClick={() => { setSurface("home"); setViewMode(tab.id); }}
              className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm transition-colors ${viewMode === tab.id && surface === "home" ? "font-medium text-orange-600" : "text-neutral-500 hover:text-neutral-900"}`}>
              <span className={viewMode === tab.id && surface === "home" ? "text-orange-500" : "text-neutral-400"}><tab.Icon /></span><span>{tab.label}</span>
              {viewMode === tab.id && surface === "home" && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}
            </button>)}
          </nav>
          <div className="min-w-0 flex-1" />
          {surface === "home" && <div className="flex shrink-0 items-center gap-3">
            {viewMode === "management" && <div className="flex items-center gap-2">
              <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Icon.Search /></span><input value={search} onChange={event => setSearch(event.target.value)} className={`h-8 w-52 rounded-xl bg-neutral-100/80 pl-9 text-sm placeholder-neutral-400 outline-none transition ring-1 ring-transparent focus:w-64 focus:bg-white focus:ring-orange-200 ${search ? "pr-8" : "pr-3"}`} placeholder="搜索助手…" />{search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>}</div>
              <div className="relative"><button onClick={() => setFilterOpen(value => !value)} aria-expanded={filterOpen} title="筛选" aria-label="筛选" className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${filterOpen || followFilter !== "all" ? "bg-orange-50 text-orange-500 ring-1 ring-orange-200" : "bg-neutral-100/80 text-neutral-500 hover:bg-neutral-200/80 hover:text-neutral-700"}`}><Icon.Filter />{followFilter !== "all" && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />}</button>
                {filterOpen && <><button className="fixed inset-0 z-30 cursor-default" onClick={() => setFilterOpen(false)} aria-label="关闭筛选" /><div className="glass-strong absolute right-0 top-10 z-40 w-48 overflow-hidden rounded-2xl p-1 shadow-xl"><div className="px-3 py-2 text-xs font-semibold text-neutral-500">筛选</div>{[["all", "全部助手"], ["followed", "已关注"], ["unfollowed", "未关注"]].map(([value, label]) => <button key={value} onClick={() => { setFollowFilter(value); setFilterOpen(false); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/70 ${followFilter === value ? "bg-orange-50/80 text-orange-600" : "text-neutral-700"}`}><span className="flex-1">{label}</span>{followFilter === value && <Icon.Check />}</button>)}</div></>}
              </div>
            </div>}
            <CreateAssistantMenu trigger={<button className="flex h-8 items-center gap-1.5 rounded-xl bg-orange-500 px-3 text-sm font-medium text-white shadow-sm shadow-orange-500/25 transition hover:bg-orange-600"><Icon.Plus /><span>创建助手</span><i className="ri-arrow-down-s-line" /></button>} onSelect={openCreateSurface} />
          </div>}
        </div>

        {surface === "home" && viewMode === "management" && <nav className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-neutral-200/40 px-8 py-3 no-scrollbar">
          {SUB_TABS.map(tab => <button key={tab.id} onClick={() => setSubTab(tab.id)} className={`flex h-9 shrink-0 items-center rounded-full border px-5 text-sm font-medium transition ${subTab === tab.id ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/20" : "border-neutral-200 bg-white text-neutral-600 hover:border-orange-200 hover:text-orange-600"}`}>{tab.label}</button>)}
        </nav>}

        <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${surface === "home" ? "pb-32" : "pb-24"}`}>
          {surface === "create" && <ZleapCreatePage onBack={() => setSurface("home")} onCreate={handleCreate} onEdit={openDetail} />}
          {surface === "external" && <ExternalAgentPage onBack={() => setSurface("home")} onCreate={handleCreate} onComplete={finishExternalImport} existingNames={new Set(allAssistants.map(item => item.name))} />}
          {surface === "detail" && detailAssistant && <AssistantDetailPage assistant={detailAssistant} onBack={() => setSurface("home")} onSave={saveAssistant} />}
          {surface === "home" && (viewMode === "management"
            ? <ManagementView items={filteredAssistants} view="card" onCreateSelect={openCreateSurface} onEdit={openDetail} />
            : <ChatView sessions={sessions} threadsBySessionId={threadsBySessionId} activeChatId={activeChatId} onActiveChatChange={setActiveChatId} onSend={sendMessage} initialDraft={initialPrompt} />)}
        </div>
      </main>
    </div>
    <GlassDock active="assistant" onNavigate={onNavigate} />
  </PageShell>;
}
