# Database Design

## users
ユーザー情報を保存するテーブル

- id
- name
- email
- password_hash
- created_at
- updated_at

## teams
グループ情報を保存するテーブル

- id
- name
- created_at
- updated_at

## team_members
どのユーザーがどのチームに所属しているかを管理するテーブル

- id
- team_id
- user_id
- role
- created_at

role:
- owner
- member

## chat_messages
通常のチャットを保存するテーブル

- id
- team_id
- user_id
- content
- created_at
- updated_at

## ai_threads
AI質問のページやスレッドを保存するテーブル

- id
- team_id
- title
- status
- created_by
- created_at
- updated_at

status:
- unresolved
- pending
- resolved

## ai_messages
AI質問スレッド内の質問・回答を保存するテーブル

- id
- thread_id
- sender_type
- user_id
- content
- created_at
- updated_at

sender_type:
- user
- ai

## ai_comments
AI回答へのコメントを保存するテーブル

- id
- ai_message_id
- user_id
- content
- created_at
- updated_at

## pins
AI回答のピン止め情報を保存するテーブル

- id
- thread_id
- ai_message_id
- pinned_by
- created_at

## status_history
ステータス変更履歴を保存するテーブル

- id
- thread_id
- old_status
- new_status
- changed_by
- created_at