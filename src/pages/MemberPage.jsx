import React, { useMemo, useState, useEffect } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { useSuperAgentPageContext } from '../features/super-agent/SuperAgentProvider';

/* ═══ 基础字典（对齐《企业权限管理系统需求文档》v1.9.0） ═══ */
const STATUS = {
  unactivated: { label: "未激活", variant: "info" },
  active:      { label: "正常",   variant: "success" },
  disabled:    { label: "停用",   variant: "outline" },
  resigned:    { label: "已离职", variant: "destructive" },
};
const SCOPES = { self: "仅个人数据", dept: "归属部门及子部门数据", enterprise: "全公司数据", custom: "自定义范围" };
const SCOPE_RANK = { self: 0, custom: 1, dept: 2, enterprise: 3 };
const LEVELS = { none: "无权限", read: "只读权限", edit: "编辑权限", manage: "管理权限" };
const LEVEL_RANK = { none: 0, read: 1, edit: 2, manage: 3 };
/* 信息/助手/任务为公共服务模块，不纳入成员功能权限配置；管理后台模块需显式授权 */
const MODULES = [
  { key: "member", name: "成员管理", desc: "花名册、部门管理、注册审核、异动记录", levels: ["none", "read", "edit", "manage"] },
  { key: "ops",    name: "运营管理", desc: "公告、通知、频道、报告模版等",         levels: ["none", "read", "edit", "manage"] },
  { key: "sys",    name: "系统管理", desc: "系统日志、配置管理",                   levels: ["none", "read", "manage"] },
];
const TPL_SYS = {
  admin:  { name: "管理员",   perms: { member: "manage", ops: "edit", sys: "read" } },
  member: { name: "普通成员", perms: { member: "none",   ops: "none", sys: "none" } },
};
const CHANGE_TYPES = ["成员基础信息变更", "部门调整", "账号状态变更", "操作离职", "数据权限调整", "功能权限调整"];
const OPERATOR = "Simiy";
const CURRENT_USER_ID = "ZL1003";
const NAV_TABS = [
  { id: "roster",  label: "花名册",   icon: "ri-team-line" },
  { id: "depts",   label: "部门管理", icon: "ri-node-tree" },
  { id: "review",  label: "注册审核", icon: "ri-file-list-3-line" },
  { id: "changes", label: "异动记录", icon: "ri-history-line" },
];

/* ═══ 工具 ═══ */
const nowStr = () => { const d = new Date(), p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const genPwd = () => {
  const L = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ", D = "23456789";
  let s = Array.from({ length: 6 }, () => L[Math.floor(Math.random() * L.length)]).join("") + Array.from({ length: 4 }, () => D[Math.floor(Math.random() * D.length)]).join("");
  return s.split("").sort(() => Math.random() - 0.5).join("");
};
const downloadCredentialFile = async members => {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  const headerStyle = { fontWeight: "bold", backgroundColor: "#FFF2E8", align: "center" };
  const sheetData = [
    ["成员 ID", "成员名称", "登录账号（电话 / 邮箱）", "归属部门", "初始密码"].map(value => ({ value, ...headerStyle })),
    ...members.map(m => [m.id, m.name, m.phone || m.email, m.deptName, m.initPwd]),
  ];
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const timestamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`;
  await writeExcelFile(sheetData, {
    columns: [{ width: 14 }, { width: 16 }, { width: 28 }, { width: 18 }, { width: 18 }],
  }).toFile(`成员初始密码_${timestamp}.xlsx`);
};
const validPhone = v => /^1\d{10}$/.test(v);
const validEmail = v => /^\S+@\S+\.\S+$/.test(v);
const flattenDeptTree = depts => {
  const options = [];
  const walk = (parentId, depth) => {
    depts.filter(d => d.parentId === parentId).forEach(dept => {
      options.push([dept.id, dept.name, depth, depts.some(d => d.parentId === dept.id)]);
      walk(dept.id, depth + 1);
    });
  };
  walk(null, 0);
  return options;
};
const filterDeptTreeOptions = (options, query) => {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return options;
  const visible = new Set();
  options.forEach((option, index) => {
    if (!String(option[1]).toLowerCase().includes(keyword)) return;
    visible.add(index);
    let targetDepth = option[2];
    for (let i = index - 1; i >= 0 && targetDepth > 0; i -= 1) {
      if (options[i][2] < targetDepth) {
        visible.add(i);
        targetDepth = options[i][2];
      }
    }
  });
  return options.filter((_, index) => visible.has(index));
};

/* ═══ 模拟数据 ═══ */
const initialDepts = [
  { id: 1, name: "智跃科技", parentId: null },
  { id: 2, name: "产品部",   parentId: 1 },
  { id: 3, name: "研发部",   parentId: 1 },
  { id: 4, name: "前端组",   parentId: 3 },
  { id: 5, name: "后端组",   parentId: 3 },
  { id: 6, name: "运营部",   parentId: 1 },
  { id: 7, name: "市场部",   parentId: 1 },
];

const initialMembers = [
  { id: "ZL1001", name: "Simiy",  deptId: 2, position: "产品负责人",  phone: "13122226666", email: "sumingyan70@gmail.com", status: "active",      joined: "2026-03-01 09:00", dataScope: "enterprise", scopeTags: [], funcTemplate: "admin",  funcPerms: { ...TPL_SYS.admin.perms },  assets: { 助手: 2, 任务: 4, 信息源: 6 }, avatar: "https://i.pravatar.cc/64?img=47" },
  { id: "ZL1002", name: "陈雨曦", deptId: 5, position: "后端负责人",  phone: "13811112222", email: "chenyuxi@zleap.ai",     status: "active",      joined: "2026-03-18 10:30", dataScope: "dept",       scopeTags: [], funcTemplate: null,     funcPerms: { member: "edit", ops: "read", sys: "none" }, assets: { 助手: 1, 任务: 3, 信息源: 2 }, avatar: "https://i.pravatar.cc/64?img=12" },
  { id: "ZL1003", name: "张伟",   deptId: 4, position: "前端工程师",  phone: "13733334444", email: "zhangwei@zleap.ai",     status: "active",      joined: "2026-04-02 14:00", dataScope: "self",       scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms }, assets: { 助手: 0, 任务: 2, 信息源: 3 }, avatar: "https://i.pravatar.cc/64?img=68" },
  { id: "ZL1004", name: "李思思", deptId: 6, position: "运营专员",    phone: "13655556666", email: "lisisi@zleap.ai",       status: "active",      joined: "2026-04-15 09:20", dataScope: "dept",       scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms }, assets: { 助手: 1, 任务: 1, 信息源: 4 }, avatar: "https://i.pravatar.cc/64?img=32" },
  { id: "ZL1005", name: "王浩然", deptId: 7, position: "市场经理",    phone: "13577778888", email: "wanghaoran@zleap.ai",   status: "disabled",    joined: "2026-05-06 11:00", dataScope: "self",       scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms }, assets: { 助手: 0, 任务: 1, 信息源: 1 }, avatar: "https://i.pravatar.cc/64?img=59" },
  { id: "ZL1006", name: "赵灵儿", deptId: 2, position: "产品实习生",  phone: "13499990000", email: "zhaolinger@zleap.ai",   status: "unactivated", joined: "2026-07-12 09:15", dataScope: "dept",       scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms }, assets: { 助手: 0, 任务: 0, 信息源: 0 }, initPwd: "Zk8m2x9nQ4", avatar: "https://i.pravatar.cc/64?img=5" },
  { id: "ZL1007", name: "周子墨", deptId: 5, position: "后端工程师",  phone: "13366667777", email: "zhouzimo@zleap.ai",     status: "resigned",    joined: "2026-03-20 16:40", dataScope: "self",       scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms }, assets: { 助手: 0, 任务: 0, 信息源: 0 }, avatar: "https://i.pravatar.cc/64?img=15" },
];

const initialRegs = [
  { id: 1, name: "林晓夏", phone: "13712345678", email: "linxiaoxia@example.com", reason: "新入职产品部，需要使用信息源与助手功能", appliedAt: "2026-07-14 10:23", status: "pending",  reviewer: "", reviewedAt: "", comment: "" },
  { id: 2, name: "高远",   phone: "",            email: "gaoyuan@example.com",    reason: "外部顾问，协助运营内容审核",             appliedAt: "2026-07-13 16:05", status: "pending",  reviewer: "", reviewedAt: "", comment: "" },
  { id: 3, name: "钱多多", phone: "13698765432", email: "",                       reason: "运营部新同事，需开通账号",               appliedAt: "2026-07-10 09:40", status: "approved", reviewer: "Simiy", reviewedAt: "2026-07-10 11:02", comment: "运营部新同事，已建号" },
  { id: 4, name: "孙一峰", phone: "13512340000", email: "sun@example.com",        reason: "想试用产品",                             appliedAt: "2026-07-08 14:11", status: "rejected", reviewer: "Simiy", reviewedAt: "2026-07-09 09:30", comment: "非企业内部成员" },
];
const REG_STATUS = { pending: { label: "待审核", variant: "info" }, approved: { label: "已通过", variant: "success" }, rejected: { label: "已驳回", variant: "destructive" } };

const initialChanges = [
  { id: 1, name: "赵灵儿", type: "账号状态变更",     date: "2026-07-12 09:15", operator: "Simiy",  before: "无", after: "账号状态：未激活\n姓名：赵灵儿\n归属部门：产品部\n数据权限：归属部门及子部门数据\n功能权限：普通成员", desc: "新增成员，账号状态：无 → 未激活" },
  { id: 2, name: "张伟",   type: "数据权限调整",     date: "2026-07-11 18:00", operator: "Simiy",  before: "数据权限：归属部门及子部门数据", after: "数据权限：仅个人数据", desc: "数据权限：【归属部门及子部门数据】变更为【仅个人数据】" },
  { id: 3, name: "周子墨", type: "操作离职",         date: "2026-06-30 17:20", operator: "Simiy",  before: "账号状态：正常", after: "账号状态：已离职", desc: "员工操作离职，账号状态变更为【已离职】，资产共 3 个任务转移至「陈雨曦」" },
  { id: 4, name: "王浩然", type: "账号状态变更",     date: "2026-06-18 10:05", operator: "Simiy",  before: "账号状态：正常", after: "账号状态：停用", desc: "账号状态【正常】→【停用】" },
  { id: 5, name: "李思思", type: "部门调整",         date: "2026-05-20 14:30", operator: "陈雨曦", before: "归属部门：市场部", after: "归属部门：运营部", desc: "归属部门：市场部 → 运营部" },
  { id: 6, name: "陈雨曦", type: "功能权限调整",     date: "2026-04-22 11:40", operator: "Simiy",  before: "功能权限：普通成员", after: "功能权限：自定义（成员管理：编辑权限）", desc: "成员管理权限：无权限 → 编辑权限" },
  { id: 7, name: "张伟",   type: "成员基础信息变更", date: "2026-04-10 15:12", operator: "Simiy",  before: "手机号：13700000000", after: "手机号：13733334444", desc: "手机号：13700000000 → 13733334444" },
];

/* 批量导入（模拟解析结果） */
const MOCK_IMPORT = {
  pass: [
    { name: "郑好", account: "13800001111", deptName: "产品部", position: "产品经理" },
    { name: "何欢", account: "hehuan@zleap.ai", deptName: "运营部", position: "运营专员" },
    { name: "吴迪", account: "13800003333", deptName: "前端组", position: "前端工程师" },
  ],
  fail: [
    { row: 3, account: "13122226666", reason: "账号已存在，不支持通过导入更新" },
    { row: 5, account: "lisisi#zleap", reason: "账号格式不符合规范" },
  ],
};

/* ═══ 通用小组件 ═══ */
const Field = ({ label, required, children, error, extra }) => (
  <label className="block">
    <span className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
      <span>{label} {required && <b className="text-rose-500">*</b>}</span>{extra}
    </span>
    {children}
    {error && <span className="mt-1 block text-[11px] text-rose-500">{error}</span>}
  </label>
);

function DeptSelect({ depts, value, onChange, allowRoot = false, className = "" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = depts.find(d => d.id === Number(value));
  const allOptions = flattenDeptTree(depts);
  const rootOffset = allowRoot ? 0 : 1;
  const selectableOptions = allOptions
    .filter(([id]) => allowRoot || depts.find(d => d.id === id)?.parentId !== null)
    .map(([id, name, depth, hasChildren]) => [id, name, Math.max(0, depth - rootOffset), hasChildren]);
  const visibleOptions = filterDeptTreeOptions(selectableOptions, query);
  const close = () => { setOpen(false); setQuery(""); };

  return <div className={`relative ${open ? "z-[90]" : ""} ${className}`}>
    <button type="button" onClick={() => { setOpen(v => !v); setQuery(""); }}
      aria-haspopup="listbox" aria-expanded={open}
      className={`flex h-10 w-full items-center rounded-xl border bg-white/70 px-3 text-left text-sm outline-none backdrop-blur transition ${open ? "border-primary/50 ring-2 ring-orange-100" : "border-input hover:border-neutral-300"}`}>
      <span className={selected ? "text-foreground" : "text-muted-foreground"}>{selected?.name || "请选择部门"}</span>
      <i className={`ri-arrow-down-s-line ml-auto text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <>
      <button type="button" className="fixed inset-0 z-[-1] cursor-default" aria-label="关闭部门选择" onClick={close} />
      <div className="absolute left-0 top-full z-10 mt-1 w-full min-w-[240px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
        <div className="border-b border-neutral-100 p-2">
          <div className="relative">
            <i className="ri-search-line pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400" />
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Escape") close(); }}
              placeholder="搜索部门"
              className="h-8 w-full rounded-lg bg-neutral-50 pl-8 pr-8 text-sm outline-none ring-1 ring-neutral-200 focus:bg-white focus:ring-orange-200" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="清空部门搜索"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><i className="ri-close-line" /></button>}
          </div>
        </div>
        <div className="max-h-56 overflow-y-auto py-1" role="listbox" aria-label="部门">
          {visibleOptions.map(([id, name, depth, hasChildren]) => {
            const checked = Number(value) === id;
            return <button key={id} type="button" role="option" aria-selected={checked}
              onClick={() => { onChange(id); close(); }}
              className={`flex w-full items-center gap-2 py-2 pr-3 text-left text-sm transition ${checked ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50"}`}
              style={{ paddingLeft: `${12 + depth * 18}px` }}>
              <i className={`${depth === 0 ? "ri-building-2-line" : hasChildren ? "ri-node-tree" : "ri-corner-down-right-line"} text-[14px] ${checked ? "text-orange-500" : "text-neutral-400"}`} />
              <span className={hasChildren || depth === 0 ? "font-medium" : ""}>{name}</span>
              {checked && <i className="ri-check-line ml-auto text-orange-500" />}
            </button>;
          })}
          {visibleOptions.length === 0 && <div className="px-3 py-6 text-center text-[12px] text-muted-foreground">未找到相关部门</div>}
        </div>
      </div>
    </>}
  </div>;
}

/* 顶部二级菜单栏里的紧凑搜索框（与信息源模块一致） */
const BarSearch = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-neutral-400" />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`h-8 w-48 rounded-xl bg-neutral-100/80 pl-9 text-sm placeholder-neutral-400 outline-none ring-1 ring-transparent transition focus:w-64 focus:bg-white focus:ring-orange-200 ${value ? "pr-8" : "pr-3"}`} />
    {value && <button onClick={() => onChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500"><i className="ri-close-line" /></button>}
  </div>
);

/* 顶栏筛选组件（与信息源 HeaderFilterButton 同款：icon 按钮 + 弹层 + 多选下拉/日期范围） */
function FilterPopover({ fields, activeCount, onClear }) {
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(null);
  const [selectQuery, setSelectQuery] = useState("");
  const hasFilters = activeCount > 0;
  const closePanel = () => { setOpen(false); setOpenSelect(null); setSelectQuery(""); };
  const dateCls = "h-10 w-full rounded-lg border border-neutral-200 px-2 text-sm text-neutral-700 outline-none transition hover:border-neutral-300 focus:border-orange-300 focus:ring-2 focus:ring-orange-100";
  return (
    <div className="relative z-[70]">
      <button onClick={() => { setOpen(v => !v); setOpenSelect(null); }} title="筛选"
        className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition ${hasFilters || open ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200" : "bg-neutral-100/80 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"}`}>
        <i className="ri-filter-3-line text-[15px]" />
        {hasFilters && <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-white">{activeCount}</span>}
      </button>
      {open && <>
        <div className="fixed inset-0 z-30" onClick={closePanel} />
        <div className="glass-strong absolute right-0 top-9 z-40 w-80 overflow-visible rounded-2xl shadow-xl">
          <div className="border-b border-border/40 px-4 py-3"><div className="text-sm font-semibold text-neutral-800">筛选</div></div>
          <div className="space-y-3 px-4 py-4">
            {fields.map(f => {
              if (f.type === "daterange") return (
                <div key={f.key} className="grid grid-cols-[64px_1fr] items-center gap-2">
                  <label className="text-sm text-neutral-600">{f.label}</label>
                  <div className="flex items-center gap-1.5">
                    <input type="date" value={f.from} onChange={e => f.onFrom(e.target.value)} className={dateCls} />
                    <span className="shrink-0 text-neutral-400">-</span>
                    <input type="date" value={f.to} onChange={e => f.onTo(e.target.value)} className={dateCls} />
                  </div>
                </div>
              );
              const selLabel = f.value.size === 0 ? `请选择${f.label}`
                : f.value.size === 1 ? (f.options.find(([v]) => v === [...f.value][0])?.[1] || "已选 1 项")
                : `已选 ${f.value.size} 项`;
              const visibleOptions = f.tree ? filterDeptTreeOptions(f.options, selectQuery) : f.options;
              return (
                <div key={f.key} className="grid grid-cols-[64px_1fr] items-center gap-2">
                  <label className="text-sm text-neutral-600">{f.label}</label>
                  <div className="relative">
                    <div onClick={() => { setOpenSelect(openSelect === f.key ? null : f.key); setSelectQuery(""); }}
                      className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-left text-sm transition ${openSelect === f.key ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200 hover:border-neutral-300"}`}>
                      <span className={f.value.size > 0 ? "text-neutral-800" : "text-neutral-400"}>{selLabel}</span>
                      <span className="ml-auto flex items-center gap-1 text-neutral-400">
                        {f.value.size > 0 && <button onClick={e => { e.stopPropagation(); f.onChange(new Set()); }}
                          className="rounded-full transition hover:bg-neutral-100 hover:text-orange-500" title={`清空${f.label}`}><i className="ri-close-line" /></button>}
                        <i className="ri-arrow-down-s-line" />
                      </span>
                    </div>
                    {openSelect === f.key && (
                      <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-xl">
                        {f.tree && <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white p-2">
                          <div className="relative">
                            <i className="ri-search-line pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400" />
                            <input autoFocus value={selectQuery} onChange={e => setSelectQuery(e.target.value)}
                              placeholder="搜索部门"
                              className="h-8 w-full rounded-lg bg-neutral-50 pl-8 pr-8 text-sm outline-none ring-1 ring-neutral-200 focus:bg-white focus:ring-orange-200" />
                            {selectQuery && <button type="button" onClick={() => setSelectQuery("")} aria-label="清空部门搜索"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><i className="ri-close-line" /></button>}
                          </div>
                          <div className="px-1 pt-2 text-[11px] text-muted-foreground">选择上级部门将同时包含其下级部门</div>
                        </div>}
                        {visibleOptions.map(([v, lab, depth = 0, hasChildren = false]) => {
                          const checked = f.value.has(v);
                          return <button key={v} onClick={() => { const n = new Set(f.value); if (checked) n.delete(v); else n.add(v); f.onChange(n); }}
                            aria-pressed={checked}
                            className={`flex w-full items-center gap-2 py-2 pr-3 text-left text-sm transition ${checked ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50"}`}
                            style={{ paddingLeft: `${12 + depth * 18}px` }}>
                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-orange-500 bg-orange-500 text-white" : "border-neutral-300 bg-white"}`}>
                              {checked && <i className="ri-check-line text-[12px]" />}
                            </span>
                            <i className={`${depth === 0 ? "ri-building-2-line" : hasChildren ? "ri-node-tree" : "ri-corner-down-right-line"} text-[14px] ${checked ? "text-orange-500" : "text-neutral-400"}`} />
                            <span className={hasChildren || depth === 0 ? "font-medium" : ""}>{lab}</span>
                          </button>;
                        })}
                        {visibleOptions.length === 0 && <div className="px-3 py-6 text-center text-[12px] text-muted-foreground">未找到相关部门</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {hasFilters && (
            <div className="flex justify-end border-t border-neutral-100 px-4 py-3">
              <button onClick={() => { onClear(); closePanel(); }} className="text-xs font-medium text-orange-500 hover:text-orange-600">清空筛选</button>
            </div>
          )}
        </div>
      </>}
    </div>
  );
}

function ConfirmDialog({ open, onOpenChange, title, children, confirmText = "确认", danger = false, onConfirm, confirmDisabled = false }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[440px]">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="text-sm text-muted-foreground">{children}</div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
        <Button variant={danger ? "destructive" : "default"} disabled={confirmDisabled} onClick={onConfirm}>{confirmText}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

/* 初始密码结果弹窗（新增成功 / 重置成功 共用） */
function PwdResultDialog({ open, onOpenChange, title, member, pwd, onConfig }) {
  if (!member) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[440px]">
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600"><i className="ri-checkbox-circle-fill" /></span>
        <h2 className="mt-3 text-base font-semibold">{title}</h2>
        <p className="mt-1 text-[12px] text-muted-foreground">登录账号：{member.phone || member.email}</p>
        <div className="mt-4 w-full rounded-xl bg-neutral-50 px-4 py-3 ring-1 ring-border/60">
          <div className="text-[11px] text-muted-foreground">初始密码</div>
          <div className="mt-0.5 font-mono text-xl font-bold tracking-wider">{pwd}</div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">系统不支持复制密码，请关闭前安全记录并通过企业内部安全渠道告知成员</p>
      </div>
      <div className="mt-4 space-y-2">
        {onConfig && <Button variant="outline" className="w-full" onClick={onConfig}><i className="ri-shield-keyhole-line" />去配置成员权限</Button>}
        <Button className="w-full" onClick={() => onOpenChange(false)}>完成</Button>
      </div>
    </DialogContent>
  </Dialog>;
}

/* ═══ 添加成员弹窗 ═══ */
function AddMemberDialog({ open, onOpenChange, depts, members, onCreate }) {
  const empty = { name: "", phone: "", email: "", deptId: "", position: "" };
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState(false);
  const [askDiscard, setAskDiscard] = useState(false);
  useEffect(() => { if (open) { setForm(empty); setTouched(false); setAskDiscard(false); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setTouched(true); };

  const errors = {};
  if (!form.name.trim()) errors.name = "成员名称不能为空"; else if (form.name.trim().length > 20) errors.name = "成员名称不能超过 20 字";
  if (!form.phone && !form.email) errors.account = "电话/邮箱必须填一个";
  if (form.phone && !validPhone(form.phone)) errors.phone = "电话号码格式不正确";
  if (form.email && !validEmail(form.email)) errors.email = "邮箱格式不正确";
  if (!form.deptId) errors.deptId = "部门不能为空";
  if (form.position.length > 15) errors.position = "职位不能超过 15 字";
  const dup = members.find(m => (form.phone && m.phone === form.phone) || (form.email && m.email && m.email === form.email));
  if (dup && !errors.phone && !errors.email) errors.account = `该账号已存在（${dup.name}），请勿重复创建`;
  const valid = Object.keys(errors).length === 0;

  const tryClose = v => { if (!v && touched) { setAskDiscard(true); return; } onOpenChange(v); };
  return <Dialog open={open} onOpenChange={tryClose}>
    <DialogContent>
      <DialogHeader><DialogTitle>添加成员</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <Field label="成员名称" required error={touched ? errors.name : ""} extra={<span className={form.name.length > 18 ? "text-orange-400" : ""}>{form.name.length}/20</span>}>
          <Input autoFocus value={form.name} onChange={e => set("name", e.target.value)} maxLength={20} placeholder="请输入成员名称" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="电话" error={touched ? errors.phone : ""}><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="作为登录账号之一" /></Field>
          <Field label="邮箱" error={touched ? errors.email : ""}><Input value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@company.com" /></Field>
        </div>
        <p className={`-mt-2 text-[11px] ${touched && errors.account ? "text-rose-500" : "text-muted-foreground"}`}>{(touched && errors.account) || "电话 / 邮箱至少填写一个，作为登录账号"}</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="归属部门" required error={touched ? errors.deptId : ""}><DeptSelect depts={depts} value={form.deptId} onChange={v => set("deptId", v)} /></Field>
          <Field label="职位" error={touched ? errors.position : ""}><Input value={form.position} onChange={e => set("position", e.target.value)} maxLength={15} placeholder="选填，15 字以内" /></Field>
        </div>
        <div className="rounded-xl bg-accent/70 px-3 py-2.5 text-[12px] leading-relaxed text-accent-foreground ring-1 ring-orange-100">
          <i className="ri-information-line mr-1" />新增成员默认状态为「未激活」，系统将自动生成初始密码；默认数据权限为归属部门及子部门，功能权限为普通成员。
        </div>
        {askDiscard && <div className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2.5 text-[12px] text-rose-600 ring-1 ring-rose-100">
          <span>是否放弃未保存内容？</span>
          <span className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setAskDiscard(false)}>继续编辑</Button>
            <Button size="sm" variant="destructive" onClick={() => onOpenChange(false)}>放弃</Button>
          </span>
        </div>}
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => tryClose(false)}>取消</Button>
        <Button disabled={!valid} onClick={() => onCreate(form)}>完成创建</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

/* ═══ 批量导入（上传 → 校验 loading / 结果 → 导入 loading / 完成） ═══ */
function ImportDialog({ open, onOpenChange, onImport, notify }) {
  const [step, setStep] = useState("upload");
  const [fileName, setFileName] = useState("");
  const [created, setCreated] = useState([]);
  const [credentialsHandled, setCredentialsHandled] = useState(false);
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    if (open) {
      setStep("upload");
      setFileName("");
      setCreated([]);
      setCredentialsHandled(false);
      setExporting(false);
    }
  }, [open]);
  const { pass, fail } = MOCK_IMPORT;
  useEffect(() => {
    if (step === "validating") {
      const timer = setTimeout(() => setStep("validation"), 1200);
      return () => clearTimeout(timer);
    }
    if (step === "importing") {
      const timer = setTimeout(() => {
        setCreated(onImport(pass));
        setStep("complete");
      }, 1400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const stageIndex = step === "upload" ? 0 : ["validating", "validation"].includes(step) ? 1 : 2;
  const stages = ["上传文件", "提交校验", "完成导入"];
  const downloadAll = async () => {
    if (created.length === 0 || exporting) return;
    setExporting(true);
    try {
      await downloadCredentialFile(created);
      setCredentialsHandled(true);
      notify("初始密码文件已导出，请妥善保管");
    } catch {
      notify("初始密码文件导出失败，请重试");
    } finally {
      setExporting(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex h-[620px] max-h-[88vh] w-[820px] flex-col overflow-hidden p-0">
      <div className="grid min-h-0 flex-1 grid-cols-[180px_minmax(0,1fr)]">
        <aside className="border-r border-border/60 bg-neutral-50/70 px-6 py-7">
          <div className="text-sm font-semibold">批量导入成员</div>
          <div className="mt-7">
            {stages.map((label, index) => {
              const done = index < stageIndex || step === "complete";
              const active = index === stageIndex && step !== "complete";
              return <div key={label} className="relative flex min-h-[86px] gap-3 last:min-h-0">
                {index < stages.length - 1 && <span className={`absolute left-[5px] top-4 h-[70px] w-px ${index < stageIndex ? "bg-primary" : "bg-border"}`} />}
                <span className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border ${done || active ? "border-primary bg-primary" : "border-slate-300 bg-white"}`}>
                  {done && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✓</span>}
                </span>
                <div>
                  <div className={`text-sm ${active ? "font-semibold text-foreground" : done ? "font-medium text-foreground" : "text-muted-foreground"}`}>{label}</div>
                  {active && <div className="mt-1 text-[11px] text-muted-foreground">
                    {step === "validating" ? "正在校验文件" : step === "importing" ? "正在写入成员" : "当前步骤"}
                  </div>}
                </div>
              </div>;
            })}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col p-7">
          {step === "upload" && <>
            <DialogHeader><DialogTitle>上传文件</DialogTitle></DialogHeader>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50/70 px-4 py-3">
              <div><div className="text-[13px] font-medium">下载花名册模板</div><div className="mt-0.5 text-[11px] text-muted-foreground">按模板填写后上传，支持 XLSX / CSV</div></div>
              <a href="https://ktrcdjhhwa.feishu.cn/wiki/BWrVwWnAxiyWXWkpUlFcAX1Ynsh" target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-primary hover:underline">立即下载</a>
            </div>
            <button type="button" onClick={() => setFileName("花名册成员导入.xlsx")}
              className={`mt-4 flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${fileName ? "border-emerald-300 bg-emerald-50/30" : "border-orange-200 bg-white hover:border-primary/50 hover:bg-orange-50/30"}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${fileName ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-primary"}`}><i className={fileName ? "ri-file-excel-2-line" : "ri-file-add-line"} /></span>
              <div className="mt-3 text-sm font-medium">{fileName || "拖拽文件到此处，或点击上传"}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{fileName ? "文件已选择，点击下一步开始校验" : "支持 XLSX / CSV，文件不超过 5MB"}</div>
            </button>
            <div className="mt-5 flex justify-end"><Button disabled={!fileName} onClick={() => setStep("validating")}>下一步</Button></div>
          </>}

          {["validating", "importing"].includes(step) && <div className="flex min-h-0 flex-1 flex-col">
            <DialogHeader><DialogTitle>{step === "validating" ? "提交校验" : "完成导入"}</DialogTitle></DialogHeader>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl text-primary"><i className="ri-loader-4-line animate-spin" /></span>
              <div className="mt-5 text-base font-semibold">{step === "validating" ? "正在校验文件" : "正在导入成员"}</div>
              <p className="mt-2 text-sm text-muted-foreground">{step === "validating" ? "正在检查模板、字段与成员数据，请稍候…" : `正在创建 ${pass.length} 个成员账号并生成初始密码，请稍候…`}</p>
              <div className="mt-5 h-1.5 w-64 overflow-hidden rounded-full bg-neutral-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-primary" /></div>
            </div>
          </div>}

          {step === "validation" && <div className="flex min-h-0 flex-1 flex-col">
            <DialogHeader><DialogTitle>校验结果</DialogTitle></DialogHeader>
            <div className="mt-5 grid grid-cols-3 gap-4 rounded-xl bg-neutral-50 p-4 ring-1 ring-border/60">
              {[["待导入总行数", pass.length + fail.length, "text-foreground"], ["通过校验行数", pass.length, "text-emerald-600"], ["失败行数", fail.length, "text-rose-500"]].map(([label, n, cls]) => (
                <div key={label} className="rounded-lg bg-white px-4 py-2.5"><div className="text-[11px] text-muted-foreground">{label}</div><div className={`text-xl font-bold ${cls}`}>{n}</div></div>
              ))}
            </div>
            <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-xl ring-1 ring-border/60">
              <div className="grid grid-cols-[80px_1fr_160px] bg-neutral-50 px-4 py-2.5 text-[11px] font-medium text-muted-foreground"><span>行号</span><span>账号</span><span>错误原因</span></div>
              {fail.map(f => <div key={f.row} className="grid grid-cols-[80px_1fr_160px] border-t border-border/50 px-4 py-3 text-[12px]"><span>{f.row}</span><span className="font-mono text-muted-foreground">{f.account}</span><span className="text-rose-500">{f.reason}</span></div>)}
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <span className="mr-auto text-[12px] text-primary">将导入 {pass.length} 条，失败 {fail.length} 条</span>
              <Button variant="outline" onClick={() => { setStep("upload"); setFileName(""); }}>上一步</Button>
              <Button onClick={() => setStep("importing")}>确认导入</Button>
            </div>
          </div>}

          {step === "complete" && <div className="flex min-h-0 flex-1 flex-col">
            <DialogHeader><DialogTitle>导入完成</DialogTitle></DialogHeader>
            <div className="mt-5 flex items-center gap-4 rounded-xl bg-emerald-50/70 px-5 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600"><i className="ri-checkbox-circle-fill" /></span>
              <div><div className="text-base font-semibold">成功导入 {created.length} 条成员</div><div className="mt-1 text-[12px] text-muted-foreground">失败 {fail.length} 条；成功成员状态均为「未激活」</div></div>
            </div>
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl ring-1 ring-border/60">
              {created.map(m => <div key={m.id} className="flex items-center gap-3 border-b border-border/50 px-4 py-2.5 last:border-b-0">
                <div className="min-w-0 flex-1"><div className="text-sm font-medium">{m.name}<span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">{m.id}</span></div><div className="text-[11px] text-muted-foreground">{m.phone || m.email} · {m.deptName}</div></div>
                <Badge variant="info">未激活</Badge>
              </div>)}
            </div>
            <div className={`mt-4 rounded-xl px-3 py-2.5 text-[12px] ${credentialsHandled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              <i className={`${credentialsHandled ? "ri-checkbox-circle-line" : "ri-error-warning-line"} mr-1`} />
              {credentialsHandled ? "初始密码文件已导出，请妥善保管。" : "关闭后不能再次批量导出；系统不提供复制密码，遗失后需逐个重置。"}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>完成</Button>
              <Button onClick={downloadAll} disabled={created.length === 0 || exporting}><i className={exporting ? "ri-loader-4-line animate-spin" : "ri-file-excel-2-line"} />{exporting ? "正在生成文件" : "导出初始密码文件"}</Button>
            </div>
          </div>}
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}

/* ═══ 操作离职 ═══ */
function ResignDialog({ open, onOpenChange, member, members, onSubmit }) {
  const [receiverId, setReceiverId] = useState("");
  useEffect(() => { if (open) setReceiverId(""); }, [open]);
  if (!member) return null;
  const receivers = members.filter(m => m.status === "active" && m.id !== member.id);
  const assetsTotal = Object.values(member.assets).reduce((a, b) => a + b, 0);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>操作离职</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 ring-1 ring-border/60">
          <Avatar className="h-9 w-9"><AvatarImage src={member.avatar} /><AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback></Avatar>
          <div><div className="text-sm font-medium">{member.name}</div><div className="text-[11px] text-muted-foreground">{member.id} · {member.position || "—"}</div></div>
          <Badge className="ml-auto" variant={STATUS[member.status].variant}>{STATUS[member.status].label}</Badge>
        </div>
        <div>
          <div className="mb-1.5 text-[12px] text-muted-foreground">名下企业资产（将整体转移给接收人）</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {Object.entries(member.assets).map(([k, n]) => <div key={k} className="rounded-xl bg-neutral-50 py-2.5 ring-1 ring-border/60"><div className="text-lg font-bold">{n}</div><div className="text-[11px] text-muted-foreground">{k}</div></div>)}
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">个人数据（与助手的会话记录、未使用草稿）将在离职流程完成后删除</p>
        </div>
        <Field label="资产接收人" required>
          <select value={receiverId} onChange={e => setReceiverId(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-white/70 px-3 text-sm outline-none backdrop-blur focus:border-primary/50">
            <option value="" disabled>选择状态为「正常」的成员，支持跨部门交接</option>
            {receivers.map(m => <option key={m.id} value={m.id}>{m.name}（{m.id}）</option>)}
          </select>
        </Field>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
        <Button variant="destructive" disabled={!receiverId || assetsTotal < 0} onClick={() => onSubmit(receiverId)}>确认离职</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

/* ═══ 成员权限配置弹窗（数据权限 + 功能权限模板） ═══ */
function PermDialog({ open, onOpenChange, member, depts, members, customTpls, onSave, onSaveTpl, onDeleteTpl, notify }) {
  const [scope, setScope] = useState("dept");
  const [tags, setTags] = useState([]);
  const [tagQuery, setTagQuery] = useState("");
  const [tplSel, setTplSel] = useState("none");
  const [perms, setPerms] = useState({ ...TPL_SYS.member.perms });
  const [dirty, setDirty] = useState(false);
  const [naming, setNaming] = useState(false);
  const [tplName, setTplName] = useState("");
  const [delTpl, setDelTpl] = useState(null);

  useEffect(() => {
    if (open && member) {
      setScope(member.dataScope); setTags(member.scopeTags || []); setTagQuery("");
      setTplSel(member.funcTemplate || "none"); setPerms({ ...member.funcPerms }); setDirty(false); setNaming(false); setTplName("");
    }
  }, [open, member]);
  if (!member) return null;

  const tplPerms = key => TPL_SYS[key]?.perms || customTpls.find(t => t.id === key)?.perms;
  const locked = tplSel !== "none";
  const shownPerms = locked ? tplPerms(tplSel) || perms : perms;
  const suggestions = tagQuery.trim()
    ? [...depts.filter(d => d.name.includes(tagQuery)).map(d => ({ type: "dept", id: `d${d.id}`, label: d.name })),
       ...members.filter(m => m.name.includes(tagQuery)).map(m => ({ type: "user", id: `u${m.id}`, label: m.name }))]
      .filter(s => !tags.some(t => t.id === s.id)).slice(0, 6)
    : [];

  const save = () => {
    onSave({ dataScope: scope, scopeTags: scope === "custom" ? tags : [], funcTemplate: tplSel === "none" ? null : tplSel, funcPerms: { ...shownPerms } });
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[640px] max-h-[86vh] overflow-y-auto">
      <DialogHeader><DialogTitle>成员权限配置 · {member.name}</DialogTitle></DialogHeader>
      <div className="space-y-5">
        {/* 数据权限 */}
        <section>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><i className="ri-database-2-line text-primary" />数据权限</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SCOPES).map(([key, label]) => <button key={key} onClick={() => setScope(key)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${scope === key ? "border-primary/60 bg-accent text-accent-foreground" : "border-border bg-white/60 hover:border-primary/30"}`}>
              <i className={scope === key ? "ri-radio-button-fill text-primary" : "ri-checkbox-blank-circle-line text-muted-foreground/50"} />{label}
            </button>)}
          </div>
          {scope === "custom" && <div className="mt-2 rounded-xl border border-border bg-white/60 p-2.5">
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12px] text-accent-foreground">
                <i className={t.type === "dept" ? "ri-node-tree" : "ri-user-line"} />{t.label}
                <button onClick={() => setTags(v => v.filter(x => x.id !== t.id))} className="hover:text-rose-500"><i className="ri-close-line" /></button>
              </span>)}
              <input value={tagQuery} onChange={e => setTagQuery(e.target.value)} placeholder="搜索并添加部门 / 成员"
                className="min-w-[160px] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground/60" />
            </div>
            {suggestions.length > 0 && <div className="mt-2 border-t border-border/50 pt-2">
              {suggestions.map(s => <button key={s.id} onClick={() => { setTags(v => [...v, s]); setTagQuery(""); }}
                className="mb-1 mr-1.5 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[12px] text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                <i className={s.type === "dept" ? "ri-node-tree" : "ri-user-line"} />{s.label}<i className="ri-add-line" />
              </button>)}
            </div>}
          </div>}
        </section>

        {/* 功能权限 */}
        <section>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><i className="ri-shield-keyhole-line text-primary" />功能权限</div>
          <div className="flex flex-wrap gap-2">
            {[["admin", "管理员"], ["member", "普通成员"], ...customTpls.map(t => [t.id, t.name]), ["none", "未选择模版（自定义）"]].map(([key, label]) => (
              <span key={key} className="relative">
                <button onClick={() => { setTplSel(key); if (key !== "none") setPerms({ ...tplPerms(key) }); setDirty(false); }}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] transition ${tplSel === key ? "border-primary/60 bg-accent font-medium text-accent-foreground" : "border-border bg-white/60 text-muted-foreground hover:border-primary/30"} ${key.startsWith("tpl_") ? "pr-8" : ""}`}>
                  {label}
                </button>
                {key.startsWith("tpl_") && <button onClick={() => setDelTpl(customTpls.find(t => t.id === key))} title="删除模版"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-rose-500"><i className="ri-delete-bin-line text-[13px]" /></button>}
              </span>
            ))}
          </div>
          <div className={`mt-3 overflow-hidden rounded-xl ring-1 ring-border/60 ${locked ? "opacity-70" : ""}`}>
            <div className="flex items-center justify-between bg-neutral-50 px-4 py-2 text-[12px] font-medium text-muted-foreground">
              <span>功能权限明细</span>{locked && <span className="flex items-center gap-1"><i className="ri-lock-line" />预设模版，仅读</span>}
            </div>
            {MODULES.map(mod => <div key={mod.key} className="flex flex-wrap items-center gap-2 border-t border-border/50 px-4 py-3">
              <div className="min-w-[120px]"><div className="text-sm font-medium">{mod.name}</div><div className="text-[11px] text-muted-foreground">{mod.desc}</div></div>
              <div className="ml-auto flex gap-1">
                {mod.levels.map(lv => <button key={lv} disabled={locked}
                  onClick={() => { setPerms(p => ({ ...p, [mod.key]: lv })); setDirty(true); }}
                  className={`rounded-lg px-2.5 py-1 text-[12px] transition ${shownPerms[mod.key] === lv ? "bg-primary font-medium text-primary-foreground" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"} ${locked ? "cursor-not-allowed" : ""}`}>
                  {LEVELS[lv]}
                </button>)}
              </div>
            </div>)}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">信息管理、助手管理、任务管理为公共服务模块，默认对正常账号开放，资源可见性由共享机制决定，不在此配置。</p>
          {!locked && dirty && <Button variant="outline" size="sm" className="mt-2" onClick={() => setNaming(true)}><i className="ri-save-3-line" />保存为模版</Button>}
        </section>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
        <Button onClick={save}>保存配置</Button>
      </DialogFooter>

      {/* 模版命名 */}
      <Dialog open={naming} onOpenChange={setNaming}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>保存为权限模版</DialogTitle></DialogHeader>
          <Field label="模版名称" required><Input autoFocus value={tplName} onChange={e => setTplName(e.target.value)} maxLength={15} placeholder="如：部门管理员" /></Field>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNaming(false)}>取消</Button>
            <Button disabled={!tplName.trim()} onClick={() => { const id = onSaveTpl(tplName.trim(), { ...perms }); setTplSel(id); setDirty(false); setNaming(false); notify("模版已保存并绑定当前成员"); }}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 模版删除确认 */}
      <ConfirmDialog open={Boolean(delTpl)} onOpenChange={() => setDelTpl(null)} title="删除权限模版" danger confirmText="删除"
        onConfirm={() => { if (tplSel === delTpl.id) { setTplSel("none"); } onDeleteTpl(delTpl.id); setDelTpl(null); }}>
        删除只移除模板，不改变成员权限。已使用该模板的成员会转为自定义配置。确认删除「{delTpl?.name}」吗？
      </ConfirmDialog>
    </DialogContent>
  </Dialog>;
}

/* ═══ 成员详情 / 编辑成员 ═══ */
function DetailDialog({ open, onOpenChange, member, depts, changes, customTpls, onSaveEdit, ops, startEditing = false }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [detailTab, setDetailTab] = useState("info");
  const [editTab, setEditTab] = useState("basic");
  const [permDraft, setPermDraft] = useState(null);
  const [scopeQuery, setScopeQuery] = useState("");
  useEffect(() => {
    if (open) {
      setEditing(startEditing);
      setForm(startEditing ? { name: member.name, deptId: member.deptId, position: member.position, phone: member.phone, email: member.email } : null);
      setDetailTab("info");
      setEditTab("basic");
      setScopeQuery("");
      setPermDraft({
        dataScope: member.dataScope,
        scopeTags: member.scopeTags || [],
        funcTemplate: member.funcTemplate || "none",
        funcPerms: { ...member.funcPerms },
      });
    }
  }, [open, member?.id, startEditing]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!member) return null;
  const deptName = id => depts.find(d => d.id === id)?.name || "—";
  const tplName = member.funcTemplate ? (TPL_SYS[member.funcTemplate]?.name || customTpls.find(t => t.id === member.funcTemplate)?.name || "自定义") : "自定义配置";
  const myChanges = changes.filter(c => c.name === member.name);
  const startEdit = () => {
    setForm({ name: member.name, deptId: member.deptId, position: member.position, phone: member.phone, email: member.email });
    setPermDraft({ dataScope: member.dataScope, scopeTags: member.scopeTags || [], funcTemplate: member.funcTemplate || "none", funcPerms: { ...member.funcPerms } });
    setEditTab("basic");
    setEditing(true);
  };
  const templatePerms = key => TPL_SYS[key]?.perms || customTpls.find(t => t.id === key)?.perms;
  const displayedPerms = permDraft?.funcTemplate && permDraft.funcTemplate !== "none"
    ? templatePerms(permDraft.funcTemplate) || permDraft.funcPerms
    : permDraft?.funcPerms;
  const scopeSuggestions = scopeQuery.trim()
    ? [...depts.filter(d => d.name.includes(scopeQuery)).map(d => ({ type: "dept", id: `d${d.id}`, label: d.name })),
       ...ops.members.filter(m => m.name.includes(scopeQuery)).map(m => ({ type: "user", id: `u${m.id}`, label: m.name }))]
      .filter(s => !permDraft?.scopeTags.some(t => t.id === s.id)).slice(0, 6)
    : [];
  const saveAll = () => {
    onSaveEdit(form);
    ops.onSavePerm({
      dataScope: permDraft.dataScope,
      scopeTags: permDraft.dataScope === "custom" ? permDraft.scopeTags : [],
      funcTemplate: permDraft.funcTemplate === "none" ? null : permDraft.funcTemplate,
      funcPerms: { ...displayedPerms },
    });
    setEditing(false);
  };
  const infoRows = [
    ["账号 ID", member.id], ["部门", deptName(member.deptId)], ["职位", member.position || "—"],
    ["电话", member.phone || "—"], ["邮箱", member.email || "—"], ["密码", "••••••••"], ["加入时间", member.joined],
  ];
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex h-[680px] max-h-[86vh] w-[720px] flex-col overflow-hidden">
      <DialogHeader className="shrink-0"><DialogTitle>{editing ? "编辑成员" : "成员详情"}</DialogTitle></DialogHeader>
      <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-neutral-50/80 p-4 ring-1 ring-border/60">
        <Avatar className="h-12 w-12"><AvatarImage src={member.avatar} /><AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback></Avatar>
        <div>
          <div className="flex items-center gap-2 text-base font-semibold">{member.name}<Badge variant={STATUS[member.status].variant}>{STATUS[member.status].label}</Badge></div>
          <div className="text-[12px] text-muted-foreground">{member.id} · {deptName(member.deptId)} · {member.position || "—"}</div>
        </div>
        <div className="ml-auto flex gap-2">
          {!editing && member.status !== "resigned" && <Button variant="outline" size="sm" onClick={() => { setDetailTab("info"); startEdit(); }}><i className="ri-edit-line" />编辑</Button>}
        </div>
      </div>

      <div className="mt-4 flex shrink-0 border-b border-border/70" role="tablist" aria-label={editing ? "编辑成员内容" : "成员详情内容"}>
        {(editing
          ? [["basic", "基础信息"], ["permissions", "权限配置"]]
          : [["info", "基本信息"], ["changes", `异动记录${myChanges.length ? `（${myChanges.length}）` : ""}`]]
        ).map(([key, label]) => {
          const active = editing ? editTab === key : detailTab === key;
          return <button key={key} type="button" role="tab" aria-selected={active}
            onClick={() => editing ? setEditTab(key) : setDetailTab(key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {label}
            {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />}
          </button>;
        })}
      </div>

      {((!editing && detailTab === "info") || (editing && editTab === "basic")) && <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {/* 账号基础信息 */}
        <section className="rounded-2xl p-4 ring-1 ring-border/60">
          <div className="mb-3 text-sm font-semibold">账号信息</div>
          {!editing
            ? <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm md:grid-cols-3">
              {infoRows.map(([k, v]) => <div key={k}><div className="text-[11px] text-muted-foreground">{k}</div><div className="mt-0.5 truncate">{v}</div></div>)}
            </div>
            : <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="姓名" required><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={20} /></Field>
                <Field label="部门" required><DeptSelect depts={depts} value={form.deptId} onChange={v => setForm(f => ({ ...f, deptId: v }))} /></Field>
                <Field label="职位"><Input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} maxLength={15} /></Field>
                <Field label="电话"><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
                <Field label="邮箱"><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
              </div>
            </div>}
        </section>

        {/* 权限摘要 */}
        {!editing && <section className="rounded-2xl p-4 ring-1 ring-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-semibold"><i className="ri-shield-keyhole-line text-primary" />权限配置</div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
            <div className="rounded-xl bg-neutral-50 px-3 py-2.5"><div className="text-[11px] text-muted-foreground">数据权限</div><div className="mt-0.5 text-sm">{SCOPES[member.dataScope]}{member.dataScope === "custom" && member.scopeTags.length > 0 && `（${member.scopeTags.map(t => t.label).join("、")}）`}</div></div>
            <div className="rounded-xl bg-neutral-50 px-3 py-2.5"><div className="text-[11px] text-muted-foreground">功能权限</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-sm">{tplName}
                {MODULES.map(mod => <span key={mod.key} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/60">{mod.name}：{LEVELS[member.funcPerms[mod.key]]}</span>)}
              </div>
            </div>
          </div>
        </section>}

        {/* 账号操作 */}
        {!editing && member.status !== "resigned" && <section className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={ops.onResetPwd}><i className="ri-lock-password-line" />重置密码</Button>
          {member.status === "active" && member.id !== CURRENT_USER_ID && <Button variant="outline" size="sm" onClick={ops.onDisable}><i className="ri-forbid-line" />停用账号</Button>}
          {member.status === "disabled" && <Button variant="outline" size="sm" onClick={ops.onRestore}><i className="ri-play-circle-line" />恢复账号</Button>}
          {member.status === "unactivated" && <Button variant="outline" size="sm" className="text-rose-500 hover:border-rose-200 hover:text-rose-600" onClick={ops.onDelete}><i className="ri-delete-bin-line" />删除账号</Button>}
          {member.status !== "unactivated" && member.id !== CURRENT_USER_ID && <Button variant="outline" size="sm" className="text-rose-500 hover:border-rose-200 hover:text-rose-600" onClick={ops.onResign}><i className="ri-logout-box-r-line" />操作离职</Button>}
        </section>}
      </div>}

      {/* 编辑成员：权限配置 */}
      {editing && editTab === "permissions" && permDraft && <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <section className="rounded-2xl p-4 ring-1 ring-border/60">
          <div className="mb-3 text-sm font-semibold">数据权限</div>
          <Field label="数据范围">
            <select value={permDraft.dataScope} onChange={e => setPermDraft(v => ({ ...v, dataScope: e.target.value }))}
              className="h-10 w-full rounded-xl border border-input bg-white/70 px-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10">
              {Object.entries(SCOPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </Field>
          {permDraft.dataScope === "custom" && <div className="mt-3 rounded-xl bg-neutral-50 p-3">
            <div className="flex flex-wrap gap-1.5">
              {permDraft.scopeTags.map(t => <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] ring-1 ring-border/60">
                <i className={t.type === "dept" ? "ri-node-tree" : "ri-user-line"} />{t.label}
                <button type="button" onClick={() => setPermDraft(v => ({ ...v, scopeTags: v.scopeTags.filter(x => x.id !== t.id) }))} aria-label={`移除${t.label}`}><i className="ri-close-line" /></button>
              </span>)}
            </div>
            <Input className="mt-2" value={scopeQuery} onChange={e => setScopeQuery(e.target.value)} placeholder="搜索并添加部门 / 成员" />
            {scopeSuggestions.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">
              {scopeSuggestions.map(s => <button key={s.id} type="button" onClick={() => { setPermDraft(v => ({ ...v, scopeTags: [...v.scopeTags, s] })); setScopeQuery(""); }}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] text-muted-foreground ring-1 ring-border/60 hover:text-primary">
                <i className={s.type === "dept" ? "ri-node-tree mr-1" : "ri-user-line mr-1"} />{s.label}
              </button>)}
            </div>}
          </div>}
        </section>

        <section className="rounded-2xl p-4 ring-1 ring-border/60">
          <div className="mb-3 text-sm font-semibold">功能权限</div>
          <Field label="权限模版">
            <select value={permDraft.funcTemplate} onChange={e => {
              const key = e.target.value;
              setPermDraft(v => ({ ...v, funcTemplate: key, funcPerms: key === "none" ? v.funcPerms : { ...templatePerms(key) } }));
            }} className="h-10 w-full rounded-xl border border-input bg-white/70 px-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10">
              <option value="admin">管理员</option>
              <option value="member">普通成员</option>
              {customTpls.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              <option value="none">自定义配置</option>
            </select>
          </Field>
          <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-border/60">
            {MODULES.map(mod => <div key={mod.key} className="grid grid-cols-[1fr_180px] items-center gap-3 border-t border-border/50 px-3 py-2.5 first:border-t-0">
              <div><div className="text-sm font-medium">{mod.name}</div><div className="text-[11px] text-muted-foreground">{mod.desc}</div></div>
              <select value={displayedPerms[mod.key]} disabled={permDraft.funcTemplate !== "none"}
                onChange={e => setPermDraft(v => ({ ...v, funcPerms: { ...v.funcPerms, [mod.key]: e.target.value } }))}
                className="h-9 rounded-lg border border-input bg-white px-2.5 text-[12px] outline-none disabled:bg-neutral-50 disabled:text-muted-foreground">
                {mod.levels.map(level => <option key={level} value={level}>{LEVELS[level]}</option>)}
              </select>
            </div>)}
          </div>
          {permDraft.funcTemplate !== "none" && <p className="mt-2 text-[11px] text-muted-foreground">预设模版为只读；选择「自定义配置」后可逐项调整。</p>}
        </section>
      </div>}

      {/* 异动记录 Tab */}
      {!editing && detailTab === "changes" && <section className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl p-4 ring-1 ring-border/60">
        {myChanges.length
          ? <div className="overflow-hidden rounded-xl ring-1 ring-border/60">
            <div className="grid grid-cols-[100px_120px_72px_minmax(140px,1fr)_minmax(140px,1fr)] gap-2 bg-neutral-50 px-3 py-2 text-[11px] font-medium text-muted-foreground"><span>异动类型</span><span>操作日期</span><span>操作者</span><span>变更前</span><span>变更后</span></div>
            {myChanges.map(c => <div key={c.id} className="grid grid-cols-[100px_120px_72px_minmax(140px,1fr)_minmax(140px,1fr)] gap-2 border-t border-border/50 px-3 py-2.5 text-[12px]">
              <span><Badge variant="secondary" className="font-normal">{c.type}</Badge></span>
              <span className="text-muted-foreground">{c.date}</span>
              <span>{c.operator}</span>
              <span className="whitespace-pre-line break-words text-muted-foreground">{c.before || "—"}</span>
              <span className="whitespace-pre-line break-words text-muted-foreground">{c.after || "—"}</span>
            </div>)}
          </div>
          : <div className="rounded-xl bg-neutral-50 py-10 text-center text-[12px] text-muted-foreground">
            <i className="ri-history-line mb-1 block text-2xl text-neutral-300" />
            暂无异动记录
          </div>}
      </section>}

      {editing && <div className="mt-4 flex shrink-0 justify-end gap-2 border-t border-border/60 pt-3">
        <Button variant="ghost" onClick={() => setEditing(false)}>取消</Button>
        <Button disabled={!form?.name.trim() || !form?.deptId || (!form?.phone && !form?.email)} onClick={saveAll}>保存</Button>
      </div>}
    </DialogContent>
  </Dialog>;
}

/* ═══ 部门树 ═══ */
function DeptNode({ dept, depts, members, level, expanded, onToggle, onAdd, onEdit, onDelete }) {
  const children = depts.filter(d => d.parentId === dept.id);
  const count = members.filter(m => m.deptId === dept.id && m.status !== "resigned").length;
  const isOpen = expanded.has(dept.id);
  return <>
    <div className="group flex items-center gap-2 rounded-xl px-3 py-2.5 transition hover:bg-white/60" style={{ paddingLeft: 12 + level * 24 }}>
      <button onClick={() => onToggle(dept.id)} className={`flex h-5 w-5 items-center justify-center text-muted-foreground ${children.length ? "" : "invisible"}`} aria-label="展开/收起">
        <i className={`ri-arrow-right-s-line transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>
      <i className={`text-lg ${dept.parentId === null ? "ri-building-2-line text-primary" : "ri-node-tree text-cyan-600"}`} />
      <span className="text-sm font-medium">{dept.name}</span>
      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-muted-foreground">{count} 人</span>
      <div className="ml-auto hidden gap-1 group-hover:flex">
        <Button variant="ghost" size="icon-sm" title="新增子部门" onClick={() => onAdd(dept.id)}><i className="ri-add-line" /></Button>
        <Button variant="ghost" size="icon-sm" title="编辑" onClick={() => onEdit(dept)}><i className="ri-edit-line" /></Button>
        {dept.parentId !== null && <Button variant="ghost" size="icon-sm" title="删除" className="hover:text-rose-500" onClick={() => onDelete(dept)}><i className="ri-delete-bin-line" /></Button>}
      </div>
    </div>
    {isOpen && children.map(c => <DeptNode key={c.id} dept={c} depts={depts} members={members} level={level + 1} expanded={expanded} onToggle={onToggle} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />)}
  </>;
}

/* ═══ 注册审核详情 ═══ */
function ReviewDialog({ open, onOpenChange, reg, depts, onApprove, onReject }) {
  const [deptId, setDeptId] = useState("");
  const [tpl, setTpl] = useState("member");
  const [comment, setComment] = useState("");
  useEffect(() => { if (open) { setDeptId(""); setTpl("member"); setComment(""); } }, [open]);
  if (!reg) return null;
  const pending = reg.status === "pending";
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[560px]">
      <DialogHeader><DialogTitle>注册审核详情</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <section className="rounded-2xl bg-neutral-50/80 p-4 ring-1 ring-border/60">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold"><span>申请信息</span><Badge variant={REG_STATUS[reg.status].variant}>{REG_STATUS[reg.status].label}</Badge></div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {[["姓名", reg.name], ["申请时间", reg.appliedAt], ["手机号", reg.phone || "—"], ["邮箱", reg.email || "—"]].map(([k, v]) => <div key={k}><div className="text-[11px] text-muted-foreground">{k}</div><div className="mt-0.5">{v}</div></div>)}
          </div>
          <div className="mt-2.5"><div className="text-[11px] text-muted-foreground">申请原因</div><div className="mt-0.5 text-sm">{reg.reason || "—"}</div></div>
        </section>
        {pending
          ? <section className="rounded-2xl p-4 ring-1 ring-border/60">
              <div className="mb-3 text-sm font-semibold">账号配置</div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="所属部门" required><DeptSelect depts={depts} value={deptId} onChange={setDeptId} /></Field>
                <Field label="功能权限模板" required>
                  <select value={tpl} onChange={e => setTpl(e.target.value)} className="h-10 w-full rounded-xl border border-input bg-white/70 px-3 text-sm outline-none backdrop-blur focus:border-primary/50">
                    <option value="member">普通成员</option><option value="admin">管理员</option>
                  </select>
                </Field>
              </div>
              <div className="mt-3">
                <Field label="审批意见" extra={<span>{comment.length}/80</span>}><Input value={comment} onChange={e => setComment(e.target.value)} maxLength={80} placeholder="选填，80 字以内" /></Field>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">通过后将在花名册中创建成员并直接激活（状态为「正常」），登录密码为用户申请时设置的密码。</p>
            </section>
          : <section className="rounded-2xl p-4 ring-1 ring-border/60">
              <div className="mb-2 text-sm font-semibold">审批记录</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {[["审批人", reg.reviewer], ["审批时间", reg.reviewedAt], ["审批意见", reg.comment || "—"]].map(([k, v]) => <div key={k}><div className="text-[11px] text-muted-foreground">{k}</div><div className="mt-0.5">{v}</div></div>)}
              </div>
            </section>}
      </div>
      {pending && <DialogFooter>
        <Button variant="outline" className="text-rose-500 hover:border-rose-200 hover:text-rose-600" onClick={() => onReject(comment)}>驳回申请</Button>
        <Button disabled={!deptId} onClick={() => onApprove({ deptId, tpl, comment })}>通过并创建账号</Button>
      </DialogFooter>}
    </DialogContent>
  </Dialog>;
}

/* ═══ 主页面 ═══ */
export default function MemberPage({ onNavigate }) {
  useSuperAgentPageContext({ kind: 'none' });
  const [members, setMembers] = useState(initialMembers);
  const [depts, setDepts] = useState(initialDepts);
  const [regs, setRegs] = useState(initialRegs);
  const [changes, setChanges] = useState(initialChanges);
  const [customTpls, setCustomTpls] = useState([]);
  const [tab, setTab] = useState("roster");
  const [toast, setToast] = useState("");

  /* 花名册筛选 */
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState(new Set()); // 账号状态多选
  const [fDept, setFDept] = useState(new Set());     // 部门多选
  const [rosterView, setRosterView] = useState("list");
  /* 注册审核 */
  const [rTab, setRTab] = useState("pending");
  const [rSearch, setRSearch] = useState("");
  /* 异动记录 */
  const [cSearch, setCSearch] = useState("");
  const [cTypes, setCTypes] = useState(new Set()); // 异动类型多选
  const [cFrom, setCFrom] = useState("");
  const [cTo, setCTo] = useState("");
  const [cDesc, setCDesc] = useState(true);
  /* 弹窗 */
  const [addOpen, setAddOpen] = useState(false);
  const [createResult, setCreateResult] = useState(null);   // { member, pwd }
  const [resetTarget, setResetTarget] = useState(null);
  const [resetResult, setResetResult] = useState(null);     // { member, pwd }
  const [confirmAct, setConfirmAct] = useState(null);       // { type, member }
  const [resignTarget, setResignTarget] = useState(null);
  const [shortage, setShortage] = useState(null);           // { member, receiver, diffs }
  const [detailId, setDetailId] = useState(null);
  const [detailMode, setDetailMode] = useState("view");     // view | edit-basic
  const [permId, setPermId] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [deptDialog, setDeptDialog] = useState(null);       // { mode, dept?, parentId? }
  const [deptForm, setDeptForm] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const [expanded, setExpanded] = useState(new Set([1, 3]));

  const notify = msg => { setToast(msg); setTimeout(() => setToast(""), 2600); };
  const deptName = id => depts.find(d => d.id === id)?.name || "—";
  const updateMember = (id, patch) => setMembers(v => v.map(m => m.id === id ? { ...m, ...patch } : m));
  const pushChange = rec => setChanges(v => [{ id: Date.now() + Math.random(), date: nowStr(), operator: OPERATOR, ...rec }, ...v]);
  const getPerms = m => (m.funcTemplate && TPL_SYS[m.funcTemplate]?.perms) || customTpls.find(t => t.id === m.funcTemplate)?.perms || m.funcPerms;
  const detailMember = members.find(m => m.id === detailId) || null;
  const permMember = members.find(m => m.id === permId) || null;
  const openDetail = (member, mode = "view") => { setDetailMode(mode); setDetailId(member.id); };
  const closeDetail = () => { setDetailId(null); setDetailMode("view"); };

  /* 花名册数据（按加入时间倒序） */
  const deptDescendants = id => { const res = [id]; const walk = pid => depts.filter(d => d.parentId === pid).forEach(d => { res.push(d.id); walk(d.id); }); walk(id); return res; };
  const roster = useMemo(() => {
    const kw = search.trim().toLowerCase();
    const deptIds = fDept.size === 0 ? null : new Set([...fDept].flatMap(id => deptDescendants(id)));
    return members
      .filter(m => (fStatus.size === 0 || fStatus.has(m.status))
        && (!deptIds || deptIds.has(m.deptId))
        && (!kw || [m.name, m.phone, m.email, m.id, m.position].join(" ").toLowerCase().includes(kw)))
      .sort((a, b) => b.joined.localeCompare(a.joined));
  }, [members, search, fStatus, fDept, depts]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 新增成员 ── */
  const createMember = form => {
    const pwd = genPwd();
    const member = {
      id: `ZL${1000 + members.length + 1}`, name: form.name.trim(), deptId: form.deptId, position: form.position.trim(),
      phone: form.phone, email: form.email, status: "unactivated", joined: nowStr(),
      dataScope: "dept", scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms },
      assets: { 助手: 0, 任务: 0, 信息源: 0 }, initPwd: pwd, avatar: `https://i.pravatar.cc/64?u=${Date.now()}`,
    };
    setMembers(v => [...v, member]);
    pushChange({ name: member.name, type: "账号状态变更", before: "无", after: `账号状态：未激活\n姓名：${member.name}\n归属部门：${deptName(form.deptId)}\n数据权限：${SCOPES.dept}\n功能权限：普通成员`, desc: "新增成员，账号状态：无 → 未激活" });
    setAddOpen(false); setCreateResult({ member, pwd });
  };

  /* ── 批量导入 ── */
  const doImport = rows => {
    const created = rows.map((r, i) => ({
      id: `ZL${1000 + members.length + 1 + i}`, name: r.name, deptId: depts.find(d => d.name === r.deptName)?.id || 2, position: r.position,
      phone: validPhone(r.account) ? r.account : "", email: validEmail(r.account) ? r.account : "", status: "unactivated", joined: nowStr(),
      dataScope: "dept", scopeTags: [], funcTemplate: "member", funcPerms: { ...TPL_SYS.member.perms },
      assets: { 助手: 0, 任务: 0, 信息源: 0 }, initPwd: genPwd(), deptName: r.deptName, avatar: `https://i.pravatar.cc/64?u=${r.account}`,
    }));
    setMembers(v => [...v, ...created]);
    created.forEach(m => pushChange({ name: m.name, type: "账号状态变更", before: "无", after: `账号状态：未激活\n姓名：${m.name}\n归属部门：${deptName(m.deptId)}`, desc: "批量导入成员，账号状态：无 → 未激活" }));
    return created;
  };

  /* ── 删除未激活账号 / 停用 / 恢复 / 导出 ── */
  const runConfirm = () => {
    const { type, member } = confirmAct;
    if (type === "disable") {
      if (member.id === CURRENT_USER_ID) {
        notify("不支持停用当前登录账号，请由其他管理员操作");
        setConfirmAct(null);
        return;
      }
      if (member.status !== "active") {
        notify("仅正常账号支持停用");
        setConfirmAct(null);
        return;
      }
      updateMember(member.id, { status: "disabled" });
      pushChange({ name: member.name, type: "账号状态变更", before: `账号状态：${STATUS[member.status].label}`, after: "账号状态：停用", desc: `账号状态【${STATUS[member.status].label}】→【停用】` });
      notify("账号已停用");
    } else if (type === "restore") {
      updateMember(member.id, { status: "active" });
      pushChange({ name: member.name, type: "账号状态变更", before: "账号状态：停用", after: "账号状态：正常", desc: "账号状态【停用】→【正常】" });
      notify("账号已恢复");
    } else if (type === "delete") {
      if (member.status !== "unactivated") {
        notify("仅未激活账号支持删除");
        setConfirmAct(null);
        return;
      }
      setMembers(v => v.filter(m => m.id !== member.id));
      pushChange({
        name: member.name,
        type: "账号状态变更",
        before: `账号状态：未激活\n成员 ID：${member.id}`,
        after: "账号状态：已删除",
        desc: "删除未激活账号，初始密码、组织关系和权限配置已失效",
      });
      closeDetail();
      notify("未激活账号已删除");
    } else if (type === "export") {
      notify(`导出成功，共 ${roster.length} 条，文件已开始下载`);
    }
    setConfirmAct(null);
  };

  /* ── 重置密码 ── */
  const doResetPwd = () => {
    const m = resetTarget; const pwd = genPwd();
    updateMember(m.id, { initPwd: pwd });
    setResetTarget(null); setResetResult({ member: m, pwd });
  };

  /* ── 操作离职 ── */
  const openResign = m => {
    if (m.id === CURRENT_USER_ID) {
      notify("不支持对当前登录账号办理离职，请由其他管理员操作");
      return;
    }
    const admins = members.filter(x => x.status !== "resigned" && getPerms(x).member === "manage");
    if (admins.length === 1 && admins[0].id === m.id) { notify("该成员为企业唯一管理员，不允许直接离职"); return; }
    setResignTarget(m);
  };
  const submitResign = receiverId => {
    const m = resignTarget; const receiver = members.find(x => x.id === receiverId);
    const mp = getPerms(m), rp = getPerms(receiver);
    const funcDiffs = MODULES.filter(mod => LEVEL_RANK[mp[mod.key]] > LEVEL_RANK[rp[mod.key]]).map(mod => `${mod.name}：${LEVELS[rp[mod.key]]} → ${LEVELS[mp[mod.key]]}`);
    const scopeDiff = SCOPE_RANK[m.dataScope] > SCOPE_RANK[receiver.dataScope] ? `${SCOPES[receiver.dataScope]} → ${SCOPES[m.dataScope]}` : null;
    if (funcDiffs.length || scopeDiff) { setShortage({ member: m, receiver, funcDiffs, scopeDiff }); return; }
    doResign(m, receiver, false);
  };
  const doResign = (m, receiver, expand) => {
    if (m.id === CURRENT_USER_ID) {
      setResignTarget(null);
      setShortage(null);
      notify("不支持对当前登录账号办理离职，请由其他管理员操作");
      return;
    }
    if (expand) {
      const mp = getPerms(m), rp = getPerms(receiver);
      const upgraded = Object.fromEntries(MODULES.map(mod => [mod.key, LEVEL_RANK[mp[mod.key]] > LEVEL_RANK[rp[mod.key]] ? mp[mod.key] : rp[mod.key]]));
      const newScope = SCOPE_RANK[m.dataScope] > SCOPE_RANK[receiver.dataScope] ? m.dataScope : receiver.dataScope;
      updateMember(receiver.id, { funcTemplate: null, funcPerms: upgraded, dataScope: newScope });
      pushChange({ name: receiver.name, type: "功能权限调整", before: `功能权限：${MODULES.map(x => `${x.name}：${LEVELS[rp[x.key]]}`).join("、")}`, after: `功能权限：${MODULES.map(x => `${x.name}：${LEVELS[upgraded[x.key]]}`).join("、")}`, desc: "承接离职交接资产，功能权限自动补足" });
      if (newScope !== receiver.dataScope) pushChange({ name: receiver.name, type: "数据权限调整", before: `数据权限：${SCOPES[receiver.dataScope]}`, after: `数据权限：${SCOPES[newScope]}`, desc: `数据权限：【${SCOPES[receiver.dataScope]}】变更为【${SCOPES[newScope]}】` });
    }
    const assetsDesc = Object.entries(m.assets).filter(([, n]) => n > 0).map(([k, n]) => `${n} 个${k}`).join("、") || "无资产";
    updateMember(m.id, { status: "resigned" });
    pushChange({ name: m.name, type: "操作离职", before: `账号状态：${STATUS[m.status].label}`, after: "账号状态：已离职", desc: `员工操作离职，账号状态变更为【已离职】，资产（${assetsDesc}）转移至「${receiver.name}」` });
    setResignTarget(null); setShortage(null);
    notify(`离职操作成功，资产已转移至 ${receiver.name}`);
  };

  /* ── 成员详情编辑保存 ── */
  const saveEdit = form => {
    const m = detailMember;
    const basicDiffs = [];
    if (form.name !== m.name) basicDiffs.push(["姓名", m.name, form.name]);
    if (form.phone !== m.phone) basicDiffs.push(["手机号", m.phone || "无", form.phone || "无"]);
    if (form.email !== m.email) basicDiffs.push(["邮箱", m.email || "无", form.email || "无"]);
    if (form.position !== m.position) basicDiffs.push(["职位", m.position || "无", form.position || "无"]);
    if (basicDiffs.length) pushChange({ name: form.name, type: "成员基础信息变更", before: basicDiffs.map(([k, b]) => `${k}：${b}`).join("\n"), after: basicDiffs.map(([k, , a]) => `${k}：${a}`).join("\n"), desc: basicDiffs.map(([k, b, a]) => `${k}：${b} → ${a}`).join("\n") });
    if (form.deptId !== m.deptId) pushChange({ name: form.name, type: "部门调整", before: `归属部门：${deptName(m.deptId)}`, after: `归属部门：${deptName(form.deptId)}`, desc: `归属部门：${deptName(m.deptId)} → ${deptName(form.deptId)}` });
    updateMember(m.id, form);
    notify("成员信息已更新");
  };

  /* ── 权限配置保存 ── */
  const saveMemberPerm = (m, patch) => {
    if (!m) return;
    if (patch.dataScope !== m.dataScope) pushChange({ name: m.name, type: "数据权限调整", before: `数据权限：${SCOPES[m.dataScope]}`, after: `数据权限：${SCOPES[patch.dataScope]}`, desc: `数据权限：【${SCOPES[m.dataScope]}】变更为【${SCOPES[patch.dataScope]}】` });
    const permDiffs = MODULES.filter(mod => patch.funcPerms[mod.key] !== m.funcPerms[mod.key]);
    if (permDiffs.length) pushChange({ name: m.name, type: "功能权限调整", before: permDiffs.map(mod => `${mod.name}：${LEVELS[m.funcPerms[mod.key]]}`).join("\n"), after: permDiffs.map(mod => `${mod.name}：${LEVELS[patch.funcPerms[mod.key]]}`).join("\n"), desc: permDiffs.map(mod => `${mod.name}权限：${LEVELS[m.funcPerms[mod.key]]} → ${LEVELS[patch.funcPerms[mod.key]]}`).join("\n") });
    updateMember(m.id, patch);
    notify("权限配置已保存");
  };
  const savePerm = patch => saveMemberPerm(permMember, patch);
  const saveTpl = (name, perms) => { const id = `tpl_${Date.now()}`; setCustomTpls(v => [...v, { id, name, perms }]); return id; };
  const deleteTpl = id => {
    setMembers(v => v.map(m => m.funcTemplate === id ? { ...m, funcTemplate: null } : m));
    setCustomTpls(v => v.filter(t => t.id !== id));
    notify("模版已删除，使用该模板的成员已转为自定义配置");
  };

  /* ── 部门管理 ── */
  const submitDept = () => {
    const name = deptForm.trim();
    const { mode, dept, parentId } = deptDialog;
    const pid = mode === "edit" ? dept.parentId : parentId;
    if (depts.some(d => d.parentId === pid && d.name === name && d.id !== dept?.id)) { notify("同级下已存在同名部门"); return; }
    if (mode === "edit") { setDepts(v => v.map(d => d.id === dept.id ? { ...d, name } : d)); notify("部门已更新"); }
    else {
      let depth = 1, p = pid; while (p != null) { depth += 1; p = depts.find(d => d.id === p)?.parentId ?? null; }
      if (depth > 10) { notify("部门层级不能超过 10 层"); return; }
      setDepts(v => [...v, { id: Date.now(), name, parentId: pid }]); setExpanded(s => new Set([...s, pid]));
      notify("部门已创建");
    }
    setDeptDialog(null);
  };
  const deleteDept = dept => {
    if (depts.some(d => d.parentId === dept.id)) { notify("该部门存在子部门，不可删除"); return; }
    if (members.some(m => m.deptId === dept.id)) { notify("该部门下仍有成员，不可删除"); return; }
    setDepts(v => v.filter(d => d.id !== dept.id)); notify("部门已删除");
  };

  /* ── 注册审核 ── */
  const reviewReg = regs.find(r => r.id === reviewId) || null;
  const filteredRegs = useMemo(() => {
    const kw = rSearch.trim().toLowerCase();
    return regs.filter(r => r.status === rTab && (!kw || [r.name, r.phone, r.email].join(" ").toLowerCase().includes(kw)))
      .sort((a, b) => (rTab === "pending" ? b.appliedAt.localeCompare(a.appliedAt) : (b.reviewedAt || "").localeCompare(a.reviewedAt || "")));
  }, [regs, rTab, rSearch]);
  const approveReg = ({ deptId, tpl, comment }) => {
    const r = reviewReg;
    if (members.some(m => (r.phone && m.phone === r.phone) || (r.email && m.email && m.email === r.email))) { notify("该账号已存在，请勿重复创建"); return; }
    const member = {
      id: `ZL${1000 + members.length + 1}`, name: r.name, deptId, position: "", phone: r.phone, email: r.email,
      status: "active", joined: nowStr(), dataScope: "dept", scopeTags: [], funcTemplate: tpl, funcPerms: { ...TPL_SYS[tpl].perms },
      assets: { 助手: 0, 任务: 0, 信息源: 0 }, avatar: `https://i.pravatar.cc/64?u=${r.id}`,
    };
    setMembers(v => [...v, member]);
    setRegs(v => v.map(x => x.id === r.id ? { ...x, status: "approved", reviewer: OPERATOR, reviewedAt: nowStr(), comment } : x));
    pushChange({ name: r.name, type: "账号状态变更", before: "无", after: `账号状态：正常\n姓名：${r.name}\n归属部门：${deptName(deptId)}\n功能权限：${TPL_SYS[tpl].name}`, desc: "注册审核通过并创建账号，账号状态：无 → 正常" });
    setReviewId(null); notify("审核通过，账号已创建"); setPermId(member.id);
  };
  const rejectReg = comment => {
    setRegs(v => v.map(x => x.id === reviewReg.id ? { ...x, status: "rejected", reviewer: OPERATOR, reviewedAt: nowStr(), comment } : x));
    setReviewId(null); notify("已驳回该申请");
  };

  /* ── 异动记录 ── */
  const filteredChanges = useMemo(() => {
    const kw = cSearch.trim().toLowerCase();
    return changes
      .filter(c => (!kw || [c.name, c.operator, c.desc].join(" ").toLowerCase().includes(kw))
        && (cTypes.size === 0 || cTypes.has(c.type))
        && (!cFrom || c.date.slice(0, 10) >= cFrom) && (!cTo || c.date.slice(0, 10) <= cTo))
      .sort((a, b) => cDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [changes, cSearch, cTypes, cFrom, cTo, cDesc]);
  const openMemberByName = name => {
    const m = members.find(x => x.name === name);
    if (m) openDetail(m); else notify("该成员不在花名册中（可能为历史成员）");
  };

  /* 花名册行操作菜单 */
  const rosterOps = m => {
    const isSelf = m.id === CURRENT_USER_ID;
    const items = [{ icon: "ri-user-line", label: "成员详情", fn: () => openDetail(m) }];
    if (m.status !== "resigned") items.push({ icon: "ri-edit-line", label: "编辑", fn: () => openDetail(m, "edit-basic") });
    if (m.status !== "resigned") items.push({ icon: "ri-lock-password-line", label: "重置密码", fn: () => setResetTarget(m) });
    if (m.status === "active" && !isSelf) items.push({ icon: "ri-forbid-line", label: "停用账号", fn: () => setConfirmAct({ type: "disable", member: m }) });
    if (m.status === "disabled") items.push({ icon: "ri-play-circle-line", label: "恢复账号", fn: () => setConfirmAct({ type: "restore", member: m }) });
    if (m.status === "unactivated") items.push({ icon: "ri-delete-bin-line", label: "删除账号", danger: true, fn: () => setConfirmAct({ type: "delete", member: m }) });
    if ((m.status === "active" || m.status === "disabled") && !isSelf) items.push({ icon: "ri-logout-box-r-line", label: "操作离职", danger: true, fn: () => openResign(m) });
    return items;
  };

  const pendingCount = regs.filter(r => r.status === "pending").length;

  const thCls = "px-4 py-3 text-left text-[12px] font-medium text-muted-foreground whitespace-nowrap";
  const tdCls = "px-4 py-3 text-[13px] whitespace-nowrap";

  return <PageShell>
    <GlassHeader />

    {/* ── 二级菜单：与信息源/助手/任务模块统一的顶部 tab 行 ── */}
    <div className="glass-soft sticky top-14 z-30 flex flex-wrap items-center gap-3 border-x-0 border-t-0 px-8 py-2.5">
      <nav className="flex min-w-0 flex-1 items-center gap-1">
        {NAV_TABS.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm transition-colors ${tab === n.id ? "font-medium text-orange-600" : "text-neutral-500 hover:text-neutral-900"}`}>
            <i className={`${n.icon} text-base ${tab === n.id ? "text-orange-500" : "text-neutral-400"}`} />
            <span>{n.label}</span>
            {n.id === "review" && pendingCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{pendingCount}</span>}
            {tab === n.id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}
          </button>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        {tab === "roster" && <>
          <BarSearch value={search} onChange={setSearch} placeholder="搜索姓名 / 电话 / 邮箱 / 账号ID / 职位" />
          <FilterPopover activeCount={fStatus.size + fDept.size}
            onClear={() => { setFStatus(new Set()); setFDept(new Set()); }}
            fields={[
              { key: "status", label: "账号状态", value: fStatus, onChange: setFStatus, options: Object.entries(STATUS).map(([k, v]) => [k, v.label]) },
              { key: "dept", label: "部门", value: fDept, onChange: setFDept, tree: true, options: flattenDeptTree(depts) },
            ]} />
          <div className="flex items-center rounded-xl bg-neutral-100/80 p-0.5">
            <button onClick={() => setRosterView("list")} title="列表视图" className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${rosterView === "list" ? "bg-white text-orange-600 shadow-sm" : "text-neutral-400 hover:text-neutral-600"}`}><i className="ri-list-check-2" /></button>
            <button onClick={() => setRosterView("card")} title="卡片视图" className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${rosterView === "card" ? "bg-white text-orange-600 shadow-sm" : "text-neutral-400 hover:text-neutral-600"}`}><i className="ri-layout-grid-line" /></button>
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setImportOpen(true)}><i className="ri-upload-2-line" />批量导入</Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => roster.length ? setConfirmAct({ type: "export" }) : notify("当前无可导出的成员数据")}><i className="ri-download-2-line" />批量导出</Button>
          <Button size="sm" className="h-8 px-3.5" onClick={() => setAddOpen(true)}><i className="ri-user-add-line text-base" />添加成员</Button>
        </>}
        {tab === "depts" && <Button size="sm" className="h-8 px-3.5" onClick={() => { setDeptForm(""); setDeptDialog({ mode: "create", parentId: 1 }); }}><i className="ri-add-line text-base" />新建部门</Button>}
        {tab === "review" && <BarSearch value={rSearch} onChange={setRSearch} placeholder="搜索姓名 / 手机号 / 邮箱" />}
        {tab === "changes" && <>
          <BarSearch value={cSearch} onChange={setCSearch} placeholder="搜索姓名 / 操作者 / 交接对象" />
          <FilterPopover activeCount={cTypes.size + (cFrom ? 1 : 0) + (cTo ? 1 : 0)}
            onClear={() => { setCTypes(new Set()); setCFrom(""); setCTo(""); }}
            fields={[
              { key: "type", label: "异动类型", value: cTypes, onChange: setCTypes, options: CHANGE_TYPES.map(t => [t, t]) },
              { type: "daterange", key: "date", label: "操作日期", from: cFrom, to: cTo, onFrom: setCFrom, onTo: setCTo },
            ]} />
        </>}
      </div>
    </div>

    <main className="w-full px-8 pb-32 pt-5">
        {/* ═══ 花名册 ═══ */}
        {tab === "roster" && <>
          {rosterView === "list" ? <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[1080px] border-collapse">
              <thead><tr className="bg-white/50">
                <th className={thCls}>账号ID</th><th className={thCls}>成员</th><th className={thCls}>所属部门</th><th className={thCls}>职位</th>
                <th className={thCls}>电话</th><th className={thCls}>邮箱</th><th className={thCls}>账号状态</th><th className={thCls}>加入时间</th><th className={`${thCls} text-right`}>操作</th>
              </tr></thead>
              <tbody>
                {roster.map(m => <tr key={m.id} className="border-t border-border/50 transition hover:bg-white/50">
                  <td className={`${tdCls} font-mono text-muted-foreground`}>{m.id}</td>
                  <td className={tdCls}>
                    <button onClick={() => openDetail(m)} className="flex items-center gap-2.5 hover:text-primary">
                      <Avatar className="h-8 w-8"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name.slice(0, 1)}</AvatarFallback></Avatar>
                      <span className="font-medium">{m.name}</span>
                    </button>
                  </td>
                  <td className={`${tdCls} text-muted-foreground`}>{deptName(m.deptId)}</td>
                  <td className={`${tdCls} text-muted-foreground`}>{m.position || "—"}</td>
                  <td className={`${tdCls} text-muted-foreground`}>{m.phone || "—"}</td>
                  <td className={`${tdCls} text-muted-foreground`}>{m.email || "—"}</td>
                  <td className={tdCls}><Badge variant={STATUS[m.status].variant}>{STATUS[m.status].label}</Badge></td>
                  <td className={`${tdCls} text-muted-foreground`}>{m.joined}</td>
                  <td className={`${tdCls} text-right`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger><Button variant="ghost" size="icon-sm" aria-label="更多操作"><i className="ri-more-fill" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        {rosterOps(m).map(op => <React.Fragment key={op.label}>
                          {op.danger && <DropdownMenuSeparator />}
                          <DropdownMenuItem className={op.danger ? "text-rose-500 hover:bg-rose-50" : ""} onClick={op.fn}><i className={op.icon} />{op.label}</DropdownMenuItem>
                        </React.Fragment>)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>)}
              </tbody>
            </table>
            {roster.length === 0 && <div className="flex flex-col items-center py-16 text-muted-foreground"><i className="ri-user-search-line text-4xl" /><div className="mt-2 text-sm">没有找到符合条件的成员</div></div>}
          </Card>
          : <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {roster.map(m => <Card key={m.id} className="flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => openDetail(m)} className="flex min-w-0 items-center gap-3 text-left">
                    <Avatar className="h-10 w-10"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name.slice(0, 1)}</AvatarFallback></Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold hover:text-primary">{m.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{m.id}</div>
                    </div>
                  </button>
                  <Badge variant={STATUS[m.status].variant}>{STATUS[m.status].label}</Badge>
                </div>
                <div className="mt-3 space-y-1.5 text-[12px] text-muted-foreground">
                  <div className="flex items-center gap-1.5"><i className="ri-node-tree text-[13px]" /><span className="truncate">{deptName(m.deptId)} · {m.position || "—"}</span></div>
                  <div className="flex items-center gap-1.5"><i className="ri-phone-line text-[13px]" /><span className="truncate">{m.phone || "—"}</span></div>
                  <div className="flex items-center gap-1.5"><i className="ri-mail-line text-[13px]" /><span className="truncate">{m.email || "—"}</span></div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><i className="ri-time-line" />{m.joined}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger><Button variant="ghost" size="icon-sm" aria-label="更多操作"><i className="ri-more-fill" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {rosterOps(m).map(op => <React.Fragment key={op.label}>
                        {op.danger && <DropdownMenuSeparator />}
                        <DropdownMenuItem className={op.danger ? "text-rose-500 hover:bg-rose-50" : ""} onClick={op.fn}><i className={op.icon} />{op.label}</DropdownMenuItem>
                      </React.Fragment>)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>)}
              {roster.length === 0 && <div className="col-span-full flex flex-col items-center py-16 text-muted-foreground"><i className="ri-user-search-line text-4xl" /><div className="mt-2 text-sm">没有找到符合条件的成员</div></div>}
            </section>}
        </>}

        {/* ═══ 部门管理 ═══ */}
        {tab === "depts" && <>
          <Card className="p-3">
            <div className="mb-1 px-3 pt-2 text-[12px] text-muted-foreground">支持多级嵌套（≤10 层），同级部门名称唯一；存在子部门或成员的部门不可删除。鼠标悬浮行上可进行操作。</div>
            {depts.filter(d => d.parentId === null).map(root => (
              <DeptNode key={root.id} dept={root} depts={depts} members={members} level={0} expanded={expanded}
                onToggle={id => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; })}
                onAdd={pid => { setDeptForm(""); setDeptDialog({ mode: "create", parentId: pid }); }}
                onEdit={d => { setDeptForm(d.name); setDeptDialog({ mode: "edit", dept: d }); }}
                onDelete={deleteDept} />
            ))}
          </Card>
        </>}

        {/* ═══ 注册审核 ═══ */}
        {tab === "review" && <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-soft inline-flex items-center gap-1 rounded-full p-1">
              {Object.entries(REG_STATUS).map(([key, meta]) => {
                const n = regs.filter(r => r.status === key).length;
                return <button key={key} onClick={() => setRTab(key)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${rTab === key ? "bg-white font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {meta.label}<span className="ml-1 text-[11px] text-muted-foreground">{n}</span>
                </button>;
              })}
            </div>
          </div>
          <Card className="mt-4 overflow-x-auto p-0">
            <table className="w-full min-w-[880px] border-collapse">
              <thead><tr className="bg-white/50">
                <th className={thCls}>姓名</th><th className={thCls}>电话号码</th><th className={thCls}>邮箱</th><th className={thCls}>申请时间</th><th className={thCls}>审核状态</th><th className={thCls}>审批人</th>
              </tr></thead>
              <tbody>
                {filteredRegs.map(r => <tr key={r.id} onClick={() => setReviewId(r.id)} className="cursor-pointer border-t border-border/50 transition hover:bg-white/50">
                  <td className={`${tdCls} font-medium`}>{r.name}</td>
                  <td className={`${tdCls} text-muted-foreground`}>{r.phone || "—"}</td>
                  <td className={`${tdCls} text-muted-foreground`}>{r.email || "—"}</td>
                  <td className={`${tdCls} text-muted-foreground`}>{r.appliedAt}</td>
                  <td className={tdCls}><Badge variant={REG_STATUS[r.status].variant}>{REG_STATUS[r.status].label}</Badge></td>
                  <td className={`${tdCls} text-muted-foreground`}>{r.reviewer || "—"}</td>
                </tr>)}
              </tbody>
            </table>
            {filteredRegs.length === 0 && <div className="flex flex-col items-center py-16 text-muted-foreground"><i className="ri-inbox-2-line text-4xl" /><div className="mt-2 text-sm">暂无{REG_STATUS[rTab].label}的申请</div></div>}
          </Card>
        </>}

        {/* ═══ 异动记录 ═══ */}
        {tab === "changes" && <>
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[1120px] border-collapse">
              <thead><tr className="bg-white/50">
                <th className={thCls}>成员姓名</th><th className={thCls}>异动类型</th>
                <th className={thCls}><button className="flex items-center gap-1 hover:text-foreground" onClick={() => setCDesc(v => !v)}>操作日期<i className={cDesc ? "ri-sort-desc" : "ri-sort-asc"} /></button></th>
                <th className={thCls}>操作者</th><th className={thCls}>变更前内容</th><th className={thCls}>变更后内容</th><th className={thCls}>变更详情描述</th>
              </tr></thead>
              <tbody>
                {filteredChanges.map(c => <tr key={c.id} className="border-t border-border/50 align-top transition hover:bg-white/50">
                  <td className={tdCls}><button className="font-medium text-primary hover:underline" onClick={() => openMemberByName(c.name)}>{c.name}</button></td>
                  <td className={tdCls}><Badge variant="secondary" className="font-normal">{c.type}</Badge></td>
                  <td className={`${tdCls} text-muted-foreground`}>{c.date}</td>
                  <td className={tdCls}><button className="text-primary hover:underline" onClick={() => openMemberByName(c.operator)}>{c.operator}</button></td>
                  <td className={`${tdCls} max-w-[200px] !whitespace-pre-line text-[12px] text-muted-foreground`}>{c.before}</td>
                  <td className={`${tdCls} max-w-[200px] !whitespace-pre-line text-[12px] text-muted-foreground`}>{c.after}</td>
                  <td className={`${tdCls} max-w-[240px] !whitespace-pre-line text-[12px]`}>{c.desc}</td>
                </tr>)}
              </tbody>
            </table>
            {filteredChanges.length === 0 && <div className="flex flex-col items-center py-16 text-muted-foreground"><i className="ri-history-line text-4xl" /><div className="mt-2 text-sm">没有符合条件的异动记录</div></div>}
          </Card>
        </>}
    </main>
    <GlassDock active="members" onNavigate={onNavigate} />

    {/* ═══ 弹窗集合 ═══ */}
    <AddMemberDialog open={addOpen} onOpenChange={setAddOpen} depts={depts} members={members} onCreate={createMember} />
    <PwdResultDialog open={Boolean(createResult)} onOpenChange={() => setCreateResult(null)} title="成员添加成功"
      member={createResult?.member} pwd={createResult?.pwd}
      onConfig={() => { setPermId(createResult.member.id); setCreateResult(null); }} />
    <PwdResultDialog open={Boolean(resetResult)} onOpenChange={() => setResetResult(null)} title="密码重置成功"
      member={resetResult?.member} pwd={resetResult?.pwd} />
    <ImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={doImport} notify={notify} />

    <ConfirmDialog open={Boolean(resetTarget)} onOpenChange={() => setResetTarget(null)} title="重置密码" confirmText="确认重置" onConfirm={doResetPwd}>
      重置后 <b className="text-foreground">{resetTarget?.name}</b> 的原密码立即失效，所有终端将被强制下线，需使用新初始密码重新登录，并在首次登录后强制修改密码。确认重置？
    </ConfirmDialog>
    <ConfirmDialog open={confirmAct?.type === "disable"} onOpenChange={() => setConfirmAct(null)} title="停用账号" danger confirmText="确认停用" onConfirm={runConfirm}>
      停用后 <b className="text-foreground">{confirmAct?.member?.name}</b> 将无法登录系统，基础信息与历史数据保留、仍归属原部门，可随时恢复为「正常」。
    </ConfirmDialog>
    <ConfirmDialog open={confirmAct?.type === "restore"} onOpenChange={() => setConfirmAct(null)} title="恢复账号" confirmText="确认恢复" onConfirm={runConfirm}>
      恢复后 <b className="text-foreground">{confirmAct?.member?.name}</b> 将恢复原有角色与数据权限配置，无需重新分配。
    </ConfirmDialog>
    <ConfirmDialog open={confirmAct?.type === "delete"} onOpenChange={() => setConfirmAct(null)} title="删除未激活账号" danger confirmText="确认删除" onConfirm={runConfirm}>
      删除后，<b className="text-foreground">{confirmAct?.member?.name}</b> 将无法使用当前账号和初始密码登录，已有部门及权限配置会被清除。该操作不可恢复，如需再次邀请，须重新创建账号。
    </ConfirmDialog>
    <ConfirmDialog open={confirmAct?.type === "export"} onOpenChange={() => setConfirmAct(null)} title="批量导出成员" confirmText="确认导出" onConfirm={runConfirm}>
      将按当前筛选条件导出 <b className="text-foreground">{roster.length}</b> 名成员（.xlsx），仅包含您有权限查看的数据。确认后浏览器将自动下载文件。
    </ConfirmDialog>
    <ResignDialog open={Boolean(resignTarget) && !shortage} onOpenChange={() => setResignTarget(null)} member={resignTarget} members={members} onSubmit={submitResign} />
    <Dialog open={Boolean(shortage)} onOpenChange={() => setShortage(null)}>
      <DialogContent className="w-[480px]">
        <DialogHeader><DialogTitle>接收人权限不足</DialogTitle></DialogHeader>
        {shortage && <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">接收人 <b className="text-foreground">{shortage.receiver.name}</b> 当前权限不足以承接全部资产。继续转移将自动补足以下权限（需二次确认）：</p>
          {shortage.funcDiffs.length > 0 && <div className="rounded-xl bg-neutral-50 p-3 ring-1 ring-border/60">
            <div className="mb-1 text-[11px] font-medium text-muted-foreground">功能权限</div>
            {shortage.funcDiffs.map(d => <div key={d} className="text-[13px]">· {d}</div>)}
          </div>}
          {shortage.scopeDiff && <div className="rounded-xl bg-neutral-50 p-3 ring-1 ring-border/60">
            <div className="mb-1 text-[11px] font-medium text-muted-foreground">数据权限</div>
            <div className="text-[13px]">· {shortage.scopeDiff}</div>
          </div>}
        </div>}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShortage(null)}>更换接收人</Button>
          <Button variant="destructive" onClick={() => doResign(shortage.member, shortage.receiver, true)}>仍然转移</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <DetailDialog open={Boolean(detailMember)} onOpenChange={closeDetail} member={detailMember} depts={depts} changes={changes} customTpls={customTpls}
      startEditing={detailMode === "edit-basic"}
      onSaveEdit={saveEdit}
      ops={{
        members,
        onSavePerm: patch => saveMemberPerm(detailMember, patch),
        onResetPwd: () => setResetTarget(detailMember),
        onDisable: () => setConfirmAct({ type: "disable", member: detailMember }),
        onRestore: () => setConfirmAct({ type: "restore", member: detailMember }),
        onDelete: () => setConfirmAct({ type: "delete", member: detailMember }),
        onResign: () => { closeDetail(); openResign(detailMember); },
      }} />

    <PermDialog open={Boolean(permMember)} onOpenChange={() => setPermId(null)} member={permMember} depts={depts} members={members}
      customTpls={customTpls} onSave={savePerm} onSaveTpl={saveTpl} onDeleteTpl={deleteTpl} notify={notify} />

    <ReviewDialog open={Boolean(reviewReg)} onOpenChange={() => setReviewId(null)} reg={reviewReg} depts={depts} onApprove={approveReg} onReject={rejectReg} />

    {/* 部门新建 / 编辑 */}
    <Dialog open={Boolean(deptDialog)} onOpenChange={() => setDeptDialog(null)}>
      <DialogContent className="w-[420px]">
        <DialogHeader><DialogTitle>{deptDialog?.mode === "edit" ? "编辑部门" : "新增子部门"}</DialogTitle></DialogHeader>
        {deptDialog?.mode === "create" && <p className="mb-3 text-[12px] text-muted-foreground">上级部门：{deptName(deptDialog.parentId)}</p>}
        <Field label="部门名称" required extra={<span>{deptForm.length}/15</span>}>
          <Input autoFocus value={deptForm} onChange={e => setDeptForm(e.target.value)} maxLength={15} placeholder="同级下名称需唯一" />
        </Field>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDeptDialog(null)}>取消</Button>
          <Button disabled={!deptForm.trim()} onClick={submitDept}>{deptDialog?.mode === "edit" ? "保存" : "创建"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* 轻提示 */}
    {toast && <div className="fixed bottom-28 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-neutral-900/90 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}
  </PageShell>;
}
