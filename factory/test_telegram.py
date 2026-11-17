import os
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(__file__))
import telegram


class ParseChatIdsTest(unittest.TestCase):
    def test_empty(self) -> None:
        self.assertEqual(telegram.parse_chat_ids(""), set())
        self.assertEqual(telegram.parse_chat_ids("  ,  "), set())

    def test_multiple(self) -> None:
        self.assertEqual(
            telegram.parse_chat_ids("1, 2 ; -100"),
            {1, 2, -100},
        )

    def test_invalid_entries_are_ignored(self) -> None:
        self.assertEqual(telegram.parse_chat_ids("abc, 3"), {3})


class AllowedChatIdsTest(unittest.TestCase):
    def test_explicit_list_wins(self) -> None:
        with patch.dict(
            os.environ,
            {
                "TELEGRAM_ALLOWED_CHAT_IDS": "4,5",
                "TELEGRAM_CHAT_ID": "9",
            },
            clear=False,
        ):
            self.assertEqual(telegram.allowed_chat_ids(), {4, 5})

    def test_falls_back_to_report_chat(self) -> None:
        with patch.dict(
            os.environ,
            {
                "TELEGRAM_ALLOWED_CHAT_IDS": "",
                "TELEGRAM_CHAT_ID": "9",
            },
            clear=False,
        ):
            self.assertEqual(telegram.allowed_chat_ids(), {9})

    def test_no_allowlist_is_empty(self) -> None:
        with patch.dict(
            os.environ,
            {
                "TELEGRAM_ALLOWED_CHAT_IDS": "",
                "TELEGRAM_CHAT_ID": "",
            },
            clear=False,
        ):
            self.assertEqual(telegram.allowed_chat_ids(), set())


class AuthorizationTest(unittest.TestCase):
    def test_private_allowed(self) -> None:
        message = {"chat": {"id": 42, "type": "private"}}
        self.assertTrue(telegram.is_authorized(message, {42}))

    def test_private_not_allowed(self) -> None:
        message = {"chat": {"id": 42, "type": "private"}}
        self.assertFalse(telegram.is_authorized(message, {7}))

    def test_group_is_rejected_even_if_id_is_allowed(self) -> None:
        message = {"chat": {"id": -100, "type": "group"}}
        self.assertFalse(telegram.is_authorized(message, {-100}))

    def test_malformed_chat_is_rejected(self) -> None:
        self.assertFalse(telegram.is_authorized({}, {1}))
        self.assertFalse(
            telegram.is_authorized({"chat": {"id": "1", "type": "private"}}, {1})
        )


if __name__ == "__main__":
    unittest.main()
