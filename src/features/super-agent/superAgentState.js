export const SUPER_AGENT_ID = 'super-agent';

export const generalSuggestions = [
  '总结一个新主题',
  '创建一个新的自动化任务',
  '帮我梳理下一步动作',
];

export const contextSuggestions = context => {
  if (context?.kind === 'entity') return ['帮我总结核心内容', '有哪些重点结论或变化？', '存在哪些风险？', '建议下一步怎么处理？'];
  if (context?.kind === 'list') return ['帮我总结当前列表的重点', '哪些内容最值得关注？', '这些内容有哪些共同趋势？', '按重要性帮我排序'];
  return generalSuggestions;
};

export const createInitialSuperAgentState = () => ({
  agent: {
    id: SUPER_AGENT_ID,
    name: 'Zhang Wei 的 Agent',
    avatar: '✦',
    avatarTone: 'from-orange-400 to-rose-500',
    rolePrompt: '你是 Zleap 的全局智能助手。帮助用户总结信息、解释洞察、提炼要点，并在明确行动结论后创建自动化任务。',
    visibility: 'private',
    owned: true,
    system: true,
  },
  overlayOpen: false,
  contextClosedForOpenSession: false,
  pageContext: { kind: 'list', entityType: 'desktop', entityId: 'desktop', title: '当前桌面卡片' },
  draft: '',
  pendingMessageId: null,
  unread: true,
  sourceSheetMessageId: null,
  expandedSourceIds: [],
  automationDraft: null,
  messages: [
    {
      id: 'daily-report-2026-08-04',
      role: 'agent',
      type: 'report',
      time: '09:02',
      unread: true,
      reportId: 'report-2026-08-04',
      title: '2026 年 8 月 4 日每日总结日报',
      summary: '昨日围绕 Agent 协作、信息源稳定性和项目推进出现 3 类关键信号，建议优先跟进异常信息源并沉淀团队协作结论。',
    },
  ],
  tasks: [
    {
      id: 'daily-summary',
      name: '每日总结日报',
      content: '汇总可访问的公共和个人信息源，生成当日总结日报',
      trigger: '每天 09:00',
      materialIds: ['public-industry', 'personal-notes'],
      agentId: SUPER_AGENT_ID,
      agentName: 'Zhang Wei 的 Agent',
      enabled: true,
      systemDefault: true,
      createdAt: 1,
      lastRun: '今天 09:02',
      pushEnabled: true,
    },
  ],
});

const withReadMessages = messages => messages.map(message => message.unread ? { ...message, unread: false } : message);

export function superAgentReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE_CONTEXT':
      return { ...state, pageContext: action.context || { kind: 'none' } };
    case 'OPEN_OVERLAY':
      return { ...state, overlayOpen: true, contextClosedForOpenSession: false, unread: false, messages: withReadMessages(state.messages) };
    case 'CLOSE_OVERLAY':
      return { ...state, overlayOpen: false, sourceSheetMessageId: null, automationDraft: null };
    case 'CLEAR_UNREAD':
      return { ...state, unread: false, messages: withReadMessages(state.messages) };
    case 'CLOSE_CONTEXT':
      return { ...state, contextClosedForOpenSession: true };
    case 'SET_DRAFT':
      return { ...state, draft: action.value };
    case 'APPEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'START_PENDING':
      return { ...state, pendingMessageId: action.id };
    case 'RESOLVE_PENDING':
      return { ...state, pendingMessageId: null, messages: [...state.messages, action.message] };
    case 'STOP_PENDING':
      return { ...state, pendingMessageId: null, messages: action.message ? [...state.messages, action.message] : state.messages };
    case 'START_NEW_TOPIC': {
      const last = state.messages[state.messages.length - 1];
      if (last?.type === 'topic-start' && !last.userHasReplied) return state;
      return {
        ...state,
        automationDraft: null,
        messages: [...state.messages, {
          id: action.id,
          role: 'agent',
          type: 'topic-start',
          time: action.time,
          text: '可以开始一个新话题了。你想继续讨论什么，或者要我帮你安排什么新的任务？',
          userHasReplied: false,
        }],
      };
    }
    case 'MARK_TOPIC_REPLIED': {
      let marked = false;
      const messages = [...state.messages].reverse().map(message => {
        if (!marked && message.type === 'topic-start') {
          marked = true;
          return { ...message, userHasReplied: true };
        }
        return message;
      }).reverse();
      return { ...state, messages };
    }
    case 'OPEN_SOURCES':
      return { ...state, sourceSheetMessageId: action.messageId };
    case 'CLOSE_SOURCES':
      return { ...state, sourceSheetMessageId: null };
    case 'TOGGLE_SOURCE':
      return { ...state, expandedSourceIds: state.expandedSourceIds.includes(action.id) ? state.expandedSourceIds.filter(id => id !== action.id) : [...state.expandedSourceIds, action.id] };
    case 'UPDATE_AGENT':
      return { ...state, agent: { ...state.agent, ...action.changes, visibility: 'private', system: true } };
    case 'SET_AUTOMATION_DRAFT':
      return { ...state, automationDraft: action.draft };
    case 'UPDATE_AUTOMATION_DRAFT':
      return { ...state, automationDraft: state.automationDraft ? { ...state.automationDraft, ...action.changes } : null };
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks], automationDraft: null };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(task => task.id === action.id ? { ...task, enabled: !task.enabled } : task) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.id) };
    case 'RUN_TASK':
      return { ...state, tasks: state.tasks.map(task => task.id === action.id ? { ...task, lastRun: '刚刚' } : task) };
    default:
      return state;
  }
}

export const canDeleteAgent = agent => !agent?.system;
export const uniqueSuperAgentCount = agents => agents.filter(agent => agent.id === SUPER_AGENT_ID).length;
