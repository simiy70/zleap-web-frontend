import React, { useState, useRef, useEffect, useMemo } from 'react';
import AssistantPage from './pages/AssistantPage.jsx';
import DesktopPage from './pages/DesktopPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import { PageShell, GlassHeader, GlassDock, CardPagination } from './components/shell';
import { Button as UIButton } from './components/ui/button';
import FeedPage from './pages/FeedPage.jsx';
import MemberPage from './pages/MemberPage.jsx';
import folderOrange from './assets/folders/folder-orange.png';
import folderOrangeLocked from './assets/folders/folder-orange-locked.png';
import folderBlue from './assets/folders/folder-blue.png';

/* ─── SVG ICONS ─── */
const Icon = {
  Search: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Share:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.93a2 2 0 0 1 1.66.9L13 7h7a2 2 0 0 1 2 2v1"/><circle cx="18" cy="15" r="3"/><path d="M22 22c0-1.7-1.8-3-4-3s-4 1.3-4 3"/></svg>,
  Grid:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Clock:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Folder: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  File:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Rss:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor"/></svg>,
  Globe:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Msg:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Audio:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Code:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  More:   () => <svg width="15" height="15" fill="none" viewBox="0 0 15 15"><circle cx="7.5" cy="2.5" r="1.2" fill="currentColor"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="7.5" cy="12.5" r="1.2" fill="currentColor"/></svg>,
  Sort:   ({ active }) => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className={`ml-1 inline-block ${active ? "text-orange-500" : "text-neutral-300"}`}><path d="M5.5 1.5L8 4.5H3L5.5 1.5Z" fill="currentColor"/><path d="M5.5 9.5L3 6.5H8L5.5 9.5Z" fill="currentColor"/></svg>,
  Close:  () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Back:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
  List:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Card:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Filter: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Plus:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Alert:  () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Play:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Check:  () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Mic:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>,
  User:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Link:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Tag2:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Timeline: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Trash:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Pencil:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Move:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Note:     () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  ChevronDown: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronRight: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  Spin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Settings: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  SyncNow:  () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>,
  Plugin:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>,
  GitHub:  () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  /* 知识库图标 */
  Diamond: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 22 9 18 21 6 21 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><polyline points="6 21 12 9 18 21"/></svg>,
  BookOpen:() => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Leaf:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.47 1.32C7.27 18.93 11.34 17 17 17c4.42 0 6.5-3 6.5-6S21.42 5 17 5c-4 0-8 2.5-10 5"/><path d="M3 21c1.5-3 4-5 9-5"/></svg>,
  /* 权限选项图标 (20px 供权限卡片使用) */
  Lock:    () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Users:   () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  GlobeLg:   () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Newspaper: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
};

/* 来源 → { icon, label } */
const sourceInfo = {
  "文档上传":    { Icon: Icon.File,   label: "文档" },
  "RSS 订阅":   { Icon: Icon.Rss,    label: "RSS"  },
  "网页爬虫":   { Icon: Icon.Globe,  label: "网页爬虫" },
  "网页链接":   { Icon: Icon.Globe,  label: "网页爬虫" },
  "搜索引擎":   { Icon: Icon.Search, label: "搜索引擎" },
  "API 接入":   { Icon: Icon.Code,   label: "API接入" },
  "企微机器人":  { Icon: Icon.Msg,    label: "企微机器人" },
  "飞书机器人":  { Icon: Icon.Msg,    label: "飞书机器人" },
  "飞书CLI":    { Icon: Icon.Msg,    label: "飞书CLI" },
  "SaleSmartly":{ Icon: Icon.Msg,    label: "SaleSmartly" },
  "音频上传":   { Icon: Icon.Audio,  label: "音频" },
  "实时录音":   { Icon: Icon.Audio,  label: "实时录音" },
  "笔记":       { Icon: Icon.Note,   label: "笔记" },
  "浏览器插件":  { Icon: Icon.Plugin, label: "浏览器插件" },
  "GitHub":     { Icon: Icon.GitHub,   label: "GitHub" },
  "GitLab":     { Icon: Icon.Code,     label: "GitLab" },
  "Gitee":      { Icon: Icon.Code,     label: "Gitee" },
  "思源笔记":   { Icon: Icon.File,     label: "文档" },
  "飞书知识库": { Icon: Icon.File,     label: "文档" },
  "语雀知识库": { Icon: Icon.File,     label: "文档" },
};

/* ─── DATA ─── */
const folders = [
  { id: 0, name: "默认文件夹", kind: "文件夹", owner: "Simiy",    scope: "mine",       created: "4月1日 00:00",  updated: "今天 09:00", status: "同步完成", count: 2, desc: "系统默认信息源，新增内容的兜底归属",   tags: [], _isDefault: true },
  { id: 1, name: "AI 项目",   kind: "文件夹", owner: "Simiy",    scope: "mine",       created: "5月18日 14:32", updated: "今天 14:32", status: "同步中",  count: 18, desc: "AI 产品、竞品、技术方案和项目讨论资料", tags: ["RSS", "网页爬虫", "API接入", "飞书机器人"] },
  { id: 2, name: "产品资料库", kind: "文件夹", owner: "Simiy",    scope: "mine",       created: "5月12日 11:08", updated: "今天 11:08", status: "同步完成", count: 26, desc: "PRD、用户反馈、设计说明和版本计划",       tags: ["文档", "企微机器人", "音频", "SaleSmartly"] },
  { id: 3, name: "行业资讯",  kind: "文件夹", owner: "运营团队",  scope: "enterprise", created: "5月9日 22:16",  updated: "昨天 22:16",  status: "解析中", count: 43, desc: "RSS、网页订阅和搜索引擎同步内容",         tags: ["RSS", "搜索引擎"] },
];

const infoItems = [
  { id: 100, name: "产品思考笔记",           kind: "笔记",    source: "笔记",        owner: "Simiy",    folderId: 0,    created: "今天 08:55",    updated: "今天 09:00",    status: "同步完成",  desc: "围绕信息管理 2.0 的核心模型与交互逻辑的思考。" },
  { id: 101, name: "少数派 AI 资讯",                 kind: "文章流",   source: "RSS 订阅",    owner: "Simiy",    folderId: 1,    created: "5月10日 09:30", updated: "今天 09:30",    status: "同步中",   desc: "持续同步 AI 工具、效率产品和行业文章。",     _formUrls: "https://sspai.com/feed" },
  { id: 102, name: "竞品官网抓取",                   kind: "网页",     source: "网页爬虫",    owner: "Simiy",    folderId: 2,    created: "5月15日 10:00", updated: "今天 10:22",    status: "解析中",   desc: "抽取网页正文、价格信息、功能模块和更新记录。", _formUrls: "https://www.notion.so/product" },
  { id: 103, name: "zleap 信息管理改版需求文档",      kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 1,    created: "今天 14:30",    updated: "今天 14:32",    status: "同步完成", desc: "信息管理结构调整、文件夹与信息项平级。" },
  { id: 104, name: "GitHub Issues 同步",             kind: "代码讨论", source: "API 接入",    owner: "Simiy",    folderId: 0,    created: "5月8日 20:00",  updated: "昨天 20:01",    status: "同步失败", desc: "同步 Issue、PR 评论和状态。",                _apiUrl: "https://api.github.com/repos/simiy70/zleap-enterprise/issues" },
  { id: 116, name: "客户数据库",                    kind: "数据库",   source: "API 接入",    owner: "Simiy",    folderId: 0,    created: "5月6日 09:20",  updated: "30 分钟前",     status: "同步失败", desc: "客户主数据同步失败，最近一次重试未完成。",          _apiUrl: "https://api.zleap.example.com/customers" },
  { id: 117, name: "会议录音转写",                  kind: "音频",     source: "实时录音",    owner: "Simiy",    folderId: 0,    created: "5月9日 15:00",  updated: "1 小时前",      status: "未同步",   desc: "等待首次同步，尚未发现可解析的录音文件。" },
  { id: 105, name: "行业关键词监控",                 kind: "搜索流",   source: "搜索引擎",    owner: "运营团队", folderId: 3,    created: "5月1日 08:00",  updated: "今天 08:00",    status: "同步完成", desc: "按「AI 信息管理」关键词定期抓取百度/必应资讯。", _keyword: "AI 信息管理 产品动态" },
  { id: 106, name: "Notion AI 功能更新追踪",         kind: "网页",     source: "网页爬虫",    owner: "Simiy",    folderId: 1,    created: "5月5日 18:00",  updated: "昨天 18:45",    status: "同步完成", desc: "追踪 Notion 产品更新页面，自动提取新功能说明。", _formUrls: "https://www.notion.so/releases" },
  { id: 107, name: "OpenAI 官方博客订阅",            kind: "文章流",   source: "RSS 订阅",    owner: "Simiy",    folderId: 1,    created: "5月3日 07:00",  updated: "今天 07:15",    status: "同步完成", desc: "实时同步 OpenAI 官方 Blog 与研究报告。",     _formUrls: "https://openai.com/blog/rss.xml" },
  { id: 108, name: "产品功能迭代规划 Q2",            kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 1,    created: "5月20日 10:45", updated: "5月20日 11:00", status: "同步完成", desc: "Q2 功能清单、优先级排序与里程碑时间线。" },
  { id: 109, name: "AI 搜索市场调研报告 2025",       kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 1,    created: "5月18日 16:00", updated: "5月18日 16:30", status: "解析中",   desc: "覆盖 Perplexity、Kimi、豆包等主流 AI 搜索产品分析。" },
  { id: 110, name: "飞书知识库技术方案",             kind: "文章流",   source: "飞书知识库",  owner: "Simiy",    folderId: 1,    created: "5月14日 15:00", updated: "5月15日 09:20", status: "同步完成", desc: "授权导入飞书团队知识库，支持增量同步。" },
  { id: 111, name: "飞书 · 产品中台知识库",         kind: "文章流",   source: "飞书知识库",  owner: "Simiy",    folderId: 1,    created: "5月10日 11:00", updated: "今天 09:30",    status: "同步失败", desc: "产品中台团队的飞书知识库，已订阅 3 个空间。" },
  { id: 112, name: "design-system",                kind: "代码文档", source: "GitHub",      owner: "Simiy",    folderId: 1,    created: "5月8日 10:00",  updated: "今天 08:30",    status: "同步完成", desc: "zleap 设计系统组件库文档，含组件规范、使用示例和 Changelog。", _formUrls: "simiy70/design-system" },
  { id: 113, name: "zleap-enterprise / feature",   kind: "代码文档", source: "GitLab",      owner: "Simiy",    folderId: 1,    created: "5月6日 14:00",  updated: "昨天 14:00",    status: "同步完成", desc: "企业版功能分支文档，含接口说明和部署指南。", _formUrls: "simiy70/zleap-enterprise" },
  { id: 115, name: "backend-api / staging",        kind: "代码文档", source: "GitLab",      owner: "Simiy",    folderId: 1,    created: "5月2日 11:00",  updated: "5月20日 11:00", status: "同步失败", desc: "后端 API 文档，OAuth Token 已过期，需重新授权。", _formUrls: "simiy70/backend-api" },
  { id: 114, name: "api-docs",                     kind: "代码文档", source: "Gitee",       owner: "Simiy",    folderId: 1,    created: "5月4日 09:00",  updated: "5月20日 09:00", status: "同步失败", desc: "开放 API 接口文档，OAuth Token 已过期。", _formUrls: "simiy70/api-docs" },
  { id: 201, name: "企业微信产品群",                 kind: "会话",     source: "企微机器人",  owner: "Simiy",    folderId: 1,    created: "5月12日 12:00", updated: "今天 12:48",    status: "同步完成", desc: "群聊时间线、参与人、结论、待办与风险点。" },
  { id: 202, name: "飞书研发周会",                   kind: "会话",     source: "飞书机器人",  owner: "研发团队", folderId: 3,    created: "5月19日 10:00", updated: "今天 10:00",    status: "同步中",   desc: "研发团队每周例会记录与任务分配。" },
  { id: 210, name: "飞书产品讨论群",               kind: "会话",     source: "飞书机器人",  owner: "Simiy",    folderId: 1,    created: "5月11日 09:00", updated: "今天 11:30",    status: "同步完成", desc: "产品团队日常讨论群，同步产品需求、设计评审和迭代计划相关消息。" },
  { id: 203, name: "客服工单流",                     kind: "会话",     source: "SaleSmartly", owner: "Simiy",    folderId: 0,    created: "5月2日 17:00",  updated: "昨天 17:30",    status: "同步完成", desc: "客服会话与工单内容的结构化归档。" },
  { id: 204, name: "用户反馈精选 · 5月",            kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 2,    created: "5月21日 10:00", updated: "5月21日 10:10", status: "同步完成", desc: "从工单和用户访谈中提炼的高频反馈与改进建议。" },
  { id: 205, name: "竞品定价策略对比分析",           kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 2,    created: "5月18日 14:00", updated: "5月19日 14:00", status: "同步完成", desc: "Notion、语雀、飞书文档等主流产品定价模型拆解。" },
  { id: 206, name: "B 端销售话术手册 v3",           kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 2,    created: "5月15日 17:00", updated: "5月17日 17:45", status: "同步完成", desc: "针对中大型企业知识管理场景的销售问答与案例。" },
  { id: 207, name: "产品 Demo 视频脚本",            kind: "文档",     source: "文档上传",    owner: "Simiy",    folderId: 2,    created: "5月16日 11:00", updated: "5月16日 11:30", status: "同步失败", desc: "信息管理功能演示脚本，含旁白与镜头切换说明。" },
  { id: 301, name: "产品需求评审录音",               kind: "音频",     source: "音频上传",    owner: "Simiy",    folderId: 2,    created: "今天 14:50",    updated: "今天 15:00",    status: "同步完成", desc: "5月17日产品需求评审会议录音，含结构化摘要。", duration: "01:23:47" },
  { id: 302, name: "投资人路演录音",                 kind: "音频",     source: "实时录音",    owner: "Simiy",    folderId: 0,    created: "5月14日 11:30", updated: "5月14日 11:45", status: "解析中",   desc: "B 轮融资路演现场录音，正在转写中。", duration: "45:12" },
  { id: 303, name: "用户访谈合集",                   kind: "音频",     source: "音频上传",    owner: "研发团队", folderId: null, created: "5月6日 09:00",  updated: "5月6日 09:00",  status: "同步完成", desc: "6 位种子用户深度访谈录音与痛点分析。", duration: "05:48:30" },
  { id: 304, name: "周一站会(误录)",                  kind: "音频",     source: "实时录音",    owner: "Simiy",    folderId: 0,    created: "今天 10:00",    updated: "今天 10:01",    status: "同步完成", desc: "录音内容为空，未识别到有效语音。",     duration: "00:08", _isEmptyRecording: true },
];

// 当前用户（用于跨创建人判断）
const CURRENT_USER = "Simiy";

// 信息源的 scope 从所属文件夹继承（folderId=null 即未归类，使用其原始 owner 决定的隐藏文件夹权限，这里 demo 简化为根据 owner 判定）
function getItemScope(item, folderList = folders) {
  if (item.kind === "文件夹") return item.scope;
  if (item.folderId != null) {
    const folder = folderList.find(f => f.id === item.folderId);
    return folder ? folder.scope : "mine";
  }
  // 未归类源：当成自己的隐藏文件夹，scope 等同其 owner 是否为 CURRENT_USER
  return item.owner === CURRENT_USER ? "mine" : "enterprise";
}

const infoCardTypeIcons = {
  "文档": "ri-file-text-line",
  "音频": "ri-music-2-line",
  "图片": "ri-image-line",
  "笔记": "ri-sticky-note-line",
  "网页": "ri-global-line",
  "会话": "ri-message-3-line",
  "代码": "ri-code-box-line",
  "数据库": "ri-database-2-line",
};

function compactInfoName(name = "") {
  if (name.length <= 16) return name;
  const dotIndex = name.lastIndexOf(".");
  const suffix = dotIndex > 7 ? name.slice(dotIndex) : name.slice(-5);
  return `${name.slice(0, 7)}…${suffix}`;
}

// 计算文件夹的聚合摘要：子项数、异常数、是否含同步中
function getFolderSummary(folder, itemList = infoItems) {
  const children = itemList.filter(i => i.folderId === folder.id);
  const errorCount = children.filter(i => getDisplaySyncStatus(i) === "同步失败").length;
  const syncingCount = children.filter(i => ["同步中", "解析中"].includes(getDisplaySyncStatus(i))).length;
  return { total: children.length || folder.count || 0, errorCount, syncingCount, children };
}

const allObjects = [...folders, ...infoItems];

/* ─── 飞书知识库文档列表（全局，AddModal 和 EditConfigModal 共用）─── */
const _mockFsKbDocs = [
  { id: "d1",  name: "产品需求文档 PRD v2.3 — 信息管理模块重构",   type: "文档",     space: "产品团队 · 知识库", size: "38 KB",  ok: true  },
  { id: "d2",  name: "Q2 技术方案评审记录",                         type: "文档",     space: "技术团队 · Wiki",   size: "12 KB",  ok: true  },
  { id: "d3",  name: "竞品分析 2024 — Notion AI vs Guru vs zleap", type: "文档",     space: "产品团队 · 知识库", size: "62 KB",  ok: true  },
  { id: "d4",  name: "数据库设计说明书 v1.0",                       type: "电子表格", space: "技术团队 · Wiki",   size: "145 KB", ok: true  },
  { id: "d5",  name: "用户访谈记录 × 12（2024 Q1）",               type: "文档",     space: "产品团队 · 知识库", size: "28 KB",  ok: true  },
  { id: "d6",  name: "设计组件规范 v3.1 完整版.prd",               type: "文件",     space: "设计规范 · 组件库", size: "238 MB", ok: false },
  { id: "d7",  name: "新员工入职指引",                              type: "文档",     space: "公司 · 新员工手册", size: "9 KB",   ok: true  },
  { id: "d8",  name: "Sprint 21 回顾与总结",                        type: "文档",     space: "技术团队 · Wiki",   size: "7 KB",   ok: true  },
  { id: "d9",  name: "OKR 2024 H1 — 全员对齐版",                   type: "多维表格", space: "公司 · 新员工手册", size: "56 KB",  ok: true  },
  { id: "d10", name: "API 接口文档 v2.4",                          type: "文档",     space: "技术团队 · Wiki",   size: "33 KB",  ok: true  },
  { id: "d11", name: "品牌色彩规范手册",                            type: "文档",     space: "设计规范 · 组件库", size: "18 KB",  ok: true  },
  { id: "d12", name: "产品路线图 2024 Q2-Q4",                       type: "思维笔记", space: "产品团队 · 知识库", size: "4 KB",   ok: true  },
];

/* ─── DETAIL MOCK DATA ─── */
const articleEntries = {
  101: [
    { id: 1,  title: "GPT-4o 多模态能力深度测评", date: "今天 09:12", summary: "OpenAI 最新模型在图文理解、代码生成和推理能力上全面超越前代，文章对比了 10 项典型任务。", url: "#", status: "已读", syncStatus: null, content: `OpenAI 在 2025 年 5 月正式发布 GPT-4o 的最新更新版本，本次升级聚焦多模态感知能力的全面跃升。编辑团队历时两周，在 10 个典型任务维度进行了横向测评，并与 Claude 3.5 Sonnet、Gemini 1.5 Pro 进行了对比。

一、图文理解：语义对齐能力大幅提升

在图文理解测试中，我们向三款模型同时提供了 50 张包含图表、手写笔记、截图和自然场景的混合图片。GPT-4o 在以下方面表现突出：

- 复杂图表解读：对折线图、饼图、散点图的数据提取准确率达 94.2%，误差控制在 ±3%以内
- 手写文字识别：中文手写识别准确率 91%（同比上一版本提升 22 个百分点）
- 多图关联推理：给定 3 张连续性截图，能准确还原操作意图并给出下一步建议
- 图文一致性检验：识别图文矛盾的准确率达 88%，是三款模型中最高的

相比之下，Claude 3.5 Sonnet 在文字密集型图表的解读上更稳定，而 Gemini 在自然场景的色彩描述和物体计数上略胜一筹。

二、代码生成：质量提升但幻觉问题依然存在

代码生成测试覆盖 Python、TypeScript、SQL、Shell 四个语言，共设计了 40 道题，从基础函数到复杂算法均有涉及。

GPT-4o 的整体通过率为 82.5%，高于 Claude（79.3%）和 Gemini（76.8%）。但值得注意的是：

1. 对于涉及最新库版本的题目（如 React 19、Python 3.13 新特性），三款模型都存在不同程度的知识截止问题
2. GPT-4o 在 SQL 窗口函数和 CTE 的复杂查询中准确率达到 91%，表现最佳
3. 在需要调用外部 API 并处理异步逻辑的场景，GPT-4o 生成的代码结构更清晰，错误处理更完善
4. 幻觉问题：约 8% 的题目中 GPT-4o 会生成「看起来合理但实际不可运行」的代码，这一比率与上一版本基本持平

三、推理能力：链式思维更稳定

在逻辑推理和数学解题测试中（共 30 题），GPT-4o 表现出更稳定的链式思维能力：

- 数学竞赛题（AMC/AIME 难度）：正确率 68%，高于同级别的 Claude（61%）和 Gemini（64%）
- 多步骤逻辑推理：在 10 步以上的问题中，GPT-4o 的中间步骤连贯性更好，出现跳步或矛盾的比例为 12%，低于对照组
- 反事实推理：对「如果 X 不存在，Y 会怎样」类型的问题，GPT-4o 的答案质量最高，能给出有据可查的反事实场景

四、实时响应速度

在 API 延迟测试中（100 次调用取均值）：
- GPT-4o：首 token 延迟 420ms，生成速度 78 token/s
- Claude 3.5 Sonnet：首 token 延迟 380ms，生成速度 85 token/s
- Gemini 1.5 Pro：首 token 延迟 510ms，生成速度 65 token/s

Claude 在响应速度上仍保持优势，但 GPT-4o 的速度改善明显（较上版本提升约 30%）。

五、总结与使用建议

GPT-4o 本次更新是一次实质性的能力跃升，尤其是在多模态理解的深度和广度上。对于以下场景，建议优先选择 GPT-4o：

- 需要同时处理图文的文档分析、会议纪要生成
- 代码审查和重构（尤其是 SQL 和异步代码）
- 需要严格逻辑链条的决策支持

对于纯文字的长文档处理、快速响应场景，Claude 3.5 Sonnet 仍是更经济的选择。Gemini 在 Google Workspace 生态集成方面具有独特优势。

整体而言，2025 年的多模态大模型竞争格局正从「能不能做」走向「做得多精准、多稳定」，这对企业用户的评估方法论也提出了更高要求。` },
    { id: 2,  title: "Claude 3.5 Sonnet 发布，速度提升 50%", date: "今天 07:44", summary: "Anthropic 更新旗舰模型，新增 Computer Use 能力，可直接操控桌面应用。", url: "#", status: "未读", syncStatus: "同步中" },
    { id: 3,  title: "国内大模型价格战白热化：豆包 / Kimi 相继宣布免费", date: "昨天 22:30", summary: "字节与月之暗面先后宣布核心 API 免费，行业观察人士认为这将加速中小厂商洗牌。", url: "#", status: "未读", syncStatus: null },
    { id: 4,  title: "Perplexity AI 融资 5 亿美元，估值达 90 亿美元", date: "昨天 18:00", summary: "AI 搜索赛道持续升温，本轮融资将用于扩充算力与全球化布局。", url: "#", status: "已读", syncStatus: null },
    { id: 5,  title: "Agent 框架对比：LangGraph vs AutoGen vs CrewAI", date: "5月17日 14:20", summary: "三款主流 Agent 框架的架构设计、适用场景和性能基准横向对比。", url: "#", status: "已读", syncStatus: "同步失败" },
    { id: 6,  title: "Mistral Large 2 开源，追平 GPT-4 性能基准", date: "5月17日 10:05", summary: "Mistral AI 发布 128k 上下文版本，Apache 2.0 协议开源，支持本地部署。", url: "#", status: "未读", syncStatus: null },
    { id: 7,  title: "RAG vs 长上下文：哪种方案更适合企业知识库", date: "5月16日 21:40", summary: "从检索精度、成本和延迟三个维度对比两种主流方案，结论因场景而异。", url: "#", status: "未读", syncStatus: null },
    { id: 8,  title: "苹果 WWDC 预告：Siri 将深度接入 ChatGPT", date: "5月16日 15:00", summary: "据爆料，iOS 18 将允许 Siri 在用户授权下调用 OpenAI 能力，处理复杂指令。", url: "#", status: "已读", syncStatus: null },
    { id: 9,  title: "向量数据库选型指南 2025：Qdrant / Weaviate / Pinecone", date: "5月15日 19:30", summary: "少数派编辑团队实测三款主流向量库，从写入速度、过滤查询到多租户支持逐项评分。", url: "#", status: "已读", syncStatus: null },
    { id: 10, title: "效率工具周刊 #88：AI 写作、信息管理与自动化", date: "5月15日 09:00", summary: "本期精选 6 款工具：Notion AI 2.0、Mem.ai 新功能、Make 最新模板库更新等。", url: "#", status: "未读", syncStatus: null },
    { id: 11, title: "OpenAI 推出 o3-mini：推理能力大幅提升，价格降低 80%", date: "5月14日 23:15", summary: "新模型在数学和代码任务上超越 o1，适合对延迟不敏感的批量推理场景。", url: "#", status: "已读", syncStatus: null },
    { id: 12, title: "Google DeepMind 发布 Gemini 2.0 Flash Thinking", date: "5月14日 11:00", summary: "具备链式思维能力的轻量级模型，首测在 AIME 数学竞赛题上正确率达 73%。", url: "#", status: "已读", syncStatus: null },
  ],
  102: [
    { id: 1, title: "竞品主页", date: "今天 10:00", summary: "核心功能模块：知识库管理、团队协作、API 接入，定价 $29/月起。", url: "#", status: "已解析", syncStatus: null, content: `【竞品官网爬取分析报告】抓取时间：2025-05-20 10:00

一、产品定位与核心主张

该竞品将自身定位为「企业级知识协作平台」，主打口号为「让知识流动起来」。首屏强调三个核心场景：团队知识沉淀、跨部门协作、AI 辅助检索。与 zleap 主打「个人+团队信息管理」的定位有所差异，该竞品更侧重企业内部知识库的构建与维护。

二、核心功能模块（首页可见）

1. 知识库管理
   - 支持 Markdown 编辑器，兼容 Notion、Confluence 格式导入
   - 多级文件夹 + 标签双轨制组织
   - 版本历史追踪，保留 60 天修订记录
   - 权限矩阵：部门 → 团队 → 个人三层权限

2. 团队协作
   - 实时多人协同编辑（类 Google Docs 体验）
   - 评论与 @mention 通知
   - 知识贡献排行榜（游戏化激励）
   - 周报自动生成：基于本周新增/修改内容自动汇总

3. API 接入
   - 提供 REST API + Webhook
   - 支持 Slack、飞书、企微 机器人集成
   - Zapier / Make 连接器（官方维护）
   - 数据导出：JSON / CSV / PDF

4. AI 功能（新页面单独展示）
   - 语义搜索（基于向量检索）
   - 文档摘要生成
   - 问答模式（RAG）
   - 「知识图谱」功能（Beta）

三、定价策略

Free：3 人以下团队，10 个知识库，基础协作功能
Pro：$29/人/月（年付折扣 $23），无限知识库，AI 功能，API 访问
Enterprise：联系销售，SSO、审计日志、私有化部署

对比 zleap 当前定价，该竞品的 Pro 档价格偏高约 20-30%，但提供的协作功能更完整。

四、主要差异点分析

| 维度 | 竞品 | zleap |
| 定位 | 企业内部知识库 | 外部信息 + 内部知识融合 |
| 信息源类型 | 主要是手动写作 | 多来源自动同步 |
| AI 深度 | 文档问答为主 | 信息摘要 + 关联分析 |
| 目标客户 | 100人以上企业 | 10-100人团队 / 个人 |

五、可借鉴点

- 贡献排行榜的游戏化机制值得参考，可提升信息源维护的积极性
- 「周报自动生成」功能在 demo 中反响不错，可考虑在 zleap 中增加「信息周刊」生成
- 版本历史追踪是企业客户高频需求，zleap 笔记类信息源应尽快支持` },
    { id: 2, title: "竞品定价页", date: "今天 10:05", summary: "Free / Pro / Enterprise 三档，Pro 月付 $49，年付 $39，企业联系销售。", url: "#", status: "已解析", syncStatus: "同步中" },
    { id: 3, title: "竞品更新日志", date: "昨天 09:00", summary: "5月16日版本：新增 Notion 双向同步、优化移动端体验、修复文件解析超时问题。", url: "#", status: "已解析", syncStatus: null },
  ],
  103: [
    { id: 1, title: "zleap 信息管理改版需求 v1.2.docx", date: "今天 14:32", summary: "文件夹与信息项平级展示、支持多来源标签、新增会话和音频类型。共 42 页。", url: "#", status: "已解析", syncStatus: null, content: `# zleap 信息管理 2.0 产品需求文档

**文档版本：** v1.2
**最后更新：** 2025-05-20
**作者：** Simiy
**评审状态：** 待评审

---

## 一、背景与目标

### 1.1 现状问题

zleap 1.x 版本的信息管理模块在上线 8 个月后，通过用户调研（N=127）和行为数据分析，暴露出以下核心痛点：

**信息组织维度：**
- 所有信息源以平铺列表呈现，当来源数量超过 20 个时，用户反馈"找不到"的占比达到 61%
- 仅支持单一"文件夹"层级，无法表达信息源之间的关联关系
- 缺乏标签系统，按主题检索时只能依赖全文搜索，精确度不足

**信息类型维度：**
- 1.x 仅支持"网页"和"文档"两类信息源
- 用户调研中 43% 的受访者表示有将企业微信群聊内容纳入 AI 知识库的需求
- 音频会议纪要的整理场景被频繁提及（占比 38%）

**权限管理维度：**
- 信息源权限粒度过粗，只有"公开"/"私密"两档
- 团队场景下，不同成员创建的信息源权限归属不清晰，导致误删事件 3 起
- 缺少"继承"机制，每新增一个信息源都需手动设置权限

### 1.2 改版目标

本次改版聚焦三个核心目标：

1. **组织效率提升**：通过文件夹 + 标签双轨制，将用户定位目标信息源的平均时间从 23 秒降低至 8 秒以内
2. **信息类型扩展**：新增会话（企业微信/钉钉机器人）、音频（录音/会议）、笔记三种类型，覆盖企业 85% 以上的知识沉淀场景
3. **权限分层**：构建文件夹级权限 → 信息源继承的分层模型，减少权限误操作

### 1.3 成功指标

| 指标 | 当前基线 | 目标值 | 衡量周期 |
|------|---------|--------|---------|
| 信息源定位时长（P50） | 23s | ≤8s | 上线后 30 天 |
| 权限相关误操作工单 | 3 起/月 | 0 起/月 | 上线后 60 天 |
| 新类型信息源创建比例 | 0% | ≥25% | 上线后 60 天 |
| DAU/MAU 留存 | 41% | ≥55% | 上线后 90 天 |

---

## 二、信息架构重设计

### 2.1 核心概念模型

【代码】
工作空间（Workspace）
  └── 信息空间（Information Space）
        ├── 文件夹（Folder）           ← 显式层级，用户主动创建
        │     ├── 信息源（Source）A
        │     ├── 信息源（Source）B
        │     └── 信息源（Source）C
        └── 未归类（Uncategorized）    ← 隐式层级，默认存放
              └── 信息源（Source）D
【代码】

**关键约束：**
- 文件夹不支持嵌套（最多一层），降低认知负担
- 一个信息源只能归属一个文件夹（或未归类）
- 文件夹权限对其内所有信息源生效，信息源不能单独覆盖

### 2.2 信息源类型矩阵

| 类型 | 子类型 | 同步方式 | 增量更新 | 支持时间线 |
|------|--------|---------|---------|-----------|
| 文档 | PDF / Word / Markdown | 手动上传 | ✗ | ✗ |
| 网页 | 单页 / RSS / 全站爬取 | 定时拉取 | ✓ | ✓ |
| 会话 | 企业微信 / 钉钉 / Slack | Webhook | ✓ | ✓ |
| 音频 | 本地录音 / 实时录制 | 手动上传 | ✗ | ✓ |
| 笔记 | 内建编辑器 | 实时保存 | ✓ | ✓ |
| API | JSON / GraphQL | 定时拉取 | ✓ | ✓ |

---

## 三、功能详细设计

### 3.1 列表视图重构

#### 3.1.1 分区展示

将原有混合列表拆分为两个 Section：

**Section A：文件夹**
- 展示顺序：按最近更新倒序
- 每行显示：名称、信息源数量、权限徽章、聚合状态（各状态计数）、最近更新时间
- 展开/折叠：点击行展开查看文件夹内信息源列表（不导航，在当前页内联展开）

**Section B：未归类信息源**
- 展示顺序：按最近更新倒序
- 每行显示：图标（按类型）、名称、来源类型、状态徽章、最近更新时间

#### 3.1.2 聚合状态组件（FolderStatusSummary）

文件夹行的状态列替换为聚合状态点：

【代码】
✓14  ↻3  !1
【代码】

颜色规则：
- ✓ 同步完成 → 「text-emerald-500」
- ↻ 同步中 → 「text-blue-400」
- ! 同步失败 → 「text-red-400」

当文件夹内全部成功时，只显示 「✓N」，不显示其他。

#### 3.1.3 列结构变更

| 列 | 旧版 | 新版 | 备注 |
|----|------|------|------|
| 名称 | 纯文本 | 文本 + 权限徽章 | 权限徽章内嵌于名称右侧 |
| 位置 | 文件夹名 | 权限（文件夹行）/ 来源（源行）| 语义更准确 |
| 状态 | StatusBadge | 文件夹→聚合；源→Badge | 区分渲染 |

### 3.2 权限系统

#### 3.2.1 权限层级

【代码】
文件夹权限（可设置）
    ↓ 继承
信息源权限（只读，显示"继承自文件夹"）
【代码】

未归类信息源（无显式文件夹）的权限独立可设。

#### 3.2.2 权限变更交互

点击文件夹权限徽章 → 弹出 Popover：

【代码】
┌────────────────────────────────────┐
│  修改文件夹权限                      │
│                                    │
│  当前：私密                          │
│  修改为：企业公开                    │
│                                    │
│  ⚠ 此操作将同步影响文件夹内            │
│    3 个信息源的权限，无法单独还原。     │
│                                    │
│         [取消]  [确认修改]           │
└────────────────────────────────────┘
【代码】

#### 3.2.3 跨创建人防御

**规则：** 不同 owner 的信息源不能放入同一文件夹。

三个入口的防御策略：
1. **添加信息弹窗**：文件夹选项只展示 「owner === currentUser」 的文件夹，其他置灰并有 tooltip
2. **移动操作**：同上，只展示同 owner 文件夹
3. **新建文件夹**：owner 固定为 currentUser，无需 UI 限制

### 3.3 添加信息流程重设计

#### 3.3.1 类型选择

第一步选择信息类型（6 宫格卡片），选中后展开对应配置表单。

类型图标颜色统一为 「neutral-100 / neutral-500」，不使用彩色区分，减少视觉噪音。

#### 3.3.2 同步配置

**同步频率**（仅适用于可定时同步的类型）：

旧版：数字输入框 + 单位下拉（「3」 + 「天」）
新版：预设芯片组 「每小时 / 每天 / 每周 / 每月」

**首次同步时间**：

旧版：「datetime-local」 原生控件
新版：预设芯片 「立即开始 / 今晚 22:00 / 明早 09:00 / 自定义」；选择"自定义"时展开 datetime-local 输入框

#### 3.3.3 保存位置

文件夹选项右侧显示创建人头像，跨用户文件夹置灰。

---

## 四、新增信息类型详细设计

### 4.1 会话类（企业微信 / 钉钉）

**接入方式：** Webhook 机器人，用户将 Bot 拉入群后，群内消息实时推送至 zleap。

**数据结构：**
【JSON】
{
  "sessionId": "xxx",
  "platform": "wecom",
  "groupName": "产品需求评审群",
  "messages": [
    {
      "id": "msg_001",
      "sender": "张三",
      "content": "这个需求优先级怎么定？",
      "timestamp": "2025-05-19T10:23:11Z",
      "type": "text"
    }
  ]
}
【代码】

**展示形态：**
- 列表视图：会话条目（按日期分组）
- 详情视图：仿 IM 气泡布局，区分发送方

**AI 处理：**
- 定期（每日凌晨）对会话内容做摘要，生成"会议纪要"条目
- 支持手动触发摘要生成

### 4.2 音频类

**接入方式：** 手动上传（m4a / mp3 / wav / mp4）或通过 iOS 快捷指令实时推送录音。

**处理流程：**
【代码】
上传 → 音频转写（Whisper）→ 分段摘要 → 向量索引
【代码】

**转写状态：**
- 排队中 → 转写中 → 转写完成 → 索引中 → 已完成
- 失败时显示失败原因和重试按钮

**展示形态：**
- 详情页顶部：内置音频播放器（支持拖拽进度、倍速）
- 下方：转写文本全文（带时间戳）

### 4.3 笔记类

**定位：** 轻量级内建编辑器，用于记录思考、整理摘要，不竞争 Notion 等专业工具。

**编辑器能力：**
- 富文本：标题（H1/H2）、粗体、斜体、无序列表、有序列表、代码块、引用块
- 图片：粘贴上传
- 字数统计

**视图切换：**
- 编辑视图（默认）
- 时间线视图：展示笔记的历史修改节点（按日期分组），点击可查看历史快照

---

## 五、非功能性需求

### 5.1 性能

| 场景 | 指标 |
|------|------|
| 列表首屏渲染（≤500 条） | ≤300ms |
| 文件夹展开动画 | ≤150ms，60fps |
| 文章详情页加载 | ≤500ms |
| 音频转写（1小时音频） | ≤8分钟 |

### 5.2 兼容性

- 桌面端：Chrome 110+, Edge 110+, Safari 16+
- 移动端：iOS Safari 15+, Chrome Android 110+
- 屏幕分辨率：最低 1280×800

### 5.3 无障碍

- 所有可交互元素有 aria-label
- 颜色不作为唯一信息传达手段（状态同时用图标+颜色）
- 键盘导航支持（Tab 顺序合理，Escape 关闭浮层）

---

## 六、开放问题与待决策项

| # | 问题 | 候选方案 | 决策方 | 截止 |
|---|------|---------|--------|------|
| 1 | 文件夹是否支持排序（手动拖拽）？ | A. 支持；B. 仅按更新时间 | 产品 | 5/22 |
| 2 | 音频转写服务选型 | A. 自建 Whisper；B. 接第三方 API | 技术 | 5/25 |
| 3 | 会话类是否支持私信（非群聊）？ | A. 支持；B. 仅群聊 | 产品 | 5/22 |
| 4 | 笔记是否支持导出（PDF/Markdown）？ | A. 支持；B. 暂不支持 | 产品 | 5/29 |

---

## 七、附录

### A. 竞品参考

- **Notion AI**：文档类组织逻辑成熟，但 AI 知识库能力偏弱
- **Mem.ai**：自动关联笔记，交互新颖但学习曲线陡
- **Guru**：企业知识库定位，权限系统完善，UI 偏保守

### B. 用户调研摘要

调研时间：2025-04-08 至 2025-04-15
有效样本：127 人（内部 32 人 + 付费用户 95 人）

Top 5 需求（按提及频率）：
1. 文件夹分组（79%）
2. 群聊接入（43%）
3. 音频上传（38%）
4. 权限精细化（35%）
5. 标签系统（31%）

### C. 变更记录

| 版本 | 日期 | 改动摘要 |
|------|------|---------|
| v1.0 | 2025-04-28 | 初稿，含基础架构和列表视图设计 |
| v1.1 | 2025-05-10 | 新增权限系统详细设计，补充竞品分析 |
| v1.2 | 2025-05-20 | 补充音频类详细流程，更新性能指标，新增开放问题 |` },
  ],
  104: [
    { id: 1, title: "#312 — 支持批量导入 CSV", date: "昨天 20:01", summary: "Feature request: 用户希望能批量上传 CSV 文件并自动映射字段。已有 23 个 👍。", url: "#", status: "Open", syncStatus: "同步失败", content: `标题：支持批量导入 CSV 并自动字段映射
状态：Open · Feature Request · P2
创建人：@user-lihua · 2025-05-19 · 👍 23  💬 14 条评论

【问题描述】

我们团队目前每周需要将 CRM 系统导出的客户沟通记录（CSV 格式，约 200-500 行）手动粘贴到 zleap，非常低效。希望 zleap 能支持直接上传 CSV 文件，并自动识别列名和字段类型。

【期望行为】

1. 上传入口：在信息源的「添加信息」弹窗中新增「CSV 导入」选项
2. 字段映射：上传后展示字段预览表，允许用户将 CSV 列映射到 zleap 字段（如「标题」「内容」「日期」「来源」）
3. 去重处理：根据某一唯一键（如 ID 列）自动去重，避免重复导入
4. 批量预览：映射确认后，展示前 10 条记录预览，用户确认后正式导入
5. 导入报告：完成后显示「成功 N 条 / 跳过 M 条（重复）/ 失败 K 条」

【当前行为】

只能手动逐条创建笔记或文档上传，CSV 内的结构化数据无法批量处理。

【用例场景】

- 销售团队导入客户拜访记录（来自 Salesforce 导出）
- 运营团队导入用户反馈汇总表（来自问卷星 / 腾讯问卷）
- 研究团队导入文献阅读笔记（来自 Zotero 导出）

【评论精选】

@dev-simiy（维护者）：这个需求排在 Q3 功能路线图里，预计 7 月开始设计。核心难点在于字段映射的 UX 设计，目前在调研竞品方案。

@user-chenzhao：+1，特别是字段类型自动推断（日期/数字/文本）这个很重要，不然映射后数据搜索效果会很差。

@user-wangfei：建议支持定时导入（比如每周一自动从某个 FTP/S3 路径拉一次 CSV），这样就不需要手动上传了。

@dev-li：技术上 CSV 解析用 papaparse 可以搞定，主要工作量在字段映射界面和批量写入的性能优化，预估 2 周工作量。

【关联】
- Relates to #287（支持 Excel 导入）
- Blocks #319（数据分析看板，依赖结构化数据录入）` },
    { id: 2, title: "#308 — 修复搜索高亮 Bug", date: "5月16日 18:30", summary: "关键词搜索结果中，中文高亮在部分浏览器下出现偏移，已由 @dev-wang 认领。", url: "#", status: "In Progress", syncStatus: null },
    { id: 3, title: "#301 — API 速率限制策略文档", date: "5月15日 11:00", summary: "补充公开 API 文档中关于速率限制的详细说明。", url: "#", status: "Closed", syncStatus: null },
  ],
  105: [
    { id: 1, title: "「AI 信息管理」百度资讯 — 第 24 期", date: "今天 08:00", summary: "共抓取 18 条资讯，包括多篇关于 RAG 架构优化和知识库产品的深度报道。", url: "#", status: "新增", syncStatus: "同步中", content: `搜索词：AI 信息管理 / 知识库 / 企业知识管理
抓取引擎：百度资讯
抓取时间：2025-05-20 08:00
本期抓取：18 条（去重后 15 条）

━━━━━━━━━━━━━━━━━━━━━
01 【深度】RAG 2.0：从简单检索到多跳推理的技术演进
来源：机器之心  时间：05-19 23:41
摘要：传统 RAG 架构在处理跨文档关联推理时存在明显短板。最新的 RAG 2.0 方案引入多跳检索（Multi-hop Retrieval）机制，能够在单次查询中跨越多个文档建立推理链。文章详细拆解了 HippoRAG、GraphRAG 和 RAPTOR 三种主流实现方案的架构差异，并给出在不同场景下的选型建议。

02 【融资】企业知识管理平台「知了」完成 A 轮 1.2 亿融资
来源：36氪  时间：05-19 22:15
摘要：专注企业内部知识沉淀的 SaaS 产品「知了」宣布完成 A 轮融资，由红杉领投，估值约 8 亿元。该产品主打「会议 → 文档 → 搜索」全流程自动化，已服务 500+ 企业客户，ARR 突破 3000 万。

03 【测评】2025 年向量数据库横评：Qdrant vs Weaviate vs Milvus vs Pinecone
来源：少数派  时间：05-19 20:30
摘要：4 款主流向量数据库在百万级向量场景下的写入速度、查询延迟、过滤能力和多租户支持横向测评。结论：Qdrant 在综合性能和易用性上略胜，Milvus 适合超大规模部署，Pinecone 的托管体验最佳。

04 【产品】Notion AI 发布「Knowledge Q&A」功能，支持跨 workspace 问答
来源：爱范儿  时间：05-19 18:00
摘要：Notion AI 新增跨 workspace 的知识问答模式，用户可以直接向 AI 提问，由 AI 从整个工作区中检索相关页面并组织回答。支持引用溯源，每个答案段落都标注了来源页面链接。

05 【技术】混合检索（Hybrid Search）实践：BM25 + 向量双路召回的工程实现
来源：InfoQ  时间：05-19 16:45
摘要：在生产环境中落地混合检索的完整工程方案，包括两路召回结果的归一化方法（RRF 算法）、在线/离线索引更新策略，以及在 Elasticsearch + pgvector 双栈架构下的具体配置示例。

06 【观点】知识管理的本质是「降低知识的摩擦力」
来源：少数派  时间：05-19 14:20
摘要：作者认为所有知识管理工具的核心价值在于降低「录入摩擦」「检索摩擦」和「应用摩擦」三类摩擦力。现有工具普遍在录入端做得不错，但检索和应用的摩擦力依然很高，这是 AI 介入的最大机会点。

07-15 【其他资讯摘要】
- 钉钉发布知识库 3.0，支持 AI 问答和自动更新 (05-19)
- 飞书知识空间新增「知识地图」可视化功能 (05-18)
- 企业微信宣布文档能力重大升级，引入多人实时协同 (05-18)
- OpenAI 企业版新增知识库 API，支持精细化权限控制 (05-17)
- Mem.ai 发布 2.0，主打自动关联相关笔记 (05-17)
- 国内某 AI 创业公司「摘星」完成 Pre-A 轮融资 3000 万 (05-16)
- 2025 年企业知识管理软件采购指南（电子书下载）(05-16)
- 硅谷 VC 报告：知识工作者效率工具赛道 2025 年展望 (05-15)
- RAG vs Fine-tuning：企业知识库场景下的技术选型对比 (05-15)` },
    { id: 2, title: "「AI 信息管理」必应资讯 — 第 24 期", date: "今天 08:00", summary: "抓取 11 条，其中 3 条与百度重复已自动去重。", url: "#", status: "新增", syncStatus: null },
    { id: 3, title: "「AI 信息管理」百度资讯 — 第 23 期", date: "昨天 08:00", summary: "抓取 14 条，重点关注企业知识管理平台融资动态。", url: "#", status: "已归档", syncStatus: "同步失败" },
  ],
  // ── 飞书知识库技术方案（id:110）──
  110: [
    { id: 1, title: "信息管理模块重构技术方案 v2.0", date: "今天 09:20", summary: "涵盖连接器架构升级、向量检索优化和增量同步策略，评审通过后进入排期。", syncStatus: null, content: `# 信息管理模块重构技术方案 v2.0\n\n**状态：** 待评审\n**作者：** 技术平台组\n**更新时间：** 2025-05-20\n\n## 一、背景\n\n当前信息管理模块在连接器数量超过 15 个、用户信息量超过 10 万条后出现明显性能瓶颈，主要表现为同步任务积压、向量检索 P95 延迟超过 800ms。本次重构目标：降低同步延迟 50%、检索 P95 ≤ 300ms。\n\n## 二、架构变更\n\n### 2.1 连接器层\n- 统一任务队列：Kafka → 独立 Topic per 连接器类型\n- 引入优先级机制：手动触发 > 定时任务\n- 失败重试：指数退避（30s / 60s / 5min），最大重试 3 次\n\n### 2.2 存储层\n- 向量库：Qdrant → 迁移至 Weaviate（更好的多租户支持）\n- 原始文档：OSS 冷热分层，30 天未访问自动转冷存储\n- 索引策略：段落级 + 文档级双重向量，支持混合检索\n\n### 2.3 同步引擎\n- 增量同步：基于 ETag / Last-Modified 判断变更\n- 文档去重：内容哈希（SHA-256）+ 语义相似度双重判断\n\n## 三、里程碑\n\n| 阶段 | 时间 | 交付物 |\n|------|------|--------|\n| 设计 | 5月 | 技术方案 + 接口文档 |\n| 开发 | 6月 | 连接器层 + 存储层 |\n| 测试 | 7月 | 压测报告 |\n| 上线 | 8月 | 灰度发布 |` },
    { id: 2, title: "飞书知识库 OAuth 接入文档", date: "5月15日 09:00", summary: "详细记录 App ID / App Secret / User Access Token 的获取流程及 refresh_token 自动续期实现。", syncStatus: null },
    { id: 3, title: "向量检索性能压测报告 Q2", date: "5月12日 14:30", summary: "Qdrant vs Weaviate 横向对比，10 万条文档场景下 Weaviate P95 延迟降低 42%。", syncStatus: null },
    { id: 4, title: "连接器错误分类与重试策略设计", date: "5月10日 11:00", summary: "将失败原因分为网络超时、鉴权失效、数据源异常等五类，分别定义重试行为。", syncStatus: null },
    { id: 5, title: "增量同步方案调研笔记", date: "5月8日 16:00", summary: "对比基于 ETag、Webhook 和轮询三种增量同步方式的实现成本与可靠性。", syncStatus: null },
    { id: 6, title: "信息管理 2.0 数据库 Schema 设计", date: "5月5日 10:00", summary: "新增 source_configs、sync_logs、item_vectors 三张核心表，字段定义与索引策略。", syncStatus: "同步中" },
  ],
  // ── 飞书·产品中台知识库（id:111，同步失败）──
  111: [
    { id: 1, title: "产品中台 Q2 OKR 对齐文档", date: "今天 09:30", summary: "Q2 核心目标：信息管理 2.0 上线、API 能力开放、企业版权限体系完善。", syncStatus: null },
    { id: 2, title: "信息管理 PRD v1.5 评审记录", date: "5月18日 15:00", summary: "本次评审通过文件夹层级调整和连接器多步配置方案，遗留问题：权限继承逻辑待确认。", syncStatus: null },
    { id: 3, title: "竞品功能矩阵 2025-Q2", date: "5月14日 11:00", summary: "覆盖 Notion AI、Guru、Confluence 等 8 款产品，重点对比 AI 检索与知识沉淀能力。", syncStatus: null },
  ],
  // ── GitHub: design-system（id:112）─ 每条目 = 一次同步的变更摘要 ──
  112: [
    { id: 1, title: "同步 · 今天 08:30", date: "今天 08:30", summary: "新增 2 个文档、更新 1 个", _isCodeDiff: true, _stats: { added: 2, modified: 1, deleted: 0 }, _changes: [
      { type: "added",    path: "docs/components/Button.md", note: "新增 Button 组件完整 API 文档" },
      { type: "added",    path: "docs/components/Modal.md",  note: "新增 Modal 组件规范" },
      { type: "modified", path: "README.md",                  note: "补充 Storybook 预览地址与快速上手代码示例" },
    ]},
    { id: 2, title: "同步 · 5月19日 11:00", date: "5月19日 11:00", summary: "更新 3 个文档", _isCodeDiff: true, _stats: { added: 0, modified: 3, deleted: 0 }, _changes: [
      { type: "modified", path: "docs/tokens/colors.md",     note: "新增中性色阶 50–950 的扩展定义" },
      { type: "modified", path: "docs/tokens/typography.md", note: "正文行高从 1.5 调整为 1.6" },
      { type: "modified", path: "CHANGELOG.md",               note: "v2.3.0 发布说明" },
    ]},
    { id: 3, title: "同步 · 5月14日 14:00", date: "5月14日 14:00", summary: "新增 1 个文档", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "docs/guides/theming.md", note: "新增主题定制指南，支持暗色模式切换" },
    ]},
    { id: 4, title: "首次同步 · 5月8日 10:00", date: "5月8日 10:00", summary: "初始化拉取 4 个文档", _isCodeDiff: true, _stats: { added: 4, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "README.md",                       note: "项目说明与安装指引" },
      { type: "added", path: "docs/tokens/colors.md",           note: "色彩 Token 表" },
      { type: "added", path: "docs/tokens/typography.md",       note: "字体规范" },
      { type: "added", path: "CHANGELOG.md",                    note: "历史版本记录" },
    ]},
  ],
  // ── GitLab: zleap-enterprise / feature（id:113）──
  113: [
    { id: 1, title: "同步 · 昨天 14:00", date: "昨天 14:00", summary: "新增 1 个文档、更新 2 个", _isCodeDiff: true, _stats: { added: 1, modified: 2, deleted: 0 }, _changes: [
      { type: "added",    path: "docs/auth/permission-matrix.md", note: "新增权限矩阵设计文档" },
      { type: "modified", path: "README.md",                       note: "补充 LDAP 对接说明" },
      { type: "modified", path: "docs/api/enterprise-openapi.yaml", note: "新增 Webhook 配置接口" },
    ]},
    { id: 2, title: "同步 · 5月19日 15:00", date: "5月19日 15:00", summary: "新增 1 个文档", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "docs/deploy/docker-compose.yml", note: "新增 Docker Compose 一键部署模板" },
    ]},
    { id: 3, title: "同步 · 5月15日 16:00", date: "5月15日 16:00", summary: "新增 1 个文档", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "docs/ldap/integration.md", note: "LDAP / AD 对接指南" },
    ]},
    { id: 4, title: "首次同步 · 5月6日 14:00", date: "5月6日 14:00", summary: "初始化拉取 2 个文档", _isCodeDiff: true, _stats: { added: 2, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "README.md",                       note: "企业版功能分支说明" },
      { type: "added", path: "docs/api/enterprise-openapi.yaml", note: "OpenAPI 3.0 接口规范" },
    ]},
  ],
  // ── GitLab: backend-api / staging（id:115，同步失败）──
  115: [
    { id: 1, title: "同步 · 5月20日 11:00", date: "5月20日 11:00", summary: "新增 1 个文档、删除 1 个", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 1 }, _changes: [
      { type: "added",   path: "docs/api/info-sources.md", note: "新增信息源接口文档（staging 分支灰度功能）" },
      { type: "deleted", path: "docs/legacy/v1-api.md",    note: "废弃的 v1 接口文档已移除" },
    ]},
    { id: 2, title: "同步 · 5月19日 10:00", date: "5月19日 10:00", summary: "更新 1 个文档", _isCodeDiff: true, _stats: { added: 0, modified: 1, deleted: 0 }, _changes: [
      { type: "modified", path: "docs/api/auth.md", note: "更新 OAuth 2.0 授权码流程图与 Token 刷新策略" },
    ]},
    { id: 3, title: "首次同步 · 5月2日 11:00", date: "5月2日 11:00", summary: "初始化拉取 2 个文档", _isCodeDiff: true, _stats: { added: 2, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "README.md",         note: "后端 API 服务说明" },
      { type: "added", path: "docs/api/auth.md",  note: "鉴权接口说明" },
    ]},
  ],
  // ── Gitee: api-docs（id:114，同步失败）──
  114: [
    { id: 1, title: "同步 · 5月20日 09:00", date: "5月20日 09:00", summary: "更新 1 个文档", _isCodeDiff: true, _stats: { added: 0, modified: 1, deleted: 0 }, _changes: [
      { type: "modified", path: "README.md", note: "补充 SDK 下载地址与速率限制说明" },
    ]},
    { id: 2, title: "同步 · 5月18日 15:00", date: "5月18日 15:00", summary: "新增 1 个文档", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "docs/endpoints/info-sources.md", note: "信息源相关接口：列表、创建、更新、删除及批量操作" },
    ]},
    { id: 3, title: "同步 · 5月16日 10:00", date: "5月16日 10:00", summary: "新增 1 个文档", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "docs/endpoints/webhook.md", note: "Webhook 配置接口：事件类型、签名验证、重试策略" },
    ]},
    { id: 4, title: "首次同步 · 5月4日 09:00", date: "5月4日 09:00", summary: "初始化拉取 1 个文档", _isCodeDiff: true, _stats: { added: 1, modified: 0, deleted: 0 }, _changes: [
      { type: "added", path: "README.md", note: "zleap 开放 API 总览" },
    ]},
  ],
};

const conversationSessions = {
  201: [
    { id: 1, title: "产品方向讨论", date: "今天 12:30", participants: ["Simiy", "晓雯", "Tao"], msgCount: 48, summary: "确认 Q3 主要方向为信息结构化，暂缓海外版计划。", tags: ["决策", "Q3规划"], syncStatus: "同步完成" },
    { id: 2, title: "zleap 新功能意见收集", date: "今天 10:15", participants: ["Simiy", "Leo", "晓雯", "陈朝"], msgCount: 73, summary: "用户反馈最强烈的是批量导入和搜索体验，已整理为 Issue。", tags: ["用户反馈", "需求"], syncStatus: "解析中" },
    { id: 3, title: "运营数据周报分享", date: "昨天 17:40", participants: ["Simiy", "陈朝"], msgCount: 12, summary: "本周 MAU 增长 18%，付费转化率从 2.1% 提升至 2.8%。", tags: ["数据", "运营"], syncStatus: "同步失败" },
    { id: 4, title: "技术方案评审：搜索重构", date: "5月16日 14:00", participants: ["Simiy", "Tao", "dev-wang", "dev-li"], msgCount: 92, summary: "采用混合检索方案（BM25 + 向量），预计 6月底上线。", tags: ["技术", "搜索"], syncStatus: "同步完成" },
  ],
  202: [
    { id: 1, title: "研发周会 #21 — 5月17日", date: "今天 10:00", participants: ["Tao", "dev-wang", "dev-li", "dev-zhang", "设计-小余"], msgCount: 156, summary: "Sprint 21 完成度 86%，遗留 2 个 Bug 延至下周；下周重点是性能优化。", tags: ["周会", "Sprint"] },
    { id: 2, title: "研发周会 #20 — 5月10日", date: "5月10日 10:00", participants: ["Tao", "dev-wang", "dev-li", "dev-zhang"], msgCount: 134, summary: "发布 v2.3.1，修复 7 个 Bug，API 响应时间下降 40%。", tags: ["周会", "发布"] },
  ],
  210: [
    { id: 1, title: "信息管理 2.0 需求对齐", date: "今天 11:30", participants: ["Simiy", "晓雯", "Leo", "设计-小余"], msgCount: 64, summary: "确认连接器配置改为两步式弹窗、编辑配置改为左右两栏布局。设计稿本周五交付。", tags: ["需求", "信息管理"] },
    { id: 2, title: "竞品分析分享 · Notion AI", date: "今天 09:15", participants: ["Simiy", "晓雯"], msgCount: 28, summary: "Notion AI 新增「自动填充数据库属性」能力，可关注其 AI 检索方案的差异化。", tags: ["竞品", "AI"] },
    { id: 3, title: "设计评审 · 编辑配置弹窗", date: "昨天 15:00", participants: ["Simiy", "设计-小余", "Leo"], msgCount: 43, summary: "通过左右两栏布局方案；GitLab 失败态增加 Secret 轮换入口；机器人类信息名称改为「机器人名称」标签。", tags: ["设计", "评审"] },
    { id: 4, title: "Q3 产品路线图讨论", date: "5月18日 14:00", participants: ["Simiy", "晓雯", "Tao", "陈朝"], msgCount: 87, summary: "Q3 聚焦三个方向：信息结构化升级、企业版权限体系、AI 摘要能力增强。海外版暂缓至 Q4。", tags: ["规划", "Q3"] },
    { id: 5, title: "飞书知识库同步问题排查", date: "5月15日 10:00", participants: ["Simiy", "dev-li"], msgCount: 19, summary: "Token 过期后 refresh 逻辑有 bug，dev-li 已提 PR 修复，预计明天合入。", tags: ["Bug", "飞书"] },
  ],
  203: [
    { id: 1, title: "用户 #2041 — 导入问题", date: "今天 09:30", participants: ["客服-小美", "用户#2041"], msgCount: 8, summary: "用户反映 Word 文档导入后格式错乱，已记录工单转交技术。", tags: ["工单", "Bug"] },
    { id: 2, title: "用户 #2038 — 升级咨询", date: "昨天 16:20", participants: ["客服-小美", "用户#2038"], msgCount: 11, summary: "询问团队版价格与功能差异，已发送对比表，用户表示考虑中。", tags: ["销售线索"] },
    { id: 3, title: "用户 #2030 — API 接入问题", date: "5月16日 11:00", participants: ["客服-小美", "dev-li", "用户#2030"], msgCount: 23, summary: "API Key 权限配置错误导致 403，已协助排查解决，用户评分 5 星。", tags: ["已解决"] },
  ],
};

const audioChapters = {
  301: { duration: "01:23:47", speakers: ["Simiy", "晓雯", "Leo", "陈朝"], chapters: [
    { time: "00:00", title: "会议开场与议程确认", speaker: "Simiy", excerpt: "今天主要讨论三个方向：信息结构改版、会话类型接入和下个版本的路线图……" },
    { time: "05:30", title: "信息结构改版方案讨论", speaker: "晓雯", excerpt: "建议文件夹和信息项平级展示，去掉层级概念，用标签来组织……" },
    { time: "24:10", title: "会话类型接入技术评估", speaker: "Leo", excerpt: "企微机器人接入需要审批，预计 2 周；飞书相对简单，1 周内可以搞定……" },
    { time: "48:00", title: "用户反馈与痛点梳理", speaker: "陈朝", excerpt: "搜索是最高频的投诉点，其次是导入格式不稳定，这两个要优先……" },
    { time: "68:20", title: "行动项与下周计划", speaker: "Simiy", excerpt: "总结：Leo 负责飞书接入，晓雯输出改版 PRD，陈朝整理用户反馈 Top 10……" },
  ]},
  302: { duration: "45:12", speakers: ["Simiy", "投资人A", "投资人B"], chapters: [
    { time: "00:00", title: "项目介绍与团队背景", speaker: "Simiy", excerpt: "zleap 是一款面向知识工作者的 AI 信息管理工具，核心解决信息过载问题……" },
    { time: "12:30", title: "产品演示", speaker: "Simiy", excerpt: "（屏幕演示）这是信息源管理页面，支持文章、会话、音频三大类型接入……" },
    { time: "28:00", title: "商业模式与市场规模", speaker: "Simiy", excerpt: "SaaS 订阅模式，目标 TAM 约 120 亿美元，当前聚焦国内中小企业……" },
    { time: "38:00", title: "Q&A", speaker: "投资人A", excerpt: "你们和 Notion AI 的差异化在哪里？主要竞争壁垒是什么？……" },
  ]},
  303: { duration: "05:48:30", speakers: ["Simiy", "用户1", "用户2", "用户3", "用户4", "用户5", "用户6"], chapters: [
    { time: "00:00", title: "用户1 访谈 — 产品设计师", speaker: "用户1", excerpt: "我每天要处理大量灵感素材、设计参考和客户反馈，现在分散在 Figma 评论、微信群和邮件里……" },
    { time: "58:00", title: "用户2 访谈 — 创业公司 CEO", speaker: "用户2", excerpt: "最大的痛点是信息孤岛，不同部门的信息根本没法汇聚到一起来分析……" },
    { time: "1:54:00", title: "用户3 访谈 — 产品经理", speaker: "用户3", excerpt: "我需要持续追踪竞品动态，现在每周要花 3-4 小时手动整理……" },
  ]},
  304: { duration: "00:08", speakers: [], chapters: [], _empty: true },
};

const timelineEvents = {
  101: [
    { date: "今天", items: [
      { time: "09:12", text: "同步新文章 5 篇，含 GPT-4o 深度测评", summary: "本次同步带入 5 篇新文章，重点包括 GPT-4o 多模态能力深度测评、Claude 3.5 更新分析，系统已完成摘要提取并标记关键数据点。", done: false, tags: [{prop:"指标",val:"5篇新文章"},{prop:"组织",val:"GPT-4o"},{prop:"行为",val:"摘要提取"},{prop:"组织",val:"少数派"}],
        _isSummary: true,
        _children: [
          { time: "09:12", text: "新文章：GPT-4o 多模态能力深度测评", summary: "OpenAI 最新模型在图文理解、代码生成和推理能力上全面超越前代，文章对比了 10 项典型任务。", tags: [{prop:"组织",val:"OpenAI"},{prop:"组织",val:"GPT-4o"}], article: { title: "GPT-4o 多模态能力深度测评", entryId: 1 } },
          { time: "09:12", text: "新文章：Claude 3.5 Sonnet 发布，推理速度提升 2 倍", summary: "Anthropic 更新旗舰模型，新增「Artifacts」实时编辑功能，编程能力评测 HumanEval 达 92%。", tags: [{prop:"组织",val:"Anthropic"},{prop:"指标",val:"92%"}], article: { title: "Claude 3.5 Sonnet 发布，新增 Artifacts", entryId: 2 } },
          { time: "09:12", text: "新文章：开源模型 Llama 3 70B 性能对标 GPT-4", summary: "Meta 开源 Llama 3 70B，多项基准测试接近 GPT-4 水平，引发开源 vs 闭源新一轮讨论。", tags: [{prop:"组织",val:"Meta"},{prop:"组织",val:"Llama"}], article: { title: "Llama 3 70B 开源发布，性能对标 GPT-4", entryId: 3 } },
          { time: "09:12", text: "新文章：AI 编程工具 Cursor 用户突破 100 万", summary: "Cursor IDE 用户基数快速增长，月活突破 100 万，年化收入达 6500 万美元。", tags: [{prop:"组织",val:"Cursor"},{prop:"指标",val:"100万用户"}], article: { title: "AI 编程工具 Cursor 用户突破 100 万", entryId: 4 } },
          { time: "09:12", text: "新文章：Agent 框架对比 — LangGraph vs AutoGen vs CrewAI", summary: "三款主流 Agent 框架的架构设计、适用场景和性能基准横向对比。", tags: [{prop:"行为",val:"框架对比"},{prop:"组织",val:"LangGraph"}], article: { title: "Agent 框架对比：LangGraph vs AutoGen vs CrewAI", entryId: 5 } },
        ]
      },
      { time: "09:00", text: "自动触发每日同步任务", summary: "系统按设定频率（每天 09:00）自动触发同步任务，开始从 RSS 源拉取最新内容。本次任务 ID：task-2026-0520-001。", done: true, tags: [{prop:"行为",val:"定时触发"},{prop:"行为",val:"RSS同步"},{prop:"时间",val:"09:00"}] },
    ]},
    { date: "昨天", items: [
      { time: "22:30", text: "抓取「国内大模型价格战」等 3 篇热点文章", summary: "从少数派 AI 资讯抓取 3 篇热点：豆包/Kimi 宣布免费、Perplexity 融资 5 亿、国内算力集群扩张动态。文章已入库待阅读。", done: true, tags: [{prop:"指标",val:"3篇热点"},{prop:"组织",val:"豆包"},{prop:"组织",val:"Kimi"},{prop:"行为",val:"价格战"}],
        _isSummary: true,
        _children: [
          { time: "22:30", text: "新文章：国内大模型价格战白热化", summary: "豆包、Kimi 等头部产品相继宣布免费策略，开启价格战序幕，行业格局加速分化。", tags: [{prop:"组织",val:"豆包"},{prop:"组织",val:"Kimi"}], article: { title: "国内大模型价格战白热化：豆包 / Kimi 相继宣布免费", entryId: 6 } },
          { time: "22:30", text: "新文章：Perplexity 完成 5 亿美元融资", summary: "AI 搜索独角兽 Perplexity 完成 B+ 轮融资，估值达 30 亿美元，加速产品迭代和企业级布局。", tags: [{prop:"组织",val:"Perplexity"},{prop:"指标",val:"5亿融资"}], article: { title: "Perplexity 完成 5 亿美元融资", entryId: 7 } },
          { time: "22:30", text: "新文章：国内算力集群扩张动态", summary: "字节、阿里、腾讯加速 GPU 集群建设，应对推理需求爆发式增长，行业算力供给格局重塑。", tags: [{prop:"组织",val:"字节跳动"},{prop:"行为",val:"算力建设"}], article: { title: "国内算力集群扩张动态", entryId: 8 } },
        ]
      },
      { time: "08:00", text: "自动触发每日同步任务", summary: "系统按设定频率自动触发同步任务，正常执行，共抓取 3 篇内容，无错误。任务 ID：task-2026-0519-001。", done: true, tags: [{prop:"行为",val:"定时触发"},{prop:"行为",val:"RSS同步"}] },
    ]},
    { date: "5月17日", items: [
      { time: "14:20", text: "同步「Agent 框架对比」长文，已完成摘要提取", summary: "LangGraph vs AutoGen vs CrewAI 深度对比，全文约 8000 字，AI 已提取 5 个关键结论和架构对比表，自动添加「技术」「Agent」标签。", done: true, tags: [{prop:"行为",val:"摘要提取"},{prop:"指标",val:"5个关键结论"},{prop:"组织",val:"LangGraph"},{prop:"行为",val:"框架对比"}], article: { title: "Agent 框架对比：LangGraph vs AutoGen vs CrewAI", entryId: 5 } },
      { time: "09:00", text: "自动触发每日同步任务", summary: "系统按设定频率自动触发同步任务，正常执行，任务 ID：task-2026-0517-001。", done: true, tags: [{prop:"行为",val:"定时触发"},{prop:"行为",val:"RSS同步"}] },
    ]},
  ],
  201: [
    { date: "今天", items: [
      { time: "12:48", text: "同步产品方向讨论群消息 48 条", summary: "同步企微群「产品方向讨论」的 48 条消息，AI 提炼核心结论：Q3 聚焦信息结构化，暂缓海外版。已生成会话摘要并提取 2 个决策项。", done: true, tags: [{prop:"指标",val:"48条消息"},{prop:"行为",val:"决策提炼"},{prop:"群体",val:"产品团队"},{prop:"行为",val:"摘要提取"}] },
      { time: "10:15", text: "同步「新功能意见收集」会话，提取 3 个待办", summary: "73 条消息同步完成，AI 识别出 3 个待办：批量导入需求整理、搜索体验优化方案、移动端兼容性问题。已关联对应 Issue。", done: true, tags: [{prop:"指标",val:"73条消息"},{prop:"行为",val:"待办提取"},{prop:"指标",val:"3个待办"},{prop:"行为",val:"Issue关联"}] },
    ]},
    { date: "昨天", items: [
      { time: "17:40", text: "同步周报分享会话", summary: "同步「运营数据周报分享」12 条消息，MAU 增长 18%，付费转化率 2.8%，核心数据已提取并标记。", done: true, tags: [{prop:"指标",val:"MAU +18%"},{prop:"指标",val:"转化率 2.8%"},{prop:"行为",val:"数据提取"}] },
    ]},
  ],
  301: [
    { date: "今天", items: [
      { time: "15:00", text: "上传并完成转写，共识别 4 位发言人", summary: "会议录音（01:23:47）转写完成，识别 Simiy、晓雯、Leo、陈朝 4 位发言人，转写准确率约 97%，含时间轴章节标注。", done: true, tags: [{prop:"行为",val:"语音转写"},{prop:"指标",val:"4位发言人"},{prop:"指标",val:"97%准确率"},{prop:"行为",val:"章节标注"}] },
      { time: "15:02", text: "AI 提取 5 个章节与 7 个行动项", summary: "AI 自动划分 5 个章节：开场 / 信息结构改版 / 飞书接入评估 / 用户反馈 / 行动项。提取 7 个 Action Item，已按负责人分类。", done: true, tags: [{prop:"行为",val:"AI处理"},{prop:"指标",val:"5个章节"},{prop:"指标",val:"7个行动项"},{prop:"行为",val:"按人分类"}] },
    ]},
  ],
};

const convThread = {
  201: [
    { id:1, sender:"晓雯",       time:"12:05", content:"大家好，今天主要讨论 Q3 的产品方向，Simiy 先说说想法？" },
    { id:2, sender:"Simiy",      time:"12:06", content:"我的想法是 Q3 重点放在信息结构化这个核心能力上，其他功能往后排，保持产品聚焦。" },
    { id:3, sender:"Simiy",      time:"12:07", content:"海外版我觉得还不是时候，国内的打法还没跑通，出海太早容易分散资源。" },
    { id:4, sender:"Leo",        time:"12:10", content:"同意，信息结构化是我们最有差异化的地方，技术壁垒也更高。" },
    { id:5, sender:"陈朝",       time:"12:15", content:"从用户反馈来看，搜索和导入是最高频的痛点，这两个和结构化是强相关的，可以一起做。" },
    { id:6, sender:"晓雯",       time:"12:20", content:"那海外版放到 Q4 再评估？" },
    { id:7, sender:"Simiy",      time:"12:22", content:"对，Q4 再看，届时应该有更清晰的数据支撑。" },
    { id:8, sender:"Simiy",      time:"12:23", content:"确认一下结论：Q3 主要方向是信息结构化，暂缓海外版计划。" },
  ],
  202: [
    { id:1, sender:"Tao",        time:"10:02", content:"大家都进来了，开始吧。先过 Sprint 21 的进度，dev-wang 来说一下？" },
    { id:2, sender:"dev-wang",   time:"10:03", content:"Sprint 21 整体完成度 86%，主要功能都 merge 了，遗留 2 个 Bug 比较棘手，预计下周修完。" },
    { id:3, sender:"Tao",        time:"10:05", content:"好，下周重点是性能优化，API 响应时间要再压一压。dev-li 你那边进展怎么样？" },
    { id:4, sender:"dev-li",     time:"10:07", content:"缓存这块差不多了，初步测试响应时间降了 40% 左右，还要再跑完整的 benchmark 验证一下。" },
    { id:5, sender:"dev-zhang",  time:"10:09", content:"搜索重构的 PR 也在 review 中，这周应该能合进去。" },
    { id:6, sender:"Tao",        time:"10:12", content:"好，下次周会再同步进展。散会。" },
  ],
  203: [
    { id:1, sender:"客服-小美",  time:"09:28", content:"你好，请问有什么可以帮助你？" },
    { id:2, sender:"用户#2041",  time:"09:29", content:"我的 Word 文档上传之后格式全乱了，能帮我看看吗？" },
    { id:3, sender:"客服-小美",  time:"09:31", content:"好的，请问你上传的文件格式是 .doc 还是 .docx？里面有没有包含表格或图片？" },
    { id:4, sender:"用户#2041",  time:"09:32", content:".docx，大概 3MB，里面有一些表格和图片。" },
    { id:5, sender:"客服-小美",  time:"09:35", content:"了解，这个问题我们已知晓，是含复杂表格的 docx 在解析时会有格式问题。我已记录工单并转交技术团队，预计 1-2 个工作日内修复，到时会通知您。非常抱歉给您带来不便！" },
    { id:6, sender:"用户#2041",  time:"09:36", content:"好的，谢谢！" },
  ],
};

// 补充 API 接入 / SaleSmartly 追加的会话 sessions
conversationSessions[104] = [
  { id: 1, title: "Issue #23：批量导入接口偶发超时", date: "今天 08:30", participants: ["Simiy", "dev-li", "dev-wang"], msgCount: 7, summary: "导入大文件时 API 超时，已定位到 S3 上传策略问题，待 hotfix。", tags: ["Bug", "P1"] },
  { id: 2, title: "PR #18：修复 docx 含复杂表格解析异常", date: "昨天 16:00", participants: ["dev-li", "dev-zhang", "Simiy"], msgCount: 12, summary: "修复 .docx 含复杂表格时解析格式错乱，已合并至 main。", tags: ["已解决"] },
  { id: 3, title: "Issue #19：全文搜索 P99 延迟过高", date: "5月16日 10:00", participants: ["Tao", "dev-wang"], msgCount: 18, summary: "全文搜索 P99 延迟 3.2s，待引入向量缓存优化。", tags: ["性能", "搜索"] },
  { id: 4, title: "Issue #31：飞书知识库导入鉴权失败", date: "5月15日 14:20", participants: ["dev-li", "Simiy"], msgCount: 5, summary: "OAuth token 过期后刷新逻辑有 bug，已提 PR 修复。", tags: ["Bug"] },
];
convThread[104] = [
  { id:1, sender:"Simiy",     time:"08:30", content:"Issue #23：批量导入接口偶发超时\n\n用户反映上传 >50MB 文件时 `/api/import` 约 30% 概率返回 504 超时，日志显示问题出在 S3 上传阶段，和分片策略有关。" },
  { id:2, sender:"dev-li",    time:"08:42", content:"我看了一下日志，S3 multipart upload 超过 5 分钟没有 complete 就被 abort 了，主要是网络抖动时没有重试逻辑。" },
  { id:3, sender:"dev-wang",  time:"08:50", content:"可以加一个指数退避的重试，最多 3 次，同时把 timeout 从 30s 调到 90s。" },
  { id:4, sender:"Simiy",     time:"09:01", content:"好，这个 P1，今天能出 hotfix 吗？" },
  { id:5, sender:"dev-li",    time:"09:03", content:"可以，下午 3 点前提 PR，预计今晚上线。" },
  { id:6, sender:"Simiy",     time:"09:05", content:"好的，上线前在测试环境跑一下 50MB / 200MB 两个 case 验证一下。" },
  { id:7, sender:"dev-li",    time:"15:47", content:"PR 已提，review 通过了，正在走 CI，预计 20 分钟后可以合并。" },
];

// ── 飞书产品讨论群（id:210）的消息记录 ──
convThread[210] = [
  { id:1, sender:"晓雯",       time:"11:25", content:"@Simiy 信息管理 2.0 的连接器配置弹窗，按之前讨论的两步式来做吗？" },
  { id:2, sender:"Simiy",      time:"11:26", content:"对，第一步信息配置 + 第二步同步设置，飞书知识库需要三步（多一个文档选择）。" },
  { id:3, sender:"晓雯",       time:"11:27", content:"明白。编辑配置弹窗那块呢？" },
  { id:4, sender:"Simiy",      time:"11:28", content:"编辑配置改成左右两栏：左侧 nav 切换分区，右侧内容区。高度固定避免切换时跳动。" },
  { id:5, sender:"Leo",        time:"11:30", content:"左侧 nav 有哪些分区？" },
  { id:6, sender:"Simiy",      time:"11:31", content:"信息配置 / 同步设置 / 更多配置。飞书知识库多一个文档选择。" },
  { id:7, sender:"设计-小余",  time:"11:33", content:"我这边今天能出第一版设计稿，下周一可以评审。" },
  { id:8, sender:"晓雯",       time:"11:35", content:"OK，那我把 PRD 这块也对应更新一下。" },
  { id:9, sender:"Simiy",      time:"11:36", content:"好的，PRD 周五前给我们 review 一遍。设计稿评审周一 14:00 会议室 B2。" },
  { id:10, sender:"Leo",       time:"11:38", content:"收到。我同步给研发，让他们也看看是否有技术风险。" },
  { id:11, sender:"晓雯",      time:"11:40", content:"对了，机器人类的「信息名称」要不要做特殊处理？前面截图看到弹窗里同时出现「机器人名称」和「信息名称」有点冗余。" },
  { id:12, sender:"Simiy",     time:"11:42", content:"改成统一叫「机器人名称」就行了，第一步填的直接作为信息名称。" },
  { id:13, sender:"设计-小余", time:"11:44", content:"好的，那编辑配置弹窗里也是显示「机器人名称」对吧？" },
  { id:14, sender:"Simiy",     time:"11:45", content:"对，统一。" },
];

const audioTodos = {
  301: ["Leo 确认飞书接入排期，本周内", "晓雯输出信息结构改版 PRD，下周一前", "陈朝整理用户反馈 Top 10，本周五前", "Simiy 向投资人同步 Q3 路线图"],
  302: ["整理 Q&A 环节问题清单发给团队", "补充竞品分析材料进 deck", "路演 deck 更新商业模式章节"],
  303: ["汇总 6 位用户共同提及的 Top 5 痛点", "将「搜索体验」反馈同步给产品团队", "整理高质量 verbatim 录入用户画像库"],
};

/* ─── 汇报信息源 MOCK DATA ─── */
const reportSources = [
  {
    id: "report-ceo",
    name: "总裁办汇报",
    department: "总裁办",
    owner: "Simiy",
    status: "同步完成",
    created: "5月1日 09:00",
    updated: "今天 19:30",
    desc: "总裁办核心管理层日常进展、决策事项及对外协调情况同步。",
    members: [
      { id: "lijunqin", name: "李俊钦", role: "技术总监", avatar: "李", lastReport: "今天 19:00", unread: 0, status: "今日已汇报", messages: [
        { sender: "李俊钦", date: "5月28日", time: "19:00", content: "今日进展：\n① Q2 技术规划终稿完成，已同步至 Confluence\n② 投资方技术尽调会议顺利结束，对 AI 推理链路较感兴趣\n③ 音频转写压测结果：准确率 99.2%，延迟 <800ms，符合预期\n\n明日计划：\n① 启动 Q3 技术路线评审会\n② 跟进 Agent 组 RAG 优化进展" },
        { sender: "李俊钦", date: "5月27日", time: "18:55", content: "今日进展：\n① 与 Agent 组完成 RAG v2 方案评审，确认引入 HyDE 策略\n② 音频转写服务压测环境搭建完成，明日开压\n③ Q2 技术债清单梳理，共 11 项，优先级已标注\n\n明日计划：\n① 跟进音频转写压测\n② 参加投资方技术尽调会议" },
        { sender: "李俊钦", date: "5月26日", time: "19:10", content: "今日进展：\n① 全组 Q2 OKR 进度对齐，完成度整体 72%，部分指标有滞后风险\n② 与产品确认信息管理 2.0 技术可行性，同意排入 Q2 尾批\n③ 代码质量专项：Sonar 扫描 critical 问题清零\n\n风险：飞书 OAuth 联调依赖对方排期，有 3 天左右 buffer 风险\n\n明日计划：\n① 确认 Agent 组 RAG 方案评审时间\n② 推进 Q2 技术债清单输出" },
        { sender: "李俊钦", date: "5月25日", time: "18:40", content: "今日进展：\n① 参加公司全员大会，技术部门 Q1 复盘汇报顺利\n② 向量服务 pgvector 迁移方案评审通过，本周启动\n③ 安全组高危漏洞修复验证完成，已关单\n\n明日计划：\n① Q2 OKR 进度对齐\n② 代码质量专项扫描" },
        { sender: "李俊钦", date: "5月24日", time: "18:50", content: "今日进展：\n① 完成新入职 2 名工程师 onboarding，技术规范文档已对齐\n② 与中台评审 SDK 2.0 接口设计，提出 3 条修改意见\n③ 线上告警 P2 事件响应，定位为 Redis 热点 Key，已降级处理\n\n明日计划：\n① 准备全员大会 Q1 技术复盘材料\n② 跟进 pgvector 迁移方案" },
      ]},
      { id: "liangyinghao", name: "梁英豪", role: "产品总监", avatar: "梁", lastReport: "今天 18:50", unread: 1, status: "今日已汇报", messages: [
        { sender: "梁英豪", date: "5月28日", time: "18:50", content: "今日进展：\n① 信息管理 2.0 改版评审通过，下周进入研发排期\n② 竞品分析报告完成，Notion AI 和 Mem.ai 为核心参照对象\n③ 与渠道合作伙伴完成季度对齐\n\n明日计划：\n① Q2 产品复盘会议准备\n② 用户访谈安排确认（5 位目标用户）" },
        { sender: "梁英豪", date: "5月27日", time: "18:40", content: "今日进展：\n① 信息管理权限模块交互评审，设计方案通过\n② 完成汇报功能用户调研提纲，预约 6 位目标用户\n③ 与销售对齐 Q2 产品发布节奏，确认 6 月底发版计划\n\n明日计划：\n① 竞品分析报告收尾\n② 信息管理 2.0 改版评审" },
        { sender: "梁英豪", date: "5月26日", time: "18:30", content: "今日进展：\n① 完成 Sprint 21 需求验收，4 项功能上线，1 项延期\n② 产品 Q2 路线图更新，新增 AI 摘要模块\n③ 用户反馈分析：近 30 天高频反馈为搜索体验差、信息源权限不清晰\n\n明日计划：\n① 推进权限模块交互评审\n② 与渠道合作伙伴季度对齐" },
        { sender: "梁英豪", date: "5月25日", time: "18:45", content: "今日进展：\n① 参加公司全员大会，产品部 Q1 汇报顺利\n② 完成汇报功能 PRD v1.0，覆盖日报/周报/月报三种模式\n③ 与技术确认 AI 摘要模块可行性，初步确认方案\n\n明日计划：\n① Sprint 21 需求验收\n② 产品 Q2 路线图更新" },
        { sender: "梁英豪", date: "5月24日", time: "18:20", content: "今日进展：\n① 完成飞书知识库集成需求文档初稿\n② 与 UX 对齐汇报功能视觉规范，确认双栏布局方案\n③ 整理竞品调研素材，Notion AI 功能截图与分析框架已搭建\n\n明日计划：\n① 全员大会 Q1 产品汇报准备\n② 汇报功能 PRD 收尾" },
      ]},
      { id: "xuwenhao", name: "许文昊", role: "战略投资总监", avatar: "许", lastReport: "—", unread: 0, status: "未汇报", messages: [] },
    ],
    totalMembers: 5,
  },
  {
    id: "report-app",
    name: "应用组汇报",
    department: "研发部",
    owner: "苏铭妍",
    status: "同步完成",
    created: "5月8日 10:00",
    updated: "今天 18:40",
    desc: "应用组前端、设计、QA 成员每日开发进展与阻塞项同步。",
    members: [
      { id: "sumingyan", name: "苏铭妍", role: "产品经理", avatar: "苏", lastReport: "今天 18:40", unread: 0, status: "今日已汇报", messages: [
        { sender: "苏铭妍", date: "5月28日", time: "18:40", content: "今日进展：\n① 信息管理权限模块 PRD v1.3 完成，新增「部分可见」选人交互说明\n② 与 UX 对齐新版 modal 固定高度方案，通过评审\n③ 用户反馈 Top 10 整理完毕，录入 Jira\n\n明日计划：\n① 协调 Sprint 22 工作量排期\n② 飞书集成 PRD 初稿输出" },
        { sender: "苏铭妍", date: "5月27日", time: "18:35", content: "今日进展：\n① 汇报信息源 PRD v0.9 完成，覆盖成员管理与多日汇报展示逻辑\n② Sprint 21 验收会议完成，4 项通过、1 项需要返工（modal 关闭逻辑有歧义）\n③ 用户访谈回放整理，新增 3 条待办需求录入 backlog\n\n明日计划：\n① 权限模块 PRD v1.3 收尾\n② 与 UX 对齐新版 modal 方案" },
        { sender: "苏铭妍", date: "5月26日", time: "18:30", content: "今日进展：\n① 完成汇报功能竞品分析（飞书打卡、钉钉日报）\n② 信息管理主页搜索体验优化需求立项\n③ 协调前端解决 RSS 列表分页边界 bug，已修复上线\n\n明日计划：\n① 汇报信息源 PRD 草稿\n② Sprint 21 验收准备" },
        { sender: "苏铭妍", date: "5月25日", time: "18:50", content: "今日进展：\n① 参加全员大会，Q1 应用组里程碑汇报\n② 完成用户访谈 × 2（均为企业版用户，核心痛点：信息源权限混乱）\n③ 飞书集成需求背景调研完成\n\n明日计划：\n① 汇报功能竞品分析\n② 协调 RSS 列表 bug 修复" },
        { sender: "苏铭妍", date: "5月24日", time: "18:25", content: "今日进展：\n① 完成 Sprint 22 需求 kickoff，共 14 项，优先级评审通过\n② 与研发对齐「添加信息源」弹窗重构方案\n③ 补充信息管理文档上传流程图\n\n明日计划：\n① 全员大会 Q1 应用组汇报准备\n② 用户访谈安排" },
      ]},
      { id: "yanyjing", name: "严伊婧", role: "UX 设计师", avatar: "严", lastReport: "今天 18:20", unread: 0, status: "今日已汇报", messages: [
        { sender: "严伊婧", date: "5月28日", time: "18:20", content: "今日进展：\n① 信息管理列表视图排序交互设计稿完成\n② 新建信息源弹窗定稿，已交付研发\n③ 组件库新增 StatusBadge 与 FolderCard 规范文档\n\n明日计划：\n① 汇报信息源页面设计稿迭代\n② 与苏铭妍确认飞书集成交互方案" },
        { sender: "严伊婧", date: "5月27日", time: "18:10", content: "今日进展：\n① 汇报信息源详情页改版设计稿 v0.7 完成，双栏布局，左侧人员列表 + 右侧汇报内容\n② 与研发同步 modal 滚动高度方案，确认采用 maxHeight 动态限制\n③ 信息管理图标集扩充 8 枚（汇报/权限/连接器类型）\n\n明日计划：\n① 列表视图排序交互设计稿\n② 新建信息源弹窗定稿" },
        { sender: "严伊婧", date: "5月26日", time: "18:00", content: "今日进展：\n① 完成信息管理 2.0 整体设计规范文档 v1.0\n② 卡片视图 hover 动效方案确认，统一为 shadow 上移 2px\n③ 颜色系统更新：主色 orange-500 配套体系完善\n\n明日计划：\n① 汇报详情页改版设计稿\n② modal 高度方案与研发对齐" },
        { sender: "严伊婧", date: "5月25日", time: "18:15", content: "今日进展：\n① 参加全员大会，设计组 Q1 汇报\n② 完成 Sprint 21 设计交付物归档\n③ 信息管理移动端适配方案研究，输出初步思路文档\n\n明日计划：\n① 设计规范文档收尾\n② 卡片视图 hover 动效方案确认" },
        { sender: "严伊婧", date: "5月24日", time: "17:50", content: "今日进展：\n① 信息管理列表视图多选操作设计稿 v0.3 定稿\n② 文档上传/音频上传弹窗视觉优化完成\n③ 与产品对齐 Sprint 22 设计工作量，共 6 项任务\n\n明日计划：\n① 全员大会设计组汇报准备\n② Sprint 21 交付物归档" },
      ]},
      { id: "chenyusong", name: "陈予淞", role: "测试工程师", avatar: "陈", lastReport: "今天 18:10", unread: 0, status: "今日已汇报", messages: [
        { sender: "陈予淞", date: "5月28日", time: "18:10", content: "今日进展：\n① modal 固定高度改版回归测试完成，3 个边界 case 已修复\n② 信息源权限弹窗测试用例更新，覆盖率 94%\n\n明日计划：\n① 新版 modal 全量回归\n② 接入自动化测试流水线" },
        { sender: "陈予淞", date: "5月27日", time: "18:05", content: "今日进展：\n① 完成 Sprint 21 全量回归测试，共发现 5 个缺陷，P1 × 1、P2 × 2、P3 × 2\n② P1 缺陷（新建信息源后刷新丢失）已修复，完成回归验证\n③ 自动化用例新增 12 条（信息源权限相关）\n\n明日计划：\n① modal 改版测试\n② 权限弹窗用例更新" },
        { sender: "陈予淞", date: "5月26日", time: "18:00", content: "今日进展：\n① 搜索功能测试完成，边界场景：空关键词、超长关键词、特殊字符均正常\n② 文档上传 10MB 以上文件处理测试，发现进度条显示 bug，已提单\n③ RSS 订阅同步失败场景测试用例补充\n\n明日计划：\n① Sprint 21 全量回归测试\n② 自动化用例补充" },
        { sender: "陈予淞", date: "5月25日", time: "18:20", content: "今日进展：\n① 完成类型筛选多选功能测试，逻辑正确，样式有 1 处遗漏 padding，已提单\n② 全量回归测试计划输出，共 187 条用例\n③ 与研发对齐 Sprint 22 测试接入时间节点\n\n明日计划：\n① 搜索功能边界测试\n② 文档上传大文件测试" },
        { sender: "陈予淞", date: "5月24日", time: "18:00", content: "今日进展：\n① 完成新一轮信息源列表交互测试（排序、筛选、搜索）\n② 权限弹窗 UI 走查，4 处样式问题提单\n③ 与研发同步测试环境更新计划\n\n明日计划：\n① 类型筛选多选功能测试\n② 全量回归计划输出" },
      ]},
      { id: "huanghoming", name: "黄昊铭", role: "测试实习生", avatar: "黄", lastReport: "昨天 18:00", unread: 0, status: "今日未汇报", messages: [
        { sender: "黄昊铭", date: "5月27日", time: "18:00", content: "完成 RSS 订阅连接器基础功能测试，发现 2 个样式 bug 已提单，等待修复验证。" },
        { sender: "黄昊铭", date: "5月26日", time: "18:10", content: "完成音频上传弹窗基础功能冒烟测试，流程无阻断性问题，文件格式校验正常。发现 1 处进度条 UI 问题，已提单交陈予淞复核。" },
        { sender: "黄昊铭", date: "5月25日", time: "17:50", content: "跟进上周提单的 3 个 bug 修复状态，2 个已修复等待验证，1 个待研发排期。学习 Playwright 自动化框架，完成第一条自动化用例。" },
      ]},
      { id: "wenshuang", name: "温霜", role: "视觉设计师", avatar: "温", lastReport: "—", unread: 0, status: "未汇报", messages: [] },
    ],
    totalMembers: 7,
  },
  {
    id: "report-backend",
    name: "后台组汇报",
    department: "研发部",
    owner: "李智敏",
    status: "同步中",
    created: "5月8日 10:00",
    updated: "今天 18:55",
    desc: "后台组架构、前后端、运维成员每日进展与风险点同步。",
    members: [
      { id: "lizhimin", name: "李智敏", role: "后端架构师", avatar: "李", lastReport: "今天 18:55", unread: 1, status: "有风险点", messages: [
        { sender: "李智敏", date: "5月28日", time: "18:55", content: "今日进展：\n① 向量检索服务迁移至 pgvector，性能基准测试完成\n② 企微机器人回调服务上线预发布环境\n③ API 网关限流策略更新\n\n⚠️ 风险点：\n· 音频转写服务在高并发场景下内存占用异常，预计明天定位根因，可能影响上线节奏\n\n明日计划：\n① 排查音频服务内存问题\n② 飞书 OAuth 接入联调" },
        { sender: "李智敏", date: "5月27日", time: "18:50", content: "今日进展：\n① pgvector 迁移方案评审通过，确认分批迁移策略，明天开始执行\n② 完成 API 网关 QPS 压测，峰值 8000 QPS 稳定，P99 延迟 45ms\n③ 音频转写服务单元测试覆盖率提升至 88%\n\n明日计划：\n① 开始 pgvector 分批迁移\n② 企微回调服务预发布上线" },
        { sender: "李智敏", date: "5月26日", time: "19:00", content: "今日进展：\n① 排查上周慢查询根因：缺少复合索引，已补全，P99 从 320ms 降至 28ms\n② 飞书 OAuth 接入方案调研完成，确认使用 code flow\n③ 与平台组对齐 SDK 2.0 后端接口规范\n\n明日计划：\n① pgvector 迁移方案评审\n② API 网关压测" },
        { sender: "李智敏", date: "5月25日", time: "18:45", content: "今日进展：\n① 完成全员大会 Q1 后端架构汇报\n② 线上慢查询告警处理，定位到 3 条 SQL 未使用索引\n③ 后端技术债：清理无用 API 31 条，完成下线\n\n明日计划：\n① 复合索引补全修复慢查询\n② 飞书 OAuth 接入方案调研" },
        { sender: "李智敏", date: "5月24日", time: "18:40", content: "今日进展：\n① 数据库连接池扩容完成，连接数从 200 扩至 500\n② 企微机器人消息入库逻辑设计稿完成\n③ 与前端联调信息源权限接口，3 个接口全部通过\n\n明日计划：\n① Q1 架构汇报准备\n② 线上慢查询跟进" },
      ]},
      { id: "dengxiangbai", name: "邓祥柏", role: "前端开发工程师", avatar: "邓", lastReport: "今天 18:30", unread: 0, status: "今日已汇报", messages: [
        { sender: "邓祥柏", date: "5月28日", time: "18:30", content: "今日完成 CardView 编辑配置入口重构，hover 操作收归至「...」菜单，已 PR 等待 Review。信息管理列表视图创建时间列截断问题修复。" },
        { sender: "邓祥柏", date: "5月27日", time: "18:25", content: "完成信息管理主页搜索框 value/onChange 绑定修复，支持清除按钮，焦点时宽度动画正常。类型筛选多选逻辑实现完成，filterType 从 string 改为 Set。" },
        { sender: "邓祥柏", date: "5月26日", time: "18:20", content: "完成「概况」筛选器逻辑重构，与类型筛选对齐，触发跨文件夹 item 视图。修复 filterStatus 重置时机，navPage 切换时同步清空。" },
        { sender: "邓祥柏", date: "5月25日", time: "18:15", content: "完成 SingleDocPage 事项视图/内容视图切换入口，音频和文档页也已支持。修复音频播放组件在 docView=timeline 时不该渲染的问题。" },
        { sender: "邓祥柏", date: "5月24日", time: "18:00", content: "完成 MultiContentPage 顶栏改版，返回按钮 + 事项视图切换 + 更多菜单。左栏 header 对齐 MultiContentPage 设计规范，删除和复制至操作已接入。" },
      ]},
      { id: "tanningji", name: "唐宁静", role: "前端开发工程师", avatar: "唐", lastReport: "今天 18:15", unread: 0, status: "今日已汇报", messages: [
        { sender: "唐宁静", date: "5月28日", time: "18:15", content: "完成汇报信息源全屏二级页面改版，nav 收起逻辑处理正常，人员搜索框联动正常。代码待 Review 后合并主干。" },
        { sender: "唐宁静", date: "5月27日", time: "18:10", content: "汇报详情页左栏 header 重构完成，对齐 MultiContentPage 布局规范。成员列表选中态、hover 态样式统一。" },
        { sender: "唐宁静", date: "5月26日", time: "18:05", content: "完成汇报信息源多日消息分组展示逻辑，按 date 字段倒序分组，每组独立渲染日期 badge。" },
        { sender: "唐宁静", date: "5月25日", time: "18:00", content: "完成事项视图在汇报页的适配，按日期展示各成员汇报状态。今日未汇报成员标灰色显示。" },
      ]},
      { id: "zhouyuncong", name: "周运聪", role: "后端开发工程师", avatar: "周", lastReport: "今天 18:00", unread: 0, status: "今日已汇报", messages: [
        { sender: "周运聪", date: "5月28日", time: "18:00", content: "完成企微机器人 Webhook 签名验证模块，已接入单测，覆盖率 92%。明天继续接入消息入库逻辑，预计后天完成联调。" },
        { sender: "周运聪", date: "5月27日", time: "18:00", content: "完成飞书机器人 OAuth Token 刷新逻辑，支持自动续期。接入集成测试，4 个测试用例全部通过。" },
        { sender: "周运聪", date: "5月26日", time: "17:55", content: "完成消息队列消费端重构，引入死信队列处理失败消息，重试次数可配置。与架构师评审通过。" },
        { sender: "周运聪", date: "5月25日", time: "18:10", content: "完成 API 接入模块 rate limiter 实现，支持 token bucket 算法，QPS 限制 100/s，已接入单测。" },
        { sender: "周运聪", date: "5月24日", time: "18:00", content: "完成信息源权限接口后端实现，支持 private/partial/enterprise 三种类型，已与前端联调通过。" },
      ]},
    ],
  },
  {
    id: "report-agent",
    name: "Agent 组汇报",
    department: "研发部",
    owner: "陈勇杰",
    status: "解析中",
    created: "5月10日 11:00",
    updated: "今天 19:10",
    desc: "Agent 组大模型应用与算法成员技术进展、实验结果与方案评审同步。",
    members: [
      { id: "chenyongjie", name: "陈勇杰", role: "大模型应用工程师", avatar: "陈", lastReport: "今天 19:10", unread: 1, status: "今日已汇报", messages: [
        { sender: "陈勇杰", date: "5月28日", time: "19:10", content: "今日进展：\n① RAG 检索召回率从 78% 优化至 86%，采用 HyDE 策略\n② 完成 Prompt 缓存方案设计，预计可降低 token 消耗约 40%\n③ 与产品对齐「信息要点」字段的 AI 摘要生成逻辑\n\n明日计划：\n① 接入 Reranker 模型，进一步提升排序质量\n② Prompt 缓存方案内部评审" },
        { sender: "陈勇杰", date: "5月27日", time: "19:00", content: "今日进展：\n① HyDE 策略 A/B 测试设计完成，明天正式跑对比实验\n② 与李冠贤对齐数据清洗质量要求，补充去噪规则 5 条\n③ 完成 LLM 调用链路监控接入，token 消耗可观测\n\n明日计划：\n① 运行 HyDE A/B 测试\n② Prompt 缓存方案设计" },
        { sender: "陈勇杰", date: "5月26日", time: "18:55", content: "今日进展：\n① 完成 RAG pipeline 全链路性能基准测试，P95 检索延迟 380ms\n② 梁卓城上下文压缩方案评审通过，确认接入计划\n③ 新增 5 个测试数据集，覆盖长文档、表格、混合中英文场景\n\n明日计划：\n① HyDE 策略设计\n② LLM 调用监控接入" },
        { sender: "陈勇杰", date: "5月25日", time: "19:05", content: "今日进展：\n① 完成全员大会 Q1 Agent 组技术汇报\n② Embedding 模型选型评审：确认使用 bge-m3，主要优势是中文长文档效果\n③ 与产品对齐 AI 摘要功能 MVP 范围\n\n明日计划：\n① RAG pipeline 全链路性能基准测试\n② 上下文压缩方案评审" },
        { sender: "陈勇杰", date: "5月24日", time: "18:50", content: "今日进展：\n① 完成 RAG 检索模块重构，支持多路召回融合（BM25 + Dense）\n② 与基础架构对齐向量数据库迁移计划（pgvector）\n③ 阅读 HyDE 论文，完成核心思路摘要\n\n明日计划：\n① Embedding 模型选型评审准备\n② AI 摘要 MVP 范围对齐" },
      ]},
      { id: "liangzhuocheng", name: "梁卓城", role: "大模型应用工程师", avatar: "梁", lastReport: "今天 18:45", unread: 0, status: "今日已汇报", messages: [
        { sender: "梁卓城", date: "5月28日", time: "18:45", content: "今日完成多轮对话上下文压缩实验，压缩比 3.2x，BLEU 损失 <2%，质量可接受。技术报告已整理，明天提交评审。" },
        { sender: "梁卓城", date: "5月27日", time: "18:40", content: "实验第二轮：对比 DistilBERT 和 T5-small 压缩效果，T5-small 在 F1 指标上高出 3.1%，资源消耗可接受。已记录对比数据。" },
        { sender: "梁卓城", date: "5月26日", time: "18:35", content: "完成上下文压缩基线实验，截断策略 baseline 压缩比 2.1x，BLEU 损失 6.3%。明天引入 extractive summarization 方案对比。" },
        { sender: "梁卓城", date: "5月25日", time: "18:30", content: "完成全员大会 Q1 汇报出席。开始上下文压缩方案调研，收集 4 篇相关论文，整理阅读笔记。" },
        { sender: "梁卓城", date: "5月24日", time: "18:25", content: "完成多轮对话数据集构建，共 2300 条样本，涵盖技术咨询、任务跟踪、信息查询三类场景。交付给李冠贤进行质量验收。" },
      ]},
      { id: "liguanxian", name: "李冠贤", role: "算法实习生", avatar: "李", lastReport: "今天 17:50", unread: 0, status: "今日已汇报", messages: [
        { sender: "李冠贤", date: "5月28日", time: "17:50", content: "完成数据清洗脚本 v2，支持去重与格式标准化，处理约 12 万条语料，异常率 3.1%，已交付给梁卓城验收。" },
        { sender: "李冠贤", date: "5月27日", time: "17:45", content: "数据清洗脚本 v2 去重模块完成，使用 SimHash 算法，重复率从 18.3% 降至 1.2%。格式标准化模块联调中。" },
        { sender: "李冠贤", date: "5月26日", time: "17:50", content: "完成梁卓城多轮对话数据集质量验收，发现异常样本 47 条（含空回复、乱码），已标注返回修正。" },
        { sender: "李冠贤", date: "5月25日", time: "17:40", content: "完成 bge-m3 embedding 模型本地部署，CUDA 加速正常，100 条样本 batch 推理耗时 1.2s。" },
      ]},
      { id: "molinyuan", name: "莫林源", role: "算法实习生", avatar: "莫", lastReport: "昨天 17:30", unread: 0, status: "今日未汇报", messages: [
        { sender: "莫林源", date: "5月27日", time: "17:30", content: "完成 embedding 模型对比实验（bge-m3 vs text2vec），bge-m3 在中文检索场景下胜出，已记录实验报告。" },
        { sender: "莫林源", date: "5月26日", time: "17:35", content: "完成 text2vec 模型评测，MTEB 中文检索子集 Recall@10 = 68.4%，与 bge-m3 的 79.1% 差距明显。实验数据已上传共享目录。" },
        { sender: "莫林源", date: "5月25日", time: "17:30", content: "完成 bge-m3 模型评测，使用 5 个标准数据集，平均 Recall@10 = 79.1%。明天开始对比 text2vec。" },
      ]},
    ],
  },
  {
    id: "report-sales",
    name: "销售部汇报",
    department: "销售部",
    owner: "潘海勇",
    status: "同步完成",
    created: "5月12日 09:00",
    updated: "今天 19:20",
    desc: "销售团队客户跟进、商机进展与合同签约情况日报。",
    members: [
      { id: "panhaiyong", name: "潘海勇", role: "客户经理", avatar: "潘", lastReport: "今天 19:20", unread: 1, status: "今日已汇报", messages: [
        { sender: "潘海勇", date: "5月28日", time: "19:20", content: "今日进展：\n① 拜访重点客户，演示信息管理 2.0 汇报功能，客户反馈积极，明确表示有采购意向\n② 3 个商机跟进：A 客户进入合同审批阶段；B 客户要求定制化演示；C 客户暂缓至 Q3\n③ 完成本月销售漏斗数据更新，提交 CRM\n\n明日计划：\n① 准备 B 客户定制演示材料\n② 整理月度销售数据" },
        { sender: "潘海勇", date: "5月27日", time: "19:10", content: "今日进展：\n① A 客户合同初审通过，进入法务流程，预计本周内签约\n② 拜访新商机 E 客户（制造业），需求明确，决策周期约 4 周\n③ Q2 销售漏斗分析：总量 286 万，较上月增长 18%\n\n明日计划：\n① 跟进 A 客户签约进展\n② 准备 2.0 演示材料" },
        { sender: "潘海勇", date: "5月26日", time: "19:05", content: "今日进展：\n① B 客户定制演示完成，客户对「汇报信息源」功能最感兴趣，已记录定制需求\n② 续签客户 D 合同金额谈判，最终以 9 折成交，金额 4.2 万\n③ 本周新增商机 3 条，录入 CRM\n\n明日计划：\n① 跟进 A 客户合同初审\n② Q2 销售漏斗分析" },
        { sender: "潘海勇", date: "5月25日", time: "19:00", content: "今日进展：\n① 全员大会 Q1 销售汇报：完成率 87%，同比增长 23%\n② 整理月度客户满意度调研，NPS 72 分（行业均值 61）\n③ Q2 目标分解完成，月度 breakdown 已确认\n\n明日计划：\n① B 客户定制演示准备\n② 跟进 D 客户续约谈判" },
        { sender: "潘海勇", date: "5月24日", time: "19:15", content: "今日进展：\n① 完成 C 客户需求调研，确认企业版 20 席起购，核心诉求为信息汇总与团队协作\n② 签约 F 客户（教育行业），合同金额 3.6 万\n③ 跟进 A 客户采购审批流程\n\n明日计划：\n① 全员大会 Q1 销售汇报\n② 月度 NPS 整理" },
      ]},
      { id: "linxiaoming", name: "林晓明", role: "客户经理", avatar: "林", lastReport: "今天 18:50", unread: 0, status: "今日已汇报", messages: [
        { sender: "林晓明", date: "5月28日", time: "18:50", content: "今日完成 2 场客户电话跟进，其中 1 家确认续约意向，已发送合同草稿。新增商机 4 条录入 CRM，漏斗新增金额约 28 万。" },
        { sender: "林晓明", date: "5月27日", time: "18:40", content: "今日拜访存量客户 G，对方表示满意当前版本，讨论升级企业版 Pro 的可能性。录入 CRM 升级商机，预计决策周期 2 周。" },
        { sender: "林晓明", date: "5月26日", time: "18:35", content: "本周商机回访 5 家，3 家进入方案报价阶段，1 家暂缓，1 家已流失。月度新增签约金额达成率 91%。" },
        { sender: "林晓明", date: "5月25日", time: "18:30", content: "全员大会出席。整理 Q2 客户分级名单，A/B/C 类分别 8/15/22 家，跟进优先级已确认。" },
        { sender: "林晓明", date: "5月24日", time: "18:25", content: "完成 H 客户（零售业）演示，对搜索功能和汇报功能评价较高，初步有采购意向，下周安排二次拜访。" },
      ]},
    ],
    totalMembers: 3,
  },
  /* ── 5 层演示用数据（每层各一个信息源）── */
  {
    id: "report-platform",
    name: "技术中台汇报",
    department: "技术中台",
    owner: "赵子涵",
    status: "同步完成",
    created: "5月8日 09:00",
    updated: "今天 19:30",
    desc: "技术中台整体进度、跨组协作事项和技术债处理情况汇总。",
    members: [
      { id: "zhaozihan", name: "赵子涵", role: "技术中台负责人", avatar: "赵", lastReport: "今天 19:30", unread: 0, status: "今日已汇报", messages: [
        { sender: "赵子涵", time: "19:30", content: "今日进展：\n① 技术中台 Q2 规划评审通过，核心三项：服务网格升级、统一日志平台、内部 SDK 2.0\n② 协调基础架构部与应用组解决网关超时问题，已定位为连接池配置项，本周内修复\n\n明日计划：\n① 跟进 SDK 2.0 技术方案评审\n② 与产品对齐 Q2 里程碑节点" },
      ]},
    ],
  },
  {
    id: "report-infra",
    name: "基础架构部汇报",
    department: "基础架构部",
    owner: "叶浩然",
    status: "同步中",
    created: "5月9日 10:00",
    updated: "今天 19:10",
    desc: "基础架构部基础设施建设、稳定性保障与平台化工作进展。",
    members: [
      { id: "yehiran", name: "叶浩然", role: "基础架构部负责人", avatar: "叶", lastReport: "今天 19:10", unread: 1, status: "今日已汇报", messages: [
        { sender: "叶浩然", time: "19:10", content: "今日进展：\n① 完成 K8s 集群节点扩容 × 4，资源利用率从 82% 降至 61%\n② 平台组反馈的 CI/CD 流水线构建超时问题已排查，根因为 Maven 缓存失效，已修复\n③ 存储小组扩容工单审批中，预计明日完成\n\n明日计划：\n① 跟进 prod-db-02 扩容落地\n② 输出基础设施月度健康报告" },
      ]},
    ],
  },
  {
    id: "report-network",
    name: "网络组汇报",
    department: "网络组",
    owner: "许建国",
    status: "同步完成",
    created: "5月10日 10:00",
    updated: "今天 18:30",
    desc: "网络组内网拓扑维护、带宽监控与跨机房专线稳定性保障日报。",
    members: [
      { id: "xujianguo", name: "许建国", role: "网络组负责人", avatar: "许", lastReport: "今天 18:30", unread: 0, status: "今日已汇报", messages: [
        { sender: "许建国", time: "18:30", content: "今日进展：\n① 完成广州-上海专线带宽扩容至 2Gbps，时延降低 12ms\n② 修复 IDC-B 区交换机端口抖动告警，根因为光模块老化，已更换\n③ 新机房网络布线方案评审通过，下周开工\n\n明日计划：\n① 跟进深圳节点 BGP 路由优化\n② 输出本月网络可用性报告" },
      ]},
    ],
  },
  {
    id: "report-security",
    name: "安全组汇报",
    department: "安全组",
    owner: "冯雅琳",
    status: "同步失败",
    created: "5月10日 10:00",
    updated: "今天 17:50",
    desc: "安全组漏洞扫描、等保合规、安全事件响应与权限审计日报。",
    members: [
      { id: "fengyalin", name: "冯雅琳", role: "安全负责人", avatar: "冯", lastReport: "今天 17:50", unread: 1, status: "今日已汇报", messages: [
        { sender: "冯雅琳", time: "17:50", content: "今日进展：\n① 完成本月全员权限审计，发现 3 个越权账号已冻结\n② 第三方渗透测试报告出具，高危漏洞 1 个（已有修复方案，本周内上线）\n③ 等保 2.0 三级整改清单剩余 4 项，预计下周全部完成\n\n明日计划：\n① 协调研发修复高危漏洞\n② 安全意识培训材料更新" },
      ]},
    ],
  },
  {
    id: "report-ops",
    name: "运维组汇报",
    department: "运维组",
    owner: "姜思远",
    status: "同步完成",
    created: "5月10日 10:00",
    updated: "今天 19:05",
    desc: "运维组服务器巡检、告警响应、部署发布与 SRE 指标日报。",
    members: [
      { id: "jiangsiyuan", name: "姜思远", role: "运维组负责人", avatar: "姜", lastReport: "今天 19:05", unread: 0, status: "今日已汇报", messages: [
        { sender: "姜思远", time: "19:05", content: "今日进展：\n① 完成 prod 环境 v2.3.1 发布，灰度放量 100%，线上无异常\n② 响应 2 起告警：Redis 连接数超阈值（已扩连接池）；日志磁盘 > 90%（已清理归档）\n③ SRE 月度指标：可用性 99.97%，MTTR 12min\n\n明日计划：\n① 协助安全组修复漏洞上线\n② 推进全链路压测方案" },
      ]},
    ],
  },
  {
    id: "report-platform-eng",
    name: "平台组汇报",
    department: "平台组",
    owner: "卢嘉怡",
    status: "同步完成",
    created: "5月10日 10:00",
    updated: "今天 18:50",
    desc: "平台组研发框架维护、CI/CD 优化与内部工具开发进展。",
    members: [
      { id: "lujiayi", name: "卢嘉怡", role: "平台组负责人", avatar: "卢", lastReport: "今天 18:50", unread: 0, status: "今日已汇报", messages: [
        { sender: "卢嘉怡", time: "18:50", content: "今日进展：\n① 内部 SDK v2.1 发布，修复 3 个 breaking change，已同步至各业务组\n② 构建流水线优化：平均构建时间从 7.2 min → 4.1 min（缓存层改造）\n③ 协助存储小组排查 ORM 慢查询，建议迁移至异步批量写入\n\n明日计划：\n① SDK 2.2 需求评审\n② 灰度发布系统联调" },
      ]},
    ],
  },
  {
    id: "report-storage",
    name: "存储小组汇报",
    department: "存储小组",
    owner: "蒋明远",
    status: "解析中",
    created: "5月10日 10:00",
    updated: "今天 18:40",
    desc: "存储小组对象存储、缓存层与消息队列日常运维进展同步。",
    members: [
      { id: "jiangmingyuan", name: "蒋明远", role: "存储小组负责人", avatar: "蒋", lastReport: "今天 18:40", unread: 0, status: "今日已汇报", messages: [
        { sender: "蒋明远", time: "18:40", content: "今日进展：\n① Redis 集群完成主备切换验证，切换耗时 < 5s，符合 SLA\n② MinIO 对象存储日均写入量突破 1TB，已触发自动扩容规则\n③ 协助 DBA 组分析慢 SQL，给出 Redis 缓存前置方案\n\n明日计划：\n① 跟进 MQ 消费积压告警优化\n② 与平台组对接缓存 SDK 接口规范" },
      ]},
    ],
  },
  {
    id: "report-infra-db",
    name: "数据库组汇报",
    department: "数据库组",
    owner: "吴晨曦",
    status: "同步完成",
    created: "5月10日 10:00",
    updated: "今天 19:00",
    desc: "数据库组慢查询治理、容量规划与主从架构稳定性保障日报。",
    members: [
      { id: "wuchenxi", name: "吴晨曦", role: "DBA 负责人", avatar: "吴", lastReport: "今天 19:00", unread: 0, status: "今日已汇报", messages: [
        { sender: "吴晨曦", time: "19:00", content: "今日进展：\n① 完成慢查询治理专项，核心表索引优化后 P99 延迟从 320ms 降至 48ms\n② MySQL 主从切换演练顺利完成，RTO < 30s\n③ 存储容量预警：prod-db-02 磁盘使用率 87%，已提扩容工单\n\n明日计划：\n① 跟进扩容审批\n② 输出本季度容量规划报告" },
      ]},
    ],
  },
];

/* 汇报信息源人员数：
   - 可见人员数 = 当前用户有权限查看的人员（source.members，含尚无汇报记录者）
   - 总人员数   = 该信息源配置覆盖的全部人员（source.totalMembers），可能 > 可见人数 */
const reportVisibleCount = (s) => s.members.length;
const reportTotalCount = (s) => Math.max(s.totalMembers ?? s.members.length, s.members.length);

/* ─── 汇报信息源 · 组织树（嵌套结构，支持任意层级）───
   children: 子部门节点列表
   sourceIds: 挂载在该节点下的信息源 id（叶节点）
*/
const orgTree = [
  {
    id: "dept-ceo", name: "总裁办",
    children: [],
    sourceIds: ["report-ceo"],
  },
  {
    id: "dept-rd", name: "研发部",
    children: [
      { id: "dept-app",     name: "应用组",  children: [], sourceIds: ["report-app"]     },
      { id: "dept-backend", name: "后台组",  children: [], sourceIds: ["report-backend"] },
      { id: "dept-agent",   name: "Agent 组",children: [], sourceIds: ["report-agent"]   },
    ],
    sourceIds: [],
  },
  {
    id: "dept-sales", name: "销售部",
    children: [],
    sourceIds: ["report-sales"],
  },
  /* ── 5 层演示：技术中台（每层各挂一个信息源）── */
  {
    id: "dept-platform", name: "技术中台",
    sourceIds: ["report-platform"],
    children: [
      {
        id: "dept-infra", name: "基础架构部",
        sourceIds: ["report-infra"],
        children: [
          { id: "dept-network",  name: "网络组", children: [], sourceIds: ["report-network"]   },
          { id: "dept-security", name: "安全组", children: [], sourceIds: ["report-security"]  },
          { id: "dept-ops",      name: "运维组", children: [], sourceIds: ["report-ops"]       },
          {
            id: "dept-platform-eng", name: "平台组",
            sourceIds: ["report-platform-eng"],
            children: [
              {
                id: "dept-storage", name: "存储小组",
                sourceIds: ["report-storage"],
                children: [
                  { id: "dept-db", name: "数据库组", children: [], sourceIds: ["report-infra-db"] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

/* 递归收集树中所有节点 id */
function collectNodeIds(nodes) {
  let ids = [];
  nodes.forEach(n => { ids.push(n.id); ids = ids.concat(collectNodeIds(n.children)); });
  return ids;
}
/* 递归收集树中所有叶信息源 */
function collectAllSources(nodes) {
  let sources = [];
  nodes.forEach(n => {
    (n.sourceIds || []).forEach(id => { const s = reportSources.find(r => r.id === id); if (s) sources.push(s); });
    sources = sources.concat(collectAllSources(n.children || []));
  });
  return sources;
}

const addCategories = [
  { key: "article",      label: "文章类型", Icon: Icon.File,  desc: "文档、网页、RSS、搜索结果", sources: [{ label: "文档上传", Icon: Icon.File, desc: "PDF · Word · 表格 · 图片" }, { label: "网页链接", Icon: Icon.Globe, desc: "保存网页并抽取正文" }, { label: "RSS 订阅", Icon: Icon.Rss, desc: "持续同步文章流" }, { label: "搜索引擎", Icon: Icon.Search, desc: "按关键词定期抓取" }, { label: "API 接入", Icon: Icon.Code, desc: "自定义结构化数据" }] },
  { key: "conversation", label: "会话类型", Icon: Icon.Msg,   desc: "群聊、IM 机器人、客服工单", sources: [{ label: "企微机器人", Icon: Icon.Msg, desc: "企业微信群聊同步" }, { label: "飞书机器人", Icon: Icon.Msg, desc: "飞书群聊 · 文档 · 日历" }, { label: "SaleSmartly", Icon: Icon.Msg, desc: "客服会话与工单归档" }, { label: "钉钉机器人", Icon: Icon.Msg, desc: "钉钉群聊消息同步" }] },
  { key: "audio",        label: "音频类型", Icon: Icon.Audio, desc: "会议录音、访谈、播客",       sources: [{ label: "音频上传", Icon: Icon.Audio, desc: "主流音视频格式 · 自动转写" }, { label: "实时录音", Icon: Icon.Audio, desc: "实时录音并同步转写" }] },
];

const allSources = [
  /* ── 直接写入 ── */
  { label: "笔记",        Icon: Icon.Note,     desc: "在编辑器中直接编写保存",        category: "笔记", group: "写入", isNote: true },
  { label: "文档上传",    Icon: Icon.File,     desc: "PDF · Word · MD · TXT · 图片", category: "文章", group: "写入" },
  { label: "音频上传",    Icon: Icon.Audio,    desc: "主流音视频格式 · 自动转写",   category: "音频", group: "写入" },
  { label: "实时录音",    Icon: Icon.Audio,    desc: "实时录音并同步转写",            category: "音频", group: "写入" },
  /* ── 授权导入 ── */
  { label: "浏览器插件",  Icon: Icon.Plugin,   desc: "浏览时一键保存网页到信息源",    category: "文章", group: "导入", isPlugin: true },
  { label: "思源笔记",    Icon: Icon.Diamond,  desc: "上传导出包，选择需导入的文档",   category: "文章", group: "导入" },
  { label: "飞书知识库",  Icon: Icon.BookOpen, desc: "OAuth 授权，定时同步知识库变更",  category: "文章", group: "定时同步", isOAuth: true },
  { label: "语雀知识库",  Icon: Icon.Leaf,     desc: "上传导出包，选择需导入的文档",   category: "文章", group: "导入" },
  /* ── 定时同步 ── */
  { label: "网页爬虫",    Icon: Icon.Globe,    desc: "定时抓取网页正文与更新",        category: "文章", group: "定时同步" },
  { label: "RSS 订阅",   Icon: Icon.Rss,      desc: "持续同步 RSS 文章流",           category: "文章", group: "定时同步" },
  { label: "搜索引擎",    Icon: Icon.Search,   desc: "按关键词定期抓取资讯",          category: "文章", group: "定时同步" },
  { label: "API 接入",   Icon: Icon.Code,     desc: "自定义结构化数据推送",           category: "文章", group: "定时同步" },
  { label: "GitHub",     Icon: Icon.GitHub,   desc: "授权读取 README · Issues",     category: "代码", group: "定时同步", isOAuth: true },
  { label: "GitLab",     Icon: Icon.Code,     desc: "授权读取项目文档与 Issues",     category: "代码", group: "定时同步", isOAuth: true },
  { label: "Gitee",      Icon: Icon.Code,     desc: "授权读取 README · Issues",     category: "代码", group: "定时同步", isOAuth: true },
  { label: "企微机器人",  Icon: Icon.Msg,      desc: "企业微信群聊消息同步",           category: "会话", group: "定时同步" },
  { label: "飞书机器人",  Icon: Icon.Msg,      desc: "飞书群聊 · 文档 · 日历",        category: "会话", group: "定时同步" },
  { label: "飞书CLI",    Icon: Icon.Msg,      desc: "拉取飞书群聊消息与成员上下文",    category: "会话", group: "定时同步" },
  { label: "SaleSmartly", Icon: Icon.Msg,     desc: "客服会话与工单归档",             category: "会话", group: "定时同步" },
];

/* ─── FEED URLS MOCK DATA (for connector-type sources) ─── */
const feedUrls = {
  101: [
    { id: 1, url: "https://finance.sina.com.cn/?t1=4&analysts=%C1%F7B9%E2%D2%E2/%D6", lastSync: "2026-03-05 15:15", newCount: 0 },
    { id: 2, url: "https://blog.csdn.net/", lastSync: "2026-03-05 15:15", newCount: 0 },
    { id: 3, url: "https://news.sina.com.cn/", lastSync: "2026-03-05 15:15", newCount: 0 },
    { id: 4, url: "https://news.qq.com/", lastSync: "2026-03-05 15:14", newCount: 0 },
    { id: 5, url: "https://www.xinhuanet.com/politicspro/mobile/index", lastSync: "2026-02-03 15:31", newCount: 0 },
  ],
  102: [
    { id: 1, url: "https://competitor-a.com/", lastSync: "2026-03-05 10:22", newCount: 1 },
    { id: 2, url: "https://competitor-b.com/pricing", lastSync: "2026-03-05 10:05", newCount: 1 },
    { id: 3, url: "https://competitor-c.com/changelog", lastSync: "2026-03-04 09:00", newCount: 0 },
  ],
  104: [
    { id: 1, url: "https://api.github.com/repos/zleap/issues?state=all", lastSync: "2026-03-04 20:01", newCount: 0 },
  ],
  105: [
    { id: 1, url: "百度 · AI信息管理", lastSync: "2026-03-05 08:00", newCount: 2 },
    { id: 2, url: "必应 · AI信息管理", lastSync: "2026-03-05 08:00", newCount: 1 },
  ],
};

const autoSyncSources = ["RSS 订阅", "网页爬虫", "网页链接", "搜索引擎", "API 接入", "飞书知识库", "GitHub", "GitLab", "Gitee", "企微机器人", "飞书机器人", "飞书CLI", "SaleSmartly", "实时录音"];
// 两步配置的连接器（非 git）：① 信息配置（信息源 + 数据接入字段）→ ② 同步设置（信息名称 + 同步计划 + 更多配置）
const STEPPED_CONNECTORS = ["RSS 订阅", "网页爬虫", "搜索引擎", "API 接入", "企微机器人", "飞书机器人", "SaleSmartly"];
// 同步失败后需要用户检查配置/授权才能恢复的来源（重试入口附带「编辑配置」「重新授权」二级入口）
const apiCredSources = ["API 接入", "GitHub", "GitLab", "Gitee", "飞书知识库", "飞书机器人", "飞书CLI", "企微机器人", "SaleSmartly"];
// 来源类型 → 事项视图详情弹窗是否展示「查看链接」入口
// 仅外部抓取/订阅类的事项原文有外链；笔记/文档/连接器类的事项原本就源自文档本身
const hasExternalArticleLink = (src) => ["RSS 订阅", "网页爬虫", "搜索引擎", "音频上传", "实时录音"].includes(src);
// 来源类型 → 失败时的次要操作文案（用于详情页 Header）
const failureSecondaryActionLabel = (src) => {
  if (["GitHub", "GitLab", "Gitee", "飞书知识库"].includes(src)) return "重新授权";
  if (apiCredSources.includes(src)) return "编辑配置";
  return null;
};
// 来源类型 → 失败原因 mock 文案（仅用于原型演示）
const mockFailureReason = (src) => {
  if (["GitHub", "GitLab", "Gitee"].includes(src)) return "OAuth Token 已过期，请重新授权";
  if (src === "飞书知识库")  return "User Access Token 已失效，请重新授权";
  if (src === "API 接入")    return "接口返回 401，请检查请求头与鉴权字段";
  if (src === "飞书机器人")  return "App Secret 已被重置，请更新配置";
  if (src === "企微机器人")  return "企业 ID 或密钥不正确，请检查配置";
  if (src === "SaleSmartly") return "项目密钥已轮换，请更新配置";
  if (src === "文档上传")    return "文档解析失败，疑似文件损坏或包含不支持的格式";
  if (src === "音频上传")    return "音频转写失败，文件时长超出限制或格式不被支持";
  return "同步过程中发生错误，请稍后重试";
};
// 各信息源的默认同步计划（无此 key = 无自动同步，如文档/笔记/音频）
const itemSyncFreq = {
  101: "每天 09:00", 102: "每天 10:00", 104: "每天 08:00",
  105: "每天 08:00", 106: "每周一 09:00", 107: "每天 07:00",
  110: "每天 09:00", 111: "每天 10:00",
  112: "每天 08:00", 113: "每天 14:00", 114: "每天 09:00", 115: "每天 11:00",
  201: "每天 18:00", 202: "每周一 10:00", 203: "每天 20:00",
  210: "每天 09:00",
};

const connectorTaskStatusSources = new Set([
  "飞书机器人", "飞书CLI", "SaleSmartly", "搜索引擎", "RSS 订阅", "企微机器人",
  "网页爬虫", "API 接入", "GitHub", "GitLab", "Gitee", "飞书知识库",
]);

function getDisplaySyncStatus(item, overrideStatus = null) {
  if (!item) return "同步完成";
  if (overrideStatus) return overrideStatus;
  if (!connectorTaskStatusSources.has(item.source)) return item.status;
  const taskRows = [...(articleEntries[item.id] || []), ...(conversationSessions[item.id] || [])];
  if (taskRows.some(row => row.syncStatus === "同步失败")) return "同步失败";
  if (taskRows.some(row => row.syncStatus === "解析中")) return "解析中";
  if (taskRows.some(row => row.syncStatus === "同步中")) return "同步中";
  return item.status || "同步完成";
}

const statusMap = {
  同步完成: { text: "text-emerald-600", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#10b981"/><path d="M4 7l2.2 2.2L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  同步中:   { text: "text-sky-500",     icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#38bdf8"/><path d="M7 4v2.5l1.5 1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  解析中:   { text: "text-amber-500",   icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#f59e0b"/><path d="M7 4.5V7l1.5 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  同步失败: { text: "text-red-500",     icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#f87171"/><path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg> },
};

const articleStatusStyle = {
  "未读":      "bg-sky-50 text-sky-600 border border-sky-100",
  "已读":      "bg-neutral-100 text-neutral-500",
  "已解析":    "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "新增":      "bg-violet-50 text-violet-600 border border-violet-100",
  "已归档":    "bg-neutral-100 text-neutral-400",
  "Open":      "bg-sky-50 text-sky-600 border border-sky-100",
  "In Progress":"bg-amber-50 text-amber-600 border border-amber-100",
  "Closed":    "bg-neutral-100 text-neutral-400",
};

/* ─── COMPONENTS ─── */
function StatusBadge({ status }) {
  const cfg = statusMap[status] || statusMap["同步完成"];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap ${cfg.text}`}>
      {cfg.icon}{status}
    </span>
  );
}

/* 纯图标版状态（用于卡片视图，与「我的信息源」卡片保持一致） */
function StatusIcon({ status }) {
  if (status === "同步中" || status === "解析中")
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="spin"><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>;
  if (status === "同步完成")
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#22c55e"/><polyline points="8 12.5 11 15.5 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (status === "同步失败")
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#ef4444"/><line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>;
  return null;
}

function FolderAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
      <Icon.Folder />
    </div>
  );
}

function SourceAvatar({ source }) {
  const info = sourceInfo[source] || { Icon: Icon.File };
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
      <info.Icon />
    </div>
  );
}

function Tag({ label }) {
  return <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">{label}</span>;
}

function getDisplayTypeLabel(item) {
  if (item.kind === "文件夹") return "信息源";
  if (item.kind === "笔记") return "笔记";
  if (item.source === "实时录音" || item.source === "音频上传") return "音频";
  return sourceInfo[item.source]?.label || item.source;
}

/* ─── 权限徽章：scope 值说明 ───
   - "mine"       → 私密（仅自己及管理员）
   - "partial"    → 部分可见（指定人员/部门）
   - "enterprise" → 所有人可见（企业内全员）
   - inherit=true → 继承自信息源 */
function ScopeBadge({ scope, inherit = false, onClick, plain = false, tooltip }) {
  if (inherit) {
    return (
      <span title="权限由所属信息源统一管理，无法单独修改"
        className="inline-flex cursor-default items-center gap-1 rounded-md border border-neutral-100 bg-neutral-50 px-1.5 py-0.5 text-[11px] text-neutral-400">
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        继承
      </span>
    );
  }
  const cfg = scope === "enterprise"
    ? { cls: "border-emerald-100 bg-emerald-50 text-emerald-700", label: "所有人可见", textCls: "text-emerald-600" }
    : scope === "partial"
    ? { cls: "border-blue-100 bg-blue-50 text-blue-700", label: "部分可见", textCls: "text-blue-600" }
    : { cls: "border-neutral-200 bg-neutral-100 text-neutral-600", label: "私密", textCls: "text-neutral-400" };

  if (plain) {
    return <span className={"text-[11px] " + cfg.textCls}>{cfg.label}</span>;
  }
  const baseCls = "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] transition " + cfg.cls;
  if (onClick) {
    return (
      <button onClick={onClick} title="点击调整权限" className={baseCls + " cursor-pointer hover:brightness-95"}>
        {cfg.label}
      </button>
    );
  }
  return <span title={tooltip} className={baseCls + (tooltip ? " cursor-default" : "")}>{cfg.label}</span>;
}

/* ─── 组织架构树数据 ─── */
const ORG_TREE = [
  { id: "dept-zco", type: "dept", name: "总裁办", children: [
    { id: "u-lijunqin",    type: "user", name: "李俊钦",  role: "技术总监",  avatar: "李" },
    { id: "u-liangyinghao", type: "user", name: "梁英豪", role: "产品总监",  avatar: "梁" },
  ]},
  { id: "dept-rd", type: "dept", name: "研发部", children: [
    { id: "dept-app", type: "dept", name: "应用组", children: [
      { id: "u-sumingyan",  type: "user", name: "苏铭妍", role: "产品经理",   avatar: "苏" },
      { id: "u-yanyjing",   type: "user", name: "严伊婧", role: "UX 设计师",  avatar: "严" },
      { id: "u-chenyusong", type: "user", name: "陈予淞", role: "测试工程师", avatar: "陈" },
      { id: "u-huanghoming",type: "user", name: "黄昊铭", role: "测试实习生", avatar: "黄" },
    ]},
    { id: "dept-backend", type: "dept", name: "后台组", children: [
      { id: "u-lizhimin",    type: "user", name: "李智敏", role: "后端架构师",     avatar: "李" },
      { id: "u-dengxiangbai",type: "user", name: "邓祥柏", role: "前端开发工程师", avatar: "邓" },
      { id: "u-tanningji",   type: "user", name: "唐宁静", role: "前端开发工程师", avatar: "唐" },
      { id: "u-zhouyuncong", type: "user", name: "周运聪", role: "后端开发工程师", avatar: "周" },
    ]},
    { id: "dept-agent", type: "dept", name: "Agent 组", children: [
      { id: "u-chenyongjie",   type: "user", name: "陈勇杰", role: "大模型应用工程师", avatar: "陈" },
      { id: "u-liangzhuocheng",type: "user", name: "梁卓城", role: "大模型应用工程师", avatar: "梁" },
      { id: "u-liguanxian",    type: "user", name: "李冠贤", role: "算法实习生",       avatar: "李" },
    ]},
    { id: "dept-mid", type: "dept", name: "技术中台", children: [
      { id: "u-zhaozihan", type: "user", name: "赵子涵", role: "技术中台负责人", avatar: "赵" },
    ]},
    { id: "dept-infra", type: "dept", name: "基础架构部", children: [
      { id: "u-yehiran", type: "user", name: "叶浩然", role: "基础架构部负责人", avatar: "叶" },
      { id: "dept-network", type: "dept", name: "网络组", children: [
        { id: "u-xujianguo", type: "user", name: "许建国", role: "网络组负责人", avatar: "许" },
      ]},
      { id: "dept-security", type: "dept", name: "安全组", children: [
        { id: "u-fengyalin", type: "user", name: "冯雅琳", role: "安全负责人", avatar: "冯" },
      ]},
      { id: "dept-ops", type: "dept", name: "运维组", children: [
        { id: "u-jiangsiyuan", type: "user", name: "姜思远", role: "运维组负责人", avatar: "姜" },
      ]},
      { id: "dept-platform", type: "dept", name: "平台组", children: [
        { id: "u-lujiayi", type: "user", name: "卢嘉怡", role: "平台组负责人", avatar: "卢" },
        { id: "dept-storage", type: "dept", name: "存储小组", children: [
          { id: "u-jiangmingyuan", type: "user", name: "蒋明远", role: "存储小组负责人", avatar: "蒋" },
        ]},
        { id: "dept-dba", type: "dept", name: "DBA 组", children: [
          { id: "u-wuchenxi", type: "user", name: "吴晨曦", role: "DBA 负责人", avatar: "吴" },
        ]},
      ]},
    ]},
  ]},
  { id: "dept-product", type: "dept", name: "产品部", children: [
    { id: "u-sumingyan-p",   type: "user", name: "苏铭妍", role: "产品经理",  avatar: "苏" },
    { id: "u-yanyjing-p",    type: "user", name: "严伊婧", role: "UX 设计师", avatar: "严" },
    { id: "u-liangyinghao-p",type: "user", name: "梁英豪", role: "产品总监", avatar: "梁" },
  ]},
  { id: "dept-sales", type: "dept", name: "销售部", children: [
    { id: "u-panhaiyong",  type: "user", name: "潘海勇", role: "客户经理", avatar: "潘" },
    { id: "u-linxiaoming", type: "user", name: "林晓明", role: "客户经理", avatar: "林" },
  ]},
];

/* ─── 组织头像配色（模块级，供 OrgPickerModal / OrgChips 共用）─── */
const _ORG_AVATAR_COLORS = ["bg-violet-100 text-violet-600","bg-blue-100 text-blue-600","bg-emerald-100 text-emerald-600","bg-amber-100 text-amber-600","bg-rose-100 text-rose-600","bg-sky-100 text-sky-600"];
const orgAvatarColor = (name) => _ORG_AVATAR_COLORS[(name ? name.charCodeAt(0) : 0) % _ORG_AVATAR_COLORS.length];

/* ─── 组织人员选择弹层 ─── */
function OrgPickerModal({ initialSelected, onClose, onConfirm }) {
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState(() => new Set(["dept-rd"]));
  const [selected, setSelected] = useState(() => new Map((initialSelected || []).map(item => [item.id, item])));

  // 展平树，附带父级 id 路径，用于搜索时定位祖先
  const allNodes = useMemo(() => {
    const flatten = (nodes, parentIds = []) => {
      const out = [];
      for (const n of nodes) {
        out.push({ ...n, parentIds, children: undefined });
        if (n.children) out.push(...flatten(n.children, [...parentIds, n.id]));
      }
      return out;
    };
    return flatten(ORG_TREE);
  }, []);

  // 递归计算部门人数
  const countMembers = (node) => {
    if (node.type === "user") return 1;
    return (node.children || []).reduce((s, c) => s + countMembers(c), 0);
  };

  // 搜索时计算需要显示的节点 id（含祖先）
  const visibleIds = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const matched = allNodes.filter(n => n.name.includes(q) || (n.role && n.role.includes(q)));
    const ids = new Set();
    matched.forEach(n => { ids.add(n.id); n.parentIds.forEach(pid => ids.add(pid)); });
    return ids;
  }, [search, allNodes]);

  const toggleExpand = (id) => setExpandedIds(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const toggleSelect = (node) => setSelected(prev => {
    const m = new Map(prev);
    m.has(node.id) ? m.delete(node.id) : m.set(node.id, { id: node.id, name: node.name, type: node.type });
    return m;
  });

  // 搜索高亮
  const hl = (text) => {
    if (!search.trim()) return text;
    const q = search.toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return <>{text.slice(0, idx)}<mark className="rounded-sm bg-yellow-100 text-neutral-900">{text.slice(idx, idx + search.length)}</mark>{text.slice(idx + search.length)}</>;
  };

  // 递归渲染树节点
  const renderNode = (node, depth = 0) => {
    if (visibleIds && !visibleIds.has(node.id)) return null;
    const isDept = node.type === "dept";
    const isExpanded = search.trim() ? true : expandedIds.has(node.id);
    const isSelected = selected.has(node.id);
    const children = node.children || [];
    const hasChildren = isDept && children.length > 0;
    const memberCount = isDept ? countMembers(node) : 0;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 rounded-lg py-1.5 pr-3 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-neutral-50"}`}
          style={{ paddingLeft: `${10 + depth * 18}px` }}
        >
          {/* 展开收起 */}
          <button
            onClick={() => hasChildren && toggleExpand(node.id)}
            className={`flex h-4 w-4 shrink-0 items-center justify-center text-neutral-300 transition-transform ${isExpanded && hasChildren ? "rotate-90" : ""}`}
          >
            {hasChildren
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              : <span className="block h-4 w-4" />}
          </button>

          {/* 勾选框 */}
          <button
            onClick={() => toggleSelect(node)}
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] transition-colors ${isSelected ? "border-blue-500 bg-blue-500" : "border-neutral-300 hover:border-blue-400"}`}
          >
            {isSelected && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>}
          </button>

          {/* 图标 */}
          {isDept
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-orange-400"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            : <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${orgAvatarColor(node.name)}`}>{node.avatar}</div>
          }

          {/* 名称 */}
          <div className="min-w-0 flex-1 flex items-center gap-1.5 cursor-pointer" onClick={() => toggleSelect(node)}>
            <span className={`text-sm ${isDept ? "font-medium text-neutral-800" : "text-neutral-700"}`}>{hl(node.name)}</span>
            {isDept && memberCount > 0 && <span className="text-[11px] text-neutral-400">{memberCount} 人</span>}
            {!isDept && node.role && <span className="truncate text-[11px] text-neutral-400">{hl(node.role)}</span>}
          </div>
        </div>

        {/* 子节点 */}
        {isDept && hasChildren && isExpanded && children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl overflow-hidden" style={{maxHeight:"580px"}} onClick={e => e.stopPropagation()}>

        {/* 顶栏 */}
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
          <span className="text-sm font-semibold text-neutral-900">选择可见人员 / 部门</span>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
        </div>

        {/* 搜索栏 */}
        <div className="shrink-0 px-4 pt-3 pb-2.5">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索部门或成员姓名…"
              className="w-full rounded-xl border border-neutral-200 py-2 pl-9 pr-8 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><Icon.Close /></button>
            )}
          </div>
        </div>

        {/* 树形列表 */}
        <div className="flex-1 overflow-y-auto px-3 py-1">
          {ORG_TREE.map(node => renderNode(node, 0))}
          {visibleIds && visibleIds.size === 0 && (
            <div className="py-10 text-center text-sm text-neutral-400">未找到「{search}」</div>
          )}
        </div>

        {/* 已选标签 */}
        {selected.size > 0 && (
          <div className="shrink-0 border-t border-neutral-100 px-4 py-2.5">
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selected.values()).map(item => (
                <span key={item.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                  {item.name}
                  <button onClick={() => toggleSelect(item)} className="text-blue-400 hover:text-blue-600">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </span>
              ))}
              <button onClick={() => setSelected(new Map())} className="px-1 text-xs text-neutral-400 hover:text-neutral-600 transition">清空</button>
            </div>
          </div>
        )}

        {/* 底栏 */}
        <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-5 py-3.5">
          <span className="text-xs text-neutral-400">已选 {selected.size} 项</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-neutral-200 px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
            <button onClick={() => onConfirm(Array.from(selected.values()))} className="rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-orange-600">确认</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 已选人员/部门 chips（部门=图标，人员=头像）─── */
function OrgChips({ items, onRemove }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {items.map(item => {
        const isDept = item.type === "dept";
        return (
          <span key={item.id} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-1.5 text-xs text-neutral-700 shadow-sm transition hover:border-neutral-300">
            {isDept ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>
              </span>
            ) : (
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${orgAvatarColor(item.name)}`}>
                {item.avatar || item.name[0]}
              </span>
            )}
            <span className="font-medium leading-none">{item.name}</span>
            <button onClick={() => onRemove(item)}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </span>
        );
      })}
    </div>
  );
}

/* ─── 权限修改弹层 ─── */
function PermissionPopover({ folder, childCount, onClose, onConfirm }) {
  const [selected, setSelected] = useState(folder.scope || "mine");
  const [partialSelected, setPartialSelected] = useState([
    { id: "dept-product", name: "产品部", type: "dept" },
    { id: "dept-rd",      name: "研发部", type: "dept" },
    { id: "u-yanyjing",   name: "严伊婧", type: "user" },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const changed = selected !== (folder.scope || "mine");

  const options = [
    { key: "mine",       Ico: Icon.Lock,    label: "私密",      color: "border-neutral-400 bg-neutral-50 ring-1 ring-neutral-300",    iconColor: "text-neutral-500",  desc: "仅自己及管理员可见" },
    { key: "partial",    Ico: Icon.Users,   label: "部分可见",   color: "border-blue-400 bg-blue-50/60 ring-1 ring-blue-300",          iconColor: "text-blue-500",     desc: "指定人员或部门可见" },
    { key: "enterprise", Ico: Icon.GlobeLg, label: "所有人可见", color: "border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-300", iconColor: "text-emerald-500",  desc: "企业内所有人可见" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={onClose}>
        <div className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl" style={{maxHeight:"85vh"}} onClick={(e) => e.stopPropagation()}>

          {/* 顶栏 */}
          <div className="shrink-0 flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-4">
            <div>
              <div className="text-base font-semibold text-neutral-900">权限设置</div>
              <div className="mt-0.5 text-xs text-neutral-400">信息源：{folder.name}</div>
            </div>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {childCount > 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3">
                <span className="mt-0.5 text-amber-500"><Icon.Alert /></span>
                <p className="text-xs leading-relaxed text-amber-800">
                  修改后将同步影响该信息源内 <strong>{childCount} 个文件</strong> 的权限，无法单独设置。
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2.5">
              {options.map(opt => (
                <button key={opt.key} onClick={() => setSelected(opt.key)}
                  className={`rounded-xl border p-3.5 text-left transition ${selected === opt.key ? opt.color : "border-neutral-200 hover:border-neutral-300"}`}>
                  <div className={`mb-2 ${selected === opt.key ? opt.iconColor : "text-neutral-400"}`}><opt.Ico /></div>
                  <div className="text-sm font-semibold text-neutral-900">{opt.label}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-neutral-500">{opt.desc}</div>
                </button>
              ))}
            </div>

            {selected === "partial" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">可见人员 / 部门</label>
                <button onClick={() => setShowPicker(true)}
                  className="flex w-full items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-2.5 text-sm text-neutral-400 transition hover:border-blue-300 hover:bg-blue-50">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-blue-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <span>搜索或选择部门 / 人员…</span>
                </button>
                <OrgChips items={partialSelected} onRemove={item => setPartialSelected(prev => prev.filter(p => p.id !== item.id))} />
              </div>
            )}
          </div>

          {/* 底栏 */}
          <div className="shrink-0 flex justify-end gap-2.5 border-t border-neutral-100 px-6 py-4">
            <button onClick={onClose} className="rounded-lg border border-neutral-200 px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
            <button onClick={() => { onConfirm(selected); onClose(); }} disabled={!changed}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium text-white transition ${changed ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-neutral-300"}`}>
              确认修改
            </button>
          </div>
        </div>
      </div>

      {showPicker && (
        <OrgPickerModal
          initialSelected={partialSelected}
          onClose={() => setShowPicker(false)}
          onConfirm={(items) => { setPartialSelected(items); setShowPicker(false); }}
        />
      )}
    </>
  );
}

/* ─── DETAIL PANEL ─── */
function DetailPanel({ item, onClose, onViewDetail }) {
  const isFolder = item.kind === "文件夹";
  const metaRows = isFolder ? [
    ["信息源数量", `${item.count} 个`],
    ["所有者", item.owner],
    ["最近更新", item.updated],
  ] : [
    ["来源", item.source],
    ["类型", item.kind],
    ...(item.duration ? [["时长", item.duration]] : []),
    ["所有者", item.owner],
    ["最近同步", item.updated],
  ];

  return (
    <div className="flex w-72 shrink-0 flex-col border-l border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
        <span className="text-sm font-semibold text-neutral-700">详情</span>
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex items-start gap-3">
          {isFolder ? <FolderAvatar /> : <SourceAvatar source={item.source} />}
          <div className="min-w-0 pt-0.5">
            <div className="text-sm font-semibold leading-snug text-neutral-900">{item.name}</div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {isFolder ? item.tags.map(t => <Tag key={t} label={t} />) : <Tag label={item.kind} />}
            </div>
          </div>
        </div>

        {item.status && <div className="mb-4"><StatusBadge status={item.status} /></div>}

        <p className="mb-5 rounded-xl bg-neutral-50 p-3.5 text-sm leading-relaxed text-neutral-600">{item.desc}</p>

        <div className="space-y-3">
          {metaRows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">{k}</span>
              <span className="text-neutral-700">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 border-t border-neutral-100 p-4">
        <button className="flex-1 rounded-xl border border-neutral-200 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">编辑</button>
        <button onClick={onViewDetail} className="flex-1 rounded-xl bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600">查看内容</button>
      </div>
    </div>
  );
}

/* ─── LIST VIEW ─── */
function ListView({ items, onOpenFolder, onSelectItem, onContextMenu,
                    expandedFolders, onToggleFolder, folderScopes, onPermissionClick, folderChildren, inFolderPage, onCreateNew,
                    crossFolderView, folderList, onGoToFolder, syncingIds = new Set() }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  // 重试：点击失败状态后本地切换为「解析中」
  const [retryingIds, setRetryingIds] = useState(new Set());
  const handleRetry = (id) => setRetryingIds(prev => new Set([...prev, id]));

  const toSortKey = (updated) => {
    if (!updated) return 0;
    if (updated === "刚刚") return Number.MAX_SAFE_INTEGER; // 「刚刚」= 最新，永远排在最前
    if (updated.startsWith("今天")) { const [h,m]=(updated.split(" ")[1]||"00:00").split(":").map(Number); return new Date(2026,4,20,h,m).getTime(); }
    if (updated.startsWith("昨天")) { const [h,m]=(updated.split(" ")[1]||"00:00").split(":").map(Number); return new Date(2026,4,19,h,m).getTime(); }
    const mx=updated.match(/(\d+)月(\d+)日\s+(\d+):(\d+)/);
    if (mx) return new Date(2026,Number(mx[1])-1,Number(mx[2]),Number(mx[3]),Number(mx[4])).getTime();
    return 0;
  };
  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };
  const sortedItems = sortCol ? [...items].sort((a,b) => {
    const va = sortCol === "updated" ? toSortKey(a.updated) : sortCol === "created" ? toSortKey(a.created || a.updated) : (a.name||"");
    const vb = sortCol === "updated" ? toSortKey(b.updated) : sortCol === "created" ? toSortKey(b.created || b.updated) : (b.name||"");
    return sortDir === "desc" ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1);
  }) : items;

  // 渲染单行（区分文件夹/源/子源）
  const renderRow = (item, idx, total, isChild = false) => {
    const isFolder = item.kind === "文件夹";
    const typeLabel = getDisplayTypeLabel(item);
    const summary = isFolder ? getFolderSummary(item) : null;
    const isExpanded = isFolder && expandedFolders && expandedFolders.has(item.id);
    // 权限：文件夹用 folderScopes；子项优先继承 folderScopes[folderId]（修改后实时同步）
    const itemScope = isFolder
      ? (folderScopes && folderScopes[item.id]) || item.scope
      : item.folderId != null
        ? (folderScopes && folderScopes[item.folderId]) || getItemScope(item)
        : getItemScope(item);

    return (
      <div key={item.id}
        className={`group grid cursor-pointer grid-cols-12 items-center gap-x-4 py-3 transition-colors border-b border-neutral-200/70 ${isChild ? "bg-neutral-50/80 pl-3 pr-4 border-l-[3px] border-l-orange-200/70 hover:bg-orange-50/40" : "bg-white px-4 hover:bg-neutral-50"}`}
        onClick={() => isFolder ? onOpenFolder(item) : onSelectItem(item)}
      >
        {/* 名称 */}
        <div className={`col-span-3 flex min-w-0 items-center gap-2 ${isChild ? "pl-6" : ""}`}>
          {isFolder ? (
            <button onClick={e => { e.stopPropagation(); onToggleFolder && onToggleFolder(item.id); }}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            !isChild && <span className="w-5" />
          )}
          {isFolder ? <FolderAvatar /> : <SourceAvatar source={item.source} />}
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium text-neutral-800" title={item.name}>{item.name}</div>
            {crossFolderView && !isFolder && (() => {
              const pf = (folderList || []).find(f => f.id === item.folderId);
              return pf ? (
                <button onClick={e => { e.stopPropagation(); onGoToFolder && onGoToFolder(pf); }}
                  className="flex items-center gap-0.5 mt-0.5 max-w-full text-[11px] text-neutral-400 hover:text-orange-500 transition-colors">
                  <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span className="truncate">{pf.name}</span>
                  <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ) : null;
            })()}
          </div>
        </div>

        {/* 权限：信息源内的信息显示「继承」只读标记；外层列表可点击修改 */}
        <div className="col-span-1 flex items-center overflow-hidden">
          {inFolderPage && !isFolder
            ? <ScopeBadge scope={itemScope} tooltip="权限由所属信息源统一管理，无法单独修改" />
            : <ScopeBadge scope={itemScope} plain />
          }
        </div>

        {/* 类型 */}
        <div className="col-span-1 overflow-hidden"
          title={isFolder ? ((item.tags || []).length ? `包含：${(item.tags || []).join("、")}` : "信息源") : typeLabel}>
          {isFolder
            ? <Tag label="信息源" />
            : <Tag label={typeLabel} />
          }
        </div>

        {/* 创建人 */}
        <div className="col-span-2 flex min-w-0 items-center gap-2 overflow-hidden">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-600">{(item.owner||"?")[0]}</span>
          <span className="truncate text-sm text-neutral-600" title={item.owner}>{item.owner}</span>
        </div>

        {/* 最近同步 */}
        <div className="col-span-2 overflow-hidden truncate text-sm text-neutral-500" title={item.updated}>{item.updated}</div>

        {/* 创建时间 */}
        <div className="col-span-1 truncate text-xs text-neutral-400" title={item.created || "—"}>{item.created || "—"}</div>

        {/* 状态/概况 + 操作 */}
        {(() => {
          const effStatus = getDisplaySyncStatus(item, syncingIds.has(item.id) || retryingIds.has(item.id) ? "解析中" : null);
          const canRetry = effStatus === "同步失败" && item.source !== "笔记" && item.kind !== "笔记";
          return (
            <div className="col-span-2 flex items-center justify-between gap-1 overflow-hidden">
              {isFolder ? (
                <span className="truncate text-xs text-neutral-500">{summary.total} 项</span>
              ) : canRetry ? (
                // 失败状态徽章即重试入口：默认显示「同步失败」，hover 变「点击重试」
                <button onClick={e => { e.stopPropagation(); handleRetry(item.id); }}
                  title={`${mockFailureReason(item.source)} · 点击重试`}
                  className="group/rt flex min-w-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
                  <span className="group-hover/rt:hidden inline-flex items-center gap-1 whitespace-nowrap">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#f87171"/><path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    同步失败
                  </span>
                  <span className="hidden group-hover/rt:inline-flex items-center gap-1 whitespace-nowrap">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                    点击重试
                  </span>
                </button>
              ) : (
                <StatusBadge status={effStatus} />
              )}
              <button onClick={e => { e.stopPropagation(); onContextMenu(item, e); }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-300 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-600">
                <Icon.More />
              </button>
            </div>
          );
        })()}
      </div>
    );
  };

  // 把文件夹行 + 其展开后的子项 按顺序铺平
  const flatRows = [];
  sortedItems.forEach(item => {
    flatRows.push(item);
    if (item.kind === "文件夹" && expandedFolders && expandedFolders.has(item.id)) {
      const children = (folderChildren && folderChildren[item.id]) || [];
      children.forEach(c => flatRows.push({ ...c, _isChild: true }));
    }
  });

  return (
    <div>
      <div className="relative z-10 grid grid-cols-12 items-center gap-x-4 border-b border-neutral-200/70 bg-neutral-50 px-4 py-2.5">
        {/* 名称 sortable + 新建信息源 icon 按钮 */}
        <div className="col-span-3 flex items-center gap-1.5">
          <button onClick={() => handleSort("name")}
            className="flex items-center text-left text-xs font-medium text-neutral-400 hover:text-neutral-600">
            <span className="ml-7">名称</span><Icon.Sort active={sortCol === "name"} />
          </button>
          {onCreateNew && !inFolderPage && (
            <button onClick={onCreateNew} title="新建信息源"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          )}
        </div>

        {/* 权限 */}
        <div className="col-span-1 text-xs font-medium text-neutral-400">权限</div>

        {/* 类型 */}
        <div className="col-span-1 text-xs font-medium text-neutral-400">类型</div>

        {/* 创建人 */}
        <div className="col-span-2 text-xs font-medium text-neutral-400">创建人</div>

        {/* 最近同步 sortable */}
        <button onClick={() => handleSort("updated")}
          className={`col-span-2 flex items-center text-left text-xs font-medium transition-colors ${sortCol === "updated" ? "text-orange-600" : "text-neutral-400 hover:text-neutral-600"}`}>
          最近同步<Icon.Sort active={sortCol === "updated"} />
        </button>

        {/* 创建时间 sortable */}
        <button onClick={() => handleSort("created")}
          className={`col-span-1 flex items-center text-left text-xs font-medium transition-colors ${sortCol === "created" ? "text-orange-600" : "text-neutral-400 hover:text-neutral-600"}`}>
          创建时间<Icon.Sort active={sortCol === "created"} />
        </button>

        {/* 概况（文件夹）/ 状态（源） */}
        <div className="col-span-2 text-xs font-medium text-neutral-400">{inFolderPage ? "状态" : "概况"}</div>
      </div>

      <div>
        {flatRows.map((row, idx) => renderRow(row, idx, flatRows.length, row._isChild))}
      </div>
    </div>
  );
}

/* ─── Mac Finder folder SVG icon ─── */
function FinderFolderIcon({ status }) {
  const hasError = status === "同步失败";
  const isSyncing = status === "同步中" || status === "解析中";
  const p = hasError
    ? { t0:"#FFBDBD", t1:"#E87070", b0:"#F5A0A0", b1:"#CC4444", shine:"rgba(255,255,255,0.28)" }
    : isSyncing
    ? { t0:"#B0D8F8", t1:"#6AAEE0", b0:"#90C8F5", b1:"#3A88CC", shine:"rgba(255,255,255,0.28)" }
    : { t0:"#B8DEFF", t1:"#7AB8E8", b0:"#98CCEE", b1:"#4898CC", shine:"rgba(255,255,255,0.30)" };
  const uid = hasError ? "e" : isSyncing ? "s" : "n";
  return (
    <svg width="80" height="68" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`fb${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.b0}/>
          <stop offset="100%" stopColor={p.b1}/>
        </linearGradient>
        <linearGradient id={`ft${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.t0}/>
          <stop offset="100%" stopColor={p.t1}/>
        </linearGradient>
        <linearGradient id={`fs${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.42"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* body */}
      <rect x="0" y="20" width="80" height="48" rx="6" fill={`url(#fb${uid})`}/>
      {/* tab */}
      <path d="M3 20 C3 12 6 10 10 10 L27 10 C31 10 34 12 36.5 16.5 L40 20 Z" fill={`url(#ft${uid})`}/>
      {/* back strip right of tab */}
      <path d="M40 20 H77 C78.7 20 80 21.3 80 23 V20 Z" fill={p.t1} fillOpacity="0.55"/>
      {/* top highlight shine */}
      <path d="M0 20 H80 V34 C80 34 62 38 40 38 C18 38 0 34 0 34 Z" fill={`url(#fs${uid})`}/>
      {/* bottom depth shadow */}
      <rect x="0" y="58" width="80" height="10" rx="6" fill="rgba(0,0,0,0.10)"/>
    </svg>
  );
}

/* ─── CARD VIEW ─── */
const FOLDER_PALETTE = [
  { bg: "bg-emerald-100/80 hover:bg-emerald-200/70", icon: "text-emerald-800/70" },
  { bg: "bg-sky-100/80 hover:bg-sky-200/70",         icon: "text-sky-800/70" },
  { bg: "bg-violet-100/80 hover:bg-violet-200/70",   icon: "text-violet-800/70" },
  { bg: "bg-amber-100/80 hover:bg-amber-200/70",     icon: "text-amber-800/70" },
  { bg: "bg-rose-100/80 hover:bg-rose-200/70",       icon: "text-rose-800/70" },
  { bg: "bg-teal-100/80 hover:bg-teal-200/70",       icon: "text-teal-800/70" },
];

// 卡片同步频率缩略：每月/每周多天时收缩为「每X N天 HH:mm」
function abbrevFreq(freq) {
  if (!freq) return freq;
  const mMonth = freq.match(/^每月\s+(.+?)\s+(\d{2}:\d{2})$/);
  if (mMonth) {
    const parts = mMonth[1].split("、");
    if (parts.length >= 3) return `每月 ${parts.length} 天 ${mMonth[2]}`;
    return freq;
  }
  const mWeek = freq.match(/^每周(.+?)\s+(\d{2}:\d{2})$/);
  if (mWeek) {
    const parts = mWeek[1].split("、");
    if (parts.length >= 3) return `每周 ${parts.length} 天 ${mWeek[2]}`;
    return freq;
  }
  return freq;
}

function HeaderFilterButton({ filterType, filterStatus, filterPerm, allTypeOptions, onFilterType, onFilterStatus, onFilterPerm, onClearFilters, iconOnly }) {
  const [open, setOpen] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(null);
  const statusOptions = ["同步中", "同步完成", "解析中", "同步失败"];
  const permOptions = ["私密", "部分可见", "所有人可见"];
  const activeCount = filterType.size + filterPerm.size + filterStatus.size;
  const hasFilters = activeCount > 0;
  const typeLabel = filterType.size === 0 ? "请选择类型" : filterType.size === 1 ? [...filterType][0] : `已选 ${filterType.size} 项`;
  const permLabel = filterPerm.size === 0 ? "请选择权限" : filterPerm.size === 1 ? [...filterPerm][0] : `已选 ${filterPerm.size} 项`;
  const statusLabel = filterStatus.size === 0 ? "请选择同步状态" : filterStatus.size === 1 ? [...filterStatus][0] : `已选 ${filterStatus.size} 项`;
  const closePanel = () => {
    setOpen(false);
    setOpenSelect(null);
  };
  return (
    <div className="relative z-20">
      <button onClick={() => { setOpen(v => !v); setOpenSelect(null); }}
        title={iconOnly ? "筛选" : undefined}
        className={
          iconOnly
            ? `relative flex h-8 w-8 items-center justify-center rounded-xl transition ${hasFilters || open ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200" : "bg-neutral-100/80 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"}`
            : `flex h-8 items-center gap-1.5 rounded-xl px-3 text-sm transition ${hasFilters || open ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200" : "bg-neutral-100/80 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"}`
        }>
        <Icon.Filter />
        {!iconOnly && <><span>筛选</span><Icon.ChevronDown /></>}
        {iconOnly && hasFilters && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-white">{activeCount}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={closePanel} />
          <div className="glass-strong absolute right-0 top-9 z-40 w-80 overflow-visible rounded-2xl shadow-xl">
            <div className="border-b border-border/40 px-4 py-3">
              <div className="text-sm font-semibold text-neutral-800">筛选</div>
            </div>
            <div className="space-y-3 px-4 py-4">
              <div className="grid grid-cols-[64px_1fr] items-start gap-2">
                <label className="mt-2.5 text-sm text-neutral-600">类型</label>
                <div className="relative">
                  <div onClick={() => setOpenSelect(openSelect === "type" ? null : "type")}
                    className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-left text-sm transition ${openSelect === "type" ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <span className={filterType.size > 0 ? "text-neutral-800" : "text-neutral-400"}>{typeLabel}</span>
                    <span className="ml-auto flex items-center gap-1 text-neutral-400">
                      {filterType.size > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); onFilterType("全部"); }}
                          className="rounded-full transition hover:bg-neutral-100 hover:text-orange-500"
                          title="清空类型">
                          <Icon.Close />
                        </button>
                      )}
                      <Icon.ChevronDown />
                    </span>
                  </div>
                  {openSelect === "type" && (
                    <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-xl">
                      {allTypeOptions.map(opt => {
                        const checked = filterType.has(opt);
                        return (
                          <button key={opt} onClick={() => onFilterType(opt)}
                            className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition ${checked ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50"}`}>
                            {checked ? <Icon.Check /> : <span className="w-[14px]" />}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[64px_1fr] items-center gap-2">
                <label className="text-sm text-neutral-600">权限</label>
                <div className="relative">
                  <div onClick={() => setOpenSelect(openSelect === "perm" ? null : "perm")}
                    className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-left text-sm transition ${openSelect === "perm" ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <span className={filterPerm.size === 0 ? "text-neutral-400" : "text-neutral-800"}>{permLabel}</span>
                    <span className="ml-auto flex items-center gap-1 text-neutral-400">
                      {filterPerm.size > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); onFilterPerm("全部"); }}
                          className="rounded-full transition hover:bg-neutral-100 hover:text-orange-500"
                          title="清空权限">
                          <Icon.Close />
                        </button>
                      )}
                      <Icon.ChevronDown />
                    </span>
                  </div>
                  {openSelect === "perm" && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-xl">
                      {permOptions.map(opt => {
                        const checked = filterPerm.has(opt);
                        return (
                          <button key={opt} onClick={() => onFilterPerm(opt)}
                            className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition ${checked ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50"}`}>
                            {checked ? <Icon.Check /> : <span className="w-[14px]" />}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[64px_1fr] items-center gap-2">
                <label className="text-sm text-neutral-600">同步状态</label>
                <div className="relative">
                  <div onClick={() => setOpenSelect(openSelect === "status" ? null : "status")}
                    className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-left text-sm transition ${openSelect === "status" ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <span className={filterStatus.size === 0 ? "text-neutral-400" : "text-neutral-800"}>{statusLabel}</span>
                    <span className="ml-auto flex items-center gap-1 text-neutral-400">
                      {filterStatus.size > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); onFilterStatus("全部"); }}
                          className="rounded-full transition hover:bg-neutral-100 hover:text-orange-500"
                          title="清空同步状态">
                          <Icon.Close />
                        </button>
                      )}
                      <Icon.ChevronDown />
                    </span>
                  </div>
                  {openSelect === "status" && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-xl">
                      {statusOptions.map(opt => {
                        const checked = filterStatus.has(opt);
                        return (
                          <button key={opt} onClick={() => onFilterStatus(opt)}
                            className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition ${checked ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50"}`}>
                            {checked ? <Icon.Check /> : <span className="w-[14px]" />}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {hasFilters && (
              <div className="flex justify-end border-t border-neutral-100 px-4 py-3">
                <button onClick={() => { onClearFilters(); closePanel(); }} className="text-xs font-medium text-orange-500 hover:text-orange-600">清空筛选</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CardView({ items, onOpenFolder, onSelectItem, onContextMenu, onEditConfig, folderScopes, onPermissionClick, timeMode = "updated", onCreateNew, folderList = [], crossFolderView = false, syncingIds = new Set() }) {
  // 自动同步开关状态：key=itemId, value=boolean; 默认开启，同步失败的默认关闭
  const [syncStates, setSyncStates] = React.useState(() => {
    const init = {};
    items.forEach(item => { if (itemSyncFreq[item.id]) init[item.id] = getDisplaySyncStatus(item) !== "同步失败"; });
    return init;
  });
  const toggleSync = (id) => setSyncStates(prev => ({ ...prev, [id]: !prev[id] }));
  // 重试：点击失败状态图标后，该信息本地切换为「解析中」
  const [retryingIds, setRetryingIds] = React.useState(new Set());
  const handleRetry = (id) => setRetryingIds(prev => new Set([...prev, id]));
  const toSortKey = (d) => {
    if (!d) return 0;
    if (d === "刚刚") return Number.MAX_SAFE_INTEGER; // 「刚刚」= 最新，永远排在最前
    if (d.startsWith("今天")) { const parts = (d.split(" ")[1] || "00:00").split(":").map(Number); return new Date(2026,4,20,parts[0],parts[1]).getTime(); }
    if (d.startsWith("昨天")) { const parts = (d.split(" ")[1] || "00:00").split(":").map(Number); return new Date(2026,4,19,parts[0],parts[1]).getTime(); }
    const mx = d.match(/(\d+)月(\d+)日\s+(\d+):(\d+)/); if (mx) return new Date(2026,Number(mx[1])-1,Number(mx[2]),Number(mx[3]),Number(mx[4])).getTime();
    return 0;
  };
  const sortedItems = [...items].sort((a, b) => toSortKey(b[timeMode]) - toSortKey(a[timeMode]));
  const pageSize = 12;
  const [page, setPage] = React.useState(1);
  const itemKey = sortedItems.map(item => item.id).join('|');
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const pagedItems = sortedItems.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => setPage(1), [itemKey, timeMode]);
  React.useEffect(() => setPage(current => Math.min(current, totalPages)), [totalPages]);
  return (
    <div className="flex min-h-full flex-col">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
      {onCreateNew && (
        <div onClick={onCreateNew}
          className="group relative flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/40 text-neutral-300 backdrop-blur transition-all hover:border-orange-300 hover:bg-orange-50/30 hover:text-orange-400">
          <i className="ri-add-line text-[42px] font-light leading-none" />
          <div className="mt-3 text-sm font-medium transition-colors group-hover:text-orange-500">新建信息源</div>
        </div>
      )}
      {pagedItems.map(item => {
        const isFolder = item.kind === "文件夹";
        const summary = isFolder ? getFolderSummary(item) : null;
        const currentScope = isFolder ? (folderScopes && folderScopes[item.id]) || item.scope : null;

        if (isFolder) {
          const isOwned = !item.owner || item.owner === CURRENT_USER;
          const isRestricted = currentScope !== "enterprise";
          const folderAsset = isOwned
            ? (isRestricted ? folderOrangeLocked : folderOrange)
            : folderBlue;
          const permissionLabel = currentScope === "enterprise"
            ? "所有人可见"
            : currentScope === "partial"
            ? "部分可见"
            : "私密";
          return (
            <div key={item.id} onClick={() => onOpenFolder(item)}
              className="group relative flex min-h-[168px] cursor-pointer flex-col items-center rounded-2xl px-3 py-3 text-center transition hover:bg-white/70 hover:shadow-sm">
              <div className="absolute right-2 top-2">
                <button onClick={e => { e.stopPropagation(); onContextMenu(item, e); }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label={`${item.name}更多操作`}>
                  <Icon.More />
                </button>
              </div>
              <div className="relative mt-1 h-[84px] w-[104px] shrink-0 transition-transform duration-200 group-hover:-translate-y-1">
                <img src={folderAsset} alt="" className="h-full w-full object-contain" />
                {isRestricted && !isOwned && (
                  <button onClick={e => { e.stopPropagation(); onPermissionClick && onPermissionClick(item.id); }}
                    title={permissionLabel} aria-label={`${item.name}权限：${permissionLabel}`}
                    className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-200/80 text-cyan-700 shadow-sm transition hover:bg-cyan-100">
                    <i className="ri-lock-2-line text-base" />
                  </button>
                )}
                {isRestricted && isOwned && (
                  <button onClick={e => { e.stopPropagation(); onPermissionClick && onPermissionClick(item.id); }}
                    title={permissionLabel} aria-label={`${item.name}权限：${permissionLabel}`}
                    className="absolute bottom-2 right-2 h-9 w-9 rounded-lg opacity-0 transition group-hover:opacity-100" />
                )}
              </div>
              <button onClick={e => { e.stopPropagation(); onPermissionClick && onPermissionClick(item.id); }}
                title={`权限：${permissionLabel}`}
                className={`mt-0.5 text-[12px] transition hover:underline ${isOwned ? "text-neutral-400 hover:text-orange-500" : "text-cyan-600/80 hover:text-cyan-700"}`}>
                {summary.total}项
              </button>
              <div className="mt-2 line-clamp-2 max-w-[170px] text-[14px] font-semibold leading-5 text-neutral-900">{item.name}</div>
            </div>
          );
        }

        /* ── Regular info item card：预览/类型图标 + 两行名称 ── */
        const itemScope = getItemScope(item, folderList);
        const scopeStyle = itemScope === "enterprise"
          ? { label: "公开", surface: "bg-sky-100", icon: "text-sky-500" }
          : itemScope === "partial"
          ? { label: "部分公开", surface: "bg-violet-100", icon: "text-violet-600" }
          : { label: "私密", surface: "bg-orange-100", icon: "text-orange-500" };
        const typeLabel = getDisplayTypeLabel(item);
        const typeIcon = infoCardTypeIcons[typeLabel] || "ri-file-line";
        const previewUrl = item.previewUrl || item.thumbnailUrl;
        return (
          <div key={item.id} className="min-w-0">
            <div className="mb-1.5 truncate px-1 text-[11px] text-neutral-400">{scopeStyle.label}</div>
            <div onClick={() => onSelectItem(item)}
              className="group relative flex aspect-square cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md">
              <button onClick={e => { e.stopPropagation(); onContextMenu(item, e); }}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-white/85 text-neutral-500/60 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:text-neutral-800"
                aria-label={`${item.name}更多操作`}>
                <Icon.More />
              </button>
              <div className="flex min-h-0 flex-1 items-center justify-center px-4 pt-4">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-full max-h-[86px] w-full rounded-lg object-contain" />
                ) : (
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${scopeStyle.surface}`}>
                    <i className={`${typeIcon} text-[30px] ${scopeStyle.icon}`} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="flex min-h-[48px] items-center justify-center px-3 pb-3 pt-1 text-center">
                <div title={item.name} className="line-clamp-2 text-[12px] font-medium leading-[17px] text-neutral-800">
                  {compactInfoName(item.name)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      </div>
      <CardPagination page={page} totalPages={totalPages} totalItems={sortedItems.length} onPageChange={setPage} className="mt-auto pt-8" />
    </div>
  );
}

/* ─── CONTEXT MENU ─── */
function ContextMenu({ item, pos, onRename, onMove, onDelete, onPermission, onEditConfig, onSyncNow, onDownload, onClose }) {
  const isFolder = item.kind === "文件夹";
  const isConnector = !isFolder && !["笔记", "文档上传", "音频上传", "实时录音"].includes(item.source) && item.kind !== "笔记";
  const canDownload = !isFolder && (["文档", "音频"].includes(getDisplayTypeLabel(item)) || ["文档上传", "音频上传", "实时录音"].includes(item.source));
  const canDelete = !(isFolder && item._isDefault);
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed z-50 min-w-[148px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-xl"
        style={{ top: pos.y, left: pos.x }}>
        {isConnector && (() => {
          const isBusy = item.status === "解析中" || item.status === "同步中";
          return (<>
            <button onClick={() => { onEditConfig && onEditConfig(item); onClose(); }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
              <span className="text-neutral-400"><Icon.Settings /></span>编辑配置
            </button>
            <button
              disabled={isBusy}
              onClick={() => { if (!isBusy) { onSyncNow && onSyncNow(item); onClose(); } }}
              title={isBusy ? "当前正在同步中，请稍后再试" : undefined}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm ${isBusy ? "cursor-not-allowed text-neutral-300" : "text-neutral-700 hover:bg-neutral-50"}`}>
              <span className={isBusy ? "text-neutral-300" : "text-neutral-400"}><Icon.SyncNow /></span>立即同步
            </button>
            <div className="my-1 border-t border-neutral-100" />
          </>);
        })()}
        <button onClick={() => { onRename(item); onClose(); }}
          className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          <span className="text-neutral-400"><Icon.Pencil /></span>重命名
        </button>
        {canDownload && (
          <button onClick={() => { onDownload && onDownload(item); onClose(); }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            <span className="text-neutral-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>下载
          </button>
        )}
        {isFolder && (
          <button onClick={() => { onPermission && onPermission(item); onClose(); }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            <span className="text-neutral-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>权限设置
          </button>
        )}
        {!isFolder && (
          <button onClick={() => { onMove(item); onClose(); }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            <span className="text-neutral-400"><Icon.Move /></span>复制至
          </button>
        )}
        {canDelete && (
          <>
            <div className="my-1 border-t border-neutral-100" />
            <button onClick={() => { onDelete(item); onClose(); }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50">
              <Icon.Trash />删除{isFolder ? "信息源" : ""}
            </button>
          </>
        )}
      </div>
    </>
  );
}

/* ─── RENAME MODAL ─── */
/* ─── 事项视图：日期筛选辅助函数 ─── */
// 原型 today 固定为 6/8/2026（与 TimelineCalendar 内的 isToday 一致）
const PROTOTYPE_TODAY = { m: 6, d: 8 };
const PROTOTYPE_YESTERDAY = { m: 6, d: 7 };
function matchGroupDate(groupDate, selectedDay) {
  if (groupDate === "今天") return PROTOTYPE_TODAY.m === selectedDay.m && PROTOTYPE_TODAY.d === selectedDay.d;
  if (groupDate === "昨天") return PROTOTYPE_YESTERDAY.m === selectedDay.m && PROTOTYPE_YESTERDAY.d === selectedDay.d;
  const match = String(groupDate).match(/(\d+)月(\d+)日/);
  if (match) return selectedDay.m === parseInt(match[1]) && selectedDay.d === parseInt(match[2]);
  return false; // 非日期分组不参与筛选
}
function filterTimelineGroups(groups, selectedDay) {
  if (!selectedDay) return groups;
  return groups.filter(g => matchGroupDate(g.date, selectedDay));
}
// 搜索/AI 提问模式下，将总结事件展开 — 子事件提升到顶层，与普通事件平铺
function flattenTimelineGroups(groups, query) {
  if (!query || !query.trim()) return groups;
  const q = query.trim().toLowerCase();
  return groups.map(g => ({
    ...g,
    items: g.items.flatMap(ev => {
      if (ev._isSummary && ev._children) {
        // 父事件 + 所有子事件平铺为同级
        return [
          { ...ev, _flattenedFromSummary: true },
          ...ev._children.map(c => ({ ...c, _flattenedChild: true })),
        ];
      }
      return [ev];
    }).filter(ev => {
      // 简单关键词匹配（标题或摘要）
      const text = `${ev.text || ""} ${ev.summary || ""}`.toLowerCase();
      return text.includes(q);
    }),
  })).filter(g => g.items.length > 0);
}
// 从 timelineGroups 提取所有"有事项的日期"，返回 Set<"m-d"> 用于日历高亮 + 限制可选
function getAvailableTimelineDays(groups) {
  const set = new Set();
  groups.forEach(g => {
    if (g.date === "今天")       set.add(`${PROTOTYPE_TODAY.m}-${PROTOTYPE_TODAY.d}`);
    else if (g.date === "昨天")  set.add(`${PROTOTYPE_YESTERDAY.m}-${PROTOTYPE_YESTERDAY.d}`);
    else {
      const match = String(g.date).match(/(\d+)月(\d+)日/);
      if (match) set.add(`${parseInt(match[1])}-${parseInt(match[2])}`);
    }
  });
  return set;
}

/* ─── TIMELINE CALENDAR (复用于 SingleDocPage / MultiContentPage 事项视图的「往期事件」选择器) ─── */
function TimelineCalendar({ calYear, setCalYear, calMonth, setCalMonth, selectedDay, setSelectedDay, availableDays, onClose }) {
  const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev   = new Date(calYear, calMonth, 0).getDate();
  const firstWeekday = (() => { const d = new Date(calYear, calMonth, 1).getDay(); return d === 0 ? 6 : d - 1; })();
  const totalCells   = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - firstWeekday + 1;
    if (day < 1)             return { day: daysInPrev + day, cur: false };
    if (day > daysInMonth)   return { day: day - daysInMonth, cur: false };
    return { day, cur: true };
  });
  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); };
  const isToday = (d, cur) => cur && calYear === 2026 && calMonth === 5 && d === 8;
  const isSelected = (d, cur) => cur && selectedDay && calMonth === (selectedDay.m - 1) && d === selectedDay.d;
  const hasEvents = (d, cur) => cur && availableDays && availableDays.has(`${calMonth + 1}-${d}`);
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute right-0 top-9 z-30 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <div className="flex gap-0.5">
            <button onClick={() => setCalYear(y => y-1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">«</button>
            <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">‹</button>
          </div>
          <span className="text-sm font-semibold text-neutral-700">{monthNames[calMonth]} {calYear}年</span>
          <div className="flex gap-0.5">
            <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">›</button>
            <button onClick={() => setCalYear(y => y+1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">»</button>
          </div>
        </div>
        <div className="grid grid-cols-7 px-3 pt-2 pb-1">
          {["一","二","三","四","五","六","日"].map(d => (
            <div key={d} className="flex h-8 items-center justify-center text-[11px] text-neutral-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 px-3 pb-2">
          {cells.map((c, i) => {
            const enabled = c.cur && hasEvents(c.day, c.cur);
            const selected = isSelected(c.day, c.cur);
            const today = isToday(c.day, c.cur);
            return (
              <button key={i} disabled={!enabled}
                onClick={() => { setSelectedDay({ m: calMonth + 1, d: c.day }); onClose(); }}
                title={c.cur && !enabled ? "该日期暂无事项" : ""}
                className={`relative flex h-8 items-center justify-center rounded-lg text-xs transition-colors
                  ${!c.cur ? "cursor-default text-neutral-200" :
                    selected ? "bg-orange-500 text-white font-semibold" :
                    !enabled ? "cursor-not-allowed text-neutral-300" :
                    today ? "font-semibold text-orange-500 hover:bg-orange-50" :
                    "text-neutral-700 hover:bg-neutral-100"}`}>
                {c.day}
                {enabled && !selected && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2.5">
          <button onClick={() => { setSelectedDay(null); onClose(); }}
            className="text-xs text-neutral-400 hover:text-neutral-600">清除筛选</button>
          <button onClick={() => { setSelectedDay({ m: 6, d: 8 }); setCalMonth(5); setCalYear(2026); onClose(); }}
            disabled={!availableDays || !availableDays.has("6-8")}
            className="text-xs font-medium text-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40">回到今天</button>
        </div>
      </div>
    </>
  );
}

function RenameModal({ item, onClose }) {
  const [name, setName] = useState(item.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex w-full max-w-sm flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-7 pt-6 pb-4">
          <h2 className="text-lg font-bold text-neutral-900">重命名</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 pb-2">
          <input autoFocus value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onClose()}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        {/* Footer */}
        <div className="shrink-0 flex gap-2.5 px-7 py-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
          <button onClick={onClose} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${name.trim() ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-neutral-200 text-neutral-400"}`}>确认</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MOVE TO MODAL ─── */
function MoveToModal({ item, onClose, folderScopes }) {
  const [selected, setSelected]           = useState(null);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [folderSearch, setFolderSearch]   = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [localFolders, setLocalFolders]   = useState([]);
  const dropdownRef = useRef(null);

  const allFolders = [...folders, ...localFolders].filter(f => !f.owner || f.owner === CURRENT_USER);
  const selectedFolder = selected != null ? allFolders.find(f => f.id === selected) : null;
  const selectedScope = selectedFolder ? (folderScopes?.[selectedFolder.id] || selectedFolder.scope || "mine") : null;

  const filteredFolders = allFolders.filter(f =>
    f.name.toLowerCase().includes(folderSearch.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleCloseDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleSelect = (f) => {
    setSelected(f.id);
    setDropdownOpen(false);
    setFolderSearch("");
    setCreatingFolder(false);
    setNewFolderName("");
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
    setFolderSearch("");
    setCreatingFolder(false);
    setNewFolderName("");
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const newF = { id: `local_${Date.now()}`, name, kind: "文件夹", owner: CURRENT_USER, scope: "mine" };
    setLocalFolders(prev => [...prev, newF]);
    setSelected(newF.id);
    setCreatingFolder(false);
    setNewFolderName("");
    setDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex w-full max-w-sm flex-col rounded-[24px] bg-white shadow-2xl">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900">复制至</h2>
            <p className="text-xs text-neutral-400">选择目标信息源</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
            <Icon.Close />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {/* Dropdown */}
          <div ref={dropdownRef} className="relative">
            {/* Trigger */}
            <button
              onClick={() => { if (dropdownOpen) handleCloseDropdown(); else setDropdownOpen(true); }}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left transition-all
                ${dropdownOpen ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200 hover:border-neutral-300"}`}>
              <span className="text-neutral-400"><Icon.Folder /></span>
              {selectedFolder ? (
                <>
                  <span className="flex-1 text-sm font-medium text-neutral-800">{selectedFolder.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium
                    ${selectedScope === "enterprise" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"}`}>
                    {selectedScope === "enterprise" ? "所有人可见" : selectedScope === "partial" ? "部分可见" : "私密"}
                  </span>
                </>
              ) : (
                <span className="flex-1 text-sm text-neutral-400">选择信息源…</span>
              )}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1.5 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
                {/* Search */}
                <div className="border-b border-neutral-100 px-3 py-2">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-300">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </span>
                    <input autoFocus value={folderSearch} onChange={e => setFolderSearch(e.target.value)}
                      placeholder="搜索信息源…"
                      className="w-full rounded-lg border-0 bg-neutral-50 py-1.5 pl-7 pr-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-300" />
                  </div>
                </div>

                {/* List */}
                <div className="max-h-44 overflow-y-auto">
                  {filteredFolders.length === 0 && (
                    <div className="py-5 text-center text-sm text-neutral-400">没有找到匹配的信息源</div>
                  )}
                  {filteredFolders.map(f => {
                    const isSelected = selected === f.id;
                    const fScope = folderScopes?.[f.id] || f.scope;
                    return (
                      <button key={f.id} onClick={() => handleSelect(f)}
                        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${isSelected ? "bg-orange-50" : "hover:bg-neutral-50"}`}>
                        <span className="shrink-0 text-neutral-400"><Icon.Folder /></span>
                        <span className="flex-1 text-sm font-medium text-neutral-700">{f.name}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium
                          ${fScope === "enterprise" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"}`}>
                          {fScope === "enterprise" ? "所有人可见" : fScope === "partial" ? "部分可见" : "私密"}
                        </span>
                        {isSelected && <span className="shrink-0 text-orange-500"><Icon.Check /></span>}
                      </button>
                    );
                  })}
                </div>

                {/* 新建信息源 */}
                <div className="border-t border-neutral-100">
                  {creatingFolder ? (
                    <div className="flex items-center gap-1.5 px-3 py-2">
                      <input autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleCreateFolder(); if (e.key === "Escape") { setCreatingFolder(false); setNewFolderName(""); } }}
                        placeholder="输入信息源名称…"
                        className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 placeholder:text-neutral-300" />
                      <button onClick={handleCreateFolder} disabled={!newFolderName.trim()}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${newFolderName.trim() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-neutral-100 text-neutral-300 cursor-not-allowed"}`}>
                        创建
                      </button>
                      <button onClick={() => { setCreatingFolder(false); setNewFolderName(""); }}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-500">
                        <Icon.Close />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setCreatingFolder(true)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-orange-500">
                      <Icon.Plus /> 新建信息源
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 权限继承提示 */}
          {selectedFolder && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="currentColor"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" fill="currentColor"/>
              </svg>
              <p className="text-[12px] leading-relaxed text-amber-700">
                移动后权限将继承「<span className="font-semibold">{selectedFolder.name}</span>」的权限：
                <span className="font-semibold">{selectedScope === "enterprise" ? "所有人可见" : selectedScope === "partial" ? "部分可见" : "私密"}</span>，无法单独设置。
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2.5 border-t border-neutral-100 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
          <button onClick={onClose} disabled={!selected}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${selected ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-neutral-200 text-neutral-400"}`}>
            移动
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─── DELETE MODAL ─── */
function DeleteModal({ item, onClose, onConfirm }) {
  const isFolder = item.kind === "文件夹";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex w-full max-w-sm flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 pt-7 pb-4">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Icon.Trash />
          </div>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">删除{isFolder ? "信息源" : "文件"}</h2>
          <p className="text-sm leading-relaxed text-neutral-500">
            确定要删除「<span className="font-medium text-neutral-700">{item.name}</span>」{isFolder ? "及其包含的所有文件" : ""}？此操作无法撤销。
          </p>
        </div>
        {/* Footer */}
        <div className="shrink-0 flex gap-2.5 px-7 pb-7 pt-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
          <button onClick={() => { onClose(); onConfirm?.(); }} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600">删除</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD TO FOLDER MODAL ─── */
function AddToFolderModal({ folderName, onClose }) {
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const userItems = infoItems.filter(item => item.owner === CURRENT_USER);
  const filtered = search.trim()
    ? userItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || (item.source || "").toLowerCase().includes(search.toLowerCase()))
    : userItems;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
        {/* Header */}
        <div className="shrink-0 px-7 pt-5 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-neutral-900">将信息源加入「{folderName}」</h2>
              <p className="mt-1 text-sm text-neutral-400">选择要添加到该信息源的文件，可多选。</p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
          </div>
          {/* Search */}
          <div className="relative mt-3">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索信息源…"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
            )}
          </div>
        </div>
        <div className="border-t border-neutral-100" />
        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-400">没有找到「{search}」相关的信息源</div>
          ) : filtered.map(item => {
            const src = sourceInfo[item.source] || { label: item.source, Icon: Icon.File };
            const isSel = selected.has(item.id);
            return (
              <button key={item.id} onClick={() => toggle(item.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all ${isSel ? "border-orange-200 bg-orange-50" : "border-transparent hover:bg-neutral-50"}`}>
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${isSel ? "border-orange-500 bg-orange-500 text-white" : "border-neutral-300 bg-white"}`}>
                  {isSel && <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500"><src.Icon /></div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900">{item.name}</div>
                  <div className="text-xs text-neutral-400">{src.label}</div>
                </div>
                {item.folderId != null && (
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-400">已归类</span>
                )}
              </button>
            );
          })}
        </div>
        {/* Footer */}
        <div className="shrink-0 border-t border-neutral-100 px-7 py-4">
          <div className="flex gap-2.5">
            <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">跳过</button>
            <button onClick={onClose} disabled={selected.size === 0}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${selected.size > 0 ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-neutral-200 text-neutral-400"}`}>
              {selected.size > 0 ? `加入信息源（${selected.size}）` : "加入信息源"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── NEW 信息源 MODAL ─── */
function NewFolderModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState("mine");
  const [partialSelected, setPartialSelected] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const scopeOptions = [
    { key: "mine",       Ico: Icon.Lock,    label: "私密",      iconColor: "text-neutral-500",  desc: "仅自己及管理员可见" },
    { key: "partial",    Ico: Icon.Users,   label: "部分可见",   iconColor: "text-blue-500",     desc: "指定人员或部门可见" },
    { key: "enterprise", Ico: Icon.GlobeLg, label: "所有人可见", iconColor: "text-emerald-500",  desc: "企业内所有人可见" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex w-full max-w-md flex-col rounded-[28px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between border-b border-neutral-100 px-7 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">新建信息源</h2>
            <p className="mt-1 text-sm text-neutral-500">信息源是管理文件和连接器的容器。</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-700">信息名称</label>
              <span className={`text-xs ${name.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{name.length}/20</span>
            </div>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              placeholder="例如：竞品研究、项目周报…"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">可见权限</label>
            <div className="grid grid-cols-3 gap-2">
              {scopeOptions.map(opt => (
                <button key={opt.key} onClick={() => setScope(opt.key)}
                  className={`rounded-xl border p-3 text-left transition-all ${scope === opt.key
                    ? opt.key === "enterprise" ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300"
                    : opt.key === "partial"    ? "border-blue-400 bg-blue-50 ring-1 ring-blue-300"
                    :                           "border-neutral-400 bg-neutral-50 ring-1 ring-neutral-300"
                    : "border-neutral-200 hover:border-neutral-300"}`}>
                  <div className={`mb-2 ${scope === opt.key ? opt.iconColor : "text-neutral-400"}`}><opt.Ico /></div>
                  <div className="text-xs font-semibold text-neutral-900">{opt.label}</div>
                  <div className="mt-0.5 text-[10px] leading-snug text-neutral-500">{opt.desc}</div>
                </button>
              ))}
            </div>
            {/* 部分可见：人员/部门选择 */}
            {scope === "partial" && (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/40 p-3.5">
                <label className="mb-2 block text-xs font-medium text-neutral-600">可见人员 / 部门</label>
                <button onClick={() => setShowPicker(true)}
                  className="flex w-full items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-neutral-400 transition hover:border-blue-400 hover:bg-blue-50/50">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-blue-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <span>搜索或选择部门 / 人员…</span>
                </button>
                {partialSelected.length > 0 ? (
                  <OrgChips items={partialSelected} onRemove={item => setPartialSelected(prev => prev.filter(p => p.id !== item.id))} />
                ) : (
                  <p className="mt-2 text-xs text-neutral-400">暂未添加，仅自己及管理员可见</p>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="shrink-0 flex gap-2.5 border-t border-neutral-100 px-7 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
          <button onClick={() => name.trim() && onCreate(name.trim())}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${name.trim() ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"}`}>
            创建
          </button>
        </div>
      </div>

      {showPicker && (
        <OrgPickerModal
          initialSelected={partialSelected}
          onClose={() => setShowPicker(false)}
          onConfirm={(items) => { setPartialSelected(items); setShowPicker(false); }}
        />
      )}
    </div>
  );
}

/* ─── FILTER DROPDOWN ─── */
function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const active = value !== "全部";
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm transition-all ${active ? "border-orange-200 bg-orange-50 font-medium text-orange-700" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"}`}>
        {active ? value : label}
        <Icon.ChevronDown />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-xl">
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-sm transition-colors ${value === opt ? "bg-orange-50 font-medium text-orange-700" : "text-neutral-700 hover:bg-neutral-50"}`}>
                {value === opt ? <Icon.Check /> : <span className="w-[14px]" />}
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── NOTE EDITOR MODAL ─── */
/* ─── 笔记：全屏二级编辑页 ─── */
function NoteEditorPage({ onBack, onSave, folderName }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const charCount = content.length;

  const insertFormat = (prefix, suffix = "") => {
    const ta = document.getElementById("note-textarea");
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const sel = content.slice(start, end);
    const next = content.slice(0, start) + prefix + (sel || "文字") + suffix + content.slice(end);
    setContent(next);
    setTimeout(() => { ta.focus(); ta.selectionStart = start + prefix.length; ta.selectionEnd = start + prefix.length + (sel || "文字").length; }, 0);
  };

  const canSave = title.trim() || content.trim();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 顶栏 */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          返回
        </button>
        <div className="flex items-center gap-3">
          {folderName && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              {folderName}
            </span>
          )}
          <button onClick={onBack}
            className="rounded-xl border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
            放弃
          </button>
          <button
            onClick={() => canSave && onSave({ title: title.trim() || "无标题笔记", content })}
            className={`rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition-colors ${canSave ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-neutral-200 text-neutral-400"}`}>
            保存笔记
          </button>
        </div>
      </div>

      {/* 格式工具栏 */}
      <div className="flex items-center gap-0.5 border-b border-neutral-100 px-6 py-2">
        {[
          { label: "B",  title: "加粗",     action: () => insertFormat("**", "**"), cls: "font-bold" },
          { label: "I",  title: "斜体",     action: () => insertFormat("*", "*"),   cls: "italic" },
          { label: "H",  title: "标题",     action: () => insertFormat("## "),      cls: "font-semibold text-xs" },
          { label: "•",  title: "列表",     action: () => insertFormat("- "),       cls: "" },
          { label: "1.", title: "有序列表", action: () => insertFormat("1. "),      cls: "text-xs" },
        ].map(btn => (
          <button key={btn.label} title={btn.title} onClick={btn.action}
            className={`flex h-7 w-8 items-center justify-center rounded-md text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors ${btn.cls}`}>
            {btn.label}
          </button>
        ))}
        <div className="mx-2 h-4 w-px bg-neutral-200" />
        <span className="text-xs text-neutral-400">支持 Markdown</span>
        {charCount > 0 && <span className="ml-auto text-xs text-neutral-400">{charCount} 字</span>}
      </div>

      {/* 编辑区 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-8 pt-12 pb-20">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="笔记标题…"
          autoFocus
          className="mb-5 w-full border-0 text-3xl font-bold text-neutral-900 placeholder-neutral-200 outline-none"
        />
        <div className="mb-6 h-px bg-neutral-100" />
        <textarea
          id="note-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="开始编写笔记内容，支持 Markdown 格式…"
          className="w-full resize-none border-0 text-base leading-8 text-neutral-700 placeholder-neutral-300 outline-none"
          style={{ minHeight: "calc(100vh - 220px)" }}
        />
      </div>
    </div>
  );
}

/* ─── 笔记：保存位置选择弹窗 ─── */
function NoteFolderPickerModal({ onClose, onConfirm, onNewSource, folderList }) {
  // 无历史记录时，默认选中「默认文件夹」（id: 0）
  const defaultFolder = folderList.find(f => f._isDefault) || folderList.find(f => f.id === 0);
  const initId = lastUsedFolderId !== null ? lastUsedFolderId : (defaultFolder ? defaultFolder.id : "__unset__");
  const [folderId, setFolderId] = useState(initId);
  const [dropOpen, setDropOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropRef = useRef(null);

  const closeDropdown = () => { setDropOpen(false); setSearch(""); };

  useEffect(() => {
    if (!dropOpen) return;
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) closeDropdown(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [dropOpen]);

  const myFolders = folderList.filter(f => f.owner === CURRENT_USER && (!search || f.name.includes(search)));
  const canConfirm = folderId !== "__unset__";
  const selectedName = folderId === "__unset__" ? null : folderList.find(f => f.id === folderId)?.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-[24px] bg-white shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 pt-5 pb-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">新建笔记</h2>
            <p className="mt-0.5 text-xs text-neutral-400">选择保存到哪个信息源</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
        </div>
        {/* 信息源选择 */}
        <div className="px-6 py-5">
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">
            信息源 <span className="text-red-400">*</span>
          </label>
          <div ref={dropRef}>
            <button type="button"
              onClick={() => { if (dropOpen) closeDropdown(); else { setDropOpen(true); setSearch(""); } }}
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm transition hover:border-orange-300 focus:outline-none">
              <span className={!selectedName ? "text-neutral-400" : "text-neutral-800"}>
                {selectedName || "选择信息源…"}
              </span>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                className={`shrink-0 text-neutral-400 transition-transform ${dropOpen ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {dropOpen && (
              <div className="mt-1 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md">
                <div className="border-b border-neutral-100 px-3 py-2.5">
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-1.5">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="搜索信息源…" className="flex-1 bg-transparent text-sm outline-none placeholder-neutral-400" />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {myFolders.map(f => (
                    <button key={f.id} onClick={() => { setFolderId(f.id); closeDropdown(); }}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-neutral-50 ${folderId === f.id ? "bg-orange-50 text-orange-600" : "text-neutral-700"}`}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span>{f.name}</span>
                      {folderId === f.id && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="ml-auto shrink-0 text-orange-500"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                  {!search && myFolders.length === 0 && (
                    <div className="px-4 py-3 text-center text-sm text-neutral-400">暂无信息源，点击下方新建一个</div>
                  )}
                  {search && myFolders.length === 0 && (
                    <div className="px-4 py-3 text-center text-sm text-neutral-400">未找到匹配的信息源</div>
                  )}
                </div>
                {/* 新建信息源 → 打开 AddModal */}
                <div className="border-t border-neutral-100">
                  <button onClick={() => { closeDropdown(); onNewSource && onNewSource(); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-500 hover:bg-orange-50 transition-colors">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    新建信息源
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 底部操作 */}
        <div className="flex justify-end gap-2.5 border-t border-neutral-100 px-6 py-4">
          <button onClick={onClose}
            className="rounded-xl border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
            取消
          </button>
          <button
            onClick={() => { if (canConfirm) { lastUsedFolderId = folderId; onConfirm(folderId); } }}
            className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${canConfirm ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-neutral-200 text-neutral-400"}`}>
            开始写作
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── REPO BRANCH PICKER (module-level, stable reference) ─── */
const _mockBranches = {
  "simiy70/zleap-enterprise": ["main", "dev", "feature/docs"],
  "simiy70/design-system":    ["main", "release/2.0"],
  "simiy70/api-docs":         ["main", "staging"],
  "simiy70/mobile-app":       ["main", "dev", "hotfix/login"],
  "simiy70/产品文档":          ["main", "draft"],
  "simiy70/后端服务":          ["main", "dev", "release"],
  "mygroup/zleap-docs":       ["main", "dev"],
  "mygroup/backend-api":      ["main", "staging", "dev"],
  "mygroup/frontend":         ["main", "dev", "feature/ui"],
};

function RepoBranchPicker({ repos, selectedRepo, onSelectRepo, selectedBranch, onSelectBranch }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null); // 面板 fixed 定位（逃逸弹窗 overflow 裁剪）
  const triggerRef = React.useRef(null);
  const [hoverRepo, setHoverRepo] = React.useState(selectedRepo || repos[0] || "");
  const branches = _mockBranches[hoverRepo] || ["main"];
  const displayText = selectedRepo && selectedBranch
    ? `${selectedRepo}  /  ${selectedBranch}`
    : selectedRepo
    ? `${selectedRepo}  /  …`
    : "";

  const togglePanel = () => {
    if (open) { setOpen(false); return; }
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) {
      const panelH = 240; // 估算面板高度
      const below = window.innerHeight - r.bottom;
      // 下方空间不足则向上弹出
      const top = below < panelH + 12 ? r.top - panelH - 6 : r.bottom + 6;
      setPos({ left: r.left, top, width: r.width });
    }
    setOpen(true);
  };

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">
        选择仓库 / 分支 <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        {/* 触发器 */}
        <button ref={triggerRef} type="button" onClick={togglePanel}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all ${open ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200 hover:border-orange-200"} bg-white`}>
          <span className={`truncate font-mono ${displayText ? "text-neutral-800" : "text-neutral-400"}`}>
            {displayText || "请选择仓库和分支…"}
          </span>
          <svg className={`ml-2 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        {/* 级联面板（fixed 定位，逃逸弹窗裁剪） */}
        {open && pos && (
          <>
            <div className="fixed inset-0 z-[300]" onClick={() => setOpen(false)} />
            <div className="fixed z-[310] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl"
              style={{ left: pos.left, top: pos.top, width: pos.width }}>
              <div className="flex" style={{ height: "200px" }}>
                {/* 左列：仓库 */}
                <div className="w-1/2 overflow-y-auto border-r border-neutral-100 py-1">
                  {repos.map(r => (
                    <div key={r}
                      onMouseEnter={() => setHoverRepo(r)}
                      onClick={() => { onSelectRepo(r); onSelectBranch(""); setHoverRepo(r); }}
                      className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm transition-colors ${selectedRepo === r ? "bg-blue-50 font-semibold text-blue-600" : hoverRepo === r ? "bg-neutral-50 text-neutral-800" : "text-neutral-700 hover:bg-neutral-50"}`}>
                      <span className="truncate font-mono">{r}</span>
                      <svg className="ml-1 shrink-0 text-neutral-300" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  ))}
                </div>
                {/* 右列：分支 */}
                <div className="w-1/2 overflow-y-auto py-1">
                  {branches.map(b => (
                    <div key={b}
                      onClick={() => { onSelectRepo(hoverRepo); onSelectBranch(b); setOpen(false); }}
                      className={`flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors ${selectedBranch === b && selectedRepo === hoverRepo ? "bg-blue-50 font-semibold text-blue-600" : "text-neutral-700 hover:bg-neutral-50"}`}>
                      <svg className="shrink-0 text-neutral-300" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                      <span className="font-mono">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* 底部选中展示 */}
              {selectedRepo && selectedBranch && (
                <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2 text-xs text-neutral-400">
                  已选：<span className="font-mono text-neutral-600">{selectedRepo}</span>
                  <span className="mx-1 text-neutral-300">/</span>
                  <span className="font-mono text-neutral-600">{selectedBranch}</span>
                  <span className="ml-1">· 系统将定时同步该分支内的所有文档</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── API 请求配置编辑器（Postman 风格）─── */
function ApiConfigEditor({ url, onUrlChange }) {
  const [method, setMethod] = useState("GET");
  const [methodOpen, setMethodOpen] = useState(false);
  const [tab, setTab] = useState("params");
  const [pMode, setPMode] = useState("table");
  const [hMode, setHMode] = useState("table");
  const [params, setParams] = useState([{ on: true, k: "", v: "", t: "Text" }]);
  const [headers, setHeaders] = useState([
    { on: true, k: "Content-Type", v: "application/json", t: "Text" },
    { on: true, k: "User-Agent", v: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", t: "Text" },
  ]);
  const [pBulk, setPBulk] = useState("");
  const [hBulk, setHBulk] = useState("Content-Type:application/json\nUser-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
  const [bodyType, setBodyType] = useState("none");
  const [bodyJson, setBodyJson] = useState("");
  const [timeoutS, setTimeoutS] = useState("30");
  const [dbg, setDbg] = useState(null);
  const [dbgTab, setDbgTab] = useState("body");
  const [dbgLoading, setDbgLoading] = useState(false);
  // 调试结果面板可拖拽高度
  const [dbgHeight, setDbgHeight] = useState(176);
  const dragRef = useRef(null);
  useEffect(() => {
    const onMove = e => {
      if (!dragRef.current) return;
      const dy = e.clientY - dragRef.current.startY;
      setDbgHeight(Math.max(80, Math.min(480, dragRef.current.startH + dy)));
    };
    const onUp = () => { dragRef.current = null; document.body.style.userSelect = ""; document.body.style.cursor = ""; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, []);

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const methodColor = { GET: "text-emerald-600", POST: "text-orange-500", PUT: "text-blue-500", DELETE: "text-red-500", PATCH: "text-violet-500" };

  // KV 表格编辑器（函数调用渲染，避免失焦）
  const renderKV = (rows, setRows, mode, setMode, bulk, setBulk) => (
    <div>
      <div className="mb-3 inline-flex rounded-lg bg-neutral-100 p-0.5 text-xs">
        {[["table", "表格"], ["bulk", "批量编辑"]].map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1 font-medium transition ${mode === m ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500"}`}>{l}</button>
        ))}
      </div>
      {mode === "table" ? (
        <div>
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2 text-[11px] font-medium text-neutral-400">
            <span className="w-4 shrink-0" />
            <span className="flex-1">参数名</span>
            <span className="flex-1">参数值</span>
            <span className="w-[68px] shrink-0">类型</span>
            <span className="w-6 shrink-0" />
          </div>
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-2">
              <input type="checkbox" checked={r.on} onChange={() => setRows(rs => rs.map((x, j) => j === i ? { ...x, on: !x.on } : x))} className="h-4 w-4 shrink-0 accent-orange-500" />
              <input value={r.k} onChange={e => setRows(rs => rs.map((x, j) => j === i ? { ...x, k: e.target.value } : x))} placeholder="参数名" className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-300" />
              <input value={r.v} onChange={e => setRows(rs => rs.map((x, j) => j === i ? { ...x, v: e.target.value } : x))} placeholder="参数值" className="min-w-0 flex-1 truncate rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-300" />
              <select value={r.t} onChange={e => setRows(rs => rs.map((x, j) => j === i ? { ...x, t: e.target.value } : x))} className="w-[68px] shrink-0 rounded-lg border border-neutral-200 bg-white px-1.5 py-1.5 text-xs outline-none">
                <option>Text</option><option>File</option><option>Number</option>
              </select>
              <button onClick={() => setRows(rs => rs.length > 1 ? rs.filter((_, j) => j !== i) : rs)} className="flex h-6 w-6 shrink-0 items-center justify-center text-red-400 transition hover:text-red-600">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
          <button onClick={() => setRows(rs => [...rs, { on: true, k: "", v: "", t: "Text" }])}
            className="mt-1 flex w-full items-center justify-center gap-1 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-orange-500">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            添加参数
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500">
            <svg width="11" height="11" fill="none" viewBox="0 0 16 16" className="shrink-0"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            格式：key:value，每行一个参数
          </div>
          <textarea value={bulk} onChange={e => setBulk(e.target.value)} rows={5}
            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-xs font-mono outline-none focus:border-orange-300" />
        </div>
      )}
    </div>
  );

  const runDebug = () => {
    setDbgLoading(true);
    window.setTimeout(() => {
      setDbgLoading(false); setDbgTab("body");
      setDbg({ status: 200, statusText: "OK", time: "299ms", size: "14.07KB", headerCount: 8,
        body: '{\n  "statusCode": "200000",\n  "desc": "获取数据成功!",\n  "result": {\n    "positionList": {\n      "enterpriseList": [\n        {\n          "id": "38090",\n          "pname": "新媒体运营"\n        }\n      ]\n    }\n  }\n}' });
    }, 800);
  };

  return (
    <div className="space-y-3">
      {/* URL row */}
      <div>
        <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">API 请求地址 <span className="text-red-400">*</span></label>
        <div className="flex items-stretch overflow-hidden rounded-xl border border-neutral-200 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
          <div className="relative shrink-0">
            <button type="button" onClick={() => setMethodOpen(o => !o)}
              className={`flex h-full items-center gap-1 border-r border-neutral-200 bg-neutral-50 px-3 text-sm font-bold ${methodColor[method]}`}>
              {method}
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" className="text-neutral-400"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {methodOpen && (<>
              <div className="fixed inset-0 z-10" onClick={() => setMethodOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-1 w-28 overflow-hidden rounded-lg border border-neutral-100 bg-white py-1 shadow-lg">
                {methods.map(m => (
                  <button key={m} type="button" onClick={() => { setMethod(m); setMethodOpen(false); }}
                    className={`block w-full px-3 py-1.5 text-left text-sm font-bold transition hover:bg-neutral-50 ${methodColor[m]}`}>{m}</button>
                ))}
              </div>
            </>)}
          </div>
          <input value={url} onChange={e => onUrlChange(e.target.value)} placeholder="https://api.example.com/data"
            className="min-w-0 flex-1 px-3 py-2.5 text-sm font-mono placeholder-neutral-400 outline-none" />
        </div>
      </div>
      {/* tabs */}
      <div className="flex gap-5 border-b border-neutral-100">
        {[["params", "Params"], ["body", "Body"], ["headers", "Headers"]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setTab(k)}
            className={`-mb-px border-b-2 pb-2 text-sm font-medium transition ${tab === k ? "border-neutral-800 text-neutral-800" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}>{l}</button>
        ))}
      </div>
      {/* tab content */}
      <div className="min-h-[110px]">
        {tab === "params" && renderKV(params, setParams, pMode, setPMode, pBulk, setPBulk)}
        {tab === "headers" && renderKV(headers, setHeaders, hMode, setHMode, hBulk, setHBulk)}
        {tab === "body" && (
          <div>
            <div className="mb-3 inline-flex rounded-lg bg-neutral-100 p-0.5 text-xs">
              {[["none", "None"], ["json", "JSON"], ["formdata", "Form Data"]].map(([k, l]) => (
                <button key={k} type="button" onClick={() => setBodyType(k)}
                  className={`rounded-md px-3 py-1 font-medium transition ${bodyType === k ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500"}`}>{l}</button>
              ))}
            </div>
            {bodyType === "json" && (
              <textarea value={bodyJson} onChange={e => setBodyJson(e.target.value)} rows={5} placeholder={'{\n  "key": "value"\n}'}
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-xs font-mono outline-none focus:border-orange-300" />
            )}
            {bodyType === "formdata" && (
              <div className="py-6 text-center text-xs text-neutral-400">切换到「表格」录入 Form Data 字段（同 Params）</div>
            )}
            {bodyType === "none" && (
              <div className="py-6 text-center text-xs text-neutral-400">该请求不携带 Body</div>
            )}
          </div>
        )}
      </div>
      {/* timeout + 调试 */}
      <div className="flex items-center gap-3 border-t border-neutral-100 pt-3">
        <span className="text-xs text-neutral-500">超时时间(秒)</span>
        <input value={timeoutS} onChange={e => setTimeoutS(e.target.value.replace(/\D/g, ""))}
          className="w-16 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-300" />
        <button type="button" onClick={runDebug} disabled={dbgLoading}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50">
          {dbgLoading && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>}
          {dbgLoading ? "调试中…" : "调试"}
        </button>
      </div>
      {/* 调试结果 */}
      {dbg && !dbgLoading && (
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          {/* 拖拽手柄 */}
          <div
            onMouseDown={e => {
              dragRef.current = { startY: e.clientY, startH: dbgHeight };
              document.body.style.userSelect = "none";
              document.body.style.cursor = "ns-resize";
            }}
            className="flex cursor-ns-resize items-center justify-center border-b border-neutral-100 bg-neutral-50 py-1 hover:bg-neutral-100"
            title="拖拽调整高度">
            <svg width="28" height="6" viewBox="0 0 28 6" fill="none">
              <rect y="0" width="28" height="1.5" rx="1" fill="#d1d5db"/>
              <rect y="4" width="28" height="1.5" rx="1" fill="#d1d5db"/>
            </svg>
          </div>
          {/* tab 栏 + 状态信息 */}
          <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-3 py-2">
            <div className="flex gap-3 text-xs">
              {[["body", "Body"], ["header", "Header"]].map(([k, l]) => (
                <button key={k} type="button" onClick={() => setDbgTab(k)}
                  className={`font-medium transition ${dbgTab === k ? "text-neutral-800" : "text-neutral-400 hover:text-neutral-600"}`}>
                  {l}{k === "header" && <span className="ml-1 rounded bg-neutral-200 px-1 text-[10px] text-neutral-600">{dbg.headerCount}</span>}
                </button>
              ))}
            </div>
            <span className="ml-auto rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600">{dbg.status} {dbg.statusText}</span>
            <span className="text-[11px] text-neutral-400">{dbg.time}</span>
            <span className="text-[11px] text-neutral-400">{dbg.size}</span>
          </div>
          {/* 响应内容，高度由拖拽控制 */}
          {dbgTab === "body" ? (
            <pre style={{height: dbgHeight}} className="overflow-auto bg-neutral-900 px-3 py-2.5 text-[11px] font-mono leading-relaxed text-neutral-100">{dbg.body}</pre>
          ) : (
            <div style={{height: dbgHeight}} className="overflow-auto px-3 py-2.5 text-[11px] font-mono leading-relaxed text-neutral-600">
              <div>content-type: application/json; charset=utf-8</div>
              <div>server: nginx</div>
              <div>cache-control: no-cache</div>
              <div>date: {new Date().toUTCString()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── ADD MODAL ─── */
// 记住用户上次选择的信息源（文件夹），下次打开弹窗时默认选中；初始指向默认文件夹
let lastUsedFolderId = folders.find(f => f._isDefault && f.owner === CURRENT_USER)?.id ?? folders.find(f => f.owner === CURRENT_USER)?.id ?? null;

function AddModal({ onClose, onOpenNoteEditor, onAdded, onFolderCreated, folderList = folders, initTab = "全部", initSrc = null, defaultFolderId = null, onStartFloatingRec = null }) {
  const [step, setStep] = useState(initSrc ? "config" : "select"); // "select" | "config" | "plugin"
  const [srcSearch, setSrcSearch] = useState("");
  const [srcTab, setSrcTab] = useState(initTab); // "全部" | "单次导入" | "定时同步"
  const [selectedSrc, setSelectedSrc] = useState(initSrc || null);

  // Shared form state
  const [formName, setFormName] = useState(initSrc ? initSrc.label : "");
  const [formDesc, setFormDesc] = useState("");
  const [formEnabled, setFormEnabled] = useState(true);
  const [formFreqNum, setFormFreqNum] = useState(3);
  const [formFreqUnit, setFormFreqUnit] = useState("小时");
  const [formFreqPreset, setFormFreqPreset] = useState("每天");
  const [formSyncTime, setFormSyncTime] = useState("09:00");
  const [formSyncDays, setFormSyncDays] = useState([0, 2, 4]);
  const [formSyncMonthDays, setFormSyncMonthDays] = useState(["1"]);
  const [formAccess, setFormAccess] = useState("private");
  // 问题二：保存到文件夹（无历史记录时回退到「默认文件夹」）
  const _defaultFolder = folderList.find(f => f._isDefault) || folderList.find(f => f.id === 0);
  const _fallbackFolderId = _defaultFolder ? _defaultFolder.id : "__unset__";
  const [formFolderId, setFormFolderId] = useState(defaultFolderId !== null ? defaultFolderId : lastUsedFolderId !== null ? lastUsedFolderId : _fallbackFolderId); // "__unset__" = 暂未选择, null = 未归类, number = 文件夹ID
  const [folderDropOpen, setFolderDropOpen] = useState(false);
  const [folderSearch, setFolderSearch] = useState("");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const folderDropRef = useRef(null);
  useEffect(() => {
    if (!folderDropOpen) return;
    const handler = e => { if (folderDropRef.current && !folderDropRef.current.contains(e.target)) setFolderDropOpen(false); };
    document.addEventListener("mousedown", handler);
    // Scroll modal so the dropdown list is fully visible
    setTimeout(() => { folderDropRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 30);
    return () => document.removeEventListener("mousedown", handler);
  }, [folderDropOpen]);

  const handleFolderCreatedFromModal = (folderName) => {
    const newFolder = {
      id: Date.now(), name: folderName, kind: "文件夹", owner: CURRENT_USER, scope: "mine",
      created: "刚刚", updated: "刚刚", status: "同步完成", count: 0,
      desc: "新建文件夹，暂无信息源", tags: [],
    };
    if (onFolderCreated) onFolderCreated(newFolder);
    lastUsedFolderId = newFolder.id;
    setFormFolderId(newFolder.id);
    setShowNewFolderModal(false);
    setFolderDropOpen(false);
  };

  const effectiveFolderList = folderList; // parent re-renders with new folder after onFolderCreated
  const inheritedFolder = (formFolderId != null && formFolderId !== "__unset__") ? effectiveFolderList.find(f => f.id === formFolderId) : null;
  const inheritedScope = inheritedFolder ? inheritedFolder.scope : null;

  // RSS / 爬虫 / 搜索引擎 URL input
  const [formUrls, setFormUrls] = useState("");
  // 爬取范围
  const [crawlScope, setCrawlScope] = useState("仅当前页面");
  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState("");
  // API fields
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiUrl, setApiUrl] = useState("");
  const [apiTimeout, setApiTimeout] = useState(30);
  // 企微/飞书/钉钉
  const [corpId, setCorpId] = useState("");
  const [secret, setSecret] = useState("");
  const [pemFile, setPemFile] = useState(null);
  // 文档上传 tab
  const [uploadTab, setUploadTab] = useState("本地上传");
  // 飞书导入
  const [fsAppId, setFsAppId] = useState("");
  const [fsAppSecret, setFsAppSecret] = useState("");
  const [fsToken, setFsToken] = useState("");
  const [fsCliAuthorizedSteps, setFsCliAuthorizedSteps] = useState([]);
  const [fsCliPhase, setFsCliPhase] = useState("idle"); // 'idle' | 'busy'
  const [fsCliChats, setFsCliChats] = useState(new Set());
  // Batch configs (for RSS / 网页爬虫 / GitHub etc.)
  const [batchConfigs, setBatchConfigs] = useState([{ name: "", url: "" }]);
  // OAuth state (for GitHub/GitLab/Gitee)
  const [oauthDone, setOauthDone] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(""); // 单选仓库
  const [selectedBranch, setSelectedBranch] = useState("");
  const [repoNameAutoFilled, setRepoNameAutoFilled] = useState(false); // 名称是否为自动填入（防覆盖用户手动输入）
  const [showRepoAuthModal, setShowRepoAuthModal] = useState(false);   // 授权+仓库选择子弹窗

  // 仓库/分支自动命名：非 main/master 才拼接分支，总长截断到 20 字
  const _autoRepoName = (repo, branch) => {
    const repoName = repo.split("/").pop();
    const defaultBranches = ["main", "master"];
    const full = branch && !defaultBranches.includes(branch)
      ? `${repoName} / ${branch}`
      : repoName;
    return full.slice(0, 20);
  };

  // 名称是否仍为「默认/自动」状态（空、默认来源标签、或上次自动填入）→ 允许按仓库规则覆盖
  const nameIsDefault = () => !formName || repoNameAutoFilled || formName === selectedSrc?.label;
  const handleSelectRepo = (r) => {
    setSelectedRepo(r);
    setSelectedBranch("");
    if (nameIsDefault()) {
      setFormName(_autoRepoName(r, ""));
      setRepoNameAutoFilled(true);
    }
  };

  const handleSelectBranch = (b) => {
    setSelectedBranch(b);
    if (nameIsDefault()) {
      setFormName(_autoRepoName(selectedRepo, b));
      setRepoNameAutoFilled(true);
    }
  };

  const startOauth = () => {
    setOauthLoading(true);
    setTimeout(() => { setOauthLoading(false); setOauthDone(true); }, 2200);
  };

  // New state variables per PRD
  const [formFirstSyncTime, setFormFirstSyncTime] = useState("");
  const [robotName, setRobotName] = useState("");
  const [saleProjectId, setSaleProjectId] = useState("");
  const [apiConfig, setApiConfig] = useState("");
  const [gitlabUrl, setGitlabUrl] = useState("");
  const [gitlabAppId, setGitlabAppId] = useState("");
  const [gitlabSecret, setGitlabSecret] = useState("");
  const [showGitlabSecret, setShowGitlabSecret] = useState(false);
  // 思源笔记 / 语雀知识库 file upload + 文件选择弹窗
  const [siyuanFile, setSiyuanFile] = useState(null);
  const [yuqueFile, setYuqueFile] = useState(null);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [filePickerSearch, setFilePickerSearch] = useState("");
  const [selectedFileIds, setSelectedFileIds] = useState(new Set());

  // mock 文件列表（模拟解析 zip/lakebook 后的内容）
  const _mockFileList = [
    { id: 1, name: "文件名称一行展示，带上后缀，hover展示全称.pdf", fmt: "PDF",      size: "1.4 MB",   ok: true },
    { id: 2, name: "非可导入的文件格式或大小超限制，不可选.dmg",   fmt: "DMG",      size: "246.5 MB", ok: false },
    { id: 3, name: "小米交出史上最强财报(1).md",                    fmt: "Markdown", size: "3 KB",     ok: true },
    { id: 4, name: "小米交出史上最强财报(2).txt",                   fmt: "TXT",      size: "3 KB",     ok: true },
    { id: 5, name: "曼昆《经济学原理：微观经济学详解系列）.epub",   fmt: "EPUB",     size: "2.6 MB",   ok: true },
    { id: 6, name: "2024年度战略规划报告.docx",                     fmt: "Word",     size: "1.1 MB",   ok: true },
    { id: 7, name: "产品设计规范v3.2.pdf",                          fmt: "PDF",      size: "8.7 MB",   ok: true },
    { id: 8, name: "会议纪要-2024Q4.md",                            fmt: "Markdown", size: "12 KB",    ok: true },
    { id: 9, name: "超大文件超过限制.zip",                           fmt: "ZIP",      size: "312 MB",   ok: false },
    { id:10, name: "技术架构文档-微服务篇.txt",                     fmt: "TXT",      size: "45 KB",    ok: true },
  ];
  // 文档上传 / 音频上传 selected files
  const [docFiles, setDocFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  // 文档上传中选择的压缩包（zip/lakebook）→ 需弹出文档选择器挑选包内文档
  const [docArchive, setDocArchive] = useState(null); // 压缩包文件名 or null
  // 飞书知识库 API credentials + 空间列表
  const [fsKbAppId, setFsKbAppId] = useState("");
  const [fsKbAppSecret, setFsKbAppSecret] = useState("");
  const [fsKbToken, setFsKbToken] = useState("");
  const [fsKbLoading, setFsKbLoading] = useState(false);
  const [fsKbSpaces, setFsKbSpaces] = useState(null); // null=未获取
  const [fsKbSelSpaces, setFsKbSelSpaces] = useState(new Set());
  const _mockFsSpaces = [
    { id: "sp1", name: "产品团队 · 知识库",   docs: 128 },
    { id: "sp2", name: "技术团队 · Wiki",      docs: 74  },
    { id: "sp3", name: "公司 · 新员工手册",    docs: 32  },
    { id: "sp4", name: "设计规范 · 组件库",    docs: 56  },
  ];
  const toggleFsKbSpace = (id) => setFsKbSelSpaces(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const [fsKbSelDocs, setFsKbSelDocs] = useState(new Set());
  const [fsKbDocSearch, setFsKbDocSearch] = useState("");
  const toggleFsKbDoc = (id) => setFsKbSelDocs(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const markFsCliStepDone = (stepNo) => {
    setFsCliAuthorizedSteps(prev => prev.includes(stepNo) ? prev : [...prev, stepNo]);
  };
  const isFsCliStepDone = (stepNo) => fsCliAuthorizedSteps.includes(stepNo);
  // git 平台两步配置：step 1 = 信息源+授权，step 2 = 名称+SyncConfig
  const [gitStep, setGitStep] = useState(1);
  // 高级配置折叠
  const [showAdvanced, setShowAdvanced] = useState(false);
  // 连接器 step1 验证状态
  const [connValidating, setConnValidating] = useState(false);
  const [connValidateError, setConnValidateError] = useState(null);
  // 实时录音状态: "idle" | "recording" | "paused" | "done"
  const [recState, setRecState] = useState("idle");
  const [recSeconds, setRecSeconds] = useState(0);
  const recTimerRef = useRef(null);

  const recFmt = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };
  const recStart = () => {
    setRecState("recording");
    recTimerRef.current = setInterval(() => setRecSeconds(p => p + 1), 1000);
  };
  const recPause = () => {
    setRecState("paused");
    clearInterval(recTimerRef.current);
  };
  const recResume = () => {
    setRecState("recording");
    recTimerRef.current = setInterval(() => setRecSeconds(p => p + 1), 1000);
  };
  const recStop = () => {
    clearInterval(recTimerRef.current);
    setRecState("done");
  };
  const recReset = () => {
    clearInterval(recTimerRef.current);
    setRecState("idle");
    setRecSeconds(0);
  };
  useEffect(() => () => clearInterval(recTimerRef.current), []);

  const handleSelectSrc = (src) => {
    if (src.isNote) {
      const blankNote = {
        id: Date.now(), name: "新建笔记", kind: "笔记", source: "笔记",
        owner: CURRENT_USER, updated: "刚刚", status: "同步完成", desc: "", _isNew: true,
      };
      onAdded(blankNote);
      return;
    }
    if (src.isPlugin) { setSelectedSrc(src); setStep("plugin"); return; }
    setSelectedSrc(src);
    setFormName(src.label);
    setGitStep(1);
    setConnValidating(false);
    setConnValidateError(null);
    setFsCliAuthorizedSteps([]);
    setStep("config");
  };

  const handleBack = () => { setStep("select"); setSelectedSrc(null); setGitStep(1); setConnValidating(false); setConnValidateError(null); };

  // ── Config form renderer ──
  const renderConfig = () => {
    const label = selectedSrc?.label;

    // ── WaveBars helper (used by 实时录音) ──
    const WaveBars = ({ animated, color }) => (
      <div className="flex items-end gap-1" style={{height:"36px"}}>
        {[20,30,36,22,32,18,28,16].map((h, i) => (
          <div key={i}
            className={`w-[6px] rounded-full ${animated ? "rec-bar " + color : color}`}
            style={animated ? {animationDelay:(i*85)+"ms"} : {height:h+"px"}}
          />
        ))}
      </div>
    );

    // SyncConfig component (定时同步类)
    const _freqTabs = ["每天", "每周", "每月"];
    const _timeOpts = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
    const _weekDayLabels = ["一","二","三","四","五","六","日"];
    const _nextSyncText = () => {
      if (formFreqPreset === "每天") return `明天 ${formSyncTime}`;
      if (formFreqPreset === "每周") {
        const names = formSyncDays.sort((a,b)=>a-b).map(d => "周" + _weekDayLabels[d]).join("、");
        return `每周${names} ${formSyncTime}`;
      }
      if (formFreqPreset === "每月") { const _lm = { "last-0": "最后一天", "last-1": "倒数第二天", "last-2": "倒数第三天" }; const _sorted = [...formSyncMonthDays].sort((a,b)=>{ const aL=String(a).startsWith("last"),bL=String(b).startsWith("last"); if(aL&&bL) return String(a).localeCompare(String(b)); if(aL) return 1; if(bL) return -1; return Number(a)-Number(b); }); return `每月 ${_sorted.map(d=>_lm[d]||`${d}日`).join("、")} ${formSyncTime}`; }
      return "";
    };
    const SyncConfig = () => {
      return (
        <div className="space-y-3.5 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
          {/* Header：同步计划标题 + 开关 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-neutral-700">同步计划</div>
              <div className={`mt-0.5 text-xs ${formEnabled ? "text-neutral-400" : "text-amber-500"}`}>
                {formEnabled ? (_nextSyncText() ? `下次同步：${_nextSyncText()}` : "") : "已暂停，不会自动执行"}
              </div>
            </div>
            <button onClick={() => setFormEnabled(v => !v)}
              className={"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors " + (formEnabled ? "bg-orange-500" : "bg-neutral-200")}>
              <span className={"inline-block h-5 w-5 rounded-full bg-white shadow transition-transform " + (formEnabled ? "translate-x-5" : "translate-x-0")} />
            </button>
          </div>
          {/* 频率 tabs */}
          <div className={`flex gap-1 rounded-xl bg-neutral-200/60 p-1 transition-opacity ${!formEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            {_freqTabs.map(opt => (
              <button key={opt} onClick={() => setFormFreqPreset(opt)}
                className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${formFreqPreset === opt ? "bg-white text-orange-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                {opt}
              </button>
            ))}
          </div>
          {/* 定时选项 */}
          <div className={`space-y-3.5 transition-opacity ${!formEnabled ? "opacity-40 pointer-events-none" : ""}`}><>
            {/* 执行时间 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">执行时间</span>
              <select value={formSyncTime} onChange={e => setFormSyncTime(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                {_timeOpts.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* 每周：重复日期 */}
            {formFreqPreset === "每周" && (
              <div>
                <div className="mb-2 text-sm text-neutral-700">重复日期</div>
                <div className="flex gap-1.5">
                  {_weekDayLabels.map((d, i) => (
                    <button key={i} onClick={() => setFormSyncDays(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${formSyncDays.includes(i) ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-500"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* 每月：多选日期 */}
            {formFreqPreset === "每月" && (
              <div>
                <div className="mb-2 text-sm text-neutral-700">重复日期
                  <span className="ml-1.5 text-xs font-normal text-neutral-400">可多选</span>
                </div>
                <div className="space-y-1.5">
                  {/* 相对日期（兼容各月天数差异） */}
                  <div className="flex gap-1.5">
                    {[{ v: "last-2", l: "倒数第三天" }, { v: "last-1", l: "倒数第二天" }, { v: "last-0", l: "最后一天" }].map(({ v, l }) => (
                      <button key={v}
                        onClick={() => setFormSyncMonthDays(prev => prev.includes(v) ? (prev.length > 1 ? prev.filter(x => x !== v) : prev) : [...prev, v])}
                        className={`flex flex-1 h-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${formSyncMonthDays.includes(v) ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-500"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {/* 固定日期 1-28 */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({length: 28}, (_, i) => String(i + 1)).map(d => (
                      <button key={d}
                        onClick={() => setFormSyncMonthDays(prev => prev.includes(d) ? (prev.length > 1 ? prev.filter(x => x !== d) : prev) : [...prev, d])}
                        className={`flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition-all ${formSyncMonthDays.includes(d) ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-500"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </></div>
          {/* 首次同步说明 */}
          <div className="flex items-start gap-1.5 rounded-lg bg-orange-50/70 px-3 py-2 text-[11px] leading-relaxed text-orange-600">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-px shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>保存后系统会<span className="font-semibold">立即执行一次首次同步</span>；{formEnabled ? "之后按上方计划自动同步。" : "「暂停」仅停止后续的自动同步，不影响这次首次同步。"}</span>
          </div>
        </div>
      );
    };

    // Shared base fields (no showFreq, no 继续同步 toggle)
    const BaseFields = ({ nameLabel = "信息名称", hideName = false, hideFolder = false }) => (
      <>
        {!hideName && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">
                {nameLabel} <span className="text-red-400">*</span>
              </label>
              <span className={`text-xs ${formName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{formName.length}/20</span>
            </div>
            <input value={formName} onChange={e => { setFormName(e.target.value); setRepoNameAutoFilled(false); }}
              maxLength={20}
              placeholder="给信息源一个有辨识度的名称"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          </div>
        )}
        {/* 添加到信息源（搜索下拉） */}
        {!hideFolder && <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">添加到信息源 <span className="text-red-400">*</span></label>
          <div ref={folderDropRef}>
            {/* Trigger */}
            <button type="button" onClick={() => { setFolderDropOpen(v => !v); setFolderSearch(""); }}
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm transition hover:border-orange-300 focus:outline-none">
              <span className={formFolderId === "__unset__" ? "text-neutral-400" : "text-neutral-800"}>
                {formFolderId === "__unset__"
                  ? "选择信息源…"
                  : folderList.find(f => f.id === formFolderId)?.name || "选择信息源…"}
              </span>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                className={`shrink-0 text-neutral-400 transition-transform ${folderDropOpen ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {/* Dropdown — inline flow so modal scrolls naturally */}
            {folderDropOpen && (
              <div className="mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md">
                {/* Search */}
                <div className="border-b border-neutral-100 px-3 py-2.5">
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-1.5">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input autoFocus value={folderSearch} onChange={e => setFolderSearch(e.target.value)}
                      placeholder="搜索信息源…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder-neutral-400" />
                  </div>
                </div>
                {/* Options */}
                <div className="max-h-52 overflow-y-auto py-1">
                  {/* My 信息源 */}
                  {folderList.filter(f => f.owner === CURRENT_USER && (!folderSearch || f.name.includes(folderSearch))).map(f => (
                    <button key={f.id} onClick={() => { setFormFolderId(f.id); lastUsedFolderId = f.id; setFolderDropOpen(false); setFolderSearch(""); }}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-neutral-50 ${formFolderId === f.id ? "bg-orange-50 text-orange-600" : "text-neutral-700"}`}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span>{f.name}</span>
                      {formFolderId === f.id && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="ml-auto shrink-0 text-orange-500"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                  {/* Empty search result */}
                  {folderSearch && folderList.filter(f => f.name.includes(folderSearch)).length === 0 && (
                    <div className="px-4 py-4 text-center text-sm text-neutral-400">未找到匹配的信息源</div>
                  )}
                </div>
                {/* New 信息源 shortcut */}
                <div className="border-t border-neutral-100 px-3 py-2">
                  <button onClick={() => { setShowNewFolderModal(true); setFolderDropOpen(false); setFolderSearch(""); }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-orange-500 hover:bg-orange-50 transition">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    新建信息源
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>}

      </>
    );

    // ── 两步连接器的第二步：信息名称 + 同步计划 + 更多配置 ──
    // 机器人类：机器人名称已作为信息名称，第二步不再单独要信息名称
    const nameFromRobot = label === "企微机器人" || label === "飞书机器人";
    const ConnStep2 = () => (
      <div className="space-y-4">
        {!nameFromRobot && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">信息名称 <span className="text-red-400">*</span></label>
              <span className={`text-xs ${formName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{formName.length}/20</span>
            </div>
            <input value={formName} onChange={e => setFormName(e.target.value)} maxLength={20}
              placeholder="给信息源一个有辨识度的名称"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          </div>
        )}
        <SyncConfig />
        <div className="mt-1">
          <button type="button" onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-500">
            <span>更多配置</span>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24" className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {showAdvanced && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">信息要点</label>
                <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
              </div>
              <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
                placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
            </div>
          )}
        </div>
      </div>
    );

    // ── RSS 订阅 ──
    if (label === "RSS 订阅") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">
            RSS 链接 <span className="text-red-400">*</span>
          </label>
          <input value={formUrls} onChange={e => setFormUrls(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-mono placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
      </div>
      );
    }

    // ── 网页爬虫 ──
    if (label === "网页爬虫") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">
            起始链接 <span className="text-red-400">*</span>
          </label>
          <input value={formUrls} onChange={e => {
            const url = e.target.value;
            setFormUrls(url);
            let host = "";
            try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { return; }
            if (!host) return;
            let prevHost = "";
            try { prevHost = new URL(formUrls).hostname.replace(/^www\./, ''); } catch {}
            setFormName(prev => (prev === "" || prev === prevHost) ? host : prev);
          }}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-mono placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">爬取范围</label>
          <div className="space-y-2">
            {[
              ["仅当前页面", "适用于文章、详情页"],
              ["当前列表页中的内容", "采集本页多条内容，适用于列表、频道页"],
              ["当前站点下的更多内容", "采集站点/栏目更多相关内容"],
            ].map(([val, hint]) => (
              <label key={val} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-orange-200 hover:bg-orange-50/40">
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${crawlScope === val ? "border-orange-500" : "border-neutral-300"}`}>
                  {crawlScope === val && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                </span>
                <input type="radio" className="sr-only" checked={crawlScope === val} onChange={() => setCrawlScope(val)} />
                <div>
                  <div className="text-sm font-medium text-neutral-800">{val}</div>
                  <div className="text-xs text-neutral-400">{hint}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      );
    }

    // ── 搜索引擎 ──
    if (label === "搜索引擎") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">
            定向搜索关键词 <span className="text-red-400">*</span>
          </label>
          <input value={searchKeyword} onChange={e => {
            const kw = e.target.value;
            setSearchKeyword(kw);
            const firstWord = kw.trim().split(/\s+/)[0];
            if (firstWord) setFormName(prev => (prev === "" || prev.endsWith(" 资讯")) ? firstWord + " 资讯" : prev);
          }}
            placeholder="例如：AI 信息管理 产品动态"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          <p className="mt-1 text-xs text-neutral-400">多个关键词用空格分隔，系统将定期按关键词抓取资讯</p>
        </div>
      </div>
      );
    }

    // ── API 接入 ──
    if (label === "API 接入") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <ApiConfigEditor url={apiUrl} onUrlChange={setApiUrl} />
      </div>
      );
    }

    // ── 企微机器人 ──
    if (label === "企微机器人") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-500">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          需要先在企业微信后台完成应用配置，
          <button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">机器人名称 <span className="text-red-400">*</span></label>
            <span className={`text-xs ${robotName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{robotName.length}/20</span>
          </div>
          <input value={robotName} onChange={e => { setRobotName(e.target.value); setFormName(e.target.value); }} placeholder="给机器人起个名称（同时作为信息名称）"
            maxLength={20}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">企业 ID <span className="text-red-400">*</span></label>
          <input value={corpId} onChange={e => setCorpId(e.target.value)} placeholder="请输入企业 ID"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">Secret <span className="text-red-400">*</span></label>
          <input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="输入 Secret"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">密钥文件 <span className="text-xs font-normal text-neutral-400">（.pem，≤ 1.6 KB）</span></label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 px-4 py-3 hover:border-orange-300 hover:bg-orange-50/40">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 3v9M5 7l4-4 4 4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h12" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <span className="text-sm text-neutral-500">{pemFile ? pemFile.name : "点击上传或拖拽 .pem 文件"}</span>
            <input type="file" accept=".pem" className="hidden" onChange={e => setPemFile(e.target.files[0])} />
          </label>
        </div>
      </div>
      );
    }

    // ── 飞书机器人 ──
    if (label === "飞书机器人") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-500">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          需要在飞书开放平台创建自建应用并授权，
          <button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">机器人名称 <span className="text-red-400">*</span></label>
            <span className={`text-xs ${robotName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{robotName.length}/20</span>
          </div>
          <input value={robotName} onChange={e => { setRobotName(e.target.value); setFormName(e.target.value); }} placeholder="给机器人起个名称（同时作为信息名称）"
            maxLength={20}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">App ID <span className="text-red-400">*</span></label>
          <input value={fsAppId} onChange={e => setFsAppId(e.target.value)} placeholder="cli_xxx"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">密钥 <span className="text-red-400">*</span></label>
          <input type="password" value={fsAppSecret} onChange={e => setFsAppSecret(e.target.value)} placeholder="输入密钥"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
      </div>
      );
    }

    // ── 飞书CLI ──
    if (label === "飞书CLI") {
      // Outer 3 steps; auth (gitStep 1) wraps 4 internal substeps with per-step actions
      const fsCliOuter = [
        { no: 1, title: "授权" },
        { no: 2, title: "信息配置" },
        { no: 3, title: "同步配置" },
      ];
      const fsCliAuthSubs = [
        { no: 1, label: "配置应用",     kind: "external", action: "前往配置 ↗", busyText: "正在打开飞书后台…" },
        { no: 2, label: "登录授权",     kind: "external", action: "前往登录 ↗", busyText: "正在打开飞书登录页…" },
        { no: 3, label: "管理员授权",   kind: "wait",     busyText: "等待管理员确认…" },
        { no: 4, label: "群聊读取授权", kind: "qr",       action: "前往授权 ↗", busyText: "授权中…" },
      ];
      const fsCliMockChats = [
        { id: "oc_001", name: "产品研发讨论群", members: 38, lastActive: "刚刚",     hint: "PRD 评审、需求讨论" },
        { id: "oc_002", name: "客户反馈周报",   members: 24, lastActive: "1 小时前", hint: "客户原声、问题反馈" },
        { id: "oc_003", name: "运营月度计划",   members: 12, lastActive: "昨天",     hint: "活动策划、增长计划" },
        { id: "oc_004", name: "设计评审群",     members: 18, lastActive: "3 天前",   hint: "设计评审、视觉规范" },
        { id: "oc_005", name: "管理层周会",      members: 6,  lastActive: "5 天前",   hint: "战略对齐、资源协调" },
        { id: "oc_006", name: "Beta 用户社群",   members: 96, lastActive: "今天",     hint: "Beta 用户答疑与反馈" },
      ];
      const outerStep = Math.min(gitStep, 3);
      const allAuthDone = fsCliAuthorizedSteps.length === 4;
      const currentSubNo = allAuthDone ? null : fsCliAuthorizedSteps.length + 1;

      const completeSub = (subNo) => {
        markFsCliStepDone(subNo);
        setFsCliPhase("idle");
        if (subNo === 2) {
          // auto-start step 3 (admin waiting)
          setTimeout(() => {
            setFsCliPhase("busy");
            setTimeout(() => {
              markFsCliStepDone(3);
              setFsCliPhase("idle");
            }, 1800);
          }, 350);
        } else if (subNo === 4) {
          setTimeout(() => setGitStep(2), 500);
        }
      };
      const kickoff = (subNo) => {
        if (fsCliPhase === "busy") return;
        setFsCliPhase("busy");
        setTimeout(() => completeSub(subNo), 1400);
      };
      const toggleChat = (id) => setFsCliChats(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
      const FsCliSyncStep = () => (
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">信息名称 <span className="text-red-400">*</span></label>
              <span className={`text-xs ${formName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{formName.length}/20</span>
            </div>
            <input value={formName} onChange={e => setFormName(e.target.value)} maxLength={20}
              placeholder="给信息源一个有辨识度的名称"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          </div>
          <SyncConfig />
          <div className="mt-1">
            <button type="button" onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-500">
              <span>更多配置</span>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24" className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">信息要点</label>
                  <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
                </div>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
                  placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
            )}
          </div>
        </div>
      );

      return (
        <div className="space-y-4">
          <BaseFields hideName={true} hideFolder={outerStep !== 1 || !!defaultFolderId} />

          {/* Step body */}
          {outerStep === 1 && (
            <div className="rounded-xl bg-neutral-50 px-4 py-3.5 space-y-3">
              {fsCliAuthSubs.map((sub) => {
                const done = isFsCliStepDone(sub.no);
                const current = !done && sub.no === currentSubNo;
                const busy = current && fsCliPhase === "busy";
                // step 3 always shows busy when current (auto-waits)
                const waiting = current && sub.kind === "wait";
                return (
                  <div key={sub.no} className="flex items-start gap-2.5 text-xs">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-emerald-500 text-white" : current ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-500"
                    }`}>
                      {done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : (busy || waiting) ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="spin"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                        : <span className="font-mono text-[10px]">{sub.no}</span>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={done ? "text-emerald-700" : current ? "text-neutral-800 font-medium" : "text-neutral-400"}>{sub.label}</span>
                        {done && <span className="text-[10px] text-neutral-400">已授权</span>}
                        {(busy || waiting) && <span className="text-[10px] text-orange-500">{sub.busyText}</span>}
                      </div>
                      {/* Step-specific action UI — only on current sub-step */}
                      {current && !busy && !waiting && sub.kind === "external" && (
                        <button type="button" onClick={() => kickoff(sub.no)}
                          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 transition">
                          {sub.action}
                        </button>
                      )}
                      {current && sub.kind === "qr" && !busy && (
                        <div className="mt-2 flex items-center gap-3">
                          <div className="grid h-16 w-16 shrink-0 grid-cols-4 gap-0.5 rounded-md border border-neutral-200 bg-white p-1.5">
                            {Array.from({length: 16}, (_, i) => (
                              <span key={i} className={`rounded-[1px] ${[0,1,4,5,10,11,14,15,6,9].includes(i) ? "bg-neutral-800" : "bg-neutral-200"}`} />
                            ))}
                          </div>
                          <div className="flex flex-col items-start gap-1.5">
                            <span className="text-[11px] text-neutral-500">飞书客户端扫码授权</span>
                            <button type="button" onClick={() => kickoff(sub.no)}
                              className="inline-flex items-center gap-1 rounded-lg bg-white border border-orange-200 px-2.5 py-1 text-[11px] font-medium text-orange-600 hover:bg-orange-50 transition">
                              {sub.action}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {outerStep === 2 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-neutral-500">选择要同步的群聊（已选 {fsCliChats.size}/{fsCliMockChats.length}）</span>
                <button type="button" onClick={() => setFsCliChats(fsCliChats.size === fsCliMockChats.length ? new Set() : new Set(fsCliMockChats.map(c => c.id)))}
                  className="text-xs font-medium text-orange-500 hover:underline">
                  {fsCliChats.size === fsCliMockChats.length ? "清空" : "全选"}
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-neutral-200">
                {fsCliMockChats.map((c, i) => {
                  const checked = fsCliChats.has(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => toggleChat(c.id)}
                      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition ${i > 0 ? "border-t border-neutral-100" : ""} ${checked ? "bg-orange-50/50" : "hover:bg-neutral-50"}`}>
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-orange-500 bg-orange-500" : "border-neutral-300 bg-white"}`}>
                        {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-neutral-800">{c.name}</span>
                          <span className="shrink-0 text-[10px] text-neutral-400">{c.members} 人</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {outerStep === 3 && <FsCliSyncStep />}
        </div>
      );
    }

    // ── SaleSmartly ──
    if (label === "SaleSmartly") {
      if (gitStep === 2) return ConnStep2();
      return (
      <div className="space-y-4">
        <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-500">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          在 SaleSmartly 后台获取项目凭据，
          <button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">项目 ID <span className="text-red-400">*</span></label>
          <input value={saleProjectId} onChange={e => setSaleProjectId(e.target.value)} placeholder="输入项目 ID"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">密钥 <span className="text-red-400">*</span></label>
          <input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="输入密钥"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
        </div>
      </div>
      );
    }

    // ── 文档上传 ──
    if (label === "文档上传") {
      const docExts = { pdf: ["bg-red-100","text-red-500","PDF"], docx: ["bg-blue-100","text-blue-500","DOC"], doc: ["bg-blue-100","text-blue-500","DOC"], pptx: ["bg-orange-100","text-orange-500","PPT"], md: ["bg-neutral-100","text-neutral-600","MD"], txt: ["bg-neutral-100","text-neutral-600","TXT"], epub: ["bg-purple-100","text-purple-500","EPB"] };
      const imgExts = ["jpg","jpeg","png","webp"];
      const getDocIcon = name => { const ext = (name.split(".").pop()||"").toLowerCase(); if (imgExts.includes(ext)) return ["bg-green-100","text-green-600","IMG"]; return docExts[ext] || ["bg-neutral-100","text-neutral-500","FILE"]; };
      const fmtSize = b => b < 1024*1024 ? (b/1024).toFixed(0)+" KB" : (b/1024/1024).toFixed(1)+" MB";
      const isArchive = name => /\.(zip|lakebook)$/i.test(name);
      const addDocFiles = e => {
        const files = Array.from(e.target.files||[]);
        // zip / lakebook 是文档包 → 弹出文档选择器，让用户挑选包内文档
        const archive = files.find(f => isArchive(f.name));
        if (archive) {
          setDocArchive(archive.name);
          setSelectedFileIds(new Set([1,3,4,5,6,7,8,10]));
          setShowFilePicker(true);
          if (!formName) setFormName(archive.name.replace(/\.[^.]+$/,""));
        }
        const normalFiles = files.filter(f => !isArchive(f.name));
        if (normalFiles.length) setDocFiles(prev => { const next = [...prev, ...normalFiles]; if (!formName && normalFiles[0]) setFormName(normalFiles[0].name.replace(/\.[^.]+$/,"")); return next; });
        e.target.value = "";
      };
      const accept = ".docx,.doc,.pptx,.pdf,.txt,.md,.epub,.zip,.lakebook,.jpg,.png,.jpeg,.webp";
      const hasContent = docFiles.length > 0 || docArchive;
      const removeArchiveDoc = id => setSelectedFileIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      return (
        <div className="space-y-4">
          {/* 添加到信息源 — 置顶 */}
          <BaseFields hideName hideFolder={!!defaultFolderId} />
          {!hasContent ? (
            <label title="支持 docx · pdf · md · txt · pptx · epub · zip · lakebook；单文件 ≤ 150MB，图片 ≤ 20MB，最多 20 个文件；zip / lakebook 上传后选择包内文档"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-9 hover:border-orange-300 hover:bg-orange-50/30">
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="36" height="36" rx="10" fill="#f5f5f4"/><path d="M18 11v10M14 15l4-4 4 4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 25h14" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
              <div className="text-center">
                <div className="text-sm font-medium text-neutral-700">点击选择文件，或拖拽到此处</div>
                <div className="mt-1 text-xs text-neutral-400">支持文档、图片及 zip / lakebook 导出包</div>
              </div>
              <input type="file" multiple className="hidden" accept={accept} onChange={addDocFiles} />
            </label>
          ) : (
            <div className="space-y-3">
              {/* 压缩包：展开为包内已选文档列表（每篇对应一条信息） */}
              {docArchive && (() => {
                const pickedDocs = _mockFileList.filter(f => selectedFileIds.has(f.id));
                return (
                  <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                      <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-neutral-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-[9px] font-bold text-violet-500">ZIP</span>
                        <span className="truncate">{docArchive}</span>
                        <span className="shrink-0 text-xs font-normal text-neutral-400">· 共 {pickedDocs.length} 篇</span>
                      </span>
                      <div className="flex shrink-0 items-center gap-3">
                        <button onClick={() => setShowFilePicker(true)} className="text-xs font-medium text-violet-500 hover:underline">重新选择</button>
                        <button onClick={() => { setDocArchive(null); setSelectedFileIds(new Set()); }}
                          className="text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                      </div>
                    </div>
                    <div className="max-h-48 divide-y divide-neutral-50 overflow-y-auto">
                      {pickedDocs.map(f => {
                        const [bg, tc, lbl] = getDocIcon(f.name);
                        return (
                          <div key={f.id} className="flex items-center gap-3 px-4 py-2.5">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${bg} ${tc}`}>{lbl}</div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-medium text-neutral-800">{f.name}</div>
                              <div className="text-[11px] text-neutral-400">{f.fmt} · {f.size}</div>
                            </div>
                            <button onClick={() => removeArchiveDoc(f.id)}
                              className="shrink-0 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              {/* 普通文件列表 */}
              {docFiles.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                    <span className="text-sm font-medium text-neutral-700">已选 {docFiles.length} 个文件</span>
                    <label className="cursor-pointer text-xs font-medium text-orange-500 hover:text-orange-600">
                      + 继续添加
                      <input type="file" multiple className="hidden" accept={accept} onChange={addDocFiles} />
                    </label>
                  </div>
                  <div className="max-h-48 divide-y divide-neutral-50 overflow-y-auto">
                    {docFiles.map((f, i) => {
                      const [bg, tc, lbl] = getDocIcon(f.name);
                      return (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${bg} ${tc}`}>{lbl}</div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-medium text-neutral-800">{f.name}</div>
                            <div className="text-[11px] text-neutral-400">{fmtSize(f.size)}</div>
                          </div>
                          <button onClick={() => setDocFiles(p => p.filter((_,j)=>j!==i))}
                            className="shrink-0 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* 无压缩包时，列表外再提供继续添加（含压缩包） */}
              {!docArchive && (
                <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-200 py-2.5 text-xs font-medium text-neutral-400 hover:border-orange-300 hover:text-orange-500">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  继续添加文件
                  <input type="file" multiple className="hidden" accept={accept} onChange={addDocFiles} />
                </label>
              )}
            </div>
          )}
        </div>
      );
    }

    // ── 音频上传 ──
    if (label === "音频上传") {
      const fmtSize = b => b < 1024*1024 ? (b/1024).toFixed(0)+" KB" : (b/1024/1024).toFixed(1)+" MB";
      const audioAccept = ".mp3,.wav,.m4a,.aac";
      const addAudioFiles = e => {
        const files = Array.from(e.target.files||[]);
        setAudioFiles(prev => { const next = [...prev, ...files]; if (!formName && files[0]) setFormName(files[0].name.replace(/\.[^.]+$/,"")); return next; });
        e.target.value = "";
      };
      return (
        <div className="space-y-4">
          {/* 添加到信息源 — 置顶 */}
          <BaseFields hideName hideFolder={!!defaultFolderId} />
          {audioFiles.length === 0 ? (
            <label title="支持主流音视频格式（MP3 · WAV · M4A · MP4 · MOV 等）；单文件 ≤ 500MB；上传后自动转写文字"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-9 hover:border-orange-300 hover:bg-orange-50/30">
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="36" height="36" rx="10" fill="#f5f5f4"/><path d="M18 10c-2.2 0-4 1.8-4 4v4c0 2.2 1.8 4 4 4s4-1.8 4-4v-4c0-2.2-1.8-4-4-4z" stroke="#999" strokeWidth="1.4"/><path d="M12 20c0 3.3 2.7 6 6 6s6-2.7 6-6M18 26v3" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
              <div className="text-center">
                <div className="text-sm font-medium text-neutral-700">点击选择音频文件，或拖拽到此处</div>
                <div className="mt-1 text-xs text-neutral-400">支持主流音视频格式，自动转写文字</div>
              </div>
              <input type="file" multiple className="hidden" accept={audioAccept} onChange={addAudioFiles} />
            </label>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                <span className="text-sm font-medium text-neutral-700">已选 {audioFiles.length} 个文件</span>
                <label className="cursor-pointer text-xs font-medium text-orange-500 hover:text-orange-600">
                  + 继续添加
                  <input type="file" multiple className="hidden" accept={audioAccept} onChange={addAudioFiles} />
                </label>
              </div>
              <div className="max-h-48 divide-y divide-neutral-50 overflow-y-auto">
                {audioFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[10px] font-bold text-orange-500">
                      {(f.name.split(".").pop()||"").toUpperCase().slice(0,3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-neutral-800">{f.name}</div>
                      <div className="text-[11px] text-neutral-400">{fmtSize(f.size)}</div>
                    </div>
                    <button onClick={() => setAudioFiles(p => p.filter((_,j)=>j!==i))}
                      className="shrink-0 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── 实时录音（开始录音引导页 → 启动右下角悬浮录音器）──
    if (label === "实时录音") {
      const folderReady = defaultFolderId !== null || formFolderId !== "__unset__";
      const targetFolder = defaultFolderId !== null ? defaultFolderId : (formFolderId !== "__unset__" ? formFolderId : null);
      return (
        <div className="space-y-4">
          {!defaultFolderId && <BaseFields hideName={true} hideFolder={false} />}
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-b from-red-50/70 to-neutral-50 py-9 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-red-100/70">
              <svg width="26" height="26" fill="none" viewBox="0 0 28 28"><path d="M14 4c-2.2 0-4 1.8-4 4v6c0 2.2 1.8 4 4 4s4-1.8 4-4V8c0-2.2-1.8-4-4-4z" stroke="#ef4444" strokeWidth="1.5"/><path d="M7 14c0 3.9 3.1 7 7 7s7-3.1 7-7M14 21v3" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="text-center">
              {!folderReady ? (
                <>
                  <div className="text-sm font-medium text-neutral-500">请先选择信息源</div>
                  <div className="mt-1 text-xs text-neutral-400">选择保存位置后即可开始录音</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-neutral-700">准备就绪，点击开始录音</div>
                  <div className="mt-1 text-xs text-neutral-400">录音将在右下角悬浮进行，结束后自动转写为文字</div>
                </>
              )}
            </div>
            <button
              onClick={() => { if (folderReady && onStartFloatingRec) onStartFloatingRec(targetFolder); }}
              disabled={!folderReady}
              className={"flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold text-white transition-colors " + (folderReady ? "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200" : "bg-neutral-300 cursor-not-allowed")}>
              <span className="h-2 w-2 rounded-full bg-white" />
              开始录音
            </button>
          </div>
        </div>
      );
    }

    // ── 思源笔记 / 语雀知识库（上传导出包 → 选择文档 → 展开列表）──
    if (label === "思源笔记" || label === "语雀知识库") {
      const isSiyuan = label === "思源笔记";
      const pkgFile = isSiyuan ? siyuanFile : yuqueFile;
      const setPkgFile = isSiyuan ? setSiyuanFile : setYuqueFile;
      const theme = isSiyuan
        ? { ring: "border-violet-300 bg-violet-50/40", iconBg: "bg-violet-100 text-violet-500", Icon: Icon.Diamond, accent: "text-violet-700", accentSub: "text-violet-500" }
        : { ring: "border-green-300 bg-green-50/40",  iconBg: "bg-green-100 text-green-600",  Icon: Icon.Leaf,    accent: "text-green-700",  accentSub: "text-green-600" };
      const accept = isSiyuan ? ".zip,.lakebook" : ".lakebook,.zip";
      const hint = isSiyuan ? "在思源笔记中依次点击：导出 → Markdown" : "在语雀中依次点击：知识库 → 更多 → 导出 → lakebook";
      const emptyText = isSiyuan ? "上传思源笔记导出文件" : "上传语雀知识库导出文件";
      const emptyDesc = isSiyuan ? "仅支持 Markdown.zip 格式，上传后选择需导入的文档" : "仅支持 .lakebook 格式，上传后选择需导入的文档";
      const pickedDocs = _mockFileList.filter(f => selectedFileIds.has(f.id));
      const removeDoc = id => setSelectedFileIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      const pkgBadge = isSiyuan ? "ZIP" : "LAKE";
      return (
        <div className="space-y-4">
          {/* 添加到信息源 — 置顶 */}
          <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
          {!pkgFile ? (
            <>
              {/* 上传区 */}
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-9 transition-colors hover:border-orange-300 hover:bg-orange-50/30">
                <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="36" height="36" rx="10" fill="#f5f5f4"/><path d="M18 11v10M14 15l4-4 4 4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 25h14" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <div className="text-center">
                  <div className="text-sm font-medium text-neutral-700">{emptyText}</div>
                  <div className="mt-1 text-xs text-neutral-400">{emptyDesc}</div>
                </div>
                <input type="file" className="hidden" accept={accept}
                  onChange={e => { if (e.target.files[0]) { setPkgFile(e.target.files[0].name); setSelectedFileIds(new Set([1,3,4,5,6,7,8,10])); setShowFilePicker(true); } }} />
              </label>
              {/* 操作指南 */}
              <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[11px] text-neutral-400">
                <svg width="11" height="11" fill="none" viewBox="0 0 16 16" className="shrink-0"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <span>{hint}</span>
                <span className="text-neutral-300">·</span>
                <a href="#" className="inline-flex items-center gap-0.5 text-orange-500 hover:underline">
                  查看操作指南
                  <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </>
          ) : (
            /* 已上传：包名 header + 包内文档展开列表（与文档上传一致） */
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-neutral-700">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${theme.iconBg} text-[8px] font-bold`}>{pkgBadge}</span>
                  <span className="truncate">{pkgFile}</span>
                  <span className="shrink-0 text-xs font-normal text-neutral-400">· 共 {pickedDocs.length} 篇</span>
                </span>
                <div className="flex shrink-0 items-center gap-3">
                  <button onClick={() => setShowFilePicker(true)} className={`text-xs font-medium ${theme.accentSub} hover:underline`}>重新选择</button>
                  <button onClick={() => { setPkgFile(null); setSelectedFileIds(new Set()); }}
                    className="text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                </div>
              </div>
              <div className="max-h-48 divide-y divide-neutral-50 overflow-y-auto">
                {pickedDocs.map(f => (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme.iconBg} text-[9px] font-bold`}>{(f.fmt||"").slice(0,3).toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-neutral-800">{f.name}</div>
                      <div className="text-[11px] text-neutral-400">{f.fmt} · {f.size}</div>
                    </div>
                    <button onClick={() => removeDoc(f.id)} className="shrink-0 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── 飞书知识库（API 凭据）──
    if (label === "飞书知识库") {
      // Step 3：信息名称 + 同步计划（inline，在主弹窗 body 内）
      if (gitStep === 3) return (
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">信息名称 <span className="text-red-400">*</span></label>
              <span className={`text-xs ${formName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{formName.length}/20</span>
            </div>
            <input value={formName} onChange={e => { setFormName(e.target.value); setRepoNameAutoFilled(false); }}
              maxLength={20} placeholder="给信息源一个有辨识度的名称"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          </div>
          <SyncConfig />
          <div className="mt-1">
            <button type="button" onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-500">
              <span>更多配置</span>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24" className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">信息要点</label>
                  <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
                </div>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
                  placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
            )}
          </div>
        </div>
      );

      // Step 2：选择知识库文档（inline，在主弹窗 body 内，无 padding）
      if (gitStep === 2) {
        const filtered = _mockFsKbDocs.filter(d => !fsKbDocSearch || d.name.toLowerCase().includes(fsKbDocSearch.toLowerCase()));
        const okDocs = filtered.filter(d => d.ok);
        const allSel = okDocs.length > 0 && okDocs.every(d => fsKbSelDocs.has(d.id));
        const toggleAll = () => {
          if (allSel) setFsKbSelDocs(prev => { const n = new Set(prev); okDocs.forEach(d => n.delete(d.id)); return n; });
          else setFsKbSelDocs(prev => new Set([...prev, ...okDocs.map(d => d.id)]));
        };
        return (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Search */}
            <div className="shrink-0 border-b border-neutral-100 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input autoFocus value={fsKbDocSearch} onChange={e => setFsKbDocSearch(e.target.value)}
                  placeholder="搜索文档名称"
                  className="flex-1 bg-transparent text-sm outline-none placeholder-neutral-400" />
              </div>
            </div>
            {/* Table */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-100 bg-white px-5 py-2.5 text-xs font-medium text-neutral-500">
                <input type="checkbox" checked={allSel} onChange={toggleAll} className="h-4 w-4 cursor-pointer rounded accent-orange-500" />
                <span className="flex-1">文件名</span>
                <span className="w-20 text-right">类型</span>
                <span className="w-16 text-right">大小</span>
              </div>
              {filtered.map(d => (
                <div key={d.id} onClick={() => d.ok && toggleFsKbDoc(d.id)}
                  className={`flex items-center gap-3 border-b border-neutral-50 px-5 py-3 transition-colors ${d.ok ? "cursor-pointer hover:bg-neutral-50" : "cursor-not-allowed opacity-40"}`}>
                  <input type="checkbox" checked={d.ok && fsKbSelDocs.has(d.id)} disabled={!d.ok} onChange={() => {}}
                    className="h-4 w-4 cursor-pointer rounded accent-orange-500 shrink-0" />
                  <span className="flex-1 truncate text-sm text-neutral-800" title={d.name}>{d.name}</span>
                  <span className="w-20 text-right text-xs text-neutral-400">{d.type}</span>
                  <span className="w-16 text-right text-xs text-neutral-400">{d.size}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 1：选择信息源 + 填凭据
      return (
        <div className="space-y-4">
          <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400"><Icon.BookOpen /></span>
                <span className="text-sm font-semibold text-neutral-800">飞书知识库配置</span>
              </div>
              <a href="#" className="flex items-center gap-1 text-xs text-neutral-400 hover:text-orange-500 transition-colors">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                查看操作指南
              </a>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">APP ID <span className="text-red-400">*</span></label>
                <input value={fsKbAppId} onChange={e => { setFsKbAppId(e.target.value); setFsKbSpaces(null); }} placeholder="cli_xxx"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">App Secret <span className="text-red-400">*</span></label>
                <input type="password" value={fsKbAppSecret} onChange={e => { setFsKbAppSecret(e.target.value); setFsKbSpaces(null); }} placeholder="输入 App Secret"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">User Access Token <span className="text-red-400">*</span></label>
                <input value={fsKbToken} onChange={e => { setFsKbToken(e.target.value); setFsKbSpaces(null); }} placeholder="输入 User Access Token"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
              <p className="text-xs text-neutral-400">填写完成后点击「下一步」，系统将验证凭据并拉取可同步的知识库空间。</p>
            </div>
          </div>
        </div>
      );
    }

    // ── GitHub / Gitee (OAuth) ──
    if (label === "GitHub" || label === "Gitee") {
      const mockRepos = label === "GitHub"
        ? ["simiy70/zleap-enterprise", "simiy70/design-system", "simiy70/api-docs", "simiy70/mobile-app"]
        : ["simiy70/zleap-enterprise", "simiy70/产品文档", "simiy70/后端服务"];

      // step 2：名称 + SyncConfig + 更多配置（在 renderConfig 内，SyncConfig/BaseFields 均可访问）
      if (gitStep === 2) return (
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">信息名称 <span className="text-red-400">*</span></label>
              <span className={`text-xs ${formName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{formName.length}/20</span>
            </div>
            <input value={formName} onChange={e => { setFormName(e.target.value); setRepoNameAutoFilled(false); }}
              maxLength={20} placeholder="给信息源一个有辨识度的名称"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          </div>
          <SyncConfig />
          <div className="mt-1">
            <button type="button" onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-500">
              <span>更多配置</span>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24" className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">信息要点</label>
                  <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
                </div>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
                  placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
            )}
          </div>
        </div>
      );

      return (
        <div className="space-y-6">
          {/* 信息源选择 — 始终在顶部 */}
          <BaseFields hideName={true} hideFolder={!!defaultFolderId} />

          {/* 授权区域 */}
          {oauthLoading ? (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[20px] bg-neutral-900 text-white">
                <div style={{ transform: "scale(2)" }}><Icon.GitHub /></div>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
                </span>
              </div>
              <div>
                <div className="text-base font-semibold text-neutral-800">正在跳转授权…</div>
                <p className="mt-1.5 text-sm text-neutral-500">请在弹出的窗口中完成 {label} 授权，授权成功后将自动返回</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>
                等待授权中，请勿关闭此窗口
              </div>
            </div>
          ) : !oauthDone ? (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-neutral-900 text-white">
                <div style={{ transform: "scale(2)" }}><Icon.GitHub /></div>
              </div>
              <div>
                <div className="text-base font-semibold text-neutral-800">连接 {label}</div>
                <p className="mt-1.5 text-sm text-neutral-500">授权后选择仓库和分支，系统将定时同步该分支内的所有文档。</p>
              </div>
              <button onClick={startOauth}
                className="w-full rounded-2xl bg-neutral-900 py-3.5 text-sm font-semibold text-white hover:bg-neutral-700 transition-colors">
                使用 {label} 账号授权
              </button>
              <a href={`https://help.zleap.ai/connectors/${label.toLowerCase()}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-orange-500 transition-colors">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                查看操作指南
              </a>
            </div>
          ) : (
            <RepoBranchPicker repos={mockRepos} selectedRepo={selectedRepo} onSelectRepo={handleSelectRepo} selectedBranch={selectedBranch} onSelectBranch={handleSelectBranch} />
          )}
        </div>
      );
    }

    // ── GitLab (form) ──
    if (label === "GitLab") {
      // step 2：名称 + SyncConfig（在 renderConfig 内，SyncConfig 可访问）
      if (gitStep === 2) return (
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">信息名称 <span className="text-red-400">*</span></label>
              <span className={`text-xs ${formName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{formName.length}/20</span>
            </div>
            <input value={formName} onChange={e => { setFormName(e.target.value); setRepoNameAutoFilled(false); }}
              maxLength={20} placeholder="给信息源一个有辨识度的名称"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          </div>
          <SyncConfig />
          <div className="mt-1">
            <button type="button" onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-500">
              <span>更多配置</span>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24" className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">信息要点</label>
                  <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
                </div>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
                  placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
              </div>
            )}
          </div>
        </div>
      );
      return (
        <div className="space-y-4">
          {/* 信息源选择 — 始终在顶部 */}
          <BaseFields hideName={true} hideFolder={!!defaultFolderId} />
          {/* GitLab 证书 + 授权 */}
          {!oauthDone && (
            <div className="overflow-hidden rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400"><Icon.Code /></span>
                  <span className="text-sm font-semibold text-neutral-800">GitLab 配置</span>
                </div>
                <div className="flex items-center gap-2">
                  <a href="https://help.zleap.ai/connectors/gitlab" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-orange-500 transition-colors">
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    查看操作指南
                  </a>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">GitLab 服务地址 <span className="text-red-400">*</span></label>
                  <input value={gitlabUrl} onChange={e => setGitlabUrl(e.target.value)} placeholder="例如: https://gitlab.example.com"
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-mono placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
                  <p className="mt-1 text-xs text-neutral-400">您的 GitLab 私有化部署地址</p>
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">Application ID <span className="text-red-400">*</span></label>
                  <input value={gitlabAppId} onChange={e => setGitlabAppId(e.target.value)} placeholder="输入 GitLab 应用 ID"
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700">Secret <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input type={showGitlabSecret ? "text" : "password"} value={gitlabSecret} onChange={e => setGitlabSecret(e.target.value)} placeholder="输入 GitLab 应用密钥"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 pr-10 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
                    <button type="button" onClick={() => setShowGitlabSecret(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                      {showGitlabSecret
                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                    </button>
                  </div>
                </div>
                {oauthLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-sm text-neutral-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    等待授权中，请在弹出窗口完成操作
                  </div>
                ) : (
                  <button onClick={startOauth}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    授权连接
                  </button>
                )}
              </div>
            </div>
          )}
          {oauthDone && (
            <RepoBranchPicker repos={["mygroup/zleap-docs", "mygroup/backend-api", "mygroup/frontend"]} selectedRepo={selectedRepo} onSelectRepo={handleSelectRepo} selectedBranch={selectedBranch} onSelectBranch={handleSelectBranch} />
          )}
        </div>
      );
    }

    return <div className="py-8 text-center text-sm text-neutral-400">暂无配置项</div>;
  };

  const handleConfirm = () => {
    const kindMap = {
      "RSS 订阅": "文章流", "网页爬虫": "网页", "网页链接": "网页",
      "搜索引擎": "搜索流", "API 接入": "代码讨论",
      "GitHub": "代码文档", "GitLab": "代码文档", "Gitee": "代码文档",
      "思源笔记": "文档", "飞书知识库": "文章流", "语雀知识库": "文档",
      "企微机器人": "会话", "飞书机器人": "会话", "飞书CLI": "会话", "SaleSmartly": "会话",
      "音频上传": "音频", "实时录音": "音频", "文档上传": "文档", "笔记": "笔记",
    };
    const srcLabel = selectedSrc?.label;
    const kind = kindMap[srcLabel] || "文章流";

    // 多文档导入：思源笔记 / 语雀知识库 / 文档上传
    // → 每个文档各自创建为一条独立「文档」信息（来源类型=文档上传，详情走 SingleDocPage）
    const isMultiDocImport = srcLabel === "思源笔记" || srcLabel === "语雀知识库" || srcLabel === "文档上传";
    if (isMultiDocImport) {
      const folderId = formFolderId === "__unset__" ? null : formFolderId;
      const items = [];
      // 压缩包/导出包内勾选的文档（思源/语雀，或 文档上传选了 zip/lakebook）
      if (srcLabel === "思源笔记" || srcLabel === "语雀知识库" || docArchive) {
        const fromLabel = docArchive || srcLabel;
        _mockFileList.filter(f => selectedFileIds.has(f.id)).forEach((f, i) => items.push({
          id: Date.now() + i,
          name: f.name.replace(/\.[^.]+$/, ""),
          kind: "文档", source: "文档上传", owner: CURRENT_USER, folderId,
          created: "刚刚", updated: "刚刚", status: "解析中", desc: `从「${fromLabel}」导入`,
        }));
      }
      // 直接选择的本地文档（文档上传）
      docFiles.forEach((f, i) => items.push({
        id: Date.now() + 1000 + i,
        name: f.name.replace(/\.[^.]+$/, ""),
        kind: "文档", source: "文档上传", owner: CURRENT_USER, folderId,
        created: "刚刚", updated: "刚刚", status: "解析中", desc: "本地文档上传",
      }));
      if (items.length === 0) { onClose(); return; }
      if (onAdded) onAdded(items);
      else onClose();
      return;
    }

    // 音频上传：每个音频文件各自创建为一条「音频」信息，名称默认取文件名（去扩展名）
    if (srcLabel === "音频上传" && audioFiles.length > 0) {
      const folderId = formFolderId === "__unset__" ? null : formFolderId;
      const items = audioFiles.map((f, i) => ({
        id: Date.now() + i,
        name: f.name.replace(/\.[^.]+$/, ""),
        kind: "音频", source: "音频上传", owner: CURRENT_USER, folderId,
        created: "刚刚", updated: "刚刚", status: "解析中", desc: "本地音频上传，正在转写中。",
      }));
      if (onAdded) onAdded(items.length === 1 ? items[0] : items);
      else onClose();
      return;
    }

    // Batch create for GitHub/GitLab/Gitee with multiple repos
    if ((srcLabel === "GitHub" || srcLabel === "GitLab" || srcLabel === "Gitee") && selectedRepos.length > 1) {
      const items = selectedRepos.map((repo, i) => ({
        id: Date.now() + i,
        name: (formName ? `${formName} — ` : "") + repo.split("/")[1],
        kind,
        source: srcLabel,
        owner: CURRENT_USER,
        folderId: formFolderId === "__unset__" ? null : formFolderId,
        updated: "刚刚",
        lastSync: "—",
        status: "同步中",
        desc: `${repo} 仓库的 README、Issues 同步`,
        _repo: repo,
      }));
      if (onAdded) onAdded(items[0]);
      else onClose();
      return;
    }

    // Batch create for RSS with multiple configs
    if (srcLabel === "RSS 订阅" && batchConfigs.length > 1) {
      const firstValidCfg = batchConfigs.find(c => c.url.trim()) || batchConfigs[0];
      const newItem = {
        id: Date.now(),
        name: firstValidCfg.name || formName || (srcLabel + " 信息源"),
        kind,
        source: srcLabel,
        owner: CURRENT_USER,
        folderId: formFolderId === "__unset__" ? null : formFolderId,
        updated: "刚刚",
        lastSync: "—",
        status: "同步中",
        desc: `批量创建 ${batchConfigs.length} 个 RSS 信息源`,
        _formUrls: batchConfigs.map(c => c.url).filter(Boolean).join("\n"),
      };
      if (onAdded) onAdded(newItem);
      else onClose();
      return;
    }

    const newItem = {
      id: Date.now(),
      name: formName || (srcLabel + " 信息源"),
      kind,
      source: srcLabel,
      owner: CURRENT_USER,
      folderId: formFolderId,
      updated: "刚刚",
      lastSync: "—",
      status: "同步中",
      desc: formDesc,
      _formUrls: batchConfigs[0]?.url || formUrls,
    };
    if (onAdded) onAdded(newItem);
    else onClose();
  };

  // ── 关闭前的误触保护 ──
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  // 用户是否已在配置页填过内容（用于判断关闭时是否需要二次确认）
  const isConfigDirty = step !== "select" && !!(
    (formName && formName !== (selectedSrc?.label || "")) || formDesc ||
    formUrls || searchKeyword || apiUrl || apiConfig ||
    corpId || secret || pemFile || fsAppId || fsAppSecret || robotName ||
    fsKbAppId || fsKbAppSecret || fsKbToken || (fsKbSelDocs && fsKbSelDocs.size > 0) ||
    saleProjectId || gitlabAppId || gitlabSecret ||
    selectedRepo || selectedBranch || oauthDone ||
    docFiles.length > 0 || audioFiles.length > 0 || docArchive || siyuanFile || yuqueFile ||
    (selectedFileIds && selectedFileIds.size > 0) || gitStep > 1
  );
  // 选择连接器步骤(select)允许直接关闭；配置页若已填内容则二次确认
  const requestClose = () => {
    if (step !== "select" && isConfigDirty) setShowLeaveConfirm(true);
    else onClose();
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget && step === "select") onClose(); }}>

      {step === "plugin" ? (
        /* ── Plugin step ── */
        <div className="flex w-full max-w-md flex-col rounded-[28px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
          <div className="shrink-0 flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
              <Icon.Back />
            </button>
            <div className="flex flex-1 items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500"><Icon.Plugin /></div>
              <span className="text-base font-semibold text-neutral-900">浏览器插件</span>
            </div>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-400">
              <Icon.Plugin />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">浏览时一键保存网页</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              安装 zleap 浏览器插件后，在任意网页点击插件图标即可将页面内容保存到信息源，支持 Chrome / Edge / Firefox。
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                前往 Chrome 网上应用店安装
              </button>
              <button className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                下载离线安装包
              </button>
            </div>
          </div>
        </div>
      ) : step === "select" ? (
        /* ── Step 1: Select source type ── */
        <div className="flex w-full max-w-2xl flex-col rounded-[28px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">添加信息源</h2>
              <p className="mt-0.5 text-xs text-neutral-500">选择要接入的信息来源类型</p>
            </div>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
          </div>
          {/* Tab bar */}
          <div className="shrink-0 flex gap-0 border-b border-neutral-100 px-6">
            {["全部", "单次导入", "定时同步"].map(tab => (
              <button key={tab} onClick={() => setSrcTab(tab)}
                className={"mr-4 py-3 text-sm font-medium border-b-2 transition-colors " + (srcTab === tab ? "border-orange-500 text-orange-500" : "border-transparent text-neutral-500 hover:text-neutral-700")}>
                {tab}
              </button>
            ))}
          </div>
          {/* Source grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {[
              { key: "写入",    label: "直接写入", show: srcTab === "全部" || srcTab === "单次导入" },
              { key: "导入",    label: "授权导入", show: srcTab === "全部" || srcTab === "单次导入" },
              { key: "定时同步", label: "定时同步", show: srcTab === "全部" || srcTab === "定时同步" },
            ].filter(function(g){ return g.show; }).map(function(g) {
              const items = allSources.filter(function(s){ return s.group === g.key && (!srcSearch || s.label.includes(srcSearch) || s.desc.includes(srcSearch)); });
              if (items.length === 0) return null;
              return (
                <div key={g.key}>
                  <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{g.label}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {items.map(function(src) {
                      return (
                        <button key={src.label} onClick={() => handleSelectSrc(src)}
                          className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 text-left transition hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-sm">
                          <span className="mt-0.5 shrink-0 text-neutral-500"><src.Icon /></span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm font-medium text-neutral-800">{src.label}</span>
                              {src.isOAuth && <span className="rounded bg-blue-50 px-1 py-0.5 text-[10px] font-medium text-blue-500">OAuth</span>}
                            </div>
                            <div className="mt-0.5 text-[11px] leading-snug text-neutral-400">{src.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Step 2: Config ── */
        <div className={`flex flex-col rounded-[28px] bg-white shadow-2xl w-full ${selectedSrc?.label === "API 接入" && gitStep === 1 ? "max-w-2xl" : selectedSrc?.label === "GitLab" || selectedSrc?.label === "飞书知识库" ? "max-w-xl" : "max-w-lg"}`} style={{maxHeight:"85vh"}}>
          {/* Header */}
          <div className="shrink-0 flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
            <button onClick={requestClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
              <Icon.Back />
            </button>
            <div className="flex flex-1 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                {selectedSrc && <selectedSrc.Icon />}
              </div>
              <span className="text-base font-semibold text-neutral-900">{selectedSrc?.label}</span>
              {["GitHub","GitLab","Gitee","飞书知识库"].includes(selectedSrc?.label) && oauthDone && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  已完成授权
                </span>
              )}
            </div>
            <button onClick={requestClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
          </div>
          {/* Body */}
          <div className={selectedSrc?.label === "飞书知识库" && gitStep === 2 ? "flex-1 min-h-0 flex flex-col overflow-hidden" : "flex-1 overflow-y-auto px-6 py-5"}>
            {renderConfig()}
            {/* 更多配置 — git 平台 & 两步连接器 在 renderConfig step2 内嵌；其余单步类型在此追加（实时录音除外） */}
            {!["GitHub","GitLab","Gitee","飞书知识库","飞书CLI","实时录音", ...STEPPED_CONNECTORS].includes(selectedSrc?.label) && (
              <div className="mt-5">
                <button type="button" onClick={() => setShowAdvanced(v => !v)}
                  className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-500">
                  <span>更多配置</span>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24"
                    className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {showAdvanced && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-neutral-700">信息要点</label>
                      <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
                    </div>
                    <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
                      placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                      className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Footer */}
          {(() => {
            const isGit = ["GitHub","GitLab","Gitee","飞书知识库"].includes(selectedSrc?.label);
            const isFsKb = selectedSrc?.label === "飞书知识库";
            const isFsCli = selectedSrc?.label === "飞书CLI";
            const isStepConn = STEPPED_CONNECTORS.includes(selectedSrc?.label);
            const folderReady = (defaultFolderId !== null) || (formFolderId !== "__unset__");

            if (isFsCli) {
              const fsCliStep = Math.min(gitStep, 3);
              const canGoNext = fsCliStep === 1 ? fsCliAuthorizedSteps.length === 4
                : fsCliStep === 2 ? fsCliChats.size > 0
                : folderReady && formName.trim() && fsCliChats.size > 0;
              const primaryLabel = fsCliStep < 3 ? "下一步" : "保存配置";
              const handlePrimary = () => {
                if (!canGoNext) return;
                if (fsCliStep < 3) setGitStep(fsCliStep + 1);
                else handleConfirm();
              };
              const goPrev = () => { if (gitStep > 1) setGitStep(gitStep - 1); };
              const FsCliStepBar = ({ active }) => (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  {[
                    [1, "授权"],
                    [2, "信息配置"],
                    [3, "同步配置"],
                  ].map(([no, label], index) => (
                    <React.Fragment key={no}>
                      {index > 0 && <svg width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>}
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${active === no ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-500"}`}>{no}</span>
                      <span className={active === no ? "" : "text-neutral-300"}>{label}</span>
                    </React.Fragment>
                  ))}
                </div>
              );
              return (
                <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                  <FsCliStepBar active={Math.min(gitStep, 3)} />
                  <div className="flex gap-2">
                    {gitStep > 1 && <button onClick={goPrev} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">上一步</button>}
                    <button onClick={handlePrimary} disabled={!canGoNext}
                      className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${canGoNext ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                      {primaryLabel}
                    </button>
                  </div>
                </div>
              );
            }

            // 两步连接器（RSS / 网页爬虫 / 搜索引擎 / API 接入 / 企微·飞书机器人 / SaleSmartly）
            if (isStepConn) {
              const StepBar = ({ active }) => (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${active === 1 ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-500"}`}>1</span>
                  <span className={active === 1 ? "" : "text-neutral-300"}>信息配置</span>
                  <svg width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${active === 2 ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-400"}`}>2</span>
                  <span className={active === 2 ? "" : "text-neutral-300"}>同步设置</span>
                </div>
              );
              if (gitStep === 2) return (
                <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                  <StepBar active={2} />
                  <div className="flex gap-2">
                    <button onClick={() => setGitStep(1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">上一步</button>
                    <button onClick={formName.trim() ? handleConfirm : undefined} disabled={!formName.trim()}
                      className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${formName.trim() ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                      保存配置
                    </button>
                  </div>
                </div>
              );
              // step1 各连接器类型的字段完整性检查
              const step1FieldsReady = folderReady && (() => {
                const l = selectedSrc?.label;
                if (l === "RSS 订阅") return !!formUrls.trim();
                if (l === "网页爬虫") return !!formUrls.trim();
                if (l === "搜索引擎") return !!searchKeyword.trim();
                if (l === "API 接入") return !!apiUrl.trim();
                if (l === "企微机器人") return !!(robotName && corpId && secret && pemFile);
                if (l === "飞书机器人") return !!(robotName && fsAppId && fsAppSecret);
                if (l === "SaleSmartly") return !!(saleProjectId && secret);
                return true;
              })();
              // 点「下一步」触发验证，成功才进入 step2
              const handleStepConnNext = () => {
                if (!step1FieldsReady || connValidating) return;
                setConnValidateError(null);
                setConnValidating(true);
                const l = selectedSrc?.label;
                const isUrlType = l === "RSS 订阅" || l === "网页爬虫";
                const urlOk = !isUrlType || /^https?:\/\/.+/.test(formUrls.trim());
                setTimeout(() => {
                  setConnValidating(false);
                  if (!urlOk) {
                    setConnValidateError("无法访问该链接，请检查链接格式是否正确（需以 http:// 或 https:// 开头）");
                  } else {
                    setConnValidateError(null);
                    setGitStep(2);
                  }
                }, 1300);
              };
              return (
                <div className="shrink-0 border-t border-neutral-100">
                  {connValidateError && (
                    <div className="flex items-start gap-1.5 px-6 pt-3 text-xs text-red-500">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {connValidateError}
                    </div>
                  )}
                  <div className="flex items-center justify-between px-6 py-4">
                    <StepBar active={1} />
                    <div className="flex gap-2">
                      <button onClick={requestClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
                      <button onClick={handleStepConnNext} disabled={!step1FieldsReady || connValidating}
                        className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${step1FieldsReady && !connValidating ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                        {connValidating
                          ? <span className="flex items-center gap-1.5">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                              验证中…
                            </span>
                          : "下一步"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // 飞书知识库 step1：信息源已选 + 三项凭据已填（点「下一步」时验证拉取）；其他 git 平台须授权完成 + 仓库/分支已选
            const fsCredsReady = !!(fsKbAppId && fsKbAppSecret && fsKbToken);
            const step1CanNext = isFsKb ? (fsCredsReady && folderReady) : (folderReady && oauthDone && selectedRepo && selectedBranch);
            // 飞书知识库「下一步」= 验证凭据 + 拉取空间 + 进入第二步（一键完成）
            const handleStep1Next = () => {
              if (isFsKb && !fsKbSpaces) {
                setFsKbLoading(true);
                setTimeout(() => { setFsKbLoading(false); setFsKbSpaces(_mockFsSpaces); setGitStep(2); }, 1400);
              } else {
                setGitStep(2);
              }
            };
            if (isGit && gitStep === 1) return (
              <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">1</span>
                  <span>{isFsKb ? "连接知识库" : "连接仓库"}</span>
                  <svg width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-400">2</span>
                  <span className="text-neutral-300">{isFsKb ? "选择文档" : "同步配置"}</span>
                  {isFsKb && <>
                    <svg width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-400">3</span>
                    <span className="text-neutral-300">信息配置</span>
                  </>}
                </div>
                <div className="flex gap-2">
                  <button onClick={requestClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
                  <button onClick={handleStep1Next} disabled={!step1CanNext || fsKbLoading}
                    className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${step1CanNext && !fsKbLoading ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                    {isFsKb && fsKbLoading
                      ? <span className="flex items-center gap-1.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                          连接中…
                        </span>
                      : "下一步"}
                  </button>
                </div>
              </div>
            );
            // 飞书知识库专属步骤条
            const FsKbStepBar = ({ active }) => (
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                {[["连接知识库",1],["选择文档",2],["信息配置",3]].map(([lbl,n],i) => (
                  <React.Fragment key={n}>
                    {i > 0 && <svg width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>}
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${active === n ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-500"}`}>{n}</span>
                    <span className={active === n ? "text-neutral-700" : "text-neutral-300"}>{lbl}</span>
                  </React.Fragment>
                ))}
              </div>
            );
            if (isFsKb && gitStep === 3) return (
              <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                <FsKbStepBar active={3} />
                <div className="flex gap-2">
                  <button onClick={() => setGitStep(2)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">上一步</button>
                  {(() => {
                    const ready = formName.trim().length > 0;
                    return (
                      <button onClick={ready ? handleConfirm : undefined} disabled={!ready}
                        className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${ready ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                        保存配置
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
            if (isFsKb && gitStep === 2) return (
              <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                <FsKbStepBar active={2} />
                <div className="flex gap-2">
                  <button onClick={() => setGitStep(1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">上一步</button>
                  <button onClick={fsKbSelDocs.size > 0 ? () => {
                    if (nameIsDefault()) {
                      const selDocs = _mockFsKbDocs.filter(d => d.ok && fsKbSelDocs.has(d.id));
                      if (selDocs.length > 0) {
                        const firstName = selDocs[0].name;
                        const count = selDocs.length;
                        const suffix = count > 1 ? `等 ${count} 篇` : "";
                        setFormName(count === 1 ? firstName.slice(0,20) : firstName.slice(0, 20 - suffix.length) + suffix);
                        setRepoNameAutoFilled(true);
                      }
                    }
                    setGitStep(3);
                  } : undefined} disabled={fsKbSelDocs.size === 0}
                    className={`whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${fsKbSelDocs.size > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                    {fsKbSelDocs.size > 0 ? `下一步（${fsKbSelDocs.size} 篇）` : "下一步"}
                  </button>
                </div>
              </div>
            );
            if (isGit && gitStep === 2) return (
              <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-500">1</span>
                  <span className="text-neutral-300">连接仓库</span>
                  <svg width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">2</span>
                  <span>同步配置</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setGitStep(1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">上一步</button>
                  <button onClick={handleConfirm} className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600">保存配置</button>
                </div>
              </div>
            );
            // 实时录音：主操作是页面内的「开始录音」，底部只保留取消
            if (selectedSrc?.label === "实时录音") return (
              <div className="shrink-0 flex items-center justify-end border-t border-neutral-100 px-6 py-4">
                <button onClick={requestClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
              </div>
            );
            return (
              <div className="shrink-0 flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
                <button onClick={requestClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
                <button onClick={handleConfirm} className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                  {selectedSrc?.label === "文档上传" || selectedSrc?.label === "音频上传" ? "开始导入" : "保存配置"}
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>

    {/* ── 文件选择弹窗 (思源/语雀 上传后选择文档) ── */}
    {showFilePicker && (() => {
      const okFiles = _mockFileList.filter(f => !filePickerSearch || f.name.toLowerCase().includes(filePickerSearch.toLowerCase()));
      const selectableIds = okFiles.filter(f => f.ok).map(f => f.id);
      const allSelected = selectableIds.length > 0 && selectableIds.every(id => selectedFileIds.has(id));
      const toggleAll = () => {
        if (allSelected) setSelectedFileIds(prev => { const next = new Set(prev); selectableIds.forEach(id => next.delete(id)); return next; });
        else setSelectedFileIds(prev => new Set([...prev, ...selectableIds]));
      };
      const toggleOne = (id) => setSelectedFileIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
      const totalOk = _mockFileList.filter(f => f.ok).length;
      return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="flex w-full max-w-lg flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"80vh"}}>
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <span className="text-base font-semibold text-neutral-900">选择导入文档</span>
              <button onClick={() => setShowFilePicker(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
            </div>
            {/* Search */}
            <div className="shrink-0 border-b border-neutral-100 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input autoFocus value={filePickerSearch} onChange={e => setFilePickerSearch(e.target.value)}
                  placeholder="搜索文档名称"
                  className="flex-1 bg-transparent text-sm outline-none placeholder-neutral-400" />
              </div>
            </div>
            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              {/* Column header */}
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-100 bg-white px-5 py-2.5 text-xs font-medium text-neutral-500">
                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                  className="h-4 w-4 cursor-pointer rounded accent-orange-500" />
                <span className="flex-1">文件名</span>
                <span className="w-20 text-right">格式
                  <svg className="ml-0.5 inline" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4 4 4"/><path d="M17 8v12m0 0 4-4m-4 4-4-4"/></svg>
                </span>
                <span className="w-20 text-right">大小</span>
              </div>
              {/* Rows */}
              {okFiles.map(f => (
                <div key={f.id} onClick={() => f.ok && toggleOne(f.id)}
                  className={`flex items-center gap-3 border-b border-neutral-50 px-5 py-3 transition-colors ${f.ok ? "cursor-pointer hover:bg-neutral-50" : "cursor-not-allowed opacity-40"}`}>
                  <input type="checkbox" checked={f.ok && selectedFileIds.has(f.id)} disabled={!f.ok} onChange={() => {}}
                    className="h-4 w-4 cursor-pointer rounded accent-orange-500 shrink-0" />
                  <span className="flex-1 truncate text-sm text-neutral-800" title={f.name}>{f.name}</span>
                  <span className="w-20 text-right text-xs text-neutral-400">{f.fmt}</span>
                  <span className="w-20 text-right text-xs text-neutral-400">{f.size}</span>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="shrink-0 flex items-center justify-between border-t border-neutral-100 px-6 py-4">
              <span className="text-sm text-neutral-400">已选择 <span className="font-medium text-neutral-700">{selectedFileIds.size}</span> 个文档（共 {totalOk} 个）</span>
              <div className="flex gap-2">
                <button onClick={() => setShowFilePicker(false)} className="rounded-xl border border-neutral-200 px-5 py-2 text-sm text-neutral-600 hover:bg-neutral-50">取消</button>
                <button onClick={() => setShowFilePicker(false)} disabled={selectedFileIds.size === 0}
                  className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${selectedFileIds.size > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-neutral-200 cursor-not-allowed"}`}>
                  导入
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })()}

    {showNewFolderModal && (
      <NewFolderModal
        onClose={() => setShowNewFolderModal(false)}
        onCreate={handleFolderCreatedFromModal}
      />
    )}

    {/* ── 关闭前误触确认 ── */}
    {showLeaveConfirm && (
      <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={e => e.target === e.currentTarget && setShowLeaveConfirm(false)}>
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">放弃当前配置？</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">你已填写了部分配置，关闭后内容将不会保存。确认要离开吗？</p>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2.5">
            <button onClick={() => setShowLeaveConfirm(false)}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">继续编辑</button>
            <button onClick={() => { setShowLeaveConfirm(false); onClose(); }}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">放弃并关闭</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}


function mdSlug(text) {
  return "doc-" + text.replace(/[^一-龥\w]/g, "-").slice(0, 28);
}

function renderMarkdownBlocks(content) {
  if (!content) return [];
  const blocks = [];
  let paraLines = [];
  const flush = () => {
    const t = paraLines.join('\n');
    if (t.trim()) blocks.push({ type: 'p', text: t });
    paraLines = [];
  };
  for (const line of content.split('\n')) {
    const h4 = line.match(/^#### (.+)/);
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    if (h4) { flush(); blocks.push({ type: 'h4', text: h4[1], id: mdSlug(h4[1]) }); }
    else if (h3) { flush(); blocks.push({ type: 'h3', text: h3[1], id: mdSlug(h3[1]) }); }
    else if (h2) { flush(); blocks.push({ type: 'h2', text: h2[1], id: mdSlug(h2[1]) }); }
    else { paraLines.push(line); }
  }
  flush();
  return blocks;
}

/* ─── SINGLE DOC PAGE (文档 / 笔记 / 音频) ─── */
function SingleDocPage({ item, onBack, onNavigateToFolder }) {
  const [syncEnabled, setSyncEnabled] = useState(item.status !== "同步失败");
  const [syncFreq, setSyncFreq] = useState("每天");
  const [audioTab, setAudioTab] = useState("内容概要");
  const [audioSubTab, setAudioSubTab] = useState("智能总结");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDocMoreMenu, setShowDocMoreMenu] = useState(false);
  const [docView, setDocView]               = useState("content"); // "content" | "timeline"
  // 事项视图：手动刷新（不自动）
  const [timelineRefreshedAt, setTimelineRefreshedAt] = useState("今天 14:32");
  const [timelineRefreshing, setTimelineRefreshing] = useState(false);
  const handleTimelineRefresh = () => {
    if (timelineRefreshing) return;
    setTimelineRefreshing(true);
    setTimeout(() => {
      setTimelineRefreshing(false);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,"0");
      const mm = String(now.getMinutes()).padStart(2,"0");
      setTimelineRefreshedAt(`今天 ${hh}:${mm}`);
    }, 800);
  };
  // 事项视图：往期事件日历
  const [showTimelineCal, setShowTimelineCal] = useState(false);
  const [tlCalMonth, setTlCalMonth] = useState(5);
  const [tlCalYear, setTlCalYear] = useState(2026);
  const [tlSelectedDay, setTlSelectedDay] = useState(null);
  // 事项视图：搜索 / AI 提问
  const [tlQuery, setTlQuery] = useState("");
  // 事项视图：搜索结果右侧详情面板
  const [tlSearchSelected, setTlSearchSelected] = useState(null);
  const [showDocPermission, setShowDocPermission] = useState(false);
  const [showDocMove, setShowDocMove] = useState(false);
  const [showDocDelete, setShowDocDelete] = useState(false);
  const [docPermission, setDocPermission] = useState("私密");
  const [docPartialSelected, setDocPartialSelected] = useState([]);
  const [showDocOrgPicker, setShowDocOrgPicker] = useState(false);
  const docPermOpts = [
    { key: "私密",       Ico: Icon.Lock,    iconColor: "text-neutral-500",  desc: "仅自己及管理员可见" },
    { key: "部分可见",   Ico: Icon.Users,   iconColor: "text-blue-500",     desc: "指定人员或部门可见" },
    { key: "所有人可见", Ico: Icon.GlobeLg, iconColor: "text-emerald-500",  desc: "企业内所有人可见" },
  ];
  const [docName, setDocName] = useState(item.name);
  const [showDocRename, setShowDocRename] = useState(false);
  // Note editor state
  const [noteTitle, setNoteTitle] = useState(item._isNew ? "" : item.name);
  const [noteContent, setNoteContent] = useState(item.desc || "");
  const [noteView, setNoteView] = useState("edit"); // "edit" | "timeline"
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [noteSaved, setNoteSaved] = useState(!item._isNew);
  const [noteAutoSaving, setNoteAutoSaving] = useState(false);
  const [noteSavedAt, setNoteSavedAt] = useState(() => new Date());
  const [showNotebookPicker, setShowNotebookPicker] = useState(false);
  const [noteFileUploading, setNoteFileUploading] = useState(false);
  const [noteForceEditor, setNoteForceEditor] = useState(false);
  const [noteTimelineDetail, setNoteTimelineDetail] = useState(null);
  const [selectedDocEvent, setSelectedDocEvent] = useState(null);
  // 事项视图：总结事件展开状态（key 为 `${groupIdx}-${itemIdx}`）
  const [tlExpandedSummaries, setTlExpandedSummaries] = useState(new Set());
  const toggleSummary = (key) => setTlExpandedSummaries(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });

  // Block-based note editor state
  const [noteBlocks, setNoteBlocks] = useState([{ id: 'nb0', type: 'para', content: '', align: 'left', indent: 0 }]);
  const [blkHovId, setBlkHovId] = useState(null);
  const [blkInsMenu, setBlkInsMenu] = useState(null); // { afterId, y, x, isSlash, openUp }
  const [blkSlashQ, setBlkSlashQ] = useState('');
  const [blkFloatTb, setBlkFloatTb] = useState(null); // { x, y, blockId }
  const [blkFtTypeOpen, setBlkFtTypeOpen] = useState(false);
  const [blkImgModal, setBlkImgModal] = useState(null);
  const [blkTblModal, setBlkTblModal] = useState(null);
  const [blkTblR, setBlkTblR] = useState(3);
  const [blkTblC, setBlkTblC] = useState(3);
  const [blkLnkModal, setBlkLnkModal] = useState(null);
  const [blkLnkTxt, setBlkLnkTxt] = useState('');
  const [blkLnkUrl, setBlkLnkUrl] = useState('');
  const [blkDragId, setBlkDragId] = useState(null);
  const [blkDropPos, setBlkDropPos] = useState(null); // { blockId, where:'before'|'after' }
  const blkDomRefs = useRef({});
  const blkInited = useRef(new Set());

  // Auto-save debounce — depends on block content + title
  useEffect(() => {
    if (noteSaved) return;
    const t = setTimeout(() => { setNoteAutoSaving(true); setTimeout(() => { setNoteAutoSaving(false); setNoteSaved(true); setNoteSavedAt(new Date()); }, 600); }, 1200);
    return () => clearTimeout(t);
  }, [noteBlocks, noteTitle, noteSaved]);

  // Format "YYYY-MM-DD HH:mm:ss"
  const fmtSavedAt = (d) => {
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  };

  const isNote = item.kind === "笔记" || item.source === "笔记";

  const srcInfo = sourceInfo[item.source] || { label: item.source, Icon: Icon.File };
  const hasAutoSync = autoSyncSources.includes(item.source);
  const isAudio = ["音频上传", "实时录音"].includes(item.source);
  const audio = audioChapters[item.id];
  const firstArticle = (articleEntries[item.id] || [])[0];

  // ── Note full-page editor ──
  if (isNote) return (
    <div className="flex h-screen flex-col overflow-hidden bg-white" onClick={() => setShowMoreMenu(false)}>
      {/* Note header — 面包屑样式（与 SingleDocPage / MultiContentPage 一致） */}
      <header className="flex shrink-0 items-center gap-3 border-b border-neutral-200/60 bg-white px-5 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
          {/* 面包屑：所属信息源 + 来源类型图标 + 当前笔记名（可重命名） */}
          {(() => {
            const parentFolder = item.folderId != null ? folders.find(f => f.id === item.folderId) : null;
            return parentFolder ? (
              <>
                <button onClick={() => onNavigateToFolder ? onNavigateToFolder(parentFolder) : onBack()}
                  className="shrink-0 max-w-[120px] truncate text-neutral-400 transition-colors hover:text-neutral-700">
                  {parentFolder.name}
                </button>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24" className="shrink-0 text-neutral-300"><polyline points="9 18 15 12 9 6"/></svg>
              </>
            ) : null;
          })()}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-500"><Icon.Note /></div>
          <button onClick={() => setShowDocRename(true)}
            title="点击修改笔记名称"
            className="group flex min-w-0 items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-neutral-100">
            <span className="truncate font-semibold text-neutral-900">{noteTitle || "新建笔记"}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-300 opacity-0 transition group-hover:opacity-100"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* 视图切换（segmented control） */}
          <div className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 p-0.5">
            <button onClick={() => setNoteView("edit")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${noteView === "edit" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              编辑笔记
            </button>
            <button onClick={() => setNoteView("timeline")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${noteView === "timeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              事项视图
            </button>
          </div>
          {/* ⋮ 更多菜单 */}
          <div className="relative">
            <button onClick={e => { e.stopPropagation(); setShowMoreMenu(v => !v); }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
              <Icon.More />
            </button>
            {showMoreMenu && (
              <div onClick={e => e.stopPropagation()}
                className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-neutral-100 bg-white py-1 shadow-lg">
                <button onClick={() => { setShowDocMove(true); setShowMoreMenu(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                  <Icon.Move /> 复制至
                </button>
                <div className="mx-3 my-1 border-t border-neutral-100" />
                <button onClick={() => { setShowDocDelete(true); setShowMoreMenu(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                  <Icon.Trash /> 删除
                </button>
              </div>
            )}
            {/* Notebook picker popover */}
            {showNotebookPicker && (
              <div className="fixed inset-0 z-40 flex items-center justify-center p-6"
                style={{background:"rgba(0,0,0,0.2)", backdropFilter:"blur(4px)"}}
                onClick={e => e.target===e.currentTarget && setShowNotebookPicker(false)}>
                <div className="w-80 overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                    <span className="font-medium text-neutral-900">保存到笔记本</span>
                    <button onClick={() => setShowNotebookPicker(false)} className="text-neutral-400 hover:text-neutral-600"><Icon.Close/></button>
                  </div>
                  <div className="py-1">
                    {[{id:null,name:"未归类",desc:"不属于任何笔记本"},{id:1,name:"AI 项目",desc:"AI 产品与技术方案"},{id:2,name:"产品资料库",desc:"PRD 与设计文档"}].map(nb => (
                      <button key={nb.id} onClick={() => setShowNotebookPicker(false)}
                        className={`flex w-full items-start gap-3 px-5 py-3 text-left hover:bg-neutral-50 ${item.folderId === nb.id ? "bg-orange-50" : ""}`}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-neutral-400"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        <div>
                          <div className={`text-sm font-medium ${item.folderId === nb.id ? "text-orange-600" : "text-neutral-800"}`}>{nb.name}</div>
                          <div className="text-xs text-neutral-400">{nb.desc}</div>
                        </div>
                        {item.folderId === nb.id && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="ml-auto mt-1 shrink-0 text-orange-500"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {noteView === "edit" ? (
        <>
          {(() => {
            const blkNewId = () => 'nb' + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
            const BLK_GROUPS = [
              { name:'文本', items:[
                { key:'para', label:'正文',   desc:'普通段落文本', icon:'T'  },
                { key:'h1',   label:'标题 1', desc:'大号章节标题', icon:'H1' },
                { key:'h2',   label:'标题 2', desc:'中号章节标题', icon:'H2' },
                { key:'h3',   label:'标题 3', desc:'小号章节标题', icon:'H3' },
                { key:'h4',   label:'标题 4', desc:'最小章节标题', icon:'H4' },
              ]},
              { name:'列表', items:[
                { key:'todo',    label:'待办列表', desc:'追踪任务进度',     icon:'☐' },
                { key:'bullet',  label:'项目列表', desc:'简单的项目符号列表', icon:'•' },
                { key:'ordered', label:'编号列表', desc:'带数字的有序列表',   icon:'1.'},
              ]},
              { name:'其他', items:[
                { key:'quote',   label:'引用',    desc:'引用一段文字',     icon:'❝' },
                { key:'code',    label:'代码块',  desc:'显示代码片段',     icon:'<>' },
                { key:'img',     label:'图片',    desc:'从本地上传图片',   icon:'⊡' },
                { key:'table',   label:'表格',    desc:'插入表格',         icon:'⊞' },
                { key:'divider', label:'分割线',  desc:'分隔内容区块',     icon:'—' },
              ]},
              { name:'AI 解析', items:[
                { key:'parse', label:'上传文件并解析', desc:'解析 PDF/Word/PPT 后插入到下方', icon:'⇪' },
              ]},
            ];
            const BLK_OPTS = BLK_GROUPS.flatMap(g => g.items);

            const doInsertAfter = (afterId, block) => {
              setNoteBlocks(prev => {
                const idx = prev.findIndex(b => b.id === afterId);
                const next = [...prev]; next.splice(idx + 1, 0, block); return next;
              });
              setBlkInsMenu(null); setBlkSlashQ(''); setNoteSaved(false);
              setTimeout(() => { const el = blkDomRefs.current[block.id]; if (el) el.focus(); }, 30);
            };

            const doReplace = (blockId, patch) => {
              const el = blkDomRefs.current[blockId];
              if (el) { el.innerText = ''; blkInited.current.delete(blockId); }
              setNoteBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content:'', ...patch } : b));
              setBlkInsMenu(null); setBlkSlashQ(''); setNoteSaved(false);
              setTimeout(() => { const el2 = blkDomRefs.current[blockId]; if (el2) el2.focus(); }, 30);
            };

            const mdToBlocks = (md) => {
              const lines = md.split('\n');
              const blocks = []; let i = 0;
              while (i < lines.length) {
                const trimmed = lines[i].trim();
                if (!trimmed) { i++; continue; }
                if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                  const buf = []; while (i < lines.length && lines[i].trim().startsWith('|')) { buf.push(lines[i].trim()); i++; }
                  const rows = buf.filter(l => !/^\|[\s\-:|]+\|$/.test(l))
                                  .map(l => l.slice(1,-1).split('|').map(c => c.trim()));
                  if (rows.length) blocks.push({ id:blkNewId(), type:'table', content:'', _rows:rows, align:'left', indent:0 });
                  continue;
                }
                if (trimmed.startsWith('#### '))     blocks.push({ id:blkNewId(), type:'h4',      content:trimmed.slice(5), align:'left', indent:0 });
                else if (trimmed.startsWith('### ')) blocks.push({ id:blkNewId(), type:'h3',      content:trimmed.slice(4), align:'left', indent:0 });
                else if (trimmed.startsWith('## '))  blocks.push({ id:blkNewId(), type:'h2',      content:trimmed.slice(3), align:'left', indent:0 });
                else if (trimmed.startsWith('# '))   blocks.push({ id:blkNewId(), type:'h1',      content:trimmed.slice(2), align:'left', indent:0 });
                else if (trimmed.startsWith('> '))   blocks.push({ id:blkNewId(), type:'quote',   content:trimmed.slice(2), align:'left', indent:0 });
                else if (trimmed.startsWith('- ['))  blocks.push({ id:blkNewId(), type:'todo',    content:trimmed.replace(/^- \[[ xX]\]\s?/,''), _done:/^- \[[xX]\]/.test(trimmed), align:'left', indent:0 });
                else if (trimmed.startsWith('- '))   blocks.push({ id:blkNewId(), type:'bullet',  content:trimmed.slice(2), align:'left', indent:0 });
                else if (/^\d+\.\s/.test(trimmed))   blocks.push({ id:blkNewId(), type:'ordered', content:trimmed.replace(/^\d+\.\s/,''), align:'left', indent:0 });
                else                                  blocks.push({ id:blkNewId(), type:'para',    content:trimmed, align:'left', indent:0 });
                i++;
              }
              return blocks.length ? blocks : [{ id:blkNewId(), type:'para', content:'', align:'left', indent:0 }];
            };

            const runParseFile = (afterId, clearId) => {
              const inp = document.createElement('input');
              inp.type = 'file'; inp.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.md';
              inp.onchange = ev => {
                const f = ev.target.files[0]; if (!f) return;
                setNoteFileUploading(true);
                setTimeout(() => {
                  const parsed = `## 从「${f.name}」解析\n\n会议时间：2025-05-20 14:00-16:30\n会议地点：会议室 B2 / 飞书视频\n参与人：Simiy（主持）、晓雯、Leo、陈朝\n\n### 议题一：信息管理结构改版\n\n晓雯分享了最新的设计稿，核心变化是将文件夹和信息项改为平级展示。\n\n- 文件夹最多一层，不支持嵌套，降低认知负担\n- 标签系统作为补充，支持跨文件夹的主题聚合\n- 权限在文件夹层面收口，信息源继承文件夹权限\n\n### 议题二：会话类信息源接入优先级\n\nLeo 评估了三个接入方案的技术复杂度。\n\n### 行动项\n\n| 负责人 | 事项 | 截止日 |\n| --- | --- | --- |\n| 晓雯 | 信息管理改版 PRD | 5/24 |\n| Leo | 飞书机器人 POC | 5/27 |\n| 陈朝 | 用户反馈 Top 10 整理 | 5/22 |`;
                  const newBlocks = mdToBlocks(parsed);
                  setNoteBlocks(prev => {
                    if (clearId) {
                      const i = prev.findIndex(b => b.id === clearId);
                      const n = [...prev]; n.splice(i, 1, ...newBlocks); return n;
                    }
                    const i = prev.findIndex(b => b.id === afterId);
                    const n = [...prev]; n.splice(i + 1, 0, ...newBlocks); return n;
                  });
                  if (clearId) blkInited.current.delete(clearId);
                  setNoteFileUploading(false); setNoteSaved(false);
                  const lastId = newBlocks[newBlocks.length - 1]?.id;
                  if (lastId) setTimeout(()=>{const el=blkDomRefs.current[lastId]; if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.focus();}}, 60);
                }, 1800);
              };
              inp.click(); setBlkInsMenu(null);
            };

            const handleChoice = (type, afterId, clearId) => {
              const openModal = (setter, extra) => { if (extra) extra(); setter(clearId ? { afterId, clearId } : { afterId }); setBlkInsMenu(null); };
              if (type === 'parse') { runParseFile(afterId, clearId); return; }
              if (type === 'divider') {
                const dv = { id:blkNewId(), type:'divider', content:'', align:'left', indent:0 };
                const np = { id:blkNewId(), type:'para',    content:'', align:'left', indent:0 };
                setNoteBlocks(prev => {
                  if (clearId) {
                    const i = prev.findIndex(b => b.id === clearId);
                    blkInited.current.delete(clearId);
                    const n = [...prev]; n.splice(i, 1, dv, np); return n;
                  }
                  const i = prev.findIndex(b => b.id === afterId);
                  const n = [...prev]; n.splice(i + 1, 0, dv, np); return n;
                });
                setBlkInsMenu(null); setBlkSlashQ(''); setNoteSaved(false);
                setTimeout(()=>{const el=blkDomRefs.current[np.id]; if (el) el.focus();}, 30);
                return;
              }
              if (type === 'img')   { openModal(setBlkImgModal); return; }
              if (type === 'table') { openModal(setBlkTblModal, () => { setBlkTblR(3); setBlkTblC(3); }); return; }
              if (clearId) doReplace(clearId, { type });
              else doInsertAfter(afterId, { id:blkNewId(), type, content:'', align:'left', indent:0 });
            };

            const handleBlkKeyDown = (e, block) => {
              const el = blkDomRefs.current[block.id];
              const txt = el ? el.innerText : '';
              const inSlash = blkInsMenu?.isSlash && blkInsMenu.clearId === block.id;

              if (inSlash) {
                if (e.key === 'Escape' || (e.key === 'Backspace' && blkSlashQ === '')) {
                  e.preventDefault(); doReplace(block.id, { type:block.type, content:'' }); setBlkInsMenu(null); setBlkSlashQ(''); return;
                }
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const opts = BLK_OPTS.filter(o => !blkSlashQ || o.label.includes(blkSlashQ) || o.key.startsWith(blkSlashQ));
                  if (opts.length) handleChoice(opts[0].key, block.id, block.id); return;
                }
                return;
              }

              if (e.key === '/' && txt.replace(/​/g,'') === '') {
                e.preventDefault();
                if (el) { el.innerText = ''; blkInited.current.delete(block.id); }
                setNoteBlocks(prev => prev.map(b => b.id===block.id ? {...b, content:''} : b));
                const rect = el?.getBoundingClientRect();
                const menuH = 420; const wantUp = (rect?.bottom ?? 0) + menuH > window.innerHeight - 16;
                setBlkInsMenu({ afterId:block.id, isSlash:true, clearId:block.id, y: wantUp ? (rect?.top ?? 200) - 4 : (rect?.bottom ?? 200) + 4, x: rect?.left ?? 200, openUp: wantUp });
                setBlkSlashQ(''); return;
              }

              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const isList = ['bullet','ordered','todo'].includes(block.type);
                // Empty list item → exit to paragraph
                if (isList && txt.replace(/​/g,'') === '') {
                  setNoteBlocks(prev => prev.map(b => b.id === block.id ? { ...b, type:'para', _done:undefined } : b));
                  return;
                }
                // Continue list type; everything else becomes paragraph
                const nextType = isList ? block.type : 'para';
                const nextBlk = { id:blkNewId(), type:nextType, content:'', align:'left', indent:0 };
                if (nextType === 'todo') nextBlk._done = false;
                doInsertAfter(block.id, nextBlk); return;
              }

              if (e.key === 'Backspace' && txt.replace(/​/g,'') === '') {
                e.preventDefault();
                const idx = noteBlocks.findIndex(b => b.id === block.id);
                if (noteBlocks.length === 1) { setNoteBlocks([{ id:blkNewId(), type:'para', content:'', align:'left', indent:0 }]); return; }
                setNoteBlocks(prev => prev.filter(b => b.id !== block.id));
                const prevId = noteBlocks[idx - 1]?.id;
                if (prevId) setTimeout(() => {
                  const pe = blkDomRefs.current[prevId];
                  if (pe) { pe.focus(); const r = document.createRange(); r.selectNodeContents(pe); r.collapse(false); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
                }, 20);
              }
            };

            const handleBlkInput = (block) => {
              const el = blkDomRefs.current[block.id]; if (!el) return;
              const txt = el.innerText;
              if (blkInsMenu?.isSlash && blkInsMenu.clearId === block.id) { setBlkSlashQ(txt); return; }
              setNoteBlocks(prev => prev.map(b => b.id === block.id ? { ...b, content:txt } : b));
              setNoteSaved(false);
            };

            const handleMouseUp = () => {
              const sel = window.getSelection();
              if (!sel || sel.isCollapsed || !sel.toString().trim()) { setBlkFloatTb(null); return; }
              const rect = sel.getRangeAt(0).getBoundingClientRect();
              let node = sel.getRangeAt(0).commonAncestorContainer;
              let blockId = null;
              while (node && node !== document.body) { if (node.dataset?.blkid) { blockId = node.dataset.blkid; break; } node = node.parentElement; }
              setBlkFloatTb({ x: rect.left + rect.width/2, y: rect.top, blockId });
            };

            const blkTypeLabel = t => ({ para:'正文', h1:'标题 1', h2:'标题 2', h3:'标题 3', h4:'标题 4', bullet:'项目列表', ordered:'编号列表', todo:'待办列表', quote:'引用', code:'代码块' }[t] || '正文');
            const TXT_CLS = {
              h1:'text-3xl font-bold text-neutral-900 leading-10',
              h2:'text-2xl font-bold text-neutral-900 leading-9',
              h3:'text-xl font-semibold text-neutral-900 leading-8',
              h4:'text-base font-semibold text-neutral-800 leading-7',
              para:'text-sm leading-7 text-neutral-700',
              bullet:'relative pl-5 text-sm leading-7 text-neutral-700',
              ordered:'relative pl-5 text-sm leading-7 text-neutral-700',
              todo:'pl-1 text-sm leading-7 text-neutral-700',
              quote:'text-sm leading-7 text-neutral-600 italic',
              code:'font-mono text-[13px] leading-6 text-neutral-800 whitespace-pre-wrap',
            };
            const TXT_PH = { h1:'标题 1…', h2:'标题 2…', h3:'标题 3…', h4:'标题 4…', para:'输入 / 唤起命令菜单', bullet:'', ordered:'', todo:'', quote:'引用…', code:'输入代码…' };

            const renderBlock = (block) => {
              const isHov = blkHovId === block.id;
              const isSlashActive = blkInsMenu?.isSlash && blkInsMenu.clearId === block.id;
              const ph = isSlashActive ? '输入命令筛选…' : (TXT_PH[block.type] || '');

              const dndProps = {
                onDragOver: e => {
                  if (!blkDragId || blkDragId === block.id) return;
                  e.preventDefault();
                  const r = e.currentTarget.getBoundingClientRect();
                  const where = e.clientY < r.top + r.height / 2 ? 'before' : 'after';
                  if (blkDropPos?.blockId !== block.id || blkDropPos?.where !== where) setBlkDropPos({ blockId:block.id, where });
                },
                onDrop: e => {
                  if (!blkDragId) return;
                  e.preventDefault();
                  if (blkDragId !== block.id) {
                    setNoteBlocks(prev => {
                      const from = prev.findIndex(b => b.id === blkDragId);
                      let to = prev.findIndex(b => b.id === block.id);
                      if (from < 0 || to < 0) return prev;
                      const n = [...prev]; const [moved] = n.splice(from, 1);
                      if (from < to) to--;
                      if (blkDropPos?.where === 'after') to++;
                      n.splice(to, 0, moved); return n;
                    });
                    setNoteSaved(false);
                  }
                  setBlkDragId(null); setBlkDropPos(null);
                },
              };
              const dropTop = blkDropPos?.blockId === block.id && blkDropPos.where === 'before';
              const dropBot = blkDropPos?.blockId === block.id && blkDropPos.where === 'after';
              const dropInd = (
                <>
                  {dropTop && <div className="pointer-events-none absolute -top-0.5 left-0 right-0 z-10 h-0.5 rounded bg-orange-500"/>}
                  {dropBot && <div className="pointer-events-none absolute -bottom-0.5 left-0 right-0 z-10 h-0.5 rounded bg-orange-500"/>}
                </>
              );
              const isDragging = blkDragId === block.id;

              const isEmptyTextBlk = !block.content && ['para','bullet','ordered','quote','code','todo'].includes(block.type);
              const plusBtn = (
                <div className={`absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity ${isEmptyTextBlk ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button title="点击新增"
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation();
                      const r = e.currentTarget.getBoundingClientRect();
                      const menuH = 420; const wantUp = r.bottom + menuH > window.innerHeight - 16;
                      setBlkInsMenu({ afterId:block.id, clearId:isEmptyTextBlk?block.id:null, isSlash:false, y: wantUp ? r.top - 4 : r.bottom + 4, x:r.left, openUp: wantUp });
                    }} onClick={e=>e.stopPropagation()}
                    className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <button title="拖拽以排序" draggable
                    onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}
                    onDragStart={e=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',block.id);setBlkDragId(block.id);}}
                    onDragEnd={()=>{setBlkDragId(null);setBlkDropPos(null);}}
                    className="flex h-5 w-4 cursor-grab items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors active:cursor-grabbing">
                    <svg width="9" height="13" viewBox="0 0 9 13" fill="currentColor">
                      <circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/>
                      <circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/>
                      <circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/>
                    </svg>
                  </button>
                </div>
              );

              if (block.type === 'img') return (
                <div key={block.id} {...dndProps} className={`group relative mb-2 ${isDragging?'opacity-40':''}`} onMouseEnter={()=>setBlkHovId(block.id)} onMouseLeave={()=>setBlkHovId(null)}>
                  {dropInd}{plusBtn}
                  <div className={`flex ${block.align==='center'?'justify-center':block.align==='right'?'justify-end':'justify-start'}`}>
                    <div className="relative inline-block">
                      {block._src ? <img src={block._src} alt="" className="max-w-full rounded-lg" style={{maxHeight:400}}/> : <div className="flex h-32 w-48 items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-400">图片</div>}
                      <div className={`absolute -top-8 left-0 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-1.5 py-1 shadow-sm transition-opacity ${isHov?'opacity-100':'opacity-0 pointer-events-none'}`}>
                        {['left','center','right'].map(a=>(
                          <button key={a} onClick={()=>setNoteBlocks(prev=>prev.map(b=>b.id===block.id?{...b,align:a}:b))}
                            className={`px-1.5 py-0.5 text-xs rounded ${block.align===a?'bg-orange-50 text-orange-500':'text-neutral-400 hover:text-neutral-600'}`}>{a==='left'?'←':a==='center'?'↔':'→'}</button>
                        ))}
                        <div className="w-px h-3 bg-neutral-200"/>
                        <button onClick={()=>setNoteBlocks(prev=>prev.filter(b=>b.id!==block.id))} className="px-1 text-xs text-red-400 hover:text-red-600">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (block.type === 'table') {
                const rows = block._rows || [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']];
                return (
                  <div key={block.id} {...dndProps} className={`group relative mb-3 ${isDragging?'opacity-40':''}`} onMouseEnter={()=>setBlkHovId(block.id)} onMouseLeave={()=>setBlkHovId(null)}>
                    {dropInd}{plusBtn}
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <tbody>
                          {rows.map((row,ri)=>(
                            <tr key={ri}>{row.map((cell,ci)=>(
                              <td key={ci} contentEditable suppressContentEditableWarning
                                className={`border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 min-w-[80px] outline-none focus:bg-orange-50 ${ri===0?'bg-neutral-50 font-medium':''}`}
                                onBlur={e=>{const nr=rows.map((r,r2)=>r.map((c,c2)=>r2===ri&&c2===ci?e.currentTarget.innerText:c));setNoteBlocks(prev=>prev.map(b=>b.id===block.id?{...b,_rows:nr}:b));setNoteSaved(false);}}>
                                {cell}
                              </td>
                            ))}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {isHov&&<button onClick={()=>setNoteBlocks(prev=>prev.filter(b=>b.id!==block.id))} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-500 hover:bg-red-200">×</button>}
                  </div>
                );
              }

              if (block.type === 'divider') return (
                <div key={block.id} {...dndProps} className={`group relative py-3 ${isDragging?'opacity-40':''}`} onMouseEnter={()=>setBlkHovId(block.id)} onMouseLeave={()=>setBlkHovId(null)}>
                  {dropInd}{plusBtn}
                  <div className="h-px bg-neutral-200"/>
                  {isHov&&<button onClick={()=>setNoteBlocks(prev=>prev.filter(b=>b.id!==block.id))} className="absolute -top-1 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-500 hover:bg-red-200">×</button>}
                </div>
              );

              // Text-family blocks (para / h1-h4 / bullet / ordered / todo / quote / code)
              const isCode  = block.type === 'code';
              const isQuote = block.type === 'quote';
              const isTodo  = block.type === 'todo';
              return (
                <div key={block.id} {...dndProps} className={`group relative ${isCode||isQuote ? 'mb-2' : 'mb-0.5'} ${isDragging?'opacity-40':''}`} onMouseEnter={()=>setBlkHovId(block.id)} onMouseLeave={()=>setBlkHovId(null)}>
                  {dropInd}{plusBtn}
                  {block.type==='bullet'  && <span className="pointer-events-none absolute left-1.5 top-0 select-none text-sm leading-7 text-neutral-400">•</span>}
                  {block.type==='ordered' && <span className="pointer-events-none absolute left-0 top-0 select-none text-xs leading-7 text-neutral-400">{noteBlocks.indexOf(block)+1}.</span>}
                  {isTodo && (
                    <input type="checkbox" checked={!!block._done}
                      onChange={e=>{const v=e.target.checked;setNoteBlocks(prev=>prev.map(b=>b.id===block.id?{...b,_done:v}:b));setNoteSaved(false);}}
                      className="absolute left-0 top-2 h-3.5 w-3.5 cursor-pointer accent-orange-500"/>
                  )}
                  <div className={`relative ${isQuote?'border-l-2 border-neutral-300 pl-3':''} ${isCode?'rounded-lg bg-neutral-50 px-4 py-3':''} ${isTodo?'pl-5':''}`}>
                    {!block.content && ph && (
                      <span className="pointer-events-none absolute select-none text-neutral-300" style={{lineHeight:'inherit',fontSize:'inherit',left:(isQuote?12:isCode?16:isTodo?20:0)+'px',top:(isCode?12:0)+'px'}} aria-hidden>{ph}</span>
                    )}
                    <div
                      ref={el=>{if(el){blkDomRefs.current[block.id]=el;if(!blkInited.current.has(block.id)){el.innerText=block.content||'';blkInited.current.add(block.id);}}}}
                      data-blkid={block.id}
                      contentEditable suppressContentEditableWarning
                      className={`relative w-full outline-none ${TXT_CLS[block.type]||TXT_CLS.para} ${isTodo&&block._done?'text-neutral-400 line-through':''}`}
                      onInput={()=>handleBlkInput(block)}
                      onKeyDown={e=>handleBlkKeyDown(e,block)}
                      onMouseUp={handleMouseUp}
                    />
                  </div>
                </div>
              );
            };

            return (
              <>
                {/* Block scroll area */}
                {(() => {
                  const tocHeadings = noteBlocks.filter(b => b.type === 'h1' || b.type === 'h2' || b.type === 'h3' || b.type === 'h4');
                  return (
                    <div className="flex flex-1 min-h-0 overflow-hidden">
                      <div className="flex-1 overflow-auto px-8 pt-8 pb-32"
                        onClick={()=>{
                          if(blkInsMenu)setBlkInsMenu(null);
                          const sel=window.getSelection();
                          if(blkFloatTb && (!sel || sel.isCollapsed || !sel.toString().trim()))setBlkFloatTb(null);
                        }}>
                        <div className={`mx-auto ${tocHeadings.length ? 'max-w-2xl' : 'max-w-3xl'}`}>
                          <div className="relative mb-2">
                            <input value={noteTitle} onChange={e=>{setNoteTitle(e.target.value);setNoteSaved(false);}}
                              placeholder="笔记标题…" className="w-full border-0 text-2xl font-bold text-neutral-900 placeholder-neutral-300 outline-none"/>
                          </div>
                          <div className="mb-5 flex items-center gap-2 text-xs text-neutral-400">
                            <span>{fmtSavedAt(noteSavedAt)} 修改</span>
                            <span className="text-neutral-300">·</span>
                            {noteAutoSaving
                              ? <span className="flex items-center gap-1">
                                  <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
                                  保存中
                                </span>
                              : noteSaved
                                ? <span className="flex items-center gap-1"><Icon.Check />已自动保存</span>
                                : <span className="text-neutral-300">未保存</span>
                            }
                          </div>
                          <div className="pl-8">
                            {noteBlocks.map(block => renderBlock(block))}
                          </div>
                        </div>
                      </div>
                      {/* TOC — appears when headings exist, Feishu-style */}
                      {tocHeadings.length > 0 && (
                        <div className="w-44 shrink-0 overflow-y-auto border-l border-neutral-100 px-4 py-8">
                          <div className="sticky top-8">
                            <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
                              </svg>
                              目录
                            </div>
                            <nav className="space-y-0.5">
                              {tocHeadings.map(h => (
                                <button key={h.id}
                                  onClick={()=>{
                                    const el = blkDomRefs.current[h.id];
                                    if (el) { el.scrollIntoView({ behavior:'smooth', block:'start' }); el.focus(); }
                                  }}
                                  className={`block w-full truncate rounded px-2 py-1 text-left transition-colors hover:bg-neutral-100 hover:text-orange-500 ${
                                    h.type==='h1' ? 'text-[12px] font-medium text-neutral-700'
                                    : h.type==='h2' ? 'pl-3 text-[12px] text-neutral-500'
                                    : h.type==='h3' ? 'pl-5 text-[11px] text-neutral-400'
                                    : 'pl-7 text-[11px] text-neutral-400'
                                  }`}>
                                  {h.content || '（无标题）'}
                                </button>
                              ))}
                            </nav>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Insert menu (+ button or slash command) — Feishu-style grouped */}
                {blkInsMenu && (() => {
                  const q = blkInsMenu.isSlash ? blkSlashQ.toLowerCase() : '';
                  const matchFn = o => !q || o.label.includes(q) || o.key.startsWith(q);
                  const visGroups = BLK_GROUPS.map(g => ({ ...g, items: g.items.filter(matchFn) })).filter(g => g.items.length);
                  return (
                    <div className="fixed z-50 w-64 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
                      style={{
                        top: blkInsMenu.openUp ? 'auto' : (blkInsMenu.y||200)+'px',
                        bottom: blkInsMenu.openUp ? (window.innerHeight - (blkInsMenu.y||200))+'px' : 'auto',
                        left: (blkInsMenu.x||200)+'px',
                      }}
                      onMouseDown={e=>e.preventDefault()} onClick={e=>e.stopPropagation()}>
                      {blkInsMenu.isSlash && (
                        <div className="border-b border-neutral-100 px-3 py-1.5 text-[11px] text-neutral-400">
                          {blkSlashQ ? `/${blkSlashQ}` : '输入命令筛选…'}
                        </div>
                      )}
                      <div className="max-h-96 overflow-y-auto py-1">
                        {visGroups.length === 0 ? (
                          <div className="px-3 py-3 text-center text-xs text-neutral-400">无匹配选项</div>
                        ) : visGroups.map((g, gi) => (
                          <div key={g.name}>
                            {gi > 0 && <div className="my-1 h-px bg-neutral-100"/>}
                            {g.items.map(opt => (
                              <button key={opt.key}
                                className="flex w-full items-center gap-2.5 px-2 py-1.5 text-left hover:bg-neutral-50 transition-colors"
                                onMouseDown={e=>{e.preventDefault();handleChoice(opt.key,blkInsMenu.afterId,blkInsMenu.clearId||null);}}>
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-[12px] font-medium text-neutral-600">{opt.icon}</span>
                                <span className="flex-1 min-w-0">
                                  <div className="truncate text-sm text-neutral-800">{opt.label}</div>
                                  {opt.desc && <div className="truncate text-[11px] text-neutral-400">{opt.desc}</div>}
                                </span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Parsing indicator */}
                {noteFileUploading && (
                  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 shadow-lg">
                    <svg className="animate-spin text-orange-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                    </svg>
                    <span className="text-sm text-neutral-700">正在解析文件…</span>
                  </div>
                )}

                {/* Floating text toolbar */}
                {blkFloatTb && (
                  <div className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white px-1 py-1 shadow-lg"
                    style={{top:Math.max(8, blkFloatTb.y-48)+'px',left:Math.min(Math.max(120, blkFloatTb.x), window.innerWidth-120)+'px',transform:'translateX(-50%)'}}
                    onMouseDown={e=>e.preventDefault()}>
                    <div className="relative">
                      <button onClick={()=>setBlkFtTypeOpen(p=>!p)}
                        className="flex h-7 items-center gap-1 rounded px-2 text-xs text-neutral-600 hover:bg-neutral-100 transition-colors">
                        {blkTypeLabel(noteBlocks.find(b=>b.id===blkFloatTb?.blockId)?.type||'para')}
                        <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {blkFtTypeOpen && (
                        <div className="absolute left-0 top-8 z-10 w-32 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg max-h-72 overflow-y-auto">
                          {[['para','正文'],['h1','标题 1'],['h2','标题 2'],['h3','标题 3'],['h4','标题 4'],['todo','待办列表'],['bullet','项目列表'],['ordered','编号列表'],['quote','引用'],['code','代码块']].map(([t,l])=>(
                            <button key={t} className="block w-full px-3 py-1 text-left text-xs text-neutral-700 hover:bg-neutral-50"
                              onClick={()=>{setNoteBlocks(prev=>prev.map(b=>b.id===blkFloatTb.blockId?{...b,type:t}:b));setBlkFtTypeOpen(false);setBlkFloatTb(null);}}>
                              {l}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mx-0.5 h-4 w-px bg-neutral-200"/>
                    <button title="加粗" onMouseDown={e=>{e.preventDefault();document.execCommand('bold');}}
                      className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">B</button>
                    <button title="斜体" onMouseDown={e=>{e.preventDefault();document.execCommand('italic');}}
                      className="flex h-7 w-7 items-center justify-center rounded text-xs italic text-neutral-600 hover:bg-neutral-100 transition-colors">I</button>
                    <div className="mx-0.5 h-4 w-px bg-neutral-200"/>
                    <button title="插入链接"
                      onMouseDown={e=>{e.preventDefault();const sel=window.getSelection();setBlkLnkModal({afterId:blkFloatTb.blockId,isInline:true});setBlkLnkTxt(sel?.toString()||'');setBlkLnkUrl('');setBlkFloatTb(null);}}
                      className="flex h-7 w-7 items-center justify-center rounded text-neutral-600 hover:bg-neutral-100 transition-colors">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </button>
                  </div>
                )}

                {/* Image modal */}
                {blkImgModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={()=>setBlkImgModal(null)}>
                    <div className="w-80 rounded-2xl bg-white p-6 shadow-xl" onClick={e=>e.stopPropagation()}>
                      <div className="mb-4 text-base font-semibold text-neutral-900">插入图片</div>
                      <div className="mb-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-8 hover:border-orange-300 transition-colors"
                        onClick={()=>{
                          const inp=document.createElement('input');inp.type='file';inp.accept='.jpg,.jpeg,.png,.gif';
                          inp.onchange=ev=>{
                            const f=ev.target.files[0];if(!f)return;
                            if(f.size>10*1024*1024){alert('图片不能超过 10MB');return;}
                            const reader=new FileReader();
                            reader.onload=re=>{
                              const patch={type:'img',content:f.name,_src:re.target.result,align:'left'};
                              if(blkImgModal.clearId)doReplace(blkImgModal.clearId,patch);
                              else{const nid=blkNewId();setNoteBlocks(prev=>{const i=prev.findIndex(b=>b.id===blkImgModal.afterId);const n=[...prev];n.splice(i+1,0,{id:nid,...patch,indent:0});return n;});setNoteSaved(false);}
                              setBlkImgModal(null);
                            };
                            reader.readAsDataURL(f);
                          };inp.click();
                        }}>
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24" className="text-neutral-300">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className="text-sm text-neutral-400">点击选择图片</span>
                        <span className="text-xs text-neutral-300">JPG / PNG / GIF，最大 10MB</span>
                      </div>
                      <button onClick={()=>setBlkImgModal(null)} className="w-full rounded-xl border border-neutral-200 py-2 text-sm text-neutral-500 hover:bg-neutral-50 transition-colors">取消</button>
                    </div>
                  </div>
                )}

                {/* Table modal */}
                {blkTblModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={()=>setBlkTblModal(null)}>
                    <div className="w-64 rounded-2xl bg-white p-6 shadow-xl" onClick={e=>e.stopPropagation()}>
                      <div className="mb-4 text-base font-semibold text-neutral-900">插入表格</div>
                      <div className="mb-4 space-y-3">
                        {([['行数',blkTblR,setBlkTblR,20],['列数',blkTblC,setBlkTblC,10]]).map(([lbl,val,set,mx])=>(
                          <div key={lbl} className="flex items-center gap-3">
                            <span className="w-10 shrink-0 text-sm text-neutral-600">{lbl}</span>
                            <input type="number" min={1} max={mx} value={val} onChange={e=>set(Math.min(mx,Math.max(1,+e.target.value)))}
                              className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-orange-300"/>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>setBlkTblModal(null)} className="flex-1 rounded-xl border border-neutral-200 py-2 text-sm text-neutral-500 hover:bg-neutral-50">取消</button>
                        <button onClick={()=>{
                          const rows=Array.from({length:blkTblR},()=>Array.from({length:blkTblC},()=>' '));
                          const patch={type:'table',content:'',_rows:rows,align:'left'};
                          if(blkTblModal.clearId)doReplace(blkTblModal.clearId,patch);
                          else{const nid=blkNewId();setNoteBlocks(prev=>{const i=prev.findIndex(b=>b.id===blkTblModal.afterId);const n=[...prev];n.splice(i+1,0,{id:nid,...patch,indent:0});return n;});setNoteSaved(false);}
                          setBlkTblModal(null);
                        }} className="flex-1 rounded-xl bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">插入</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Link modal */}
                {blkLnkModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={()=>setBlkLnkModal(null)}>
                    <div className="w-80 rounded-2xl bg-white p-6 shadow-xl" onClick={e=>e.stopPropagation()}>
                      <div className="mb-4 text-base font-semibold text-neutral-900">插入链接</div>
                      <div className="mb-4 space-y-3">
                        <div>
                          <label className="mb-1 block text-xs text-neutral-500">显示文字</label>
                          <input value={blkLnkTxt} onChange={e=>setBlkLnkTxt(e.target.value)} placeholder="链接文字…"
                            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-orange-300"/>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-neutral-500">URL</label>
                          <input value={blkLnkUrl} onChange={e=>setBlkLnkUrl(e.target.value)} placeholder="https://…"
                            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-orange-300"/>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>setBlkLnkModal(null)} className="flex-1 rounded-xl border border-neutral-200 py-2 text-sm text-neutral-500 hover:bg-neutral-50">取消</button>
                        <button disabled={!blkLnkUrl}
                          onClick={()=>{
                            if(blkLnkModal.isInline){document.execCommand('createLink',false,blkLnkUrl);}
                            else{
                              const patch={type:'link',content:blkLnkTxt||blkLnkUrl,_url:blkLnkUrl,align:'left'};
                              if(blkLnkModal.clearId)doReplace(blkLnkModal.clearId,patch);
                              else{const nid=blkNewId();setNoteBlocks(prev=>{const i=prev.findIndex(b=>b.id===blkLnkModal.afterId);const n=[...prev];n.splice(i+1,0,{id:nid,...patch,indent:0});return n;});setNoteSaved(false);}
                            }
                            setBlkLnkModal(null);
                          }}
                          className="flex-1 rounded-xl bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">插入</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </>
      ) : (
        /* Timeline view — feed style + modal detail (aligned with PublicSourceDetail) */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {(() => {
            if (item._isEmptyRecording) return (
              <div className="flex flex-1 items-center justify-center px-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                  </div>
                  <p className="text-sm font-medium text-neutral-700">录音为空，无可同步事项</p>
                </div>
              </div>
            );
            const groups = timelineEvents[item.id] || [];
            if (!groups.length) return (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-neutral-400">暂无事项记录</p>
              </div>
            );
            return (
              <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-2xl px-6 py-8">
                  {groups.map((group, gi) => (
                    <div key={gi} className="mb-8">
                      {/* Date header */}
                      <div className="mb-4">
                        <span className="text-base font-bold text-orange-500">{group.date}</span>
                      </div>
                      {/* Feed cards */}
                      <div>
                        {group.items.map((ev, idx) => (
                          <div key={idx} onClick={() => setNoteTimelineDetail(ev)}
                            className="flex cursor-pointer gap-5 border-b border-neutral-100 py-4 transition-colors hover:bg-neutral-50 -mx-3 px-3 rounded-xl">
                            <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{ev.time}</span>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 text-[14px] font-semibold leading-snug text-neutral-900">{ev.text}</div>
                              {ev.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{ev.summary}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          {/* Event detail modal (aligned with PublicSourceDetail) */}
          {noteTimelineDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
              onClick={() => setNoteTimelineDetail(null)}>
              <div className="flex w-full max-w-xl flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"86vh"}}
                onClick={e => e.stopPropagation()}>
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
                  <span className="text-base font-semibold text-neutral-900">事件详情</span>
                  <button onClick={() => setNoteTimelineDetail(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  <h2 className="text-[17px] font-bold leading-snug text-neutral-900">{noteTimelineDetail.text}</h2>
                  {noteTimelineDetail.tags && noteTimelineDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {noteTimelineDetail.tags.map((t, i) => (
                        <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
                          <span className="font-medium text-neutral-400">{t.prop}-</span>{t.val}
                        </span>
                      ))}
                    </div>
                  )}
                  {noteTimelineDetail.summary && (
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{noteTimelineDetail.summary}</div>
                  )}
                  {noteTimelineDetail.article && (
                    <>
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                        <span className="text-xs text-neutral-400">原文参考</span>
                        {hasExternalArticleLink(item.source) && (
                          <button className="text-xs text-orange-500 transition hover:underline">查看链接 →</button>
                        )}
                      </div>
                      <div className="text-base font-bold text-neutral-900">{noteTimelineDetail.article.title}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 权限设置 modal (note) */}
      {showDocPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
          onClick={e => e.target === e.currentTarget && setShowDocPermission(false)}>
          <div className="flex w-full max-w-sm flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
            <div className="shrink-0 px-7 pt-6 pb-0">
              <h2 className="text-base font-bold text-neutral-900">权限设置</h2>
              <p className="mt-1 mb-4 text-sm text-neutral-400">设置该笔记的可见范围</p>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pb-2 space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {docPermOpts.map(opt => (
                  <button key={opt.key} onClick={() => setDocPermission(opt.key)}
                    className={`rounded-2xl border-2 p-3.5 text-left transition-all ${docPermission === opt.key ? "border-orange-400 bg-orange-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <div className={`mb-2 ${docPermission === opt.key ? opt.iconColor : "text-neutral-400"}`}><opt.Ico /></div>
                    <div className={`text-xs font-semibold ${docPermission === opt.key ? "text-orange-600" : "text-neutral-800"}`}>{opt.key}</div>
                    <div className="mt-0.5 text-[10px] text-neutral-400 leading-snug">{opt.desc}</div>
                  </button>
                ))}
              </div>
              {docPermission === "部分可见" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5">
                  <label className="mb-2 block text-xs font-medium text-neutral-600">可见人员 / 部门</label>
                  <button onClick={() => setShowDocOrgPicker(true)}
                    className="flex w-full items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-neutral-400 transition hover:border-blue-400 hover:bg-blue-50/50">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-blue-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span>搜索或选择部门 / 人员…</span>
                  </button>
                  {docPartialSelected.length > 0 ? (
                    <OrgChips items={docPartialSelected} onRemove={item => setDocPartialSelected(p => p.filter(t => t.id !== item.id))} />
                  ) : (
                    <p className="mt-2 text-xs text-neutral-400">暂未添加，仅自己及管理员可见</p>
                  )}
                </div>
              )}
            </div>
            <div className="shrink-0 flex gap-2 px-7 py-5">
              <button onClick={() => setShowDocPermission(false)} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
              <button onClick={() => setShowDocPermission(false)} className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">确认修改</button>
            </div>
          </div>
        </div>
      )}
      {/* 复制至 modal (note) */}
      {showDocMove && <MoveToModal item={item} onClose={() => setShowDocMove(false)} folderScopes={{}} />}
      {/* 删除 modal (note) — 二次确认 */}
      {showDocDelete && <DeleteModal item={item} onClose={() => setShowDocDelete(false)} onConfirm={onBack} />}
      {showEditModal && <EditConfigModal item={item} onClose={() => setShowEditModal(false)} />}
      {showDocOrgPicker && <OrgPickerModal initialSelected={docPartialSelected} onClose={() => setShowDocOrgPicker(false)} onConfirm={(items) => { setDocPartialSelected(items); setShowDocOrgPicker(false); }} />}
      {showDocRename && <RenameModal item={{...item, name: docName}} onClose={() => setShowDocRename(false)} />}
    </div>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white" onClick={() => setShowDocMoreMenu(false)}>
      <header className="flex shrink-0 items-center gap-3 border-b border-neutral-200/60 bg-white px-5 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
          {/* 面包屑：所属信息源 + 来源类型图标 + 当前文档名（可重命名） */}
          {(() => {
            const parentFolder = item.folderId != null ? folders.find(f => f.id === item.folderId) : null;
            return parentFolder ? (
              <>
                <button onClick={() => onNavigateToFolder ? onNavigateToFolder(parentFolder) : onBack()}
                  className="shrink-0 max-w-[120px] truncate text-neutral-400 transition-colors hover:text-neutral-700">
                  {parentFolder.name}
                </button>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24" className="shrink-0 text-neutral-300"><polyline points="9 18 15 12 9 6"/></svg>
              </>
            ) : null;
          })()}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500"><srcInfo.Icon /></div>
          <button onClick={() => setShowDocRename(true)}
            title="点击修改信息名称"
            className="group flex min-w-0 items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-neutral-100">
            <span className="truncate font-semibold text-neutral-900">{docName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-300 opacity-0 transition group-hover:opacity-100"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          {item.status === "同步失败" && (
            <span className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#ef4444"/><line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              同步失败
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* 视图切换（segmented control） */}
          <div className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 p-0.5">
            <button onClick={() => setDocView("content")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${docView === "content" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              内容视图
            </button>
            <button onClick={() => setDocView("timeline")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${docView === "timeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              事项视图
            </button>
          </div>
          <div className="relative">
            <button onClick={e => { e.stopPropagation(); setShowDocMoreMenu(v => !v); }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
              <Icon.More />
            </button>
            {showDocMoreMenu && (
              <div onClick={e => e.stopPropagation()}
                className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-neutral-100 bg-white py-1 shadow-lg">
                <button onClick={() => { setShowDocMove(true); setShowDocMoreMenu(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                  <Icon.Move /> 复制至
                </button>
                <div className="mx-3 my-1 border-t border-neutral-100" />
                <button onClick={() => { setShowDocDelete(true); setShowDocMoreMenu(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                  <Icon.Trash /> 删除
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 同步失败提示条 — 轻量单行样式 */}
      {item.status === "同步失败" && (
        <div className="flex shrink-0 items-center gap-2 border-b border-neutral-100 bg-red-50/40 px-5 py-2 text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="min-w-0 flex-1 truncate text-neutral-600">{mockFailureReason(item.source)}</span>
          <div className="flex shrink-0 items-center gap-3">
            <button className="text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-red-500 hover:decoration-red-300">
              重新上传
            </button>
            <button className="flex items-center gap-1 font-medium text-red-500 hover:text-red-600">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
              重试
            </button>
          </div>
        </div>
      )}

      {docView === "timeline" ? (
        /* ── 事项视图：默认居中；搜索且选中事件时切换为左右两栏 ── */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {item._isEmptyRecording ? (
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                </div>
                <p className="text-sm font-medium text-neutral-700">录音为空，无可同步事项</p>
              </div>
            </div>
          ) : (() => {
            const allGroups = timelineEvents[item.id] || [];
            const filtered = filterTimelineGroups(allGroups, tlSelectedDay);
            const isSearching = tlQuery && tlQuery.trim().length > 0;
            const groups = isSearching ? flattenTimelineGroups(filtered, tlQuery) : filtered;
            const showSplit = isSearching && tlSearchSelected;
            return (
              <>
              <div className={`overflow-y-auto ${showSplit ? "w-[420px] shrink-0 border-r border-neutral-100" : "flex-1"}`}>
                <div className={showSplit ? "px-5 py-6" : "mx-auto max-w-2xl px-6 py-8"}>
                  {/* 搜索 / AI 提问 */}
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-orange-200 bg-white px-5 py-3 shadow-sm shadow-orange-50 focus-within:border-orange-400">
                    <input value={tlQuery} onChange={e => { setTlQuery(e.target.value); if (!e.target.value.trim()) setTlSearchSelected(null); }}
                      placeholder="搜索事项或向 AI 提问…"
                      className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none" />
                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                  {isSearching && (() => {
                    const flatCount = groups.reduce((acc, g) => acc + g.items.length, 0);
                    const Ref = ({ n, hi }) => (
                      <span className={`mx-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${hi ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-600"}`}>{n}</span>
                    );
                    return (
                      <div className="mb-5 space-y-3">
                        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                          <p className="text-sm leading-7 text-neutral-700">
                            围绕「{tlQuery}」的相关事项，本笔记累计沉淀了 {flatCount} 条记录<Ref n={1} hi/>。
                            综合各条事项可见，{tlQuery} 在最近一段时间频繁出现<Ref n={2} hi/><Ref n={3} hi={false}/>，
                            AI 已自动归类并提取关键属性标签<Ref n={4} hi/>。点击右侧编号事项可查看完整摘要与原文参考<Ref n={5} hi={false}/>。
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-[11px] text-neutral-400">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-orange-400"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            AI 总结参考以下 {flatCount} 条事项
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-orange-600">查看图谱</button>
                          <div className="flex-1" />
                          <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                            智能排序
                          </button>
                          <span className="text-neutral-200">|</span>
                          <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            多选
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  {!groups.length && tlSelectedDay && (
                    <div className="mb-8">
                      <div className="relative mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-orange-500">{tlSelectedDay.m}/{tlSelectedDay.d}</span>
                          <span className="text-base font-semibold text-neutral-800">事件</span>
                          <button onClick={() => setTlSelectedDay(null)}
                            className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                            title="清除筛选">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          {!tlSelectedDay && (
                            <button onClick={handleTimelineRefresh} disabled={timelineRefreshing}
                              title={`上次刷新：${timelineRefreshedAt}`}
                              className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={timelineRefreshing ? "animate-spin" : ""}><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                              {timelineRefreshing ? "刷新中" : "刷新"}
                            </button>
                          )}
                          <div className="relative">
                            <button onClick={e => { e.stopPropagation(); setShowTimelineCal(v => !v); }}
                              className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              往期事件
                            </button>
                            {showTimelineCal && <TimelineCalendar
                              calYear={tlCalYear} setCalYear={setTlCalYear}
                              calMonth={tlCalMonth} setCalMonth={setTlCalMonth}
                              selectedDay={tlSelectedDay} setSelectedDay={setTlSelectedDay}
                              availableDays={getAvailableTimelineDays(allGroups)}
                              onClose={() => setShowTimelineCal(false)} />}
                          </div>
                        </div>
                      </div>
                      <div className="py-12 text-center text-sm text-neutral-400">该日期暂无事项记录</div>
                    </div>
                  )}
                  {!groups.length && !tlSelectedDay && (
                    <div className="py-16 text-center text-sm text-neutral-400">暂无事项记录</div>
                  )}
                  {groups.map((group, gi) => (
                    <div key={gi} className="mb-8">
                      {!isSearching && (
                      <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between bg-white/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex items-center gap-2">
                          {gi === 0 && tlSelectedDay ? (
                            <>
                              <span className="text-base font-bold text-orange-500">{tlSelectedDay.m}/{tlSelectedDay.d}</span>
                              <span className="text-base font-semibold text-neutral-800">事件</span>
                              <button onClick={() => setTlSelectedDay(null)}
                                className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                title="清除筛选">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </>
                          ) : (
                            <span className="text-base font-bold text-orange-500">{group.date}</span>
                          )}
                        </div>
                        {gi === 0 && (
                          <div className="flex items-center gap-3">
                            {!tlSelectedDay && (
                              <button onClick={handleTimelineRefresh} disabled={timelineRefreshing}
                                title={`上次刷新：${timelineRefreshedAt}`}
                                className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={timelineRefreshing ? "animate-spin" : ""}><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                                {timelineRefreshing ? "刷新中" : "刷新"}
                              </button>
                            )}
                            <div className="relative">
                              <button onClick={e => { e.stopPropagation(); setShowTimelineCal(v => !v); }}
                                className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500">
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                往期事件
                              </button>
                              {showTimelineCal && <TimelineCalendar
                                calYear={tlCalYear} setCalYear={setTlCalYear}
                                calMonth={tlCalMonth} setCalMonth={setTlCalMonth}
                                selectedDay={tlSelectedDay} setSelectedDay={setTlSelectedDay}
                                availableDays={getAvailableTimelineDays(allGroups)}
                                onClose={() => setShowTimelineCal(false)} />}
                            </div>
                          </div>
                        )}
                      </div>
                      )}
                      <div>
                        {group.items.map((ev, idx) => {
                          const key = `${gi}-${idx}`;
                          const isExpanded = tlExpandedSummaries.has(key);
                          if (ev._isSummary && ev._children && !isSearching) {
                            return (
                              <div key={idx} className="border-b border-neutral-100">
                                <div onClick={() => setSelectedDocEvent(ev)}
                                  className="flex cursor-pointer gap-5 py-4 transition-colors hover:bg-neutral-50 -mx-3 px-3 rounded-xl">
                                  <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{ev.time}</span>
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-1 text-[14px] font-semibold leading-snug text-neutral-900">{ev.text}</div>
                                    {ev.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{ev.summary}</div>}
                                    <button onClick={e => { e.stopPropagation(); toggleSummary(key); }}
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600">
                                      <span>{ev._children.length} 个相关子事项</span>
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                                    </button>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="ml-10 border-l-2 border-orange-100 pl-4">
                                    {ev._children.map((child, ci) => (
                                      <div key={ci} onClick={() => setSelectedDocEvent(child)}
                                        className="flex cursor-pointer gap-3 border-b border-neutral-100 py-3 transition-colors hover:bg-neutral-50 -mr-3 pr-3 rounded-r-xl last:border-b-0">
                                        <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{child.time}</span>
                                        <div className="min-w-0 flex-1">
                                          <div className="mb-0.5 text-[13px] font-medium leading-snug text-neutral-800">{child.text}</div>
                                          {child.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{child.summary}</div>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          const isSelected = isSearching && tlSearchSelected === ev;
                          const globalIdx = isSearching
                            ? groups.slice(0, gi).reduce((acc, g) => acc + g.items.length, 0) + idx + 1
                            : null;
                          return (
                            <div key={idx} onClick={() => isSearching ? setTlSearchSelected(ev) : setSelectedDocEvent(ev)}
                              className={`flex cursor-pointer gap-5 border-b border-neutral-100 py-4 transition-colors -mx-3 px-3 rounded-xl ${isSelected ? "bg-orange-50" : "hover:bg-neutral-50"}`}>
                              {isSearching && globalIdx != null ? (
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">{globalIdx}</span>
                              ) : (
                                <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{ev.time}</span>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[14px] font-semibold leading-snug text-neutral-900">{ev.text}</div>
                                {ev.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{ev.summary}</div>}
                                {isSearching && (
                                  <div className="mt-1.5 text-[11px] text-neutral-400">{group.date} {ev.time}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {showSplit && (
                <div className="flex-1 overflow-y-auto bg-white">
                  <div className="shrink-0 border-b border-neutral-100 px-8 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold leading-snug text-neutral-900">{tlSearchSelected.text}</h2>
                      <button onClick={() => setTlSearchSelected(null)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
                        <Icon.Close />
                      </button>
                    </div>
                    {tlSearchSelected.tags && tlSearchSelected.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tlSearchSelected.tags.map((t, i) => (
                          <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
                            <span className="font-medium text-neutral-400">{t.prop}-</span>{t.val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="px-8 py-5 space-y-5">
                    {tlSearchSelected.summary && (
                      <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{tlSearchSelected.summary}</div>
                    )}
                    {(() => {
                      const isSummaryWithArticles = tlSearchSelected._isSummary && tlSearchSelected._children?.some(c => c.article);
                      const childArticles = isSummaryWithArticles ? tlSearchSelected._children.filter(c => c.article) : [];
                      return (
                        <div className="border-t border-neutral-100 pt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-neutral-400">原文参考</span>
                            {tlSearchSelected.article ? (
                              <button onClick={() => { setTlSearchSelected(null); setTlQuery(""); setDocView("content"); }}
                                className="text-xs text-orange-500 transition hover:underline">查看原文 →</button>
                            ) : isSummaryWithArticles ? (
                              <span className="text-xs text-neutral-400">{childArticles.length} 篇</span>
                            ) : null}
                          </div>
                          {tlSearchSelected.article ? (
                            <div className="text-base font-bold text-neutral-900">{tlSearchSelected.article.title}</div>
                          ) : isSummaryWithArticles ? (
                            <div className="space-y-2">
                              {childArticles.map((child, ci) => (
                                <div key={ci} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
                                  <span className="flex-1 line-clamp-1 text-[13px] font-medium text-neutral-800">{child.article.title}</span>
                                  <button onClick={() => { setTlSearchSelected(null); setTlQuery(""); setDocView("content"); }}
                                    className="shrink-0 text-xs text-orange-500 transition hover:underline">→</button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-neutral-400">—</div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
              </>
            );
          })()}
          {selectedDocEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
              onClick={() => setSelectedDocEvent(null)}>
              <div className="flex w-full max-w-xl flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"86vh"}}
                onClick={e => e.stopPropagation()}>
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
                  <span className="text-base font-semibold text-neutral-900">事件详情</span>
                  <button onClick={() => setSelectedDocEvent(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  <h2 className="text-[17px] font-bold leading-snug text-neutral-900">{selectedDocEvent.text}</h2>
                  {selectedDocEvent.tags && selectedDocEvent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDocEvent.tags.map((t, i) => (
                        <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
                          <span className="font-medium text-neutral-400">{t.prop}-</span>{t.val}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedDocEvent.summary && (
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{selectedDocEvent.summary}</div>
                  )}
                  {selectedDocEvent.article && (
                    <>
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                        <span className="text-xs text-neutral-400">原文参考</span>
                        <button onClick={() => { setSelectedDocEvent(null); setDocView("content"); }}
                          className="text-xs text-orange-500 transition hover:underline">
                          查看原文 →
                        </button>
                      </div>
                      <div className="text-base font-bold text-neutral-900">{selectedDocEvent.article.title}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-[#f9f8f6] p-6 lg:p-10">

          {isAudio && audio ? (() => {
            const playerCard = (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500"><Icon.Audio /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="truncate text-base font-semibold text-neutral-900">{docName}</div>
                      <button onClick={() => setShowDocRename(true)} className="shrink-0 text-neutral-300 hover:text-neutral-500 transition-colors"><Icon.Pencil /></button>
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-400">m4a · 录音文件 · {audio.duration}</div>
                  </div>
                </div>
                <div className="relative mb-1.5 h-1.5 w-full cursor-pointer rounded-full bg-neutral-100">
                  <div className={`h-1.5 rounded-full bg-amber-400`} style={{width: audio._empty ? '0%' : '18%'}} />
                  {!audio._empty && <div className="absolute top-1/2 left-[18%] h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-amber-400 bg-white shadow-sm" />}
                </div>
                <div className="mb-5 flex justify-between text-[11px] text-neutral-400"><span>{audio._empty ? '00:00' : '00:15:20'}</span><span>{audio.duration}</span></div>
                <div className="flex items-center justify-center gap-6">
                  <button className="text-sm text-neutral-500 hover:text-neutral-800">◄ 15</button>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"><Icon.Play /></button>
                  <button className="text-sm text-neutral-500 hover:text-neutral-800">15 ►</button>
                  <button className="rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50">1.0x</button>
                </div>
              </div>
            );
            if (audio._empty) return (
              <div className="mx-auto max-w-2xl space-y-4">
                {playerCard}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                    <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="1" y1="1" x2="23" y2="23"/>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-800">未识别到有效语音</h3>
                </div>
              </div>
            );
            return (
            /* ── 音频 + 右侧目录 ── */
            <div className="mx-auto max-w-3xl">
              <div className="flex gap-5">

                {/* ── Left: player + content ── */}
                <div className="flex-1 min-w-0 space-y-4">
                  {playerCard}

                  {/* Content card */}
                  <div className="rounded-2xl border border-neutral-200 bg-white">
                    {/* Card header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                      <span className="text-sm font-semibold text-neutral-900">{audioTab === "内容概要" ? "内容概要" : "文字记录"}</span>
                      <button onClick={() => setAudioTab(t => t === "内容概要" ? "文字记录" : "内容概要")}
                        className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 transition-colors">
                        {audioTab === "内容概要"
                          ? <><span>查看文字记录</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></>
                          : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg><span>返回概要</span></>
                        }
                      </button>
                    </div>

                    {audioTab === "文字记录" ? (
                      /* Transcript */
                      <div className="px-6 py-5 space-y-5">
                        {audio.chapters.map((ch, i) => (
                          <div key={i} className="flex gap-4">
                            <button className="w-14 shrink-0 pt-0.5 text-left font-mono text-xs font-semibold text-orange-600 hover:underline">{ch.time}</button>
                            <p className="text-sm leading-7 text-neutral-700"><span className="font-semibold text-neutral-500">{ch.speaker}：</span>{ch.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* 内容概要 — all sections on one page */
                      <div className="divide-y divide-neutral-50 px-6 py-5 space-y-8">

                        {/* 录音信息 */}
                        <section id="audio-sec-info">
                          <h2 className="mb-3 text-sm font-semibold text-neutral-800">录音信息</h2>
                          <ul className="space-y-2 text-sm text-neutral-600">
                            <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />时长：{audio.duration}</li>
                            <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />参与人数：约 {audio.speakers.length} 人</li>
                            <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />发言人：{audio.speakers.slice(0, 3).join("、")}{audio.speakers.length > 3 ? " 等" : ""}</li>
                            <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />内容类型：部我不知道</li>
                          </ul>
                          <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">智能总结</p>
                            <p className="text-sm leading-7 text-neutral-700">本次会议深入讨论了产品方向、信息接入方式与下一版本路线图。会上系统梳理了文章、会话、音频三类信息源的接入优先级与技术复杂度，确定以飞书机器人为首个会话类接入节点，音频转写能力依托自有模型实现。</p>
                          </div>
                        </section>

                        {/* 章节概要 */}
                        <section id="audio-sec-chapters" className="pt-8">
                          <h2 className="mb-5 text-sm font-semibold text-neutral-800">章节概要</h2>
                          <div className="space-y-6">
                            {audio.chapters.map((ch, i) => (
                              <div key={i} id={`audio-ch-${i}`}>
                                <div className="mb-2 flex items-center gap-2.5">
                                  <button className="shrink-0 font-mono text-xs font-semibold text-orange-500 hover:underline">{ch.time}</button>
                                  <h3 className="text-sm font-semibold text-neutral-900">{ch.title}</h3>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                </div>
                                <p className="pl-[60px] text-sm leading-relaxed text-neutral-500">{ch.excerpt}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* 待办事项 */}
                        {(audioTodos[item.id] || []).length > 0 && (
                          <section id="audio-sec-todos" className="pt-8">
                            <h2 className="mb-3 text-sm font-semibold text-neutral-800">待办事项</h2>
                            <div className="space-y-2">
                              {(audioTodos[item.id] || []).map((todo, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-3.5">
                                  <button className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-orange-300 bg-white" />
                                  <p className="text-sm font-medium leading-snug text-neutral-800">{todo}</p>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right: sticky TOC ── */}
                <div className="w-36 shrink-0">
                  <div className="sticky top-0 rounded-2xl border border-neutral-100 bg-white px-4 py-4">
                    <div className="mb-3 text-neutral-300">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                      </svg>
                    </div>
                    <nav className="space-y-2">
                      <button onClick={() => document.getElementById("audio-sec-info")?.scrollIntoView({behavior:"smooth", block:"start"})}
                        className="block w-full text-left text-[12px] leading-snug text-neutral-500 hover:text-orange-500 transition-colors">录音信息</button>
                      <div>
                        <button onClick={() => document.getElementById("audio-sec-chapters")?.scrollIntoView({behavior:"smooth", block:"start"})}
                          className="block w-full text-left text-[12px] leading-snug text-neutral-500 hover:text-orange-500 transition-colors">章节概要</button>
                        <div className="mt-1.5 space-y-1.5 pl-2.5 border-l border-neutral-100">
                          {audio.chapters.map((ch, i) => (
                            <button key={i} onClick={() => document.getElementById(`audio-ch-${i}`)?.scrollIntoView({behavior:"smooth", block:"start"})}
                              className="block w-full text-left text-[11px] leading-snug text-neutral-400 hover:text-orange-400 transition-colors">
                              {ch.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(audioTodos[item.id] || []).length > 0 && (
                        <button onClick={() => document.getElementById("audio-sec-todos")?.scrollIntoView({behavior:"smooth", block:"start"})}
                          className="block w-full text-left text-[12px] leading-snug text-neutral-500 hover:text-orange-500 transition-colors">待办事项</button>
                      )}
                    </nav>
                  </div>
                </div>

              </div>
            </div>
            );
          })() : (
            /* ── 文档 / 笔记全宽 ── */
            (() => {
              const docBlocks = firstArticle?.content ? renderMarkdownBlocks(firstArticle.content) : [];
              const docToc = docBlocks.filter(b => b.type === 'h2' || b.type === 'h3');
              const scrollToDocSection = (id) => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              };
              return (
                <div className="mx-auto flex max-w-3xl gap-8">
                  {/* Left: doc card */}
                  <div className="flex-1 min-w-0">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-7">
                      {firstArticle ? (
                        <>
                          <div className="mb-2 flex items-start justify-between gap-4">
                            <h1 className="flex-1 text-xl font-bold leading-snug text-neutral-900">{firstArticle.title}</h1>
                          </div>
                          <div className="mb-6 flex items-center gap-2 text-xs text-neutral-400">
                            <span className="flex items-center gap-1"><Icon.Clock />{firstArticle.date}</span>
                          </div>
                          <div className="mb-6 flex h-56 items-center justify-center rounded-xl bg-neutral-100 text-neutral-300">
                            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                          {firstArticle.content ? (
                            <div className="text-sm leading-8 text-neutral-700">
                              {docBlocks.map((block, i) => {
                                if (block.type === 'h2') return <h2 key={i} id={block.id} className="mt-7 mb-2 text-base font-bold text-neutral-900 scroll-mt-6">{block.text}</h2>;
                                if (block.type === 'h3') return <h3 key={i} id={block.id} className="mt-5 mb-1.5 text-sm font-semibold text-neutral-800 scroll-mt-6">{block.text}</h3>;
                                if (block.type === 'h4') return <h4 key={i} id={block.id} className="mt-4 text-sm font-medium text-neutral-700 scroll-mt-6">{block.text}</h4>;
                                return <p key={i} className="whitespace-pre-wrap">{block.text}</p>;
                              })}
                            </div>
                          ) : (
                            <p className="text-sm leading-7 text-neutral-700">{firstArticle.summary}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <h1 className="mb-3 text-xl font-bold text-neutral-900">{item.name}</h1>
                          <p className="text-sm leading-7 text-neutral-500">{item.desc}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Right: TOC (only when headings found) */}
                  {docToc.length > 0 && (
                    <div className="w-36 shrink-0">
                      <div className="sticky top-8 rounded-2xl border border-neutral-100 bg-white px-4 py-4">
                        <div className="mb-3 text-neutral-300">
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                          </svg>
                        </div>
                        <nav className="space-y-1.5">
                          {docToc.map((block, i) => (
                            <button key={i} onClick={() => scrollToDocSection(block.id)}
                              className={`block w-full text-left leading-snug transition-colors hover:text-orange-500 ${
                                block.type === 'h3' ? "pl-2.5 text-[11px] text-neutral-400 hover:text-orange-400" : "text-[12px] text-neutral-500"
                              }`}>
                              <span>{block.text}</span>
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>

      </div>
      )} {/* end docView ternary */}
      {showEditModal && <EditConfigModal item={item} onClose={() => setShowEditModal(false)} />}

      {/* 权限设置 modal */}
      {showDocPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
          onClick={e => e.target === e.currentTarget && setShowDocPermission(false)}>
          <div className="flex w-full max-w-sm flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"85vh"}}>
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-7 pt-6 pb-4">
              <h2 className="text-base font-bold text-neutral-900">权限设置</h2>
              <button onClick={() => setShowDocPermission(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-4 space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {docPermOpts.map(opt => (
                  <button key={opt.key} onClick={() => setDocPermission(opt.key)}
                    className={`rounded-2xl border-2 p-3.5 text-left transition-all ${docPermission === opt.key ? "border-orange-400 bg-orange-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <div className={`mb-2 ${docPermission === opt.key ? opt.iconColor : "text-neutral-400"}`}><opt.Ico /></div>
                    <div className="text-sm font-semibold text-neutral-900">{opt.key}</div>
                    <div className="mt-0.5 text-[11px] text-neutral-400 leading-snug">{opt.desc}</div>
                  </button>
                ))}
              </div>
              {docPermission === "部分可见" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5">
                  <label className="mb-2 block text-xs font-medium text-neutral-600">可见人员 / 部门</label>
                  <button onClick={() => setShowDocOrgPicker(true)}
                    className="flex w-full items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-neutral-400 transition hover:border-blue-400 hover:bg-blue-50/50">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-blue-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span>搜索或选择部门 / 人员…</span>
                  </button>
                  {docPartialSelected.length > 0 ? (
                    <OrgChips items={docPartialSelected} onRemove={item => setDocPartialSelected(p => p.filter(t => t.id !== item.id))} />
                  ) : (
                    <p className="mt-2 text-xs text-neutral-400">暂未添加，仅自己及管理员可见</p>
                  )}
                </div>
              )}
            </div>
            <div className="shrink-0 flex gap-2.5 border-t border-neutral-100 px-7 py-4">
              <button onClick={() => setShowDocPermission(false)} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
              <button onClick={() => setShowDocPermission(false)} className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">确认修改</button>
            </div>
          </div>
        </div>
      )}

      {/* 复制至 modal */}
      {showDocMove && <MoveToModal item={item} onClose={() => setShowDocMove(false)} folderScopes={{}} />}

      {/* 删除确认 modal */}
      {showDocDelete && <DeleteModal item={item} onClose={() => setShowDocDelete(false)} onConfirm={onBack} />}

      {/* 部分可见：人员/部门选择器 */}
      {showDocOrgPicker && <OrgPickerModal initialSelected={docPartialSelected} onClose={() => setShowDocOrgPicker(false)} onConfirm={(items) => { setDocPartialSelected(items); setShowDocOrgPicker(false); }} />}
      {showDocRename && <RenameModal item={{...item, name: docName}} onClose={() => setShowDocRename(false)} />}
    </div>
  );
}

/* ─── ITEM DETAIL PAGE ─── */
function ItemDetailPage({ item, onBack, onNavigateToFolder }) {
  // 思源笔记 / 语雀知识库 导入后每篇文档即一条「文档」信息，详情页同文档上传走单文档视图
  const singleDocSources = ["文档上传", "笔记", "音频上传", "实时录音", "思源笔记", "语雀知识库"];
  const isSingleDoc = singleDocSources.includes(item.source) || item.kind === "笔记" || item.kind === "文档";
  return isSingleDoc
    ? <SingleDocPage item={item} onBack={onBack} onNavigateToFolder={onNavigateToFolder} />
    : <MultiContentPage item={item} onBack={onBack} onNavigateToFolder={onNavigateToFolder} />;
}

/* ─── EDIT CONFIG MODAL ─── */
function EditConfigModal({ item, onClose }) {
  const label = item.source;
  const srcInfo = sourceInfo[label] || { label, Icon: Icon.File };
  const SrcIcon = srcInfo.Icon;
  const [editName, setEditName] = useState(item.name || "");

  const [formUrls, setFormUrls] = useState(item._formUrls || "");
  const [crawlScope, setCrawlScope] = useState("仅当前页面");
  const [searchKeyword, setSearchKeyword] = useState(item._keyword || "");
  const [apiUrl, setApiUrl] = useState(item._apiUrl || "");
  const [apiConfig, setApiConfig] = useState("");
  const [corpId, setCorpId] = useState("");
  const [secret, setSecret] = useState("");
  const [pemFile, setPemFile] = useState(null);
  const [fsAppId, setFsAppId] = useState("");
  const [fsAppSecret, setFsAppSecret] = useState("");
  const [fsKbAppId, setFsKbAppId] = useState("");
  const [fsKbAppSecret, setFsKbAppSecret] = useState("");
  const [fsKbToken, setFsKbToken] = useState("");
  const [robotName, setRobotName] = useState(item.name || "");
  const [saleProjectId, setSaleProjectId] = useState("");
  const [gitlabUrl, setGitlabUrl] = useState("https://gitlab.com");
  const [gitlabAppId, setGitlabAppId] = useState("");
  const [gitlabSecret, setGitlabSecret] = useState("");
  const [oauthDone, setOauthDone] = useState(true);
  const [formDesc, setFormDesc] = useState(item.desc || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formEnabled, setFormEnabled] = useState(true);
  const [formFreqNum, setFormFreqNum] = useState(3);
  const [formFreqUnit, setFormFreqUnit] = useState("小时");
  const [formFirstSyncTime, setFormFirstSyncTime] = useState("");
  const [formFreqPreset, setFormFreqPreset] = useState("每天");
  const [formSyncTime, setFormSyncTime] = useState("09:00");
  const [formSyncDays, setFormSyncDays] = useState([0, 2, 4]);
  const [formSyncMonthDays, setFormSyncMonthDays] = useState(["1"]);
  const [siyuanFile, setSiyuanFile] = useState(null);
  const [yuqueFile, setYuqueFile] = useState(null);
  // 飞书知识库：重新拉取文档列表 + 文档选择
  const [fsKbFetching, setFsKbFetching] = useState(false);
  const [fsKbDocCount, setFsKbDocCount] = useState(3); // 模拟已有配置：已拉取过
  const [fsKbSelDocs, setFsKbSelDocs] = useState(new Set(["d1","d2","d3"])); // 模拟已选文档
  const [fsKbDocSearch, setFsKbDocSearch] = useState("");
  const [fsKbPickerOpen, setFsKbPickerOpen] = useState(false); // 是否展开完整选择器
  const [fsKbPickerLoading, setFsKbPickerLoading] = useState(false); // 调整选择时的校验中状态
  const [fsKbPickerError, setFsKbPickerError] = useState(null); // Token 过期等错误
  const [fsKbCredsDirty, setFsKbCredsDirty] = useState(false); // 凭据是否被修改过
  const toggleEditFsKbDoc = id => { setFsKbSelDocs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); setIsDirty(true); };
  const markCredsDirty = () => { setFsKbCredsDirty(true); setIsDirty(true); };
  // 代码平台重新授权状态
  const [reAuthState, setReAuthState] = useState("idle"); // "idle" | "loading" | "done" | "failed"
  const startReAuth = () => {
    setReAuthState("loading");
    setIsDirty(true);
    setTimeout(() => setReAuthState("done"), 2200);
  };
  // 离开确认
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const requestClose = () => { if (isDirty) setShowLeaveConfirm(true); else onClose(); };
  // 左侧导航激活分区
  const [activeSection, setActiveSection] = useState("info");
  // 有同步计划的连接器类型
  const hasSyncConfig = ["RSS 订阅","网页爬虫","搜索引擎","API 接入","企微机器人","飞书机器人","SaleSmartly","飞书知识库","GitHub","GitLab","Gitee"].includes(label);

  // 更多配置折叠区（所有类型通用）
  const AdvancedSection = () => (
    <div className="border-t border-neutral-100 pt-1">
      <button type="button" onClick={() => setShowAdvanced(v => !v)}
        className="flex w-full items-center justify-between py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-600">
        <span className="font-medium">更多配置</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"
          className={`shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {showAdvanced && (
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">信息要点</label>
            <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
          </div>
          <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} maxLength={1000}
            placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
            className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          <p className="text-xs text-neutral-400">作为 AI 提取信息的提示词，帮助更精准地识别有效内容</p>
        </div>
      )}
    </div>
  );

  const _freqTabs = ["每天", "每周", "每月"];
  const _timeOpts = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
  const _weekDayLabels = ["一","二","三","四","五","六","日"];
  const _nextSyncText = () => {
    if (formFreqPreset === "每天") return `明天 ${formSyncTime}`;
    if (formFreqPreset === "每周") {
      const names = formSyncDays.sort((a,b)=>a-b).map(d => "周" + _weekDayLabels[d]).join("、");
      return `每周${names} ${formSyncTime}`;
    }
    if (formFreqPreset === "每月") { const ds = [...formSyncMonthDays].sort((a,b)=>a-b).join("、"); return `每月 ${ds} 日 ${formSyncTime}`; }
    return "";
  };
  const SyncConfig = () => {
    return (
      <div className="space-y-3.5 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        {/* Header：同步计划标题 + 开关 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-neutral-700">同步计划</div>
            <div className={`mt-0.5 text-xs ${formEnabled ? "text-neutral-400" : "text-amber-500"}`}>
              {formEnabled ? (_nextSyncText() ? `下次同步：${_nextSyncText()}` : "") : "已暂停，不会自动执行"}
            </div>
          </div>
          <button onClick={() => setFormEnabled(v => !v)}
            className={"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors " + (formEnabled ? "bg-orange-500" : "bg-neutral-200")}>
            <span className={"inline-block h-5 w-5 rounded-full bg-white shadow transition-transform " + (formEnabled ? "translate-x-5" : "translate-x-0")} />
          </button>
        </div>
        {/* 频率 tabs */}
        <div className={`flex gap-1 rounded-xl bg-neutral-200/60 p-1 transition-opacity ${!formEnabled ? "opacity-40 pointer-events-none" : ""}`}>
          {_freqTabs.map(opt => (
            <button key={opt} onClick={() => setFormFreqPreset(opt)}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${formFreqPreset === opt ? "bg-white text-orange-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              {opt}
            </button>
          ))}
        </div>
        {/* 定时选项 */}
        <div className={`space-y-3.5 transition-opacity ${!formEnabled ? "opacity-40 pointer-events-none" : ""}`}>
          {/* 执行时间 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">执行时间</span>
            <select value={formSyncTime} onChange={e => setFormSyncTime(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
              {_timeOpts.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {/* 每周：重复日期 */}
          {formFreqPreset === "每周" && (
            <div>
              <div className="mb-2 text-sm text-neutral-700">重复日期</div>
              <div className="flex gap-1.5">
                {_weekDayLabels.map((d, i) => (
                  <button key={i} onClick={() => setFormSyncDays(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${formSyncDays.includes(i) ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-500"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* 每月：多选日期 */}
          {formFreqPreset === "每月" && (
            <div>
              <div className="mb-2 text-sm text-neutral-700">重复日期
                <span className="ml-1.5 text-xs font-normal text-neutral-400">可多选</span>
              </div>
              <div className="space-y-1.5">
                {/* 相对日期（兼容各月天数差异） */}
                <div className="flex gap-1.5">
                  {[{ v: "last-2", l: "倒数第三天" }, { v: "last-1", l: "倒数第二天" }, { v: "last-0", l: "最后一天" }].map(({ v, l }) => (
                    <button key={v}
                      onClick={() => setFormSyncMonthDays(prev => prev.includes(v) ? (prev.length > 1 ? prev.filter(x => x !== v) : prev) : [...prev, v])}
                      className={`flex flex-1 h-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${formSyncMonthDays.includes(v) ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-500"}`}>
                      {l}
                    </button>
                  ))}
                </div>
                {/* 固定日期 1-28 */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({length: 28}, (_, i) => String(i + 1)).map(d => (
                    <button key={d}
                      onClick={() => setFormSyncMonthDays(prev => prev.includes(d) ? (prev.length > 1 ? prev.filter(x => x !== d) : prev) : [...prev, d])}
                      className={`flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition-all ${formSyncMonthDays.includes(d) ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-500"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const inputCls = "w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100";
  const labelCls = "mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-700";

  const renderFields = () => {
    if (label === "RSS 订阅") return (<>
      <div>
        <label className={labelCls}>RSS 链接 <span className="text-red-400">*</span></label>
        <input value={formUrls} onChange={e => {
          const url = e.target.value;
          setFormUrls(url);
          try {
            const host = new URL(url).hostname.replace(/^www\./, '');
            setEditName(prev => (prev === "" || prev === item.name) ? host : prev);
          } catch {}
        }} placeholder="https://example.com/feed.xml" className={`${inputCls} font-mono`} />
      </div>
    </>);

    if (label === "网页爬虫") return (<>
      <div>
        <label className={labelCls}>起始链接 <span className="text-red-400">*</span></label>
        <input value={formUrls} onChange={e => {
          const url = e.target.value;
          setFormUrls(url);
          try {
            const host = new URL(url).hostname.replace(/^www\./, '');
            setEditName(prev => (prev === "" || prev === item.name) ? host : prev);
          } catch {}
        }} placeholder="https://example.com/article" className={`${inputCls} font-mono`} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">爬取范围</label>
        <div className="space-y-2">
          {[["仅当前页面","适用于文章、详情页"],["当前列表页中的内容","采集本页多条内容"],["当前站点下的更多内容","采集站点/栏目更多内容"]].map(([val,hint]) => (
            <label key={val} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-neutral-200 px-4 py-3 hover:border-orange-200 hover:bg-orange-50/40">
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${crawlScope===val?"border-orange-500":"border-neutral-300"}`}>
                {crawlScope===val && <span className="h-2 w-2 rounded-full bg-orange-500"/>}
              </span>
              <input type="radio" className="sr-only" checked={crawlScope===val} onChange={()=>setCrawlScope(val)} />
              <div><div className="text-sm font-medium text-neutral-800">{val}</div><div className="text-xs text-neutral-400">{hint}</div></div>
            </label>
          ))}
        </div>
      </div>
    </>);

    if (label === "搜索引擎") return (<>
      <div>
        <label className={labelCls}>定向搜索关键词 <span className="text-red-400">*</span></label>
        <input value={searchKeyword} onChange={e => {
          const kw = e.target.value;
          setSearchKeyword(kw);
          const first = kw.trim().split(/\s+/)[0];
          if (first) setEditName(prev => (prev === "" || prev === item.name || prev.endsWith(" 资讯")) ? first + " 资讯" : prev);
        }} placeholder="例如：AI 信息管理 产品动态" className={inputCls} />
        <p className="mt-1 text-xs text-neutral-400">多个关键词用空格分隔</p>
      </div>
    </>);

    if (label === "API 接入") return (
      <ApiConfigEditor url={apiUrl} onUrlChange={setApiUrl} />
    );

    if (label === "企微机器人") return (<>
      <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-500">
        <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        需要在企业微信后台完成应用配置，<button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
      </div>
      <div>
        <label className={labelCls}>企业 ID <span className="text-red-400">*</span></label>
        <input value={corpId} onChange={e => setCorpId(e.target.value)} placeholder="请输入企业 ID" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Secret <span className="text-red-400">*</span></label>
        <input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="输入 Secret" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">密钥文件 <span className="text-xs font-normal text-neutral-400">（.pem）</span></label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 px-4 py-3 hover:border-orange-300 hover:bg-orange-50/40">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 3v9M5 7l4-4 4 4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h12" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <span className="text-sm text-neutral-500">{pemFile ? pemFile.name : "点击上传或拖拽 .pem 文件"}</span>
          <input type="file" accept=".pem" className="hidden" onChange={e => setPemFile(e.target.files[0])} />
        </label>
      </div>
    </>);

    if (label === "飞书机器人") return (<>
      <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-500">
        <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        需要在飞书开放平台创建自建应用并授权，<button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
      </div>
      <div>
        <label className={labelCls}>App ID <span className="text-red-400">*</span></label>
        <input value={fsAppId} onChange={e => setFsAppId(e.target.value)} placeholder="cli_xxx" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>密钥 <span className="text-red-400">*</span></label>
        <input type="password" value={fsAppSecret} onChange={e => setFsAppSecret(e.target.value)} placeholder="输入密钥" className={inputCls} />
      </div>
    </>);

    if (label === "SaleSmartly") return (<>
      <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-[13px] text-neutral-500">
        <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        在 SaleSmartly 后台获取凭据，<button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
      </div>
      <div>
        <label className={labelCls}>项目 ID <span className="text-red-400">*</span></label>
        <input value={saleProjectId} onChange={e => setSaleProjectId(e.target.value)} placeholder="输入项目 ID" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>密钥 <span className="text-red-400">*</span></label>
        <input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="输入密钥" className={inputCls} />
      </div>
    </>);

    if (label === "飞书知识库") return (<>
      <div className="flex items-center gap-1.5 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-500">
        <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        在飞书开放平台创建应用并获取凭据，<button className="shrink-0 font-normal text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-500 hover:decoration-orange-300">查看操作指南 →</button>
      </div>
      <div>
        <label className={labelCls}>APP ID <span className="text-red-400">*</span></label>
        <input value={fsKbAppId} onChange={e => { setFsKbAppId(e.target.value); markCredsDirty(); }} placeholder="cli_xxx" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>App Secret <span className="text-red-400">*</span></label>
        <input type="password" value={fsKbAppSecret} onChange={e => { setFsKbAppSecret(e.target.value); markCredsDirty(); }} placeholder="输入 App Secret" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>User Access Token <span className="text-red-400">*</span></label>
        <input value={fsKbToken} onChange={e => { setFsKbToken(e.target.value); markCredsDirty(); }} placeholder="输入 User Access Token" className={inputCls} />
      </div>
      {/* 文档清单区域 */}
      {fsKbDocCount != null && !fsKbFetching && (() => {
        const selDocs = _mockFsKbDocs.filter(d => fsKbSelDocs.has(d.id));
        const typeLabel = t => t === "电子表格" ? "XLS" : t === "多维表格" ? "TBL" : t === "思维笔记" ? "MND" : "DOC";
        const typeBg = t => t === "电子表格" ? "bg-green-50 text-green-600" : t === "多维表格" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-500";
        // 完整选择器
        if (fsKbPickerOpen) {
          const filtered = _mockFsKbDocs.filter(d => !fsKbDocSearch || d.name.toLowerCase().includes(fsKbDocSearch.toLowerCase()));
          const okDocs = filtered.filter(d => d.ok);
          const allSel = okDocs.length > 0 && okDocs.every(d => fsKbSelDocs.has(d.id));
          const toggleAll = () => {
            if (allSel) setFsKbSelDocs(prev => { const n = new Set(prev); okDocs.forEach(d => n.delete(d.id)); return n; });
            else setFsKbSelDocs(prev => new Set([...prev, ...okDocs.map(d => d.id)]));
          };
          return (
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                <span className="text-xs font-medium text-neutral-600">选择要同步的文档</span>
                <button onClick={() => { setFsKbPickerOpen(false); setFsKbDocSearch(""); }}
                  className="text-xs font-medium text-orange-500 hover:underline">完成</button>
              </div>
              <div className="border-b border-neutral-100 px-3 py-2">
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value={fsKbDocSearch} onChange={e => setFsKbDocSearch(e.target.value)}
                    placeholder="搜索文档名称" className="flex-1 bg-transparent text-xs outline-none placeholder-neutral-400" />
                </div>
              </div>
              <div className="flex items-center gap-3 border-b border-neutral-100 bg-white px-4 py-2 text-[11px] font-medium text-neutral-400">
                <input type="checkbox" checked={allSel} onChange={toggleAll} className="h-3.5 w-3.5 cursor-pointer rounded accent-orange-500" />
                <span className="flex-1">文件名</span>
                <span className="w-14 text-right">类型</span>
              </div>
              <div className="max-h-44 overflow-y-auto">
                {filtered.map(d => (
                  <div key={d.id} onClick={() => d.ok && toggleEditFsKbDoc(d.id)}
                    className={`flex items-center gap-3 border-b border-neutral-50 px-4 py-2.5 transition-colors ${d.ok ? "cursor-pointer hover:bg-neutral-50" : "cursor-not-allowed opacity-40"}`}>
                    <input type="checkbox" checked={d.ok && fsKbSelDocs.has(d.id)} disabled={!d.ok} onChange={() => {}}
                      className="h-3.5 w-3.5 cursor-pointer rounded accent-orange-500 shrink-0" />
                    <span className="flex-1 truncate text-xs text-neutral-800" title={d.name}>{d.name}</span>
                    <span className="w-14 text-right text-[11px] text-neutral-400">{d.type}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2 text-xs text-neutral-400">
                已选 <span className="font-medium text-neutral-700">{fsKbSelDocs.size}</span> 篇 · 共 {_mockFsKbDocs.filter(d=>d.ok).length} 篇
              </div>
            </div>
          );
        }
        // 摘要视图（默认）
        return (
          <div className="space-y-2">
            {/* 凭据变更警告条 */}
            {fsKbCredsDirty && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-700">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="flex-1">凭据已修改，当前文档列表可能已失效</span>
                <button onClick={() => {
                  setFsKbFetching(true);
                  setFsKbPickerOpen(false);
                  setTimeout(() => {
                    setFsKbFetching(false);
                    setFsKbDocCount(12);
                    setFsKbSelDocs(prev => new Set([...prev].filter(id => _mockFsKbDocs.some(d => d.id === id && d.ok))));
                    setFsKbCredsDirty(false);
                    setFsKbPickerOpen(true);
                  }, 1200);
                }} disabled={fsKbFetching} className="shrink-0 font-semibold underline hover:no-underline">
                  {fsKbFetching ? <span className="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="spin"><circle cx="12" cy="12" r="10" stroke="#92400e" strokeWidth="2.5" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/></svg>获取中…</span> : "重新获取"}
                </button>
              </div>
            )}
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
              <span className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-50 text-[9px] font-bold text-blue-500">FS</span>
                飞书知识库 <span className="font-normal text-neutral-400">· 已选 {selDocs.length} 篇</span>
              </span>
              {!fsKbCredsDirty && (
                <button onClick={() => {
                  setFsKbPickerError(null);
                  setFsKbPickerLoading(true);
                  // 模拟 Token 校验：item 状态为同步失败时模拟 Token 过期
                  setTimeout(() => {
                    setFsKbPickerLoading(false);
                    if (item.status === "同步失败") {
                      setFsKbPickerError("User Access Token 已过期，请先在「信息配置」中更新 Token 后再调整文档选择");
                    } else {
                      setFsKbPickerOpen(true);
                    }
                  }, 800);
                }}
                disabled={fsKbPickerLoading}
                className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:underline disabled:opacity-50">
                  {fsKbPickerLoading && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2.5" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round"/></svg>}
                  {fsKbPickerLoading ? "校验中…" : "调整选择"}
                </button>
              )}
            </div>
            <div className="max-h-40 divide-y divide-neutral-50 overflow-y-auto">
              {selDocs.map(d => (
                <div key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${typeBg(d.type)}`}>{typeLabel(d.type)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-neutral-800">{d.name}</div>
                    <div className="text-[11px] text-neutral-400">{d.type} · {d.size}</div>
                  </div>
                  <button onClick={() => toggleEditFsKbDoc(d.id)} className="shrink-0 text-neutral-300 hover:text-neutral-500"><Icon.Close /></button>
                </div>
              ))}
              {selDocs.length === 0 && <div className="px-4 py-4 text-center text-xs text-neutral-400">暂未选择文档</div>}
            </div>
          </div>
          {fsKbPickerError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{fsKbPickerError}</span>
            </div>
          )}
          </div>
        );
      })()}
    </>);

    if (label === "思源笔记") return (
      <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed py-8 transition-colors ${siyuanFile ? "border-violet-300 bg-violet-50/40" : "border-neutral-200 bg-neutral-50 hover:border-orange-300 hover:bg-orange-50/30"}`}>
        {siyuanFile ? (<>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-500"><Icon.Diamond /></div>
          <div className="text-center"><div className="text-sm font-semibold text-neutral-800">{siyuanFile}</div><div className="mt-0.5 text-xs text-neutral-400">点击重新选择</div></div>
        </>) : (<>
          <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="36" height="36" rx="10" fill="#f5f5f4"/><path d="M18 11v10M14 15l4-4 4 4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 25h14" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div className="text-center"><div className="text-sm font-medium text-neutral-700">重新上传思源笔记导出文件</div><div className="mt-1 text-xs text-neutral-400">仅支持 Markdown.zip 格式</div></div>
        </>)}
        <input type="file" className="hidden" accept=".zip" onChange={e => { if(e.target.files[0]) setSiyuanFile(e.target.files[0].name); }} />
      </label>
    );

    if (label === "语雀知识库") return (
      <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed py-8 transition-colors ${yuqueFile ? "border-green-300 bg-green-50/40" : "border-neutral-200 bg-neutral-50 hover:border-orange-300 hover:bg-orange-50/30"}`}>
        {yuqueFile ? (<>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600"><Icon.Leaf /></div>
          <div className="text-center"><div className="text-sm font-semibold text-neutral-800">{yuqueFile}</div><div className="mt-0.5 text-xs text-neutral-400">点击重新选择</div></div>
        </>) : (<>
          <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="36" height="36" rx="10" fill="#f5f5f4"/><path d="M18 11v10M14 15l4-4 4 4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 25h14" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div className="text-center"><div className="text-sm font-medium text-neutral-700">重新上传语雀知识库导出文件</div><div className="mt-1 text-xs text-neutral-400">仅支持 .lakebook 格式</div></div>
        </>)}
        <input type="file" className="hidden" accept=".lakebook" onChange={e => { if(e.target.files[0]) setYuqueFile(e.target.files[0].name); }} />
      </label>
    );

    if (label === "GitHub" || label === "Gitee") return (<>
      {/* 当前连接的仓库/分支，授权状态内嵌在表头 */}
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
          <span className="text-xs font-medium text-neutral-500">当前连接</span>
          {reAuthState === "loading" ? (
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>
              授权中…
            </span>
          ) : reAuthState === "done" ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              已授权
            </span>
          ) : item.status === "同步失败" ? (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-500">Token 已过期</span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              已授权
            </span>
          )}
        </div>
        <div className="space-y-0 divide-y divide-neutral-50">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-neutral-500">仓库</span>
            <span className="font-mono text-xs font-medium text-neutral-800">{item._formUrls || "simiy70/design-system"}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-neutral-500">分支</span>
            <span className="font-mono text-xs font-medium text-neutral-800">main</span>
          </div>
        </div>
      </div>
      {/* 同步失败时展示重新授权操作 */}
      {reAuthState === "loading" ? (
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>
          正在跳转授权，请在弹出窗口中完成操作…
        </div>
      ) : reAuthState === "done" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700">
          <Icon.Check /> 重新授权成功，将按原同步计划继续运行
        </div>
      ) : item.status === "同步失败" ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-red-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="flex-1 text-xs text-red-600">OAuth Token 已过期，无法同步仓库内容</span>
          <button onClick={startReAuth} className="shrink-0 text-xs font-semibold text-red-600 underline underline-offset-2 hover:no-underline">重新授权</button>
        </div>
      ) : null}
      <p className="text-xs text-neutral-400">如需连接其他仓库，请新建一条信息并重新选择。</p>
    </>);

    if (label === "GitLab") return (<>
      {/* 当前连接的仓库/分支，授权状态内嵌在表头 */}
      {/* 当前连接的仓库/分支，授权状态内嵌在表头 */}
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
          <span className="text-xs font-medium text-neutral-500">当前连接</span>
          {reAuthState === "loading" ? (
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>
              授权中…
            </span>
          ) : reAuthState === "done" ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>已授权
            </span>
          ) : item.status === "同步失败" ? (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-500">同步失败</span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>已授权
            </span>
          )}
        </div>
        <div className="divide-y divide-neutral-50">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-neutral-500">仓库</span>
            <span className="font-mono text-xs font-medium text-neutral-800">{item._formUrls || "simiy70/zleap-enterprise"}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-neutral-500">分支</span>
            <span className="font-mono text-xs font-medium text-neutral-800">feature/docs</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-neutral-500">服务地址</span>
            <span className="font-mono text-xs font-medium text-neutral-800">{gitlabUrl}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-neutral-500">Application ID</span>
            <span className="font-mono text-xs font-medium text-neutral-800">{gitlabAppId || "app_xxxxxxxx"}</span>
          </div>
        </div>
      </div>
      {/* 授权状态 */}
      {reAuthState === "loading" ? (
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="spin shrink-0"><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/></svg>
          正在跳转授权，请在弹出窗口中完成操作…
        </div>
      ) : reAuthState === "done" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700">
          <Icon.Check /> 重新授权成功，将按原同步计划继续运行
        </div>
      ) : item.status === "同步失败" ? (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>
              Secret
              <span className="ml-1.5 text-xs font-normal text-neutral-400">（未轮换可留空）</span>
            </label>
            <input type="password" value={gitlabSecret} onChange={e => { setGitlabSecret(e.target.value); setIsDirty(true); }} placeholder="Secret 已轮换时填写新值" className={inputCls} />
          </div>
          <button onClick={startReAuth}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
            重新授权
          </button>
        </div>
      ) : null}
      <p className="text-xs text-neutral-400">如需连接其他仓库，请新建一条信息并重新选择。</p>
    </>);

    if (label === "笔记") return (<>
      <AdvancedSection />
    </>);

    return (
      <div className="py-6 text-center text-sm text-neutral-400">此信息源类型无可编辑的配置项</div>
    );
  };

  const navSections = [
    ...(label !== "笔记" ? [{ key: "info", label: "信息配置" }] : []),
    ...(hasSyncConfig         ? [{ key: "sync", label: "同步设置" }] : []),
    { key: "more", label: "更多配置" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`flex w-full flex-col rounded-[28px] bg-white shadow-2xl ${label === "API 接入" ? "max-w-3xl" : "max-w-2xl"}`} style={{height:"72vh"}}>
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-neutral-100 px-6 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500"><SrcIcon /></div>
          <span className="flex-1 text-base font-semibold text-neutral-900">编辑配置</span>
          <button onClick={requestClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
        </div>
        {/* Body：左右两栏 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧导航 */}
          <nav className="shrink-0 w-40 border-r border-neutral-100 bg-neutral-50/60 px-3 py-4 space-y-0.5 rounded-bl-[28px]">
            {navSections.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${activeSection === s.key ? "bg-white text-orange-500 shadow-sm" : "text-neutral-500 hover:bg-white hover:text-neutral-700"}`}>
                {s.label}
              </button>
            ))}
          </nav>
          {/* 右侧内容 */}
          <div className="flex-1 overflow-y-auto px-6 py-5" onInput={() => setIsDirty(true)}>
            {activeSection === "info" && label !== "笔记" && (
              <div className="space-y-3.5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">{(label === "企微机器人" || label === "飞书机器人") ? "机器人名称" : "信息名称"} <span className="text-red-400">*</span></label>
                    <span className={`text-xs ${editName.length >= 18 ? "text-orange-400" : "text-neutral-400"}`}>{editName.length}/20</span>
                  </div>
                  <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                    maxLength={20} placeholder={(label === "企微机器人" || label === "飞书机器人") ? "给机器人起个名称" : "给信息源一个有辨识度的名称"}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
                </div>
                {renderFields()}
              </div>
            )}
            {activeSection === "sync" && hasSyncConfig && <SyncConfig />}
            {activeSection === "more" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">信息要点</label>
                  <span className={`text-xs ${formDesc.length >= 950 ? "text-orange-400" : "text-neutral-400"}`}>{formDesc.length}/1000</span>
                </div>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={5} maxLength={1000}
                  placeholder="描述这个信息的关键信息，帮助 AI 更好地理解和引用"
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm placeholder-neutral-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
                <p className="text-xs text-neutral-400">作为 AI 提取信息的提示词，帮助更精准地识别有效内容</p>
              </div>
            )}
            {activeSection === "info" && label === "笔记" && renderFields()}
          </div>
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <button onClick={requestClose} className="rounded-xl border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">取消</button>
          <button onClick={onClose} className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600">保存配置</button>
        </div>
      </div>
      {/* 离开确认弹层 */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={e => e.target === e.currentTarget && setShowLeaveConfirm(false)}>
          <div className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="text-base font-semibold text-neutral-900">需要保存在当前页面的操作吗？</div>
            <div className="flex justify-end gap-2">
              <button onClick={onClose}
                className="rounded-xl border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">不保存</button>
              <button onClick={onClose}
                className="rounded-xl bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800">保存并退出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MULTI CONTENT PAGE (RSS / 爬虫 / API / 会话类) ─── */
function MultiContentPage({ item, onBack, onNavigateToFolder }) {
  const convTypes   = ["企微机器人", "飞书机器人", "SaleSmartly", "API 接入"];
  const isConv      = convTypes.includes(item.source);

  const [selectedKey, setSelectedKey]   = useState(null);
  const [contentView, setContentView]   = useState("list"); // "list" | "timeline"
  const [timelineDetail, setTimelineDetail] = useState(null);
  // 事项视图：总结事件展开状态
  const [tlExpandedSummaries, setTlExpandedSummaries] = useState(new Set());
  const toggleSummary = (key) => setTlExpandedSummaries(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  const [syncEnabled, setSyncEnabled]   = useState(item.status !== "同步失败");
  const [editFreqNum]                   = useState(3);
  const [editFreqUnit]                  = useState("小时");
  const [showFeeds, setShowFeeds]       = useState(false);
  const [articleSearch, setArticleSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [itemName, setItemName] = useState(item.name);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [entryMenuKey, setEntryMenuKey] = useState(null);
  const [traceEntry, setTraceEntry] = useState(null);
  const [entryDeleteTarget, setEntryDeleteTarget] = useState(null);
  const [showSyncRecords, setShowSyncRecords] = useState(false);
  const [syncRecordResultFilters, setSyncRecordResultFilters] = useState({});
  const [deletedEntryKeys, setDeletedEntryKeys] = useState(new Set());
  const [entryRetryingKeys, setEntryRetryingKeys] = useState(new Set());
  const [entryRetriedKeys, setEntryRetriedKeys] = useState(new Set());
  // 立即同步（本地反馈）：触发后 4s 内进入"解析中"状态
  const [syncingNow, setSyncingNow] = useState(false);
  const triggerSyncNow = () => {
    if (syncingNow) return;
    setSyncingNow(true);
    setTimeout(() => setSyncingNow(false), 4000);
  };

  const srcInfo = sourceInfo[item.source] || { label: item.source, Icon: Icon.File };
  const SrcIcon = srcInfo.Icon;
  const hasAutoSync = autoSyncSources.includes(item.source);
  // 事项视图：手动刷新（不自动）
  const [timelineRefreshedAt, setTimelineRefreshedAt] = useState("今天 14:32");
  const [timelineRefreshing, setTimelineRefreshing] = useState(false);
  const handleTimelineRefresh = () => {
    if (timelineRefreshing) return;
    setTimelineRefreshing(true);
    setTimeout(() => {
      setTimelineRefreshing(false);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,"0");
      const mm = String(now.getMinutes()).padStart(2,"0");
      setTimelineRefreshedAt(`今天 ${hh}:${mm}`);
    }, 800);
  };
  // 事项视图：往期事件日历
  const [showTimelineCal, setShowTimelineCal] = useState(false);
  const [tlCalMonth, setTlCalMonth] = useState(5);
  const [tlCalYear, setTlCalYear] = useState(2026);
  const [tlSelectedDay, setTlSelectedDay] = useState(null);
  // 事项视图：搜索 / AI 提问
  const [tlQuery, setTlQuery] = useState("");
  // 事项视图：搜索结果右侧详情面板
  const [tlSearchSelected, setTlSearchSelected] = useState(null);
  const [showAllEntriesModal, setShowAllEntriesModal] = useState(false);
  const [allEntriesSearch, setAllEntriesSearch] = useState("");

  // Feed configs (for bottom panel)
  const feeds = feedUrls[item.id]
    ? feedUrls[item.id]
    : item._formUrls
    ? item._formUrls.split("\n").map(u => u.trim()).filter(Boolean).map((url, i) => ({ id: i+1, url, lastSync:"—", newCount:0 }))
    : isConv ? [] : [];

  // Content entries for left list
  const articles = articleEntries[item.id] || [];
  const sessions = conversationSessions[item.id] || [];
  const entries = isConv
    ? sessions.map(s => ({ key: s.id, title: s.title, sub: s.date, badge: `${s.msgCount}条`, summary: s.summary, tags: s.tags, participants: s.participants, syncStatus: s.syncStatus }))
    : articles.map(a => ({ key: a.id, title: a.title, sub: a.date, summary: a.summary, content: a.content, syncStatus: a.syncStatus, status: a.status, url: a.url, _isCodeDiff: a._isCodeDiff, _stats: a._stats, _changes: a._changes }));
  const getEntryStatus = (entry) => {
    if (!entry) return null;
    if (entryRetryingKeys.has(entry.key)) return "解析中";
    if (entryRetriedKeys.has(entry.key)) return null;
    return entry.syncStatus || null;
  };
  const isEntryFailed = (entry) => getEntryStatus(entry) === "同步失败";
  const isEntryBusy = (entry) => ["同步中", "解析中"].includes(getEntryStatus(entry));
  const getLocalSourceStatus = (overrideStatus = null) => {
    if (overrideStatus) return overrideStatus;
    if (!hasAutoSync) return item.status;
    const visibleEntries = entries.filter(entry => !deletedEntryKeys.has(entry.key));
    if (visibleEntries.some(entry => getEntryStatus(entry) === "同步失败")) return "同步失败";
    if (visibleEntries.some(entry => ["同步中", "解析中"].includes(getEntryStatus(entry)))) return "解析中";
    return connectorTaskStatusSources.has(item.source) ? "同步完成" : (item.status || "同步完成");
  };
  const getEntryFailureReason = (entry) => {
    if (!entry) return "该条结果同步失败，可稍后重试。";
    if (item.source === "搜索引擎") return "搜索结果返回成功，但正文抓取失败，未生成可读内容。";
    if (item.source === "RSS 订阅") return "RSS 条目已返回，但正文解析失败，可能是原文结构变化或访问受限。";
    if (item.source === "网页爬虫") return "目标页面已命中，但正文解析失败，请检查页面结构或抓取范围。";
    if (item.source === "API 接入") return "接口返回异常，单条数据未完成入库。";
    if (isConv) return "本条会话同步失败，可重试拉取。";
    return "该条结果同步失败，可稍后重试。";
  };
  const retryEntry = (entry) => {
    if (!entry || entryRetryingKeys.has(entry.key)) return;
    setEntryMenuKey(null);
    setEntryRetryingKeys(prev => new Set([...prev, entry.key]));
    setTimeout(() => {
      setEntryRetryingKeys(prev => {
        const next = new Set(prev);
        next.delete(entry.key);
        return next;
      });
      setEntryRetriedKeys(prev => new Set([...prev, entry.key]));
    }, 1200);
  };

  const filteredEntries = (() => {
    let result = entries;
    result = result.filter(e => !deletedEntryKeys.has(e.key));
    return result;
  })();
  const recentEntries = filteredEntries.slice(0, 8);
  const allCatalogEntries = (() => {
    const q = allEntriesSearch.trim().toLowerCase();
    if (!q) return filteredEntries;
    return filteredEntries.filter(e => `${e.title} ${e.sub || ""} ${e.summary || ""}`.toLowerCase().includes(q));
  })();
  const selectedEntry = selectedKey != null && !deletedEntryKeys.has(selectedKey) ? entries.find(e => e.key === selectedKey) : null;
  const isNetworkSyncRecordSource = ["RSS 订阅", "网页爬虫", "搜索引擎"].includes(item.source);
  const hasSyncRecords = connectorTaskStatusSources.has(item.source);
  const hasEntryTraceMenu = isNetworkSyncRecordSource;
  const hasEntryActionMenu = hasEntryTraceMenu || entries.some(entry => getEntryStatus(entry) === "同步失败");
  const getEntryTraceRows = (entry) => {
    const freq = itemSyncFreq[item.id] || "手动同步";
    if (item.source === "搜索引擎") return [
      ["关键词", item._keyword || "AI 信息管理 产品动态"],
      ["同步频率", freq],
    ];
    if (item.source === "RSS 订阅") {
      const feed = feeds[0]?.url || item._formUrls || "—";
      return [
        ["RSS 链接", feed],
        ["同步频率", freq],
      ];
    }
    if (item.source === "网页爬虫") {
      const target = feeds[0]?.url || item._formUrls || "—";
      return [
        ["目标 URL", target],
        ["抓取范围", "当前页面正文"],
        ["同步频率", freq],
      ];
    }
    return [];
  };
  const getEntrySyncTime = (entry, index = 0) => {
    const feedSync = feeds[index % Math.max(feeds.length, 1)]?.lastSync;
    if (feedSync && feedSync !== "—") return feedSync;
    if (item.source === "搜索引擎") return index === 0 ? "今天 08:00" : "昨天 08:00";
    if (item.source === "网页爬虫") return index === 0 ? "今天 10:22" : "昨天 10:00";
    if (item.source === "RSS 订阅") return index === 0 ? "今天 09:00" : "昨天 09:00";
    return entry.sub || "—";
  };
  const deleteEntry = (entry) => {
    setDeletedEntryKeys(prev => new Set([...prev, entry.key]));
    if (selectedKey === entry.key) setSelectedKey(null);
    setEntryMenuKey(null);
  };
  const locateSyncResult = (entry) => {
    setSelectedKey(entry.key);
    setContentView("list");
    setShowSyncRecords(false);
    setEntryMenuKey(null);
  };
  const syncRecordRows = getEntryTraceRows(selectedEntry || entries[0] || {});
  const syncRecords = (() => {
    const sourceEntries = entries.filter(e => !deletedEntryKeys.has(e.key)).slice(0, 3);
    const statusCycle = ["同步完成", item.status === "同步失败" ? "同步失败" : "同步完成", item.status === "解析中" ? "解析中" : "同步完成"];
    return sourceEntries.map((entry, index) => {
      const results = sourceEntries
        .slice(index, index + Math.max(1, sourceEntries.length - index))
        .map(result => ({ ...result, resultStatus: getEntryStatus(result), failureReason: getEntryFailureReason(result) }));
      const failedCount = results.filter(result => result.resultStatus === "同步失败").length;
      const busyCount = results.filter(result => ["同步中", "解析中"].includes(result.resultStatus)).length;
      const successCount = results.length - failedCount - busyCount;
      return {
        id: entry.key,
        time: getEntrySyncTime(entry, index),
        status: failedCount > 0 ? "同步失败" : busyCount > 0 ? "解析中" : (entry.syncStatus || statusCycle[index] || "同步完成"),
        count: results.length,
        successCount,
        failedCount,
        busyCount,
        title: entry.title,
        rows: getEntryTraceRows(entry),
        results,
      };
    });
  })();
  const getSyncRecordResultFilter = (recordId) => syncRecordResultFilters[recordId] || "all";
  const syncResultTabsForRecord = (record) => ([
    { key: "all", label: "全部", count: record.count },
    { key: "success", label: "同步成功", count: record.successCount },
    { key: "busy", label: "处理中", count: record.busyCount },
    { key: "failed", label: "同步失败", count: record.failedCount },
  ]);
  const getFilteredSyncResults = (record) => {
    const filter = getSyncRecordResultFilter(record.id);
    return record.results.filter(result => {
      if (filter === "success") return !result.resultStatus;
      if (filter === "busy") return ["同步中", "解析中"].includes(result.resultStatus);
      if (filter === "failed") return result.resultStatus === "同步失败";
      return true;
    });
  };
  const _allTimelineGroups = timelineEvents[item.id] || timelineEvents[101] || [];
  const _filteredTimelineGroups = filterTimelineGroups(_allTimelineGroups, tlSelectedDay);
  const tlIsSearching = tlQuery && tlQuery.trim().length > 0;
  const timelineGroups = tlIsSearching ? flattenTimelineGroups(_filteredTimelineGroups, tlQuery) : _filteredTimelineGroups;

  const statusStyle = {
    "同步完成":"bg-green-50 text-green-600",
    "同步中":  "bg-blue-50 text-blue-500",
    "同步失败":"bg-red-50 text-red-500",
    "解析中":  "bg-orange-50 text-orange-500",
    "空录音":  "bg-neutral-100 text-neutral-500",
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">

      {/* ── Top bar (breadcrumb: 所属信息源 / 信息名称) ── */}
      <div className="flex shrink-0 items-start gap-3 border-b border-neutral-200/60 bg-white px-5 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            {/* 面包屑：所属信息源（点击返回）+ 来源类型图标 + 当前信息名（可重命名） */}
            {(() => {
              const parentFolder = item.folderId != null ? folders.find(f => f.id === item.folderId) : null;
              return parentFolder ? (
                <>
                  <button onClick={() => onNavigateToFolder ? onNavigateToFolder(parentFolder) : onBack()}
                    className="shrink-0 max-w-[120px] truncate text-neutral-400 transition-colors hover:text-neutral-700">
                    {parentFolder.name}
                  </button>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24" className="shrink-0 text-neutral-300"><polyline points="9 18 15 12 9 6"/></svg>
                </>
              ) : null;
            })()}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500"><SrcIcon /></div>
            <button onClick={() => setShowRenameModal(true)}
              title="点击修改信息名称"
              className="group flex min-w-0 items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-neutral-100">
              <span className="truncate font-semibold text-neutral-900">{itemName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-300 opacity-0 transition group-hover:opacity-100"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
          </div>
          {/* ── 同步状态 meta 行（仅连接器类；同步失败时隐藏，由下方提示条独占展示） ── */}
          {hasAutoSync && getLocalSourceStatus(syncingNow ? "解析中" : null) !== "同步失败" && (() => {
            const displayStatus = getLocalSourceStatus(syncingNow ? "解析中" : null);
            const isBusy = displayStatus === "同步中" || displayStatus === "解析中";
            const isPaused = !isBusy && !syncEnabled;
            let dotColor = "bg-green-500", textColor = "text-neutral-400", statusText = "已同步", tooltip = "";
            if (displayStatus === "解析中") { dotColor = "bg-orange-400"; textColor = "text-orange-500"; statusText = "解析中…"; tooltip = "正在从数据源拉取、下载或导入内容"; }
            else if (displayStatus === "同步中") { dotColor = "bg-blue-400"; textColor = "text-blue-500"; statusText = "同步中…"; tooltip = "数据已获取，正在进行 AI 处理（事项提取、向量化等）"; }
            else if (displayStatus === "空录音") { dotColor = "bg-neutral-300"; textColor = "text-neutral-400"; statusText = "空录音"; tooltip = "未识别到有效语音，跳过事项同步"; }
            else if (isPaused) { dotColor = "bg-neutral-300"; statusText = "已暂停"; }
            return (
              <div className="flex items-center gap-1.5 text-[11px]" title={tooltip}>
                <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${isBusy ? "animate-pulse" : ""}`} />
                <span className={textColor}>{statusText}</span>
              </div>
            );
          })()}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* 视图切换（segmented control） */}
          <div className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 p-0.5">
            <button onClick={() => { setContentView("list"); }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${contentView === "list" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              信息列表
            </button>
            <button onClick={() => { setContentView("timeline"); setSelectedKey(null); }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${contentView === "timeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
              事项视图
            </button>
          </div>
          {/* 编辑配置（仅连接器类） */}
          {hasAutoSync && (
            <button onClick={() => setShowEditModal(true)}
              title="编辑配置"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          )}
          {/* ⋮ 更多菜单 */}
          <div className="relative">
            <button onClick={e => { e.stopPropagation(); setShowMoreMenu(v => !v); }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
              <Icon.More />
            </button>
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-neutral-100 bg-white py-1 shadow-lg">
                  {hasAutoSync && (() => {
                    const isBusy = ["解析中", "同步中"].includes(getLocalSourceStatus(syncingNow ? "解析中" : null));
                    return (
                      <>
                        <button onClick={() => { if (!isBusy) { setShowMoreMenu(false); triggerSyncNow(); } }}
                          disabled={isBusy}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm ${isBusy ? "cursor-not-allowed text-neutral-300" : "text-neutral-700 hover:bg-neutral-50"}`}>
                          <Icon.SyncNow /> 立即同步
                        </button>
                        <div className="mx-3 my-1 border-t border-neutral-100" />
                      </>
                    );
                  })()}
                  {hasSyncRecords && (
                    <>
                      <button onClick={() => { setShowSyncRecords(true); setShowMoreMenu(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 2 5-6"/></svg>
                        同步记录
                      </button>
                      <div className="mx-3 my-1 border-t border-neutral-100" />
                    </>
                  )}
                  <button onClick={() => { setShowMoveModal(true); setShowMoreMenu(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                    <Icon.Move /> 复制至
                  </button>
                  <div className="mx-3 my-1 border-t border-neutral-100" />
                  <button onClick={() => { setShowDeleteConfirm(true); setShowMoreMenu(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                    <Icon.Trash /> 删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 同步失败提示条 — 轻量单行样式（与 SingleDocPage 一致） */}
      {getLocalSourceStatus(syncingNow ? "解析中" : null) === "同步失败" && (
        <div className="flex shrink-0 items-center gap-2 border-b border-neutral-100 bg-red-50/40 px-5 py-2 text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="min-w-0 flex-1 truncate text-neutral-600">{mockFailureReason(item.source)}</span>
          <div className="flex shrink-0 items-center gap-3">
            {failureSecondaryActionLabel(item.source) && (
              <button onClick={() => setShowEditModal(true)}
                className="text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-red-500 hover:decoration-red-300">
                {failureSecondaryActionLabel(item.source)}
              </button>
            )}
            <button className="flex items-center gap-1 font-medium text-red-500 hover:text-red-600">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
              重试
            </button>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      {contentView === "timeline" ? (
        /* ── 事项视图：默认居中；搜索且选中事件时切换为左右两栏 ── */
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <div className={`overflow-y-auto ${(tlIsSearching && tlSearchSelected) ? "w-[420px] shrink-0 border-r border-neutral-100" : "flex-1"}`}>
          <div className={(tlIsSearching && tlSearchSelected) ? "px-5 py-6" : "mx-auto w-full max-w-2xl px-6 py-8"}>
            {/* 搜索 / AI 提问 */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-orange-200 bg-white px-5 py-3 shadow-sm shadow-orange-50 focus-within:border-orange-400">
              <input value={tlQuery} onChange={e => { setTlQuery(e.target.value); if (!e.target.value.trim()) setTlSearchSelected(null); }}
                placeholder="搜索事项或向 AI 提问…"
                className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none" />
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            {tlIsSearching && (() => {
              // 平铺事项总数（即下方编号列表的总数）
              const flatCount = timelineGroups.reduce((acc, g) => acc + g.items.length, 0);
              const Ref = ({ n, hi }) => (
                <span className={`mx-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${hi ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-600"}`}>{n}</span>
              );
              return (
                <div className="mb-5 space-y-3">
                  {/* AI 总结 */}
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                    <p className="text-sm leading-7 text-neutral-700">
                      围绕「{tlQuery}」的相关事项，本信息源累计沉淀了 {flatCount} 条记录<Ref n={1} hi/>。
                      综合各条事项可见，{tlQuery} 在最近一段时间的同步任务中频繁出现<Ref n={2} hi/><Ref n={3} hi={false}/>，
                      AI 已自动归类并提取关键属性标签<Ref n={4} hi/>。点击右侧编号事项可查看完整摘要与原文参考<Ref n={5} hi={false}/>。
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-neutral-400">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-orange-400"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      AI 总结参考以下 {flatCount} 条事项
                    </div>
                  </div>
                  {/* 工具条 */}
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-orange-600">查看图谱</button>
                    <div className="flex-1" />
                    <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      智能排序
                    </button>
                    <span className="text-neutral-200">|</span>
                    <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      多选
                    </button>
                  </div>
                </div>
              );
            })()}
            {timelineGroups.length === 0 && tlSelectedDay && (
              <div className="mb-8">
                <div className="relative mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-orange-500">{tlSelectedDay.m}/{tlSelectedDay.d}</span>
                    <span className="text-base font-semibold text-neutral-800">事件</span>
                    <button onClick={() => setTlSelectedDay(null)}
                      className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                      title="清除筛选">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {!tlSelectedDay && (
                      <button onClick={handleTimelineRefresh} disabled={timelineRefreshing}
                        title={`上次刷新：${timelineRefreshedAt}`}
                        className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={timelineRefreshing ? "animate-spin" : ""}><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                        {timelineRefreshing ? "刷新中" : "刷新"}
                      </button>
                    )}
                    <div className="relative">
                      <button onClick={e => { e.stopPropagation(); setShowTimelineCal(v => !v); }}
                        className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        往期事件
                      </button>
                      {showTimelineCal && <TimelineCalendar
                        calYear={tlCalYear} setCalYear={setTlCalYear}
                        calMonth={tlCalMonth} setCalMonth={setTlCalMonth}
                        selectedDay={tlSelectedDay} setSelectedDay={setTlSelectedDay}
                        availableDays={getAvailableTimelineDays(_allTimelineGroups)}
                        onClose={() => setShowTimelineCal(false)} />}
                    </div>
                  </div>
                </div>
                <div className="py-12 text-center text-sm text-neutral-400">该日期暂无事项记录</div>
              </div>
            )}
            {timelineGroups.length === 0 && !tlSelectedDay && (
              <div className="py-16 text-center text-sm text-neutral-400">暂无事项记录</div>
            )}
            {timelineGroups.map((group, gi) => (
              <div key={gi} className="mb-8">
                {!tlIsSearching && (
                <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between bg-white/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                  <div className="flex items-center gap-2">
                    {gi === 0 && tlSelectedDay ? (
                      <>
                        <span className="text-base font-bold text-orange-500">{tlSelectedDay.m}/{tlSelectedDay.d}</span>
                        <span className="text-base font-semibold text-neutral-800">事件</span>
                        <button onClick={() => setTlSelectedDay(null)}
                          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                          title="清除筛选">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </>
                    ) : (
                      <span className="text-base font-bold text-orange-500">{group.date}</span>
                    )}
                  </div>
                  {gi === 0 && (
                    <div className="flex items-center gap-3">
                      {!tlSelectedDay && (
                        <button onClick={handleTimelineRefresh} disabled={timelineRefreshing}
                          title={`上次刷新：${timelineRefreshedAt}`}
                          className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={timelineRefreshing ? "animate-spin" : ""}><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                          {timelineRefreshing ? "刷新中" : "刷新"}
                        </button>
                      )}
                      <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setShowTimelineCal(v => !v); }}
                          className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          往期事件
                        </button>
                        {showTimelineCal && <TimelineCalendar
                          calYear={tlCalYear} setCalYear={setTlCalYear}
                          calMonth={tlCalMonth} setCalMonth={setTlCalMonth}
                          selectedDay={tlSelectedDay} setSelectedDay={setTlSelectedDay}
                          availableDays={getAvailableTimelineDays(_allTimelineGroups)}
                          onClose={() => setShowTimelineCal(false)} />}
                      </div>
                    </div>
                  )}
                </div>
                )}
                <div>
                  {group.items.map((ev, idx) => {
                    const key = `${gi}-${idx}`;
                    const isExpanded = tlExpandedSummaries.has(key);
                    if (ev._isSummary && ev._children && !tlIsSearching) {
                      return (
                        <div key={idx} className="border-b border-neutral-100">
                          <div onClick={() => setTimelineDetail(ev)}
                            className="flex cursor-pointer gap-5 py-4 transition-colors hover:bg-neutral-50 -mx-3 px-3 rounded-xl">
                            <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{ev.time}</span>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 text-[14px] font-semibold leading-snug text-neutral-900">{ev.text}</div>
                              {ev.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{ev.summary}</div>}
                              <button onClick={e => { e.stopPropagation(); toggleSummary(key); }}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600">
                                <span>{ev._children.length} 个相关子事项</span>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="ml-10 border-l-2 border-orange-100 pl-4">
                              {ev._children.map((child, ci) => (
                                <div key={ci} onClick={() => setTimelineDetail(child)}
                                  className="flex cursor-pointer gap-3 border-b border-neutral-100 py-3 transition-colors hover:bg-neutral-50 -mr-3 pr-3 rounded-r-xl last:border-b-0">
                                  <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{child.time}</span>
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-0.5 text-[13px] font-medium leading-snug text-neutral-800">{child.text}</div>
                                    {child.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{child.summary}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    const isSelected = tlIsSearching && tlSearchSelected === ev;
                    // 搜索模式下编号：所有 group 平铺后的全局序号
                    const globalIdx = tlIsSearching
                      ? timelineGroups.slice(0, gi).reduce((acc, g) => acc + g.items.length, 0) + idx + 1
                      : null;
                    return (
                      <div key={idx} onClick={() => tlIsSearching ? setTlSearchSelected(ev) : setTimelineDetail(ev)}
                        className={`flex cursor-pointer gap-5 border-b border-neutral-100 py-4 transition-colors -mx-3 px-3 rounded-xl ${isSelected ? "bg-orange-50" : "hover:bg-neutral-50"}`}>
                        {tlIsSearching && globalIdx != null ? (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">{globalIdx}</span>
                        ) : (
                          <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{ev.time}</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 text-[14px] font-semibold leading-snug text-neutral-900">{ev.text}</div>
                          {ev.summary && <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{ev.summary}</div>}
                          {tlIsSearching && (
                            <div className="mt-1.5 text-[11px] text-neutral-400">{group.date} {ev.time}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          </div>
          {tlIsSearching && tlSearchSelected && (
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="shrink-0 border-b border-neutral-100 px-8 py-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold leading-snug text-neutral-900">{tlSearchSelected.text}</h2>
                  <button onClick={() => setTlSearchSelected(null)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
                    <Icon.Close />
                  </button>
                </div>
                {tlSearchSelected.tags && tlSearchSelected.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tlSearchSelected.tags.map((t, i) => (
                      <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
                        <span className="font-medium text-neutral-400">{t.prop}-</span>{t.val}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-8 py-5 space-y-5">
                {tlSearchSelected.summary && (
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{tlSearchSelected.summary}</div>
                )}
                {(() => {
                  const isSummaryWithArticles = tlSearchSelected._isSummary && tlSearchSelected._children?.some(c => c.article);
                  const childArticles = isSummaryWithArticles ? tlSearchSelected._children.filter(c => c.article) : [];
                  return (
                    <div className="border-t border-neutral-100 pt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-neutral-400">原文参考</span>
                        {tlSearchSelected.article ? (
                          <button onClick={() => { const eid = tlSearchSelected.article.entryId; setTlSearchSelected(null); setTlQuery(""); setContentView("list"); if (eid != null) setSelectedKey(eid); }}
                            className="text-xs text-orange-500 transition hover:underline">查看原文 →</button>
                        ) : isSummaryWithArticles ? (
                          <span className="text-xs text-neutral-400">{childArticles.length} 篇</span>
                        ) : null}
                      </div>
                      {tlSearchSelected.article ? (
                        <div className="text-base font-bold text-neutral-900">{tlSearchSelected.article.title}</div>
                      ) : isSummaryWithArticles ? (
                        <div className="space-y-2">
                          {childArticles.map((child, ci) => (
                            <div key={ci} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
                              <span className="flex-1 line-clamp-1 text-[13px] font-medium text-neutral-800">{child.article.title}</span>
                              {child.article.entryId != null ? (
                                <button onClick={() => { const eid = child.article.entryId; setTlSearchSelected(null); setTlQuery(""); setContentView("list"); setSelectedKey(eid); }}
                                  className="shrink-0 text-xs text-orange-500 transition hover:underline">→</button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-400">—</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      ) : (
      <div className="flex min-h-0 flex-1">

        {/* ── LEFT panel ── */}
        <div className="flex w-64 shrink-0 flex-col overflow-hidden border-r border-neutral-100">

          {/* Recent feed header */}
          <div className="flex items-center justify-between px-4 pb-1 pt-3">
            <span className="text-xs text-neutral-400">近期信息</span>
            <button onClick={() => { setShowAllEntriesModal(true); setAllEntriesSearch(""); }}
              className="flex items-center gap-0.5 text-xs text-neutral-400 transition hover:text-orange-500">
              全部
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Article / session list */}
          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            {recentEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="mb-2 text-3xl text-neutral-200"><SrcIcon /></span>
                <p className="text-xs text-neutral-400">暂无内容，等待同步中</p>
              </div>
            ) : recentEntries.map(entry => {
              const entryStatus = getEntryStatus(entry);
              const entryFailed = entryStatus === "同步失败";
              const entryBusy = entryStatus === "同步中" || entryStatus === "解析中";
              return (
              <div key={entry.key}
                className={`group relative transition-colors ${selectedKey === entry.key ? "bg-orange-50 border-r-2 border-r-orange-400" : entryFailed ? "hover:bg-red-50/40" : "hover:bg-neutral-50"}`}>
                <button
                  onClick={() => { setSelectedKey(entry.key); setContentView("list"); setEntryMenuKey(null); }}
                  className="w-full px-4 py-2.5 pr-9 text-left">
                  <div className="flex items-start gap-1.5">
                    <span className={`flex-1 line-clamp-2 text-[13px] leading-snug ${selectedKey === entry.key ? "font-semibold text-neutral-900" : entryFailed ? "font-medium text-neutral-500" : "font-medium text-neutral-700"}`}>
                      {entry.title}
                    </span>
                    {entryBusy && (
                      <span title={entryStatus} className="mt-0.5 shrink-0 text-orange-400">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-spin">
                          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" opacity=".28"/>
                          <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5H8V1.5Z" fill="currentColor"/>
                        </svg>
                      </span>
                    )}
                    {entryFailed && (
                      <span title="同步失败" className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 3l6 6M9 3L3 9"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span>{entry.sub}</span>
                  </div>
                </button>
                {hasEntryActionMenu && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setEntryMenuKey(entryMenuKey === entry.key ? null : entry.key); }}
                      className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white hover:text-neutral-700 ${entryMenuKey === entry.key ? "bg-white opacity-100 shadow-sm" : "opacity-0 group-hover:opacity-100"}`}
                      title="更多">
                      <Icon.More />
                    </button>
                    {entryMenuKey === entry.key && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setEntryMenuKey(null)} />
                        <div className="absolute right-2 top-9 z-30 w-36 overflow-hidden rounded-xl border border-neutral-100 bg-white py-1 shadow-lg">
                          {entryFailed && (
                            <button onClick={() => retryEntry(entry)}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                              重试
                            </button>
                          )}
                          {hasEntryTraceMenu && (
                            <button onClick={() => { setTraceEntry(entry); setEntryMenuKey(null); }}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 2 5-6"/></svg>
                              同步记录
                            </button>
                          )}
                          <button onClick={() => { setEntryDeleteTarget(entry); setEntryMenuKey(null); }}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-red-500 hover:bg-red-50">
                            <Icon.Trash />
                            删除
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            );})}
          </div>

        </div>

        {/* ── RIGHT panel ── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {selectedEntry && isEntryBusy(selectedEntry) ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none" className="animate-spin">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" opacity=".28"/>
                  <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5H8V1.5Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-800">{getEntryStatus(selectedEntry)}</div>
                <p className="mt-1 text-xs text-neutral-400">正在重新处理该条结果，请稍候。</p>
              </div>
            </div>

          ) : selectedEntry && isEntryFailed(selectedEntry) ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-300">
                <Icon.File />
              </div>
              <p className="text-sm text-neutral-400">该内容同步失败，暂无可展示详情</p>
            </div>

          ) : isConv && selectedEntry ? (
            /* ── Conversation thread view ── */
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Session header */}
              <div className="shrink-0 border-b border-neutral-100 px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-neutral-900 leading-snug">{selectedEntry.title}</div>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {(convThread[item.id] || []).map(msg => {
                  const isSelf = msg.sender === CURRENT_USER;
                  const initials = msg.sender.slice(0, 1);
                  const avatarColors = ["bg-violet-100 text-violet-600","bg-blue-100 text-blue-600","bg-emerald-100 text-emerald-600","bg-amber-100 text-amber-600","bg-rose-100 text-rose-600"];
                  const colorIdx = msg.sender.charCodeAt(0) % avatarColors.length;
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${isSelf ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColors[colorIdx]}`}>
                        {initials}
                      </div>
                      <div className={`flex max-w-[72%] flex-col ${isSelf ? "items-end" : "items-start"}`}>
                        <div className={`mb-1 flex items-baseline gap-1.5 ${isSelf ? "flex-row-reverse" : ""}`}>
                          <span className="text-[11px] font-semibold text-neutral-700">{msg.sender}</span>
                          <span className="text-[10px] text-neutral-400">{msg.time}</span>
                        </div>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isSelf ? "rounded-tr-sm bg-orange-500 text-white" : "rounded-tl-sm bg-neutral-100 text-neutral-800"}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!(convThread[item.id] || []).length && (
                  <div className="flex h-full items-center justify-center py-16 text-center">
                    <p className="text-sm text-neutral-400">暂无消息记录</p>
                  </div>
                )}
              </div>
            </div>

          ) : selectedEntry && selectedEntry._isCodeDiff ? (
            /* Code platform: sync diff detail */
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mx-auto max-w-2xl">
                <h2 className="text-xl font-bold leading-snug text-neutral-900">{selectedEntry.title}</h2>
                <div className="mt-3 text-xs text-neutral-400">{selectedEntry.sub}</div>
                <div className="mt-4 border-t border-neutral-100" />
                <div className="mt-5 space-y-2">
                  {(selectedEntry._changes || []).map((c, ci) => {
                    const pathColor = c.type === "added" ? "text-green-600"
                      : c.type === "deleted" ? "text-red-600"
                      : "text-blue-600";
                    return (
                      <div key={ci} className="rounded-xl border border-neutral-100 px-4 py-3 hover:bg-neutral-50 transition-colors">
                        <code className={`break-all text-[13px] font-medium ${pathColor}`}>{c.path}</code>
                        {c.note && <div className="mt-1 text-xs leading-relaxed text-neutral-500">{c.note}</div>}
                      </div>
                    );
                  })}
                  {(!selectedEntry._changes || selectedEntry._changes.length === 0) && (
                    <div className="py-8 text-center text-xs text-neutral-400">本次同步无文件变更</div>
                  )}
                </div>
              </div>
            </div>

          ) : selectedEntry ? (
            /* Article detail */
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mx-auto max-w-2xl">
                <h2 className="text-xl font-bold leading-snug text-neutral-900">{selectedEntry.title}</h2>
                {item.source !== "搜索引擎" && (
                  <>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-neutral-400">发布时间：{selectedEntry.sub}</span>
                    </div>
                    <div className="mt-1.5 border-t border-neutral-100" />
                  </>
                )}
                {selectedEntry.content
                  ? <div className="mt-6 text-sm leading-8 text-neutral-700 whitespace-pre-wrap">{selectedEntry.content}</div>
                  : <p className="mt-6 text-sm leading-loose text-neutral-700">{selectedEntry.summary}</p>
                }
                {selectedEntry.participants && (
                  <div className="mt-6 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                    <div className="mb-1.5 text-xs font-medium text-neutral-500">参与者</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEntry.participants.map(p => (
                        <span key={p} className="rounded-full bg-white border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedEntry.url && (
                  <div className="mt-8">
                    <button className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 transition-colors">
                      <Icon.Link /> 查看原文
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty / select prompt */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-300">
                <Icon.File />
              </div>
              <p className="text-sm text-neutral-400">
                {entries.length > 0 ? "从左侧选择一篇内容查看详情" : "等待内容同步中…"}
              </p>
            </div>
          )}
        </div>
      </div>
      )}
      {showAllEntriesModal && (
        <div className="fixed bottom-0 right-0 z-50 flex flex-col border-l border-neutral-100 bg-white"
          style={{
            left: 256,
            top: getLocalSourceStatus(syncingNow ? "解析中" : null) === "同步失败" ? 88 : 53,
          }}>
            <div className="flex shrink-0 items-center justify-between px-8 py-7">
              <h2 className="text-xl font-bold text-neutral-900">搜索全部</h2>
              <button onClick={() => setShowAllEntriesModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-500 text-white transition hover:bg-neutral-700"
                title="关闭">
                <Icon.Close />
              </button>
            </div>
            <div className="px-8 pb-5">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input autoFocus value={allEntriesSearch} onChange={e => setAllEntriesSearch(e.target.value)}
                  placeholder="搜索全部内容"
                  className="flex-1 bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400" />
                {allEntriesSearch && (
                  <button onClick={() => setAllEntriesSearch("")} className="text-neutral-300 hover:text-neutral-500">
                    <Icon.Close />
                  </button>
                )}
              </div>
            </div>
            <div className="shrink-0 px-8 pb-3 text-sm text-neutral-400">更早</div>
            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8">
              {allCatalogEntries.length === 0 ? (
                <div className="py-16 text-center text-sm text-neutral-400">没有匹配的内容</div>
              ) : (
                <div className="space-y-1">
                  {allCatalogEntries.map(entry => (
                    <button key={entry.key} onClick={() => { setSelectedKey(entry.key); setContentView("list"); setShowAllEntriesModal(false); }}
                      className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition hover:bg-neutral-50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-neutral-500">
                        {isConv ? <Icon.Msg /> : <SrcIcon />}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800">{entry.title}</span>
                      <span className="shrink-0 text-xs text-neutral-400">{entry.sub || "-"}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>
      )}
      {/* Timeline detail modal — page-level (works in both timeline and list views) */}
      {timelineDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
          onClick={() => setTimelineDetail(null)}>
          <div className="flex w-full max-w-xl flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"86vh"}}
            onClick={e => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
              <span className="text-base font-semibold text-neutral-900">事件详情</span>
              <button onClick={()=>setTimelineDetail(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <h2 className="text-[17px] font-bold leading-snug text-neutral-900">{timelineDetail.text}</h2>
              {timelineDetail.tags && timelineDetail.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {timelineDetail.tags.map((t, i) => (
                    <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
                      <span className="font-medium text-neutral-400">{t.prop}-</span>{t.val}
                    </span>
                  ))}
                </div>
              )}
              {timelineDetail.summary && (
                <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{timelineDetail.summary}</div>
              )}
              {(() => {
                const isSummaryWithArticles = timelineDetail._isSummary && timelineDetail._children?.some(c => c.article);
                const childArticles = isSummaryWithArticles ? timelineDetail._children.filter(c => c.article) : [];
                return (
                  <>
                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                      <span className="text-xs text-neutral-400">原文参考</span>
                      {timelineDetail.article?.entryId != null ? (
                        <button onClick={() => { const eid = timelineDetail.article.entryId; setTimelineDetail(null); setContentView("list"); setSelectedKey(eid); }}
                          className="text-xs text-orange-500 transition hover:underline">查看原文 →</button>
                      ) : timelineDetail.article && hasExternalArticleLink(item.source) ? (
                        <button className="text-xs text-orange-500 transition hover:underline">查看原文 →</button>
                      ) : isSummaryWithArticles ? (
                        <span className="text-xs text-neutral-400">{childArticles.length} 篇</span>
                      ) : null}
                    </div>
                    {timelineDetail.article ? (
                      <div className="text-base font-bold text-neutral-900">{timelineDetail.article.title}</div>
                    ) : isSummaryWithArticles ? (
                      <div className="space-y-2">
                        {childArticles.map((child, ci) => (
                          <div key={ci} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
                            <span className="flex-1 line-clamp-1 text-[13px] font-medium text-neutral-800">{child.article.title}</span>
                            {child.article.entryId != null ? (
                              <button onClick={() => { setTimelineDetail(null); setContentView("list"); setSelectedKey(child.article.entryId); }}
                                className="shrink-0 text-xs text-orange-500 transition hover:underline">→</button>
                            ) : hasExternalArticleLink(item.source) ? (
                              <button className="shrink-0 text-xs text-orange-500 transition hover:underline">→</button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-400">—</div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {traceEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm"
          onClick={() => setTraceEntry(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <div className="text-base font-semibold text-neutral-900">同步记录</div>
                <div className="mt-0.5 text-xs text-neutral-400">本条内容使用的历史配置快照</div>
              </div>
              <button onClick={() => setTraceEntry(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
                <Icon.Close />
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="rounded-xl bg-neutral-50 px-4 py-3">
                <div className="line-clamp-2 text-sm font-semibold text-neutral-900">{traceEntry.title}</div>
                <div className="mt-1 text-xs text-neutral-400">同步时间：{getEntrySyncTime(traceEntry)}</div>
              </div>
              <div className="space-y-2">
                {getEntryTraceRows(traceEntry).map(([label, value]) => (
                  <div key={label} className="flex gap-3 rounded-lg px-1 py-1.5 text-sm">
                    <span className="w-20 shrink-0 text-neutral-400">{label}</span>
                    <span className="min-w-0 flex-1 break-all text-neutral-700">{value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-orange-50/70 px-3 py-2 text-xs leading-relaxed text-orange-600">
                这里展示的是该内容同步时使用的配置快照，不会随当前编辑配置变化。
              </div>
            </div>
          </div>
        </div>
      )}
      {entryDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm"
          onClick={() => setEntryDeleteTarget(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Icon.Trash />
              </div>
              <div className="text-lg font-bold text-neutral-900">删除内容</div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                确定要删除「<span className="font-medium text-neutral-700">{entryDeleteTarget.title}</span>」吗？删除后将不再出现在当前信息列表中。
              </p>
            </div>
            <div className="flex gap-2.5 px-6 pb-6">
              <button onClick={() => setEntryDeleteTarget(null)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                取消
              </button>
              <button onClick={() => { deleteEntry(entryDeleteTarget); setEntryDeleteTarget(null); }}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
      {showSyncRecords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm"
          onClick={() => setShowSyncRecords(false)}>
          <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{maxHeight:"82vh"}}
            onClick={e => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <div className="text-base font-semibold text-neutral-900">同步记录</div>
                <div className="mt-0.5 text-xs text-neutral-400">{itemName} · 历史同步任务</div>
              </div>
              <button onClick={() => setShowSyncRecords(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
                <Icon.Close />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {syncRecords.length === 0 ? (
                <div className="py-10 text-center text-sm text-neutral-400">暂无同步记录</div>
              ) : syncRecords.map((record, index) => (
                <div key={record.id} className="rounded-2xl border border-neutral-100 bg-white px-4 py-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">{record.time}</span>
                        <span className={`inline-flex items-center gap-1 text-xs ${statusMap[record.status]?.text || "text-neutral-500"}`}>
                          {statusMap[record.status]?.icon}
                          {record.status}
                        </span>
                        <span className="text-xs text-neutral-400">更新数量 {record.count}</span>
                      </div>
                    </div>
                  </div>
                  {record.rows.length > 0 && (
                    <div className="mt-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                      <div className="mb-1.5 text-xs font-medium text-neutral-500">配置快照</div>
                      <div className="space-y-1">
                        {record.rows.map(([label, value]) => (
                          <div key={`${record.id}-${label}`} className="flex gap-3 text-xs leading-5">
                            <span className="w-16 shrink-0 text-neutral-400">{label}</span>
                            <span className="min-w-0 flex-1 break-all text-neutral-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5">
                    <div className="mb-2 text-xs font-medium text-neutral-500">本次同步结果</div>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {syncResultTabsForRecord(record).map(tab => {
                        const active = getSyncRecordResultFilter(record.id) === tab.key;
                        return (
                          <button key={`${record.id}-${tab.key}`} type="button"
                            onClick={() => setSyncRecordResultFilters(prev => ({...prev, [record.id]: tab.key}))}
                            className={`rounded-full px-2.5 py-1 text-xs transition-colors ${active ? "bg-orange-50 text-orange-600" : "bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"}`}>
                            {tab.label} {tab.count}
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-1">
                      {getFilteredSyncResults(record).length === 0 ? (
                        <div className="rounded-lg bg-white/70 px-2 py-2 text-xs text-neutral-400">暂无对应状态结果</div>
                      ) : getFilteredSyncResults(record).map(result => {
                        const resultFailed = result.resultStatus === "同步失败";
                        const resultBusy = result.resultStatus === "同步中" || result.resultStatus === "解析中";
                        return resultFailed ? (
                          <div key={`${record.id}-${result.key}`}
                            className="rounded-lg bg-white/70 px-2 py-1.5 text-xs">
                            <div className="flex items-center justify-between gap-3">
                              <span className="min-w-0 flex-1 truncate text-neutral-600">{result.title}</span>
                              <span className="shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500">失败</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-red-400">
                              <span className="min-w-0 flex-1 truncate">{result.failureReason}</span>
                              <button onClick={() => retryEntry(result)}
                                className="shrink-0 rounded-md px-1.5 py-0.5 text-red-500 transition hover:bg-red-50">
                                重试
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button key={`${record.id}-${result.key}`}
                            onClick={() => locateSyncResult(result)}
                            className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs text-neutral-700 transition-colors hover:bg-white hover:text-orange-600">
                            <span className="min-w-0 flex-1 truncate">{result.title}</span>
                            {resultBusy ? (
                              <span title={result.resultStatus} className="shrink-0 text-orange-400">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-spin">
                                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" opacity=".28"/>
                                  <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5H8V1.5Z" fill="currentColor"/>
                                </svg>
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showEditModal && <EditConfigModal item={item} onClose={() => setShowEditModal(false)} />}
      {showMoveModal && <MoveToModal item={item} onClose={() => setShowMoveModal(false)} folderScopes={{}} />}
      {showDeleteConfirm && <DeleteModal item={item} onClose={() => setShowDeleteConfirm(false)} onConfirm={onBack} />}
      {showRenameModal && <RenameModal item={{...item, name: itemName}} onClose={() => setShowRenameModal(false)} />}
    </div>
  );
}



/* ─── 汇报信息源 PAGE ─── */
function ReportPage({ treeSearch: treeSearchProp, setTreeSearch: setTreeSearchProp, reportView: reportViewProp, setReportView: setReportViewProp }) {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [reportViewLocal, setReportViewLocal] = useState("list");
  const reportView = reportViewProp ?? reportViewLocal;
  const setReportView = setReportViewProp ?? setReportViewLocal;
  const [reportContentView, setReportContentView] = useState("list"); // "list" | "timeline"
  const [memberSearch, setMemberSearch] = useState("");
  const [reportTimelineSearch, setReportTimelineSearch] = useState("");
  const [showReportTimelineCal, setShowReportTimelineCal] = useState(false);
  const [reportCalYear, setReportCalYear] = useState(2026);
  const [reportCalMonth, setReportCalMonth] = useState(4);
  const [reportSelectedDay, setReportSelectedDay] = useState(null);
  const [reportTimelineDetail, setReportTimelineDetail] = useState(null);
  const [reportTimelineSearchSelected, setReportTimelineSearchSelected] = useState(null);
  const [reportTimelineRefreshedAt, setReportTimelineRefreshedAt] = useState("今天 14:32");
  const [reportTimelineRefreshing, setReportTimelineRefreshing] = useState(false);
  const [reportRetryingIds, setReportRetryingIds] = useState(new Set());
  const [showAllMembersModal, setShowAllMembersModal] = useState(false);
  const [allMembersSearch, setAllMembersSearch] = useState("");
  const [treeSearchLocal, setTreeSearchLocal] = useState("");
  const treeSearch = treeSearchProp ?? treeSearchLocal;
  const setTreeSearch = setTreeSearchProp ?? setTreeSearchLocal;
  const [expandedDepts, setExpandedDepts] = useState(() => new Set(collectNodeIds(orgTree)));

  const avatarColors = [
    "bg-violet-100 text-violet-600","bg-blue-100 text-blue-600","bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600","bg-rose-100 text-rose-600","bg-sky-100 text-sky-600",
  ];
  const getAvatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];
  const selectedMember = selectedSource?.members.find(m => m.id === selectedMemberId) || selectedSource?.members[0];
  const visibleMessages = selectedMember ? selectedMember.messages.filter(m => m.sender !== CURRENT_USER) : [];
  const latestMemberMsgTime = (member) => {
    const latest = member.messages?.[0];
    if (!latest) return "";
    return `${latest.date} ${latest.time}`;
  };
  const filteredMembers = selectedSource ? (memberSearch.trim()
    ? selectedSource.members.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.role.toLowerCase().includes(memberSearch.toLowerCase()))
    : selectedSource.members) : [];
  const openSource = (source) => { setSelectedSource(source); setSelectedMemberId(source.members[0]?.id || null); setMemberSearch(""); setReportTimelineSearch(""); setReportSelectedDay(null); setShowReportTimelineCal(false); setReportTimelineDetail(null); setReportTimelineSearchSelected(null); };
  const handleReportTimelineRefresh = () => {
    if (reportTimelineRefreshing) return;
    setReportTimelineRefreshing(true);
    setTimeout(() => {
      setReportTimelineRefreshing(false);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setReportTimelineRefreshedAt(`今天 ${hh}:${mm}`);
    }, 800);
  };
  const retryReportSource = (source, e) => {
    e && e.stopPropagation();
    if (!source || reportRetryingIds.has(source.id)) return;
    setReportRetryingIds(prev => new Set([...prev, source.id]));
    setTimeout(() => {
      setReportRetryingIds(prev => {
        const next = new Set(prev);
        next.delete(source.id);
        return next;
      });
    }, 1200);
  };

  if (!selectedSource) {
    return (
      <div className="flex flex-1 flex-col overflow-auto px-8 py-6">
        {reportView === "list" ? (() => {
          /* ── 搜索模式：扁平列表 ── */
          if (treeSearch.trim()) {
            const q = treeSearch.trim().toLowerCase();
            const matched = collectAllSources(orgTree).filter(s =>
              s.name.toLowerCase().includes(q) ||
              s.department?.toLowerCase().includes(q) ||
              s.desc?.toLowerCase().includes(q)
            );
            return (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="grid grid-cols-12 items-center gap-x-4 border-b border-neutral-200/70 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-neutral-400">
                  <div className="col-span-5 pl-4">信息源</div>
                  <div className="col-span-1" title="可见人员数 / 总人员数">可见/总人数</div>
                  <div className="col-span-2">最近同步</div>
                  <div className="col-span-4">概况</div>
                </div>
                {matched.length === 0 ? (
                  <div className="py-12 text-center text-sm text-neutral-400">未找到「{treeSearch}」相关的信息源</div>
                ) : matched.map((source, si) => (
                  <button key={source.id} onClick={() => openSource(source)}
                    className={`group grid w-full grid-cols-12 items-center gap-x-4 bg-white px-4 py-3 text-left transition-colors hover:bg-orange-50/40 ${si < matched.length - 1 ? "border-b border-neutral-100/80" : ""}`}>
                    <div className="col-span-5 flex min-w-0 items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500"><Icon.Timeline /></span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-neutral-800">{source.name}</div>
                      </div>
                    </div>
                    <div className="col-span-1 text-sm text-neutral-500" title="可见人员数 / 总人员数">{reportVisibleCount(source)} / {reportTotalCount(source)}</div>
                    <div className="col-span-2 text-sm text-neutral-500">{source.updated}</div>
                    <div className="col-span-4">
                      {source.status === "同步失败" ? (
                        <button onClick={e => { e.stopPropagation(); /* trigger retry */ }}
                          title="失败原因: 部分成员未提交 · 点击重试"
                          className="group/rt inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap group-hover/rt:hidden">
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#f87171"/><path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
                            同步失败
                          </span>
                          <span className="hidden items-center gap-1 whitespace-nowrap group-hover/rt:inline-flex">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                            点击重试
                          </span>
                        </button>
                      ) : <StatusBadge status={source.status} />}
                    </div>
                  </button>
                ))}
              </div>
            );
          }

          /* ── 树形模式 ── */
          const toggleNode = (id) => setExpandedDepts(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
          });

          /* 递归统计子树中所有信息源数量 */
          const countSources = (n) =>
            (n.sourceIds?.length || 0) + (n.children || []).reduce((s, c) => s + countSources(c), 0);

          const PeopleIcon = ({ cls }) => (
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className={cls || "shrink-0 text-neutral-400"}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          );

          /* 每个节点统一渲染为一行：
             - 有子部门：chevron 按钮控制展开，点击行名打开信息源（若有）
             - 无子部门（叶）：点击整行打开信息源
             - 状态/时间/人员列：有信息源时显示数据，仅有子部门时显示计数
          */
          const renderNode = (node, depth) => {
            const nodeSources = (node.sourceIds || []).map(id => reportSources.find(s => s.id === id)).filter(Boolean);
            const nodeChildren = node.children || [];
            const hasChildren = nodeChildren.length > 0;
            const source = nodeSources[0] || null;
            const isExpanded = hasChildren && expandedDepts.has(node.id);
            const total = countSources(node);
            const baseIndent = 16 + depth * 20;

            const isClickable = !hasChildren && !!source;
            return (
              <div key={node.id}>
                {/* ── 统一单行：全白背景 + 分割线，后三列固定对齐表头 ── */}
                <div
                  onClick={() => isClickable && openSource(source)}
                  className={`group grid w-full grid-cols-12 items-center gap-x-4 border-b border-neutral-200/70 bg-white px-4 py-3 transition-colors ${isClickable ? "cursor-pointer hover:bg-orange-50/30" : "hover:bg-neutral-50/70"}`}>

                  {/* 组织架构列：仅此列内部缩进 */}
                  <div className="col-span-5 flex min-w-0 items-center gap-1.5" style={{ paddingLeft: baseIndent - 16 }}>
                    {hasChildren ? (
                      <button
                        onClick={e => { e.stopPropagation(); toggleNode(node.id); }}
                        className="shrink-0 flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors">
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                          className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    ) : <span className="w-5 shrink-0" />}
                    <PeopleIcon cls="shrink-0 text-neutral-400" />
                    <span
                      onClick={e => { if (hasChildren && source) { e.stopPropagation(); openSource(source); } }}
                      className={`truncate text-sm font-medium text-neutral-800 ${hasChildren && source ? "cursor-pointer hover:text-orange-600" : ""}`}>
                      {node.name}
                    </span>
                  </div>

                  {/* 人员列：可见人员数 / 总人员数 */}
                  <div className="col-span-1 text-sm text-neutral-500" title="可见人员数 / 总人员数">{source ? `${reportVisibleCount(source)} / ${reportTotalCount(source)}` : '—'}</div>

                  {/* 最近同步列 */}
                  <div className="col-span-2 text-sm text-neutral-500">{source?.updated || '—'}</div>

                  {/* 概况列 */}
                  <div className="col-span-4">
                    {source
                      ? <StatusBadge status={source.status} />
                      : <span className="text-xs text-neutral-400">—</span>
                    }
                  </div>
                </div>

                {/* 子节点 */}
                {isExpanded && nodeChildren.map(child => renderNode(child, depth + 1))}
              </div>
            );
          };

          return (
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {/* Column header */}
              <div className="grid grid-cols-12 items-center gap-x-4 border-b border-neutral-200/70 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-neutral-400">
                <div className="col-span-5 pl-7">组织架构</div>
                <div className="col-span-1" title="可见人员数 / 总人员数">可见/总人数</div>
                <div className="col-span-2">最近同步</div>
                <div className="col-span-4">概况</div>
              </div>
              {orgTree.map((node, i) => (
                <div key={node.id} className={i < orgTree.length - 1 ? "border-b border-neutral-200/60" : ""}>
                  {renderNode(node, 0, i === orgTree.length - 1)}
                </div>
              ))}
            </div>
          );
        })() : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(treeSearch.trim()
              ? collectAllSources(orgTree).filter(s => s.name.toLowerCase().includes(treeSearch.toLowerCase()) || s.department?.toLowerCase().includes(treeSearch.toLowerCase()) || s.desc?.toLowerCase().includes(treeSearch.toLowerCase()))
              : collectAllSources(orgTree)
            ).map(source => (
              <button key={source.id} onClick={() => openSource(source)}
                className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 text-left transition-all hover:border-neutral-300 hover:shadow-md" style={{minHeight:"128px"}}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-100 text-neutral-500"><Icon.Timeline /></span>
                    <span className="text-[11px] text-neutral-400">汇报</span>
                  </div>
                  <div className="shrink-0">
                    {reportRetryingIds.has(source.id) ? (
                      <StatusIcon status="解析中" />
                    ) : source.status === "同步失败" ? (
                      <button onClick={(e) => retryReportSource(source, e)}
                        title="点击重试"
                        className="group/retry flex h-6 w-6 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50">
                        <span className="group-hover/retry:hidden"><StatusIcon status="同步失败" /></span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="hidden group-hover/retry:block"><circle cx="12" cy="12" r="10" fill="#ef4444"/><path d="M16 9.5V7m0 2.5h-2.5M16 9.5a4.5 4.5 0 1 0 .9 2.6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    ) : <StatusIcon status={source.status} />}
                  </div>
                </div>
                <div className="mt-2.5 flex-1">
                  <div className="line-clamp-2 text-[14px] font-semibold leading-snug text-neutral-900">{source.name}</div>
                </div>
                <div className="mt-3 flex items-center justify-between pt-1.5">
                  <span className="text-[11px] text-neutral-400">{source.updated}</span>
                  <span className="text-[11px] text-neutral-400" title="可见人员数 / 总人员数">{reportVisibleCount(source)} / {reportTotalCount(source)} 人</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 按日期分组消息（倒序：最新在前）
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const key = msg.date || "未知日期";
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    return Object.entries(groups).sort((a, b) => {
      // 按日期字符串排序（倒序）：5月28日 > 5月27日
      const numA = parseInt(a[0].replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt(b[0].replace(/[^0-9]/g, "")) || 0;
      return numB - numA;
    });
  };

  const getReportTitle = (content) => {
    const clean = content.replace(/^今日进展：\n/, "");
    const circled = clean.match(/[①]([^②③④⑤\n]+)/);
    if (circled) return circled[1].split(/，|。/)[0].trim().substring(0, 28);
    return clean.split(/\n/)[0].split(/，|。/)[0].trim().substring(0, 28);
  };

  const allReportTimelineGroups = (() => {
    if (!selectedSource) return [];
    const groups = {};
    selectedSource.members.forEach(member => {
      member.messages.forEach(msg => {
        const title = getReportTitle(msg.content);
        const date = msg.date || "未知日期";
        if (!groups[date]) groups[date] = [];
        groups[date].push({ member, msg, title });
      });
    });
    return Object.entries(groups).sort((a, b) => {
      const numA = parseInt(a[0].replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt(b[0].replace(/[^0-9]/g, "")) || 0;
      return numB - numA;
    });
  })();
  const reportTimelineGroups = (() => {
    const q = reportTimelineSearch.trim().toLowerCase();
    return allReportTimelineGroups
      .filter(([date]) => !reportSelectedDay || matchGroupDate(date, reportSelectedDay))
      .map(([date, entries]) => [
        date,
        entries.filter(({ member, msg, title }) => {
          if (!q) return true;
          return `${member.name} ${member.role} ${title} ${msg.content}`.toLowerCase().includes(q);
        })
      ])
      .filter(([, entries]) => entries.length > 0);
  })();
  const reportTlIsSearching = reportTimelineSearch.trim().length > 0;
  const openReportOriginal = (memberId) => {
    setSelectedMemberId(memberId);
    setReportTimelineDetail(null);
    setReportTimelineSearchSelected(null);
    setReportTimelineSearch("");
    setReportContentView("list");
  };

  const reportedToday = selectedSource?.members.filter(m => m.status === "今日已汇报" || m.status === "有风险点").length || 0;
  const totalMembers = selectedSource?.members.length || 0;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">

      {/* ── Top bar — 面包屑样式（对齐 MultiContentPage/SingleDocPage）── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-neutral-200/60 bg-white px-5 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <button onClick={() => { setSelectedSource(null); setSelectedMemberId(null); setMemberSearch(""); setReportContentView("list"); }}
            className="shrink-0 max-w-[120px] truncate text-neutral-400 transition-colors hover:text-neutral-700">
            汇报信息源
          </button>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24" className="shrink-0 text-neutral-300"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="truncate font-semibold text-neutral-900">{selectedSource.name}</span>
        </div>
        {/* 视图切换（segmented control） */}
        <div className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 p-0.5">
          <button onClick={() => setReportContentView("list")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${reportContentView === "list" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
            信息列表
          </button>
          <button onClick={() => { setReportContentView("timeline"); setSelectedMemberId(null); setMemberSearch(""); }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${reportContentView === "timeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
            事项视图
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {reportContentView === "timeline" ? (
        <>
        <div className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
          <div className={`overflow-y-auto ${reportTlIsSearching && reportTimelineSearchSelected ? "w-[420px] shrink-0 border-r border-neutral-100" : "flex-1"}`}>
          <div className={(reportTlIsSearching && reportTimelineSearchSelected) ? "px-5 py-6" : "mx-auto w-full max-w-2xl px-6 py-8"}>
            <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-orange-200 bg-white px-5 py-3 shadow-sm shadow-orange-50 focus-within:border-orange-400">
              <input value={reportTimelineSearch} onChange={e => { setReportTimelineSearch(e.target.value); if (!e.target.value.trim()) setReportTimelineSearchSelected(null); }}
                placeholder="搜索事项…"
                className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none" />
              {reportTimelineSearch && (
                <button onClick={() => { setReportTimelineSearch(""); setReportTimelineSearchSelected(null); }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-neutral-300 transition hover:bg-neutral-100 hover:text-neutral-500">
                  <Icon.Close />
                </button>
              )}
            </div>
            {reportTlIsSearching && reportTimelineGroups.length > 0 && (() => {
              const flatCount = reportTimelineGroups.reduce((acc, [, entries]) => acc + entries.length, 0);
              const firstHit = reportTimelineGroups[0]?.[1]?.[0];
              const Ref = ({ n, hi }) => (
                <span className={`mx-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${hi ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-600"}`}>{n}</span>
              );
              return (
                <div className="mb-5 space-y-3">
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                    <p className="text-sm leading-7 text-neutral-700">
                      围绕「{reportTimelineSearch}」共检索到 {flatCount} 条相关汇报事项<Ref n={1} hi/>。
                      主要集中在 {firstHit?.member?.name || "成员"} 提到的「{firstHit?.title || reportTimelineSearch}」等进展上<Ref n={2} hi/>，
                      内容覆盖需求补充、交互稿确认、回归验证与后续计划<Ref n={3} hi={false}/>。
                      AI 已按汇报时间和事项相关度整理排序，点击编号事项可查看完整汇报内容与原始记录<Ref n={4} hi={false}/>。
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-neutral-400">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-orange-400"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      AI 总结参考以下 {flatCount} 条事项
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-orange-600">查看图谱</button>
                    <div className="flex-1" />
                    <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      智能排序
                    </button>
                    <span className="text-neutral-200">|</span>
                    <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      多选
                    </button>
                  </div>
                </div>
              );
            })()}

            {reportTimelineGroups.length === 0 ? (
              <div className="py-16 text-center text-sm text-neutral-400">
                {reportTimelineSearch.trim() ? `未找到「${reportTimelineSearch}」相关事项` : reportSelectedDay ? "该日期暂无事项记录" : "暂无事项记录"}
              </div>
            ) : reportTimelineGroups.map(([date, entries], gi) => (
              <div key={date} className="mb-8">
                <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between bg-white/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                  <div className="flex items-center gap-2">
                    {gi === 0 && reportSelectedDay ? (
                      <>
                        <span className="text-base font-bold text-orange-500">{reportSelectedDay.m}/{reportSelectedDay.d}</span>
                        <span className="text-base font-semibold text-neutral-800">事件</span>
                        <button onClick={() => setReportSelectedDay(null)}
                          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                          title="清除筛选">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </>
                    ) : (
                      <span className="text-base font-bold text-orange-500">{date}</span>
                    )}
                  </div>
                  {gi === 0 && (
                    <div className="flex items-center gap-3">
                      {!reportSelectedDay && (
                        <button onClick={handleReportTimelineRefresh} disabled={reportTimelineRefreshing}
                          title={`上次刷新：${reportTimelineRefreshedAt}`}
                          className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={reportTimelineRefreshing ? "animate-spin" : ""}><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                          {reportTimelineRefreshing ? "刷新中" : "刷新"}
                        </button>
                      )}
                      <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setShowReportTimelineCal(v => !v); }}
                          className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-orange-500">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          往期事件
                        </button>
                        {showReportTimelineCal && <TimelineCalendar
                          calYear={reportCalYear} setCalYear={setReportCalYear}
                          calMonth={reportCalMonth} setCalMonth={setReportCalMonth}
                          selectedDay={reportSelectedDay} setSelectedDay={setReportSelectedDay}
                          availableDays={getAvailableTimelineDays(allReportTimelineGroups.map(([groupDate]) => ({ date: groupDate })))}
                          onClose={() => setShowReportTimelineCal(false)} />}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {entries.map(({ member, msg, title }, idx) => {
                    const detail = { member, msg, title };
                    const isSelected = reportTlIsSearching && reportTimelineSearchSelected
                      && reportTimelineSearchSelected.member.id === member.id
                      && reportTimelineSearchSelected.msg.date === msg.date
                      && reportTimelineSearchSelected.msg.time === msg.time;
                    const globalIdx = reportTlIsSearching
                      ? reportTimelineGroups.slice(0, gi).reduce((acc, group) => acc + group[1].length, 0) + idx + 1
                      : null;
                    return (
                      <button key={`${member.id}-${msg.date}-${msg.time}-${idx}`}
                        onClick={() => reportTlIsSearching ? setReportTimelineSearchSelected(detail) : setReportTimelineDetail(detail)}
                        className={`flex w-full cursor-pointer gap-5 border-b border-neutral-100 py-4 text-left transition-colors -mx-3 rounded-xl px-3 ${isSelected ? "bg-orange-50" : "hover:bg-neutral-50"}`}>
                        {reportTlIsSearching && globalIdx != null ? (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">{globalIdx}</span>
                        ) : (
                          <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{msg.time}</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex min-w-0 items-center gap-2">
                            <span className="truncate text-[14px] font-semibold leading-snug text-neutral-900">{title}</span>
                          </div>
                          <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{msg.content}</div>
                          {reportTlIsSearching && (
                            <div className="mt-1.5 text-[11px] text-neutral-400">{msg.date} {msg.time}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          </div>
          {reportTlIsSearching && reportTimelineSearchSelected && (
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="shrink-0 border-b border-neutral-100 px-8 py-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold leading-snug text-neutral-900">{reportTimelineSearchSelected.title}</h2>
                  <button onClick={() => setReportTimelineSearchSelected(null)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
                    <Icon.Close />
                  </button>
                </div>
                <div className="mt-3 text-xs text-neutral-400">{reportTimelineSearchSelected.msg.date} {reportTimelineSearchSelected.msg.time}</div>
              </div>
              <div className="space-y-5 px-8 py-5">
                <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 whitespace-pre-wrap text-neutral-600">
                  {reportTimelineSearchSelected.msg.content}
                </div>
                <div className="border-t border-neutral-100 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">原文参考</span>
                    <button onClick={() => openReportOriginal(reportTimelineSearchSelected.member.id)}
                      className="text-xs text-orange-500 transition hover:underline">查看原文 →</button>
                  </div>
                  <div className="text-base font-bold text-neutral-900">{reportTimelineSearchSelected.member.name} 的汇报记录</div>
                </div>
              </div>
            </div>
          )}
        </div>
        {reportTimelineDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
            onClick={() => setReportTimelineDetail(null)}>
            <div className="flex w-full max-w-xl flex-col rounded-[24px] bg-white shadow-2xl"
              style={{maxHeight:"86vh"}}
              onClick={e => e.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
                <span className="text-base font-semibold text-neutral-900">事件详情</span>
                <button onClick={() => setReportTimelineDetail(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100">
                  <Icon.Close />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <h2 className="text-[17px] font-bold leading-snug text-neutral-900">{reportTimelineDetail.title}</h2>
                <div className="text-xs text-neutral-400">{reportTimelineDetail.msg.date} {reportTimelineDetail.msg.time}</div>
                <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 whitespace-pre-wrap text-neutral-600">
                  {reportTimelineDetail.msg.content}
                </div>
                <div className="border-t border-neutral-100 pt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">原文参考</span>
                    <button onClick={() => openReportOriginal(reportTimelineDetail.member.id)}
                      className="text-xs text-orange-500 transition hover:underline">查看原文 →</button>
                  </div>
                  <div className="text-base font-bold text-neutral-900">{reportTimelineDetail.member.name} 的汇报记录</div>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      ) : (
      <div className="flex min-h-0 flex-1">

        {/* ── LEFT panel ── */}
        <div className="flex w-64 shrink-0 flex-col overflow-hidden border-r border-neutral-100">

          {/* Recent feed header */}
          <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3">
            <span className="text-xs text-neutral-400">近期信息</span>
            <button onClick={() => { setShowAllMembersModal(true); setAllMembersSearch(""); }}
              className="flex items-center gap-0.5 text-xs text-neutral-400 transition hover:text-orange-500">
              全部
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Recent member feed */}
          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            {[...selectedSource.members]
              .sort((a, b) => {
                const ta = a.messages?.[0] ? `${a.messages[0].date}${a.messages[0].time}` : "";
                const tb = b.messages?.[0] ? `${b.messages[0].date}${b.messages[0].time}` : "";
                return tb.localeCompare(ta);
              })
              .map(member => {
                const latest = member.messages?.find(m => m.sender !== "我");
                const snippet = latest?.content?.split("\n")[0] || "";
                const isSelected = selectedMember?.id === member.id;
                return (
                  <button key={member.id}
                    onClick={() => { setSelectedMemberId(member.id); setReportContentView("list"); }}
                    className={`w-full border-b border-neutral-50 px-4 py-2.5 text-left transition-colors ${isSelected ? "bg-orange-50 border-l-2 border-l-orange-400" : "hover:bg-neutral-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${getAvatarColor(member.name)}`}>{member.avatar}</div>
                      <span className={`flex-1 truncate text-xs font-medium ${isSelected ? "text-orange-700" : "text-neutral-800"}`}>{member.name}</span>
                      {latest && <span className="shrink-0 text-[10px] text-neutral-400">{latest.date} {latest.time}</span>}
                    </div>
                    {snippet && <p className="pl-8 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">{snippet}</p>}
                  </button>
                );
              })}
          </div>
        </div>

        {/* ── RIGHT: content ── */}
        <div className="flex min-h-0 flex-1 flex-col bg-[#f9f8f6]">

          {selectedMember ? (
            /* 信息列表：选中成员的多日汇报 */
            <>
              {/* Member header */}
              <div className="shrink-0 border-b border-neutral-100 bg-white px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(selectedMember.name)}`}>{selectedMember.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-neutral-900">{selectedMember.name}</div>
                    <div className="mt-0.5 text-[11px] text-neutral-400">{selectedMember.role}</div>
                  </div>
                </div>
              </div>

              {/* IM 气泡布局：与会话详情页一致；汇报均为他人发出（左侧气泡），按 5 分钟规则分段展示时间 */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {(() => {
                  const sorted = [...visibleMessages];
                  const avatarColors = ["bg-violet-100 text-violet-600","bg-blue-100 text-blue-600","bg-emerald-100 text-emerald-600","bg-amber-100 text-amber-600","bg-rose-100 text-rose-600"];
                  const colorIdx = selectedMember.name.charCodeAt(0) % avatarColors.length;
                  const initials = selectedMember.name.slice(0, 1);
                  const parseTs = (m) => {
                    const t = m.time || "00:00";
                    const [h, mm] = t.split(":");
                    return { date: m.date, mins: parseInt(h) * 60 + parseInt(mm || "0") };
                  };
                  // 时间分割线格式：今天仅 HH:mm；昨天「昨天 HH:mm」；更早「M月D日 HH:mm」
                  const fmtDivider = (m) => {
                    if (m.date === "今天") return m.time;
                    if (m.date === "昨天") return `昨天 ${m.time}`;
                    return `${m.date} ${m.time}`;
                  };
                  const result = [];
                  let prev = null;
                  sorted.forEach((msg, idx) => {
                    const showDivider = !prev
                      || prev.date !== msg.date
                      || Math.abs(parseTs(prev).mins - parseTs(msg).mins) >= 5;
                    if (showDivider) {
                      result.push(
                        <div key={`d-${idx}`} className="flex items-center justify-center py-1">
                          <span className="text-[11px] text-neutral-400">{fmtDivider(msg)}</span>
                        </div>
                      );
                    }
                    result.push(
                      <div key={idx} className="flex items-start gap-2.5" title={`${msg.date} ${msg.time}`}>
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColors[colorIdx]}`}>
                          {initials}
                        </div>
                        <div className="flex max-w-[72%] flex-col items-start">
                          <div className="mb-1 flex items-baseline gap-1.5">
                            <span className="text-[11px] font-semibold text-neutral-700">{selectedMember.name}</span>
                          </div>
                          <div className="rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                    prev = msg;
                  });
                  return result;
                })()}
                {visibleMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="mb-3 text-neutral-200"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <div className="text-sm text-neutral-400">暂无汇报</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* 未选成员时的空状态 */
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-neutral-200"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <div className="text-sm text-neutral-400">从左侧选择人员查看汇报</div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── All-members modal (triggered by 全部 >) ── */}
      {showAllMembersModal && selectedSource && (
        <div className="fixed bottom-0 right-0 z-50 flex flex-col border-l border-neutral-100 bg-white"
          style={{ left: 256, top: 53 }}>
          <div className="flex shrink-0 items-center justify-between px-8 py-7">
            <h2 className="text-xl font-bold text-neutral-900">全部成员</h2>
            <button onClick={() => setShowAllMembersModal(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-500 text-white transition hover:bg-neutral-700"
              title="关闭">
              <Icon.Close />
            </button>
          </div>
          <div className="px-8 pb-5">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 text-neutral-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input autoFocus value={allMembersSearch} onChange={e => setAllMembersSearch(e.target.value)}
                placeholder="搜索人员"
                className="flex-1 bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400" />
              {allMembersSearch && (
                <button onClick={() => setAllMembersSearch("")} className="text-neutral-300 hover:text-neutral-500">
                  <Icon.Close />
                </button>
              )}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8">
            {(() => {
              const q = allMembersSearch.trim().toLowerCase();
              const list = selectedSource.members.filter(m =>
                !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
              );
              return list.length === 0 ? (
                <div className="py-16 text-center text-sm text-neutral-400">未找到「{allMembersSearch}」</div>
              ) : (
                <div className="space-y-1">
                  {list.map(member => (
                    <button key={member.id}
                      onClick={() => { setSelectedMemberId(member.id); setReportContentView("list"); setShowAllMembersModal(false); }}
                      className={`flex w-full items-center gap-3 rounded-lg px-1 py-2.5 text-left transition hover:bg-neutral-50 ${selectedMember?.id === member.id ? "bg-orange-50" : ""}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${getAvatarColor(member.name)}`}>{member.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-neutral-800">{member.name}</span>
                          {latestMemberMsgTime(member) && <span className="shrink-0 text-xs text-neutral-400">{latestMemberMsgTime(member)}</span>}
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-400">{member.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CONNECTOR PICKER MODAL ─── */
const connectorGroups = [
  { label: "网络抓取", items: [
    { label: "网页爬虫",  Icon: Icon.Globe,  desc: "定时抓取网页正文与更新" },
    { label: "RSS 订阅",  Icon: Icon.Rss,    desc: "持续同步 RSS 文章流" },
    { label: "搜索引擎",  Icon: Icon.Search, desc: "按关键词定期抓取资讯" },
  ]},
  { label: "知识库", items: [
    { label: "飞书知识库", Icon: Icon.BookOpen, desc: "定时同步飞书知识库变更文档" },
  ]},
  { label: "代码平台", items: [
    { label: "GitHub", Icon: Icon.GitHub, desc: "授权读取 README · Issues",    isOAuth: true },
    { label: "GitLab", Icon: Icon.Code,   desc: "授权读取项目文档与 Issues",   isOAuth: true },
    { label: "Gitee",  Icon: Icon.Code,   desc: "授权读取 README · Issues",    isOAuth: true },
  ]},
  { label: "消息平台", items: [
    { label: "企微机器人",    Icon: Icon.Msg, desc: "企业微信群聊消息同步" },
    { label: "飞书机器人",    Icon: Icon.Msg, desc: "飞书群聊 · 文档 · 日历" },
    { label: "飞书CLI",      Icon: Icon.Msg, desc: "飞书群聊消息拉取 · CLI 授权" },
    { label: "SaleSmartly",  Icon: Icon.Msg, desc: "客服会话与工单归档" },
  ]},
  { label: "开发接口", items: [
    { label: "API 接入", Icon: Icon.Code, desc: "自定义结构化数据推送" },
  ]},
];

function ConnectorPickerModal({ onClose, onSelect }) {
  const groups = connectorGroups;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={onClose}>
      <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl" style={{maxHeight:"85vh"}} onClick={e => e.stopPropagation()}>
        <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">连接器</h2>
            <p className="mt-0.5 text-xs text-neutral-500">授权后定时同步外部数据到信息源</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"><Icon.Close /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {groups.map(g => (
            <div key={g.label}>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{g.label}</div>
              <div className="grid grid-cols-3 gap-2">
                {g.items.map(item => (
                  <button key={item.label} onClick={() => onSelect(item)}
                    className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 text-left transition hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-sm">
                    <span className="mt-0.5 shrink-0 text-neutral-500"><item.Icon /></span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium text-neutral-800">{item.label}</span>
                        {item.isOAuth && <span className="rounded bg-blue-50 px-1 py-0.5 text-[10px] font-medium text-blue-500">OAuth</span>}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-neutral-400">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PUBLIC SOURCES DATA ─── */
const publicSources = [
  { id: "pub1",  name: "OpenAI 官方博客",       source: "RSS 订阅",  provider: "OpenAI",       avatar: { s: "OA",  bg: "#111827", fg: "#fff" }, desc: "来自 OpenAI 的官方产品动态、模型发布说明、安全研究与前沿技术解读，第一时间同步 GPT 系列的能力演进与开发者生态更新", tags: ["AI", "科技", "前沿研究"], updated: "今天 09:12",    itemCount: 247  },
  { id: "pub2",  name: "科技日报",               source: "网页爬虫",  provider: "科技日报社",     avatar: { s: "科技", bg: "#dc2626", fg: "#fff" }, desc: "国内权威科技媒体，聚焦政策与产业动态",            tags: ["科技", "政策", "国内"],   updated: "今天 08:30",    itemCount: 1240 },
  { id: "pub3",  name: "国家发改委新闻",          source: "网页爬虫",  provider: "国家发改委",     avatar: { s: "发改", bg: "#1d4ed8", fg: "#fff" }, desc: "国家发展和改革委员会发布的宏观经济政策、五年规划纲要、重大项目审批公示及产业发展指导意见的权威解读与官方公告汇总", tags: ["政策", "政治", "经济"],   updated: "昨天 18:00",    itemCount: 832  },
  { id: "pub4",  name: "Hacker News 精选",       source: "RSS 订阅",  provider: "Y Combinator", avatar: { s: "HN",  bg: "#f97316", fg: "#fff" }, desc: "来自 HN 的高质量技术讨论与创业资讯",             tags: ["技术", "AI", "开源"],     updated: "今天 07:00",    itemCount: 560  },
  { id: "pub5",  name: "MIT Technology Review",  source: "RSS 订阅",  provider: "MIT",          avatar: { s: "MIT", bg: "#374151", fg: "#fff" }, desc: "MIT 科技评论，聚焦技术与社会影响的前沿报道",      tags: ["AI", "学术", "科技"],     updated: "昨天 20:00",    itemCount: 380  },
  { id: "pub6",  name: "36Kr 前沿科技",           source: "RSS 订阅",  provider: "36氪",         avatar: { s: "36K", bg: "#16a34a", fg: "#fff" }, desc: "国内创投和科技创业报道，聚焦融资与产业趋势",      tags: ["科技", "商业", "创投"],   updated: "今天 10:00",    itemCount: 2100 },
  { id: "pub7",  name: "中国人民银行公告",         source: "网页爬虫",  provider: "中国人民银行",   avatar: { s: "央行", bg: "#991b1b", fg: "#fff" }, desc: "央行货币政策、金融监管相关官方公告",              tags: ["财经", "政策", "金融"],   updated: "5月27日 16:00", itemCount: 412  },
  { id: "pub8",  name: "ArXiv AI 论文速递",       source: "RSS 订阅",  provider: "arXiv",        avatar: { s: "Ar",  bg: "#0d9488", fg: "#fff" }, desc: "arxiv.org 最新机器学习与 AI 领域预印本",          tags: ["AI", "学术", "技术"],     updated: "今天 06:30",    itemCount: 5120 },
  { id: "pub9",  name: "Reuters 科技频道",        source: "RSS 订阅",  provider: "Reuters",      avatar: { s: "R",   bg: "#ea580c", fg: "#fff" }, desc: "路透社全球科技与商业新闻",                        tags: ["国际", "科技", "商业"],   updated: "今天 08:00",    itemCount: 1830 },
  { id: "pub10", name: "工业和信息化部政策",       source: "网页爬虫",  provider: "工业和信息化部", avatar: { s: "工信", bg: "#2563eb", fg: "#fff" }, desc: "工信部 AI、数字化、工业互联网相关政策与公告",      tags: ["政策", "产业", "AI"],     updated: "昨天 14:00",    itemCount: 298  },
  { id: "pub11", name: "GitHub Trending",         source: "网页爬虫",  provider: "GitHub",       avatar: { s: "GH",  bg: "#1e293b", fg: "#fff" }, desc: "GitHub 每日 trending 仓库，聚焦 AI 与开源热点",  tags: ["开源", "技术", "AI"],     updated: "今天 00:30",    itemCount: 730  },
  { id: "pub12", name: "第一财经",                 source: "RSS 订阅",  provider: "第一财经",      avatar: { s: "财",  bg: "#1e40af", fg: "#fff" }, desc: "财经市场、上市公司与宏观经济深度报道",            tags: ["财经", "商业", "国内"],   updated: "今天 09:45",    itemCount: 3200 },
];

/* ─── PUBLIC SOURCE DETAIL ─── */
const _pubFeed = [
  { id:"f1", time:"10:07", title:"前火箭主帅里克·阿德尔曼离世及执教生涯回顾", summary:"前火箭主帅里克·阿德尔曼于6月2日离世享年79岁，其NBA执教生涯长达29年累计取得1042胜并入选名人堂，曾推行普林斯顿战术率国王打进西决，并于火箭时期助姚明达成生涯巅峰。", source:"腾讯体育", tags:[{prop:"人物",val:"阿德尔曼"},{prop:"组织",val:"休斯顿火箭"},{prop:"指标",val:"1042胜"},{prop:"时间",val:"6月2日"}], content:"前火箭主帅、名人堂成员里克·阿德尔曼于6月2日离世，享年79岁（1946-2026）。美国国家篮球教练协会（NCBA）通过发文及发布黑凤格纪念海报予以悼念，该协会曾于2023年向其颁发『查克·戴利终身成就奖』。\n\n阿德尔曼在NBA的执教生涯共计29年，其中有23个赛季担任主教练，先后执掌过波特兰开拓者队、金州勇士队、萨克拉门托国王队、休斯顿火箭队及明尼苏达森林狼队。执教生涯总胜场 1042 场，历史排名第四。\n\n在萨克拉门托国王期间，阿德尔曼引入普林斯顿体系，将球队打造为彼时联盟最具观赏性的球队之一，2002年率队打进西部决赛，险些创造历史。在火箭期间，他充分发挥姚明与麦迪的双核优势，使球队多次进入季后赛。" },
  { id:"f2", time:"09:38", title:"广西北海铁山港区靶向纠治农村供水工程管护乱象", summary:"针对群众反映的水费账目不公开与管网维修滞后问题，铁山港区纪委监委启动联动调研摸清权责，通过厘清管护职责、推行管水员动态考核与工资财政统发，落实用水费收支公开等措施解决供水管护问题。", source:"新浪国内", tags:[{prop:"地点",val:"广西北海"},{prop:"行为",val:"纪检督察"},{prop:"群体",val:"农村居民"}], content:"" },
  { id:"f3", time:"09:37", title:"广西富川某村原副书记毛某挪用集体资金理财案", summary:"广西贺州富川瑶族自治县某村集体资金账目异常引发巡察核查，查实原党总支副书记毛某在2020年3月至2021年4月间私自将40万元集体资金挪购个人理财产品并侵吞收益，毛某受党内警告处分。", source:"新浪国内", tags:[{prop:"地点",val:"广西贺州"},{prop:"行为",val:"违纪处分"},{prop:"指标",val:"40万元"}], content:"" },
  { id:"f4", time:"08:55", title:"GPT-4o 原生音频输出 API 正式向开发者开放", summary:"OpenAI 宣布 GPT-4o 的原生音频输出能力向所有 API 用户开放，支持 24 种语言的实时语音生成，延迟低至 320ms，可直接输出 WAV/PCM 格式音频流。", source:"OpenAI", tags:[{prop:"组织",val:"OpenAI"},{prop:"行为",val:"API发布"},{prop:"指标",val:"24种语言"}], content:"" },
  { id:"f5", time:"08:30", title:"Meta 开源 Llama 3.2 Vision 多模态模型", summary:"Meta 正式开源 Llama 3.2 Vision 系列，包含 11B 和 90B 两个版本，支持图文理解任务，在多项视觉理解基准上超越同等参数量的闭源模型。", source:"Meta AI", tags:[{prop:"组织",val:"Meta"},{prop:"行为",val:"开源发布"},{prop:"指标",val:"90B参数"}], content:"" },
];
const publicFeedArticles = { default: _pubFeed };

/* ─── INFORMATION SOURCE SEARCH ─── */
const sourceSearchEvents = [
  {
    id: "search-red-dream",
    time: "00:06",
    title: "终极典藏版《红楼梦》首发及核心优势",
    summary: "《红楼梦》作为四大名著之首蕴含处世智慧，终极典藏版由周汝昌校订，汇11部古抄本、集3000条脂砚斋批语，配多维注释与美学内容，首发价299元限时3天限量300套。",
    source: "青年文摘",
    relatedCount: 11,
    tags: [{ prop: "产品", val: "终极典藏版《红楼梦》" }, { prop: "指标", val: "3000条" }, { prop: "指标", val: "300套" }, { prop: "人物", val: "周汝昌" }],
    content: "《红楼梦》作为四大名著之首，是蕴含人情世故与处世智慧的经典，近百万读者评分超9.8分；本次推出的终极典藏版由红学泰斗周汝昌历时五年校订，汇入11部学术界公认早期古抄本，集齐8大脂评本共3000条脂砚斋原始批语，配置12维度随文注释、53个趣味专题、8大美学主题内容及清宫廷画师孙温红楼画作。",
    articleTitle: "《红楼梦》：真正的情商高，不是八面玲珑、能说会道，而是走到人前，被无限信任",
  },
  {
    id: "search-ai-publishing",
    time: "00:06",
    title: "多领域资讯汇总：AI产业动态、出版推广及社会乱象",
    summary: "AI全产业链呈现分化与乱象：上游代工领域台积电产能下调、英特尔亏损扩大，中游AI生成内容同质化、伦理争议频发，冲击多行业并引发创作者抵制；同期《青年文摘》推进订阅推广。",
    source: "青年文摘",
    relatedCount: 15,
    tags: [{ prop: "行业", val: "AI产业" }, { prop: "行为", val: "出版推广" }, { prop: "主题", val: "社会乱象" }],
    content: "人工智能产业链近期呈现明显分化。上游芯片和代工企业调整产能，中游生成式内容快速扩张的同时，同质化、版权和伦理争议也在增加。多家出版机构开始尝试以主题订阅和精选内容建立更稳定的读者连接。",
    articleTitle: "AI产业分化加剧，内容行业如何寻找新的价值锚点",
  },
  {
    id: "search-sukamuljo",
    time: "00:05",
    title: "苏卡穆约吉德翁何时登顶男双世界第一？",
    summary: "印尼男双组合苏卡穆约/吉德翁凭借连续的巡回赛冠军和稳定积分，在赛季中段登顶世界第一，并以快速连贯和前场压迫打法成为当时最具代表性的男双组合。",
    source: "羽毛球杂志",
    relatedCount: 8,
    tags: [{ prop: "人物", val: "苏卡穆约" }, { prop: "人物", val: "吉德翁" }, { prop: "指标", val: "世界第一" }],
    content: "苏卡穆约与吉德翁在多个超级系列赛中连续夺冠，依靠稳定积分完成世界排名跃升。他们的速度、轮转以及前三拍控制，改变了男双比赛对节奏的理解。",
    articleTitle: "小黄人组合登顶世界第一的关键节点",
  },
  {
    id: "search-economy",
    time: "00:05",
    title: "消费市场观察：文化产品与年轻用户的新连接",
    summary: "文化内容消费正从单次购买转向收藏、社群和知识服务相结合的长期关系，年轻用户更看重版本质量、内容策划与持续互动。",
    source: "第一财经",
    relatedCount: 6,
    tags: [{ prop: "行业", val: "文化消费" }, { prop: "群体", val: "年轻用户" }],
    content: "越来越多文化产品开始以策划型内容、收藏价值和社群服务形成差异化。用户不再只比较价格，也会判断内容的可信度、版本稀缺性与长期服务能力。",
    articleTitle: "年轻人为何愿意为高质量文化内容买单",
  },
];

function SourceSearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [scope, setScope] = useState("public");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [expanded, setExpanded] = useState(new Set());

  const submitSearch = () => setSubmittedQuery(query.trim());
  const visibleEvents = useMemo(() => {
    const scopeEvents = scope === "personal" ? sourceSearchEvents.slice(0, 2) : sourceSearchEvents;
    const keyword = submittedQuery.toLowerCase();
    if (!keyword) return scopeEvents;
    const matched = scopeEvents.filter(event => [event.title, event.summary, event.source, event.content, event.articleTitle]
      .join(" ").toLowerCase().includes(keyword));
    return matched.length ? matched : scopeEvents;
  }, [scope, submittedQuery]);

  const toggleRelated = (id) => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-white" onClick={() => setScopeOpen(false)}>
      <div className="mx-auto w-full max-w-[860px] px-8 pb-14 pt-9">
        <h1 className="text-center text-[30px] font-bold tracking-tight text-neutral-900">信息源搜索</h1>

        <div className="mt-8 rounded-2xl border border-orange-300 bg-white px-5 pb-4 pt-4 shadow-[0_12px_34px_rgba(249,115,22,0.05)] focus-within:border-orange-400">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitSearch()}
            placeholder="苏卡穆约吉德翁何时登顶男双世界第一？"
            className="h-11 w-full bg-transparent text-[15px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
            aria-label="搜索信息源"
          />
          <div className="flex items-center justify-between">
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setScopeOpen(v => !v)} className="flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-800">
                <span>搜索范围：</span>
                <span className="text-[#a98252]">{scope === "public" ? "公共信息" : "个人信息"}</span>
                <i className={scopeOpen ? "ri-arrow-up-s-line text-[#a98252]" : "ri-arrow-down-s-line text-[#a98252]"} />
              </button>
              {scopeOpen && (
                <div className="absolute left-10 top-7 z-20 w-[132px] overflow-hidden rounded-lg border border-neutral-100 bg-white py-1.5 shadow-lg">
                  <button onClick={() => { setScope("public"); setScopeOpen(false); }} className={`flex w-full items-center px-4 py-2 text-left text-sm ${scope === "public" ? "text-[#9a6f3d]" : "text-neutral-600 hover:bg-neutral-50"}`}>公共信息源</button>
                  <button onClick={() => { setScope("personal"); setScopeOpen(false); }} className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${scope === "personal" ? "text-[#9a6f3d]" : "text-neutral-500 hover:bg-neutral-50"}`}>
                    个人信息 <i className="ri-edit-2-line text-neutral-400" />
                  </button>
                </div>
              )}
            </div>
            <button onClick={submitSearch} className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600" aria-label="搜索">
              <i className="ri-arrow-right-line text-lg" />
            </button>
          </div>
        </div>

        <div className="mb-4 mt-8 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-semibold text-[#a47a49]">7/13</span>
            <span className="text-[17px] font-semibold text-[#a47a49]">每日事件</span>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-orange-500">
            <i className="ri-history-line text-base" /> 往期事件
          </button>
        </div>

        <div className="space-y-4">
          {visibleEvents.map(event => (
            <div key={event.id} className="grid grid-cols-[64px_1fr] gap-0">
              <div className="relative pr-5 pt-3 text-left text-sm text-slate-400">
                {event.time}
                <span className="absolute bottom-0 right-0 top-0 w-px bg-slate-200" />
              </div>
              <div className="ml-5 overflow-hidden rounded-lg border border-neutral-100 bg-[#fffdfa] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
                <button onClick={() => setDetail(event)} className="block w-full px-7 pb-2 pt-5 text-left transition hover:bg-orange-50/30">
                  <h2 className="text-[16px] font-semibold leading-6 text-neutral-900">{event.title}</h2>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-500">{event.summary}</p>
                </button>
                <div className="flex items-center justify-between px-7 pb-4 pt-1">
                  <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white">青</span>
                    {event.source}
                  </span>
                  <button onClick={() => toggleRelated(event.id)} className="flex items-center gap-1 text-xs text-amber-500 transition hover:text-amber-600">
                    {event.relatedCount}个相关子事项 <i className={expanded.has(event.id) ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
                  </button>
                </div>
                {expanded.has(event.id) && (
                  <div className="border-t border-orange-100 bg-orange-50/40 px-7 py-3 text-sm text-neutral-600">
                    已展开相关子事项：人物、产品、时间与指标等属性均可继续查看。
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5" onClick={() => setDetail(null)}>
          <div className="flex w-full max-w-[512px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl" style={{ maxHeight: "82vh" }} onClick={e => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-7">
              <h2 className="text-[20px] font-semibold text-neutral-900">事件详情</h2>
              <button onClick={() => setDetail(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-800 transition hover:bg-neutral-100" aria-label="关闭">
                <i className="ri-close-line text-2xl" />
              </button>
            </div>
            <div className="mx-6 border-t border-neutral-200" />
            <div className="flex-1 overflow-y-auto px-10 pb-8 pt-4">
              <h3 className="text-[17px] font-semibold leading-6 text-neutral-900">{detail.title}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {detail.tags.map((tag, index) => (
                  <span key={`${tag.prop}-${index}`} className="bg-neutral-50 px-2 py-1 text-[11px] text-neutral-400">{tag.prop}-{tag.val}</span>
                ))}
              </div>
              <p className="mt-2 bg-neutral-50 px-5 py-3 text-[13px] leading-5 text-neutral-600">{detail.summary}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-neutral-500">原文参考</span>
                <button className="text-blue-500 transition hover:underline">查看链接</button>
              </div>
              <div className="mt-8 text-center text-[19px] font-semibold leading-7 text-slate-700">{detail.articleTitle}</div>
              <div className="mt-5 whitespace-pre-line text-[14px] leading-8 text-slate-600">{detail.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PublicSourceDetail({ item, onBack }) {
  const [query, setQuery]               = useState("");
  const [activeQuery, setActiveQuery]   = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalArticle, setModalArticle] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear,  setCalYear]   = useState(2026);
  const [calMonth, setCalMonth]  = useState(5);   // 0-indexed; 5 = June
  const [feedDay,  setFeedDay]   = useState({ m: 6, d: 2 });

  const feed = publicFeedArticles[item.id] || publicFeedArticles["default"];

  const submitQuery = () => { if (query.trim()) { setActiveQuery(query.trim()); setSelectedArticle(null); } };
  const clearQuery  = () => { setActiveQuery(""); setQuery(""); setSelectedArticle(null); };

  const mockAnswer = activeQuery
    ? `根据「${item.name}」中 ${feed.length} 条相关资料的分析，关于「${activeQuery}」的核心结论如下：当前各方数据整体呈积极趋势，多个权威来源对该议题持一致判断。①从定量指标来看，相关数值表现超出市场预期；②从行业视角来看，主流机构普遍认为短期内不确定因素可控；③从历史对比来看，此次情况与近三年同期相比仍属正常范围。以下参考资料均来自本信息源的最新内容。`
    : "";

  const TagChips = ({ tags }) => tags?.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t, i) => (
        <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
          <span className="font-medium text-neutral-400">{t.prop}-</span>{t.val}
        </span>
      ))}
    </div>
  ) : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white" onClick={() => { setModalArticle(null); setShowCalendar(false); }}>
      {/* ── Header: back + source identity (shared by both views) ── */}
      <div className="flex shrink-0 items-center gap-4 border-b border-neutral-100 bg-white px-5 py-3">
        <button onClick={onBack} className="flex shrink-0 items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-700">
          <Icon.Back /> 返回
        </button>
        <div className="h-8 w-px bg-neutral-100" />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold leading-none shadow-sm"
          style={{ background: item.avatar.bg, color: item.avatar.fg }}>
          {item.avatar.s}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-center gap-2">
            <h1 className="shrink-0 text-[15px] font-bold text-neutral-900">{item.name}</h1>
            <div className="flex min-w-0 flex-wrap gap-1">
              {item.tags.map(t => (
                <span key={t} className="rounded-full bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-500 ring-1 ring-inset ring-neutral-100">{t}</span>
              ))}
            </div>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-neutral-400">{item.desc}</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {activeQuery ? (
          /* ── Search result view ── */
          <>
            {/* Left: answer + sources */}
            <div className="flex w-[400px] shrink-0 flex-col overflow-hidden border-r border-neutral-100 bg-white">
              {/* Active query chip */}
              <div className="flex shrink-0 items-center gap-2 border-b border-neutral-100 px-4 py-3">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-neutral-700 font-medium">
                  {activeQuery}
                </div>
                <button onClick={clearQuery} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                  <Icon.Close />
                </button>
              </div>
              {/* AI answer with inline refs */}
              <div className="shrink-0 overflow-y-auto border-b border-neutral-100 px-5 py-4" style={{maxHeight:"220px"}}>
                {(() => {
                  const Ref = ({ n, hi }) => (
                    <span className={`mx-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${hi ? "bg-orange-500 text-white" : "bg-neutral-200 text-neutral-600"}`}>{n}</span>
                  );
                  return (
                    <p className="text-sm leading-7 text-neutral-700">
                      围绕{activeQuery}的争议，外界普遍认为其固守风格已阻碍职业生涯发展。尽管仍是联盟纯粹得分手，30岁后13次砍下40+展现高效终结能力<Ref n={1} hi/>，但其拒绝适应新趋势导致定位尴尬<Ref n={2} hi={false}/><Ref n={3} hi={false}/>。近期比赛中，他常因效率低下和防守短板表现低迷，被球迷视为"负资产"且交易无人问津<Ref n={4} hi/><Ref n={5} hi={false}/>。数据显示，其本赛季得分创近15年新低，虽命中率有所回升但仍受限于出手选择<Ref n={6} hi/>。分析指出，若不提升投射适应性，将难以获得争冠球队青睐，注定与总冠军无缘<Ref n={1} hi={false}/><Ref n={2} hi/>。
                    </p>
                  );
                })()}
                <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-400">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-orange-400"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  AI 总结参考以下 {feed.length} 个数据
                </div>
              </div>
              {/* Toolbar */}
              <div className="flex shrink-0 items-center gap-2 border-b border-neutral-100 px-4 py-2.5">
                <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-orange-600">查看图谱</button>
                <div className="flex-1" />
                <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  智能排序
                </button>
                <span className="text-neutral-200">|</span>
                <button className="flex items-center gap-1 text-[11px] text-neutral-500 transition hover:text-neutral-700">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  多选
                </button>
              </div>
              {/* Source list */}
              <div className="flex-1 overflow-y-auto">
                {feed.map((a, i) => {
                  const srcColor = ["bg-red-500","bg-blue-500","bg-emerald-500","bg-violet-500","bg-amber-500"][i % 5];
                  return (
                    <button key={a.id} onClick={() => setSelectedArticle(a)}
                      className={`w-full border-b border-neutral-50 px-4 py-3.5 text-left transition-colors ${selectedArticle?.id === a.id ? "bg-orange-50 border-r-2 border-r-orange-400" : "hover:bg-neutral-50"}`}>
                      <div className="mb-1 text-sm font-semibold leading-snug text-neutral-800">{i+1}、{a.title}</div>
                      <div className="mb-2.5 line-clamp-3 text-[12px] leading-relaxed text-neutral-500">{a.summary}</div>
                      <div className="flex items-center gap-1.5">
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white ${srcColor}`}>{a.source.slice(0,1)}</span>
                        <span className="text-[11px] text-neutral-500">{a.source}</span>
                        <span className="ml-auto text-[10px] text-neutral-400">{a.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: article detail or placeholder */}
            <div className="flex flex-1 flex-col overflow-hidden bg-white">
              {selectedArticle ? (<>
                <div className="shrink-0 border-b border-neutral-100 px-8 py-5">
                  <h2 className="text-xl font-bold leading-snug text-neutral-900">{selectedArticle.title}</h2>
                  <div className="mt-3"><TagChips tags={selectedArticle.tags} /></div>
                </div>
                <div className="flex-1 overflow-y-auto px-8 py-5 space-y-5">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{selectedArticle.summary}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">原文参考</span>
                    <button className="text-xs text-orange-500 transition hover:underline">查看链接 →</button>
                  </div>
                  <div className="text-base font-bold text-neutral-900">{selectedArticle.title}</div>
                  {selectedArticle.content && <div className="text-sm leading-8 text-neutral-700 whitespace-pre-line">{selectedArticle.content}</div>}
                </div>
              </>) : (
                <div className="flex flex-1 items-center justify-center text-sm text-neutral-300">← 从左侧选择参考资料</div>
              )}
            </div>
          </>
        ) : (
          /* ── Default: daily feed view ── */
          <div className="flex-1 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mx-auto max-w-2xl px-6 py-8">
              {/* Search bar */}
              <div className="mb-8 flex items-center gap-3 rounded-2xl border-2 border-orange-200 bg-white px-5 py-3 shadow-sm shadow-orange-50 focus-within:border-orange-400">
                <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && submitQuery()}
                  placeholder="搜索或向 AI 提问…"
                  className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none" />
                <button onClick={submitQuery}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>
              {/* Date header + calendar */}
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-orange-500">{feedDay.m}/{feedDay.d}</span>
                  <span className="text-base font-semibold text-neutral-800">每日事件</span>
                </div>
                <button onClick={e => { e.stopPropagation(); setShowCalendar(v => !v); }}
                  className="flex items-center gap-1 text-xs text-neutral-400 transition hover:text-orange-500">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  往期事件
                </button>
                {showCalendar && (() => {
                  const daysInMonth   = new Date(calYear, calMonth + 1, 0).getDate();
                  const daysInPrev    = new Date(calYear, calMonth, 0).getDate();
                  const firstWeekday  = (() => { const d = new Date(calYear, calMonth, 1).getDay(); return d === 0 ? 6 : d - 1; })();
                  const totalCells    = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
                  const cells = Array.from({ length: totalCells }, (_, i) => {
                    const day = i - firstWeekday + 1;
                    if (day < 1)             return { day: daysInPrev + day, cur: false };
                    if (day > daysInMonth)   return { day: day - daysInMonth, cur: false };
                    return { day, cur: true };
                  });
                  const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
                  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); };
                  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); };
                  const isToday = (d, cur) => cur && calYear === 2026 && calMonth === 5 && d === 2;
                  const isSelected = (d, cur) => cur && calYear === 2026 && calMonth === (feedDay.m - 1) && d === feedDay.d;
                  return (
                    <div className="absolute right-0 top-7 z-30 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100"
                      onClick={e => e.stopPropagation()}>
                      {/* Nav */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                        <div className="flex gap-0.5">
                          <button onClick={() => { setCalYear(y => y-1); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">«</button>
                          <button onClick={prevMonth}                      className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">‹</button>
                        </div>
                        <span className="text-sm font-semibold text-neutral-700">{monthNames[calMonth]} {calYear}年</span>
                        <div className="flex gap-0.5">
                          <button onClick={nextMonth}                      className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">›</button>
                          <button onClick={() => { setCalYear(y => y+1); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 text-xs">»</button>
                        </div>
                      </div>
                      {/* Weekday headers */}
                      <div className="grid grid-cols-7 px-3 pt-2 pb-1">
                        {["一","二","三","四","五","六","日"].map(d => (
                          <div key={d} className="flex h-8 items-center justify-center text-[11px] text-neutral-400">{d}</div>
                        ))}
                      </div>
                      {/* Day cells */}
                      <div className="grid grid-cols-7 px-3 pb-2">
                        {cells.map((c, i) => (
                          <button key={i} disabled={!c.cur}
                            onClick={() => { setFeedDay({ m: calMonth + 1, d: c.day }); setShowCalendar(false); }}
                            className={`flex h-8 items-center justify-center rounded-full text-sm transition-colors
                              ${!c.cur ? "text-neutral-300 cursor-default" : ""}
                              ${c.cur && isSelected(c.day, c.cur) ? "bg-orange-500 text-white font-semibold" : ""}
                              ${c.cur && isToday(c.day, c.cur) && !isSelected(c.day, c.cur) ? "border border-orange-400 text-orange-500 font-semibold" : ""}
                              ${c.cur && !isSelected(c.day, c.cur) && !isToday(c.day, c.cur) ? "text-neutral-700 hover:bg-orange-50 hover:text-orange-500" : ""}`}>
                            {c.day}
                          </button>
                        ))}
                      </div>
                      {/* Today shortcut */}
                      <div className="border-t border-neutral-100 px-4 py-2.5">
                        <button onClick={() => { setCalYear(2026); setCalMonth(5); setFeedDay({ m: 6, d: 2 }); setShowCalendar(false); }}
                          className="w-full text-center text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                          今天
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* Feed */}
              <div>
                {feed.map(article => (
                  <div key={article.id} onClick={e => { e.stopPropagation(); setModalArticle(article); }}
                    className="flex cursor-pointer gap-5 border-b border-neutral-100 py-4 transition-colors hover:bg-neutral-50 -mx-3 px-3 rounded-xl">
                    <span className="w-10 shrink-0 text-right text-xs text-neutral-400 pt-0.5">{article.time}</span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-[14px] font-semibold leading-snug text-neutral-900">{article.title}</div>
                      <div className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{article.summary}</div>
                      <div className="mt-1.5 text-[11px] text-neutral-400">{article.source}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Article detail modal (default view) ── */}
      {modalArticle && !activeQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
          onClick={() => setModalArticle(null)}>
          <div className="flex w-full max-w-xl flex-col rounded-[24px] bg-white shadow-2xl" style={{maxHeight:"86vh"}}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
              <span className="text-base font-semibold text-neutral-900">事件详情</span>
              <button onClick={() => setModalArticle(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon.Close /></button>
            </div>
            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <h2 className="text-[17px] font-bold leading-snug text-neutral-900">{modalArticle.title}</h2>
              <TagChips tags={modalArticle.tags} />
              {/* AI summary box */}
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-7 text-neutral-600">{modalArticle.summary}</div>
              {/* Source ref */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="text-xs text-neutral-400">原文参考</span>
                <button className="text-xs text-orange-500 transition hover:underline">查看链接 →</button>
              </div>
              {/* Article headline repeated as section break */}
              <div className="text-base font-bold text-neutral-900">{modalArticle.title}</div>
              {/* Content */}
              {modalArticle.content && (
                <div className="text-sm leading-8 text-neutral-700 whitespace-pre-line">{modalArticle.content}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PUBLIC SOURCES PAGE ─── */
const ALL_PUBLIC_TAGS = ["全部", ...Array.from(new Set(publicSources.flatMap(s => s.tags)))];

function PublicSourcesPage({ onSelectItem, search: searchProp, setSearch: setSearchProp, view: viewProp, setView: setViewProp }) {
  const [searchLocal, setSearchLocal] = useState("");
  const [viewLocal, setViewLocal]     = useState("card"); // "card" | "list"
  const search    = searchProp    ?? searchLocal;
  const setSearch = setSearchProp ?? setSearchLocal;
  const view      = viewProp      ?? viewLocal;
  const setView   = setViewProp   ?? setViewLocal;
  const [activeTag, setActiveTag] = useState("全部");

  const filtered = publicSources.filter(s =>
    (activeTag === "全部" || s.tags.includes(activeTag)) &&
    (!search.trim() || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const TagChip = ({ tag }) => (
    <button onClick={() => setActiveTag(tag)}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
        activeTag === tag
          ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
          : "bg-white text-neutral-500 hover:bg-orange-50 hover:text-orange-500 border border-neutral-200 hover:border-orange-200"
      }`}>{tag}</button>
  );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      {/* ── Toolbar：仅保留标签筛选（搜索与视图切换已提升到顶部 tab 行） ── */}
      <div className="shrink-0 px-8 pt-5 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ALL_PUBLIC_TAGS.map(tag => <TagChip key={tag} tag={tag} />)}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-8 pb-8">
        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-300">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div className="text-sm font-medium text-neutral-500">未找到匹配的公共信息源</div>
            <div className="mt-1 text-xs text-neutral-400">换个关键词或标签试试</div>
          </div>
        )}

        {/* Card grid */}
        {view === "card" && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(src => (
              <div key={src.id} onClick={() => onSelectItem(src)}
                className="group flex cursor-pointer flex-col rounded-2xl border border-neutral-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50"
                style={{ minHeight: "168px" }}>
                {/* 头像 + 名称 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold leading-none shadow-sm transition-transform group-hover:scale-105"
                    style={{ background: src.avatar.bg, color: src.avatar.fg }}>
                    {src.avatar.s}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-[15px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-orange-600">{src.name}</div>
                  </div>
                  <span className="shrink-0 text-neutral-200 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                  </span>
                </div>
                {/* 描述 */}
                <p className="mt-3 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-neutral-500">{src.desc}</p>
                {/* 标签 */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {src.tags.map(t => (
                    <span key={t} className="rounded-full bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-500 ring-1 ring-inset ring-neutral-100">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {view === "list" && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
            {/* Header */}
            <div className="grid border-b border-neutral-100 bg-neutral-50/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-400"
              style={{ gridTemplateColumns: "minmax(0,2.2fr) minmax(0,3fr) minmax(0,2fr) 110px" }}>
              <div>名称</div>
              <div>描述</div>
              <div>标签</div>
              <div className="text-right">最近更新</div>
            </div>
            {/* Rows */}
            {filtered.map((src, i) => (
                <div key={src.id} onClick={() => onSelectItem(src)}
                  className={`group grid cursor-pointer items-center px-5 py-3.5 text-sm transition-colors hover:bg-orange-50/40 ${i > 0 ? "border-t border-neutral-100" : ""}`}
                  style={{ gridTemplateColumns: "minmax(0,2.2fr) minmax(0,3fr) minmax(0,2fr) 110px" }}>
                  {/* Name */}
                  <div className="flex min-w-0 items-center gap-3 pr-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold leading-none shadow-sm"
                      style={{ background: src.avatar.bg, color: src.avatar.fg }}>{src.avatar.s}</div>
                    <div className="truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-orange-600">{src.name}</div>
                  </div>
                  {/* Desc */}
                  <div className="truncate pr-4 text-[12.5px] text-neutral-400">{src.desc}</div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pr-3">
                    {src.tags.map(t => (
                      <span key={t} className="rounded-full bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-500 ring-1 ring-inset ring-neutral-100">{t}</span>
                    ))}
                  </div>
                  {/* Updated */}
                  <div className="text-right text-xs text-neutral-400">{src.updated}</div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
const TABS = ["全部", "我创建的", "与我共享"];

function InfoSourcePage({ onNavigate, initialNavPage, initialDetailName }) {
  const [navPage, setNavPage]       = useState(initialNavPage || "mine"); // "search" | "mine" | "shared" | "report" | "public"
  const [page, setPage]             = useState("home");
  const [detailItem, setDetailItem]   = useState(null);
  const [publicDetail, setPublicDetail] = useState(null);
  const [view, setView]             = useState("card");
  const [timeMode, setTimeMode]     = useState("updated"); // "updated" | "created"
  const [tab, setTab]               = useState("全部");
  const [showAdd, setShowAdd]             = useState(false);
  const [showAddMode, setShowAddMode]     = useState("upload"); // "upload" | "connector"
  const [showAddInitSrc, setShowAddInitSrc] = useState(null);
  const [showCreateSource, setShowCreateSource]     = useState(false);
  const [createSourceTab, setCreateSourceTab]       = useState("upload");
  const [showConnectorPicker, setShowConnectorPicker] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [pendingFolderName, setPendingFolderName] = useState(null);
  const [showNotePicker, setShowNotePicker]       = useState(false);
  const [noteEditorFolderId, setNoteEditorFolderId] = useState(null);
  const [noteEditorOpen, setNoteEditorOpen]       = useState(false);
  const [selected, setSelected]           = useState(null);
  const [ctxMenu, setCtxMenu]             = useState(null);
  const [renameItem, setRenameItem]       = useState(null);
  const [moveItem, setMoveItem]           = useState(null);
  const [deleteItem, setDeleteItem]       = useState(null);
  const [editConfigItem, setEditConfigItem] = useState(null);
  const [syncingItems, setSyncingItems]     = useState(new Set()); // 立即同步中的 item ids

  useEffect(() => {
    if (initialNavPage) {
      setNavPage(initialNavPage);
      setPage("home");
    }
  }, [initialNavPage]);

  useEffect(() => {
    if (initialDetailName) {
      const item = infoItems.find(source => source.name === initialDetailName);
      if (item) {
        setNavPage("mine");
        setPage("home");
        setDetailItem(item);
      }
    }
  }, [initialDetailName]);

  // 汇报信息源 / 公共信息源：list 视图的搜索与视图切换（提升至 App 层以便与二级 tab 栏合并）
  const [reportTreeSearch, setReportTreeSearch] = useState("");
  const [reportListView,   setReportListView]   = useState("list");
  const [pubSearchQuery,   setPubSearchQuery]   = useState("");
  const [pubListView,      setPubListView]      = useState("card");

  const handleSyncNow = (item) => {
    setSyncingItems(prev => new Set([...prev, item.id]));
    // 模拟解析中 → 同步完成，约 4 秒后恢复
    setTimeout(() => setSyncingItems(prev => { const next = new Set(prev); next.delete(item.id); return next; }), 4000);
  };

  // ── Floating live recorder ──
  // recState: "recording" | "paused" | "done"   recOpen=false → 未打开
  const [recOpen, setRecOpen]               = useState(false);
  const [recMinimized, setRecMinimized]     = useState(false);
  const [recState, setRecState]             = useState("recording");
  const [recSeconds, setRecSeconds]         = useState(0);
  const [recName, setRecName]               = useState("");
  const [recFolderId, setRecFolderId]       = useState(null);
  const recTimerRef = useRef(null);
  const recFmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };
  const startFloatingRecorder = (folderId) => {
    setRecFolderId(folderId);
    setRecSeconds(0);
    setRecName("");
    setRecState("recording");
    setRecMinimized(false);
    setRecOpen(true);
    clearInterval(recTimerRef.current);
    recTimerRef.current = setInterval(() => setRecSeconds(p => p + 1), 1000);
  };
  const recTogglePause = () => {
    if (recState === "recording") {
      setRecState("paused");
      clearInterval(recTimerRef.current);
    } else if (recState === "paused") {
      setRecState("recording");
      recTimerRef.current = setInterval(() => setRecSeconds(p => p + 1), 1000);
    }
  };
  const recFinish = () => {
    clearInterval(recTimerRef.current);
    setRecState("done");
    setRecName(`录音 · ${new Date().toLocaleString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}`);
  };
  const recSave = () => {
    const newItem = {
      id: Date.now(),
      name: recName || "未命名录音",
      kind: "音频",
      source: "实时录音",
      owner: CURRENT_USER,
      folderId: recFolderId,
      created: "刚刚",
      updated: "刚刚",
      status: "解析中",
      desc: "实时录音，正在转写中。",
      duration: recFmt(recSeconds),
    };
    setCustomItems(prev => [newItem, ...prev]);
    clearInterval(recTimerRef.current);
    setRecOpen(false);
    setRecSeconds(0);
    setRecState("recording");
  };
  const recDiscard = () => {
    clearInterval(recTimerRef.current);
    setRecOpen(false);
    setRecSeconds(0);
    setRecState("recording");
  };
  useEffect(() => () => clearInterval(recTimerRef.current), []);
  const [filterType, setFilterType]       = useState(new Set()); // empty = 全部
  const [filterStatus, setFilterStatus]   = useState(new Set());
  const [filterPerm, setFilterPerm]       = useState(new Set());
  const [customItems, setCustomItems]     = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [folderScopes, setFolderScopes]   = useState(
    Object.fromEntries(folders.map(f => [f.id, f.scope]))
  );
  const [permissionTarget, setPermissionTarget] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [search, setSearch]               = useState("");

  const toggleFolder = (id) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContextMenu = (item, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const menuW = 160; // min-w-[148px] + padding
    const menuH = 140; // approx height
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Prefer opening to the left of the button so it doesn't overflow right edge
    const x = Math.min(rect.right - menuW, vw - menuW - 8);
    const y = rect.bottom + 4 + menuH > vh ? rect.top - menuH - 4 : rect.bottom + 4;
    setCtxMenu({ item, x: Math.max(8, x), y: Math.max(8, y) });
  };
  const handleDownload = (item) => {
    const typeLabel = getDisplayTypeLabel(item);
    const ext = typeLabel === "音频" ? ".m4a" : ".txt";
    const hasExt = /\.[a-z0-9]+$/i.test(item.name || "");
    const fileName = `${(item.name || "未命名文件").replace(/[\\/:*?"<>|]/g, "_")}${hasExt ? "" : ext}`;
    const blob = new Blob([
      `${item.name || "未命名文件"}\n\n${item.desc || "这是原型中的模拟下载文件。"}`
    ], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCreateFolder = (name) => {
    const newFolder = {
      id: Date.now(), name, kind: "文件夹", owner: "Simiy", scope: "mine",
      created: "刚刚", updated: "刚刚", status: "同步完成", count: 0,
      desc: "新建文件夹，暂无信息源", tags: [],
    };
    setCustomItems(prev => [newFolder, ...prev]);
    setShowNewFolder(false);
    setCurrentFolder(newFolder);
    setPage("folder");
  };

  // 「新建」弹窗里选中某个来源类型后的统一分发
  const pickCreateOption = (label) => {
    setShowCreateSource(false);
    if (label === "连接器") { setShowConnectorPicker(true); return; }
    if (label === "笔记") {
      if (page === "folder" && currentFolder) {
        const blankNote = {
          id: Date.now(), name: "新建笔记", kind: "笔记", source: "笔记",
          owner: CURRENT_USER, updated: "刚刚", status: "同步完成", desc: "", _isNew: true,
          folderId: currentFolder.id,
        };
        setCustomItems(prev => [blankNote, ...prev]);
        setDetailItem(blankNote);
      } else {
        setShowNotePicker(true);
      }
      return;
    }
    setShowAddInitSrc(allSources.find(s => s.label === label) || null);
    setShowAdd(true);
  };

  // 连接器 tab 里直接选中某个连接器 → 进入连接器配置
  const pickConnector = (item) => {
    setShowCreateSource(false);
    setShowAddInitSrc(allSources.find(s => s.label === item.label) || null);
    setShowAddMode("connector");
    setShowAdd(true);
  };

  const handleSaveNote = ({ title, content }) => {
    const newNote = {
      id: Date.now(), name: title, kind: "笔记", source: "笔记", owner: CURRENT_USER, scope: "mine",
      updated: "刚刚", status: "同步完成", desc: content.slice(0, 60) + (content.length > 60 ? "…" : ""),
      folderId: noteEditorFolderId,
    };
    setCustomItems(prev => [newNote, ...prev]);
    setNoteEditorOpen(false);
    setNoteEditorFolderId(null);
  };

  if (detailItem) return <ItemDetailPage
    item={detailItem}
    onBack={() => setDetailItem(null)}
    onNavigateToFolder={(folder) => {
      // 面包屑导航：跳到该信息源详情页，不依赖来路
      setDetailItem(null);
      setCurrentFolder(folder);
      setPage("folder");
      setSearch("");
      setSelected(null);
    }}
  />;
  if (publicDetail) return <PublicSourceDetail item={publicDetail} onBack={() => setPublicDetail(null)} />;
  if (noteEditorOpen) return (
    <NoteEditorPage
      folderName={folders.find(f => f.id === noteEditorFolderId)?.name}
      onBack={() => { setNoteEditorOpen(false); setNoteEditorFolderId(null); }}
      onSave={handleSaveNote}
    />
  );

  const getItemTypeLabel = (item) => {
    return getDisplayTypeLabel(item);
  };

  // 信息源列表（含运行时新建的）— 用于跨创建人判定 + 权限继承
  const allFolders = [...folders];

  // home 页（我的信息源）：只显示信息源容器；folder 页：信息源内的文件
  // 我的信息源：仅当前用户创建；与我共享：其他人创建的
  const baseObjects = page === "home"
    ? navPage === "shared"
      ? allFolders.filter(f => f.owner && f.owner !== CURRENT_USER)
      : [...customItems.filter(i => i.kind === "文件夹"), ...allFolders.filter(f => !f.owner || f.owner === CURRENT_USER)]
    : [...customItems.filter(i => i.kind !== "文件夹"), ...infoItems.filter(i => i.folderId === (currentFolder?.id))];

  const base = baseObjects;
  // tab 过滤
  const scopeOf = (i) => i.kind === "文件夹" ? (folderScopes[i.id] || i.scope) : getItemScope(i, allFolders);
  let items = tab === "我创建的" ? base.filter(i => i.owner === CURRENT_USER)
            : tab === "与我共享" ? base.filter(i => i.owner !== CURRENT_USER)
            : base;

  const isHomePage = page === "home";
  // 类型选项始终来自所有实际文件（不受 tab / 权限过滤影响），首页取全量 infoItems + customItems，
  // 文件夹页取该文件夹内的全量条目
  const allItemsForTypes = isHomePage
    ? [...infoItems, ...customItems.filter(i => i.kind !== "文件夹")]
    : [...infoItems.filter(i => i.folderId === currentFolder?.id), ...customItems.filter(i => i.kind !== "文件夹" && i.folderId === currentFolder?.id)];
  const allTypeOptions = Array.from(new Set(allItemsForTypes.map(i => getItemTypeLabel(i)).filter(Boolean)));

  // 搜索：平铺展示匹配的信息源 + 信息（不区分层级）
  // 类型/状态筛选：穿透进入文件夹展示实际条目（cross-folder view）
  const isCrossFilterView = isHomePage && (filterType.size > 0 || filterStatus.size > 0 || !!search.trim());
  if (isCrossFilterView) {
    const visibleFolderIds = new Set(items.filter(i => i.kind === "文件夹").map(f => f.id));
    const allFolderContents = [...infoItems, ...customItems.filter(i => i.kind !== "文件夹")]
      .filter(i => i.folderId != null && visibleFolderIds.has(i.folderId));

    if (search.trim()) {
      // 搜索模式：信息源（按名称）+ 信息（按名称/来源类型）平铺合并
      const kw = search.trim().toLowerCase();
      const matchFn = (i) => {
        const name = (i.name || "").toLowerCase();
        const src  = (sourceInfo[i.source]?.label || i.source || "").toLowerCase();
        return name.includes(kw) || src.includes(kw);
      };
      const matchingFolders = items.filter(i => i.kind === "文件夹" && matchFn(i));
      const matchingItems   = allFolderContents.filter(matchFn);
      items = [...matchingFolders, ...matchingItems];
    } else {
      // 类型/状态筛选：穿透展示信息层级
      let crossItems = allFolderContents;
      if (filterType.size > 0)       crossItems = crossItems.filter(i => filterType.has(getItemTypeLabel(i)));
      if (filterStatus.size > 0)     crossItems = crossItems.filter(i => filterStatus.has(getDisplaySyncStatus(i)));
      items = crossItems;
    }
  } else if (filterType.size > 0) {
    // 文件夹页的类型筛选（不触发 cross-folder）
    items = items.filter(i => filterType.has(getItemTypeLabel(i)));
  }
  // 文件夹页内的状态筛选（isCrossFilterView = false 时）
  if (!isCrossFilterView && filterStatus.size > 0) items = items.filter(i => filterStatus.has(getDisplaySyncStatus(i)));
  const scopeLabel = (s) => s === "enterprise" ? "所有人可见" : s === "partial" ? "部分可见" : "私密";
  if (filterPerm.size > 0) items = items.filter(i => filterPerm.has(scopeLabel(scopeOf(i))));
  const handleFilterType = (v) => {
    if (v === "全部") setFilterType(new Set());
    else setFilterType(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n; });
    setSelected(null);
  };
  const handleFilterStatus = (v) => {
    if (v === "全部") setFilterStatus(new Set());
    else setFilterStatus(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n; });
    setSelected(null);
  };
  const handleFilterPerm = (v) => {
    if (v === "全部") setFilterPerm(new Set());
    else setFilterPerm(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n; });
    setSelected(null);
  };
  const clearAllFilters = () => {
    setFilterType(new Set());
    setFilterStatus(new Set());
    setFilterPerm(new Set());
    setSelected(null);
  };

  // 文件夹 id → 子信息源数组（用于树形展开）
  const folderChildren = Object.fromEntries(
    allFolders.map(f => [f.id, infoItems.filter(i => i.folderId === f.id)])
  );

  const navItems = [
    { Icon: Icon.Search,    label: "信息源搜索", id: "search" },
    { Icon: Icon.Grid,      label: "我的信息源", id: "mine" },
    { Icon: Icon.Share,     label: "与我共享",   id: "shared" },
    { Icon: Icon.Timeline,  label: "汇报信息源", id: "report" },
    { Icon: Icon.Newspaper, label: "公共信息源", id: "public" },
  ];

  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">

        {/* ── Header：磨玻璃顶栏（与其他模块一致） ── */}
        <GlassHeader user="Simiy" />

        {/* ── Main ── */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* ── 二级菜单：tab 行（与搜索、视图切换合并在一起） ── */}
          <div className="glass-soft flex shrink-0 items-center gap-4 border-x-0 border-t-0 px-8 py-2.5">
            <nav className="flex min-w-0 flex-1 items-center gap-1">
              {navItems.map(nav => (
                <React.Fragment key={nav.id}>
                  {nav.id === "public" && <div className="mx-2 h-5 w-px shrink-0 bg-neutral-200/80" />}
                  <button
                    onClick={() => { setNavPage(nav.id); setPage("home"); setCurrentFolder(null); setSearch(""); setFilterType(new Set()); setFilterStatus(new Set()); setFilterPerm(new Set()); }}
                    className={`relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm transition-colors ${navPage === nav.id ? "font-medium text-orange-600" : "text-neutral-500 hover:text-neutral-900"}`}>
                    <span className={navPage === nav.id ? "text-orange-500" : "text-neutral-400"}><nav.Icon /></span>
                    <span>{nav.label}</span>
                    {navPage === nav.id && <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-t bg-orange-500" />}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* 搜索 + 视图切换（所有 tab 通用；对应各 page 的独立状态） */}
            {navPage !== "search" && (() => {
              const isMineShared = navPage === "mine" || navPage === "shared";
              const cfg = isMineShared
                ? { value: search, onChange: setSearch, placeholder: "搜索信息…", view, setView }
                : navPage === "report"
                ? { value: reportTreeSearch, onChange: setReportTreeSearch, placeholder: "搜索汇报信息源…", view: reportListView, setView: setReportListView }
                : { value: pubSearchQuery, onChange: setPubSearchQuery, placeholder: "搜索公共信息源…", view: pubListView, setView: setPubListView };
              return (
                <div className="flex shrink-0 items-center gap-2">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Icon.Search /></span>
                    <input
                      value={cfg.value}
                      onChange={e => cfg.onChange(e.target.value)}
                      className={`h-8 w-52 rounded-xl bg-neutral-100/80 pl-9 text-sm placeholder-neutral-400 outline-none transition ring-1 ring-transparent focus:w-64 focus:bg-white focus:ring-orange-200 ${cfg.value ? "pr-8" : "pr-3"}`}
                      placeholder={cfg.placeholder} />
                    {cfg.value && (
                      <button onClick={() => cfg.onChange("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500">
                        <Icon.Close />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center rounded-xl bg-neutral-100/80 p-0.5">
                    <button onClick={() => cfg.setView("list")} className={"flex h-7 w-7 items-center justify-center rounded-lg transition-all " + (cfg.view === "list" ? "bg-white text-orange-600 shadow-sm" : "text-neutral-400 hover:text-neutral-600")}><Icon.List /></button>
                    <button onClick={() => cfg.setView("card")} className={"flex h-7 w-7 items-center justify-center rounded-lg transition-all " + (cfg.view === "card" ? "bg-white text-orange-600 shadow-sm" : "text-neutral-400 hover:text-neutral-600")}><Icon.Card /></button>
                  </div>
                  {/* 筛选（icon only）— 仅 mine/shared */}
                  {isMineShared && (
                    <HeaderFilterButton
                      iconOnly
                      filterType={filterType}
                      filterStatus={filterStatus}
                      filterPerm={filterPerm}
                      allTypeOptions={allTypeOptions}
                      onFilterType={handleFilterType}
                      onFilterStatus={handleFilterStatus}
                      onFilterPerm={handleFilterPerm}
                      onClearFilters={clearAllFilters}
                    />
                  )}
                  {/* 新建：统一入口（上传 / 连接器 等在弹窗中选择） */}
                  {((navPage === "mine" && page === "home") || (page !== "home" && currentFolder?.owner === CURRENT_USER)) && (
                    <UIButton size="sm" className="h-8 px-3.5" onClick={() => { setCreateSourceTab("upload"); setShowCreateSource(true); }}>
                      <i className="ri-add-line text-base" />新建
                    </UIButton>
                  )}
                </div>
              );
            })()}
          </div>

          {navPage === "search" ? (
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <SourceSearchPage />
            </div>
          ) : navPage === "report" ? (
            /* 汇报信息源 view */
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <ReportPage
                treeSearch={reportTreeSearch}
                setTreeSearch={setReportTreeSearch}
                reportView={reportListView}
                setReportView={setReportListView} />
            </div>
          ) : navPage === "public" ? (
            /* 公共信息源 view */
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <PublicSourcesPage
                onSelectItem={setPublicDetail}
                search={pubSearchQuery}
                setSearch={setPubSearchQuery}
                view={pubListView}
                setView={setPubListView} />
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex flex-1 flex-col overflow-auto px-8 py-6">

                {/* Toolbar 行 2：面包屑（仅文件夹内页展示） */}
                {page !== "home" && (
                  <div className="mb-4 flex items-center gap-2 text-sm">
                    <button onClick={() => { setPage("home"); setCurrentFolder(null); setSearch(""); setFilterType(new Set()); setFilterStatus(new Set()); setFilterPerm(new Set()); }}
                      className="flex items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-700">
                      <Icon.Back /><span>{navPage === "shared" ? "与我共享" : "我的信息源"}</span>
                    </button>
                    <span className="text-neutral-300">/</span>
                    <span className="font-semibold text-neutral-800">{currentFolder?.name}</span>
                  </div>
                )}

                {/* 空状态 */}
                {page === "folder" && items.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center py-24 select-none">
                    {/* 浮动图标 */}
                    <div style={{ animation: "floatUp 3s ease-in-out infinite" }} className="relative mb-8">
                      {/* 背景光晕 */}
                      <div style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
                        className="absolute inset-0 -m-4 rounded-full bg-orange-100/60 blur-xl" />
                      {/* 主图标 */}
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-50 to-amber-100 shadow-lg">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        {/* 小装饰点 */}
                        <span style={{ animation: "floatUp 2.4s ease-in-out infinite 0.6s" }} className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full bg-orange-300 shadow-sm" />
                        <span style={{ animation: "floatUp 2.8s ease-in-out infinite 1.1s" }} className="absolute -bottom-1 -left-2 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-sm" />
                      </div>
                    </div>
                    <h3 className="text-[17px] font-bold text-neutral-800">这里还没有内容</h3>
                    {currentFolder?.owner === CURRENT_USER ? (
                      <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-neutral-400">
                        <button onClick={() => setShowCreateSource(true)}
                          className="text-neutral-500 underline underline-offset-2 decoration-neutral-300 hover:text-orange-500 hover:decoration-orange-300 transition-colors">新建信息源</button>
                        ，让信息自动流入这里
                      </p>
                    ) : (
                      <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-neutral-400">
                        此信息源由 <span className="font-medium text-neutral-500">{currentFolder?.owner}</span> 管理，暂时还没有添加任何内容
                      </p>
                    )}
                    <style>{`
                      @keyframes floatUp {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                      }
                      @keyframes pulseGlow {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.15); }
                      }
                    `}</style>
                  </div>
                )}

                {view === "list"
                  ? <ListView items={items} onOpenFolder={(f) => { setCurrentFolder(f); setPage("folder"); setSearch(""); }} onSelectItem={setDetailItem} onContextMenu={handleContextMenu}
	                      syncingIds={syncingItems}
                      expandedFolders={expandedFolders} onToggleFolder={toggleFolder}
                      folderScopes={folderScopes} onPermissionClick={setPermissionTarget}
                      folderChildren={folderChildren} inFolderPage={page === "folder"}
                      crossFolderView={isCrossFilterView}
                      folderList={allFolders}
                      onGoToFolder={f => { setCurrentFolder(f); setPage("folder"); setSearch(""); }}
                      onCreateNew={navPage === "mine" && page === "home" && !isCrossFilterView ? () => setShowNewFolder(true) : null} />
	                  : <CardView items={items} onOpenFolder={(f) => { setCurrentFolder(f); setPage("folder"); setSearch(""); }} onSelectItem={setDetailItem} onContextMenu={handleContextMenu}
	                      onEditConfig={setEditConfigItem} syncingIds={syncingItems}
	                      folderScopes={folderScopes} onPermissionClick={setPermissionTarget} timeMode={timeMode}
	                      folderList={[...customItems.filter(i => i.kind === "文件夹"), ...allFolders]} crossFolderView={isCrossFilterView}
	                      onCreateNew={navPage === "mine" && page === "home" && !isCrossFilterView ? () => setShowNewFolder(true) : null} />
                }
              </div>

              {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} onViewDetail={() => { setDetailItem(selected); setSelected(null); }} />}
            </div>
          )}
        </main>
      </div>

      {/* ── 一级菜单：底部悬浮 dock（磨玻璃，共享组件） ── */}
      <GlassDock active="sources" onNavigate={onNavigate} />

      {/* 新建信息源弹窗：上传导入 / 自动同步 统一入口 */}
      {showCreateSource && (
        <>
          <button className="overlay-in fixed inset-0 z-40 cursor-default bg-slate-900/35 backdrop-blur-sm" onClick={() => setShowCreateSource(false)} aria-label="关闭" />
          <div className="dialog-in glass-strong fixed left-1/2 top-1/2 z-50 w-[560px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[17px] font-bold">新建信息源</h2>
                {createSourceTab === "connector" && <p className="mt-1 text-[13px] text-neutral-500">授权后定时同步外部数据到信息源</p>}
              </div>
              <button onClick={() => setShowCreateSource(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/70 hover:text-neutral-700" aria-label="关闭"><i className="ri-close-line text-xl" /></button>
            </div>
            <div className="mt-4 flex items-center gap-6 border-b border-neutral-200/70 text-sm">
              <button onClick={() => setCreateSourceTab("upload")} className={`border-b-2 pb-2.5 font-medium ${createSourceTab === "upload" ? "border-orange-500 text-orange-500" : "border-transparent text-neutral-500"}`}>上传文件</button>
              <button onClick={() => setCreateSourceTab("connector")} className={`border-b-2 pb-2.5 font-medium ${createSourceTab === "connector" ? "border-orange-500 text-orange-500" : "border-transparent text-neutral-500"}`}>连接器</button>
            </div>
            {createSourceTab === "upload" && <>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "文档上传", icon: "ri-file-text-line", desc: "PDF · Word · MD · TXT · 图片" },
                { label: "音频上传", icon: "ri-music-2-line", desc: "主流音视频格式 · 自动转写" },
                { label: "实时录音", icon: "ri-mic-line", desc: "实时录音并同步转写" },
                { label: "笔记", icon: "ri-edit-line", desc: "在编辑器中直接编写保存" },
                { label: "语雀知识库", icon: "ri-book-2-line", desc: "上传导出包，选择需导入的文档" },
                { label: "思源笔记", icon: "ri-sticky-note-line", desc: "上传导出包，选择需导入的文档" },
              ].map(opt => (
                <button key={opt.label} onClick={() => pickCreateOption(opt.label)}
                  className="flex items-center gap-3 rounded-xl bg-white/60 px-3.5 py-3 text-left ring-1 ring-border/50 transition hover:bg-white hover:ring-orange-200">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-lg text-accent-foreground"><i className={opt.icon} /></span>
                  <span className="min-w-0"><span className="block text-sm font-medium">{opt.label}</span><span className="block truncate text-[11px] text-neutral-400">{opt.desc}</span></span>
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <a href="https://chromewebstore.google.com/detail/zleap" target="_blank" rel="noopener noreferrer" onClick={() => setShowCreateSource(false)}
                className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white/45 px-3.5 py-3 text-left ring-1 ring-border/30 transition hover:bg-white hover:ring-orange-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-lg text-accent-foreground"><i className="ri-chrome-line" /></span>
                <span className="min-w-0"><span className="flex items-center gap-1 text-sm font-medium">浏览器插件 <i className="ri-external-link-line text-xs text-neutral-400" /></span><span className="block truncate text-[11px] text-neutral-400">浏览时一键保存网页内容</span></span>
                <i className="ri-download-line ml-auto text-neutral-400" />
              </a>
            </div>
            </>}
            {createSourceTab === "connector" && <div className="scrollbar mt-5 max-h-[54vh] space-y-4 overflow-y-auto pr-1">
              {connectorGroups.map(g => (
                <div key={g.label}>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{g.label}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {g.items.map(item => (
                      <button key={item.label} onClick={() => pickConnector(item)}
                        className="flex items-start gap-3 rounded-xl bg-white/60 px-3.5 py-3 text-left ring-1 ring-border/50 transition hover:bg-white hover:ring-orange-200">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-lg text-accent-foreground"><item.Icon /></span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.isOAuth && <span className="rounded bg-blue-50 px-1 py-0.5 text-[10px] font-medium text-blue-500">OAuth</span>}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] leading-snug text-neutral-400">{item.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>}
          </div>
        </>
      )}

      {showNotePicker && (
        <NoteFolderPickerModal
          folderList={[...customItems.filter(i => i.kind === "文件夹"), ...allFolders]}
          onClose={() => setShowNotePicker(false)}
          onNewSource={() => {
            // Close note picker, open AddModal; after folder created, re-open picker with it selected
            setShowNotePicker(false);
            setShowAdd(true);
            setShowAddMode("upload");
            setShowAddInitSrc(null);
          }}
          onConfirm={fid => {
            const blankNote = {
              id: Date.now(), name: "新建笔记", kind: "笔记", source: "笔记",
              owner: CURRENT_USER, updated: "刚刚", status: "同步完成", desc: "", _isNew: true,
              folderId: fid ?? null,
            };
            setCustomItems(prev => [blankNote, ...prev]);
            setShowNotePicker(false);
            setDetailItem(blankNote);
          }}
        />
      )}
      {showAdd && <AddModal onClose={() => { setShowAdd(false); setShowAddInitSrc(null); }} onOpenNoteEditor={() => {}} initTab={showAddMode === "upload" ? "单次导入" : "定时同步"} initSrc={showAddInitSrc} defaultFolderId={page === "folder" && currentFolder ? currentFolder.id : null} onAdded={(added) => {
          setShowAdd(false); setShowAddInitSrc(null);
          if (Array.isArray(added)) {
            // 多文档导入：批量加入列表，回到列表页（不进入单个详情）
            setCustomItems(prev => [...added, ...prev]);
          } else {
            setCustomItems(prev => [added, ...prev]); setDetailItem(added);
          }
        }} onFolderCreated={(folder) => setCustomItems(prev => [folder, ...prev])} folderList={[...customItems.filter(i => i.kind === "文件夹"), ...allFolders]} onStartFloatingRec={(folderId) => { setShowAdd(false); setShowAddInitSrc(null); startFloatingRecorder(folderId); }} />}
      {showConnectorPicker && <ConnectorPickerModal onClose={() => setShowConnectorPicker(false)} onSelect={(item) => { setShowConnectorPicker(false); setShowAddInitSrc(allSources.find(s => s.label === item.label) || null); setShowAddMode("connector"); setShowAdd(true); }} />}
      {showNewFolder && <NewFolderModal onClose={() => setShowNewFolder(false)} onCreate={handleCreateFolder} />}
      {ctxMenu && <ContextMenu item={ctxMenu.item} pos={{ x: ctxMenu.x, y: ctxMenu.y }}
        onRename={setRenameItem} onMove={setMoveItem} onDelete={setDeleteItem}
        onPermission={(item) => setPermissionTarget(item.id)}
        onEditConfig={setEditConfigItem}
        onSyncNow={handleSyncNow}
        onDownload={handleDownload}
        onClose={() => setCtxMenu(null)} />}
      {renameItem && <RenameModal item={renameItem} onClose={() => setRenameItem(null)} />}
      {moveItem && <MoveToModal item={moveItem} onClose={() => setMoveItem(null)} folderScopes={folderScopes} />}
      {deleteItem && <DeleteModal item={deleteItem} onClose={() => setDeleteItem(null)} />}
      {editConfigItem && <EditConfigModal item={editConfigItem} onClose={() => setEditConfigItem(null)} />}

      {/* 信息源权限弹层 */}
      {permissionTarget != null && (() => {
        const folder = { ...allFolders.find(f => f.id === permissionTarget), scope: folderScopes[permissionTarget] };
        const childCount = (folderChildren[permissionTarget] || []).length;
        return (
          <PermissionPopover folder={folder} childCount={childCount}
            onClose={() => setPermissionTarget(null)}
            onConfirm={(s) => setFolderScopes(prev => ({ ...prev, [permissionTarget]: s }))} />
        );
      })()}

      {/* ── Floating live recorder ── */}
      {recOpen && (() => {
        // 配色：recording=红 / paused=琥珀 / done=绿
        const palette = recState === "recording"
          ? { dot: "bg-red-500 rec-pulse", label: "正在录音", labelCls: "text-neutral-800", waveAct: "bg-emerald-500", waveBg: "bg-neutral-100", primaryBg: "bg-red-500 hover:bg-red-600" }
          : recState === "paused"
          ? { dot: "bg-amber-400",         label: "已暂停",   labelCls: "text-neutral-800", waveAct: "bg-neutral-300", waveBg: "bg-neutral-100", primaryBg: "bg-red-500 hover:bg-red-600" }
          : { dot: "bg-emerald-500",       label: "录音完成", labelCls: "text-neutral-800", waveAct: "bg-emerald-400", waveBg: "bg-neutral-100", primaryBg: "bg-emerald-500 hover:bg-emerald-600" };

        // 微型波形 — 12 根条
        const Waveform = ({ animated, activeCls }) => (
          <div className="flex h-12 w-full items-center justify-center gap-1 rounded-xl bg-neutral-50 px-3">
            {[16, 22, 30, 18, 26, 34, 24, 30, 18, 28, 22, 16].map((h, i) => (
              <div key={i}
                className={`w-[3px] rounded-full ${animated ? "rec-bar " + activeCls : "bg-neutral-300"}`}
                style={animated ? {animationDelay: (i * 70) + "ms"} : {height: h + "px"}} />
            ))}
          </div>
        );

        if (recMinimized) {
          // ── 缩小态：胶囊 pill ──
          return (
            <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-xl ring-1 ring-neutral-200/60">
              <span className={`h-2 w-2 shrink-0 rounded-full ${palette.dot}`} />
              <span className="font-mono text-sm font-semibold tabular-nums text-neutral-800">{recFmt(recSeconds)}</span>
              <div className="h-4 w-px bg-neutral-200" />
              {recState === "done" ? (
                <>
                  <button onClick={recSave} title="保存"
                    className="flex h-7 items-center gap-1 rounded-md bg-emerald-50 px-2 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    保存
                  </button>
                  <button onClick={recDiscard} title="放弃"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                    <Icon.Close />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={recTogglePause} title={recState === "recording" ? "暂停" : "继续"}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800">
                    {recState === "recording"
                      ? <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="1" y="0" width="3" height="11" rx="1"/><rect x="7" y="0" width="3" height="11" rx="1"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M1 0.5C1 0 1.5-0.2 2 0.1l8 5c0.4 0.3 0.4 0.9 0 1.1l-8 5c-0.5 0.3-1 0.1-1-0.4V0.5z"/></svg>
                    }
                  </button>
                  <button onClick={recFinish} title="结束录音"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1.6"/></svg>
                  </button>
                </>
              )}
              <button onClick={() => setRecMinimized(false)} title="展开"
                className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              </button>
            </div>
          );
        }

        // ── 展开态：小卡片面板 ──
        return (
          <div className="fixed bottom-6 right-6 z-[60] w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200/60">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
                <span className={`text-sm font-semibold ${palette.labelCls}`}>{palette.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setRecMinimized(true)} title="缩小"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </button>
                <button onClick={recDiscard} title="关闭"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                  <Icon.Close />
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="px-5 pt-5 pb-4">
              {/* Timer */}
              <div className="text-center">
                <div className="font-mono text-[34px] font-bold tabular-nums leading-none text-neutral-800">{recFmt(recSeconds)}</div>
                <div className="mt-1.5 text-[11px] text-neutral-400">最长 02:00:00</div>
              </div>
              {/* Waveform */}
              <div className="mt-4">
                <Waveform animated={recState === "recording"} activeCls={palette.waveAct} />
              </div>
              {/* Name input (only when done) */}
              {recState === "done" && (
                <div className="mt-4">
                  <input value={recName} onChange={e => setRecName(e.target.value)}
                    maxLength={20}
                    placeholder="给这段录音起个名字"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-3 py-2 text-sm text-neutral-700 placeholder-neutral-400 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
                </div>
              )}
              {/* Actions */}
              <div className="mt-4 space-y-2">
                {recState === "done" ? (
                  <>
                    <button onClick={recSave}
                      className={`flex w-full items-center justify-center gap-1.5 rounded-xl ${palette.primaryBg} py-2.5 text-sm font-semibold text-white transition-colors`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      保存
                    </button>
                    <button onClick={recDiscard}
                      className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50">
                      放弃
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={recFinish}
                      className={`flex w-full items-center justify-center rounded-xl ${palette.primaryBg} py-2.5 text-sm font-semibold text-white transition-colors`}>
                      停止录音
                    </button>
                    <button onClick={recTogglePause}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
                      {recState === "recording" ? (
                        <>
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="1" y="0" width="3" height="11" rx="1"/><rect x="7" y="0" width="3" height="11" rx="1"/></svg>
                          暂停
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          继续录音
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </PageShell>
  );
}


function App() {
  const [primaryPage, setPrimaryPage] = useState("desktop");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantChat, setAssistantChat] = useState("");
  const [feedInitialView, setFeedInitialView] = useState(null);
  const [sourcesInitialNav, setSourcesInitialNav] = useState(null);
  const [sourcesInitialDetail, setSourcesInitialDetail] = useState(null);
  const navigate = (page, payload) => {
    const normalizedPage = page === "assistant" ? "agents" : page === "tasks" ? "projects" : page;
    if (["desktop", "sources", "agents", "projects", "feed", "members"].includes(normalizedPage)) {
      if (normalizedPage === "agents") {
        setAssistantPrompt(payload?.prompt || "");
        setAssistantChat(payload?.chat || "");
      }
      if (normalizedPage === "feed") setFeedInitialView(payload?.view || null);
      if (normalizedPage === "sources") setSourcesInitialNav(payload?.navPage || null);
      if (normalizedPage === "sources") setSourcesInitialDetail(payload?.detailName || null);
      setPrimaryPage(normalizedPage);
    }
  };

  if (primaryPage === "desktop") return <DesktopPage onNavigate={navigate} />;
  if (primaryPage === "agents") return <AssistantPage onNavigate={navigate} initialPrompt={assistantPrompt} initialChat={assistantChat} />;
  if (primaryPage === "projects") return <ProjectPage onNavigate={navigate} />;
  if (primaryPage === "feed") return <FeedPage onNavigate={navigate} initialView={feedInitialView} />;
  if (primaryPage === "members") return <MemberPage onNavigate={navigate} />;
  return <InfoSourcePage onNavigate={navigate} initialNavPage={sourcesInitialNav} initialDetailName={sourcesInitialDetail} />;
}

export default App;
