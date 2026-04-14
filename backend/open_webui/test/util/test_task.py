from open_webui.utils.task import sanitize_generated_chat_title


def test_sanitize_generated_chat_title_removes_emojis_and_preserves_text():
    title = "Plan sprint 🚀 updates 😊"
    assert sanitize_generated_chat_title(title) == "Plan sprint updates"


def test_sanitize_generated_chat_title_returns_empty_for_emoji_only():
    title = "🔥🧪🎉"
    assert sanitize_generated_chat_title(title) == ""


def test_sanitize_generated_chat_title_removes_zwj_variants_and_keycap_sequences():
    title = "Roadmap 👨‍👩‍👧‍👦 1️⃣ next"
    assert sanitize_generated_chat_title(title) == "Roadmap next"
