import {
  Users,
  MessageSquare,
  UserPlus,
  Building2,
  AppWindow,
  CalendarClock,
  HandshakeIcon,
  FileCheck,
} from "lucide-react";

export const METRICS = [
  { key: "出勤", label: "出勤数", icon: Users },
  { key: "対応", label: "対応数", icon: MessageSquare },
  { key: "イン", label: "イン数", icon: UserPlus },
  { key: "ドア", label: "ドア数", icon: Building2 },
  { key: "アプ", label: "アプ数", icon: AppWindow },
  { key: "アポ", label: "アポ数", icon: CalendarClock },
  { key: "商談", label: "商談数", icon: HandshakeIcon },
  { key: "契約", label: "契約数", icon: FileCheck },
];
