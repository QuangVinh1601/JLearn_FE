// src/data/speakingTopics.ts (or define within SpeakingTopics.tsx)
export interface SpeakingTopic {
  id: string;
  name: string;
  description: string;
  questions: string[];
}

export const speakingTopicsData: SpeakingTopic[] = [
  {
    id: "introduction",
    name: "自己紹介 (Self-Introduction)",
    description: "Practice introducing yourself, your job, hobbies, etc.",
    questions: [
      "あなたの名前は何ですか？", // What is your name?
      "お仕事は何ですか？", // What is your job?
      "趣味は何ですか？", // What are your hobbies?
      "どこから来ましたか？", // Where are you from?
    ],
  },
  {
    id: "daily-life",
    name: "日常生活 (Daily Life)",
    description: "Talk about your daily routine and common activities.",
    questions: [
      "毎日何時に起きますか？", // What time do you wake up every day?
      "朝ごはんによく何を食べますか？", // What do you often eat for breakfast?
      "週末は何をしますか？", // What do you do on weekends?
      "好きな食べ物は何ですか？", // What is your favorite food?
    ],
  },
  {
    id: "feelings",
    name: "気持ち (Feelings)",
    description: "Express how you feel in different situations.",
    questions: [
      "今日の調子はどうですか？", // How are you feeling today?
      "最近、何か嬉しいことがありましたか？", // Has anything happy happened recently?
      "疲れている時、どうしますか？", // What do you do when you are tired?
    ],
  },
  // Add more topics as needed
];
