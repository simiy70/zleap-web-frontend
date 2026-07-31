import React, { useMemo, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  CreateAssistantMenu,
  ExternalAgentPage,
  PUBLIC_SOURCE_IDS,
  ZleapCreatePage,
} from '../components/assistant/AssistantCreation';

const baseAgents = [
  {
    id: 'feishu',
    name: '飞书 CLI',
    emoji: '🤖',
    source: 'system',
    sessionMode: 'single',
    labels: ['可对话', '官方'],
    desc: '飞书研发全流程智能 Agent，可代为召集会议、整理报告。',
    followed: true,
    owned: false,
    status: '在线',
    skills: ['飞书协作', '会议纪要', '报告生成'],
    tools: ['飞书日历', '飞书文档'],
    sources: ['研发周报', '会议记录'],
  },
  {
    id: 'research',
    name: '研究分析 Agent',
    emoji: '🔎',
    source: 'system',
    sessionMode: 'single',
    labels: ['可对话', '我创建的'],
    desc: '持续跟踪行业、竞品和用户反馈，输出结构化洞察。',
    followed: true,
    owned: true,
    status: '工作中',
    skills: ['深度研究', '竞品分析', '数据归纳'],
    tools: ['联网搜索', '网页读取'],
    sources: ['竞品资料库', '用户反馈'],
  },
  {
    id: 'codex-local',
    name: 'Codex 本地 Agent',
    emoji: '⌘',
    source: 'local',
    sessionMode: 'multiple',
    labels: ['可对话', '本地接入'],
    desc: '从本地接入的工程 Agent，保留多个工作会话。',
    followed: false,
    owned: true,
    status: '设备在线',
    skills: ['代码开发', '代码审查', '终端操作'],
    tools: ['本地终端', 'GitHub'],
    sources: ['Zleap Web 仓库'],
  },
  {
    id: 'content',
    name: '内容创作 Agent',
    emoji: '✍️',
    source: 'system',
    sessionMode: 'single',
    labels: ['关注中', '官方'],
    desc: '围绕品牌语气完成选题、写作和内容改编。',
    followed: true,
    owned: false,
    status: '未添加',
    skills: ['内容策划', '文案写作'],
    tools: ['网页读取'],
    sources: ['公开动态'],
  },
];

const initialTasks = [
  { id: 1, agentId: 'feishu', name: '飞书研发周报', trigger: '每周五 17:00', enabled: true, lastRun: '今天 15:05' },
  { id: 2, agentId: 'research', name: 'AI 行业日报', trigger: '每天 09:00', enabled: true, lastRun: '今天 09:02' },
  { id: 3, agentId: 'research', name: '竞品价格监控', trigger: '信息源更新时', enabled: false, lastRun: '7 月 29 日' },
  { id: 4, agentId: 'codex-local', name: '代码变更摘要', trigger: '手动执行', enabled: true, lastRun: '昨天 18:40' },
];

const initialSessions = {
  feishu: [{ id: 'feishu-main', name: '持续会话', updated: '15:05' }],
  research: [{ id: 'research-main', name: '持续会话', updated: '14:20' }],
  'codex-local': [
    { id: 'codex-refactor', name: 'Agent 中心重构', updated: '刚刚' },
    { id: 'codex-review', name: '代码审查', updated: '昨天' },
    { id: 'codex-release', name: '版本发布', updated: '7 月 28 日' },
  ],
};

const initialMessages = {
  'feishu-main': [
    { id: 1, role: 'agent', text: '研发周会内容已经整理完成，我把关键决策和风险点放在报告里了。', time: '15:01' },
    { id: 2, role: 'user', text: '以后每周五自动生成，并发到研发群。', time: '15:03' },
    { id: 3, role: 'agent', text: '已创建自动化任务「飞书研发周报」，当前状态为正常执行。', time: '15:05', taskId: 1 },
  ],
  'research-main': [
    { id: 1, role: 'agent', text: '今天的 AI 行业日报已更新，共发现 12 条值得关注的变化。', time: '09:02' },
  ],
  'codex-refactor': [
    { id: 1, role: 'agent', text: '我已经读取当前仓库。你希望先处理 Agent 中心还是项目空间？', time: '14:56' },
    { id: 2, role: 'user', text: '先把 Agent 中心改成联系人和对话的体验。', time: '14:57' },
  ],
  'codex-review': [{ id: 1, role: 'agent', text: '代码审查完成，没有发现阻塞合并的问题。', time: '昨天' }],
  'codex-release': [{ id: 1, role: 'agent', text: 'v0.1.0 已构建完成。', time: '7 月 28 日' }],
};

const dynamics = {
  feishu: [
    { title: '研发周会信息密度提升方法', time: '2 小时前', summary: '通过议题聚类和决策归档，让周会结果更容易被后续工作复用。' },
    { title: '飞书自动化协作清单', time: '昨天', summary: '整理了日程、文档和群聊联动时最常见的六种自动化方式。' },
  ],
  research: [
    { title: 'AI Agent 产品本周观察', time: '30 分钟前', summary: '多 Agent 产品开始从能力展示转向稳定的协作关系设计。' },
    { title: '企业知识应用调研摘要', time: '昨天', summary: '用户更愿意在熟悉的消息入口中调用 Agent，而不是进入复杂控制台。' },
  ],
};

const centerItems = [
  ['messages', '消息', 'ri-message-3-line'],
  ['contacts', '通讯录', 'ri-contacts-book-2-line'],
  ['automation', '自动化', 'ri-task-line'],
  ['discover', '发现', 'ri-compass-3-line'],
];

const agentTabs = [
  ['messages', '消息'],
  ['dynamics', '动态'],
  ['tasks', '自动化任务'],
  ['capabilities', '能力配置'],
];

function AgentAvatar({ agent, size = 'md' }) {
  const cls = size === 'lg' ? 'h-14 w-14 text-2xl' : size === 'sm' ? 'h-9 w-9 text-base' : 'h-11 w-11 text-xl';
  return <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-violet-100 shadow-sm ring-1 ring-white ${cls}`}>{agent.emoji}</span>;
}

function StatusBadge({ enabled }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>{enabled ? '正常执行' : '暂停'}</span>;
}

function TaskCard({ task, agent, onToggle, onOpen, compact = false }) {
  return <article role="button" tabIndex="0" onClick={onOpen} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') onOpen?.(); }} className={`group w-full cursor-pointer rounded-2xl bg-white text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 ${compact ? 'p-4' : 'p-5'}`}>
    <div className="flex items-start gap-3">
      <AgentAvatar agent={agent} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-neutral-900">{task.name}</h3>
          <StatusBadge enabled={task.enabled} />
        </div>
        <div className="mt-1 text-xs text-neutral-400">{agent.name} · {task.trigger}</div>
        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-400">
          <span>最近推送 {task.lastRun}</span>
          <span onClick={event => event.stopPropagation()}><Switch checked={task.enabled} onCheckedChange={onToggle} /></span>
        </div>
      </div>
    </div>
  </article>;
}

function ChatComposer({ agent, onSend }) {
  const [draft, setDraft] = useState('');
  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onSend(value);
    setDraft('');
  };
  return <div className="border-t border-neutral-100 bg-white/80 p-4">
    <div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-200/70 focus-within:bg-white focus-within:ring-orange-200">
      <Textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} rows="2" className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder={`给 ${agent.name} 发消息，或直接布置自动化任务…`} />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1 text-neutral-400">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" title="添加附件"><i className="ri-attachment-2" /></button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" title="引用信息源"><i className="ri-database-2-line" /></button>
        </div>
        <Button size="sm" onClick={submit} disabled={!draft.trim()}><i className="ri-send-plane-2-line" />发送</Button>
      </div>
    </div>
  </div>;
}

function MessageThread({ agent, messages, tasks, onSend, onOpenTask }) {
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <div className="mx-auto max-w-[780px] space-y-5">
        {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[78%] ${message.role === 'user' ? 'order-2' : ''}`}>
            {message.role === 'agent' && <div className="mb-1.5 flex items-center gap-2 text-xs text-neutral-400"><AgentAvatar agent={agent} size="sm" /><span>{agent.name}</span></div>}
            <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-white ring-1 ring-neutral-200/70'}`}>{message.text}</div>
            {message.taskId && tasks.find(task => task.id === message.taskId) && <div className="mt-2"><TaskCard compact task={tasks.find(task => task.id === message.taskId)} agent={agent} onOpen={() => onOpenTask(message.taskId)} onToggle={() => {}} /></div>}
            <div className={`mt-1 text-[10px] text-neutral-300 ${message.role === 'user' ? 'text-right' : ''}`}>{message.time}</div>
          </div>
        </div>)}
      </div>
    </div>
    <ChatComposer agent={agent} onSend={onSend} />
  </div>;
}

function CreateTaskDialog({ open, onOpenChange, agent, onCreate }) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('每天 09:00');
  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), trigger });
    setName('');
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>为 {agent?.name || 'Agent'} 创建自动化任务</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-xs text-neutral-500">任务名称</span><Input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="例如：每周竞品摘要" /></label>
        <label className="block"><span className="mb-1.5 block text-xs text-neutral-500">触发方式</span><select value={trigger} onChange={event => setTrigger(event.target.value)} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option>每天 09:00</option><option>每周一 10:00</option><option>信息源更新时</option><option>手动执行</option></select></label>
        <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">创建后状态为“正常执行”，可随时暂停。</div>
      </div>
      <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button><Button disabled={!name.trim()} onClick={submit}>创建任务</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function AgentPane({ agent, tab, onTabChange, sessions, activeSessionId, onSessionChange, messages, tasks, onSend, onToggleTask, onCreateTask, onFollow }) {
  const agentTasks = tasks.filter(task => task.agentId === agent.id);
  return <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-50/45">
    <header className="shrink-0 border-b border-neutral-200/70 bg-white px-6 pt-4">
      <div className="flex items-center gap-3">
        <AgentAvatar agent={agent} />
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate font-semibold">{agent.name}</h2>{agent.labels.includes('官方') && <i className="ri-verified-badge-fill text-blue-500" />}</div><div className="mt-0.5 text-xs text-emerald-600">{agent.status} · {agent.sessionMode === 'multiple' ? '本地多会话 Agent' : '持续单会话 Agent'}</div></div>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100"><i className="ri-more-2-fill" /></button>
      </div>
      <nav className="mt-3 flex gap-6">
        {agentTabs.map(([id, label]) => <button key={id} onClick={() => onTabChange(id)} className={`relative pb-3 text-sm transition ${tab === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-800'}`}>{label}{tab === id && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-orange-500" />}</button>)}
      </nav>
    </header>

    {tab === 'messages' && <div className="flex min-h-0 flex-1">
      {agent.sessionMode === 'multiple' && <aside className="w-52 shrink-0 border-r border-neutral-200/70 bg-white p-3">
        <div className="mb-3 flex items-center justify-between px-2 text-xs font-medium text-neutral-500"><span>本地会话</span><button className="text-orange-500"><i className="ri-add-line" /></button></div>
        <div className="space-y-1">{sessions.map(session => <button key={session.id} onClick={() => onSessionChange(session.id)} className={`w-full rounded-xl px-3 py-2.5 text-left ${activeSessionId === session.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-white'}`}><div className="truncate text-sm font-medium">{session.name}</div><div className="mt-1 text-[10px] text-neutral-400">{session.updated}</div></button>)}</div>
      </aside>}
      <MessageThread agent={agent} messages={messages[activeSessionId] || []} tasks={tasks} onSend={onSend} onOpenTask={() => onTabChange('tasks')} />
    </div>}

    {tab === 'dynamics' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[860px]"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-semibold">Agent 动态</h3><p className="mt-1 text-xs text-neutral-400">仅展示公开或你有权限查看的内容。</p></div><Button variant="outline" size="sm" onClick={onFollow}>{agent.followed ? '取消关注' : '关注'}</Button></div><div className="space-y-4">{(dynamics[agent.id] || []).map(item => <article key={item.title} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center gap-3"><AgentAvatar agent={agent} size="sm" /><div><div className="text-sm font-medium">{agent.name}</div><div className="text-[11px] text-neutral-400">{item.time}</div></div></div><h4 className="mt-4 font-semibold">{item.title}</h4><p className="mt-2 text-sm leading-6 text-neutral-500">{item.summary}</p><div className="mt-4 flex gap-3 text-xs text-neutral-400"><button className="hover:text-orange-500"><i className="ri-chat-3-line" /> 查看详情</button><button className="hover:text-orange-500"><i className="ri-share-line" /> 分享到消息</button></div></article>)}{!(dynamics[agent.id] || []).length && <div className="rounded-2xl bg-white p-12 text-center text-sm text-neutral-400 ring-1 ring-neutral-200/60">这个 Agent 暂时没有发布动态</div>}</div></div></div>}

    {tab === 'tasks' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[960px]"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-semibold">自动化任务</h3><p className="mt-1 text-xs text-neutral-400">任务状态仅区分正常执行与暂停。</p></div><Button onClick={onCreateTask}><i className="ri-add-line" />创建任务</Button></div><div className="grid gap-4 md:grid-cols-2">{agentTasks.map(task => <TaskCard key={task.id} task={task} agent={agent} onToggle={() => onToggleTask(task.id)} onOpen={() => {}} />)}</div>{!agentTasks.length && <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-neutral-200/60"><i className="ri-timer-flash-line text-4xl text-neutral-300" /><div className="mt-3 text-sm text-neutral-400">还没有自动化任务</div></div>}</div></div>}

    {tab === 'capabilities' && <div className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[920px] space-y-4">
      <div className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center justify-between"><div><h3 className="font-semibold">角色与提示词</h3><p className="mt-1 text-xs text-neutral-400">{agent.owned ? '你拥有完整编辑权限' : '由创建者维护，仅可查看'}</p></div>{agent.owned && <Button variant="outline" size="sm">编辑</Button>}</div><p className="mt-4 text-sm leading-6 text-neutral-600">{agent.desc}</p></div>
      <div className="grid gap-4 md:grid-cols-2"><CapabilityCard icon="ri-magic-line" title="Skills" items={agent.skills} editable={agent.owned} /><CapabilityCard icon="ri-tools-line" title="Tools" items={agent.tools} editable /><CapabilityCard icon="ri-database-2-line" title="信息源" items={agent.sources} editable /><CapabilityCard icon="ri-brain-line" title="经验记忆" items={['通用工作偏好', '已确认的方法经验']} editable={agent.owned} /></div>
    </div></div>}
  </section>;
}

function CapabilityCard({ icon, title, items, editable }) {
  return <div className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70"><div className="flex items-center justify-between"><div className="flex items-center gap-2 font-semibold"><i className={`${icon} text-orange-500`} />{title}</div>{editable && <button className="text-xs text-orange-500">管理</button>}</div><div className="mt-4 flex flex-wrap gap-2">{items.map(item => <span key={item} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">{item}</span>)}</div></div>;
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
  const [createTaskAgentId, setCreateTaskAgentId] = useState(null);
  const [createModal, setCreateModal] = useState(null);

  const activeAgent = agents.find(agent => agent.id === activeAgentId) || agents[0];
  const activeSessionId = activeSessionByAgent[activeAgent.id] || sessions[activeAgent.id]?.[0]?.id;
  const contactAgents = agents.filter(agent => agent.labels.includes('可对话'));
  const filteredContacts = agents.filter(agent => `${agent.name}${agent.desc}${agent.labels.join('')}`.toLowerCase().includes(query.trim().toLowerCase()));
  const filteredTasks = tasks.filter(task => (taskStatus === 'all' || (taskStatus === 'running') === task.enabled) && (taskAgent === 'all' || task.agentId === taskAgent));

  const openAgent = (id, tab = 'messages') => {
    setActiveAgentId(id);
    setAgentTab(tab);
    setCenterView('messages');
  };
  const sendMessage = text => setMessages(previous => ({ ...previous, [activeSessionId]: [...(previous[activeSessionId] || []), { id: Date.now(), role: 'user', text, time: '刚刚' }] }));
  const toggleTask = id => setTasks(previous => previous.map(task => task.id === id ? { ...task, enabled: !task.enabled } : task));
  const createTask = data => {
    const agentId = createTaskAgentId || activeAgent.id;
    setTasks(previous => [{ id: Date.now(), agentId, enabled: true, lastRun: '暂无', ...data }, ...previous]);
  };
  const toggleFollow = id => setAgents(previous => previous.map(agent => agent.id === id ? { ...agent, followed: !agent.followed, labels: agent.followed ? agent.labels.filter(label => label !== '关注中') : [...new Set([...agent.labels, '关注中'])] } : agent));
  const addDiscovered = id => setAgents(previous => previous.map(agent => agent.id === id ? { ...agent, labels: [...new Set([...agent.labels, '可对话'])], status: '在线' } : agent));
  const normalizeCreated = item => ({ ...item, id: String(item.id || Date.now()), name: item.name || '新 Agent', emoji: item.emoji || '✨', source: item.origin === 'External' ? 'local' : 'system', sessionMode: item.origin === 'External' ? 'multiple' : 'single', labels: ['可对话', '我创建的'], desc: item.desc || '新创建的 Agent', followed: true, owned: true, status: '在线', skills: ['自定义 Skill'], tools: ['待配置'], sources: ['公共信息源'] });
  const handleCreated = items => {
    const created = (Array.isArray(items) ? items : [items]).map(normalizeCreated);
    const nextSessions = {};
    const nextMessages = {};
    created.forEach(agent => {
      const sessionId = `${agent.id}-main`;
      nextSessions[agent.id] = [{ id: sessionId, name: agent.sessionMode === 'single' ? '持续会话' : '本地会话', updated: '刚刚' }];
      nextMessages[sessionId] = [{ id: 1, role: 'agent', text: '你好，我已经准备好了。现在想从什么事情开始？', time: '刚刚' }];
    });
    setAgents(previous => [...created, ...previous]);
    setSessions(previous => ({ ...previous, ...nextSessions }));
    setMessages(previous => ({ ...previous, ...nextMessages }));
    setActiveSessionByAgent(previous => ({ ...previous, ...Object.fromEntries(created.map(agent => [agent.id, nextSessions[agent.id][0].id])) }));
    if (created[0]) openAgent(created[0].id);
    return created;
  };

  return <PageShell>
    <div className="flex min-h-screen flex-col">
      <GlassHeader />
      <div className="glass-soft sticky top-14 z-30 flex shrink-0 items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {centerItems.map(([id, label, icon]) => <button key={id} onClick={() => setCenterView(id)} className={`relative flex h-10 items-center gap-2 px-3 text-sm transition ${centerView === id ? 'font-medium text-orange-600' : 'text-neutral-500 hover:text-neutral-900'}`}><i className={`${icon} ${centerView === id ? 'text-orange-500' : 'text-neutral-400'}`} /><span>{label}</span>{centerView === id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}</button>)}
        </nav>
        {centerView !== 'automation' && <div className="relative hidden shrink-0 lg:block"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder={centerView === 'messages' ? '搜索联系人' : '搜索 Agent'} className="h-8 w-52 rounded-xl bg-neutral-100/80 pl-9 focus:w-64 focus:bg-white" /></div>}
        <CreateAssistantMenu trigger={<Button size="sm"><i className="ri-user-add-line" />添加 Agent<i className="ri-arrow-down-s-line" /></Button>} onSelect={setCreateModal} />
      </div>
      <main className="flex min-h-0 flex-1 pb-24">

        {centerView === 'messages' && <>
          <aside className="w-[300px] shrink-0 border-r border-neutral-200/70 bg-white p-4">
            <div className="flex items-center justify-between"><div><h1 className="text-lg font-semibold">消息</h1><p className="text-xs text-neutral-400">最近联系的 Agent</p></div><button className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500"><i className="ri-edit-box-line" /></button></div>
            <div className="mt-4 space-y-1">{contactAgents.filter(agent => agent.name.toLowerCase().includes(query.toLowerCase())).map(agent => <button key={agent.id} onClick={() => openAgent(agent.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${activeAgent.id === agent.id ? 'bg-orange-50 text-orange-900' : 'hover:bg-neutral-50'}`}><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{agent.name}</span><span className="text-[10px] text-neutral-400">刚刚</span></div><div className="mt-1 truncate text-xs text-neutral-400">{(messages[activeSessionByAgent[agent.id]] || []).at(-1)?.text || agent.desc}</div></div></button>)}</div>
          </aside>
          <AgentPane agent={activeAgent} tab={agentTab} onTabChange={setAgentTab} sessions={sessions[activeAgent.id] || []} activeSessionId={activeSessionId} onSessionChange={id => setActiveSessionByAgent(previous => ({ ...previous, [activeAgent.id]: id }))} messages={messages} tasks={tasks} onSend={sendMessage} onToggleTask={toggleTask} onCreateTask={() => setCreateTaskAgentId(activeAgent.id)} onFollow={() => toggleFollow(activeAgent.id)} />
        </>}

        {centerView === 'contacts' && <section className="flex-1 overflow-y-auto px-8 py-6"><div className="mx-auto max-w-[1120px]"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredContacts.map(agent => <button key={agent.id} onClick={() => agent.labels.includes('可对话') ? openAgent(agent.id) : setCenterView('discover')} className="rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200 hover:shadow-lg hover:shadow-slate-900/5"><div className="flex items-center gap-3"><AgentAvatar agent={agent} size="lg" /><div className="min-w-0"><h3 className="truncate font-semibold">{agent.name}</h3><div className="mt-1 flex flex-wrap gap-1">{agent.labels.map(label => <span key={label} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">{label}</span>)}</div></div></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-500">{agent.desc}</p></button>)}</div></div></section>}

        {centerView === 'automation' && <section className="flex-1 overflow-y-auto px-8 py-6"><div className="mx-auto max-w-[1180px]"><div className="flex flex-wrap justify-end gap-3"><select value={taskAgent} onChange={event => setTaskAgent(event.target.value)} className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部 Agent</option>{contactAgents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select><select value={taskStatus} onChange={event => setTaskStatus(event.target.value)} className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部状态</option><option value="running">正常执行</option><option value="paused">暂停</option></select><Button size="sm" onClick={() => setCreateTaskAgentId(contactAgents[0]?.id)}><i className="ri-add-line" />创建任务</Button></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredTasks.map(task => <TaskCard key={task.id} task={task} agent={agents.find(agent => agent.id === task.agentId)} onToggle={() => toggleTask(task.id)} onOpen={() => openAgent(task.agentId, 'tasks')} />)}</div></div></section>}

        {centerView === 'discover' && <section className="flex-1 overflow-y-auto px-8 py-6"><div className="mx-auto max-w-[1120px]"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{agents.filter(agent => agent.labels.includes('官方')).map(agent => <article key={agent.id} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:ring-orange-200 hover:shadow-lg hover:shadow-slate-900/5"><div className="flex items-center gap-3"><AgentAvatar agent={agent} size="lg" /><div><div className="flex items-center gap-1 font-semibold">{agent.name}<i className="ri-verified-badge-fill text-blue-500" /></div><div className="mt-1 text-xs text-neutral-400">Zleap 官方 Agent</div></div></div><p className="mt-4 min-h-12 text-sm leading-6 text-neutral-500">{agent.desc}</p><div className="mt-4 flex flex-wrap gap-2">{agent.skills.map(skill => <span key={skill} className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] text-orange-600">{skill}</span>)}</div><Button className="mt-5 w-full" variant={agent.labels.includes('可对话') ? 'outline' : 'default'} onClick={() => agent.labels.includes('可对话') ? openAgent(agent.id) : addDiscovered(agent.id)}>{agent.labels.includes('可对话') ? '打开对话' : '添加并开始对话'}</Button></article>)}</div></div></section>}
      </main>
    </div>
    <GlassDock active="agents" onNavigate={onNavigate} />

    <CreateTaskDialog open={Boolean(createTaskAgentId)} onOpenChange={open => { if (!open) setCreateTaskAgentId(null); }} agent={agents.find(agent => agent.id === createTaskAgentId)} onCreate={createTask} />
    <Dialog open={Boolean(createModal)} onOpenChange={open => { if (!open) setCreateModal(null); }}>
      <DialogContent className="flex h-[760px] max-h-[90vh] w-[960px] max-w-[calc(100vw-32px)] flex-col overflow-hidden p-0">
        {createModal === 'zleap' && <ZleapCreatePage modal onBack={() => setCreateModal(null)} onCreate={handleCreated} onEdit={() => setCreateModal(null)} />}
        {createModal === 'external' && <ExternalAgentPage modal onBack={() => setCreateModal(null)} onCreate={handleCreated} onComplete={created => { if (created?.[0]) openAgent(String(created[0].id)); setCreateModal(null); }} existingNames={new Set(agents.map(agent => agent.name))} />}
      </DialogContent>
    </Dialog>
  </PageShell>;
}
