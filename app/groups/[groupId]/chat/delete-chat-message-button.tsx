"use client";

export function DeleteChatMessageButton() {
  return (
    <button
      className="text-sm text-red-600 underline"
      onClick={(event) => {
        const confirmed = window.confirm("このメッセージを削除しますか？");

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
