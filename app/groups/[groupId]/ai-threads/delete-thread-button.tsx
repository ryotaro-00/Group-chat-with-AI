"use client";

export function DeleteThreadButton() {
  return (
    <button
      className="text-red-600 underline"
      onClick={(event) => {
        const confirmed = window.confirm(
          "このAI質問スレッドを削除します。関連するメッセージも削除されます。よろしいですか？",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      削除
    </button>
  );
}
