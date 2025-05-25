import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const exerciseData: Record<
  string,
  { title: string; questions: { question: string; options: string[] }[] }
> = {
  // N5
  "n5-r1": {
    title: "Bài đọc hiểu N5 - Giới thiệu bản thân",
    questions: [
      {
        question: "1. Từ nào sau đây có nghĩa là 'tên'?",
        options: ["なまえ", "ともだち", "がっこう", "せんせい"],
      },
      {
        question: "2. Câu nào đúng để giới thiệu bản thân?",
        options: [
          "わたしはリンです。",
          "あなたはリンです。",
          "わたしはがっこうです。",
          "ともだちはリンです。",
        ],
      },
    ],
  },
  "n5-r2": {
    title: "Bài đọc hiểu N5 - Gia đình",
    questions: [
      {
        question: "1. 'ちち' nghĩa là gì?",
        options: ["Bố", "Mẹ", "Anh trai", "Em gái"],
      },
      {
        question: "2. Câu nào nói về mẹ?",
        options: [
          "はははやさしいです。",
          "ちちはせんせいです。",
          "あにはがくせいです。",
          "いもうとはかわいいです。",
        ],
      },
    ],
  },
  "n5-r3": {
    title: "Bài đọc hiểu N5 - Thời gian",
    questions: [
      {
        question: "1. 'いまなんじですか' nghĩa là gì?",
        options: [
          "Bây giờ là mấy giờ?",
          "Bạn tên là gì?",
          "Bạn bao nhiêu tuổi?",
          "Bạn làm nghề gì?",
        ],
      },
      {
        question: "2. 'ごご' là buổi nào?",
        options: ["Chiều", "Sáng", "Tối", "Đêm"],
      },
    ],
  },
  "n5-r4": {
    title: "Bài đọc hiểu N5 - Địa điểm",
    questions: [
      {
        question: "1. 'がっこう' nghĩa là gì?",
        options: ["Trường học", "Nhà", "Cửa hàng", "Bệnh viện"],
      },
      {
        question: "2. 'どこにいきますか' nghĩa là gì?",
        options: ["Bạn đi đâu?", "Bạn ăn gì?", "Bạn làm gì?", "Bạn ở đâu?"],
      },
    ],
  },
  "n5-r5": {
    title: "Bài đọc hiểu N5 - Mua sắm",
    questions: [
      {
        question: "1. 'いくらですか' dùng khi nào?",
        options: ["Hỏi giá", "Hỏi tên", "Hỏi tuổi", "Hỏi địa chỉ"],
      },
      {
        question: "2. 'このほんをください' nghĩa là gì?",
        options: [
          "Cho tôi quyển sách này",
          "Tôi muốn mua cái này",
          "Tôi muốn ăn cái này",
          "Tôi muốn đi đâu",
        ],
      },
    ],
  },
  "n5-l1": {
    title: "Bài nghe hiểu N5 - Giới thiệu bản thân",
    questions: [
      {
        question: "1. Khi nghe 'わたしはミンです', người nói đang làm gì?",
        options: ["Giới thiệu tên", "Hỏi tuổi", "Chào tạm biệt", "Hỏi đường"],
      },
      {
        question: "2. 'ベトナムじんです' nghĩa là gì?",
        options: [
          "Tôi là người Việt Nam",
          "Tôi là học sinh",
          "Tôi là giáo viên",
          "Tôi là người Nhật",
        ],
      },
    ],
  },
  "n5-l2": {
    title: "Bài nghe hiểu N5 - Gia đình",
    questions: [
      {
        question: "1. 'ちち' trong đoạn nghe là ai?",
        options: ["Bố", "Mẹ", "Anh trai", "Chị gái"],
      },
      {
        question: "2. 'はははしゅふです' nghĩa là gì?",
        options: [
          "Mẹ là nội trợ",
          "Bố là bác sĩ",
          "Anh là học sinh",
          "Em là sinh viên",
        ],
      },
    ],
  },
  "n5-l3": {
    title: "Bài nghe hiểu N5 - Thời gian",
    questions: [
      {
        question: "1. 'ごぜん' là buổi nào?",
        options: ["Sáng", "Chiều", "Tối", "Đêm"],
      },
      {
        question: "2. 'いまなんじですか' dùng để hỏi gì?",
        options: ["Giờ", "Tên", "Tuổi", "Địa chỉ"],
      },
    ],
  },
  "n5-l4": {
    title: "Bài nghe hiểu N5 - Địa điểm",
    questions: [
      {
        question: "1. 'びょういん' nghĩa là gì?",
        options: ["Bệnh viện", "Trường học", "Nhà", "Cửa hàng"],
      },
      {
        question: "2. 'どこにいきますか' dùng để hỏi gì?",
        options: ["Đi đâu", "Ăn gì", "Làm gì", "Ở đâu"],
      },
    ],
  },
  "n5-l5": {
    title: "Bài nghe hiểu N5 - Mua sắm",
    questions: [
      {
        question: "1. 'これをください' nghĩa là gì?",
        options: [
          "Cho tôi cái này",
          "Tôi muốn đi",
          "Tôi muốn ăn",
          "Tôi muốn học",
        ],
      },
      {
        question: "2. 'いくらですか' dùng để hỏi gì?",
        options: ["Giá", "Tên", "Tuổi", "Địa chỉ"],
      },
    ],
  },
  // N4
  "n4-r1": {
    title: "Bài đọc hiểu N4 - Công việc",
    questions: [
      {
        question: "1. 'かいしゃいん' nghĩa là gì?",
        options: ["Nhân viên công ty", "Giáo viên", "Bác sĩ", "Sinh viên"],
      },
      {
        question: "2. 'しごと' là gì?",
        options: ["Công việc", "Trường học", "Gia đình", "Bạn bè"],
      },
    ],
  },
  "n4-r2": {
    title: "Bài đọc hiểu N4 - Du lịch",
    questions: [
      {
        question: "1. 'りょこう' nghĩa là gì?",
        options: ["Du lịch", "Công việc", "Học tập", "Mua sắm"],
      },
      {
        question: "2. 'きっぷ' là gì?",
        options: ["Vé", "Tiền", "Bản đồ", "Túi xách"],
      },
    ],
  },
  "n4-r3": {
    title: "Bài đọc hiểu N4 - Sở thích",
    questions: [
      {
        question: "1. 'しゅみ' nghĩa là gì?",
        options: ["Sở thích", "Công việc", "Bạn bè", "Gia đình"],
      },
      {
        question: "2. 'えいが' là gì?",
        options: ["Phim", "Sách", "Nhạc", "Tranh"],
      },
    ],
  },
  "n4-r4": {
    title: "Bài đọc hiểu N4 - Sức khỏe",
    questions: [
      {
        question: "1. 'けんこう' nghĩa là gì?",
        options: ["Sức khỏe", "Công việc", "Gia đình", "Bạn bè"],
      },
      {
        question: "2. 'びょうき' là gì?",
        options: ["Bệnh", "Khỏe mạnh", "Vui vẻ", "Buồn"],
      },
    ],
  },
  "n4-r5": {
    title: "Bài đọc hiểu N4 - Giao tiếp cơ bản",
    questions: [
      {
        question: "1. 'こんにちは' dùng khi nào?",
        options: [
          "Chào buổi trưa",
          "Chào buổi sáng",
          "Chào buổi tối",
          "Chúc ngủ ngon",
        ],
      },
      {
        question: "2. 'ありがとう' nghĩa là gì?",
        options: ["Cảm ơn", "Xin lỗi", "Tạm biệt", "Chào mừng"],
      },
    ],
  },
  "n4-l1": {
    title: "Bài nghe hiểu N4 - Công việc",
    questions: [
      {
        question: "1. 'しごと' trong đoạn nghe là gì?",
        options: ["Công việc", "Trường học", "Gia đình", "Bạn bè"],
      },
      {
        question: "2. 'かいしゃいん' là ai?",
        options: ["Nhân viên công ty", "Giáo viên", "Bác sĩ", "Sinh viên"],
      },
    ],
  },
  "n4-l2": {
    title: "Bài nghe hiểu N4 - Du lịch",
    questions: [
      {
        question: "1. 'りょこう' nghĩa là gì?",
        options: ["Du lịch", "Công việc", "Học tập", "Mua sắm"],
      },
      {
        question: "2. 'きっぷ' là gì?",
        options: ["Vé", "Tiền", "Bản đồ", "Túi xách"],
      },
    ],
  },
  "n4-l3": {
    title: "Bài nghe hiểu N4 - Sở thích",
    questions: [
      {
        question: "1. 'しゅみ' nghĩa là gì?",
        options: ["Sở thích", "Công việc", "Bạn bè", "Gia đình"],
      },
      {
        question: "2. 'えいが' là gì?",
        options: ["Phim", "Sách", "Nhạc", "Tranh"],
      },
    ],
  },
  "n4-l4": {
    title: "Bài nghe hiểu N4 - Sức khỏe",
    questions: [
      {
        question: "1. 'けんこう' nghĩa là gì?",
        options: ["Sức khỏe", "Công việc", "Gia đình", "Bạn bè"],
      },
      {
        question: "2. 'びょうき' là gì?",
        options: ["Bệnh", "Khỏe mạnh", "Vui vẻ", "Buồn"],
      },
    ],
  },
  "n4-l5": {
    title: "Bài nghe hiểu N4 - Giao tiếp cơ bản",
    questions: [
      {
        question: "1. 'こんにちは' dùng khi nào?",
        options: [
          "Chào buổi trưa",
          "Chào buổi sáng",
          "Chào buổi tối",
          "Chúc ngủ ngon",
        ],
      },
      {
        question: "2. 'ありがとう' nghĩa là gì?",
        options: ["Cảm ơn", "Xin lỗi", "Tạm biệt", "Chào mừng"],
      },
    ],
  },
  // N3
  "n3-r1": {
    title: "Bài đọc hiểu N3 - Tin tức",
    questions: [
      {
        question: "1. 'ニュース' nghĩa là gì?",
        options: ["Tin tức", "Báo cáo", "Thư tín", "Phỏng vấn"],
      },
      {
        question: "2. 'しんぶん' là gì?",
        options: ["Báo", "Tạp chí", "Sách", "Truyện"],
      },
    ],
  },
  "n3-r2": {
    title: "Bài đọc hiểu N3 - Thư tín",
    questions: [
      {
        question: "1. 'てがみ' nghĩa là gì?",
        options: ["Thư", "Báo", "Tin tức", "Báo cáo"],
      },
      {
        question: "2. 'そうしん' là gì?",
        options: ["Gửi thư", "Nhận thư", "Đọc thư", "Viết thư"],
      },
    ],
  },
  "n3-r3": {
    title: "Bài đọc hiểu N3 - Thảo luận",
    questions: [
      {
        question: "1. 'ディスカッション' nghĩa là gì?",
        options: ["Thảo luận", "Báo cáo", "Tin tức", "Phỏng vấn"],
      },
      {
        question: "2. 'いけん' là gì?",
        options: ["Ý kiến", "Báo cáo", "Tin tức", "Thư"],
      },
    ],
  },
  "n3-r4": {
    title: "Bài đọc hiểu N3 - Phỏng vấn",
    questions: [
      {
        question: "1. 'インタビュー' nghĩa là gì?",
        options: ["Phỏng vấn", "Thảo luận", "Tin tức", "Báo cáo"],
      },
      {
        question: "2. 'しつもん' là gì?",
        options: ["Câu hỏi", "Câu trả lời", "Ý kiến", "Báo cáo"],
      },
    ],
  },
  "n3-r5": {
    title: "Bài đọc hiểu N3 - Báo cáo",
    questions: [
      {
        question: "1. 'レポート' nghĩa là gì?",
        options: ["Báo cáo", "Tin tức", "Thư", "Phỏng vấn"],
      },
      {
        question: "2. 'まとめる' là gì?",
        options: ["Tổng hợp", "Phân tích", "Báo cáo", "Thảo luận"],
      },
    ],
  },
  "n3-l1": {
    title: "Bài nghe hiểu N3 - Tin tức",
    questions: [
      {
        question: "1. 'ニュース' trong đoạn nghe là gì?",
        options: ["Tin tức", "Báo cáo", "Thư tín", "Phỏng vấn"],
      },
      {
        question: "2. 'しんぶん' là gì?",
        options: ["Báo", "Tạp chí", "Sách", "Truyện"],
      },
    ],
  },
  "n3-l2": {
    title: "Bài nghe hiểu N3 - Thư tín",
    questions: [
      {
        question: "1. 'てがみ' nghĩa là gì?",
        options: ["Thư", "Báo", "Tin tức", "Báo cáo"],
      },
      {
        question: "2. 'そうしん' là gì?",
        options: ["Gửi thư", "Nhận thư", "Đọc thư", "Viết thư"],
      },
    ],
  },
  "n3-l3": {
    title: "Bài nghe hiểu N3 - Thảo luận",
    questions: [
      {
        question: "1. 'ディスカッション' nghĩa là gì?",
        options: ["Thảo luận", "Báo cáo", "Tin tức", "Phỏng vấn"],
      },
      {
        question: "2. 'いけん' là gì?",
        options: ["Ý kiến", "Báo cáo", "Tin tức", "Thư"],
      },
    ],
  },
  "n3-l4": {
    title: "Bài nghe hiểu N3 - Phỏng vấn",
    questions: [
      {
        question: "1. 'インタビュー' nghĩa là gì?",
        options: ["Phỏng vấn", "Thảo luận", "Tin tức", "Báo cáo"],
      },
      {
        question: "2. 'しつもん' là gì?",
        options: ["Câu hỏi", "Câu trả lời", "Ý kiến", "Báo cáo"],
      },
    ],
  },
  "n3-l5": {
    title: "Bài nghe hiểu N3 - Báo cáo",
    questions: [
      {
        question: "1. 'レポート' nghĩa là gì?",
        options: ["Báo cáo", "Tin tức", "Thư", "Phỏng vấn"],
      },
      {
        question: "2. 'まとめる' là gì?",
        options: ["Tổng hợp", "Phân tích", "Báo cáo", "Thảo luận"],
      },
    ],
  },
  // N2
  "n2-r1": {
    title: "Bài đọc hiểu N2 - Bài báo chuyên sâu",
    questions: [
      {
        question: "1. 'ろんぶん' nghĩa là gì?",
        options: ["Luận văn", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'けんきゅう' là gì?",
        options: ["Nghiên cứu", "Báo cáo", "Thảo luận", "Phỏng vấn"],
      },
    ],
  },
  "n2-r2": {
    title: "Bài đọc hiểu N2 - Hội nghị",
    questions: [
      {
        question: "1. 'かいぎ' nghĩa là gì?",
        options: ["Hội nghị", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'さんか' là gì?",
        options: ["Tham gia", "Báo cáo", "Thảo luận", "Phỏng vấn"],
      },
    ],
  },
  "n2-r3": {
    title: "Bài đọc hiểu N2 - Phân tích",
    questions: [
      {
        question: "1. 'ぶんせき' nghĩa là gì?",
        options: ["Phân tích", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'けっか' là gì?",
        options: ["Kết quả", "Báo cáo", "Thảo luận", "Phỏng vấn"],
      },
    ],
  },
  "n2-r4": {
    title: "Bài đọc hiểu N2 - Tranh luận",
    questions: [
      {
        question: "1. 'ディベート' nghĩa là gì?",
        options: ["Tranh luận", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'いけん' là gì?",
        options: ["Ý kiến", "Báo cáo", "Tin tức", "Thư"],
      },
    ],
  },
  "n2-r5": {
    title: "Bài đọc hiểu N2 - Tổng hợp",
    questions: [
      {
        question: "1. 'そうごう' nghĩa là gì?",
        options: ["Tổng hợp", "Phân tích", "Báo cáo", "Thảo luận"],
      },
      {
        question: "2. 'まとめる' là gì?",
        options: ["Tổng hợp", "Phân tích", "Báo cáo", "Thảo luận"],
      },
    ],
  },
  "n2-l1": {
    title: "Bài nghe hiểu N2 - Bài báo chuyên sâu",
    questions: [
      {
        question: "1. 'ろんぶん' trong đoạn nghe là gì?",
        options: ["Luận văn", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'けんきゅう' là gì?",
        options: ["Nghiên cứu", "Báo cáo", "Thảo luận", "Phỏng vấn"],
      },
    ],
  },
  "n2-l2": {
    title: "Bài nghe hiểu N2 - Hội nghị",
    questions: [
      {
        question: "1. 'かいぎ' nghĩa là gì?",
        options: ["Hội nghị", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'さんか' là gì?",
        options: ["Tham gia", "Báo cáo", "Thảo luận", "Phỏng vấn"],
      },
    ],
  },
  "n2-l3": {
    title: "Bài nghe hiểu N2 - Phân tích",
    questions: [
      {
        question: "1. 'ぶんせき' nghĩa là gì?",
        options: ["Phân tích", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'けっか' là gì?",
        options: ["Kết quả", "Báo cáo", "Thảo luận", "Phỏng vấn"],
      },
    ],
  },
  "n2-l4": {
    title: "Bài nghe hiểu N2 - Tranh luận",
    questions: [
      {
        question: "1. 'ディベート' nghĩa là gì?",
        options: ["Tranh luận", "Báo cáo", "Tin tức", "Thư"],
      },
      {
        question: "2. 'いけん' là gì?",
        options: ["Ý kiến", "Báo cáo", "Tin tức", "Thư"],
      },
    ],
  },
  "n2-l5": {
    title: "Bài nghe hiểu N2 - Tổng hợp",
    questions: [
      {
        question: "1. 'そうごう' nghĩa là gì?",
        options: ["Tổng hợp", "Phân tích", "Báo cáo", "Thảo luận"],
      },
      {
        question: "2. 'まとめる' là gì?",
        options: ["Tổng hợp", "Phân tích", "Báo cáo", "Thảo luận"],
      },
    ],
  },
  // SƠ CẤP
  "sc-r1": {
    title: "Bài đọc Bảng chữ cái Hiragana",
    questions: [
      {
        question: "1. 'あ' là ký tự đầu tiên của bảng chữ cái nào?",
        options: ["Hiragana", "Katakana", "Kanji", "Romaji"],
      },
      {
        question: "2. 'い' phát âm như thế nào?",
        options: ["i", "a", "u", "e"],
      },
    ],
  },
  "sc-r2": {
    title: "Bài đọc Bảng chữ cái Katakana",
    questions: [
      {
        question: "1. 'ア' là ký tự đầu tiên của bảng chữ cái nào?",
        options: ["Katakana", "Hiragana", "Kanji", "Romaji"],
      },
      {
        question: "2. 'イ' phát âm như thế nào?",
        options: ["i", "a", "u", "e"],
      },
    ],
  },
  "sc-l1": {
    title: "Nghe và nhận biết âm cơ bản",
    questions: [
      {
        question: "1. Âm 'a' trong tiếng Nhật là?",
        options: ["あ", "い", "う", "え"],
      },
      {
        question: "2. Âm 'ka' trong tiếng Nhật là?",
        options: ["か", "き", "く", "け"],
      },
    ],
  },
  "sc-l2": {
    title: "Nghe và lặp lại từ đơn giản",
    questions: [
      {
        question: "1. Từ 'ねこ' nghĩa là gì?",
        options: ["Con mèo", "Con chó", "Con cá", "Con chim"],
      },
      {
        question: "2. Từ 'いぬ' nghĩa là gì?",
        options: ["Con chó", "Con mèo", "Con cá", "Con chim"],
      },
    ],
  },
};

const answerData: Record<string, number[]> = {
  // Đáp án đúng là index của option trong mảng options (bắt đầu từ 0)
  "n5-r1": [0, 0],
  "n5-r2": [0, 0],
  "n5-r3": [0, 0],
  "n5-r4": [0, 0],
  "n5-r5": [0, 0],
  "n5-l1": [0, 0],
  "n5-l2": [0, 0],
  "n5-l3": [0, 0],
  "n5-l4": [0, 0],
  "n5-l5": [0, 0],
  "n4-r1": [0, 0],
  "n4-r2": [0, 0],
  "n4-r3": [0, 0],
  "n4-r4": [0, 0],
  "n4-r5": [0, 0],
  "n4-l1": [0, 0],
  "n4-l2": [0, 0],
  "n4-l3": [0, 0],
  "n4-l4": [0, 0],
  "n4-l5": [0, 0],
  "n3-r1": [0, 0],
  "n3-r2": [0, 0],
  "n3-r3": [0, 0],
  "n3-r4": [0, 0],
  "n3-r5": [0, 0],
  "n3-l1": [0, 0],
  "n3-l2": [0, 0],
  "n3-l3": [0, 0],
  "n3-l4": [0, 0],
  "n3-l5": [0, 0],
  "n2-r1": [0, 0],
  "n2-r2": [0, 0],
  "n2-r3": [0, 0],
  "n2-r4": [0, 0],
  "n2-r5": [0, 0],
  "n2-l1": [0, 0],
  "n2-l2": [0, 0],
  "n2-l3": [0, 0],
  "n2-l4": [0, 0],
  "n2-l5": [0, 0],
  "sc-r1": [0, 0],
  "sc-r2": [0, 0],
  "sc-l1": [0, 0],
  "sc-l2": [0, 0],
};

const ExercisePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const exercise = exerciseData[exerciseId || ""];
  const answers = answerData[exerciseId || ""];

  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    exercise ? Array(exercise.questions.length).fill(null) : [],
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

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

  const handleOptionChange = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = oIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (submitted) return;
    let correct = 0;
    if (answers && answers.length === userAnswers.length) {
      for (let i = 0; i < answers.length; ++i) {
        if (userAnswers[i] === answers[i]) correct++;
      }
    }
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers(Array(exercise.questions.length).fill(null));
    setSubmitted(false);
    setScore(null);
  };

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
                      checked={userAnswers[index] === idx}
                      disabled={submitted}
                      onChange={() => handleOptionChange(index, idx)}
                    />
                    <span
                      className={
                        submitted
                          ? idx === answers?.[index]
                            ? "font-semibold text-green-600"
                            : userAnswers[index] === idx
                              ? "text-red-500"
                              : ""
                          : ""
                      }
                    >
                      {option}
                      {submitted && idx === answers?.[index] && (
                        <span className="ml-2 text-green-600 font-bold">
                          (Đáp án đúng)
                        </span>
                      )}
                      {submitted &&
                        userAnswers[index] === idx &&
                        userAnswers[index] !== answers?.[index] && (
                          <span className="ml-2 text-red-500">(Sai)</span>
                        )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            disabled={userAnswers.some((a) => a === null)}
          >
            Nộp bài
          </button>
        ) : (
          <div className="mt-6 text-center">
            <div className="text-xl font-bold text-green-700 mb-2">
              Kết quả: {score} / {exercise.questions.length} câu đúng
            </div>
            <button
              onClick={handleReset}
              className="mt-2 px-6 py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500 transition"
            >
              Làm lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePage;
