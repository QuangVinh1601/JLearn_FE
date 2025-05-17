import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

type CourseProps = {
  course: {
    title: string;
    description: string;
    price: number;
    // ...các trường khác nếu có...
  };
};

const Course = ({ course }: CourseProps) => {
  const { purchaseCourse, getBalance } = useContext(UserContext);

  const handleBuy = () => {
    const success = purchaseCourse(course.price);
    const currentBalance = getBalance();
    if (success) {
      alert("Mua khóa học thành công!");
    } else {
      alert(
        `Số dư không đủ, vui lòng nạp thêm tiền. Số dư hiện tại: ${currentBalance} VND`,
      );
    }
  };

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Giá: {course.price} VND</p>
      <button onClick={handleBuy}>Mua khóa học</button>
    </div>
  );
};

export default Course;
