import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { contextSuggestions, createInitialSuperAgentState, SUPER_AGENT_ID, superAgentReducer } from './superAgentState';

const SuperAgentContext = createContext(null);

export const superAgentSources = [
  {
    id: 'source-agent-collaboration',
    title: 'Agent 协作方式正在从能力展示转向稳定关系',
    description: '近期产品动态显示，用户更关注 Agent 是否能持续理解上下文并完成可追踪任务。',
    children: ['Agent 中心联系人式改版', '多 Agent 协作产品观察'],
  },
  {
    id: 'source-information-health',
    title: '信息源稳定性决定日报可信度',
    description: '同步失败的来源需要在日报中明确排除，并保留可恢复入口。',
    children: ['客户数据库同步失败', 'GitHub Issues 授权异常'],
  },
];

export const automationMaterials = [
  { id: 'public-industry', name: '行业资讯', group: '公共信息源', recommended: true },
  { id: 'public-feedback', name: '用户反馈', group: '公共信息源', recommended: true },
  { id: 'personal-notes', name: '产品思考笔记', group: '我的信息源', recommended: false },
  { id: 'shared-project', name: '项目共享资料', group: '与我共享', recommended: false },
];

export const executionAgents = [
  { id: 'research', name: '研究分析 Agent', emoji: '🔎', description: '行业研究、竞品分析与趋势归纳', recommended: true },
  { id: 'codex-local', name: 'Codex 本地 Agent', emoji: '⌘', description: '代码开发、审查与终端操作' },
  { id: 'content', name: '内容创作 Agent', emoji: '✍️', description: '内容策划、写作与改编' },
  { id: SUPER_AGENT_ID, name: 'Super Agent', emoji: '✦', description: '全局信息整理与任务协调' },
];

const nowTime = () => new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function SuperAgentProvider({ children }) {
  const [state, dispatch] = useReducer(superAgentReducer, undefined, createInitialSuperAgentState);
  const replyTimer = useRef(null);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const setPageContext = useCallback(context => dispatch({ type: 'SET_PAGE_CONTEXT', context }), []);
  const openOverlay = useCallback(() => dispatch({ type: 'OPEN_OVERLAY' }), []);
  const closeOverlay = useCallback(() => {
    clearTimeout(replyTimer.current);
    dispatch({ type: 'STOP_PENDING' });
    dispatch({ type: 'CLOSE_OVERLAY' });
  }, []);

  const visibleContext = state.contextClosedForOpenSession || state.pageContext?.kind === 'none' || state.pageContext?.unavailableReason
    ? null
    : state.pageContext;

  const finishReply = useCallback((text, contextSnapshot, options = {}) => {
    clearTimeout(replyTimer.current);
    const failed = options.failed;
    dispatch({
      type: 'RESOLVE_PENDING',
      message: {
        id: makeId(failed ? 'error' : 'answer'), role: 'agent', type: failed ? 'error' : 'text',
        text, time: nowTime(), context: contextSnapshot,
        sources: failed ? [] : superAgentSources,
      },
    });
  }, []);

  const startAutomationFlow = useCallback((seed = '') => {
    clearTimeout(replyTimer.current);
    dispatch({ type: 'STOP_PENDING' });
    dispatch({
      type: 'SET_AUTOMATION_DRAFT',
      draft: {
        step: 'goal',
        name: seed ? seed.replace(/[。！!？?]/g, '').slice(0, 24) : '',
        content: seed,
        trigger: '每天 09:00',
        materialIds: automationMaterials.filter(item => item.recommended).map(item => item.id),
        agentId: 'research',
        agentName: '研究分析 Agent',
        shouldFail: seed.includes('任务创建失败'),
      },
    });
    dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('guide'), role: 'agent', type: 'text', time: nowTime(), text: '我来帮你创建自动化任务。请先描述希望持续完成什么，以及执行频率。' } });
  }, []);

  const sendMessage = useCallback(text => {
    const trimmed = text.trim();
    if (!trimmed || state.pendingMessageId) return;
    const contextSnapshot = visibleContext ? { ...visibleContext } : null;
    dispatch({ type: 'MARK_TOPIC_REPLIED' });
    dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('user'), role: 'user', type: 'text', text: trimmed, time: nowTime(), context: contextSnapshot } });
    dispatch({ type: 'SET_DRAFT', value: '' });

    if (state.automationDraft?.step === 'goal') {
      dispatch({ type: 'UPDATE_AUTOMATION_DRAFT', changes: { step: 'materials', name: state.automationDraft.name || trimmed.replace(/[。！!？?]/g, '').slice(0, 24), content: trimmed, shouldFail: trimmed.includes('任务创建失败') } });
      dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('materials'), role: 'agent', type: 'text', time: nowTime(), text: '任务目标和时间已整理好。请选择任务需要使用的材料。' } });
      return;
    }

    if (/自动化|每天|每周|定时|未来/.test(trimmed)) {
      startAutomationFlow(trimmed);
      return;
    }

    const pendingId = makeId('pending');
    dispatch({ type: 'START_PENDING', id: pendingId });
    replyTimer.current = setTimeout(() => {
      if (trimmed === '加载失败') {
        finishReply('加载失败，请稍后重试。', contextSnapshot, { failed: true });
        return;
      }
      const lead = contextSnapshot?.title ? `基于「${contextSnapshot.title}」` : '基于当前可用信息';
      finishReply(`${lead}，我归纳出三个重点：关键信息需要按影响程度排序；异常来源应单独标记；明确的行动结论可以继续转成自动化任务。`, contextSnapshot);
    }, 900);
  }, [finishReply, startAutomationFlow, state.automationDraft, state.pendingMessageId, visibleContext]);

  const retryMessage = useCallback(message => {
    dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('retry'), role: 'system', type: 'system', text: '正在重新生成回答…', time: nowTime() } });
    const pendingId = makeId('pending');
    dispatch({ type: 'START_PENDING', id: pendingId });
    replyTimer.current = setTimeout(() => finishReply('重试成功。当前问题已经重新分析，建议先处理异常信息源，再继续生成后续任务。', message.context), 700);
  }, [finishReply]);

  const stopGeneration = useCallback(() => {
    if (!state.pendingMessageId) return;
    clearTimeout(replyTimer.current);
    dispatch({ type: 'STOP_PENDING', message: { id: makeId('stopped'), role: 'system', type: 'system', text: '已停止生成', time: nowTime() } });
  }, [state.pendingMessageId]);

  const confirmMaterials = useCallback(() => {
    if (!state.automationDraft?.materialIds?.length) return;
    dispatch({ type: 'UPDATE_AUTOMATION_DRAFT', changes: { step: 'agent' } });
    dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('agent-choice'), role: 'agent', type: 'text', time: nowTime(), text: '材料已确认。请选择负责执行这项任务的 Agent。' } });
  }, [state.automationDraft]);

  const submitAutomation = useCallback(() => {
    const draft = state.automationDraft;
    if (!draft?.agentId) return;
    dispatch({ type: 'UPDATE_AUTOMATION_DRAFT', changes: { step: 'submitting' } });
    dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('task-submitting'), role: 'system', type: 'task-submitting', text: '正在创建任务…', time: nowTime() } });
    replyTimer.current = setTimeout(() => {
      if (draft.shouldFail) {
        dispatch({ type: 'SET_AUTOMATION_DRAFT', draft: { ...draft, step: 'failed' } });
        dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('task-failed'), role: 'agent', type: 'task-error', text: '创建失败，请稍后再试', time: nowTime() } });
        return;
      }
      const task = {
        id: makeId('task'), name: draft.name || '新自动化任务', content: draft.content,
        trigger: draft.trigger, materialIds: draft.materialIds, agentId: draft.agentId,
        agentName: draft.agentName, enabled: true, systemDefault: false, createdAt: Date.now(), lastRun: '尚未执行', pushEnabled: false,
      };
      dispatch({ type: 'ADD_TASK', task });
      dispatch({ type: 'APPEND_MESSAGE', message: { id: makeId('task-result'), role: 'agent', type: 'task-result', taskId: task.id, taskName: task.name, agentName: task.agentName, text: '任务已创建', time: nowTime() } });
    }, 800);
  }, [state.automationDraft]);

  const value = useMemo(() => ({
    ...state,
    visibleContext,
    suggestions: contextSuggestions(visibleContext),
    setPageContext,
    openOverlay,
    closeOverlay,
    clearUnread: () => dispatch({ type: 'CLEAR_UNREAD' }),
    closeContext: () => dispatch({ type: 'CLOSE_CONTEXT' }),
    setDraft: value => dispatch({ type: 'SET_DRAFT', value }),
    sendMessage,
    retryMessage,
    stopGeneration,
    startNewTopic: () => dispatch({ type: 'START_NEW_TOPIC', id: makeId('topic'), time: nowTime() }),
    openSources: messageId => dispatch({ type: 'OPEN_SOURCES', messageId }),
    closeSources: () => dispatch({ type: 'CLOSE_SOURCES' }),
    toggleSource: id => dispatch({ type: 'TOGGLE_SOURCE', id }),
    updateAgent: changes => dispatch({ type: 'UPDATE_AGENT', changes }),
    startAutomationFlow,
    updateAutomationDraft: changes => dispatch({ type: 'UPDATE_AUTOMATION_DRAFT', changes }),
    cancelAutomation: () => dispatch({ type: 'SET_AUTOMATION_DRAFT', draft: null }),
    confirmMaterials,
    submitAutomation,
    toggleTask: id => dispatch({ type: 'TOGGLE_TASK', id }),
    deleteTask: id => dispatch({ type: 'DELETE_TASK', id }),
    runTask: id => dispatch({ type: 'RUN_TASK', id }),
  }), [state, visibleContext, setPageContext, openOverlay, closeOverlay, sendMessage, retryMessage, stopGeneration, startAutomationFlow, confirmMaterials, submitAutomation]);

  return <SuperAgentContext.Provider value={value}>{children}</SuperAgentContext.Provider>;
}

export function useSuperAgent() {
  const value = useContext(SuperAgentContext);
  if (!value) throw new Error('useSuperAgent must be used inside SuperAgentProvider');
  return value;
}

export function useSuperAgentPageContext(context) {
  const { setPageContext } = useSuperAgent();
  const serialized = JSON.stringify(context || { kind: 'none' });
  useEffect(() => {
    setPageContext(context || { kind: 'none' });
  }, [serialized, setPageContext]);
}
