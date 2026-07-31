import React, { useMemo, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent } from '../components/ui/dialog';
import {
  CreateAssistantMenu,
  ExternalAgentPage,
  ZleapCreatePage,
} from '../components/assistant/AssistantCreation';

const now = Date.now();
const baseAgents = [
  { id: 'feishu', name: '飞书 CLI', emoji: '🤖', source: 'system', sessionMode: 'single', labels: ['可对话', '官方'], desc: '飞书研发全流程智能 Agent，可代为召集会议、整理报告。', followed: true, owned: false, status: '在线', skills: ['飞书协作', '会议纪要', '报告生成'], tools: ['飞书日历', '飞书文档'], sources: ['研发周报', '会议记录'] },
  { id: 'research', name: '研究分析 Agent', emoji: '🔎', source: 'system', sessionMode: 'single', labels: ['可对话', '我创建的'], desc: '持续跟踪行业、竞品和用户反馈，输出结构化洞察。', followed: true, owned: true, status: '工作中', skills: ['深度研究', '竞品分析', '数据归纳'], tools: ['联网搜索', '网页读取'], sources: ['竞品资料库', '用户反馈'] },
  { id: 'codex-local', name: 'Codex 本地 Agent', emoji: '⌘', source: 'local', sessionMode: 'multiple', labels: ['可对话'], desc: '从本地接入的工程 Agent，保留多个工作会话。', followed: false, owned: true, status: '设备在线', skills: ['代码开发', '代码审查', '终端操作'], tools: ['本地终端', 'GitHub'], sources: ['Zleap Web 仓库'] },
  { id: 'content', name: '内容创作 Agent', emoji: '✍️', source: 'system', sessionMode: 'single', labels: ['关注中', '官方'], desc: '围绕品牌语气完成选题、写作和内容改编。', followed: true, owned: false, status: '未添加', skills: ['内容策划', '文案写作'], tools: ['网页读取'], sources: ['公开动态'] },
];

const initialTasks = [
  { id: 1, agentId: 'feishu', name: '飞书研发周报', trigger: '每周五 17:00', delivery: '研发群', enabled: true, lastRun: '今天 15:05' },
  { id: 2, agentId: 'research', name: 'AI 行业日报', trigger: '每天 09:00', delivery: '当前对话', enabled: true, lastRun: '今天 09:02' },
  { id: 3, agentId: 'research', name: '竞品价格监控', trigger: '信息源更新时', delivery: '当前对话', enabled: false, lastRun: '7 月 29 日' },
  { id: 4, agentId: 'codex-local', name: '代码变更摘要', trigger: '手动执行', delivery: '当前对话', enabled: true, lastRun: '昨天 18:40' },
];

const initialSessions = {
  feishu: [{ id: 'feishu-main', name: '持续会话', updatedAt: now - 4000, updatedLabel: '15:05', archived: false }],
  research: [{ id: 'research-main', name: '持续会话', updatedAt: now - 6000, updatedLabel: '14:20', archived: false }],
  'codex-local': [
    { id: 'codex-refactor', name: 'Agent 中心重构', updatedAt: now, updatedLabel: '刚刚', archived: false },
    { id: 'codex-review', name: '代码审查', updatedAt: now - 86400000, updatedLabel: '昨天', archived: false },
    { id: 'codex-release', name: '版本发布', updatedAt: now - 259200000, updatedLabel: '7 月 28 日', archived: false },
  ],
};

const initialMessages = {
  'feishu-main': [
    { id: 1, role: 'agent', text: '研发周会内容已经整理完成，我把关键决策和风险点放在报告里了。', time: '15:01' },
    { id: 2, role: 'user', text: '以后每周五自动生成，并发到研发群。', time: '15:03' },
    { id: 3, role: 'agent', text: '已创建自动化任务「飞书研发周报」，当前状态为正常执行。', time: '15:05', taskId: 1 },
  ],
  'research-main': [{ id: 1, role: 'agent', text: '今天的 AI 行业日报已更新，共发现 12 条值得关注的变化。', time: '09:02' }],
  'codex-refactor': [
    { id: 1, role: 'agent', text: '我已经读取当前仓库。你希望先处理 Agent 中心还是项目空间？', time: '14:56' },
    { id: 2, role: 'user', text: '先把 Agent 中心改成联系人和对话的体验。', time: '14:57' },
  ],
  'codex-review': [{ id: 1, role: 'agent', text: '代码审查完成，没有发现阻塞合并的问题。', time: '昨天' }],
  'codex-release': [{ id: 1, role: 'agent', text: 'v0.1.0 已构建完成。', time: '7 月 28 日' }],
};

const dynamics = {
  feishu: [{ title: '研发周会信息密度提升方法', time: '2 小时前', summary: '通过议题聚类和决策归档，让周会结果更容易被后续工作复用。' }],
  research: [{ title: 'AI Agent 产品本周观察', time: '30 分钟前', summary: '多 Agent 产品开始从能力展示转向稳定的协作关系设计。' }],
};

const centerItems = [
  ['messages', '消息', 'ri-message-3-line'],
  ['contacts', '通讯录', 'ri-contacts-book-2-line'],
  ['automation', '自动化', 'ri-task-line'],
  ['discover', '发现', 'ri-compass-3-line'],
];
const agentTabs = [['messages', '消息'], ['dynamics', '动态'], ['tasks', '自动化任务'], ['capabilities', '能力配置']];

function AgentAvatar({ agent, size = 'md' }) {
  const cls = size === 'lg' ? 'h-14 w-14 text-2xl' : size === 'sm' ? 'h-9 w-9 text-base' : 'h-11 w-11 text-xl';
  return <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-violet-100 shadow-sm ring-1 ring-white ${cls}`}>{agent.emoji}</span>;
}

function LocalBadge({ agent }) {
  return agent.source === 'local' ? <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">本地</span> : null;
}

function StatusBadge({ enabled }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>{enabled ? '正常执行' : '暂停'}</span>;
}

function TaskCard({ task, agent, onToggle, onOpen, compact = false }) {
  return <article role="button" tabIndex="0" onClick={onOpen} onKeyDown={event => { if (event.key === 'Enter') onOpen?.(); }} className={`cursor-pointer rounded-2xl bg-white text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 ${compact ? 'p-4' : 'p-5'}`}>
    <div className="flex items-start gap-3">
      <AgentAvatar agent={agent} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-neutral-900">{task.name}</h3><StatusBadge enabled={task.enabled} /></div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400"><span>{agent.name}</span><LocalBadge agent={agent} /><span>· {task.trigger}</span></div>
        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-400">
          <span>最近推送 {task.lastRun}</span>
          <span onClick={event => event.stopPropagation()}><Switch checked={task.enabled} onCheckedChange={onToggle} /></span>
        </div>
      </div>
    </div>
  </article>;
}

function AutomationDraftCard({ draft, onChange, onConfirm, onCancel }) {
  if (!draft || draft.step !== 'review') return null;
  return <div className="ml-11 max-w-[620px] rounded-2xl bg-white p-5 ring-1 ring-orange-200 shadow-lg shadow-orange-950/5">
    <div className="flex items-center gap-2 font-semibold"><i className="ri-timer-flash-line text-orange-500" />确认自动化任务</div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="mb-1 block text-[11px] text-neutral-400">任务名称</span><Input value={draft.name} onChange={event => onChange({ name: event.target.value })} /></label>
      <label><span className="mb-1 block text-[11px] text-neutral-400">触发条件</span><select value={draft.trigger} onChange={event => onChange({ trigger: event.target.value })} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option>每天 09:00</option><option>每周一 10:00</option><option>信息源更新时</option><option>手动执行</option></select></label>
      <label><span className="mb-1 block text-[11px] text-neutral-400">推送位置</span><select value={draft.delivery} onChange={event => onChange({ delivery: event.target.value })} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option>当前对话</option><option>飞书研发群</option><option>仅通知我</option></select></label>
    </div>
    <div className="mt-4 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={onCancel}>取消</Button><Button size="sm" disabled={!draft.name.trim()} onClick={onConfirm}>确认创建</Button></div>
  </div>;
}

function ChatComposer({ agent, onSend }) {
  const [value, setValue] = useState('');
  const send = () => { if (!value.trim()) return; onSend(value.trim()); setValue(''); };
  return <div className="border-t border-neutral-100 bg-white/90 p-4">
    <div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-200/70 focus-within:bg-white focus-within:ring-orange-200">
      <Textarea value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} rows="2" className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder={`给 ${agent.name} 发消息…`} />
      <div className="mt-2 flex items-center justify-between"><div className="flex gap-1 text-neutral-400"><button className="h-8 w-8 rounded-lg hover:bg-white" title="添加附件"><i className="ri-attachment-2" /></button><button className="h-8 w-8 rounded-lg hover:bg-white" title="引用信息源"><i className="ri-database-2-line" /></button></div><Button size="sm" onClick={send} disabled={!value.trim()}><i className="ri-send-plane-2-line" />发送</Button></div>
    </div>
  </div>;
}

function MessageThread({ agent, messages, tasks, automationDraft, onDraftChange, onConfirmDraft, onCancelDraft, onSend, onOpenTask }) {
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex-1 overflow-y-auto px-6 py-5"><div className="mx-auto max-w-[780px] space-y-5">
      {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[78%]">
          {message.role === 'agent' && <div className="mb-1.5 flex items-center gap-2 text-xs text-neutral-400"><AgentAvatar agent={agent} size="sm" /><span>{agent.name}</span><LocalBadge agent={agent} /></div>}
          <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-white ring-1 ring-neutral-200/70'}`}>{message.text}</div>
          {message.taskId && tasks.find(task => task.id === message.taskId) && <div className="mt-2"><TaskCard compact task={tasks.find(task => task.id === message.taskId)} agent={agent} onOpen={() => onOpenTask(message.taskId)} onToggle={() => {}} /></div>}
          <div className={`mt-1 text-[10px] text-neutral-300 ${message.role === 'user' ? 'text-right' : ''}`}>{message.time}</div>
        </div>
      </div>)}
      <AutomationDraftCard draft={automationDraft} onChange={onDraftChange} onConfirm={onConfirmDraft} onCancel={onCancelDraft} />
    </div></div>
    <ChatComposer agent={agent} onSend={onSend} />
  </div>;
}

function SessionHistory({ sessions, activeId, onClose, onSelect, onCreate, onRename, onArchive, onDelete }) {
  const [query, setQuery] = useState('');
  const [menuId, setMenuId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const visible = sessions.filter(item => !item.archived && item.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt);
  return <div className="absolute right-0 top-11 z-50 flex max-h-[420px] w-80 flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-2xl shadow-slate-900/15 ring-1 ring-neutral-200">
    <div className="flex items-center justify-between px-1 pb-3"><span className="text-sm font-semibold">历史会话</span><button onClick={onCreate} className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-500 hover:bg-orange-50" title="新建会话"><i className="ri-add-line" /></button></div>
    <div className="relative mb-2"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="pl-9" placeholder="搜索会话" /></div>
    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
      {visible.map(session => <div key={session.id} className={`group relative rounded-xl ${activeId === session.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-neutral-50'}`}>
        {renameId === session.id ? <form onSubmit={event => { event.preventDefault(); if (renameValue.trim()) onRename(session.id, renameValue.trim()); setRenameId(null); }} className="p-2"><Input autoFocus value={renameValue} onChange={event => setRenameValue(event.target.value)} onBlur={() => setRenameId(null)} /></form> :
          <button onClick={() => { onSelect(session.id); onClose(); }} className="flex w-full items-center gap-2 px-3 py-2.5 pr-10 text-left"><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{session.name}</span><span className="mt-0.5 block text-[10px] text-neutral-400">{session.updatedLabel}</span></span>{activeId === session.id && <i className="ri-check-line text-orange-500" />}</button>}
        {renameId !== session.id && <button onClick={() => setMenuId(menuId === session.id ? null : session.id)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-300 opacity-0 hover:bg-white hover:text-neutral-600 group-hover:opacity-100" title="会话操作"><i className="ri-more-2-fill" /></button>}
        {menuId === session.id && <div className="absolute right-2 top-9 z-10 w-28 rounded-xl bg-white p-1 text-xs text-neutral-600 shadow-xl ring-1 ring-neutral-200">
          <button onClick={() => { setRenameId(session.id); setRenameValue(session.name); setMenuId(null); }} className="w-full rounded-lg px-2 py-2 text-left hover:bg-neutral-50">重命名</button>
          <button onClick={() => { onArchive(session.id); setMenuId(null); }} className="w-full rounded-lg px-2 py-2 text-left hover:bg-neutral-50">归档</button>
          <button onClick={() => { onDelete(session.id); setMenuId(null); }} className="w-full rounded-lg px-2 py-2 text-left text-rose-500 hover:bg-rose-50">删除</button>
        </div>}
      </div>)}
      {!visible.length && <div className="py-8 text-center text-xs text-neutral-400">没有找到会话</div>}
    </div>
  </div>;
}

function CapabilityCard({ icon, title, items, editable }) {
  return <div className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center justify-between"><div className="flex items-center gap-2 font-semibold"><i className={`${icon} text-orange-500`} />{title}</div><button disabled={!editable} title={editable ? `管理${title}` : '你没有编辑权限'} className="text-xs text-orange-500 disabled:cursor-not-allowed disabled:text-neutral-300">管理</button></div><div className="mt-4 flex flex-wrap gap-2">{items.map(item => <span key={item} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">{item}</span>)}</div></div>;
}

function AgentPane(props) {
  const { agent, tab, onTabChange, sessions, activeSessionId, onSessionChange, messages, tasks, automationDraft, onDraftChange, onConfirmDraft, onCancelDraft, onSend, onToggleTask, onCreateTask, onFollow, onCreateSession, onRenameSession, onArchiveSession, onDeleteSession } = props;
  const [historyOpen, setHistoryOpen] = useState(false);
  const agentTasks = tasks.filter(task => task.agentId === agent.id);
  return <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-50/45">
    <header className="shrink-0 border-b border-neutral-200/70 bg-white px-6 pt-4">
      <div className="flex items-center gap-3">
        <AgentAvatar agent={agent} />
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate font-semibold">{agent.name}</h2><LocalBadge agent={agent} />{agent.labels.includes('官方') && <i className="ri-verified-badge-fill text-blue-500" />}</div><div className="mt-0.5 text-xs text-emerald-600">{agent.status}</div></div>
        {agent.source === 'local' && <div className="relative"><button onClick={() => setHistoryOpen(!historyOpen)} className={`flex h-9 w-9 items-center justify-center rounded-xl ${historyOpen ? 'bg-orange-50 text-orange-500' : 'text-neutral-400 hover:bg-neutral-100'}`} title="历史会话"><i className="ri-history-line" /></button>{historyOpen && <SessionHistory sessions={sessions} activeId={activeSessionId} onClose={() => setHistoryOpen(false)} onSelect={onSessionChange} onCreate={onCreateSession} onRename={onRenameSession} onArchive={onArchiveSession} onDelete={onDeleteSession} />}</div>}
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100" title="更多操作"><i className="ri-more-2-fill" /></button>
      </div>
      <nav className="mt-3 flex gap-6">{agentTabs.map(([id, label]) => <button key={id} onClick={() => onTabChange(id)} className={`relative pb-3 text-sm ${tab === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-800'}`}>{label}{tab === id && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-orange-500" />}</button>)}</nav>
    </header>
    {tab === 'messages' && <MessageThread agent={agent} messages={messages[activeSessionId] || []} tasks={tasks} automationDraft={automationDraft?.agentId === agent.id ? automationDraft : null} onDraftChange={onDraftChange} onConfirmDraft={onConfirmDraft} onCancelDraft={onCancelDraft} onSend={onSend} onOpenTask={() => onTabChange('tasks')} />}
    {tab === 'dynamics' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[860px]"><div className="mb-5 flex justify-end"><Button variant="outline" size="sm" onClick={onFollow}>{agent.followed ? '取消关注' : '关注'}</Button></div><div className="space-y-4">{(dynamics[agent.id] || []).map(item => <article key={item.title} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center gap-3"><AgentAvatar agent={agent} size="sm" /><div><div className="flex items-center gap-1.5 text-sm font-medium">{agent.name}<LocalBadge agent={agent} /></div><div className="text-[11px] text-neutral-400">{item.time}</div></div></div><h4 className="mt-4 font-semibold">{item.title}</h4><p className="mt-2 text-sm leading-6 text-neutral-500">{item.summary}</p><div className="mt-4 flex gap-3 text-xs text-neutral-400"><button className="hover:text-orange-500">查看详情</button><button className="hover:text-orange-500">分享到消息</button></div></article>)}{!(dynamics[agent.id] || []).length && <div className="rounded-2xl bg-white p-12 text-center text-sm text-neutral-400 ring-1 ring-neutral-200/60">暂时没有动态</div>}</div></div></div>}
    {tab === 'tasks' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[960px]"><div className="mb-5 flex justify-end"><Button onClick={onCreateTask}><i className="ri-chat-new-line" />找 Agent 创建</Button></div><div className="grid gap-4 md:grid-cols-2">{agentTasks.map(task => <TaskCard key={task.id} task={task} agent={agent} onToggle={() => onToggleTask(task.id)} />)}</div>{!agentTasks.length && <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-neutral-200/60"><div className="text-sm text-neutral-400">还没有自动化任务</div><Button className="mt-4" size="sm" onClick={onCreateTask}>找 Agent 创建</Button></div>}</div></div>}
    {tab === 'capabilities' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[920px] space-y-4"><div className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center justify-between"><h3 className="font-semibold">角色与提示词</h3><Button disabled={!agent.owned} title={agent.owned ? '编辑角色与提示词' : '你没有编辑权限'} variant="outline" size="sm">编辑</Button></div><p className="mt-4 text-sm leading-6 text-neutral-600">{agent.desc}</p></div><div className="grid gap-4 md:grid-cols-2"><CapabilityCard icon="ri-magic-line" title="Skills" items={agent.skills} editable={agent.owned} /><CapabilityCard icon="ri-tools-line" title="Tools" items={agent.tools} editable /><CapabilityCard icon="ri-database-2-line" title="信息源" items={agent.sources} editable /><CapabilityCard icon="ri-brain-line" title="经验记忆" items={['通用工作偏好', '已确认的方法经验']} editable={agent.owned} /></div></div></div>}
  </section>;
}

export default function AssistantPage({ onNavigate, initialChat = '' }) {
  const [agents, setAgents] = useState(baseAgents);
  const [centerView, setCenterView] = useState('messages');
  const [activeAgentId, setActiveAgentId] = useState(() => baseAgents.find(agent => agent.name === initialChat)?.id || 'feishu');
  const [agentTab, setAgentTab] = useState('messages');
  const [tasks, setTasks] = useState(initialTasks);
  const [sessions, setSessions] = useState(initialSessions);
  const [messages, setMessages] = useState(initialMessages);
  const [activeSessionByAgent, setActiveSessionByAgent] = useState({ feishu: 'feishu-main', research: 'research-main', 'codex-local': 'codex-refactor' });
  const [query, setQuery] = useState('');
  const [taskStatus, setTaskStatus] = useState('all');
  const [taskAgent, setTaskAgent] = useState('all');
  const [automationDraft, setAutomationDraft] = useState(null);
  const [createModal, setCreateModal] = useState(null);
  const activeAgent = agents.find(agent => agent.id === activeAgentId) || agents[0];
  const activeSessionId = activeSessionByAgent[activeAgent.id] || sessions[activeAgent.id]?.find(item => !item.archived)?.id;
  const contactAgents = agents.filter(agent => agent.labels.includes('可对话'));
  const filteredContacts = agents.filter(agent => `${agent.name}${agent.desc}${agent.labels.join('')}`.toLowerCase().includes(query.trim().toLowerCase()));
  const filteredTasks = tasks.filter(task => (taskStatus === 'all' || (taskStatus === 'running') === task.enabled) && (taskAgent === 'all' || task.agentId === taskAgent));
  const openAgent = (id, tab = 'messages') => { setActiveAgentId(id); setAgentTab(tab); setCenterView('messages'); };
  const appendMessage = (sessionId, role, text, extra = {}) => setMessages(previous => ({ ...previous, [sessionId]: [...(previous[sessionId] || []), { id: Date.now() + Math.random(), role, text, time: '刚刚', ...extra }] }));
  const startAutomationGuide = agentId => {
    const agent = agents.find(item => item.id === agentId) || contactAgents[0];
    const sessionId = activeSessionByAgent[agent.id] || sessions[agent.id]?.[0]?.id;
    openAgent(agent.id, 'messages');
    setAutomationDraft({ agentId: agent.id, sessionId, step: 'goal', name: '', trigger: '每天 09:00', delivery: '当前对话' });
    appendMessage(sessionId, 'agent', '我来帮你创建自动化。先告诉我希望持续完成什么？');
  };
  const sendMessage = text => {
    appendMessage(activeSessionId, 'user', text);
    if (automationDraft?.agentId === activeAgent.id && automationDraft.step === 'goal') {
      const name = text.replace(/[。！!？?]/g, '').slice(0, 24);
      setAutomationDraft(previous => ({ ...previous, name, step: 'review' }));
      appendMessage(activeSessionId, 'agent', '我整理好了任务配置。你可以调整后确认创建。');
    }
  };
  const confirmDraft = () => {
    if (!automationDraft?.name.trim()) return;
    const id = Date.now();
    setTasks(previous => [{ id, agentId: automationDraft.agentId, name: automationDraft.name.trim(), trigger: automationDraft.trigger, delivery: automationDraft.delivery, enabled: true, lastRun: '尚未推送' }, ...previous]);
    appendMessage(automationDraft.sessionId, 'agent', `已创建自动化任务「${automationDraft.name.trim()}」，当前状态为正常执行。`, { taskId: id });
    setAutomationDraft(null);
  };
  const createSession = () => {
    const id = `session-${Date.now()}`;
    const next = { id, name: '新会话', updatedAt: Date.now(), updatedLabel: '刚刚', archived: false };
    setSessions(previous => ({ ...previous, [activeAgent.id]: [next, ...(previous[activeAgent.id] || [])] }));
    setMessages(previous => ({ ...previous, [id]: [{ id: Date.now(), role: 'agent', text: '新会话已准备好，你想从哪里开始？', time: '刚刚' }] }));
    setActiveSessionByAgent(previous => ({ ...previous, [activeAgent.id]: id }));
  };
  const renameSession = (id, name) => setSessions(previous => ({ ...previous, [activeAgent.id]: previous[activeAgent.id].map(item => item.id === id ? { ...item, name } : item) }));
  const removeSession = (id, archived) => {
    const remaining = sessions[activeAgent.id].map(item => item.id === id ? { ...item, archived } : item).filter(item => archived || item.id !== id);
    setSessions(previous => ({ ...previous, [activeAgent.id]: remaining }));
    if (activeSessionId === id) setActiveSessionByAgent(previous => ({ ...previous, [activeAgent.id]: remaining.find(item => !item.archived)?.id }));
  };
  const handleCreated = created => {
    const id = `agent-${Date.now()}`;
    const local = created.source === 'External';
    const next = { id, name: created.name, emoji: local ? '⌁' : '✦', source: local ? 'local' : 'system', sessionMode: local ? 'multiple' : 'single', labels: ['可对话', '我创建的'], desc: created.desc || '新创建的 Agent', followed: true, owned: true, status: local ? '设备在线' : '在线', skills: created.skills || ['信息整理'], tools: created.tools || [], sources: created.sources || [] };
    const sessionId = `${id}-main`;
    setAgents(previous => [next, ...previous]);
    setSessions(previous => ({ ...previous, [id]: [{ id: sessionId, name: local ? '新会话' : '持续会话', updatedAt: Date.now(), updatedLabel: '刚刚', archived: false }] }));
    setMessages(previous => ({ ...previous, [sessionId]: [{ id: 1, role: 'agent', text: '我已经准备好了。现在想先做什么？', time: '刚刚' }] }));
    setActiveSessionByAgent(previous => ({ ...previous, [id]: sessionId }));
    openAgent(id);
    setCreateModal(null);
  };

  return <PageShell><GlassHeader />
    <main className="flex min-h-[calc(100vh-56px)] flex-col pb-24">
      <div className="glass-soft sticky top-14 z-30 flex items-center gap-5 border-x-0 border-t-0 px-8 py-2.5">
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">{centerItems.map(([id, label, icon]) => <button key={id} onClick={() => setCenterView(id)} className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm ${centerView === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-900'}`}><i className={`${icon} text-base`} />{label}{centerView === id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}</button>)}</nav>
        <CreateAssistantMenu trigger={<Button size="sm" className="h-8"><i className="ri-add-line" />添加 Agent<i className="ri-arrow-down-s-line" /></Button>} onSelect={setCreateModal} />
      </div>
      {centerView === 'messages' && <div className="flex min-h-0 flex-1">
        <aside className="w-72 shrink-0 border-r border-neutral-200/70 bg-white p-3"><div className="relative mb-3"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="pl-9" placeholder="搜索 Agent" /></div><div className="space-y-1">{contactAgents.filter(agent => !query || agent.name.toLowerCase().includes(query.toLowerCase())).map(agent => <button key={agent.id} onClick={() => openAgent(agent.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ${activeAgent.id === agent.id ? 'bg-orange-50' : 'hover:bg-neutral-50'}`}><AgentAvatar agent={agent} size="sm" /><span className="min-w-0 flex-1"><span className="flex items-center gap-1.5"><span className="truncate text-sm font-medium">{agent.name}</span><LocalBadge agent={agent} /></span><span className="mt-1 block truncate text-[11px] text-neutral-400">{agent.desc}</span></span></button>)}</div></aside>
        <AgentPane agent={activeAgent} tab={agentTab} onTabChange={setAgentTab} sessions={sessions[activeAgent.id] || []} activeSessionId={activeSessionId} onSessionChange={id => setActiveSessionByAgent(previous => ({ ...previous, [activeAgent.id]: id }))} messages={messages} tasks={tasks} automationDraft={automationDraft} onDraftChange={change => setAutomationDraft(previous => ({ ...previous, ...change }))} onConfirmDraft={confirmDraft} onCancelDraft={() => { appendMessage(activeSessionId, 'agent', '好的，这次不会创建任务。'); setAutomationDraft(null); }} onSend={sendMessage} onToggleTask={id => setTasks(previous => previous.map(task => task.id === id ? { ...task, enabled: !task.enabled } : task))} onCreateTask={() => startAutomationGuide(activeAgent.id)} onFollow={() => setAgents(previous => previous.map(agent => agent.id === activeAgent.id ? { ...agent, followed: !agent.followed } : agent))} onCreateSession={createSession} onRenameSession={renameSession} onArchiveSession={id => removeSession(id, true)} onDeleteSession={id => removeSession(id, false)} />
      </div>}
      {centerView === 'contacts' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[1000px]"><div className="relative mb-5 max-w-md"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="pl-9" placeholder="搜索联系人" /></div><div className="grid gap-4 md:grid-cols-2">{filteredContacts.map(agent => <button key={agent.id} onClick={() => openAgent(agent.id)} className="rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 hover:ring-orange-200"><div className="flex gap-3"><AgentAvatar agent={agent} /><div><div className="flex items-center gap-2 font-semibold">{agent.name}<LocalBadge agent={agent} /></div><p className="mt-1 text-sm text-neutral-400">{agent.desc}</p><div className="mt-3 flex gap-2">{agent.labels.filter(label => label !== '可对话').map(label => <span key={label} className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500">{label}</span>)}</div></div></div></button>)}</div></div></div>}
      {centerView === 'automation' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[1050px]"><div className="mb-5 flex flex-wrap items-center gap-3"><select value={taskStatus} onChange={event => setTaskStatus(event.target.value)} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部状态</option><option value="running">正常执行</option><option value="paused">暂停</option></select><select value={taskAgent} onChange={event => setTaskAgent(event.target.value)} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部 Agent</option>{contactAgents.map(agent => <option value={agent.id} key={agent.id}>{agent.name}{agent.source === 'local' ? '（本地）' : ''}</option>)}</select><Button className="ml-auto" onClick={() => startAutomationGuide(taskAgent === 'all' ? contactAgents[0].id : taskAgent)}><i className="ri-add-line" />创建任务</Button></div><div className="grid gap-4 md:grid-cols-2">{filteredTasks.map(task => { const agent = agents.find(item => item.id === task.agentId); return <TaskCard key={task.id} task={task} agent={agent} onOpen={() => openAgent(agent.id, 'tasks')} onToggle={() => setTasks(previous => previous.map(item => item.id === task.id ? { ...item, enabled: !item.enabled } : item))} />; })}</div></div></div>}
      {centerView === 'discover' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto grid max-w-[1000px] gap-4 md:grid-cols-2">{agents.filter(agent => agent.labels.includes('官方')).map(agent => <article key={agent.id} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex gap-3"><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><h3 className="font-semibold">{agent.name}</h3><p className="mt-1 text-sm text-neutral-400">{agent.desc}</p><Button className="mt-4" size="sm" variant="outline" onClick={() => openAgent(agent.id)}>打开</Button></div></div></article>)}</div></div>}
    </main>
    <GlassDock active="agents" onNavigate={onNavigate} />
    <Dialog open={Boolean(createModal)} onOpenChange={open => { if (!open) setCreateModal(null); }}>
      <DialogContent className="flex h-[760px] max-h-[90vh] w-[960px] max-w-[calc(100vw-32px)] flex-col overflow-hidden p-0">
        {createModal === 'zleap' && <ZleapCreatePage modal onBack={() => setCreateModal(null)} onCreate={handleCreated} onEdit={() => setCreateModal(null)} />}
        {createModal === 'external' && <ExternalAgentPage modal onBack={() => setCreateModal(null)} onCreate={handleCreated} onComplete={created => { if (created?.[0]) openAgent(String(created[0].id)); setCreateModal(null); }} existingNames={new Set(agents.map(agent => agent.name))} />}
      </DialogContent>
    </Dialog>
  </PageShell>;
}
