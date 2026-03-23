import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/ember/AppShell";
import { ChatView } from "./components/ember/ChatView";
import { AuthPage } from "./components/ember/pages/AuthPage";
import { ErrorPage } from "./components/ember/pages/ErrorPage";
import { WorkspacePage } from "./components/ember/pages/WorkspacePage";
import { AdminPage } from "./components/ember/pages/AdminPage";
import { NotesPage } from "./components/ember/pages/NotesPage";
import { PlaygroundPage } from "./components/ember/pages/PlaygroundPage";
import { SharedChatPage } from "./components/ember/pages/SharedChatPage";

function HomeChatView() {
  return ChatView({ chatId: undefined });
}

function SpecificChatView() {
  return ChatView({ chatId: "demo" });
}

function ChannelView() {
  return ChatView({ chatId: "channel" });
}

export const router = createBrowserRouter([
  // Standalone pages (no shell)
  { path: "/auth", Component: AuthPage },
  { path: "/error", Component: ErrorPage },
  { path: "/s/:id", Component: SharedChatPage },
  { path: "/watch", Component: SharedChatPage },

  // App shell routes
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: HomeChatView },
      { path: "c/:id", Component: SpecificChatView },
      { path: "channels/:id", Component: ChannelView },
      { path: "notes", Component: NotesPage },
      { path: "notes/new", Component: NotesPage },
      { path: "notes/:id", Component: NotesPage },
      { path: "playground", Component: PlaygroundPage },
      { path: "playground/completions", Component: PlaygroundPage },
      { path: "playground/images", Component: PlaygroundPage },
      { path: "workspace", Component: WorkspacePage },
      { path: "workspace/*", Component: WorkspacePage },
      { path: "admin", Component: AdminPage },
      { path: "admin/*", Component: AdminPage },
    ],
  },
]);
