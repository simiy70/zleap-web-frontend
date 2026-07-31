import React, { useMemo, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';

const availableAgents = [
  { id: 'research', name: '研究分析 Agent', emoji: '🔎', skills: ['深度研究', '竞品分析'], tools: ['联网搜索'], sources: ['竞品资料库'] },
  { id: 'feishu', name: '飞书 CLI', emoji: '🤖', skills: ['飞书协作', '会议纪要'], tools: ['飞书文档'], sources: ['研发周报'] },
  { id: 'codex', name: 'Codex 本地 Agent', emoji: '⌘', skills: ['代码开发', '代码审查'], tools: ['本地终端'], sources: ['项目仓库'] },
];

const initialProjects = [
  {
    id: 'agent-os',
    name: 'Agent OS 产品方案',
    description: '统一 Agent 中心与项目空间的产品心智，形成可持续迭代的前端原型。',
    scope: '私密',
    owner: 'Zhang Wei',
    agentIds: ['research', 'codex'],
    members: ['Zhang Wei', '严伊靖'],
    resources: [{ id: 1, name: 'Agent 中心与项目模块 PRD.md', type: '文档' }, { id: 2, name: '现有前端原型', type: '信息源' }],
    tools: ['联网搜索', '本地终端'],
    sessions: [
      { id: 'general', name: '项目总群', participants: ['Zhang Wei', '严伊靖', '研究分析 Agent', 'Codex 本地 Agent'] },
      { id: 'design', name: '交互方案讨论', participants: ['Zhang Wei', '严伊靖', '研究分析 Agent'] },
    ],
    messages: {
      general: [
        { id: 1, sender: '研究分析 Agent', kind: 'agent', role: '产品研究', text: '我已经把 Agent 中心与项目空间的差异整理进项目说明。', time: '14:20' },
        { id: 2, sender: 'Zhang Wei', kind: 'user', text: '@Codex 本地 Agent 请按当前说明更新前端原型。', time: '14:25' },
        { id: 3, sender: 'Codex 本地 Agent', kind: 'agent', role: '工程实现', text: '收到。我会严格使用项目授权的资料和 Tools，不带入个人会话与自动化任务。', time: '14:26' },
      ],
      design: [{ id: 1, sender: '严伊靖', kind: 'user', text: '概览页只保留空间内容，不要加入进度和任务指标。', time: '昨天' }],
    },
  },
  {
    id: 'market-research',
    name: 'Q3 市场研究',
    description: '汇总重点行业和竞品变化。',
    scope: '共享',
    owner: 'Zhang Wei',
    agentIds: ['research'],
    members: ['Zhang Wei'],
    resources: [],
    tools: ['联网搜索'],
    sessions: [{ id: 'general', name: '项目总群', participants: ['Zhang Wei', '研究分析 Agent'] }],
    messages: { general: [{ id: 1, sender: '研究分析 Agent', kind: 'agent', role: '研究顾问', text: '项目空间已经准备好，可以继续添加资料。', time: '昨天' }] },
  },
];

const spaceTabs = [
  ['overview', '概览', 'ri-layout-grid-line'],
  ['chat', '群聊', 'ri-group-2-line'],
  ['agents', 'Agent', 'ri-robot-2-line'],
  ['resources', '资料', 'ri-folder-3-line'],
  ['settings', '设置', 'ri-settings-3-line'],
];

function AgentAvatar({ agent }) {
  return <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-violet-100 text-xl ring-1 ring-white">{agent.emoji}</span>;
}

function EmptyCard({ icon, title, description, action, onClick }) {
  return <button onClick={onClick} className="flex min-h-[170px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/35 p-6 text-center transition hover:border-orange-200 hover:bg-orange-50/30"><i className={`${icon} text-3xl text-neutral-300`} /><div className="mt-3 text-sm font-medium">{title}</div><div className="mt-1 max-w-[280px] text-xs leading-5 text-neutral-400">{description}</div><span className="mt-3 text-xs font-medium text-orange-500">{action}</span></button>;
}

function CreateProjectDialog({ open, onOpenChange, onCreate }) {
  const [name, setName] = useState('');
  const submit = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>创建项目空间</DialogTitle></DialogHeader><div><label className="block"><span className="mb-1.5 block text-xs text-neutral-500">项目名称</span><Input autoFocus value={name} onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') submit(); }} placeholder="给项目起一个清晰的名字" /></label><p className="mt-3 text-xs leading-5 text-neutral-400">只需要一个名称。项目说明、Agent、成员、资料和 Tools 都可以创建后再配置。</p></div><DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button><Button disabled={!name.trim()} onClick={submit}>创建并进入</Button></DialogFooter></DialogContent></Dialog>;
}

function ProjectList({ projects, onOpen, onCreate }) {
  const [query, setQuery] = useState('');
  const filtered = projects.filter(project => `${project.name}${project.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="glass-soft sticky top-14 z-30 flex items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
      <nav className="flex min-w-0 flex-1 items-center gap-1">
        <button className="relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm font-medium text-orange-600">
          <i className="ri-folder-3-line text-base text-orange-500" />
          <span>项目空间</span>
          <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />
        </button>
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索项目…"
            className="h-8 w-52 rounded-xl bg-neutral-100/80 pl-9 pr-3 text-sm outline-none ring-1 ring-transparent transition placeholder:text-neutral-400 focus:w-64 focus:bg-white focus:ring-orange-200" />
        </div>
        <Button size="sm" className="h-8 px-3.5" onClick={onCreate}><i className="ri-add-line text-base" />创建项目</Button>
      </div>
    </div>
    <main className="flex min-h-[calc(100vh-113px)] flex-col px-8 pb-32 pt-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button onClick={onCreate} className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/40 text-neutral-400 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/30 hover:text-orange-500"><i className="ri-add-line text-3xl" /><span className="mt-3 text-sm font-medium">创建项目空间</span></button>
        {filtered.map(project => <button key={project.id} onClick={() => onOpen(project.id)} className="min-h-[190px] rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl text-orange-500"><i className="ri-folder-3-fill" /></span><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500">{project.scope}</span></div><h2 className="mt-4 text-base font-semibold">{project.name}</h2><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-400">{project.description || '尚未填写项目说明'}</p><div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400"><span><i className="ri-robot-2-line" /> {project.agentIds.length} Agent</span><span><i className="ri-group-line" /> {project.members.length} 成员</span><span><i className="ri-message-3-line" /> {project.sessions.length} 群聊</span></div></button>)}
      </div>
    </main>
  </>;
}

function Overview({ project, agents, onTab, onUpdateDescription }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.description);
  const save = () => { onUpdateDescription(draft); setEditing(false); };
  const projectAgents = agents.filter(agent => project.agentIds.includes(agent.id));
  return <div className="flex-1 overflow-y-auto px-8 py-6"><div className="mx-auto max-w-[1120px]">
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200/70">
        <div className="flex items-center justify-between"><div><h2 className="font-semibold">项目说明</h2><p className="mt-1 text-xs text-neutral-400">项目空间共享的 project.md</p></div><Button size="sm" variant="outline" onClick={() => editing ? save() : setEditing(true)}>{editing ? '保存' : '编辑'}</Button></div>
        {editing ? <Textarea value={draft} onChange={event => setDraft(event.target.value)} rows="8" className="mt-5 resize-none font-mono text-sm" placeholder="# 项目说明&#10;&#10;写下背景、约定和需要共同了解的信息…" /> : project.description ? <div className="mt-5 min-h-[150px] whitespace-pre-wrap rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-600">{project.description}</div> : <div className="mt-5 flex min-h-[150px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 text-center"><i className="ri-file-text-line text-3xl text-neutral-300" /><div className="mt-2 text-sm text-neutral-400">尚未填写项目说明</div><button onClick={() => setEditing(true)} className="mt-2 text-xs text-orange-500">开始编辑</button></div>}
      </section>
      <section className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200/70"><div className="flex items-center justify-between"><h2 className="font-semibold">项目成员</h2><button onClick={() => onTab('settings')} className="text-xs text-orange-500">管理</button></div><div className="mt-5 space-y-3">{project.members.map((member, index) => <div key={member} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium">{member.slice(0, 1)}</span><div><div className="text-sm font-medium">{member}</div><div className="text-[11px] text-neutral-400">{index === 0 ? '项目负责人' : '项目成员'}</div></div></div>)}</div></section>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      {projectAgents.length ? <button onClick={() => onTab('agents')} className="rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200"><div className="flex items-center justify-between"><h3 className="font-semibold">项目 Agent</h3><span className="text-xs text-orange-500">查看全部</span></div><div className="mt-5 flex -space-x-2">{projectAgents.map(agent => <AgentAvatar key={agent.id} agent={agent} />)}</div><div className="mt-4 text-xs text-neutral-400">{projectAgents.map(agent => agent.name).join('、')}</div></button> : <EmptyCard icon="ri-robot-2-line" title="还没有 Agent" description="添加可使用或你创建的 Agent。" action="添加 Agent" onClick={() => onTab('agents')} />}
      {project.resources.length ? <button onClick={() => onTab('resources')} className="rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200"><div className="flex items-center justify-between"><h3 className="font-semibold">项目资料</h3><span className="text-xs text-orange-500">查看全部</span></div><div className="mt-4 space-y-3">{project.resources.slice(0, 3).map(resource => <div key={resource.id} className="flex items-center gap-2 text-sm"><i className="ri-file-text-line text-violet-500" /><span className="truncate">{resource.name}</span></div>)}</div></button> : <EmptyCard icon="ri-folder-add-line" title="还没有项目资料" description="上传文件或选择已有信息源。" action="添加资料" onClick={() => onTab('resources')} />}
      <button onClick={() => onTab('chat')} className="rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200"><div className="flex items-center justify-between"><h3 className="font-semibold">最近群聊</h3><span className="text-xs text-orange-500">进入群聊</span></div><div className="mt-4 space-y-3">{project.sessions.slice(0, 3).map(session => <div key={session.id} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600"><i className="ri-group-2-line" /></span><div><div className="text-sm font-medium">{session.name}</div><div className="text-[11px] text-neutral-400">{session.participants.length} 位参与者</div></div></div>)}</div></button>
    </div>
  </div></div>;
}

function ProjectChat({ project, onUpdate }) {
  const [activeId, setActiveId] = useState(project.sessions[0]?.id);
  const [draft, setDraft] = useState('');
  const active = project.sessions.find(session => session.id === activeId) || project.sessions[0];
  const messages = project.messages[active?.id] || [];
  const send = () => {
    const value = draft.trim();
    if (!value) return;
    onUpdate({ ...project, messages: { ...project.messages, [active.id]: [...messages, { id: Date.now(), sender: 'Zhang Wei', kind: 'user', text: value, time: '刚刚' }] } });
    setDraft('');
  };
  return <div className="flex min-h-0 flex-1">
    <aside className="w-64 shrink-0 border-r border-neutral-200/60 bg-white p-4"><div className="flex items-center justify-between px-2"><span className="text-xs font-semibold text-neutral-500">项目群聊</span><button className="text-orange-500"><i className="ri-add-line" /></button></div><div className="mt-3 space-y-1">{project.sessions.map(session => <button key={session.id} onClick={() => setActiveId(session.id)} className={`w-full rounded-xl px-3 py-3 text-left ${active?.id === session.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-neutral-50'}`}><div className="flex items-center gap-2"><i className="ri-group-2-line" /><span className="truncate text-sm font-medium">{session.name}</span></div><div className="mt-1 truncate pl-6 text-[10px] text-neutral-400">{session.participants.length} 位参与者</div></button>)}</div></aside>
    <section className="flex min-w-0 flex-1 flex-col bg-neutral-50/45">
      <header className="border-b border-neutral-200/60 bg-white px-6 py-4"><div className="font-semibold">{active?.name}</div><div className="mt-1 truncate text-xs text-neutral-400">{active?.participants.join('、')}</div></header>
      <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[820px] space-y-5">{messages.map(message => <div key={message.id} className={`flex gap-3 ${message.kind === 'user' ? 'justify-end' : ''}`}>{message.kind === 'agent' && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600"><i className="ri-robot-2-line" /></span>}<div className="max-w-[76%]"><div className={`mb-1 flex gap-2 text-[11px] text-neutral-400 ${message.kind === 'user' ? 'justify-end' : ''}`}><span>{message.sender}</span>{message.role && <span>· {message.role}</span>}</div><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.kind === 'user' ? 'bg-cyan-600 text-white' : 'bg-white ring-1 ring-neutral-200/70'}`}>{message.text}</div><div className={`mt-1 text-[10px] text-neutral-300 ${message.kind === 'user' ? 'text-right' : ''}`}>{message.time}</div></div></div>)}</div></div>
      <div className="border-t border-neutral-100 bg-white p-4"><div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-200/70"><Textarea value={draft} onChange={event => setDraft(event.target.value)} rows="2" className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder="发送消息，使用 @ 指定一个或多个 Agent…" /><div className="mt-2 flex items-center justify-between"><div className="flex gap-1 text-neutral-400"><button className="h-8 w-8 rounded-lg hover:bg-white" title="引用项目资料"><i className="ri-folder-3-line" /></button><button className="h-8 w-8 rounded-lg hover:bg-white" title="@ Agent"><i className="ri-at-line" /></button></div><Button size="sm" onClick={send} disabled={!draft.trim()}><i className="ri-send-plane-2-line" />发送</Button></div></div></div>
    </section>
  </div>;
}

export default function ProjectPage({ onNavigate }) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState('overview');
  const [createOpen, setCreateOpen] = useState(false);
  const [resourceName, setResourceName] = useState('');
  const project = projects.find(item => item.id === activeId);
  const updateProject = next => setProjects(previous => previous.map(item => item.id === next.id ? next : item));
  const createProject = name => {
    const id = `project-${Date.now()}`;
    setProjects(previous => [{ id, name, description: '', scope: '私密', owner: 'Zhang Wei', agentIds: [], members: ['Zhang Wei'], resources: [], tools: [], sessions: [{ id: 'general', name: '项目总群', participants: ['Zhang Wei'] }], messages: { general: [] } }, ...previous]);
    setActiveId(id);
    setTab('overview');
  };
  const projectAgents = useMemo(() => project ? availableAgents.filter(agent => project.agentIds.includes(agent.id)) : [], [project]);

  return <PageShell>
    <GlassHeader />
    {!project ? <ProjectList projects={projects} onOpen={id => { setActiveId(id); setTab('overview'); }} onCreate={() => setCreateOpen(true)} /> : <main className="flex min-h-[calc(100vh-56px)] flex-col pb-24">
      <div className="glass-soft sticky top-14 z-30 flex shrink-0 items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
        <button onClick={() => setActiveId(null)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white hover:text-neutral-900" title="返回项目空间"><i className="ri-arrow-left-line" /></button>
        <div className="hidden min-w-0 shrink-0 items-center gap-2.5 pr-3 md:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-base text-orange-500"><i className="ri-folder-3-fill" /></span>
          <div className="min-w-0"><h1 className="max-w-52 truncate text-sm font-semibold">{project.name}</h1><div className="text-[10px] text-neutral-400">{project.scope} · {project.owner} 负责</div></div>
        </div>
        <div className="h-5 w-px shrink-0 bg-neutral-200/80" />
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {spaceTabs.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm transition-colors ${tab === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-900'}`}><i className={`${icon} text-base ${tab === id ? 'text-orange-500' : 'text-neutral-400'}`} /><span>{label}</span>{tab === id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}</button>)}
        </nav>
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <span className="hidden text-[11px] text-neutral-400 xl:block"><i className="ri-shield-keyhole-line mr-1" />Agent 仅访问项目授权内容</span>
          <div className="flex -space-x-2">{projectAgents.slice(0, 3).map(agent => <AgentAvatar key={agent.id} agent={agent} />)}</div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        {tab === 'overview' && <Overview project={project} agents={availableAgents} onTab={setTab} onUpdateDescription={description => updateProject({ ...project, description })} />}
        {tab === 'chat' && <ProjectChat project={project} onUpdate={updateProject} />}
        {tab === 'agents' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[980px]"><div><h2 className="text-xl font-semibold">项目 Agent</h2><p className="mt-1 text-sm text-neutral-400">项目授权独立于 Agent 的个人配置。</p></div><div className="mt-6 grid gap-4 md:grid-cols-2">{availableAgents.map(agent => { const added = project.agentIds.includes(agent.id); return <article key={agent.id} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center gap-3"><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><h3 className="font-semibold">{agent.name}</h3><div className="mt-1 text-xs text-neutral-400">{agent.skills.join(' · ')}</div></div><Button size="sm" variant={added ? 'outline' : 'default'} onClick={() => updateProject({ ...project, agentIds: added ? project.agentIds.filter(id => id !== agent.id) : [...project.agentIds, agent.id] })}>{added ? '移除' : '添加'}</Button></div>{added && <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-neutral-50 p-3"><div className="text-neutral-400">项目 Tools</div><div className="mt-1 text-neutral-600">{agent.tools.join('、')}</div></div><div className="rounded-xl bg-neutral-50 p-3"><div className="text-neutral-400">项目信息源</div><div className="mt-1 text-neutral-600">{agent.sources.join('、')}</div></div></div>}</article>; })}</div></div></div>}
        {tab === 'resources' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[980px]"><div className="flex items-end gap-3"><div className="mr-auto"><h2 className="text-xl font-semibold">项目资料</h2><p className="mt-1 text-sm text-neutral-400">项目成员和 Agent 只访问这里明确授权的内容。</p></div><Input value={resourceName} onChange={event => setResourceName(event.target.value)} placeholder="输入资料名称" className="w-64" /><Button disabled={!resourceName.trim()} onClick={() => { updateProject({ ...project, resources: [...project.resources, { id: Date.now(), name: resourceName.trim(), type: '文件' }] }); setResourceName(''); }}><i className="ri-add-line" />添加资料</Button></div><div className="mt-6 grid gap-3">{project.resources.map(resource => <div key={resource.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200/70"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500"><i className="ri-file-text-line" /></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{resource.name}</div><div className="mt-1 text-[11px] text-neutral-400">{resource.type} · 项目内可用</div></div><button onClick={() => updateProject({ ...project, resources: project.resources.filter(item => item.id !== resource.id) })} className="text-neutral-300 hover:text-rose-500"><i className="ri-delete-bin-line" /></button></div>)}</div>{!project.resources.length && <EmptyCard icon="ri-folder-add-line" title="还没有项目资料" description="上传文件或从信息管理中选择已有信息源。" action="在上方输入资料名称添加" />}</div></div>}
        {tab === 'settings' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[760px] space-y-4"><section className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200/70"><h2 className="font-semibold">基本信息</h2><label className="mt-5 block"><span className="mb-1.5 block text-xs text-neutral-500">项目名称</span><Input value={project.name} onChange={event => updateProject({ ...project, name: event.target.value })} /></label><label className="mt-4 block"><span className="mb-1.5 block text-xs text-neutral-500">项目说明</span><Textarea value={project.description} onChange={event => updateProject({ ...project, description: event.target.value })} rows="6" className="resize-none" /></label></section><section className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200/70"><h2 className="font-semibold">空间设置</h2><div className="mt-5 flex items-center justify-between border-b border-neutral-100 pb-4"><div><div className="text-sm font-medium">权限</div><div className="mt-1 text-xs text-neutral-400">当前项目为私密空间</div></div><select value={project.scope} onChange={event => updateProject({ ...project, scope: event.target.value })} className="h-9 rounded-xl border border-neutral-200 px-3 text-sm"><option>私密</option><option>共享</option><option>公开</option></select></div><div className="flex items-center justify-between py-4"><div><div className="text-sm font-medium">项目通知</div><div className="mt-1 text-xs text-neutral-400">接收群聊和资料更新</div></div><Switch defaultChecked /></div></section><section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6"><h2 className="font-semibold text-rose-700">项目管理</h2><div className="mt-4 flex gap-3"><Button variant="outline">归档项目</Button><Button variant="destructive">删除项目</Button></div></section></div></div>}
      </div>
    </main>}
    <GlassDock active="projects" onNavigate={onNavigate} />
    <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={createProject} />
  </PageShell>;
}
