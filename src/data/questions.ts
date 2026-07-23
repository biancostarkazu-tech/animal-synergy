import { Question } from '@/types';

export const QUESTIONS: Question[] = [
  { id: 1, text: "新しい遊びや課題が始まったとき、どう行動する？", options: [{ label: "自分が真っ先に手を挙げて引っ張る！", scoreX: 8, scoreY: -2 }, { label: "みんなで楽しめそうなアイデアを提案する！", scoreX: 6, scoreY: 6 }, { label: "みんなの意見を聞いて役割を合わせる", scoreX: -6, scoreY: 6 }, { label: "まずはルールや手順をしっかり確認する", scoreX: -8, scoreY: -4 }] },
  { id: 2, text: "困っている人や悩んでいる友達がいたら？", options: [{ label: "具体的な解決策をすぐ提示する", scoreX: 6, scoreY: -6 }, { label: "「大丈夫だよ！」と元気に励ます", scoreX: 4, scoreY: 8 }, { label: "そばに寄り添って最後まで話を聞く", scoreX: -4, scoreY: 8 }, { label: "原因を一緒に冷静に分析してあげる", scoreX: -6, scoreY: -6 }] },
  { id: 3, text: "休日の過ごし方はどちらが好き？", options: [{ label: "やりたいことを決めてアクティブに動く", scoreX: 8, scoreY: -2 }, { label: "友達を誘って賑やかに過ごす", scoreX: 4, scoreY: 6 }, { label: "家族や大切な人と家でほっこり過ごす", scoreX: -4, scoreY: 6 }, { label: "自分の好きな読書や趣味に深く没頭する", scoreX: -8, scoreY: -4 }] },
  { id: 4, text: "意見がぶつかった時、どう対応する？", options: [{ label: "自分の考えを論理的にハッキリ伝える", scoreX: 8, scoreY: -6 }, { label: "場が暗くならないよう明るく折り合いをつける", scoreX: 4, scoreY: 6 }, { label: "相手の譲れない気持ちを優先する", scoreX: -6, scoreY: 8 }, { label: "事実やデータを示して正しい答えを探す", scoreX: -8, scoreY: -4 }] },
  { id: 5, text: "自分が褒められたら一番嬉しい言葉は？", options: [{ label: "「決断力があって頼もしいね！」", scoreX: 8, scoreY: -4 }, { label: "「いつもセンスが良くて最高に楽しい！」", scoreX: 6, scoreY: 6 }, { label: "「いつも優しく支えてくれて助かるよ」", scoreX: -4, scoreY: 8 }, { label: "「手抜きがなくて本当に完璧だね」", scoreX: -8, scoreY: -6 }] },
  { id: 6, text: "何か作業をする時のスタイルは？", options: [{ label: "まずはスピード重視！すぐ形にする", scoreX: 8, scoreY: -2 }, { label: "みんなで会話しながら楽しくやる", scoreX: 4, scoreY: 6 }, { label: "周囲のペースに合わせて調和を保つ", scoreX: -4, scoreY: 6 }, { label: "計画通りに細部までしっかり仕上げる", scoreX: -8, scoreY: -4 }] }
];
