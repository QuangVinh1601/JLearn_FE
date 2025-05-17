import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

type DepositModalProps = {
  visible: boolean;
  onClose: () => void;
};

const DepositModal = ({ visible, onClose }: DepositModalProps) => {
  const [amount, setAmount] = useState(0);
  const { deposit } = useContext(UserContext);

  if (!visible) return null;

  const handleDeposit = () => {
    deposit(amount);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Nạp tiền</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Nhập số tiền"
      />
      <button onClick={handleDeposit}>Xác nhận</button>
      <button onClick={onClose}>Hủy</button>
    </div>
  );
};

export default DepositModal;
