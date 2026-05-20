/login
/register
/groups
/groups/[groupId]/chat
/groups/[groupId]/ai-threads
/groups/[groupId]/ai-threads/[threadId]



src/app/
├─ login/
│  └─ page.tsx
├─ register/
│  └─ page.tsx
├─ groups/
│  ├─ page.tsx
│  └─ [groupId]/
│     ├─ chat/
│     │  └─ page.tsx
│     └─ ai-threads/
│        ├─ page.tsx
│        └─ [threadId]/
│           └─ page.tsx