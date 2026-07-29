import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export const INFO_SOURCE_OPTIONS = [
  { id: 'public-industry', name: '行业资讯', scope: 'enterprise', owner: '运营团队', available: true },
  { id: 'public-rd-weekly', name: '飞书研发周会', scope: 'enterprise', owner: '研发团队', available: true },
  { id: 'public-interviews', name: '用户访谈合集', scope: 'enterprise', owner: '研发团队', available: true },
  { id: 'mine-ai-project', name: 'AI 项目', scope: 'mine', owner: 'Simiy', available: true },
  { id: 'mine-product-library', name: '产品资料库', scope: 'mine', owner: 'Simiy', available: true },
  { id: 'partial-design-system', name: '设计规范与组件库', scope: 'partial', owner: '设计团队', available: true },
  { id: 'restricted-finance', name: '经营与财务数据', scope: 'partial', owner: '财务团队', available: false },
];

export const PUBLIC_SOURCE_IDS = INFO_SOURCE_OPTIONS
  .filter(source => source.scope === 'enterprise' && source.available)
  .map(source => source.id);

const ORG_OPTIONS = [
  { id: 'dept-product', type: 'dept', name: '产品部', detail: '12 人' },
  { id: 'dept-rd', type: 'dept', name: '研发部', detail: '34 人' },
  { id: 'dept-design', type: 'dept', name: '设计部', detail: '8 人' },
  { id: 'dept-ops', type: 'dept', name: '运营部', detail: '15 人' },
  { id: 'user-sumingyan', type: 'user', name: '苏铭妍', detail: '产品经理' },
  { id: 'user-yanyijing', type: 'user', name: '严伊婧', detail: 'UX 设计师' },
  { id: 'user-chenyusong', type: 'user', name: '陈予淞', detail: '测试工程师' },
  { id: 'user-lizhimin', type: 'user', name: '李智敏', detail: '后端架构师' },
];

const EMOJIS = ['🐣', '🤖', '🧠', '✨', '🚀', '💡', '🎯', '📚', '🔎', '🛠️'];
const TONES = ['amber', 'slate', 'violet', 'rose', 'green', 'gray'];

const TEMPLATES = [
  { id: 'code-review', category: '研发', name: '代码评审助手', emoji: '🛠️', tone: 'slate', desc: '检查代码变更，归纳风险并给出可执行的修改建议。', prompt: '你是一名严谨的代码评审助手。请检查正确性、安全性、可维护性和测试覆盖，并按优先级输出建议。', sourceIds: ['public-rd-weekly'] },
  { id: 'release', category: '研发', name: '版本发布助手', emoji: '🚀', tone: 'amber', desc: '整理版本范围、发布风险和上线检查清单。', prompt: '你负责整理版本发布内容，核对依赖、风险、回滚方案和上线检查项。', sourceIds: ['public-rd-weekly'] },
  { id: 'knowledge', category: '知识管理', name: '知识库问答助手', emoji: '📚', tone: 'violet', desc: '基于团队公开资料回答问题并标注信息来源。', prompt: '你是企业知识库问答助手。请优先检索已关联信息源，回答时标注来源并说明不确定信息。', sourceIds: PUBLIC_SOURCE_IDS },
  { id: 'meeting', category: '知识管理', name: '会议纪要助手', emoji: '📝', tone: 'green', desc: '提炼会议结论、待办、负责人和截止时间。', prompt: '请将会议内容整理为结论、待办、负责人、截止时间和风险五个部分。', sourceIds: ['public-rd-weekly'] },
  { id: 'research', category: '研究分析', name: '行业研究助手', emoji: '🔎', tone: 'rose', desc: '持续追踪行业动态并输出结构化研究摘要。', prompt: '你是一名行业研究助手。请从公开信息中提取关键变化、证据、影响和待验证假设。', sourceIds: ['public-industry', 'public-interviews'] },
  { id: 'insight', category: '研究分析', name: '用户洞察助手', emoji: '💡', tone: 'amber', desc: '从访谈和反馈中识别高频问题与机会点。', prompt: '请分析用户反馈，归纳高频需求、核心痛点、代表性证据和可验证的产品机会。', sourceIds: ['public-interviews'] },
];

const EXTERNAL_AGENTS = [
  { id: 'codex-feishu', name: '飞书CLI', source: 'Codex', path: '~/.codex/agents/feishu-cli', updated: '刚刚', compatibility: 'compatible', desc: '飞书研发全流程助手' },
  { id: 'claude-research', name: 'Research Copilot', source: 'Claude Code', path: '~/.claude/agents/research-copilot.md', updated: '2 分钟前', compatibility: 'adjustment', desc: '研究资料归纳与报告生成' },
  { id: 'cursor-refactor', name: 'Refactor Agent', source: 'Cursor', path: '~/.cursor/rules/refactor-agent.mdc', updated: '5 分钟前', compatibility: 'compatible', desc: '代码重构与质量检查' },
  { id: 'cursor-legacy', name: 'Legacy Browser Agent', source: 'Cursor', path: '~/.cursor/rules/legacy-browser.mdc', updated: '昨天', compatibility: 'incompatible', desc: '依赖当前不支持的浏览器扩展' },
];

const scopeConfig = {
  mine: { label: '私密', desc: '仅自己及管理员可见', icon: 'ri-lock-2-line', selected: 'border-neutral-400 bg-neutral-50 ring-1 ring-neutral-300', color: 'text-neutral-500' },
  partial: { label: '部分可见', desc: '指定人员或部门可见', icon: 'ri-group-line', selected: 'border-blue-400 bg-blue-50 ring-1 ring-blue-300', color: 'text-blue-500' },
  enterprise: { label: '所有人可见', desc: '企业内所有人可见', icon: 'ri-global-line', selected: 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300', color: 'text-emerald-500' },
};

export function ScopeBadge({ scope = 'mine' }) {
  const cfg = scopeConfig[scope] || scopeConfig.mine;
  const cls = scope === 'enterprise'
    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
    : scope === 'partial'
      ? 'border-blue-100 bg-blue-50 text-blue-700'
      : 'border-neutral-200 bg-neutral-100 text-neutral-600';
  return <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] ${cls}`}><i className={cfg.icon} />{cfg.label}</span>;
}

export function CreateAssistantMenu({ trigger, onSelect }) {
  return <span className="block h-full [&>div]:block [&>div]:h-full [&>div]:w-full"><DropdownMenu>
    <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent className="w-[260px] rounded-2xl p-1.5" align="end">
      <DropdownMenuItem className="items-start rounded-xl px-3 py-3" onClick={() => onSelect('zleap')}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg text-orange-500"><i className="ri-sparkling-2-line" /></span>
        <span><span className="block font-medium text-neutral-900">创建 Zleap 助手</span><span className="mt-0.5 block text-[11px] leading-relaxed text-neutral-400">输入提示词、导入文件或使用模板</span></span>
      </DropdownMenuItem>
      <DropdownMenuItem className="items-start rounded-xl px-3 py-3" onClick={() => onSelect('external')}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-lg text-violet-600"><i className="ri-plug-line" /></span>
        <span><span className="block font-medium text-neutral-900">接入外部 Agent</span><span className="mt-0.5 block text-[11px] leading-relaxed text-neutral-400">导入设备中已识别的本地 Agent</span></span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu></span>;
}

function PageHeader({ title, desc, onBack }) {
  return <div className="flex items-start gap-3 border-b border-neutral-200/50 px-8 py-5">
    <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="返回"><i className="ri-arrow-left-line text-lg" /></Button>
    <div><h2 className="text-lg font-semibold text-neutral-900">{title}</h2><p className="mt-1 text-sm text-neutral-500">{desc}</p></div>
  </div>;
}

function ResultCard({ assistant, onEdit, onDone }) {
  return <div className="mx-auto flex w-full max-w-[620px] flex-col items-center rounded-3xl bg-white px-8 py-8 text-center shadow-sm ring-1 ring-neutral-200/70">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600"><i className="ri-checkbox-circle-fill" /></span>
    <div className="mt-3 text-lg font-semibold">助手已创建</div>
    <div className="mt-1 text-sm text-neutral-400">默认设为私密，并关联了所有公共信息源</div>
    <div className="mt-6 flex w-full items-center gap-4 rounded-2xl bg-neutral-50 px-5 py-4 text-left ring-1 ring-neutral-100">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-4xl shadow-sm">{assistant.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-semibold text-neutral-900">{assistant.name}</div>
        <div className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-neutral-500">{assistant.desc}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2"><ScopeBadge scope={assistant.scope} /><span className="text-[11px] text-neutral-400">已关联 {assistant.sourceIds.length} 个公共信息源</span></div>
      </div>
    </div>
    <div className="mt-6 flex w-full justify-end gap-3">
      <Button variant="outline" onClick={onDone}>完成</Button>
      <Button onClick={() => onEdit(assistant)}><i className="ri-edit-line" />编辑详情</Button>
    </div>
  </div>;
}

function makeGeneratedAssistant({ name, desc, prompt, emoji = '🧠', tone = 'amber', sourceIds = PUBLIC_SOURCE_IDS, origin = 'zleap', compatibility = 'compatible' }) {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    desc,
    prompt,
    emoji,
    tone,
    scope: 'mine',
    visibleTargets: [],
    sourceIds: [...new Set([...PUBLIC_SOURCE_IDS, ...sourceIds.filter(id => PUBLIC_SOURCE_IDS.includes(id))])],
    origin,
    compatibility,
  };
}

function inferName(prompt) {
  const clean = prompt.replace(/[#>*_`]/g, '').trim();
  const first = clean.split(/[，。！？\n]/)[0].trim();
  return first.length > 12 ? `${first.slice(0, 10)}助手` : (first || '智能协作助手');
}

function improvePrompt(prompt) {
  return `${prompt.trim()}\n\n请先澄清目标与约束，再按“结论、依据、下一步”输出结果；遇到信息不足时明确标注，不编造事实。`;
}

export function ZleapCreatePage({ onBack, onCreate, onEdit }) {
  const [method, setMethod] = useState('manual');
  const [prompt, setPrompt] = useState('');
  const [improved, setImproved] = useState('');
  const [fileState, setFileState] = useState({ loading: false, error: '', parsed: null });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);

  const create = payload => {
    setCreating(true);
    window.setTimeout(() => {
      const [created] = onCreate([makeGeneratedAssistant(payload)]);
      setResult(created);
      setCreating(false);
    }, 800);
  };

  const submitManual = () => {
    const value = prompt.trim();
    if (!value) return;
    create({ name: inferName(value), desc: value.slice(0, 72), prompt: value, emoji: '🧠', tone: 'violet' });
  };

  const handleFile = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!/^agents?\.md$/i.test(file.name)) {
      setFileState({ loading: false, error: '仅支持 AGENTS.md 或 agent.md 文件', parsed: null });
      return;
    }
    if (file.size > 1024 * 1024) {
      setFileState({ loading: false, error: '文件不能超过 1MB', parsed: null });
      return;
    }
    setFileState({ loading: true, error: '', parsed: null });
    try {
      const content = await file.text();
      if (!content.trim()) throw new Error('文件内容为空');
      const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() || file.name.replace(/\.md$/i, '');
      const paragraphs = content.replace(/^#\s+.+$/m, '').split(/\n\s*\n/).map(item => item.replace(/^#+\s*/gm, '').trim()).filter(Boolean);
      setFileState({ loading: false, error: '', parsed: { name: title, desc: paragraphs[0]?.slice(0, 90) || '从 Agent 配置文件导入', prompt: content } });
    } catch (error) {
      setFileState({ loading: false, error: error.message || '读取文件失败，请重试', parsed: null });
    }
  };

  if (result) return <div className="flex-1 overflow-y-auto px-6 py-10"><ResultCard assistant={result} onEdit={onEdit} onDone={onBack} /></div>;

  return <div className="flex min-h-0 flex-1 flex-col">
    <PageHeader title="创建 Zleap 助手" desc="只需告诉我们它要做什么，其他配置可在创建后调整。" onBack={onBack} />
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[860px]">
        <div className="inline-flex rounded-xl bg-neutral-100 p-1">
          {[['manual', '手动创建', 'ri-edit-line'], ['file', '导入 AGENTS.md', 'ri-file-upload-line'], ['template', '系统模板', 'ri-layout-grid-line']].map(([id, label, icon]) => (
            <button key={id} onClick={() => setMethod(id)} className={`flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm transition ${method === id ? 'bg-white font-medium text-orange-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}><i className={icon} />{label}</button>
          ))}
        </div>

        {method === 'manual' && <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-neutral-200/70">
          <div className="flex items-center justify-between"><div><div className="font-semibold">描述助手的工作</div><div className="mt-1 text-[12px] text-neutral-400">名称、头像和简介会自动生成</div></div><Button variant="outline" size="sm" disabled={!prompt.trim()} onClick={() => setImproved(improvePrompt(prompt))}><i className="ri-sparkling-line" />一键完善</Button></div>
          <Textarea value={prompt} onChange={event => { setPrompt(event.target.value); setImproved(''); }} rows="9" className="mt-5 resize-none" placeholder="例如：每天整理产品和 AI 行业动态，给出三条最值得关注的变化，并标注信息来源…" />
          {improved && <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
            <div className="text-[12px] font-medium text-orange-700">完善后的提示词</div><p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-neutral-700">{improved}</p>
            <div className="mt-3 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setImproved('')}>保留原文</Button><Button size="sm" onClick={() => { setPrompt(improved); setImproved(''); }}>采用优化</Button></div>
          </div>}
          <div className="mt-5 flex justify-end"><Button disabled={!prompt.trim() || creating} onClick={submitManual}>{creating ? <><i className="ri-loader-4-line animate-spin" />正在生成</> : '创建助手'}</Button></div>
        </div>}

        {method === 'file' && <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-neutral-200/70">
          <label className={`flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${fileState.parsed ? 'border-emerald-300 bg-emerald-50/30' : 'border-orange-200 hover:bg-orange-50/30'}`}>
            <input type="file" accept=".md,text/markdown" className="hidden" onChange={handleFile} />
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${fileState.parsed ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-500'}`}><i className={fileState.loading ? 'ri-loader-4-line animate-spin' : fileState.parsed ? 'ri-file-check-line' : 'ri-file-add-line'} /></span>
            <div className="mt-4 text-sm font-medium">{fileState.loading ? '正在读取文件' : fileState.parsed ? fileState.parsed.name : '拖拽文件到此处，或点击上传'}</div>
            <div className="mt-1 text-[12px] text-neutral-400">{fileState.parsed ? fileState.parsed.desc : '支持 AGENTS.md / agent.md，文件不超过 1MB'}</div>
          </label>
          {fileState.error && <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12px] text-rose-600"><i className="ri-error-warning-line mr-1" />{fileState.error}</div>}
          <div className="mt-5 flex justify-end"><Button disabled={!fileState.parsed || creating} onClick={() => create({ ...fileState.parsed, emoji: '🤖', tone: 'slate' })}>{creating ? '正在生成' : '创建助手'}</Button></div>
        </div>}

        {method === 'template' && <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {TEMPLATES.map(template => <button key={template.id} onClick={() => setSelectedTemplate(template)} className={`rounded-2xl bg-white p-4 text-left ring-1 transition ${selectedTemplate?.id === template.id ? 'ring-2 ring-orange-300' : 'ring-neutral-200/70 hover:ring-orange-200'}`}>
              <div className="flex items-start justify-between"><span className="text-3xl">{template.emoji}</span><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">{template.category}</span></div>
              <div className="mt-3 text-sm font-semibold">{template.name}</div><div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">{template.desc}</div>
            </button>)}
          </div>
          <div className="mt-5 flex justify-end"><Button disabled={!selectedTemplate || creating} onClick={() => create(selectedTemplate)}>{creating ? '正在生成' : '使用此模板'}</Button></div>
        </div>}
      </div>
    </div>
  </div>;
}

export function ExternalAgentPage({ onBack, onCreate, onComplete, existingNames }) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [results, setResults] = useState([]);
  const [sendInstruction, setSendInstruction] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const toggle = agent => {
    if (agent.compatibility === 'incompatible') return;
    setSelected(current => {
      const next = new Set(current);
      if (next.has(agent.id)) next.delete(agent.id); else next.add(agent.id);
      return next;
    });
  };

  const importAgents = () => {
    const items = EXTERNAL_AGENTS.filter(agent => selected.has(agent.id)).map((agent, index) => {
      const duplicate = existingNames.has(agent.name);
      return makeGeneratedAssistant({
        name: duplicate ? `${agent.name}（${agent.source}）` : agent.name,
        desc: agent.desc,
        prompt: `从 ${agent.source} 导入的本地 Agent 配置。`,
        emoji: index % 2 ? '🔎' : '🤖',
        tone: index % 2 ? 'violet' : 'slate',
        origin: agent.source,
        sourceIds: PUBLIC_SOURCE_IDS,
        compatibility: agent.compatibility,
      });
    });
    setResults(onCreate(items));
  };

  if (results.length > 0) return <div className="flex min-h-0 flex-1 flex-col">
    <PageHeader title="外部 Agent 已接入" desc={`成功创建 ${results.length} 个私密助手，并关联全部公共信息源。`} onBack={onBack} />
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[760px]">
        <div className="space-y-3">{results.map(item => <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-neutral-200/70">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-2xl">{item.emoji}</span>
          <div className="min-w-0 flex-1"><div className="font-medium">{item.name}</div><div className="mt-1 text-[11px] text-neutral-400">{item.origin} · 复制导入 · {item.sourceIds.length} 个公共信息源</div></div>
          <ScopeBadge scope={item.scope} />
        </div>)}</div>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
          <input type="checkbox" checked={sendInstruction} onChange={event => setSendInstruction(event.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-500" />
          <span><span className="block text-sm font-medium text-neutral-800">向已接入 Agent 发送 Zleap 信息源连接指令</span><span className="mt-1 block text-[12px] leading-relaxed text-neutral-500">完成后进入对话页，并在每个 Agent 的会话中回显已发送的连接指令。</span></span>
        </label>
        <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onBack}>返回助手管理</Button><Button onClick={() => onComplete(results, sendInstruction)}>{sendInstruction ? '完成并发送指令' : '完成'}</Button></div>
      </div>
    </div>
  </div>;

  return <div className="flex min-h-0 flex-1 flex-col">
    <PageHeader title="接入外部 Agent" desc="系统正在实时同步设备中的 Agent 状态，选择需要导入的助手。" onBack={onBack} />
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[900px]">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />设备连接正常，Agent 列表将自动更新</div>
        {loading ? <div className="mt-5 space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-[92px] animate-pulse rounded-2xl bg-white/70 ring-1 ring-neutral-200/50" />)}</div>
          : <div className="mt-5 space-y-3">{EXTERNAL_AGENTS.map(agent => {
            const checked = selected.has(agent.id);
            const disabled = agent.compatibility === 'incompatible';
            const status = disabled ? ['不兼容', 'bg-rose-50 text-rose-600'] : agent.compatibility === 'adjustment' ? ['需调整', 'bg-amber-50 text-amber-600'] : ['可导入', 'bg-emerald-50 text-emerald-600'];
            return <button key={agent.id} disabled={disabled} onClick={() => toggle(agent)} className={`flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 text-left ring-1 transition ${disabled ? 'cursor-not-allowed opacity-55 ring-neutral-200/60' : checked ? 'ring-2 ring-orange-300' : 'ring-neutral-200/70 hover:ring-orange-200'}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? 'border-orange-500 bg-orange-500 text-white' : 'border-neutral-300'}`}>{checked && <i className="ri-check-line text-sm" />}</span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg font-semibold text-neutral-600">{agent.source.slice(0, 2)}</span>
              <span className="min-w-0 flex-1"><span className="block font-medium text-neutral-900">{agent.name}</span><span className="mt-1 block truncate font-mono text-[11px] text-neutral-400">{agent.path}</span></span>
              <span className="hidden text-[11px] text-neutral-400 sm:block">{agent.updated}</span><span className={`rounded-full px-2.5 py-1 text-[11px] ${status[1]}`}>{status[0]}</span>
            </button>;
          })}</div>}
        {!loading && <div className="mt-6 flex items-center justify-between"><span className="text-[12px] text-neutral-400">已选择 {selected.size} 个 Agent；导入后不会与本地文件自动同步</span><Button disabled={selected.size === 0} onClick={importAgents}>导入所选 Agent</Button></div>}
      </div>
    </div>
  </div>;
}

export function AssistantDetailPage({ assistant, onBack, onSave }) {
  const [draft, setDraft] = useState(() => ({
    ...assistant,
    visibleTargets: [...(assistant.visibleTargets || [])],
    sourceIds: [...(assistant.sourceIds || PUBLIC_SOURCE_IDS)],
  }));
  const [advanced, setAdvanced] = useState(false);
  const [orgQuery, setOrgQuery] = useState('');
  const [improved, setImproved] = useState('');

  const suggestions = useMemo(() => {
    const query = orgQuery.trim().toLowerCase();
    if (!query) return [];
    return ORG_OPTIONS.filter(option => `${option.name}${option.detail}`.toLowerCase().includes(query) && !draft.visibleTargets.some(item => item.id === option.id));
  }, [orgQuery, draft.visibleTargets]);

  const valid = draft.name.trim() && (draft.scope !== 'partial' || draft.visibleTargets.length > 0);
  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const toggleSource = source => {
    if (!source.available) return;
    set('sourceIds', draft.sourceIds.includes(source.id) ? draft.sourceIds.filter(id => id !== source.id) : [...draft.sourceIds, source.id]);
  };
  const addVisibleTarget = item => {
    set('visibleTargets', [...draft.visibleTargets, { id: item.id, type: item.type, name: item.name }]);
    setOrgQuery('');
  };

  return <div className="flex min-h-0 flex-1 flex-col">
    <PageHeader title="助手详情" desc="调整助手的基础信息、可见范围和可使用的信息源。" onBack={onBack} />
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[900px] space-y-5">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200/70">
          <h3 className="font-semibold">基础信息</h3>
          <div className="mt-5 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50 text-6xl ring-1 ring-neutral-100">{draft.emoji}</div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {EMOJIS.map(emoji => <button key={emoji} onClick={() => set('emoji', emoji)} className={`flex h-8 w-8 items-center justify-center rounded-lg border ${draft.emoji === emoji ? 'border-orange-300 bg-orange-50' : 'border-neutral-200'}`}>{emoji}</button>)}
              </div>
              <div className="mt-3 flex gap-1.5">
                {TONES.map(tone => <button key={tone} onClick={() => set('tone', tone)} className={`h-5 w-5 rounded-full ${tone === 'amber' ? 'bg-amber-300' : tone === 'slate' ? 'bg-slate-400' : tone === 'violet' ? 'bg-violet-400' : tone === 'rose' ? 'bg-rose-400' : tone === 'green' ? 'bg-emerald-400' : 'bg-neutral-400'} ${draft.tone === tone ? 'ring-2 ring-orange-300 ring-offset-2' : ''}`} />)}
              </div>
            </div>
            <div className="space-y-4"><label className="block"><span className="mb-1.5 block text-[12px] text-neutral-500">名称</span><Input value={draft.name} onChange={event => set('name', event.target.value)} maxLength={30} /></label><label className="block"><span className="mb-1.5 block text-[12px] text-neutral-500">简介</span><Textarea value={draft.desc} onChange={event => set('desc', event.target.value)} rows="4" className="resize-none" /></label></div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200/70">
          <h3 className="font-semibold">可见权限</h3>
          <p className="mt-1 text-[12px] text-neutral-400">权限设置与信息源保持一致。</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Object.entries(scopeConfig).map(([key, cfg]) => (
              <button key={key} onClick={() => set('scope', key)}
                className={`rounded-xl border p-3.5 text-left transition ${draft.scope === key ? cfg.selected : 'border-neutral-200 hover:border-neutral-300'}`}>
                <i className={`${cfg.icon} text-xl ${draft.scope === key ? cfg.color : 'text-neutral-400'}`} />
                <div className="mt-2 text-sm font-semibold">{cfg.label}</div>
                <div className="mt-1 text-[11px] text-neutral-500">{cfg.desc}</div>
              </button>
            ))}
          </div>
          {draft.scope === 'partial' && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="text-[12px] font-medium text-neutral-600">可见人员 / 部门</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {draft.visibleTargets.map(item => (
                  <span key={item.id} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] ring-1 ring-blue-100">
                    <i className={item.type === 'dept' ? 'ri-building-2-line' : 'ri-user-line'} />
                    {item.name}
                    <button onClick={() => set('visibleTargets', draft.visibleTargets.filter(target => target.id !== item.id))}><i className="ri-close-line" /></button>
                  </span>
                ))}
              </div>
              <Input className="mt-3" value={orgQuery} onChange={event => setOrgQuery(event.target.value)} placeholder="搜索部门或成员" />
              {suggestions.length > 0 && (
                <div className="mt-2 overflow-hidden rounded-xl bg-white ring-1 ring-blue-100">
                  {suggestions.map(item => (
                    <button key={item.id} onClick={() => addVisibleTarget(item)}
                      className="flex w-full items-center gap-2 border-b border-blue-50 px-3 py-2 text-left text-sm last:border-0 hover:bg-blue-50">
                      <i className={item.type === 'dept' ? 'ri-building-2-line text-blue-500' : 'ri-user-line text-neutral-400'} />
                      <span>{item.name}</span>
                      <span className="ml-auto text-[11px] text-neutral-400">{item.detail}</span>
                    </button>
                  ))}
                </div>
              )}
              {draft.visibleTargets.length === 0 && <div className="mt-2 text-[11px] text-rose-500">部分可见至少需要选择一个部门或成员</div>}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200/70">
          <div className="flex items-start justify-between"><div><h3 className="font-semibold">关联信息源</h3><p className="mt-1 text-[12px] text-neutral-400">默认关联全部公共信息源，可添加其他你有权访问的信息源。</p></div><span className="text-[12px] text-neutral-400">已选 {draft.sourceIds.length}</span></div>
          <div className="mt-4 divide-y divide-neutral-100 overflow-hidden rounded-2xl ring-1 ring-neutral-200/70">{INFO_SOURCE_OPTIONS.map(source => <button key={source.id} disabled={!source.available} onClick={() => toggleSource(source)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${source.available ? 'hover:bg-neutral-50' : 'cursor-not-allowed opacity-45'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded border ${draft.sourceIds.includes(source.id) ? 'border-orange-500 bg-orange-500 text-white' : 'border-neutral-300'}`}>{draft.sourceIds.includes(source.id) && <i className="ri-check-line text-sm" />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{source.name}</span><span className="mt-0.5 block text-[11px] text-neutral-400">{source.owner}</span></span><ScopeBadge scope={source.scope} />{!source.available && <span className="text-[10px] text-rose-500">无访问权限</span>}
          </button>)}</div>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200/70">
          <button onClick={() => setAdvanced(value => !value)} className="flex w-full items-center justify-between text-left"><span><span className="block font-semibold">高级设置</span><span className="mt-1 block text-[12px] text-neutral-400">查看或修改助手提示词</span></span><i className={`${advanced ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-xl text-neutral-400`} /></button>
          {advanced && <div className="mt-4"><Textarea value={draft.prompt} onChange={event => { set('prompt', event.target.value); setImproved(''); }} rows="8" className="resize-none" />{improved && <div className="mt-3 rounded-xl bg-orange-50 p-3 text-[12px] leading-relaxed text-neutral-700">{improved}<div className="mt-2 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setImproved('')}>取消</Button><Button size="sm" onClick={() => { set('prompt', improved); setImproved(''); }}>采用</Button></div></div>}<div className="mt-3 flex justify-end"><Button variant="outline" size="sm" disabled={!draft.prompt.trim()} onClick={() => setImproved(improvePrompt(draft.prompt))}><i className="ri-sparkling-line" />一键完善</Button></div></div>}
        </section>

        <div className="flex justify-end gap-3 pb-8"><Button variant="outline" onClick={onBack}>取消</Button><Button disabled={!valid} onClick={() => onSave(draft)}>保存修改</Button></div>
      </div>
    </div>
  </div>;
}
