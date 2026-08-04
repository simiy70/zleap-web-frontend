import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { automationMaterials, executionAgents, useSuperAgent } from './SuperAgentProvider';
import { AgentPicker, MaterialsPicker, SourceSheet } from './SuperAgentOverlay';

const avatarChoices = ['✦', '🧭', '🪄', '🌟', '🧠', '🛰️', '🤖', '🦊'];

function Avatar({ value, tone, size = 'md' }) {
  return <span className={`flex ${size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-10 w-10 text-base'} items-center justify-center rounded-full bg-gradient-to-br ${tone} font-semibold text-white shadow-sm`}>{value}</span>;
}

function BaseSettings({ agent, onSave, onBack }) {
  const [name, setName] = useState(agent.name);
  const [avatar, setAvatar] = useState(agent.avatar);
  const [error, setError] = useState('');
  const dirty = name !== agent.name || avatar !== agent.avatar;
  const fileRef = useRef(null);
  const back = () => {
    if (dirty && !window.confirm('存在未保存修改，确定放弃吗？')) return;
    onBack();
  };
  const upload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError('仅支持 2 MB 以内的 PNG、JPG 或 WebP 图片');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setAvatar('图'); setError('自定义图片已读取，原型中以「图」作为头像预览'); };
    reader.readAsDataURL(file);
  };
  return <div><button onClick={back} className="mb-5 text-sm text-neutral-500"><i className="ri-arrow-left-line mr-1" />返回设置</button><div className="flex flex-col items-center"><Avatar value={avatar} tone={agent.avatarTone} size="lg" /><button onClick={() => fileRef.current?.click()} className="mt-2 text-xs text-orange-600">上传自定义头像</button><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} className="hidden" /></div><div className="mt-5 grid grid-cols-4 gap-2">{avatarChoices.map(item => <button key={item} onClick={() => { setAvatar(item); setError(''); }} className={`flex aspect-square items-center justify-center rounded-2xl text-xl ${avatar === item ? 'bg-orange-50 ring-2 ring-orange-400' : 'bg-neutral-50 ring-1 ring-neutral-200'}`}>{item}</button>)}</div>{error && <p className="mt-3 text-xs text-amber-600">{error}</p>}<label className="mt-5 block"><span className="mb-1.5 block text-xs text-neutral-500">Agent 名称</span><Input value={name} maxLength={20} onChange={event => setName(event.target.value)} /><span className="mt-1 block text-right text-[10px] text-neutral-400">{name.length} / 20</span></label><DialogFooter><Button variant="ghost" onClick={back}>取消</Button><Button disabled={!name.trim()} onClick={() => { onSave({ name: name.trim(), avatar }); onBack(); }}>保存</Button></DialogFooter></div>;
}

function RoleSettings({ agent, onSave, onBack }) {
  const [prompt, setPrompt] = useState(agent.rolePrompt);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const overwrite = next => {
    if (prompt !== agent.rolePrompt && !window.confirm('这会覆盖当前未保存内容，是否继续？')) return;
    setPrompt(next.slice(0, 20000));
  };
  const importFile = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.md')) { window.alert('仅支持导入 .md 文件'); return; }
    const reader = new FileReader();
    reader.onload = () => overwrite(String(reader.result || ''));
    reader.readAsText(file);
  };
  const improve = () => {
    if (!prompt.trim()) return;
    setBusy(true);
    setTimeout(() => { overwrite(`## 角色\n${prompt.trim()}\n\n## 性格特点\n专业、主动、客观。\n\n## 表达方式\n用清晰、可执行的语言给出结论。\n\n## 能力边界\n无法确认的信息会明确标注，不替代用户做高风险决定。`); setBusy(false); }, 500);
  };
  return <div><button onClick={onBack} className="mb-5 text-sm text-neutral-500"><i className="ri-arrow-left-line mr-1" />返回设置</button><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => overwrite('你是一名严谨的研究分析 Agent，基于可靠信息给出证据、影响和待验证假设。')}>复刻研究分析 Agent</Button><Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>导入 .md</Button><input ref={fileRef} type="file" accept=".md,text/markdown" onChange={importFile} className="hidden" /><Button size="sm" onClick={improve} disabled={!prompt.trim() || busy}>{busy ? <><i className="ri-loader-4-line animate-spin" />完善中</> : '一键完善'}</Button></div><label className="mt-4 block"><span className="mb-1.5 block text-xs text-neutral-500">角色提示词</span><Textarea value={prompt} maxLength={20000} rows="13" onChange={event => setPrompt(event.target.value)} className="resize-none" /><span className="mt-1 block text-right text-[10px] text-neutral-400">{prompt.length} / 20000</span></label><DialogFooter><Button variant="ghost" onClick={onBack}>取消</Button><Button disabled={!prompt.trim()} onClick={() => { onSave({ rolePrompt: prompt.trim() }); onBack(); }}>保存</Button></DialogFooter></div>;
}

function TaskDetail({ task, onBack, onRun }) {
  return <div><button onClick={onBack} className="mb-5 text-sm text-neutral-500"><i className="ri-arrow-left-line mr-1" />返回任务列表</button><h3 className="text-lg font-semibold">{task.name}</h3><div className="mt-5 grid gap-3 rounded-2xl bg-neutral-50 p-4 text-sm"><div><span className="text-neutral-400">执行 Agent</span><div className="mt-1 font-medium">{task.agentName}</div></div><div><span className="text-neutral-400">执行周期</span><div className="mt-1 font-medium">{task.trigger}</div></div><div><span className="text-neutral-400">执行内容</span><div className="mt-1 leading-6">{task.content}</div></div><div><span className="text-neutral-400">最近执行</span><div className="mt-1 font-medium">{task.lastRun}</div></div></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => window.alert('推送配置 demo 暂未实现')}>推送配置</Button><Button onClick={() => { onRun(task.id); onBack(); }}>立即执行</Button></div></div>;
}

function TaskSettings({ tasks, onToggle, onDelete, onRun, onNew, onBack, initialTaskId }) {
  const [filter, setFilter] = useState('all');
  const [detailId, setDetailId] = useState(initialTaskId || null);
  const filtered = tasks.filter(task => filter === 'all' || (filter === 'running') === task.enabled).sort((a, b) => b.createdAt - a.createdAt);
  const detail = tasks.find(task => task.id === detailId);
  if (detail) return <TaskDetail task={detail} onBack={() => setDetailId(null)} onRun={onRun} />;
  return <div><button onClick={onBack} className="mb-5 text-sm text-neutral-500"><i className="ri-arrow-left-line mr-1" />返回设置</button><div className="flex items-center gap-2"><select value={filter} onChange={event => setFilter(event.target.value)} className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-sm"><option value="all">全部</option><option value="running">启用中</option><option value="paused">已暂停</option></select><Button className="ml-auto" size="sm" onClick={onNew}><i className="ri-add-line" />新建</Button></div><div className="mt-4 max-h-[460px] space-y-2 overflow-y-auto pr-1">{filtered.map(task => <article key={task.id} onClick={() => setDetailId(task.id)} className="cursor-pointer rounded-2xl border border-neutral-200 p-4 transition hover:border-orange-200"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="truncate text-sm font-semibold">{task.name}</h4>{task.systemDefault && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-600">系统默认</span>}<span className={`rounded-full px-2 py-0.5 text-[10px] ${task.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>{task.enabled ? '启用中' : '已暂停'}</span></div><p className="mt-1 truncate text-xs text-neutral-400">{task.agentName} · {task.trigger}</p></div><span onClick={event => event.stopPropagation()}><Switch checked={task.enabled} onCheckedChange={() => { if (task.enabled && !window.confirm('暂停后任务将停止按计划执行，确定暂停吗？')) return; onToggle(task.id); }} /></span></div><div className="mt-3 flex justify-end gap-3 border-t border-neutral-100 pt-3 text-xs"><button onClick={event => { event.stopPropagation(); window.alert('编辑任务 demo 暂未实现'); }} className="text-neutral-500">编辑</button><button onClick={event => { event.stopPropagation(); onRun(task.id); }} className="text-orange-600">立即执行</button><button onClick={event => { event.stopPropagation(); if (window.confirm(`确定删除「${task.name}」吗？`)) onDelete(task.id); }} className="text-rose-500">删除</button></div></article>)}{!filtered.length && <div className="py-14 text-center text-sm text-neutral-400">没有符合条件的自动化任务</div>}</div></div>;
}

function SettingsDialog({ open, onOpenChange, initialView, onCreateTask }) {
  const agent = useSuperAgent();
  const taskTargetId = initialView?.startsWith?.('task:') ? initialView.slice(5) : null;
  const normalizedInitialView = taskTargetId ? 'tasks' : (initialView || 'menu');
  const [view, setView] = useState(normalizedInitialView);
  useEffect(() => { if (open) setView(normalizedInitialView); }, [open, normalizedInitialView]);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[88vh] overflow-y-auto">
    <DialogHeader><DialogTitle>{view === 'menu' ? 'Agent 设置' : view === 'base' ? '基础设置' : view === 'role' ? '角色定义' : view === 'permission' ? '权限设置' : '自动化任务管理'}</DialogTitle></DialogHeader>
    {view === 'menu' && <div className="space-y-2">{[
      ['base', 'ri-user-settings-line', '基础设置', '修改名称和头像'],
      ['role', 'ri-magic-line', '角色定义', '设置角色、职责和行为边界'],
      ['permission', 'ri-lock-line', '权限设置', '固定为私密，不可更改'],
      ['tasks', 'ri-timer-flash-line', '自动化任务管理', `${agent.tasks.length} 个任务`],
    ].map(([id, icon, title, description]) => <button key={id} onClick={() => setView(id)} className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50/30"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-lg text-orange-500"><i className={icon} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs text-neutral-400">{description}</span></span><i className="ri-arrow-right-s-line text-neutral-300" /></button>)}</div>}
    {view === 'base' && <BaseSettings agent={agent.agent} onSave={agent.updateAgent} onBack={() => setView('menu')} />}
    {view === 'role' && <RoleSettings agent={agent.agent} onSave={agent.updateAgent} onBack={() => setView('menu')} />}
    {view === 'permission' && <div><button onClick={() => setView('menu')} className="mb-5 text-sm text-neutral-500"><i className="ri-arrow-left-line mr-1" />返回设置</button><div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600"><i className="ri-lock-fill" /></span><div><h4 className="font-semibold">私密</h4><p className="mt-1 text-xs text-neutral-500">仅当前用户和管理员可见</p></div><i className="ri-check-line ml-auto text-xl text-orange-500" /></div></div><p className="mt-4 text-xs leading-5 text-neutral-400">Super Agent 是系统为每位用户创建的专属助手，权限不可修改。</p></div>}
    {view === 'tasks' && <TaskSettings tasks={agent.tasks} onToggle={agent.toggleTask} onDelete={agent.deleteTask} onRun={agent.runTask} onNew={() => { onOpenChange(false); onCreateTask(); }} onBack={() => setView('menu')} initialTaskId={taskTargetId} />}
  </DialogContent></Dialog>;
}

function DetailMessage({ message, onOpenSources, onRetry, onOpenReport, onOpenTask, suggestions, onSelectSuggestion }) {
  const user = message.role === 'user';
  if (message.type === 'topic-start') return <div className="py-2"><div className="flex items-center gap-3 text-xs text-neutral-400 before:h-px before:flex-1 before:bg-neutral-200 after:h-px after:flex-1 after:bg-neutral-200">新话题</div><p className="mt-3 rounded-2xl bg-white p-4 text-sm leading-6 ring-1 ring-neutral-200">{message.text}</p></div>;
  if (message.type === 'system' || message.type === 'task-submitting') return <div className="text-center text-xs text-neutral-400">{message.text}</div>;
  return <div className={`flex ${user ? 'justify-end' : 'justify-start'}`}><div className="max-w-[76%]"><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${user ? 'bg-orange-500 text-white' : message.type?.includes('error') ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-100' : 'bg-white text-neutral-700 ring-1 ring-neutral-200'}`}>{message.type === 'report' ? <button onClick={() => onOpenReport(message.reportId)} className="text-left"><strong className="block">{message.title}</strong><span className="mt-2 block text-xs leading-5 text-neutral-500">{message.summary}</span><span className="mt-3 block text-xs text-orange-600">查看报告</span></button> : message.type === 'task-result' ? <button onClick={() => onOpenTask(message.taskId)} className="text-left"><strong className="block text-emerald-700">{message.text}</strong><span className="mt-2 block text-xs">{message.taskName} · {message.agentName}</span><span className="mt-3 block text-xs text-orange-600">查看自动化任务</span></button> : message.text}{message.type?.includes('error') && <button onClick={() => onRetry(message)} className="ml-2 text-xs underline">重试</button>}</div>{!user && message.sources?.length > 0 && <button onClick={() => onOpenSources(message.id)} className="mt-1 text-[11px] text-neutral-400">{message.sources.length} 条来源 · {message.time}</button>}{!user && suggestions?.length > 0 && <div className="mt-2 space-y-1.5" aria-label="推荐问题">{suggestions.map(item => <button key={item} onClick={() => onSelectSuggestion(item)} className="flex w-full items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-left text-xs text-neutral-600 transition hover:bg-orange-50 hover:text-orange-700"><i className="ri-arrow-right-s-line shrink-0 text-neutral-400" /><span>{item}</span></button>)}</div>}<div className={`mt-1 text-[10px] text-neutral-300 ${user ? 'text-right' : ''}`}>{message.time}</div></div></div>;
}

export function SuperAgentDetail({ onOpenReport, onOpenTask, initialTaskId }) {
  const agent = useSuperAgent();
  const [settingsOpen, setSettingsOpen] = useState(Boolean(initialTaskId));
  const [settingsView, setSettingsView] = useState(initialTaskId ? `task:${initialTaskId}` : 'menu');
  const [value, setValue] = useState(agent.draft);
  const listRef = useRef(null);
  useEffect(() => { agent.clearUnread(); }, []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [agent.messages, agent.pendingMessageId]);
  const send = () => { if (!value.trim()) return; agent.sendMessage(value); setValue(''); };
  const lastReplyId = [...agent.messages].reverse().find(message => message.role !== 'user' && !['system', 'task-submitting', 'topic-start'].includes(message.type))?.id;
  return <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-50/50">
    <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4"><Avatar value={agent.agent.avatar} tone={agent.agent.avatarTone} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate font-semibold">{agent.agent.name}</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"><i className="ri-lock-fill mr-1" />私密</span><span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] text-orange-600">Super Agent</span></div><div className="mt-1 text-xs text-emerald-600">在线</div></div><Button variant="outline" size="sm" onClick={() => { setSettingsView('menu'); setSettingsOpen(true); }}><i className="ri-settings-3-line" />设置</Button></header>
    <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6"><div className="mx-auto max-w-[820px] space-y-5">{agent.messages.map(message => <DetailMessage key={message.id} message={message} onOpenSources={agent.openSources} onRetry={message.type === 'task-error' ? () => agent.startAutomationFlow('任务创建失败') : agent.retryMessage} onOpenReport={onOpenReport} onOpenTask={id => { setSettingsView(`task:${id}`); setSettingsOpen(true); onOpenTask?.(id); }} suggestions={message.id === lastReplyId && !agent.pendingMessageId ? agent.suggestions : []} onSelectSuggestion={agent.sendMessage} />)}{agent.pendingMessageId && <div className="flex justify-start"><div className="rounded-2xl bg-white px-4 py-3 text-xs text-neutral-400 ring-1 ring-neutral-200">对方输入中 ···</div></div>}</div></div>
    {!['materials', 'agent'].includes(agent.automationDraft?.step) && <div className="border-t border-neutral-200 bg-white p-4"><div className="mx-auto max-w-[820px]"><div className="mb-2"><button onClick={agent.startNewTopic} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">+ 开启新话题</button></div><div className="flex items-center gap-2"><Textarea value={value} onChange={event => { setValue(event.target.value); agent.setDraft(event.target.value); }} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} rows="2" className="resize-none" placeholder="问 Super Agent…" />{agent.pendingMessageId ? <Button size="icon" variant="outline" onClick={agent.stopGeneration} aria-label="停止生成"><i className="ri-stop-fill" /></Button> : <Button size="icon" onClick={send} disabled={!value.trim()} aria-label="发送"><i className="ri-send-plane-2-line" /></Button>}</div></div></div>}
    {agent.automationDraft?.step === 'materials' && <MaterialsPicker draft={agent.automationDraft} onChange={agent.updateAutomationDraft} onCancel={agent.cancelAutomation} onConfirm={agent.confirmMaterials} />}
    {agent.automationDraft?.step === 'agent' && <AgentPicker draft={agent.automationDraft} onChange={agent.updateAutomationDraft} onCancel={agent.cancelAutomation} onConfirm={agent.submitAutomation} />}
    <SourceSheet messageId={agent.sourceSheetMessageId} expandedIds={agent.expandedSourceIds} onToggle={agent.toggleSource} onClose={agent.closeSources} />
    <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} initialView={settingsView} onCreateTask={() => { agent.startAutomationFlow(); }} />
  </section>;
}
