// src/pages/ChangeNick.js
import React, { useState } from 'react';
import { testUser } from './dummyData'; // 더미 데이터 import

const ChangeNick = () => {
  const [newNickname, setNewNickname] = useState('');
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState(testUser.nickname);  // 현재 닉네임 상태 추가

  const handleChangeNick = async (e) => {
    e.preventDefault();

    const tokenType = testUser.tokenType;
    const accessToken = testUser.accessToken;

    if (!tokenType || !accessToken) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      // 더미 데이터에서 닉네임을 실제로 변경
      testUser.nickname = newNickname;  // 더미 데이터에서 닉네임 업데이트
      setNickname(newNickname);  // UI에 변경된 닉네임 반영

      setMessage('닉네임이 성공적으로 변경되었습니다.');
    } catch (error) {
      setMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">닉네임 변경</h2>
      <form onSubmit={handleChangeNick} className="space-y-4">
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="새로운 닉네임 입력"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          닉네임 변경
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      <div className="mt-4 text-center">
        <p>현재 닉네임: {nickname}</p> {/* 변경된 닉네임 표시 */}
      </div>
    </div>
  );
};

export default ChangeNick;
