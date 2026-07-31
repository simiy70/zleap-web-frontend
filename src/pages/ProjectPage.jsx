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
    joinMode: '邀请制',
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
    outputs: [
      { id: 'o1', name: 'Agent 信息架构评审记录', producer: '研究分析 Agent', updatedAt: '今天 11:30' },
      { id: 'o2', name: '项目页面交互原型', producer: 'Codex 本地 Agent', updatedAt: '昨天' },
    ],
    activities: [
      { id: 'a1', actor: '严伊靖', action: '更新了项目说明', time: '20 分钟前' },
      { id: 'a2', actor: 'Zhang Wei', action: '授权了 GitHub', time: '2 小时前' },
      { id: 'a3', actor: 'Codex 本地 Agent', action: '产出了项目页面交互原型', time: '昨天' },
    ],
    sessions: [
      { id: 'general', type: 'group', name: '项目总群', participants: ['Zhang Wei', '严伊靖', '研究分析 Agent', 'Codex 本地 Agent'], updatedAt: '10:12' },
      { id: 'design', type: 'group', name: '设计评审', participants: ['严伊靖', 'Zhang Wei', '研究分析 Agent'], updatedAt: '昨天' },
      { id: 'research-direct', type: 'direct', name: '研究分析 Agent', participantId: 'research', participants: ['Zhang Wei', '研究分析 Agent'], updatedAt: '09:40' },
      { id: 'codex-direct', type: 'direct', name: 'Codex 本地 Agent', participantId: 'codex-local', participants: ['Zhang Wei', 'Codex 本地 Agent'], updatedAt: '昨天' },
    ],
    messages: {
      general: [
        { id: 1, sender: 'Zhang Wei', kind: 'user', text: '@研究分析 Agent 帮我们梳理这次改版的用户心智。', time: '10:10' },
        { id: 2, sender: '研究分析 Agent', kind: 'agent', role: '项目研究', text: '建议把 Agent 视为联系人，把项目视为多 Agent 协作空间。', time: '10:12' },
      ],
      design: [{ id: 1, sender: '严伊靖', kind: 'user', text: '顶部二级导航继续沿用信息源模块的形式。', time: '昨天' }],
      'research-direct': [{ id: 1, sender: '研究分析 Agent', kind: 'agent', role: '项目研究', text: '我已经整理好三种项目协作信息架构，可以继续讨论。', time: '09:40' }],
      'codex-direct': [{ id: 1, sender: 'Codex 本地 Agent', kind: 'agent', role: '项目开发', text: '项目原型已完成构建，等待下一轮设计反馈。', time: '昨天' }],
    },
    automations: [
      { id: 'pa1', name: '每日项目进展摘要', agentId: 'research', trigger: '每天 18:00', delivery: '项目总群', enabled: true, lastRun: '今天 18:02' },
      { id: 'pa2', name: '代码变更同步', agentId: 'codex-local', trigger: '代码推送时', delivery: '项目总群', enabled: true, lastRun: '今天 16:40' },
      { id: 'pa3', name: '每周资料归档', agentId: 'research', trigger: '每周五 17:00', delivery: '项目资料', enabled: false, lastRun: '7 月 25 日' },
    ],
  },
  {
    id: 'growth',
    name: '增长实验室',
    description: '# 项目说明\n\n沉淀增长假设、实验资料和复盘结果。',
    scope: '私密',
    joinMode: '邀请制',
    owner: 'Zhang Wei',
    agentIds: ['research'],
    members: ['Zhang Wei'],
    tools: ['联网搜索'],
    sourceNames: ['用户反馈'],
    resources: [],
    outputs: [],
    activities: [],
    sessions: [
      { id: 'general-growth', type: 'group', name: '项目总群', participants: ['Zhang Wei', '研究分析 Agent'], updatedAt: '昨天' },
      { id: 'research-growth', type: 'direct', name: '研究分析 Agent', participantId: 'research', participants: ['Zhang Wei', '研究分析 Agent'], updatedAt: '昨天' },
    ],
    messages: { 'general-growth': [], 'research-growth': [] },
    automations: [],
  },
];

const projectTabs = [
  ['sessions', '会话', 'ri-message-3-line'],
  ['automations', '自动化任务', 'ri-timer-flash-line'],
  ['overview', '项目概况', 'ri-layout-grid-line'],
];

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
  return <><div className="glass-soft sticky top-14 z-30 flex items-center gap-4 border-x-0 border-t-0 px-8 py-2.5"><div className="flex flex-1 items-center gap-2 text-sm font-medium text-orange-600"><i className="ri-folder-3-line" />项目空间</div><div className="relative"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索项目…" className="h-8 w-52 rounded-xl bg-neutral-100/80 pl-9 pr-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-orange-200" /></div><Button size="sm" className="h-8" onClick={onCreate}><i className="ri-add-line" />创建项目</Button></div><main className="px-8 pb-32 pt-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><button onClick={onCreate} className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/40 text-neutral-400 hover:border-orange-300 hover:text-orange-500"><i className="ri-add-line text-3xl" /><span className="mt-3 text-sm font-medium">创建项目</span></button>{filtered.map(project => <button key={project.id} onClick={() => onOpen(project.id)} className="min-h-[190px] rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl text-orange-500"><i className="ri-folder-3-fill" /></span><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500">{project.scope}</span></div><h2 className="mt-4 font-semibold">{project.name}</h2><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-400">{project.description.replace(/^# 项目说明\s*/, '') || '尚未填写项目说明'}</p><div className="mt-4 flex gap-3 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400"><span>{project.sessions.length} 会话</span><span>{project.agentIds.length} Agent</span><span>{project.automations.length} 自动化</span></div></button>)}</div></main></>;
}

function NewSessionDialog({ open, onOpenChange, project, onCreate }) {
  const [participantId, setParticipantId] = useState(project.agentIds[0] || '');
  const agents = availableAgents.filter(agent => project.agentIds.includes(agent.id));
  const submit = () => { const agent = agents.find(item => item.id === participantId); if (!agent) return; onCreate(agent); onOpenChange(false); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>新建独立对话</DialogTitle></DialogHeader><label><span className="mb-1.5 block text-xs text-neutral-500">选择项目 Agent</span><select value={participantId} onChange={event => setParticipantId(event.target.value)} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm">{agents.map(agent => <option value={agent.id} key={agent.id}>{agent.name}{agent.source === 'local' ? '（本地）' : ''}</option>)}</select></label><DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button><Button disabled={!participantId} onClick={submit}>开始对话</Button></DialogFooter></DialogContent></Dialog>;
}

function SessionRow({ session, active, onClick }) {
  const agent = session.type === 'direct' ? availableAgents.find(item => item.id === session.participantId) : null;
  return <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left ${active ? 'bg-orange-50 text-orange-700' : 'hover:bg-neutral-50'}`}>{agent ? <AgentAvatar agent={agent} size="sm" /> : <span className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-orange-100' : 'bg-cyan-50 text-cyan-600'}`}><i className="ri-group-2-line" /></span>}<span className="min-w-0 flex-1"><span className="flex items-center gap-1.5"><span className="truncate text-sm font-medium">{session.name}</span>{agent && <LocalBadge agent={agent} />}</span><span className="mt-0.5 block truncate text-[10px] text-neutral-400">{session.type === 'group' ? `${session.participants.length} 位参与者` : session.updatedAt}</span></span></button>;
}

function SessionsView({ project, onUpdate }) {
  const [activeId, setActiveId] = useState(project.sessions[0]?.id);
  const [draft, setDraft] = useState('');
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const active = project.sessions.find(session => session.id === activeId) || project.sessions[0];
  const messages = project.messages[active?.id] || [];
  const groups = project.sessions.filter(session => session.type === 'group');
  const directs = project.sessions.filter(session => session.type === 'direct');
  const send = () => {
    const value = draft.trim();
    if (!value || !active) return;
    onUpdate({ ...project, messages: { ...project.messages, [active.id]: [...messages, { id: Date.now(), sender: 'Zhang Wei', kind: 'user', text: value, time: '刚刚' }] } });
    setDraft('');
  };
  const createDirect = agent => {
    const existing = project.sessions.find(session => session.type === 'direct' && session.participantId === agent.id);
    if (existing) { setActiveId(existing.id); return; }
    const id = `direct-${agent.id}-${Date.now()}`;
    const next = { id, type: 'direct', name: agent.name, participantId: agent.id, participants: ['Zhang Wei', agent.name], updatedAt: '刚刚' };
    onUpdate({ ...project, sessions: [...project.sessions, next], messages: { ...project.messages, [id]: [{ id: Date.now(), sender: agent.name, kind: 'agent', role: '项目协作者', text: '我已经进入这个独立对话，可以开始了。', time: '刚刚' }] } });
    setActiveId(id);
  };
  return <div className="flex min-h-0 flex-1 overflow-hidden">
    <aside className="w-64 shrink-0 border-r border-neutral-200/60 bg-white p-3"><div className="flex items-center justify-between px-2 py-2"><span className="text-xs font-semibold text-neutral-500">项目群聊</span><button className="text-orange-500" title="新建群聊"><i className="ri-add-line" /></button></div><div className="space-y-1">{groups.map(session => <SessionRow key={session.id} session={session} active={active?.id === session.id} onClick={() => setActiveId(session.id)} />)}</div><div className="mt-5 flex items-center justify-between px-2 py-2"><span className="text-xs font-semibold text-neutral-500">独立对话</span><button onClick={() => setNewSessionOpen(true)} className="text-orange-500" title="新建独立对话"><i className="ri-add-line" /></button></div><div className="space-y-1">{directs.map(session => <SessionRow key={session.id} session={session} active={active?.id === session.id} onClick={() => setActiveId(session.id)} />)}</div></aside>
    <section className="flex min-w-0 flex-1 flex-col bg-neutral-50/45"><header className="flex items-center gap-3 border-b border-neutral-200/60 bg-white px-6 py-3.5"><div className="min-w-0 flex-1"><div className="font-semibold">{active?.name}</div><div className="mt-1 truncate text-xs text-neutral-400">{active?.participants.join('、')}</div></div><button className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-neutral-100" title="会话信息"><i className="ri-information-line" /></button></header><div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[760px] space-y-5">{messages.map(message => <div key={message.id} className={`flex gap-3 ${message.kind === 'user' ? 'justify-end' : ''}`}>{message.kind === 'agent' && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600"><i className="ri-robot-2-line" /></span>}<div className="max-w-[76%]"><div className={`mb-1 text-[11px] text-neutral-400 ${message.kind === 'user' ? 'text-right' : ''}`}>{message.sender}{message.role ? ` · ${message.role}` : ''}</div><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.kind === 'user' ? 'bg-cyan-600 text-white' : 'bg-white ring-1 ring-neutral-200/70'}`}>{message.text}</div><div className={`mt-1 text-[10px] text-neutral-300 ${message.kind === 'user' ? 'text-right' : ''}`}>{message.time}</div></div></div>)}{!messages.length && <div className="py-20 text-center text-sm text-neutral-400">还没有消息</div>}</div></div><div className="border-t border-neutral-100 bg-white p-4"><div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-200/70"><Textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} rows="2" className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder={active?.type === 'group' ? '发送消息，使用 @ 指定 Agent…' : `给 ${active?.name || '协作者'} 发消息…`} /><div className="mt-2 flex items-center justify-between"><div className="flex gap-1 text-neutral-400"><button className="h-8 w-8 rounded-lg hover:bg-white" title="引用项目资料"><i className="ri-folder-3-line" /></button><button className="h-8 w-8 rounded-lg hover:bg-white" title="@ Agent"><i className="ri-at-line" /></button></div><Button size="sm" onClick={send} disabled={!draft.trim()}><i className="ri-send-plane-2-line" />发送</Button></div></div></div></section>
    <aside className="hidden w-64 shrink-0 border-l border-neutral-200/60 bg-white p-4 xl:block"><div className="text-sm font-semibold">会话成员</div><div className="mt-4 space-y-3">{active?.participants.map(name => { const agent = availableAgents.find(item => item.name === name); return <div key={name} className="flex items-center gap-2.5">{agent ? <AgentAvatar agent={agent} size="sm" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs">{name.slice(0, 1)}</span>}<div className="min-w-0"><div className="flex items-center gap-1.5 truncate text-sm">{name}{agent && <LocalBadge agent={agent} />}</div>{agent && <div className="text-[10px] text-neutral-400">项目 Agent</div>}</div></div>; })}</div><div className="mt-7 flex items-center justify-between"><span className="text-sm font-semibold">共享资料</span><span className="text-xs text-neutral-400">{project.resources.length}</span></div><div className="mt-3 space-y-2">{project.resources.slice(0, 3).map(resource => <div key={resource.id} className="flex items-center gap-2 rounded-xl bg-neutral-50 p-2.5 text-xs"><i className="ri-file-text-line text-violet-500" /><span className="truncate">{resource.name}</span></div>)}</div></aside>
    <NewSessionDialog open={newSessionOpen} onOpenChange={setNewSessionOpen} project={project} onCreate={createDirect} />
  </div>;
}

function AutomationStatus({ enabled }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>{enabled ? '正常执行' : '暂停'}</span>;
}

function AutomationDialog({ open, onOpenChange, project, onCreate }) {
  const agents = availableAgents.filter(agent => project.agentIds.includes(agent.id));
  const [name, setName] = useState('');
  const [agentId, setAgentId] = useState(agents[0]?.id || '');
  const [trigger, setTrigger] = useState('每天 18:00');
  const [delivery, setDelivery] = useState('项目总群');
  const submit = () => { if (!name.trim() || !agentId) return; onCreate({ name: name.trim(), agentId, trigger, delivery }); setName(''); onOpenChange(false); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>创建项目自动化</DialogTitle></DialogHeader><div className="space-y-4"><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">任务名称</span><Input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="例如：每日项目进展摘要" /></label><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">执行 Agent</span><select value={agentId} onChange={event => setAgentId(event.target.value)} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm">{agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}{agent.source === 'local' ? '（本地）' : ''}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label><span className="mb-1.5 block text-xs text-neutral-500">触发条件</span><select value={trigger} onChange={event => setTrigger(event.target.value)} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option>每天 18:00</option><option>每周五 17:00</option><option>资料更新时</option><option>代码推送时</option></select></label><label><span className="mb-1.5 block text-xs text-neutral-500">结果位置</span><select value={delivery} onChange={event => setDelivery(event.target.value)} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option>项目总群</option><option>项目资料</option><option>仅通知负责人</option></select></label></div></div><DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button><Button disabled={!name.trim() || !agentId} onClick={submit}>创建</Button></DialogFooter></DialogContent></Dialog>;
}

function AutomationsView({ project, onUpdate }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const filtered = project.automations.filter(task => task.name.toLowerCase().includes(query.toLowerCase()) && (status === 'all' || (status === 'running') === task.enabled));
  const create = data => onUpdate({ ...project, automations: [{ id: `automation-${Date.now()}`, ...data, enabled: true, lastRun: '尚未执行' }, ...project.automations] });
  return <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[1080px]"><div className="mb-5 flex items-center gap-3"><div className="relative w-72"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="pl-9" placeholder="搜索自动化任务" /></div><select value={status} onChange={event => setStatus(event.target.value)} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部状态</option><option value="running">正常执行</option><option value="paused">暂停</option></select><Button className="ml-auto" onClick={() => setCreateOpen(true)}><i className="ri-add-line" />创建自动化</Button></div><div className="grid gap-4 md:grid-cols-2">{filtered.map(task => { const agent = availableAgents.find(item => item.id === task.agentId); return <article key={task.id} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-start gap-3"><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{task.name}</h3><AutomationStatus enabled={task.enabled} /></div><div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400"><span>{agent.name}</span><LocalBadge agent={agent} /><span>· {task.trigger}</span></div></div><button className="h-8 w-8 rounded-lg text-neutral-300 hover:bg-neutral-50 hover:text-neutral-600" title="更多操作"><i className="ri-more-2-fill" /></button></div><div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-3 text-xs"><div><div className="text-neutral-400">结果位置</div><div className="mt-1 font-medium text-neutral-600">{task.delivery}</div></div><div><div className="text-neutral-400">最近执行</div><div className="mt-1 font-medium text-neutral-600">{task.lastRun}</div></div></div><div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-400"><span>{task.enabled ? '任务已启用' : '任务已暂停'}</span><Switch checked={task.enabled} onCheckedChange={() => onUpdate({ ...project, automations: project.automations.map(item => item.id === task.id ? { ...item, enabled: !item.enabled } : item) })} /></div></article>; })}</div>{!filtered.length && <div className="rounded-2xl bg-white py-14 text-center ring-1 ring-neutral-200/70"><div className="text-sm text-neutral-400">还没有自动化任务</div><button onClick={() => setCreateOpen(true)} className="mt-2 text-xs text-orange-500">创建自动化</button></div>}</div><AutomationDialog open={createOpen} onOpenChange={setCreateOpen} project={project} onCreate={create} /></div>;
}

function SectionCard({ title, action, onAction, children, className = '' }) {
  return <section className={`rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70 ${className}`}><div className="flex items-center justify-between"><h3 className="font-semibold">{title}</h3>{action && <button onClick={onAction} className="text-xs text-orange-500">{action}</button>}</div>{children}</section>;
}

function OverviewView({ project, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.description);
  const projectAgents = availableAgents.filter(agent => project.agentIds.includes(agent.id));
  const effectiveSkills = useMemo(() => {
    const map = new Map();
    projectAgents.forEach(agent => agent.skills.forEach(skill => map.set(skill, [...(map.get(skill) || []), agent.name])));
    return [...map.entries()];
  }, [project.agentIds.join(',')]);
  const effectiveTools = useMemo(() => projectAgents.flatMap(agent => agent.tools.map(tool => ({ tool, agent: agent.name }))).filter(item => project.tools.includes(item.tool)).filter((item, index, list) => list.findIndex(other => other.tool === item.tool) === index), [project.agentIds.join(','), project.tools.join(',')]);
  const toggleAgent = id => onUpdate({ ...project, agentIds: project.agentIds.includes(id) ? project.agentIds.filter(item => item !== id) : [...project.agentIds, id] });
  return <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[1120px] space-y-4">
    <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><SectionCard title="project.md" action={editing ? '保存' : '编辑'} onAction={() => { if (editing) { onUpdate({ ...project, description: draft }); setEditing(false); } else setEditing(true); }}>{editing ? <Textarea value={draft} onChange={event => setDraft(event.target.value)} rows="8" className="mt-4 resize-none font-mono text-sm" /> : <div className="mt-4 min-h-40 whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm leading-7 text-neutral-600">{project.description || <button onClick={() => setEditing(true)} className="text-orange-500">添加项目说明</button>}</div>}</SectionCard><SectionCard title="权限"><div className="mt-4 space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-neutral-400">可见范围</span><select value={project.scope} onChange={event => onUpdate({ ...project, scope: event.target.value })} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs"><option>私密</option><option>共享</option><option>公开</option></select></div><div className="flex items-center justify-between text-sm"><span className="text-neutral-400">加入方式</span><span>{project.joinMode}</span></div><div className="flex items-center justify-between text-sm"><span className="text-neutral-400">负责人</span><span>{project.owner}</span></div></div></SectionCard></div>
    <div className="grid gap-4 lg:grid-cols-3"><SectionCard title="技能"><div className="mt-4 flex flex-wrap gap-2">{effectiveSkills.map(([skill, owners]) => <span key={skill} title={owners.join('、')} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs text-orange-700">{skill}</span>)}{!effectiveSkills.length && <span className="text-xs text-neutral-400">还没有可用技能</span>}</div></SectionCard><SectionCard title="项目资料 / 信息源"><div className="mt-4 space-y-2">{project.resources.slice(0, 4).map(resource => <div key={resource.id} className="flex items-center gap-2 rounded-xl bg-neutral-50 p-2.5 text-xs"><i className={resource.type === '信息源' ? 'ri-database-2-line text-cyan-500' : 'ri-file-text-line text-violet-500'} /><span className="min-w-0 flex-1 truncate">{resource.name}</span><span className="text-[10px] text-neutral-400">{resource.type}</span></div>)}{!project.resources.length && <div className="text-xs text-neutral-400">还没有项目资料</div>}</div></SectionCard><SectionCard title="工具"><div className="mt-4 flex flex-wrap gap-2">{effectiveTools.map(item => <span key={item.tool} title={item.agent} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs text-violet-700">{item.tool}</span>)}{!effectiveTools.length && <span className="text-xs text-neutral-400">还没有授权工具</span>}</div></SectionCard></div>
    <SectionCard title="协作者"><div className="mt-4 grid gap-3 md:grid-cols-2"><div><div className="mb-2 text-xs text-neutral-400">Agent</div><div className="space-y-2">{availableAgents.map(agent => { const added = project.agentIds.includes(agent.id); return <div key={agent.id} className={`flex items-center gap-3 rounded-xl border p-3 ${added ? 'border-orange-100 bg-orange-50/40' : 'border-neutral-200'}`}><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5 text-sm font-medium">{agent.name}<LocalBadge agent={agent} /></div><div className="mt-1 truncate text-[10px] text-neutral-400">{agent.skills.join(' · ')}</div></div><Button size="sm" variant={added ? 'outline' : 'default'} onClick={() => toggleAgent(agent.id)}>{added ? '移除' : '添加'}</Button></div>; })}</div></div><div><div className="mb-2 text-xs text-neutral-400">成员</div><div className="space-y-2">{project.members.map((member, index) => <div key={member} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs ring-1 ring-neutral-200">{member.slice(0, 1)}</span><span className="flex-1 text-sm font-medium">{member}</span><span className="text-[10px] text-neutral-400">{index === 0 ? '负责人' : '成员'}</span></div>)}</div></div></div></SectionCard>
    <div className="grid gap-4 lg:grid-cols-2"><SectionCard title="项目动态"><div className="mt-4 space-y-4">{project.activities.map(activity => <div key={activity.id} className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-400" /><div className="min-w-0 flex-1"><div className="text-sm"><span className="font-medium">{activity.actor}</span> <span className="text-neutral-500">{activity.action}</span></div><div className="mt-1 text-[10px] text-neutral-400">{activity.time}</div></div></div>)}{!project.activities.length && <div className="text-xs text-neutral-400">还没有项目动态</div>}</div></SectionCard><SectionCard title="产出"><div className="mt-4 space-y-3">{project.outputs.map(output => <div key={output.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500"><i className="ri-file-check-line" /></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{output.name}</div><div className="mt-1 text-[10px] text-neutral-400">{output.producer} · {output.updatedAt}</div></div></div>)}{!project.outputs.length && <div className="text-xs text-neutral-400">还没有项目产出</div>}</div></SectionCard></div>
  </div></div>;
}

export default function ProjectPage({ onNavigate }) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState('sessions');
  const [createOpen, setCreateOpen] = useState(false);
  const project = projects.find(item => item.id === activeId);
  const updateProject = next => setProjects(previous => previous.map(item => item.id === next.id ? next : item));
  const createProject = name => {
    const id = `project-${Date.now()}`;
    const generalId = `general-${id}`;
    setProjects(previous => [{ id, name, description: '', scope: '私密', joinMode: '邀请制', owner: 'Zhang Wei', agentIds: [], members: ['Zhang Wei'], tools: [], sourceNames: [], resources: [], outputs: [], activities: [], sessions: [{ id: generalId, type: 'group', name: '项目总群', participants: ['Zhang Wei'], updatedAt: '刚刚' }], messages: { [generalId]: [] }, automations: [] }, ...previous]);
    setActiveId(id);
    setTab('sessions');
  };
  const projectAgents = project ? availableAgents.filter(agent => project.agentIds.includes(agent.id)) : [];
  return <PageShell><GlassHeader />
    {!project ? <ProjectList projects={projects} onOpen={id => { setActiveId(id); setTab('sessions'); }} onCreate={() => setCreateOpen(true)} /> : <main className="flex min-h-[calc(100vh-56px)] flex-col pb-24">
      <div className="glass-soft sticky top-14 z-30 flex shrink-0 items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
        <button onClick={() => setActiveId(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-white" title="返回项目列表"><i className="ri-arrow-left-line" /></button>
        <div className="hidden min-w-0 shrink-0 items-center gap-2.5 px-2 py-1 md:flex"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-500"><i className="ri-folder-3-fill" /></span><span className="min-w-0"><span className="block max-w-52 truncate text-sm font-semibold">{project.name}</span><span className="block text-[10px] text-neutral-400">{project.scope} · {project.owner} 负责</span></span></div>
        <div className="h-5 w-px bg-neutral-200/80" />
        <nav className="flex min-w-0 flex-1 items-center gap-1">{projectTabs.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm ${tab === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-900'}`}><i className={`${icon} text-base`} />{label}{tab === id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}</button>)}</nav>
        <div className="hidden items-center -space-x-2 sm:flex">{project.members.slice(0, 2).map(member => <span key={member} className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[10px] ring-2 ring-white">{member.slice(0, 1)}</span>)}{projectAgents.slice(0, 2).map(agent => <AgentAvatar key={agent.id} agent={agent} size="sm" />)}</div>
        <button className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-white" title="更多"><i className="ri-more-2-fill" /></button>
      </div>
      <div className="flex min-h-0 flex-1">{tab === 'sessions' && <SessionsView project={project} onUpdate={updateProject} />}{tab === 'automations' && <AutomationsView project={project} onUpdate={updateProject} />}{tab === 'overview' && <OverviewView project={project} onUpdate={updateProject} />}</div>
    </main>}
    <GlassDock active="projects" onNavigate={onNavigate} />
    <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={createProject} />
  </PageShell>;
}
