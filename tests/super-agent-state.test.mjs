import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canDeleteAgent,
  createInitialSuperAgentState,
  SUPER_AGENT_ID,
  superAgentReducer,
  uniqueSuperAgentCount,
} from '../src/features/super-agent/superAgentState.js';

test('opening the floating conversation clears unread and restores context recognition', () => {
  let state = createInitialSuperAgentState();
  state = superAgentReducer(state, { type: 'CLOSE_CONTEXT' });
  assert.equal(state.contextClosedForOpenSession, true);
  state = superAgentReducer(state, { type: 'OPEN_OVERLAY' });
  assert.equal(state.contextClosedForOpenSession, false);
  assert.equal(state.unread, false);
  assert.ok(state.messages.every(message => !message.unread));
});

test('page context switches without rewriting message context snapshots', () => {
  let state = createInitialSuperAgentState();
  const message = { id: 'm1', role: 'user', text: '总结', context: { kind: 'entity', entityId: 'old', title: '旧报告' } };
  state = superAgentReducer(state, { type: 'APPEND_MESSAGE', message });
  state = superAgentReducer(state, { type: 'SET_PAGE_CONTEXT', context: { kind: 'entity', entityId: 'new', title: '新报告' } });
  assert.equal(state.pageContext.entityId, 'new');
  assert.equal(state.messages.at(-1).context.entityId, 'old');
});

test('starting a new topic is idempotent until the user replies', () => {
  let state = createInitialSuperAgentState();
  state = superAgentReducer(state, { type: 'START_NEW_TOPIC', id: 'topic-1', time: '10:00' });
  const count = state.messages.length;
  state = superAgentReducer(state, { type: 'START_NEW_TOPIC', id: 'topic-2', time: '10:01' });
  assert.equal(state.messages.length, count);
  state = superAgentReducer(state, { type: 'MARK_TOPIC_REPLIED' });
  state = superAgentReducer(state, { type: 'START_NEW_TOPIC', id: 'topic-3', time: '10:02' });
  assert.equal(state.messages.length, count + 1);
});

test('automation tasks can be added, toggled and deleted without recreating the default task', () => {
  let state = createInitialSuperAgentState();
  const task = { id: 'task-new', name: '竞品追踪', enabled: true, createdAt: 2 };
  state = superAgentReducer(state, { type: 'ADD_TASK', task });
  assert.equal(state.tasks[0].id, 'task-new');
  state = superAgentReducer(state, { type: 'TOGGLE_TASK', id: 'task-new' });
  assert.equal(state.tasks[0].enabled, false);
  state = superAgentReducer(state, { type: 'DELETE_TASK', id: 'daily-summary' });
  assert.equal(state.tasks.some(item => item.id === 'daily-summary'), false);
});

test('the system Super Agent remains unique and cannot be deleted', () => {
  const state = createInitialSuperAgentState();
  assert.equal(state.agent.id, SUPER_AGENT_ID);
  assert.equal(canDeleteAgent(state.agent), false);
  assert.equal(uniqueSuperAgentCount([state.agent, { id: 'research' }]), 1);
});
