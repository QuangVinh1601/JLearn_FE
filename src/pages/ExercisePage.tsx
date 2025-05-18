import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const exerciseData: Record<
  string,
  { title: string; questions: { question: string; options: string[] }[] }
> = {
  "n5-r1": {
    title:
      "次の文の＿＿＿に入れるのにもっとも適切だと思うものを一つ選んでください。",
    questions: [
      {
        question:
          "1. ＿＿＿は、プログラミング言語を使ってソフトウェアを書く人である。",
        options: ["品質担当者", "開発者", "コミュニケーター", "業務分析"],
      },
      {
        question:
          "2. 障害のレベルと内容から緊急度を判断して、責任者に＿＿＿を行う。",
        options: [
          "エスカレーション",
          "エスカレート",
          "エレベーター",
          "エスカレーター",
        ],
      },
      {
        question:
          "3. 今回、弊社独自の翻訳支援ツールをつくることはできないかと、＿＿＿まいりました。",
        options: [
          "要求が上がる",
          "手が上がる",
          "要求が上がって",
          "手が上がって",
        ],
      },
      {
        question:
          "4. ＿＿＿には一般的にプロジェクトの内容、目的、開発モデル、体制、品質プロセスなどを記載する。",
        options: [
          "プロジェクト概要",
          "開発規約",
          "コミュニケーションプラン",
          "プロジェクトのスケジュール",
        ],
      },
      {
        question: "5. 部長との間で＿＿＿が生じている。",
        options: ["認識の齟齬", "認識合わせ", "賛成", "統一"],
      },
      {
        question:
          "6. ＿＿＿とはプロジェクトなどが終わったあとで、行われた内容について反省し評価する会議である。",
        options: ["キックオフミーティング", "反省会議", "定例会", "臨時会議"],
      },
      {
        question:
          "7. プロジェクトに影響を与える認識の齟齬や伝達漏れなどを回避するため、＿＿＿を定義する必要がある。",
        options: [
          "コーディング規約",
          "コミュニケーションプラン",
          "反省会",
          "プロジェクト概要",
        ],
      },
      {
        question:
          "8. ＿＿＿は企業などの組織が活動を行うことで影響を受ける利害関係者のすべてである。",
        options: [
          "ステークホルダー",
          "パートナー",
          "エンドユーザー",
          "競争相手",
        ],
      },
      {
        question:
          "9. ＿＿＿のか引き受けないのか、なるべく早く決めたほうがいい。",
        options: ["引き渡す", "要求が上がる", "引き受ける", "改善を重ねる"],
      },
      {
        question:
          "10. 中小企業において、＿＿＿決算を実施できない企業は少なくない。",
        options: ["毎時", "至急", "即時", "月次"],
      },
      {
        question:
          "11. ＿＿＿とは、プロジェクトを始めるにあたってプロジェクトの目的や体制、スケジュールなどを確認するミーティングである。",
        options: [
          "キックオフミーティング",
          "定例会",
          "反省会議",
          "アドホック会議",
        ],
      },
      {
        question:
          "12. ベトナムは日本企業がソフトウェア開発の＿＿＿先に選択する第1の選択肢である。",
        options: ["購入", "エクスポート", "委託", "販売"],
      },
      {
        question:
          "13. ＿＿＿には、プロジェクトに参加するプロジェクトマネージャー、開発者、テスターなどのようなメンバーを含む。",
        options: [
          "納品物一覧",
          "プロジェクト一覧",
          "プロジェクト体制",
          "テスト手順書",
        ],
      },
      {
        question:
          "14. ダッシュボードは加工されたさまざまなデータをグラフィカルに表示することによって、＿＿＿な意思決定を支援する。",
        options: ["強化", "薄弱", "スピーディ", "急激"],
      },
      {
        question:
          "15. ＿＿＿は小規模案件から大型案件までプロジェクトを包括的に確認し評価する。",
        options: ["開発者", "テスター", "エンドユーザー", "プロジェクト統括"],
      },
    ],
  },
};

const ExercisePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const exercise = exerciseData[exerciseId || ""];

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Exercise not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        {exercise.title}
      </h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {exercise.questions.map((q, index) => (
          <div key={index} className="mb-6">
            <p className="font-medium text-gray-800 mb-2">{q.question}</p>
            <ul className="space-y-2">
              {q.options.map((option, idx) => (
                <li key={idx}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      className="form-radio"
                    />
                    <span>{option}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePage;
