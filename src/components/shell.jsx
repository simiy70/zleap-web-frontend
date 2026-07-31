import React from 'react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';

/* ── 页面外壳：高科技渐变底 + 光斑；variant 切换网点光晕背景 ── */
const shellVariants = {
  default: 'app-bg',
  desktop: 'app-bg-desktop', // 底部橙色光弧 + 半调网点
  feed: 'app-bg-feed',       // 右上蓝光 + 左侧暖黄 + 半调网点
};

export function PageShell({ className, variant = 'default', children }) {
  return <div className={cn(shellVariants[variant] || shellVariants.default, 'min-h-screen text-foreground', className)}>{children}</div>;
}

/* ── 顶栏（磨玻璃、吸顶） ── */
export function GlassHeader({ user = 'Zhang Wei' }) {
  return <header className="glass-strong sticky top-0 z-50 flex h-14 items-center justify-between border-x-0 border-t-0 px-6">
    <div className="flex items-center gap-2.5">
      <span className="text-xl font-bold tracking-tight">zleap</span>
      <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border/60">Beta</span>
    </div>
    <div className="flex items-center gap-4 text-[20px] text-muted-foreground">
      <button className="transition hover:text-foreground" title="语言" aria-label="语言"><i className="ri-translate-2" /></button>
      <button className="transition hover:text-foreground" title="帮助" aria-label="帮助"><i className="ri-question-line" /></button>
      <button className="relative transition hover:text-foreground" title="通知" aria-label="通知"><i className="ri-notification-3-line" /><span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-rose-500" /></button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="group ml-1 flex max-w-[190px] items-center gap-2.5 rounded-xl px-1.5 py-1 transition hover:bg-white/60" aria-label="打开个人中心">
            <Avatar className="h-8 w-8"><AvatarFallback>{user.slice(0, 1)}</AvatarFallback></Avatar>
            <span className="hidden max-w-[112px] truncate text-sm font-medium text-foreground sm:block">{user}</span>
            <i className="ri-arrow-down-s-line text-base transition-transform group-aria-expanded:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[320px] overflow-hidden rounded-2xl !bg-white p-0 backdrop-blur-xl" align="end">
          <div className="flex flex-col items-center px-6 pb-5 pt-7 text-center">
            <Avatar className="h-20 w-20 shadow-lg"><AvatarFallback className="text-2xl">{user.slice(0, 1)}</AvatarFallback></Avatar>
            <div className="mt-4 flex max-w-full items-start justify-center gap-2">
              <div className="line-clamp-2 text-[17px] font-semibold leading-6 text-foreground">{user}</div>
              <button className="mt-0.5 shrink-0 text-lg text-muted-foreground transition hover:text-foreground" title="编辑个人资料" aria-label="编辑个人资料"><i className="ri-pencil-line" /></button>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">13122226666</div>
          </div>
          <div className="px-3 pb-3">
            <DropdownMenuItem className="h-11 text-[15px]"><i className="ri-settings-3-line text-xl" />账号设置</DropdownMenuItem>
            <DropdownMenuItem className="h-11 text-[15px]"><i className="ri-user-add-line text-xl" />邀请好友</DropdownMenuItem>
            <DropdownMenuItem className="h-11 text-[15px]"><i className="ri-download-2-line text-xl" />下载 Zleap APP</DropdownMenuItem>
            <DropdownMenuItem className="h-11 text-[15px]"><i className="ri-shield-keyhole-line text-xl" />MCP 授权管理</DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="h-11 text-[15px]"><i className="ri-logout-box-r-line text-xl" />退出登录</DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>;
}

/* ── 卡片网格中的「新建」虚线卡片（信息源/Agent/项目统一样式） ── */
export function NewItemCard({ label, onClick, className }) {
  return <button onClick={onClick}
    className={cn('group flex min-h-[168px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/90 bg-white/40 text-muted-foreground/50 backdrop-blur transition-all hover:border-orange-300 hover:bg-orange-50/30 hover:text-orange-400', className)}>
    <i className="ri-add-line text-[42px] font-light leading-none" />
    <span className="mt-3 text-sm font-medium transition-colors group-hover:text-orange-500">{label}</span>
  </button>;
}

/* ── 卡片视图分页器（信息源/Agent/项目统一样式） ── */
export function CardPagination({ page, totalPages, totalItems, onPageChange, className }) {
  const safeTotalPages = Math.max(1, totalPages);
  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

  return <div className={cn('flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/5 pt-4', className)}>
    <span className="text-xs text-muted-foreground">共 {totalItems} 条</span>
    <div className="flex items-center gap-1.5" aria-label="分页">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 text-muted-foreground ring-1 ring-border/60 transition hover:bg-white hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="上一页"><i className="ri-arrow-left-s-line text-lg" /></button>
      {pages.map(pageNumber => <button type="button" key={pageNumber} onClick={() => onPageChange(pageNumber)}
        className={cn('flex h-8 min-w-8 items-center justify-center rounded-xl px-2 text-xs font-medium transition', pageNumber === page ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-white/60 text-muted-foreground ring-1 ring-border/60 hover:bg-white hover:text-foreground')}
        aria-current={pageNumber === page ? 'page' : undefined}>{pageNumber}</button>)}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= safeTotalPages}
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 text-muted-foreground ring-1 ring-border/60 transition hover:bg-white hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="下一页"><i className="ri-arrow-right-s-line text-lg" /></button>
    </div>
  </div>;
}

/* ── 底部 Dock（磨玻璃）：按「管理 ｜ 消费」分组 ── */
const dockGroups = [
  [ /* 管理 */
    ['desktop', '桌面', 'ri-home-5-line', 'bg-orange-100', 'text-orange-500'],
    ['sources', '信息源', 'ri-database-2-line', 'bg-violet-100', 'text-violet-600'],
    ['agents', 'Agent', 'ri-chat-smile-2-line', 'bg-emerald-100', 'text-emerald-600'],
    ['projects', '项目', 'ri-folder-shield-2-line', 'bg-blue-100', 'text-blue-600'],
    ['members', '成员管理', 'ri-team-line', 'bg-cyan-100', 'text-cyan-600'],
  ],
  [ /* 消费 */
    ['feed', '动态', 'ri-rss-line', 'bg-rose-100', 'text-rose-500'],
  ],
];

export function GlassDock({ active, onNavigate }) {
  return <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center">
    <nav className="glass pointer-events-auto flex items-center gap-1 rounded-3xl px-3 py-2.5 shadow-xl shadow-slate-900/10">
      {dockGroups.map((items, gi) => <React.Fragment key={gi}>
        {gi > 0 && <div className="mx-1.5 h-9 w-px self-center rounded-full bg-slate-900/10" aria-hidden="true" />}
        {items.map(([id, label, icon, bg, color]) => <button key={id} onClick={() => onNavigate?.(id)} aria-label={label}
          className={cn('group relative flex h-12 w-12 items-center justify-center rounded-2xl transition', id === active ? 'bg-white/80' : 'hover:bg-white/50')}>
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-[13px] text-[22px] transition-transform group-hover:scale-[1.06] group-active:scale-95', bg, color)}><i className={icon} /></span>
          <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-medium leading-none text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {label}
          </span>
        </button>)}
      </React.Fragment>)}
    </nav>
  </div>;
}
