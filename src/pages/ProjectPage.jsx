import React, { useMemo, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';

const availableAgents = [
  { id: 'feishu', name: '飞书 CLI', emoji: '🤖', source: 'system', skills: ['飞书协作', '会议纪要', '报告生成'], tools: ['飞书日历', '飞书文档'], sources: ['研发周报', '会议记录'] },
  { id: 'research', name: '研究分析 Agent', emoji: '🔎', source: 'system', skills: ['深度研究', '竞品分析', '数据归纳'], tools: ['联网搜索', '网页读取'], sources: ['竞品资料库', '用户反馈'] },
  { id: 'codex-local', name: 'Codex 本地 Agent', emoji: '⌘', source: 'local', skills: ['代码开发', '代码审查', '终端操作'], tools: ['本地终端', 'GitHub'], sources: ['Zleap Web 仓库'] },
];

const initialProjects = [
  {
    id: 'zleap-v1',
    name: 'Zleap Agent 体验升级',
    description: '# 项目说明\n\n统一 Agent 与项目空间的协作心智，完成新版本设计与前端验证。',
    scope: '私密',
    owner: 'Zhang Wei',
    agentIds: ['research', 'codex-local'],
    members: ['Zhang Wei', '严伊靖', '陈一'],
    tools: ['联网搜索', '网页读取', 'GitHub'],
    sourceNames: ['竞品资料库', 'Zleap Web 仓库'],
    resources: [
      { id: 'r1', name: 'Agent 中心 PRD v1.0', type: '文件', updatedAt: '今天 10:20' },
      { id: 'r2', name: '竞品资料库', type: '信息源', updatedAt: '昨天' },
      { id: 'r3', name: '协作流程设计稿', type: 'Agent 产出', updatedAt: '7 月 29 日' },
    ],
    sessions: [
      { id: 'general', name: '项目总群', participants: ['Zhang Wei', '严伊靖', '研究分析 Agent', 'Codex 本地 Agent'] },
      { id: 'design', name: '设计评审', participants: ['严伊靖', 'Zhang Wei', '研究分析 Agent'] },
    ],
    messages: {
      general: [
        { id: 1, sender: 'Zhang Wei', kind: 'user', text: '@研究分析 Agent 帮我们梳理这次改版的用户心智。', time: '10:10' },
        { id: 2, sender: '研究分析 Agent', kind: 'agent', role: '项目研究', text: '建议把 Agent 视为联系人，把项目视为协作现场。两者通过参与者结构区分。', time: '10:12' },
      ],
      design: [{ id: 1, sender: '严伊靖', kind: 'user', text: '顶部二级导航继续沿用信息源模块的形式。', time: '昨天' }],
    },
    workItems: [
      { id: 'w1', projectId: 'zleap-v1', title: '重构项目协作首页', description: '群聊与当前工作同时可见。', status: 'doing', assigneeType: 'agent', assigneeId: 'codex-local', dueAt: '2026-08-02', sourceType: 'chat', sourceSessionId: 'general', sourceMessageId: 1, createdAt: '2026-07-30', updatedAt: '2026-07-31' },
      { id: 'w2', projectId: 'zleap-v1', title: '确认 Agent 历史会话交互', description: '', status: 'todo', assigneeType: 'user', assigneeId: '严伊靖', dueAt: '2026-08-01', sourceType: 'manual', createdAt: '2026-07-31', updatedAt: '2026-07-31' },
      { id: 'w3', projectId: 'zleap-v1', title: '完成信息源导航样式统一', description: '', status: 'done', assigneeType: 'user', assigneeId: 'Zhang Wei', sourceType: 'manual', createdAt: '2026-07-29', updatedAt: '2026-07-30' },
    ],
  },
  {
    id: 'growth',
    name: '增长实验室',
    description: '沉淀增长假设、实验资料和复盘结果。',
    scope: '私密',
    owner: 'Zhang Wei',
    agentIds: ['research'],
    members: ['Zhang Wei'],
    tools: ['联网搜索'],
    sourceNames: ['用户反馈'],
    resources: [],
    sessions: [{ id: 'general-growth', name: '项目总群', participants: ['Zhang Wei', '研究分析 Agent'] }],
    messages: { 'general-growth': [] },
    workItems: [],
  },
];

const spaceTabs = [['collaboration', '协作', 'ri-message-3-line'], ['work', '工作', 'ri-layout-column-line'], ['resources', '资料', 'ri-folder-3-line']];
const statuses = { todo: ['待处理', 'bg-neutral-100 text-neutral-600'], doing: ['进行中', 'bg-orange-50 text-orange-600'], done: ['已完成', 'bg-emerald-50 text-emerald-600'] };

function AgentAvatar({ agent, size = 'md' }) {
  const cls = size === 'sm' ? 'h-8 w-8 text-sm' : 'h-10 w-10 text-lg';
  return <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-violet-100 ring-1 ring-white ${cls}`}>{agent.emoji}</span>;
}

function LocalBadge({ agent }) {
  return agent?.source === 'local' ? <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">本地</span> : null;
}

function CreateProjectDialog({ open, onOpenChange, onCreate }) {
  const [name, setName] = useState('');
  const submit = () => { if (!name.trim()) return; onCreate(name.trim()); setName(''); onOpenChange(false); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>创建项目</DialogTitle></DialogHeader><label><span className="mb-1.5 block text-xs text-neutral-500">项目名称</span><Input autoFocus value={name} onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') submit(); }} placeholder="输入项目名称" /></label><DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button><Button disabled={!name.trim()} onClick={submit}>创建</Button></DialogFooter></DialogContent></Dialog>;
}

function ProjectList({ projects, onOpen, onCreate }) {
  const [query, setQuery] = useState('');
  const filtered = projects.filter(project => project.name.toLowerCase().includes(query.toLowerCase()));
  return <><div className="glass-soft sticky top-14 z-30 flex items-center gap-4 border-x-0 border-t-0 px-8 py-2.5"><div className="flex flex-1 items-center gap-2 text-sm font-medium text-orange-600"><i className="ri-folder-3-line" />项目空间</div><div className="relative"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索项目…" className="h-8 w-52 rounded-xl bg-neutral-100/80 pl-9 pr-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-orange-200" /></div><Button size="sm" className="h-8" onClick={onCreate}><i className="ri-add-line" />创建项目</Button></div><main className="px-8 pb-32 pt-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><button onClick={onCreate} className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/40 text-neutral-400 hover:border-orange-300 hover:text-orange-500"><i className="ri-add-line text-3xl" /><span className="mt-3 text-sm font-medium">创建项目</span></button>{filtered.map(project => <button key={project.id} onClick={() => onOpen(project.id)} className="min-h-[190px] rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl text-orange-500"><i className="ri-folder-3-fill" /></span><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500">{project.scope}</span></div><h2 className="mt-4 font-semibold">{project.name}</h2><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-400">{project.description.replace(/^# 项目说明\s*/, '') || '尚未填写项目说明'}</p><div className="mt-4 flex gap-3 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400"><span>{project.agentIds.length} Agent</span><span>{project.members.length} 成员</span><span>{project.workItems.length} 工作</span></div></button>)}</div></main></>;
}

function WorkBadge({ status }) {
  const [label, cls] = statuses[status];
  return <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${cls}`}>{label}</span>;
}

function Assignee({ item, project }) {
  const agent = item.assigneeType === 'agent' ? availableAgents.find(agentItem => agentItem.id === item.assigneeId) : null;
  return <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">{agent ? <><AgentAvatar agent={agent} size="sm" /><span>{agent.name}</span><LocalBadge agent={agent} /></> : <><span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-[10px]">{item.assigneeId?.slice(0, 1) || '?'}</span><span>{item.assigneeId || '未分配'}</span></>}</div>;
}

function WorkCard({ item, project, onClick, compact = false }) {
  return <button onClick={onClick} className={`w-full rounded-2xl bg-white text-left ring-1 ring-neutral-200/70 transition hover:ring-orange-200 ${compact ? 'p-3.5' : 'p-4'}`}><div className="flex items-start gap-2"><h3 className="min-w-0 flex-1 text-sm font-medium leading-5">{item.title}</h3><WorkBadge status={item.status} /></div>{!compact && item.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-400">{item.description}</p>}<div className="mt-3 flex items-center justify-between"><Assignee item={item} project={project} />{item.dueAt && <span className="text-[10px] text-neutral-400">{item.dueAt.slice(5)} 截止</span>}</div></button>;
}

function WorkItemDrawer({ open, item, project, onClose, onSave }) {
  const blank = { title: '', description: '', status: 'todo', assigneeType: 'user', assigneeId: project.members[0], dueAt: '', sourceType: 'manual' };
  const [draft, setDraft] = useState(item || blank);
  React.useEffect(() => setDraft(item || blank), [item, open, project.id]);
  if (!open) return null;
  const people = project.members.map(name => ({ value: `user:${name}`, label: name })).concat(availableAgents.filter(agent => project.agentIds.includes(agent.id)).map(agent => ({ value: `agent:${agent.id}`, label: `${agent.name}${agent.source === 'local' ? '（本地）' : ''}` })));
  const assigneeValue = `${draft.assigneeType}:${draft.assigneeId}`;
  return <div className="fixed inset-0 z-[80] bg-slate-950/20" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><aside className="absolute inset-y-0 right-0 w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-semibold">{item ? '工作详情' : '分配工作'}</h2><button onClick={onClose} className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-neutral-100"><i className="ri-close-line" /></button></div><div className="mt-6 space-y-5"><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">标题</span><Input autoFocus value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="要完成什么？" /></label><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">说明</span><Textarea value={draft.description || ''} onChange={event => setDraft({ ...draft, description: event.target.value })} rows="6" className="resize-none" placeholder="补充背景、要求或交付标准" /></label><div className="grid grid-cols-2 gap-4"><label><span className="mb-1.5 block text-xs text-neutral-500">状态</span><select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })} className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm">{Object.entries(statuses).map(([id, [label]]) => <option key={id} value={id}>{label}</option>)}</select></label><label><span className="mb-1.5 block text-xs text-neutral-500">负责人</span><select value={assigneeValue} onChange={event => { const [assigneeType, ...rest] = event.target.value.split(':'); setDraft({ ...draft, assigneeType, assigneeId: rest.join(':') }); }} className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm">{people.map(person => <option key={person.value} value={person.value}>{person.label}</option>)}</select></label></div><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">截止时间</span><Input type="date" value={draft.dueAt || ''} onChange={event => setDraft({ ...draft, dueAt: event.target.value })} /></label>{item?.sourceType === 'chat' && <div className="rounded-xl bg-orange-50 px-3 py-2.5 text-xs text-orange-700"><i className="ri-chat-quote-line mr-1" />来自项目群聊</div>}</div><div className="mt-8 flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>取消</Button><Button disabled={!draft.title.trim() || !draft.assigneeId} onClick={() => onSave(draft)}>保存</Button></div></aside></div>;
}

function PendingWorkCard({ pending, project, onConfirm, onCancel }) {
  const agent = availableAgents.find(item => item.id === pending.assigneeId);
  return <div className="mx-auto max-w-[760px] rounded-2xl bg-white p-4 shadow-lg ring-1 ring-orange-200"><div className="flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500"><i className="ri-checkbox-circle-line" /></span><div className="min-w-0 flex-1"><div className="text-sm font-semibold">添加到当前工作？</div><div className="mt-1 text-sm text-neutral-600">{pending.title}</div><div className="mt-3 flex items-center gap-2 text-xs text-neutral-400"><span>负责人</span>{agent ? <><AgentAvatar agent={agent} size="sm" /><span>{agent.name}</span><LocalBadge agent={agent} /></> : <span>{pending.assigneeId}</span>}</div></div></div><div className="mt-4 flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={onCancel}>取消</Button><Button size="sm" onClick={onConfirm}>确认添加</Button></div></div>;
}

function Collaboration({ project, onUpdate, onOpenWork, onNewWork }) {
  const [activeId, setActiveId] = useState(project.sessions[0]?.id);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(null);
  const active = project.sessions.find(session => session.id === activeId) || project.sessions[0];
  const messages = project.messages[active?.id] || [];
  const currentWork = project.workItems.filter(item => item.status !== 'done');
  const send = () => {
    const value = draft.trim();
    if (!value) return;
    const messageId = Date.now();
    onUpdate({ ...project, messages: { ...project.messages, [active.id]: [...messages, { id: messageId, sender: 'Zhang Wei', kind: 'user', text: value, time: '刚刚' }] } });
    if (/分配|负责|完成|工作|任务/.test(value)) {
      const matchedAgent = availableAgents.find(agent => project.agentIds.includes(agent.id) && value.includes(agent.name.split(' ')[0]));
      setPending({ title: value.replace(/^@?\S+\s*/, '').replace(/[。！!]$/, '').slice(0, 38) || value.slice(0, 38), description: '', status: 'todo', assigneeType: matchedAgent ? 'agent' : 'user', assigneeId: matchedAgent?.id || project.members[0], sourceType: 'chat', sourceSessionId: active.id, sourceMessageId: messageId });
    }
    setDraft('');
  };
  const confirm = () => {
    const timestamp = new Date().toISOString();
    onUpdate({ ...project, workItems: [{ ...pending, id: `work-${Date.now()}`, projectId: project.id, createdAt: timestamp, updatedAt: timestamp }, ...project.workItems] });
    setPending(null);
  };
  return <div className="flex min-h-0 flex-1 overflow-hidden">
    <aside className="w-56 shrink-0 border-r border-neutral-200/60 bg-white p-3"><div className="flex items-center justify-between px-2 py-2"><span className="text-xs font-semibold text-neutral-500">群聊</span><button className="text-orange-500" title="新建群聊"><i className="ri-add-line" /></button></div><div className="space-y-1">{project.sessions.map(session => <button key={session.id} onClick={() => setActiveId(session.id)} className={`w-full rounded-xl px-3 py-3 text-left ${active?.id === session.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-neutral-50'}`}><div className="flex items-center gap-2"><i className="ri-group-2-line" /><span className="truncate text-sm font-medium">{session.name}</span></div><div className="mt-1 pl-6 text-[10px] text-neutral-400">{session.participants.length} 位参与者</div></button>)}</div></aside>
    <section className="flex min-w-0 flex-1 flex-col bg-neutral-50/45"><header className="border-b border-neutral-200/60 bg-white px-6 py-3.5"><div className="font-semibold">{active?.name}</div><div className="mt-1 truncate text-xs text-neutral-400">{active?.participants.join('、')}</div></header><div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[760px] space-y-5">{messages.map(message => <div key={message.id} className={`flex gap-3 ${message.kind === 'user' ? 'justify-end' : ''}`}>{message.kind === 'agent' && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600"><i className="ri-robot-2-line" /></span>}<div className="max-w-[76%]"><div className={`mb-1 text-[11px] text-neutral-400 ${message.kind === 'user' ? 'text-right' : ''}`}>{message.sender}{message.role ? ` · ${message.role}` : ''}</div><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.kind === 'user' ? 'bg-cyan-600 text-white' : 'bg-white ring-1 ring-neutral-200/70'}`}>{message.text}</div><div className={`mt-1 text-[10px] text-neutral-300 ${message.kind === 'user' ? 'text-right' : ''}`}>{message.time}</div></div></div>)}{pending && <PendingWorkCard pending={pending} project={project} onConfirm={confirm} onCancel={() => setPending(null)} />}</div></div><div className="border-t border-neutral-100 bg-white p-4"><div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-200/70"><Textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} rows="2" className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder="发送消息，或直接分配工作…" /><div className="mt-2 flex items-center justify-between"><div className="flex gap-1 text-neutral-400"><button className="h-8 w-8 rounded-lg hover:bg-white" title="引用项目资料"><i className="ri-folder-3-line" /></button><button className="h-8 w-8 rounded-lg hover:bg-white" title="@ Agent"><i className="ri-at-line" /></button></div><Button size="sm" onClick={send} disabled={!draft.trim()}><i className="ri-send-plane-2-line" />发送</Button></div></div></div></section>
    <aside className="w-72 shrink-0 border-l border-neutral-200/60 bg-white p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold">当前工作</span><Button size="sm" variant="outline" onClick={onNewWork}><i className="ri-add-line" />分配</Button></div><div className="mt-4 space-y-3 overflow-y-auto">{currentWork.map(item => <WorkCard key={item.id} compact item={item} project={project} onClick={() => onOpenWork(item)} />)}{!currentWork.length && <div className="rounded-2xl border border-dashed border-neutral-200 py-8 text-center"><div className="text-sm text-neutral-400">还没有工作项</div><button onClick={onNewWork} className="mt-2 text-xs text-orange-500">分配工作</button></div>}</div></aside>
  </div>;
}

function WorkBoard({ project, onOpenWork, onNewWork }) {
  const [query, setQuery] = useState('');
  const [assignee, setAssignee] = useState('all');
  const filtered = project.workItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) && (assignee === 'all' || `${item.assigneeType}:${item.assigneeId}` === assignee));
  return <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[1200px]"><div className="mb-5 flex items-center gap-3"><div className="relative"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="w-64 pl-9" placeholder="搜索工作" /></div><select value={assignee} onChange={event => setAssignee(event.target.value)} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部负责人</option>{project.members.map(member => <option key={member} value={`user:${member}`}>{member}</option>)}{availableAgents.filter(agent => project.agentIds.includes(agent.id)).map(agent => <option key={agent.id} value={`agent:${agent.id}`}>{agent.name}</option>)}</select><Button className="ml-auto" onClick={onNewWork}><i className="ri-add-line" />分配工作</Button></div><div className="grid gap-4 lg:grid-cols-3">{Object.entries(statuses).map(([status, [label]]) => <section key={status} className="rounded-2xl bg-neutral-100/70 p-3"><div className="flex items-center justify-between px-2 pb-3"><span className="text-sm font-semibold">{label}</span><span className="text-xs text-neutral-400">{filtered.filter(item => item.status === status).length}</span></div><div className="space-y-3">{filtered.filter(item => item.status === status).map(item => <WorkCard key={item.id} item={item} project={project} onClick={() => onOpenWork(item)} />)}{!filtered.some(item => item.status === status) && <div className="rounded-xl border border-dashed border-neutral-200 bg-white/60 py-8 text-center text-xs text-neutral-400">暂无工作</div>}</div></section>)}</div></div></div>;
}

function Resources({ project, onUpdate }) {
  const [name, setName] = useState('');
  const add = () => { if (!name.trim()) return; onUpdate({ ...project, resources: [{ id: Date.now(), name: name.trim(), type: '文件', updatedAt: '刚刚' }, ...project.resources] }); setName(''); };
  return <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[980px]"><div className="mb-5 flex justify-end gap-3"><Input value={name} onChange={event => setName(event.target.value)} placeholder="输入资料名称" className="w-64" /><Button disabled={!name.trim()} onClick={add}><i className="ri-add-line" />添加资料</Button></div><div className="grid gap-3">{project.resources.map(resource => <div key={resource.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200/70"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500"><i className={resource.type === '信息源' ? 'ri-database-2-line' : 'ri-file-text-line'} /></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{resource.name}</div><div className="mt-1 text-[11px] text-neutral-400">{resource.type} · {resource.updatedAt}</div></div><button onClick={() => onUpdate({ ...project, resources: project.resources.filter(item => item.id !== resource.id) })} className="text-neutral-300 hover:text-rose-500" title="移除资料"><i className="ri-delete-bin-line" /></button></div>)}{!project.resources.length && <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-neutral-200/70"><div className="text-sm text-neutral-400">还没有项目资料</div><button className="mt-2 text-xs text-orange-500">添加资料</button></div>}</div></div></div>;
}

function DrawerShell({ title, onClose, children, width = 'max-w-2xl' }) {
  return <div className="fixed inset-0 z-[70] bg-slate-950/20" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><aside className={`absolute inset-y-0 right-0 w-full ${width} overflow-y-auto bg-white p-6 shadow-2xl`}><div className="flex items-center justify-between"><h2 className="font-semibold">{title}</h2><button onClick={onClose} className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-neutral-100"><i className="ri-close-line" /></button></div>{children}</aside></div>;
}

function OverviewDrawer({ project, onClose, onUpdate, onParticipants, onSettings }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.description);
  const projectAgents = availableAgents.filter(agent => project.agentIds.includes(agent.id));
  const effectiveSkills = useMemo(() => {
    const map = new Map();
    projectAgents.forEach(agent => agent.skills.forEach(skill => map.set(skill, [...(map.get(skill) || []), agent.name])));
    return [...map.entries()];
  }, [project.agentIds.join(',')]);
  const effectiveTools = useMemo(() => projectAgents.flatMap(agent => agent.tools.map(tool => ({ tool, agent: agent.name }))).filter(item => project.tools.includes(item.tool)).filter((item, index, list) => list.findIndex(other => other.tool === item.tool) === index), [project.agentIds.join(','), project.tools.join(',')]);
  return <DrawerShell title="空间概览" onClose={onClose} width="max-w-3xl"><div className="mt-6 space-y-4">
    <section className="rounded-2xl bg-neutral-50 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">项目说明</h3><Button size="sm" variant="outline" onClick={() => { if (editing) { onUpdate({ ...project, description: draft }); setEditing(false); } else setEditing(true); }}>{editing ? '保存' : '编辑'}</Button></div>{editing ? <Textarea value={draft} onChange={event => setDraft(event.target.value)} rows="7" className="mt-4 resize-none font-mono" /> : <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-600">{project.description || <button onClick={() => setEditing(true)} className="text-orange-500">添加项目说明</button>}</div>}</section>
    <div className="grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-neutral-200/70 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">参与者</h3><button onClick={onParticipants} className="text-xs text-orange-500">管理</button></div><div className="mt-4 flex -space-x-2">{project.members.slice(0, 4).map(member => <span key={member} title={member} className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xs ring-2 ring-white">{member.slice(0, 1)}</span>)}{projectAgents.map(agent => <AgentAvatar key={agent.id} agent={agent} size="sm" />)}</div><div className="mt-3 text-xs text-neutral-400">{project.members.length} 位成员 · {projectAgents.length} 个 Agent</div></section><section className="rounded-2xl border border-neutral-200/70 p-5"><h3 className="font-semibold">空间状态</h3><div className="mt-4 flex items-center justify-between text-sm"><span className="text-neutral-400">权限</span><span>{project.scope}</span></div><div className="mt-3 flex items-center justify-between text-sm"><span className="text-neutral-400">负责人</span><span>{project.owner}</span></div></section></div>
    <section className="rounded-2xl border border-neutral-200/70 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">可用 Skills</h3><button onClick={onParticipants} className="text-xs text-orange-500">管理</button></div><div className="mt-4 flex flex-wrap gap-2">{effectiveSkills.map(([skill, owners]) => <span key={skill} title={owners.join('、')} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs text-orange-700">{skill}<span className="ml-1 text-orange-400">· {owners[0]}</span></span>)}{!effectiveSkills.length && <span className="text-xs text-neutral-400">添加 Agent 后显示可用 Skills</span>}</div></section>
    <div className="grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-neutral-200/70 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">已授权 Tools</h3><button onClick={onSettings} className="text-xs text-orange-500">管理</button></div><div className="mt-4 flex flex-wrap gap-2">{effectiveTools.map(item => <span key={item.tool} title={item.agent} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs text-violet-700">{item.tool}</span>)}{!effectiveTools.length && <span className="text-xs text-neutral-400">还没有授权 Tool</span>}</div></section><section className="rounded-2xl border border-neutral-200/70 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">已授权信息源</h3><button onClick={onSettings} className="text-xs text-orange-500">管理</button></div><div className="mt-4 flex flex-wrap gap-2">{project.sourceNames.map(source => <span key={source} className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs text-cyan-700">{source}</span>)}{!project.sourceNames.length && <span className="text-xs text-neutral-400">还没有授权信息源</span>}</div></section></div>
    <section className="rounded-2xl border border-neutral-200/70 p-5"><h3 className="font-semibold">最近资料</h3><div className="mt-4 space-y-3">{project.resources.slice(0, 4).map(resource => <div key={resource.id} className="flex items-center gap-2 text-sm"><i className="ri-file-text-line text-violet-500" /><span className="min-w-0 flex-1 truncate">{resource.name}</span><span className="text-[10px] text-neutral-400">{resource.updatedAt}</span></div>)}{!project.resources.length && <div className="text-xs text-neutral-400">还没有项目资料</div>}</div></section>
  </div></DrawerShell>;
}

function ParticipantsDrawer({ project, onClose, onUpdate }) {
  return <DrawerShell title="参与者" onClose={onClose} width="max-w-lg"><div className="mt-6"><h3 className="text-xs font-semibold text-neutral-400">项目成员</h3><div className="mt-3 space-y-2">{project.members.map((member, index) => <div key={member} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs ring-1 ring-neutral-200">{member.slice(0, 1)}</span><span className="flex-1 text-sm font-medium">{member}</span>{index === 0 && <span className="text-[10px] text-neutral-400">负责人</span>}</div>)}</div><h3 className="mt-7 text-xs font-semibold text-neutral-400">项目 Agent</h3><div className="mt-3 space-y-2">{availableAgents.map(agent => { const added = project.agentIds.includes(agent.id); return <div key={agent.id} className="flex items-center gap-3 rounded-xl border border-neutral-200/70 p-3"><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm font-medium">{agent.name}<LocalBadge agent={agent} /></div><div className="mt-1 truncate text-[10px] text-neutral-400">{agent.skills.join(' · ')}</div></div><Button size="sm" variant={added ? 'outline' : 'default'} onClick={() => onUpdate({ ...project, agentIds: added ? project.agentIds.filter(id => id !== agent.id) : [...project.agentIds, agent.id] })}>{added ? '移除' : '添加'}</Button></div>; })}</div></div></DrawerShell>;
}

function SettingsDrawer({ project, onClose, onUpdate }) {
  const agents = availableAgents.filter(agent => project.agentIds.includes(agent.id));
  const allTools = [...new Set(agents.flatMap(agent => agent.tools))];
  const allSources = [...new Set(agents.flatMap(agent => agent.sources))];
  return <DrawerShell title="项目设置" onClose={onClose} width="max-w-lg"><div className="mt-6 space-y-6"><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">项目名称</span><Input value={project.name} onChange={event => onUpdate({ ...project, name: event.target.value })} /></label><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">权限</span><select value={project.scope} onChange={event => onUpdate({ ...project, scope: event.target.value })} className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm"><option>私密</option><option>共享</option><option>公开</option></select></label><section><h3 className="text-sm font-semibold">Tools 授权</h3><div className="mt-3 space-y-2">{allTools.map(tool => <label key={tool} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 text-sm"><span>{tool}</span><Switch checked={project.tools.includes(tool)} onCheckedChange={checked => onUpdate({ ...project, tools: checked ? [...project.tools, tool] : project.tools.filter(item => item !== tool) })} /></label>)}{!allTools.length && <div className="text-xs text-neutral-400">添加 Agent 后可配置 Tools</div>}</div></section><section><h3 className="text-sm font-semibold">信息源授权</h3><div className="mt-3 space-y-2">{allSources.map(source => <label key={source} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 text-sm"><span>{source}</span><Switch checked={project.sourceNames.includes(source)} onCheckedChange={checked => onUpdate({ ...project, sourceNames: checked ? [...project.sourceNames, source] : project.sourceNames.filter(item => item !== source) })} /></label>)}{!allSources.length && <div className="text-xs text-neutral-400">添加 Agent 后可配置信息源</div>}</div></section><label className="flex items-center justify-between border-t border-neutral-100 pt-5 text-sm"><span>项目通知</span><Switch defaultChecked /></label><section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4"><div className="flex gap-2"><Button variant="outline">归档项目</Button><Button variant="destructive">删除项目</Button></div></section></div></DrawerShell>;
}

export default function ProjectPage({ onNavigate }) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState('collaboration');
  const [createOpen, setCreateOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workDrawerOpen, setWorkDrawerOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const project = projects.find(item => item.id === activeId);
  const updateProject = next => setProjects(previous => previous.map(item => item.id === next.id ? next : item));
  const createProject = name => {
    const id = `project-${Date.now()}`;
    setProjects(previous => [{ id, name, description: '', scope: '私密', owner: 'Zhang Wei', agentIds: [], members: ['Zhang Wei'], tools: [], sourceNames: [], resources: [], sessions: [{ id: `general-${id}`, name: '项目总群', participants: ['Zhang Wei'] }], messages: { [`general-${id}`]: [] }, workItems: [] }, ...previous]);
    setActiveId(id);
    setTab('collaboration');
  };
  const projectAgents = project ? availableAgents.filter(agent => project.agentIds.includes(agent.id)) : [];
  const openWork = item => { setSelectedWork(item); setWorkDrawerOpen(true); };
  const newWork = () => { setSelectedWork(null); setWorkDrawerOpen(true); };
  const saveWork = draft => {
    const timestamp = new Date().toISOString();
    const next = selectedWork ? project.workItems.map(item => item.id === selectedWork.id ? { ...item, ...draft, updatedAt: timestamp } : item) : [{ ...draft, id: `work-${Date.now()}`, projectId: project.id, createdAt: timestamp, updatedAt: timestamp }, ...project.workItems];
    updateProject({ ...project, workItems: next });
    setWorkDrawerOpen(false);
  };
  return <PageShell><GlassHeader />
    {!project ? <ProjectList projects={projects} onOpen={id => { setActiveId(id); setTab('collaboration'); }} onCreate={() => setCreateOpen(true)} /> : <main className="flex min-h-[calc(100vh-56px)] flex-col pb-24">
      <div className="glass-soft sticky top-14 z-30 flex shrink-0 items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
        <button onClick={() => setActiveId(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-white" title="返回项目空间"><i className="ri-arrow-left-line" /></button>
        <button onClick={() => setOverviewOpen(true)} className="hidden min-w-0 shrink-0 items-center gap-2.5 rounded-xl px-2 py-1 text-left hover:bg-white md:flex" title="打开空间概览"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-500"><i className="ri-folder-3-fill" /></span><span className="min-w-0"><span className="block max-w-52 truncate text-sm font-semibold">{project.name}</span><span className="block text-[10px] text-neutral-400">{project.scope} · {project.owner} 负责</span></span><i className="ri-arrow-right-s-line text-neutral-300" /></button>
        <div className="h-5 w-px bg-neutral-200/80" />
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">{spaceTabs.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm ${tab === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-900'}`}><i className={`${icon} text-base`} />{label}{tab === id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}</button>)}</nav>
        <button onClick={() => setParticipantsOpen(true)} className="hidden items-center -space-x-2 rounded-xl px-2 py-1 hover:bg-white sm:flex" title="管理参与者">{project.members.slice(0, 2).map(member => <span key={member} className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[10px] ring-2 ring-white">{member.slice(0, 1)}</span>)}{projectAgents.slice(0, 2).map(agent => <AgentAvatar key={agent.id} agent={agent} size="sm" />)}</button>
        <button onClick={() => setOverviewOpen(true)} className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-white hover:text-orange-500" title="空间概览"><i className="ri-layout-grid-line" /></button>
        <div className="relative group"><button className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-white" title="更多"><i className="ri-more-2-fill" /></button><div className="invisible absolute right-0 top-9 z-40 w-36 rounded-xl bg-white p-1 text-sm opacity-0 shadow-xl ring-1 ring-neutral-200 transition group-hover:visible group-hover:opacity-100"><button onClick={() => setSettingsOpen(true)} className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-50"><i className="ri-settings-3-line mr-2" />项目设置</button><button className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-50"><i className="ri-notification-3-line mr-2" />通知</button></div></div>
      </div>
      <div className="flex min-h-0 flex-1">{tab === 'collaboration' && <Collaboration project={project} onUpdate={updateProject} onOpenWork={openWork} onNewWork={newWork} />}{tab === 'work' && <WorkBoard project={project} onOpenWork={openWork} onNewWork={newWork} />}{tab === 'resources' && <Resources project={project} onUpdate={updateProject} />}</div>
    </main>}
    <GlassDock active="projects" onNavigate={onNavigate} />
    <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={createProject} />
    {project && overviewOpen && <OverviewDrawer project={project} onClose={() => setOverviewOpen(false)} onUpdate={updateProject} onParticipants={() => { setOverviewOpen(false); setParticipantsOpen(true); }} onSettings={() => { setOverviewOpen(false); setSettingsOpen(true); }} />}
    {project && participantsOpen && <ParticipantsDrawer project={project} onClose={() => setParticipantsOpen(false)} onUpdate={updateProject} />}
    {project && settingsOpen && <SettingsDrawer project={project} onClose={() => setSettingsOpen(false)} onUpdate={updateProject} />}
    {project && <WorkItemDrawer open={workDrawerOpen} item={selectedWork} project={project} onClose={() => setWorkDrawerOpen(false)} onSave={saveWork} />}
  </PageShell>;
}
