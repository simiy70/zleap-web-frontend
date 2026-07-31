# Design QA — 项目信息架构 v4

## Evidence

- Source visual truth: `/var/folders/cx/wwlc2r057m18t68yq_t948bh0000gn/T/codex-clipboard-654e0532-d623-4d35-ab4b-5b569878a4da.png`
- Source pixels: `1811 × 1136`
- Implementation URL: `http://localhost:4174/`
- Implementation screenshots:
  - `docs/design-qa/project-sessions-ia-v4.png`
  - `docs/design-qa/project-overview-ia-v4.png`
- Implementation capture: application viewport approximately `869 × 805` CSS px, device pixel ratio `1`
- State:
  - 项目详情默认「会话」，项目总群选中
  - 「项目概况」展示项目配置、协作者、权限、动态与产出

The reference is an information-architecture diagram rather than a pixel-level UI mock. Comparison therefore treats its hierarchy and labels as the visual truth, while typography, color and component styling intentionally inherit the existing Zleap design language.

## Full-view comparison evidence

- The source’s three project-detail branches map one-to-one to the top navigation: 「会话 / 自动化任务 / 项目概况」.
- 「会话」is the default page and visibly separates 「项目群聊」from 「独立对话」.
- 「项目概况」contains every source branch: `project.md`, 技能, 项目资料/信息源, 工具, Agent, 成员, 权限, 项目动态 and 产出.
- Project list and single-field project creation remain outside the project-detail tabs, matching the source hierarchy.

## Focused region comparison evidence

- Top navigation: exactly three same-level tabs; no former 「协作 / 工作 / 资料」entries remain.
- Session sidebar: group conversations and independent Agent conversations are distinct sections and both are interactive.
- Project configuration cards: source configuration branches are preserved as real content rather than explanatory copy.
- A separate close crop was unnecessary because all architecture labels and controls are legible at the captured viewport.

## Required fidelity surfaces

- Fonts and typography: existing Zleap system typography, weights and small-label hierarchy are consistent across all three tabs. No diagram typography was copied because the reference does not prescribe production UI type.
- Spacing and layout rhythm: top navigation follows the information-source module pattern; session list, content area and cards maintain the existing 16–24 px spacing rhythm and rounded-card system.
- Colors and visual tokens: existing orange active state, neutral surfaces, cyan user messages and semantic green/gray automation states remain consistent.
- Image quality and asset fidelity: the reference contains no production image assets. Existing Remix Icon glyphs and circular Agent avatars are retained; no new decorative assets were required.
- Copy and content: all requested information-architecture labels are present. Persistent module-explanation paragraphs were not introduced.

## Findings

No actionable P0, P1 or P2 mismatch remains.

- [P3] At narrower desktop widths the optional session-member rail is hidden.
  - Location: 会话页右侧辅助栏.
  - Evidence: the main hierarchy and session interaction remain available; only secondary participant/resource context collapses.
  - Impact: none on the source-defined primary flow.
  - Follow-up: retain as intentional responsive behavior unless a permanently visible participant rail is later required.

## Interaction verification

- Opened a project from the project list; defaulted to 「会话」.
- Switched from a project group chat to an independent Agent conversation.
- Verified the independent-conversation composer and project-scoped participant identity.
- Opened 「自动化任务」 and toggled a paused task to enabled.
- Opened 「项目概况」 and verified all source branches.
- Browser console warnings/errors checked: none.
- Production build: passed.

## Comparison history

- Initial implementation pass:
  - Replaced the former 「协作 / 工作 / 资料」 hierarchy.
  - Added project group chats plus independent conversations.
  - Added project-scoped automation cards and enable state.
  - Moved project configuration, collaborators, permissions, dynamics and outputs into 「项目概况」.
- Post-fix visual evidence:
  - `project-sessions-ia-v4.png`
  - `project-overview-ia-v4.png`
- No P0/P1/P2 visual issue was found after the first browser-rendered comparison, so no additional blocking iteration was required.

## Implementation checklist

- [x] 项目列表与单字段创建流程
- [x] 会话为默认主页
- [x] 项目群聊与多个独立对话
- [x] 项目自动化任务创建、筛选和启停
- [x] project.md、技能、资料/信息源和工具
- [x] Agent、成员、权限、项目动态和产出
- [x] 浏览器交互、控制台与生产构建

final result: passed
