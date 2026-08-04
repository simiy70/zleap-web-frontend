import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { automationMaterials, executionAgents, superAgentSources, useSuperAgent } from './SuperAgentProvider';

function AgentMark({ size = 'md', avatar, tone }) {
  const dimensions = size === 'sm' ? 'h-8 w-8 text-sm' : size === 'lg' ? 'h-14 w-14 text-xl' : 'h-10 w-10 text-base';
  return <span className={`flex ${dimensions} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone || 'from-orange-400 to-rose-500'} font-semibold text-white shadow-sm`}>{avatar || '✦'}</span>;
}

function ReportCard({ message, onOpen }) {
  return <button onClick={() => onOpen(message.reportId)} className="mt-2 block w-full overflow-hidden rounded-2xl border border-orange-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="h-24 bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,.7),transparent_35%),linear-gradient(135deg,#fff7ed,#e0f2fe)] p-4">
      <div className="flex h-full items-end gap-1.5 opacity-70">{[38, 56, 44, 68, 51, 73, 61].map((height, index) => <span key={index} className="w-5 rounded-t bg-slate-700/70" style={{ height }} />)}</div>
    </div>
    <div className="p-4"><h4 className="line-clamp-2 text-sm font-semibold text-neutral-900">{message.title}</h4><p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-500">{message.summary}</p><span className="mt-3 inline-flex items-center text-xs font-medium text-orange-600">查看报告 <i className="ri-arrow-right-s-line text-base" /></span></div>
  </button>;
}

function TaskResultCard({ message, onOpen }) {
  return <div className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><i className="ri-checkbox-circle-fill" />{message.text}</div>
    <dl className="mt-3 space-y-2 text-xs"><div className="flex gap-2"><dt className="text-neutral-400">任务名称</dt><dd className="font-medium text-neutral-700">{message.taskName}</dd></div><div className="flex gap-2"><dt className="text-neutral-400">执行 Agent</dt><dd className="font-medium text-neutral-700">{message.agentName}</dd></div></dl>
    <button onClick={() => onOpen(message.taskId)} className="mt-3 text-xs font-medium text-emerald-700 hover:underline">查看自动化任务</button>
  </div>;
}

function ReplySuggestions({ items, onSelect }) {
  return <div className="mt-2 space-y-1.5 text-left" aria-label="推荐问题">
    {items.map(item => <button key={item} onClick={() => onSelect(item)} className="flex w-full items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-left text-xs text-neutral-600 transition hover:bg-orange-50 hover:text-orange-700"><i className="ri-arrow-right-s-line shrink-0 text-neutral-400" /><span>{item}</span></button>)}
  </div>;
}

function MessageBubble({ message, onOpenSources, onRetry, onOpenReport, onOpenTask, suggestions, onSelectSuggestion }) {
  if (message.type === 'topic-start') return <div className="py-3"><div className="flex items-center gap-3 text-[11px] text-neutral-400 before:h-px before:flex-1 before:bg-neutral-200 after:h-px after:flex-1 after:bg-neutral-200">新话题</div><div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-neutral-700 ring-1 ring-neutral-200/70">{message.text}</div></div>;
  if (message.type === 'system' || message.type === 'task-submitting') return <div className="flex items-center justify-center gap-2 py-1 text-xs text-neutral-400">{message.type === 'task-submitting' && <i className="ri-loader-4-line animate-spin" />}{message.text}</div>;
  const isUser = message.role === 'user';
  return <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[86%] ${isUser ? 'text-right' : ''}`}>
      <div className={`rounded-2xl px-4 py-3 text-left text-sm leading-6 ${isUser ? 'rounded-br-md bg-orange-500 text-white' : message.type === 'error' || message.type === 'task-error' ? 'rounded-bl-md bg-rose-50 text-rose-700 ring-1 ring-rose-100' : 'rounded-bl-md bg-white text-neutral-700 ring-1 ring-neutral-200/70'}`}>
        {message.text}
        {message.type === 'report' && <ReportCard message={message} onOpen={onOpenReport} />}
        {message.type === 'task-result' && <TaskResultCard message={message} onOpen={onOpenTask} />}
        {(message.type === 'error' || message.type === 'task-error') && <button onClick={() => onRetry(message)} className="ml-2 rounded-lg bg-white px-2 py-1 text-xs font-medium text-rose-600 ring-1 ring-rose-100">{message.type === 'task-error' ? '再次创建' : '重试'}</button>}
      </div>
      {!isUser && message.sources?.length > 0 && <button onClick={() => onOpenSources(message.id)} className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-orange-600"><i className="ri-links-line" />{message.sources.length} 条来源 · {message.time}</button>}
      {!isUser && suggestions?.length > 0 && <ReplySuggestions items={suggestions} onSelect={onSelectSuggestion} />}
      {isUser && message.context && <div className="mt-1 text-[10px] text-neutral-300">引用：{message.context.title}</div>}
      <div className={`mt-1 text-[10px] text-neutral-300 ${isUser ? 'text-right' : ''}`}>{message.time}</div>
    </div>
  </div>;
}

export function MaterialsPicker({ draft, onChange, onCancel, onConfirm }) {
  const [browseAll, setBrowseAll] = useState(false);
  const [query, setQuery] = useState('');
  const shown = automationMaterials.filter(item => browseAll || item.recommended).filter(item => !query || `${item.name}${item.group}`.toLowerCase().includes(query.toLowerCase()));
  const toggle = id => onChange({ materialIds: draft.materialIds.includes(id) ? draft.materialIds.filter(item => item !== id) : [...draft.materialIds, id] });
  return <div className="border-t border-neutral-200 bg-white p-4 shadow-[0_-12px_30px_rgba(15,23,42,.06)]">
    <div className="flex items-center justify-between"><div><h4 className="text-sm font-semibold">选择任务材料</h4><p className="mt-0.5 text-[11px] text-neutral-400">已选择 {draft.materialIds.length} 项，可多选</p></div><button onClick={() => setBrowseAll(!browseAll)} className="text-xs text-orange-600">{browseAll ? '仅看推荐' : '浏览全部材料'}</button></div>
    {browseAll && <div className="relative mt-3"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="h-9 pl-9" placeholder="搜索材料" /></div>}
    <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">{shown.map(item => <label key={item.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${draft.materialIds.includes(item.id) ? 'border-orange-300 bg-orange-50' : 'border-neutral-200'}`}><input type="checkbox" checked={draft.materialIds.includes(item.id)} onChange={() => toggle(item.id)} /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{item.name}</span><span className="text-[10px] text-neutral-400">{item.group}</span></span>{item.recommended && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] text-orange-600">推荐</span>}</label>)}</div>
    {!shown.length && <div className="py-5 text-center text-xs text-neutral-400">没有匹配的材料</div>}
    <div className="mt-3 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={onCancel}>退出</Button><Button size="sm" disabled={!draft.materialIds.length} onClick={onConfirm}>确认材料</Button></div>
  </div>;
}

export function AgentPicker({ draft, onChange, onCancel, onConfirm }) {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => executionAgents.filter(agent => !query || `${agent.name}${agent.description}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="border-t border-neutral-200 bg-white p-4 shadow-[0_-12px_30px_rgba(15,23,42,.06)]">
    <h4 className="text-sm font-semibold">选择执行 Agent</h4><div className="relative mt-3"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="h-9 pl-9" placeholder="搜索我管理的 Agent" /></div>
    <div className="mt-3 max-h-44 space-y-2 overflow-y-auto">{shown.map(agent => <button key={agent.id} onClick={() => onChange({ agentId: agent.id, agentName: agent.name })} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${draft.agentId === agent.id ? 'border-orange-300 bg-orange-50' : 'border-neutral-200'}`}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-sm">{agent.emoji}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{agent.name}</span><span className="block truncate text-[10px] text-neutral-400">{agent.description}</span></span>{agent.recommended && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] text-orange-600">推荐</span>}{draft.agentId === agent.id && <i className="ri-check-line text-orange-500" />}</button>)}</div>
    {!shown.length && <div className="py-5 text-center text-xs text-neutral-400">没有匹配的 Agent</div>}
    <div className="mt-3 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={onCancel}>退出</Button><Button size="sm" disabled={!draft.agentId} onClick={onConfirm}>确认并创建</Button></div>
  </div>;
}

export function SourceSheet({ messageId, expandedIds, onToggle, onClose }) {
  const [detail, setDetail] = useState(null);
  if (!messageId) return null;
  return <div className="absolute inset-0 z-30 flex items-end bg-black/20" onClick={onClose}>
    <section className="max-h-[82%] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl" onClick={event => event.stopPropagation()}>
      <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4"><h3 className="font-semibold">来源</h3><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" aria-label="关闭来源"><i className="ri-close-line text-xl" /></button></header>
      <div className="max-h-[480px] space-y-3 overflow-y-auto p-4">{superAgentSources.map(source => <article key={source.id} className="rounded-2xl border border-neutral-200 p-4"><button onClick={() => setDetail(source)} className="w-full text-left"><h4 className="text-sm font-semibold">{source.title}</h4><p className="mt-2 text-xs leading-5 text-neutral-500">{source.description}</p></button><button onClick={() => onToggle(source.id)} className="mt-3 flex items-center gap-1 text-xs text-orange-600">{source.children.length} 个相关子事件 <i className={expandedIds.includes(source.id) ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} /></button>{expandedIds.includes(source.id) && <div className="mt-2 space-y-1 border-t border-neutral-100 pt-2">{source.children.map(child => <button key={child} onClick={() => setDetail({ ...source, title: child })} className="block w-full rounded-lg px-2 py-2 text-left text-xs text-neutral-600 hover:bg-neutral-50">{child}</button>)}</div>}</article>)}</div>
    </section>
    {detail && <div className="absolute inset-5 z-40 flex items-center justify-center" onClick={() => setDetail(null)}><div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-neutral-200" onClick={event => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><h4 className="font-semibold">信息来源详情</h4><button onClick={() => setDetail(null)}><i className="ri-close-line" /></button></div><h5 className="mt-5 text-sm font-semibold">{detail.title}</h5><p className="mt-2 text-sm leading-6 text-neutral-500">{detail.description}</p></div></div>}
  </div>;
}

export function SuperAgentOverlay({ visible, onOpenDetail, onOpenReport, onOpenTask }) {
  const agent = useSuperAgent();
  const listRef = useRef(null);
  const [draft, setLocalDraft] = useState(agent.draft);
  useEffect(() => setLocalDraft(agent.draft), [agent.draft]);
  useEffect(() => { if (agent.overlayOpen) listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [agent.messages, agent.pendingMessageId, agent.overlayOpen, agent.automationDraft?.step]);
  if (!visible) return null;
  const send = () => { const text = draft.trim(); if (!text) return; agent.sendMessage(text); setLocalDraft(''); };
  if (!agent.overlayOpen) return <button onClick={agent.openOverlay} className="fixed bottom-24 right-5 z-40 rounded-full bg-white p-1.5 shadow-2xl ring-1 ring-orange-100 transition hover:scale-105" aria-label={`打开 ${agent.agent.name}`}><span className="relative block"><AgentMark size="lg" avatar={agent.agent.avatar} tone={agent.agent.avatarTone} />{agent.unread && <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white" />}</span></button>;
  const pickerVisible = ['materials', 'agent'].includes(agent.automationDraft?.step);
  const lastReplyId = [...agent.messages].reverse().find(message => message.role !== 'user' && !['system', 'task-submitting', 'topic-start'].includes(message.type))?.id;
  return <aside className="fixed bottom-20 right-3 top-16 z-40 flex w-[min(430px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl ring-1 ring-neutral-200 max-sm:inset-x-2 max-sm:bottom-20 max-sm:top-16 max-sm:w-auto">
    <header className="flex items-center gap-3 border-b border-neutral-200/70 bg-white px-4 py-3"><AgentMark size="sm" avatar={agent.agent.avatar} tone={agent.agent.avatarTone} /><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{agent.agent.name}</h2><div className="text-[10px] text-emerald-600">在线 · 私密</div></div><button onClick={onOpenDetail} title="消息详情" aria-label="打开消息详情" className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><i className="ri-fullscreen-line" /></button><button onClick={agent.closeOverlay} title="关闭" aria-label="关闭悬浮会话" className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><i className="ri-close-line text-xl" /></button></header>
    <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
      <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-sky-50 p-4"><h3 className="font-semibold text-neutral-800">你好，我是 Super Agent</h3><p className="mt-1 text-xs leading-5 text-neutral-500">可以总结信息、解释洞察、提炼要点，也可以根据明确行动结论生成任务。</p></div>
      {agent.messages.map(message => <MessageBubble key={message.id} message={message} onOpenSources={agent.openSources} onRetry={message.type === 'task-error' ? () => agent.startAutomationFlow('任务创建失败') : agent.retryMessage} onOpenReport={onOpenReport} onOpenTask={onOpenTask} suggestions={message.id === lastReplyId && !agent.pendingMessageId ? agent.suggestions : []} onSelectSuggestion={agent.sendMessage} />)}
      {agent.pendingMessageId && <div className="flex justify-start"><div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-neutral-200">{[0, 1, 2].map(index => <span key={index} className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400" style={{ animationDelay: `${index * 150}ms` }} />)}<span className="ml-2 text-xs text-neutral-400">对方输入中</span></div></div>}
    </div>
    {!pickerVisible && <div className="border-t border-neutral-200 bg-white p-3">
      {agent.visibleContext ? <div className="mb-2 flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs text-orange-700"><i className="ri-links-line" /><span className="min-w-0 flex-1 truncate">{agent.visibleContext.title}</span><button onClick={agent.closeContext} aria-label="关闭页面引用"><i className="ri-close-line" /></button></div> : agent.pageContext?.unavailableReason ? <div className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">{agent.pageContext.unavailableReason}</div> : null}
      <div className="mb-2"><button onClick={agent.startNewTopic} className="rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] text-neutral-600">+ 开启新话题</button></div>
      <div className="flex items-center gap-2"><Input value={draft} onChange={event => { setLocalDraft(event.target.value); agent.setDraft(event.target.value); }} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) send(); }} placeholder="问 Super Agent…" disabled={Boolean(agent.pendingMessageId)} />{agent.pendingMessageId ? <Button size="icon" variant="outline" onClick={agent.stopGeneration} aria-label="停止生成"><i className="ri-stop-fill" /></Button> : <Button size="icon" onClick={send} disabled={!draft.trim()} aria-label="发送"><i className="ri-send-plane-2-line" /></Button>}</div>
    </div>}
    {agent.automationDraft?.step === 'materials' && <MaterialsPicker draft={agent.automationDraft} onChange={agent.updateAutomationDraft} onCancel={agent.cancelAutomation} onConfirm={agent.confirmMaterials} />}
    {agent.automationDraft?.step === 'agent' && <AgentPicker draft={agent.automationDraft} onChange={agent.updateAutomationDraft} onCancel={agent.cancelAutomation} onConfirm={agent.submitAutomation} />}
    <SourceSheet messageId={agent.sourceSheetMessageId} expandedIds={agent.expandedSourceIds} onToggle={agent.toggleSource} onClose={agent.closeSources} />
  </aside>;
}
