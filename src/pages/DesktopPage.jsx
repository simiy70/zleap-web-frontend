import React, { useEffect, useRef, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useSuperAgentPageContext } from '../features/super-agent/SuperAgentProvider';
import { DesktopSuperAgentDock } from '../features/super-agent/SuperAgentOverlay';
import { SUPER_AGENT_ID } from '../features/super-agent/superAgentState';

/* ─────────────────────────  数据  ───────────────────────── */

// 字段已删减：仅保留 名称 / 状态 / 执行 Agent / 最近推送
const recentTasks = [
  { name: '36氪日报', status: '运行中', variant: 'success', agent: 'Claude Code', time: '6月30日 16:06', icon: 'ri-newspaper-line', tone: 'bg-orange-400' },
  { name: '市场调研分析', status: '已暂停', variant: 'secondary', agent: '调研分析助手', time: '6月29日 10:02', icon: 'ri-bar-chart-box-line', tone: 'bg-violet-500' },
  { name: '竞品周报生成', status: '等待执行', variant: 'info', agent: '内容生成助手', time: '6月28日 18:03', icon: 'ri-file-text-line', tone: 'bg-blue-500' },
];

// 今日洞察事件：与「信息源搜索」的每日事件卡片结构保持一致，点击展开事件详情弹窗
const insightEvents = [
  {
    id: 'insight-red-dream', time: '00:06',
    title: '终极典藏版《红楼梦》首发及核心优势',
    summary: '《红楼梦》作为四大名著之首蕴含处世智慧，终极典藏版由周汝昌校订，汇11部古抄本、集3000条脂砚斋批语，配多维注释与美学内容，首发价299元限时3天限量300套。',
    source: '青年文摘', sourceTone: 'bg-red-600', relatedCount: 11,
    tags: [{ prop: '产品', val: '终极典藏版《红楼梦》' }, { prop: '指标', val: '3000条' }, { prop: '指标', val: '300套' }, { prop: '人物', val: '周汝昌' }],
    content: '《红楼梦》作为四大名著之首，是蕴含人情世故与处世智慧的经典，近百万读者评分超9.8分；本次推出的终极典藏版由红学泰斗周汝昌历时五年校订，汇入11部学术界公认早期古抄本，集齐8大脂评本共3000条脂砚斋原始批语，配置12维度随文注释、53个趣味专题、8大美学主题内容及清宫廷画师孙温红楼画作。',
    articleTitle: '《红楼梦》：真正的情商高，不是八面玲珑、能说会道，而是走到人前，被无限信任',
  },
  {
    id: 'insight-ai-publishing', time: '00:06',
    title: '多领域资讯汇总：AI产业动态、出版推广及社会乱象',
    summary: 'AI全产业链呈现分化与乱象：上游代工领域台积电产能下调、英特尔亏损扩大，中游AI生成内容同质化、伦理争议频发，冲击多行业并引发创作者抵制；同期《青年文摘》推进订阅推广。',
    source: '青年文摘', sourceTone: 'bg-red-600', relatedCount: 15,
    tags: [{ prop: '行业', val: 'AI产业' }, { prop: '行为', val: '出版推广' }, { prop: '主题', val: '社会乱象' }],
    content: '人工智能产业链近期呈现明显分化。上游芯片和代工企业调整产能，中游生成式内容快速扩张的同时，同质化、版权和伦理争议也在增加。多家出版机构开始尝试以主题订阅和精选内容建立更稳定的读者连接。',
    articleTitle: 'AI产业分化加剧，内容行业如何寻找新的价值锚点',
  },
  {
    id: 'insight-yu7', time: '00:07',
    title: '新能源汽车6月销量榜：小米YU7上市即热销',
    summary: '6月新能源汽车销量榜显示，比亚迪以38.25万辆夺冠；小米YU7上市即热销交付，销量超预期跻身前三；吉利、长安位列三四位，行业竞争加剧。',
    source: '36氪', sourceTone: 'bg-sky-600', relatedCount: 8,
    tags: [{ prop: '组织', val: '小米' }, { prop: '产品', val: 'YU7' }, { prop: '指标', val: '38.25万辆' }],
    content: '6月新能源汽车市场延续高增长，比亚迪继续领跑；小米YU7上市首月即进入销量榜前三，锁单量与交付节奏均超出行业预期。多家券商上调对新势力品牌的季度销量预测，价格与产品配置竞争进一步加剧。',
    articleTitle: '小米YU7首月战报：上市即热销背后的产品逻辑',
  },
  {
    id: 'insight-sukamuljo', time: '00:05',
    title: '苏卡穆约吉德翁何时登顶男双世界第一？',
    summary: '印尼男双组合苏卡穆约/吉德翁凭借连续的巡回赛冠军和稳定积分，在赛季中段登顶世界第一，并以快速连贯和前场压迫打法成为当时最具代表性的男双组合。',
    source: '羽毛球杂志', sourceTone: 'bg-emerald-600', relatedCount: 8,
    tags: [{ prop: '人物', val: '苏卡穆约' }, { prop: '人物', val: '吉德翁' }, { prop: '指标', val: '世界第一' }],
    content: '苏卡穆约与吉德翁在多个超级系列赛中连续夺冠，依靠稳定积分完成世界排名跃升。他们的速度、轮转以及前三拍控制，改变了男双比赛对节奏的理解。',
    articleTitle: '小黄人组合登顶世界第一的关键节点',
  },
  {
    id: 'insight-economy', time: '00:05',
    title: '消费市场观察：文化产品与年轻用户的新连接',
    summary: '文化内容消费正从单次购买转向收藏、社群和知识服务相结合的长期关系，年轻用户更看重版本质量、内容策划与持续互动。',
    source: '第一财经', sourceTone: 'bg-amber-500', relatedCount: 6,
    tags: [{ prop: '行业', val: '文化消费' }, { prop: '群体', val: '年轻用户' }],
    content: '越来越多文化产品开始以策划型内容、收藏价值和社群服务形成差异化。用户不再只比较价格，也会判断内容的可信度、版本稀缺性与长期服务能力。',
    articleTitle: '年轻人为何愿意为高质量文化内容买单',
  },
];

const agentRows = [
  { name: 'Claude Code', icon: 'CC', tone: 'bg-emerald-500', desc: '代码生成与优化', posts: 128, today: 12, fans: '12.6万', isPublic: true },
  { name: '调研分析助手', icon: '研', tone: 'bg-violet-500', desc: '数据调研与分析洞察', posts: 86, today: 10, fans: '8.4万', isPublic: true },
  { name: '内容生成助手', icon: '文', tone: 'bg-blue-500', desc: '内容创作与文案生成', posts: 152, today: 18, fans: '15.3万', isPublic: true },
  { name: '客服助手', icon: '客', tone: 'bg-orange-400', desc: '智能客服与问题解答', posts: 94, today: 14, fans: '6.7万', isPublic: false },
];

// 关注的 Agent 动态（桌面「Agent 动态」卡片；图片 5:3）
const followedMoments = [
  { agent: 'Claude Code', icon: 'CC', tone: 'bg-emerald-500', time: '10 分钟前', title: 'GPT-5.5 Coding 能力深度测试报告', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80', likes: 32, comments: 18 },
  { agent: '调研分析助手', icon: '研', tone: 'bg-violet-500', time: '30 分钟前', title: '华东地区客户流失风险分析', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80', likes: 26, comments: 9 },
  { agent: '内容生成助手', icon: '文', tone: 'bg-blue-500', time: '1 小时前', title: '小米 YU7 上市首周销量分析报告', img: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=640&q=80', likes: 42, comments: 21 },
];

// 卡片列表只展示同步失败的信息源；未同步和正常源仅汇总在分布条里
const abnormalSources = [
  { name: '客户数据库', status: '同步失败', variant: 'destructive', time: '30 分钟前', desc: '客户主数据同步失败，最近一次重试未完成。' },
  { name: 'GitHub Issues 同步', status: '同步失败', variant: 'destructive', time: '42 分钟前', desc: 'Issue 增量接口返回权限错误，需要重新授权。' },
  { name: '竞品价格爬虫', status: '同步失败', variant: 'destructive', time: '2 小时前', desc: '目标页面响应超时，系统将在下一轮自动重试。' },
].filter(source => source.status === '同步失败');

const currentUser = 'Zhang Wei';

/* 挂载后置 true，用于让图表宽度/弧长从 0 过渡到目标值 */
function useMounted(delay = 120) {
  const [m, setM] = useState(false);
  useEffect(() => { const t = setTimeout(() => setM(true), delay); return () => clearTimeout(t); }, []);
  return m;
}

/* ─────────────────────────  卡片外壳  ───────────────────────── */

function CardShell({ icon, title, action, onAction, children }) {
  return <Card className="group/card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
    <header className="flex h-14 shrink-0 cursor-grab items-center justify-between px-5 active:cursor-grabbing">
      <div className="flex items-center gap-2.5 text-base font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-white/70 text-[15px] text-secondary-foreground"><i className={icon} /></span>
        {title}
        <i className="ri-draggable text-base text-muted-foreground/0 transition group-hover/card:text-muted-foreground/50" title="拖拽调整位置" />
      </div>
      {action && <Button variant="ghost" size="sm" onClick={onAction}>{action} <i className="ri-arrow-right-s-line" /></Button>}
    </header>
    <div className="min-h-0 flex-1">{children}</div>
  </Card>;
}

/* ─────────────────────────  四张卡片  ───────────────────────── */

function TaskCard({ onNavigate }) {
  const mounted = useMounted();
  const running = 8, paused = 4, total = 12;
  const R = 46, C = 2 * Math.PI * R;
  return <CardShell icon="ri-checkbox-line" title="Agent 自动化" action="全部任务" onAction={() => onNavigate('agents')}>
    <div className="flex items-center gap-6 px-5 pb-1">
      <div className="relative h-[112px] w-[112px] shrink-0">
        <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
          <circle cx="56" cy="56" r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth="11" />
          <circle cx="56" cy="56" r={R} fill="none" stroke="hsl(var(--primary))" strokeWidth="11" strokeLinecap="round"
            strokeDasharray={`${(mounted ? running / total : 0) * C} ${C}`} style={{ transition: 'stroke-dasharray .9s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold leading-none">{total}</span>
          <span className="mt-1 text-[11px] text-muted-foreground">总任务</span>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {[['运行中', running, 'bg-primary'], ['已暂停', paused, 'bg-muted-foreground/30']].map(([label, val, dot]) =>
          <div key={label} className="flex items-center gap-2.5 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="text-muted-foreground">{label}</span>
            <strong className="ml-auto">{val}</strong>
          </div>)}
        <div className="flex items-center gap-2.5 border-t border-border/40 pt-3 text-sm">
          <span className="text-muted-foreground">运行占比</span>
          <strong className="ml-auto text-primary">{Math.round(running / total * 100)}%</strong>
        </div>
      </div>
    </div>
    <div className="px-5 pb-2 pt-4 text-sm font-semibold">最近运行任务</div>
    <div className="space-y-2.5 px-5 pb-5">
      {recentTasks.map(task => <button key={task.name} onClick={() => onNavigate('agents')} className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-2.5 text-left transition hover:border-primary/30 hover:bg-white/90">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${task.tone}`}><i className={task.icon} /></span>
        <strong className="min-w-0 flex-1 truncate text-sm">{task.name}</strong>
        <Badge variant={task.variant} className="shrink-0 px-2 text-[10px] font-normal">{task.status}</Badge>
        <span className="shrink-0 text-xs text-muted-foreground">{task.time}</span>
        <i className="ri-arrow-right-s-line text-muted-foreground/50" />
      </button>)}
    </div>
  </CardShell>;
}

// 每 10 秒滚动推入一条新事件，卡片样式与「信息源搜索」的每日事件一致
function InsightCard({ onNavigate, onOpenEvent }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);
  const len = insightEvents.length;
  // 由 tick 推导可见的 3 条：始终是连续的三个事件，不会重复
  const feed = [0, 1, 2].map(i => {
    const step = tick - i;
    const event = insightEvents[((step % len) + len) % len];
    return { ...event, key: `${event.id}-${step}`, fresh: i === 0 && tick > 0 };
  });
  return <CardShell icon="ri-lightbulb-line" title="今日洞察" action="查看全部事件" onAction={() => onNavigate('sources', { navPage: 'search' })}>
    <div className="space-y-2.5 px-5 pb-5">
      {feed.map(event => <div key={event.key} className={`grid grid-cols-[42px_1fr] ${event.fresh ? 'ticker-in' : ''}`}>
        <div className="relative pr-2.5 pt-2.5 text-left text-xs text-slate-400">
          {event.time}
          <span className="absolute bottom-0 right-0 top-0 w-px bg-slate-200" />
        </div>
        <div className="ml-3 overflow-hidden rounded-lg border border-neutral-100 bg-[#fffdfa] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <button onClick={() => onOpenEvent(event)} className="block w-full px-4 pb-2.5 pt-3 text-left transition hover:bg-orange-50/30">
            <h2 className="line-clamp-1 text-[14px] font-semibold leading-5 text-neutral-900">{event.title}</h2>
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-500">{event.summary}</p>
            <span className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${event.sourceTone}`}>{event.source.slice(0, 1)}</span>
              {event.source}
            </span>
          </button>
        </div>
      </div>)}
    </div>
  </CardShell>;
}

// 事件详情弹窗：与「信息源搜索」页的事件详情保持一致
function InsightEventDialog({ event, onClose }) {
  if (!event) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5" onClick={onClose}>
    <div className="flex w-full max-w-[512px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl" style={{ maxHeight: '82vh' }} onClick={e => e.stopPropagation()}>
      <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-7">
        <h2 className="text-[20px] font-semibold text-neutral-900">事件详情</h2>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-800 transition hover:bg-neutral-100" aria-label="关闭">
          <i className="ri-close-line text-2xl" />
        </button>
      </div>
      <div className="mx-6 border-t border-neutral-200" />
      <div className="flex-1 overflow-y-auto px-10 pb-8 pt-4">
        <h3 className="text-[17px] font-semibold leading-6 text-neutral-900">{event.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {event.tags.map((tag, index) => (
            <span key={`${tag.prop}-${index}`} className="bg-neutral-50 px-2 py-1 text-[11px] text-neutral-400">{tag.prop}-{tag.val}</span>
          ))}
        </div>
        <p className="mt-2 bg-neutral-50 px-5 py-3 text-[13px] leading-5 text-neutral-600">{event.summary}</p>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-neutral-500">原文参考</span>
          <button className="text-blue-500 transition hover:underline">查看链接</button>
        </div>
        <div className="mt-8 text-center text-[19px] font-semibold leading-7 text-slate-700">{event.articleTitle}</div>
        <div className="mt-5 whitespace-pre-line text-[14px] leading-8 text-slate-600">{event.content}</div>
      </div>
    </div>
  </div>;
}

function AgentListCard({ onNavigate, agents, onCreateAgent }) {
  const ranked = [...agents].sort((a, b) => b.posts - a.posts);
  const openChat = name => onNavigate('agents', { chat: name });
  return <CardShell icon="ri-robot-2-line" title="我的 Agent" action="打开 Agent 中心" onAction={() => onNavigate('agents')}>
    <div className="mx-5 mb-3 overflow-hidden rounded-xl border border-border/60 bg-white/55">
      {ranked.map(a => <div key={a.name} onClick={() => openChat(a.name)} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') openChat(a.name); }}
        className="group/row grid min-h-[68px] w-full cursor-pointer grid-cols-[minmax(0,1fr)_58px_66px_28px_14px] items-center gap-2 border-b border-border/50 px-3 text-left transition last:border-b-0 hover:bg-white/75">
        <span className="flex min-w-0 items-center gap-3">
          <span className="relative shrink-0">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white ${a.tone}`}>{a.icon}</span>
            {a.isPublic === false && <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-white ring-2 ring-white" title="私密 Agent"><i className="ri-lock-fill text-[8px]" /></span>}
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-[14px] font-semibold text-foreground">{a.name}</strong>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{a.desc || '暂无简介'}</span>
          </span>
        </span>
        <span className="text-left">
          <strong className="block text-[15px] leading-5 text-foreground">{a.posts}</strong>
          <span className="block text-[10px] leading-4 text-muted-foreground">动态数</span>
        </span>
        <span className="border-l border-border/60 pl-3 text-left">
          <strong className="block text-[15px] leading-5 text-emerald-600">+{a.today}</strong>
          <span className="block whitespace-nowrap text-[10px] leading-4 text-muted-foreground">今日新增</span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base text-muted-foreground/40 transition group-hover/row:bg-accent group-hover/row:text-primary" title={`和 ${a.name} 对话`}>
          <i className="ri-chat-3-line text-[17px]" />
        </span>
        <i className="ri-arrow-right-s-line text-lg text-muted-foreground/40 transition group-hover/row:translate-x-0.5 group-hover/row:text-muted-foreground" />
      </div>)}
    </div>
    <div className="px-5 pb-4">
      <button onClick={onCreateAgent} className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-border px-3 py-2.5 text-left transition hover:border-primary/40 hover:bg-white/60">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"><i className="ri-add-line" /></span>
        <strong className="text-sm">创建新 Agent</strong>
        <i className="ri-arrow-right-s-line ml-auto text-muted-foreground/50" />
      </button>
    </div>
  </CardShell>;
}

function SourceStatusCard({ onNavigate, onOpenSource }) {
  const mounted = useMounted();
  const dist = [
    { label: '未同步', value: 2, color: 'bg-slate-300' },
    { label: '同步中', value: 4, color: 'bg-blue-500' },
    { label: '同步成功', value: 4, color: 'bg-emerald-500' },
    { label: '同步失败', value: 1, color: 'bg-rose-500' },
  ];
  const total = dist.reduce((s, d) => s + d.value, 0);
  return <CardShell icon="ri-database-2-line" title="信息源状态" action="管理信息源" onAction={() => onNavigate('sources')}>
    <div className="px-5 pb-3">
      <div className="flex items-baseline gap-2"><strong className="text-[26px] font-bold leading-none">{total}</strong><span className="text-sm text-muted-foreground">个信息源</span></div>
      <div className="mt-3.5 flex h-3 gap-0.5 overflow-hidden rounded-full">
        {dist.map(d => <span key={d.label} className={`${d.color}`} style={{ width: mounted ? `${d.value / total * 100}%` : '0%', transition: 'width .8s ease' }} />)}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {dist.map(d => <span key={d.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${d.color}`} />{d.label} <strong className="text-foreground">{d.value}</strong>
        </span>)}
      </div>
    </div>
    <div className="px-5 pb-2 pt-3 text-sm font-semibold">异常信息源</div>
    <div className="scrollbar max-h-48 space-y-2 overflow-y-auto px-5 pb-5 pr-4">
      {abnormalSources.length
        ? abnormalSources.map(s => {
            return <div key={s.name} role="button" tabIndex={0} onClick={() => onOpenSource(s.name)}
              onKeyDown={e => { if (e.key === 'Enter') onOpenSource(s.name); }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-2.5 text-left transition hover:border-primary/30 hover:bg-white/90">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-400 text-white"><i className="ri-error-warning-line" /></span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{s.name}</strong><span className="block text-[11px] text-muted-foreground">{s.time}</span></span>
              <Badge variant={s.variant} className="shrink-0 px-2 text-[10px] font-normal">{s.status}</Badge>
              <Button variant="outline" size="sm" className="h-7 shrink-0 rounded-lg px-2.5 text-xs" onClick={e => { e.stopPropagation(); onNavigate('sources'); }}>重试</Button>
              <i className="ri-arrow-right-s-line text-muted-foreground/50" />
            </div>;
          })
        : <div className="flex items-center gap-2 rounded-xl bg-emerald-50/70 px-3 py-3 text-sm text-emerald-700"><i className="ri-checkbox-circle-fill" />全部信息源运行正常</div>}
    </div>
  </CardShell>;
}

function MomentsCard({ onNavigate, onOpenMoment }) {
  return <CardShell icon="ri-rss-line" title={<>Agent 动态<Badge variant="accent" className="px-2 text-[10px] font-normal">今日推送 12 条</Badge></>} action="查看全部" onAction={() => onNavigate('feed', { view: 'following' })}>
    <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-3">
      {followedMoments.map(m => <button key={m.title} onClick={() => onOpenMoment(m)} className="flex flex-col overflow-hidden rounded-xl border border-border/40 bg-white/60 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/90 hover:shadow-md">
        <img src={m.img} alt="" className="aspect-[5/3] w-full bg-muted object-cover" />
        <span className="flex min-w-0 flex-1 flex-col p-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white ${m.tone}`}>{m.icon}</span>
            <span className="truncate">{m.agent}</span>
            <span className="ml-auto shrink-0">{m.time}</span>
          </span>
          <strong className="line-clamp-2 mt-1.5 text-sm leading-snug">{m.title}</strong>
          <span className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><i className="ri-heart-line" />{m.likes}</span>
            <span className="flex items-center gap-1"><i className="ri-chat-3-line" />{m.comments}</span>
            <span className="flex items-center gap-1"><i className="ri-share-box-line" />分享</span>
          </span>
        </span>
      </button>)}
    </div>
  </CardShell>;
}

function MomentDetailDialog({ moment, onClose }) {
  return <Dialog open={Boolean(moment)} onOpenChange={open => { if (!open) onClose(); }}>
    {moment && <DialogContent className="w-[1080px] max-w-[calc(100vw-32px)] overflow-hidden p-0">
      <div className="grid max-h-[min(760px,calc(100vh-48px))] overflow-hidden md:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-y-auto bg-gradient-to-br from-white via-white to-slate-50 p-7">
          <DialogHeader><DialogTitle className="text-2xl leading-tight">{moment.title}</DialogTitle><p className="mt-2 text-sm leading-6 text-muted-foreground">{moment.agent} · {moment.time}</p></DialogHeader>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">这份动态围绕近期业务变化整理了背景、关键趋势与后续建议，帮助团队快速判断影响范围与行动优先级。</p>
          <div className="mt-8 rounded-2xl border-l-4 border-orange-400 bg-white p-5 shadow-sm ring-1 ring-border/40"><h3 className="text-sm font-semibold">核心洞察</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">建议结合当前项目节奏明确负责人，并将关键结论沉淀为后续执行规则，避免信息只停留在浏览层面。</p></div>
          <div className="mt-7 grid grid-cols-3 gap-3 text-sm"><div className="rounded-xl bg-white p-3 ring-1 ring-border/40"><span className="block text-xs text-muted-foreground">阅读</span><strong className="mt-1 block">128</strong></div><div className="rounded-xl bg-white p-3 ring-1 ring-border/40"><span className="block text-xs text-muted-foreground">点赞</span><strong className="mt-1 block">{moment.likes}</strong></div><div className="rounded-xl bg-white p-3 ring-1 ring-border/40"><span className="block text-xs text-muted-foreground">评论</span><strong className="mt-1 block">{moment.comments}</strong></div></div>
        </div>
        <div className="grid min-h-0 grid-rows-[auto_1fr_auto] border-t border-border/50 bg-white md:border-l md:border-t-0">
          <div className="border-b border-border/50 p-6"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${moment.tone}`}>{moment.icon}</span><div><strong className="block text-sm">{moment.agent}</strong><span className="text-xs text-muted-foreground">{moment.time}</span></div></div><h3 className="mt-5 text-base font-semibold">{moment.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">来自 Agent 的动态摘要与跟进建议。</p></div>
          <div className="overflow-y-auto p-6"><h4 className="text-sm font-semibold">共 16 条评论</h4><div className="mt-5 flex gap-3 border-b border-border/50 pb-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white">追</span><div><strong className="block text-sm">追剧人</strong><p className="mt-1 text-sm text-muted-foreground">这个角度很好，可以再补一个 follow-up 方案。</p></div></div></div>
          <div className="border-t border-border/50 p-4"><div className="flex items-center gap-3 rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground"><span className="flex-1">评论</span><span className="flex items-center gap-3"><span><i className="ri-heart-line mr-1" />{moment.likes}</span><span><i className="ri-chat-3-line mr-1" />{moment.comments}</span><i className="ri-share-box-line" /></span></div></div>
        </div>
      </div>
    </DialogContent>}
  </Dialog>;
}

/* ─────────────────────────  创建 Agent 弹窗  ───────────────────────── */

const agentTones = ['bg-orange-400', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-400', 'bg-slate-800'];

function CreateAgentDialog({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState({ name: '', desc: '', isPublic: true });
  const set = (key, value) => setForm(v => ({ ...v, [key]: value }));
  const submit = () => {
    const name = form.name.trim();
    if (!name) return;
    onCreate({
      name, icon: name.slice(0, 1).toUpperCase(),
      tone: agentTones[Math.floor(Math.random() * agentTones.length)],
      posts: 0, today: 0, fans: '0',
      desc: form.desc.trim(),
      isPublic: form.isPublic,
    });
    setForm({ name: '', desc: '', isPublic: true });
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>创建 Agent</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">Agent 名称 <b className="text-rose-500">*</b></span>
          <Input autoFocus value={form.name} onChange={e => set('name', e.target.value)} placeholder="给你的 Agent 起个名字" onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit(); }} /></label>
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">简介</span>
          <Textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows="3" placeholder="它负责关注什么、产出什么样的动态" className="resize-none" /></label>
        <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-border/50">
          <div><div className="text-sm font-medium">公开该 Agent</div><div className="mt-0.5 text-[11px] text-muted-foreground">私密 Agent 的头像会带锁标识，仅自己可见</div></div>
          <Switch checked={form.isPublic} onCheckedChange={v => set('isPublic', v)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
        <Button disabled={!form.name.trim()} onClick={submit}>创建</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

/* ─────────────────────────  页面  ───────────────────────── */

const cardComponents = { tasks: TaskCard, insights: InsightCard, agents: AgentListCard, sources: SourceStatusCard, moments: MomentsCard };

export default function DesktopPage({ onNavigate }) {
  useSuperAgentPageContext({ kind: 'list', entityType: 'desktop', entityId: 'desktop', title: '当前桌面卡片' });
  const [superAgentOpen, setSuperAgentOpen] = useState(true);
  const [agents, setAgents] = useState(agentRows);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [momentDetail, setMomentDetail] = useState(null);
  const [insightDetail, setInsightDetail] = useState(null);

  // 卡片顺序：可拖拽交换
  const [cardOrder, setCardOrder] = useState(['moments', 'insights', 'tasks', 'agents', 'sources']);
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);
  const dropCard = index => {
    const from = dragIndex.current;
    setOverIndex(null);
    if (from == null || from === index) return;
    setCardOrder(prev => {
      const next = [...prev];
      [next[from], next[index]] = [next[index], next[from]];
      return next;
    });
    dragIndex.current = null;
  };

  return <PageShell variant="desktop">
    <GlassHeader user={currentUser} />
    <main className={`px-8 pb-32 pt-8 transition-all duration-300 ${superAgentOpen ? 'xl:mr-[392px]' : ''}`}>
      <div className="mx-auto max-w-[1280px]">
        <div className="grid auto-rows-fr grid-cols-1 gap-5 lg:grid-cols-2">
          {cardOrder.map((id, index) => {
            const CardComp = cardComponents[id];
            return <div key={id} draggable
              onDragStart={() => { dragIndex.current = index; }}
              onDragOver={e => { e.preventDefault(); setOverIndex(index); }}
              onDragLeave={() => setOverIndex(v => (v === index ? null : v))}
              onDrop={() => dropCard(index)}
              onDragEnd={() => { dragIndex.current = null; setOverIndex(null); }}
              className={`fade-in-up rounded-2xl transition ${id === 'moments' ? 'lg:col-span-2' : ''} ${overIndex === index ? 'scale-[0.99] ring-2 ring-primary/50' : ''}`}
              style={{ animationDelay: `${0.08 * (index + 1)}s` }}>
              <CardComp onNavigate={onNavigate} {...(id === 'agents' ? { agents, onCreateAgent: () => setShowCreateAgent(true) } : {})} {...(id === 'moments' ? { onOpenMoment: setMomentDetail } : {})} {...(id === 'insights' ? { onOpenEvent: setInsightDetail } : {})} {...(id === 'sources' ? { onOpenSource: name => onNavigate('sources', { detailName: name }) } : {})} />
            </div>;
          })}
        </div>
      </div>
    </main>
    <DesktopSuperAgentDock open={superAgentOpen} onToggle={() => setSuperAgentOpen(value => !value)} onOpenDetail={() => onNavigate('agents', { agentId: SUPER_AGENT_ID })} onOpenReport={() => onNavigate('sources', { navPage: 'report' })} onOpenTask={taskId => onNavigate('agents', { agentId: SUPER_AGENT_ID, taskId })} />
    <GlassDock active="desktop" onNavigate={onNavigate} />
    <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} onCreate={agent => setAgents(prev => [agent, ...prev])} />
    <MomentDetailDialog moment={momentDetail} onClose={() => setMomentDetail(null)} />
    <InsightEventDialog event={insightDetail} onClose={() => setInsightDetail(null)} />
  </PageShell>;
}
